"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { SwipeMission } from "@/lib/types";
import { haptic } from "@/lib/effects";
import { useSabotage } from "@/components/missions/useSabotage";
import { SabotageOverlay } from "@/components/missions/SabotageOverlay";

interface Props {
  mission: SwipeMission;
  onComplete: (xp: number) => void;
}

const SWIPE_THRESHOLD = 90;

/** Tinder-style swipe cards: swipe right = נכון, left = לא נכון. */
export function SwipeRunner({ mission, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [wrong, setWrong] = useState(false);
  const { sabotage, onWrong, dismiss } = useSabotage();

  const card = mission.cards[index];

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < SWIPE_THRESHOLD) return;
    const guess = info.offset.x > 0; // right = true (נכון)
    if (guess === card.answer) {
      haptic([10, 20, 10]);
      setExitX(info.offset.x > 0 ? 400 : -400);
      if (index + 1 >= mission.cards.length) {
        setTimeout(() => onComplete(mission.xp), 350);
      } else {
        setTimeout(() => {
          setIndex((i) => i + 1);
          setExitX(0);
        }, 200);
      }
    } else {
      haptic([6, 40, 6]);
      onWrong();
      setWrong(true);
      setTimeout(() => setWrong(false), 900);
    }
  };

  return (
    <div className="flex flex-col">
      {mission.intro && (
        <p className="mb-2.5 text-[13px] leading-[1.6] text-ink-muted">{mission.intro}</p>
      )}

      {/* Direction hints */}
      <div className="mb-5 flex items-center justify-between text-[11px] uppercase tracking-[.1em]">
        <span className="text-ink-faint">→ לא נכון</span>
        <span className="text-sage">נכון ←</span>
      </div>

      {/* Card stack */}
      <div className="relative mx-auto h-64 w-full max-w-[300px]">
        <AnimatePresence>
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 10 }}
            animate={wrong ? { x: [0, -8, 8, -4, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0, x: exitX }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex cursor-grab flex-col items-center justify-center gap-4 bg-paper p-7 text-center active:cursor-grabbing"
            style={{ border: "1px solid #E6E4DF", touchAction: "pan-y" }}
          >
            {card.emoji && <span className="text-4xl">{card.emoji}</span>}
            <p className="text-[17px] font-semibold leading-[1.6] text-ink">{card.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <p className="mt-5 text-center text-[11px] text-ink-faint">
        {index + 1} / {mission.cards.length}
      </p>

      {wrong && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-[14px] text-sage"
        >
          לא מדויק... נסי שוב.
        </motion.p>
      )}

      <SabotageOverlay open={sabotage} onClose={dismiss} />
    </div>
  );
}
