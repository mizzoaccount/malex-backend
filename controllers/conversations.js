const Conversation = require('../models/Conversation');

/*exports.getConversations = async (req, res) => {
  try {
    console.log('[GET CONVERSATIONS] Request by user:', req.user.id);

    const conversations = await Conversation.find({
      'participants.userId': req.user.id
    })
    .populate('participants.userId', 'username avatar role isOnline')
    .populate({
      path: 'lastMessage',
      select: 'content sender createdAt' // Only populate necessary fields
    })
    .sort('-updatedAt');

    console.log(`[GET CONVERSATIONS] Found ${conversations.length} conversation(s) for user ${req.user.id}`);
    res.json(conversations);
  } catch (err) {
    console.error('[GET CONVERSATIONS] Error fetching conversations:', err.message);
    res.status(500).json({ message: 'Server error while fetching conversations.' });
  }
};*/

// controllers/conversationController.js
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.user.id
    })
    .populate('participants.userId', 'username avatar role isOnline')
    .populate({
      path: 'lastMessage',
      select: 'content sender createdAt'
    })
    .sort('-updatedAt');

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a single conversation by ID
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants.userId', 'username avatar role isOnline');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    } 

    // Optional: verify user is part of the conversation
    const isParticipant = conversation.participants.some(p =>
      p.userId._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { participantId, role = 'user' } = req.body;

    const newConversation = new Conversation({
      participants: [
        { userId: req.user.id, role: req.user.role },
        { userId: participantId, role }
      ]
    });

    const saved = await newConversation.save();
    const populated = await saved.populate('participants.userId', 'username avatar role isOnline');
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



  exports.getOrCreateConversation = async (req, res) => {
    try {
        const { participantId } = req.body;
        const currentUserId = req.user.id; // Use req.user.id

        console.log('[GET/CREATE CONVERSATION] Request by:', currentUserId);
        console.log('[GET/CREATE CONVERSATION] Looking for conversation with:', participantId);

        let conversation = await Conversation.findOne({
          'participants.userId': { $all: [currentUserId, participantId] }
        });
        

        if (conversation) {
            console.log('[GET/CREATE CONVERSATION] Conversation found:', conversation._id);
        } else {
            console.log('[GET/CREATE CONVERSATION] No conversation found, creating new one...');
            conversation = new Conversation({
                participants: [
                    { userId: currentUserId, role: req.user.role },
                    { userId: participantId, role: 'admin' } // Change if needed
                ]
            });
            await conversation.save();
            console.log('[GET/CREATE CONVERSATION] New conversation created:', conversation._id);
        }

        const populated = await conversation.populate('participants.userId', 'username avatar role isOnline');

        console.log('[GET/CREATE CONVERSATION] Populated conversation ready to send.');
        res.status(200).json(populated);
    } catch (err) {
        console.error('[GET/CREATE CONVERSATION] Error:', err.message);
        res.status(500).json({ message: 'Server error while getting or creating conversation.' });
    }
};
