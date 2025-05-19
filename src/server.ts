import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import staticFiles from '@fastify/static';
import formbody from '@fastify/formbody';
import path from 'path';
import dotenv from 'dotenv';
import { weatherRoutes, subscriptionRoutes } from './routes';

dotenv.config();
const prefix = '/api';
const server = fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
      keywords: ['example'],
    },
  },
});

server.register(formbody);

server.register(staticFiles, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

server.register(swagger, {
  mode: 'static',
  specification: {
    path: './swagger.yaml',
    baseDir: __dirname,
  },
});

server.register(swaggerUi, {
  routePrefix: '/documentation',
});

server.register(weatherRoutes, { prefix });
server.register(subscriptionRoutes, { prefix });

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
