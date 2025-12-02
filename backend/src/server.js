const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const sosRoutes = require('./routes/sosRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join room for live tracking
  socket.on('join-tracking', (bookingId) => {
    socket.join(`tracking-${bookingId}`);
    console.log(`User joined tracking for booking: ${bookingId}`);
  });

  // Send location update
  socket.on('location-update', (data) => {
    io.to(`tracking-${data.bookingId}`).emit('mechanic-location', data);
  });

  // Join chat room
  socket.on('join-chat', (conversationId) => {
    socket.join(`chat-${conversationId}`);
    console.log(`User joined chat: ${conversationId}`);
  });

  // Send message
  socket.on('send-message', (message) => {
    io.to(`chat-${message.conversationId}`).emit('new-message', message);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Assist Portal Backend is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
