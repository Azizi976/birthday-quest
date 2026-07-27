"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, allComplete } from "@/store/useGameStore";
import { useHydrated } from "@/lib/hooks";
import { VAULT } from "@/data/story";
import { haptic } from "@/lib/effects";

const GALLERY = [
  { emoji: "🥖", caption: "שאטו ד'אור · הדייט הראשון" },
  { emoji: "🛻", caption: "תקרית המשאית המפורסמת" },
  { emoji: "🍝", caption: "ארוחת הערב עם השותפים" },
  { emoji: "🏜️", caption: "גיזה" },
  { emoji: "🏝️", caption: "תאילנד" },
  { emoji: "☕", caption: "מרתון 'חברים'" },
];

export function VaultClient() {
  const hydrated = useHydrated();
  const router = useRouter();
  const completed = useGameStore((s) => s.completed);
  const openVault = useGameStore((s) => s.openVault);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);
  const findEgg = useGameStore((s) => s.findEgg);
  const resetAll = useGameStore((s) => s.resetAll);
  const [opened, setOpened] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const finished = hydrated && allComplete(completed);

  useEffect(() => {
    if (opened) {
      openVault();
      unlockAchievement("legendary-shili");
      findEgg("vault-jewel");
      haptic([20, 40, 20, 40, 60]);
    }
  }, [opened, openVault, unlockAchievement, findEgg]);

  if (!hydrated) {
    return <div className="grid min-h-[100dvh] place-items-center bg-paper text-4xl">🔒</div>;
  }

  if (!finished) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-paper px-8 text-center">
        <div className="text-6xl">🔒</div>
        <p className="text-[18px] font-bold text-ink">הכספת עדיין נעולה.</p>
        <p className="text-[14px] text-ink-muted">צריך לאסוף את כל חמשת הקריסטלים קודם.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 border border-ink bg-transparent px-8 py-3 text-[14px] font-semibold text-ink transition-opacity hover:opacity-70"
        >
          חזרה למסע
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-paper px-6 pb-16 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="locked"
            exit={{ opacity: 0 }}
            className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center"
          >
            <div className="text-[10px] uppercase tracking-[.16em] text-ink-muted mb-2">
              כל הקריסטלים נאספו
            </div>
            <h1 className="text-[28px] font-bold text-ink">{VAULT.unlockingTitle.replace("משחזר", "פתחי את הכספת").split("...")[0]}</h1>
            <p className="max-w-xs text-[15px] leading-[1.7] text-ink-soft">
              כל הזיכרונות שוחזרו. הגיע הרגע לפתוח את האוצר.
            </p>
            <button
              onClick={() => {
                haptic(30);
                setOpened(true);
              }}
              className="border-none bg-ink px-[44px] py-[15px] text-[15px] font-semibold text-paper transition-opacity hover:opacity-80"
            >
              פתחי את הכספת
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="mx-auto flex max-w-[420px] flex-col gap-8"
          >
            {/* Header */}
            <div className="text-center pt-4">
              <div className="text-[10px] uppercase tracking-[.16em] text-ink-muted mb-8">
                הכספת נפתחה
              </div>

              {/* Vault message */}
              <div className="max-w-[300px] mx-auto">
                {VAULT.message.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.15 }}
                    className="mb-1 text-[16px] leading-[1.9] text-ink"
                    style={{ fontWeight: i === 0 || i === VAULT.message.length - 1 ? 700 : 400 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <section>
              <h2 className="mb-3 text-[11px] uppercase tracking-[.1em] text-ink-muted">
                📸 {VAULT.galleryTitle}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {GALLERY.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center"
                    style={{ border: "1px solid #E6E4DF" }}
                  >
                    <span className="text-3xl">{g.emoji}</span>
                    <span className="text-[9px] leading-tight text-ink-muted">{g.caption}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Song */}
            <section>
              <h2 className="mb-3 text-[11px] uppercase tracking-[.1em] text-ink-muted">
                🎵 {VAULT.videoTitle}
              </h2>
              <div className="flex flex-col items-center gap-3 p-5 text-center" style={{ border: "1px solid #E6E4DF" }}>
                <p className="text-[14px] font-semibold text-ink">בצקון שלי</p>
                <audio controls preload="metadata" className="w-full max-w-xs" src="/betzakon-sheli.mp3">
                  הדפדפן שלך לא תומך בנגן השמע.
                </audio>
              </div>
            </section>

            {/* Gift hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-5 text-center"
              style={{ border: "1px solid #E6E4DF" }}
            >
              <p className="text-[11px] uppercase tracking-[.08em] text-ink-muted mb-1">
                {VAULT.treasureDetected}
              </p>
              <p className="text-[22px] font-bold text-ink my-1">{VAULT.treasureHint}</p>
              <p className="text-[14px] text-ink-soft">{VAULT.giftHint}</p>
            </motion.div>

            {/* Back */}
            <button
              onClick={() => router.push("/")}
              className="border border-edge bg-transparent px-8 py-3 text-[14px] font-semibold text-ink transition-opacity hover:opacity-70"
            >
              חזרה למפה
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                if (!confirmReset) { setConfirmReset(true); haptic(20); return; }
                haptic([10, 30, 10]);
                resetAll();
                router.push("/");
              }}
              className="mx-auto border-none bg-transparent text-[13px] text-ink-muted underline-offset-4 hover:underline"
              style={{ color: confirmReset ? "#e53e3e" : undefined }}
            >
              {confirmReset ? "בטוח/ה? לוחצים שוב כדי לאפס 🔁" : "התחילי את המסע מחדש"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
