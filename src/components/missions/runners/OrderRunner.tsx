"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { OrderMission } from "@/lib/types";
import { haptic } from "@/lib/effects";
import { useSabotage } from "@/components/missions/useSabotage";
import { SabotageOverlay } from "@/components/missions/SabotageOverlay";

interface Props {
  mission: OrderMission;
  onComplete: (xp: number) => void;
}

type Item = OrderMission["items"][number];

function shuffle(items: Item[]): Item[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Never present the already-correct order.
  if (out.every((it, i) => it.id === items[i].id) && out.length > 1) {
    [out[0], out[1]] = [out[1], out[0]];
  }
  return out;
}

/**
 * Timeline ordering — tap the items in chronological order.
 * ponytail: tap-to-order instead of drag-reorder; upgrade to drag if it feels flat.
 */
export function OrderRunner({ mission, onComplete }: Props) {
  // Shuffle only after mount — Math.random during SSR causes hydration mismatch.
  const [shuffled, setShuffled] = useState<Item[]>(mission.items);
  useEffect(() => setShuffled(shuffle(mission.items)), [mission.items]);
  const [progress, setProgress] = useState(0); // how many placed correctly so far
  const [wrongId, setWrongId] = useState<string | null>(null);
  const { sabotage, onWrong, dismiss } = useSabotage();

  const placedIndex = (id: string) => {
    const idx = mission.items.findIndex((it) => it.id === id);
    return idx < progress ? idx : -1;
  };

  const tap = (item: Item) => {
    if (placedIndex(item.id) !== -1) return; // already placed
    if (item.id === mission.items[progress].id) {
      haptic(8);
      const next = progress + 1;
      setProgress(next);
      if (next === mission.items.length) {
        haptic([10, 20, 10]);
        setTimeout(() => onComplete(mission.xp), 500);
      }
    } else {
      haptic([6, 40, 6]);
      onWrong();
      setWrongId(item.id);
      setTimeout(() => {
        setWrongId(null);
        setProgress(0); // one mistake resets the timeline
      }, 700);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-2.5 whitespace-pre-line text-[26px] font-bold leading-[1.35] text-ink">
        {mission.question}
      </h2>
      <p className="mb-7 text-[13px] text-ink-muted">טעות אחת מאפסת את ציר הזמן. בלי לחץ.</p>

      <div className="flex flex-col">
        {shuffled.map((item) => {
          const placed = placedIndex(item.id);
          const isPlaced = placed !== -1;
          const isWrong = wrongId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => tap(item)}
              animate={isWrong ? { x: [0, -8, 8, -4, 0] } : {}}
              className="flex w-full items-center gap-3 border-none bg-transparent py-4 text-right"
              style={{
                borderBottom: "1px solid #E6E4DF",
                background: isPlaced ? "#EDEFE9" : "transparent",
              }}
            >
              {/* Sequence badge */}
              <span
                className="flex flex-none items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  width: 22,
                  height: 22,
                  border: `1.5px solid ${isPlaced ? "#79876B" : isWrong ? "#e53e3e" : "#D8D6D0"}`,
                  background: isPlaced ? "#79876B" : "transparent",
                  color: isPlaced ? "#F9F9F6" : "#8B8983",
                }}
              >
                {isPlaced ? placed + 1 : ""}
              </span>
              {item.emoji && <span className="text-xl">{item.emoji}</span>}
              <span
                className="flex-1 text-[15px]"
                style={{
                  color: isPlaced ? "#3E4A36" : isWrong ? "#e53e3e" : "#2A2A28",
                  fontWeight: isPlaced ? 600 : 400,
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <SabotageOverlay open={sabotage} onClose={dismiss} />
    </div>
  );
}
