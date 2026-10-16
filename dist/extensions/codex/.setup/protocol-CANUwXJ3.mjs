import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/protocol.ts
/** Namespace Codex keeps directly model-visible without exposing it to Code Mode guests. */
const CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE = "openclaw_direct";
function flattenCodexDynamicToolFunctions(tools) {
	return (tools ?? []).flatMap((tool) => tool.type === "namespace" ? tool.tools : [tool]);
}
/** Asserts the experimental beforeTurnId request field before it crosses the app-server boundary. */
function assertCodexThreadForkParams(value) {
	if (!isRecord(value) || typeof value.threadId !== "string" || !value.threadId.trim() || value.beforeTurnId !== void 0 && value.beforeTurnId !== null && typeof value.beforeTurnId !== "string") throw new Error("Invalid Codex app-server thread/fork params");
	return value;
}
function isJsonObject(value) {
	return isRecord(value);
}
//#endregion
export { isJsonObject as i, assertCodexThreadForkParams as n, flattenCodexDynamicToolFunctions as r, CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE as t };
