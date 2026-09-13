import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, LogoMark } from "./components";
import { Business, Outro, Roadmap, TechStack } from "./scenes/closing";
import { ChangeDetector, EvidenceLinker, Pipeline, PriorityScore, Relationships } from "./scenes/engine";
import { Audiences, Intro, Introducing, Problem } from "./scenes/opening";
import { ContractorProduct, GovProduct, TenderMatching } from "./scenes/product";
import { C, fontFamily } from "./theme";

// Durations in frames at 30 fps. `slide` scenes enter with a slide instead of a fade.
const SCENES: { id: string; Comp: React.FC; frames: number; slide?: boolean }[] = [
  { id: "intro", Comp: Intro, frames: 150 },
  { id: "problem", Comp: Problem, frames: 300 },
  { id: "audiences", Comp: Audiences, frames: 240 },
  { id: "introducing", Comp: Introducing, frames: 180 },
  { id: "pipeline", Comp: Pipeline, frames: 270 },
  { id: "change-detector", Comp: ChangeDetector, frames: 360 },
  { id: "evidence-linker", Comp: EvidenceLinker, frames: 360 },
  { id: "priority-score", Comp: PriorityScore, frames: 330 },
  { id: "relationships", Comp: Relationships, frames: 300 },
  { id: "gov-product", Comp: GovProduct, frames: 400, slide: true },
  { id: "tender-matching", Comp: TenderMatching, frames: 390 },
  { id: "contractor-product", Comp: ContractorProduct, frames: 352, slide: true },
  { id: "business", Comp: Business, frames: 300 },
  { id: "roadmap", Comp: Roadmap, frames: 240 },
  { id: "tech-stack", Comp: TechStack, frames: 180 },
  { id: "outro", Comp: Outro, frames: 240 },
];

const TRANSITION = 15;

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0) - TRANSITION * (SCENES.length - 1);

const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = interpolate(frame, [140, 165, TOTAL_FRAMES - 250, TOTAL_FRAMES - 225], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 56, display: "flex", alignItems: "center", gap: 12, opacity: visible * 0.85 }}>
        <LogoMark size={36} glow={false} />
        <span style={{ color: "white", fontSize: 26, fontWeight: 700 }}>Auditly</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 5,
          width: `${(frame / TOTAL_FRAMES) * 100}%`,
          background: "linear-gradient(90deg, #8b5cf6, #f472b6)",
          opacity: visible,
        }}
      />
    </AbsoluteFill>
  );
};

// Presenter face cam. public/facecam.mp4 is video.mp4 trimmed by 4.56 s so the voice lands on the script timeline.
const FACE_SIZE = 200;

// Speakers with their own takes replace the main face cam (picture and voice) over their lines.
// Every swap sits in a silent handover. `offset` is how far the take lags the video timeline,
// measured from the speech onsets of all their lines.
// - Pranav, lines 7–14: public/facecam-pranav.mp4 from "pranav_video (2).mp4", boosted to −15 LUFS,
//   last frame held so it runs until Jnandeep takes over.
// - Jnandeep, lines 15–23: public/facecam-jnandeep.mp4 from IMG_8151.MOV.
// - Akash, lines 24–34 (including the all-four sign-off): public/facecam-akash.mp4 from Akash.mp4, boosted to −15 LUFS.
const TAKES = [
  { src: "facecam-pranav.mp4", from: 1062, to: 2070, offset: 35.4 },
  { src: "facecam-jnandeep.mp4", from: 2070, to: 3105, offset: 61.86 },
  { src: "facecam-akash.mp4", from: 3105, to: TOTAL_FRAMES, offset: 100.1 },
];

const faceVideoStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

const FaceCam: React.FC = () => {
  const frame = useCurrentFrame();
  // Fade in with the intro; fade out with the outro's fade to black.
  const opacity = interpolate(frame, [0, 10, TOTAL_FRAMES - 35, TOTAL_FRAMES - 5], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        bottom: 30,
        width: FACE_SIZE,
        height: FACE_SIZE,
        borderRadius: "50%",
        padding: 5,
        background: "linear-gradient(135deg, #8b5cf6, #f472b6)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.55)",
        opacity,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#000", position: "relative" }}>
        <OffthreadVideo
          src={staticFile("facecam.mp4")}
          volume={(f) => (TAKES.some((t) => f >= t.from && f < t.to) ? 0 : 1)}
          style={faceVideoStyle}
        />
        {TAKES.map((t) => (
          <Sequence key={t.src} from={t.from} durationInFrames={t.to - t.from} layout="none">
            <div style={{ position: "absolute", inset: 0 }}>
              <OffthreadVideo
                src={staticFile(t.src)}
                trimBefore={Math.max(0, Math.round(t.from - t.offset * 30))}
                style={faceVideoStyle}
              />
            </div>
          </Sequence>
        ))}
      </div>
    </div>
  );
};

export const AuditlyLaunch: React.FC<{ withFace?: boolean }> = ({ withFace = false }) => {
  const children: React.ReactNode[] = [];
  SCENES.forEach(({ id, Comp, frames, slide: useSlide }, i) => {
    if (i > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${id}`}
          presentation={useSlide ? slide({ direction: "from-right" }) : fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence key={id} durationInFrames={frames}>
        <Comp />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>{children}</TransitionSeries>
      <Overlay />
      {withFace && <FaceCam />}
    </AbsoluteFill>
  );
};
