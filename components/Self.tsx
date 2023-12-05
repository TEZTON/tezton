import { trpc } from "@/trpc";
import ImageRender from "./ImageRender";
import Link from "next/link";

export default function Self() {
  const { data, isLoading } = trpc.users.myself.useQuery();

  if (isLoading || !data) {
    return null;
  }
  return (
    <div className="py-4 border-b mb-4 flex px-10">
      <Link href="/settings" className="ml-auto">
        <p>
          <ImageRender name={data.firstName} />
        </p>
      </Link>
    </div>
  );
}
