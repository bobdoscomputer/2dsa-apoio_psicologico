import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, User } from "lucide-react";
import moment from "moment";

export default function PsychologistPatients() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const appts = await base44.entities.Appointment.filter({ psychologist_id: u.id }, "-date", 50);
      setAppointments(appts);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  // Unique patients
  const patients = [...new Map(appointments.map(a => [a.student_id, { id: a.student_id, name: a.student_name, lastDate: a.date, count: appointments.filter(x => x.student_id === a.student_id).length }])).values()];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Pacientes</h1>
      {patients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border"><Users className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-400 text-sm">Nenhum paciente ainda</p></div>
      ) : (
        <div className="space-y-2">
          {patients.map(p => (
            <div key={p.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center"><User className="w-5 h-5 text-violet-600" /></div>
              <div className="flex-1"><p className="font-medium text-sm text-slate-800">{p.name}</p><p className="text-xs text-slate-400">{p.count} {p.count === 1 ? "consulta" : "consultas"}</p></div>
              <span className="text-xs text-slate-400">Última: {moment(p.lastDate).format("DD/MM/YYYY")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
