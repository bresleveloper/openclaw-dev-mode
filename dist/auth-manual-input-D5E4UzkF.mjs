import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
//#region src/commands/models/auth-manual-input.ts
/** Input contracts shared by manual token/API-key commands and the API-key writer. */
function resolveDefaultTokenProfileId(provider) {
	return `${normalizeProviderId(provider)}:manual`;
}
function normalizeManualAuthProvider(provider) {
	const normalized = normalizeProviderId(provider);
	if (normalized === "openai-codex" || normalized === "codex-cli") throw new Error(`"${normalized}" is a legacy provider ID; use --provider openai.`);
	return normalized === "openai" || normalized === "codex" ? "openai" : normalized;
}
function looksLikeOpenAIApiKey(value) {
	return /^sk-[A-Za-z0-9_-]{8,}$/.test(value.trim());
}
function validateOpenAICodexApiKeyInput(value) {
	const trimmed = value.trim();
	if (!trimmed) return "Required";
	if (looksLikeOpenAIApiKey(trimmed)) return;
	const tokenParts = trimmed.replace(/^Bearer\s+/i, "").trim().split(".");
	if (tokenParts.length === 3 && tokenParts.every((part) => /^[A-Za-z0-9_-]{8,}$/.test(part)) || trimmed.startsWith("{") || trimmed.startsWith("[")) return `That looks like token or OAuth material, not an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-token --provider openai")} for token auth material.`;
	return "That does not look like an OpenAI API key.";
}
//#endregion
export { validateOpenAICodexApiKeyInput as i, normalizeManualAuthProvider as n, resolveDefaultTokenProfileId as r, looksLikeOpenAIApiKey as t };
