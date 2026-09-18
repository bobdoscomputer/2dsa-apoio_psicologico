import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function PsychologistProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: "", crp: "", bio: "", specialties: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [specText, setSpecText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const profiles = await base44.entities.PsychologistProfile.filter({ user_id: u.id });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setForm({ full_name: profiles[0].full_name, crp: profiles[0].crp, bio: profiles[0].bio || "", specialties: profiles[0].specialties || [] });
        setSpecText((profiles[0].specialties || []).join(", "));
      } else {
        setForm(f => ({ ...f, full_name: u.full_name || "" }));
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const u = await base44.auth.me();
    const data = { ...form, specialties: specText.split(",").map(s => s.trim()).filter(Boolean), user_id: u.id };
    try {
      if (profile) {
        await base44.entities.PsychologistProfile.update(profile.id, data);
      } else {
        const p = await base44.entities.PsychologistProfile.create(data);
        setProfile(p);
      }
      toast({ title: "Perfil salvo! ✅" });
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Perfil Profissional</h1>
      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <div>
          <Label>Nome completo</Label>
          <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="mt-1 rounded-xl" />
        </div>
        <div>
          <Label>CRP</Label>
          <Input value={form.crp} onChange={e => setForm(f => ({ ...f, crp: e.target.value }))} placeholder="00/00000" className="mt-1 rounded-xl" />
        </div>
        <div>
          <Label>Especialidades (separadas por vírgula)</Label>
          <Input value={specText} onChange={e => setSpecText(e.target.value)} placeholder="Ansiedade, Depressão, TCC..." className="mt-1 rounded-xl" />
        </div>
        <div>
          <Label>Bio / Sobre mim</Label>
          <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Fale um pouco sobre sua formação e abordagem..." className="mt-1 rounded-xl min-h-24" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Salvando..." : "Salvar perfil"}
        </Button>
      </div>
    </div>
  );
}
