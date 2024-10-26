# TypeScript Express Boilerplate

A TypeScript-based Express application that uses Prisma for ORM. This boilerplate includes authentication and testing setup, providing a solid foundation for building robust and scalable APIs.

## Features

- TypeScript support
- Express framework
- Prisma ORM
- JWT-based authentication
- Comprehensive error handling
- Docker and Kubernetes integration
- Testing setup with Mocha, Chai, and Supertest

## Scripts

Here’s a summary of available npm scripts:

- **Build**: `npm run build`

  - Compiles TypeScript files and copies Prisma migrations to `dist/prisma`.

- **Start**: `npm run start`

  - Runs the application in development mode with auto-reloading using `nodemon`.

- **Start (Production)**: `npm run start:prod`

  - Applies Prisma migrations and starts the application in production mode.

- **Unit Tests**: `npm run test:unit`

  - Executes unit tests located in `src/**/**/**.test.ts` using Mocha.

- **Integration Tests**: `npm run test:integration`

  - Runs integration tests from `test/main.ts` using Mocha.

- **Prettier**: `npm run prettier`

  - Formats the codebase using Prettier.

- **Check Prettier**: `npm run checkPrettier`

  - Checks code formatting against Prettier rules.

- **Lint**: `npm run lint`

  - Lints TypeScript files using ESLint.

- **Lint (Fix)**: `npm run lint:fix`
  - Lints and fixes TypeScript files using ESLint.

## Prisma Scripts

- **Seed**: `npm run prisma:seed`
  - Seeds the database with initial data from `prisma/seed.ts`.

## Git Hooks

- **Pre-commit Hook**: Configured to run `npm run lint` before each commit to maintain code quality.

---
