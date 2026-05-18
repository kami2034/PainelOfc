import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithRedirect } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, RefreshCw, AlertCircle, Swords, ShieldHalf, Target } from 'lucide-react';
import { useClan } from '../context/ClanContext';

export function Login() {
  const { clan, isEcoMode } = useClan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      // Ensure persistence is set to local
      await setPersistence(auth, browserLocalPersistence);
      
      // Force account selection to avoid auto-login loops if there's an issue
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        const result = await signInWithPopup(auth, provider);
        console.log('Login successful:', result.user.uid);
      } catch (popupError: any) {
        // If popup is blocked or fails, try redirect as last resort
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' || 
            popupError.code === 'auth/cancelled-popup-request') {
          // These are user actions or browser blocks, don't auto-redirect
          throw popupError;
        }
        
        console.warn('Popup failed, trying redirect...', popupError);
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      console.error('Login failed', err);
      if (err.code === 'auth/popup-blocked') {
        setError('O popup foi bloqueado pelo seu navegador. Por favor, permita popups para este site ou tente novamente.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelado. Você fechou a janela de autenticação.');
      } else {
        setError('Erro ao entrar: ' + (err.message || 'Erro desconhecido'));
      }
      setLoading(false);
    }
  };

  const motionProps = isEcoMode ? {
    initial: { opacity: 1, scale: 1, y: 0 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0 }
  } : {
    initial: { opacity: 0, scale: 0.98, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const logoMotionProps = isEcoMode ? {
    initial: { rotate: 0, scale: 1, opacity: 1 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    transition: { duration: 0 }
  } : {
    initial: { rotate: -10, scale: 0.5, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    transition: { duration: 1, type: 'spring', bounce: 0.4 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050110] text-white p-6 relative overflow-hidden font-sans">
      {/* Immersive War Background */}
      {!isEcoMode && (
        <div className="absolute inset-0 z-0">
          {/* Main Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[100%] bg-gaming-purple/20 rounded-full blur-[180px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gaming-gold/10 rounded-full blur-[180px]" />
          
          {/* Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          {/* Moving Smoke/Atmosphere */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0d0118]/80 to-[#050110]" />
          
          {/* Floating Particles/Dust Simulation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-ping" />
            <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-gaming-gold/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-gaming-purple/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      )}

      {/* Grid Pattern Background */}
      {!isEcoMode && (
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        </div>
      )}

      <motion.div 
        {...motionProps}
        className={`w-full max-w-xl ${isEcoMode ? 'bg-[#0d0118]' : 'bg-black/80 backdrop-blur-3xl'} border-2 border-white/5 rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 text-center shadow-[0_0_100px_rgba(124,58,237,0.15)] relative z-10 overflow-hidden group`}
      >
        {/* Tactical Frame Elements */}
        <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-linear-to-r from-transparent via-gaming-gold/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 md:h-2 bg-linear-to-r from-transparent via-gaming-purple/40 to-transparent" />
        
        <div className="absolute top-6 left-6 md:top-10 md:left-10 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-gaming-gold group-hover:scale-110 transition-transform" />
        <div className="absolute top-6 right-6 md:top-10 md:right-10 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-gaming-gold group-hover:scale-110 transition-transform" />
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-gaming-purple group-hover:scale-110 transition-transform" />
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-gaming-purple group-hover:scale-110 transition-transform" />

        {/* Floating War Symbols */}
        {!isEcoMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
             <Swords size={250} className="absolute -top-20 -left-20 rotate-12 md:size-[400px] md:-top-40 md:-left-40" />
             <ShieldHalf size={250} className="absolute -bottom-20 -right-20 -rotate-12 md:size-[400px] md:-bottom-40 md:-right-40" />
          </div>
        )}
        
        <motion.div 
          {...logoMotionProps}
          className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center mx-auto mb-6 md:mb-10 group relative"
        >
           {!isEcoMode && (
             <>
               <div className="absolute inset-0 bg-gaming-purple/30 blur-2xl md:blur-3xl rounded-full scale-110 md:scale-125 group-hover:scale-150 transition-transform duration-700" />
               <div className="absolute inset-0 border-2 md:border-4 border-gaming-gold/20 rounded-full animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-2 md:inset-4 border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
             </>
           )}
           
           <div className="relative z-10 w-full h-full flex items-center justify-center">
              {clan?.logoUrl || clan?.guideImagePost1 ? (
                ((clan?.logoUrl && clan.logoUrl.length < 8) || (clan?.guideImagePost1 && clan.guideImagePost1.length < 8)) ? (
                  <span className={`text-6xl md:text-[10rem] drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] select-none ${isEcoMode ? '' : 'animate-bounce-subtle'}`}>
                    {clan?.logoUrl || clan?.guideImagePost1}
                  </span>
                ) : (
                  <img 
                    src={clan?.logoUrl || clan?.guideImagePost1} 
                    alt="Logo" 
                    className={`w-full h-full object-contain relative z-10 ${isEcoMode ? '' : 'drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] brightness-125'}`} 
                  />
                )
              ) : (
               <span className={`text-6xl md:text-[10rem] drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] relative z-10 select-none ${isEcoMode ? '' : 'animate-bounce-subtle'}`}>
                 🐺
               </span>
             )}
           </div>
        </motion.div>

        <div className="space-y-3 md:space-y-4 mb-10 md:mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-4 md:py-1.5 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full mb-2">
             <Target size={12} className="text-gaming-gold animate-pulse md:size-[14px]" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gaming-gold italic">Sistema de Guerra Ativado</span>
          </div>
          
          <h1 className="text-4xl md:text-8xl font-display font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] mb-1">
            ORDEM <br />
            <span className="text-gaming-gold mix-blend-difference drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">SUPREMA</span>
          </h1>
          
          <p className="text-white/40 uppercase text-[10px] md:text-[12px] tracking-[0.6em] md:tracking-[0.8em] font-black italic max-w-[200px] md:max-w-xs mx-auto">
            Honra • Força • Glória
          </p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 md:p-6 bg-red-950/40 border border-red-500/30 rounded-2xl md:rounded-[2rem] text-red-500 text-[10px] md:text-[12px] font-black uppercase tracking-widest leading-relaxed flex items-center gap-3 md:gap-4 text-left shadow-2xl"
          >
            <ShieldHalf size={20} className="shrink-0 text-red-500 md:size-[24px]" />
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] text-white/40 mb-0.5">FALHA NA AUTENTICAÇÃO</span>
              {error}
            </div>
          </motion.div>
        )}

        <div className="relative p-1.5 md:p-2 rounded-2xl md:rounded-[2.5rem] bg-white/5 border border-white/10 group-hover:bg-gaming-gold/5 transition-colors mb-8 md:mb-12">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full relative py-5 md:py-7 rounded-xl md:rounded-[2rem] font-display font-black uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center justify-center gap-3 md:gap-5 bg-gaming-gold text-black transition-all hover:bg-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.3)] md:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
          >
            <div className="absolute inset-x-0 inset-y-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            {loading ? (
              <RefreshCw size={20} className="animate-spin md:size-[28px]" />
            ) : (
              <LogIn size={20} className="shrink-0 group-hover:translate-x-1 transition-transform md:size-[28px]" />
            )}
            <span className="text-lg md:text-2xl italic">
              {loading ? 'SINCRONIZANDO...' : 'INVOCAR PODER'}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6 pt-6 md:pt-10 border-t border-white/5 opacity-40">
           <div className="flex justify-center gap-6 md:gap-12 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] italic">
             <span>Lealdade</span>
             <span>Honra</span>
             <span>Vitória</span>
           </div>
           <div className="w-12 md:w-16 h-1 bg-gaming-gold/20 rounded-full" />
        </div>
      </motion.div>

      {/* Decorative Outer elements */}
      {!isEcoMode && (
        <div className="absolute top-20 right-20 flex flex-col gap-8 opacity-20 pointer-events-none">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-[2px] w-40 bg-linear-to-l from-gaming-gold to-transparent" style={{ opacity: 1 - (i * 0.2) }} />
           ))}
        </div>
      )}
    </div>
  );
}
