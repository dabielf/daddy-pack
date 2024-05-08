import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getConvexQueryUser, getConvexMutationUser } from "./helpers";
import { updateDaddyDatesData, updateDaddyLifetimeValue } from "./daddies";

export const getDate = query({
  args: { date: v.id("dates") },
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
  handler: async (ctx) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;

    return await ctx.db
      .query("dates")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();
  },
});

export const createDate = mutation({
  args: {
    daddy: v.id("daddies"),
    daddyName: v.string(),
    date: v.number(),
    status: v.optional(v.union(v.literal("tentative"), v.literal("confirmed"))),
  },
  handler: async (ctx, { daddy, daddyName, date, status }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const dateId = await ctx.db.insert("dates", {
      user: user._id,
      daddy,
      dateDaddy: daddy,
      daddyName,
      date,
      status: status || "tentative",
    });

    await updateDaddyDatesData(ctx, { daddy });

    return dateId;
  },
});

export const cancelDate = mutation({
  args: { dateId: v.id("dates") },
  handler: async (ctx, { dateId }) => {
    await ctx.db.patch(dateId, {
      status: "canceled",
    });

    const dateData = await ctx.db.get(dateId);
    if (!dateData) return null;
    await updateDaddyDatesData(ctx, { daddy: dateData.daddy });
  },
});

export const updateDateStatus = mutation({
  args: {
    dateId: v.id("dates"),
    status: v.union(
      v.literal("tentative"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("canceled"),
      v.literal("no-show"),
    ),
  },
  handler: async (ctx, { dateId, status }) => {
    await ctx.db.patch(dateId, {
      status,
    });

    const dateData = await ctx.db.get(dateId);
    if (!dateData) return null;
    await updateDaddyDatesData(ctx, { daddy: dateData.daddy });
  },
});

export const updateDate = mutation({
  args: {
    dateId: v.id("dates"),
    date: v.optional(v.number()),
    location: v.optional(v.string()),
    dateDuration: v.optional(v.number()),
    comfortLevel: v.optional(v.number()),
    funLevel: v.optional(v.number()),
    notes: v.optional(v.string()),
    dateRating: v.optional(v.number()),
    expectedGiftAmount: v.optional(v.number()),
    giftAmount: v.optional(v.number()),
    status: v.union(
      v.literal("tentative"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("canceled"),
      v.literal("no-show"),
    ),
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

    const dateData = await ctx.db.get(dateId);
    if (!dateData) return null;
    if (status == "completed") {
      await updateDaddyLifetimeValue(ctx, {
        daddy: dateData.daddy,
      });
    }
    await updateDaddyDatesData(ctx, { daddy: dateData.daddy });
  },
});

export const deleteDate = mutation({
  args: { date: v.id("dates") },
  handler: async (ctx, { date }) => {
    await ctx.db.delete(date);
    const dateData = await ctx.db.get(date);
    if (!dateData) return null;

    return await updateDaddyDatesData(ctx, { daddy: dateData.daddy });
  },
});

export const updateDatesDaddyNames = internalMutation({
  args: { daddy: v.id("daddies"), name: v.string() },
  handler: async (ctx, { daddy, name }) => {
    const daddyDates = await ctx.db
      .query("dates")
      .withIndex("by_daddy", (q) => q.eq("daddy", daddy))
      .collect();

    daddyDates.map(async (date) => {
      await ctx.db.patch(date._id, {
        daddyName: name,
      });
    });
  },
});
