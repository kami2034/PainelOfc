import { Gift, Gem, Inbox, Package, Coins, X, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useClan } from '../context/ClanContext';
import React, { useState } from 'react';

export function Header({ isMobile = false }: { isMobile?: boolean }) {
  const { myMember, claimDailyBonus, redeemPromoCode, isEcoMode } = useClan();
  const [activeModal, setActiveModal] = useState<'bonus' | 'promo' | 'boxes' | 'diamonds' | 'coins' | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean, text: string } | null>(null);

  const [timeToNextBonus, setTimeToNextBonus] = useState<string>('');

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Brasilia is UTC-3
      const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
      const brTime = new Date(utcNow + (3600000 * -3));
      
      const nextMidnightBr = new Date(brTime);
      nextMidnightBr.setHours(24, 0, 0, 0);
      
      const diff = nextMidnightBr.getTime() - brTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeToNextBonus(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimBonus = async () => {
    const success = await claimDailyBonus();
    if (success) {
      setPromoMessage({ success: true, text: "Bônus diário resgatado! +2 Moedas" });
    } else {
      setPromoMessage({ success: false, text: "Você já resgatou seu bônus hoje!" });
    }
  };

  const handlePromoCode = async () => {
    if (!promoCode) return;
    const result = await redeemPromoCode(promoCode);
    setPromoMessage({ success: result.success, text: result.message });
    if (result.success) setPromoCode('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setPromoMessage(null);
    setPromoCode('');
  };

  return (
    <header className={`flex items-center px-4 md:px-8 py-2 md:py-4 gap-2 md:gap-8 bg-transparent ${isMobile ? 'justify-between' : 'justify-end'}`}>
      {/* Spacer to avoid collision with the view mode toggle on top-left */}
      {isMobile && <div className="w-24 shrink-0 h-10" />}

      <div className="flex items-center gap-1.5 md:gap-4 ml-auto overflow-x-auto no-scrollbar py-1 pr-2">
        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveModal('bonus')}
          className="p-1.5 bg-gaming-purple/10 border border-gaming-purple/30 rounded-xl shrink-0 group transition-all hover:bg-gaming-purple/20 hover:border-gaming-purple/50 shadow-[0_0_10px_rgba(147,51,234,0.1)] flex items-center justify-center w-8 h-8"
        >
          <Gift size={14} className="text-gaming-purple group-hover:rotate-12 transition-transform" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveModal('promo')}
          className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-xl shrink-0 group transition-all hover:bg-blue-500/20 hover:border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.1)] flex items-center justify-center w-8 h-8"
        >
          <Inbox size={14} className="text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveModal('boxes')}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-gaming-gold/5 border border-gaming-gold/30 rounded-xl shrink-0 hover:bg-gaming-gold/10 transition-all shadow-[0_0_10px_rgba(251,191,36,0.05)] h-8"
        >
          <Package size={14} className="text-gaming-gold/60" />
          <span className="text-[11px] font-mono font-black text-white/50 leading-none">{myMember?.boxes || 0}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveModal('diamonds')}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-gaming-gold/10 border border-gaming-gold/30 rounded-xl shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.1)] h-8"
        >
          <Gem size={14} className="text-gaming-gold" />
          <span className="text-[11px] font-mono font-black text-gaming-gold leading-none">{myMember?.diamonds || 0}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveModal('coins')}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-green-500/10 border border-green-500/30 rounded-xl shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.1)] h-8"
        >
          <Coins size={14} className="text-green-500" />
          <span className="text-[11px] font-mono font-black text-green-500 leading-none">{myMember?.coins || 0}</span>
        </motion.button>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 ${isEcoMode ? '' : 'backdrop-blur-sm'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-gaming-card border border-gaming-border rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X size={20} className="text-white/40" />
              </button>

              {/* Modal Content */}
              <div className="p-8 flex flex-col items-center text-center">
                {activeModal === 'bonus' && (
                  <>
                    <div className="w-20 h-20 bg-gaming-purple/10 border border-gaming-purple/20 rounded-2xl flex items-center justify-center mb-6">
                      <Gift size={40} className="text-gaming-purple animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Login Diário</h2>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Resgate suas recompensas diárias por lealdade à Ordem.</p>
                    
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center gap-4">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-center">
                            <Coins className="text-green-500 mb-1" size={24} />
                            <span className="text-xl font-mono font-black text-white">+2</span>
                         </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1 mt-2">
                         <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Próximo resgate em:</p>
                         <div className="bg-black/20 px-4 py-1.5 rounded-lg border border-white/5">
                            <span className="text-lg font-mono font-black text-gaming-purple drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]">{timeToNextBonus}</span>
                         </div>
                      </div>

                      <p className="text-[9px] text-gaming-gold/70 font-bold uppercase tracking-widest italic">Volte amanhã para mais!</p>
                    </div>

                    {promoMessage ? (
                      <div className={`w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 ${promoMessage.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {promoMessage.success ? <Check size={16} /> : <X size={16} />}
                        {promoMessage.text}
                      </div>
                    ) : (
                      <button 
                        onClick={handleClaimBonus}
                        className="w-full bg-gaming-purple text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center gap-3"
                      >
                        Resgatar Bônus <Check size={18} />
                      </button>
                    )}
                  </>
                )}

                {activeModal === 'promo' && (
                  <>
                    <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Inbox size={40} className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Código Secreto</h2>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Insira um código promocional para desbloquear tesouros.</p>
                    
                    <div className="w-full relative mb-6">
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="DIGITE O CÓDIGO"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center font-mono text-xl tracking-[0.2em] focus:outline-none focus:border-blue-500/50 transition-colors uppercase"
                      />
                    </div>

                    {promoMessage ? (
                      <div className={`w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 mb-4 ${promoMessage.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {promoMessage.success ? <Check size={16} /> : <X size={16} />}
                        {promoMessage.text}
                      </div>
                    ) : null}

                    <button 
                      onClick={handlePromoCode}
                      disabled={!promoCode}
                      className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      Confirmar Código <ArrowRight size={18} />
                    </button>
                  </>
                )}

                {activeModal === 'boxes' && (
                  <>
                    <div className="w-20 h-20 bg-gaming-gold/10 border border-gaming-gold/20 rounded-2xl flex items-center justify-center mb-6">
                      <Package size={40} className="text-gaming-gold" />
                    </div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Seus Baús</h2>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Você possui {myMember?.boxes || 0} baús pendentes para abertura.</p>
                    
                    <div className="w-full grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center opacity-40">
                          <Package size={32} className="text-blue-400 mb-2" />
                          <span className="text-[10px] font-black uppercase text-white/40">Comum</span>
                       </div>
                       <div className="bg-gaming-gold/5 border border-gaming-gold/20 rounded-2xl p-4 flex flex-col items-center">
                          <Package size={32} className="text-gaming-gold mb-2" />
                          <span className="text-[10px] font-black uppercase text-gaming-gold">Raro</span>
                       </div>
                    </div>

                    <button 
                      disabled={(myMember?.boxes || 0) <= 0}
                      className="w-full bg-gaming-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {(myMember?.boxes || 0) > 0 ? 'Abrir Baú Aleatório' : 'Nenhum Baú Disponível'}
                    </button>
                    
                    <p className="mt-4 text-[8px] text-white/20 uppercase font-bold tracking-widest">Adquira mais baús na loja em breve.</p>
                  </>
                )}

                {activeModal === 'diamonds' && (
                  <>
                    <div className="w-20 h-20 bg-gaming-gold/10 border border-gaming-gold/20 rounded-2xl flex items-center justify-center mb-6">
                      <Gem size={40} className="text-gaming-gold animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Seus Diamantes</h2>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">O recurso mais valioso da sua jornada.</p>
                    
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gaming-gold font-black uppercase tracking-[0.3em] mb-1">Saldo Atual</span>
                        <div className="flex items-center gap-3">
                          <Gem size={32} className="text-gaming-gold" />
                          <span className="text-4xl font-mono font-black text-white">{myMember?.diamonds || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left w-full space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gaming-gold mt-1 shrink-0" />
                        <p className="text-[10px] text-white/60 font-bold uppercase leading-relaxed tracking-wider">Use diamantes para adquirir o Passe Premium e desbloquear recompensas exclusivas.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gaming-gold mt-1 shrink-0" />
                        <p className="text-[10px] text-white/60 font-bold uppercase leading-relaxed tracking-wider">Troque diamantes por itens raros no Mercado Negro (em breve).</p>
                      </div>
                    </div>
                  </>
                )}

                {activeModal === 'coins' && (
                  <>
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Coins size={40} className="text-green-500 animate-spin-slow" />
                    </div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Suas Moedas</h2>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Acumule riquezas através do bônus diário.</p>
                    
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-green-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Tesouro Acumulado</span>
                        <div className="flex items-center gap-3">
                          <Coins size={32} className="text-green-500" />
                          <span className="text-4xl font-mono font-black text-white">{myMember?.coins || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left w-full space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0" />
                        <p className="text-[10px] text-white/60 font-bold uppercase leading-relaxed tracking-wider">Use moedas para adquirir novas Auras Animadas e Bordas de Herói clicando no seu Perfil.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0" />
                        <p className="text-[10px] text-white/60 font-bold uppercase leading-relaxed tracking-wider">Novas skins e itens de personalização estão sendo forjados para moedas.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
