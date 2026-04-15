export function normalizeInternalPath(path?: string | null) {
  if (!path) {
    return null;
  }

  const trimmed = path.trim();

  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return null;
  }

  return trimmed;
}

export function buildAuthContinuePath(nextPath?: string | null) {
  const safeNextPath = normalizeInternalPath(nextPath);

  if (!safeNextPath) {
    return '/auth/continue';
  }

  return `/auth/continue?next=${encodeURIComponent(safeNextPath)}`;
}

export function buildOnboardingPath(nextPath?: string | null) {
  const safeNextPath = normalizeInternalPath(nextPath);

  if (!safeNextPath) {
    return '/onboarding';
  }

  return `/onboarding?next=${encodeURIComponent(safeNextPath)}`;
}

export function buildLoginRedirectPath(nextPath?: string | null) {
  return `/api/auth/login?post_login_redirect_url=${encodeURIComponent(buildAuthContinuePath(nextPath))}`;
}
