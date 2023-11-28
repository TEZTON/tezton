"use client";

import ImageRender from "@/components/ImageRender";
import Self from "@/components/Self";
import { trpc } from "@/trpc";
import Image from "next/image";
import Link from "next/link";

export default function SettingsPage() {
  const { data } = trpc.requestAccess.allRequests.useQuery();
  const { mutateAsync: acceptAsync, isPending: acceptIsPending } =
    trpc.requestAccess.accept.useMutation();
  const { mutateAsync: rejectAsync, isPending: rejectIsPending } =
    trpc.requestAccess.reject.useMutation();
  const { requestAccess } = trpc.useUtils();

  const isDisabled = acceptIsPending || rejectIsPending;

  return (
    <main className="flex min-h-full overflow-y-auto overflow-x-hidden">
      <div className="w-14 flex flex-col border-r">
        <Link href="/">
          <Image
            alt="Image"
            src="/isotipo_png.png"
            className="w-14 h-[58px] min-h-[54px] min-w-[54px] p-3 border-b"
            width={56}
            height={58}
          />
        </Link>
      </div>

      <div className="w-[calc(100%-55px)] ml-4">
        <Self />
        <div className="w-full grid grid-cols-2 justify-between gap-14 ">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map(({ firstName, lastName, id, status, companyId }) => (
                <tr key={id}>
                  <td className="flex items-center gap-2">
                    <ImageRender name={firstName} />
                    <p>
                      {firstName} {lastName}
                    </p>
                  </td>
                  <td>{status}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-success text-white"
                      disabled={isDisabled}
                      onClick={async () => {
                        await acceptAsync({ companyId, userId: id });
                        await requestAccess.allRequests.invalidate();
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-error text-white"
                      disabled={isDisabled}
                      onClick={async () => {
                        await rejectAsync({ companyId, userId: id });
                        await requestAccess.allRequests.invalidate();
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
