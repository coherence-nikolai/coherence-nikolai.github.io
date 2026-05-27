import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearByokSettings,
  defaultByokSettings,
  loadByokSettings,
  saveByokSettings,
  summarizeByokSettings
} from "./byokSettings";

function installLocalStorageMock() {
  const store = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => store.set(key, value)),
      removeItem: vi.fn((key: string) => store.delete(key))
    }
  });
}

describe("BYOK settings", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to safe defaults without browser storage", () => {
    expect(loadByokSettings()).toEqual(defaultByokSettings());
  });

  it("saves keys locally but exposes only a safe summary", () => {
    installLocalStorageMock();

    const saved = saveByokSettings({
      provider: "openai",
      apiKey: "sk-local-test",
      model: "gpt-4.1-mini",
      endpoint: "https://api.openai.com/v1/chat/completions"
    });
    const summary = summarizeByokSettings(saved);

    expect(loadByokSettings().apiKey).toBe("sk-local-test");
    expect(summary.hasApiKey).toBe(true);
    expect(JSON.stringify(summary)).not.toContain("sk-local-test");
  });

  it("clears locally stored keys", () => {
    installLocalStorageMock();
    saveByokSettings({
      provider: "anthropic",
      apiKey: "anthropic-key",
      model: "claude-3-5-haiku-20241022",
      endpoint: "https://api.anthropic.com/v1/messages"
    });

    clearByokSettings();

    expect(loadByokSettings().apiKey).toBe("");
  });
});
