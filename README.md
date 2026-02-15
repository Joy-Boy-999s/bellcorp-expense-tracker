# BellCorp Expense Tracker

A production-ready Personal Expense Tracker built with the MERN stack in a Monorepo architecture.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Recharts, Axios, React Router.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **Tools:** Concurrently, Nodemon.

## Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas URI)

## Setup & Run Locally

1. **Install Dependencies**
   Run this from the root directory to install dependencies for root, server, and client.
   ```bash
   npm run install-all
   ```
   *Note: If `install-all` script fails or is not present, run `npm install` in root, `server`, and `client` folders individually.*

2. **Environment Variables**
   Create a `.env` file in `server/` with the following:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bellcorp-expense-tracker
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the App**
   Start both Backend and Frontend concurrently:
   ```bash
   npm start
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Features

- **Authentication:** Register and Login with JWT.
- **Dashboard:** View total expenses, category breakdown, and recent transactions.
- **Transactions Explorer:** Filter by date, amount, category, and search text. Pagination included.
- **Management:** Add, Edit, and Delete transactions.

## Deployment Guide

### Backend (Render/Heroku/Railway)
1. Push the `server` folder or the whole monorepo (configured for root directory deployment).
2. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) in the hosting dashboard.
3. Build Command: `npm install`
4. Start Command: `npm start`

### Frontend (Vercel/Netlify)
1. Push the `client` folder or point the Vercel project to `client` root.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. **Important:** Configure rewrites or proxy in `vite.config.js` if necessary, or just use the deployed backend URL in `axios.js`.
   - Update `client/src/api/axios.js` `baseURL` to point to your production backend URL.

### MongoDB Atlas
1. Create a cluster.
2. Whitelist your IP (or 0.0.0.0/0 for anywhere).
3. Get the connection string and use it as `MONGO_URI`.
