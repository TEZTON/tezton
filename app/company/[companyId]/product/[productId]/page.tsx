"use client";

import ProjectFunctionalityDeliverableArea from "@/components/aside/ProjectFunctionalityDeliverable";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { productId } = useParams();
  return (
    <div className="flex">
      <ProjectFunctionalityDeliverableArea productId={productId as string} />
      RESTANTE.......
    </div>
  );
}
