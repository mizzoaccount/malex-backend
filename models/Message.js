/*const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation',
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Message', MessageSchema);*/

// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation',
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update conversation's lastMessage when a new message is saved
MessageSchema.post('save', async function(doc) {
  try {
    await mongoose.model('Conversation').findByIdAndUpdate(
      doc.conversationId,
      { 
        $push: { messages: doc._id },
        $set: { 
          lastMessage: doc._id,
          updatedAt: new Date() 
        }
      }
    );
  } catch (err) {
    console.error('Error updating conversation:', err);
  }
});

module.exports = mongoose.model('Message', MessageSchema);