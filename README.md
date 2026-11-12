# SkillSync — Skill-Based Career Matching Platform

SkillSync is a full-stack career matching platform designed to help students and job seekers assess their career readiness, discover compatible job roles and technology companies, identify skill gaps, and follow personalized learning roadmaps.

The application combines a modern React frontend with **Supabase authentication and database services**, alongside a **Node.js and Express backend API**.

---

## 🚀 Key Features

### 1. User Authentication
- User registration with name, email, and password.
- Secure email/password login using Supabase Authentication.
- Email verification support.
- Forgot password and password reset functionality.
- Persistent authenticated sessions.
- Protected application routes.
- User profile creation linked to authenticated accounts.

### 2. Candidate Dashboard
- Personalized welcome dashboard.
- Total skills and career matching overview.
- Top matched job role and company.
- Skill-gap metrics and roadmap completion progress.
- Recommended jobs based on current skills.
- Skills that need improvement.

### 3. Comprehensive Skills Management
- Searchable skills catalog covering multiple technical and professional categories.
- Add skills to a personal skill inventory.
- Custom skill proficiency levels:
  - Beginner
  - Intermediate
  - Advanced
- Update proficiency levels.
- Remove skills.
- Persistent skill data associated with the authenticated user.

### 4. Company Discovery
- Discover technology employers based on skill compatibility.
- Browse company directory.
- Explore company profiles and available roles.
- View company information, industry, ratings, and other details.
- Bookmark companies for later reference.

### 5. Role Matching and Skill-Gap Analysis
- Job roles ranked by compatibility with the user's current skills.
- Matching percentage calculated using:

  \[
  \text{Match Percentage} =
  \frac{\text{Matching Required Skills}}{\text{Total Required Skills}}
  \times 100
  \]

- Categorization of skills into:
  - Skills You Have
  - Skills to Improve
  - Missing Skills
- Detailed comparison between required and current proficiency levels.

### 6. Personalized Learning Roadmaps
- Generate personalized five-phase learning roadmaps.
- Roadmaps are based on missing and improvable skills.
- Five learning phases:
  1. Fundamentals
  2. Core Technical Skills
  3. Frameworks and Advanced Concepts
  4. Projects and Practical Experience
  5. Interview Preparation
- Learning resources and estimated durations for milestones.
- Interactive task-completion checkboxes.
- Progress tracking and target completion dates.
- Roadmaps and completed milestones persist in the database.

### 7. Saved Items and Role Comparison
- Bookmark companies and job roles.
- Save generated roadmaps.
- View saved items in one place.
- Compare up to three job roles using a side-by-side comparison matrix.

### 8. Notification Center
- Notifications for relevant application activities.
- Unread notification indicators.
- Mark notifications as read.
- Mark all notifications as read.
- Dismiss notifications.
- Persistent notification data.

### 9. Profile and Settings
- Editable candidate profile.
- Personal information and professional headline.
- Education and experience details.
- Professional summary and location.
- LinkedIn and GitHub links.
- Career interests, target companies, and target roles.
- Light and dark theme preferences.
- Data export functionality.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | User interface |
| Vite | Development server and build tool |
| Tailwind CSS | Styling and responsive design |
| React Router | Application routing |
| Supabase JavaScript Client | Authentication and database access |
| Lucide React | Icons |
| Recharts | Data visualization |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| Supabase | Backend-as-a-Service |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Row Level Security (RLS) | Database access control |
| dotenv | Environment variable management |
| CORS | Cross-origin request configuration |

---

## 🏗️ Backend Architecture

SkillSync uses Supabase for authentication, database storage, and user-specific data management.

The React frontend communicates directly with Supabase through the Supabase JavaScript client.

A separate Express.js server provides the backend API and a Supabase connectivity health-check endpoint.

### Architecture Overview

```text
                  SkillSync Application
                          |
             +------------+------------+
             |                         |
        React Frontend             Express API
             |                         |
       Supabase JS Client          Node.js Server
             |                         |
             +------------+------------+
                          |
                       Supabase
                          |
              +-----------+-----------+
              |           |           |
          PostgreSQL   Supabase     Storage
           Database      Auth
```

