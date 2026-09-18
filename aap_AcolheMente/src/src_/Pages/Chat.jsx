import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, MessageCircle, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const convs = await base44.entities.ChatConversation.list("-updated_date", 50);
      setConversations(convs);
    } catch (e) {}
    setLoading(false);
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const msgs = await base44.entities.ChatMessage.filter({ conversation_id: conv.id }, "created_date", 100);
      setMessages(msgs);
    } catch (e) {}
  };

  const startNew = async () => {
    if (!user) return;
    try {
      const conv = await base44.entities.ChatConversation.create({
        student_id: user.id,
        student_name: user.full_name || user.email,
        type: "volunteer",
        status: "waiting",
      });
      setConversations([conv, ...conversations]);
      setActiveConv(conv);
      setMessages([]);
    } catch (e) {}
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv || !user) return;
    setSending(true);
    try {
      const msg = await base44.entities.ChatMessage.create({
        conversation_id: activeConv.id,
        sender_id: user.id,
        sender_name: user.full_name || user.email,
        sender_role: user.role || "student",
        content: newMsg.trim(),
      });
      setMessages([...messages, msg]);
      await base44.entities.ChatConversation.update(activeConv.id, {
        last_message: newMsg.trim(),
        last_message_at: new Date().toISOString(),
      });
      setNewMsg("");
    } catch (e) {}
    setSending(false);
  };

  // Polling for new messages
  useEffect(() => {
    if (!activeConv) return;
    const interval = setInterval(async () => {
      try {
        const msgs = await base44.entities.ChatMessage.filter({ conversation_id: activeConv.id }, "created_date", 100);
        setMessages(msgs);
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeConv?.id]);

  const statusLabels = { waiting: "Aguardando", active: "Ativo", closed: "Encerrado", referred: "Encaminhado" };
  const statusColors = { waiting: "bg-amber-100 text-amber-700", active: "bg-emerald-100 text-emerald-700", closed: "bg-slate-100 text-slate-700", referred: "bg-sky-100 text-sky-700" };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;
  }

  if (activeConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat header */}
        <div className="bg-white rounded-t-2xl border border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveConv(null)} className="p-1 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-slate-800">
              {activeConv.volunteer_name || "Aguardando voluntário"}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[activeConv.status]}`}>
              {statusLabels[activeConv.status]}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-slate-50 border-x border-slate-100 p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Nenhuma mensagem ainda. Comece a conversa!</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe ? "bg-sky-500 text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
                }`}>
                  {!isMe && <p className="text-xs font-medium text-sky-600 mb-0.5">{msg.sender_name}</p>}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-sky-200" : "text-slate-400"}`}>
                    {moment(msg.created_date).format("HH:mm")}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl border border-slate-100 p-3 flex gap-2">
          <Input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="rounded-xl"
          />
          <Button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="rounded-xl bg-sky-500 hover:bg-sky-600 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Chat de Apoio</h1>
          <p className="text-slate-500 mt-1">Converse com um voluntário ou psicólogo</p>
        </div>
        <Button onClick={startNew} className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500">
          <MessageCircle className="w-4 h-4 mr-2" /> Nova conversa
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-slate-600 mb-2">Nenhuma conversa ainda</h3>
          <p className="text-slate-400 text-sm mb-4">Inicie uma conversa para receber acolhimento</p>
          <Button onClick={startNew} className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500">
            Iniciar conversa
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className="w-full bg-white rounded-xl border border-slate-100 p-4 text-left hover:border-sky-200 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-slate-800 truncate">
                    {conv.volunteer_name || "Aguardando voluntário"}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[conv.status]}`}>
                    {statusLabels[conv.status]}
                  </span>
                </div>
                {conv.last_message && <p className="text-xs text-slate-400 truncate mt-0.5">{conv.last_message}</p>}
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {conv.last_message_at ? moment(conv.last_message_at).format("DD/MM HH:mm") : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
