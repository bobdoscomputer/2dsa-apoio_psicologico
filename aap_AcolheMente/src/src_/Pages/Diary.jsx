import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Smile, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

const moods = [
  { value: "muito_mal", emoji: "😢", label: "Muito mal", score: 1, color: "bg-rose-100 border-rose-300 text-rose-700" },
  { value: "mal", emoji: "😔", label: "Mal", score: 2, color: "bg-orange-100 border-orange-300 text-orange-700" },
  { value: "neutro", emoji: "😐", label: "Neutro", score: 3, color: "bg-slate-100 border-slate-300 text-slate-700" },
  { value: "bem", emoji: "😊", label: "Bem", score: 4, color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
  { value: "muito_bem", emoji: "😄", label: "Muito bem", score: 5, color: "bg-sky-100 border-sky-300 text-sky-700" },
];

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mood: "", title: "", content: "", date: new Date().toISOString().split("T")[0] });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadEntries = async () => {
    try {
      const data = await base44.entities.DiaryEntry.list("-date", 50);
      setEntries(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, []);

  const handleSave = async () => {
    if (!form.mood) {
      toast({ title: "Selecione como você está se sentindo", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const moodData = moods.find(m => m.value === form.mood);
      await base44.entities.DiaryEntry.create({ ...form, mood_score: moodData?.score || 3 });
      setShowForm(false);
      setForm({ mood: "", title: "", content: "", date: new Date().toISOString().split("T")[0] });
      loadEntries();
      toast({ title: "Registro salvo! 💙" });
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
    setSaving(false);
  };

  // Calculate weekly mood average
  const last7 = entries.filter(e => moment(e.date).isAfter(moment().subtract(7, "days")));
  const avgMood = last7.length > 0 ? (last7.reduce((s, e) => s + (e.mood_score || 3), 0) / last7.length).toFixed(1) : null;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Diário Emocional</h1>
          <p className="text-slate-500 mt-1">Registre como você está se sentindo</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500">
          <Plus className="w-4 h-4 mr-2" /> Novo registro
        </Button>
      </div>

      {/* Weekly summary */}
      {avgMood && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500 mb-2">Média dos últimos 7 dias</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  n <= Math.round(avgMood) ? "bg-sky-100" : "bg-slate-50"
                }`}>
                  {n <= Math.round(avgMood) ? "⭐" : "○"}
                </div>
              ))}
            </div>
            <span className="text-lg font-semibold text-slate-700">{avgMood}/5</span>
            <span className="text-sm text-slate-400">({last7.length} registros)</span>
          </div>
        </div>
      )}

      {/* New entry form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <h3 className="font-heading font-semibold text-slate-800">Como você está se sentindo?</h3>
          <div className="flex flex-wrap gap-3">
            {moods.map(mood => (
              <button
                key={mood.value}
                onClick={() => setForm(prev => ({ ...prev, mood: mood.value }))}
                className={`px-4 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 min-w-16 ${
                  form.mood === mood.value ? mood.color + " shadow-md scale-105" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
          <div>
            <Input
              placeholder="Título (opcional)"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="rounded-xl"
            />
          </div>
          <div>
            <Textarea
              placeholder="O que está passando pela sua mente? (opcional)"
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="rounded-xl min-h-24"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500">
              {saving ? "Salvando..." : "Salvar registro"}
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl">Cancelar</Button>
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <Smile className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-slate-600 mb-2">Nenhum registro ainda</h3>
          <p className="text-slate-400 text-sm">Comece registrando como você está se sentindo hoje</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => {
            const mood = moods.find(m => m.value === entry.mood);
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4">
                <div className="text-3xl">{mood?.emoji || "😐"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-700">{mood?.label || entry.mood}</span>
                    <span className="text-xs text-slate-400">{moment(entry.date).format("DD/MM/YYYY")}</span>
                  </div>
                  {entry.title && <p className="font-medium text-sm text-slate-800">{entry.title}</p>}
                  {entry.content && <p className="text-sm text-slate-500 mt-1">{entry.content}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
