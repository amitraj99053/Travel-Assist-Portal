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

## 📁 Project Structure

```
Travel-Assist-Portal/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls & socket
│   │   ├── context/            # State management (Zustand)
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
│   │   ├── config/             # Database, environment
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
# MONGODB_URI=your_mongodb_url
# JWT_SECRET=your_secret_key
# GOOGLE_MAPS_API_KEY=your_api_key
# WEATHER_API_KEY=your_api_key

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

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/register-mechanic` - Register mechanic
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Service Endpoints
- `POST /api/services` - Create service request
- `GET /api/services/nearby-mechanics` - Get nearby mechanics
- `GET /api/services/my-requests` - Get user's requests
- `PUT /api/services/:id/cancel` - Cancel request

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/payment` - Process payment

### Mechanic Endpoints
- `GET /api/mechanics/dashboard` - Get mechanic dashboard
- `PUT /api/mechanics/availability` - Toggle availability
- `GET /api/mechanics/bookings` - Get mechanic's bookings

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/mechanics/pending` - Pending mechanics
- `PUT /api/admin/mechanic/:id/verify` - Verify mechanic

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for complete API documentation.

## 🎯 Core Functionalities

| Feature | Status | Details |
|---------|--------|---------|
| User Registration | ✅ | Email & phone validation |
| Mechanic Registration | ✅ | License & skills verification |
| Service Requests | ✅ | Location-based matching |
| Mechanic Finder | ✅ | Distance-based filtering |
| Live Tracking | ✅ | Real-time location via Socket.io |
| Chat System | ✅ | Socket.io based messaging |
| Booking System | ✅ | Date & time scheduling |
| Payment Processing | ✅ | Dummy gateway (extensible) |
| Review System | ✅ | 5-star rating with comments |
| SOS Alerts | ✅ | Emergency location sharing |
| Admin Panel | ✅ | Mechanic verification |
| Notifications | ✅ | In-app notifications |

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-assist-portal
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_google_maps_key
WEATHER_API_KEY=your_weather_api_key
JWT_EXPIRE=7d
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📈 Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Email notifications
- [ ] Video call integration (Agora SDK)
- [ ] Insurance integration
- [ ] Multi-language support
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics
- [ ] AI-based mechanic matching
- [ ] Subscription plans
- [ ] Integration with payment gateways (Razorpay, Stripe)

## 🐛 Known Issues & Limitations

- Weather API requires internet connectivity
- Google Maps API calls are rate-limited
- Real-time features work best on stable internet
- Mobile app version not included

## 📝 License

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

**Last Updated:** December 2, 2025 | **Version:** 1.0.0
