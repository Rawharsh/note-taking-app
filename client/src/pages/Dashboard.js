import React, { useEffect, useState } from 'react';
import { fetchNotes, createNote, deleteNote } from '../services/noteService';
import './Dashboard.css';
// import jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
 const decoded = token ? jwtDecode(token) : null;
  const email = decoded?.email;

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await fetchNotes(token);
        setNotes(data.notes || []);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [token]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const data = await createNote(newNote, token);
    setNotes(prev => [...prev, data.note]);
    setNewNote('');
  };

  const handleDelete = async (id) => {
    await deleteNote(id, token);
    setNotes(prev => prev.filter(note => note._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading notes...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {email}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <input
        type="text"
        placeholder="Write a note..."
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        className="note-input"
      />
      <button onClick={handleAddNote} className="add-btn">Add Note</button>

      <ul className="note-list">
        {notes.map(note => (
          <li key={note._id} className="note-item">
            {note.content}
            <button onClick={() => handleDelete(note._id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
