import { 
  Home, 
  Car, 
  Skull, 
  Backpack, 
  Briefcase, 
  Map as MapIcon, 
  Users, 
  LayoutGrid, 
  User, 
  MessageSquare, 
  Send, 
  Settings,
  Link,
  ClipboardList,
  Swords,
  History,
  Globe,
  Gift,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { useClan } from '../context/ClanContext';

export function Sidebar({ 
  isMobile = false, 
  activeTab, 
  setActiveTab 
}: { 
  isMobile?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { myMember, completeMission, isEcoMode, clan, user } = useClan();

  const isLeader = myMember?.role === 'leader' || user?.email === 'ryankevyn2020@gmail.com' || user?.email === 'ryankevyn3000@gmail.com';

  const baseIcons = [
    { icon: Home, id: 'inicio', label: 'Início' },
    { icon: Skull, id: 'combate', label: 'Combate' },
    { icon: ClipboardList, id: 'missoes', label: 'Missões', notify: true },
    { icon: BookOpen, id: 'guia', label: 'Guia e Dicas' },
    { icon: Gift, id: 'recompensas', label: 'Recompensas' },
    { icon: User, id: 'perfil', label: 'Perfil' },
    { icon: Settings, id: 'configuracoes', label: 'Configurações' },
  ];

  const adminIcons = isLeader ? [
    { icon: ShieldCheck, id: 'gerencia', label: 'Gerência' }
  ] : [];

  const icons = [...baseIcons, ...adminIcons];

  const displayedIcons = isMobile 
    ? icons.filter(i => ['inicio', 'combate', 'missoes', 'guia', 'recompensas', 'perfil', 'configuracoes', 'gerencia'].includes(i.id)) 
    : icons;

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (id !== 'inicio') {
      completeMission('explore_menus', 15);
    }
  };

  const isTabActive = (id: string) => activeTab === id;

  return (
    <aside className={`
      bg-gaming-bg border-gaming-border z-50 flex items-center transition-all duration-300
      ${isMobile 
        ? 'fixed bottom-0 left-0 right-0 h-20 border-t justify-around px-6 py-2 pb-6' 
        : 'fixed left-0 top-0 w-16 h-full border-r flex-col py-6 gap-6'}
    `}>
      {!isMobile && (
        <div className="mb-4 w-10 h-10 mx-auto flex items-center justify-center">
          {clan?.logoUrl || clan?.guideImagePost1 ? (
            ((clan.logoUrl && clan.logoUrl.length < 8) || (clan.guideImagePost1 && clan.guideImagePost1.length < 8)) ? (
              <span className={`text-2xl ${isEcoMode ? '' : 'drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]'} select-none`}>
                {clan.logoUrl || clan.guideImagePost1}
              </span>
            ) : (
              <img 
                src={clan?.logoUrl || clan?.guideImagePost1} 
                alt="Logo" 
                className={`w-full h-full object-contain ${isEcoMode ? '' : 'drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]'}`} 
              />
            )
          ) : (
            <span className={`text-2xl ${isEcoMode ? '' : 'drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]'} select-none`}>🐺</span>
          )}
        </div>
      )}
      
      <div className={`flex gap-2 ${isMobile ? 'flex-row w-full justify-around' : 'flex-col flex-1'}`}>
        {displayedIcons.map((item) => {
          const hasNotification = item.id === 'missoes' && !myMember?.visitedMissionsBoard;

          return (
            <motion.button
              key={item.id}
              whileHover={!isEcoMode ? { scale: 1.1 } : {}}
              whileTap={!isEcoMode ? { scale: 0.95 } : {}}
              onClick={() => handleTabClick(item.id)}
              className={`relative transition-colors duration-200 flex items-center justify-center ${
                isMobile ? 'p-3 flex-col gap-1' : 'p-2.5 rounded-lg'
              } ${
                isTabActive(item.id) 
                  ? 'bg-gaming-gold/20 text-gaming-gold shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              } ${isMobile ? 'bg-transparent shadow-none border-0' : ''}`}
            >
              <item.icon size={20} />
              
              {hasNotification && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-gaming-bg ring-1 ring-red-500/50" />
              )}

              {isMobile && isTabActive(item.id) && (
                 <motion.div layoutId="activeDot" className="w-1 h-1 bg-gaming-gold rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      {!isMobile && (
        <div className="mt-auto opacity-20 hover:opacity-100 transition-opacity p-4">
           <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter">V1.0</span>
        </div>
      )}
    </aside>
  );
}
