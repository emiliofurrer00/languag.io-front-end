import { proxyAuthorizedDeckWrite, proxyDeckListRead } from './proxy';

export async function GET(request: Request) {
  return proxyDeckListRead(request);
}

export async function POST(request: Request) {
  return proxyAuthorizedDeckWrite(request, '/decks', 'POST');
}
