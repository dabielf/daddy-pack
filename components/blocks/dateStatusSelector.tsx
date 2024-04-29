'use client';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { cn } from '@/lib/utils';
import { DateStatus } from '@/custom-types';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateStatusSelectorProps {
  date: Doc<'dates'>;
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
      case 'scheduled':
        return 'bg-blue-300/30';
      case 'completed':
        return 'bg-green-300/30';
      case 'canceled':
        return 'bg-red-300/30';
      case 'no-show':
        return 'bg-red-300/30';
      default:
        return '';
    }
  }

  return (
    <div
      className={cn(
        getStatusBgColor(date.status || 'scheduled'),
        'flex flex-row gap-1 items-center px-4 rounded-md shadow',
      )}
    >
      <div className="text-sm font-semibold underline">STATUS</div>
      <Select value={date.status || 'scheduled'} onValueChange={onStatusChange}>
        <SelectTrigger className="ring-transparent border-0 shadow-none w-[125px]">
          <SelectValue placeholder="Select status:" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Date Status</SelectLabel>
            <SelectItem value="scheduled">SCHEDULED</SelectItem>
            <SelectItem value="completed">COMPLETED</SelectItem>
            <SelectItem value="canceled">CANCELED</SelectItem>
            <SelectItem value="no-show">NO SHOW</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
