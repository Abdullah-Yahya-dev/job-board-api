const express = require('express');
const router = express.Router();
const { createUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');
const  validate  = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');



router.post('/register', validate(registerSchema), createUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;
