# SkillSync — Skill-Based Career Matching Platform (Frontend)

SkillSync is a modern, responsive frontend single-page web application built with **React.js**, **Tailwind CSS**, **React Router v6**, **Lucide Icons**, and **Recharts**. It empowers students and job seekers to assess career readiness, discover compatible roles and top technology employers, perform deep skill-gap analyses, and pursue personalized 5-phase learning roadmaps.

> **Architecture Constraint Met:** SkillSync is entirely frontend-only. All session states, user skills, bookmarked employers, matching results, and interactive roadmap progress are calculated dynamically on the client and persisted in browser `localStorage`. No backend APIs, Node.js servers, or MongoDB databases are required.

---

## 🚀 Key Features

### 1. Simulated Demo Authentication
- **Login Screen (`/login`)**: Email/password authentication, show/hide password toggle, input validation, and a one-click **"Use Demo Account"** quick-fill button (`demo@skillsync.app` / `demo123`).
- **Registration Screen (`/register`)**: Name, email, password, confirm password, 5-bar live password strength evaluator, and instant mismatch detection.
- **Forgot Password Screen (`/forgot-password`)**: Client-side simulated password recovery workflow.
- **Session Persistence**: Maintained via `skillsync_session` in `localStorage` with full sign-out support.

### 2. Candidate Dashboard (`/dashboard`)
- Personalized greeting and quick-action buttons: *Add Skills*, *Explore Companies*, *Matching Roles*, *Roadmaps*.
- Real-time stat metrics: **Total Skills Added**, **Matching Companies**, **Top Match %**, and **Roadmap Completion Progress**.
- Top Matched Role & Company Spotlight with compatibility badge and key metrics.
- Recharts category distribution bar chart and proficiency count cards (*Advanced*, *Intermediate*, *Beginner*).
- Highlight of *Skills to Improve*, *Upcoming Roadmap Milestones*, *Recent Activity*, and *Notifications Preview*.

### 3. Comprehensive Skills Management (`/skills`)
- Searchable autocomplete catalog input covering 60+ skills across 9 categories (*Web Development*, *Programming Languages*, *Databases*, *DSA*, *AI/ML*, *Cloud & DevOps*, *Mobile*, *Soft Skills*, *Tools*).
- Support for adding custom user skills with custom categories.
- Multi-tier proficiency toggle: **Beginner**, **Intermediate**, **Advanced**.
- Live inline proficiency editor and skill removal.
- Filter and search bar by name, category pills, and proficiency level.

### 4. Company Discovery (`/companies` & `/companies/:companyId`)
- Dual-mode discovery:
  - **Find Companies by Skills**: Employers ranked by role compatibility score, displaying matching vs. missing skill counts, Glassdoor ratings, open roles, and favorite bookmarking.
  - **Browse Directory**: Grid of tech employers (*Google, Microsoft, Amazon, Meta, Apple, Netflix, Infosys, TCS, Wipro, Cognizant, Flipkart, Swiggy*).
- Filters for industry, category, and interactive **Minimum Match % slider**.
- Company Profile pages featuring open job role breakdowns, corporate overview, culture pillars, fast facts, and direct role analysis links.
- Clearly labeled illustrative mock hiring benchmark disclaimers.

### 5. Role Matching & Gap Analysis (`/matches` & `/roles/:roleId`)
- All roles ranked by compatibility using the formula:
  $$\text{Match Percentage} = \left(\frac{\text{Matching Required Skills}}{\text{Total Required Skills}}\right) \times 100$$
- 3-Column granular skill breakdown:
  - **Skills You Have** (Green): Skills meeting or exceeding target requirements.
  - **Skills to Improve** (Yellow): Possessed skills that require proficiency advancement.
  - **Missing Skills** (Red): Unmet core requirements.
- Side-by-side table of all role requirements comparing required proficiency against candidate level.
- Live recalculation as the candidate adds or updates skills in their profile.

### 6. Personalized 5-Phase Learning Roadmap (`/roadmaps` & `/roadmaps/:roadmapId`)
- Custom roadmaps dynamically generated from missing and improvable skills:
  1. **Phase 1: Fundamentals**
  2. **Phase 2: Core Technical Skills**
  3. **Phase 3: Frameworks and Advanced Concepts**
  4. **Phase 4: Projects and Practical Experience**
  5. **Phase 5: Interview Preparation**
