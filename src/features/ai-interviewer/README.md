# AI Interviewer: 3D character

The animated interviewer shown during the onboarding AI interview (Step 07). It is a self-contained module.
**It is not wired into any page yet.** Integration into `src/pages/onboarding/interview/` is a separate task
(see `INTEGRATION_PROMPT.md`).

## Files

| File | What it does |
| --- | --- |
| `index.ts` | Public API. `InterviewerAvatar3D` (lazy), `preloadInterviewerAvatar`, `AvatarState`. Import only from here. |
| `InterviewerAvatar3D.tsx` | React wrapper. Transparent canvas that fills its parent, poster image until the first frame, `fallback` if WebGL/model fails. |
| `interviewerStage.ts` | Plain three.js: renderer, studio lights, model loading/caching, material upgrade, render loop, resize, dispose. |
| `avatarAnimator.ts` | Drives the rig every frame: breathing, head motion, blinks, gaze/saccades, per-state expressions, mouth visemes. |
| `audioLipSync.ts` | Web Audio analyser on the question `<audio>` element, turned into viseme weights (no TTS timestamps needed). |
| `lidRig.ts` | Replacement eyelids (clipped spheres) that follow the rig's lid bones. |
| `preload.ts` | Warms the three.js chunk + model + poster in idle time (call it on the setup/device-check screens). |
| `types.ts` | `AvatarState = 'IDLE' \| 'SPEAKING' \| 'LISTENING' \| 'THINKING' \| 'SUCCESS'` |

Assets: `public/models/interviewer.glb` (about 1.2 MB, meshopt + webp) and `public/models/interviewer_poster.webp`.

## Usage

```tsx
import { Suspense } from 'react';
import { InterviewerAvatar3D, preloadInterviewerAvatar, type AvatarState } from '@/features/ai-interviewer';

preloadInterviewerAvatar(); // e.g. when the device-check screen mounts

<div className="relative aspect-video w-full">          {/* the parent decides the size + background */}
  <Suspense fallback={null}>
    <InterviewerAvatar3D
      state={avatarState}                                 // see the state mapping below
      audioElement={questionAudioEl}                      // <audio> playing the question → real lip sync
      speakingWithoutAudio={isSpeechSynthesisSpeaking}    // no audio element → procedural mouth
      fallback={<StaticInterviewerCard />}
    />
  </Suspense>
</div>
```

State meaning: `SPEAKING` while the question is being spoken, `LISTENING` while the candidate answers (recording),
`THINKING` while the answer uploads / the next question is awaited, `SUCCESS` on the closing screen, `IDLE` otherwise.

## Model facts (interviewer.glb)

- Bones: `Hips, Spine, Chest, UpperChest, Neck, Head, LeftEye, RightEye, Left/RightUpperLid, Left/RightLowerLid, Left/RightShoulder`.
- Meshes: `Face` (head + body, 26 morph targets: Oculus visemes `viseme_*`, `jawOpen`, `mouthSmile/Frown/Pucker/Wide/Close`,
  `browInnerUp`, `browDown*`, `browOuterUp*`), `EyeL/R`, `EyeSocketL/R`, `MouthCavity`, `TeethUpper/Lower`, `Tongue`, `Lid*` (hidden, replaced by LidRig).
- The face texture is a cleaned version: the original AI-generated texture was re-projected from the concept render in Blender,
  the neck was cleaned, cloth geometry was smoothed and seam-free smooth normals were added.
- Materials ship unlit. `interviewerStage.ts` keeps the texture as emissive base and adds soft key/fill light plus a purple→cyan fresnel rim.

## Performance

- three.js is loaded lazily (separate chunk). Nothing 3D is in the main bundle.
- One canvas, DPR capped at 2. Renderer, materials and listeners are disposed on unmount.
- Respect `prefers-reduced-motion` at the integration level if needed (e.g. keep the state IDLE).
