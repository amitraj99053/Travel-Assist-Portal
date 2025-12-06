# 🚗 Travel Assist Portal

A comprehensive web application providing real-time travel assistance, mechanic finder, emergency SOS, communication, booking, and payment system with admin and mechanic dashboards.

## ✨ Features

### 👤 User Features
- **User & Mechanic Registration** with JWT authentication
- **Real-time Mechanic Finder** based on location and skills
- **Service Request Management** with GPS integration
- **Live Chat** with mechanics via Socket.io
- **Payment Processing** with UPI/Card support
- **Review & Rating System** for mechanics
- **Emergency SOS Alerts** with live location sharing
- **Booking Management** and history

### 🔧 Mechanic Features
- **Mechanic Registration & Verification** by admin
- **Availability Toggle** and job management
- **Daily Job Dashboard** with earnings tracking
- **Live Route Tracking** for customers
- **Rating & Review Management**
- **Service History** and performance analytics

### 👨‍💼 Admin Features
- **Mechanic Verification Panel** for approvals
- **User & Mechanic Management**
- **Analytics Dashboard** with system statistics
- **Booking & Payment Monitoring**
- **Report Generation**

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS, Socket.io |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT + bcryptjs |
| **External APIs** | Google Maps, OpenWeatherMap |
| **Real-time** | Socket.io for live tracking & chat |
| **Storage** | Cloudinary (Images), MongoDB Atlas (Data) |

## 📁 Project Structure

```
Travel-Assist-Portal/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls & socket
│   │   ├── context/            # State management (Zustand)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Helper functions
│   │   ├── assets/             # Images, icons
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/                     # Express.js server
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, error handling
│   │   ├── utils/              # Helpers (JWT, validators)
│   │   ├── config/             # Database, Cloudinary, environment
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── database/                    # Database schemas & seeds
│   └── seedData.js
│
└── docs/                        # Documentation
    └── SETUP_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/amitraj99053/Travel-Assist-Portal.git
cd Travel-Assist-Portal
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# PORT=5000
# MONGODB_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

npm start
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:3000`

## ☁️ Cloud Deployment

This project is designed to be deployed on free cloud tiers:

1.  **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) (Free Cluster)
2.  **File Storage**: [Cloudinary](https://cloudinary.com/) (Free Tier)
3.  **Backend**: [Render](https://render.com/) (Web Service)
4.  **Frontend**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)

## 📊 Database Schema

### Collections
- **Users** - All user accounts (user, mechanic, admin)
- **Mechanics** - Extended profile for mechanics
- **ServiceRequests** - Service requests from users
- **Bookings** - Booking records
- **Payments** - Payment transactions with invoices
- **Reviews** - User reviews for mechanics
- **Chat** - Real-time messages
- **Notifications** - In-app notifications
- **SOS** - Emergency alerts
- **Locations** - Location tracking history

## 🔐 Authentication

- **JWT Token-based** authentication
- **Bcryptjs** password hashing
- **Role-based Access Control** (User, Mechanic, Admin)
- **Token Expiration** - 7 days (configurable)

## 📡 Real-time Features

### Socket.io Events

**Tracking:**
- `join-tracking` - Join tracking room for a booking
- `location-update` - Send mechanic's current location
- `mechanic-location` - Receive mechanic location updates

**Chat:**
- `join-chat` - Join chat conversation
- `send-message` - Send message
- `new-message` - Receive new message

## 💳 Payment System

- **Dummy Payment Gateway** (ready for Razorpay/Stripe integration)
- **Invoice Generation** with unique numbers
- **Transaction Tracking** with status
- **Payment History** for users and mechanics

## 📍 Location Features

- **GPS-based Mechanic Finder** using Haversine formula
- **Distance Calculation** via Google Maps API
- **Live Route Tracking** for service mechanics
- **SOS Location Sharing** with emergency contacts

## 🌤 Weather Integration

- **Real-time Weather Data** from OpenWeatherMap
- **Weather-aware** service recommendations
- **Displayed in Dashboard** for user awareness

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Works on** desktop, tablet, and mobile devices
- **Touch-friendly** interface and buttons

## 🧪 Test Credentials

```
User Account:
  Email: user@example.com
  Password: password123

Mechanic Account:
  Email: mechanic1@example.com
  Password: password123

Admin Account:
  Email: admin@example.com
  Password: password123
```

##  License

MIT License - See LICENSE file for details

## 👥 Contributors

- **Amit Raj** - Project Lead

## 📧 Contact & Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/amitraj99053/Travel-Assist-Portal/issues)
- Email: support@travelassist.com

---

## 🙏 Acknowledgments

- React.js community
- Express.js framework
- MongoDB documentation
- Socket.io for real-time features
- Tailwind CSS for styling

---

**Made with ❤️ for travelers and mechanics**

**Last Updated:** December 6, 2025 | **Version:** 1.1.0
