const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required()
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 100 characters',
                'any.required': 'Name is required'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'any.required': 'Email is required'
            }),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
            .messages({
                'string.pattern.base': 'Phone number must be between 10-15 digits',
                'any.required': 'Phone number is required'
            }),
        location: Joi.string().min(2).max(200).required()
            .messages({
                'string.min': 'Location must be at least 2 characters long',
                'string.max': 'Location cannot exceed 200 characters',
                'any.required': 'Location is required'
            }),
        password: Joi.string().min(6).max(100).required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password cannot exceed 100 characters',
                'any.required': 'Password is required'
            }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Password confirmation is required'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error. Please check the input fields.",
            errors: error.details.map(err => err.message)
        });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error. Please check the input fields.",
            errors: error.details.map(err => err.message)
        });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation
};