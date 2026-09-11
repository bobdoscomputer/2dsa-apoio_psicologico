import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const phases = [
  { label: "Inspire", duration: 4, color: "from-sky-400 to-sky-500" },
  { label: "Segure", duration: 4, color: "from-emerald-400 to-emerald-500" },
  { label: "Expire", duration: 4, color: "from-violet-400 to-violet-500" },
  { label: "Segure", duration: 4, color: "from-amber-400 to-amber-500" },
];

export default function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhaseIdx(pi => {
            const next = (pi + 1) % phases.length;
            if (next === 0) setCycles(c => c + 1);
            return next;
          });
          return phases[(phaseIdx + 1) % phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx]);

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setCountdown(4);
    setCycles(0);
  };

  const phase = phases[phaseIdx];
  const scale = phase.label === "Inspire" ? 1.3 : phase.label === "Expire" ? 0.8 : 1.05;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
      <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">Exercício de Respiração 4-4-4-4</h2>
      <p className="text-slate-500 text-sm mb-8">Inspire, segure, expire e segure — cada etapa por 4 segundos. Ideal para momentos de ansiedade.</p>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <motion.div
            animate={running ? { scale } : { scale: 1 }}
            transition={{ duration: phases[phaseIdx]?.duration || 4, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} opacity-20`}
          />
          <motion.div
            animate={running ? { scale: scale * 0.8 } : { scale: 0.8 }}
            transition={{ duration: phases[phaseIdx]?.duration || 4, ease: "easeInOut" }}
            className={`absolute inset-6 rounded-full bg-gradient-to-br ${phase.color} opacity-30`}
          />
          <div className="relative text-center z-10">
            <p className="font-heading text-lg font-semibold text-slate-700">{running ? phase.label : "Pronto?"}</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">{running ? countdown : "--"}</p>
          </div>
        </div>

        {cycles > 0 && (
          <p className="text-sm text-slate-400 mb-4">{cycles} {cycles === 1 ? "ciclo completo" : "ciclos completos"}</p>
        )}

        <div className="flex gap-3">
          <Button onClick={() => setRunning(!running)} className="rounded-full px-6 bg-gradient-to-r from-sky-500 to-emerald-500">
            {running ? <><Pause className="w-4 h-4 mr-2" /> Pausar</> : <><Play className="w-4 h-4 mr-2" /> Iniciar</>}
          </Button>
          {(running || cycles > 0) && (
            <Button onClick={reset} variant="outline" className="rounded-full">
              <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
