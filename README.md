# REPOfolio — Build. Ship. Own.

REPOfolio is an engineering-first portfolio builder that lets developers describe themselves once, customize their visual style, save their work as drafts, and generate/publish the corresponding source code directly to a GitHub repository they control. Rather than providing a hosted profile page, REPOfolio exports a clean, serverless-ready Next.js React codebase to the user's personal GitHub account.

The production deployment of the application is live at: [https://repofolio-app.vercel.app](https://repofolio-app.vercel.app)

---

## ✨ Features

- **Double OAuth & Credentials Authentication**: Supports standard Email/Password accounts alongside Google OAuth login flows.
- **Secure Session Management**: Built with HTTP-only, SameSite-secured session tokens holding signed JWT payloads.
- **MongoDB Atlas Integration**: Persists user profiles, connection states, and portfolio draft versions dynamically.
- **Multiple Design Presets**: Choose between 6 bespoke built-in templates (Minimal, Developer, Editorial, Experimental, Creative, Corporate) that change visual layouts dynamically around the user's content.
- **Live Reactive Sandbox**: Preview details, text, and roles inside a simulated browser frame viewport (Desktop, Tablet, Mobile) in real-time.
- **GitHub Integration**: Secure GitHub OAuth connectivity linking the user's repository credentials to their REPOfolio workspace.
- **GitHub Contents Sync Engine**: Generates a clean Next.js portfolio project and commits it file-by-file to a newly created or updated (`repofolio-portfolio`) public repository.
- **Connected Status & Disconnect controls**: Connect or disconnect a linked GitHub profile instantly from the profile dropdown menu.
- **Responsive Layout**: Designed with a fluid interface that scales cleanly down to 390px mobile screens.
- **Persisted Dark/Light Mode**: Full theme customization utilizing custom CSS variable tokens, system preference fallback, and localStorage persistence.

---

## 🧭 How It Works

1. **Authenticate**: Sign up or log in via credentials or Google OAuth.
2. **Setup Details**: Open the workspace editor, seed profile details from preloaded templates, or fill in custom details.
3. **Choose Preset**: Choose a design preset template layout.
4. **Preview Live**: Check responsive layouts on desktop, tablet, and mobile sandbox controls.
5. **Save Draft**: Store your work to edit later.
6. **Connect GitHub**: Connect your GitHub account via the profile dropdown menu.
7. **Sync & Ship**: Click "Generate Portfolio" to create a repository and sync the source code files.

---

## 🏗️ Architecture

The application is structured as a full-stack Next.js web app utilizing the App Router architecture. Both frontend layouts and backend APIs run unified under Next.js serverless functions, avoiding separate service dependencies.

```
                  ┌───────────────────────────────┐
                  │         Frontend UI           │
                  │   (React Components, Tailwind)│
                  └───────────────┬───────────────┘
                                  │ (HTTP Requests)
                                  ▼
                  ┌───────────────────────────────┐
                  │      Next.js App Router       │
                  │        (API Handlers)         │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────┐                               ┌─────────────────┐
│  MongoDB Atlas  │                               │   GitHub API    │
│  (User/Drafts)  │                               │ (Repo Creation) │
└─────────────────┘                               └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.3.1 (Turbopack)**
- **React 19.2.8**
- **TypeScript 5.x**
- **Tailwind CSS v4** (via postcss configuration)
- **Framer Motion 13.x**

### Backend / Database
- **Next.js App Router API Handlers**
- **Node.js**
- **Mongoose 9.9.x**
- **MongoDB Atlas**

### Security / Authentication
- **bcryptjs**: Password hashing for credential storage.
- **jose**: High-performance JWT signatures for session verification.
- **Google OAuth 2.0 API**
- **GitHub OAuth App API**

---

## 🔐 Authentication & Security

- **Session Tokens**: Active user sessions are stored in an HTTP-only, secure, SameSite `session_token` cookie. The cookie contains a signed JWT payload containing only the user database identifier (`sub`).
- **CSRF State Handshake**: GitHub and Google OAuth redirects utilize cryptographically secure `state` parameters stored in temporary HTTP-only cookies (`oauth_state`) to prevent Cross-Site Request Forgery.
- **Database Safety**: Raw credential records store secure salt-hashed passwords using `bcryptjs`. Sensitive OAuth tokens (e.g. GitHub access tokens) are stored in the database but are never exposed in user lookup responses (`/api/auth/me`).

---

## 🗄️ Data Model

REPOfolio manages persistence using two key Mongoose schemas:

### User Collection (`User`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `String` | Full name of the user (Required) |
| `email` | `String` | Unique, lowercase trimmed email (Required) |
| `passwordHash`| `String` | Salt-hashed credentials password |
| `googleId` | `String` | Google Provider unique identification reference |
| `githubToken` | `String` | Linked GitHub User access token |
| `githubUsername`| `String` | Associated GitHub login handle |
| `avatarUrl` | `String` | Profile photo path |

### Portfolio Collection (`Portfolio`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | `ObjectId` | Reference identifier pointing to the owning User (Required) |
| `name` | `String` | User-defined name of the draft (Required) |
| `template` | `String` | Selected portfolio layout preset identifier (Required) |
| `data` | `Mixed` | Ported content properties (Required) |
| `repoUrl` | `String` | GitHub HTML address reference to the deployed repository |
| `repoFullName`| `String` | Full name of the GitHub repository (`owner/repo-name`) |
| `status` | `String` | Generation status state (`draft`, `generating`, `published`, `failed`) |

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router Page layouts & API Route handlers
│   ├── api/              # API endpoints (Auth, GitHub repository creation, portfolios)
│   ├── create/           # Portfolio generator sandbox workspace interface
│   ├── dashboard/        # Drafts management dashboard
│   ├── login/            # Log in credentials page
│   └── signup/           # Signup registration page
├── components/           # Reusable UI React components
│   ├── cta/              # Footer CTAs
│   ├── gallery/          # Preset showcase selectors
│   ├── hero/             # Landing presentation loops
│   ├── live-preview/     # Sandbox simulation elements
│   ├── navigation/       # Navbar and profile dropdown menus
│   └── portfolio/        # Portfolio templates and renderer components
├── lib/                  # Shared helper logic (db connections, token handlers, constants)
├── models/               # Mongoose MongoDB Schemas (User, Portfolio)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)
- MongoDB Atlas database access string
- Google Cloud Console OAuth Client Credentials
- GitHub Developer Settings OAuth Application

### Environment Setup
Create a `.env.local` file at the root of the project with the following configuration:

```env
# GitHub App Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Authentication Session Secret
AUTH_SECRET=your_32_byte_session_secret

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/thedhanush0905/RepoFolio.git
   cd RepoFolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
4. Access sandbox workspace at: `http://localhost:3000`
