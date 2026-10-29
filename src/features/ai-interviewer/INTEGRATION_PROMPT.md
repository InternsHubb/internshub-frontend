# Integration prompt: put the 3D interviewer into the onboarding AI interview

> Copy everything below the line into the AI coding assistant, from the repo root, **only when the team decides to start the integration**.

---

You are working in the InternsHub frontend (React 19 + TypeScript + Vite + Tailwind 4, i18next, Radix, lucide).
Your job: put the 3D AI interviewer character into the live interview screen of onboarding Step 07.

## 1. Read first (don't change anything yet)

1. `src/features/ai-interviewer/README.md`: the character module, its API and how it works.
2. `src/features/ai-interviewer/*.ts(x)`: `InterviewerAvatar3D` (React wrapper), `interviewerStage.ts` (three.js stage),
   `avatarAnimator.ts` (rig animation per `AvatarState`), `audioLipSync.ts` (lip sync from an `<audio>` element), `lidRig.ts`.
3. The interview flow in `src/pages/onboarding/interview/`:
   - `InterviewSetupFlow.tsx`: Step 07 screens `setup → overview → consent → device-check → session`. Owns the camera/mic/screen
     streams (`useDeviceCheck`) and the backend interview (`live`, from `useLiveInterview`). The **Start Interview** click on the
     setup screen already grants mic + screen share and is a user gesture (audio can be unlocked there).
   - `InterviewSession.tsx`: the question screen. Today: a question card with a manual `<audio controls>` (`QuestionAudio`),
     a "Voice response" panel with `VoiceIndicator`, a Done button, an intermediate "Answer saved / Continue" frame
     (`phase === 'answered'`), and the right column with `CameraPreview` + `DeviceStatusList`.
   - `useLiveInterview.ts`: `start()`, `startRecording(stream)`, `submitAnswer()`, `resendAnswer()`; `interview: InterviewDto`.
4. `src/lib/api/types.ts` → `InterviewDto`: `currentQuestion { orderIndex, topic, text, audioBase64, audioMimeType }`,
   `maxQuestions`, `answeredCount`, `closingText`, `closingAudioBase64`, `status`. The backend returns **no transcript**.
5. i18n: `src/i18n/locales/en.json` and `ar.json` (`onboarding.interview.session.*`). Every new string goes in both.

Summarize what you understood and the plan, then wait for my OK before editing.

## 2. What to build (decisions already agreed with the team)

Layout of the session screen (desktop: two columns, mobile: stacked):

- **Left / main column, the call stage:** `InterviewerAvatar3D` in a large rounded stage (16:9, dark indigo studio
  background that fits the brand, bottom fade). Under the character, a **caption** with the current question text
  (`dir="auto"`). The question **stays in the caption until it is answered**, then it is replaced by the next question.
- **Right column:** the candidate **camera on top** (existing `CameraPreview`), then a **Transcript** panel below it.
  The transcript keeps the questions asked so far; for answers show the note *"Answer text: not available yet"*
  (the backend doesn't return a transcript yet). Keep `DeviceStatusList` (can be collapsed under the transcript).
- **No Mute button.**
- **End interview is locked until the last question**: enabled only when `interview.answeredCount === interview.maxQuestions`
  (or the interview has ended); otherwise disabled with a tooltip explaining why.
- Keep the existing integrity / fullscreen / paused behaviour and the error notices (send again, record again) exactly as they are.

Behaviour:

1. **The interviewer speaks automatically** when the session starts and for every new question. There is no play button.
   - If `currentQuestion.audioBase64` exists: play it from a hidden `<audio>` element (data URL as today) and pass that
     element to `InterviewerAvatar3D` as `audioElement`, so the lip sync follows the real sound.
   - If `audioBase64` is `null` (the free TTS plan allows only about 4 voice calls, so this will happen often): **fall back to
     `window.speechSynthesis`** with `lang` from the question's language (detect Arabic script → `ar-SA`, else `en-US`), and set
     `speakingWithoutAudio` while it speaks (procedural mouth).
   - If neither can play (autoplay blocked, no voices): show the caption anyway and continue after a short reading delay.
   - Unlock audio on the **Start Interview** click (create/resume an `AudioContext` and/or play a silent sound there).
2. **Recording starts after the interviewer finishes speaking** (today it starts as soon as the question shows).
   Gate `canRecord` in `InterviewSession.tsx` on a new `questionSpoken` flag that becomes true when the audio /
   speechSynthesis ends (or the fallback delay passes). Reset it for each new `orderIndex`.
3. **Avatar state mapping:** `SPEAKING` while the question plays → `LISTENING` while recording → `THINKING` while
   `isSending` / `status === 'submitting'` → `SUCCESS` on the ended screen (`closingText`, play `closingAudioBase64` the same way)
   → `IDLE` when paused or loading.
4. **Preload** the character with `preloadInterviewerAvatar()` when the device-check screen mounts.
5. Ask me before removing the intermediate "Answer saved / Continue" frame (`phase === 'answered'`). The proposal is to go straight
   to the next question, which the interviewer then speaks.

## 3. Rules

- Work on a new branch from the latest `dev` (`git fetch origin dev && git switch -c feature/onboarding-3d-interviewer origin/dev`).
  Never push to `main`. Open the PR into `dev`.
- Use the module only through `@/features/ai-interviewer` (lazy). Don't copy its code into the page, and don't change the GLB.
- Tailwind with logical properties (`ms-/me-/ps-/pe-/start-/end-`) so Arabic RTL works. Follow the existing styling tokens in
  `src/pages/onboarding/interview/parts.tsx`.
- Keep the backend flow (`useLiveInterview`) untouched except for what recording-after-speech needs.
- Before finishing: `npm run build` and `npx oxlint` must pass. Test in Arabic and English, desktop and mobile width,
  with question audio present **and** with `audioBase64 = null` (you can force it in `mockInterview.ts` or by nulling it in dev).
- Report what you changed, file by file, and anything you couldn't verify.
