import { trpc } from "@/trpc";
import ImageRender from "./ImageRender";
import Link from "next/link";
import SignOutButton from "@/components/SignOut";
import Tooltip from "@/components/Tooltip";

export default function Self() {
  const { data, isLoading } = trpc.users.myself.useQuery();

  if (isLoading || !data) {
    return null;
  }
  return (
    <div className="py-4 border-b mb-4 flex px-10">
      <Link href="/settings" className="ml-auto mr-2 self-center">
        <p>
          <ImageRender name={data.firstName} />
        </p>
      </Link>
      <Tooltip title="Sair" place="bottom">
        <SignOutButton />
      </Tooltip>
    </div>
  );
}
