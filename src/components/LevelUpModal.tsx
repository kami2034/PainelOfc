import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles } from 'lucide-react';

import { useClan } from '../context/ClanContext';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const { isEcoMode } = useClan();

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 ${isEcoMode ? '' : 'backdrop-blur-md'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`relative w-full max-w-xs bg-gaming-card/90 border border-white/10 rounded-[2.5rem] p-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden`}
      >
        {!isEcoMode && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-gaming-gold/5 via-transparent to-transparent pointer-events-none" />
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -left-10 w-32 h-32 bg-gaming-gold/20 rounded-full blur-3xl pointer-events-none" 
            />
          </>
        )}

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="w-16 h-16 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
           <Trophy size={28} className="text-gaming-gold" />
        </motion.div>

        <div className="mb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase font-black tracking-[0.4em] text-gaming-gold/60 mb-2"
          >
            Nível de Ordem Elevado
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-display font-black text-white italic tracking-tighter"
          >
            NV. {level}
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 mb-8 relative z-10">
           <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 font-bold text-[10px] uppercase tracking-widest leading-relaxed px-4"
           >
             Sua influência na Aliança Suprema acaba de aumentar.
           </motion.p>
           
           <div className="flex justify-center gap-1.5">
             {[1,2,3,4,5].map(i => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.5 + (i * 0.1) }}
               >
                 <Star size={14} className="text-gaming-gold fill-gaming-gold/20" />
               </motion.div>
             ))}
           </div>
        </div>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onClose}
          className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all relative z-10"
        >
          Excelente
        </motion.button>
      </motion.div>
    </div>
  );
}
