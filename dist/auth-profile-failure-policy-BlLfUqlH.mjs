import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./tokens-BTKQYTUd.mjs";
import { v as runOncePerAgentRun } from "./agent-events-BOSJcayE.mjs";
import { o as isPluginHookAgentTrigger } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/before-agent-reply.ts
const beforeAgentReplyObserver = resolveGlobalSingleton(Symbol.for("openclaw.beforeAgentReply.observer"), () => new AsyncLocalStorage());
/** Attaches durable admission bookkeeping without moving hook ownership out of the runner. */
function withBeforeAgentReplyObserver(observer, run) {
	return beforeAgentReplyObserver.run({ ...observer }, run);
}
/** Preserves the full plugin reply contract, including private payload metadata. */
function buildHandledBeforeAgentReplyPayloads(reply) {
	return [reply ?? { text: "NO_REPLY" }];
}
/** Runs the reply claim hook once for one admitted turn, across model fallbacks. */
function runBeforeAgentReplyForTurn(params) {
	const trigger = params.trigger;
	if (!isPluginHookAgentTrigger(trigger)) return Promise.resolve(void 0);
	const context = {
		...params.context,
		trigger
	};
	return runOncePerAgentRun(params.runId, "before_agent_reply", async () => {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("before_agent_reply", context)) return;
		const observerScope = beforeAgentReplyObserver.getStore();
		const observer = observerScope && (!observerScope.runId || observerScope.runId === params.runId) ? observerScope : void 0;
		if (observer && !observer.runId) observer.runId = params.runId;
		if (await observer?.beforeDispatch() === false) return;
		params.onDispatch?.();
		let result = await hookRunner.runBeforeAgentReply(params.event, context);
		if (!result?.handled) params.onDeclined?.();
		if (observer) result = await observer.afterDispatch(result);
		return result;
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.ts
/**
* Returns the subset of failover reasons that should affect shared auth-profile
* health. Local helper failures and request-shape/transport outcomes stay
* session-local so one bad transcript or connection does not cool down an
* otherwise healthy provider profile.
*/
function resolveAuthProfileFailureReason(params) {
	if (params.policy === "local" || !params.failoverReason || params.failoverReason === "overloaded" || params.policy === "local_transient" && params.failoverReason === "rate_limit" && params.transientRateLimit === true || params.failoverReason === "server_error" || params.failoverReason === "tls_certificate" || params.failoverReason === "empty_response" || params.failoverReason === "context_overflow" || params.failoverReason === "format") return null;
	if (params.failoverReason === "timeout" && params.providerStarted !== true) return null;
	return params.failoverReason;
}
//#endregion
export { withBeforeAgentReplyObserver as i, buildHandledBeforeAgentReplyPayloads as n, runBeforeAgentReplyForTurn as r, resolveAuthProfileFailureReason as t };
