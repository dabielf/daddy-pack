import { v } from 'convex/values';
import { isAfter, isBefore } from 'date-fns';
import { internalMutation, mutation, query } from './_generated/server';
import { getConvexMutationUser, getConvexQueryUser } from './helpers';
import { updateDatesDaddyNames } from './dates';
import { Id } from './_generated/dataModel';

export const deleteDaddy = mutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    await ctx.db.delete(daddy);
  },
});

export const getDaddy = query({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    return await ctx.db.get(daddy);
  },
});

export const getDaddyWithMetadata = query({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    let daddyRecord = await ctx.db.get(daddy);
    if (!daddyRecord) return null;
    if (daddyRecord.daddyInfos) {
      const daddyInfos = await ctx.db.get(daddyRecord.daddyInfos);
      daddyRecord = {
        ...daddyInfos,
        ...daddyRecord,
      };
    }

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

    const daddies = await ctx.db
      .query('daddies')
      .withIndex('by_user_archived', q =>
        q.eq('user', user._id).eq('archived', false),
      )
      .collect();

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

    const daddyInfos = await ctx.db.insert('daddyInfos', {
      user: user._id,
    });

    const daddyId = await ctx.db.insert('daddies', {
      user: user._id,
      name,
      vibeRating,
      lifetimeValue: 0,
      archived: false,
      daddyInfos,
    });

    await ctx.db.patch(daddyInfos, {
      daddy: daddyId,
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
    const daddyRecord = await ctx.db.get(daddy);
    if (!daddyRecord) return null;

    const nameChange = name && daddyRecord.name !== name;
    const vibeRatingChange =
      vibeRating && daddyRecord.vibeRating !== vibeRating;

    await ctx.db.patch(daddyRecord.daddyInfos, {
      profileLink,
      imgUrl,
      contactInfo,
      location,
      messagingApp,
      initialContactDate,
      notes,
      earningsEstimate,
      giftingMethod,
    });

    if (!nameChange && !vibeRatingChange) return daddyRecord._id;

    if (nameChange) {
      await updateDatesDaddyNames(ctx, { daddy, name });
    }

    await ctx.db.patch(daddy, {
      name,
      vibeRating,
    });
  },
});

export const updateDaddyLifetimeValue = internalMutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    const daddyRecord = await ctx.db.get(daddy);
    const dates = await ctx.db
      .query('dates')
      .withIndex('by_daddy', q => q.eq('daddy', daddy))
      .filter(q => q.eq(q.field('status'), 'completed'))
      .collect();

    let lifetimeValue = dates.reduce((acc, date) => {
      return acc + (date.giftAmount || 0);
    }, 0);

    if (daddyRecord?.allowance) {
      const allowance = await ctx.db.get(daddyRecord.allowance);
      lifetimeValue += allowance?.totalGiftAmount || 0;
    }

    return await ctx.db.patch(daddy, { lifetimeValue });
  },
});

export const updateDaddyContactsData = internalMutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    const contacts = await ctx.db
      .query('contacts')
      .withIndex('by_daddy', q => q.eq('daddy', daddy))
      .collect();

    const totalContacts = contacts.length;

    const mostRecentContact = contacts
      .filter(date => isBefore(new Date(date.date), new Date()))
      .sort((a, b) => b.date - a.date)[0];

    return await ctx.db.patch(daddy, {
      totalContacts,
      mostRecentContactId: mostRecentContact
        ? mostRecentContact._id
        : undefined,
      mostRecentContactDate: mostRecentContact
        ? mostRecentContact.date
        : undefined,
    });
  },
});

export const updateDaddyDatesData = internalMutation({
  args: { daddy: v.id('daddies') },
  handler: async (ctx, { daddy }) => {
    const daddyRecord = await ctx.db.get(daddy);
    if (!daddyRecord) return null;

    const dates = await ctx.db
      .query('dates')
      .withIndex('by_daddy', q => q.eq('daddy', daddy))
      .collect();

    const totalDates = dates.length;
    const totalScheduledDates = dates.filter(
      date => date.status === 'scheduled' || !date.status,
    ).length;
    const totalCompletedDates = dates.filter(
      date => date.status === 'completed',
    ).length;
    const totalCanceledDates = dates.filter(
      date => date.status === 'canceled',
    ).length;
    const totalNoShowDates = dates.filter(
      date => date.status === 'no-show',
    ).length;
    const mostRecentDate = dates
      .filter(date => isBefore(new Date(date.date), new Date()))
      .sort((a, b) => b.date - a.date)[0];
    const nextDate = dates
      .filter(date => isAfter(new Date(date.date), new Date()))
      .sort((a, b) => a.date - b.date)[0];

    await ctx.db.patch(daddyRecord.daddyInfos, {
      totalScheduledDates,
      totalCompletedDates,
      totalCanceledDates,
      totalNoShowDates,
    });

    return await ctx.db.patch(daddy, {
      totalDates,
      mostRecentDateId: mostRecentDate?._id || undefined,
      mostRecentDateDate: mostRecentDate?.date || undefined,
      mostRecentDate: undefined,
      nextDateId: nextDate?._id || undefined,
      nextDateDate: nextDate?.date || undefined,
    });
  },
});
