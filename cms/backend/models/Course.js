const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);