import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./defaults-Jag53zwP.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CG17uXFn.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./agent-runtime-BhLWDirV.mjs";
import { B as RECALLED_CONTEXT_LINE_PATTERNS, a as ACTIVE_MEMORY_OPEN_TAG, n as ACTIVE_MEMORY_CLOSE_TAG } from "./types-DgEaE0BK.mjs";
//#region extensions/active-memory/query.ts
function buildQuery(params) {
	const latest = params.latestUserMessage.trim();
	if (params.config.queryMode === "message") return latest;
	if (params.config.queryMode === "full") {
		const allTurns = (params.recentTurns ?? []).map((turn) => `${turn.role}: ${turn.text.trim().replace(/\s+/g, " ")}`);
		if (allTurns.length === 0) return latest;
		return [
			"Full conversation context:",
			...allTurns,
			"",
			"Latest user message:",
			latest
		].join("\n");
	}
	const remaining = {
		user: params.config.recentUserTurns,
		assistant: params.config.recentAssistantTurns
	};
	const selected = [];
	for (let index = (params.recentTurns ?? []).length - 1; index >= 0; index -= 1) {
		const turn = params.recentTurns?.[index];
		if (!turn || remaining[turn.role] <= 0) continue;
		remaining[turn.role] -= 1;
		selected.push({
			role: turn.role,
			text: truncateUtf16Safe(turn.text.trim().replace(/\s+/g, " "), turn.role === "user" ? params.config.recentUserChars : params.config.recentAssistantChars)
		});
	}
	const recentTurns = selected.toReversed().filter((turn) => turn.text.length > 0);
	if (recentTurns.length === 0) return latest;
	return [
		"Recent conversation tail:",
		...recentTurns.map((turn) => `${turn.role}: ${turn.text}`),
		"",
		"Latest user message:",
		latest
	].join("\n");
}
function normalizeSearchQueryText(text) {
	return text.split("\n").map((line) => line.trim()).filter((line) => line && line !== "Context:" && !/^(conversation info|sender|untrusted context)\b/i.test(line) && !/^(source: external|---|untrusted discord message body)$/i.test(line) && !/^⚠️?\s*Agent couldn't generate a response/i.test(line) && !/^Please try again\.?$/i.test(line)).join(" ").replace(/\s+/g, " ").trim();
}
function clampSearchQuery(text) {
	const normalized = text.replace(/\s+/g, " ").trim();
	return normalized.length > 480 ? truncateUtf16Safe(normalized, 480).trim() : normalized;
}
function buildSearchQuery(params) {
	const latest = clampSearchQuery(normalizeSearchQueryText(params.latestUserMessage.replace(/<<<EXTERNAL_UNTRUSTED_CONTENT\b[^>]*>>>[\s\S]*?<<<END_EXTERNAL_UNTRUSTED_CONTENT\b[^>]*>>>/g, " ").replace(/```(?:json)?\s*[\s\S]*?```/gi, " ").replace(/<active_memory_plugin>[\s\S]*?<\/active_memory_plugin>/gi, " ")));
	if (latest.length >= 12 || !params.recentTurns?.length) return latest || clampSearchQuery(params.latestUserMessage);
	const previousUser = params.recentTurns.toReversed().find((turn) => turn.role === "user" && turn.text.trim() !== params.latestUserMessage.trim());
	if (!previousUser) return latest || clampSearchQuery(params.latestUserMessage);
	const context = truncateUtf16Safe(clampSearchQuery(normalizeSearchQueryText(stripRecalledContextNoise(previousUser.text))), 120).trim();
	return clampSearchQuery(context ? `${context} ${latest}` : latest);
}
function extractTextContentParts(content) {
	if (typeof content === "string") return content.trim() ? [content] : [];
	if (!Array.isArray(content)) return [];
	const parts = [];
	for (const item of content) {
		if (typeof item === "string") {
			parts.push(item);
			continue;
		}
		const typed = asOptionalObjectRecord(item);
		if (!typed) continue;
		if (typeof typed.text === "string") {
			parts.push(typed.text);
			continue;
		}
		if (typed.type === "text" && typeof typed.content === "string") parts.push(typed.content);
	}
	return parts.map((part) => part.trim()).filter(Boolean);
}
function extractTextContent(content) {
	return extractTextContentParts(content).join(" ").trim();
}
function stripRecalledContextNoise(text, injectedPrefixOnly = false) {
	const lines = text.split("\n").map((line) => line.trim());
	const cleanedLines = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		if (!line) continue;
		const blockStart = line === "Context:" ? index + 1 : index;
		if ((!injectedPrefixOnly || line === "Context:") && lines[blockStart] === ACTIVE_MEMORY_OPEN_TAG) {
			const closeIndex = lines.indexOf(ACTIVE_MEMORY_CLOSE_TAG, blockStart + 1);
			if (closeIndex !== -1) {
				index = closeIndex;
				continue;
			}
		}
		if (!injectedPrefixOnly && (line === "Context:" || line === ACTIVE_MEMORY_CLOSE_TAG || RECALLED_CONTEXT_LINE_PATTERNS.some((pattern) => pattern.test(line)))) continue;
		cleanedLines.push(line);
	}
	return cleanedLines.join(" ").replace(/\s+/g, " ").trim();
}
function extractRecentTurns(messages) {
	const turns = [];
	for (const message of messages) {
		const typed = asOptionalObjectRecord(message);
		if (!typed) continue;
		const role = typed.role === "user" || typed.role === "assistant" ? typed.role : void 0;
		if (!role) continue;
		const text = stripRecalledContextNoise(extractTextContent(typed.content), role === "user");
		if (!text) continue;
		turns.push({
			role,
			text
		});
	}
	return turns;
}
function getModelRef(runtimeConfig, agentId, config, ctx) {
	const currentRunModel = ctx?.modelProviderId && ctx?.modelId ? `${ctx.modelProviderId}/${ctx.modelId}` : void 0;
	const configuredDefaultModel = resolveAgentEffectiveModelPrimary(runtimeConfig, agentId) ? resolveDefaultModelForAgent({
		cfg: runtimeConfig,
		agentId
	}) : void 0;
	const defaultProvider = configuredDefaultModel?.provider ?? "openai";
	const candidates = [
		config.model,
		currentRunModel,
		configuredDefaultModel ? `${configuredDefaultModel.provider}/${configuredDefaultModel.model}` : void 0,
		config.modelFallback
	];
	for (const candidate of candidates) if (candidate) return parseModelRef(candidate, defaultProvider) ?? {
		provider: defaultProvider,
		model: candidate
	};
}
//#endregion
export { extractTextContentParts as a, extractTextContent as i, buildSearchQuery as n, getModelRef as o, extractRecentTurns as r, buildQuery as t };
