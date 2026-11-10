import { _ as MAX_COMPACTION_SUMMARY_CHARS } from "./agent-core-BbGXCiXw.mjs";
import { t as createFreshLlmBoundaryTokenEstimator } from "./context-token-pressure-II9nRGTn.mjs";
//#region src/agents/sessions/compaction/request-budget.ts
const promptRequestBudgets = /* @__PURE__ */ new WeakMap();
function estimateVariableRequestTokens(messages, prompt) {
	const estimateTokens = createFreshLlmBoundaryTokenEstimator({});
	return estimateTokens({
		messages,
		prompt
	}) - estimateTokens({
		messages: [],
		prompt: ""
	});
}
/** Bind prepared foreground facts to the exact owned prompt invocation, outside public options. */
function attachPromptCompactionRequestBudget(options, budget) {
	if (budget) promptRequestBudgets.set(options, budget);
}
function takePromptCompactionRequestBudget(options) {
	if (!options) return;
	const budget = promptRequestBudgets.get(options);
	promptRequestBudgets.delete(options);
	return budget;
}
function createCompactionRequestBudget(params) {
	const estimateTokens = createFreshLlmBoundaryTokenEstimator(params);
	const fixedTokens = estimateTokens({
		messages: [],
		prompt: ""
	});
	const pendingUserTokens = (params.pendingPrompt ?? "") === "" && (params.pendingImageCount ?? 0) === 0 ? 0 : estimateTokens({
		messages: [],
		prompt: params.pendingPrompt ?? "",
		imageCount: params.pendingImageCount
	}) - fixedTokens;
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(params.pendingQueuedContextMessages ?? []);
	const additionalContextTokens = estimateCompactionHistoryTokens(params.pendingContextMessages ?? []) + pendingQueuedContextTokens;
	const additiveTokens = params.pendingAdditivePrompt ? estimateVariableRequestTokens([], params.pendingAdditivePrompt) : 0;
	return {
		contextWindow: params.contextWindow,
		reserveTokens: params.reserveTokens,
		fixedTokens,
		pendingUserIdempotencyKey: params.pendingUserIdempotencyKey,
		pendingTokens: pendingUserTokens + additionalContextTokens,
		pendingQueuedContextTokens,
		...additionalContextTokens || additiveTokens ? { pendingUserTokens: Math.max(0, pendingUserTokens - additiveTokens) } : {}
	};
}
/** Reconcile only queued context; prepared user, image, and transient costs stay owned upstream. */
function withCompactionQueuedContext(budget, messages) {
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(messages);
	const previousQueuedTokens = budget.pendingQueuedContextTokens ?? 0;
	if (pendingQueuedContextTokens === previousQueuedTokens) return budget;
	return {
		...budget,
		pendingTokens: budget.pendingTokens - previousQueuedTokens + pendingQueuedContextTokens,
		pendingQueuedContextTokens,
		pendingUserTokens: budget.pendingUserTokens ?? budget.pendingTokens - previousQueuedTokens
	};
}
function estimateCompactionHistoryTokens(messages, budget) {
	const pending = budget?.pendingTokens && budget.pendingUserIdempotencyKey ? messages.findLast((message) => message.role === "user" && "idempotencyKey" in message && message.idempotencyKey === budget.pendingUserIdempotencyKey) : void 0;
	const overlap = pending ? Math.min(estimateCompactionHistoryTokens([pending]), budget?.pendingUserTokens ?? budget?.pendingTokens ?? 0) : 0;
	return estimateVariableRequestTokens(messages, "") - overlap;
}
function estimateCompactedRequestTokens(messages, budget) {
	return budget.fixedTokens + budget.pendingTokens + estimateCompactionHistoryTokens(messages, budget);
}
function resolveCompactionRetentionBudget(budget, messages) {
	const preferredTokens = budget.contextWindow - budget.reserveTokens - budget.fixedTokens - budget.pendingTokens;
	return {
		maxTokens: preferredTokens <= 0 ? estimateCompactionHistoryTokens(messages, budget) - 1 : preferredTokens,
		reserveTokens: estimateCompactionHistoryTokens([{
			role: "compactionSummary",
			summary: "x".repeat(MAX_COMPACTION_SUMMARY_CHARS),
			tokensBefore: 0,
			timestamp: 0
		}])
	};
}
//#endregion
export { resolveCompactionRetentionBudget as a, estimateCompactionHistoryTokens as i, createCompactionRequestBudget as n, takePromptCompactionRequestBudget as o, estimateCompactedRequestTokens as r, withCompactionQueuedContext as s, attachPromptCompactionRequestBudget as t };
