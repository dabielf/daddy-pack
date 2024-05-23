import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

const http = httpRouter();

http.route({
  path: "/api",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get("DP-Sig") as string;
    if (!signature) {
      return new Response("Missing DP-Sig key", { status: 400 });
    }
  }),
});

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature: string = request.headers.get("Stripe-Signature") as string;
    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    if (result.success) {
      return new Response("Webhook Received", { status: 200 });
    } else {
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

//Clerk Webhook Validation

// Clerk Webhook
const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await request.json();
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  if (!event) {
    return new Response("Error occured", { status: 400 });
  }

  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const body = JSON.stringify(event);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  console.log("Webhook verified", { evt });

  console.log("New webhook event", event.type);

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      // await ctx.runMutation(internal.users.updateOrCreateUser, {
      //   clerkUser: event.data,
      //   update: true,
      // });
      break;
    }
    case "user.deleted": {
      const clerk_id = event.data.user_id!;
      await ctx.runMutation(internal.users.deleteUser, { clerk_id });
      break;
    }
    case "session.created": {
      await ctx.runMutation(internal.users.updateOrCreateUser, {
        clerkUser: event.data,
      });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, { status: 200 });
});

http.route({
  path: "/convex",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
