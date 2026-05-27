export type ByokProvider = "openai" | "anthropic" | "custom_openai";

export interface ByokSettings {
  provider: ByokProvider;
  apiKey: string;
  model: string;
  endpoint: string;
  updatedAt?: string;
}

export interface ByokSettingsSummary {
  provider: ByokProvider;
  providerLabel: string;
  model: string;
  endpoint: string;
  hasApiKey: boolean;
  updatedAt?: string;
}

const storageKey = "scaffold.byok.settings.v1";

const providerLabels: Record<ByokProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  custom_openai: "Custom OpenAI-compatible endpoint"
};

export function defaultByokSettings(): ByokSettings {
  return {
    provider: "openai",
    apiKey: "",
    model: "gpt-4.1-mini",
    endpoint: "https://api.openai.com/v1/chat/completions"
  };
}

export function defaultModelForProvider(provider: ByokProvider): string {
  switch (provider) {
    case "anthropic":
      return "claude-3-5-haiku-20241022";
    case "custom_openai":
    case "openai":
      return "gpt-4.1-mini";
  }
}

export function defaultEndpointForProvider(provider: ByokProvider): string {
  switch (provider) {
    case "anthropic":
      return "https://api.anthropic.com/v1/messages";
    case "custom_openai":
      return "";
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
  }
}

export function labelForProvider(provider: ByokProvider): string {
  return providerLabels[provider];
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isProvider(value: unknown): value is ByokProvider {
  return (
    value === "openai" ||
    value === "anthropic" ||
    value === "custom_openai"
  );
}

function normalizeSettings(raw: unknown): ByokSettings {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return defaultByokSettings();
  }

  const record = raw as Record<string, unknown>;
  const provider = isProvider(record.provider) ? record.provider : "openai";
  const model =
    typeof record.model === "string" && record.model.trim()
      ? record.model.trim()
      : defaultModelForProvider(provider);
  const endpoint =
    typeof record.endpoint === "string" && record.endpoint.trim()
      ? record.endpoint.trim()
      : defaultEndpointForProvider(provider);

  return {
    provider,
    apiKey: typeof record.apiKey === "string" ? record.apiKey : "",
    model,
    endpoint,
    updatedAt:
      typeof record.updatedAt === "string" ? record.updatedAt : undefined
  };
}

export function loadByokSettings(): ByokSettings {
  if (!canUseLocalStorage()) return defaultByokSettings();

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? normalizeSettings(JSON.parse(raw)) : defaultByokSettings();
  } catch {
    return defaultByokSettings();
  }
}

export function saveByokSettings(settings: ByokSettings): ByokSettings {
  const provider = settings.provider;
  const nextSettings: ByokSettings = {
    provider,
    apiKey: settings.apiKey.trim(),
    model: settings.model.trim() || defaultModelForProvider(provider),
    endpoint: settings.endpoint.trim() || defaultEndpointForProvider(provider),
    updatedAt: new Date().toISOString()
  };

  if (canUseLocalStorage()) {
    window.localStorage.setItem(storageKey, JSON.stringify(nextSettings));
  }

  return nextSettings;
}

export function clearByokSettings(): ByokSettings {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(storageKey);
  }

  return defaultByokSettings();
}

export function summarizeByokSettings(settings: ByokSettings): ByokSettingsSummary {
  return {
    provider: settings.provider,
    providerLabel: labelForProvider(settings.provider),
    model: settings.model,
    endpoint: settings.endpoint,
    hasApiKey: Boolean(settings.apiKey.trim()),
    updatedAt: settings.updatedAt
  };
}

export function providerLabelFromSettings(settings: ByokSettings): string {
  return `${labelForProvider(settings.provider)} BYOK`;
}
