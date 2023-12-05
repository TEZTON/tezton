"use client";
import RequestAccess from "@/components/company/RequestAccess";
import AllProductsAside from "@/components/product/AllProductsAside";
import { trpc } from "@/trpc";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export default function CompanyTemplate({ children }: PropsWithChildren) {
  const { companyId } = useParams();
  const { isLoading, isError, data } = trpc.companies.byId.useQuery(
    {
      companyId: companyId as string,
    },
    { retry: false }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <>
        <AllProductsAside name="ERROR" id="ERROR" />
        {isError && (
          <div>
            <RequestAccess />
          </div>
        )}
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <AllProductsAside
        name={data.name}
        id={data.id}
        companyImageUrl={data.companyImageUrl}
      />
      {children}
    </>
  );
}
