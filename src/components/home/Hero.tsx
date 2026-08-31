"use client";

import { useState } from "react";
import { CHARACTERS } from "@/data/story";
import { useTapCounter, useLongPress } from "@/lib/hooks";
import { useGameStore } from "@/store/useGameStore";
import { FbiReport } from "@/components/easter-eggs/FbiReport";
import { LoveNote } from "@/components/easter-eggs/LoveNote";
import { haptic } from "@/lib/effects";

/**
 * Minimal hero section: 🎂 (tap 10× for FBI easter egg) + agent label.
 * Avatar long-press reveals hidden love note.
 */
export function Hero() {
  const [fbi, setFbi] = useState(false);
  const [note, setNote] = useState(false);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);
  const findEgg = useGameStore((s) => s.findEgg);
  const agentName = useGameStore((s) => s.agentName);

  const onLogoTap = useTapCounter(10, () => {
    haptic([10, 30, 10]);
    setFbi(true);
    unlockAchievement("fbi-snoop");
    findEgg("logo-fbi");
  });

  const longPress = useLongPress(() => {
    haptic([10, 40, 10]);
    setNote(true);
    unlockAchievement("lovenote");
    findEgg("love-note");
  }, 650);

  return (
    <div className="mx-auto max-w-[420px] px-6 pb-2 pt-9 text-center">
      <button
        onClick={() => { haptic(6); onLogoTap(); }}
        aria-label="לוגו"
        className="bg-transparent border-none text-[34px] font-light cursor-pointer"
      >
        🎂
      </button>
      <p className="mt-2.5 text-[12px] text-ink-muted">
        סוכנת:{" "}
        <button
          {...longPress}
          className="bg-transparent border-none font-bold text-ink text-[12px] cursor-default"
          aria-label="שם סוכנת"
        >
          {agentName || CHARACTERS.agent}
        </button>
        {" · "}יעד: שחזור הזיכרונות
      </p>

      <FbiReport open={fbi} onClose={() => setFbi(false)} />
      <LoveNote open={note} onClose={() => setNote(false)} />
    </div>
  );
}
