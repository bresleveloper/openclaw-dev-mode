/**
 * SEC-101 (openclaw-dev-mode fork): dev-mode skips the per-channel tool allowlist.
 *
 * Upstream narrows the agent's tools by the message provider of the turn
 * (`filterToolsByMessageProvider`, src/agents/agent-tools.message-provider-policy.ts). Dev-mode
 * keeps every tool on every channel. Same name and signature as upstream's function, so the only
 * hook is the import line in src/agents/agent-tools.ts: that file sits at its max-lines cap
 * (700 counted lines at 2026.10.10) and an inline ternary pushed it over.
 *
 * Regression checklist (every upstream upgrade):
 * - agent-tools.ts still imports `filterToolsByMessageProvider` from this file, and upstream's
 *   function keeps the same signature;
 * - no other call site of upstream's function needs the same treatment
 *   (`git grep -n "filterToolsByMessageProvider(" src`). Known and deliberately unhooked since
 *   10.4: src/gateway/tool-resolution.ts (gateway-scoped tools, e.g. claude-cli's loopback MCP);
 * - `pnpm exec oxlint src/agents/agent-tools.ts` reports no max-lines error.
 */
import { isDevMode } from "../globals.js";
import { filterToolsByMessageProvider as filterToolsByMessageProviderUpstream } from "./agent-tools.message-provider-policy.js";

export function filterToolsByMessageProvider<TTool extends { name: string }>(
  tools: readonly TTool[],
  messageProvider?: string,
): TTool[] {
  return isDevMode() ? [...tools] : filterToolsByMessageProviderUpstream(tools, messageProvider);
}
