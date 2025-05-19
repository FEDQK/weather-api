export const unsubscribeScheme = {
  tags: ['subscription'],
  summary: 'Unsubscribe from weather updates',
  description: 'Unsubscribes an email from weather updates using the token sent in emails.',
  params: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Unsubscribe token',
      },
    },
    required: ['token'],
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
    404: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
        },
      },
    },
  },
};
