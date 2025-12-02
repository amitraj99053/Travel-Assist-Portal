# Travel Assist Portal - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Architecture](#architecture)
10. [Testing](#testing)
11. [Deployment](#deployment)

## Project Overview

Travel Assist Portal is a comprehensive web application that provides:
- **Real-time travel assistance** with GPS tracking
- **Mechanic finder** with ratings and availability
- **Emergency SOS alerts** with live location sharing
- **Instant communication** via socket.io
- **Service booking & payment** system
- **Admin panel** for mechanics verification
- **Mechanic dashboard** with job management

## Tech Stack

### Frontend
- **React 18.2** - UI framework
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **Leaflet** - Maps integration

### Backend
- **Node.js + Express** - Server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time features

### External APIs
- **Google Maps API** - Distance & location
- **OpenWeatherMap API** - Weather data
- **Twilio** (Optional) - SMS notifications

## Prerequisites

Ensure you have installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Git

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/amitraj99053/Travel-Assist-Portal.git
cd Travel-Assist-Portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Configuration

### Backend Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-assist-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_openweather_api_key
JWT_EXPIRE=7d
```

### Frontend Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Get API Keys

1. **Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create project and enable Maps API
   - Generate API key

2. **OpenWeatherMap API**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up and get free API key

3. **MongoDB**
   - Local: Install MongoDB locally
   - Cloud: Use MongoDB Atlas (free tier available)

## Running the Application

### Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Start Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  address: object
}
Response: { user, token }
```

#### Register Mechanic
```
POST /api/auth/register-mechanic
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  licenseNumber: string,
  licenseExpiry: date,
  skills: array,
  yearsOfExperience: number,
  shopName: string,
  shopAddress: string
}
Response: { user, token }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user }
```

### Service Request Endpoints

#### Create Service Request
```
POST /api/services
Headers: Authorization: Bearer {token}
Body: {
  title: string,
  description: string,
  issueType: enum['breakdown', 'accident', 'maintenance', 'repair', 'emergency'],
  vehicleInfo: object,
  location: { latitude, longitude, address },
  priority: enum['low', 'medium', 'high', 'critical']
}
```

#### Get Nearby Mechanics
```
GET /api/services/nearby-mechanics?latitude=28.7&longitude=77.1&maxDistance=10&skillRequired=engine
Headers: Authorization: Bearer {token}
Response: { mechanics: array }
```

#### Get User Service Requests
```
GET /api/services/my-requests
Headers: Authorization: Bearer {token}
```

### Booking & Payment Endpoints

#### Create Booking
```
POST /api/bookings
Headers: Authorization: Bearer {token}
Body: {
  mechanicId: string,
  bookingDate: date,
  duration: number,
  totalCost: number,
  serviceDescription: string,
  location: object
}
```

#### Process Payment
```
POST /api/bookings/payment
Headers: Authorization: Bearer {token}
Body: {
  bookingId: string,
  paymentMethod: enum['upi', 'card', 'wallet', 'cash'],
  amount: number
}
Response: { invoiceNumber, transactionId, totalAmount }
```

### Mechanic Endpoints

#### Get Mechanic Dashboard
```
GET /api/mechanics/dashboard
Headers: Authorization: Bearer {token}
Role: mechanic
```

#### Update Availability
```
PUT /api/mechanics/availability
Headers: Authorization: Bearer {token}
Body: { isAvailable: boolean }
```

#### Accept Service Request
```
PUT /api/mechanics/request/:requestId/accept
Headers: Authorization: Bearer {token}
Role: mechanic
```

### Review Endpoints

#### Submit Review
```
POST /api/reviews
Headers: Authorization: Bearer {token}
Body: {
  mechanicId: string,
  bookingId: string,
  rating: number(1-5),
  title: string,
  comment: string
}
```

#### Get Mechanic Reviews
```
GET /api/reviews/mechanic/:mechanicId
Headers: Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Admin Dashboard
```
GET /api/admin/dashboard
Headers: Authorization: Bearer {token}
Role: admin
```

#### Get Pending Mechanics
```
GET /api/admin/mechanics/pending
Headers: Authorization: Bearer {token}
Role: admin
```

#### Verify Mechanic
```
PUT /api/admin/mechanic/:mechanicId/verify
Headers: Authorization: Bearer {token}
Role: admin
```

## Database Schema

### User Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: String (user/mechanic/admin),
  profilePicture: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: Point,
    coordinates: [longitude, latitude]
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Mechanic Collection
```javascript
{
  userId: ObjectId (ref: User),
  licenseNumber: String (unique),
  licenseExpiry: Date,
  skills: [String],
  certifications: [String],
  yearsOfExperience: Number,
  shopName: String,
  shopAddress: String,
  isVerified: Boolean,
  verifiedAt: Date,
  isAvailable: Boolean,
  totalRating: Number,
  totalReviews: Number,
  totalJobs: Number,
  totalEarnings: Number,
  serviceRadius: Number,
  bankAccount: {
    holderName: String,
    accountNumber: String,
    ifscCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceRequest Collection
```javascript
{
  userId: ObjectId (ref: User),
  mechanicId: ObjectId (ref: Mechanic),
  title: String,
  description: String,
  issueType: String,
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    registrationNumber: String,
    color: String
  },
  location: {
    type: Point,
    coordinates: [longitude, latitude],
    address: String
  },
  estimatedCost: Number,
  status: String,
  priority: String,
  createdAt: Date,
  acceptedAt: Date,
  completedAt: Date
}
```

### Booking Collection
```javascript
{
  userId: ObjectId (ref: User),
  mechanicId: ObjectId (ref: Mechanic),
  serviceRequestId: ObjectId (ref: ServiceRequest),
  bookingDate: Date,
  duration: Number,
  totalCost: Number,
  status: String,
  paymentStatus: String,
  location: {
    address: String,
    coordinates: [longitude, latitude]
  },
  createdAt: Date
}
```

### Payment Collection
```javascript
{
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  mechanicId: ObjectId (ref: Mechanic),
  amount: Number,
  tax: Number,
  totalAmount: Number,
  paymentMethod: String,
  transactionId: String,
  status: String,
  invoiceNumber: String,
  receiptUrl: String,
  createdAt: Date,
  completedAt: Date
}
```

### Review Collection
```javascript
{
  userId: ObjectId (ref: User),
  mechanicId: ObjectId (ref: Mechanic),
  bookingId: ObjectId (ref: Booking),
  rating: Number,
  title: String,
  comment: String,
  images: [String],
  verified: Boolean,
  createdAt: Date
}
```

### Chat Collection
```javascript
{
  conversationId: String,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  bookingId: ObjectId (ref: Booking),
  message: String,
  attachments: [String],
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### SOS Collection
```javascript
{
  userId: ObjectId (ref: User),
  location: {
    type: Point,
    coordinates: [longitude, latitude],
    address: String
  },
  emergencyType: String,
  description: String,
  contacts: [{
    name: String,
    phone: String,
    email: String
  }],
  status: String,
  liveLocationLink: String,
  respondedBy: ObjectId (ref: User),
  respondedAt: Date,
  createdAt: Date
}
```

## Architecture

### System Architecture
```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP/REST + WebSocket
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
└────────┬────────┘
         │
         │ Mongoose ODM
         │
┌────────▼────────┐
│   MongoDB       │
│   (Database)    │
└─────────────────┘

External APIs:
- Google Maps (Distance Calculation)
- OpenWeatherMap (Weather Data)
```

### Data Flow

1. **Authentication Flow**
   - User registers/logs in
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage and zustand store
   - All subsequent requests include token in Authorization header

2. **Service Request Flow**
   - User creates service request with location
   - Backend calculates distance to mechanics
   - Returns nearby available mechanics
   - User selects mechanic
   - Notification sent to mechanic via Socket.io

3. **Real-time Tracking Flow**
   - Mechanic joins tracking room via Socket.io
   - Location updates emitted periodically
   - User receives real-time location updates
   - Chat messages also sent via Socket.io

## Testing

### Test Sample Credentials

**Regular User**
```
Email: user@example.com
Password: password123
```

**Mechanic User**
```
Email: mechanic1@example.com
Password: password123
```

**Admin User**
```
Email: admin@example.com
Password: password123
```

### Running Tests
```bash
cd backend
npm test

cd ../frontend
npm test
```

## Deployment

### Deploy Backend to Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Deploy Frontend to Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

### Environment Variables for Production
Ensure these are set in deployment platform:
- MONGODB_URI (Atlas connection)
- JWT_SECRET (strong key)
- GOOGLE_MAPS_API_KEY
- WEATHER_API_KEY
- NODE_ENV=production

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in .env
- Ensure IP is whitelisted (for Atlas)

### API Key Issues
- Verify keys are correctly added to .env
- Check API quotas/limits
- Ensure APIs are enabled in respective consoles

### Socket.io Connection Issues
- Check CORS settings
- Verify backend is running
- Check network connectivity

## Support & Contributing

For issues or contributions, please:
1. Create an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## License

MIT License - See LICENSE file for details

---

**Last Updated:** December 2, 2025
**Version:** 1.0.0