### Authentication

Supabase Authentication manages:
- User registration.
- Email/password login.
- Email verification.
- Password recovery.
- Authenticated sessions.
- User identity.

Each registered user has a corresponding profile record linked to their authentication ID.

### Database

PostgreSQL is used to store application data.

The database includes the following main tables:

| Table | Purpose |
|---|---|
| `profiles` | User profile information and roles |
| `skills` | Available skills catalog |
| `skill_categories` | Skill categories |
| `user_skills` | Skills associated with individual users |
| `companies` | Company information |
| `job_roles` | Available job roles |
| `company_roles` | Relationships between companies and roles |
| `role_skills` | Skills required for job roles |
| `user_bookmarks` | Saved companies and roles |
| `user_roadmaps` | Personalized learning roadmaps and progress |
| `user_notifications` | User notifications |
| `recently_viewed` | Recently viewed application items |

### User Data Security

Row Level Security (RLS) policies are configured for user-specific tables.

These policies restrict users to accessing their own personal records.

Additional database permissions restrict sensitive profile updates, including changes to the user's role.

Public catalog data, such as company and job information, is made available through database access policies.

---

## 🌐 Express Backend API

The Express server is located in the `server/` directory.

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the SkillSync API is running |
| GET | `/api/health/supabase` | Checks connectivity with Supabase Storage |

### Example API Response

A successful request to `/api/health/supabase` returns:

```json
{
  "success": true,
  "message": "Successfully connected to Supabase!",
  "bucketsFound": 0
}
```

The bucket count depends on the configured Supabase Storage project.

---

## 📁 Project Structure

```text
skillsync/
│
├── server/
│   ├── index.js
│   ├── supabase.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── components/
│   │   └── ui/
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   └── auth/
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env                 # Local environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## 💻 Installation and Setup

### Prerequisites

- Node.js (v18 or later recommended).
- npm.
- A Supabase account and project.

### 1. Clone the Repository

```bash
git clone https://github.com/Rishwick-12/SkillSync.git
cd SkillSync
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Replace the placeholder values with the URL and publishable key from your Supabase project.

### 4. Configure Supabase

Create the required database tables, relationships, permissions, and Row Level Security policies in your Supabase project.

Configure Supabase Authentication with email/password authentication and email verification.

The frontend requires the database schema and policies described in the Backend Architecture section.

### 5. Start the Frontend

From the project root:

```bash
npm run dev
```

Open the local Vite URL displayed in the terminal, usually:

`http://localhost:5173`

### 6. Configure the Express Backend

Open a second terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
PORT=5000
```

Use your Supabase project's secret key for the server-side configuration. Never expose this key in frontend code or commit it to GitHub.

### 7. Start the Backend Server

From the `server/` directory:

```bash
npm run dev
```

The Express server starts on port `5000` by default.

Test the API:

- `http://localhost:5000/`
- `http://localhost:5000/api/health/supabase`

---

## 🔐 Environment Variable Security

SkillSync uses separate environment configurations for its frontend and backend.

| Variable | Location | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Root `.env` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Root `.env` | Frontend publishable key |
| `SUPABASE_URL` | `server/.env` | Server-side Supabase project URL |
| `SUPABASE_SECRET_KEY` | `server/.env` | Server-side secret key |

**Important:**
- Never commit `.env` files.
- Never expose Supabase secret keys in frontend code.
- Keep server-side credentials exclusively in the backend environment.
- The repository includes `.gitignore` rules to exclude local environment files.

---

## 📌 Project Status

SkillSync currently includes:

- React frontend and responsive application interface.
- Supabase authentication integration.
- User profile management.
- PostgreSQL database integration.
- Persistent skills, bookmarks, roadmaps, and notifications.
- Row Level Security policies for user-specific data.
- Express backend API with Supabase connectivity check.

---

## 👨‍💻 Repository

GitHub: https://github.com/Rishwick-12/SkillSync

**SkillSync — Build your skills. Discover your career.**
