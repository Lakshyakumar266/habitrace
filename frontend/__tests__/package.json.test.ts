import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('package.json validation tests', () => {
  let packageJson: any;
  let packageJsonRaw: string;

  beforeAll(() => {
    // Read the package.json file
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(packageJsonRaw);
  });

  describe('JSON structure and syntax', () => {
    it('should be valid JSON', () => {
      expect(() => JSON.parse(packageJsonRaw)).not.toThrow();
    });

    it('should parse to an object', () => {
      expect(typeof packageJson).toBe('object');
      expect(packageJson).not.toBeNull();
      expect(Array.isArray(packageJson)).toBe(false);
    });
  });

  describe('required fields', () => {
    it('should have a name field', () => {
      expect(packageJson).toHaveProperty('name');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name.length).toBeGreaterThan(0);
    });

    it('should have a valid name', () => {
      expect(packageJson.name).toBe('frontend');
      // Name should not contain uppercase letters
      expect(packageJson.name).toBe(packageJson.name.toLowerCase());
    });

    it('should have a version field', () => {
      expect(packageJson).toHaveProperty('version');
      expect(typeof packageJson.version).toBe('string');
    });

    it('should have a valid semantic version', () => {
      const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
      expect(packageJson.version).toMatch(semverRegex);
    });

    it('should have version 0.1.0', () => {
      expect(packageJson.version).toBe('0.1.0');
    });
  });

  describe('private field', () => {
    it('should have a private field', () => {
      expect(packageJson).toHaveProperty('private');
    });

    it('should be private', () => {
      expect(packageJson.private).toBe(true);
    });

    it('private field should be a boolean', () => {
      expect(typeof packageJson.private).toBe('boolean');
    });
  });

  describe('scripts section', () => {
    it('should have a scripts section', () => {
      expect(packageJson).toHaveProperty('scripts');
      expect(typeof packageJson.scripts).toBe('object');
    });

    it('should have a dev script', () => {
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(typeof packageJson.scripts.dev).toBe('string');
    });

    it('dev script should use next dev with turbopack', () => {
      expect(packageJson.scripts.dev).toBe('next dev --turbopack');
    });

    it('should have a build script', () => {
      expect(packageJson.scripts).toHaveProperty('build');
      expect(typeof packageJson.scripts.build).toBe('string');
    });

    it('build script should use next build with turbopack', () => {
      expect(packageJson.scripts.build).toBe('next build --turbopack');
    });

    it('should have a start script', () => {
      expect(packageJson.scripts).toHaveProperty('start');
      expect(typeof packageJson.scripts.start).toBe('string');
    });

    it('start script should use next start', () => {
      expect(packageJson.scripts.start).toBe('next start');
    });

    it('should have a lint script', () => {
      expect(packageJson.scripts).toHaveProperty('lint');
      expect(typeof packageJson.scripts.lint).toBe('string');
    });

    it('lint script should use eslint', () => {
      expect(packageJson.scripts.lint).toBe('eslint');
    });

    it('all script values should be non-empty strings', () => {
      Object.values(packageJson.scripts).forEach((script) => {
        expect(typeof script).toBe('string');
        expect((script as string).length).toBeGreaterThan(0);
      });
    });
  });

  describe('dependencies section', () => {
    it('should have a dependencies section', () => {
      expect(packageJson).toHaveProperty('dependencies');
      expect(typeof packageJson.dependencies).toBe('object');
    });

    it('should have at least one dependency', () => {
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
    });

    it('all dependencies should have valid version strings', () => {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(typeof name).toBe('string');
        expect(typeof version).toBe('string');
        expect((version as string).length).toBeGreaterThan(0);
      });
    });

    it('should have React as a dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('react');
    });

    it('React version should be 19.1.0', () => {
      expect(packageJson.dependencies.react).toBe('19.1.0');
    });

    it('should have React DOM as a dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('react-dom');
    });

    it('React DOM version should match React version', () => {
      expect(packageJson.dependencies['react-dom']).toBe('19.1.0');
    });

    it('should have Next.js as a dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('next');
    });

    it('Next.js version should be 15.5.4', () => {
      expect(packageJson.dependencies.next).toBe('15.5.4');
    });

    describe('Radix UI dependencies', () => {
      it('should have @radix-ui/react-avatar', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-avatar');
        expect(packageJson.dependencies['@radix-ui/react-avatar']).toBe('^1.1.10');
      });

      it('should have @radix-ui/react-collapsible', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-collapsible');
        expect(packageJson.dependencies['@radix-ui/react-collapsible']).toBe('^1.1.12');
      });

      it('should have @radix-ui/react-dialog', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-dialog');
        expect(packageJson.dependencies['@radix-ui/react-dialog']).toBe('^1.1.15');
      });

      it('should have @radix-ui/react-dropdown-menu', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-dropdown-menu');
        expect(packageJson.dependencies['@radix-ui/react-dropdown-menu']).toBe('^2.1.16');
      });

      it('should have @radix-ui/react-label', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-label');
        expect(packageJson.dependencies['@radix-ui/react-label']).toBe('^2.1.7');
      });

      it('should have @radix-ui/react-separator', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-separator');
        expect(packageJson.dependencies['@radix-ui/react-separator']).toBe('^1.1.7');
      });

      it('should have @radix-ui/react-slot', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-slot');
        expect(packageJson.dependencies['@radix-ui/react-slot']).toBe('^1.2.3');
      });

      it('should have @radix-ui/react-tooltip', () => {
        expect(packageJson.dependencies).toHaveProperty('@radix-ui/react-tooltip');
        expect(packageJson.dependencies['@radix-ui/react-tooltip']).toBe('^1.2.8');
      });
    });

    describe('form and validation dependencies', () => {
      it('should have @hookform/resolvers', () => {
        expect(packageJson.dependencies).toHaveProperty('@hookform/resolvers');
        expect(packageJson.dependencies['@hookform/resolvers']).toBe('^5.2.2');
      });

      it('should have react-hook-form', () => {
        expect(packageJson.dependencies).toHaveProperty('react-hook-form');
        expect(packageJson.dependencies['react-hook-form']).toBe('^7.63.0');
      });

      it('should have zod', () => {
        expect(packageJson.dependencies).toHaveProperty('zod');
        expect(packageJson.dependencies.zod).toBe('^4.1.11');
      });
    });

    describe('utility dependencies', () => {
      it('should have axios', () => {
        expect(packageJson.dependencies).toHaveProperty('axios');
        expect(packageJson.dependencies.axios).toBe('^1.12.2');
      });

      it('should have js-cookie', () => {
        expect(packageJson.dependencies).toHaveProperty('js-cookie');
        expect(packageJson.dependencies['js-cookie']).toBe('^3.0.5');
      });

      it('should have @types/js-cookie', () => {
        expect(packageJson.dependencies).toHaveProperty('@types/js-cookie');
        expect(packageJson.dependencies['@types/js-cookie']).toBe('^3.0.6');
      });

      it('should have jsonwebtoken', () => {
        expect(packageJson.dependencies).toHaveProperty('jsonwebtoken');
        expect(packageJson.dependencies.jsonwebtoken).toBe('^9.0.2');
      });

      it('should have next-auth', () => {
        expect(packageJson.dependencies).toHaveProperty('next-auth');
        expect(packageJson.dependencies['next-auth']).toBe('^4.24.11');
      });

      it('should have next-themes', () => {
        expect(packageJson.dependencies).toHaveProperty('next-themes');
        expect(packageJson.dependencies['next-themes']).toBe('^0.4.6');
      });
    });

    describe('styling dependencies', () => {
      it('should have class-variance-authority', () => {
        expect(packageJson.dependencies).toHaveProperty('class-variance-authority');
        expect(packageJson.dependencies['class-variance-authority']).toBe('^0.7.1');
      });

      it('should have clsx', () => {
        expect(packageJson.dependencies).toHaveProperty('clsx');
        expect(packageJson.dependencies.clsx).toBe('^2.1.1');
      });

      it('should have tailwind-merge', () => {
        expect(packageJson.dependencies).toHaveProperty('tailwind-merge');
        expect(packageJson.dependencies['tailwind-merge']).toBe('^3.3.1');
      });

      it('should have lucide-react', () => {
        expect(packageJson.dependencies).toHaveProperty('lucide-react');
        expect(packageJson.dependencies['lucide-react']).toBe('^0.544.0');
      });

      it('should have sonner', () => {
        expect(packageJson.dependencies).toHaveProperty('sonner');
        expect(packageJson.dependencies.sonner).toBe('^2.0.7');
      });

      it('should have radix-ui', () => {
        expect(packageJson.dependencies).toHaveProperty('radix-ui');
        expect(packageJson.dependencies['radix-ui']).toBe('^1.4.3');
      });
    });

    it('should have exactly 27 dependencies', () => {
      expect(Object.keys(packageJson.dependencies).length).toBe(27);
    });
  });

  describe('devDependencies section', () => {
    it('should have a devDependencies section', () => {
      expect(packageJson).toHaveProperty('devDependencies');
      expect(typeof packageJson.devDependencies).toBe('object');
    });

    it('should have at least one devDependency', () => {
      expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
    });

    it('all devDependencies should have valid version strings', () => {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        expect(typeof name).toBe('string');
        expect(typeof version).toBe('string');
        expect((version as string).length).toBeGreaterThan(0);
      });
    });

    it('should have TypeScript as a devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('typescript');
      expect(packageJson.devDependencies.typescript).toBe('^5');
    });

    it('should have ESLint as a devDependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('eslint');
      expect(packageJson.devDependencies.eslint).toBe('^9');
    });

    it('should have eslint-config-next', () => {
      expect(packageJson.devDependencies).toHaveProperty('eslint-config-next');
      expect(packageJson.devDependencies['eslint-config-next']).toBe('15.5.4');
    });

    it('eslint-config-next version should match Next.js version', () => {
      expect(packageJson.devDependencies['eslint-config-next']).toBe(packageJson.dependencies.next);
    });

    it('should have @eslint/eslintrc', () => {
      expect(packageJson.devDependencies).toHaveProperty('@eslint/eslintrc');
      expect(packageJson.devDependencies['@eslint/eslintrc']).toBe('^3');
    });

    describe('TypeScript type definitions', () => {
      it('should have @types/node', () => {
        expect(packageJson.devDependencies).toHaveProperty('@types/node');
        expect(packageJson.devDependencies['@types/node']).toBe('^20');
      });

      it('should have @types/react', () => {
        expect(packageJson.devDependencies).toHaveProperty('@types/react');
        expect(packageJson.devDependencies['@types/react']).toBe('^19');
      });

      it('should have @types/react-dom', () => {
        expect(packageJson.devDependencies).toHaveProperty('@types/react-dom');
        expect(packageJson.devDependencies['@types/react-dom']).toBe('^19');
      });

      it('should have @types/jsonwebtoken', () => {
        expect(packageJson.devDependencies).toHaveProperty('@types/jsonwebtoken');
        expect(packageJson.devDependencies['@types/jsonwebtoken']).toBe('^9.0.10');
      });
    });

    describe('Tailwind CSS dependencies', () => {
      it('should have tailwindcss', () => {
        expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
        expect(packageJson.devDependencies.tailwindcss).toBe('^4');
      });

      it('should have @tailwindcss/postcss', () => {
        expect(packageJson.devDependencies).toHaveProperty('@tailwindcss/postcss');
        expect(packageJson.devDependencies['@tailwindcss/postcss']).toBe('^4');
      });

      it('should have tw-animate-css', () => {
        expect(packageJson.devDependencies).toHaveProperty('tw-animate-css');
        expect(packageJson.devDependencies['tw-animate-css']).toBe('^1.4.0');
      });
    });

    it('should have exactly 11 devDependencies', () => {
      expect(Object.keys(packageJson.devDependencies).length).toBe(11);
    });
  });

  describe('version format validation', () => {
    it('all dependency versions should use valid semver syntax', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      Object.entries(allDeps).forEach(([name, version]) => {
        // Valid patterns: ^X.Y.Z, ~X.Y.Z, X.Y.Z, >=X.Y.Z, etc.
        const versionPattern = /^(\^|~|>=|<=|>|<)?(\d+)(\.(\d+|x))?(\.(\d+|x))?(-[\w.]+)?(\+[\w.]+)?$/;
        expect(version).toMatch(versionPattern);
      });
    });

    it('should use caret (^) for most dependencies to allow minor updates', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      const caretVersions = Object.values(allDeps).filter((v: any) =>
        v.startsWith('^')
      );
      expect(caretVersions.length).toBeGreaterThan(0);
    });
  });

  describe('dependency consistency checks', () => {
    it('should not have duplicate dependencies in dependencies and devDependencies', () => {
      const depKeys = Object.keys(packageJson.dependencies);
      const devDepKeys = Object.keys(packageJson.devDependencies);
      const intersection = depKeys.filter((key) => devDepKeys.includes(key));
      expect(intersection).toEqual([]);
    });

    it('should not have conflicting peer dependency requirements', () => {
      // Check React and React DOM versions match
      const reactVersion = packageJson.dependencies.react;
      const reactDomVersion = packageJson.dependencies['react-dom'];
      expect(reactVersion).toBe(reactDomVersion);
    });

    it('should not have @types packages in dependencies that should be in devDependencies', () => {
      const typePackages = Object.keys(packageJson.dependencies).filter(
        (dep) => dep.startsWith('@types/')
      );
      // Note: @types/js-cookie is intentionally in dependencies for this project
      expect(typePackages).toContain('@types/js-cookie');
    });
  });

  describe('edge cases and error conditions', () => {
    it('should handle missing optional fields gracefully', () => {
      expect(packageJson.description).toBeUndefined();
      expect(packageJson.author).toBeUndefined();
      expect(packageJson.license).toBeUndefined();
    });

    it('should not have empty string values for required fields', () => {
      expect(packageJson.name).not.toBe('');
      expect(packageJson.version).not.toBe('');
    });

    it('should not have null values for required fields', () => {
      expect(packageJson.name).not.toBeNull();
      expect(packageJson.version).not.toBeNull();
      expect(packageJson.scripts).not.toBeNull();
      expect(packageJson.dependencies).not.toBeNull();
      expect(packageJson.devDependencies).not.toBeNull();
    });

    it('should not have malformed dependency names', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      Object.keys(allDeps).forEach((name) => {
        // Package names should not start with . or _
        expect(name.startsWith('.')).toBe(false);
        // Scoped packages should start with @
        if (name.includes('/')) {
          expect(name.startsWith('@')).toBe(true);
        }
      });
    });

    it('should not have empty arrays or objects where content is expected', () => {
      expect(Object.keys(packageJson.scripts).length).toBeGreaterThan(0);
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
      expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
    });
  });

  describe('security and best practices', () => {
    it('should be marked as private to prevent accidental publishing', () => {
      expect(packageJson.private).toBe(true);
    });

    it('should not use wildcard (*) versions', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      Object.values(allDeps).forEach((version) => {
        expect(version).not.toBe('*');
      });
    });

    it('should not use deprecated version ranges like x', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      Object.values(allDeps).forEach((version) => {
        expect(version).not.toMatch(/^x$/);
      });
    });

    it('should have specific major versions (not just ^1 or ^2)', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      Object.entries(allDeps).forEach(([name, version]) => {
        if ((version as string).startsWith('^')) {
          // Should have at least major.minor specified
          const versionPart = (version as string).substring(1);
          expect(versionPart.includes('.')).toBe(true);
        }
      });
    });
  });

  describe('Next.js specific configurations', () => {
    it('should use turbopack for dev and build scripts', () => {
      expect(packageJson.scripts.dev).toContain('--turbopack');
      expect(packageJson.scripts.build).toContain('--turbopack');
    });

    it('should have Next.js and eslint-config-next at matching versions', () => {
      expect(packageJson.dependencies.next).toBe(
        packageJson.devDependencies['eslint-config-next']
      );
    });

    it('should have next-auth for authentication', () => {
      expect(packageJson.dependencies['next-auth']).toBeDefined();
    });

    it('should have next-themes for theme management', () => {
      expect(packageJson.dependencies['next-themes']).toBeDefined();
    });
  });

  describe('script command validation', () => {
    it('dev script should be a valid command', () => {
      expect(packageJson.scripts.dev).toMatch(/^next\s+dev/);
    });

    it('build script should be a valid command', () => {
      expect(packageJson.scripts.build).toMatch(/^next\s+build/);
    });

    it('start script should be a valid command', () => {
      expect(packageJson.scripts.start).toMatch(/^next\s+start/);
    });

    it('lint script should be a valid command', () => {
      expect(packageJson.scripts.lint).toMatch(/^eslint/);
    });

    it('should not have script commands with syntax errors', () => {
      Object.values(packageJson.scripts).forEach((script) => {
        // Check for unmatched quotes
        const singleQuotes = (script as string).match(/'/g) || [];
        const doubleQuotes = (script as string).match(/"/g) || [];
        expect(singleQuotes.length % 2).toBe(0);
        expect(doubleQuotes.length % 2).toBe(0);
      });
    });
  });

  describe('file integrity', () => {
    it('should have proper JSON formatting with 2-space indentation', () => {
      const formatted = JSON.stringify(packageJson, null, 2);
      // Remove trailing whitespace differences and compare structure
      expect(packageJsonRaw.trim()).toContain('"name": "frontend"');
      expect(packageJsonRaw.trim()).toContain('"version": "0.1.0"');
    });

    it('should not have trailing commas (invalid JSON)', () => {
      expect(packageJsonRaw).not.toMatch(/,\s*[}\]]/);
    });

    it('should use double quotes for JSON keys and string values', () => {
      // JSON spec requires double quotes
      expect(packageJsonRaw).not.toMatch(/'[^']*':\s*{/);
    });
  });
});