- Each task includes task title, description, curated free/paid learning resource link, estimated duration, priority badge (*High*, *Medium*, *Low*), and interactive completion checkboxes.
- Milestone tracking with progress bars, pending/completed task filters, and editable target completion dates.

### 7. Saved Items & Multi-Role Comparison (`/saved`)
- Bookmarks for companies, roles, and generated roadmaps.
- **Side-by-side Role Comparison Matrix**: Select up to 3 roles simultaneously to compare match score, compensation ranges, total core skill counts, matching competencies, improvable skills, and missing gaps in a unified table.

### 8. Notification Center (`/notifications`)
- Bell icon with live unread badge count in sidebar and header.
- Automated client-triggered notifications when new skills are added, roadmaps generated, or milestones achieved.
- Mark as read, mark all read, dismiss notification, and filter between *All* and *Unread*.

### 9. Profile & Settings (`/profile` & `/settings`)
- Editable candidate profile: headline, education, experience tier, bio, social links, career interests, target companies, and roles.
- Dark and Light theme toggle (persisted via Tailwind CSS `dark` class).
- Notification preference switches and salary display settings.
- Data export (backup as JSON download) and factory demo reset options.

---

## 🛠️ Project Structure

```
skillsync/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                     # Application bootstrap
│   ├── App.jsx                      # Providers & router root
│   ├── index.css                    # Tailwind design system & utilities
│   ├── components/
│   │   └── ui/
│   │       ├── EmptyState.jsx       # Reusable empty state view
│   │       ├── LoadingSkeleton.jsx  # Card & list shimmer skeletons
│   │       ├── MatchBadge.jsx       # Color-coded match percentage badge
│   │       ├── Modal.jsx            # Accessible dialog modal
│   │       ├── ProgressBar.jsx      # Progress bar with color variants
│   │       └── SkillTag.jsx         # Interactive skill tag with remove action
│   ├── context/
│   │   ├── AppContext.jsx           # Global state (skills, roadmaps, saves, notifications, theme)
│   │   └── AuthContext.jsx          # Client-side demo session management
│   ├── data/
│   │   ├── companies.js             # 12 detailed mock tech employer profiles
│   │   ├── notifications.js         # Starter activity notifications
│   │   ├── resources.js             # Curated documentation, courses, & books
│   │   ├── roles.js                 # 15 tech roles with skill requirements
│   │   └── skills.js                # 60+ skills catalog with categories
│   ├── hooks/
│   │   └── useLocalStorage.js       # Generic localStorage synchronization hook
│   ├── layouts/
│   │   ├── AuthLayout.jsx           # Clean centered auth layout with branding
│   │   └── DashboardLayout.jsx      # Responsive desktop sidebar + mobile drawer layout
│   ├── pages/
│   │   ├── DashboardPage.jsx        # Candidate overview & analytics
│   │   ├── SkillsPage.jsx           # Skills inventory, proficiency editor, & catalog
│   │   ├── CompaniesPage.jsx        # Company discovery & skill compatibility
│   │   ├── CompanyDetailPage.jsx    # Company specs & open roles
│   │   ├── MatchesPage.jsx          # Role matching recommendation feed
│   │   ├── RoleDetailPage.jsx       # 3-tier gap analysis & roadmap trigger
│   │   ├── RoadmapsPage.jsx         # Saved learning roadmaps directory
│   │   ├── RoadmapDetailPage.jsx    # Interactive 5-phase checklist & target dates
│   │   ├── SavedPage.jsx            # Bookmarks & 3-role side-by-side comparison
│   │   ├── NotificationsPage.jsx    # Notification center
│   │   ├── ProfilePage.jsx          # Editable candidate profile
│   │   ├── SettingsPage.jsx         # Theme, preferences, & data export
│   │   └── auth/
│   │       ├── LoginPage.jsx        # Demo sign-in
│   │       ├── RegisterPage.jsx     # Registration & strength meter
│   │       └── ForgotPasswordPage.jsx # Password recovery simulation
│   ├── routes/
│   │   └── index.jsx                # Protected & public routes
│   └── utils/
│       ├── matching.js              # Skill overlap & categorization algorithms
│       └── roadmap.js               # 5-phase personalized curriculum generator
```

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended; v24 installed)
- npm or pnpm

### Quick Start
```bash
# 1. Navigate to the project directory
cd "C:\Users\Rishwick\.gemini\antigravity\scratch\skillsync"

# 2. Start the local Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`. You can immediately sign in with the prefilled demo account or click **"Use Demo Account"** on the login page!
