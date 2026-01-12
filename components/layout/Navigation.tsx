import { SignInButton } from '@clerk/nextjs';

function Navigation() {
  return (
    <nav>
      <ul className="md:flex gap-2 hidden md:visible">
        <li>
          <SignInButton mode="modal">
            <button>Sign in</button>
          </SignInButton>
        </li>
        <li>Decks</li>
        <li>About</li>
      </ul>
    </nav>
  );
}

export default Navigation;
