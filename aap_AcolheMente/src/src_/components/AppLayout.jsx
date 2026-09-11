import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Heart, Home, BookOpen, MessageCircle, Calendar, ClipboardList,
  Smile, Menu, X, LogOut, User, Users, Settings, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const studentLinks = [
  { to: "/dashboard", icon: Home, label: "Início" },
  { to: "/support-center", icon: BookOpen, label: "Central de Apoio" },
  { to: "/quiz", icon: ClipboardList, label: "Quiz Emocional" },
  { to: "/diary", icon: Smile, label: "Diário" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/appointments", icon: Calendar, label: "Consultas" },
];

const volunteerLinks = [
  { to: "/volunteer", icon: Home, label: "Painel" },
  { to: "/volunteer/chat", icon: MessageCircle, label: "Chat" },
  { to: "/volunteer/schedule", icon: Calendar, label: "Agenda" },
  { to: "/volunteer/training", icon: BookOpen, label: "Materiais" },
];

const psychologistLinks = [
  { to: "/psychologist", icon: Home, label: "Painel" },
  { to: "/psychologist/patients", icon: Users, label: "Pacientes" },
  { to: "/psychologist/chat", icon: MessageCircle, label: "Chat" },
  { to: "/psychologist/schedule", icon: Calendar, label: "Agenda" },
  { to: "/psychologist/profile", icon: User, label: "Perfil" },
];

const adminLinks = [
  { to: "/admin", icon: Home, label: "Painel" },
  { to: "/admin/volunteers", icon: Users, label: "Voluntários" },
  { to: "/admin/users", icon: User, label: "Usuários" },
  { to: "/admin/stats", icon: ClipboardList, label: "Estatísticas" },
];

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const role = user?.role || "student";
  const links = role === "admin" ? adminLinks :
                role === "volunteer" ? volunteerLinks :
                role === "psychologist" ? psychologistLinks :
                studentLinks;

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/50 via-white to-emerald-50/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-sky-50">
              {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            <Link to={links[0]?.to || "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-sky-900 hidden sm:block">AcolheMente</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.full_name || user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-500">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-slate-100 bg-white/50 p-4">
          <nav className="space-y-1">
            {links.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)}>
            <div className="w-64 h-full bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <nav className="space-y-1 mt-4">
                {links.map(link => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
