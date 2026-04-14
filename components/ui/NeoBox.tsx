export default function NeoBox({
  children,
  className,
  padding = 'p-8',
  shadowOffset = '6px',
  borderWidth = '3px',
  alignItems = 'center',
  justifyContent = 'center',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  shadowOffset?: string;
  borderWidth?: string;
  alignItems?: string;
  justifyContent?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-[${borderWidth}] border-foreground ${padding} flex flex-col items-${alignItems} justify-${justifyContent} shadow-[${shadowOffset}_${shadowOffset}_0_0_hsl(var(--foreground))] ${className}`}
    >
      {children}
    </div>
  );
}
