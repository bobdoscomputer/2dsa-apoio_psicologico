import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Heart, Upload, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function VolunteerRegister() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", motivation: "", experience: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const { toast } = useToast();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.motivation) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let resume_url = "";
      if (resumeFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: resumeFile });
        resume_url = file_url;
      }
      await base44.entities.VolunteerApplication.create({ ...form, resume_url, status: "pending" });
      setStep(2);
    } catch (err) {
      toast({ title: "Erro ao enviar candidatura", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-800 mb-3">Candidatura enviada!</h2>
          <p className="text-slate-500 mb-6">
            Obrigado pelo seu interesse em ajudar. Nossa equipe analisará seus dados e 
            você receberá uma resposta em breve. Após a aprovação, você poderá fazer login 
            e acessar a área de voluntários.
          </p>
          <Link to="/">
            <Button className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500">
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <header className="px-6 py-4 max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </header>
      <div className="max-w-xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-800 mb-2">Quero ser voluntário</h1>
          <p className="text-slate-500">Preencha o formulário abaixo para se candidatar como voluntário de acolhimento.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-5">
          <div>
            <Label>Nome completo *</Label>
            <Input value={form.full_name} onChange={e => update("full_name", e.target.value)} placeholder="Seu nome" className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label>E-mail *</Label>
            <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="seu@email.com" className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(00) 00000-0000" className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label>Por que deseja ser voluntário? *</Label>
            <Textarea value={form.motivation} onChange={e => update("motivation", e.target.value)} placeholder="Conte-nos sua motivação..." className="mt-1 rounded-xl min-h-24" />
          </div>
          <div>
            <Label>Experiência relevante</Label>
            <Textarea value={form.experience} onChange={e => update("experience", e.target.value)} placeholder="Cursos, vivências, formações..." className="mt-1 rounded-xl min-h-20" />
          </div>
          <div>
            <Label>Currículo (PDF ou documento)</Label>
            <div className="mt-1 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-sky-300 transition-colors cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="resume" onChange={e => setResumeFile(e.target.files[0])} />
              <label htmlFor="resume" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                {resumeFile ? (
                  <p className="text-sm text-sky-600 font-medium">{resumeFile.name}</p>
                ) : (
                  <p className="text-sm text-slate-400">Clique para enviar seu currículo</p>
                )}
              </label>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full rounded-xl py-6 bg-gradient-to-r from-emerald-500 to-sky-500 text-base font-semibold">
            {submitting ? "Enviando..." : "Enviar candidatura"}
          </Button>
        </form>
      </div>
    </div>
  );
}
