//#region extensions/codex/src/app-server/protocol.ts
function flattenCodexDynamicToolFunctions(tools) {
	return (tools ?? []).flatMap((tool) => tool.type === "namespace" ? tool.tools : [tool]);
}
const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS = ["cli", "vscode"];
function isJsonObject(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function isRpcResponse(message) {
	return "id" in message && !("method" in message);
}
//#endregion
export { isRpcResponse as i, flattenCodexDynamicToolFunctions as n, isJsonObject as r, CODEX_INTERACTIVE_THREAD_SOURCE_KINDS as t };
