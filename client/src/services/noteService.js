const API_BASE =  'http://localhost:5000'; // update if deployed

export async function fetchNotes(token) {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function createNote(content, token) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function deleteNote(noteId, token) {
  const res = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
