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
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 ${isEcoMode ? '' : 'backdrop-blur-xl'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
        className={`relative w-full max-w-sm bg-gaming-card border-2 border-gaming-gold rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(251,191,36,0.5)] overflow-hidden`}
      >
        {!isEcoMode && (
          <>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-gaming-gold/20 to-transparent pointer-events-none" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-gaming-purple/30 rounded-full blur-3xl pointer-events-none" 
            />
          </>
        )}

        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 bg-gaming-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.6)] z-10"
        >
           <Trophy size={56} className="text-black drop-shadow-lg" />
        </motion.div>

        <div className="mt-12 mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="text-[12px] uppercase font-black tracking-[0.5em] text-gaming-gold mb-3 drop-shadow-glow"
          >
            Ascensão de Poder
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-8xl font-display font-black text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            NV. {level}
          </motion.div>
        </div>

        <div className="flex flex-col gap-5 mb-10 relative z-10">
           <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white font-bold text-sm uppercase tracking-widest leading-relaxed italic"
           >
             "Sua lenda se espalha por todos os reinos!"
           </motion.p>
           
           <div className="flex justify-center gap-3">
             {[1,2,3,4,5].map(i => (
               <motion.div
                 key={i}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 1 + (i * 0.1) }}
               >
                 <Star size={24} className="text-gaming-gold fill-gaming-gold drop-shadow-glow" />
               </motion.div>
             ))}
           </div>
        </div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onClose}
          className="w-full py-5 bg-gaming-gold text-black rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] relative z-10"
        >
          Continuar Jornada
        </motion.button>

        <div className="absolute inset-0 pointer-events-none">
           {!isEcoMode && [...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ 
                 opacity: [0, 1, 0], 
                 scale: [0, 2, 0],
                 x: [0, (Math.random() - 0.5) * 400],
                 y: [0, (Math.random() - 0.5) * 400]
               }}
               transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
               className="absolute top-1/2 left-1/2"
             >
               {i % 2 === 0 ? <Sparkles className="text-gaming-gold" size={24} /> : <Star className="text-white/30" size={12} />}
             </motion.div>
           ))}
        </div>
      </motion.div>
    </div>
  );
}
