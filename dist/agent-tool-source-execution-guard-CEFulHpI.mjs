import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as copyAgentToolMetadata } from "./agent-tool-metadata-COcr-3AD.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
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
	return () => {
		signal?.throwIfAborted();
		assertBudgetCurrent?.();
		if (authority?.() === false) throw new Error("tool invocation authority is no longer active");
	};
}
const sourceExecutionGuards = /* @__PURE__ */ new WeakMap();
/** Bind a host-owned guard without mutating a tool that another attempt may reuse. */
function bindAgentToolSourceExecutionGuard(tool, guard) {
	const bound = copyAgentToolMetadata(tool, { ...tool });
	sourceExecutionGuards.set(bound, guard);
	return bound;
}
function copyAgentToolSourceExecutionGuard(source, target) {
	const guard = sourceExecutionGuards.get(source);
	if (guard) sourceExecutionGuards.set(target, guard);
}
function runAgentToolSourceExecutionGuard(tool) {
	sourceExecutionGuards.get(tool)?.();
}
//#endregion
export { createAgentToolExecutionBudget as a, copyAgentToolSourceExecutionGuard as i, captureAgentToolExecutionBudget as n, runAgentToolSourceExecutionGuard as o, captureAgentToolSourceExecutionGuard as r, bindAgentToolSourceExecutionGuard as t };
