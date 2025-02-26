import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerk_id: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    endsOn: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    // variable to stock money earned when a date is deleted but it still earned money
    leftoverEarnings: v.optional(v.number()),
    archivedDaddiesEarnings: v.optional(v.number()),
    userSettings: v.optional(v.id("userSettings")),
  })
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_clerk_id", ["clerk_id"]),
  userSettings: defineTable({
    daysBeforeContact: v.optional(v.number()),
  }),
  apiKeys: defineTable({
    key: v.string(),
    userId: v.id("users"),
    title: v.string(),
    uses: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_userId", ["userId"]),

  // daddies: SA profile link, photo, contact info, location, messaging app (off site), date of initial contact, notes, estimate for per meet earnings, link this to date log, vibe rating over text (can compare this later if/when I meet them in person)
  daddies: defineTable({
    user: v.id("users"),
    name: v.string(),
    daddyInfos: v.id("daddyInfos"),
    vibeRating: v.number(),
    isFavorite: v.optional(v.boolean()),
    lifetimeValue: v.number(),
    totalDates: v.optional(v.number()),
    mostRecentDate: v.optional(v.number()),
    mostRecentDateId: v.optional(v.id("dates")),
    mostRecentDateDate: v.optional(v.number()),
    nextDateId: v.optional(v.id("dates")),
    nextDateDate: v.optional(v.number()),
    totalContacts: v.optional(v.number()),
    mostRecentContactId: v.optional(v.id("contacts")),
    mostRecentContactDate: v.optional(v.number()),
    allowance: v.optional(v.id("allowances")),
    allowanceAlert: v.optional(v.boolean()),
    daysToContact: v.optional(v.number()),
    snooze: v.optional(v.boolean()),
    unsnoozeScheduled: v.optional(v.id("_scheduled_functions")),
    unsnoozeDate: v.optional(v.number()),
    archived: v.boolean(),
    archivedReason: v.optional(v.string()),
  })
    .index("by_user", ["user"])
    .index("by_name", ["name"])
    .index("by_user_archived", ["user", "archived"]),
  daddyInfos: defineTable({
    user: v.id("users"),
    daddy: v.optional(v.id("daddies")),
    profileLink: v.optional(v.string()),
    imgUrl: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    location: v.optional(v.string()),
    messagingApp: v.optional(v.string()),
    birthdayDate: v.optional(v.number()),
    initialContactDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    earningsEstimate: v.optional(v.number()),
    giftingMethod: v.optional(v.string()),
    totalScheduledDates: v.optional(v.number()),
    totalCompletedDates: v.optional(v.number()),
    totalCanceledDates: v.optional(v.number()),
    totalNoShowDates: v.optional(v.number()),
  })
    .index("by_user", ["user"])
    .index("by_daddy", ["daddy"]),
  allowances: defineTable({
    daddy: v.id("daddies"),
    user: v.id("users"),
    lastPaymentDate: v.optional(v.number()),
    lastPaymentId: v.optional(v.id("allowancePayments")),
    intervalInDays: v.number(),
    amount: v.number(),
    totalGiftAmount: v.number(),
    numberOfPayments: v.number(),
  })
    .index("by_daddy", ["daddy"])
    .index("by_user", ["user"]),
  allowancePayments: defineTable({
    allowanceId: v.id("allowances"),
    user: v.id("users"),
    daddy: v.id("daddies"),
    date: v.number(),
    amount: v.number(),
    paymentMethod: v.optional(v.string()),
  })
    .index("by_allowanceId", ["allowanceId"])
    .index("by_user", ["user"]),

  // Includes: SD name, date, location, time it starts, time it finishes, comfort level, fun level, sex notes, personality notes, score of how I felt leaving the date (good, not so good), score of how I’d feel about another date, gift amount
  dates: defineTable({
    user: v.id("users"),
    daddy: v.id("daddies"),
    dateDaddy: v.optional(v.id("daddies")),
    daddyName: v.optional(v.string()),
    date: v.number(),
    birthday: v.optional(v.number()),
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
    archived: v.optional(v.boolean()),
  })
    .index("by_user", ["user"])
    .index("by_daddy", ["daddy"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_giftAmount", ["giftAmount"])
    .index("by_user_status", ["user", "status"]),
  // Includes: user, daddy, date, notes
  contacts: defineTable({
    user: v.id("users"),
    daddy: v.id("daddies"),
    contactDaddy: v.optional(v.id("daddies")),
    daddyName: v.optional(v.string()),
    date: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["user"])
    .index("by_daddy", ["daddy"])
    .index("by_date", ["date"]),
  events: defineTable({
    userId: v.id("users"),
    eventDaddyId: v.optional(v.id("daddies")),
    daddyName: v.optional(v.string()),
    eventDate: v.number(),
    eventRefDate: v.optional(v.number()),
    eventType: v.union(
      v.literal("contact"),
      v.literal("dateScheduled"),
      v.literal("dateConfirmed"),
      v.literal("dateProcessed"),
      v.literal("date"),
      v.literal("dateCanceled"),
      v.literal("dateNoShow"),
      v.literal("addDaddy"), //TODO
      v.literal("archiveDaddy"), //TODO
      v.literal("unarchiveDaddy"), //TODO
      v.literal("startAllowance"), //TODO
      v.literal("stopAllowance"), //TODO
      v.literal("allowanceGifted"), //TODO
    ),
    eventRef: v.optional(v.union(v.id("dates"), v.id("contacts"))),
  })
    .index("by_userId", ["userId"])
    .index("by_eventDate", ["eventDate"])
    .index("by_userId_eventDate", ["userId", "eventDate"])
    .index("by_eventRef", ["eventRef"]),
});
