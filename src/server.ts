import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { weatherRoutes } from './routes/weather';

const server = fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
      keywords: ['example']
    }
  }
});

server.register(swagger, {
  mode: 'static',
  specification: {
    path: './swagger.yaml',
    baseDir: __dirname
  }
});

server.register(swaggerUi, {
  routePrefix: '/documentation'
});

server.register(weatherRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();
