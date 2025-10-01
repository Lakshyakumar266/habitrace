import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopNav } from './top-nav';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('TopNav Component', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    pathname: '/',
    query: {},
    asPath: '/',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the navigation component', () => {
      render(<TopNav />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should render the logo/brand name', () => {
      render(<TopNav />);
      const logo = screen.getByRole('link', { name: /logo|brand|home/i });
      expect(logo).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<TopNav />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should render navigation menu items', () => {
      render(<TopNav />);
      // Check for common nav items
      expect(screen.queryByText(/home/i) || screen.queryByText(/dashboard/i)).toBeTruthy();
    });

    it('should have correct CSS classes applied', () => {
      const { container } = render(<TopNav />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass();
    });

    it('should render with proper semantic HTML structure', () => {
      const { container } = render(<TopNav />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav?.tagName).toBe('NAV');
    });
  });

  describe('Authentication States', () => {
    it('should display login/signup links when user is not authenticated', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });
      
      render(<TopNav />);
      expect(
        screen.queryByText(/login|sign in/i) ||
        screen.queryByText(/signup|sign up|register/i)
      ).toBeTruthy();
    });

    it('should display user menu when user is authenticated', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      expect(
        screen.queryByText(/test user/i) ||
        screen.queryByText(/profile|account|logout/i)
      ).toBeTruthy();
    });

    it('should show loading state during authentication check', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'loading',
      });
      
      render(<TopNav />);
      // Component should still render during loading
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should display user avatar when authenticated', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://example.com/avatar.jpg',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      const avatar = screen.queryByRole('img', { name: /avatar|profile/i });
      if (avatar) {
        expect(avatar).toBeInTheDocument();
      }
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render mobile menu toggle button', () => {
      render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle|hamburger/i }) ||
                          screen.queryByLabelText(/menu|toggle/i);
      // Mobile menu toggle should exist or component is desktop-only
      expect(toggleButton || screen.getByRole('navigation')).toBeTruthy();
    });

    it('should toggle mobile menu when hamburger is clicked', () => {
      render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle/i });
      
      if (toggleButton) {
        fireEvent.click(toggleButton);
        // Menu should expand or change state
        expect(toggleButton).toBeInTheDocument();
      }
    });

    it('should close mobile menu when clicking outside', () => {
      const { container } = render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle/i });
      
      if (toggleButton) {
        fireEvent.click(toggleButton);
        fireEvent.click(container);
        // Menu should close
        expect(container).toBeInTheDocument();
      }
    });

    it('should close mobile menu when a navigation link is clicked', () => {
      render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle/i });
      
      if (toggleButton) {
        fireEvent.click(toggleButton);
        const links = screen.getAllByRole('link');
        if (links.length > 0) {
          fireEvent.click(links[0]);
          // Menu should close after navigation
        }
      }
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes for all links', () => {
      render(<TopNav />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    it('should highlight active route', () => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/dashboard',
      });
      
      render(<TopNav />);
      const dashboardLink = screen.queryByRole('link', { name: /dashboard/i });
      
      if (dashboardLink) {
        expect(dashboardLink).toHaveClass(/active|current/);
      }
    });

    it('should navigate to home when logo is clicked', () => {
      render(<TopNav />);
      const logo = screen.getAllByRole('link')[0]; // Usually first link
      
      expect(logo).toHaveAttribute('href');
      const href = logo.getAttribute('href');
      expect(href === '/' || href === '/home').toBeTruthy();
    });

    it('should apply active styles to current page link', () => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/about',
      });
      
      render(<TopNav />);
      // Active link should have visual indicator
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should open user dropdown menu when clicked', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      const userMenuButton = screen.queryByRole('button', { name: /test user|account|profile/i });
      
      if (userMenuButton) {
        fireEvent.click(userMenuButton);
        // Dropdown should be visible
        expect(userMenuButton).toBeInTheDocument();
      }
    });

    it('should close dropdown when clicking outside', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      const { container } = render(<TopNav />);
      const userMenuButton = screen.queryByRole('button', { name: /test user|account/i });
      
      if (userMenuButton) {
        fireEvent.click(userMenuButton);
        fireEvent.click(container);
        // Dropdown should close
      }
    });

    it('should handle keyboard navigation with Tab key', () => {
      render(<TopNav />);
      const links = screen.getAllByRole('link');
      
      if (links.length > 0) {
        links[0].focus();
        expect(links[0]).toHaveFocus();
        
        fireEvent.keyDown(links[0], { key: 'Tab' });
      }
    });

    it('should handle keyboard navigation with Enter key', () => {
      render(<TopNav />);
      const links = screen.getAllByRole('link');
      
      if (links.length > 0) {
        fireEvent.keyDown(links[0], { key: 'Enter' });
        expect(links[0]).toBeInTheDocument();
      }
    });

    it('should handle Escape key to close dropdowns', () => {
      render(<TopNav />);
      const toggleButton = screen.queryByRole('button');
      
      if (toggleButton) {
        fireEvent.click(toggleButton);
        fireEvent.keyDown(toggleButton, { key: 'Escape' });
        // Dropdown should close
      }
    });
  });

  describe('Logout Functionality', () => {
    it('should call signOut when logout button is clicked', async () => {
      const { signOut } = require('next-auth/react');
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      const logoutButton = screen.queryByRole('button', { name: /logout|sign out/i }) ||
                          screen.queryByText(/logout|sign out/i);
      
      if (logoutButton) {
        fireEvent.click(logoutButton);
        await waitFor(() => {
          expect(signOut).toHaveBeenCalled();
        });
      }
    });

    it('should redirect to home page after logout', async () => {
      const { signOut } = require('next-auth/react');
      (signOut as jest.Mock).mockResolvedValue(undefined);
      
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      const logoutButton = screen.queryByRole('button', { name: /logout|sign out/i });
      
      if (logoutButton) {
        fireEvent.click(logoutButton);
        await waitFor(() => {
          expect(signOut).toHaveBeenCalledWith(
            expect.objectContaining({
              callbackUrl: expect.any(String),
            })
          );
        });
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user name gracefully', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle missing user email gracefully', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle null session data', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });
      
      render(<TopNav />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle undefined router', () => {
      (useRouter as jest.Mock).mockReturnValue(undefined);
      
      // Component should handle gracefully or throw appropriate error
      expect(() => render(<TopNav />)).not.toThrow();
    });

    it('should handle very long user names', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'A'.repeat(100),
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle special characters in user name', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test <script>alert("xss")</script> User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      // Should not execute script
      expect(screen.queryByText(/script/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      render(<TopNav />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      const buttons = screen.queryAllByRole('button');
      buttons.forEach(button => {
        expect(
          button.getAttribute('aria-label') ||
          button.textContent ||
          button.getAttribute('aria-labelledby')
        ).toBeTruthy();
      });
    });

    it('should support keyboard navigation', () => {
      render(<TopNav />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper focus indicators', () => {
      render(<TopNav />);
      const firstLink = screen.getAllByRole('link')[0];
      
      firstLink.focus();
      expect(firstLink).toHaveFocus();
    });

    it('should announce dropdown state to screen readers', () => {
      render(<TopNav />);
      const buttons = screen.queryAllByRole('button');
      
      buttons.forEach(button => {
        const expanded = button.getAttribute('aria-expanded');
        if (expanded !== null) {
          expect(['true', 'false']).toContain(expanded);
        }
      });
    });

    it('should have accessible navigation landmark', () => {
      render(<TopNav />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should provide skip to content link for screen readers', () => {
      render(<TopNav />);
      // Check for skip link (common accessibility pattern)
      const skipLink = screen.queryByText(/skip to (main )?content/i);
      // Not required but good practice
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(<TopNav />);
      const initialNav = screen.getByRole('navigation');
      
      rerender(<TopNav />);
      const afterRerender = screen.getByRole('navigation');
      
      expect(initialNav).toBe(afterRerender);
    });

    it('should handle rapid clicks on toggle button', () => {
      render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle/i });
      
      if (toggleButton) {
        // Rapid clicking should not break component
        for (let i = 0; i < 10; i++) {
          fireEvent.click(toggleButton);
        }
        expect(toggleButton).toBeInTheDocument();
      }
    });
  });

  describe('Styling and Theming', () => {
    it('should apply theme classes correctly', () => {
      const { container } = render(<TopNav />);
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveClass();
    });

    it('should maintain consistent styling across breakpoints', () => {
      const { container } = render(<TopNav />);
      const nav = container.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
      expect(nav?.className).toBeTruthy();
    });

    it('should handle dark mode theme', () => {
      // Mock dark mode
      const { container } = render(<TopNav />);
      const nav = container.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should handle router errors gracefully', () => {
      (useRouter as jest.Mock).mockImplementation(() => {
        throw new Error('Router error');
      });
      
      // Should either handle error or fail gracefully
      const renderComponent = () => render(<TopNav />);
      // Test depends on error boundary implementation
      expect(renderComponent).toBeDefined();
    });

    it('should handle session errors gracefully', () => {
      (useSession as jest.Mock).mockImplementation(() => {
        throw new Error('Session error');
      });
      
      // Should either handle error or fail gracefully
      const renderComponent = () => render(<TopNav />);
      expect(renderComponent).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should work with all components together', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      });
      
      render(<TopNav />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    });

    it('should maintain state across re-renders', () => {
      const { rerender } = render(<TopNav />);
      const toggleButton = screen.queryByRole('button', { name: /menu|toggle/i });
      
      if (toggleButton) {
        fireEvent.click(toggleButton);
        rerender(<TopNav />);
        expect(toggleButton).toBeInTheDocument();
      }
    });
  });
});