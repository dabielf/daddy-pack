import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

export const deleteDaddy = mutation({
  args: { daddy: v.id("daddies") },
  handler: async (ctx, { daddy }) => {
    await ctx.db.delete(daddy);
  },
});

export const getDaddies = query({
  args: { user: v.optional(v.id("users")) },
  handler: async (ctx, { user }) => {
    if (!user) {
      return null;
    }
    return await ctx.db
      .query("daddies")
      .filter((q) => q.eq(q.field("user"), user))
      .collect();
  },
});

export const createDaddy = mutation({
  args: {
    user: v.id("users"),
    name: v.string(),
    vibeRating: v.number(),
  },
  handler: async (ctx, { user, name, vibeRating }) => {
    const daddyId = await ctx.db.insert("daddies", {
      user,
      name,
      vibeRating,
      lifetimeValue: 0,
    });

    return daddyId;
  },
});
