"use client";

import { motion } from "framer-motion";
import { INTRO } from "@/data/story";

export function IntroCutscene({ onAccept }: { onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-paper px-7 py-10 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-[18px] text-[11px] uppercase tracking-[.16em] text-ink-muted"
      >
        {INTRO.badge}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-[18px] max-w-[360px] text-[40px] font-bold leading-[1.15]"
      >
        {INTRO.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-[6px] max-w-[300px] text-[15px] leading-[1.7] text-ink-soft"
      >
        {INTRO.lines.join(" ")}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-[44px] max-w-[300px] text-[15px] leading-[1.7] text-ink-soft"
      >
        {INTRO.body.filter(Boolean).slice(-2).join(" ")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        onClick={onAccept}
        className="bg-ink text-paper border-none px-[40px] py-[15px] text-[15px] font-semibold tracking-[.01em] transition-opacity hover:opacity-80 active:opacity-60"
      >
        {INTRO.cta}
      </motion.button>
    </motion.div>
  );
}
