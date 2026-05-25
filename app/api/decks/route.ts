import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';
import { proxyDeckListRead } from './proxy';

export async function GET(request: Request) {
  return proxyDeckListRead(request);
}

export async function POST(request: Request) {
  return proxyAuthorizedApiRequest(request, '/decks', 'POST');
}
