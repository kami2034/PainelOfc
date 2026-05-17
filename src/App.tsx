import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ClanProfile } from './components/ClanProfile';
import { BaseStats, DetailedStats } from './components/Stats';
import { MemberList } from './components/MemberList';
import { Login } from './components/Login';
import { NicknameSelector } from './components/NicknameSelector';
import { useClan } from './context/ClanContext';
import { motion, AnimatePresence } from 'motion/react';
import { useDevice } from './hooks/useDevice';
import { Monitor, Smartphone, RefreshCw, Loader2, ShieldAlert, LogOut } from 'lucide-react';
import { LevelUpModal } from './components/LevelUpModal';
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { 
  CombateView, 
  InventarioView, 
  MapaView, 
  PerfilView, 
  ConfiguracoesView, 
  DevelopmentView,
  RewardsView,
  GerenciaView,
  GuiaView
} from './components/Views';
import { MissoesView } from './components/MissoesView';

export default function App() {
  const { isMobile, viewMode, setViewMode } = useDevice();
  const { user, loading, clan, members, myMember, isOptimizing, isEcoMode, updateMemberData, logout } = useClan();
  const [activeTab, setActiveTab ] = useState('inicio');
  const [initializing, setInitializing] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (myMember?.level && myMember.level > (myMember.lastCelebratedLevel || 0)) {
      setShowLevelUp(true);
    }
  }, [myMember?.level, myMember?.lastCelebratedLevel]);

  const handleCloseLevelUp = () => {
    setShowLevelUp(false);
    if (myMember) {
      updateMemberData({ lastCelebratedLevel: myMember.level });
    }
  };

  const isMember = user && members.some(m => m.userId === user.uid);

  const handleInitClan = async () => {
    if (!user) return;
    setInitializing(true);
    try {
      const { createInitialClan } = await import('./services/clanService');
      await createInitialClan(user.uid, user.email);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  };

  const handleJoinClan = async (nickname: string) => {
    if (!user) return;
    setInitializing(true);
    try {
      const { joinClan } = await import('./services/clanService');
      await joinClan(user.uid, nickname, user.email);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div 
            key="inicio-view"
            initial={!isEcoMode ? { opacity: 0, scale: 0.98 } : { opacity: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={!isEcoMode ? { opacity: 0, scale: 0.98 } : { opacity: 1 }}
            className={`flex flex-col gap-4 md:gap-6 flex-1`}
          >
            {/* Top Section - Clan Info (Always visible on Inicio) */}
            <div className={isMobile ? 'w-full' : 'col-span-12'}>
              <ClanProfile 
                isMobile={isMobile} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>

            <div className={isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-12 gap-6'}>
              {/* Stats Section */}
              <div className={isMobile ? 'grid grid-cols-1 gap-4' : 'col-span-12 lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                <BaseStats isMobile={isMobile} />
                <DetailedStats isMobile={isMobile} />
              </div>

              {/* Member List Section */}
              <div id="member-list-section" className={isMobile ? 'w-full pb-8' : 'col-span-12 lg:col-span-6'}>
                <MemberList isMobile={isMobile} />
              </div>
            </div>
          </motion.div>
        );
      case 'combate':
        return <CombateView />;
      case 'inventario':
        return <InventarioView />;
      case 'mapa':
        return <MapaView />;
      case 'perfil':
        return <PerfilView />;
      case 'configuracoes':
        return <ConfiguracoesView />;
      case 'missoes':
        return <MissoesView />;
      case 'recompensas':
        return <RewardsView />;
      case 'guia':
        return <GuiaView />;
      case 'gerencia':
        return <GerenciaView />;
      case 'batalha':
      case 'historico':
      case 'territorios':
      case 'territorio':
      case 'social':
        return <DevelopmentView tab={activeTab} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white/20">Selecione uma aba</h2>
          </div>
        );
    }
  };

  const [wasMember, setWasMember] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (isMember) {
        setWasMember(true);
      } else if (wasMember === true) {
        // Was a member, but now is not. Likely expelled or left.
        logout();
      }
    }
  }, [isMember, wasMember, user, loading, logout]);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'bans', user.uid)).then(snap => {
        if (snap.exists()) setIsBanned(true);
      }).catch(() => {});

      // Presence management
      const updateStatus = async (status: 'online' | 'away' | 'offline') => {
        try {
          const memberRef = doc(db, 'clans', 'main-clan', 'members', user.uid);
          const { updateDoc } = await import('firebase/firestore');
          await updateDoc(memberRef, { status });
        } catch (err) {
          // Fail silently
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          updateStatus('online');
        } else {
          updateStatus('away');
        }
      };

      // Set online on load
      updateStatus('online');
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Set offline on close
      const handleUnload = () => {
        // Use synchronous update or navigator.sendBeacon pattern if possible, 
        // but for Firestore we just attempt a fire-and-forget.
        updateStatus('offline');
      };

      window.addEventListener('beforeunload', handleUnload);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleUnload);
        updateStatus('offline');
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <Loader2 className="text-gaming-gold animate-spin" size={48} />
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="text-red-500" size={48} />
         </div>
         <h1 className="text-4xl font-display font-black uppercase mb-4 italic text-red-500">Acesso <span className="text-white">Negado</span></h1>
         <p className="text-white/40 max-w-sm uppercase text-[10px] tracking-[0.2em] font-bold mb-12 leading-relaxed">
           Você foi banido permanentemente da Aliança Suprema Ordem por quebra de conduta ou decisão da liderança. 
         </p>
         <button 
          onClick={() => logout()}
          className="px-12 py-4 bg-white text-black rounded-xl font-display font-black uppercase tracking-widest hover:bg-red-500 transition-all"
         >
           Sair do Sistema
         </button>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!clan) {
    const isLeader = user.email === 'ryankevyn3000@gmail.com';
    
    return (
      <div className="min-h-screen bg-gaming-bg flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full flex items-center justify-center mb-8">
            <RefreshCw className="text-gaming-gold" size={40} />
         </div>
         <h1 className="text-4xl font-display font-black uppercase mb-4 italic">Aliança <span className="text-gaming-gold">Suprema Ordem</span></h1>
         <p className="text-white/40 max-w-sm uppercase text-[10px] tracking-[0.2em] font-bold mb-12 leading-relaxed">
           {isLeader ? 'Você é o líder. Inicialize a aliança oficial para seus guerreiros.' : 'A aliança oficial está sendo sincronizada. Aguarde o líder.'}
         </p>
         <div className="flex flex-col gap-4 w-full max-w-xs">
           {isLeader ? (
             <button 
              onClick={handleInitClan}
              disabled={initializing}
              className="w-full py-4 bg-gaming-gold text-black rounded-xl font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] disabled:opacity-50"
             >
               {initializing ? 'Inicializando...' : 'Ativar Aliança Suprema'}
             </button>
           ) : (
             <button 
               onClick={() => window.location.reload()}
               className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-display font-black uppercase tracking-widest hover:bg-white/10 transition-all"
             >
               Tentar Sincronizar
             </button>
           )}
           
           <button 
            onClick={() => logout()}
            className="w-full py-2 text-white/20 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
           >
             <LogOut size={12} /> Sair da conta
           </button>
         </div>
      </div>
    );
  }

  if (!isMember) {
    return (
      <NicknameSelector 
        onSelect={handleJoinClan} 
        loading={initializing} 
      />
    );
  }

  return (
    <div 
      data-theme={myMember?.appTheme || 'dark'}
      style={{ '--ui-opacity': (myMember?.opacityLevel || 80) / 100 } as React.CSSProperties}
      className={`flex min-h-screen bg-gaming-bg text-white selection:bg-gaming-gold/30 overflow-x-hidden font-sans ${isMobile ? 'flex-col' : 'flex-row'} ${isEcoMode ? 'eco-mode' : ''}`}
    >
      {/* View Mode Toggle */}
      <div className="fixed top-4 left-4 z-[100] flex gap-1 bg-gaming-card/80 backdrop-blur-md p-1 rounded-xl border border-gaming-border shadow-2xl">
        <button 
          onClick={() => setViewMode('auto')}
          className={`p-2 rounded-lg transition-all ${viewMode === 'auto' ? 'bg-gaming-gold text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          title="Automático"
        >
          <RefreshCw size={16} />
        </button>
        <button 
          onClick={() => setViewMode('desktop')}
          className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-gaming-gold text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          title="Desktop"
        >
          <Monitor size={16} />
        </button>
        <button 
          onClick={() => setViewMode('mobile')}
          className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-gaming-gold text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          title="Celular"
        >
          <Smartphone size={16} />
        </button>
      </div>

      <Sidebar isMobile={isMobile} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className={`flex-1 flex flex-col gaming-gradient min-h-screen transition-all duration-500 ${!isMobile ? 'ml-16' : 'pb-20'}`}>
        <Header isMobile={isMobile} />
        
        <div className={`flex-1 flex flex-col gap-6 ${isMobile ? 'px-4' : 'px-8 pb-8'}`}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>

        {/* Floating Background Effects */}
        {!isEcoMode && (
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-gaming-purple/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-gaming-gold/5 rounded-full blur-[100px]" />
          </div>
        )}

        <AnimatePresence>
          {isOptimizing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
            >
               <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-t-4 border-r-4 border-gaming-gold rounded-full mb-8 shadow-[0_0_50px_rgba(251,191,36,0.3)]"
               />
               <h2 className="text-3xl font-display font-black uppercase italic tracking-widest text-white mb-2">Sincronizando Poder</h2>
               <p className="text-gaming-gold font-bold uppercase text-[10px] tracking-[0.4em] animate-pulse">Otimizando sua experiência suprema...</p>
               
               <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full bg-gaming-gold"
                  />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLevelUp && (
            <LevelUpModal level={myMember?.level || 0} onClose={handleCloseLevelUp} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
