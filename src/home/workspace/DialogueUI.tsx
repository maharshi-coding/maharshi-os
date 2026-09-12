"use client";

import { guideChoices, type GuideChoice } from "@/data/characterDialogue";
import { ArrowUpRight } from "lucide-react";

/**
 * The conversational overlay: what the guide "says" (also the accessible text
 * equivalent of any narration) plus the section choices. Presentational only —
 * all logic lives in WorkspaceOverlay.
 */
export default function DialogueUI({
  line,
  onChoose,
}: {
  line: string;
  onChoose: (c: GuideChoice) => void;
}) {
  return (
    <div className="hx-ws-dialogue">
      <p className="hx-ws-dialogue__line" aria-live="polite">
        {line}
      </p>
      <ul className="hx-ws-choices">
        {guideChoices.map((c) => (
          <li key={c.id}>
            <button type="button" className="hx-ws-choice" onClick={() => onChoose(c)}>
              {c.label}
              {c.external && <ArrowUpRight size={13} strokeWidth={2} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
