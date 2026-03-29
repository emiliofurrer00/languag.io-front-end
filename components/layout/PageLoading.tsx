type PageLoadingProps = {
  title: string;
  description: string;
};

export default function PageLoading({ title, description }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border-[3px] border-foreground bg-card p-8 shadow-[6px_6px_0_0_hsl(var(--foreground))]">
        <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
        <div className="mt-6 h-8 w-2/3 rounded-lg bg-muted animate-pulse" />
        <div className="mt-3 h-4 w-full rounded-lg bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-5/6 rounded-lg bg-muted animate-pulse" />
        <p className="mt-6 text-sm text-muted-foreground">
          {title}: {description}
        </p>
      </div>
    </div>
  );
}
