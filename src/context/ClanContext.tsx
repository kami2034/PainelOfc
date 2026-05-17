import React, { createContext, useContext, useEffect, useState } from 'react';
import { onSnapshot, doc, collection, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut, getRedirectResult } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface Member {
  id: string;
  userId: string;
  name: string;
  role: 'leader' | 'co-leader' | 'elder' | 'member';
  trophies: number;
  donations: number;
  heroPower: number;
  diamonds: number;
  boxes: number;
  coins: number;
  xp: number;
  level: number;
  completedMissions: string[];
  visitedMissionsBoard: boolean;
  lastDailyBonus?: string;
  opacityLevel?: number;
  status: 'online' | 'offline';
  avatarUrl?: string;
  joinedAt?: string;
  premiumPass?: boolean;
  appTheme?: 'dark' | 'neon' | 'gold' | 'classic';
  chatTheme?: 'dark' | 'neon' | 'gold' | 'classic';
  lastCelebratedLevel?: number;
}

interface Clan {
  id: string;
  name: string;
  tag: string;
  displayId: string;
  level: number;
  description: string;
  capacity: number;
  ownerId: string;
  trophyCount: number;
}

interface ClanContextType {
  user: User | null;
  clan: Clan | null;
  members: Member[];
  myMember: Member | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  claimDailyBonus: () => Promise<boolean>;
  redeemPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  updateMemberData: (data: Partial<Member>) => Promise<void>;
  completeMission: (missionId: string, xpReward: number) => Promise<void>;
  markVisitedMissions: () => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  isEcoMode: boolean;
  toggleEcoMode: () => Promise<void>;
  isOptimizing: boolean;
}

const ClanContext = createContext<ClanContextType | undefined>(undefined);

