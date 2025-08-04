## Project Overview

This is a Next.js project, bootstrapped with `create-next-app`. It appears to be an e-commerce frontend.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://reactjs.org/) with [Material-UI (MUI)](https://mui.com/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Styling:** [Styled Components](https://styled-components.com/) and CSS Modules
*   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **Package Manager:** [Yarn](https://yarnpkg.com/)

## Getting Started

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Run the development server:**
    ```bash
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Scripts

*   `yarn dev`: Starts the development server.
*   `yarn build`: Builds the application for production.
*   `yarn start`: Starts a production server.
*   `yarn lint`: Runs the linter.
*   `yarn analyze`: Runs the Webpack Bundle Analyzer to visualize bundle sizes.

## Project Structure

*   `src/pages`: Contains the application's pages.
*   `src/Components`: Contains reusable React components.
*   `src/StyledComponents`: Contains styled-components definitions.
*   `src/Api`: Contains API-related logic, including Redux store setup.
*   `src/contexts`: Contains React context definitions.
*   `src/Types`: Contains TypeScript type definitions.
*   `public`: Contains static assets.

## Implemented Features & Optimizations

*   **Dynamic Theming:** The application now supports dynamic theming using Material-UI's `ThemeProvider` and a custom theme context (`src/contexts/ThemeContext.tsx`). Theme colors are dynamically configurable based on shop requirements.
*   **Code Splitting & Performance Optimizations:** Implemented dynamic imports for several components and libraries to reduce initial bundle sizes and improve Total Blocking Time (TBT). This includes:
    *   `typewriter-effect` (in `src/pages/sokoJunction.tsx`, `src/pages/index.tsx`, `src/pages/shops.tsx`)
    *   `FAQ` (in `src/pages/index.tsx`)
    *   `AuthDialog` (in `src/Components/LinksContainerComponent.tsx`)
    *   `Navbar` and `Footer` (in `src/pages/_app.tsx`)
    *   `GoogleOAuthProvider` has been moved from `src/pages/_app.tsx` to `src/pages/login.tsx` and `src/pages/register.tsx` to optimize the main bundle.

## Gemini Added Memories
- The currency for this project is always Kes.
- Commits should only be made when prompted by the user.
- NEVER remove the import: `import { AccentButton } from "@/StyledComponents/Hero";`