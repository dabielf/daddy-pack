import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getConvexQueryUser, getConvexMutationUser } from './helpers';

export const getContact = query({
  args: { contact: v.id('contacts') },
  handler: async (ctx, { contact }) => {
    const contactData = await ctx.db.get(contact);
    if (!contactData) return null;
    const daddyData = await ctx.db.get(contactData.daddy);

    return {
      contact: contactData,
      daddy: daddyData,
    };
  },
});

export const getContacts = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db
      .query('contacts')
      .withIndex('by_date')
      .order('desc')
      .filter(q => q.eq(q.field('user'), user._id))
      .collect();
  },
});

export const createContact = mutation({
  args: {
    daddy: v.id('daddies'),
    daddyName: v.string(),
    date: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { daddy, daddyName, date, notes }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const contactId = await ctx.db.insert('contacts', {
      user: user._id,
      daddy,
      daddyName,
      date,
      notes,
    });

    await ctx.db.patch(daddy, {
      mostRecentContact: date,
    });

    return contactId;
  },
});

export const deleteDate = mutation({
  args: { contact: v.id('contacts') },
  handler: async (ctx, { contact }) => {
    await ctx.db.delete(contact);
  },
});
