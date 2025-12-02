const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/response');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, bookingId, message } = req.body;

    if (!receiverId || !message) {
      return errorResponse(res, 400, 'Please provide receiver and message');
    }

    const conversationId = [req.user._id, receiverId].sort().join('-');

    const chat = await Chat.create({
      conversationId,
      senderId: req.user._id,
      receiverId,
      bookingId,
      message,
      createdAt: new Date(),
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      title: 'New Message',
      message: `${req.user.firstName} sent you a message`,
      notificationType: 'chat',
      relatedId: chat._id,
      relatedModel: 'Chat',
    });

    successResponse(res, 201, 'Message sent', {
      id: chat._id,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to send message: ' + error.message);
  }
};

// Get conversation
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const conversationId = [req.user._id, userId].sort().join('-');

    const messages = await Chat.find({ conversationId })
      .populate('senderId', 'firstName lastName profilePicture')
      .populate('receiverId', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Mark as read
    await Chat.updateMany(
      {
        conversationId,
        receiverId: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    successResponse(res, 200, 'Conversation fetched', {
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch conversation: ' + error.message);
  }
};

// Get conversations list
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
      { $limit: 50 },
    ]);

    // Populate user details
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const message = conv.lastMessage;
        const otherUserId =
          message.senderId.toString() === req.user._id.toString()
            ? message.receiverId
            : message.senderId;

        const otherUser = await Chat.findOne({}).populate('senderId');

        return {
          conversationId: conv._id,
          lastMessage: message.message,
          timestamp: message.createdAt,
          isRead: message.isRead,
        };
      })
    );

    successResponse(res, 200, 'Conversations fetched', result);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch conversations: ' + error.message);
  }
};
