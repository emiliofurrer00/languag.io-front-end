import { proxyAuthorizedApiRequest } from '../../proxy-authorized';

export async function GET(request: Request) {
  return proxyAuthorizedApiRequest(request, '/decks/study-recommendations', 'GET', {
    forwardQuery: true,
  });
}
