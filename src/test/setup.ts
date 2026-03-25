import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).expect = expect;
