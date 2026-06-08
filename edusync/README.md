# EduSync — Student Portal

A modern, production-ready Next.js 15 migration of the EduSync student portal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| State | Zustand (persisted to localStorage) |
| Icons | Font Awesome 6 (CDN, matching original) |
| Images | next/image with remote patterns |

## Project Structure

```
edusync/
├── app/
│   ├── layout.tsx          # Root layout, metadata, font
│   ├── page.tsx            # Main portal entry (applies theme CSS vars)
│   ├── globals.css         # Tailwind base + CSS custom properties
│   └── test/
│       ├── page.tsx        # /test route (metadata)
│       └── TestPageClient.tsx
├── components/
│   ├── layout/
│   │   ├── PortalLayout.tsx   # Main app shell
│   │   ├── Sidebar.tsx        # Collapsible sidebar, mobile drawer
│   │   └── TopBar.tsx         # Search, notifications, user profile
│   ├── dashboard/
│   │   └── DashboardTab.tsx   # Welcome, stats, calendar, assignments
│   ├── courses/
│   │   └── CoursesTab.tsx     # Course cards, bookmarks, enroll
│   ├── assignments/
│   │   ├── AssignmentsTab.tsx # File upload/submit/delete
│   │   └── TestsTab.tsx       # MCQ test engine with timer + score ring
│   ├── grades/
│   │   └── GradesTab.tsx      # Grade table, export report
│   ├── videos/
│   │   └── VideoLecturesTab.tsx  # YouTube embed, search/filter
│   ├── discussions/
│   │   └── DiscussionTab.tsx  # Post threads, reply, edit, delete
│   ├── profile/
│   │   └── ProfileTab.tsx     # View/edit profile
│   ├── settings/
│   │   └── SettingsTab.tsx    # Theme, accent color, notifications
│   ├── modals/
│   │   ├── AIChatbot.tsx      # Floating AI chat widget
│   │   ├── CourseChatModal.tsx # Per-course instructor chat
│   │   ├── EnrollModal.tsx    # Enroll in new course
│   │   └── ProfileSettingsModal.tsx # Avatar + name editor
│   └── ui/
│       └── Modal.tsx          # Accessible modal primitive
├── lib/
│   ├── data.ts     # All static data, accent themes, search data
│   ├── storage.ts  # localStorage helpers
│   ├── store.ts    # Zustand app state
│   └── utils.ts    # cn(), formatTime(), getInitials(), etc.
└── types/
    └── index.ts    # All TypeScript interfaces and types
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Features Preserved (100%)

- ✅ Dashboard with welcome card, upcoming deadlines, calendar, quick stats
- ✅ My Courses with progress bars, bookmarks, enroll modal, course chat
- ✅ Assignments with file upload/submit/view/delete, status badges
- ✅ MCQ Test with countdown timer, answer selection, score ring, report download
- ✅ Grades table with progress bars, export report
- ✅ Video Lectures with YouTube embed, search & filter
- ✅ Discussion threads — post, reply, edit, delete (own posts)
- ✅ Student Profile — view & edit all fields, avatar upload/remove
- ✅ Settings — dark/light theme, 6 accent colors, 5 notification toggles
- ✅ AI Chatbot modal with keyword-based responses
- ✅ Sidebar collapse (desktop) and mobile drawer
- ✅ Global search with highlighted results
- ✅ Per-course instructor chat with simulated responses
- ✅ Theme & accent color persisted to localStorage
- ✅ All state persisted across page refreshes via Zustand persist

## Improvements Over Original

| Area | Improvement |
|------|-------------|
| Architecture | Monolithic 5431-line HTML → 30+ typed components |
| TypeScript | Full strict typing throughout |
| Animations | Framer Motion replaces CSS transitions |
| Performance | Code splitting, lazy tab rendering, next/image |
| Accessibility | ARIA roles, labels, keyboard navigation, focus traps |
| Responsiveness | Mobile-first, tested at all breakpoints |
| State | Zustand replaces scattered localStorage reads |
| SEO | Metadata API, Open Graph, Twitter card |
| Routes | `/` portal + `/test` standalone test page |

## Deployment (Vercel)

```bash
npx vercel
```

Or connect the GitHub repo to Vercel — zero config needed.

## Future Database Integration

The `lib/storage.ts` module is the single data access layer. When ready to move off localStorage, replace the functions there with API calls — no component code needs to change.
