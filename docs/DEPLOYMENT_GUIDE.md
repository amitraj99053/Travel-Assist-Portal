# 🚀 Deployment Guide

This guide covers the complete deployment process for the Travel Assist Portal.

## 1. Database Deployment (MongoDB Atlas)

MongoDB Atlas is a cloud database service. We will use it to host your data.

### Step 1: Create an Account
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up for a free account.

### Step 2: Create a Cluster
1.  After logging in, click **+ Create** to create a new cluster.
2.  Select the **M0 Sandbox** (Free Tier).
3.  Choose a provider (AWS) and a region close to you (e.g., `ap-south-1` for Mumbai if you are in India).
4.  Click **Create Deployment**.

### Step 3: Create a Database User
1.  You will be prompted to set up security.
2.  Create a **Username** and **Password**.
    *   **IMPORTANT:** Write these down! You will need them for the connection string.
    *   *Tip: Avoid special characters in the password if possible to prevent URL encoding issues.*
3.  Click **Create Database User**.

### Step 4: Whitelist IP Address (CRITICAL)
**Perform this on the [MongoDB Atlas Website](https://cloud.mongodb.com/):**

1.  In the **Network Access** tab on the left sidebar (under the "Security" section):
2.  Click **+ Add IP Address**.
3.  **For Local Testing:** Click **Add Current IP Address**.
4.  **For Cloud Deployment (Render/Vercel):** You **MUST** add `0.0.0.0/0` to the whitelist.
    *   Click **Allow Access from Anywhere** button if available.
    *   Or manually enter `0.0.0.0/0` in the IP Address field.
    *   *Reason: Cloud hosting services use dynamic IPs, so we need to allow all IPs.*
5.  Click **Confirm**.

### Step 5: Get Connection String
1.  Go to the **Database** tab in the left sidebar.
2.  Click **Connect** on your cluster.
3.  Select **Drivers**.
4.  You will see a connection string like:
    `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
5.  Copy this string.
6.  Replace `<password>` with the password you created in Step 3.

### Step 6: Verify Connection
1.  Open your project in VS Code.
2.  Create a file `backend/.env` if it doesn't exist (copy from `.env.example`).
3.  Update the `MONGODB_URI` variable:
    ```env
    MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.abcde.mongodb.net/travel-assist-portal?retryWrites=true&w=majority
    ```
4.  Run the verification script (created in the next step of this guide):
    ```bash
    node backend/scripts/test-atlas-connection.js
    ```

---

## 2. Backend Deployment (Render)

Render is a cloud platform that can host your Node.js backend.

1.  Push your code to GitHub.
2.  Go to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Settings:
    *   **Name:** `travel-assist-backend`
    *   **Root Directory:** `backend`
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
6.  **Environment Variables:**
    *   Add all variables from your `backend/.env` file.
    *   `MONGODB_URI`: (Your Atlas connection string)
    *   `JWT_SECRET`: (A long random string)
    *   `NODE_ENV`: `production`
    *   `GOOGLE_MAPS_API_KEY`: (Your Google Maps API Key)
    *   `WEATHER_API_KEY`: (Your Weather API Key)
7.  Click **Create Web Service**.
8.  Wait for the deployment to finish. You will get a URL like `https://travel-assist-backend.onrender.com`.

---

## 3. Frontend Deployment (Vercel)

Vercel is optimized for React/Next.js apps.

1.  Go to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Settings:
    *   **Framework Preset:** Create React App
    *   **Root Directory:** `frontend`
5.  **Environment Variables:**
    *   `REACT_APP_API_URL`: The URL of your backend from Step 2 (e.g., `https://travel-assist-backend.onrender.com/api`)
    *   `REACT_APP_SOCKET_URL`: The URL of your backend (e.g., `https://travel-assist-backend.onrender.com`)
6.  Click **Deploy**.
