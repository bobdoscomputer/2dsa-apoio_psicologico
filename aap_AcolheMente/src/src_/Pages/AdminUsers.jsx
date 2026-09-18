import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, User, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const roleLabels = { admin: "Admin", student: "Estudante", volunteer: "Voluntário", psychologist: "Psicólogo" };
const roleColors = { admin: "bg-rose-100 text-rose-700", student: "bg-sky-100 text-sky-700", volunteer: "bg-emerald-100 text-emerald-700", psychologist: "bg-violet-100 text-violet-700" };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.User.list("-created_date", 50).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await base44.entities.User.update(userId, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      toast({ title: `Papel atualizado para ${roleLabels[role]}` });
    } catch (e) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border"><Users className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-400 text-sm">Nenhum usuário</p></div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-xl border p-4 flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">{u.full_name || "Sem nome"}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
              <Select value={u.role || "student"} onValueChange={v => updateRole(u.id, v)}>
                <SelectTrigger className="w-36 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="volunteer">Voluntário</SelectItem>
                  <SelectItem value="psychologist">Psicólogo</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
