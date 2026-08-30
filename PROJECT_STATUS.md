# PROJECT STATUS — מבצע שילי (Birthday Quest)

_Audit date: 2026-07-27 · after minimalist redesign + game-engine extension (20 missions)_

---

## 1. Current Architecture

```
Chapu_Birthday_game/
├── public/
│   ├── avatars/               # 6 real photos (mission m0 avatar picker)
│   ├── icons/
│   │   ├── cake.svg           # minimalist cake, matches ink/sage palette
│   │   ├── icon-192.png       # ← generated from cake.svg
│   │   ├── icon-512.png       # ← generated from cake.svg
│   │   ├── apple-touch-icon.png  # ← generated from cake.svg (iOS)
│   │   └── splash.png         # iOS splash (old artwork — optional refresh)
│   ├── betzakon-sheli.mp3     # vault song
│   ├── manifest.json          # PWA manifest (new palette + cake icons)
│   └── sw.js                  # offline-first service worker
├── scripts/
│   └── gen-placeholder-icons.mjs   # `npm run icons`
└── src/
    ├── app/
    │   ├── layout.tsx          # Assistant font, PWA meta, RTL
    │   ├── page.tsx            #  → HomeClient
    │   ├── template.tsx        # route transitions
    │   ├── globals.css
    │   ├── mission/[id]/       # SSG page per mission (auto from config)
    │   ├── vault/  ├── ministry/  └── devroom/
    ├── data/                   # ══ ALL CONTENT LIVES HERE ══
    │   ├── missions.ts         # GAME CONFIG — 20 missions, auto-ordered
    │   ├── worlds.ts  ├── levels.ts  ├── story.ts
    │   ├── achievements.ts  └── easterEggs.ts
    ├── lib/                    # types.ts (14 mission kinds), hooks, effects, utils
    ├── store/useGameStore.ts   # Zustand + persist (incl. avatar)
    └── components/
        ├── home/               # HomeClient, Hero, IntroCutscene
        ├── hud/StatsBar.tsx    # sticky header + avatar chip
        ├── map/PathMap.tsx     # editorial list map (self-contained)
        ├── missions/
        │   ├── MissionScreen.tsx   # dynamic renderer (dispatch on kind)
        │   ├── MissionFrame.tsx  ├── MissionComplete.tsx
        │   ├── useSabotage.ts  ├── SabotageOverlay.tsx
        │   └── runners/            # 14 mechanics:
        │       # codeword · choice · map · courtroom · dinner · dragdrop
        │       # aiduel · faceselect · restore · avatar · swipe · slider
        │       # order · charge
        ├── achievements/AchievementWatcher.tsx   # toast on unlock
        ├── easter-eggs/        # GlobalEggs, EmergencyButton, FbiReport, LoveNote
        ├── pwa/ServiceWorkerRegister.tsx
        └── ui/                 # Button, Modal, Toaster
```

## 2. Cleanup Log

Deleted (all recoverable via git history):

| File | Why obsolete |
|---|---|
| `src/components/map/MissionNode.tsx` | Old Duolingo-style circular node; new `PathMap` renders list rows itself |
| `src/components/map/WorldBanner.tsx` | Old gradient world banner; replaced by inline world headers |
| `src/components/achievements/AchievementsDialog.tsx` | Trophy dialog removed in minimalist redesign (achievements still unlock + toast via `AchievementWatcher`) |
| `src/components/ui/Progress.tsx` | Old rounded progress bar; new design uses 1-px hairline |

Also trimmed / fixed:
- `levelProgress()` removed from `src/data/levels.ts` (its mini-bar died with the old StatsBar)
- `package.json` `icons` script pointed at nonexistent `generate-icons.mjs` → fixed to `gen-placeholder-icons.mjs`
- `icon-192.png` + `apple-touch-icon.png` were **0-byte empty files** → regenerated all 3 PNGs from `cake.svg` via sharp

Kept on purpose: `ui/Button` + `ui/Modal` (used by 6+ components), all deps in `package.json` (each verified in use), `Photos/` at repo root (your originals — safe to delete yourself, the app reads from `public/avatars/`).

## 3. Health Report

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ PASS (0 errors) |
| `next build` (production, 27 static pages incl. 20 mission routes) | ✅ PASS |
| ESLint | ⚠️ Not configured in this project (never was). `next build`'s type validation covers the critical checks. Add `.eslintrc.json` with `{"extends": "next/core-web-vitals"}` if you want it. |
| Config ↔ renderer type integrity | ✅ Discriminated union — `MissionScreen`'s switch is exhaustively type-checked against all 14 mission kinds |
| First Load JS | 105 kB shared — healthy |

No critical errors. One note: never run `npm run build` while the dev server is running — it corrupts `.next` (kill server, delete `.next`, restart if it happens).

## 4. The Final Checklist

**Content (edit `src/data/missions.ts`):**
- [ ] `m-swipe` — replace last 3 placeholders: cards `c3` `[עוד_עובדה_נכונה_כאן]`, `c4` `[עוד_עובדה_שגויה_כאן]`, and `successText` `[טקסט_הצלחה_כאן]`
- [ ] Sanity-pass all mission answers/texts once on the phone (full playthrough)

**Images:**
- [ ] `src/components/vault/VaultClient.tsx` — the 6 vault gallery cards are still emoji stand-ins; swap for real `<img>` memories when ready
- [ ] Optional: `public/icons/splash.png` is the old iOS splash artwork — replace with a paper-colored one if you want a seamless launch
- [ ] Optional: the 3 icon PNGs are line-art cakes generated from `cake.svg` — overwrite with fancier artwork any time, same filenames

**Final QA before the birthday:**
- [ ] Play start→vault once on the iPhone (`npx next dev` → `http://10.100.102.37:3001`)
- [ ] Add to Home Screen on her iPhone and launch from the icon (tests PWA standalone + offline SW)
- [ ] Verify `betzakon-sheli.mp3` plays in the vault on iOS (needs a tap, autoplay is blocked)
- [ ] Delete `Photos/` from the repo root if you don't want the originals shipped/committed
- [ ] Reset progress before handing over: vault → "התחילי את המסע מחדש" (or clear site data)
