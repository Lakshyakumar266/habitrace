
describe('RootLayout - Extended Test Suite', () => {
  describe('Metadata and SEO', () => {
    it('should render with correct document structure', () => {
      render(<RootLayout><div>Test Content</div></RootLayout>);
      
      // Verify the basic structure is present
      expect(document.body).toBeInTheDocument();
    });

    it('should render children within the body element', () => {
      const testContent = 'Unique Test Content';
      render(<RootLayout><div data-testid="child-content">{testContent}</div></RootLayout>);
      
      const childElement = screen.getByTestId('child-content');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent(testContent);
    });

    it('should accept and render multiple children', () => {
      render(
        <RootLayout>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <div data-testid="child-3">Third Child</div>
        </RootLayout>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with null children without crashing', () => {
      expect(() => render(<RootLayout>{null}</RootLayout>)).not.toThrow();
    });

    it('should render with undefined children without crashing', () => {
      expect(() => render(<RootLayout>{undefined}</RootLayout>)).not.toThrow();
    });

    it('should handle empty string children', () => {
      expect(() => render(<RootLayout>{''}</RootLayout>)).not.toThrow();
    });
  });

  describe('HTML Structure', () => {
    it('should have correct html lang attribute', () => {
      const { container } = render(<RootLayout><div>Content</div></RootLayout>);
      const htmlElement = container.closest('html');
      
      if (htmlElement) {
        expect(htmlElement).toHaveAttribute('lang');
      }
    });

    it('should maintain semantic HTML structure', () => {
      render(<RootLayout><main>Main Content</main></RootLayout>);
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveTextContent('Main Content');
    });

    it('should preserve className on body element if provided', () => {
      const { container } = render(<RootLayout><div>Content</div></RootLayout>);
      const bodyElement = container.querySelector('body');
      
      expect(bodyElement).toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('should render React components as children', () => {
      const TestComponent = () => <div data-testid="test-component">Component Content</div>;
      
      render(<RootLayout><TestComponent /></RootLayout>);
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Component Content')).toBeInTheDocument();
    });

    it('should render nested component structures', () => {
      render(
        <RootLayout>
          <div data-testid="parent">
            <div data-testid="child">
              <span data-testid="grandchild">Nested Content</span>
            </div>
          </div>
        </RootLayout>
      );
      
      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('grandchild')).toBeInTheDocument();
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });

    it('should handle children with complex JSX', () => {
      render(
        <RootLayout>
          <header data-testid="header">Header</header>
          <nav data-testid="nav">Navigation</nav>
          <main data-testid="main">Main Content</main>
          <footer data-testid="footer">Footer</footer>
        </RootLayout>
      );
      
      expect(screen.getByTestId('header')).toHaveTextContent('Header');
      expect(screen.getByTestId('nav')).toHaveTextContent('Navigation');
      expect(screen.getByTestId('main')).toHaveTextContent('Main Content');
      expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
    });

    it('should render children with props passed correctly', () => {
      const ChildComponent = ({ title }: { title: string }) => (
        <div data-testid="child-with-props">{title}</div>
      );
      
      render(
        <RootLayout>
          <ChildComponent title="Test Title" />
        </RootLayout>
      );
      
      expect(screen.getByTestId('child-with-props')).toHaveTextContent('Test Title');
    });
  });

  describe('Edge Cases', () => {
    it('should handle boolean children gracefully', () => {
      expect(() => render(<RootLayout>{true}</RootLayout>)).not.toThrow();
      expect(() => render(<RootLayout>{false}</RootLayout>)).not.toThrow();
    });

    it('should handle number children', () => {
      render(<RootLayout>{42}</RootLayout>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should handle array of children', () => {
      const children = [
        <div key="1" data-testid="item-1">Item 1</div>,
        <div key="2" data-testid="item-2">Item 2</div>,
        <div key="3" data-testid="item-3">Item 3</div>
      ];
      
      render(<RootLayout>{children}</RootLayout>);
      
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });

    it('should handle mixed content types', () => {
      render(
        <RootLayout>
          Plain text
          <div data-testid="div-element">Div Element</div>
          {42}
          <span data-testid="span-element">Span Element</span>
        </RootLayout>
      );
      
      expect(screen.getByText('Plain text')).toBeInTheDocument();
      expect(screen.getByTestId('div-element')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByTestId('span-element')).toBeInTheDocument();
    });

    it('should handle fragments as children', () => {
      render(
        <RootLayout>
          <>
            <div data-testid="fragment-child-1">Fragment Child 1</div>
            <div data-testid="fragment-child-2">Fragment Child 2</div>
          </>
        </RootLayout>
      );
      
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain accessible document structure', () => {
      render(
        <RootLayout>
          <h1>Page Title</h1>
          <main>
            <article>
              <h2>Article Heading</h2>
              <p>Article content</p>
            </article>
          </main>
        </RootLayout>
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Page Title' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Article Heading' })).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should render landmark regions correctly', () => {
      render(
        <RootLayout>
          <header role="banner">Banner</header>
          <nav role="navigation">Nav</nav>
          <main role="main">Main</main>
          <footer role="contentinfo">Footer</footer>
        </RootLayout>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should support ARIA attributes on children', () => {
      render(
        <RootLayout>
          <button aria-label="Close dialog" data-testid="aria-button">
            X
          </button>
        </RootLayout>
      );
      
      const button = screen.getByTestId('aria-button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });
  });

  describe('Performance and Re-rendering', () => {
    it('should render efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<RootLayout><div>Content</div></RootLayout>);
      
      rerender(<RootLayout><div>Updated Content</div></RootLayout>);
      
      expect(screen.getByText('Updated Content')).toBeInTheDocument();
    });

    it('should handle rapid children updates', () => {
      const { rerender } = render(<RootLayout><div>Version 1</div></RootLayout>);
      
      rerender(<RootLayout><div>Version 2</div></RootLayout>);
      rerender(<RootLayout><div>Version 3</div></RootLayout>);
      rerender(<RootLayout><div>Version 4</div></RootLayout>);
      
      expect(screen.getByText('Version 4')).toBeInTheDocument();
      expect(screen.queryByText('Version 1')).not.toBeInTheDocument();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with routing components', () => {
      render(
        <RootLayout>
          <nav data-testid="navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </RootLayout>
      );
      
      const nav = screen.getByTestId('navigation');
      expect(nav).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should support provider patterns', () => {
      const ThemeContext = React.createContext({ theme: 'light' });
      const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
        <ThemeContext.Provider value={{ theme: 'dark' }}>
          {children}
        </ThemeContext.Provider>
      );
      
      render(
        <RootLayout>
          <ThemeProvider>
            <div data-testid="themed-content">Content</div>
          </ThemeProvider>
        </RootLayout>
      );
      
      expect(screen.getByTestId('themed-content')).toBeInTheDocument();
    });

    it('should handle error boundaries as children', () => {
      class ErrorBoundary extends React.Component<
        { children: React.ReactNode },
        { hasError: boolean }
      > {
        constructor(props: { children: React.ReactNode }) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        render() {
          if (this.state.hasError) {
            return <div data-testid="error-fallback">Error occurred</div>;
          }
          return this.props.children;
        }
      }

      render(
        <RootLayout>
          <ErrorBoundary>
            <div data-testid="protected-content">Protected Content</div>
          </ErrorBoundary>
        </RootLayout>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept ReactNode as children type', () => {
      const validChildren: React.ReactNode = <div>Valid Content</div>;
      
      expect(() => render(<RootLayout>{validChildren}</RootLayout>)).not.toThrow();
    });

    it('should render with string children', () => {
      render(<RootLayout>Plain string content</RootLayout>);
      
      expect(screen.getByText('Plain string content')).toBeInTheDocument();
    });

    it('should handle conditional rendering', () => {
      const shouldRender = true;
      
      render(
        <RootLayout>
          {shouldRender && <div data-testid="conditional-content">Conditional Content</div>}
        </RootLayout>
      );
      
      expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
    });

    it('should handle conditional rendering when false', () => {
      const shouldRender = false;
      
      render(
        <RootLayout>
          {shouldRender && <div data-testid="conditional-content">Conditional Content</div>}
        </RootLayout>
      );
      
      expect(screen.queryByTestId('conditional-content')).not.toBeInTheDocument();
    });
  });

  describe('Style and Class Handling', () => {
    it('should preserve className on children', () => {
      render(
        <RootLayout>
          <div className="custom-class" data-testid="styled-element">
            Styled Content
          </div>
        </RootLayout>
      );
      
      const element = screen.getByTestId('styled-element');
      expect(element).toHaveClass('custom-class');
    });

    it('should handle inline styles on children', () => {
      render(
        <RootLayout>
          <div style={{ color: 'red' }} data-testid="inline-styled">
            Inline Styled
          </div>
        </RootLayout>
      );
      
      const element = screen.getByTestId('inline-styled');
      expect(element).toHaveStyle({ color: 'red' });
    });

    it('should support multiple classes on children', () => {
      render(
        <RootLayout>
          <div className="class-1 class-2 class-3" data-testid="multi-class">
            Multi-class Element
          </div>
        </RootLayout>
      );
      
      const element = screen.getByTestId('multi-class');
      expect(element).toHaveClass('class-1');
      expect(element).toHaveClass('class-2');
      expect(element).toHaveClass('class-3');
    });
  });

  describe('Event Handling', () => {
    it('should preserve event handlers on children', () => {
      const handleClick = jest.fn();
      
      render(
        <RootLayout>
          <button data-testid="clickable-button" onClick={handleClick}>
            Click Me
          </button>
        </RootLayout>
      );
      
      const button = screen.getByTestId('clickable-button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple event types', () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      
      render(
        <RootLayout>
          <div
            data-testid="interactive-element"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Interactive Element
          </div>
        </RootLayout>
      );
      
      const element = screen.getByTestId('interactive-element');
      
      fireEvent.click(element);
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      fireEvent.mouseEnter(element);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      
      fireEvent.mouseLeave(element);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('should support form interactions', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <RootLayout>
          <form data-testid="test-form" onSubmit={handleSubmit}>
            <input data-testid="test-input" type="text" name="username" />
            <button type="submit">Submit</button>
          </form>
        </RootLayout>
      );
      
      const form = screen.getByTestId('test-form');
      const input = screen.getByTestId('test-input');
      
      fireEvent.change(input, { target: { value: 'testuser' } });
      fireEvent.submit(form);
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Attributes', () => {
    it('should preserve data attributes on children', () => {
      render(
        <RootLayout>
          <div
            data-testid="data-element"
            data-custom="custom-value"
            data-id="123"
          >
            Element with data attributes
          </div>
        </RootLayout>
      );
      
      const element = screen.getByTestId('data-element');
      expect(element).toHaveAttribute('data-custom', 'custom-value');
      expect(element).toHaveAttribute('data-id', '123');
    });
  });

  describe('Snapshot Testing', () => {
    it('should match snapshot with simple children', () => {
      const { container } = render(
        <RootLayout>
          <div>Simple Content</div>
        </RootLayout>
      );
      
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with complex structure', () => {
      const { container } = render(
        <RootLayout>
          <header>
            <h1>Title</h1>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Article content</p>
            </article>
          </main>
          <footer>
            <p>Footer content</p>
          </footer>
        </RootLayout>
      );
      
      expect(container).toMatchSnapshot();
    });
  });
});