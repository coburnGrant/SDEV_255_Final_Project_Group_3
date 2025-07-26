const Authenticator = require('../Authenticator');
const { User, UserRole } = require('../models/User');

// Middleware to verify JWT token and attach user to request
const authenticateToken = async (req, res, next) => {
    const token = req.headers['x-auth'];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = Authenticator.verifyToken(token);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if user has permission to create/edit courses
const canManageCourses = (req, res, next) => {
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER];
    
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions to manage courses' });
    }
    
    next();
};

// Middleware to check if user has permission to delete courses
const canDeleteCourses = (req, res, next) => {
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
    
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions to delete courses' });
    }
    
    next();
};

module.exports = {
    authenticateToken,
    canManageCourses,
    canDeleteCourses
}; 