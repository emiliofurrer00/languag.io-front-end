import 'server-only';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const missingAudienceMessage =
  'Authenticated Kinde session is missing an API access token. Set KINDE_AUDIENCE to your backend API audience and restart Next.js.';

type AccessTokenDiagnostics = {
  audiences: string[];
  authorizedParty?: string;
  issuer?: string;
  subject?: string;
};

export function getConfiguredApiAudiences() {
  return (process.env.KINDE_AUDIENCE ?? '')
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function readAccessTokenDiagnostics(token: string): AccessTokenDiagnostics | null {
  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const parsed = JSON.parse(Buffer.from(`${normalized}${padding}`, 'base64').toString('utf-8')) as {
      aud?: string | string[];
      azp?: string;
      iss?: string;
      sub?: string;
    };

    return {
      audiences: Array.isArray(parsed.aud) ? parsed.aud : parsed.aud ? [parsed.aud] : [],
      authorizedParty: parsed.azp,
      issuer: parsed.iss,
      subject: parsed.sub,
    };
  } catch {
    return null;
  }
}

export async function getOptionalApiAccessToken() {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return null;
  }

  return await getAccessTokenRaw();
}

export async function getRequiredApiAccessToken() {
  const accessToken = await getOptionalApiAccessToken();

  if (!accessToken) {
    throw new Error(missingAudienceMessage);
  }

  return accessToken;
}

export function getMissingAudienceMessage() {
  return missingAudienceMessage;
}
