You are a senior full-stack engineer. Build a production-quality MVP of a self-hosted coding activity tracker inspired by WakaTime, but do NOT copy WakaTime's branding, UI, source code, or proprietary implementation.

Project name: DevTime

The goal is to build a coding-time tracking platform that collects coding activity from a VS Code extension, stores heartbeat events, calculates coding duration, and displays analytics in a web dashboard.

IMPORTANT:
- Do not just explain what you would build.
- Actually create the project and implement the code.
- Work incrementally and keep the application runnable after each major step.
- Prefer simple architecture over unnecessary complexity.
- This is an MVP intended to run on Vercel with a free PostgreSQL provider.
- Do NOT use Laravel for this version.
- Do NOT introduce Redis, Docker, background workers, Kubernetes, or microservices unless absolutely necessary.
- The system must be designed so those components can be introduced later if traffic grows.
- Use TypeScript everywhere possible.
- Use PostgreSQL as the database.
- Use Prisma ORM.
- The application must be deployable to Vercel.

==================================================
1. TECHNOLOGY STACK
==================================================

Web application:
- Next.js latest stable
- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Recharts for analytics
- Lucide icons
- Zod for validation
- Prisma ORM
- PostgreSQL
- Next.js Route Handlers for API endpoints

Authentication:
- Implement simple email/password authentication for the MVP.
- Passwords MUST be securely hashed.
- Use secure HTTP-only cookies or an established authentication library.
- Do not store plaintext passwords.
- Users must be able to generate and revoke API keys.

VS Code extension:
- TypeScript
- VS Code Extension API
- The extension communicates with the DevTime API through HTTPS.
- It must never upload source code contents.
- It only sends metadata required for activity tracking.

Deployment:
- Vercel for Next.js
- PostgreSQL provider such as Neon or Supabase
- Environment variables for secrets
- No hardcoded credentials

==================================================
2. MONOREPO STRUCTURE
==================================================

Create this structure:

devtime/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── prisma/
│   │   └── ...
│   │
│   └── vscode/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── packages/
│   └── shared/
│       └── ...
│
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .gitignore

Use pnpm workspaces.

If the existing project already has a structure, inspect it first and adapt instead of blindly overwriting files.

==================================================
3. CORE CONCEPT: HEARTBEATS
==================================================

The central concept is a heartbeat.

A heartbeat represents coding activity at a specific timestamp.

Example:

{
  "entity": "/home/user/project/lib/main.dart",
  "project": "jurnal_siswa",
  "language": "Dart",
  "editor": "VS Code",
  "timestamp": 1788414221,
  "is_write": true
}

The server MUST NOT receive source-code contents.

Store metadata only.

Required fields:

- userId
- entity
- project
- language
- editor
- timestamp
- isWrite
- optional branch
- optional operatingSystem
- optional machine

==================================================
4. DATABASE DESIGN
==================================================

Use PostgreSQL + Prisma.

Create these models:

User

Fields:
- id
- email
- passwordHash
- name
- createdAt
- updatedAt

ApiKey

Fields:
- id
- userId
- name
- keyHash
- lastUsedAt
- createdAt
- revokedAt

Heartbeat

Fields:
- id
- userId
- entity
- project
- language
- editor
- branch
- operatingSystem
- machine
- isWrite
- activityAt
- createdAt

DailyStat

Fields:
- id
- userId
- date
- project
- language
- totalSeconds
- createdAt
- updatedAt

Add appropriate indexes.

IMPORTANT indexes:
- Heartbeat(userId, activityAt)
- Heartbeat(userId, project, activityAt)
- Heartbeat(userId, language, activityAt)
- DailyStat(userId, date)

Avoid storing unnecessary duplicate data.

==================================================
5. API
==================================================

Create these API endpoints.

POST /api/heartbeats

Purpose:
Receive one or multiple heartbeat events.

Authentication:
API key.

Accept:

{
  "heartbeats": [
    {
      "entity": "...",
      "project": "...",
      "language": "...",
      "editor": "VS Code",
      "timestamp": 1788414221,
      "isWrite": true,
      "branch": "main",
      "operatingSystem": "linux",
      "machine": "desktop"
    }
  ]
}

