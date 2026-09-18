# Express.js API Setup Tutorial

This guide explains how to create the TypeScript and Express API starter used in this project. At the end, you will have a development server running on port `7000`, environment-based configuration, basic security middleware, a health-check endpoint, and a folder structure ready for larger features.

## Before you begin

Install a current Node.js LTS release. Verify that Node.js and npm are available:

```bash
node --version
npm --version
```

You will also need a code editor such as Visual Studio Code. PostgreSQL is only required once you begin using the database features.

## 1. Create the project

Create and open a new folder. This example uses `D:\Development\appsdev-api-tutorial`:

```bash
mkdir appsdev-api-tutorial
cd appsdev-api-tutorial
npm init -y
```

Open this folder in your editor, then open its integrated terminal.

## 2. Install dependencies

Install the packages used by the API:

```bash
npm install cookie-parser cors dotenv express helmet hpp jsonwebtoken nodemailer zod csrf-csrf
```

Install the TypeScript, build, linting, and type-definition packages:

```bash
npm install -D @eslint/js @types/cookie-parser @types/cors @types/express @types/hpp @types/jsonwebtoken @types/node @types/nodemailer @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint tsdown tsx typescript typescript-eslint
```

## 3. Configure TypeScript and ESLint

Copy [tsconfig.json](../tsconfig.json) and [eslint.config.ts](../eslint.config.ts) into the project root. The TypeScript configuration defines the `@/` import alias, so this import:

```ts
import app from "@/app";
```

means `src/app.ts`.

Add these scripts to the `scripts` section of [package.json](../package.json):

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsdown src/server.ts --format esm --clean --minify",
  "start": "node dist/server.mjs",
  "lint": "eslint .",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "contract:emit": "prisma contract emit"
}
```

Use `npm run dev` while developing. It restarts the server when you save a TypeScript file. Use `npm run build` followed by `npm start` to test the production build.

## 4. Create the source structure

Create the following folders inside `src`:

```text
src/
├── config/        # Environment configuration
├── controllers/   # Request handlers
├── lib/           # Shared integrations and helpers
├── middlewares/   # Express middleware
├── repositories/  # Database access
├── routes/        # Route definitions
├── schema/        # Validation schemas
├── services/      # Application business logic
└── utils/         # Small reusable utilities
```

Then copy [src/app.ts](../src/app.ts) and [src/server.ts](../src/server.ts) into their matching locations. Git does not store empty folders, so add a `.gitkeep` file to any folder that is intentionally empty for now.

## 5. Add environment variables

Copy [.env.example](../.env.example) to `.env` in the project root. Do not commit `.env`, because it may later contain real credentials.

```env
APP_NAME=AppsDev API Tutorial
PORT=7000
NODE_ENV=development
JWT_SECRET=fallback_secret_change_me
BACKEND_URL=http://localhost:7000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=
```

Copy [src/config/env.ts](../src/config/env.ts); it loads these variables and provides defaults for local development. Before deployment, replace `JWT_SECRET` with a strong, private value and set all URLs to the deployed services.

## 6. Build the Express application

[src/app.ts](../src/app.ts) creates the Express application and configures its middleware:

- `helmet` adds common HTTP security headers.
- `cors` allows the configured frontend origin to call the API with cookies.
- `express.json()` and `express.urlencoded()` parse request bodies.
- `cookie-parser` reads cookies from incoming requests.
- `hpp` helps protect against HTTP parameter pollution.

Keep endpoint handlers above the 404 middleware. Express evaluates middleware in registration order. If the 404 handler is registered first, it will respond before a later route such as `/api/health` can run.

The starter provides these endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Confirms that the application instance is running. |
| `GET` | `/api/health` | Confirms that the API route layer is running. |

Each endpoint returns JSON with a success status and timestamp.

## 7. Start and verify the API

Run the development server:

```bash
npm run dev
```

You should see the API URL and environment in the terminal. Test the API with Postman:

1. Open Postman and select **New** → **HTTP Request**.
2. Set the method to `GET`.
3. Enter `http://localhost:7000/api/health` as the request URL.
4. Select **Send**.

Postman should show a `200 OK` response with this JSON body:

Expected response:

```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2026-09-18T00:00:00.000Z"
}
```

The timestamp will be different on your machine. If you receive `Cannot GET /api/health`, check that the route is defined before the 404 handler in [src/app.ts](../src/app.ts), then restart the development server.

## 8. Add Prisma when you need a database

Initialize Prisma ORM for PostgreSQL:

```bash
npx prisma@latest orm init
```

Choose these options when prompted:

1. **Database:** PostgreSQL
2. **Schema format:** Prisma Schema Language
3. **Contract location:** accept `src/prisma/contract.prisma` (see [the starter contract](../src/prisma/contract.prisma))
4. **Create `.env` from an example:** No, because the project already has one

Set `DATABASE_URL` in `.env` before generating a client or applying migrations. The project scripts support the common commands:

```bash
npm run db:generate
npm run db:migrate
npm run contract:emit
```

For the same Prisma configuration used by this project, copy [prisma.config.ts](../prisma.config.ts) into the project root.

## 9. Check your work and commit it

Run the linter before committing:

```bash
npm run lint
```

When it passes, initialize a Git repository if needed, copy [.gitignore](../.gitignore) so it excludes `.env`, `node_modules`, and `dist`, then create your remote repository and push the project.

From here, add features in layers: define routes, validate input in schemas, put business rules in services, and keep direct database queries in repositories.
