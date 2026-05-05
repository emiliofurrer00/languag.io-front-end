export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-background pt-28 lg:pl-60">{children}</div>;
}
