const Joi = require('joi');

// Helper middleware to validate request body
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // Collect all error messages
        const message = error.details.map(detail => detail.message).join(', ');
        const err = new Error(message);
        err.statusCode = 400;
        err.name = 'ValidationError';
        err.details = error.details; // Pass full details for error handler
        return next(err);
    }
    
    next();
};

// --- Validation Schemas ---

// 1. Auth Schemas
const signupSchema = Joi.object({
    email: Joi.string().email().required().messages({'string.email': 'Invalid email format', 'any.required': 'Email is required'}),
    password: Joi.string().min(6).required().messages({'string.min': 'Password must be at least 6 characters', 'any.required': 'Password is required'}),
    name: Joi.string().min(2).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// 2. Container Schemas
const containerCreateSchema = Joi.object({
    image: Joi.string().required().messages({'any.required': 'Image name is required'}),
    name: Joi.string().alphanum().min(3).max(30).optional().messages({'string.alphanum': 'Name must be alphanumeric'}),
    cmd: Joi.array().items(Joi.string()).optional()
});

// 3. Image Schemas
const imagePullSchema = Joi.object({
    image: Joi.string().required()
});

// 4. Volume Schemas
const volumeCreateSchema = Joi.object({
    name: Joi.string().required(),
    driver: Joi.string().default('local')
});

// 5. Network Schemas
const networkCreateSchema = Joi.object({
    name: Joi.string().required(),
    driver: Joi.string().default('bridge')
});

module.exports = {
    validate,
    schemas: {
        signup: signupSchema,
        login: loginSchema,
        containerCreate: containerCreateSchema,
        imagePull: imagePullSchema,
        volumeCreate: volumeCreateSchema,
        networkCreate: networkCreateSchema
    }
};
