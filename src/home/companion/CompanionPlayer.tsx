"use client";

import { Player } from "@remotion/player";
import { Avatar, AVATAR } from "./Avatar";

/**
 * Plays the avatar composition live in the browser, looping. Purely visual —
 * pointer events are disabled so the surrounding companion handles hover/close.
 */
export default function CompanionPlayer() {
  return (
    <Player
      component={Avatar}
      durationInFrames={AVATAR.durationInFrames}
      compositionWidth={AVATAR.width}
      compositionHeight={AVATAR.height}
      fps={AVATAR.fps}
      loop
      autoPlay
      acknowledgeRemotionLicense
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      style={{ width: "100%", height: "100%", pointerEvents: "none", background: "transparent" }}
    />
  );
}
