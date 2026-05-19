import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { motion } from 'motion/react';
import { Shield, Loader2, Mail, User, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useClan();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !nickname)) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, nickname, password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro no processo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 gaming-gradient opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-gaming-card p-8 rounded-3xl border border-gaming-gold/20 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gaming-gold/10 rounded-2xl flex items-center justify-center mb-4 border border-gaming-gold/30">
            <Shield className="text-gaming-gold" size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
            Ordem <span className="text-gaming-gold italic">Suprema</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2">
            {mode === 'login' ? 'Identificação de Guerreiro' : 'Recrutamento Oficial'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">
              Email do Guerreiro
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gaming-gold/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">
                Nome de Guerra (Nickname)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Seu Nickname Permanente"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gaming-gold/50 transition-all font-medium"
                  required
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-gaming-gold/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase py-3 px-4 rounded-lg tracking-widest leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gaming-gold text-black font-black uppercase py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(251,191,36,0.15)] text-xs tracking-widest mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'Entrar na Ordem' : 'Cadastrar na Aliança'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
            {mode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-gaming-gold text-[11px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
          >
            {mode === 'login' ? 'Cadastre-se Agora' : 'Fazer Login Oficial'}
          </button>
        </div>

        <p className="text-center text-[8px] text-white/10 mt-10 uppercase font-black tracking-[0.3em]">
          Ambiente Criptografado & Seguro
        </p>
      </motion.div>
    </div>
  );
};
