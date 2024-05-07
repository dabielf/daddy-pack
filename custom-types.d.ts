import { Doc } from "@/convex/_generated/dataModel";

declare type DateStatus =
  | "tentative"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no-show";

declare type DaddyWithInfos = Doc<"daddies"> & {
  profileLink?: string;
  imgUrl?: string;
  contactInfo?: string;
  location?: string;
  birthdayDate?: number;
  messagingApp?: string;
  initialContactDate?: number;
  notes?: string;
  earningsEstimate?: number;
  giftingMethod?: string;
  totalScheduledDates?: number;
  totalCompletedDates?: number;
  totalCanceledDates?: number;
  totalNoShowDates?: number;
};
