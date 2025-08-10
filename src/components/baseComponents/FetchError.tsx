import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type Props = {
  title?: string;
  error?: FetchBaseQueryError | SerializedError;
  onRetry: () => void;
  onGoHome: () => void;
  disabled?: boolean;
};

export function FetchError({
  title = 'Ошибка при загрузке данных.',
  error,
  onRetry,
  onGoHome,
  disabled = false,
}: Props): JSX.Element {
  return (
    <div
      className="p-4 bg-red-500/20 text-red-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <p className="mb-8">{title}</p>
      <pre className="text-2xl opacity-70">
        {error && 'status' in error ? String(error.status) : 'unknown'}
      </pre>

      <div className="mt-8 flex gap-2 justify-center">
        <button
          className="px-2 py-1 border border-white/30 rounded"
          onClick={onRetry}
          disabled={disabled}
        >
          Try again
        </button>

        <button
          className="px-2 py-1 border border-white/30 rounded"
          onClick={onGoHome}
          disabled={disabled}
        >
          Home Page
        </button>
      </div>
    </div>
  );
}
