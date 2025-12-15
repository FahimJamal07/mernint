const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://via.placeholder.com/150' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // NEW FIELDS
  seats: { 
    type: Number, 
    default: 10, // Default 10 seats per course
    required: true 
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);