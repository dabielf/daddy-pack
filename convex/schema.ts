import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

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
    userSettings: v.optional(v.id('userSettings')),
  })
    .index('by_subscriptionId', ['subscriptionId'])
    .index('by_clerk_id', ['clerk_id']),
  userSettings: defineTable({
    daysBeforeContact: v.optional(v.number()),
  }),

  // daddies: SA profile link, photo, contact info, location, messaging app (off site), date of initial contact, notes, estimate for per meet earnings, link this to date log, vibe rating over text (can compare this later if/when I meet them in person)
  daddies: defineTable({
    user: v.id('users'),
    name: v.string(),
    profileLink: v.optional(v.string()),
    imgUrl: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    location: v.optional(v.string()),
    messagingApp: v.optional(v.string()),
    initialContactDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    earningsEstimate: v.optional(v.number()),
    vibeRating: v.number(),
    isFavorite: v.optional(v.boolean()),
    giftingMethod: v.optional(v.string()),
    lifetimeValue: v.number(),
    mostRecentDate: v.optional(v.number()),
    mostRecentContact: v.optional(v.number()),
    allowance: v.optional(v.boolean()),
    allowanceAmount: v.optional(v.number()),
    allowanceInterval: v.optional(v.number()),
    archived: v.boolean(),
    archivedReason: v.optional(v.string()),
  })
    .index('by_user', ['user'])
    .index('by_name', ['name'])
    .index('by_user_archived', ['user', 'archived']),
  allowance: defineTable({
    daddy: v.id('daddies'),
    amount: v.number(),
    paid: v.optional(v.boolean()),
  }).index('by_daddy', ['daddy']),

  // Includes: SD name, date, location, time it starts, time it finishes, comfort level, fun level, sex notes, personality notes, score of how I felt leaving the date (good, not so good), score of how I’d feel about another date, gift amount
  dates: defineTable({
    user: v.id('users'),
    daddy: v.id('daddies'),
    daddyName: v.optional(v.string()),
    date: v.number(),
    location: v.optional(v.string()),
    dateDuration: v.optional(v.number()),
    comfortLevel: v.optional(v.number()),
    funLevel: v.optional(v.number()),
    notes: v.optional(v.string()),
    dateRating: v.optional(v.number()),
    expectedGiftAmount: v.optional(v.number()),
    giftAmount: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('scheduled'),
        v.literal('completed'),
        v.literal('canceled'),
        v.literal('no-show'),
      ),
    ),
    archived: v.optional(v.boolean()),
  })
    .index('by_user', ['user'])
    .index('by_daddy', ['daddy'])
    .index('by_date', ['date'])
    .index('by_status', ['status'])
    .index('by_giftAmount', ['giftAmount']),
  // Includes: user, daddy, date, notes
  contacts: defineTable({
    user: v.id('users'),
    daddy: v.id('daddies'),
    date: v.number(),
    notes: v.optional(v.string()),
  })
    .index('by_user', ['user'])
    .index('by_daddy', ['daddy'])
    .index('by_date', ['date']),
});
