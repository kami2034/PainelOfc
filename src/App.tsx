import React, { useState, useEffect } from 'react';
import { ClanProvider, useClan } from './context/ClanContext';
import { Login } from './components/Login';
import { ClanProfile } from './components/ClanProfile';
import { 
  GuiaView, 
  CombateView, 
  MapaView, 
  PerfilView, 
  ConfiguracoesView, 
  RewardsView,
  GerenciaView
} from './components/Views';
import { MissoesView } from './components/MissoesView';
import { LevelUpModal } from './components/LevelUpModal';
import { 
  Home, 
  Target, 
  BookOpen, 
  Sword, 
  Map as MapIcon, 
  User, 
  Settings, 
  Gift, 
  ShieldAlert,
  Loader2,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { 
    user, 
    loading, 
    activeTab, 
    setActiveTab, 
    myMember,
    isAdmin,
    completeMission,
    updateMemberData
  } = useClan();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Level Up Celebration
  const [showLevelUp, setShowLevelUp] = useState(false);
  const currentLevel = myMember?.level || 0;
  const lastCelebrated = myMember?.lastCelebratedLevel || 0;

  useEffect(() => {
    if (user && myMember && currentLevel > lastCelebrated) {
      setShowLevelUp(true);
    }
  }, [currentLevel, lastCelebrated, user, myMember]);

  const handleLevelUpClose = async () => {
    setShowLevelUp(false);
    if (myMember) {
      await updateMemberData({ lastCelebratedLevel: currentLevel });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg flex flex-col items-center justify-center p-6 text-white">
        <Loader2 className="w-12 h-12 text-gaming-gold animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando com a Ordem...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'missoes', label: 'Missões', icon: Target },
    { id: 'guia', label: 'Guia & Dicas', icon: BookOpen },
    { id: 'combate', label: 'Combate', icon: Sword },
    { id: 'mapa', label: 'Mapa', icon: MapIcon },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ id: 'gerencia', label: 'Liderança', icon: ShieldAlert });
  }

  const renderView = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8">
            <ClanProfile activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* The initial screen in the provided components seems to be handled here or inside ClanProfile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 space-y-6">
                  <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap size={120} />
                     </div>
                     <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">
                        Bem-vindo, <span className="text-gaming-gold">Guerreiro</span>
                     </h2>
                     <p className="text-white/60 font-bold uppercase italic leading-relaxed">
                        A Ordem Suprema aguarda suas conquistas. Esteja pronto para a próxima Raid e colabore com seus aliados para dominar o Reino.
                     </p>
                     <button 
                        onClick={() => setActiveTab('missoes')}
                        className="w-fit px-8 py-3 bg-gaming-gold text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg"
                     >
                        Ver Missões Atuais
                     </button>
                  </div>
               </div>
               <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 flex flex-col gap-6">
                  <h4 className="font-display font-black uppercase text-sm tracking-widest italic border-b border-white/5 pb-4">Status da Aliança</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/40">Membros Online</span>
                        <span className="text-sm font-black text-green-500">Ativo</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/40">Nível da Aliança</span>
                        <span className="text-sm font-black text-gaming-gold">Lvl 25</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'missoes': return <MissoesView />;
      case 'guia': return <GuiaView />;
      case 'combate': return <CombateView />;
      case 'mapa': return <MapaView />;
      case 'perfil': return <PerfilView />;
      case 'rewards': return <RewardsView />;
      case 'configuracoes': return <ConfiguracoesView />;
      case 'gerencia': return <GerenciaView />;
      default: return <div className="p-8">View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gaming-bg text-white font-sans flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 gaming-gradient opacity-30 pointer-events-none" />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-[100] px-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <ShieldAlert size={24} className="text-gaming-gold" />
            <span className="font-display font-black uppercase tracking-tighter italic text-sm">Ordem <span className="text-gaming-gold">Suprema</span></span>
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white/60">
            <Menu size={24} />
         </button>
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
         {isSidebarOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSidebarOpen(false)}
               className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            />
         )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-full w-[280px] bg-black/40 border-r border-white/5 backdrop-blur-2xl z-[300]
        transition-transform duration-500 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gaming-gold/10 rounded-xl flex items-center justify-center border border-gaming-gold/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                <ShieldAlert size={20} className="text-gaming-gold" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black uppercase italic tracking-tighter text-lg">Ordem</span>
                <span className="text-gaming-gold font-display font-black uppercase italic tracking-tighter text-lg">Suprema</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/40">
               <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                  if (item.id !== 'inicio') {
                      completeMission('explore_menus', 15);
                  }
                }}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-display font-black uppercase text-[10px] tracking-widest
                  ${activeTab === item.id 
                    ? 'bg-gaming-gold text-black shadow-[0_0_30px_rgba(251,191,36,0.2)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
             <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                <img 
                   src={myMember?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                   className="w-10 h-10 rounded-full object-cover border border-white/10" 
                   alt="Avatar"
                   referrerPolicy="no-referrer"
                />
                <div className="flex flex-col overflow-hidden">
                   <span className="text-[10px] font-black uppercase text-white truncate">{myMember?.name}</span>
                   <span className="text-[8px] font-bold uppercase text-white/30 tracking-widest truncate">{user?.email}</span>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pt-16 md:pt-0 overflow-y-auto custom-scrollbar h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal 
            level={currentLevel} 
            onClose={handleLevelUpClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ClanProvider>
      <AppContent />
    </ClanProvider>
  );
};

export default App;
