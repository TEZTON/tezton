import { RequestAccessStatus } from "@/schema/requestAccess";
import { trpc } from "@/trpc";
import { useParams } from "next/navigation";

export default function RequestAccess() {
  const { companyId } = useParams();
  const { mutateAsync, isPending } = trpc.requestAccess.request.useMutation();
  const { data, isLoading } = trpc.requestAccess.status.useQuery({
    companyId: companyId as string,
  });
  const { requestAccess } = trpc.useUtils();

  const onClick = async () => {
    await mutateAsync({ companyId: companyId as string });
    await requestAccess.status.invalidate({ companyId: companyId as string });
  };

  const isDisabled =
    isLoading ||
    isPending ||
    data === RequestAccessStatus.Enum.pending ||
    data === RequestAccessStatus.Enum.denied;

  return (
    <div>
      <p>Request Access to this file.</p>

      <button
        className="btn btn-primary text-white"
        disabled={isDisabled}
        onClick={onClick}
      >
        Request access
      </button>

      {data && <p>Your status: {data}</p>}
    </div>
  );
}
