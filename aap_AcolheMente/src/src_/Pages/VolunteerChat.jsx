import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, ArrowLeft, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function VolunteerChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const convs = await base44.entities.ChatConversation.filter({ volunteer_id: u.id }, "-updated_date", 50);
      setConversations(convs);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    const msgs = await base44.entities.ChatMessage.filter({ conversation_id: conv.id }, "created_date", 100);
    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv || !user) return;
    setSending(true);
    try {
      const msg = await base44.entities.ChatMessage.create({
        conversation_id: activeConv.id,
        sender_id: user.id,
        sender_name: user.full_name || user.email,
        sender_role: "volunteer",
        content: newMsg.trim(),
      });
      setMessages(prev => [...prev, msg]);
      await base44.entities.ChatConversation.update(activeConv.id, { last_message: newMsg.trim(), last_message_at: new Date().toISOString() });
      setNewMsg("");
    } catch (e) {}
    setSending(false);
  };

  const referToPsychologist = async () => {
    if (!activeConv) return;
    await base44.entities.ChatConversation.update(activeConv.id, { status: "referred" });
    setActiveConv({ ...activeConv, status: "referred" });
    toast({ title: "Estudante encaminhado para psicólogo" });
  };

  const closeConversation = async () => {
    if (!activeConv) return;
    await base44.entities.ChatConversation.update(activeConv.id, { status: "closed" });
    setActiveConv({ ...activeConv, status: "closed" });
    toast({ title: "Atendimento encerrado" });
  };

  useEffect(() => {
    if (!activeConv) return;
    const interval = setInterval(async () => {
      const msgs = await base44.entities.ChatMessage.filter({ conversation_id: activeConv.id }, "created_date", 100);
      setMessages(msgs);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeConv?.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  if (activeConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="bg-white rounded-t-2xl border border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveConv(null)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex-1">
            <p className="font-medium text-sm text-slate-800">{activeConv.student_name}</p>
          </div>
          {activeConv.status === "active" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={referToPsychologist} className="rounded-lg text-amber-600 border-amber-200 text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" /> Encaminhar
              </Button>
              <Button size="sm" variant="outline" onClick={closeConversation} className="rounded-lg text-xs">
                Encerrar
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50 border-x border-slate-100 p-4 space-y-3">
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe ? "bg-emerald-500 text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
                }`}>
                  {!isMe && <p className="text-xs font-medium text-sky-600 mb-0.5">{msg.sender_name}</p>}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-emerald-200" : "text-slate-400"}`}>{moment(msg.created_date).format("HH:mm")}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white rounded-b-2xl border border-slate-100 p-3 flex gap-2">
          <Input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Digite sua mensagem..." className="rounded-xl" />
          <Button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Chat — Voluntário</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">Nenhuma conversa ativa</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => openConversation(conv)} className="w-full bg-white rounded-xl border border-slate-100 p-4 text-left hover:border-emerald-200 transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">{conv.student_name}</p>
                {conv.last_message && <p className="text-xs text-slate-400 truncate">{conv.last_message}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
