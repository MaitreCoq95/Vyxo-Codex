# Contributing to Vyxo Codex 2.0

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- No harassment or discrimination

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/vyxo-codex.git
cd vyxo-codex

# Add upstream remote
git remote add upstream https://github.com/vyxo/vyxo-codex.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local
# Fill in your development environment variables
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding/updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow our [coding standards](#coding-standards) below.

### 3. Test Your Changes

```bash
# Run all tests
npm run test

# Run specific test file
npm run test path/to/test.ts

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

### 4. Commit Changes

We use conventional commits:

```bash
git add .
git commit -m "feat: add new challenge type"
# or
git commit -m "fix: resolve authentication bug"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Adding tests
- `build:` - Build system changes
- `ci:` - CI configuration
- `chore:` - Other changes

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define explicit types for function parameters and returns
- Use interfaces for object shapes
- Avoid `any` type

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Use destructuring for props
- Extract complex logic to custom hooks

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
│   ├── api/         # API utilities
│   └── validation/  # Validation schemas
├── infrastructure/  # External services
└── types/           # TypeScript types
```

### Naming Conventions

- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserProfile`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Interfaces:** PascalCase with `I` prefix optional (`User` or `IUser`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use trailing commas in objects/arrays

We use ESLint and Prettier for formatting:

```bash
# Check formatting
npm run lint

# Auto-fix
npm run lint -- --fix
```

### Comments

- Use JSDoc for functions and classes
- Add comments for complex logic
- Keep comments up to date

```typescript
/**
 * Calculate user's IMO score based on various metrics
 * @param userId - User identifier
 * @param timeframe - Time period for calculation
 * @returns IMO score object with breakdown
 */
export async function calculateIMOScore(
  userId: string,
  timeframe: Timeframe
): Promise<IMOScore> {
  // Implementation
}
```

## Testing

### Unit Tests

Test individual functions and components:

```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './security';

describe('sanitizeInput', () => {
  it('should remove dangerous characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('scriptalert("xss")/script');
  });
});
```

### Component Tests

Test React components:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Test Coverage

Aim for:
- Unit tests: > 80% coverage
- Critical paths: 100% coverage
- UI components: > 70% coverage

## Submitting Changes

### 1. Create Pull Request

- Go to GitHub and create a PR from your fork
- Use a descriptive title following conventional commits
- Fill in the PR template completely
- Link related issues

### 2. PR Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Commits are clean and descriptive

### 3. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
```

## Review Process

### What to Expect

1. **Automated Checks** - CI runs tests, linting, type checking
2. **Code Review** - Maintainer reviews code
3. **Feedback** - You may be asked to make changes
4. **Approval** - Once approved, PR will be merged

### Review Criteria

- Code quality and readability
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/your-feature-name
```

## Additional Guidelines

### Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines
- Report security issues privately to security@vyxo-codex.com

### Performance

- Avoid unnecessary re-renders
- Optimize database queries
- Use pagination for large datasets
- Lazy load heavy components
- Minimize bundle size

### Accessibility

- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

## Getting Help

- **Documentation:** Check docs/ folder
- **Discussions:** GitHub Discussions
- **Issues:** Create an issue for bugs
- **Discord:** Join our Discord server
- **Email:** dev@vyxo-codex.com

## Recognition

Contributors are recognized in:
- README.md
- Release notes
- Contributors page

Thank you for contributing to Vyxo Codex! 🚀
