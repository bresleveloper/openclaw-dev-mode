import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "@openclaw/ai/providers";
//#region src/agents/embedded-agent-runner/run/session-boundary-prompt-cache-key.ts
function resolveWebchatPromptCacheKey(params) {
	return `openclaw-webchat-${sha256HexPrefixCore([
		"v1",
		params.provider.trim().toLowerCase(),
		params.model.trim(),
		normalizeAgentId(params.agentId),
		params.sessionKey
	].join("\0"), 32)}`;
}
function resolveSessionBoundaryPromptCacheKey(params) {
	const explicit = params.promptCacheKey?.trim();
	if (explicit) return explicit;
	if (!params.api.includes("openai")) return;
	const suffix = `:${params.boundaryCount}`;
	const maxSessionIdLength = OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH - suffix.length;
	return `${truncateCodePoints(params.sessionId, maxSessionIdLength)}${suffix}`;
}
//#endregion
export { resolveWebchatPromptCacheKey as n, resolveSessionBoundaryPromptCacheKey as t };
