//#region src/infra/provider-usage.types.d.ts
/** One quota window reported by a provider usage endpoint. */
type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};
type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  summary?: string;
  plan?: string;
  error?: string;
};
type UsageProviderId = "anthropic" | "deepseek" | "github-copilot" | "google-gemini-cli" | "minimax" | "openai" | "xiaomi" | "xiaomi-token-plan" | "zai";
//#endregion
export { UsageProviderId as n, UsageWindow as r, ProviderUsageSnapshot as t };