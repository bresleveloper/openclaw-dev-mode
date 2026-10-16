import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { p as CLAUDE_MODEL_ID_ALIASES, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-D6douw4O.mjs";
//#region extensions/anthropic/claude-model-refs.ts
function splitTrailingModelAuthProfile(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return { model: "" };
	const lastSlash = trimmed.lastIndexOf("/");
	let delimiter = trimmed.indexOf("@", lastSlash + 1);
	if (delimiter <= 0) return { model: trimmed };
	if (/^\d{8}(?:@|$)/.test(trimmed.slice(delimiter + 1))) {
		const nextDelimiter = trimmed.indexOf("@", delimiter + 9);
		if (nextDelimiter < 0) return { model: trimmed };
		delimiter = nextDelimiter;
	}
	const model = trimmed.slice(0, delimiter).trim();
	const profile = trimmed.slice(delimiter + 1).trim();
	return model && profile ? {
		model,
		profile
	} : { model: trimmed };
}
function attachModelAuthProfile(model, profile) {
	return profile ? `${model}@${profile}` : model;
}
function normalizeAnthropicProviderId(provider) {
	const normalized = normalizeLowercaseStringOrEmpty(provider);
	if (normalized === "bedrock" || normalized === "aws-bedrock") return "amazon-bedrock";
	return normalized;
}
function parseAnthropicModelRef(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return {
		provider: "anthropic",
		model: trimmed,
		explicitProvider: false
	};
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	if (!provider || !model) return null;
	return {
		provider: normalizeAnthropicProviderId(provider),
		model,
		explicitProvider: true
	};
}
function canonicalizeKnownClaudeCliModelId(modelId) {
	const split = splitTrailingModelAuthProfile(modelId);
	const trimmed = split.model.trim();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (!normalized) return null;
	const upgraded = upgradeOldClaudeModelId(normalized);
	if (upgraded) return attachModelAuthProfile(upgraded, split.profile);
	if (normalized.startsWith("claude-")) return attachModelAuthProfile(trimmed, split.profile);
	const aliasedModel = CLAUDE_MODEL_ID_ALIASES.get(normalized);
	return aliasedModel ? attachModelAuthProfile(aliasedModel, split.profile) : null;
}
function upgradeOldClaudeModelId(normalized) {
	const retiredClaude4 = /^claude-(opus|sonnet)-4(?:$|[-.][015](?=$|[-.:@])|-20\d{6})/.exec(normalized);
	if (retiredClaude4) return retiredClaude4[1] === "opus" ? "claude-opus-5-5" : "claude-sonnet-4-6";
	if (normalized.startsWith("claude-3") && normalized.includes("opus")) return "claude-opus-5-5";
	if (normalized.startsWith("claude-3") && (normalized.includes("sonnet") || normalized.includes("haiku"))) return "claude-sonnet-4-6";
	if ([
		"opus-4.5",
		"opus-4.1",
		"opus-4",
		"opus-3"
	].includes(normalized)) return "claude-opus-5-5";
	if ([
		"sonnet-4.5",
		"sonnet-4.1",
		"sonnet-4.0",
		"sonnet-4",
		"sonnet-3.7",
		"sonnet-3.5",
		"sonnet-3",
		"haiku-3.5",
		"haiku-3"
	].includes(normalized)) return "claude-sonnet-4-6";
	return null;
}
function resolveClaudeCliAnthropicModelRefs(raw) {
	const parsed = parseAnthropicModelRef(raw);
	if (!parsed) return null;
	if (parsed.provider !== "anthropic" && parsed.provider !== "claude-cli") return null;
	const selectedRef = `anthropic/${parsed.model}`;
	const runtimeRefs = /* @__PURE__ */ new Set([selectedRef]);
	const canonicalModelId = canonicalizeKnownClaudeCliModelId(parsed.model);
	if (!parsed.explicitProvider && !canonicalModelId) return null;
	const rewriteRef = canonicalModelId || parsed.provider === "claude-cli" ? `anthropic/${canonicalModelId ?? parsed.model}` : void 0;
	if (rewriteRef) runtimeRefs.add(rewriteRef);
	return {
		selectedRef,
		runtimeRefs: [...runtimeRefs],
		...rewriteRef ? { rewriteRef } : {}
	};
}
function resolveKnownAnthropicModelRef(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	return resolveClaudeCliAnthropicModelRefs(trimmed)?.rewriteRef ?? trimmed;
}
function modelEntryWithClaudeCliRuntime(entry) {
	const base = isRecord(entry) ? { ...entry } : {};
	const currentRuntimeId = isRecord(base.agentRuntime) ? base.agentRuntime.id : void 0;
	const currentRuntime = normalizeLowercaseStringOrEmpty(currentRuntimeId);
	if (currentRuntime && currentRuntime !== "auto") return base;
	base.agentRuntime = {
		...isRecord(base.agentRuntime) ? base.agentRuntime : {},
		id: CLAUDE_CLI_BACKEND_ID
	};
	return base;
}
//#endregion
export { resolveKnownAnthropicModelRef as a, resolveClaudeCliAnthropicModelRefs as i, normalizeAnthropicProviderId as n, splitTrailingModelAuthProfile as o, parseAnthropicModelRef as r, modelEntryWithClaudeCliRuntime as t };
