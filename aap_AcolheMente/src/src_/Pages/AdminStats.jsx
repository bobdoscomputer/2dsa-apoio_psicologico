import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3, Users, MessageCircle, Calendar, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [users, convs, appts, quizzes, diaries] = await Promise.all([
        base44.entities.User.list(null, 50),
        base44.entities.ChatConversation.list(null, 50),
        base44.entities.Appointment.list(null, 50),
        base44.entities.QuizResult.list(null, 50),
        base44.entities.DiaryEntry.list(null, 50),
      ]);

      const roleCount = {};
      users.forEach(u => { roleCount[u.role || "student"] = (roleCount[u.role || "student"] || 0) + 1; });
      const roleData = Object.entries(roleCount).map(([name, value]) => ({
        name: name === "student" ? "Estudantes" : name === "volunteer" ? "Voluntários" : name === "psychologist" ? "Psicólogos" : "Admins",
        value
      }));

      const convStatusCount = {};
      convs.forEach(c => { convStatusCount[c.status] = (convStatusCount[c.status] || 0) + 1; });
      const convData = Object.entries(convStatusCount).map(([name, value]) => ({
        name: name === "waiting" ? "Aguardando" : name === "active" ? "Ativas" : name === "closed" ? "Encerradas" : "Encaminhadas",
        value
      }));

      setData({ users: users.length, conversations: convs.length, appointments: appts.length, quizzes: quizzes.length, diaries: diaries.length, roleData, convData });
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Estatísticas</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Usuários", value: data.users, icon: Users, color: "sky" },
          { label: "Conversas", value: data.conversations, icon: MessageCircle, color: "emerald" },
          { label: "Consultas", value: data.appointments, icon: Calendar, color: "violet" },
          { label: "Quizzes", value: data.quizzes, icon: BarChart3, color: "amber" },
          { label: "Diários", value: data.diaries, icon: TrendingUp, color: "rose" },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4 text-center">
            <c.icon className={`w-6 h-6 mx-auto mb-2 ${c.color === "sky" ? "text-sky-500" : c.color === "emerald" ? "text-emerald-500" : c.color === "violet" ? "text-violet-500" : c.color === "amber" ? "text-amber-500" : "text-rose-500"}`} />
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading font-semibold text-slate-700 mb-4">Usuários por tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {data.roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading font-semibold text-slate-700 mb-4">Conversas por status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.convData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
