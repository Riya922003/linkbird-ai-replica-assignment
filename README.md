# Linkbird AI Replica Assignment

## Overview
This project is a full-stack web application built to replicate core features of Linkbird, focusing on campaign and lead management. It leverages modern technologies for scalability, performance, and developer experience.

---

## Required Tech Stack
| Technology                | Purpose & Usage                                                                 |
|---------------------------|------------------------------------------------------------------------------|
| **Next.js 15+**           | React framework with App Router. Used for routing, SSR, and building UI pages. |
| **Tailwind CSS + shadcn/ui** | Styling and component library. Used for rapid UI development and custom components. |
| **PostgreSQL + Drizzle ORM** | Database and type-safe ORM. Used for schema definition, migrations, and queries. |
| **Neon**                  | Cloud PostgreSQL provider. Used for scalable, serverless database hosting.     |
| **Better Auth**           | Authentication (credentials + Google OAuth). Used for secure user login and session management. |
| **TanStack Query (React Query)** | Server state management. Used for fetching, caching, and updating server data. |
| **Zustand**               | Client-side state management. Used for managing UI and local state.            |

### Where & How Each Tech Is Used
- **Next.js 15+**: All routing and page rendering in `src/app/` uses Next.js App Router. SSR and API routes are handled here.
- **Tailwind CSS + shadcn/ui**: UI components in `src/components/ui/` and styling in `src/app/globals.css` use Tailwind and shadcn/ui for consistent, responsive design.
- **PostgreSQL + Drizzle ORM**: Database schema and queries are defined in `src/db/schema.ts` and `src/db/index.ts`. Drizzle ORM provides type safety and migration tools.
- **Neon**: The PostgreSQL database is hosted on Neon for serverless, scalable deployments.
- **Better Auth**: Authentication logic is in `src/app/api/auth/[...nextauth]/route.ts` and config files. Supports credentials and Google OAuth.
- **TanStack Query**: Data fetching and caching in components like `src/components/campaigns/CampaignsServerComponent.tsx` use React Query for efficient server state management.
- **Zustand**: Local state management for UI (e.g., sidebar, lead sheet) is handled in `src/store/` using Zustand.

---

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/Riya922003/linkbird-ai-replica-assignment.git
   cd linkbird-ai-replica-assignment
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local` and fill in your database, auth, and other secrets.
4. **Run database migrations**
   ```sh
   npm run drizzle:migrate
   ```
5. **Start the development server**
   ```sh
   npm run dev
   ```
6. **Build for production**
   ```sh
   npm run build
   npm start
   ```

---

## API & Server Actions Documentation

### Authentication
- **POST `/api/auth/[...nextauth]`**: Handles login, registration, and OAuth flows.

### Campaigns
- **GET `/api/campaigns`**: Fetch all campaigns for the authenticated user.
- **POST `/api/campaigns`**: Create a new campaign.
- **GET `/api/campaigns/:id`**: Fetch details for a specific campaign.

### Leads
- **GET `/api/leads`**: Fetch all leads for a campaign.
- **POST `/api/leads`**: Add a new lead to a campaign.
- **PATCH `/api/leads/:id`**: Update lead details.

### Server Actions
- Actions for campaigns, dashboard, and leads are defined in `src/app/actions/` and used for data mutations and fetching.

---

## Database Schema Documentation

The database schema is defined in `src/db/schema.ts` using Drizzle ORM. Main tables:

### `user` Table
| Column      | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| id          | UUID     | Primary key                                  |
| name        | String   | User's full name                             |
| email       | String   | Unique email address                         |
| password    | String   | Hashed password (for credentials auth)       |
| provider    | String   | Auth provider (e.g., Google, credentials)    |
| createdAt   | Date     | Account creation timestamp                   |
| updatedAt   | Date     | Last update timestamp                        |

*Why?* Stores all authentication and profile data. Managed by Auth.js and used for login, registration, and session management.

### `campaign` Table
| Column      | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| id          | UUID     | Primary key                                  |
| userId      | UUID     | Foreign key to `user` table                  |
| name        | String   | Campaign name                                |
| description | String   | Campaign description                         |
| status      | String   | Campaign status (active, paused, etc.)       |
| createdAt   | Date     | Creation timestamp                           |
| updatedAt   | Date     | Last update timestamp                        |

*Why?* Stores campaign details, linked to users. Enables users to manage multiple campaigns.

### `lead` Table
| Column      | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| id          | UUID     | Primary key                                  |
| campaignId  | UUID     | Foreign key to `campaign` table              |
| name        | String   | Lead's name                                  |
| email       | String   | Lead's email address                         |
| status      | String   | Lead status (new, contacted, converted, etc.)|
| notes       | Text     | Additional notes about the lead               |
| createdAt   | Date     | Creation timestamp                           |
| updatedAt   | Date     | Last update timestamp                        |

*Why?* Stores information about leads associated with campaigns. Enables tracking and management of lead status and details.

#### Indexes
- Foreign key columns (`userId`, `campaignId`) are indexed for fast lookups and joins.
- Frequently filtered columns (e.g., `status`) are indexed to optimize query performance.

---

## Performance Optimizations

- **Database Indexes**: Added indexes on foreign keys and status columns to speed up queries.
- **Serverless Database (Neon)**: Leveraged Neon for scalable, low-latency database access.
- **React Query Caching**: Used TanStack Query for efficient data fetching and caching, reducing redundant requests.
- **Zustand State Management**: Minimized unnecessary re-renders and improved client-side performance.
- **Critical CSS**: Used `dashboard-critical.css` for above-the-fold content to improve LCP.
- **Result**: Reduced Largest Contentful Paint (LCP) from 26 seconds to 2.5 seconds by optimizing queries, adding indexes, and improving frontend rendering.

---

## Deployment Instructions

1. **Provision a PostgreSQL database on Neon**
2. **Set environment variables in `.env.local`**
3. **Build and deploy the app**
   - For Vercel: Connect your GitHub repo, set environment variables, and deploy.
   - For custom hosting: Build with `npm run build` and serve with `npm start`.
4. **Run database migrations on production**
   ```sh
   npm run drizzle:migrate
   ```

---

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Neon Database](https://neon.tech/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## License
MIT
