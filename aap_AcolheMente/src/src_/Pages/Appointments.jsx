import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, User, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ psychologist_id: "", date: "", time: "", type: "online" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      base44.auth.me(),
      base44.entities.Appointment.list("-date", 50),
      base44.entities.PsychologistProfile.filter({ status: "active" }),
    ]).then(([u, appts, psys]) => {
      setUser(u);
      setAppointments(appts);
      setPsychologists(psys);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSchedule = async () => {
    if (!form.psychologist_id || !form.date || !form.time) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setSaving(true);
    const psy = psychologists.find(p => p.id === form.psychologist_id);
    try {
      await base44.entities.Appointment.create({
        student_id: user.id,
        student_name: user.full_name || user.email,
        psychologist_id: form.psychologist_id,
        psychologist_name: psy?.full_name || "",
        date: form.date,
        time: form.time,
        type: form.type,
        status: "scheduled",
      });
      toast({ title: "Consulta agendada! ✅" });
      setShowForm(false);
      setForm({ psychologist_id: "", date: "", time: "", type: "online" });
      const appts = await base44.entities.Appointment.list("-date", 50);
      setAppointments(appts);
    } catch (e) {
      toast({ title: "Erro ao agendar", variant: "destructive" });
    }
    setSaving(false);
  };

  const statusMap = {
    scheduled: { label: "Agendada", color: "bg-sky-100 text-sky-700" },
    completed: { label: "Concluída", color: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700" },
    no_show: { label: "Não compareceu", color: "bg-slate-100 text-slate-700" },
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Consultas</h1>
          <p className="text-slate-500 mt-1">Agende uma consulta com um psicólogo</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500">
          <Plus className="w-4 h-4 mr-2" /> Agendar
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <h3 className="font-heading font-semibold text-slate-800">Agendar consulta</h3>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Psicólogo(a)</label>
            <Select value={form.psychologist_id} onValueChange={v => setForm(f => ({ ...f, psychologist_id: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {psychologists.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name} — CRP {p.crp}</SelectItem>
                ))}
                {psychologists.length === 0 && <SelectItem value="none" disabled>Nenhum psicólogo disponível</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Data</label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Horário</label>
              <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Tipo</label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSchedule} disabled={saving} className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500">
              {saving ? "Agendando..." : "Confirmar"}
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl">Cancelar</Button>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-slate-600 mb-2">Nenhuma consulta agendada</h3>
          <p className="text-slate-400 text-sm">Agende uma consulta com um psicólogo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => {
            const s = statusMap[appt.status] || statusMap.scheduled;
            return (
              <div key={appt.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs text-sky-500 font-medium">{moment(appt.date).format("MMM")}</span>
                  <span className="text-lg font-bold text-sky-700">{moment(appt.date).format("DD")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800">{appt.psychologist_name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3" /> {appt.time}
                    <span className="capitalize">• {appt.type}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
