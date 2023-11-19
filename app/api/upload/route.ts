import { retrieveTokenBearer } from "@/server/context";
import { getDbInstance } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getApps, cert } from "firebase-admin/app";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!getApps().length && getApps().length === 0 && process.env.ENV !== "test") {
  admin.initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { headers } = request;
  const db = getDbInstance();
  const tokenWithBearer = headers.get("authorization") || "";
  const token = tokenWithBearer.split(" ")[1];
  const auth = getAuth();
  const user = retrieveTokenBearer({ auth, token, db });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Missing filename" });
  }

  const blob = await put(filename, request.body as any, {
    access: "public",
  });

  return NextResponse.json(blob);
}
