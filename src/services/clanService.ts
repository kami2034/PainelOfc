/**
 * Service for clan-related API calls
 */

export const updateMemberAvatar = async (clanId: string, userId: string, avatarUrl: string) => {
  const token = localStorage.getItem('auth_token');
  const res = await fetch('/api/members/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ avatarUrl })
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update avatar' }));
    throw new Error(error.error || 'Failed to update avatar');
  }
  
  return res.json();
};
