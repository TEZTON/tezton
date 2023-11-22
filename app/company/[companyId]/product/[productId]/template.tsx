"use client";
import ProjectFunctionalityDeliverableArea from "@/components/aside/ProjectFunctionalityDeliverable";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CompanyTemplate({ children }: PropsWithChildren) {
  const { productId, companyId } = useParams();
  return (
    <>
      <ProjectFunctionalityDeliverableArea
        productId={productId as string}
        companyId={companyId as string}
      />
      {children}
    </>
  );
}
