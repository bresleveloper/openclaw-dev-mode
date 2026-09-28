import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { a as escapeInternalRuntimeContextDelimiters } from "./internal-runtime-context-BH-o1oq1.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-bundle-mcp-request-context.ts
const requestSignals = resolveGlobalSingleton(Symbol.for("openclaw.sessionMcpRequestSignal"), () => new AsyncLocalStorage());
function getSessionMcpRequestSignal() {
	const caller = requestSignals.getStore();
	const owner = getAsyncWorkSignal();
	return caller && owner ? AbortSignal.any([caller, owner]) : caller ?? owner;
}
function runWithSessionMcpRequestSignal(signal, run) {
	return signal ? requestSignals.run(signal, run) : run();
}
//#endregion
//#region src/agents/mcp-app-model-context.ts
const MCP_APP_MODEL_CONTEXT_MAX_BYTES = 16384;
function revokeMcpAppModelContext(runtime) {
	runtime.pendingMcpAppModelContext = void 0;
	runtime.mcpAppModelContextRevoked = true;
}
function allowMcpAppModelContext(runtime) {
	runtime.mcpAppModelContextRevoked = void 0;
}
function clearMcpAppModelContextForView(runtime, view) {
	if (runtime.pendingMcpAppModelContext?.owner === view) runtime.pendingMcpAppModelContext = void 0;
}
function updateMcpAppModelContext(runtime, view, params) {
	if (runtime.mcpAppModelContextRevoked === true) throw new Error("MCP App model context is unavailable for this session");
	if (Object.hasOwn(params, "structuredContent")) throw new Error("MCP App structured model context is unsupported");
	if (params.content === void 0 || Array.isArray(params.content) && params.content.length === 0) {
		runtime.pendingMcpAppModelContext = void 0;
		return;
	}
	if (!Array.isArray(params.content) || params.content.length !== 1) throw new Error("MCP App model context must contain exactly one text block");
	const block = params.content[0];
	if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("MCP App model context must contain exactly one text block");
	const { type, text } = block;
	if (type !== "text" || typeof text !== "string") throw new Error("MCP App model context must contain exactly one text block");
	if (text.length === 0) {
		runtime.pendingMcpAppModelContext = void 0;
		return;
	}
	if (Buffer.byteLength(text, "utf8") > MCP_APP_MODEL_CONTEXT_MAX_BYTES) throw new Error(`MCP App model context exceeds ${MCP_APP_MODEL_CONTEXT_MAX_BYTES} bytes`);
	runtime.pendingMcpAppModelContext = {
		owner: view,
		text
	};
}
function leaseMcpAppModelContextForTurn(params) {
	const snapshot = params.runtime.pendingMcpAppModelContext;
	if (!snapshot || snapshot.leased === true || params.runtime.mcpAppModelContextRevoked === true) return;
	snapshot.leased = true;
	const text = `MCP App context snapshot:\n${JSON.stringify({ text: snapshot.text })}`;
	let committed = false;
	return {
		context: {
			kind: "conversation-data",
			text
		},
		legacyText: escapeInternalRuntimeContextDelimiters(text),
		commit: () => {
			committed = true;
			if (params.runtime.pendingMcpAppModelContext === snapshot) params.runtime.pendingMcpAppModelContext = void 0;
		},
		rollback: () => {
			if (!committed && params.runtime.pendingMcpAppModelContext === snapshot) snapshot.leased = void 0;
		}
	};
}
//#endregion
export { updateMcpAppModelContext as a, revokeMcpAppModelContext as i, clearMcpAppModelContextForView as n, getSessionMcpRequestSignal as o, leaseMcpAppModelContextForTurn as r, runWithSessionMcpRequestSignal as s, allowMcpAppModelContext as t };
