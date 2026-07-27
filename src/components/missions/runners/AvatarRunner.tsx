"use client";

import { useState } from "react";
import type { AvatarMission } from "@/lib/types";
import { useGameStore } from "@/store/useGameStore";
import { haptic } from "@/lib/effects";

interface Props {
  mission: AvatarMission;
  onComplete: (xp: number) => void;
}

/** Agent avatar selection grid. Persists the chosen path to the store. */
export function AvatarRunner({ mission, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const setAvatar = useGameStore((s) => s.setAvatar);

  const confirm = () => {
    if (!selected) return;
    haptic([10, 20, 10]);
    setAvatar(selected);
    onComplete(mission.xp);
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-7 whitespace-pre-line text-[26px] font-bold leading-[1.35] text-ink">
        {mission.prompt}
      </h2>

      <div className="grid grid-cols-3 gap-2.5">
        {mission.avatars.map((a) => {
          const isSelected = selected === a.src;
          return (
            <button
              key={a.id}
              onClick={() => {
                haptic(6);
                setSelected(a.src);
              }}
              className="flex flex-col items-center gap-1.5 bg-transparent p-2 transition-colors"
              style={{
                border: isSelected ? "1.5px solid #79876B" : "1px solid #E6E4DF",
                background: isSelected ? "#EDEFE9" : "transparent",
              }}
            >
              <AvatarImage src={a.src} />
              <span
                className="text-[11px] leading-tight"
                style={{
                  color: isSelected ? "#3E4A36" : "#8B8983",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={confirm}
        disabled={!selected}
        className="mt-8 w-full border-none bg-ink py-[15px] text-[14px] font-semibold text-paper transition-opacity disabled:opacity-40 hover:opacity-80"
      >
        אישור פרופיל
      </button>

      <p className="mt-3.5 text-center text-[11px] text-ink-faint">
        (שימי את התמונות האמיתיות בתיקייה public/avatars)
      </p>
    </div>
  );
}

/** Image with graceful fallback when the file isn't dropped in yet. */
function AvatarImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="grid aspect-square w-full place-items-center text-3xl" aria-hidden>
        🕵️‍♀️
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      // Catch errors that fired before hydration attached onError.
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      className="aspect-square w-full object-cover"
      draggable={false}
    />
  );
}
