
# Architecture and Infrastructure Guide

This document provides a comprehensive overview of the project's architecture and infrastructure. It is intended to help developers, including AI assistants, understand the codebase, conventions, and deployment pipeline.

## 1. Project Overview

This is a modern, full-stack e-commerce frontend built with Next.js. It serves as the client-facing application for an online marketplace, providing features like product browsing, shopping cart management, user authentication, and order processing.

## 2. Tech Stack

The project utilizes a modern, robust tech stack:

*   **Framework:** [Next.js](https://nextjs.org/) (using the Pages Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Component Kit:** [Material-UI (MUI)](https://mui.com/) for a foundational set of UI components.
*   **Styling:**
    *   [Styled Components](https://styled-components.com/): For creating custom, encapsulated React components with associated styles.
    *   [CSS Modules](https://github.com/css-modules/css-modules): For component-level CSS (`.module.css`).
    *   Global CSS: For baseline styles (`src/styles/globals.css`).
*   **State Management:**
    *   [Redux Toolkit (RTK)](https://redux-toolkit.js.org/): For global application state.
    *   [RTK Query](https://redux-toolkit.js.org/rtk-query/): For data fetching, caching, and server state management, interacting with the backend API.
    *   [React Context API](https://reactjs.org/docs/context.html): For localized state concerns like the shopping cart (`CartContext`) and dynamic theming (`ThemeContext`).
*   **Forms:** [React Hook Form](https://react-hook-form.com/) for managing form state and validation.
*   **Schema Validation:** [Zod](https://zod.dev/) for defining validation schemas used with React Hook Form.
*   **Package Manager:** [Yarn](https://yarnpkg.com/) (v4).

## 3. Project Structure

The codebase is organized into the following key directories within `src/`:

*   `src/pages`: Contains all application pages and API routes, following the Next.js file-system routing convention.
*   `src/Components`: Houses reusable React components (e.g., `Navbar`, `ProductCard`, `Footer`) used across multiple pages.
*   `src/StyledComponents`: Defines custom styled-components that are used to build the UI, promoting a consistent look and feel.
*   `src/Api`: Manages all API-related logic.
    *   `store.ts`: Configures the main Redux store.
    *   `services.ts`: Defines API service endpoints and their structure using RTK Query.
*   `src/contexts`: Contains React Context providers for managing cross-component state that doesn't require a global Redux store (e.g., `CartContext`, `ThemeContext`).
*   `src/theme`: Includes the base MUI theme configuration.
*   `src/Types`: Contains shared TypeScript type and interface definitions.
*   `public`: Stores static assets like images, fonts, and icons.

## 4. Architecture

### 4.1. Frontend Architecture

The application follows a component-based architecture.

*   **Pages (`src/pages`):** Act as top-level components for each route. They are responsible for fetching page-specific data and composing the layout using components from `src/Components`.
*   **Reusable Components (`src/Components`):** These are the building blocks of the UI. They are designed to be modular, reusable, and independent of specific page logic.
*   **Styling:** The project employs a hybrid styling strategy. MUI provides the base components, which are then customized or extended using Styled Components for bespoke designs. This allows for both rapid development and high design fidelity.

### 4.2. State Management

State is managed using a combination of Redux Toolkit and React Context.

*   **RTK Query (`src/Api`):** This is the primary tool for managing server state. It handles all the complexities of data fetching, caching, re-fetching, and loading/error states. This keeps the frontend synchronized with the backend database.
*   **React Context (`src/contexts`):** Used for state that is local to a specific subtree of components but needs to be shared without prop-drilling. The shopping cart and theme are perfect examples of this.

### 4.3. API Communication

All communication with the backend is centralized in the `src/Api` directory and managed by RTK Query. This provides a single source of truth for API interactions and ensures a consistent data fetching pattern across the application.

## 5. Infrastructure & Deployment

### 5.1. Development Environment

To get started with development:

1.  **Install Dependencies:**
    ```bash
    yarn install
    ```
2.  **Run the Dev Server:**
    ```bash
    yarn dev
    ```
    The application will be available at `http://localhost:3000`.

### 5.2. Key Scripts

*   `yarn dev`: Starts the Next.js development server with hot-reloading.
*   `yarn build`: Creates a production-ready build of the application.
*   `yarn start`: Starts the production server (requires a build first).
*   `yarn lint`: Lints the codebase using ESLint to enforce code quality.
*   `yarn analyze`: Builds the app and runs the Webpack Bundle Analyzer to inspect bundle sizes for performance optimization.

### 5.3. Deployment

The project is configured for deployment on [Vercel](https://vercel.com/), as indicated by the `vercel.json` file. The `yarn build` command is automatically run by Vercel during the deployment process.

### 5.4. Performance Optimizations

The application includes several performance optimizations:

*   **Code Splitting:** `React.lazy` and `dynamic` imports are used to split code into smaller chunks, which are loaded on demand. This is applied to major components like the `Navbar` and `Footer`, as well as libraries that are not needed on the initial page load.
*   **Bundle Analysis:** The `@next/bundle-analyzer` is integrated to help identify large dependencies and opportunities for optimization.
