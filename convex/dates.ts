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
    });

    await ctx.db.patch(daddy, {
      mostRecentDate: date,
    });

    return dateId;
  },
});

// export const updateDate = mutation({
//   args: {
//     dateId: v.id('dates'),
//     daddy: v.id('daddies'),
//     daddyName: v.string(),
//     date: v.number(),
//     location: v.optional(v.string()),
//     startTime: v.optional(v.number()),
//     endTime: v.optional(v.number()),
//     comfortLevel: v.optional(v.number()),
//     funLevel: v.optional(v.number()),
//     sexNotes: v.optional(v.string()),
//     personalityNotes: v.optional(v.string()),
//     score: v.optional(v.number()),
//     anotherDate: v.optional(v.number()),
//     expectedGiftAmount: v.optional(v.number()),
//     giftAmount: v.optional(v.number()),
//   },
//   handler: async (
//     ctx,
//     {
//       dateId,
//       daddy,
//       daddyName,
//       date,
//       location,
//       startTime,
//       endTime,
//       comfortLevel,
//       funLevel,
//       sexNotes,
//       personalityNotes,
//       score,
//       anotherDate,
//       expectedGiftAmount,
//       giftAmount,
//     },
//   ) => {

//     await ctx.db.patch(dateId, {
//       mostRecentDate: date,
//     });
//   },
// });

export const deleteDate = mutation({
  args: { date: v.id('dates') },
  handler: async (ctx, { date }) => {
    await ctx.db.delete(date);
  },
});
