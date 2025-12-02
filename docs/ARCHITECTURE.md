# Travel Assist Portal - Architecture & Design Documents

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend                                                  │
│  ├── Auth Pages (Login, Register)                               │
│  ├── User Dashboard (Mechanic Finder, Requests)                 │
│  ├── Mechanic Dashboard (Jobs, Earnings)                        │
│  ├── Admin Panel (Verification, Analytics)                      │
│  └── Chat & SOS Components                                      │
└──────────────────┬────────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   HTTP/REST             WebSocket
   (Axios)               (Socket.io)
        │                     │
        ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                               │
│  ├── Auth Routes (Register, Login, Profile)                     │
│  ├── Service Routes (Request, Nearby, Cancel)                   │
│  ├── Booking Routes (Create, Payment, Cancel)                   │
│  ├── Mechanic Routes (Dashboard, Accept, Complete)              │
│  ├── Review Routes (Submit, Get, Delete)                        │
│  ├── Chat Routes (Send, Get Conversation)                       │
│  ├── SOS Routes (Create, Resolve, Nearby)                       │
│  ├── Admin Routes (Verify, Dashboard, Users)                    │
│  └── Socket.io Events (Tracking, Chat, Notifications)           │
└──────────────────┬────────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    Mongoose              External
    (ODM)                 APIs
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────────┐
│   MongoDB    │  │  Google Maps API     │
│   Database   │  │  OpenWeatherMap API  │
└──────────────┘  └──────────────────────┘
```

## 2. Data Flow Diagram (DFD)

### Level 0 - Context Diagram
```
      ┌─────────────────┐
      │   External      │
      │   Systems       │
      │  (Maps, Weather)│
      └────────┬────────┘
               │
        ┌──────▼──────┐
        │ Travel      │
        │ Assist      │◄─────┐
        │ Portal      │      │
        └──────┬──────┘      │
               │             │
     ┌─────────┴─────────┐   │
     ▼                   ▼   │
┌─────────────┐    ┌──────────────┐
│   Users     │    │   Mechanics  │
│ & Customers │    │ & Admins     │
└─────────────┘    └──────────────┘
     ▲                   ▲
     └───────────────────┘
   (Request/Response)
```

### Level 1 - Main Processes
```
User Input
    │
    ├──► Authentication Process
    │    ├── Validate Credentials
    │    ├── Hash Password
    │    └── Generate JWT Token
    │
    ├──► Service Request Process
    │    ├── Get Location
    │    ├── Calculate Distance
    │    ├── Find Nearby Mechanics
    │    └── Send Notifications
    │
    ├──► Booking Process
    │    ├── Create Booking
    │    ├── Process Payment
    │    ├── Generate Invoice
    │    └── Update Status
    │
    ├──► Real-time Tracking
    │    ├── Receive Location Updates
    │    ├── Broadcast to Subscribers
    │    └── Update Map View
    │
    └──► Review & Rating
         ├── Validate Booking
         ├── Calculate Rating
         ├── Update Mechanic Stats
         └── Display Reviews
```

## 3. Entity Relationship Diagram (ERD)

```
    ┌──────────────┐
    │    USER      │
    └──────┬───────┘
           │1
      ┌────┴──────────────────────┐
      │                           │
      │1                      1   │
   ┌──▼──────┐          ┌────▼──────┐
   │MECHANIC │          │  LOCATION │
   └──┬──────┘          └────┬──────┘
      │1                     │N
      │              ┌───────┴──────┐
      │M             │              │
   ┌──▼─────────────▼──┐      ┌─────▼────┐
   │ SERVICE REQUEST   │      │   CHAT   │
   └──┬──────┬──────┬──┘      └────┬─────┘
      │1     │N     │N            │M
      │      │      │             │
   ┌──▼──┐  │  ┌────▼────┐   ┌───▼────┐
   │SOS  │  └─►│ BOOKING │   │NOTIF   │
   └─────┘     └─┬──┬─┬──┘   └────┬───┘
                 │  │ │           │
              ┌──▼──┐│ │      ┌─────▼─────┐
              │PAYMENT
              │     │ │      │ ADMIN LOG │
              └──────┘│      └───────────┘
                      │
                   ┌──▼──┐
                   │REVIEW
                   └─────┘
