# Sports Buzz - School Sports Management Platform

Sports Buzz is a comprehensive SaaS platform designed to manage inter-school sports competitions, athlete profiles, rankings, and team logistics. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

*   **Role-Based Access Control (RBAC):** Distinct portals for Admins, Schools, Referees, and Students.
*   **School Management:** Manage profiles, facilities, and campus details.
*   **Athlete Rosters:** Track student details, medical status, and participation.
*   **Tournament Engine:** Create leagues, generating fixtures, and track standings.
*   **Live Scoring:** Referees can input scores with verification status.
*   **Analytics:** Visual dashboards for participation stats and revenue.

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS, Recharts
*   **Backend:** Node.js, Express, MongoDB, Mongoose
*   **Authentication:** JWT, bcryptjs
*   **Build Tool:** Vite

## 📋 Prerequisites

Ensure you have the following installed on your local machine:
*   **Node.js** (v16 or higher)
*   **npm** (Node Package Manager)
*   **MongoDB** (running locally or a cloud URI)

## 💻 Installation & Running Locally

1.  **Clone or Download** this repository to your local machine.

2.  **Install Dependencies**:
    Open your terminal in the project root directory and run:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (or use the provided defaults in `server/config/db.ts`):
    ```env
    MONGODB_URI=mongodb://localhost:27017/sportsbuzz
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=90d
    PORT=3000
    ```

4.  **Seed the Database**:
    Run the seed script to create demo accounts:
    ```bash
    npm run seed
    ```

5.  **Start the Development Server**:
    This starts both the backend server and the frontend (via Vite middleware).
    ```bash
    npm run dev
    ```

6.  **Open the App**:
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```
├── components/          # Reusable UI components
├── context/             # React Context (Auth)
├── pages/               # Page components by role
├── server/              # Backend API (Controllers, Models, Routes)
├── services/            # API services (Axios)
├── types.ts             # TypeScript interfaces
└── App.tsx              # Main routing logic
```

## 🔑 Demo Credentials

You can use the "Quick Login" buttons on the login page, or use these credentials:

*   **Admin:** `admin@sportsbuzz.com` / `password123`
*   **School:** `school@springfield.edu` / `password123`
*   **Referee:** `referee@sportsbuzz.com` / `password123`
*   **Student:** `student@springfield.edu` / `password123`

---
*Generated for Client Demo*
