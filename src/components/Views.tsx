import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  Target, 
  Shield, 
  Zap, 
  Sword, 
  MapPin, 
  AlertTriangle, 
  Backpack, 
  Gem, 
  CheckCircle2, 
  User, 
  Trophy, 
  Star, 
  Settings, 
  Palette, 
  Trash2,
  Lock,
  Clock,
  Compass,
  Camera,
  ShoppingBag,
  CreditCard,
  Gift
} from 'lucide-react';
import { useClan } from '../context/ClanContext';

// --- COMBATE VIEW ---
export function CombateView() {
  return <DevelopmentView tab="combate" progress={90} />;
}

// --- INVENTARIO VIEW ---
export function InventarioView() {
  const { myMember, updateMemberData, isEcoMode } = useClan();
  
  const handleRedeemPass = () => {
    if (!myMember) return;
    if (myMember.premiumPass) {
       alert("Você já possui o Passe Premium!");
       return;
    }
    if (myMember.diamonds < 200) {
      alert("Você não tem diamantes suficientes! (Necessário: 200)");
      // For demo, let's allow adding diamonds
      if (confirm("Gostaria de adicionar 200 diamantes de bônus para testar?")) {
        updateMemberData({ diamonds: (myMember.diamonds || 0) + 200 });
      }
      return;
    }
    
    updateMemberData({ 
      diamonds: myMember.diamonds - 200,
      premiumPass: true
    });
    alert("Passe Premium resgatado com sucesso!");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">
          Seu <span className="text-gaming-gold">Inventário</span>
        </h2>
        <div className="flex items-center gap-3 bg-gaming-gold/10 border border-gaming-gold/20 px-4 py-2 rounded-xl">
           <Gem size={20} className="text-gaming-gold" />
           <span className="font-mono font-black text-gaming-gold">{myMember?.diamonds || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gaming-card/40 border border-gaming-border rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] border-dashed">
          <Backpack size={64} className="text-white/10 mb-4" />
          <p className="text-white/20 uppercase font-black text-[10px] tracking-[0.3em]">Mochila Vazia</p>
        </div>

        <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-gaming-gold/20 rounded-xl flex items-center justify-center text-gaming-gold border border-gaming-gold/30">
                <Star size={24} fill="currentColor" />
             </div>
             <div>
                <h4 className="font-display font-black uppercase text-sm">Passe Premium</h4>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Temporada 01</p>
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/60">
                <CheckCircle2 size={12} className="text-green-500" /> Recompensas Exclusivas
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/60">
                <CheckCircle2 size={12} className="text-green-500" /> Bônus de XP 50%
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/60">
                <CheckCircle2 size={12} className="text-green-500" /> Itens Lendários
             </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
             <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                <span className="text-white/40">Preço:</span>
                <span className="text-gaming-gold flex items-center gap-1"><Gem size={14} /> 200</span>
             </div>
             <button 
              onClick={handleRedeemPass}
              className={`w-full py-4 rounded-xl font-display font-black uppercase tracking-widest transition-all ${myMember?.premiumPass ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-gaming-gold shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}
             >
               {myMember?.premiumPass ? 'Ativado' : 'Resgatar Agora'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAPA VIEW ---
export function MapaView() {
  const { isEcoMode } = useClan();
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">
        Mapa do <span className="text-gaming-gold">Reino</span>
      </h2>

      <div className={`bg-gaming-card/40 border border-gaming-border rounded-3xl p-1 overflow-hidden relative min-h-[500px]`}>
         {!isEcoMode && (
           <>
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000')] bg-cover bg-center opacity-30 grayscale" />
             <div className="absolute inset-0 bg-gaming-bg/20 backdrop-blur-[2px]" />
           </>
         )}
         
         <div className="relative z-10 p-8 h-full flex flex-col">
            <div className={`bg-black/60 border border-white/10 p-6 rounded-2xl max-w-sm self-end ${isEcoMode ? '' : 'backdrop-blur-xl'}`}>
               <div className="flex items-center gap-3 mb-4">
                  <Skull className="text-red-500" />
                  <h4 className="font-display font-black uppercase text-lg">Próxima Raid</h4>
               </div>
               <div className="space-y-4">
                  <div>
                    <span className="text-[8px] uppercase font-black text-white/40 tracking-[0.2em] block mb-1">Localização Exata</span>
                    <div className="flex items-center gap-2 text-white">
                       <MapPin size={16} className="text-gaming-gold" />
                       <span className="text-sm font-bold uppercase">Setor 7 - Zona Industrial</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-black text-white/40 tracking-[0.2em] block mb-1">Como Chegar</span>
                    <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold">
                      Siga pela Rodovia Norte até o posto de controle abandonado. Entre nos túneis de manutenção e siga as marcações vermelhas do clã.
                    </p>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-black text-white/40 tracking-[0.2em] block mb-1">Estratégia</span>
                    <p className="text-[10px] text-gaming-gold leading-relaxed uppercase font-bold">
                      Necessário heróis com poder superior a 5000. Preparem tanques na linha de frente e snipers nos telhados sul.
                    </p>
                  </div>
               </div>
            </div>

            <div className="mt-auto flex gap-4">
               <div className={`p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
                  <Compass className="text-gaming-gold" />
                  <span className="text-xs font-black uppercase tracking-widest">Coordenadas: 45.2N / 12.8E</span>
               </div>
               <div className={`p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
                  <Clock className="text-gaming-gold" />
                  <span className="text-xs font-black uppercase tracking-widest">Início: 22:00 UTC</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// --- PERFIL VIEW ---
export function PerfilView() {
  const { myMember, user, updateMemberData, completeMission, isEcoMode } = useClan();
  const [editingPower, setEditingPower] = useState(false);
  const [newPower, setNewPower] = useState(myMember?.heroPower || 0);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateMemberData({ avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handlePowerUpdate = () => {
    updateMemberData({ heroPower: Number(newPower) });
    completeMission('edit_hero_power', 50);
    setEditingPower(false);
  };

  const stats = [
    { label: 'Conquistas', val: myMember?.trophies || 0, icon: Trophy, color: 'text-gaming-gold' },
    { label: 'Doações', val: myMember?.donations || 0, icon: Zap, color: 'text-blue-400' },
    { 
      label: 'Poder de Herói', 
      val: myMember?.heroPower || 0, 
      icon: Sword, 
      color: 'text-red-500',
      editable: true 
    },
    { label: 'Diamantes', val: 0, icon: Gem, color: 'text-gaming-gold' }
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 md:p-8">
         <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-gaming-gold/30 p-1 relative group bg-black/20 overflow-hidden">
            {!isEcoMode && <div className="absolute -inset-2 bg-gaming-gold/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />}
            <img 
              src={myMember?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
              alt="Avatar" 
              className="w-full h-full rounded-2xl object-cover relative z-10"
              referrerPolicy="no-referrer"
            />
            <button 
              className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-gaming-gold gap-2 pointer-events-none"
            >
              <Camera size={24} />
              <span className="text-[8px] font-black uppercase tracking-widest">Alterar Foto</span>
            </button>
            <input 
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 z-30 cursor-pointer"
            />
         </div>
         <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2 flex-1">
            <span className="text-[10px] uppercase font-black text-gaming-gold tracking-[0.4em]">Guerreiro de Elite</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter">{myMember?.name || 'Recruta'}</h2>
            <p className="text-white/40 text-[10px] md:text-xs uppercase font-bold tracking-[0.2em]">{user?.email}</p>
            <div className="flex gap-2 mt-4 flex-wrap justify-center lg:justify-start">
               {myMember?.premiumPass && (
                 <span className="px-3 py-1 bg-gaming-gold text-black rounded-full text-[9px] font-black uppercase tracking-widest">Premium</span>
               )}
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">Nv. {myMember?.level || 0}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
         {stats.map(s => (
           <div 
            key={s.label} 
            onClick={() => s.editable && setEditingPower(true)}
            className={`bg-gaming-card/40 border border-gaming-border rounded-2xl p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 hover:border-gaming-gold/50 transition-all ${s.editable ? 'cursor-pointer' : ''}`}
           >
              <s.icon className={s.color} size={20} />
              <div className="text-center w-full">
                 <span className="text-[7px] md:text-[8px] uppercase font-black text-white/30 tracking-widest block">{s.label}</span>
                 {s.editable && editingPower ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="number"
                        value={newPower}
                        onChange={(e) => setNewPower(Number(e.target.value))}
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-mono text-center outline-none focus:border-gaming-gold transition-colors"
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePowerUpdate(); }}
                        className="bg-gaming-gold text-black p-1 rounded text-[8px]"
                      >
                        OK
                      </button>
                    </div>
                 ) : (
                    <span className="text-lg md:text-2xl font-mono font-black">{s.val.toLocaleString()}</span>
                 )}
                 {s.editable && !editingPower && (
                   <span className="text-[6px] uppercase text-gaming-gold/50 block mt-1">Clique para editar</span>
                 )}
              </div>
           </div>
         ))}
      </div>

      <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] border-dashed">
         <Trophy size={48} className="text-white/10 mb-4" />
         <h4 className="font-display font-black uppercase text-lg text-white/20">Registro de Conquistas</h4>
         <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.3em] mt-2">Em Desenvolvimento</p>
      </div>
    </div>
  );
}

// --- CONFIGURACOES VIEW ---
export function ConfiguracoesView() {
  const { logout, myMember, updateMemberData, isEcoMode, toggleEcoMode, isOptimizing } = useClan();

  const handleThemeChange = (theme: 'dark' | 'neon' | 'gold' | 'classic') => {
    updateMemberData({ appTheme: theme });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMemberData({ opacityLevel: Number(e.target.value) });
  };

  const handleDeleteAccount = () => {
    if (confirm("TEM CERTEZA? Esta ação é irreversível e você perderá todo o seu progresso na Aliança Suprema.")) {
       alert("Funcionalidade em desenvolvimento seguro. Contate um administrador para remoção manual de dados por enquanto.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">
        Configurações do <span className="text-gaming-gold">Sistema</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Optimization Section */}
        <div className="col-span-1 lg:col-span-2 bg-linear-to-br from-gaming-purple/20 to-transparent border border-gaming-purple/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden group">
           <div className={`p-4 rounded-2xl bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/30 group-hover:scale-110 transition-transform ${isOptimizing ? 'animate-spin' : ''}`}>
              <Zap size={32} fill="currentColor" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h4 className="font-display font-black uppercase text-xl mb-1 italic flex items-center gap-2">
                Modo de Performance
                <span className="bg-gaming-gold/20 text-gaming-gold text-[8px] px-2 py-0.5 rounded-full border border-gaming-gold/30">BETA</span>
              </h4>
              <p className="text-[10px] sm:text-xs text-white/50 uppercase font-black tracking-widest leading-relaxed">
                {isEcoMode 
                  ? "Modo de Otimização ATIVO. Gráficos simplificados para dispositivos mais humildes."
                  : "Desfrute de toda a glória visual da Aliança Suprema (Recomendado para PC/Celulares Tops)."}
              </p>
           </div>
           <button 
             onClick={toggleEcoMode}
             disabled={isOptimizing}
             className={`px-8 py-4 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all relative overflow-hidden flex items-center gap-2 ${
               isEcoMode 
                ? 'bg-gaming-gold text-black hover:bg-white' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30'
             }`}
           >
              {isOptimizing ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Otimizando...</span>
                </>
              ) : isEcoMode ? (
                <>
                  <Zap size={14} fill="currentColor" />
                  <span>Restaurar Qualidade Máxima</span>
                </>
              ) : (
                <span>Otimizar para Celular Fraco</span>
              )}
           </button>
        </div>

        <div className="bg-gaming-card/40 border border-gaming-border rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-xl">
           <div className="flex items-center gap-3">
              <Palette className="text-gaming-gold" />
              <h4 className="font-display font-black uppercase tracking-widest text-sm">Personalização & Visual</h4>
           </div>
           
           <div className="space-y-8">
              <div>
                 <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] block mb-4">Esquema de Cores</span>
                 <div className="grid grid-cols-2 gap-2">
                    {['dark', 'neon', 'gold', 'classic'].map(t => (
                      <button 
                        key={t}
                        onClick={() => handleThemeChange(t as any)}
                        className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${myMember?.appTheme === t ? 'bg-gaming-gold text-black border-gaming-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Opacidade da Interface</span>
                    <span className="text-xs font-mono text-gaming-gold">{myMember?.opacityLevel || 80}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="10"
                    max="100"
                    value={myMember?.opacityLevel || 80}
                    onChange={handleOpacityChange}
                    className="w-full accent-gaming-gold bg-white/10 rounded-full h-2 appearance-none cursor-pointer" 
                 />
              </div>
           </div>
        </div>

        <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-8 flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <Settings className="text-gaming-gold" />
              <h4 className="font-display font-black uppercase">Conta & Segurança</h4>
           </div>
           
           <div className="space-y-4 flex-1">
              <button 
                onClick={logout}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Encerrar Sessão
              </button>

              <div className="pt-6 mt-6 border-t border-white/5">
                <h5 className="text-[10px] uppercase font-black text-red-500 tracking-widest mb-4">Zona de Risco</h5>
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Deletar Conta Definitivamente
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- REWARDS VIEW ---
export function RewardsView() {
  const { myMember, updateMemberData, isEcoMode } = useClan();

  const [purchaseStatus, setPurchaseStatus] = useState<{ id: string, message: string, type: 'success' | 'error' } | null>(null);

  const handleClaim = (reward: any) => {
    if (reward.inDevelopment) {
      setPurchaseStatus({ id: reward.id, message: "Este item está em desenvolvimento!", type: 'error' });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    if (!myMember) return;
    
    if (myMember.diamonds < reward.price) {
      setPurchaseStatus({ id: reward.id, message: `Saldo insuficiente! Falta ${reward.price - myMember.diamonds} diamantes.`, type: 'error' });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    if (reward.id.includes('pass') && myMember.premiumPass) {
      setPurchaseStatus({ id: reward.id, message: "Você já possui um Passe Premium ativo!", type: 'error' });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    const updates: any = {
      diamonds: myMember.diamonds - reward.price
    };

    if (reward.id.includes('pass')) {
      updates.premiumPass = true;
    }

    updateMemberData(updates);
    setPurchaseStatus({ id: reward.id, message: `Resgatado com sucesso!`, type: 'success' });
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  const rewards = [
    { 
      id: 'weekly_pass', 
      title: 'Passe Premium Semanal', 
      desc: 'Acesso total aos benefícios premium por 7 dias.', 
      price: 100, 
      icon: Star,
      rarity: 'Raro'
    },
    { 
      id: 'monthly_pass', 
      title: 'Passe Premium Mensal', 
      desc: 'O pack definitivo de benefícios premium por 30 dias.', 
      price: 500, 
      icon: Shield,
      rarity: 'Lendário'
    },
    { 
      id: 'gift_card_50', 
      title: 'Gift Card R$ 50', 
      desc: 'Cartão presente de R$ 50 para usar como quiser.', 
      price: 1000, 
      icon: CreditCard,
      rarity: 'Místico'
    },
    { 
      id: 'clan_merch', 
      title: 'Kit Aliança (Camisa + Caneca)', 
      desc: 'Mostre seu orgulho com o kit oficial personalizado.', 
      price: 200, 
      icon: ShoppingBag,
      rarity: 'Exclusivo',
      inDevelopment: true
    }
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4`}>
        <div>
           <span className="text-[10px] uppercase font-black text-gaming-gold tracking-[0.4em] mb-1 block">Mercado Negro</span>
           <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter">
             Central de <span className="text-gaming-gold">Recompensas</span>
           </h2>
        </div>
        <div className={`flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
           <Gem size={20} className="text-gaming-gold" />
           <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-white/30 tracking-widest">Seu Saldo</span>
              <span className="font-mono font-black text-gaming-gold text-lg leading-none">{myMember?.diamonds || 0}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {rewards.map((reward) => (
           <motion.div 
            key={reward.id}
            whileHover={!isEcoMode ? { y: -5 } : {}}
            className={`group relative bg-gaming-card/40 border border-gaming-border rounded-[2.5rem] p-6 flex flex-col gap-6 overflow-hidden transition-all hover:bg-gaming-card/60 hover:border-gaming-gold/30 ${isEcoMode ? '' : 'backdrop-blur-md'}`}
           >
              {reward.inDevelopment && (
                <div className={`absolute inset-0 bg-black/60 z-20 flex items-center justify-center rotate-[-15deg] scale-125 pointer-events-none ${isEcoMode ? '' : 'backdrop-blur-[2px]'}`}>
                   <span className="bg-gaming-gold text-black px-8 py-2 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl">Em Desenvolvimento</span>
                </div>
              )}

              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-gaming-gold group-hover:border-gaming-gold/50 transition-all shadow-inner`}>
                       <reward.icon size={32} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5 text-white/40">{reward.rarity}</span>
                 </div>

                 <h4 className="font-display font-black uppercase text-xl mb-2 leading-tight group-hover:text-gaming-gold transition-colors">{reward.title}</h4>
                 <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-wider min-h-[40px] italic">{reward.desc}</p>
              </div>

              <div className="mt-auto relative z-10 pt-6 border-t border-white/5 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Valor</span>
                    <div className="flex items-center gap-1.5">
                       <Gem size={14} className="text-gaming-gold" />
                       <span className="font-mono font-black text-gaming-gold">{reward.price}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleClaim(reward)}
                  className={`w-full py-4 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden ${
                    reward.inDevelopment 
                      ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-gaming-gold hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] active:scale-95'
                  }`}
                 >
                   <AnimatePresence mode="wait">
                     {purchaseStatus?.id === reward.id ? (
                       <motion.span 
                        key="status"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className={`absolute inset-0 flex items-center justify-center text-[8px] sm:text-[10px] px-2 text-center text-wrap ${purchaseStatus.type === 'success' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
                       >
                         {purchaseStatus.message}
                       </motion.span>
                     ) : (
                       <motion.span key="label">Resgatar</motion.span>
                     )}
                   </AnimatePresence>
                 </button>
              </div>

              {/* Decorative Background Icon */}
              {!isEcoMode && <reward.icon size={120} className="absolute -right-8 -bottom-8 text-white/[0.02] -rotate-12 group-hover:scale-110 transition-transform duration-700" />}
           </motion.div>
         ))}
      </div>

      <div className="bg-linear-to-r from-gaming-purple/10 to-transparent border border-gaming-purple/20 rounded-3xl p-8 flex items-center gap-6 mt-4">
         <div className="hidden md:flex w-20 h-20 bg-gaming-purple/20 rounded-full items-center justify-center text-gaming-purple flex-shrink-0 animate-pulse border border-gaming-purple/30">
            <Gift size={40} />
         </div>
         <div>
            <h5 className="font-display font-black uppercase text-lg mb-1 italic">Eventos de Recarga</h5>
            <p className="text-xs text-white/50 uppercase font-black tracking-widest">Fique atento ao nosso Whatsapp para eventos especiais onde você pode ganhar diamantes em dobro e recompensas exclusivas por tempo limitado.</p>
         </div>
      </div>
    </div>
  );
}

// --- DEVELOPMENT VIEW HELPER ---
export function DevelopmentView({ tab, progress = 65 }: { tab: string, progress?: number }) {
  const tabNames: Record<string, string> = {
    combate: 'Modo Combate',
    missoes: 'Quadro de Missões',
    social: 'Área Social',
    territorios: 'Territórios',
    batalha: 'Batalha de Clã',
    historico: 'Histórico de Guerras'
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-12">
      <div className="w-20 h-20 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
        <Lock className="text-gaming-gold" size={32} />
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-widest mb-4">
        {tabNames[tab] || 'Em Desenvolvimento'}
      </h2>
      <p className="text-white/40 max-w-sm uppercase text-[9px] md:text-[10px] tracking-[0.2em] font-bold leading-relaxed">
        A área de {tabNames[tab] || tab} está sendo sincronizada com o servidor principal da Aliança Suprema Ordem. Retorne em breve.
      </p>
      <div className="mt-8 flex gap-4">
         <div className="px-4 py-2 bg-gaming-gold/5 border border-gaming-gold/20 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-gaming-gold">Progresso: {progress}%</div>
         <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Stable: V0.9</div>
      </div>
    </div>
  );
}
