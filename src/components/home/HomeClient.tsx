"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore, allComplete } from "@/store/useGameStore";
import { useHydrated } from "@/lib/hooks";
import { haptic } from "@/lib/effects";
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
  const resetAll = useGameStore((s) => s.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (confirmReset) {
      const timer = setTimeout(() => setConfirmReset(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmReset]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("reset") || params.has("restart") || params.has("new")) {
        resetAll();
        // Clean URL without reloading
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [resetAll]);

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

      {/* Reset button at bottom of timeline */}
      <div className="mx-auto -mt-6 mb-12 max-w-[420px] px-6 text-center">
        <button
          onClick={() => {
            if (!confirmReset) {
              setConfirmReset(true);
              haptic(20);
              return;
            }
            haptic([10, 30, 10]);
            resetAll();
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "instant" });
            }
            setConfirmReset(false);
          }}
          className="w-full border py-3 text-[13px] font-medium transition-all active:scale-[0.99]"
          style={{
            borderColor: confirmReset ? "#E53E3E" : "#E6E4DF",
            color: confirmReset ? "#E53E3E" : "#7A7870",
            background: confirmReset ? "rgba(229, 62, 62, 0.04)" : "transparent",
          }}
        >
          {confirmReset
            ? "בטוחה? לחצי שוב כדי לאפס הכל ולהתחיל מחדש 🔁"
            : "איפוס המסע והתחלה מחדש 🔄"}
        </button>
      </div>

      <footer className="pb-28 text-center text-[11px] text-ink-ghost">
        {MICRO_EGGS.footerHeart}
      </footer>

      <EmergencyButton />
    </div>
  );
}
