import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as generateSecureToken } from "./secure-random-DxCgeORs.mjs";
import { n as extractAssistantTextForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { o as extractAssistantVisibleText } from "./embedded-agent-utils-Bl20r92X.mjs";
import { i as toNormalizedUsage } from "./usage-accumulator-Cd3yWsMu.mjs";
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-block-type.ts
function isRunnerToolCallBlock(block) {
	const type = asOptionalObjectRecord(block)?.type;
	return type === "toolCall" || type === "toolUse" || type === "functionCall";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/helpers.ts
const RUNTIME_AUTH_REFRESH_MARGIN_MS = 3e5;
const RUNTIME_AUTH_REFRESH_RETRY_MS = 6e4;
const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5e3;
const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "[redacted]";
/** Anthropic's transport interprets this marker even for native-owned attempts. */
function resolveEmbeddedAttemptBasePrompt(params) {
	if (params.provider !== "anthropic") return params.prompt;
	return params.prompt.replaceAll(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, ANTHROPIC_MAGIC_STRING_REPLACEMENT);
}
function createRunRecoveryDiagId() {
	return `ovf-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
const BASE_RUN_RETRY_ITERATIONS = 24;
const RUN_RETRY_ITERATIONS_PER_PROFILE = 8;
const MIN_RUN_RETRY_ITERATIONS = 32;
const MAX_RUN_RETRY_ITERATIONS = 160;
function resolveMaxRunRetryIterations(profileCandidateCount) {
	const scaled = BASE_RUN_RETRY_ITERATIONS + Math.max(1, profileCandidateCount) * RUN_RETRY_ITERATIONS_PER_PROFILE;
	return Math.min(MAX_RUN_RETRY_ITERATIONS, Math.max(MIN_RUN_RETRY_ITERATIONS, scaled));
}
function resolveReportedModelRef(params) {
	const assistantProvider = params.assistant?.provider?.trim();
	const assistantModel = params.assistant?.model?.trim();
	if (assistantProvider?.toLowerCase() === "openclaw") return {
		provider: params.provider,
		model: params.model
	};
	return {
		provider: assistantProvider || params.provider,
		model: assistantModel || params.model
	};
}
function resolveLatestCallUsage(params) {
	const currentAttempt = params.currentAttemptCandidates.find(hasNonzeroUsage);
	return {
		currentAttempt,
		latest: [
			currentAttempt,
			params.carriedUsage,
			params.transcriptFallback
		].find(hasNonzeroUsage)
	};
}
function normalizeAssistantUsageForContext(assistant) {
	if (assistant?.api === "cli" && assistant.usage && typeof assistant.usage === "object" && !Array.isArray(assistant.usage) && assistant.usage.contextUsage === void 0) return { contextUsage: { state: "unavailable" } };
	return normalizeUsage(assistant?.usage);
}
function buildUsageAgentMetaFields(params) {
	const usage = toNormalizedUsage(params.usageAccumulator);
	const lastCallUsage = [normalizeUsage(params.latestUsage), params.lastRunPromptUsage].find(hasNonzeroUsage);
	return {
		usage,
		lastCallUsage,
		promptTokens: deriveContextPromptTokens({ lastCallUsage }),
		...usage?.cost ? { costUsd: usage.cost.total } : {}
	};
}
/** Error returns retain usage so the session does not keep an older context total. */
function buildErrorAgentMeta(params) {
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: params.usageAccumulator,
		latestUsage: normalizeAssistantUsageForContext(params.currentAttemptAssistant),
		lastRunPromptUsage: params.lastRunPromptUsage
	});
	return {
		sessionId: params.sessionId,
		...params.sessionFile ? { sessionFile: params.sessionFile } : {},
		provider: params.provider,
		model: params.model,
		...params.credentialSource ? { credentialSource: params.credentialSource } : {},
		...params.contextTokens ? { contextTokens: params.contextTokens } : {},
		...params.contextTokens ? { contextTokensSource: params.contextTokensSource ?? "resolved" } : {},
		...usageMeta.usage ? { usage: usageMeta.usage } : {},
		...usageMeta.lastCallUsage ? { lastCallUsage: usageMeta.lastCallUsage } : {},
		...usageMeta.promptTokens ? { promptTokens: usageMeta.promptTokens } : {},
		...usageMeta.costUsd !== void 0 ? { costUsd: usageMeta.costUsd } : {}
	};
}
function resolveFinalAssistantVisibleText(lastAssistant) {
	if (!lastAssistant) return;
	return extractAssistantVisibleText(lastAssistant).trim() || void 0;
}
/**
* Raw text of the model's final message for diagnostic capture. A message that
* ended in a tool call is not final: the turn continued past it, so its text is
* narration even when a later message never completed.
*/
function resolveFinalMessageRawText(lastAssistant) {
	if (!lastAssistant || lastAssistant.stopReason === "toolUse" || lastAssistant.content.some(isRunnerToolCallBlock)) return;
	return resolveFinalAssistantRawText(lastAssistant);
}
function resolveFinalAssistantRawText(lastAssistant) {
	if (!lastAssistant) return;
	return (extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" }) ?? extractAssistantTextForPhase(lastAssistant) ?? "").trim() || void 0;
}
//#endregion
export { buildUsageAgentMetaFields as a, resolveEmbeddedAttemptBasePrompt as c, resolveFinalMessageRawText as d, resolveLatestCallUsage as f, isRunnerToolCallBlock as h, buildErrorAgentMeta as i, resolveFinalAssistantRawText as l, resolveReportedModelRef as m, RUNTIME_AUTH_REFRESH_MIN_DELAY_MS as n, createRunRecoveryDiagId as o, resolveMaxRunRetryIterations as p, RUNTIME_AUTH_REFRESH_RETRY_MS as r, normalizeAssistantUsageForContext as s, RUNTIME_AUTH_REFRESH_MARGIN_MS as t, resolveFinalAssistantVisibleText as u };
