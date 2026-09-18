import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function PsychologistSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const appts = await base44.entities.Appointment.filter({ psychologist_id: u.id }, "-date", 50);
      setAppointments(appts);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Appointment.update(id, { status });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast({ title: status === "completed" ? "Consulta marcada como concluída" : "Consulta cancelada" });
  };

  const statusMap = {
    scheduled: { label: "Agendada", color: "bg-sky-100 text-sky-700" },
    completed: { label: "Concluída", color: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700" },
    no_show: { label: "Ausente", color: "bg-slate-100 text-slate-700" },
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Agenda de Consultas</h1>
      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-400 text-sm">Nenhuma consulta</p></div>
      ) : (
        <div className="space-y-2">
          {appointments.map(a => {
            const s = statusMap[a.status] || statusMap.scheduled;
            return (
              <div key={a.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs text-sky-500">{moment(a.date).format("MMM")}</span>
                  <span className="text-lg font-bold text-sky-700">{moment(a.date).format("DD")}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{a.student_name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3 h-3" /> {a.time} • {a.type}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                {a.status === "scheduled" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "completed")} className="text-emerald-600 hover:bg-emerald-50"><CheckCircle className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "cancelled")} className="text-red-500 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
