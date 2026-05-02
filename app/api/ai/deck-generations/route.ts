import { proxyAuthorizedApiRequest } from '../../proxy-authorized';

export async function POST(request: Request) {
  return proxyAuthorizedApiRequest(request, '/ai/deck-generations', 'POST');
}
