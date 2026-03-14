# Deployment Architecture - E-Commerce Project

## 🏗️ Architecture Overview

This project follows a **Decoupled Client-Server Architecture**:

1.  **Backend (API Server):**
    *   **Hosted on:** [Render](https://render.com)
    *   **URL:** `https://e-commerce-project-2-i5rf.onrender.com/api`
    *   **Role:** Handles database connections (MongoDB), Authentication (JWT), and Business Logic.
    *   **Environment Variables Needed:**
        *   `MONGODB_URI`: Connection string for MongoDB Atlas.
        *   `JWT_SECRET`: Secret key for signing tokens.
        *   `CLIENT_URL`: URL of your deployed frontend (to handle CORS).

2.  **Frontend (React Client):**
    *   **Hosted on:** [Vercel](https://vercel.com)
    *   **Role:** User interface, state management, and calling the API.
    *   **API Configuration:** Found in `client/src/utils/api.js`. It now uses a relative path `/api` in production, which means it will automatically talk to your Vercel backend. If you prefer to use your Render backend instead, you can set the `REACT_APP_API_URL` environment variable in Vercel to your Render URL.

---

## ❓ Why do we need to deploy the backend?

A common question is: *"Can my live website talk to the server on my computer (localhost)?"* 

**The answer is NO.**

- **The Browser Sandbox:** When a user visits your website, your React code runs **inside their browser**.
- **No Path to Localhost:** The user's browser has no way to reach your personal computer's `localhost:5000`.
- **Public Accessibility:** The backend must be deployed to a **public server** (like Render) so that any browser in the world can send requests to it.
- **Security:** You cannot keep your database password in the frontend. The backend acts as a "Gatekeeper" that safely talks to the database without exposing secrets.

---

## 🛠️ Testing the Connection

To verify the system is working, you can check these production endpoints:

- **Health Check:** [https://e-commerce-project-2-i5rf.onrender.com/api/health](https://e-commerce-project-2-i5rf.onrender.com/api/health)
- **Categories:** [https://e-commerce-project-2-i5rf.onrender.com/api/categories](https://e-commerce-project-2-i5rf.onrender.com/api/categories)
- **Products:** [https://e-commerce-project-2-i5rf.onrender.com/api/products](https://e-commerce-project-2-i5rf.onrender.com/api/products)

---

## 🔐 Persistent Authentication Checklist

If login/signup "breaks" after a restart, check these 3 things:

1.  **JWT_SECRET must be permanent:**
    - Go to **Render Dashboard** -> **Environment**.
    - Ensure `JWT_SECRET` is set manually. 
    - *Why?* If you don't set it, your server might be using a random one that changes every time it restarts, which logs everyone out.

2.  **MONGODB_URI must be current:**
    - Ensure your MongoDB Atlas user has not expired and the IP whitelist includes `0.0.0.0/0` (standard for Render).

3.  **Server Hibernation:**
    - On Render's Free tier, the server "sleeps" after 15 minutes of inactivity.
    - If you see "Cannot reach the server" in React, just wait 30 seconds for the server to wake up and try again. I have added code to explain this to your users in the UI.

---

## 🚀 How to deploy updates

1.  **Backend:** Push your code to GitHub. Render is likely configured to "Auto-Deploy" whenever you push to your main branch.
2.  **Frontend:** Push your code to GitHub. Vercel will automatically build and deploy your React app.

> [!IMPORTANT]
> Always ensure your `MONGODB_URI` and `JWT_SECRET` are added to the **Environment Variables** section in the Render/Vercel dashboard, NOT just in your local `.env` file.
