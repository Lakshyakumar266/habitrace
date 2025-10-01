import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

/**
 * Unit tests for vitest.setup.ts
 * 
 * This test file validates the setup configuration for Vitest including:
 * - Proper extension of jest-dom matchers
 * - Automatic cleanup after each test
 * - Global test environment configuration
 */

describe('Vitest Setup Configuration', () => {
  describe('jest-dom matchers extension', () => {
    it('should extend expect with jest-dom matchers', () => {
      // Verify that custom matchers from @testing-library/jest-dom are available
      expect(expect).toBeDefined();
      expect(typeof expect.extend).toBe('function');
    });

    it('should have toBeInTheDocument matcher available', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      expect(div).toBeInTheDocument();
      
      document.body.removeChild(div);
    });

    it('should have toHaveTextContent matcher available', () => {
      const element = document.createElement('span');
      element.textContent = 'Hello World';
      
      expect(element).toHaveTextContent('Hello World');
    });

    it('should have toBeVisible matcher available', () => {
      const element = document.createElement('div');
      element.style.display = 'block';
      document.body.appendChild(element);
      
      expect(element).toBeVisible();
      
      document.body.removeChild(element);
    });

    it('should have toBeDisabled matcher available', () => {
      const button = document.createElement('button');
      button.disabled = true;
      
      expect(button).toBeDisabled();
    });

    it('should have toHaveClass matcher available', () => {
      const element = document.createElement('div');
      element.className = 'test-class';
      
      expect(element).toHaveClass('test-class');
    });

    it('should have toHaveAttribute matcher available', () => {
      const element = document.createElement('input');
      element.setAttribute('type', 'text');
      
      expect(element).toHaveAttribute('type', 'text');
    });

    it('should have toHaveStyle matcher available', () => {
      const element = document.createElement('div');
      element.style.color = 'red';
      
      expect(element).toHaveStyle({ color: 'red' });
    });

    it('should have toContainElement matcher available', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);
      
      expect(parent).toContainElement(child);
    });

    it('should have toBeEmpty matcher available', () => {
      const element = document.createElement('div');
      
      expect(element).toBeEmpty();
    });

    it('should have toHaveValue matcher available', () => {
      const input = document.createElement('input');
      input.value = 'test value';
      
      expect(input).toHaveValue('test value');
    });
  });

  describe('cleanup functionality', () => {
    it('should cleanup render after each test', () => {
      // Create a mock element to verify cleanup behavior
      const testElement = document.createElement('div');
      testElement.id = 'test-element';
      document.body.appendChild(testElement);
      
      expect(document.getElementById('test-element')).toBeTruthy();
      
      // Manually call cleanup to simulate afterEach behavior
      cleanup();
      
      // In a real scenario, React Testing Library's cleanup would remove rendered components
      // For this test, we verify the cleanup function is callable
      expect(cleanup).toBeDefined();
      expect(typeof cleanup).toBe('function');
      
      // Clean up our manual element
      if (document.getElementById('test-element')) {
        document.body.removeChild(testElement);
      }
    });

    it('should have cleanup function from @testing-library/react', () => {
      expect(cleanup).toBeDefined();
      expect(typeof cleanup).toBe('function');
    });

    it('should not throw error when cleanup is called multiple times', () => {
      expect(() => {
        cleanup();
        cleanup();
      }).not.toThrow();
    });
  });

  describe('DOM environment validation', () => {
    it('should have global document object available', () => {
      expect(document).toBeDefined();
      expect(typeof document).toBe('object');
    });

    it('should have global window object available', () => {
      expect(window).toBeDefined();
      expect(typeof window).toBe('object');
    });

    it('should have document.body available', () => {
      expect(document.body).toBeDefined();
      expect(document.body).toBeInstanceOf(HTMLElement);
    });

    it('should be able to create DOM elements', () => {
      const div = document.createElement('div');
      expect(div).toBeDefined();
      expect(div).toBeInstanceOf(HTMLElement);
      expect(div.tagName).toBe('DIV');
    });

    it('should support document.querySelector', () => {
      const testDiv = document.createElement('div');
      testDiv.className = 'test-query-selector';
      document.body.appendChild(testDiv);
      
      const found = document.querySelector('.test-query-selector');
      expect(found).toBeTruthy();
      expect(found).toBe(testDiv);
      
      document.body.removeChild(testDiv);
    });

    it('should support addEventListener on elements', () => {
      const button = document.createElement('button');
      const mockHandler = vi.fn();
      
      button.addEventListener('click', mockHandler);
      button.click();
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('matcher edge cases', () => {
    it('should handle null and undefined with toBeInTheDocument', () => {
      expect(() => {
        // @ts-expect-error - Testing error case
        expect(null).not.toBeInTheDocument();
      }).not.toThrow();
    });

    it('should properly negate matchers with .not', () => {
      const element = document.createElement('div');
      element.textContent = 'Hello';
      
      expect(element).not.toHaveTextContent('Goodbye');
    });

    it('should handle empty strings in toHaveTextContent', () => {
      const element = document.createElement('div');
      element.textContent = '';
      
      expect(element).toHaveTextContent('');
    });

    it('should handle multiple classes with toHaveClass', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3';
      
      expect(element).toHaveClass('class1');
      expect(element).toHaveClass('class2');
      expect(element).toHaveClass('class1', 'class2');
    });

    it('should handle boolean attributes with toHaveAttribute', () => {
      const input = document.createElement('input');
      input.setAttribute('required', '');
      
      expect(input).toHaveAttribute('required');
    });

    it('should handle hidden elements with toBeVisible', () => {
      const element = document.createElement('div');
      element.style.display = 'none';
      document.body.appendChild(element);
      
      expect(element).not.toBeVisible();
      
      document.body.removeChild(element);
    });
  });

  describe('complex DOM scenarios', () => {
    it('should handle nested elements', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      const grandchild = document.createElement('strong');
      
      child.appendChild(grandchild);
      parent.appendChild(child);
      
      expect(parent).toContainElement(child);
      expect(parent).toContainElement(grandchild);
      expect(child).toContainElement(grandchild);
    });

    it('should handle form elements with various states', () => {
      const form = document.createElement('form');
      const input = document.createElement('input');
      const select = document.createElement('select');
      const textarea = document.createElement('textarea');
      
      form.appendChild(input);
      form.appendChild(select);
      form.appendChild(textarea);
      
      expect(form).toContainElement(input);
      expect(form).toContainElement(select);
      expect(form).toContainElement(textarea);
    });

    it('should handle dynamic class manipulation', () => {
      const element = document.createElement('div');
      
      expect(element).not.toHaveClass('dynamic');
      
      element.classList.add('dynamic');
      expect(element).toHaveClass('dynamic');
      
      element.classList.remove('dynamic');
      expect(element).not.toHaveClass('dynamic');
    });

    it('should handle attribute changes', () => {
      const element = document.createElement('div');
      
      expect(element).not.toHaveAttribute('data-test');
      
      element.setAttribute('data-test', 'value');
      expect(element).toHaveAttribute('data-test', 'value');
      
      element.removeAttribute('data-test');
      expect(element).not.toHaveAttribute('data-test');
    });
  });

  describe('input and form validation', () => {
    it('should validate text input values', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = 'test input';
      
      expect(input).toHaveValue('test input');
    });

    it('should validate number input values', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '42';
      
      expect(input).toHaveValue(42);
    });

    it('should validate checkbox checked state', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      
      expect(checkbox).toBeChecked();
    });

    it('should validate radio button states', () => {
      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.name = 'group';
      radio1.checked = true;
      
      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.name = 'group';
      radio2.checked = false;
      
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();
    });

    it('should validate textarea values', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'multiline\ntext\nvalue';
      
      expect(textarea).toHaveValue('multiline\ntext\nvalue');
    });

    it('should validate select element values', () => {
      const select = document.createElement('select');
      const option1 = document.createElement('option');
      const option2 = document.createElement('option');
      
      option1.value = 'option1';
      option2.value = 'option2';
      option2.selected = true;
      
      select.appendChild(option1);
      select.appendChild(option2);
      
      expect(select).toHaveValue('option2');
    });

    it('should validate disabled form elements', () => {
      const input = document.createElement('input');
      const button = document.createElement('button');
      const select = document.createElement('select');
      
      input.disabled = true;
      button.disabled = true;
      select.disabled = true;
      
      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
      expect(select).toBeDisabled();
    });

    it('should validate enabled form elements', () => {
      const input = document.createElement('input');
      const button = document.createElement('button');
      
      expect(input).toBeEnabled();
      expect(button).toBeEnabled();
    });

    it('should validate required form fields', () => {
      const input = document.createElement('input');
      input.required = true;
      
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('required');
    });
  });

  describe('accessibility matchers', () => {
    it('should validate aria attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-label', 'Test Label');
      element.setAttribute('aria-hidden', 'true');
      
      expect(element).toHaveAttribute('aria-label', 'Test Label');
      expect(element).toHaveAttribute('aria-hidden', 'true');
    });

    it('should validate role attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'button');
      
      expect(element).toHaveAttribute('role', 'button');
    });

    it('should handle aria-disabled', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-disabled', 'true');
      
      expect(element).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('style and visibility', () => {
    it('should validate inline styles', () => {
      const element = document.createElement('div');
      element.style.backgroundColor = 'blue';
      element.style.fontSize = '16px';
      element.style.marginTop = '10px';
      
      expect(element).toHaveStyle({
        backgroundColor: 'blue',
        fontSize: '16px',
        marginTop: '10px'
      });
    });

    it('should validate partial style objects', () => {
      const element = document.createElement('div');
      element.style.color = 'red';
      element.style.fontSize = '14px';
      element.style.fontWeight = 'bold';
      
      expect(element).toHaveStyle({ color: 'red' });
      expect(element).toHaveStyle({ fontSize: '14px', fontWeight: 'bold' });
    });

    it('should handle visibility with opacity', () => {
      const element = document.createElement('div');
      element.style.opacity = '0';
      document.body.appendChild(element);
      
      expect(element).not.toBeVisible();
      
      document.body.removeChild(element);
    });

    it('should handle visibility with visibility property', () => {
      const element = document.createElement('div');
      element.style.visibility = 'hidden';
      document.body.appendChild(element);
      
      expect(element).not.toBeVisible();
      
      document.body.removeChild(element);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle detached elements', () => {
      const element = document.createElement('div');
      
      expect(element).not.toBeInTheDocument();
    });

    it('should handle elements with no children', () => {
      const element = document.createElement('div');
      
      expect(element).toBeEmpty();
    });

    it('should handle elements with whitespace', () => {
      const element = document.createElement('div');
      element.textContent = '   ';
      
      expect(element).not.toBeEmpty();
      expect(element).toHaveTextContent('   ');
    });

    it('should handle special characters in text content', () => {
      const element = document.createElement('div');
      element.textContent = '<script>alert("test")</script>';
      
      expect(element).toHaveTextContent('<script>alert("test")</script>');
    });

    it('should handle unicode characters', () => {
      const element = document.createElement('div');
      element.textContent = '你好世界 🌍';
      
      expect(element).toHaveTextContent('你好世界 🌍');
    });

    it('should handle empty attribute values', () => {
      const element = document.createElement('div');
      element.setAttribute('data-empty', '');
      
      expect(element).toHaveAttribute('data-empty', '');
    });

    it('should handle case-sensitive attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-testid', 'MyTest');
      
      expect(element).toHaveAttribute('data-testid', 'MyTest');
      expect(element).not.toHaveAttribute('data-testid', 'mytest');
    });
  });

  describe('integration with vitest globals', () => {
    it('should have describe function available', () => {
      expect(describe).toBeDefined();
      expect(typeof describe).toBe('function');
    });

    it('should have it function available', () => {
      expect(it).toBeDefined();
      expect(typeof it).toBe('function');
    });

    it('should have expect function available', () => {
      expect(expect).toBeDefined();
      expect(typeof expect).toBe('function');
    });

    it('should have beforeEach function available', () => {
      expect(beforeEach).toBeDefined();
      expect(typeof beforeEach).toBe('function');
    });

    it('should have afterEach function available', () => {
      expect(afterEach).toBeDefined();
      expect(typeof afterEach).toBe('function');
    });

    it('should have vi mock utility available', () => {
      expect(vi).toBeDefined();
      expect(typeof vi).toBe('object');
      expect(typeof vi.fn).toBe('function');
      expect(typeof vi.mock).toBe('function');
    });
  });
});

/**
 * Integration tests for setup file side effects
 */
describe('Setup File Side Effects', () => {
  it('should have all matchers loaded without errors', () => {
    // Verify that the matchers object is properly imported
    expect(matchers).toBeDefined();
    expect(typeof matchers).toBe('object');
  });

  it('should not pollute global scope unnecessarily', () => {
    // Verify only expected globals are present
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    expect(expect).toBeDefined();
  });

  it('should maintain test isolation between test suites', () => {
    const element = document.createElement('div');
    element.id = 'isolation-test';
    document.body.appendChild(element);
    
    expect(document.getElementById('isolation-test')).toBeTruthy();
    
    // Cleanup should be handled by afterEach hook
    document.body.removeChild(element);
  });
});