import { v } from 'convex/values';
import { isAfter, isBefore } from 'date-fns';
import { mutation, query } from './_generated/server';
import { getConvexMutationUser, getConvexQueryUser } from './helpers';
import { updateDaddyLifetimeValue } from './daddies';

export const deleteAllowance = mutation({
  args: { allowance: v.id('allowances') },
  handler: async (ctx, { allowance }) => {
    const user = await getConvexMutationUser(ctx);
    if (!user) return null;
    const allowanceData = await ctx.db.get(allowance);
    if (!allowanceData) return null;
    const daddy = await ctx.db.get(allowanceData.daddy);
    if (daddy) {
      await ctx.db.patch(daddy?._id, {
        allowance: undefined,
      });
    }
    await ctx.db.delete(allowance);
  },
});

export const deleteAllowancePayment = mutation({
  args: {
    allowancePayment: v.id('allowancePayments'),
    daddy: v.id('daddies'),
  },
  handler: async (ctx, { allowancePayment, daddy }) => {
    const user = await getConvexMutationUser(ctx);
    if (!user) return null;

    const allowancePaymentData = await ctx.db.get(allowancePayment);
    if (!allowancePaymentData) return null;

    const allowance = await ctx.db.get(allowancePaymentData.allowanceId);
    if (allowance) {
      await ctx.db.patch(allowance._id, {
        numberOfPayments: allowance.numberOfPayments - 1,
        totalGiftAmount:
          allowance.totalGiftAmount - allowancePaymentData.amount,
      });
    }

    await ctx.db.delete(allowancePayment);

    await updateDaddyLifetimeValue(ctx, { daddy });
  },
});

export const getAllowance = query({
  args: { allowance: v.id('allowances') },
  handler: async (ctx, { allowance }) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    return await ctx.db.get(allowance);
  },
});

export const getAllowanceWithPayments = query({
  args: { allowance: v.id('allowances') },
  handler: async (ctx, { allowance }) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    const allowanceData = await ctx.db.get(allowance);
    const allowancePayments = await ctx.db
      .query('allowancePayments')
      .withIndex('by_allowanceId', q => q.eq('allowanceId', allowance))
      .collect();

    return {
      allowance: allowanceData,
      allowancePayments: allowancePayments.sort((a, b) => b.date - a.date),
    };
  },
});

export const getAllowancePayments = query({
  args: {},
  handler: async ctx => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    const allowancePayments = await ctx.db
      .query('allowancePayments')
      .withIndex('by_user', q => q.eq('user', user._id))
      .collect();

    return allowancePayments.sort((a, b) => b.date - a.date);
  },
});

export const createAllowance = mutation({
  args: {
    daddy: v.id('daddies'),
    intervalInDays: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, { daddy, intervalInDays, amount }) => {
    const user = await getConvexMutationUser(ctx);

    if (!user) return null;

    const allowanceId = await ctx.db.insert('allowances', {
      user: user._id,
      daddy,
      intervalInDays,
      amount,
      totalGiftAmount: 0,
      numberOfPayments: 0,
    });

    await ctx.db.patch(daddy, {
      allowance: allowanceId,
    });

    return allowanceId;
  },
});

export const getAllowancePayment = query({
  args: { allowancePayment: v.id('allowancePayments') },
  handler: async (ctx, { allowancePayment }) => {
    const user = await getConvexQueryUser(ctx);

    if (!user) return null;
    return await ctx.db.get(allowancePayment);
  },
});

export const createAllowancePayment = mutation({
  args: {
    allowance: v.id('allowances'),
    daddy: v.id('daddies'),
    date: v.number(),
    amount: v.number(),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, { allowance, daddy, date, amount, paymentMethod }) => {
    const user = await getConvexMutationUser(ctx);
    if (!user) return null;

    const allowanceData = await ctx.db.get(allowance);
    if (!allowanceData) return null;

    const allowancePaymentId = await ctx.db.insert('allowancePayments', {
      allowanceId: allowance,
      user: user._id,
      daddy: daddy,
      date,
      amount,
      paymentMethod,
    });

    const isThisLatestPayment = isAfter(
      new Date(date),
      new Date(allowanceData.lastPaymentDate || 0),
    );

    const lastPaymentDate = isThisLatestPayment
      ? date
      : allowanceData.lastPaymentDate;

    const lastPaymentId = isThisLatestPayment
      ? allowancePaymentId
      : allowanceData.lastPaymentId;

    await ctx.db.patch(allowance, {
      numberOfPayments: allowanceData.numberOfPayments + 1,
      totalGiftAmount: allowanceData.totalGiftAmount + amount,
      lastPaymentDate,
      lastPaymentId,
    });

    await updateDaddyLifetimeValue(ctx, { daddy });

    return allowancePaymentId;
  },
});

export const updateAllowancePayment = mutation({
  args: {
    allowancePayment: v.id('allowancePayments'),
    daddy: v.id('daddies'),
    date: v.optional(v.number()),
    amount: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { allowancePayment, daddy, date, amount, paymentMethod },
  ) => {
    const user = await getConvexMutationUser(ctx);
    if (!user) return null;

    const allowancePaymentData = await ctx.db.get(allowancePayment);
    if (!allowancePaymentData) return null;

    const allowance = await ctx.db.get(allowancePaymentData.allowanceId);
    if (
      allowance &&
      amount !== undefined &&
      amount !== allowancePaymentData.amount
    ) {
      await ctx.db.patch(allowance._id, {
        totalGiftAmount:
          allowance.totalGiftAmount - allowancePaymentData.amount + amount,
      });
    }

    await ctx.db.patch(allowancePayment, {
      date,
      amount,
      paymentMethod,
    });

    await updateDaddyLifetimeValue(ctx, { daddy });
  },
});
