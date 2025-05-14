const express = require('express');
const router = express.Router();
const HiredCandidate = require('../models/HiredCandidate');
const ChatGroup = require('../models/ChatGroup');
const Message = require('../models/Message');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/chat-groups/:internshipId', authMiddleware, async (req, res) => {
  try {
    const { internshipId } = req.params;
    let chatGroup = await ChatGroup.findOne({ internshipId });

    if (!chatGroup) {
      const hiredCandidates = await HiredCandidate.find({ internshipId });
      if (!hiredCandidates.length) {
        return res.status(404).json({ error: 'No candidates found for this internship' });
      }

      chatGroup = new ChatGroup({
        internshipId,
        name: `Internship ${internshipId}`,
        members: hiredCandidates.map(candidate => ({
          userId: candidate.candidate.userId,
          name: candidate.candidate.name,
        })),
      });
      await chatGroup.save();
    }

    if (!chatGroup.members.some(member => member.userId.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'User not a member of this chat group' });
    }

    res.json(chatGroup);
  } catch (error) {
    console.error('Error in GET /chat-groups/:internshipId:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/chat-groups", authMiddleware, async (req, res) => {
  try {
    console.log("GET /api/chat-groups - Starting for user ID:", req.user.id)

    // Step 1: Find HiredCandidate records for the authenticated user
    const hiredCandidates = await HiredCandidate.find({ "candidate.userId": req.user.id })
    console.log("GET /api/chat-groups - HiredCandidates found:", hiredCandidates.length, hiredCandidates)

    if (!hiredCandidates.length) {
      console.log("GET /api/chat-groups - No hired candidates found, returning empty array")
      return res.json([])
    }

    // Step 2: Get unique internshipIds
    const internshipIds = [...new Set(hiredCandidates.map(hc => hc.internshipId.toString()))]
    console.log("GET /api/chat-groups - Unique internship IDs:", internshipIds)

    // Step 3: Create or update ChatGroups for each internshipId
    const chatGroups = []
    for (const internshipId of internshipIds) {
      // Find all HiredCandidates for this internshipId
      const allHiredForInternship = await HiredCandidate.find({ internshipId })
      console.log(
        `GET /api/chat-groups - HiredCandidates for internship ${internshipId}:`,
        allHiredForInternship.length,
        allHiredForInternship
      )

      // Prepare members array
      const members = allHiredForInternship.map(hc => ({
        userId: hc.candidate.userId,
        name: hc.candidate.name,
      }))

      // Check if a ChatGroup exists
      let chatGroup = await ChatGroup.findOne({ internshipId })
      if (!chatGroup) {
        // Create new ChatGroup
        chatGroup = new ChatGroup({
          internshipId,
          name: `Internship Group ${internshipId.slice(-6)}`,
          members,
        })
        await chatGroup.save()
        console.log(`GET /api/chat-groups - Created ChatGroup for internship ${internshipId}:`, chatGroup)
      } else {
        // Update existing ChatGroup
        chatGroup.members = members
        await chatGroup.save()
        console.log(`GET /api/chat-groups - Updated ChatGroup for internship ${internshipId}:`, chatGroup)
      }

      chatGroups.push(chatGroup)
    }

    console.log("GET /api/chat-groups - Final response:", chatGroups.length, chatGroups)
    res.json(chatGroups)
  } catch (error) {
    console.error("GET /api/chat-groups - Error:", {
      message: error.message,
      stack: error.stack,
    })
    res.status(500).json({ error: error.message })
  }
})

router.get('/chat-groups/:chatGroupId/messages', authMiddleware, async (req, res) => {
  try {
    const { chatGroupId } = req.params;
    const chatGroup = await ChatGroup.findById(chatGroupId);
    if (!chatGroup) return res.status(404).json({ error: 'Chat group not found' });

    if (!chatGroup.members.some(member => member.userId.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'User not a member of this chat group' });
    }

    const messages = await Message.find({ chatGroupId }).sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    console.error('Error in GET /chat-groups/:chatGroupId/messages:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat-groups/:chatGroupId/messages', authMiddleware, async (req, res) => {
  try {
    const { chatGroupId } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    const chatGroup = await ChatGroup.findById(chatGroupId);
    if (!chatGroup) return res.status(404).json({ error: 'Chat group not found' });

    if (!chatGroup.members.some(member => member.userId.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'User not a member of this chat group' });
    }

    const message = new Message({
      chatGroupId,
      sender: {
        userId: req.user._id,
        name: req.user.name || 'Anonymous',
      },
      text: text.trim(),
    });

    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error in POST /chat-groups/:chatGroupId/messages:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/messages/:messageId/reactions', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reaction } = req.body;

    if (!reaction || typeof reaction !== 'string' || reaction.length > 5) {
      return res.status(400).json({ error: 'Invalid reaction' });
    }

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    const chatGroup = await ChatGroup.findById(message.chatGroupId);
    if (!chatGroup) return res.status(404).json({ error: 'Chat group not found' });

    if (!chatGroup.members.some(member => member.userId.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'User not a member of this chat group' });
    }

    const existingReaction = message.reactions.find(
      r => r.userId.toString() === req.user._id.toString() && r.reaction === reaction
    );

    if (existingReaction) {
      message.reactions = message.reactions.filter(
        r => !(r.userId.toString() === req.user._id.toString() && r.reaction === reaction)
      );
    } else {
      message.reactions.push({ userId: req.user._id, reaction });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error in POST /messages/:messageId/reactions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;