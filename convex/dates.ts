import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getConvexQueryUser, getConvexMutationUser } from './helpers';

export const getDate = query({
  args: { date: v.id('dates') },
  handler: async (ctx, { date }) => {
    const dateData = await ctx.db.get(date);
    if (!dateData) return null;
    const daddyData = await ctx.db.get(dateData.daddy);

    return {
      date: dateData,
      daddy: daddyData,
    };
  },
});

export const getDates = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db
      .query('dates')
      .withIndex('by_date')
      .order('desc')
      .filter(q => q.eq(q.field('user'), user._id))
      .collect();
  },
});

export const createDate = mutation({
  args: {
    daddy: v.id('daddies'),
    daddyName: v.string(),
    date: v.number(),
  },
  handler: async (ctx, { daddy, daddyName, date }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const dateId = await ctx.db.insert('dates', {
      user: user._id,
      daddy,
      daddyName,
      date,
      status: 'scheduled',
    });

    await ctx.db.patch(daddy, {
      mostRecentDate: date,
    });

    return dateId;
  },
});

export const updateDate = mutation({
  args: {
    dateId: v.id('dates'),
    date: v.number(),
    location: v.optional(v.string()),
    dateDuration: v.optional(v.number()),
    comfortLevel: v.optional(v.number()),
    funLevel: v.optional(v.number()),
    notes: v.optional(v.string()),
    dateRating: v.optional(v.number()),
    expectedGiftAmount: v.optional(v.number()),
    giftAmount: v.optional(v.number()),
    // status: v.optional(
    //   v.union(
    //     v.literal('scheduled'),
    //     v.literal('completed'),
    //     v.literal('cancelled'),
    //   ),
    // ),
    status: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      dateId,
      date,
      location,
      dateDuration,
      comfortLevel,
      funLevel,
      notes,
      dateRating,
      expectedGiftAmount,
      giftAmount,
      status,
    },
  ) => {
    await ctx.db.patch(dateId, {
      date,
      location,
      dateDuration,
      comfortLevel,
      funLevel,
      notes,
      dateRating,
      expectedGiftAmount,
      giftAmount,
      status,
    });
  },
});

export const deleteDate = mutation({
  args: { date: v.id('dates') },
  handler: async (ctx, { date }) => {
    await ctx.db.delete(date);
  },
});
