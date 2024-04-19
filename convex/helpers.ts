import { GenericMutationCtx, GenericQueryCtx } from 'convex/server';
import {} from './_generated/server';

export async function getConvexQueryUser(ctx: GenericQueryCtx<any>) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerk_id', identity.subject))
    .unique();

  if (!user) return null;

  return user;
}

export async function getConvexMutationUser(ctx: GenericMutationCtx<any>) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerk_id', identity.subject))
    .unique();

  if (!user) return null;

  if (user.email && user.name) return user._id;

  if (!user.email && identity.email) {
    await ctx.db.patch(user._id, {
      email: identity.email,
    });
  }

  if (!user.name && identity.name) {
    await ctx.db.patch(user._id, {
      name: identity.name,
    });
  }

  return user;
}
