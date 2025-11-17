const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: [true, 'Please add a reporter name'],
    trim: true
  },
  assignee: {
    type: String,
    trim: true,
    default: 'Unassigned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bug', bugSchema);