import { GenericMutationCtx, GenericQueryCtx } from 'convex/server';
import { ConvexError } from 'convex/values';
import {} from './_generated/server';

export async function getConvexQueryUser(ctx: GenericQueryCtx<any>) {
  const identity = await ctx.auth.getUserIdentity();
  console.log('identity', identity);
  if (!identity) {
    // throw new ConvexError('must be logged in');
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerk_id', identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError('user not found');
  }

  return user;
}

export async function getConvexMutationUser(ctx: GenericMutationCtx<any>) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    // throw new ConvexError('must be logged in');
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', q => q.eq('clerk_id', identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError('user not found');
  }

  if (user.email && user.name) return user;

  if (!user.email && identity.email) {
    await ctx.db.patch(user._id, {
      email: identity.email,
    });
  }

  if (!user.name && identity.givenName) {
    await ctx.db.patch(user._id, {
      name: identity.givenName,
    });
  }

  return user;
}
