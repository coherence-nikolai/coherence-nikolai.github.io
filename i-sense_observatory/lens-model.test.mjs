import test from "node:test";
import assert from "node:assert/strict";

import {
  createEmptyFirstRead,
  firstReadQuestions,
  lensLibrary,
  noteFacetGroups,
  suggestLensIds,
  summarizePatterns
} from "./lens-model.mjs";

test("lens library provides a full set of observatory lenses", () => {
  assert.equal(firstReadQuestions.length >= 9, true);
  assert.equal(lensLibrary.length >= 10, true);
  assert.deepEqual(Object.keys(createEmptyFirstRead()), firstReadQuestions.map((question) => question.id));
  assert.equal(noteFacetGroups.length, 4);

  for (const lens of lensLibrary) {
    assert.equal(typeof lens.id, "string");
    assert.equal(typeof lens.title, "string");
    assert.equal(typeof lens.stance, "string");
    assert.equal(typeof lens.directAction, "string");
    assert.equal(typeof lens.reflection, "string");
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
      boundary: "inside the body",
      ownership: "clearly mine",
      tone: "neutral"
    }).slice(0, 2),
    ["seer-seen", "location"]
  );

  assert.equal(
    suggestLensIds({
      location: "chest",
      textures: ["pressure", "emotion"],
      stability: "shifting",
      boundary: "at the skin",
      ownership: "owned as sensation",
      tone: "charged"
    })[0],
    "noting"
  );

  assert.equal(
    suggestLensIds({
      location: "not present",
      textures: ["absence"],
      stability: "vanishing",
      boundary: "no clear boundary",
      ownership: "not owned",
      tone: "quiet"
    })[0],
    "absence"
  );

  assert.equal(
    suggestLensIds({
      location: "whole body",
      textures: ["doer", "intention"],
      stability: "stable",
      boundary: "around the body",
      ownership: "just happening",
      tone: "urgent"
    })[0],
    "agency"
  );

  assert.equal(
    suggestLensIds({
      location: "head",
      textures: ["story"],
      stability: "stable",
      boundary: "in thought only",
      ownership: "owned as thought",
      narrative: "image of me",
      tone: "neutral"
    })[0],
    "narrative"
  );
});

test("pattern summaries reflect saved field notes", () => {
  const summary = summarizePatterns([
    {
      lensId: "seer-seen",
      firstRead: {
        location: "behind the eyes",
        textures: ["watcher"],
        boundary: "inside the body",
        ownership: "clearly mine",
        observer: "yes, clear",
        agency: "not clear",
        tone: "neutral",
        narrative: "wordless being"
      },
      resultMarkers: ["softened", "re-formed"],
      remainsMarkers: ["sound", "space"],
      integrationMarkers: ["ordinary afterwards"]
    },
    {
      lensId: "seer-seen",
      firstRead: {
        location: "behind the eyes",
        textures: ["watcher", "image"],
        boundary: "inside the body",
        ownership: "clearly mine",
        observer: "yes, faint",
        agency: "not clear",
        tone: "neutral",
        narrative: "image of me"
      },
      resultMarkers: ["softened", "became unclear"],
      remainsMarkers: ["body sensation"],
      integrationMarkers: ["ordinary afterwards"]
    },
    {
      lensId: "absence",
      firstRead: {
        location: "not present",
        textures: ["absence"],
        boundary: "no clear boundary",
        ownership: "not owned",
        observer: "not present",
        agency: "not present",
        tone: "quiet",
        narrative: "nothing narrative"
      },
      resultMarkers: ["dropped away briefly"],
      remainsMarkers: ["space"],
      integrationMarkers: ["needed grounding"]
    }
  ]);

  assert.equal(summary.total, 3);
  assert.equal(summary.topLens, "seer-seen");
  assert.equal(summary.topLocation, "behind the eyes");
  assert.equal(summary.topTexture, "watcher");
  assert.equal(summary.topBoundary, "inside the body");
  assert.equal(summary.topOwnership, "clearly mine");
  assert.equal(summary.topIntegration, "ordinary afterwards");
  assert.equal(summary.droppedAway, 1);
  assert.equal(summary.grounded, 1);
  assert.equal(summary.insights.length > 0, true);
  assert.equal(summary.topCoOccurrence.label.includes("seer-seen / behind the eyes"), true);
});

test("copy remains neutral and non doctrinal", () => {
  const scanned = [
    ...firstReadQuestions.flatMap((question) => [question.question, question.help, ...question.options]),
    ...lensLibrary.flatMap((lens) => [
      lens.title,
      lens.lineage,
      lens.aim,
      lens.directAction,
      lens.reflection,
      ...lens.prompts,
      ...lens.markers
    ]),
    ...noteFacetGroups.flatMap((group) => [group.label, ...group.options])
  ].join(" | ").toLowerCase();

  for (const banned of ["there is no self", "you are awareness", "truth is", "must realize", "guaranteed"]) {
    assert.equal(scanned.includes(banned), false, `copy should not include doctrinal claim: ${banned}`);
  }
});
