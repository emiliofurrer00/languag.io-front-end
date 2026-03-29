import { proxyAuthorizedDeckWrite } from './proxy';

export async function POST(request: Request) {
  return proxyAuthorizedDeckWrite(request, '/decks', 'POST');
}
