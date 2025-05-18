export const subscriptionConfirmScheme = {
  tags: ['subscription'],
  summary: 'Confirm email subscription',
  description: 'Confirms a subscription using the token sent in the confirmation email.',
  params: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Confirmation token',
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
  },
};
