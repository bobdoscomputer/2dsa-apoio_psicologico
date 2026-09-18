import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, UserCheck, BarChart3, MessageCircle, Calendar, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, volunteers: 0, pending: 0, conversations: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [users, volApps, convs, appts] = await Promise.all([
        base44.entities.User.list(null, 1),
        base44.entities.VolunteerApplication.list(null, 50),
        base44.entities.ChatConversation.list(null, 1),
        base44.entities.Appointment.list(null, 1),
      ]);
      setStats({
        users: users.length,
        volunteers: volApps.filter(v => v.status === "approved").length,
        pending: volApps.filter(v => v.status === "pending").length,
        conversations: convs.length,
        appointments: appts.length,
      });
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  const cards = [
    { label: "Usuários", value: stats.users, icon: Users, color: "sky", to: "/admin/users" },
    { label: "Voluntários aprovados", value: stats.volunteers, icon: UserCheck, color: "emerald", to: "/admin/volunteers" },
    { label: "Pendentes", value: stats.pending, icon: ClipboardList, color: "amber", to: "/admin/volunteers" },
    { label: "Conversas", value: stats.conversations, icon: MessageCircle, color: "violet" },
    { label: "Consultas", value: stats.appointments, icon: Calendar, color: "rose" },
  ];

  const colorMap = {
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Painel Administrativo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Wrapper = c.to ? Link : "div";
          return (
            <Wrapper key={i} to={c.to || "#"} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorMap[c.color]}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{c.value}</p>
              <p className="text-sm text-slate-500 mt-1">{c.label}</p>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
