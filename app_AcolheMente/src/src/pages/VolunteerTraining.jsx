    import React from "react";
import { Headphones, Heart, Shield, AlertTriangle, BookOpen } from "lucide-react";

const materials = [
  {
    icon: Headphones,
    title: "Escuta Ativa",
    color: "sky",
    content: "A escuta ativa é a base do acolhimento. Ela envolve ouvir com atenção plena, sem julgar, sem interromper e sem dar conselhos imediatos. Demonstre interesse através de perguntas abertas e validação emocional.",
    tips: ["Mantenha contato visual (em videochamada) ou demonstre presença no chat", "Use frases como 'Entendo como você se sente' ou 'Obrigado por compartilhar isso comigo'", "Evite minimizar os sentimentos: nunca diga 'não é tão ruim assim'", "Faça perguntas abertas: 'Como você tem se sentido?'"],
  },
  {
    icon: Heart,
    title: "Acolhimento e Empatia",
    color: "emerald",
    content: "Acolher é criar um espaço seguro onde a pessoa se sinta à vontade para se expressar. Empatia é a capacidade de se colocar no lugar do outro, compreendendo suas emoções sem julgamento.",
    tips: ["Valide os sentimentos: 'É compreensível que você esteja se sentindo assim'", "Demonstre genuíno interesse pela história da pessoa", "Não compare com suas próprias experiências", "Respeite o tempo e o ritmo do estudante"],
  },
  {
    icon: Shield,
    title: "Limites da Atuação",
    color: "amber",
    content: "Como voluntário, seu papel é acolher e ouvir, não diagnosticar ou tratar. É fundamental conhecer os limites da sua atuação para proteger você e o estudante.",
    tips: ["Nunca faça diagnósticos ou prescreva tratamentos", "Encaminhe para um psicólogo quando perceber necessidade", "Cuide da sua própria saúde mental", "Não assuma responsabilidade total pelo bem-estar do estudante"],
  },
  {
    icon: AlertTriangle,
    title: "Situações de Risco",
    color: "rose",
    content: "É essencial saber identificar sinais de risco e agir com responsabilidade. Em situações de ideação suicida, automutilação ou risco iminente, encaminhe imediatamente para um profissional.",
    tips: ["Pergunte diretamente sobre pensamentos suicidas quando necessário", "Encaminhe para o CVV (188) em situações urgentes", "Encaminhe para um psicólogo da plataforma", "Nunca prometa sigilo absoluto em situações de risco"],
  },
];

const colorMap = {
  sky: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-600", border: "border-sky-100" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", border: "border-emerald-100" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", border: "border-amber-100" },
  rose: { bg: "bg-rose-50", icon: "bg-rose-100 text-rose-600", border: "border-rose-100" },
};

export default function VolunteerTraining() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-800">Materiais de Apoio</h1>
        <p className="text-slate-500 mt-1">Recursos para aprimorar seu acolhimento</p>
      </div>
      <div className="space-y-4">
        {materials.map((mat, i) => {
          const c = colorMap[mat.color];
          return (
            <div key={i} className={`${c.bg} border ${c.border} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <mat.icon className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-slate-800">{mat.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">{mat.content}</p>
              <ul className="space-y-2">
                {mat.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
