import { FastifyInstance } from 'fastify';
import { WeatherForecast, WeatherService } from '../services/weather.service';
import { weatherScheme } from '../schemas';

interface IWeatherQuerystring {
  city: string;
}

interface IWeatherReply {
  200: WeatherForecast;
  '4xx': { message: string };
}

export async function weatherRoutes(fastify: FastifyInstance) {
  const weatherService = new WeatherService();

  fastify.get<{ Querystring: IWeatherQuerystring; Reply: IWeatherReply }>(
    '/weather',
    {
      schema: weatherScheme,
    },
    async (request, reply) => {
      const { city } = request.query;
      try {
        const weather = await weatherService.getWeatherForecast(city);
        return {
          temperature: weather.temperature,
          humidity: weather.humidity,
          description: weather.description,
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          reply.code(404).send({ message: 'City not found' });
        } else {
          reply.code(400).send({ message: 'Invalid request' });
        }
      }
    },
  );
}
