"use client";

import ProjectExpanded from "@/components/aside/ProjectExpanded";
import ProjectFunctionalityDeliverableArea from "@/components/aside/ProjectFunctionalityDeliverable";
import Timeline from "@/components/timeline";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { productId } = useParams();
  return (
    <div className="flex w-full">
      <ProjectFunctionalityDeliverableArea productId={productId as string} />
      <div className="w-[calc(100%-700px)]">
        <Timeline />
      </div>
      <ProjectExpanded />
    </div>
  );
}
