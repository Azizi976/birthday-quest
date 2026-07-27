"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SliderMission } from "@/lib/types";
import { haptic } from "@/lib/effects";
import { useSabotage } from "@/components/missions/useSabotage";
import { SabotageOverlay } from "@/components/missions/SabotageOverlay";

interface Props {
  mission: SliderMission;
  onComplete: (xp: number) => void;
}

/** Slider guess — native range input, accepted within ±tolerance. */
export function SliderRunner({ mission, onComplete }: Props) {
  const [value, setValue] = useState(Math.round((mission.min + mission.max) / 2));
  const [wrong, setWrong] = useState(false);
  const { sabotage, onWrong, dismiss } = useSabotage();

  const submit = () => {
    if (Math.abs(value - mission.correct) <= mission.tolerance) {
      haptic([10, 20, 10]);
      onComplete(mission.xp);
    } else {
      haptic([6, 40, 6]);
      onWrong();
      setWrong(true);
      setTimeout(() => setWrong(false), 1200);
    }
  };

  return (
    <div className="flex flex-col">
      {mission.subtitle && (
        <p className="mb-2.5 text-[13px] leading-[1.6] text-ink-muted">{mission.subtitle}</p>
      )}

      <h2 className="mb-10 whitespace-pre-line text-[26px] font-bold leading-[1.35] text-ink">
        {mission.question}
      </h2>

      {/* Big value readout */}
      <motion.div
        key={value}
        className="mb-8 text-center text-[44px] font-bold tabular-nums text-ink"
      >
        {value}
        <span className="ms-2 text-[15px] font-normal text-ink-muted">{mission.unit}</span>
      </motion.div>

      {/* ponytail: native range input + accent-color, no slider lib */}
      <input
        type="range"
        min={mission.min}
        max={mission.max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: "#79876B" }}
      />
      <div className="mt-1.5 flex justify-between text-[11px] text-ink-faint">
        <span>{mission.min}</span>
        <span>{mission.max}</span>
      </div>

      <motion.button
        animate={wrong ? { x: [0, -8, 8, -4, 0] } : {}}
        onClick={submit}
        className="mt-9 w-full border-none bg-ink py-[15px] text-[14px] font-semibold text-paper transition-opacity hover:opacity-80"
      >
        נעילת תשובה
      </motion.button>

      {wrong && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3.5 text-[14px] text-sage"
        >
          קרוב... אבל לא מספיק. כווני שוב.
        </motion.p>
      )}

      <SabotageOverlay open={sabotage} onClose={dismiss} />
    </div>
  );
}
