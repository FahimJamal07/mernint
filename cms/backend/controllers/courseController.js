const Course = require('../models/Course');

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
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the one who created it (Optional strict check)
    // if (course.instructor.toString() !== req.user.id) { ... }

    await course.deleteOne(); // or course.remove() in older Mongoose versions
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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