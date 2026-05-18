import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, X, ChevronRight, Gem, Coins, RefreshCw } from 'lucide-react';
import { useClan } from '../context/ClanContext';

export function UpdateRewardNotice() {
  const { myMember, claimUpdateReward, isEcoMode } = useClan();
  const [isVisible, setIsVisible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (myMember && !myMember.updateRewardClaimed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [myMember?.updateRewardClaimed, myMember?.userId]);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await claimUpdateReward();
      // Notice will automatically hide because of the useEffect on updateRewardClaimed
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-gaming-gold/10 border-b border-gaming-gold/20 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gaming-gold rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] shrink-0">
            <Gift size={24} className="md:size-[28px]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm md:text-lg font-display font-black uppercase italic text-gaming-gold leading-none mb-1">
              Recompensa de Atualização!
            </h3>
            <p className="text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-wider">
              Agradecemos sua paciência. Resgate seu bônus de <span className="text-white font-black">+50 Moedas</span> agora.
            </p>
          </div>
        </div>

        <button 
          onClick={handleClaim}
          disabled={isClaiming}
          className="w-full md:w-auto bg-gaming-gold text-black px-8 py-2.5 rounded-xl font-display font-black uppercase tracking-widest text-[11px] md:text-xs flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isClaiming ? (
             <RefreshCw size={14} className="animate-spin" />
          ) : (
             <>
               Resgatar Agora
               <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </>
          )}
        </button>
      </div>
      
      {/* Dynamic Shine effect */}
      {!isEcoMode && (
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-20 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[45deg]"
        />
      )}
    </motion.div>
  );
}
