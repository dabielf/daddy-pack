import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getConvexQueryUser, getConvexMutationUser } from './helpers';

export const deleteDaddy = mutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    await ctx.db.delete(daddy);
  },
});

export const getDaddy = query({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    const daddyRecord = await ctx.db.get(daddy);
    const daddyDates = await ctx.db
      .query('dates')
      .withIndex('by_daddy', q => q.eq('daddy', daddy))
      .collect();
    const daddyContacts = await ctx.db
      .query('contacts')
      .withIndex('by_daddy', q => q.eq('daddy', daddy))
      .collect();
    return {
      daddy: daddyRecord,
      dates: daddyDates,
      contacts: daddyContacts,
    };
  },
});

export const getDaddies = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db
      .query('daddies')
      .filter(q => q.eq(q.field('user'), user._id))
      .collect();
  },
});

export const createDaddy = mutation({
  args: {
    name: v.string(),
    vibeRating: v.number(),
  },
  handler: async (ctx, { name, vibeRating }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const daddyId = await ctx.db.insert('daddies', {
      user: user._id,
      name,
      vibeRating,
      lifetimeValue: 0,
    });

    return daddyId;
  },
});

export const updateDaddy = mutation({
  args: {
    daddy: v.id('daddies'),
    name: v.optional(v.string()),
    profileLink: v.optional(v.string()),
    imgUrl: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    location: v.optional(v.string()),
    messagingApp: v.optional(v.string()),
    initialContactDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    earningsEstimate: v.optional(v.number()),
    vibeRating: v.number(),
  },
  handler: async (
    ctx,
    {
      daddy,
      name,
      profileLink,
      imgUrl,
      contactInfo,
      location,
      messagingApp,
      initialContactDate,
      notes,
      earningsEstimate,
      vibeRating,
    },
  ) => {
    await ctx.db.patch(daddy, {
      name,
      profileLink,
      imgUrl,
      contactInfo,
      location,
      messagingApp,
      initialContactDate,
      notes,
      earningsEstimate,
      vibeRating,
    });
  },
});
