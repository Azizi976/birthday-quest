"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore, allComplete } from "@/store/useGameStore";
import { useHydrated } from "@/lib/hooks";
import { StatsBar } from "@/components/hud/StatsBar";
import { Hero } from "./Hero";
import { PathMap } from "@/components/map/PathMap";
import { IntroCutscene } from "./IntroCutscene";
import { EmergencyButton } from "@/components/easter-eggs/EmergencyButton";
import { MICRO_EGGS } from "@/data/easterEggs";

export function HomeClient() {
  const hydrated = useHydrated();
  const router = useRouter();
  const introSeen = useGameStore((s) => s.introSeen);
  const setIntroSeen = useGameStore((s) => s.setIntroSeen);
  const completed = useGameStore((s) => s.completed);

  if (!hydrated) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-paper">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          🎂
        </motion.div>
      </div>
    );
  }

  const finished = allComplete(completed);

  return (
    <div className="min-h-[100dvh] bg-paper">
      <AnimatePresence>
        {!introSeen && <IntroCutscene onAccept={setIntroSeen} />}
      </AnimatePresence>

      <StatsBar />
      <Hero />

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-[420px] px-6"
        >
          <button
            onClick={() => router.push("/vault")}
            className="w-full border border-sage text-sage-dark py-3.5 text-[13px] font-semibold bg-transparent transition-colors hover:bg-hover"
          >
            כל הקריסטלים נאספו — פתחי את הכספת
          </button>
        </motion.div>
      )}

      <PathMap />

      <footer className="pb-28 text-center text-[11px] text-ink-ghost">
        {MICRO_EGGS.footerHeart}
      </footer>

      <EmergencyButton />
    </div>
  );
}
