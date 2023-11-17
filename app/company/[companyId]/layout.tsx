"use client";

import { PropsWithChildren } from "react";

export default function CompanyLayout({ children }: PropsWithChildren) {
  return <main className="flex h-full w-full">{children}</main>;
}
