const router = require('express').Router();
const { signup, login, signout,authenticateUser  } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/signout',authenticateUser, signout); // ← Add this


module.exports = router;
