import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { d as runWithSessionSourceScope, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { i as copyAgentToolMetadata } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-tool-source-execution-guard.ts
const executionBudgetContext = resolveGlobalSingleton(Symbol.for("openclaw.agentToolExecutionBudgetContext"), () => new AsyncLocalStorage());
/** One invocation owns the count and closes every tool closure it created. */
function createAgentToolExecutionBudget(params) {
	let toolCalls = 0;
	let active = true;
	const assertCurrent = () => {
		params.signal.throwIfAborted();
		try {
			if (!active || params.isCurrent?.() === false) throw new Error("Agent tool execution scope is no longer active");
		} catch (error) {
			if (error instanceof Error) params.abort(error);
			throw error;
		}
	};
	const admit = () => {
		assertCurrent();
		if (params.maxToolCalls !== void 0 && toolCalls >= params.maxToolCalls) {
			const error = /* @__PURE__ */ new Error("Agent tool-call budget exhausted");
			params.abort(error);
			throw error;
		}
		toolCalls += 1;
	};
	return {
		get toolCalls() {
			return toolCalls;
		},
		async run(run) {
			try {
				return await executionBudgetContext.run({
					admit,
					assertCurrent
				}, run);
			} finally {
				active = false;
			}
		}
	};
}
/** Capture at tool construction so retained tools cannot borrow a later budget. */
function captureAgentToolExecutionBudget() {
	return executionBudgetContext.getStore()?.admit;
}
/** Freeze the invocation's operational fence before asynchronous source work. */
function captureAgentToolSourceExecutionGuard(signal) {
	const authority = getGatewayToolCallerIdentity()?.receiptAuthority;
	const assertBudgetCurrent = executionBudgetContext.getStore()?.assertCurrent;
	const assertReceipt = Object.assign(() => {
		if (authority?.() === false) throw new Error("tool invocation authority is no longer active");
	}, authority);
	return composeSessionSourceAssertion([assertReceipt], (assertSource) => {
		signal?.throwIfAborted();
		assertBudgetCurrent?.();
		assertSource();
	});
}
/** Prepare storage authority for one effect; its final callback checks the retained receipt. */
function runWithAgentToolSourceExecutionScope(source, run) {
	return runWithSessionSourceScope(source, run, { checkAfter: false });
}
const SOURCE_EXECUTION_GUARD = Symbol.for("openclaw.agentToolSourceExecutionGuard");
function appendSourceExecutionGuard(tool, guard) {
	const inherited = tool[SOURCE_EXECUTION_GUARD];
	if (inherited === guard) return;
	Object.defineProperty(tool, SOURCE_EXECUTION_GUARD, {
		value: inherited ? composeSessionSourceAssertion([inherited, guard]) : guard,
		configurable: true,
		enumerable: false
	});
}
/** Bind a host-owned guard without mutating a tool that another attempt may reuse. */
function bindAgentToolSourceExecutionGuard(tool, guard) {
	const bound = copyAgentToolMetadata(tool, { ...tool });
	copyAgentToolSourceExecutionGuard(tool, bound);
	appendSourceExecutionGuard(bound, guard);
	return bound;
}
function copyAgentToolSourceExecutionGuard(source, target) {
	const guard = source[SOURCE_EXECUTION_GUARD];
	if (guard) appendSourceExecutionGuard(target, guard);
}
function runAgentToolSourceExecutionGuard(tool) {
	tool[SOURCE_EXECUTION_GUARD]?.();
}
/** Third-party tools enter their implementation with freshly prepared source authority. */
function runWithBoundAgentToolSourceExecutionScope(tool, run) {
	return runWithAgentToolSourceExecutionScope(tool[SOURCE_EXECUTION_GUARD], async () => {
		runAgentToolSourceExecutionGuard(tool);
		return run();
	});
}
//#endregion
export { createAgentToolExecutionBudget as a, runWithBoundAgentToolSourceExecutionScope as c, copyAgentToolSourceExecutionGuard as i, captureAgentToolExecutionBudget as n, runAgentToolSourceExecutionGuard as o, captureAgentToolSourceExecutionGuard as r, runWithAgentToolSourceExecutionScope as s, bindAgentToolSourceExecutionGuard as t };
