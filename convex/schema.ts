import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_subscriptionId", ["subscriptionId"]),
  // daddies: SA profile link, photo, contact info, location, messaging app (off site), date of initial contact, notes, estimate for per meet earnings, link this to date log, vibe rating over text (can compare this later if/when I meet them in person)
  daddies: defineTable({
    user: v.id("users"),
    name: v.string(),
    profileLink: v.optional(v.string()),
    photo: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    location: v.optional(v.string()),
    messagingApp: v.optional(v.string()),
    initialContactDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    earningsEstimate: v.optional(v.number()),
    vibeRating: v.number(),
    lifetimeValue: v.number(),
  }),
  // Includes: SD name, date, location, time it starts, time it finishes, comfort level, fun level, sex notes, personality notes, score of how I felt leaving the date (good, not so good), score of how I’d feel about another date, gift amount
  sugarDates: defineTable({
    user: v.id("users"),
    daddy: v.id("daddies"),
    date: v.string(),
    location: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    comfortLevel: v.optional(v.number()),
    funLevel: v.optional(v.number()),
    sexNotes: v.optional(v.string()),
    personalityNotes: v.optional(v.string()),
    score: v.optional(v.number()),
    anotherDate: v.optional(v.number()),
    giftAmount: v.optional(v.number()),
  }),

  // contact: includes dateofcontact user id, daddy id and notes on the contact
  contact: defineTable({
    user: v.id("users"),
    daddy: v.id("daddies"),
    dateOfContact: v.string(),
    notes: v.string(),
  }),
});
