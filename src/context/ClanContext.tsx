import React, { createContext, useContext, useEffect, useState } from 'react';

interface Member {
  id: string;
  userId: string;
  name: string;
  role: 'leader' | 'diplomat' | 'military_leader' | 'recruiter' | 'muse' | 'warrior';
  reportedAt?: string; 
  reportedBy?: string;
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
  status: 'online' | 'offline' | 'away';
  avatarUrl?: string;
  joinedAt?: string;
  premiumPass?: boolean;
  appTheme?: 'dark' | 'neon' | 'gold' | 'classic';
  chatTheme?: 'dark' | 'neon' | 'gold' | 'classic';
  lastCelebratedLevel?: number;
  updateRewardClaimed?: boolean;
  profileBg?: string;
  profileBorder?: string;
  opacityLevel?: number;
}

interface TheftReport {
  id: string;
  reporterId: string;
  reporterName: string;
  message: string;
  timestamp: string;
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
  logoUrl?: string;
  guideImagePost1?: string;
}

interface User {
  uid: string;
  email: string;
  name: string;
}

interface ClanContextType {
  user: User | null;
  clan: Clan | null;
  members: Member[];
  myMember: Member | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, name: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  claimDailyBonus: () => Promise<boolean>;
  redeemPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  updateMemberData: (data: Partial<Member>) => Promise<void>;
  completeMission: (missionId: string, xpReward: number) => Promise<void>;
  markVisitedMissions: () => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  banMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  updateClanGuideImage: (imageUrl: string) => Promise<void>;
  updateClanLogo: (imageUrl: string) => Promise<void>;
  updatePresenceStatus: (status: 'online' | 'away' | 'offline') => Promise<void>;
  isEcoMode: boolean;
  toggleEcoMode: () => Promise<void>;
  isOptimizing: boolean;
  reportTheft: (message: string) => Promise<void>;
  claimUpdateReward: () => Promise<void>;
  theftReports: TheftReport[];
  clearTheftReport: (reportId: string) => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

const ClanContext = createContext<ClanContextType | undefined>(undefined);

export const ClanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [clan, setClan] = useState<Clan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEcoMode, setIsEcoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isEcoMode');
    return saved === 'true';
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [theftReports, setTheftReports] = useState<TheftReport[]>([]);
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeSubTab, setActiveSubTab] = useState('guias');

  const DEFAULT_CLAN_ID = 'main-clan';
  const myMember = user ? members.find(m => m.userId === user.uid) || null : null;

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchClanData = async () => {
    try {
      const res = await fetch(`/api/clan/${DEFAULT_CLAN_ID}`);
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setClan(data);
      } else {
        const text = await res.text().catch(() => "Could not read response body");
        console.error('Non-JSON or error response from clan API:', res.status, text.slice(0, 200));
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        console.error('CRITICAL: Network connection to server failed. Ensure the server is running and reachable.', err);
      } else {
        console.error('Network error fetching clan:', err);
      }
    }
  };

  const fetchMembersData = async () => {
    try {
      const res = await fetch(`/api/clan/${DEFAULT_CLAN_ID}/members`, {
         headers: getAuthHeader()
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setMembers(data);
      } else {
        const text = await res.text().catch(() => "Could not read response body");
        console.error('Non-JSON or error response from members API:', res.status, text.slice(0, 200));
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        console.error('CRITICAL: Network connection to server failed. Ensure the server is running and reachable.', err);
      } else {
        console.error('Network error fetching members:', err);
      }
    }
  };

  const fetchReportsData = async () => {
    if (myMember?.role !== 'leader') return;
    try {
      const res = await fetch('/api/reports', { headers: getAuthHeader() });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setTheftReports(data);
      } else {
        const text = await res.text().catch(() => "Could not read response body");
        console.error('Non-JSON or error response from reports API:', res.status, text.slice(0, 200));
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        console.error('CRITICAL: Network connection to server failed during reports fetch.', err);
      } else {
        console.error('Error fetching reports:', err);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      // Only set loading to true if we don't have a user yet or if it's the first load
      setLoading(true);
      try {
        // Wait a small moment to ensure server is ready in dev environments
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await Promise.all([
          fetchClanData(),
          fetchMembersData()
        ]);
      } catch (err) {
        console.error('Failed to init clan data:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user?.uid]);

  useEffect(() => {
    // Polling for updates (every 10 seconds)
    const interval = setInterval(() => {
      fetchClanData();
      fetchMembersData();
      if (myMember?.role === 'leader') fetchReportsData();
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.uid, myMember?.role]);

  const login = async (email: string, password?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      setUser(data.user);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (email: string, name: string, password?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      setUser(data.user);
    } else {
      throw new Error(data.error || 'Erro no cadastro');
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setMembers([]);
    setClan(null);
  };

  const updateMemberData = async (data: Partial<Member>) => {
    const res = await fetch('/api/members/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      await fetchMembersData();
    }
  };

  const completeMission = async (missionId: string, xpReward: number) => {
    if (!myMember || myMember.completedMissions?.includes(missionId)) return;
    const newCompleted = [...(myMember.completedMissions || []), missionId];
    const newXp = (myMember.xp || 0) + xpReward;
    await updateMemberData({ completedMissions: newCompleted, xp: newXp });
  };

  const markVisitedMissions = async () => {
    if (!myMember || myMember.visitedMissionsBoard) return;
    await updateMemberData({ visitedMissionsBoard: true });
  };

  const deleteMember = async (memberId: string) => {
    // Implement on server if needed, for now just UI action
    await logout();
  };

  const banMember = async (memberId: string) => {
    await fetch('/api/bans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ userId: memberId, reason: 'Expulsão Definitiva' })
    });
    await fetchMembersData();
  };

  const updateMemberRole = async (memberId: string, role: string) => {
    const res = await fetch(`/api/members/${memberId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      await fetchMembersData();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro ao atualizar cargo');
    }
  };

  const updateClanGuideImage = async (imageUrl: string) => {
    await fetch(`/api/clan/${DEFAULT_CLAN_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ guide_image_post1: imageUrl })
    });
    await fetchClanData();
  };

  const updateClanLogo = async (imageUrl: string) => {
    await fetch(`/api/clan/${DEFAULT_CLAN_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ logo_url: imageUrl })
    });
    await fetchClanData();
  };

  const updatePresenceStatus = async (status: 'online' | 'away' | 'offline') => {
    await updateMemberData({ status });
  };

  const toggleEcoMode = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newValue = !isEcoMode;
    setIsEcoMode(newValue);
    localStorage.setItem('isEcoMode', String(newValue));
    setIsOptimizing(false);
  };

  const claimDailyBonus = async () => {
    if (!user || !myMember) return false;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (myMember.lastDailyBonus === today) return false;
    await updateMemberData({ coins: (myMember.coins || 0) + 2, lastDailyBonus: today });
    return true;
  };

  const redeemPromoCode = async (code: string) => {
    if (!myMember) return { success: false, message: 'Usuário não encontrado' };
    const upperCode = code.toUpperCase();
    if (upperCode === 'ORDEMBÔNUS') {
      await updateMemberData({ diamonds: (myMember.diamonds || 0) + 10, coins: (myMember.coins || 0) + 500 });
      return { success: true, message: 'Código resgatado! +10 Diamantes e +500 Moedas' };
    }
    return { success: false, message: 'Código inválido' };
  };

  const reportTheft = async (message: string) => {
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name: myMember?.name, message })
    });
  };

  const clearTheftReport = async (reportId: string) => {
    await fetch(`/api/reports/${reportId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    await fetchReportsData();
  };

  const claimUpdateReward = async () => {
    if (myMember?.updateRewardClaimed) return;
    await updateMemberData({ coins: (myMember?.coins || 0) + 50, updateRewardClaimed: true });
  };

  const isAdmin = myMember?.role === 'leader';

  return (
    <ClanContext.Provider value={{ 
      user, clan, members, myMember, loading, isAdmin, login, register, logout, 
      updateMemberData, claimDailyBonus, redeemPromoCode, 
      completeMission, markVisitedMissions, deleteMember, banMember, updateMemberRole,
      updateClanGuideImage, updateClanLogo, updatePresenceStatus,
      isEcoMode, toggleEcoMode, isOptimizing,
      reportTheft, theftReports, clearTheftReport,
      claimUpdateReward,
      activeTab, setActiveTab,
      activeSubTab, setActiveSubTab
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
