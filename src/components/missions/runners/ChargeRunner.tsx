"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ChargeMission } from "@/lib/types";
import { haptic } from "@/lib/effects";

interface Props {
  mission: ChargeMission;
  onComplete: (xp: number) => void;
}

const TICK_MS = 30;

/** Hold-to-charge — keep the button pressed until the hack completes. */
export function ChargeRunner({ mission, onComplete }: Props) {
  const [progress, setProgress] = useState(0); // 0..100
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    // Released too early → the lock snaps shut again.
    if (!doneRef.current) setProgress(0);
  };

  const start = () => {
    if (doneRef.current || timer.current) return;
    haptic(8);
    const step = 100 / (mission.holdMs / TICK_MS);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          doneRef.current = true;
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          haptic([20, 40, 60]);
          setDone(true);
          setTimeout(() => onComplete(mission.xp), 600);
          return 100;
        }
        return next;
      });
    }, TICK_MS);
  };

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col">
      <h2 className="mb-10 whitespace-pre-line text-[26px] font-bold leading-[1.35] text-ink">
        {mission.prompt}
      </h2>

      {/* Progress line */}
      <div className="relative mb-4" style={{ height: 1, background: "#E6E4DF" }}>
        <div
          className="absolute top-0 right-0 h-px bg-sage"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-8 text-[13px] tabular-nums text-ink-muted">{Math.round(progress)}%</p>

      <motion.button
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        animate={done ? { opacity: 0.5 } : {}}
        className="w-full select-none border-none py-[18px] text-[15px] font-semibold text-paper"
        style={{
          background: done ? "#79876B" : "#2A2A28",
          touchAction: "none",
          WebkitUserSelect: "none",
        }}
      >
        {done ? "✓ הליבה נפרצה" : mission.chargeLabel}
      </motion.button>

      {!done && progress === 0 && (
        <p className="mt-3.5 text-[13px] text-ink-muted">
          עזיבה מוקדמת מאפסת את הפריצה. תחזיקי חזק.
        </p>
      )}
    </div>
  );
}
