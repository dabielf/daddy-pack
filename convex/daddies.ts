import { v } from 'convex/values';
import { isAfter, isBefore } from 'date-fns';
import { mutation, query } from './_generated/server';
import { getConvexMutationUser, getConvexQueryUser } from './helpers';

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

export const getArchivedDaddies = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db
      .query('daddies')
      .withIndex('by_user_archived', q =>
        q.eq('user', user._id).eq('archived', true),
      )
      .collect();
  },
});

export const getDaddies = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    const daddies = await Promise.all(
      (
        await ctx.db
          .query('daddies')
          .withIndex('by_user_archived', q =>
            q.eq('user', user._id).eq('archived', false),
          )
          .collect()
      ).map(async daddy => {
        const datesData = await ctx.db
          .query('dates')
          .withIndex('by_daddy', q => q.eq('daddy', daddy._id))
          .collect();

        const contacts = await ctx.db
          .query('contacts')
          .withIndex('by_daddy', q => q.eq('daddy', daddy._id))
          .collect();

        const dates = datesData.filter(date => date.status !== 'canceled');

        // count how many dates have the status of 'scheduled'
        const scheduledDates = dates.filter(
          date => date.status === 'scheduled' || !date.status,
        ).length;
        const completedDates = dates.filter(
          date => date.status === 'completed',
        ).length;
        const canceledDates = datesData.filter(
          date => date.status === 'canceled',
        ).length;

        const mostRecentDate = dates
          .filter(date => isBefore(new Date(date.date), new Date()))
          .sort((a, b) => b.date - a.date)[0];

        const nextDate = dates
          .filter(date => isAfter(new Date(date.date), new Date()))
          .sort((a, b) => a.date - b.date)[0];

        const mostRecentContact = contacts
          .filter(date => isBefore(new Date(date.date), new Date()))
          .sort((a, b) => b.date - a.date)[0];

        const lifetimeValue = dates.reduce((acc, date) => {
          return acc + (date.giftAmount || 0);
        }, 0);

        return {
          ...daddy,
          mostRecentDate: mostRecentDate ? mostRecentDate.date : undefined,
          mostRecentContact: mostRecentContact
            ? mostRecentContact.date
            : undefined,
          nextDate: nextDate ? nextDate.date : undefined,
          lifetimeValue,
          numDates: dates.length,
          numContacts: contacts.length,
          scheduledDates,
          completedDates,
          canceledDates,
        };
      }),
    );

    // if (orderType === 'lifetimeValue') {
    //   return daddies.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
    // }
    // if (orderType === 'mostRecentDate') {
    //   return daddies.sort(
    //     (a, b) => (b.mostRecentDate || 0) - (a.mostRecentDate || 0),
    //   );
    // }
    return daddies;
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
      archived: false,
    });

    return daddyId;
  },
});

export const archiveDaddy = mutation({
  args: { daddy: v.id('daddies'), archivedReason: v.optional(v.string()) },
  handler: async (ctx, { daddy, archivedReason }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;
    return await ctx.db.patch(daddy, { archived: true, archivedReason });
  },
});

export const unarchiveDaddy = mutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;
    return await ctx.db.patch(daddy, {
      archived: false,
      archivedReason: undefined,
    });
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
    giftingMethod: v.optional(v.string()),
    vibeRating: v.optional(v.number()),
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
      giftingMethod,
      vibeRating,
    },
  ) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;
    return await ctx.db.patch(daddy, {
      name,
      profileLink,
      imgUrl,
      contactInfo,
      location,
      messagingApp,
      initialContactDate,
      notes,
      earningsEstimate,
      giftingMethod,
      vibeRating,
    });
  },
});
