"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AiDuelMission, Choice } from "@/lib/types";
import { haptic } from "@/lib/effects";
import { useGameStore } from "@/store/useGameStore";

interface Props {
  mission: AiDuelMission;
  onComplete: (xp: number) => void;
}

/** Mission 13 — duel a smug AI across several questions. */
export function AiDuelRunner({ mission, onComplete }: Props) {
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [defeated, setDefeated] = useState(false);
  const findEgg = useGameStore((s) => s.findEgg);

  const current = mission.questions[q];

  const choose = (c: Choice) => {
    if (picked) return;
    setPicked(c.id);
    if (c.correct) {
      haptic([10, 20, 10]);
      setTimeout(() => {
        if (q + 1 >= mission.questions.length) {
          setDefeated(true);
          findEgg("ai-cries");
          setTimeout(() => onComplete(mission.xp), 1600);
        } else {
          setQ((n) => n + 1);
          setPicked(null);
        }
      }, 650);
    } else {
      haptic([8, 30, 8]);
      setTimeout(() => setPicked(null), 800);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* AI avatar */}
      <motion.div
        animate={defeated ? { rotate: [0, -10, 10, 0], y: [0, 8, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: defeated ? 0 : Infinity }}
        className="mx-auto flex flex-col items-center"
      >
        <div className="text-6xl">{defeated ? "🤖💧" : "🤖"}</div>
      </motion.div>

      {defeated ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-ink p-5 text-center text-lg font-bold text-paper"
        >
          “לא... לא יכול להיות... את באמת מכירה אותו הכי טוב.” 😭
        </motion.p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={q}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-4"
          >
            <p className="px-4 py-2 text-[13px] italic text-ink-muted" style={{ borderRight: "2px solid #E6E4DF" }}>
              🤖 “{current.aiTaunt}”
            </p>
            <h2 className="text-[26px] font-bold leading-[1.35] text-ink">{current.question}</h2>
            <div className="flex flex-col">
              {current.choices.map((c) => {
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
            <p className="text-center text-[11px] text-ink-faint">
              שאלה {q + 1} מתוך {mission.questions.length}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
