"use client";

import { useRouter } from "next/navigation";
import type { Mission } from "@/lib/types";
import { WORLD_BY_ID } from "@/data/worlds";
import { TOTAL_MISSIONS } from "@/data/missions";

interface Props {
  mission: Mission;
  children: React.ReactNode;
}

/** Themed wrapper for a mission screen — back button + header. */
export function MissionFrame({ mission, children }: Props) {
  const router = useRouter();
  const world = WORLD_BY_ID[mission.worldId];

  return (
    <div className="min-h-[100dvh] w-full bg-paper">
      <div className="mx-auto flex max-w-[420px] flex-col px-6 pb-16 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div
          className="mb-6 flex items-center justify-between"
          style={{ paddingBottom: 24, borderBottom: "1px solid #E6E4DF" }}
        >
          <button
            onClick={() => router.push("/")}
            aria-label="חזרה למפה"
            className="border-none bg-transparent text-[14px] text-ink-muted py-1.5 px-0 hover:text-ink"
          >
            חזרה
          </button>
          <div className="text-[11px] tracking-[.05em] text-ink-faint">
            {mission.order}/{TOTAL_MISSIONS}
          </div>
        </div>

        <div className="mb-7 text-[11px] uppercase tracking-[.1em] text-ink-muted">
          {world.title} · {mission.title}
        </div>

        {children}
      </div>
    </div>
  );
}
