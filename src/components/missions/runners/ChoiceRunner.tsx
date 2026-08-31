"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ChoiceMission, Choice } from "@/lib/types";
import { haptic } from "@/lib/effects";
import { useSabotage } from "@/components/missions/useSabotage";
import { SabotageOverlay } from "@/components/missions/SabotageOverlay";
import { useGameStore } from "@/store/useGameStore";

interface Props {
  mission: ChoiceMission;
  onComplete: (xp: number) => void;
}

export function ChoiceRunner({ mission, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { sabotage, onWrong, dismiss } = useSabotage();
  const setAgentName = useGameStore((s) => s.setAgentName);

  const choose = (c: Choice) => {
    if (picked) return;
    setPicked(c.id);

    if (mission.id === "m1") {
      setAgentName(c.label);
    }

    if (c.correct) {
      haptic([10, 20, 10]);
      const xp = mission.xp + (c.bonusXp ?? 0);
      if (c.feedback) {
        setFeedback(c.feedback);
        setTimeout(() => onComplete(xp), 1100);
      } else {
        setTimeout(() => onComplete(xp), 450);
      }
    } else {
      onWrong();
      setFeedback(c.feedback ?? "לא מדויק... נסי שוב.");
      setTimeout(() => {
        setPicked(null);
        setFeedback(null);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col">
      {mission.subtitle && (
        <p className="mb-2.5 text-[13px] leading-[1.6] text-ink-muted">{mission.subtitle}</p>
      )}

      <h2
        className="mb-7 text-[26px] font-bold leading-[1.35] text-ink"
        style={{ whiteSpace: "pre-line" }}
      >
        {mission.question}
      </h2>

      <div className="flex flex-col">
        {mission.choices.map((c) => {
          const isPicked = picked === c.id;
          const isCorrect = isPicked && c.correct;
          const isWrong = isPicked && !c.correct;
          return (
            <motion.button
              key={c.id}
              onClick={() => choose(c)}
              animate={isWrong ? { x: [0, -6, 6, -3, 0] } : {}}
              className="flex w-full items-center gap-3 border-none bg-transparent py-4 text-right"
              style={{
                borderBottom: "1px solid #E6E4DF",
                background: isCorrect ? "#EDEFE9" : "transparent",
              }}
            >
              {/* Circle mark */}
              <span
                className="flex flex-none items-center justify-center rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  border: `1.5px solid ${isCorrect ? "#79876B" : isWrong ? "#e53e3e" : "#D8D6D0"}`,
                  background: isCorrect ? "#79876B" : "transparent",
                  fontSize: 9,
                  color: "#F9F9F6",
                }}
              >
                {isCorrect ? "✓" : ""}
              </span>
              {c.emoji && <span className="text-xl">{c.emoji}</span>}
              <span
                className="flex-1 text-[15px]"
                style={{
                  color: isCorrect ? "#3E4A36" : isWrong ? "#e53e3e" : "#2A2A28",
                  fontWeight: isCorrect ? 600 : 400,
                }}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {feedback && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-5 text-[14px] text-sage"
        >
          {feedback}
        </motion.p>
      )}

      <SabotageOverlay open={sabotage} onClose={dismiss} />
    </div>
  );
}
