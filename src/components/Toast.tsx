import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`toast-enter fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl ${
        type === 'success'
          ? 'border-goa-green/40 bg-goa-surface text-goa-cream'
          : 'border-goa-pink/40 bg-goa-surface text-goa-cream'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 shrink-0 text-goa-green" aria-hidden="true" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-goa-pink" aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded p-1 text-goa-muted hover:text-goa-cream"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
