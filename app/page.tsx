"use client"

import LandingPage from "@/components/landing-page";
import MonsterBlock from "@/components/monster-block";
import { RecoilRoot } from "recoil";

export default function Home() {

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch px-4 sm:px-6">
      <RecoilRoot>
        <LandingPage />
        <MonsterBlock />
      </RecoilRoot>
    </main>
  );
}
