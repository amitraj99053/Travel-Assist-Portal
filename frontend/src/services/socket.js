import io from 'socket.io-client';

let socket = null;

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinTracking = (bookingId) => {
  const sock = getSocket();
  sock.emit('join-tracking', bookingId);
};

export const sendLocationUpdate = (bookingId, latitude, longitude) => {
  const sock = getSocket();
  sock.emit('location-update', { bookingId, latitude, longitude });
};

export const joinChat = (conversationId) => {
  const sock = getSocket();
  sock.emit('join-chat', conversationId);
};

export const sendMessage = (conversationId, message) => {
  const sock = getSocket();
  sock.emit('send-message', { conversationId, message });
};

export const onMechanicLocation = (callback) => {
  const sock = getSocket();
  sock.on('mechanic-location', callback);
};

export const onNewMessage = (callback) => {
  const sock = getSocket();
  sock.on('new-message', callback);
};
