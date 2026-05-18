import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Sword, Skull, X, ChevronRight, AlertTriangle } from 'lucide-react';

interface InitialNoticeProps {
  onExplore: () => void;
}

export function InitialNotice({ onExplore }: InitialNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('last_war_notice');
    const today = new Date().toDateString();

    if (lastShown !== today) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('last_war_notice', new Date().toDateString());
  };

  const handleExplore = () => {
    handleClose();
    onExplore();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* War Modal */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotateX: 45 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border-2 border-red-600/50 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)]"
          >
            {/* War Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent" />
            </div>

            {/* Glowing red accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(220,38,38,0.8)]" />

            <div className="relative p-8 md:p-12 flex flex-col items-center text-center gap-6">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-24 h-24 bg-red-600/20 rounded-full border border-red-600/40 flex items-center justify-center text-red-600 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
                <ShieldAlert size={48} className="relative z-10" />
                
                {/* Cross Swords behind */}
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -bottom-2 -right-2 text-red-500/30"
                >
                   <Skull size={40} />
                </motion.div>
              </motion.div>

              <div className="flex flex-col gap-1">
                <motion.span 
                  initial={{ opacity: 0, letterSpacing: '0.1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.4em' }}
                  transition={{ delay: 0.7 }}
                  className="text-red-500 font-black uppercase text-[10px]"
                >
                  ESTADO DE GUERRA
                </motion.span>
                <motion.h2 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-3xl md:text-5xl font-display font-black uppercase italic tracking-tighter text-white"
                >
                  GUERRA ENTRE <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">SERVIDORES</span>
                </motion.h2>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/60 font-bold uppercase italic text-[11px] md:text-sm leading-relaxed max-w-md"
              >
                A BATALHA PELO DOMÍNIO DO REINO COMEÇOU! OS OUTROS SERVIDORES ESTÃO AVANÇANDO. É HORA DE SE PREPARAR PARA A VITÓRIA SUPREMA.
              </motion.p>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col md:flex-row gap-4 w-full"
              >
                <button 
                  onClick={handleExplore}
                  className="flex-1 bg-red-600 hover:bg-white hover:text-red-600 text-white p-5 rounded-2xl font-display font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] group"
                >
                  VISITAR ABA DE DICAS 
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleClose}
                  className="px-8 py-5 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl font-display font-black uppercase tracking-widest text-sm transition-all"
                >
                  AGORA NÃO
                </button>
              </motion.div>

              <div className="flex items-center gap-2 text-red-500/40 mt-4">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">MOBILIZAÇÃO IMEDIATA REQUERIDA</span>
              </div>
            </div>

            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
