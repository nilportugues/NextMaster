# Best Practices for Development

This document outlines best practices for developing within this project. Adhering to these guidelines will help maintain code quality, improve performance, and ensure a smooth development workflow.

## Next.js 15 Features

This project utilizes Next.js 15. Developers should leverage its latest features to build modern, performant applications.

### Server Actions

Server Actions allow you to run server-side code directly from your components, simplifying data mutations and reducing the need for separate API routes.

- **Usage**: Use Server Actions for form submissions, data updates, and any client-initiated operations that require server-side logic.
- **Security**: Always validate data and authenticate users within Server Actions to prevent vulnerabilities.
- **Error Handling**: Implement robust error handling to provide clear feedback to users.

### Partial Prerendering (PPR)

Partial Prerendering allows for dynamic content to be streamed into statically-rendered pages, combining the benefits of ISR/SSR with static generation.

- **Usage**: Identify components that can be prerendered and those that require dynamic data. Use PPR to optimize page load times by serving static shells quickly and streaming in dynamic parts.
- **Dynamic Sections**: Clearly define which parts of your pages are dynamic and will benefit from PPR.
- **Caching**: Understand how PPR interacts with caching mechanisms to ensure content freshness and performance.

## Code Guidelines

Maintain a clean and organized codebase for better readability and maintainability.

### Organization

- **Components**: Keep UI components in `src/components/`. Reusable, generic components can be placed in `src/components/ui/`.
- **Database**: Database schema and query logic are located in `src/db/` and `src/lib/queries.ts` respectively.
- **Actions/Mutations**: Server-side logic, especially Server Actions, should be clearly defined, often co-located with the components that use them or in dedicated action files (e.g., `src/lib/actions.ts`).
- **Styling**: Utilize Tailwind CSS for styling. Keep global styles in `src/app/globals.css`. Component-specific styles should be co-located or defined within the components themselves using Tailwind classes.

### Writing Code

- **TypeScript**: Use TypeScript for all new code to leverage static typing and improve code quality.
- **ESLint & Prettier**: Adhere to the project's ESLint and Prettier configurations. Ensure code is linted and formatted before committing.
- **Comments**: Write clear and concise comments where necessary, especially for complex logic or non-obvious code.
- **Modularity**: Break down complex functionalities into smaller, manageable modules or functions.
- **Naming Conventions**: Follow consistent naming conventions for files, variables, functions, and components (e.g., PascalCase for components, camelCase for variables/functions).

## Performance Considerations

Optimizing performance is crucial for a good user experience.

- **Image Optimization**: Utilize Next.js Image component (`next/image`) for automatic image optimization. Ensure product images are appropriately sized and compressed. The `scripts/addImagesToProducts.ts` and related scripts handle initial image processing.
- **Code Splitting**: Next.js automatically handles code splitting. Be mindful of large component imports that could affect initial load times.
- **Lazy Loading**: Use `next/dynamic` for lazy loading components that are not critical for the initial view.
- **Caching**: Leverage Next.js caching strategies (Data Cache, Full Route Cache) effectively. Understand how data fetching and rendering choices impact caching.
- **Bundle Size**: Regularly monitor your application's bundle size. Avoid adding unnecessary dependencies.

## Local Development

Follow these steps to set up and run the project locally:

1.  **Clone the repository.**
2.  **Link your project to Vercel**:
    ```bash
    vc link
    ```
3.  **Pull environment variables from Vercel**:
    ```bash
    vc env pull .env.local
    ```
    This will create a `.env.local` file with your database credentials and other necessary environment variables.
4.  **Install dependencies**:
    ```bash
    pnpm install
    ```
5.  **Database Setup**:
    *   Ensure your `POSTGRES_URL` in `.env.local` has `?sslmode=required` appended for development if you plan to run database migrations.
    *   Apply the database schema:
        ```bash
        pnpm db:push
        ```
    *   **Seeding Data (Optional, Large Dataset)**: The project includes a large dataset in `data/data.zip` (`data.sql` when unzipped).
        *   Unzip `data/data.zip` to get `data.sql`.
        *   Run `psql "YOUR_CONNECTION_STRING" -f data/data.sql` to seed your Vercel Postgres database. Replace `"YOUR_CONNECTION_STRING"` with your actual connection string from `.env.local`.
        *   _Note: This dataset exceeds the free tier limits for Neon on Vercel._
    *   **Create Database Roles**:
        *   Connect to your database using `psql "YOUR_CONNECTION_STRING"`.
        *   Run the following SQL commands:
            ```sql
            CREATE ROLE "default";
            CREATE ROLE "cloud_admin";
            ```
6.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    The application will typically be available at `http://localhost:3000`.

## Deployment

This project is optimized for deployment on **Vercel**.

- **Prerequisites**:
    *   Ensure your Vercel project is connected to a Vercel Postgres (Neon) database.
    *   Ensure your Vercel project is connected to Vercel Blob Storage for image storage.
- **Deployment Process**:
    *   Connect your Git repository to your Vercel project. Vercel will typically build and deploy automatically on pushes to the main branch.
    *   Environment variables (like database connection strings, API keys for AI services, etc.) must be configured in the Vercel project settings.
- **Applying Database Schema**:
    After setting up the Vercel Postgres database and before or during the first deployment, you may need to apply the database schema:
    ```bash
    pnpm db:push
    ```
    This command might be run locally, pointing to the production database, or as part of a build/release script if your Vercel setup allows.

## Scripts

The `scripts/` directory contains various utility scripts. Key scripts and commands related to project setup or data management include:

- `pnpm db:push`: (This is a `package.json` script, not directly in the `scripts/` directory) Applies the Drizzle ORM schema to your database. This is crucial for both local development and ensuring the deployed application has the correct database structure.
- `scripts/fill.ts`: Populates the database with initial/seed data.
- `scripts/generate.ts`: Orchestrates data generation, possibly including product generation and image processing.
- `scripts/genProducts.ts`: Generates product data.
- `scripts/makeImages.ts`: Processes and prepares images.
- `scripts/addImagesToProducts.ts`: Links images to products in the database.
- `scripts/distributeImages.sql`: SQL script likely used for image distribution or management.
- `scripts/slugify.ts`: Utility for creating URL-friendly slugs.

Refer to the scripts themselves, the `package.json` file for `pnpm` script definitions, and any accompanying comments for detailed usage.

By following these best practices, we can build a robust, maintainable, and performant application.
