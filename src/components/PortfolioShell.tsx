"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useMobileLite } from "@/lib/use-mobile-lite";
import AmbientMotion from "./AmbientMotion";
import ScrollSections from "./ScrollSections";
import type {
  Achievement,
  CvData,
  DeployedProject,
  ProfileData,
  Project,
} from "@/lib/content";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

type PortfolioShellProps = {
  cv: CvData;
  projects: Project[];
  achievements: Achievement[];
  deployed: DeployedProject[];
  profile: ProfileData;
  instagramUrl: string;
};

function normPointer(clientX: number, clientY: number) {
  return {
    x: (clientX / window.innerWidth) * 2 - 1,
    y: (clientY / window.innerHeight) * 2 - 1,
  };
}

export default function PortfolioShell({
  cv,
  projects,
  achievements,
  deployed,
  profile,
  instagramUrl,
}: PortfolioShellProps) {
  const lite = useMobileLite();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMove = useCallback((clientX: number, clientY: number) => {
    setMouse(normPointer(clientX, clientY));
  }, []);

  useEffect(() => {
    if (lite) return;
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, [lite, onMove]);

  return (
    <main className={`portfolio-shell${lite ? " portfolio-shell--lite" : ""}`}>
      {!lite && <Scene3D mouseX={mouse.x} mouseY={mouse.y} />}
      <AmbientMotion lite={lite} />
      <ScrollSections
        cv={cv}
        projects={projects}
        achievements={achievements}
        deployed={deployed}
        profile={profile}
        instagramUrl={instagramUrl}
        mouseX={mouse.x}
        mouseY={mouse.y}
        lite={lite}
      />
    </main>
  );
}
