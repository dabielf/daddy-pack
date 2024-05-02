'use client';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { AddAllowancePaymentButton } from '@/components/blocks/newAllowancePaymentDialog';
import { AllowancePaymentsTable } from '@/components/blocks/allowancePaymentsTable';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AllowancePage({
  params,
}: {
  params: { id: Id<'daddies'>; allowanceId: Id<'allowances'> };
}) {
  const daddy = useQuery(api.daddies.getOnlyDaddy, {
    daddy: params.id,
  });
  const allowanceData = useQuery(api.allowances.getAllowanceWithPayments, {
    allowance: params.allowanceId,
  });

  if (!daddy || !allowanceData?.allowance) return null;

  return (
    <div className="flex flex-col w-full h-full">
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="md:text-xl font-semibold text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/daddies"
              className="hover:underline decoration-primary"
            >
              Daddies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/daddies/${params.id}`}
              className="hover:underline decoration-primary"
            >
              {daddy.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Allowance Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">
          Allowance Plan with
          <Link
            href={`/daddies/${daddy._id}`}
            className="ml-1 hover:underline decoration-primary"
          >
            {daddy.name}
          </Link>
        </h1>
        <AddAllowancePaymentButton
          daddy={daddy}
          allowance={allowanceData.allowance}
        />
      </div>
      <div className="grid-cols-2">
        <div>
          {/* <div>
            <pre>{JSON.stringify(allowanceData, null, 2)}</pre>
          </div> */}
          <AllowancePaymentsTable
            daddy={daddy}
            allowance={allowanceData.allowance}
            payments={allowanceData.allowancePayments}
          />
        </div>
        {/* <div>
          <h2>Daddy</h2>
          <pre>{JSON.stringify(daddy, null, 2)}</pre>
        </div> */}
      </div>
    </div>
  );
}
