import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, RefreshCw } from 'lucide-react';

export function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider).catch(async (popupError) => {
        // Fallback for some environments: try redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          throw popupError; // handle in outer catch
        }
        console.warn('Popup failed, trying redirect...', popupError);
        const { signInWithRedirect } = await import('firebase/auth');
        return signInWithRedirect(auth, provider);
      });
    } catch (error: any) {
      console.error('Login failed', error);
      if (error.code === 'auth/popup-blocked') {
        setError('O popup foi bloqueado. Clique novamente ou permita popups.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Login cancelado pelo usuário.');
      } else {
        setError('Erro ao entrar: ' + (error.message || 'Erro desconhecido'));
      }
      setLoading(false);
    }
  };

  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-bg text-white p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gaming-card border border-gaming-border rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gaming-gold shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
        
        <div className="w-24 h-24 hex-clip bg-linear-to-br from-gaming-gold to-gaming-purple/40 border border-gaming-gold/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
           <span className="text-4xl font-display font-black text-white italic drop-shadow-md">ORDM</span>
        </div>

         <h1 className="text-4xl font-display font-black uppercase tracking-tighter mb-4 italic">
          Aliança Suprema <span className="text-gaming-gold">Ordem</span>
        </h1>
        <p className="text-white/40 uppercase text-[10px] tracking-[0.2em] font-bold mb-12">
          Acesse para gerenciar sua aliança e acompanhar as guerras em tempo real.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-display font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gaming-gold hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <LogIn size={20} className="group-hover:rotate-12 transition-transform" />
          )}
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] text-white/20 uppercase font-medium">Batalhe. Conquiste. Domine.</p>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]" />
    </div>
  );
}
