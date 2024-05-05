import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getConvexMutationUser, getConvexQueryUser } from "./helpers";
import { updateDaddyContactsData } from "./daddies";

export const getContact = query({
  args: { contact: v.id("contacts") },
  handler: async (ctx, { contact }) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    return await ctx.db.get(contact);
  },
});

export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db.query("contacts").withIndex("by_user").collect();
  },
});

export const createContact = mutation({
  args: {
    daddy: v.id("daddies"),
    date: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { daddy, date, notes }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const daddyData = await ctx.db.get(daddy);
    if (!daddyData) return null;

    const contactId = await ctx.db.insert("contacts", {
      user: user._id,
      daddy,
      contactDaddy: daddy,
      daddyName: daddyData.name,
      date,
      notes,
    });

    await updateDaddyContactsData(ctx, { daddy });

    return contactId;
  },
});

export const updateContact = mutation({
  args: {
    contact: v.id("contacts"),
    date: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { contact, date, notes }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    if (!date) {
      const contactId = await ctx.db.patch(contact, {
        notes,
      });
      return contactId;
    }

    const contactId = await ctx.db.patch(contact, {
      date,
      notes,
    });

    const contactData = await ctx.db.get(contact);
    if (!contactData) return contactId;
    await updateDaddyContactsData(ctx, {
      daddy: contactData.contactDaddy
        ? contactData.contactDaddy
        : contactData.daddy,
    });

    return contactId;
  },
});

export const deleteContact = mutation({
  args: { contact: v.id("contacts") },
  handler: async (ctx, { contact }) => {
    await ctx.db.delete(contact);
    const contactData = await ctx.db.get(contact);
    if (!contactData) return null;
    await updateDaddyContactsData(ctx, {
      daddy: contactData.contactDaddy
        ? contactData.contactDaddy
        : contactData.daddy,
    });
  },
});

export const updateContactsDaddyNames = internalMutation({
  args: { daddy: v.id("daddies"), name: v.string() },
  handler: async (ctx, { daddy, name }) => {
    const daddyContacts = await ctx.db
      .query("contacts")
      .withIndex("by_daddy", (q) => q.eq("daddy", daddy))
      .collect();

    daddyContacts.map(async (contact) => {
      await ctx.db.patch(contact._id, {
        daddyName: name,
      });
    });
  },
});
