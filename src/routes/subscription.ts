import { FastifyInstance } from 'fastify';
import { SubscriptionService } from '../services/subscription.service';
import { subscribeScheme, subscriptionConfirmScheme, unsubscribeScheme } from '../schemas';
import { isValidEmail } from '../utils/validation';

type Frequency = 'hourly' | 'daily';
interface ISubscriptionBody {
  email: string;
  city: string;
  frequency: Frequency;
}

interface ISubscriptionReply {
  200: { message: string };
  '4xx': { message: string };
}

export async function subscriptionRoutes(fastify: FastifyInstance) {
  const subscriptionService = new SubscriptionService();

  fastify.post<{
    Body: ISubscriptionBody;
    Reply: ISubscriptionReply;
  }>(
    '/subscribe',
    {
      schema: subscribeScheme,
    },
    async (request, reply) => {
      try {
        let subscription = request.body;

        if (!subscription.email || !subscription.city || !subscription.frequency) {
          throw new Error('Missing required fields');
        }

        if (!isValidEmail(subscription.email)) {
          throw new Error('Invalid email format');
        }

        subscription = {
          email: subscription.email.toLowerCase().trim(),
          city: subscription.city.trim(),
          frequency: subscription.frequency,
        };

        await subscriptionService.subscribe(subscription);
        fastify.log.info(
          `Subscription request: ${subscription.email} for ${subscription.city} (${subscription.frequency})`,
        );
        return {
          message: 'Subscription successful. Please check your email for confirmation.',
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Email already subscribed') {
            reply.code(409).send({ message: error.message });
          } else {
            reply.code(400).send({ message: error.message });
          }
        }
        throw error;
      }
    },
  );

  fastify.get<{
    Params: {
      token: string;
    };
    Reply: ISubscriptionReply;
  }>(
    '/confirm/:token',
    {
      schema: subscriptionConfirmScheme,
    },
    async (request, reply) => {
      try {
        const { token } = request.params;
        const email = await subscriptionService.confirmSubscription(token);
        fastify.log.info(`Confirmed: ${email}`);
        return { message: 'Subscription confirmed successfully' };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Subscription not found') {
            reply.code(404).send({ message: 'Token not found' });
          } else {
            reply.code(400).send({ message: error.message });
          }
        }
        throw error;
      }
    },
  );

  fastify.get<{
    Params: {
      token: string;
    };
    Reply: ISubscriptionReply;
  }>(
    '/unsubscribe/:token',
    {
      schema: unsubscribeScheme,
    },
    async (request, reply) => {
      try {
        const { token } = request.params;
        const email = await subscriptionService.unsubscribe(token);
        fastify.log.info(`Unsubscribed: ${email}`);
        return { message: 'Unsubscribed successfully' };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Subscription not found') {
            reply.code(404).send({ message: 'Token not found' });
          } else {
            reply.code(400).send({ message: error.message });
          }
        }
        throw error;
      }
    },
  );
}
