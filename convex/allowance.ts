import { v } from 'convex/values';
import { isAfter, isBefore } from 'date-fns';
import { mutation, query } from './_generated/server';
import { getConvexMutationUser, getConvexQueryUser } from './helpers';

export const deleteAllowance = mutation({
  args: { allowance: v.id('allowances') },
  handler: async (ctx, { allowance }) => {
    await ctx.db.delete(allowance);
  },
});

export const getAllowance = query({
  args: { allowance: v.id('allowances') },
  handler: async (ctx, { allowance }) => {
    return await ctx.db.get(allowance);
  },
});
