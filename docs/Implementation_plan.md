# Run Project Plan

## Goal
Get the Travel Assist Portal (Frontend and Backend) running locally.

## User Review Required
> [!IMPORTANT]
> **MongoDB**: A local MongoDB instance running on `mongodb://localhost:27017` is required by default.
> **API Keys**: `GOOGLE_MAPS_API_KEY` and `WEATHER_API_KEY` in `backend/.env` are placeholders. Features relying on them will not work until valid keys are provided.

## Proposed Steps

### Backend
1.  Install dependencies: `npm install`
2.  Verify `.env` configuration.
3.  Start server: `npm run dev`

### Frontend
1.  Install dependencies: `npm install`
2.  Verify `.env` configuration.
3.  Start application: `npm start`

## Verification Plan
### Automated Tests
-   Run `npm test` in backend (if available and relevant).

### Manual Verification
-   **Backend**: Check console for "Server running on port 5000" and "MongoDB Connected".
-   **Frontend**: Open `http://localhost:3000` and verify the landing page loads.
-   **Integration**: Try to log in or register to verify backend connection.
