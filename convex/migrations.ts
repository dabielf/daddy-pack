import { internalMutation } from "./_generated/server";
// import { internal } from './_generated/api';
// import {
//   updateDaddyLifetimeValue,
//   updateDaddyContactsData,
//   updateDaddyDatesData,
// } from './daddies';
//

// export const migrateDatesStatus = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const dates = await ctx.db.query("dates").collect();
//     dates.map(async (date) => {
//       const nonEmptyStatus = date.status ? date.status : "tentative";
//       const updatedStatus =
//         nonEmptyStatus === "scheduled" ? "tentative" : nonEmptyStatus;
//       ctx.db.patch(date._id, { status: updatedStatus });
//     });
//   },
// });

// export const migrateDatesAndContacts = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const dates = await ctx.db.query("dates").collect();
//     dates.map(async (date) => {
//       ctx.db.patch(date._id, { dateDaddy: date.daddy });
//     });
//     const contacts = await ctx.db.query("contacts").collect();
//     contacts.map(async (contact) => {
//       const daddy = await ctx.db.get(contact.daddy);
//       if (!daddy) return null;
//       ctx.db.patch(contact._id, {
//         contactDaddy: contact.daddy,
//         daddyName: daddy.name,
//       });
//     });
//   },
// });

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
