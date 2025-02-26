"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { AddAllowancePaymentButton } from "@/components/blocks/newAllowancePaymentDialog";
import { AllowancePaymentsTable } from "@/components/blocks/allowancePaymentsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AllowancePage({
  params,
}: {
  params: { id: Id<"daddies">; allowanceId: Id<"allowances"> };
}) {
  const daddy = useQuery(api.daddies.getDaddy, {
    daddy: params.id,
  });
  const allowanceData = useQuery(api.allowances.getAllowanceWithPayments, {
    allowance: params.allowanceId,
  });

  if (!daddy || !allowanceData?.allowance) return null;

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="font-semibold text-foreground md:text-xl">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/daddies"
              className="decoration-primary hover:underline"
            >
              Daddies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/daddies/${params.id}`}
              className="decoration-primary hover:underline"
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
      <div className="flex flex-row justify-end">
        {/* <h1 className="text-3xl font-semibold">
          Allowance Plan with
          <Link
            href={`/daddies/${daddy._id}`}
            className="ml-1 decoration-primary hover:underline"
          >
            {daddy.name}
          </Link>
        </h1> */}
        <AddAllowancePaymentButton
          daddy={daddy}
          allowance={allowanceData.allowance}
        />
      </div>
      <div className="grid-cols-2">
        <div>
          <AllowancePaymentsTable
            daddy={daddy}
            allowance={allowanceData.allowance}
            payments={allowanceData.allowancePayments}
          />
        </div>
      </div>
    </div>
  );
}
