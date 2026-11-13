import React, { useState } from "react";
import { Brain, Heart, Shield, Users, Star, Wind, Headphones, Play, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreathingExercise from "@/components/support/BreathingExercise";
import RelaxingSounds from "@/components/support/RelaxingSounds";

const topics = [
  {
    id: "ansiedade",
    icon: Brain,
    title: "Ansiedade",
    color: "sky",
    content: "A ansiedade é uma resposta natural do corpo ao estresse. Ela se torna um problema quando é excessiva e interfere no dia a dia. Sintomas comuns incluem: preocupação excessiva, dificuldade de concentração, tensão muscular, problemas de sono e irritabilidade.",
    tips: ["Pratique exercícios de respiração", "Mantenha uma rotina de sono regular", "Limite o consumo de cafeína", "Converse com alguém de confiança", "Considere buscar ajuda profissional"]
  },
  {
    id: "estresse",
    icon: Wind,
    title: "Estresse",
    color: "amber",
    content: "O estresse acadêmico é muito comum entre estudantes. Provas, trabalhos, prazos e a pressão por boas notas podem sobrecarregar. É importante reconhecer os sinais: cansaço constante, dores de cabeça, dificuldade de concentração e alterações de humor.",
    tips: ["Organize suas tarefas por prioridade", "Faça pausas regulares nos estudos", "Pratique atividades físicas", "Não tenha medo de pedir ajuda", "Reserve tempo para lazer"]
  },
  {
    id: "depressao",
    icon: Heart,
    title: "Depressão",
    color: "violet",
    content: "A depressão é mais do que tristeza passageira. É uma condição que afeta o humor, os pensamentos e as atividades diárias. Se você sente tristeza persistente, perda de interesse, alterações no sono ou apetite, e dificuldade de concentração por mais de duas semanas, procure ajuda profissional.",
    tips: ["Não se isole — converse com pessoas de confiança", "Mantenha uma rotina, mesmo que simples", "Pratique atividades que trazem prazer", "Procure um profissional de saúde mental", "Lembre-se: buscar ajuda é um ato de força"]
  },
  {
    id: "bullying",
    icon: Shield,
    title: "Bullying",
    color: "rose",
    content: "O bullying pode acontecer de forma física, verbal ou virtual (cyberbullying). Ele causa sofrimento emocional profundo e pode afetar a autoestima, o desempenho acadêmico e a saúde mental. Ninguém merece ser tratado com desrespeito.",
    tips: ["Converse com um adulto de confiança", "Não responda às provocações", "Guarde evidências (prints, mensagens)", "Procure apoio na escola ou universidade", "Lembre-se: a culpa nunca é da vítima"]
  },
  {
    id: "autoestima",
    icon: Star,
    title: "Autoestima",
    color: "emerald",
    content: "A autoestima é como nos vemos e nos valorizamos. Na vida acadêmica, comparações com colegas e pressão por resultados podem abalar a forma como nos enxergamos. Trabalhar a autoestima é um processo diário e gradual.",
    tips: ["Pratique a autocompaixão", "Celebre suas pequenas conquistas", "Evite comparações nas redes sociais", "Reconheça seus pontos fortes", "Cuide do seu corpo e mente"]
  },
  {
    id: "relacionamentos",
    icon: Users,
    title: "Relacionamentos",
    color: "teal",
    content: "Relacionamentos saudáveis são fundamentais para o bem-estar emocional. Conflitos com amigos, família ou parceiros podem gerar sofrimento. Aprender a se comunicar de forma assertiva e estabelecer limites são habilidades importantes.",
    tips: ["Pratique a escuta ativa", "Expresse seus sentimentos com clareza", "Respeite os limites do outro", "Saiba quando pedir ajuda", "Cultive relações que te fazem bem"]
  }
];

const colorMap = {
  sky: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-600", text: "text-sky-700", border: "border-sky-100" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", text: "text-amber-700", border: "border-amber-100" },
  violet: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", text: "text-violet-700", border: "border-violet-100" },
  rose: { bg: "bg-rose-50", icon: "bg-rose-100 text-rose-600", text: "text-rose-700", border: "border-rose-100" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-700", border: "border-emerald-100" },
  teal: { bg: "bg-teal-50", icon: "bg-teal-100 text-teal-600", text: "text-teal-700", border: "border-teal-100" },
};

export default function SupportCenter() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-800">Central de Apoio</h1>
        <p className="text-slate-500 mt-1">Informações e recursos para cuidar da sua saúde mental</p>
      </div>

      <Tabs defaultValue="temas" className="w-full">
        <TabsList className="w-full justify-start bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="temas" className="rounded-lg data-[state=active]:bg-white">
            <BookOpen className="w-4 h-4 mr-2" /> Temas
          </TabsTrigger>
          <TabsTrigger value="respiracao" className="rounded-lg data-[state=active]:bg-white">
            <Wind className="w-4 h-4 mr-2" /> Respiração
          </TabsTrigger>
          <TabsTrigger value="sons" className="rounded-lg data-[state=active]:bg-white">
            <Headphones className="w-4 h-4 mr-2" /> Sons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="temas" className="mt-6">
          {selected ? (
            <div>
              <button onClick={() => setSelected(null)} className="text-sm text-sky-600 hover:underline mb-4 inline-block">
                ← Voltar aos temas
              </button>
              <TopicDetail topic={topics.find(t => t.id === selected)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => {
                const c = colorMap[topic.color];
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelected(topic.id)}
                    className={`${c.bg} border ${c.border} rounded-2xl p-6 text-left hover:shadow-md transition-all`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
                      <topic.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-semibold text-slate-800">{topic.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{topic.content}</p>
                  </button>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="respiracao" className="mt-6">
          <BreathingExercise />
        </TabsContent>

        <TabsContent value="sons" className="mt-6">
          <RelaxingSounds />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TopicDetail({ topic }) {
  const c = colorMap[topic.color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-6 md:p-8`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
          <topic.icon className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-800">{topic.title}</h2>
      </div>
      <p className="text-slate-600 leading-relaxed mb-6">{topic.content}</p>
      <h3 className="font-heading font-semibold text-slate-700 mb-3">O que pode ajudar:</h3>
      <ul className="space-y-2">
        {topic.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-600">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${c.icon}`}>{i + 1}</span>
            {tip}
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400 mt-6">
        Estas informações são educativas e não substituem orientação profissional.
      </p>
    </div>
  );
}
