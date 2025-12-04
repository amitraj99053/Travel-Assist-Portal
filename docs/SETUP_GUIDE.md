# Travel Assist Portal - Setup Guide

This guide provides step-by-step instructions to set up and run the **Travel Assist Portal** project locally using Visual Studio Code (VS Code).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Node.js & npm**: Download and install from [nodejs.org](https://nodejs.org/). (Recommended: LTS version)
2.  **MongoDB**: Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
    *   Alternatively, you can use a cloud database like MongoDB Atlas.
3.  **Visual Studio Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
4.  **Git**: Download from [git-scm.com](https://git-scm.com/).

---

## Step 1: Open the Project

1.  Open **VS Code**.
2.  Go to **File** > **Open Folder...**
3.  Select the `Travel-Assist-Portal` folder.

---

## Step 2: Backend Setup

The backend runs on Node.js and Express.

1.  **Open a Terminal** in VS Code:
    *   Press `Ctrl + ~` (tilde) or go to **Terminal** > **New Terminal**.

2.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Configure Environment Variables**:
    *   Create a new file named `.env` inside the `backend` folder.
    *   Add the following configuration (adjust if necessary):

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/travel_assist_db
    JWT_SECRET=your_super_secret_key_change_this
    NODE_ENV=development
    ```
    *   *Note: If you are using MongoDB Atlas, replace `mongodb://localhost:27017...` with your connection string.*

5.  **Start the Backend Server**:
    ```bash
    npm run dev
    ```
    *   You should see: `Server running in development mode on port 5000` and `MongoDB Connected`.

---

## Step 3: Frontend Setup

The frontend is a React application.

1.  **Open a Second Terminal** (keep the backend running):
    *   Click the `+` icon in the terminal panel or split the terminal.

2.  **Navigate to the frontend folder**:
    ```bash
    cd frontend
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Configure Environment Variables**:
    *   Create a new file named `.env` inside the `frontend` folder.
    *   Add the following:

    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    REACT_APP_SOCKET_URL=http://localhost:5000
    ```

5.  **Start the Frontend Application**:
    ```bash
    npm start
    ```
    *   This will launch the application in your default browser at `http://localhost:3000`.

---

## Step 4: Verifying the Setup

1.  **Open Browser**: Go to [http://localhost:3000](http://localhost:3000).
2.  **Register a User**:
    *   Click "Register" and create a new user account.
3.  **Register a Mechanic** (in a separate browser/incognito window):
    *   Click "Register as Service Provider" and create a mechanic account.
4.  **Test Flow**:
    *   As a User, create a service request.
    *   As a Mechanic, accept the request.
    *   Verify that real-time updates work (socket connection).

---

## Common Commands

| Action | Command (Backend) | Command (Frontend) |
| :--- | :--- | :--- |
| **Install Deps** | `npm install` | `npm install` |
| **Start Dev** | `npm run dev` | `npm start` |
| **Run Tests** | `npm test` | `npm test` |
| **Linting** | `npm run lint` | `npm run lint` |

## Troubleshooting

*   **"MongoDB Connection Error"**: Ensure MongoDB service is running locally (`mongod`) or your Atlas URI is correct.
*   **"Address already in use"**: Check if another process is using port 5000 or 3000. Kill the process or change the PORT in `.env`.
*   **"Module not found"**: Run `npm install` again in the respective directory.

---

**Project Structure:**

*   `backend/`: Server-side code (Node.js, Express, Mongoose models, Controllers).
*   `frontend/`: Client-side code (React, Context API, Pages, Components).
*   `docs/`: Documentation files.
