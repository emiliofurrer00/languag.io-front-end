import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

export async function GET(request: Request) {
  return proxyAuthorizedApiRequest(request, '/Friends/requests/incoming', 'GET', {
    forwardQuery: true,
  });
}
