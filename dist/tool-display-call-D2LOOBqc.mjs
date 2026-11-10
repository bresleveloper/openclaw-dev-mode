import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/tool-display-call.ts
const TOOL_CALL_DISPLAY_NAMES = /* @__PURE__ */ new Set(["dispatch_action", "tool_call"]);
/** Project the called tool for presentation without changing invocation identity or results. */
function unwrapToolCallForDisplay(call) {
	const args = asOptionalRecord(call.args);
	const id = typeof args?.id === "string" ? args.id.trim() : "";
	if (!TOOL_CALL_DISPLAY_NAMES.has(call.name?.trim().toLowerCase() ?? "") || !id) return call;
	const innerArgs = args?.args;
	const prototype = isRecord(innerArgs) ? Object.getPrototypeOf(innerArgs) : void 0;
	return {
		name: id.match(/^(?:openclaw|mcp|client):[^:]+:(.+)$/u)?.[1] ?? id,
		args: prototype === Object.prototype || prototype === null ? innerArgs : {}
	};
}
//#endregion
export { unwrapToolCallForDisplay as t };
