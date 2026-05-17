import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Check, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NicknameSelectorProps {
  onSelect: (nickname: string) => void;
  loading?: boolean;
}

export function NicknameSelector({ onSelect, loading }: NicknameSelectorProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.length < 3) {
      setError('O Nick deve ter pelo menos 3 caracteres');
      return;
    }
    if (nickname.length > 20) {
      setError('O Nick deve ter no máximo 20 caracteres');
      return;
    }
    onSelect(nickname);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-6 bg-linear-to-br from-gaming-bg via-gaming-card to-gaming-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gaming-card border border-gaming-border rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gaming-gold shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
        
        <div className="w-20 h-20 bg-gaming-gold/10 border border-gaming-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
           <ShieldCheck className="text-gaming-gold" size={32} />
        </div>

        <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-4 italic">
          Escolha seu <span className="text-gaming-gold">Nick</span>
        </h2>
        <p className="text-white/40 uppercase text-[9px] tracking-[0.2em] font-bold mb-10 leading-relaxed">
          Sua privacidade é importante. Escolha um nome para ser identificado na Aliança Suprema Ordem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-gaming-gold transition-colors">
              <User size={18} />
            </div>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Ex: GuerreiroLobo"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-gaming-gold/50 focus:bg-white/10 transition-all font-bold tracking-wide"
              autoFocus
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-[10px] font-bold uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gaming-gold text-black py-4 rounded-2xl font-display font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_30px_rgba(251,191,36,0.2)] group disabled:opacity-50"
          >
            {loading ? 'Processando...' : (
              <>
                Confirmar Ingresso
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 py-2 text-white/40 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
             <LogOut size={12} /> Sair desta conta
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-white/20">
            <Check size={12} className="text-green-500/50" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Identidade Protegida</span>
          </div>
          <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Você poderá alterar seu nick futuramente se o líder permitir.</p>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.03),transparent_70%)]" />
    </div>
  );
}
