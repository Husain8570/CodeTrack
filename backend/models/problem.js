const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  topic: { // Topic like "DP", "Greedy"
    type: String,
    required: true,
  },
  time: { // Actual time user took to solve
    type: Number,
    required: true,
  },
  tags: { // New field for tags
    type: [String], // Array of strings to store multiple tags
    required: true,
  },
  predictedDifficulty: { // Predicted difficulty by ML model
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: null,
  },
  estimatedTime: { // Predicted estimated solve time in minutes
    type: Number,
    default: null,
  },
}, { timestamps: true }); // Fixed typo from "timeStamp"

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
