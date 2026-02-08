const mongoose = require('mongoose');

// Student schema - stores basic student info
// enrolledCourses is an array of Course refs (one course has many students)
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  // Reference to courses this student is enrolled in (for easy lookup)
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
