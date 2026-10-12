# Task Optimizer - Web Frontend

The Next.js 16 web application for the **Task Optimizer** platform.

For the full project overview, architecture diagrams, backend documentation, and API specifications, please refer to the [Root README.md](../../README.md).

---

## 🚀 Overview

The frontend is built with:
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: React 19
- **State Management & Data Fetching**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4 with custom dark obsidian theme
- **Animations**: Framer Motion
- **Icons & Notifications**: Lucide React & Sonner
- **Form Management**: React Hook Form with Zod schemas

---

## 📁 Feature Structure

- `src/app/(auth)`: Login and registration views with client-side form validation.
- `src/app/(dashboard)`: Authenticated dashboard interface:
  - `/dashboard`: Daily overview hero, upcoming timeline, and recent activity card.
  - `/my-task`: Full daily task manager and weekly planner calendar grid.
  - `/progress`: Custom SVG analytics (trend charts, completion rates, score distribution).
  - `/story`: AI-powered daily journal history ("My Story").
  - `/settings`: Application notifications, security, and appearance settings.
  - `/profile`: User details management and account deletion with confirmation.
- `src/features`: Modular feature folders with isolated components, services, and types.
- `src/lib/axios.ts`: Axios instance configured with automatic refresh token rotation queue on 401 responses.
- `src/lib/auth-token.ts`: In-memory access token storage service.

---

## 🛠 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` in `apps/web/`:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production bundle.
- `npm run start`: Runs the built production server.
- `npm run lint`: Executes ESLint code quality checks.