```

## 4. Class Diagram (Models)

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ _id: ObjectId    │
│ firstName        │
│ lastName         │
│ email            │
│ phone            │
│ password         │
│ role             │
│ location         │
│ isActive         │
├──────────────────┤
│ matchPassword()  │
│ getFullName()    │
└──────────────────┘
         △
         │
    ┌────┴─────────┐
    │              │
┌───┴────────┐ ┌──┴──────────┐
│  Mechanic  │ │   Customer  │
├────────────┤ └─────────────┘
│ skills[]   │
│ verified   │
│ available  │
│ rating     │
│ earnings   │
└────────────┘

┌──────────────────┐
│  ServiceRequest  │
├──────────────────┤
│ userId           │
│ mechanicId       │
│ title            │
│ description      │
│ location         │
│ status           │
│ priority         │
│ createdAt        │
└──────────────────┘

┌──────────────────┐
│    Booking       │
├──────────────────┤
│ userId           │
│ mechanicId       │
│ bookingDate      │
│ duration         │
│ totalCost        │
│ status           │
│ paymentStatus    │
└──────────────────┘

┌──────────────────┐
│    Payment       │
├──────────────────┤
│ bookingId        │
│ userId           │
│ amount           │
│ paymentMethod    │
│ transactionId    │
│ invoiceNumber    │
│ status           │
│ createdAt        │
└──────────────────┘

┌──────────────────┐
│     Review       │
├──────────────────┤
│ userId           │
│ mechanicId       │
│ bookingId        │
│ rating (1-5)     │
│ title            │
│ comment          │
│ createdAt        │
└──────────────────┘
```

## 5. Sequence Diagram - User Books Service

```
User         Frontend        Backend         Database        Mechanic
│              │               │                │               │
├─ Enter       │               │                │               │
│  Details     │               │                │               │
│              │               │                │               │
├──────────────► POST /services│                │               │
│              │               │                │               │
│              │      ┌────────► Validate       │               │
│              │      │        │                │               │
│              │      │        ├────────────────► Insert        │
│              │      │        │                  Request       │
│              │      │        ◄────────────────┤ Return ID    │
│              │      │        │                │               │
│              │      │  Find Nearby ◄─────────┤ Query         │
│              │      │  Mechanics              │               │
│              │      │        │         ┌──────────────────┐   │
│              │      │        │         │ Filter & Calculate   │
│              │      │        │         │ Distance            │
│              │      │        │         └──────┬───────────┘   │
│              │      │  Return │               │               │
│              │      │  Mechanics              │               │
│              ◄──────┤        │                │               │
│              │      │        │                │               │
├─ Select      │      │        │                │               │
│  Mechanic    │      │        │                │      Notify◄──┤
│              │      │        │      Emit Socket Event          │
│              │      │        │                │               │
│              ◄──────┤ Booking Created        │               │
│ Display      │      │        │                │               │
│ Confirmation │      │        │                │               │
│              │      │        │                │               │
```

## 6. Sequence Diagram - Real-time Tracking

```
User         Socket.io       Backend         Mechanic       Database
│               │               │               │               │
│ Load Booking  │               │               │               │
├──────────────► join-tracking  │               │               │
│               │ (bookingId)   │               │               │
│               │               │               │               │
│               │      Join Room & Notify      │               │
│               │               ├──────────────► accept signal  │
│               │               │               │               │
│               │               │      location-update          │
│               │               │◄──────────────┤ lat/lon       │
│               │               │               │               │
│        Update │◄──location────┤               │               │
│        Map    │ mechanic-location             │               │
│               │               │               │               │
│ End Service   │ service-complete              │               │
│               ├──────────────► Update Status ├──────────────┤
│               │               │               │  Update      │
│               │               │      ┌────────► Earnings    │
│               │               │      │        │               │
│ Refresh       │ Booking        │      │        │               │
│ Dashboard◄────┤ Updated◄───────┤      │        │               │
│               │               │      │        │               │
│               │      Leave Room        │        │               │
│               ├──────────────► disconnect    │               │
│               │               │               │               │
```

## 7. State Machine Diagram - Service Request States

