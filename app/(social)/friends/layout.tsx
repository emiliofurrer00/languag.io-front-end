export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-background pt-14 lg:pl-60">{children}</div>;
}
