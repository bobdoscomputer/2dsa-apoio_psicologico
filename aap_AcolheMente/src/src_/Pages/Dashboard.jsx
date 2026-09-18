import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BookOpen, MessageCircle, Calendar, ClipboardList, Smile, Heart, Sun, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentMood, setRecentMood] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.DiaryEntry.list("-created_date", 1).then(entries => {
      if (entries.length > 0) setRecentMood(entries[0]);
    }).catch(() => {});
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const moodEmojis = { muito_mal: "😢", mal: "😔", neutro: "😐", bem: "😊", muito_bem: "😄" };

  const cards = [
    { to: "/support-center", icon: BookOpen, title: "Central de Apoio", desc: "Conteúdos sobre saúde mental", color: "sky" },
    { to: "/quiz", icon: ClipboardList, title: "Quiz Emocional", desc: "Avalie seu bem-estar", color: "violet" },
    { to: "/diary", icon: Smile, title: "Diário Emocional", desc: "Registre seus sentimentos", color: "amber" },
    { to: "/chat", icon: MessageCircle, title: "Chat de Apoio", desc: "Converse com um voluntário", color: "emerald" },
    { to: "/appointments", icon: Calendar, title: "Consultas", desc: "Agende com um psicólogo", color: "rose" },
  ];

  const colorMap = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };
  const iconColorMap = {
    sky: "bg-sky-100 text-sky-600",
    violet: "bg-violet-100 text-violet-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sky-100 text-sm font-medium mb-1">{greeting()} 💙</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
              {user?.full_name || "Estudante"}
            </h1>
            <p className="text-sky-100 text-sm md:text-base">
              Lembre-se: cuidar de si é o primeiro passo para estar bem.
            </p>
          </div>
          <Sun className="w-10 h-10 text-sky-200 hidden sm:block" />
        </div>
        {recentMood && (
          <div className="mt-4 bg-white/15 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-sm">
            <span>{moodEmojis[recentMood.mood]}</span>
            <span>Último registro: {recentMood.date}</span>
          </div>
        )}
      </div>

      {/* Quick tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800 text-sm">Dica do dia</p>
          <p className="text-amber-700 text-sm mt-1">
            Respire fundo por 4 segundos, segure por 4 segundos e solte por 4 segundos. Repita 3 vezes. 
            Essa técnica simples pode ajudar a reduzir a ansiedade.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <Link key={card.to} to={card.to}>
            <div className={`rounded-2xl border p-6 hover:shadow-md transition-all cursor-pointer ${colorMap[card.color]}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconColorMap[card.color]}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center">
        O AcolheMente complementa, mas não substitui, o acompanhamento profissional. Em emergência, ligue 188 (CVV).
      </p>
    </div>
  );
}
