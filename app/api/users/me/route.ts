import { proxyAuthorizedUserRequest } from '../proxy';

export async function GET(request: Request) {
  return proxyAuthorizedUserRequest(request, '/Users/me', 'GET');
}

export async function PUT(request: Request) {
  return proxyAuthorizedUserRequest(request, '/Users/me', 'PUT');
}
