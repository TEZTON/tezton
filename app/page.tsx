"use client";

import GlobalProvider from "@/contexts/GlobalContext";
import { ReactFlowProvider } from "reactflow";
import Home from "./main";

export default function HomePage() {
  return (
    <GlobalProvider>
      <ReactFlowProvider>
        <Home />
      </ReactFlowProvider>
    </GlobalProvider>
  );
}
