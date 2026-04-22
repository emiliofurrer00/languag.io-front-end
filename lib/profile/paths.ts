export function buildProfilePath(username?: string | null) {
  if (!username || !username.trim()) {
    return null;
  }

  return `/profile/${encodeURIComponent(username.trim())}`;
}