Validate everything with Zod.

Reject malformed requests.

Never trust client-provided userId.

Identify the user entirely from the API key.

Return a clean JSON response.

Example:

{
  "success": true,
  "accepted": 5
}

==================================================
6. API KEY SYSTEM
==================================================

Implement API key generation.

Format something similar to:

devtime_xxxxxxxxxxxxxxxxxxxxxxxxx

IMPORTANT:
- Show the raw API key ONLY once after creation.
- Store only a secure hash in PostgreSQL.
- API key authentication must use constant-time comparison where appropriate.
- Support revocation.
- Track lastUsedAt.

Dashboard page:

/settings/api-keys

Features:
- create key
- name key
- show key once
- revoke key
- list active/revoked keys
- show createdAt
- show lastUsedAt

==================================================
7. CODING TIME ALGORITHM
==================================================

This is one of the most important parts.

Do NOT simply calculate:

lastHeartbeat - firstHeartbeat

That would massively overcount inactive time.

Use a heartbeat timeout.

For MVP:

HEARTBEAT_TIMEOUT = 5 minutes

Example:

10:00
10:02
10:04
10:06
10:08

This represents approximately:

8 minutes

If the next heartbeat is:

11:30

Then the previous session ends at 10:08.

Do NOT count the 82-minute gap.

Implement a reusable duration calculation utility:

calculateCodingDuration(heartbeats, timeoutMinutes)

Requirements:
- sort heartbeats by timestamp
- calculate differences between consecutive heartbeats
- only count gaps <= timeout
- prevent negative durations
- handle duplicate timestamps
- handle malformed timestamps safely
- return total seconds
- allow timeout to be configured later

Write unit tests for this algorithm.

==================================================
8. SESSION DETECTION
==================================================

Create a utility:

groupHeartbeatsIntoSessions()

Example:

09:00
09:02
09:04
09:06

becomes:

Session 1:
09:00 → 09:06

Then:

11:30
11:32

becomes:

Session 2:
11:30 → 11:32

Expose session information internally so the dashboard can later show:

Longest Session
Average Session
Number of Sessions

==================================================
9. DAILY STATISTICS
==================================================

Do not make the dashboard scan all historical heartbeat records every time.

Create an aggregation mechanism.

For MVP, implement a server-side aggregation function that can calculate:

- total coding seconds
- coding time per language
- coding time per project
- coding time per day

The architecture must make it easy to later move aggregation into a background worker.

For now, keep the implementation simple and synchronous.

Create API endpoints:

GET /api/stats/today

GET /api/stats?range=7d

GET /api/stats?range=30d

Return:

{
  "totalSeconds": 12345,
  "languages": [],
  "projects": [],
  "daily": [],
  "sessions": []
}

==================================================
10. DASHBOARD
==================================================

Create a polished developer-focused dashboard.

Do NOT make it look like a generic SaaS template.

Design direction:

- dark-first
- minimal
- technical
- clean
- high information density
- subtle borders
- restrained animations
- good typography
- no excessive gradients
- no giant hero section
- no unnecessary marketing sections

Dashboard layout:

Sidebar:

DevTime

Overview
Activity
Projects
Languages
Sessions
Settings

Main dashboard:

Top:

Good morning, {name}

Today
5h 42m

Stats cards:

Coding Time
Active Days
Projects
Languages

Activity chart:

Coding activity by hour/day.

Language section:

Dart       3h 20m
PHP        1h 12m
TypeScript   52m

Project section:

jurnal_siswa     2h 42m
portfolio        1h 18m
backend-api      1h 05m

Recent activity:

09:42
Dart
jurnal_siswa
main.dart

09:40
Dart
jurnal_siswa
auth_repository.dart

==================================================
11. ACTIVITY PAGE
==================================================

Create:

/activity

Features:

- today
- yesterday
- last 7 days
- last 30 days
- date picker
- activity timeline
- sessions
- coding duration
- project
- language

Example:

09:00 ───────────────── 10:32
       Dart
       jurnal_siswa

