import { useState } from 'react';
import { motion } from 'motion/react';
import { Circle, UserPlus, Users, LogOut, Edit2, Trash2 } from 'lucide-react';
import { useClan } from '../context/ClanContext';

export function MemberList({ isMobile = false }: { isMobile?: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState('membros');
  const { members, loading, logout, myMember, deleteMember, updateMemberRole } = useClan();
  const [editingMember, setEditingMember] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isLeader = myMember?.role === 'leader' || myMember?.role === 'co-leader';

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
    const roles: ('member' | 'elder' | 'co-leader' | 'leader')[] = ['member', 'elder', 'co-leader', 'leader'];
    const currentIndex = roles.indexOf(currentRole as any);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    if (nextRole === 'leader') {
      if (confirm('Deseja transferir a Liderança? Você perderá seus privilégios de Líder.')) {
        updateMemberRole(memberId, 'leader');
        updateMemberRole(myMember!.id, 'co-leader');
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
      case 'co-leader': return 'text-orange-500';
      case 'elder': return 'text-gaming-purple';
      case 'member': return 'text-blue-400';
      default: return 'text-white/60';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return '💀';
      case 'co-leader': return '🔥';
      case 'elder': return '🛡️';
      case 'member': return '⚔️';
      default: return '🔰';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader': return 'Líder';
      case 'co-leader': return 'Braço Direito';
      case 'elder': return 'Veterano';
      case 'member': return 'Guerreiro';
      default: return role;
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
        {isLeader && (
          <button 
            onClick={() => setActiveSubTab('gerencia')}
            className={`text-[10px] uppercase font-medium tracking-[0.2em] relative py-1 shrink-0 transition-colors ${activeSubTab === 'gerencia' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            Gerenciamento
            {activeSubTab === 'gerencia' && <motion.div layoutId="memberTab" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gaming-gold shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
          </button>
        )}
      </div>

      <div className="flex-1 bg-gaming-card/30 rounded-2xl border border-gaming-border overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
        {activeSubTab === 'membros' ? (
          <div className="overflow-x-auto no-scrollbar scroll-smooth">
            {!isMobile ? (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gaming-border bg-white/[0.02]">
                    <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">#</th>
                    <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Nome do Jogador</th>
                    <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest text-center">Rank</th>
                    <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Membro Desde</th>
                    <th className="px-6 py-4 text-[9px] uppercase text-white/20 font-bold tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-4 h-16 bg-white/5" />
                      </tr>
                    ))
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/20 uppercase text-[10px] tracking-widest font-bold">
                        Nenhum membro encontrado
                      </td>
                    </tr>
                  ) : members.map((m, index) => (
                    <tr key={m.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/10 rounded-lg group-hover:border-gaming-gold/50 group-hover:text-gaming-gold transition-all">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {m.avatarUrl && (
                            <img src={m.avatarUrl} alt={m.name} className="w-6 h-6 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                          )}
                          <span className="text-xs font-bold text-white group-hover:text-gaming-gold transition-colors">{m.name}</span>
                        </div>
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
                          {editingMember === 'all' && isLeader && m.userId !== myMember?.userId && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromotion(m.id, m.role);
                              }}
                              className="ml-auto p-1.5 bg-gaming-gold/10 text-gaming-gold border border-gaming-gold/20 rounded-md hover:bg-gaming-gold hover:text-black transition-all"
                              title="Alterar Rank"
                            >
                              <Circle size={10} className="fill-current" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col p-4 gap-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                  ))
                ) : members.map((m, index) => (
                  <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black uppercase text-white/30">{m.name.substring(0,2)}</div>
                        )}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gaming-card ${m.status === 'online' ? 'bg-green-500' : 'bg-white/20'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{m.name}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${getRoleBadgeColor(m.role)}`}>{getRoleLabel(m.role)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[12px]">{getRoleIcon(m.role)}</span>
                      <span className="text-[8px] font-bold text-white/20 uppercase">#{index + 1}</span>
                      {editingMember === 'all' && isLeader && m.userId !== myMember?.userId && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePromotion(m.id, m.role);
                          }}
                          className="p-2 bg-gaming-gold/10 text-gaming-gold border border-gaming-gold/20 rounded-lg hover:bg-gaming-gold hover:text-black transition-all"
                        >
                          <Circle size={10} className="fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[500px] p-6 flex flex-col gap-4">
             <div className="flex flex-col gap-2 mb-4">
                <h4 className="text-sm font-display font-black uppercase text-gaming-gold italic tracking-widest">Painel de Controle</h4>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Elimine usuários duplicados ou inativos para manter a ordem da aliança.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.filter(m => m.userId !== myMember?.userId).map(m => (
                  <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xs font-black text-white/30">{m.name.substring(0,2)}</div>
                        )}
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-white mb-1">{m.name}</span>
                           <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${getRoleBadgeColor(m.role)}`}>{getRoleLabel(m.role)}</span>
                        </div>
                     </div>
                     <button 
                        disabled={deletingId === m.id}
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className={`p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:scale-110 ${deletingId === m.id ? 'opacity-50 animate-pulse' : ''}`}
                        title="Eliminar Membro"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 mt-6`}>
        {[
          { 
            label: editingMember ? 'Parar Edição' : 'Editar Membros', 
            icon: Edit2, 
            action: () => setEditingMember(editingMember === 'all' ? null : 'all'), 
            hidden: !isLeader 
          },
          { 
            label: 'Novo Rank', 
            icon: UserPlus, 
            action: () => {
              const target = prompt('Digite o nome do jogador para promover:');
              if (target) {
                const member = members.find(m => m.name.toLowerCase() === target.toLowerCase());
                if (member) handlePromotion(member.id, member.role);
                else alert('Membro não encontrado.');
              }
            }, 
            hidden: !isLeader 
          },
          { label: 'Convidar', icon: Users, action: handleInvite },
          { label: 'Deslogar', icon: LogOut, danger: true, action: logout }
        ].filter(a => !a.hidden).map((action) => (
          <button 
            key={action.label}
            onClick={action.action}
            className={`bg-white/5 border border-white/10 rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest transition-all group ${action.danger ? 'hover:bg-red-500/10 hover:border-red-500/30' : 'hover:bg-white/10 hover:border-white/20'}`}
          >
            <action.icon size={12} className={`${action.danger ? 'text-red-500/50 group-hover:text-red-500' : 'text-gaming-gold/50 group-hover:text-gaming-gold'} transition-colors`} />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
        {isMobile && (
           <div className="col-span-2 flex items-center justify-center gap-1 mt-2 text-xs font-bold text-white/20 p-2">
             Página: <span className="text-white">1</span> 2 3 4 5
           </div>
        )}
      </div>
      {!isMobile && (
        <div className="flex items-center gap-1 justify-end mt-4 text-xs font-bold text-white/20">
           <span className="text-white">1</span> 2 3 4 5
        </div>
      )}
    </div>
  );
}
