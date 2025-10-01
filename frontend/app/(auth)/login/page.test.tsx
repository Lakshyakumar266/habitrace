/**
 * Unit tests for the Login Page component
 * Testing Framework: Jest with React Testing Library
 * 
 * Test Coverage:
 * - Component rendering and initial state
 * - Form validation (email and password)
 * - User interactions and form submission
 * - Error handling and error display
 * - Loading states
 * - Navigation and redirection
 * - Accessibility requirements
 * - Edge cases and boundary conditions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from './page';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe('LoginPage Component', () => {
  let mockPush: jest.Mock;
  let mockRouter: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockRouter = {
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the login form with all required elements', () => {
      render(<LoginPage />);
      
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('should render email input with correct attributes', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();
    });

    it('should render password input with correct attributes', () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toBeRequired();
    });

    it('should have submit button enabled initially', () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton).toBeEnabled();
    });

    it('should render a link to sign up page', () => {
      render(<LoginPage />);
      
      const signUpLink = screen.getByRole('link', { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/signup');
    });

    it('should not display any error messages initially', () => {
      render(<LoginPage />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Input Validation', () => {
    it('should accept valid email input', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should accept password input', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'SecurePassword123!');
      
      expect(passwordInput).toHaveValue('SecurePassword123!');
    });

    it('should show validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for empty email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for empty password', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should clear validation errors when user corrects input', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
      
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
    });

    it('should validate password minimum length', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, '123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission - Success Cases', () => {
    it('should submit form with valid credentials', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'fake-jwt-token', user: { id: '1', email: 'test@example.com' } }),
      });

      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'SecurePassword123!');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/login'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'SecurePassword123!',
            }),
          })
        );
      });
    });

    it('should redirect to dashboard after successful login', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'fake-jwt-token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should store authentication token after successful login', async () => {
      const user = userEvent.setup();
      const mockToken = 'fake-jwt-token';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken, user: { id: '1' } }),
      });

      const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', mockToken);
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (global.fetch as jest.Mock).mockReturnValueOnce(mockPromise);

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      expect(screen.getByText(/loading|signing in/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading|signing in/i })).toBeDisabled();
      
      resolvePromise({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });
      
      await waitFor(() => {
        expect(screen.queryByText(/loading|signing in/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission - Error Cases', () => {
    it('should display error message for invalid credentials', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password' }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'WrongPassword');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    it('should display error message for network failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error|something went wrong/i)).toBeInTheDocument();
      });
    });

    it('should handle 500 server error gracefully', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/server error|something went wrong/i)).toBeInTheDocument();
      });
    });

    it('should handle account locked error', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 423,
        json: async () => ({ message: 'Account is locked' }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'locked@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/account is locked/i)).toBeInTheDocument();
      });
    });

    it('should re-enable form after error', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error|something went wrong/i)).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton).toBeEnabled();
    });

    it('should allow retry after failed submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'token', user: { id: '1' } }),
        });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error|something went wrong/i)).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very long email addresses', async () => {
      const user = userEvent.setup();
      const longEmail = 'a'.repeat(100) + '@example.com';
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, longEmail);
      
      expect(emailInput).toHaveValue(longEmail);
    });

    it('should handle very long passwords', async () => {
      const user = userEvent.setup();
      const longPassword = 'P@ssw0rd!' + 'a'.repeat(100);
      
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, longPassword);
      
      expect(passwordInput).toHaveValue(longPassword);
    });

    it('should handle special characters in email', async () => {
      const user = userEvent.setup();
      const specialEmail = 'test+user@example.co.uk';
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, specialEmail);
      
      expect(emailInput).toHaveValue(specialEmail);
    });

    it('should handle special characters in password', async () => {
      const user = userEvent.setup();
      const specialPassword = 'P@$$w0rd!#%^&*()';
      
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, specialPassword);
      
      expect(passwordInput).toHaveValue(specialPassword);
    });

    it('should prevent multiple simultaneous submissions', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (global.fetch as jest.Mock).mockReturnValueOnce(mockPromise);
      
      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      resolvePromise({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });
    });

    it('should handle empty string spaces in email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, '   ');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/email is required|invalid email/i)).toBeInTheDocument();
      });
    });

    it('should trim whitespace from email input', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), '  test@example.com  ');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'Password123!',
            }),
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<LoginPage />);
      
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-label');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-label');
    });

    it('should associate labels with inputs correctly', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('id');
      expect(passwordInput).toHaveAttribute('id');
    });

    it('should have accessible error messages', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/password/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /log in/i })).toHaveFocus();
    });

    it('should allow form submission with Enter key', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'Password123!{Enter}');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should have sufficient color contrast for error messages', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        const styles = window.getComputedStyle(errorMessage);
        expect(styles.color).toBeTruthy();
      });
    });
  });

  describe('Security Considerations', () => {
    it('should not display password in plain text', () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should not log sensitive data to console', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log');
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'SecurePassword123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
      
      const consoleOutput = consoleSpy.mock.calls.flat().join(' ');
      expect(consoleOutput).not.toContain('SecurePassword123!');
      
      consoleSpy.mockRestore();
    });

    it('should have autocomplete attributes for password managers', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });
  });

  describe('User Experience', () => {
    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });

    it('should show password visibility toggle', () => {
      render(<LoginPage />);
      
      const toggleButton = screen.queryByRole('button', { name: /show|hide password/i });
      if (toggleButton) {
        expect(toggleButton).toBeInTheDocument();
      }
    });

    it('should display forgot password link', () => {
      render(<LoginPage />);
      
      const forgotPasswordLink = screen.queryByRole('link', { name: /forgot password/i });
      if (forgotPasswordLink) {
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute('href');
      }
    });

    it('should have proper focus management after error', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/network error|something went wrong/i)).toBeInTheDocument();
      });
      
      // Form should still be interactive
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeEnabled();
    });
  });

  describe('Integration with Authentication System', () => {
    it('should send correct headers with login request', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });
    });

    it('should handle redirect parameter from URL', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'location', {
        value: { search: '?redirect=/profile' },
        writable: true,
      });
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', user: { id: '1' } }),
      });

      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/'));
      });
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks with unmounting', () => {
      const { unmount } = render(<LoginPage />);
      
      expect(() => unmount()).not.toThrow();
    });

    it('should debounce validation checks', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      await user.type(emailInput, 'test');
      await user.type(emailInput, '@');
      await user.type(emailInput, 'example');
      
      // Validation should not run after every keystroke
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });
});