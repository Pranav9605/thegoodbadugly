# The Good, The Bad & The Ugly

> Slow news for humans who think. No AI, no paste, just authentic storytelling.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui, Tailwind CSS
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **Design:** Brutalist aesthetic — Pirata One + Inter, 2px borders, mobile-first

## Getting Started

```sh
# Clone the repo
git clone https://github.com/Pranav9605/thegoodbadugly.git
cd thegoodbadugly

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and Anon Key to .env.local

# Start dev server
npm run dev
```

The app runs at `http://localhost:8080`

## Project Structure

```
src/
├── components/    # Reusable UI components
├── contexts/      # Auth context provider
├── hooks/         # Custom React hooks
├── lib/           # Supabase client, types, utils
├── pages/         # Route pages (Index, Write, Admin, etc.)
├── services/      # Data fetching layer (stories, chapters)
└── types/         # TypeScript type definitions
docs/
├── task.md              # Project task tracker
└── implementation_plan.md  # Technical implementation plan
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (reader/contributor/editor roles) |
| `stories` | Story entries with status workflow (draft → pending → cooling → live → rejected) |
| `chapters` | Story chapters with anti-AI writing metrics |
| `disputes` | Story dispute/report tracking |

All tables protected with Row Level Security (RLS).

## License

Private — All rights reserved.
