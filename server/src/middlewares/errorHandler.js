// Global Error Handler Middleware
// Captures all errors thrown in routes/controllers

module.exports = (err, req, res, next) => {
    // Log the error for server-side debugging
    console.error('ERROR:', err);

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific errors
    if (err.name === 'ValidationError') { // Joi Validation Error
        statusCode = 400;
        // Format Joi details into a readable string or object
        message = err.details ? err.details.map(d => d.message).join(', ') : message;
    }
    
    if (err.name === 'JsonWebTokenError') { // Invalid JWT
        statusCode = 401;
        message = 'Invalid token.';
    }
    
    if (err.name === 'TokenExpiredError') { // Expired JWT
        statusCode = 401;
        message = 'Token expired.';
    }

    if (err.code === 'P2002') { // Prisma Unique Constraint Violation
        statusCode = 409;
        message = 'Resource already exists (Unique constraint violation).';
    }

    if (err.statusCode === 404 && !message) { // Not Found
        message = 'Resource not found.';
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
