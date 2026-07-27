"use client";

import { useRouter } from "next/navigation";
import { WORLDS } from "@/data/worlds";
import { MISSION_BY_ID } from "@/data/missions";
import { useGameStore, missionStatus } from "@/store/useGameStore";
import { haptic } from "@/lib/effects";

export function PathMap() {
  const completed = useGameStore((s) => s.completed);
  const crystals = useGameStore((s) => s.crystals);

  return (
    <div className="mx-auto max-w-[420px] px-6 pb-20">
      {WORLDS.map((world) => {
        const worldDone = world.missionIds.every((id) => completed.includes(id));
        return (
          <div key={world.id} className="mt-2">
            {/* World header */}
            <div
              className="flex items-start justify-between py-7"
              style={{ borderTop: "1px solid #E6E4DF" }}
            >
              <div>
                <div className="text-[10px] uppercase tracking-[.14em] text-ink-muted">
                  עולם 0{world.order}
                </div>
                <div className="mt-0.5 text-[20px] font-bold text-ink">{world.title}</div>
                <div className="mt-0.5 text-[13px] text-ink-muted">{world.subtitle}</div>
              </div>
              {/* Diamond crystal indicator */}
              <div
                title={world.crystal.name}
                className="mt-1.5 flex-none rotate-45"
                style={{
                  width: 13,
                  height: 13,
                  border: "1.5px solid",
                  borderColor: worldDone ? "#79876B" : "#D8D6D0",
                  background: worldDone ? "#79876B" : "transparent",
                }}
              />
            </div>

            {/* Mission rows */}
            <div className="flex flex-col">
              {world.missionIds.map((mid, i) => (
                <MissionRow
                  key={mid}
                  missionId={mid}
                  isFirst={i === 0}
                  isLast={i === world.missionIds.length - 1}
                  completed={completed}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MissionRow({
  missionId,
  isFirst,
  isLast,
  completed,
}: {
  missionId: string;
  isFirst: boolean;
  isLast: boolean;
  completed: string[];
}) {
  const router = useRouter();
  const mission = MISSION_BY_ID[missionId];
  const status = missionStatus(missionId, completed);
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const dotSize = !isLocked ? 40 : 10;

  return (
    <button
      onClick={() => {
        if (isLocked) return;
        haptic();
        router.push(`/mission/${missionId}`);
      }}
      className="flex w-full items-center gap-4 border-none bg-transparent py-2.5 text-right"
      style={{ opacity: isLocked ? 0.5 : 1 }}
    >
      {/* Dot + connectors */}
      <div className="relative flex w-10 flex-none flex-col items-center">
        {!isFirst && (
          <div
            className="absolute bottom-full w-px"
            style={{ height: 14, background: "#E0DED8" }}
          />
        )}
        <div
          className="flex items-center justify-center rounded-full text-[13px] font-bold"
          style={{
            width: dotSize,
            height: dotSize,
            border: isCompleted ? "none" : `1.5px solid ${isLocked ? "#D8D6D0" : "#79876B"}`,
            background: isCompleted ? "#79876B" : "transparent",
            color: isCompleted ? "#F9F9F6" : "#2A2A28",
          }}
        >
          {isCompleted ? "✓" : isLocked ? "" : String(mission.order)}
        </div>
        {!isLast && (
          <div
            className="absolute top-full w-px"
            style={{ height: 22, background: "#E0DED8" }}
          />
        )}
      </div>

      {/* Title */}
      <div className="flex-1">
        <div
          className="text-[15px]"
          style={{
            fontWeight: isLocked ? 400 : 600,
            color: isLocked ? "#B5B3AD" : "#2A2A28",
          }}
        >
          {mission.title}
        </div>
      </div>

      {/* Status label */}
      <div className="text-[11px]" style={{ color: "#B5B3AD" }}>
        {isLocked ? "נעול" : ""}
      </div>
    </button>
  );
}
