import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/mocks/server';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query.includes('dark'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());
