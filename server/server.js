const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');



const app = express();
app.use(cors());
app.use(express.json());
app.use('/notes', notesRoutes);



// Routes placeholder

app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('API is running');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
