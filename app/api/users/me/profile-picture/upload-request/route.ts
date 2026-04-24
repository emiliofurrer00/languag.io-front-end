import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

export async function POST(request: Request) {
  return proxyAuthorizedApiRequest(request, '/Users/me/profile-picture/upload-request', 'POST');
}
