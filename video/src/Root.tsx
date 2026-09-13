import React from "react";
import { Composition, Still } from "remotion";
import { Thumbnail } from "./Thumbnail";
import { AuditlyLaunch, TOTAL_FRAMES } from "./Video";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AuditlyLaunch"
      component={AuditlyLaunch}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ withFace: false }}
    />
    <Composition
      id="AuditlyLaunchWithFace"
      component={AuditlyLaunch}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ withFace: true }}
    />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  </>
);
