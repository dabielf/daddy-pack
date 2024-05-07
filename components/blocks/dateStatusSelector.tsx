"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { DateStatus } from "@/custom-types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateStatusSelectorProps {
  date: Doc<"dates">;
}

export function DateStatusSelector({ date }: DateStatusSelectorProps) {
  const updateDateStatus = useMutation(api.dates.updateDateStatus);

  function onStatusChange(status: DateStatus) {
    updateDateStatus({
      dateId: date._id,
      status,
    });
  }

  function getStatusBgColor(status: DateStatus) {
    switch (status) {
      case "tentative":
        return "opacity-80";
      case "confirmed":
        return "bg-blue-300/30";
      case "completed":
        return "bg-green-300/30";
      case "canceled":
        return "bg-red-300/30";
      case "no-show":
        return "bg-red-300/30";
      default:
        return "";
    }
  }

  const past = new Date(date.date).getTime() < new Date().getTime();
  return (
    <div
      className={cn(
        getStatusBgColor(date.status),
        "flex flex-row items-center gap-1 rounded-md pl-4",
      )}
    >
      <div className="text-sm font-medium">STATUS</div>
      <Select value={date.status || "tentative"} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[125px] border-0 shadow-none ring-transparent">
          <SelectValue placeholder="Select status:" />
        </SelectTrigger>
        <SelectContent className="opacity-100">
          <SelectGroup>
            <SelectLabel>Date Status</SelectLabel>
            <SelectItem value="tentative">TENTATIVE</SelectItem>
            <SelectItem value="confirmed" className="text-blue-900">
              CONFIRMED
            </SelectItem>
            {past && (
              <SelectItem value="completed" className="text-green-900">
                COMPLETED
              </SelectItem>
            )}
            <SelectItem value="canceled" className="text-red-900">
              CANCELED
            </SelectItem>
            {past && (
              <SelectItem value="no-show" className="text-red-900">
                NO SHOW
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
