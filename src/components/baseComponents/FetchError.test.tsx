import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FetchError } from './FetchError';

describe('FetchError', () => {
  it('показывает статус, если error содержит status и вызывает onRetry', async () => {
    const onRetry = vi.fn();
    const onGoHome = vi.fn();

    const error = {
      status: 404,
      data: { detail: 'Not found' },
    } as FetchBaseQueryError;

    render(
      <FetchError
        title="Ошибка при загрузке персонажей."
        error={error}
        onRetry={onRetry}
        onGoHome={onGoHome}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /home page/i }));
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  it('показывает "unknown", если error нет или без status; disabled блокирует клики', async () => {
    const onRetry = vi.fn();
    const onGoHome = vi.fn();

    const serializedErr = { message: 'boom' } as SerializedError; // без status

    render(
      <FetchError
        error={serializedErr}
        onRetry={onRetry}
        onGoHome={onGoHome}
        disabled
      />
    );

    expect(screen.getByText(/unknown/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    const homeBtn = screen.getByRole('button', { name: /home page/i });
    expect(retryBtn).toBeDisabled();
    expect(homeBtn).toBeDisabled();

    await userEvent.click(retryBtn);
    await userEvent.click(homeBtn);
    expect(onRetry).not.toHaveBeenCalled();
    expect(onGoHome).not.toHaveBeenCalled();
  });
});
