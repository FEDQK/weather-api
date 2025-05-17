import { FastifyInstance } from 'fastify';
import { WeatherService } from '../services/weather.service';

export async function weatherRoutes(fastify: FastifyInstance) {
  const weatherService = new WeatherService();

  fastify.get('/weather', {
    schema: {
      tags: ['weather'],
      querystring: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name for weather forecast'
          }
        },
        required: ['city']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            temperature: {
              type: 'number',
              description: 'Current temperature'
            },
            humidity: {
              type: 'number',
              description: 'Current humidity percentage'
            },
            description: {
              type: 'string',
              description: 'Weather description'
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const { city } = request.query as { city: string };
      try {
        const weather = await weatherService.getWeatherForecast(city);
        return {
          temperature: weather.temperature,
          humidity: weather.humidity,
          description: weather.description
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            reply.code(404).send({ message: 'City not found' });
          } else {
            reply.code(400).send({ message: 'Invalid request' });
          }
        }
        throw error;
      }
    }
  });
}
