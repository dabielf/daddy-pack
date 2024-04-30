/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as allowance from "../allowance.js";
import type * as contacts from "../contacts.js";
import type * as daddies from "../daddies.js";
import type * as dates from "../dates.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  allowance: typeof allowance;
  contacts: typeof contacts;
  daddies: typeof daddies;
  dates: typeof dates;
  helpers: typeof helpers;
  http: typeof http;
  stripe: typeof stripe;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
