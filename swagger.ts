import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lab Engenharia API',
      version: '1.0.0',
      description: 'Backend API for Lab Engenharia - A beer rating and sharing platform',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            avatar: {
              type: 'string',
              nullable: true,
              description: 'User avatar URL',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Post ID',
            },
            userId: {
              type: 'string',
              description: 'User ID who created the post',
            },
            userName: {
              type: 'string',
              description: 'Name of the user who created the post',
            },
            userAvatar: {
              type: 'string',
              nullable: true,
              description: 'Avatar of the user who created the post',
            },
            beerName: {
              type: 'string',
              description: 'Name of the beer',
            },
            place: {
              type: 'string',
              description: 'Place where the beer was consumed',
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Beer rating (0-5)',
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Additional notes about the beer',
            },
            imageUrl: {
              type: 'string',
              nullable: true,
              description: 'Image URL of the beer',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Post creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Post last update date',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'securePassword123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'securePassword123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['beerName', 'place', 'rating'],
          properties: {
            beerName: {
              type: 'string',
              description: 'Name of the beer',
              example: 'Heineken',
            },
            place: {
              type: 'string',
              description: 'Place where the beer was consumed',
              example: 'Bar do João',
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Beer rating (0-5)',
              example: 4.5,
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the beer',
              example: 'Great beer with friends!',
            },
            imageUri: {
              type: 'string',
              description: 'Image URL of the beer',
              example: 'https://example.com/beer.jpg',
            },
          },
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            beerName: {
              type: 'string',
              description: 'Name of the beer',
            },
            place: {
              type: 'string',
              description: 'Place where the beer was consumed',
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Beer rating (0-5)',
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the beer',
            },
            imageUri: {
              type: 'string',
              description: 'Image URL of the beer',
            },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User name',
            },
            avatar: {
              type: 'string',
              description: 'User avatar URL',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./auth/*.ts', './posts/*.ts', './index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
