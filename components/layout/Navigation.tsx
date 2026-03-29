'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import Link from 'next/link';

function Navigation() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  return (
    <nav>
      <ul className="md:flex gap-2 hidden md:visible">
        {isLoading ? <li>Loading...</li> : null}
        {!isLoading && !isAuthenticated ? (
          <li>
            <LoginLink postLoginRedirectURL="/decks">Sign in</LoginLink>
          </li>
        ) : null}
        {!isLoading && isAuthenticated ? (
          <li>
            <LogoutLink postLogoutRedirectURL="/">Log out</LogoutLink>
          </li>
        ) : null}
        <li>
          <Link href="/decks">Decks</Link>
        </li>
        <li>About</li>
      </ul>
    </nav>
  );
}

export default Navigation;
