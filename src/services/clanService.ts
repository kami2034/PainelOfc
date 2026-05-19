const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createInitialClan = async (userId: string, userEmail: string | null) => {
  // Now handled by server on init
};

export const joinClan = async (userId: string, nickname: string, userEmail: string | null) => {
  const response = await fetch('/api/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ name: nickname })
  });
  
  if (!response.ok) {
    throw new Error('Failed to join clan');
  }
  
  return response.json();
};

export const updateMemberAvatar = async (clanId: string, userId: string, avatarUrl: string) => {
  const response = await fetch('/api/members/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ avatarUrl })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update avatar');
  }
  
  return response.json();
};
