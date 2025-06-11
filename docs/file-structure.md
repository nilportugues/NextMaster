# File and Directory Structure

This document provides an overview of the project's file and directory structure, focusing on key directories and Next.js conventions.

## Root Directory

The root directory contains project-wide configuration files and top-level directories.

-   **`.github/`**: Contains GitHub-specific files, such as workflow definitions for continuous integration (`ci.yml`).
-   **`data/`**: Holds project data, including the zipped SQL file (`data.zip`) for seeding the database with a large product catalog.
-   **`docs/`**: Contains all project documentation files (like this one).
-   **`drizzle/`**: Stores Drizzle ORM configuration files like `envConfig.ts` (note: `drizzle.config.ts` is typically at the root). This directory is also where Drizzle Kit usually places generated migration files. However, this project primarily uses `pnpm db:push`, which may handle schema updates differently than explicit migration file generation, especially for simpler changes.
-   **`node_modules/`**: (Not listed in `ls` but standard) Stores all project dependencies managed by `pnpm`.
-   **`scripts/`**: Contains various Node.js/TypeScript utility scripts for tasks such as data generation (`generate.ts`, `genProducts.ts`), image processing (`makeImages.ts`, `addImagesToProducts.ts`), database seeding (`fill.ts`), and others.
-   **`src/`**: The primary directory for application source code. See details below.

### Key Root Configuration Files:
-   **`.eslintrc.json`**: Configuration for ESLint, used for static code analysis and enforcing code style.
-   **`.gitattributes`**: Defines attributes for Git paths, managing line endings and other settings.
-   **`.prettierignore`**: Specifies files and directories that Prettier should ignore during code formatting.
-   **`components.json`**: Configuration file likely related to Shadcn UI, potentially defining paths or aliases for UI components.
-   **`drizzle.config.ts`**: The main configuration file for Drizzle ORM and Drizzle Kit, used for defining database connections and migration settings.
-   **`LICENSE`**: Contains the project's license information (e.g., MIT License), outlining usage rights.
-   **`next.config.mjs`**: The core configuration file for Next.js. It controls settings like experimental features (e.g., PPR), image optimization, custom headers, redirects, and rewrites.
-   **`package.json`**: Defines project metadata, lists dependencies, and includes scripts runnable with `pnpm` (e.g., `pnpm dev`, `pnpm build`).
-   **`pnpm-lock.yaml`**: The lockfile for `pnpm`, ensuring consistent and reproducible dependency installations across different environments.
-   **`postcss.config.mjs`**: Configuration for PostCSS, a tool for transforming CSS with JavaScript plugins, often used with Tailwind CSS.
-   **`prettier.config.cjs`**: Configuration file for Prettier, the opinionated code formatter that ensures consistent code style.
-   **`tailwind.config.ts`**: Configuration file for Tailwind CSS. Used to customize the design system, including theme (colors, spacing, fonts), plugins, and content paths.
-   **`tsconfig.json`**: Configuration file for the TypeScript compiler. It specifies root files, compiler options, and project-wide type-checking rules.

## `src/` Directory

This is where the core application code resides.

### `src/app/`
This directory is the core of the Next.js App Router implementation.

-   **Routing Conventions**:
    -   Folders define URL segments (e.g., `src/app/order/` maps to the `/order` path).
    -   Dynamic routes are created using bracketed folder names (e.g., `src/app/(category-sidebar)/[collection]/` creates a dynamic route segment like `/clothing` or `/accessories`, where `collection` is the parameter).
-   **Route Groups**: Parentheses around a folder name, such as `(category-sidebar)` or `(login)`, create a route group. These groups organize routes for logical purposes (e.g., applying a specific layout) without affecting the URL structure.
-   **Special Files (File-System Routing Conventions)**:
    -   `layout.tsx`: Defines the shared UI shell for a route segment and its children. Layouts can be nested, and data fetched in a layout is available to child layouts and pages. The root layout at `src/app/layout.tsx` is essential.
    -   `page.tsx`: Defines the unique UI for a specific route segment.
    -   `loading.tsx`: (Convention) Defines loading UI (e.g., a skeleton screen) that is displayed using React Suspense while a page segment or its data is loading.
    -   `error.tsx`: Defines error UI for a route segment, gracefully handling runtime errors within that segment and its children. It creates an Error Boundary.
    -   `not-found.tsx`: Defines the UI displayed when a route segment is not found (results in a 404 error).
    -   `template.tsx`: Similar to `layout.tsx`, but it creates a new instance of the component for each child route on navigation, meaning state is not preserved.
-   **API Routes (Route Handlers)**: Folders named `api` within `src/app` (e.g., `src/app/api/search/route.ts`) are used to create backend API endpoints. These are defined in `route.ts` files using exported functions that match HTTP methods (e.g., `export async function GET(request) { ... }`).
-   **Static Assets**: Global static files like `favicon.ico`, `robots.txt`, and `opengraph-image.png` are placed directly in `src/app/` to be served from the application root. This project does not use a separate `public/` directory at the project root for these types of static assets.

### `src/components/`
This directory contains reusable UI components that are used throughout the application.
-   **`ui/`**: A common subdirectory for more generic, base UI components, often sourced from or inspired by libraries like Shadcn UI. Examples include `button.tsx`, `card.tsx`, and `input.tsx`.
-   Other component files directly within `src/components/` (e.g., `add-to-cart-form.tsx`, `cart.tsx`) are typically more application-specific UI elements.

### `src/db/`
This directory manages all database-related logic and configurations.
-   `schema.ts`: Defines the database schema using Drizzle ORM syntax, outlining tables, columns, and relationships.
-   `index.ts`: Likely exports the initialized Drizzle ORM instance, database connection utilities, or commonly used database functions.

### `src/lib/`
This directory contains shared library code, helper functions, core business logic, and various utilities not specific to a single UI component or route.
-   `actions.ts`: Often holds Next.js Server Actions, which are functions that execute on the server and can be called directly from client or server components, typically for data mutations.
-   `cart.ts`: Contains specific business logic related to the shopping cart functionality.
-   `middleware.ts`: Defines Next.js middleware. Middleware allows running code before a request is completed, enabling tasks like authentication, A/B testing, or redirects based on the incoming request.
-   `queries.ts`: Houses database query functions, likely using Drizzle ORM to interact with the database in a type-safe manner.
-   `rate-limit.ts`: Provides utilities for implementing rate limiting, possibly for API routes or Server Actions to prevent abuse.
-   `session.ts`: Includes functions related to managing user sessions, authentication state, and user data.
-   `unstable-cache.ts`: Likely contains utilities for leveraging Next.js's advanced or experimental caching features for fine-grained control over data caching.
-   `utils.ts`: A general-purpose directory for miscellaneous utility functions that can be used across various parts of the application.

## `public/` Directory (Absence Noted)

Traditionally, Next.js projects include a `public/` directory at the root for serving static assets like images, fonts, and other files that don't require processing. It's important to note that **this project does not have a `public/` directory at the root level.**

-   **Global Static Assets**: As mentioned, files like `favicon.ico` and `robots.txt` are served from `src/app/`.
-   **Product Images & Other Assets**: Images specific to products and other dynamic assets are managed via Vercel Blob storage and served/optimized through Next.js Image Optimization features.

This file structure promotes colocation of UI-specific logic (within the App Router) while centralizing shared functionalities in directories like `src/lib/`, `src/components/`, and `src/db/`. Project-wide configurations are primarily maintained at the root level.
