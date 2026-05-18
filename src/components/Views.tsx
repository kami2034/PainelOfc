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
  Gift,
  ShieldCheck,
  ShieldAlert,
  Plus,
  UserPlus,
  Edit2,
  Users,
  Newspaper,
  BookOpen,
  Anchor,
  Crown,
  ChevronRight,
  MessageSquareWarning,
  Image as ImageIcon,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { useClan } from '../context/ClanContext';

// --- SHARED UTILS ---
const compressImage = (base64: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

// --- GUIA VIEW ---
export function GuiaView() {
  const { isEcoMode, myMember, clan, updateClanGuideImage, reportTheft, user, activeSubTab, setActiveSubTab } = useClan();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [showTheftReported, setShowTheftReported] = useState(false);

  const isLeader = myMember?.role === 'leader' || user?.email === 'ryankevyn2020@gmail.com' || user?.email === 'ryankevyn3000@gmail.com';
  // Heuristic: If guideImagePost1 is a data URL, it's likely the logo used as fallback. Use default guide image instead.
  const displayImage = (clan?.guideImagePost1 && !clan?.guideImagePost1.startsWith('data:image')) 
    ? clan.guideImagePost1 
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLeader) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const compressed = await compressImage(event.target.result as string, 800, 800, 0.5);
          updateClanGuideImage(compressed);
        } catch (err) {
          console.error('Error compressing guide image:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  if (selectedGuide === 'evoluir') {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-8 max-w-4xl mx-auto w-full pb-20">
        <button 
          onClick={() => setSelectedGuide(null)}
          className="flex items-center gap-2 text-gaming-gold font-black uppercase text-[10px] tracking-widest hover:translate-x-[-4px] transition-transform w-fit"
        >
          <ArrowLeft size={16} /> Voltar ao Guia
        </button>

        <div className="bg-gaming-card/40 border border-gaming-border rounded-[2.5rem] p-8 md:p-12 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
          {!isEcoMode && (
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap size={120} />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter">
              Como Evoluir <span className="text-gaming-gold">Rápido no Jogo</span>
            </h2>
          </div>

          {/* Post Tabs Selection */}
          <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
             <button className="px-6 py-2 bg-gaming-gold text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">Post #1: Missões</button>
             <button className="px-6 py-2 bg-white/5 border border-white/10 text-white/40 rounded-full font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap cursor-not-allowed">Post #2: Em Breve</button>
          </div>

          <div className="flex flex-col gap-10">
             {/* Post 1 Content */}
             <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                   <h4 className="font-display font-black uppercase text-2xl text-gaming-gold italic flex items-center gap-3">
                      <Zap size={24} fill="currentColor" /> 
                      Post 1: Missões Diárias
                   </h4>
                   <p className="text-base text-white/80 font-bold uppercase italic leading-relaxed tracking-wide">
                      A interação mais importante ao logar. É através dela que você garante itens cruciais para o seu desenvolvimento acelerado.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-gaming-gold/20 transition-all">
                      <span className="text-gaming-gold font-black text-[10px] uppercase tracking-widest block mb-2">⚡ Aceleradores de Construção</span>
                      <p className="text-xs text-white/40 uppercase font-bold italic leading-relaxed">Fundamental para garantir que suas melhorias de base sejam concluídas em tempo recorde.</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-gaming-gold/20 transition-all">
                      <span className="text-gaming-gold font-black text-[10px] uppercase tracking-widest block mb-2">🐀 Isca de Rato</span>
                      <p className="text-xs text-white/40 uppercase font-bold italic leading-relaxed">Item vital para o evento "Caça ao Rato". Será melhor explicado no quadro de missões antes da Raid.</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-gaming-gold/20 transition-all">
                      <span className="text-gaming-gold font-black text-[10px] uppercase tracking-widest block mb-2">🐦 Essência de Corvo</span>
                      <p className="text-xs text-white/40 uppercase font-bold italic leading-relaxed">Recurso necessário para realizar o upgrade do Corvo na Cabana do Corvo.</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-gaming-gold/20 transition-all">
                      <span className="text-gaming-gold font-black text-[10px] uppercase tracking-widest block mb-2">💎 Diamantes</span>
                      <p className="text-xs text-white/40 uppercase font-bold italic leading-relaxed">Recurso final necessário para recursos avançados. Não gaste à toa no jogo!</p>
                   </div>
                </div>

                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                      <AlertTriangle size={64} />
                   </div>
                   <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={20} className="text-red-500" />
                      <span className="text-[12px] text-red-500 font-black uppercase tracking-[0.3em]">RECOMENDAÇÃO DO LÍDER</span>
                   </div>
                   <p className="text-sm text-white/60 font-bold uppercase italic leading-relaxed">
                      "Mantenha o foco em acumular diamantes. Eles serão seu maior trunfo para dominar recursos em fases mais avançadas da guerra."
                   </p>
                </div>

                {/* Single Visual Support Image at the bottom */}
                <div className="flex flex-col gap-4 mt-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em]">Referência Visual: Menu de Missões</span>
                      {isLeader && <span className="text-[8px] text-gaming-gold font-black uppercase italic">Toque na imagem para alterar permanentemente</span>}
                   </div>
                   <div className="aspect-video md:h-[400px] rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/40 group relative">
                      <img src={displayImage} alt="Guia de Missões" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      {isLeader && (
                        <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-4">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                              <ImageIcon size={32} className="text-gaming-gold" />
                           </div>
                           <div className="text-center">
                              <span className="text-xs font-black uppercase tracking-[0.2em] text-white block">Substituir Imagem</span>
                              <span className="text-[8px] font-bold text-white/40 uppercase">Formatos: JPG, PNG, WEBP</span>
                           </div>
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full pb-20">
      <AnimatePresence>
        {showTheftReported && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-green-500 text-black rounded-full font-black uppercase text-xs tracking-widest shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center gap-3"
          >
            <CheckCircle2 size={18} /> Denúncia Enviada aos Líderes
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gaming-gold/20 rounded-lg text-gaming-gold border border-gaming-gold/30">
                 <BookOpen size={16} />
              </div>
              <span className="text-[10px] uppercase font-black text-gaming-gold tracking-[0.4em]">Codex da Aliança</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none">
             Guia & <span className="text-gaming-gold">Dicas Estratégicas</span>
           </h2>
        </div>
        <div className={`flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
           <div className={`w-2 h-2 rounded-full bg-green-500 ${isEcoMode ? '' : 'animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Manual Atualizado v2.5</span>
        </div>
      </div>

      {/* Guia Tabs Swiper */}
      <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveSubTab('guias')}
          className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'guias' ? 'bg-gaming-gold text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          Guias Oficiais
        </button>
        <button 
          onClick={() => setActiveSubTab('avisos')}
          className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeSubTab === 'avisos' ? 'bg-gaming-gold text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          Avisos
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
        </button>
      </div>

      {activeSubTab === 'avisos' ? (
        <motion.div 
          initial={isEcoMode ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a] border-2 border-red-600/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <Skull size={400} className="absolute -bottom-20 -right-20 text-red-600" />
          </div>

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-red-500 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
                <AlertTriangle size={14} /> ALERTA DE MOBILIZAÇÃO
              </span>
              <h3 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter text-white">
                GUERRA ENTRA <span className="text-red-600">SERVIDORES</span>
              </h3>
            </div>

            <div className="p-8 bg-red-600/5 border border-red-600/20 rounded-3xl">
              <p className="text-lg text-white/80 font-bold uppercase italic leading-relaxed">
                ESTAMOS PREPARANDO UM GUIA COMPLETO PARA DOMINAR A LUTA DE GUERRA ENTRE SERVIDORES. 
                SAIBA EXATAMENTE QUAIS MISSÕES FAZER POR DIA PARA DERROTAR QUALQUER OUTRO REINO.
              </p>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-16 h-16 bg-gaming-gold/20 rounded-full flex items-center justify-center text-gaming-gold animate-pulse">
                <Clock size={32} />
              </div>
              <div>
                <h4 className="font-display font-black uppercase text-xl text-gaming-gold italic">LANÇAMENTO IMINENTE</h4>
                <p className="text-sm text-white/40 font-bold uppercase italic">Será entregue completo amanhã de manhã (v6.0 ALPHA).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
              <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block mb-2">🔒 MISSÃO DIÁRIA</span>
                <p className="text-xs font-bold uppercase italic text-white/20">Aguardando dados estratégicos...</p>
              </div>
              <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block mb-2">🔒 PONTOS DE ATAQUE</span>
                <p className="text-xs font-bold uppercase italic text-white/20">Aguardando dados estratégicos...</p>
              </div>
              <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block mb-2">🔒 ESTRATÉGIA SERVER</span>
                <p className="text-xs font-bold uppercase italic text-white/20">Aguardando dados estratégicos...</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
      {/* Main Feature: Breaking News Portal */}
      <div 
        onClick={() => setSelectedGuide('evoluir')}
        className="relative group overflow-hidden rounded-[2.5rem] bg-gaming-card border border-white/10 h-[300px] md:h-[450px] cursor-pointer"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599394022918-6c276a570aba?q=80&w=2070')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute top-0 right-0 p-8">
           <div className="px-4 py-2 bg-gaming-gold text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl animate-bounce">
              🔥 TOP DICA
           </div>
        </div>

        <div className="absolute bottom-0 left-0 p-8 md:p-12 flex flex-col gap-4">
           <div className="flex gap-3">
              <span className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Destaque</span>
              <span className="px-3 py-1 bg-white/10 text-white/60 text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10 backdrop-blur-md">Iniciante</span>
           </div>
           <h3 className="text-3xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none max-w-2xl">
              COMO EVOLUIR <span className="text-gaming-gold">RECORDISTA!</span>
           </h3>
           <p className="text-xs md:text-lg text-white/80 font-bold uppercase italic max-w-xl leading-relaxed">
              Descubra o ciclo perfeito de missões diárias e o uso inteligente de diamantes para dominar o servidor em tempo recorde.
           </p>
           <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest group-hover:bg-gaming-gold transition-colors">
                 Abrir Guia <ChevronRight size={16} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Guide Item 1: Táticas de Batalha */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative group overflow-hidden bg-gaming-card/30 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 transition-all cursor-not-allowed shadow-2xl"
        >
           <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />
           
           <div className="absolute top-6 right-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-blue-400">Desenvolvimento</span>
              </div>
           </div>
           
         <div className={`w-20 h-20 bg-linear-to-br from-blue-600/30 to-blue-900/10 rounded-[2rem] flex items-center justify-center text-blue-400 ${isEcoMode ? '' : 'group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]'} transition-all border border-blue-500/30 relative overflow-hidden`}>
              {!isEcoMode && <div className="absolute inset-0 bg-linear-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
              <Sword size={40} className="relative z-10" />
           </div>
           
           <div className="relative z-10">
              <h4 className="font-display font-black uppercase text-3xl mb-3 italic text-white group-hover:text-blue-300 transition-colors tracking-tighter">Táticas de <br /><span className="text-blue-500">Batalha ⚔️</span></h4>
              <p className="text-xs text-white/40 uppercase font-bold leading-relaxed italic group-hover:text-white/60 transition-colors">
                Estratégias avançadas de mobilização rápida e contra-ataque cirúrgico para suprimir defesas inimigas.
              </p>
           </div>
           
           <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center text-blue-400/30 text-[9px] font-black uppercase tracking-[0.2em] gap-2">
                 Protocolos Militares <ChevronRight size={14} />
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/10 group-hover:text-blue-500/40 transition-colors">
                <Zap size={18} />
              </div>
           </div>

           {/* Stylized progress track */}
           <div className="absolute bottom-6 left-10 right-10 flex flex-col gap-2">
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  className="h-full bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
           </div>
        </motion.div>

        {/* Guide Item 2: Farm de Diamantes */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative group overflow-hidden bg-gaming-card/30 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 transition-all cursor-not-allowed shadow-2xl"
        >
           <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-gaming-gold/40 to-transparent" />

           <div className="absolute top-6 right-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-gaming-gold rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-gaming-gold">Desenvolvimento</span>
              </div>
           </div>

         <div className={`w-20 h-20 bg-linear-to-br from-gaming-gold/30 to-gaming-gold/10 rounded-[2rem] flex items-center justify-center text-gaming-gold ${isEcoMode ? '' : 'group-hover:scale-110 group-hover:-rotate-6 shadow-[0_0_40px_rgba(251,191,36,0.15)]'} transition-all border border-gaming-gold/30 relative overflow-hidden`}>
              {!isEcoMode && <div className="absolute inset-0 bg-linear-to-t from-gaming-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
              <Gem size={40} className="relative z-10" />
           </div>

           <div className="relative z-10">
              <h4 className="font-display font-black uppercase text-3xl mb-3 italic text-white group-hover:text-gaming-gold transition-colors tracking-tighter">Farm de <br /><span className="text-gaming-gold">Diamantes 💎</span></h4>
              <p className="text-xs text-white/40 uppercase font-bold leading-relaxed italic group-hover:text-white/60 transition-colors">
                Metodologias de extração máxima de recursos e otimização de rotas para acumular riqueza lendária.
              </p>
           </div>

           <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center text-gaming-gold/30 text-[9px] font-black uppercase tracking-[0.2em] gap-2">
                 Tesouro da Aliança <ChevronRight size={14} />
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/10 group-hover:text-gaming-gold/40 transition-colors">
                <Trophy size={18} />
              </div>
           </div>

           {/* Stylized progress track */}
           <div className="absolute bottom-6 left-10 right-10 flex flex-col gap-2">
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  className="h-full bg-linear-to-r from-gaming-gold to-yellow-200 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                />
              </div>
           </div>
        </motion.div>

        {/* Guide Item 3: Defesa de Base */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative group overflow-hidden bg-gaming-card/30 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 transition-all cursor-not-allowed shadow-2xl"
        >
           <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-green-500/40 to-transparent" />

           <div className="absolute top-6 right-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-green-400">Desenvolvimento</span>
              </div>
           </div>

           <div className="w-20 h-20 bg-linear-to-br from-green-600/30 to-green-900/10 rounded-[2rem] flex items-center justify-center text-green-400 group-hover:scale-110 group-hover:rotate-12 transition-all border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield size={40} className="relative z-10" />
           </div>

           <div className="relative z-10">
              <h4 className="font-display font-black uppercase text-3xl mb-3 italic text-white group-hover:text-green-300 transition-colors tracking-tighter">Defesa <br /><span className="text-green-500">de Base 🛡️</span></h4>
              <p className="text-xs text-white/40 uppercase font-bold leading-relaxed italic group-hover:text-white/60 transition-colors">
                Fortificações impenetráveis e sistemas de alerta precoce para neutralizar invasões noturnas.
              </p>
           </div>

           <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center text-green-400/30 text-[9px] font-black uppercase tracking-[0.2em] gap-2">
                 Arquitetura Defensiva <ChevronRight size={14} />
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/10 group-hover:text-green-500/40 transition-colors">
                <ShieldAlert size={18} />
              </div>
           </div>

           {/* Stylized progress track */}
           <div className="absolute bottom-6 left-10 right-10 flex flex-col gap-2">
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  className="h-full bg-linear-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                />
              </div>
           </div>
        </motion.div>

        {/* Rules & Warnings Section */}
        <div className="lg:col-span-3">
           <div className="bg-linear-to-r from-red-950/20 to-transparent border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                 <AlertTriangle size={150} />
              </div>
              
              <div className="flex-shrink-0 w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                 <ShieldCheck size={48} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <h4 className="font-display font-black uppercase text-2xl mb-3 text-red-500 italic flex items-center justify-center md:justify-start gap-3">
                    Código de Honra: Caravanas 🚨
                 </h4>
                 <p className="text-sm md:text-base text-white/60 font-bold uppercase leading-relaxed italic mb-6">
                    "É terminantemente PROIBIDO roubar caravanas e caixotes de jogadores do nosso próprio servidor. Isso gera retaliação severa e banimento imediato da aliança."
                 </p>
                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest">
                       <CheckCircle2 size={14} className="text-green-500" /> Respeite Aliados
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-red-400">
                       <AlertTriangle size={14} /> Multa de 50 Moedas
                    </div>
                    <button 
                      onClick={async () => {
                        await reportTheft();
                        setShowTheftReported(true);
                        setTimeout(() => setShowTheftReported(false), 5000);
                      }}
                      className="flex items-center gap-3 px-6 py-2 bg-red-500 text-black rounded-xl hover:bg-white transition-all font-black uppercase text-[9px] tracking-widest"
                    >
                       <MessageSquareWarning size={14} /> Denunciar Furto
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

// --- COMBATE VIEW ---
export function CombateView() {
  return <DevelopmentView tab="combate" progress={90} />;
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

  const [profileSubView, setProfileSubView] = useState<'main' | 'aura_store'>('main');
  const [purchaseStatus, setPurchaseStatus] = useState<{ id: string, message: string, type: 'success' | 'error' } | null>(null);

  const borders = [
    { id: 'border_cyan', title: 'Cibernética Blue', desc: 'Aura neon azul.', price: 50, color: 'border-cyan-400' },
    { id: 'border_purple', title: 'Aura Púrpura', desc: 'Proteção mística violeta.', price: 50, color: 'border-purple-500' },
    { id: 'border_gold', title: 'Fogo Dourado', desc: 'A borda suprema animada.', price: 50, color: 'border-gaming-gold', animated: true }
  ];

  const handleBuyBorder = (border: any) => {
    if ((myMember?.coins || 0) < border.price) {
      setPurchaseStatus({ id: border.id, message: "Moedas insuficientes!", type: 'error' });
      setTimeout(() => setPurchaseStatus(null), 2000);
      return;
    }

    updateMemberData({
      coins: (myMember?.coins || 0) - border.price,
      profileBorder: border.id
    });
    setPurchaseStatus({ id: border.id, message: "Equipado com Sucesso!", type: 'success' });
    setTimeout(() => setPurchaseStatus(null), 2000);
  };

  const getBorderClasses = (borderId?: string) => {
    if (isEcoMode) {
      switch (borderId) {
        case 'border_cyan': return 'border-2 border-cyan-400';
        case 'border_purple': return 'border-2 border-purple-500';
        case 'border_gold': return 'border-2 border-gaming-gold';
        default: return 'border-2 border-white/10';
      }
    }
    switch (borderId) {
      case 'border_cyan': return 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]';
      case 'border_purple': return 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
      case 'border_gold': return 'border-2 border-gaming-gold shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse';
      default: return 'border-2 border-gaming-gold/30';
    }
  };
  
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
    { label: 'Diamantes', val: myMember?.diamonds || 0, icon: Gem, color: 'text-gaming-gold' }
  ];

  if (profileSubView === 'aura_store') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-8 p-4 md:p-8 max-w-4xl mx-auto w-full pb-20"
      >
        <button 
          onClick={() => setProfileSubView('main')}
          className="flex items-center gap-2 text-gaming-gold font-black uppercase text-[10px] tracking-widest hover:translate-x-[-4px] transition-transform w-fit"
        >
          <ArrowLeft size={16} /> Voltar ao Perfil
        </button>

        <div className="bg-gaming-card border border-gaming-border rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-gaming-border flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="text-2xl font-display font-black uppercase italic text-white leading-none">Customização de Aura</h3>
              <p className="text-[10px] text-gaming-gold font-bold uppercase tracking-[0.3em] mt-2">Escolha sua borda lendária</p>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {borders.map(border => (
              <div 
                key={border.id}
                className={`p-6 rounded-3xl border transition-all ${myMember?.profileBorder === border.id ? 'border-gaming-gold bg-gaming-gold/5 shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
              >
                <div className="flex flex-col items-center text-center gap-5">
                  <div className={`w-20 h-20 rounded-full ${border.color} border-2 relative flex items-center justify-center ${border.animated && !isEcoMode ? 'animate-pulse' : ''} bg-black/20`}>
                    <User size={36} className="text-white/10" />
                    {border.animated && !isEcoMode && (
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                         className="absolute inset-0 border border-t-white/40 border-transparent rounded-full"
                       />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black uppercase text-white tracking-widest">{border.title}</span>
                  </div>
                  <button 
                    onClick={() => handleBuyBorder(border)}
                    disabled={myMember?.profileBorder === border.id}
                    className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      myMember?.profileBorder === border.id 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-gaming-gold text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:-translate-y-0.5'
                    }`}
                  >
                    {purchaseStatus?.id === border.id ? purchaseStatus.message : (myMember?.profileBorder === border.id ? 'Equipado' : '50 Moedas')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 md:p-8">
         <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full p-1 relative group bg-black/20 flex items-center justify-center ${getBorderClasses(myMember?.profileBorder)}`}>
            {!isEcoMode && <div className={`absolute -inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${myMember?.profileBorder === 'border_gold' ? 'bg-gaming-gold/20' : 'bg-gaming-gold/10'}`} />}
            <img 
              src={myMember?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover relative z-10"
              referrerPolicy="no-referrer"
            />
            <div 
              className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-gaming-gold gap-2 pointer-events-none rounded-full"
            >
              <Camera size={24} />
              <span className="text-[8px] font-black uppercase tracking-widest">Trocar Foto</span>
            </div>
            <input 
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 z-30 cursor-pointer"
            />
         </div>

         <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 flex-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-black text-gaming-gold tracking-[0.4em]">Guerreiro de Elite</span>
              <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter">{myMember?.name || 'Recruta'}</h2>
            </div>

            <button 
              onClick={() => setProfileSubView('aura_store')}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gaming-gold hover:border-gaming-gold/40 hover:bg-gaming-gold/5 transition-all group"
            >
              <Palette size={14} className="group-hover:rotate-12 transition-transform" />
              Personalizar Aura
            </button>
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
  const { logout, myMember, updateMemberData, isEcoMode, toggleEcoMode, isOptimizing, deleteMember } = useClan();

  const handleThemeChange = (theme: 'dark' | 'neon' | 'gold' | 'classic') => {
    updateMemberData({ appTheme: theme });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMemberData({ opacityLevel: Number(e.target.value) });
  };

  const handleDeleteAccount = async () => {
    if (!myMember) return;
    
    if (confirm("TEM CERTEZA? Esta ação é irreversível e você perderá todo o seu progresso na Aliança Suprema. Suas medalhas, diamonds e status serão apagados.")) {
       try {
         await deleteMember(myMember.userId);
         // Deletion handles logout in the context
       } catch (err) {
         console.error('Erro ao deletar conta:', err);
         alert("Ocorreu um erro ao tentar deletar sua conta. Tente novamente mais tarde.");
       }
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
                  <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] block mb-4">Arte de Fundo do Perfil</span>
                  <div className="grid grid-cols-2 gap-2">
                     {[
                       { id: 'padrão', label: 'Padrão', url: '/src/assets/images/clan_bg_art_1778972376934.png' },
                       { id: 'cibernética', label: 'Cibernética', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070' },
                       { id: 'guerra', label: 'Guerra', url: 'https://images.unsplash.com/photo-1599394022918-6c276a570aba?q=80&w=2070' },
                       { id: 'moderna', label: 'Moderna', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070' }
                     ].map(art => (
                       <button 
                         key={art.id}
                         onClick={() => updateMemberData({ profileBg: art.url })}
                         className={`relative overflow-hidden group py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${myMember?.profileBg === art.url || (!myMember?.profileBg && art.id === 'padrão') ? 'border-gaming-gold text-gaming-gold' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                       >
                         <img src={art.url} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="" />
                         <span className="relative z-10">{art.label}</span>
                       </button>
                     ))}
                  </div>
               </div>

              <div>
                 <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] block mb-4">Esquema de Cores</span>
                 <div className="grid grid-cols-2 gap-2">
                    {[
                       { id: 'dark', label: 'Sombrio' },
                       { id: 'neon', label: 'Neon' },
                       { id: 'gold', label: 'Dourado' },
                       { id: 'classic', label: 'Clássico' }
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => handleThemeChange(t.id as any)}
                        className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${myMember?.appTheme === t.id ? 'bg-gaming-gold text-black border-gaming-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                      >
                        {t.label}
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

  const handleClaimReward = (reward: any) => {
    if (reward.inDevelopment) {
      setPurchaseStatus({ id: reward.id, message: "Este item está em desenvolvimento!", type: 'error' });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    if (!myMember) return;
    
    if (myMember.diamonds < reward.price) {
      setPurchaseStatus({ id: reward.id, message: `Saldo insuficiente!`, type: 'error' });
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
      price: 200, 
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
                  onClick={() => handleClaimReward(reward)}
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

// --- GERENCIA VIEW ---
export function GerenciaView() {
  const { members, myMember, deleteMember, banMember, updateMemberRole, theftReports, clearTheftReport, isEcoMode, updateClanLogo, clan } = useClan();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const clanEmojis = ['🐺', '🦁', '🦅', '🎯', '⚔️', '🛡️', '👑', '🔥', '💎', '🐲', '⚡', '🌌', '💀', '⛩️', '⚔️', '🔱'];

  const handleEmojiSelect = async (emoji: string) => {
    setLogoUploading(true);
    try {
      // Clearing both fields and setting emoji (we'll store emoji string in logoUrl)
      // The UI already handles strings that aren't URLs/base64 by not rendering <img>
      await updateClanLogo(emoji);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const compressed = await compressImage(event.target.result as string, 400, 400, 0.5);
          await updateClanLogo(compressed);
        } catch (err) {
          console.error(err);
        } finally {
          setLogoUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMember = async (memberId: string, name: string, definitive: boolean = false) => {
    const actionText = definitive ? 'BANIR' : 'EXPULSAR';
    const warningText = definitive 
      ? 'ESTA AÇÃO É DEFINITIVA. O jogador entrará na LISTA NEGRA e nunca mais poderá acessar a aliança com este ID.' 
      : 'Esta ação removerá o perfil do jogador, mas ele poderá tentar entrar novamente.';

    if (confirm(`${actionText} GUERREIRO: Deseja realmente eliminar ${name} da Ordem Suprema?\n\n${warningText}`)) {
      setDeletingId(memberId);
      try {
        if (definitive) {
          await banMember(memberId);
          alert(`O traidor ${name} foi banido definitivamente!`);
        } else {
          await deleteMember(memberId);
        }
      } catch (err) {
        console.error('Erro ao excluir membro:', err);
        alert('Erro na operação. Verifique suas permissões de Líder.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePromotion = async (memberId: string, currentRole: string) => {
    if (!myMember || myMember.role !== 'leader') return;
    
    let newRole = 'warrior';
    let actionLabel = '';

    if (currentRole === 'warrior') {
      newRole = 'diplomat';
      actionLabel = 'PROMOVER A DIPLOMATA';
    } else if (currentRole === 'diplomat') {
      newRole = 'warrior';
      actionLabel = 'REBAIXAR A GUERREIRO';
    } else {
      return; 
    }

    if (confirm(`Deseja realmente ${actionLabel} este guerreiro?`)) {
      try {
        await updateMemberRole(memberId, newRole);
      } catch (err) {
        alert('Erro ao alterar cargo.');
      }
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

  if (myMember?.role !== 'leader') {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-6 opacity-40">
        <ShieldAlert size={64} className="text-red-500" />
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-2xl font-display font-black uppercase italic text-white tracking-tighter">Acesso Negado</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 max-w-[200px]">Somente o Líder Supremo pode gerenciar a hierarquia do clã.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 border border-red-500/30">
                 <ShieldAlert size={16} />
              </div>
              <span className="text-[10px] uppercase font-black text-red-500 tracking-[0.4em]">Painel de Alto Comando</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none">
             Gestão de <span className="text-gaming-gold">Membros</span>
           </h2>
        </div>
      </div>

      {/* Global Clan Settings (Leader Only) */}
      <div className={`bg-gaming-card/60 border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
         {!isEcoMode && (
           <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
           </div>
         )}
         
         <div className="relative group">
           <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gaming-gold/30 p-2 relative flex items-center justify-center bg-black/40 overflow-hidden ${logoUploading ? 'animate-pulse' : ''}`}>
             {clan?.logoUrl || clan?.guideImagePost1 ? (
               ((clan.logoUrl && clan.logoUrl.length < 8) || (clan.guideImagePost1 && clan.guideImagePost1.length < 8)) ? (
                 <span className="text-7xl md:text-8xl select-none">
                   {clan.logoUrl || clan.guideImagePost1}
                 </span>
               ) : (
                 <img 
                   src={clan?.logoUrl || clan?.guideImagePost1} 
                   alt="Global Logo" 
                   className="w-full h-full object-contain"
                 />
               )
             ) : (
               <span className="text-7xl md:text-8xl select-none">🐺</span>
             )}
             <label className="absolute inset-x-0 bottom-0 top-1/2 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-1 z-10">
               <Camera size={16} className="text-gaming-gold" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white">Galeria</span>
               <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
             </label>

             <button 
               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
               className="absolute inset-x-0 top-0 bottom-1/2 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-1 z-10 border-b border-white/10"
             >
               <span className="text-lg">😊</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-white">Emoji</span>
             </button>
           </div>
         </div>

         {showEmojiPicker && (
           <motion.div 
             initial={isEcoMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`w-full max-w-xs mx-auto grid grid-cols-8 gap-2 p-4 ${isEcoMode ? 'bg-black/90' : 'bg-black/40 backdrop-blur-xl'} border border-gaming-gold/20 rounded-2xl`}
           >
             {clanEmojis.map(emoji => (
               <button
                 key={emoji}
                 onClick={() => handleEmojiSelect(emoji)}
                 className={`text-2xl ${isEcoMode ? '' : 'hover:scale-125'} transition-transform p-1 rounded-lg hover:bg-white/5`}
               >
                 {emoji}
               </button>
             ))}
           </motion.div>
         )}

         <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
           <div>
             <span className="text-gaming-gold font-black uppercase text-[10px] tracking-[0.4em]">Identidade Visual Global</span>
             <h3 className="text-2xl md:text-3xl font-display font-black uppercase italic text-white tracking-tighter">Personalizar <span className="text-gaming-gold">Logomarca</span></h3>
           </div>
           <p className="text-xs text-white/40 font-bold uppercase italic leading-relaxed max-w-lg">
             Esta imagem será exibida para todos os membros na tela de Login e na Barra Lateral. Escolha uma imagem que represente a grandeza da Ordem Suprema.
           </p>
           {logoUploading && <span className="text-[9px] font-black uppercase tracking-widest text-gaming-gold animate-bounce">Sincronizando com os servidores...</span>}
         </div>
      </div>

      {/* Reports Section */}
      {theftReports.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-lg font-display font-black uppercase italic text-red-500">Denúncias de Furto Pendentes ({theftReports.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {theftReports.map(report => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-red-400">Denunciado por:</span>
                    <button 
                      onClick={() => clearTheftReport(report.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase text-white">{report.reporterName}</h4>
                      <p className="text-[8px] font-mono font-bold text-white/30">{new Date(report.timestamp).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-white/50 uppercase italic leading-relaxed">
                    Relatou ocorrência de furto de caravana/recursos. Verificar logs do jogo.
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <span className="text-[10px] uppercase font-black text-red-500 tracking-[0.4em] mb-1 block">Acesso Restrito</span>
           <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter">
             Gestão de <span className="text-gaming-gold">Liderança</span>
           </h2>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl">
           <ShieldCheck size={20} className="text-red-500" />
           <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-white/30 tracking-widest">Status</span>
              <span className="font-display font-black text-red-500 text-xs leading-none uppercase">Admin Ativo</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
           <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <h4 className="font-display font-black uppercase text-sm tracking-widest italic">Integrantes ({members.length})</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">ID Aliança: ORDM</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                   {members.filter(m => m.userId !== myMember?.userId).map(m => (
                      <motion.div 
                        key={m.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 flex items-center justify-between transition-all group"
                      >
                       <div className="flex items-center gap-4">
                          <img 
                            src={m.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userId}`} 
                            className="w-10 h-10 rounded-full border border-white/10 object-cover" 
                            alt={m.name}
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white group-hover:text-gaming-gold transition-colors">{m.name}</span>
                             </div>
                             <span className={`text-[8px] font-black uppercase tracking-widest ${getRoleBadgeColor(m.role)}`}>{getRoleLabel(m.role)}</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <select 
                           value={m.role}
                           onChange={(e) => updateMemberRole(m.id, e.target.value as any)}
                           className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none hover:border-gaming-gold/40 transition-all cursor-pointer"
                         >
                           <option value="diplomat" className="bg-gaming-card">Diplomata</option>
                           <option value="military_leader" className="bg-gaming-card">Líder Militar</option>
                           <option value="recruiter" className="bg-gaming-card">Recrutador</option>
                           <option value="muse" className="bg-gaming-card">Musa</option>
                           <option value="warrior" className="bg-gaming-card">Guerreiro</option>
                         </select>

                          <button 
                             disabled={deletingId === m.id}
                             onClick={() => handleDeleteMember(m.id, m.name, true)}
                             className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                             title="Remover Membro"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </motion.div>
                  ))}
                 </AnimatePresence>
                 {members.length <= 1 && (
                   <div className="py-24 text-center flex flex-col items-center gap-4 opacity-20">
                      <Users size={48} />
                      <div className="text-[10px] uppercase font-black tracking-widest">
                        Nenhum outro guerreiro na aliança para gerenciar.
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 flex flex-col gap-6">
              <h4 className="font-display font-black uppercase text-sm tracking-widest italic border-b border-white/5 pb-4">Ações Estratégicas</h4>
              
              <div className="space-y-3">
                 <button 
                   onClick={() => {
                     const target = prompt('Digite o nome exato do jogador:');
                     if (target) {
                       const member = members.find(m => m.name.toLowerCase().trim() === target.toLowerCase().trim());
                       if (member) {
                         setEditingId(member.id);
                       } else {
                         alert('Membro não encontrado.');
                       }
                     }
                   }}
                   className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all font-display font-black uppercase text-[10px] tracking-widest"
                 >
                    <UserPlus size={16} /> Buscar Guerreiro
                 </button>
                 
                 <button 
                   onClick={() => setEditingId(editingId === 'all' ? null : 'all')}
                   className={`w-full py-4 border rounded-xl flex items-center justify-center gap-3 transition-all font-display font-black uppercase text-[10px] tracking-widest ${editingId === 'all' ? 'bg-gaming-gold text-black border-gaming-gold shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/5'}`}
                 >
                    <Edit2 size={16} /> {editingId === 'all' ? 'Finalizar Edição' : 'Gerenciar Todos'}
                 </button>
              </div>
           </div>

           <div className="bg-gaming-card/40 border border-gaming-border rounded-3xl p-6 flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Aviso Importante</h4>
              <p className="text-[10px] text-white/50 leading-relaxed font-bold uppercase italic">
                Ao expulsar um integrante, seu acesso à Supremacia será revogado imediatamente. Transferir a liderança é uma ação irreversível.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
