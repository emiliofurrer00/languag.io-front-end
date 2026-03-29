function getRequiredEnvVar(name: 'API_URL' | 'NEXT_PUBLIC_API_URL') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getApiBaseUrl() {
  return process.env.API_URL ?? getRequiredEnvVar('NEXT_PUBLIC_API_URL');
}
