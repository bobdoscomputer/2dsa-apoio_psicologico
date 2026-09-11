import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ClipboardList, ArrowRight, ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const questions = [
  { q: "Nas últimas semanas, com que frequência você se sentiu ansioso(a) ou preocupado(a)?", cat: "ansiedade" },
  { q: "Você tem tido dificuldade para dormir ou dormido demais?", cat: "sono" },
  { q: "Com que frequência você se sente triste ou desmotivado(a)?", cat: "humor" },
  { q: "Você tem conseguido se concentrar nos estudos ou atividades?", cat: "foco" },
  { q: "Você se sente sobrecarregado(a) com suas responsabilidades?", cat: "estresse" },
  { q: "Com que frequência você se sente sozinho(a) ou isolado(a)?", cat: "social" },
  { q: "Você tem praticado atividades que te dão prazer?", cat: "lazer" },
  { q: "Como está sua autoestima ultimamente?", cat: "autoestima" },
  { q: "Você consegue pedir ajuda quando precisa?", cat: "suporte" },
  { q: "No geral, como você avalia seu bem-estar emocional?", cat: "geral" },
];

const options = [
  { label: "Nunca / Muito bem", score: 0 },
  { label: "Raramente / Bem", score: 1 },
  { label: "Às vezes / Regular", score: 2 },
  { label: "Frequentemente / Mal", score: 3 },
  { label: "Sempre / Muito mal", score: 4 },
];

function getLevel(score) {
  if (score <= 10) return "baixo";
  if (score <= 20) return "moderado";
  if (score <= 30) return "alto";
  return "muito_alto";
}

const levelInfo = {
  baixo: { emoji: "🌟", title: "Bem-estar saudável", color: "emerald", desc: "Seus resultados indicam que você está com um bom nível de bem-estar emocional. Continue cuidando de si!", recommendations: ["Mantenha sua rotina de autocuidado", "Continue cultivando relações saudáveis", "Pratique atividades físicas regularmente", "Reserve tempo para lazer e descanso"] },
  moderado: { emoji: "💛", title: "Atenção moderada", color: "amber", desc: "Alguns sinais merecem atenção. É normal passar por períodos mais difíceis, mas é importante não ignorar esses sentimentos.", recommendations: ["Converse com alguém de confiança sobre como se sente", "Pratique exercícios de respiração e relaxamento", "Tente manter uma rotina equilibrada", "Considere buscar orientação de um profissional"] },
  alto: { emoji: "🧡", title: "Atenção necessária", color: "orange", desc: "Seus resultados sugerem que você pode estar passando por um momento difícil. Buscar apoio é um passo importante e corajoso.", recommendations: ["Procure um profissional de saúde mental", "Não se isole — fale com pessoas de confiança", "Use nosso chat para conversar com um voluntário", "Pratique técnicas de relaxamento diariamente"] },
  muito_alto: { emoji: "❤️", title: "Busque ajuda profissional", color: "rose", desc: "Seus resultados indicam que você pode estar enfrentando dificuldades significativas. Procurar ajuda profissional é fundamental e é um ato de cuidado consigo.", recommendations: ["Agende uma consulta com um psicólogo", "Ligue para o CVV: 188 (24 horas)", "Converse com alguém de confiança agora", "Use nosso chat para acolhimento imediato"] },
};

const resultColorMap = {
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  orange: "bg-orange-50 border-orange-200 text-orange-800",
  rose: "bg-rose-50 border-rose-200 text-rose-800",
};

export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const selectAnswer = async (score) => {
    const newAnswers = [...answers, { question: questions[current].q, answer: score }];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, a) => sum + a.answer, 0);
      const level = getLevel(totalScore);
      setResult({ score: totalScore, level });
      setSaving(true);
      try {
        await base44.entities.QuizResult.create({
          score: totalScore,
          max_score: questions.length * 4,
          level,
          answers: newAnswers,
          date: new Date().toISOString().split("T")[0],
        });
      } catch (e) {}
      setSaving(false);
    }
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    const info = levelInfo[result.level];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`rounded-2xl border-2 p-6 md:p-8 ${resultColorMap[info.color]}`}>
          <div className="text-center mb-6">
            <span className="text-5xl">{info.emoji}</span>
            <h2 className="font-heading text-2xl font-bold mt-3">{info.title}</h2>
            <p className="text-3xl font-bold mt-2">{result.score}/{questions.length * 4}</p>
          </div>
          <p className="text-center leading-relaxed mb-6">{info.desc}</p>
          <h3 className="font-semibold mb-3">Recomendações:</h3>
          <ul className="space-y-2 mb-6">
            {info.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 mt-0.5">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-sm text-amber-700">
          ⚠️ Este quiz é apenas uma ferramenta de autoconhecimento e <strong>não fornece diagnóstico médico</strong>. 
          Para uma avaliação profissional, consulte um psicólogo.
        </div>
        <div className="text-center">
          <Button onClick={restart} variant="outline" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" /> Refazer quiz
          </Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-800 mb-3">Quiz de Saúde Emocional</h1>
          <p className="text-slate-500 mb-2">Responda {questions.length} perguntas para avaliar como está seu bem-estar emocional.</p>
          <p className="text-sm text-slate-400 mb-8">O quiz leva cerca de 2 minutos. Suas respostas são confidenciais.</p>
          <Button onClick={() => setStarted(true)} className="rounded-full px-8 bg-gradient-to-r from-violet-500 to-sky-500">
            Começar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-slate-400 mt-6">Este quiz não fornece diagnóstico médico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">Pergunta {current + 1} de {questions.length}</span>
          <span className="text-sm font-medium text-sky-600">{Math.round(((current + 1) / questions.length) * 100)}%</span>
        </div>
        <Progress value={((current + 1) / questions.length) * 100} className="h-2 mb-8" />
        
        <h2 className="font-heading text-lg font-semibold text-slate-800 mb-6">{questions[current].q}</h2>
        
        <div className="space-y-3">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(opt.score)}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all text-sm text-slate-700"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {current > 0 && (
          <button onClick={() => { setCurrent(current - 1); setAnswers(answers.slice(0, -1)); }} className="mt-6 text-sm text-slate-400 hover:text-sky-600 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Voltar
          </button>
        )}
      </div>
    </div>
  );
}