export const ClanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clan, setClan] = useState<Clan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEcoMode, setIsEcoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isEcoMode');
    return saved === 'true';
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const toggleEcoMode = async () => {
    setIsOptimizing(true);
    // Artificial delay for optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newValue = !isEcoMode;
    setIsEcoMode(newValue);
    localStorage.setItem('isEcoMode', String(newValue));
    setIsOptimizing(null as any); // Reset state
    setIsOptimizing(false);
  };
  
  // Default Clan ID for development
  const DEFAULT_CLAN_ID = 'main-clan';

  const myMember = user ? members.find(m => m.userId === user.uid) || null : null;

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      console.error('Error during redirect login:', error);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setClan(null);
        setMembers([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Update specific user name to Skadir if needed
  useEffect(() => {
    if (user?.email === 'ryankevyn3000@gmail.com' && members.length > 0) {
      const myMember = members.find(m => m.userId === user.uid);
      if (myMember && myMember.name !== 'Skadir') {
        const memberRef = doc(db, 'clans', DEFAULT_CLAN_ID, 'members', user.uid);
        updateDoc(memberRef, { name: 'Skadir' }).catch(err => console.error('Failed to update name to Skadir', err));
      }
    }
  }, [user, members]);

  // Handle First Login Mission
  useEffect(() => {
    if (myMember && !myMember.completedMissions?.includes('first_login')) {
      completeMission('first_login', 15);
    }
  }, [myMember?.userId]);

  // One-time data reset requested by user "reset for me and for everyone"
  useEffect(() => {
    if (myMember && (myMember.diamonds !== 0 || myMember.trophies !== 0)) {
       const memberRef = doc(db, 'clans', DEFAULT_CLAN_ID, 'members', user!.uid);
       updateDoc(memberRef, { 
         diamonds: 0, 
         trophies: 0 
       }).catch(err => console.error('Failed to reset data', err));
    }
    
    // Also reset clan trophies if user is leader
    if (myMember?.role === 'leader' && clan && clan.trophyCount !== 0) {
       const clanRef = doc(db, 'clans', DEFAULT_CLAN_ID);
       updateDoc(clanRef, { trophyCount: 0 }).catch(() => {});
    }
  }, [myMember?.userId, clan?.id]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // 1. Listen to Clan Data
    const clanDocRef = doc(db, 'clans', DEFAULT_CLAN_ID);
    const unsubscribeClan = onSnapshot(clanDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setClan({ id: snapshot.id, ...snapshot.data() } as Clan);
      } else {
        // Fallback for demo: if clan doesn't exist, we don't set it
        setClan(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `clans/${DEFAULT_CLAN_ID}`);
    });

    // 2. Listen to Members
    const membersRef = collection(db, 'clans', DEFAULT_CLAN_ID, 'members');
    const membersQuery = query(membersRef, orderBy('role', 'asc'), orderBy('trophies', 'desc'));
    
    const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Member[];
      setMembers(membersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `clans/${DEFAULT_CLAN_ID}/members`);
      setLoading(false);
    });

    return () => {
      unsubscribeClan();
      unsubscribeMembers();
    };
  }, [user]);

  const isAdmin = members.find(m => m.userId === user?.uid)?.role === 'leader' || 
                  members.find(m => m.userId === user?.uid)?.role === 'co-leader';

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  const updateMemberData = async (data: Partial<Member>) => {
    if (!user || !myMember) return;
    
    const memberRef = doc(db, 'clans', DEFAULT_CLAN_ID, 'members', user.uid);
    // Sanitize data to remove 'id' if present, and any other internal fields
    const { id, ...dataToUpdate } = data as any;
    let finalData = { ...dataToUpdate };

    // Handle XP and Level if XP changes
    if (data.xp !== undefined) {
      const newXp = data.xp;
      
      // Calculate new level based on provided thresholds
      // Level 1: 50, Level 2: 100, Level 3: 200, Level 4: 500, Level 5: 1000...
      const thresholds = [0, 50, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 6000];
      let calculatedLevel = 0;
      for (let i = 0; i < thresholds.length; i++) {
        if (newXp >= thresholds[i]) calculatedLevel = i;
        else break;
      }
      calculatedLevel = Math.min(calculatedLevel, 10);
      
      if (calculatedLevel > (myMember.level || 0)) {
        finalData.level = calculatedLevel;
      }
    }

    try {
      await updateDoc(memberRef, finalData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `clans/${DEFAULT_CLAN_ID}/members/${user.uid}`);
    }
  };

  const completeMission = async (missionId: string, xpReward: number) => {
    if (!myMember || myMember.completedMissions?.includes(missionId)) return;
    
    const newCompleted = [...(myMember.completedMissions || []), missionId];
    const newXp = (myMember.xp || 0) + xpReward;
    
    await updateMemberData({
      completedMissions: newCompleted,
      xp: newXp
    });
  };

  const markVisitedMissions = async () => {
    if (!myMember || myMember.visitedMissionsBoard) return;
    await updateMemberData({ visitedMissionsBoard: true });
  };
  
  const deleteMember = async (memberId: string) => {
    if (!user || !myMember || (myMember.role !== 'leader' && myMember.role !== 'co-leader')) return;
    const memberRef = doc(db, 'clans', DEFAULT_CLAN_ID, 'members', memberId);
    try {
      await deleteDoc(memberRef);
    } catch (err) {
      console.error('Failed to delete member', err);
      alert('Houve um erro ao tentar eliminar o membro. Verifique suas permissões.');
    }
  };

  const updateMemberRole = async (memberId: string, role: string) => {
    if (!user || !myMember || myMember.role !== 'leader') return;
    const memberRef = doc(db, 'clans', DEFAULT_CLAN_ID, 'members', memberId);
    try {
      await updateDoc(memberRef, { role });
    } catch (err) {
      console.error('Failed to update member role', err);
    }
  };

  const claimDailyBonus = async () => {
    if (!user || !myMember) return false;
    
    const today = new Date().toLocaleDateString();
    if (myMember.lastDailyBonus === today) {
      return false;
    }

    await updateMemberData({
      coins: (myMember.coins || 0) + 2,
      lastDailyBonus: today
    });
    return true;
  };

  const redeemPromoCode = async (code: string) => {
    if (!user || !myMember) return { success: false, message: 'Usuário não encontrado' };
    
    const upperCode = code.toUpperCase();
    if (upperCode === 'ORDEMBÔNUS') {
      await updateMemberData({ 
        diamonds: (myMember.diamonds || 0) + 10,
        coins: (myMember.coins || 0) + 500
      });
      return { success: true, message: 'Código resgatado! +10 Diamantes e +500 Moedas' };
    }
    
    if (upperCode === 'BETA2026') {
      await updateMemberData({ boxes: (myMember.boxes || 0) + 1 });
      return { success: true, message: 'Código resgatado! +1 Caixa' };
    }

    return { success: false, message: 'Código inválido' };
  };

  return (
    <ClanContext.Provider value={{ 
      user, clan, members, myMember, loading, isAdmin, logout, 
      updateMemberData, claimDailyBonus, redeemPromoCode, 
      completeMission, markVisitedMissions, deleteMember, updateMemberRole,
      isEcoMode, toggleEcoMode, isOptimizing
    }}>
      {children}
    </ClanContext.Provider>
  );
};

export const useClan = () => {
  const context = useContext(ClanContext);
  if (context === undefined) {
    throw new Error('useClan must be used within a ClanProvider');
  }
  return context;
};
