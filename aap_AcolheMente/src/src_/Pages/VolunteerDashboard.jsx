import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Calendar, Check, X, Clock, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const availabilityLabels = { online: "Online", busy: "Ocupado", offline: "Offline" };
const availabilityColors = { online: "bg-emerald-500", busy: "bg-amber-500", offline: "bg-slate-400" };

export default function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [volStatus, setVolStatus] = useState(null);
  const [waitingStudents, setWaitingStudents] = useState([]);
  const [activeConvs, setActiveConvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const statuses = await base44.entities.VolunteerStatus.filter({ user_id: u.id });
        if (statuses.length > 0) setVolStatus(statuses[0]);
        const waiting = await base44.entities.ChatConversation.filter({ status: "waiting", type: "volunteer" });
        setWaitingStudents(waiting);
        const active = await base44.entities.ChatConversation.filter({ volunteer_id: u.id, status: "active" });
        setActiveConvs(active);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const updateAvailability = async (value) => {
    if (!volStatus) return;
    try {
      await base44.entities.VolunteerStatus.update(volStatus.id, { availability: value });
      setVolStatus({ ...volStatus, availability: value });
      toast({ title: `Status atualizado: ${availabilityLabels[value]}` });
    } catch (e) {}
  };

  const acceptStudent = async (conv) => {
    try {
      await base44.entities.ChatConversation.update(conv.id, {
        volunteer_id: user.id,
        volunteer_name: user.full_name || user.email,
        status: "active",
      });
      setWaitingStudents(prev => prev.filter(c => c.id !== conv.id));
      setActiveConvs(prev => [...prev, { ...conv, volunteer_id: user.id, status: "active" }]);
      toast({ title: "Atendimento aceito! 💙" });
    } catch (e) {}
  };

  const declineStudent = async (conv) => {
    toast({ title: "Solicitação recusada" });
    setWaitingStudents(prev => prev.filter(c => c.id !== conv.id));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Painel do Voluntário</h1>
          <p className="text-slate-500 mt-1">Gerencie seus atendimentos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${availabilityColors[volStatus?.availability || "offline"]}`} />
          <Select value={volStatus?.availability || "offline"} onValueChange={updateAvailability}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="online">🟢 Online</SelectItem>
              <SelectItem value="busy">🟡 Ocupado</SelectItem>
              <SelectItem value="offline">⚫ Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <Users className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{waitingStudents.length}</p>
          <p className="text-sm text-slate-500">Aguardando</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <MessageCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{activeConvs.length}</p>
          <p className="text-sm text-slate-500">Ativos</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <Check className="w-6 h-6 text-sky-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{volStatus?.total_sessions || 0}</p>
          <p className="text-sm text-slate-500">Total realizados</p>
        </div>
      </div>

      {/* Waiting students */}
      <div>
        <h2 className="font-heading font-semibold text-slate-800 mb-3">Estudantes aguardando acolhimento</h2>
        {waitingStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Nenhum estudante aguardando no momento</p>
          </div>
        ) : (
          <div className="space-y-2">
            {waitingStudents.map(conv => (
              <div key={conv.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800">{conv.student_name}</p>
                  <p className="text-xs text-slate-400">Aguardando acolhimento</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => acceptStudent(conv)} className="rounded-lg bg-emerald-500 hover:bg-emerald-600">
                    <Check className="w-4 h-4 mr-1" /> Aceitar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => declineStudent(conv)} className="rounded-lg text-red-500 border-red-200 hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active conversations */}
      <div>
        <h2 className="font-heading font-semibold text-slate-800 mb-3">Atendimentos ativos</h2>
        {activeConvs.length === 0 ? (
          <p className="text-sm text-slate-400 bg-white rounded-xl border border-slate-100 p-6 text-center">Nenhum atendimento ativo</p>
        ) : (
          <div className="space-y-2">
            {activeConvs.map(conv => (
              <Link key={conv.id} to="/volunteer/chat" className="block bg-white rounded-xl border border-slate-100 p-4 hover:border-sky-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{conv.student_name}</p>
                    {conv.last_message && <p className="text-xs text-slate-400 truncate">{conv.last_message}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
