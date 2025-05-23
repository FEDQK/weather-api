export const weatherScheme = {
  tags: ['weather'],
  querystring: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'City name for weather forecast',
      },
    },
    required: ['city'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        temperature: {
          type: 'number',
          description: 'Current temperature',
        },
        humidity: {
          type: 'number',
          description: 'Current humidity percentage',
        },
        description: {
          type: 'string',
          description: 'Weather description',
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    404: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  },
};
