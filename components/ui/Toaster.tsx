'use client';

import { useToast } from '@/hooks/useToast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/Toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, onOpenChange, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title ? <ToastTitle>{title}</ToastTitle> : null}
            {description ? <ToastDescription>{description}</ToastDescription> : null}
          </div>
          {action}
          <ToastClose
            onClick={() => {
              if (onOpenChange) {
                onOpenChange(false);
                return;
              }

              dismiss(id);
            }}
          />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
