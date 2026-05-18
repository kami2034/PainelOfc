import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithRedirect } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, RefreshCw, AlertCircle } from 'lucide-react';

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      // Ensure persistence is set to local
      await setPersistence(auth, browserLocalPersistence);
      
      // Try popup first
      await signInWithPopup(auth, provider).catch(async (popupError) => {
        // If popup is blocked or fails in this environment, try redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' || 
            popupError.code === 'auth/cancelled-popup-request') {
          throw popupError;
        }
        
        console.warn('Popup failed, trying redirect...', popupError);
        return signInWithRedirect(auth, provider);
      });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-bg text-white p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gaming-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gaming-purple/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-gaming-card/40 backdrop-blur-3xl border border-gaming-border/50 rounded-[3rem] p-10 md:p-14 text-center shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gaming-gold to-transparent shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
        
        <motion.div 
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-24 h-24 hex-clip bg-linear-to-br from-gaming-gold to-gaming-purple/40 border border-gaming-gold/30 flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(251,191,36,0.3)] relative group"
        >
           <div className="absolute inset-0 bg-gaming-gold/20 animate-ping rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
           <span className="text-4xl font-display font-black text-white italic drop-shadow-md relative z-10">ORDM</span>
        </motion.div>

         <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 italic leading-tight">
          Aliança Suprema <br />
          <span className="text-gaming-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">Ordem</span>
        </h1>
        
        <p className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-bold mb-14 px-4">
          O portal definitivo para a gestão da sua guilda e glória militar.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed flex items-center gap-3 text-left"
          >
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </motion.div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white group-hover:bg-gaming-gold transition-colors duration-300" />
          <div className="relative py-4 rounded-xl font-display font-black uppercase tracking-widest flex items-center justify-center gap-3 text-black transition-transform group-active:scale-95">
            {loading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            )}
            {loading ? 'Sincronizando...' : 'Entrar com Google'}
          </div>
        </button>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex justify-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-widest italic">
            <span>Batalhe</span>
            <span className="w-1 h-1 bg-white/20 rounded-full my-auto" />
            <span>Conquiste</span>
            <span className="w-1 h-1 bg-white/20 rounded-full my-auto" />
            <span>Domine</span>
          </div>
        </div>
      </motion.div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}
