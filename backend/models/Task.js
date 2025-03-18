const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskID: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional for authentication
});

module.exports = mongoose.model('Task', taskSchema);
 
