import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Circle, UserPlus, Users, LogOut, Edit2, Trash2 } from 'lucide-react';
import { useClan } from '../context/ClanContext';

export function MemberList({ isMobile = false }: { isMobile?: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState('membros');
  const { members, loading, logout, myMember, deleteMember, updateMemberRole, isEcoMode } = useClan();
  
  const sortedMembers = [...members].sort((a, b) => {
    if (b.level !== a.level) {
      return (b.level || 0) - (a.level || 0);
    }
    return (b.heroPower || 0) - (a.heroPower || 0);
  });

  const [editingMember, setEditingMember] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isLeader = myMember?.role === 'leader';

  const handleDeleteMember = async (memberId: string, name: string) => {
    if (confirm(`Deseja realmente ELIMINAR ${name} da Ordem Suprema? Esta ação removerá o acesso do usuário.`)) {
      setDeletingId(memberId);
      try {
        await deleteMember(memberId);
      } catch (err) {
        console.error('Delete error:', err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePromotion = (memberId: string, currentRole: string) => {
    const roles: ('warrior' | 'muse' | 'recruiter' | 'military_leader' | 'diplomat' | 'leader')[] = 
      ['warrior', 'muse', 'recruiter', 'military_leader', 'diplomat', 'leader'];
    const currentIndex = roles.indexOf(currentRole as any);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    if (nextRole === 'leader') {
      if (confirm('Deseja transferir a Liderança? Você perderá seus privilégios de Líder.')) {
        updateMemberRole(memberId, 'leader');
        updateMemberRole(myMember!.id, 'diplomat');
      }
    } else {
      updateMemberRole(memberId, nextRole);
    }
  };

  const handleInvite = async () => {
    const shareData = {
      title: 'Aliança Suprema Ordem',
      text: 'Junte-se à nossa Aliança em Suprema Ordem!',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const url = window.location.origin;
        await navigator.clipboard.writeText(url);
        alert('Link da Aliança copiado para a área de transferência!');
      }
    } catch (err) {
      if (err instanceof Error && (err.name === 'AbortError' || err.message.toLowerCase().includes('cancel'))) {
        return;
      }
      console.error('Error sharing:', err);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'leader': return 'text-gaming-gold';
      case 'diplomat': return 'text-gaming-purple';
      case 'military_leader': return 'text-red-500';
      case 'recruiter': return 'text-green-500';
      case 'muse': return 'text-pink-400';
      case 'warrior': return 'text-blue-400';
      default: return 'text-white/60';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return '💀';
      case 'diplomat': return '📜';
      case 'military_leader': return '⚔️';
      case 'recruiter': return '📢';
      case 'muse': return '✨';
      case 'warrior': return '🛡️';
      default: return '🔰';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader': return 'Líder';
      case 'diplomat': return 'Diplomata';
      case 'military_leader': return 'Líder Militar';
      case 'recruiter': return 'Recrutador';
      case 'muse': return 'Musa';
      case 'warrior': return 'Guerreiro';
      default: return role;
    }
  };

  const getBorderClasses = (borderId?: string) => {
    if (isEcoMode) {
      switch (borderId) {
        case 'border_cyan': return 'border border-cyan-400';
        case 'border_purple': return 'border border-purple-500';
        case 'border_gold': return 'border border-gaming-gold';
        default: return 'border border-white/10';
      }
    }
    switch (borderId) {
      case 'border_cyan': return 'border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]';
      case 'border_purple': return 'border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
      case 'border_gold': return 'border border-gaming-gold shadow-[0_0_12px_rgba(251,191,36,0.5)] animate-pulse';
      default: return 'border border-white/10';
    }
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className={`flex items-center ${isMobile ? 'gap-4 overflow-x-auto no-scrollbar' : 'gap-8'} mb-6`}>
        <button 
          onClick={() => setActiveSubTab('membros')}
          className={`text-[10px] uppercase font-medium tracking-[0.2em] relative py-1 shrink-0 transition-colors ${activeSubTab === 'membros' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          Participantes
          {activeSubTab === 'membros' && <motion.div layoutId="memberTab" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gaming-gold shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
        </button>
      </div>

      <div className="flex-1 bg-gaming-card/30 rounded-2xl border border-gaming-border overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto no-scrollbar scroll-smooth">
          {!isMobile ? (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gaming-border bg-white/[0.02]">
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">#</th>
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Guerreiro</th>
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest text-center">Poder</th>
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest text-center">Patente</th>
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Desde</th>
                  <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-4 h-16 bg-white/5" />
                      </tr>
                    ))
                  ) : sortedMembers.length === 0 ? (
                    <motion.tr 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={5} className="px-6 py-12 text-center text-white/20 uppercase text-[10px] tracking-widest font-bold">
                        Nenhum membro encontrado
                      </td>
                    </motion.tr>
                  ) : sortedMembers.map((m, index) => (
                    <motion.tr 
                      key={m.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                    <td className="px-6 py-4">
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/10 rounded-lg group-hover:border-gaming-gold/50 group-hover:text-gaming-gold transition-all">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group/avatar">
                          {m.avatarUrl && (
                            <img src={m.avatarUrl} alt={m.name} className={`w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(0,0,0,0.5)] ${getBorderClasses(m.profileBorder)}`} referrerPolicy="no-referrer" />
                          )}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-gold rounded-full flex items-center justify-center border border-black shadow-[0_0_10px_rgba(251,191,36,0.8)] z-10">
                            <span className="text-[7px] font-black text-black leading-none">{m.level || 0}</span>
                          </div>
                          {!isEcoMode && <div className="absolute inset-0 rounded-full bg-gaming-gold/20 blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity" />}
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-gaming-gold transition-colors">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-mono font-black text-red-500 italic">{(m.heroPower || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gaming-gold text-xs drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">{getRoleIcon(m.role)}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeColor(m.role)}`}>
                          {getRoleLabel(m.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-medium text-white/40">{m.joinedAt || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Circle size={8} className={m.status === 'online' ? 'fill-green-500 text-green-500 animate-pulse' : 'fill-white/10 text-white/10'} />
                        <span className={`text-[10px] font-bold ${m.status === 'online' ? 'text-green-500' : 'text-white/20'}`}>
                          {m.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col p-4 gap-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                  ))
                ) : sortedMembers.map((m, index) => (
                  <motion.div 
                    key={m.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className={`w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getBorderClasses(m.profileBorder)}`} referrerPolicy="no-referrer" />
                      ) : (
                        <div className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black uppercase text-white/30 ${getBorderClasses(m.profileBorder)}`}>{m.name.substring(0,2)}</div>
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gaming-gold rounded-full flex items-center justify-center border-2 border-gaming-bg shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10 transition-transform group-hover/avatar:scale-110">
                        <span className="text-[10px] font-black text-black leading-none">{m.level || 0}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-gaming-card ${m.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-white/20'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-tight">{m.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${getRoleBadgeColor(m.role)}`}>{getRoleLabel(m.role)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[12px]">{getRoleIcon(m.role)}</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase">#{index + 1}</span>
                  </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-2 mt-6`}>
        {[
          { label: 'Convidar', icon: Users, action: handleInvite },
          { label: 'Sair da Aliança', icon: LogOut, danger: true, action: logout }
        ].map((action) => (
          <button 
            key={action.label}
            onClick={action.action}
            className={`bg-white/5 border border-white/10 rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest transition-all group ${action.danger ? 'hover:bg-red-500/10 hover:border-red-500/30' : 'hover:bg-white/10 hover:border-white/20'}`}
          >
            <action.icon size={12} className={`${action.danger ? 'text-red-500/50 group-hover:text-red-500' : 'text-gaming-gold/50 group-hover:text-gaming-gold'} transition-colors`} />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
