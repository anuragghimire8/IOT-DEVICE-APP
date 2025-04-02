const router = require('express').Router();
const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

// POST route for signup with validation
router.post('/signup', signupValidation, signup);

// POST route for login with validation
router.post('/login', loginValidation, login);

module.exports = router;
