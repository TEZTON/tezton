"use client";
import CompanyPageSidebar from "@/components/sidebar/CompanyPage";
import { trpc } from "@/trpc";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CompanyTemplate({ children }: PropsWithChildren) {
  const { companyId } = useParams();
  const { isLoading, isError, data } = trpc.companies.byId.useQuery({
    companyId: companyId as string,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <>
        <CompanyPageSidebar name="ERROR" id="ERROR" />
        {isError && <div>NOT ALLOWED</div>}
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <CompanyPageSidebar name={data.name} id={data.id} />
      {children}
    </>
  );
}
