const swaggerJsdoc = require('swagger-jsdoc');
const ui = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ivy Tech Course Management API',
      version: '1.0.0',
      description: 'API for managing courses, users, and authentication in the Ivy Tech Course Management System',
    },
    servers: [
      {
        url: 'https://sdev-255-final-project-group-3-backend.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token in x-auth header'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'firstName', 'lastName', 'email', 'password', 'role'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user'
            },
            username: {
              type: 'string',
              description: 'Unique username for login',
              minLength: 3
            },
            firstName: {
              type: 'string',
              description: 'User\'s first name',
              minLength: 1
            },
            lastName: {
              type: 'string',
              description: 'User\'s last name',
              minLength: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            password: {
              type: 'string',
              description: 'User\'s password (hashed)',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['super-admin', 'admin', 'teacher', 'student'],
              default: 'student',
              description: 'User\'s role in the system'
            },
            status: {
              type: 'string',
              description: 'User\'s status (e.g., active, inactive, on leave)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was last updated'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User\'s username'
            },
            password: {
              type: 'string',
              description: 'User\'s password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'firstName', 'lastName', 'email'],
          properties: {
            username: {
              type: 'string',
              description: 'Unique username for login',
              minLength: 3
            },
            password: {
              type: 'string',
              description: 'User\'s password',
              minLength: 6
            },
            firstName: {
              type: 'string',
              description: 'User\'s first name',
              minLength: 1
            },
            lastName: {
              type: 'string',
              description: 'User\'s last name',
              minLength: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            role: {
              type: 'string',
              enum: ['teacher', 'student'],
              default: 'student',
              description: 'User\'s role (admin roles cannot be created via registration)'
            },
            status: {
              type: 'string',
              description: 'User\'s status (optional)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to your route files with JSDoc comments
};

// Initialize swagger-jsdoc
const spec = swaggerJsdoc(swaggerOptions);

module.exports = {
    spec,
    ui
};