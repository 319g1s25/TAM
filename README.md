# Teaching Assistant Management (TAM)

A comprehensive web application for managing teaching assistants and courses in academic institutions.

## Project Overview

TAM is a full-stack application built with:
- Frontend: Angular 19.2.0
- Backend: Node.js with MySQL
- Database: MySQL
- Containerization: Docker

## Features

- Course management
- TA assignment and workload tracking
- Performance reporting
- Leave request management
- Role-based access control
- Dashboard with statistics and analytics

## User Roles

- Instructors
- Teaching Assistants (TAs)
- Auth Staff
- Dean's Office
- Department Chairs

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Angular CLI (v19.2.7)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up
   ```

4. Access the application at `http://localhost:4200`

## Development

### Development Server

To start the Angular development server without Docker:

```bash
ng serve
```

### Building

To build the project:

```bash
ng build
```

### Running Tests

Run unit tests:

```bash
ng test
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
