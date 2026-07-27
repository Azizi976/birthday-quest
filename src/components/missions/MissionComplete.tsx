"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Mission } from "@/lib/types";
import { WORLD_BY_ID } from "@/data/worlds";
import { haptic } from "@/lib/effects";
import { useGameStore } from "@/store/useGameStore";

interface Props {
  mission: Mission;
  earnedXp: number;
  successText: string;
  onContinue: () => void;
}

/** Full-screen mission-complete screen. */
export function MissionComplete({ mission, earnedXp, successText, onContinue }: Props) {
  const completed = useGameStore((s) => s.completed);
  const world = WORLD_BY_ID[mission.worldId];
  const worldDone = world.missionIds.every((id) => completed.includes(id));
  const isLastInWorld = world.missionIds[world.missionIds.length - 1] === mission.id;
  const showCrystal = worldDone && isLastInWorld;

  useEffect(() => {
    haptic([10, 30, 10, 30, 20]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-7 text-center"
      style={{ padding: "40px 28px" }}
    >
      {/* Check circle */}
      <div
        className="mb-7 flex items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          border: "1.5px solid #79876B",
        }}
      >
        <span className="text-[20px] text-sage">✓</span>
      </div>

      <h2 className="mb-3.5 text-[24px] font-bold text-ink">משימה הושלמה</h2>

      <p
        className="mb-6 max-w-[280px] text-[15px] leading-[1.7] text-ink-soft"
        style={{ whiteSpace: "pre-line" }}
      >
        {successText}
      </p>

      <div className="mb-2 text-[14px] font-semibold text-sage">+{earnedXp} XP</div>

      {showCrystal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="my-4"
          style={{
            border: "1px solid #E6E4DF",
            padding: "14px 20px",
          }}
        >
          <p className="mb-1.5 text-[11px] uppercase tracking-[.08em] text-ink-muted">
            קריסטל נאסף
          </p>
          <p className="text-[15px] font-bold text-ink">{world.crystal.name}</p>
        </motion.div>
      )}

      <button
        onClick={onContinue}
        className="mt-5 border-none bg-ink px-[44px] py-[15px] text-[14px] font-semibold text-paper transition-opacity hover:opacity-80"
      >
        המשך
      </button>
    </motion.div>
  );
}
