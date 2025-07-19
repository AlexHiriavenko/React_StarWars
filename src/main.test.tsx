import { describe, it, beforeEach, expect, vi } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

describe('main.tsx', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('calls createRoot and renders the app', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const { createRoot } = await import('react-dom/client');
    await import('./main');

    expect(createRoot).toHaveBeenCalledOnce();

    const rootApi = (createRoot as ReturnType<typeof vi.fn>).mock.results[0]
      .value;
    expect(rootApi.render).toHaveBeenCalledOnce();
  });

  it('throws an error if root element is missing', async () => {
    document.body.innerHTML = '';

    await expect(import('./main')).rejects.toThrow('Root element not found');
  });
});
