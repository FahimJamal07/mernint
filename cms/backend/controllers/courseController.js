const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  const { title, description, price, image } = req.body;

  try {
    const course = new Course({
      title,
      description,
      price,
      image,
      instructor: req.user._id // Comes from the 'protect' middleware
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (Students need to see this)
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createCourse, getCourses };

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    // "findByIdAndDelete" is safer than "course.remove()" for old data
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Server Error during delete' });
  }
};

module.exports = { createCourse, getCourses, deleteCourse };

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  const { title, description, price, image } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Update fields if they exist in the request, otherwise keep old value
      course.title = title || course.title;
      course.description = description || course.description;
      course.price = price || course.price;
      course.image = image || course.image;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createCourse, getCourses, deleteCourse, updateCourse };

// @desc    Enroll user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // === AUTO-FIX FOR OLD DATA ===
    // If these fields are missing, initialize them to defaults
    if (!course.studentsEnrolled) {
        course.studentsEnrolled = [];
    }
    if (!course.seats) {
        course.seats = 10;
    }
    // =============================

    // 1. Check if already enrolled
    // We use .toString() to ensure we compare IDs correctly
    if (course.studentsEnrolled.some(id => id.toString() === req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled' });
    }

    // 2. Check seats
    if (course.studentsEnrolled.length >= course.seats) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // 3. Perform Enrollment
    course.studentsEnrolled.push(req.user.id);
    
    // Ensure user enrolledCourses array exists
    if (!user.enrolledCourses) user.enrolledCourses = [];
    user.enrolledCourses.push(course._id);

    await course.save();
    await user.save();

    res.json({ message: 'Enrollment Successful!' });
  } catch (error) {
    console.error("Enroll Error:", error); // This puts the real error in your terminal
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get details for current logged in user (Populate enrolled courses)
// @route   GET /api/auth/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        // Fetch user and replace the IDs in 'enrolledCourses' with real course data
        const user = await User.findById(req.user.id).populate('enrolledCourses');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// REMEMBER TO EXPORT THEM
module.exports = { createCourse, getCourses, deleteCourse, updateCourse, enrollCourse, getMyProfile };