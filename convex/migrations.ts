// import { internalMutation } from './_generated/server';
// import { internal } from './_generated/api';
// import {
//   updateDaddyLifetimeValue,
//   updateDaddyContactsData,
//   updateDaddyDatesData,
// } from './daddies';

// export const migrateDaddies = internalMutation({
//   args: {},
//   handler: async ctx => {
//     const daddies = await ctx.db.query('daddies').collect();
//     daddies.map(async daddy => {
//       if (daddy.daddyInfos) {
//         await ctx.db.patch(daddy._id, {
//           profileLink: undefined,
//           imgUrl: undefined,
//           contactInfo: undefined,
//           location: undefined,
//           messagingApp: undefined,
//           initialContactDate: undefined,
//           notes: undefined,
//           earningsEstimate: undefined,
//           giftingMethod: undefined,
//           totalScheduledDates: undefined,
//           totalCompletedDates: undefined,
//           totalCanceledDates: undefined,
//           totalNoShowDates: undefined,
//         });
//         await updateDaddyLifetimeValue(ctx, { daddy: daddy._id });
//         await updateDaddyContactsData(ctx, { daddy: daddy._id });
//         await updateDaddyDatesData(ctx, { daddy: daddy._id });
//         return null;
//       }
//       const daddyInfos = await ctx.db.insert('daddyInfos', {
//         user: daddy.user,
//         daddy: daddy._id,
//         profileLink: daddy.profileLink,
//         imgUrl: daddy.imgUrl,
//         contactInfo: daddy.contactInfo,
//         location: daddy.location,
//         messagingApp: daddy.messagingApp,
//         initialContactDate: daddy.initialContactDate,
//         notes: daddy.notes,
//         earningsEstimate: daddy.earningsEstimate,
//         giftingMethod: daddy.giftingMethod,
//         totalScheduledDates: daddy.totalScheduledDates,
//         totalCompletedDates: daddy.totalCompletedDates,
//         totalCanceledDates: daddy.totalCanceledDates,
//         totalNoShowDates: daddy.totalNoShowDates,
//       });
//       await ctx.db.patch(daddy._id, {
//         daddyInfos,
//         profileLink: undefined,
//         imgUrl: undefined,
//         contactInfo: undefined,
//         location: undefined,
//         messagingApp: undefined,
//         initialContactDate: undefined,
//         notes: undefined,
//         earningsEstimate: undefined,
//         giftingMethod: undefined,
//         totalScheduledDates: undefined,
//         totalCompletedDates: undefined,
//         totalCanceledDates: undefined,
//         totalNoShowDates: undefined,
//       });

//       await updateDaddyLifetimeValue(ctx, { daddy: daddy._id });
//       await updateDaddyContactsData(ctx, { daddy: daddy._id });
//       await updateDaddyDatesData(ctx, { daddy: daddy._id });
//     });
//   },
// });
