import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Check, X, Clock, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

export default function AdminVolunteers() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.VolunteerApplication.list("-created_date", 50).then(setApplications).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await base44.entities.VolunteerApplication.update(id, { status, reviewer_notes: notes[id] || "" });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));

      // If approved and has user_id, update user role to volunteer and create VolunteerStatus
      if (status === "approved") {
        const app = applications.find(a => a.id === id);
        if (app?.user_id) {
          try {
            await base44.entities.User.update(app.user_id, { role: "volunteer" });
            await base44.entities.VolunteerStatus.create({ user_id: app.user_id, full_name: app.full_name, availability: "offline" });
          } catch (e) {}
        }
      }

      toast({ title: status === "approved" ? "Voluntário aprovado! ✅" : "Candidatura rejeitada" });
    } catch (e) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const statusLabels = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };
  const statusColors = { pending: "bg-amber-100 text-amber-700", approved: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700" };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  const pending = applications.filter(a => a.status === "pending");
  const others = applications.filter(a => a.status !== "pending");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Gerenciar Voluntários</h1>

      <div>
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Pendentes ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-400 bg-white rounded-xl border p-6 text-center">Nenhuma candidatura pendente</p>
        ) : (
          <div className="space-y-3">
            {pending.map(app => (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{app.full_name}</p>
                    <p className="text-sm text-slate-500">{app.email}</p>
                    {app.phone && <p className="text-xs text-slate-400">{app.phone}</p>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Pendente</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                  <p className="font-medium text-xs text-slate-500 mb-1">Motivação:</p>
                  {app.motivation}
                </div>
                {app.experience && (
                  <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                    <p className="font-medium text-xs text-slate-500 mb-1">Experiência:</p>
                    {app.experience}
                  </div>
                )}
                {app.resume_url && (
                  <a href={app.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline">
                    <FileText className="w-4 h-4" /> Ver currículo
                  </a>
                )}
                <Textarea
                  placeholder="Observações (opcional)"
                  value={notes[app.id] || ""}
                  onChange={e => setNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                  className="rounded-xl text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={() => updateStatus(app.id, "approved")} className="rounded-lg bg-emerald-500 hover:bg-emerald-600">
                    <Check className="w-4 h-4 mr-1" /> Aprovar
                  </Button>
                  <Button onClick={() => updateStatus(app.id, "rejected")} variant="outline" className="rounded-lg text-red-500 border-red-200 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" /> Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Histórico ({others.length})</h2>
        <div className="space-y-2">
          {others.map(app => (
            <div key={app.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><User className="w-5 h-5 text-slate-500" /></div>
              <div className="flex-1"><p className="font-medium text-sm">{app.full_name}</p><p className="text-xs text-slate-400">{app.email}</p></div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status]}`}>{statusLabels[app.status]}</span>
              <span className="text-xs text-slate-400">{moment(app.updated_date).format("DD/MM/YYYY")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
