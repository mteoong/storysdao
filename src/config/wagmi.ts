"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "./chains";

export const config = getDefaultConfig({
  appName: "Storysdao",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [monadTestnet],
  ssr: true,
});
