import { v, ConvexError } from "convex/values";
import {
  internalMutation,
  query,
  mutation,
  internalQuery,
} from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getConvexMutationUser, getConvexQueryUser } from "./helpers";

export const updateOrCreateUser = internalMutation({
  args: {
    clerkUser: v.any(),
    update: v.optional(v.boolean()),
  },
  handler: async (ctx, { clerkUser, update }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkUser.user_id))
      .unique();

    if (user && update === true) {
      await ctx.db.patch(user._id, {
        email: clerkUser.email,
        name: clerkUser.name,
      });
    } else if (!user) {
      await ctx.db.insert("users", {
        clerk_id: clerkUser.user_id,
        // email: identity.email,
        // name: identity.givenName,
      });
    }
  },
});

export const deleteUser = internalMutation({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, { clerk_id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerk_id))
      .unique();
    if (!user) return;
    await ctx.db.delete(user._id);
  },
});

export const currentUser = query({
  args: {},
  handler: getConvexQueryUser,
});

export const getUserApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getConvexQueryUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("apiKeys")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createUserApiKey = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    const user = await getConvexMutationUser(ctx);
    if (!user) return null;

    const key = crypto.randomUUID();
    const newKey = await ctx.db.insert("apiKeys", {
      key,
      title,
      userId: user._id,
      uses: 0,
    });

    return newKey;
  },
});

export const getUserByApiKey = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const keyRecord = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (!keyRecord) return null;
    const user = ctx.db.get(keyRecord.userId);

    return user;
  },
});

export const getUserEvents = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getConvexQueryUser(ctx);
    if (!user) throw new ConvexError("Unauthenticated");

    const userEvents = await ctx.db
      .query("events")
      .withIndex("by_userId_eventDate", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(paginationOpts);

    return userEvents;
  },
});

export const addUserEvent = internalMutation({
  args: {
    userId: v.id("users"),
    eventDaddyId: v.optional(v.id("daddies")),
    daddyName: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    eventRefDate: v.optional(v.number()),
    eventType: v.union(
      v.literal("contact"),
      v.literal("dateScheduled"),
      v.literal("dateConfirmed"),
      v.literal("date"),
      v.literal("dateProcessed"),
      v.literal("dateCanceled"),
      v.literal("dateNoShow"),
      v.literal("addDaddy"),
      v.literal("archiveDaddy"),
      v.literal("unarchiveDaddy"),
      v.literal("startAllowance"),
      v.literal("stopAllowance"),
      v.literal("allowanceGifted"),
    ),
    eventRef: v.optional(v.union(v.id("dates"), v.id("contacts"))),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      userId: args.userId,
      eventDaddyId: args.eventDaddyId || undefined,
      daddyName: args.daddyName || undefined,
      eventDate: args.eventDate || new Date().valueOf(),
      eventRefDate: args.eventRefDate || undefined,
      eventType: args.eventType,
      eventRef: args.eventRef || undefined,
    });
  },
});

export const updateSubscription = internalMutation({
  args: {
    userId: v.id("users"),
    subscriptionId: v.string(),
    endsOn: v.number(),
  },
  handler: async (ctx, { userId, subscriptionId, endsOn }) => {
    await ctx.db.patch(userId, {
      subscriptionId: subscriptionId,
      endsOn: endsOn,
    });
  },
});

export const updateSubscriptionById = internalMutation({
  args: {
    subscriptionId: v.string(),
    endsOn: v.number(),
  },
  handler: async (ctx, { subscriptionId, endsOn }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_subscriptionId", (q) =>
        q.eq("subscriptionId", subscriptionId),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      endsOn: endsOn,
    });
  },
});
