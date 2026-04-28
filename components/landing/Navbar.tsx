import AppNavbar from '@/components/layout/AppNavbar';

const landingLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
];

export default function Navbar({ isLandingPage = false }: { isLandingPage?: boolean }) {
  return (
    <AppNavbar
      className="border-b-0"
      contentClassName="max-w-none"
      desktopLinks={isLandingPage ? landingLinks : []}
      showDesktopAuthActions
    />
  );
}
