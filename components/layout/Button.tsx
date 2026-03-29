import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  icon?: ReactNode;
  addDropShadow?: boolean;
};

export default function Button({
  text,
  icon,
  addDropShadow = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-yellow-500 px-4 py-2 text-neutral-900 flex items-center gap-2 rounded-[999] border ${addDropShadow ? 'drop-shadow-[4px_4px_0_rgba(0,0,0,1)]' : ''} cursor-pointer ${className}`}
      {...props}
    >
      <div className="w-4 h-4">{icon}</div> <span className="font-bold">{text}</span>
    </button>
  );
}
