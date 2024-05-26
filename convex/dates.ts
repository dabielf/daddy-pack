import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getConvexQueryUser, getConvexMutationUser } from "./helpers";
import { updateDaddyDatesData, updateDaddyLifetimeValue } from "./daddies";
import { addUserEvent } from "./users";

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
    await addUserEvent(ctx, {
      userId: user._id,
      eventDaddyId: daddy,
      daddyName: daddyName,
      eventRefDate: date,
      eventType: status == "tentative" ? "dateScheduled" : "dateConfirmed",
      eventRef: dateId,
    });

    return dateId;
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
    const dateRecord = await ctx.db.get(dateId);
    if (!dateRecord) return null;
    await ctx.db.patch(dateId, {
      status,
    });
    if (status == "confirmed") {
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventType: "dateConfirmed",
        eventRef: dateId,
      });
    }
    if (status == "completed") {
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventType: "dateProcessed",
        eventRef: dateId,
      });
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventDate: dateRecord.date,
        eventType: "date",
        eventRef: dateId,
      });
    }
    if (status == "canceled") {
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventType: "dateCanceled",
        eventRef: dateId,
      });
    }
    if (status == "no-show") {
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventType: "dateNoShow",
        eventRef: dateId,
      });
    }

    await updateDaddyDatesData(ctx, { daddy: dateRecord.daddy });
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
    const dateRecord = await ctx.db.get(dateId);
    if (!dateRecord) return null;

    if (status == "completed") {
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: date,
        eventType: "dateProcessed",
        eventRef: dateId,
      });
      await addUserEvent(ctx, {
        userId: dateRecord.user,
        eventDaddyId: dateRecord.daddy,
        daddyName: dateRecord.daddyName,
        eventRefDate: dateRecord.date,
        eventDate: dateRecord.date,
        eventType: "date",
        eventRef: dateId,
      });
    }

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
