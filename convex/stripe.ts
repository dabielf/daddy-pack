import { action, internalAction } from './_generated/server';
import { api, internal } from './_generated/api';
import Stripe from 'stripe';
import { Id } from './_generated/dataModel';
import { v } from 'convex/values';

export const pay = action({
  args: {},
  handler: async ctx => {
    const clerkUser = await ctx.auth.getUserIdentity();
    const user = await ctx.runQuery(api.users.currentUser, {});

    if (!clerkUser || !user) {
      throw new Error('Not authenticated');
    }

    if (!clerkUser.emailVerified) {
      throw new Error('Email not verified');
    }

    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
    });

    const domain = process.env.NEXT_PUBLIC_HOSTING_URL!;

    const session: Stripe.Response<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.create({
        // Change the mode line to "payment" if it's a unique payment
        mode: 'subscription',
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID!,
            quantity: 1,
          },
        ],
        customer_email: clerkUser.email,
        metadata: {
          userId: user._id,
        },
        success_url: `${domain}`,
        cancel_url: `${domain}`,
      });
    return session.url;
  },
});

type Metadata = {
  userId: Id<'users'>;
};

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const { runQuery, runMutation } = ctx;
    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret,
      );

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string,
        );

        const userId = completedEvent.metadata.userId;

        await runMutation(internal.users.updateSubscription, {
          userId,
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string,
        );

        await runMutation(internal.users.updateSubscriptionById, {
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as { message: string }).message };
    }
  },
});