11:30 ─────── 11:54
       TypeScript
       portfolio

Show gaps clearly.

Do not pretend inactive time is coding time.

==================================================
12. PROJECTS PAGE
==================================================

Create:

/projects

Show:

Project name
Total time
Last activity
Top language
Activity over time

Clicking a project opens:

/projects/[project]

Show:
- total coding time
- languages
- daily activity
- sessions
- recent files/entities

==================================================
13. LANGUAGES PAGE
==================================================

Create:

/languages

Show:

Dart
PHP
TypeScript
JavaScript
Vue
Python
etc.

Statistics:

- total time
- percentage
- daily trend
- projects using language

==================================================
14. SETTINGS
==================================================

Create:

/settings

Sections:

Profile
API Keys
Tracking
Privacy

Tracking settings:

Heartbeat timeout:
5 minutes

Allow user to configure later.

Privacy:

Explicitly explain:

"DevTime never uploads source-code contents."

Only metadata is collected:

- file path/entity
- project
- language
- editor
- timestamps
- optional git branch
- optional operating system

==================================================
15. VS CODE EXTENSION
==================================================

Build a real VS Code extension.

The extension must track:

1. active editor changes
2. file saves
3. editor activity
4. project/workspace
5. language
6. git branch if available

Do NOT send every keystroke.

Implement a debounce/throttle mechanism.

Suggested behavior:

- send heartbeat when active editor changes
- send heartbeat when a document is saved
- send periodic heartbeat while the user is actively coding
- avoid duplicate heartbeat spam

Default periodic interval:

2 minutes

Only send when VS Code has an active editor.

==================================================
16. OFFLINE SUPPORT
==================================================

This is important.

If the API is unavailable:

DO NOT lose heartbeats.

Store pending heartbeats locally.

Use VS Code's globalState or a local JSON queue.

Example:

pendingHeartbeats

When connection becomes available:

POST pending heartbeats in batches.

After successful upload:

remove them from the queue.

Implement:

HeartbeatQueue

Methods:

add()
getAll()
remove()
flush()

==================================================
17. VS CODE CONFIGURATION
==================================================

Add settings:

devtime.apiUrl

devtime.apiKey

devtime.enabled

devtime.heartbeatInterval

Example:

"devtime.apiUrl": "https://your-domain.vercel.app",
"devtime.apiKey": "devtime_xxx",
"devtime.enabled": true,
"devtime.heartbeatInterval": 120

Add commands:

DevTime: Login
DevTime: Set API Key
DevTime: Show Status
DevTime: Send Test Heartbeat
DevTime: Enable Tracking
DevTime: Disable Tracking

Status bar:

DevTime: 2h 32m

If not authenticated:

DevTime: Not Connected

==================================================
18. SECURITY
==================================================

Implement:

- secure password hashing
- API key hashing
- input validation
- authentication middleware
- authorization
- rate limiting where practical
- request body limits
- no source-code contents
- no secrets in git
- environment variables
- secure cookies
- CSRF-safe architecture where relevant
- prevent users from accessing other users' statistics

Every database query involving user data must enforce ownership.

==================================================
19. RATE LIMITING
==================================================

The heartbeat endpoint must not be unlimited.

Implement reasonable rate limiting.

Example:

maximum 60 heartbeat requests/minute per API key.

Since the extension can batch events, encourage batch requests.

Do not create a request for every keystroke.

==================================================
20. DUPLICATE HEARTBEATS
==================================================

Prevent obvious duplicate events.

Consider a unique event fingerprint:

userId + entity + timestamp + project

Do not blindly reject all similar heartbeats because multiple events can legitimately happen close together.

Implement a sensible deduplication strategy.

==================================================
21. TESTING
==================================================

Write tests for:

- heartbeat validation
- API key authentication
- duration calculation
- session grouping
- duplicate heartbeat handling
- stats aggregation
- user authorization

Especially test:

Case 1:

10:00
10:02
10:04

Expected duration:
4 minutes

Case 2:

10:00
10:02
10:20

Expected duration:
2 minutes

Case 3:

10:00
10:02
10:20
10:22

