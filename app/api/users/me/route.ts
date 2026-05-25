import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

export async function GET(request: Request) {
  return proxyAuthorizedApiRequest(request, '/Users/me', 'GET');
}

export async function PUT(request: Request) {
  return proxyAuthorizedApiRequest(request, '/Users/me', 'PUT');
}
