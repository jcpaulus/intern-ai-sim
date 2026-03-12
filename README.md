# Internly

Internly is an AI-powered internship simulation platform built with React, TypeScript, Vite, Tailwind, and Supabase.

It helps learners gain practical work experience through realistic role-based tasks, manager-style AI feedback, and progress tracking across a structured internship journey.

## What This App Does

Users move through a guided flow:

1. Sign up or log in.
2. Complete onboarding.
3. Choose an internship role.
4. Configure simulation settings (duration, level, manager style, company).
5. Complete orientation.
6. Work through weekly or daily tasks.
7. Submit responses (text and optional files).
8. Receive structured AI feedback.
9. Track progress and review simulation history.

## Key Features

- Authentication with Supabase Auth.
- Protected routes with onboarding gates.
- Role catalog for internship tracks:
	- Business Analyst
	- Marketing Associate
	- Operations Assistant
- Configurable simulation setup:
	- Duration
	- Difficulty level
	- Manager style
	- Company context
- Dynamic orientation and schedule generation.
- Active simulation workspace with:
	- Task timeline
	- Submission UI
	- Evaluation feedback
- Persistent progress state across major steps.
- Simulation history viewer.
- Optional workplace literacy bootcamp module.

## Architecture

### Frontend

- React 18 + TypeScript + Vite
- React Router for page flow
- Tailwind CSS + shadcn-ui components
- TanStack Query for client-side data workflow
- Sonner and shadcn toasts for UX feedback

### Backend and Data

- Supabase for auth, storage, and Postgres persistence
- Supabase Edge Functions for AI actions:
	- `generate-task`: creates internship tasks from role context
	- `evaluate-submission`: evaluates intern submissions and returns structured feedback
- Main persisted tables include:
	- `profiles`
	- `user_progress`
	- `simulation_runs`
	- `submissions_files`

## Project Structure

```text
src/
	components/         # shared UI and routing guards
	data/               # responsibilities + schedule generation
	hooks/              # auth + progress hooks
	integrations/       # Supabase client + generated types
	pages/              # routed screens and product flows
supabase/
	functions/          # edge functions for AI generation/evaluation
	migrations/         # database schema evolution
```

## Local Development

### Prerequisites

- Node.js 20+ recommended
- npm 10+
- Supabase project access (for auth/data/functions)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Run the app

```bash
npm run dev
```

The app will start on the Vite development server.

## Edge Function Setup

This project uses AI via Supabase Edge Functions, which expect a server-side secret:

- `LOVABLE_API_KEY`

Set this secret in your Supabase project before invoking functions.

If you are running Supabase functions locally, ensure your local function environment includes the same secret.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run build:dev` - development-mode build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode

## Current Notes

- The primary internship flow uses the guided pages and Supabase Edge Functions.
- There is also an alternate simulation page in the codebase for a simpler one-shot simulation path.
- Some report content is currently static and can be upgraded to fully dynamic data.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- Supabase
- Vitest

## Contributing

1. Create a feature branch.
2. Make changes with clear commits.
3. Run lint and tests.
4. Open a pull request.

## License

No license file is currently defined in this repository.
