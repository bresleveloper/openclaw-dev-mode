//#region extensions/codex/src/app-server/protocol.ts
function flattenCodexDynamicToolFunctions(tools) {
	return (tools ?? []).flatMap((tool) => tool.type === "namespace" ? tool.tools : [tool]);
}
function isJsonObject(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function isRpcResponse(message) {
	return "id" in message && !("method" in message);
}
//#endregion
export { isJsonObject as n, isRpcResponse as r, flattenCodexDynamicToolFunctions as t };
