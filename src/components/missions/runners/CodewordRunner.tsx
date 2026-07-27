"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CodewordMission } from "@/lib/types";
import { matchesAnswer } from "@/lib/utils";
import { useSabotage } from "@/components/missions/useSabotage";
import { SabotageOverlay } from "@/components/missions/SabotageOverlay";

interface Props {
  mission: CodewordMission;
  onComplete: (xp: number) => void;
}

export function CodewordRunner({ mission, onComplete }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { sabotage, onWrong, dismiss } = useSabotage();

  const submit = () => {
    if (matchesAnswer(value, mission.answers)) {
      onComplete(mission.xp);
    } else {
      setError(true);
      setShowHint(true);
      onWrong();
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="flex flex-col">
      <h2
        className="mb-7 whitespace-pre-line text-[26px] font-bold leading-[1.35] text-ink"
      >
        {mission.prompt}
      </h2>

      <div>
        <motion.input
          dir="rtl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={mission.placeholder}
          animate={error ? { x: [0, -8, 8, -4, 0] } : {}}
          className="w-full border-none bg-transparent text-[16px] text-ink outline-none"
          style={{
            borderBottom: `1px solid ${error ? "#e53e3e" : "#2A2A28"}`,
            padding: "12px 4px",
          }}
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="mt-6 w-full border-none py-[15px] text-[14px] font-semibold text-paper transition-opacity disabled:opacity-40 hover:opacity-80"
          style={{ background: "#2A2A28" }}
        >
          שליחה
        </button>

        {showHint && mission.hint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3.5 text-[13px] text-ink-muted"
          >
            רמז: {mission.hint}
          </motion.p>
        )}
      </div>

      <SabotageOverlay open={sabotage} onClose={dismiss} />
    </div>
  );
}
