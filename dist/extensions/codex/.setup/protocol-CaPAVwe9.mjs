import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/protocol.ts
/** Namespace Codex keeps directly model-visible without exposing it to Code Mode guests. */
const CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE = "openclaw_direct";
function flattenCodexDynamicToolFunctions(tools) {
	return (tools ?? []).flatMap((tool) => tool.type === "namespace" ? tool.tools : [tool]);
}
function isJsonObject(value) {
	return isRecord(value);
}
//#endregion
export { flattenCodexDynamicToolFunctions as n, isJsonObject as r, CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE as t };
