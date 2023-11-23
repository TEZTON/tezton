import { inferAsyncReturnType } from "@trpc/server";
import admin from "firebase-admin";
import { getApps, cert } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
export type { ServiceAccount } from "firebase-admin";

import { getDbInstance } from "./db";

import { LibSQLDatabase } from "drizzle-orm/libsql";
import { usersSchema } from "./db/schema";
import { eq } from "drizzle-orm";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!getApps().length && getApps().length === 0 && process.env.ENV !== "test") {
  admin.initializeApp({
    credential: cert(serviceAccount),
  });
}

type retrieveTokenHolderParams = {
  token: string;
  auth: Auth;
  db: LibSQLDatabase<Record<string, never>>;
};

export const retrieveTokenBearer = async ({
  token,
  auth,
  db,
}: retrieveTokenHolderParams) => {
  try {
    const userFirebase = await auth.verifyIdToken(token, true);

    const result = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userFirebase.uid));

    if (result.length !== 1) {
      // delete the user from firebase if it exists
      // await auth.deleteUser(userFirebase.uid);

      return null;
    }

    return {
      id: userFirebase.uid,
    };
  } catch (e: any) {
    if (e.errorInfo?.code === "auth/id-token-expired") {
      console.error("Token expired!");
    }
    // Suppress errors if we access the api without a token
    if (e.errorInfo?.code !== "auth/argument-error") {
      console.error(e);
    }

    return null;
  }
};

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const { headers } = req;
  const db = getDbInstance();
  const tokenWithBearer = headers.get("authorization") || "";
  const token = tokenWithBearer.split(" ")[1];

  const auth = getAuth();
  let user: {
    id: string;
  } | null = null;

  if (token) {
    user = await retrieveTokenBearer({ token, auth, db });
  }

  return {
    db,
    auth,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type ExperimentalMiddlewareContext = {
  user: {
    id: string;
  };
  auth: Auth;
  db: LibSQLDatabase<Record<string, never>>;
};
