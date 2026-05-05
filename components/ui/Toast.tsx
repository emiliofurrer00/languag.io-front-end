'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'destructive';

type ToastRootProps = React.ComponentPropsWithRef<'div'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ToastVariant;
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

function ToastViewport({ className, ref, ...props }: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  );
}

function Toast({ className, variant = 'default', open = true, ref, ...props }: ToastRootProps) {
  if (!open) {
    return null;
  }

  const { onOpenChange, ...divProps } = props;
  void onOpenChange;
  const liveRegionProps =
    variant === 'destructive'
      ? ({ role: 'alert', 'aria-live': 'assertive' } as const)
      : ({ role: 'status', 'aria-live': 'polite' } as const);

  return (
    <div
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variant === 'destructive'
          ? 'border-destructive bg-destructive text-destructive-foreground'
          : 'border-border bg-background text-foreground',
        className
      )}
      aria-atomic="true"
      {...liveRegionProps}
      {...divProps}
    />
  );
}

function ToastAction({
  className,
  type = 'button',
  ref,
  ...props
}: React.ComponentPropsWithRef<'button'>) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  type = 'button',
  'aria-label': ariaLabel = 'Close notification',
  ref,
  ...props
}: React.ComponentPropsWithRef<'button'>) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
      {...props}
    >
      {children ?? <X className="h-4 w-4" />}
    </button>
  );
}

function ToastTitle({ className, ref, ...props }: React.ComponentPropsWithRef<'h3'>) {
  return <h3 ref={ref} className={cn('text-sm font-semibold', className)} {...props} />;
}

function ToastDescription({ className, ref, ...props }: React.ComponentPropsWithRef<'p'>) {
  return <p ref={ref} className={cn('text-sm opacity-90', className)} {...props} />;
}

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastActionElement,
  type ToastProps,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