```
        ┌──────────┐
        │ PENDING  │
        └────┬─────┘
             │ (Mechanic Accepts)
        ┌────▼────────┐
        │  ACCEPTED   │
        └────┬────────┘
             │ (Mechanic Departs)
        ┌────▼──────────┐
        │ ON_THE_WAY   │
        └────┬──────────┘
             │ (Mechanic Arrives)
        ┌────▼───────────┐
        │  IN_PROGRESS   │
        └────┬───────────┘
             │ (Service Complete)
        ┌────▼──────────┐
        │  COMPLETED    │
        └───────────────┘

Alternative:
        ┌──────────┐
        │ PENDING  │
        └────┬─────┘
             │ (User Cancels)
        ┌────▼─────────┐
        │  CANCELLED   │
        └──────────────┘
```

## 8. Use Case Diagram

```
                              ┌──────────────────────┐
                              │  Travel Assist       │
                              │  Portal System       │
                              └──────────────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
            ┌────▼────┐          ┌────▼────┐          ┌───▼────┐
            │  User   │          │ Mechanic │          │ Admin  │
            └────┬────┘          └────┬────┘          └───┬────┘
                 │                    │                   │
         ┌───────┼────────┐       ┌───┼────────┐      ┌──┼──────┐
         │       │        │       │   │        │      │  │      │
    ┌────▼┐ ┌────▼┐  ┌───▼┐ ┌────▼┐┌─▼─┐ ┌──▼─┐ ┌──▼┐┌─▼┐ ┌─▼──┐
    │Login│ │Search   │Book ├─┤Accept──┤Earn ├─┤View──┤Block│Verify│
    └────┘ │Mechanic │     │ └────┘    └────┘   └Users ├────┘└─────┘
           │         │     │           │            │
           │    ┌────┘     │           │       ┌─────┴──────┐
           │    │          │      ┌────▼┐      │            │
           │    │      ┌────┘      │Track     Report   Analytics
           │    │      │           │         │
        ┌──▼┐ ┌┴──┐ ┌──▼─┐  ┌─────┘      │
        │Pay │ │SOS │ │Rate │  Earnings   │
        └────┘ └────┘ └────┘           Metrics
```

## 9. API Gateway Architecture

```
┌─────────────────────────────────┐
│      Client Application         │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      API Request Router         │
├─────────────────────────────────┤
│  /api/auth         ─────────┐   │
│  /api/services     ─────────┤   │
│  /api/bookings     ─────────┤   │
│  /api/mechanics    ─────────┼──► Authentication Middleware
│  /api/reviews      ─────────┤   │ (JWT Verification)
│  /api/chat         ─────────┤   │
│  /api/sos          ─────────┤   │
│  /api/admin        ─────────┘   │
└──────────┬──────────────────────┘
           │
     ┌─────▼────────────┐
     │ Authorization    │
     │ Middleware       │
     └─────┬────────────┘
           │
     ┌─────▼────────────┐
     │ Controller Layer │
     │ (Business Logic) │
     └─────┬────────────┘
           │
     ┌─────▼────────────┐
     │ Mongoose Models  │
     │ (Data Access)    │
     └─────┬────────────┘
           │
     ┌─────▼────────────┐
     │   MongoDB        │
     │   Database       │
     └──────────────────┘
```

## 10. Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│              Production Environment                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐            ┌──────────────────┐ │
│  │  Vercel/       │            │   Heroku/AWS     │ │
│  │  Firebase      │◄─────────►│   EC2            │ │
│  │                │            │                  │ │
│  │  Frontend      │            │  Backend API     │ │
│  │  - React App   │            │  - Express.js    │ │
│  │  - Static      │            │  - Socket.io     │ │
│  │  - CDN         │            │  - Services      │ │
│  └────────────────┘            └────────┬─────────┘ │
│                                         │           │
│                                   ┌─────▼────────┐  │
│                                   │ MongoDB Atlas│  │
│                                   │              │  │
│                                   └──────────────┘  │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │      External Services                     │    │
│  │  - Google Maps API                         │    │
│  │  - OpenWeatherMap API                      │    │
│  │  - Twilio (SMS)                            │    │
│  │  - Stripe/Razorpay (Payments)             │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
└──────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0.0
**Last Updated:** December 2, 2025
