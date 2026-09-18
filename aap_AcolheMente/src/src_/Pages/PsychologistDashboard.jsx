import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, Calendar, MessageCircle, Clock, CheckCircle } from "lucide-react";
import moment from "moment";

export default function PsychologistDashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const appts = await base44.entities.Appointment.filter({ psychologist_id: u.id }, "-date", 20);
      setAppointments(appts);
      const convs = await base44.entities.ChatConversation.filter({ psychologist_id: u.id }, "-updated_date", 20);
      setConversations(convs);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => a.status === "scheduled");
  const completed = appointments.filter(a => a.status === "completed");

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Painel do Psicólogo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-5">
          <Calendar className="w-6 h-6 text-sky-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{upcoming.length}</p>
          <p className="text-sm text-slate-500">Consultas agendadas</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{completed.length}</p>
          <p className="text-sm text-slate-500">Concluídas</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <MessageCircle className="w-6 h-6 text-violet-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{conversations.length}</p>
          <p className="text-sm text-slate-500">Conversas</p>
        </div>
      </div>

      <div>
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Próximas consultas</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400 bg-white rounded-xl border p-6 text-center">Nenhuma consulta agendada</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(a => (
              <div key={a.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs text-sky-500">{moment(a.date).format("MMM")}</span>
                  <span className="text-lg font-bold text-sky-700">{moment(a.date).format("DD")}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{a.student_name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3 h-3" /> {a.time} • {a.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