Expected:
4 minutes total

Case 4:

duplicate timestamps

Case 5:

out-of-order heartbeats

==================================================
22. PRIVACY
==================================================

This application must never upload file contents.

The extension sends metadata only.

Make this explicit in the README.

Do not collect:

- source code
- file contents
- passwords
- terminal commands
- clipboard contents

unless explicitly added as an opt-in future feature.

==================================================
23. ENVIRONMENT VARIABLES
==================================================

Create:

.env.example

Include:

DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=

Do not put real secrets in the repository.

==================================================
24. LOCAL DEVELOPMENT
==================================================

Create clear setup instructions.

Expected:

pnpm install

pnpm prisma generate

pnpm prisma migrate dev

pnpm dev

The README must explain:

1. PostgreSQL setup
2. environment variables
3. Prisma migration
4. starting Next.js
5. starting VS Code extension
6. obtaining API key
7. configuring extension
8. testing heartbeat
9. deploying to Vercel

==================================================
25. VERCEL DEPLOYMENT
==================================================

The application must work on Vercel.

Use Next.js Route Handlers.

Do not rely on:
- persistent local filesystem
- long-running server processes
- cron processes running continuously
- WebSocket server
- background worker

The API must be stateless.

Database connection handling must be compatible with serverless execution.

Use Prisma appropriately for serverless PostgreSQL.

Document Vercel environment variables.

==================================================
26. UI QUALITY
==================================================

Do not generate a low-quality template.

The dashboard should feel like a serious developer tool.

Use:

- responsive layout
- keyboard-friendly navigation
- loading states
- skeleton states
- empty states
- error states
- accessible components
- consistent spacing
- consistent typography
- subtle hover states
- responsive charts
- mobile-friendly layout

Avoid:

- huge rounded cards everywhere
- excessive gradients
- fake statistics
- meaningless animations
- generic AI SaaS aesthetics
- excessive glassmorphism

Use real data.

If there is no data, show a useful empty state:

"No coding activity yet."

Then explain how to connect the VS Code extension.

==================================================
27. SAMPLE DATA
==================================================

Provide a development-only seed script.

Generate realistic heartbeat data for:

Projects:
- jurnal_siswa
- portfolio
- backend-api

Languages:
- Dart
- TypeScript
- PHP
- Vue

Do NOT ship fake production statistics.

Only use seed data in development.

==================================================
28. PROJECT README
==================================================

Write a professional README containing:

- project overview
- architecture diagram in Markdown
- technology stack
- features
- privacy model
- database schema explanation
- heartbeat protocol
- duration algorithm
- local setup
- Vercel deployment
- VS Code extension setup
- API documentation
- environment variables
- roadmap

==================================================
29. DEVELOPMENT ROADMAP
==================================================

After MVP, document future improvements:

Phase 2:
- Git branch analytics
- Git commit activity
- better session analytics
- weekly reports
- monthly reports

Phase 3:
- JetBrains plugin
- Neovim plugin
- CLI tracker

Phase 4:
- team dashboards
- organizations
- team analytics

Phase 5:
- self-hosting
- privacy-focused local-first mode

==================================================
30. IMPORTANT IMPLEMENTATION RULES
==================================================

Before writing code:

1. Inspect the existing directory.
2. Identify whether a project already exists.
3. Do not destroy existing work without reason.
4. Create a clean implementation plan internally.
5. Then implement it.

Do not stop at scaffolding.

Actually implement:

- database
- Prisma schema
- authentication
- API
- heartbeat ingestion
- duration algorithm
- statistics
- dashboard
- settings
- API key management
- VS Code extension
- offline queue
- tests
- README

After implementation:

1. Run type checking.
2. Run linting.
3. Run tests.
4. Run Prisma validation.
5. Build the Next.js application.
6. Build/package the VS Code extension.
7. Fix errors.
8. Re-run checks.

At the end, provide a concise report:

- what was implemented
- files created
- commands to run
- environment variables required
- how to connect VS Code
- how to deploy to Vercel
- known limitations
- recommended next step

Do not claim something works unless you actually tested it.

Start now.
