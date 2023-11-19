import { auth } from "@/firebase-config";
import { AppRouter } from "@/server/app";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export const trpc = createTRPCReact<AppRouter>({});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @link https://trpc.io/docs/ssr
       **/
      url: `${getBaseUrl()}/api`,
      // You can pass any HTTP headers you wish here
      async headers() {
        const token = await auth.currentUser?.getIdToken();

        return {
          authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
