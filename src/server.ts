import fastify, { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import staticFiles from '@fastify/static';
import formbody from '@fastify/formbody';
import path from 'path';
import dotenv from 'dotenv';
import { weatherRoutes, subscriptionRoutes } from './routes';
import { DatabaseService } from './services/database.service';

dotenv.config();

class Server {
  private server: FastifyInstance;
  private databaseService: DatabaseService;
  private readonly prefix = '/api';

  constructor() {
    this.server = fastify({
      logger: true,
      ajv: {
        customOptions: {
          strict: false,
          keywords: ['example'],
        },
      },
    });
    this.databaseService = new DatabaseService();
  }

  private async registerPlugins(): Promise<void> {
    await this.server.register(formbody);
    await this.server.register(staticFiles, {
      root: path.join(__dirname, '../public'),
      prefix: '/',
    });
    await this.server.register(swagger, {
      mode: 'static',
      specification: {
        path: './swagger.yaml',
        baseDir: __dirname,
      },
    });
    await this.server.register(swaggerUi, {
      routePrefix: '/documentation',
    });
  }

  private async registerRoutes(): Promise<void> {
    await this.server.register(weatherRoutes, { prefix: this.prefix });
    await this.server.register(subscriptionRoutes, { prefix: this.prefix });
  }

  private registerShutdownHandlers(): void {
    const closeGracefully = async (signal: string) => {
      this.server.log.info(`Received signal to terminate: ${signal}`);
      await this.server.close();
      await this.databaseService.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', () => closeGracefully('SIGINT'));
    process.on('SIGTERM', () => closeGracefully('SIGTERM'));
  }

  public async start(): Promise<void> {
    try {
      this.server.log.info('Registering plugins...');
      await this.registerPlugins();

      this.server.log.info('Registering routes...');
      await this.registerRoutes();

      this.server.log.info('Initializing database...');
      await this.databaseService.init();

      this.registerShutdownHandlers();

      await this.server.listen({ port: 3000, host: '0.0.0.0' });
      this.server.log.info(`Server listening on ${this.server.server.address()}`);
    } catch (err) {
      this.server.log.error(err);
      await this.databaseService.disconnect();
      process.exit(1);
    }
  }
}

const server = new Server();
void server.start();
