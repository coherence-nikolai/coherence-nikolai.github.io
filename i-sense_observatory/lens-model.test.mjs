import test from "node:test";
import assert from "node:assert/strict";

import {
  firstReadQuestions,
  lensLibrary,
  suggestLensIds,
  summarizePatterns
} from "./lens-model.mjs";

test("lens library provides a full set of observatory lenses", () => {
  assert.equal(firstReadQuestions.length >= 6, true);
  assert.equal(lensLibrary.length >= 10, true);

  for (const lens of lensLibrary) {
    assert.equal(typeof lens.id, "string");
    assert.equal(typeof lens.title, "string");
    assert.equal(lens.prompts.length >= 4, true, `${lens.id} needs enough inquiry prompts`);
    assert.equal(lens.markers.length >= 4, true, `${lens.id} needs direct-report markers`);
  }
});

test("calibration suggests useful lenses without making one lens primary", () => {
  assert.deepEqual(
    suggestLensIds({
      location: "behind the eyes",
      textures: ["watcher"],
      stability: "stable",
      tone: "neutral"
    }).slice(0, 2),
    ["seer-seen", "location"]
  );

  assert.equal(
    suggestLensIds({
      location: "chest",
      textures: ["pressure", "emotion"],
      stability: "shifting",
      tone: "charged"
    })[0],
    "noting"
  );

  assert.equal(
    suggestLensIds({
      location: "not present",
      textures: ["absence"],
      stability: "vanishing",
      tone: "quiet"
    })[0],
    "absence"
  );

  assert.equal(
    suggestLensIds({
      location: "whole body",
      textures: ["doer", "intention"],
      stability: "stable",
      tone: "urgent"
    })[0],
    "agency"
  );
});

test("pattern summaries reflect saved field notes", () => {
  const summary = summarizePatterns([
    {
      lensId: "seer-seen",
      firstRead: { location: "behind the eyes", textures: ["watcher"] },
      resultMarkers: ["softened", "re-formed"],
      remainsMarkers: ["sound", "space"]
    },
    {
      lensId: "seer-seen",
      firstRead: { location: "behind the eyes", textures: ["watcher", "image"] },
      resultMarkers: ["became unclear"],
      remainsMarkers: ["body sensation"]
    },
    {
      lensId: "absence",
      firstRead: { location: "not present", textures: ["absence"] },
      resultMarkers: ["dropped away briefly"],
      remainsMarkers: ["space"]
    }
  ]);

  assert.equal(summary.total, 3);
  assert.equal(summary.topLens, "seer-seen");
  assert.equal(summary.topLocation, "behind the eyes");
  assert.equal(summary.topTexture, "watcher");
  assert.equal(summary.droppedAway, 1);
});
