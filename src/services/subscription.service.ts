import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

interface SubscriptionRequest {
  email: string;
  city: string;
  frequency: 'hourly' | 'daily';
}

export class SubscriptionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async subscribe(subscription: SubscriptionRequest): Promise<string> {
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { email: subscription.email },
    });

    if (existingSubscription) {
      throw new Error('Email already subscribed');
    }

    const token = randomUUID();

    await this.prisma.$transaction([
      this.prisma.subscription.create({
        data: {
          email: subscription.email,
          city: subscription.city,
          frequency: subscription.frequency,
          confirmed: false,
        },
      }),
      this.prisma.confirmationToken.create({
        data: {
          token,
          email: subscription.email,
        },
      }),
    ]);

    return token;
  }

  async confirmSubscription(token: string): Promise<string> {
    const confirmationToken = await this.prisma.confirmationToken.findUnique({
      where: { token },
    });

    if (!confirmationToken) {
      throw new Error('Invalid token');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { email: confirmationToken.email },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.confirmed) {
      throw new Error('Subscription already confirmed');
    }

    const unsubscribeToken = randomUUID();

    await this.prisma.$transaction([
      this.prisma.subscription.update({
        where: { email: confirmationToken.email },
        data: { confirmed: true },
      }),
      this.prisma.confirmationToken.delete({
        where: { token },
      }),
      this.prisma.unsubscribeToken.create({
        data: {
          token: unsubscribeToken,
          email: confirmationToken.email,
        },
      }),
    ]);

    return confirmationToken.email;
  }

  async unsubscribe(token: string): Promise<string> {
    const unsubscribeToken = await this.prisma.unsubscribeToken.findUnique({
      where: { token },
    });

    if (!unsubscribeToken) {
      throw new Error('Invalid token');
    }

    await this.prisma.$transaction([
      this.prisma.subscription.delete({
        where: { email: unsubscribeToken.email },
      }),
      this.prisma.unsubscribeToken.delete({
        where: { token },
      }),
    ]);

    return unsubscribeToken.email;
  }
}
