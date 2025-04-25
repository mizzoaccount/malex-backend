/*const Message = require('./models/Message'); 
const Conversation = require('./models/Conversation');

module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
  
      // Join user to their own room for private messaging
      socket.on('joinUser', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });
  
      // Join conversation room
      socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation ${conversationId}`);
      });

      // socket.js
socket.on('sendMessage', async (message) => {
    try {
      // 1. Save message to DB
      const savedMessage = await Message.create({
        conversationId: message.conversationId,
        sender: message.sender,
        content: message.content,
        readBy: [message.sender]
      });
  
      // 2. Update conversation's messages array
      await Conversation.findByIdAndUpdate(
        message.conversationId,
        { 
          $push: { messages: savedMessage._id },
          $set: { updatedAt: new Date() }
        }
      );
  
      // 3. Populate sender info
      const populated = await savedMessage.populate('sender', 'username avatar');
  
      // 4. Emit to conversation room
      io.to(message.conversationId).emit('receiveMessage', {
        ...populated.toObject(),
        sender: {
          _id: populated.sender._id,
          username: populated.sender.username,
          avatar: populated.sender.avatar
        }
      });
  
      // 5. Notify recipient
      io.to(message.recipientId).emit('newMessageNotification', {
        conversationId: message.conversationId,
        sender: message.sender,
        preview: message.content.substring(0, 30)
      });
  
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });
  
      // Handle typing indicators
      socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('userTyping', {
          userId: data.userId,
          isTyping: data.isTyping
        });
      });
  
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  };*/
  // socket.js
const Message = require('./models/Message'); 
const Conversation = require('./models/Conversation');

module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
  
      // Join user to their own room for private messaging
      socket.on('joinUser', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });
  
      // Join conversation room
      socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation ${conversationId}`);
      });

      socket.on('sendMessage', async (message) => {
        try {
          // 1. Save message to DB
          const savedMessage = await Message.create({
            conversationId: message.conversationId,
            sender: message.sender,
            content: message.content,
            readBy: [message.sender]
          });
      
          // 2. Update conversation with lastMessage reference
          const updatedConversation = await Conversation.findByIdAndUpdate(
            message.conversationId,
            { 
              $push: { messages: savedMessage._id },
              $set: { 
                lastMessage: savedMessage._id,
                updatedAt: new Date() 
              }
            },
            { new: true } // Return the updated document
          ).populate('lastMessage');
      
          // 3. Populate sender info
          const populatedMessage = await savedMessage.populate('sender', 'username avatar');
      
          // 4. Emit to conversation room
          io.to(message.conversationId).emit('receiveMessage', {
            ...populatedMessage.toObject(),
            sender: {
              _id: populatedMessage.sender._id,
              username: populatedMessage.sender.username,
              avatar: populatedMessage.sender.avatar
            }
          });
      
          // 5. Emit conversation update to all participants
          updatedConversation.participants.forEach(participant => {
            const participantId = participant.userId.toString();
            if (participantId !== message.sender) {
              io.to(participantId).emit('conversationUpdated', updatedConversation);
            }
          });
      
          // 6. Notify recipient
          io.to(message.recipientId).emit('newMessageNotification', {
            conversationId: message.conversationId,
            sender: message.sender,
            preview: message.content.substring(0, 30),
            lastMessage: updatedConversation.lastMessage
          });
      
        } catch (err) {
          console.error('Error sending message:', err);
        }
      });
  
      // Handle typing indicators
      socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('userTyping', {
          userId: data.userId,
          isTyping: data.isTyping
        });
      });
  
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
};