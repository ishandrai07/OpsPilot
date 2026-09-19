# AIONOS OpsPilot – AI Business Operations Agent

> An internal company tool where employees submit requests and an AI agent automatically understands, classifies, checks policies, and decides whether to resolve or escalate them.

![Tech Stack](https://img.shields.io/badge/MERN-Stack-blue) ![AI](https://img.shields.io/badge/Gemini-AI-orange) ![Auth](https://img.shields.io/badge/JWT-Auth-green)

---

## 🚀 Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Frontend    | React 19 + Vite + Tailwind CSS v4    |
| Backend     | Node.js + Express.js                 |
| Database    | MongoDB + Mongoose                   |
| AI          | Google Gemini API (`gemini-3-flash-preview`) |
| Auth        | JWT + bcrypt                         |
| HTTP Client | Axios                                |

---

## 🧠 AI Workflow

```
Employee Request → AI Classification → Department Detection
→ MongoDB Policy Lookup → AI Decision → Auto Resolve / Escalate
→ Save to MongoDB → Show on Dashboard
```

---

## 📁 Project Structure

```
OpsPilot/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT middleware
│   ├── models/               # User, Request, Policy schemas
│   ├── routes/               # auth, requests, admin routes
│   ├── services/aiService.js # Gemini AI analysis
│   ├── seed.js               # Demo policy seeder
│   ├── server.js             # Express entry point
│   └── .env                  # Environment variables
└── frontend/
    └── src/
        ├── api/axios.js      # Axios instance
        ├── context/          # Auth context
        ├── components/       # Sidebar, StatCard, RequestCard, AIAnalysisPanel
        └── pages/            # Login, Register, Dashboard, NewRequest, etc.
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd OpsPilot
```

### 2. Configure Backend Environment

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aionos-opspilot
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Important:** Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Seed the Database (Demo Policies)

```bash
npm run seed
```

This adds 7 demo policies across HR, IT, and Finance departments.

### 5. Start the Backend Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 6. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 7. Start the Frontend Dev Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 👤 Demo Accounts

Register new accounts via the UI. During registration, you can choose:

| Role     | Access |
|----------|--------|
| Employee | Dashboard, New Request, Request History, Request Detail |
| Admin    | All of the above + Admin Dashboard (view & update all requests) |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Description    | Auth |
|--------|----------------------|----------------|------|
| POST   | `/api/auth/register` | Register user  | ❌   |
| POST   | `/api/auth/login`    | Login user     | ❌   |
| GET    | `/api/auth/me`       | Get current user| ✅  |

### Requests
| Method | Endpoint                 | Description              | Auth  |
|--------|--------------------------|--------------------------|-------|
| POST   | `/api/requests`          | Submit + AI-analyze      | ✅    |
| GET    | `/api/requests`          | Get user's requests      | ✅    |
| GET    | `/api/requests/stats`    | Dashboard stats          | ✅    |
| GET    | `/api/requests/:id`      | Get request detail       | ✅    |

### Admin
| Method | Endpoint                          | Description          | Auth  |
|--------|-----------------------------------|----------------------|-------|
| GET    | `/api/admin/requests`             | All requests         | Admin |
| GET    | `/api/admin/stats`                | Platform stats       | Admin |
| PATCH  | `/api/admin/requests/:id/status`  | Update status        | Admin |

---

## 💡 Example Requests to Try

**Finance (likely Human Review):**
> "I need reimbursement for ₹12,000 hotel expenses from my client visit to Mumbai."

**IT (likely Auto Resolve):**
> "My VPN is not working since this morning. I cannot connect to the company network."

**HR (depends on days):**
> "I would like to work from home for 3 consecutive days next week due to home renovation."

---

## 🎨 Features

- ✅ JWT Authentication (login/register)
- ✅ 2-step Gemini AI analysis (classify → decide)
- ✅ MongoDB policy lookup per department
- ✅ Auto-resolve vs Human Review decision
- ✅ Employee dashboard with stats
- ✅ Request history with search/filter
- ✅ Full AI analysis view with workflow timeline
- ✅ Admin dashboard with status management
- ✅ Dark SaaS glassmorphism design
- ✅ Responsive layout with animated components

---

## 🔐 Security Notes

- Gemini API key is **backend-only** (never exposed to frontend)
- Passwords are hashed with **bcrypt** (salt rounds: 10)
- All protected routes require **Bearer JWT token**
- Admin routes have an additional **role check**
