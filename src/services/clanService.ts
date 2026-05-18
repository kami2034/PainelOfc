import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const createInitialClan = async (userId: string, userEmail: string | null) => {
  const clanId = 'main-clan';
  const clanRef = doc(db, 'clans', clanId);
  
  await setDoc(clanRef, {
    name: 'Aliança Suprema Ordem',
    tag: 'ORDM',
    displayId: 'GO ORDM',
    level: 1,
    description: 'A aliança suprema para dominadores do reino.',
    capacity: 100,
    ownerId: userId,
    trophyCount: 0
  });
};

export const joinClan = async (userId: string, userName: string, userEmail: string | null) => {
  const clanId = 'main-clan';
  const isLeader = userEmail === 'ryankevyn3000@gmail.com';
  const clanRef = doc(db, 'clans', clanId);
  
  if (isLeader) {
    await updateDoc(clanRef, {
      name: 'Aliança Suprema Ordem',
      tag: 'ORDM',
      displayId: 'GO ORDM',
      capacity: 100
    }).catch(() => {});
  }

  const memberRef = doc(db, 'clans', clanId, 'members', userId);
  
  await setDoc(memberRef, {
    userId,
    name: userName,
    role: isLeader ? 'leader' : 'warrior',
    trophies: 0,
    donations: 0,
    xp: 0,
    level: 0,
    heroPower: 0,
    diamonds: 0,
    boxes: 0,
    coins: 0,
    completedMissions: [],
    visitedMissionsBoard: false,
    premiumPass: false,
    appTheme: 'dark',
    chatTheme: 'dark',
    lastCelebratedLevel: 0,
    status: 'online',
    joinedAt: new Date().toLocaleDateString()
  });
};

export const updateMemberAvatar = async (clanId: string, memberId: string, avatarUrl: string) => {
  const memberRef = doc(db, 'clans', clanId, 'members', memberId);
  await updateDoc(memberRef, { avatarUrl });
};

export const updateMemberStatus = async (clanId: string, memberId: string, status: 'online' | 'offline') => {
  const memberRef = doc(db, 'clans', clanId, 'members', memberId);
  await updateDoc(memberRef, { status });
};

export const postAnnouncement = async (clanId: string, authorId: string, title: string, content: string) => {
  const announcementsRef = collection(db, 'clans', clanId, 'announcements');
  await addDoc(announcementsRef, {
    title,
    content,
    authorId,
    createdAt: serverTimestamp()
  });
};
