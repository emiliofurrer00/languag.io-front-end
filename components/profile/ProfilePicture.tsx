import NeoBox from '../ui/NeoBox';

export default function ProfilePicture({
  initials,
  color,
  className,
}: {
  initials: string;
  color: string;
  className?: string;
}) {
  return (
    <NeoBox className={`bg-neo-${color} ${className}`}>
      <span className="text-3xl font-bold">{initials}</span>
    </NeoBox>
  );
}
