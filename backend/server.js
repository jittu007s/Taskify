const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/api/auth', require("./routes/authRoutes")); // Register auth routes under "/api/auth"

// Define API routes
app.use('/api/tasks', require('./routes/taskRoutes')); 
 
const PORT = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/Taskify", { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
