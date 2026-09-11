import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, User } from "lucide-react";
import moment from "moment";

export default function VolunteerSchedule() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const convs = await base44.entities.ChatConversation.filter({ volunteer_id: u.id }, "-updated_date", 50);
      setConversations(convs);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const active = conversations.filter(c => c.status === "active");
  const history = conversations.filter(c => c.status === "closed" || c.status === "referred");

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Agenda & Histórico</h1>

      <div>
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Atendimentos ativos ({active.length})</h2>
        {active.length === 0 ? (
          <p className="text-sm text-slate-400 bg-white rounded-xl border p-6 text-center">Nenhum atendimento ativo</p>
        ) : (
          <div className="space-y-2">
            {active.map(c => (
              <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><User className="w-5 h-5 text-emerald-600" /></div>
                <div className="flex-1"><p className="font-medium text-sm">{c.student_name}</p><p className="text-xs text-slate-400">Ativo</p></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Histórico ({history.length})</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 bg-white rounded-xl border p-6 text-center">Nenhum atendimento encerrado</p>
        ) : (
          <div className="space-y-2">
            {history.map(c => (
              <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><User className="w-5 h-5 text-slate-500" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.student_name}</p>
                  <p className="text-xs text-slate-400">{c.status === "referred" ? "Encaminhado" : "Encerrado"}</p>
                </div>
                <span className="text-xs text-slate-400">{moment(c.updated_date).format("DD/MM/YYYY")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
