export const subscribeScheme = {
  tags: ['subscription'],
  summary: 'Subscribe to weather updates',
  description:
    'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
  consumes: ['application/json', 'application/x-www-form-urlencoded'],
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address to subscribe',
      },
      city: {
        type: 'string',
        description: 'City for weather updates',
      },
      frequency: {
        type: 'string',
        enum: ['hourly', 'daily'],
        description: 'Frequency of updates (hourly or daily)',
      },
    },
    required: ['email', 'city', 'frequency'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message',
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
        },
      },
    },
    409: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Conflict message',
        },
      },
    },
  },
};
