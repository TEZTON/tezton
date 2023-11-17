"use client";
import { COMPANY_KEYS, getCompanyByIdApi } from "@/api/company";
import CompanyPageSidebar from "@/components/sidebar/CompanyPage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CompanyTemplate({ children }: PropsWithChildren) {
  const { companyId } = useParams();
  const { isLoading, isError, data } = useQuery({
    queryKey: [COMPANY_KEYS.getCompanyById],
    queryFn: () => getCompanyByIdApi(companyId as string),
    enabled: typeof companyId === "string",
    retry: false,
  });

  if (isLoading) {
    return <div>...Loading</div>;
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
