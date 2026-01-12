import { ReactNode } from 'react';

export const GENERIC_BORDER_CLASSES = 'border-t border-l border-r-4 border-b-4 rounded-[16]';

export default function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bg-white ${GENERIC_BORDER_CLASSES} ${className}`}>{children}</div>;
}
