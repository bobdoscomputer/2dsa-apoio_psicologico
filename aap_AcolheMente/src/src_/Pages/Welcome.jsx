import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Shield, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-sky-900">AcolheMente</span>
        </div>
        <Link to="/login">
          <Button variant="outline" className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50">
            Entrar
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Cuidar da mente também é cuidar da vida
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-sky-950 leading-tight mb-6">
            Você não precisa enfrentar isso{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">sozinho(a)</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 mb-4 leading-relaxed">
            O AcolheMente é um espaço seguro e acolhedor para estudantes que precisam de apoio emocional. 
            Aqui você encontra informações, exercícios de bem-estar e a possibilidade de conversar com 
            voluntários capacitados e psicólogos profissionais.
          </motion.p>

          <motion.p variants={fadeUp} className="text-base text-slate-500 mb-10 max-w-2xl mx-auto">
            A saúde mental é tão importante quanto a saúde física. Sentir-se ansioso, triste ou estressado 
            faz parte da experiência humana — mas você merece apoio para atravessar esses momentos. 
            Buscar ajuda é um ato de coragem e autocuidado.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-200 w-full sm:w-auto">
                <Heart className="w-5 h-5 mr-2" />
                Preciso de ajuda
              </Button>
            </Link>
            <Link to="/volunteer-register">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Quero ser voluntário
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {[
            { icon: Shield, title: "Ambiente Seguro", desc: "Suas conversas são privadas. Aqui você pode se expressar com tranquilidade e sem julgamentos.", color: "sky" },
            { icon: Brain, title: "Conteúdo Educativo", desc: "Informações sobre ansiedade, estresse, depressão e outros temas, com linguagem simples e acessível.", color: "emerald" },
            { icon: Heart, title: "Acolhimento Humano", desc: "Voluntários capacitados e psicólogos profissionais prontos para ouvir e ajudar você.", color: "violet" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                item.color === "sky" ? "bg-sky-100 text-sky-600" :
                item.color === "emerald" ? "bg-emerald-100 text-emerald-600" :
                "bg-violet-100 text-violet-600"
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            O AcolheMente complementa, mas não substitui, o acompanhamento de um profissional de saúde mental. 
            Em caso de emergência, ligue para o CVV: 188 (24h).
          </p>
        </div>
      </main>
    </div>
  );
}
