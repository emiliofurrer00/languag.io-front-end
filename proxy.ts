import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(async function proxy() {}, {
  publicPaths: [
    '/',
    '/auth/continue',
    /^\/api\/auth\/.*/,
    /^\/decks(?:\/(?!editor(?:\/|$))[^/]+)?$/,
    /^\/sagas(?:\/(?!create(?:\/|$))[^/]+)?$/,
    /^\/profile\/(?!me(?:\/|$))[^/]+$/,
    '/robots.txt',
    '/sitemap.xml',
  ],
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
