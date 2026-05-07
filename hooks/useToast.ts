import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/Toast';

const TOAST_LIMIT = 1;
const TOAST_DURATION = 5000;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: 'ADD_TOAST';
      toast: ToasterToast;
    }
  | {
      type: 'UPDATE_TOAST';
      toast: Partial<ToasterToast>;
    }
  | {
      type: 'DISMISS_TOAST';
      toastId?: ToasterToast['id'];
    }
  | {
      type: 'REMOVE_TOAST';
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const toastDismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const clearRemoveTimer = (toastId: string) => {
  const timeout = toastTimeouts.get(toastId);

  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  toastTimeouts.delete(toastId);
};

const clearDismissTimer = (toastId: string) => {
  const timeout = toastDismissTimeouts.get(toastId);

  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  toastDismissTimeouts.delete(toastId);
};

const startDismissTimer = (toastId: string) => {
  if (toastDismissTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastDismissTimeouts.delete(toastId);
    dispatch({
      type: 'DISMISS_TOAST',
      toastId,
    });
  }, TOAST_DURATION);

  toastDismissTimeouts.set(toastId, timeout);
};

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST': {
      const toasts = [action.toast, ...state.toasts].slice(0, TOAST_LIMIT);

      state.toasts
        .filter((toast) => !toasts.some((nextToast) => nextToast.id === toast.id))
        .forEach((toast) => {
          clearDismissTimer(toast.id);
          clearRemoveTimer(toast.id);
        });

      return {
        ...state,
        toasts,
      };
    }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        clearDismissTimer(toastId);
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          clearDismissTimer(toast.id);
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        toastDismissTimeouts.forEach((timeout) => clearTimeout(timeout));
        toastDismissTimeouts.clear();
        toastTimeouts.forEach((timeout) => clearTimeout(timeout));
        toastTimeouts.clear();

        return {
          ...state,
          toasts: [],
        };
      }

      clearDismissTimer(action.toastId);
      clearRemoveTimer(action.toastId);

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });
  startDismissTimer(id);

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
