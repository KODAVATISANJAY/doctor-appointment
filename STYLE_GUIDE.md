# Style Guide

## Naming Conventions

### Variables
- Use camelCase for variables: `const appointmentData = ...`
- Use UPPER_SNAKE_CASE for constants: `const MAX_RETRIES = 3`

### Components
- PascalCase for React components: `AppointmentCard`
- kebab-case for file names: `appointment-card.jsx`

### CSS
- BEM methodology: `.appointment-card__title--active`
- Use CSS modules for scoping

## Code Organization
- Group related imports together
- Export components at the bottom of files
- Keep files under 300 lines
- One component per file

## Git Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Keep commit messages under 50 characters
- Add detailed descriptions for complex changes
