import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { d as getAgentRunLifecycleGeneration, l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
//#region src/sessions/provider-review-terminal.ts
const issuedFacts = resolveGlobalSingleton(Symbol.for("openclaw.providerReviewTerminalFacts"), () => /* @__PURE__ */ new WeakSet());
/** Incognito metadata joins its existing terminal write instead of opening another store. */
function captureAgentRunProviderReview(params) {
	params.assertCurrent();
	const context = getAgentRunContext(params.runId);
	const lifecycleGeneration = getAgentRunLifecycleGeneration();
	if (!isIncognitoSessionKey(params.target.sessionKey) || !context || context.lifecycleGeneration !== lifecycleGeneration || context.sessionKey !== params.target.sessionKey || context.sessionId !== params.target.sessionId || params.review.runId !== params.runId || params.review.sessionId !== params.target.sessionId || !params.expectedWriterRunId) throw new Error("Provider review no longer owns its incognito run");
	const target = Object.freeze({
		...params.target,
		storePath: resolveIncognitoOpenClawAgentSqlitePath({ agentId: params.target.agentId })
	});
	const review = structuredClone(params.review);
	if (review.review?.continuation) Object.freeze(review.review.continuation);
	if (review.review) Object.freeze(review.review);
	Object.freeze(review);
	const assertSourceCurrent = context.assertSourceCurrent;
	const fact = Object.freeze({
		target,
		review,
		expectedWriterRunId: params.expectedWriterRunId,
		lifecycleGeneration,
		lifecycleStartedAt: context.lifecycleStartedAt,
		capturedAtMs: Date.now(),
		assertCurrent: () => {
			assertSourceCurrent?.();
			if (getAgentRunLifecycleGeneration() !== lifecycleGeneration || getAgentRunContext(params.runId) !== context || context.providerReviewTerminal !== fact || resolveIncognitoOpenClawAgentSqlitePath({ agentId: target.agentId }) !== target.storePath || context.sessionKey !== target.sessionKey || context.sessionId !== target.sessionId) throw new Error("Provider review terminal ownership changed");
		}
	});
	params.assertCurrent();
	issuedFacts.add(fact);
	Object.defineProperty(context, "providerReviewTerminal", {
		value: fact,
		enumerable: false,
		configurable: true
	});
}
function readAgentRunProviderReview(runId) {
	const fact = getAgentRunContext(runId)?.providerReviewTerminal;
	if (!fact || !issuedFacts.has(fact)) return;
	fact.assertCurrent();
	return fact;
}
//#endregion
export { readAgentRunProviderReview as n, captureAgentRunProviderReview as t };
