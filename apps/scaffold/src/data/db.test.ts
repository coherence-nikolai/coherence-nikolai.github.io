import { describe, expect, it } from "vitest";
import { generateRescuePacket } from "../engine/rescueEngine";
import { parseImportPayload } from "./db";

describe("Scaffold import validation", () => {
  it("accepts a valid versioned export", () => {
    const packet = generateRescuePacket("I need to reply to this email but it is late.");
    const payload = parseImportPayload({
      version: 1,
      exportedAt: new Date().toISOString(),
      packets: [packet],
      meta: {
        id: "default",
        reentries: 1,
        repairs: 0,
        supportFadingEvents: 0,
        updatedAt: new Date().toISOString()
      }
    });

    expect(payload.packets).toHaveLength(1);
    expect(payload.meta.llmConsent.externalLlmEnabled).toBe(false);
    expect(payload.meta.qualitySignals).toEqual([]);
  });

  it("preserves local quality signals in exports", () => {
    const packet = generateRescuePacket("I need to start my assignment.");
    const createdAt = new Date().toISOString();
    const payload = parseImportPayload({
      version: 1,
      exportedAt: createdAt,
      packets: [packet],
      meta: {
        id: "default",
        reentries: 0,
        repairs: 0,
        supportFadingEvents: 0,
        qualitySignals: [
          {
            id: "quality-1",
            fixtureId: "assignment-ambiguous-start",
            input: "I need to start my assignment.",
            choice: "local_better",
            dimension: "next_action",
            localScore: 92,
            createdAt
          }
        ],
        updatedAt: createdAt
      }
    });

    expect(payload.meta.qualitySignals).toHaveLength(1);
    expect(payload.meta.qualitySignals[0].choice).toBe("local_better");
  });

  it("rejects unsupported versions", () => {
    expect(() =>
      parseImportPayload({
        version: 99,
        packets: []
      })
    ).toThrow("version is not supported");
  });

  it("rejects malformed packets", () => {
    expect(() =>
      parseImportPayload({
        version: 1,
        packets: [{ id: "not-enough" }]
      })
    ).toThrow("valid rescue packets");
  });
});
