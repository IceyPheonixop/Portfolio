import Message from '../models/Message.js';

export async function sendMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    return res.status(201).json({ success: true, message: 'Message sent successfully!', item: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
}

export async function getMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch messages.' });
  }
}

export async function deleteMessage(req, res) {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Message deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete message.' });
  }
}