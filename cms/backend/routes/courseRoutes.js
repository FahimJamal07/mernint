const express = require('express');
const router = express.Router();
const { createCourse, getCourses, deleteCourse,updateCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, admin, createCourse);

router.route('/:id')
    .delete(protect, admin, deleteCourse)
    .put(protect,admin, updateCourse);

module.exports = router;