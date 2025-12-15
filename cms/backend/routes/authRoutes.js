const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyProfile } = require('../controllers/authController'); // <--- Import from authController
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMyProfile); // <--- Use it here

module.exports = router;