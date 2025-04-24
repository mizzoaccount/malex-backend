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

      // socket.js
        /*socket.on('sendMessage', async (message) => {
            try {
            console.log('Received message to save:', message);
            
            // 1. First save the message to database
            const savedMessage = await Message.create({
                conversationId: message.conversationId,
                sender: message.sender,
                content: message.content,
                readBy: [message.sender] // Mark as read by sender
            });
            
            // 2. Populate the sender info
            const populatedMessage = await savedMessage.populate('sender', 'username avatar');
            
            console.log('Message saved and populated:', populatedMessage);
            
            // 3. Emit the complete message object
            io.to(message.conversationId).emit('receiveMessage', {
                _id: populatedMessage._id,
                conversationId: populatedMessage.conversationId,
                sender: {
                _id: populatedMessage.sender._id,
                username: populatedMessage.sender.username,
                avatar: populatedMessage.sender.avatar
                },
                content: populatedMessage.content,
                readBy: populatedMessage.readBy,
                createdAt: populatedMessage.createdAt
            });
            
            // 4. Notify recipient
            io.to(message.recipientId).emit('newMessageNotification', {
                conversationId: message.conversationId,
                sender: message.sender,
                preview: message.content.substring(0, 30)
            });
            
            } catch (err) {
            console.error('Error sending message:', err);
            }
        });
  
      // Send and receive messages
      socket.on('sendMessage', async (message) => {
        try {
          // Save message to DB (you'd call your message service here)
          // const savedMessage = await Message.create(message);
          
          // Emit to conversation room
          io.to(message.conversationId).emit('receiveMessage', message);
          
          // Notify recipient if they're not in the conversation
          io.to(message.recipientId).emit('newMessageNotification', {
            conversationId: message.conversationId,
            sender: message.sender,
            preview: message.content.substring(0, 30)
          });
        } catch (err) {
          console.error('Error sending message:', err);
        }
      });*/
  
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