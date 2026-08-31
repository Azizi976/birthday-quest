"use client";

import { useState } from "react";
import { useGameStore, progressPercent, currentLevel } from "@/store/useGameStore";
import { rankFromLevel } from "@/data/levels";
import { WORLDS } from "@/data/worlds";

/** Sticky top HUD: agent avatar, level, rank, XP, crystals, progress line. */
export function StatsBar() {
  const xp = useGameStore((s) => s.xp);
  const completed = useGameStore((s) => s.completed);
  const crystals = useGameStore((s) => s.crystals);
  const avatar = useGameStore((s) => s.avatar);

  const level = currentLevel(xp);
  const rank = rankFromLevel(level);
  const percent = progressPercent(completed);

  return (
    <div
      className="sticky top-0 z-30"
      style={{
        background: "rgba(249,249,246,0.92)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #E6E4DF",
        paddingTop: "calc(16px + env(safe-area-inset-top, 0px))",
        paddingBottom: "14px",
        paddingLeft: "calc(24px + env(safe-area-inset-left, 0px))",
        paddingRight: "calc(24px + env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-[420px] items-center justify-between">
        <div className="flex items-center gap-2.5">
          {avatar && <AgentAvatar src={avatar} />}
          <div>
            <div className="text-[10px] uppercase tracking-[.14em] text-ink-muted">
              רמה {level}
            </div>
            <div className="text-[15px] font-bold text-ink">{rank.title}</div>
          </div>
        </div>
        <div className="flex items-baseline gap-2.5 text-[13px] text-ink-muted">
          <span className="font-semibold text-ink">{xp} XP</span>
          <span>·</span>
          <span>{crystals.length}/{WORLDS.length} קריסטלים</span>
        </div>
      </div>

      {/* Progress line */}
      <div
        className="relative mx-auto mt-3 max-w-[420px]"
        style={{ height: "1px", background: "#E6E4DF" }}
      >
        <div
          className="absolute top-0 right-0 h-px bg-sage"
          style={{ width: `${percent}%`, transition: "width .5s cubic-bezier(0.25,1,0.5,1)" }}
        />
      </div>
    </div>
  );
}

/** Small round agent avatar with graceful fallback before images exist. */
function AgentAvatar({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full text-[15px]"
        style={{ width: 30, height: 30, border: "1px solid #E6E4DF" }}
        aria-hidden
      >
        🕵️‍♀️
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="דמות סוכנת"
      onError={() => setFailed(true)}
      // Catch errors that fired before hydration attached onError.
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      className="flex-none rounded-full object-cover"
      style={{ width: 30, height: 30, border: "1px solid #E6E4DF" }}
      draggable={false}
    />
  );
}
