const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const verifyToken = require('../middleware/verifyToken');

// Get all notes for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create a new note
router.post('/', verifyToken, async (req, res) => {
      console.log('POST /notes hit');
  console.log('Token user ID:', req.userId);
  console.log('Note content:', req.body.content);
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Note content is required' });

  try {
    const newNote = new Note({ content, user: req.userId });
    await newNote.save();
    res.status(201).json({ note: newNote });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Delete a note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Note not found or unauthorized' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
