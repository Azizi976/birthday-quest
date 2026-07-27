"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { RestoreMission } from "@/lib/types";
import { cannonConfetti, haptic } from "@/lib/effects";

interface Props {
  mission: RestoreMission;
  onComplete: (xp: number) => void;
}

/** Mission 15 — dramatic restore cutscene that ticks 0→100%. */
export function RestoreRunner({ mission, onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const percent = mission.steps[stepIdx];

  useEffect(() => {
    if (!started || done) return;
    if (stepIdx >= mission.steps.length - 1) {
      haptic([20, 40, 60]);
      cannonConfetti();
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setStepIdx((i) => i + 1);
      haptic(15);
    }, 850);
    return () => clearTimeout(t);
  }, [started, stepIdx, done, mission.steps.length]);

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      {!started ? (
        <>
          <h2 className="text-[26px] font-bold text-ink">{mission.intro}</h2>
          <button
            onClick={() => setStarted(true)}
            className="border-none bg-ink px-[44px] py-[15px] text-[15px] font-semibold text-paper transition-opacity hover:opacity-80"
          >
            התחל שחזור
          </button>
        </>
      ) : !done ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="text-5xl"
          >
            🌀
          </motion.div>
          <p className="text-[15px] text-ink-muted">משחזר את שילי...</p>
          {/* Progress line */}
          <div className="w-full max-w-xs" style={{ height: 1, background: "#E6E4DF", position: "relative", marginTop: 8, marginBottom: 4 }}>
            <motion.div
              className="absolute top-0 right-0 h-px bg-sage"
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
          <motion.p
            key={percent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[13px] text-ink-muted"
          >
            {percent}%
          </motion.p>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="text-5xl">❤️</div>
          <p className="text-[22px] font-bold text-ink">{mission.successText}</p>
          <button
            onClick={() => onComplete(mission.xp)}
            className="border-none bg-ink px-[44px] py-[15px] text-[15px] font-semibold text-paper transition-opacity hover:opacity-80"
          >
            פתחי את הכספת
          </button>
        </motion.div>
      )}
    </div>
  );
}
