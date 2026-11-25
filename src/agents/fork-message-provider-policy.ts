/**
 * SEC-101 (openclaw-dev-mode fork): dev-mode skips the per-channel tool allowlist.
 *
 * Upstream narrows the agent's tools by the message provider of the turn
 * (`filterToolsByMessageProvider`, src/agents/agent-tools.message-provider-policy.ts). Dev-mode
 * keeps every tool on every channel. Same name and signature as upstream's function, so the only
 * hook is the import line in src/agents/agent-tools.assembly.ts (until 2026.11.3 the hook sat in
 * src/agents/agent-tools.ts, which sat at its max-lines cap and an inline ternary pushed it over;
 * 2026.11.10 moved the assembly into agent-tools.assembly.ts).
 *
 * Regression checklist (every upstream upgrade):
 * - agent-tools.assembly.ts still imports `filterToolsByMessageProvider` from this file, and
 *   upstream's function keeps the same signature;
 * - no other call site of upstream's function needs the same treatment
 *   (`git grep -n "filterToolsByMessageProvider(" src`). Known and deliberately unhooked:
 *   src/gateway/tool-resolution.ts (gateway-scoped tools, e.g. claude-cli's loopback MCP, since
 *   10.4), src/agents/agent-tools.inheritance.ts and src/auto-reply/reply/memory-flush-prepare.ts
 *   (new at 11.10: the inherited GitHub-publish tool name and the memory-flush persistence tool
 *   names; the provider lists only restrict `node` and `voice`/`discord-voice`);
 * - `pnpm exec oxlint src/agents/agent-tools.assembly.ts` reports no max-lines error.
 */
import { isDevMode } from "../globals.js";
import { filterToolsByMessageProvider as filterToolsByMessageProviderUpstream } from "./agent-tools.message-provider-policy.js";

export function filterToolsByMessageProvider<TTool extends { name: string }>(
  tools: readonly TTool[],
  messageProvider?: string,
): TTool[] {
  return isDevMode() ? [...tools] : filterToolsByMessageProviderUpstream(tools, messageProvider);
}
