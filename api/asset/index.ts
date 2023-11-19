import { TEZTON_API } from "..";
import { auth } from "@/firebase-config";

export async function uploadAssetApi(
  file: any
): Promise<{ pathname: string; url: string }> {
  const token = await auth.currentUser?.getIdToken();

  return await fetch(`${TEZTON_API}/upload?filename=${file.name}`, {
    method: "POST",
    body: file,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
