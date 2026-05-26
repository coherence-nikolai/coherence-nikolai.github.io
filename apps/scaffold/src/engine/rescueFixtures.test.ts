import { describe, expect, it } from "vitest";
import type { BlockType, MissingItemType, TaskType } from "../types";
import {
  classifyBlockWithConfidence,
  classifyTaskType,
  detectMissingItem,
  generateExitResponsiblyScript,
  generateFirstPhysicalAction,
  generateRepairScript,
  generateRescuePacket,
  inferExitStatus
} from "./rescueEngine";

interface RescueFixture {
  input: string;
  taskType: TaskType;
  blockType: BlockType;
  missingItem?: MissingItemType;
  expectedActionFragment: string;
}

const fixtures: RescueFixture[] = [
  {
    input: "I need to reply to this email but I feel ashamed it is late.",
    taskType: "email",
    blockType: "shame_fear",
    missingItem: "courage",
    expectedActionFragment: "two-sentence holding reply"
  },
  {
    input: "I need to do my tax today but there are too many receipts and I am frozen.",
    taskType: "tax",
    blockType: "overwhelm",
    missingItem: "material",
    expectedActionFragment: "one tax document"
  },
  {
    input: "I have an essay due and I don't know where to start.",
    taskType: "essay",
    blockType: "ambiguous_start",
    missingItem: "time",
    expectedActionFragment: "paste the assignment question"
  },
  {
    input: "The kitchen is a mess and everything is too much.",
    taskType: "cleaning",
    blockType: "overwhelm",
    expectedActionFragment: "five visible items"
  },
  {
    input: "I need to book a doctor appointment but I am confused about the details.",
    taskType: "appointment",
    blockType: "missing_information",
    missingItem: "information",
    expectedActionFragment: "appointment details"
  },
  {
    input: "I need to study for the exam but it is boring and I keep scrolling.",
    taskType: "study",
    blockType: "boredom",
    expectedActionFragment: "7-minute timer"
  }
];

describe("fixture-based rescue generation", () => {
  it.each(fixtures)("classifies and decomposes: $input", (fixture) => {
    const block = classifyBlockWithConfidence(fixture.input);
    const packet = generateRescuePacket(fixture.input);

    expect(classifyTaskType(fixture.input)).toBe(fixture.taskType);
    expect(block.blockType).toBe(fixture.blockType);
    expect(block.confidence).toBeGreaterThanOrEqual(0.6);
    expect(packet.taskType).toBe(fixture.taskType);
    expect(packet.blockConfidence).toBeGreaterThanOrEqual(0.6);
    expect(packet.firstPhysicalAction).toContain(fixture.expectedActionFragment);

    if (fixture.missingItem) {
      expect(detectMissingItem(fixture.input)).toBe(fixture.missingItem);
    }
  });

  it("combines task type and block for first physical actions", () => {
    expect(
      generateFirstPhysicalAction(
        "I need to do my tax but there is too much paperwork.",
        "overwhelm",
        "tax"
      )
    ).toContain("one tax document");

    expect(
      generateFirstPhysicalAction(
        "My essay needs to be perfect before I can submit it.",
        "perfectionism",
        "essay"
      )
    ).toContain("three ugly bullets");
  });

  it("generates specific repair scripts for common obligations", () => {
    expect(generateRepairScript("late email reply", "shame_fear", "email")).toContain(
      "I'm sorry for the delay"
    );
    expect(generateRepairScript("missed appointment", "shame_fear", "appointment")).toContain(
      "reschedule"
    );
    expect(generateRepairScript("extension request for deadline", "time_blindness", "essay")).toContain(
      "Could I send it by"
    );
    expect(generateRepairScript("need clarification on what they want", "missing_information", "work")).toContain(
      "Could you clarify"
    );
    expect(generateRepairScript("need help with this task", "missing_information", "admin")).toContain(
      "Could you help me"
    );
    expect(generateRepairScript("renegotiate scope because it is too much", "overwhelm", "work")).toContain(
      "agree on what matters most"
    );
    expect(generateRepairScript("I need to apologise", "shame_fear", "email")).toContain(
      "take responsibility"
    );
  });

  it("does not generate an email-style repair script when no repair is needed yet", () => {
    const script = generateRepairScript(
      "I need to start my assignment",
      "ambiguous_start",
      "study"
    );
    const packet = generateRescuePacket("I need to start my assignment");

    expect(script).toContain("No repair needed yet");
    expect(script).not.toContain("Hi [Name]");
    expect(packet.repairScript).toContain("No repair needed yet");
    expect(packet.repairScript).not.toContain("Hi [Name]");
  });

  it("does not treat a normal due date as a repair request", () => {
    const script = generateRepairScript(
      "I have an essay due and I don't know where to start.",
      "ambiguous_start",
      "essay"
    );

    expect(script).toContain("No repair needed yet");
    expect(script).not.toContain("Could I send it by");
  });

  it("infers and writes exit responsibly scripts", () => {
    expect(inferExitStatus("I need to delegate this to someone else")).toBe("delegate");
    expect(
      generateExitResponsiblyScript("I need to defer this", "work", "defer")
    ).toContain("move this");
    expect(
      generateExitResponsiblyScript("This is too much and scope is wrong", "work", "renegotiate")
    ).toContain("current scope");
  });
});
