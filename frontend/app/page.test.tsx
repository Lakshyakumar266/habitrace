/**
 * Home page tests
 * Testing library/framework: Vitest + React Testing Library
 * If using Jest, replace `vi` with `jest` and import '@testing-library/jest-dom' instead of '/vitest'.
 */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Capture the router push mock for assertions
let pushMock: ReturnType<typeof vi.fn>;

// Mock Next.js router
vi.mock('next/navigation', () => {
  pushMock = vi.fn();
  return {
    useRouter: () => ({ push: pushMock }),
  };
});

// Mock the Hero01 component to a simple identifiable stub
vi.mock('@/components/MainPage/HomePage', () => {
  const React = require('react');
  const Stub = () => React.createElement('div', { 'data-testid': 'hero01' }, 'Hero01 Stub');
  return { default: Stub };
});

// Import after mocks so they take effect
import Home from './page';

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the Hero01 section', () => {
    render(<Home />);
    expect(screen.getByTestId('hero01')).toBeInTheDocument();
  });

  it('does not navigate on mount (router.push is not called)', () => {
    render(<Home />);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('is stable across re-renders and matches snapshot', () => {
    const { asFragment, rerender } = render(<Home />);
    const first = asFragment();
    rerender(<Home />);
    expect(asFragment()).toMatchSnapshot();
    // keep an initial snapshot to detect large structural shifts
    expect(first).toMatchSnapshot();
  });

  it('unmounts without throwing', () => {
    const { unmount } = render(<Home />);
    expect(() => unmount()).not.toThrow();
  });
});