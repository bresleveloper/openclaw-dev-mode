import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
//#region src/config/mcp-config-normalize.ts
const CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT = {
	http: "streamable-http",
	"streamable-http": "streamable-http",
	sse: "sse",
	stdio: "stdio"
};
/** Maps CLI-native MCP type aliases to OpenClaw HTTP transport names. */
function resolveOpenClawMcpTransportAlias(value) {
	const mapped = CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT[normalizeLowercaseStringOrEmpty(value)];
	return mapped === "sse" || mapped === "streamable-http" ? mapped : void 0;
}
/** Checks whether a raw MCP `type` value is a legacy CLI alias OpenClaw can rewrite. */
function isKnownCliMcpTypeAlias(value) {
	return Object.hasOwn(CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT, normalizeLowercaseStringOrEmpty(value));
}
/**
* Converts operator-friendly MCP server aliases into canonical config keys.
*
* Existing canonical fields win over legacy snake_case or `type` aliases so
* repeated configure commands cannot overwrite already-normalized choices.
*/
function canonicalizeConfiguredMcpServer(server) {
	const next = { ...server };
	const transportAlias = resolveOpenClawMcpTransportAlias(next.type);
	if (typeof next.transport !== "string" && transportAlias) next.transport = transportAlias;
	if (isKnownCliMcpTypeAlias(next.type)) delete next.type;
	if (typeof next.cwd !== "string" && typeof next.workingDirectory === "string") next.cwd = next.workingDirectory;
	delete next.workingDirectory;
	if (typeof next.supports_parallel_tool_calls === "boolean" && typeof next.supportsParallelToolCalls !== "boolean") next.supportsParallelToolCalls = next.supports_parallel_tool_calls;
	delete next.supports_parallel_tool_calls;
	if (typeof next.ssl_verify === "boolean" && typeof next.sslVerify !== "boolean") next.sslVerify = next.ssl_verify;
	delete next.ssl_verify;
	if (typeof next.client_cert === "string" && typeof next.clientCert !== "string") next.clientCert = next.client_cert;
	delete next.client_cert;
	if (typeof next.client_key === "string" && typeof next.clientKey !== "string") next.clientKey = next.client_key;
	delete next.client_key;
	const codex = isRecord(next.codex) ? { ...next.codex } : void 0;
	if (codex) {
		if (typeof codex.defaultToolsApprovalMode !== "string" && typeof codex.default_tools_approval_mode === "string") codex.defaultToolsApprovalMode = codex.default_tools_approval_mode;
		delete codex.default_tools_approval_mode;
		next.codex = codex;
	}
	return next;
}
/** Returns a cloned map of object-shaped MCP server configs, dropping invalid entries. */
function normalizeConfiguredMcpServers(value) {
	if (!isRecord(value)) return {};
	return Object.fromEntries(Object.entries(value).filter(([, server]) => isRecord(server)).map(([name, server]) => [name, { ...server }]));
}
//#endregion
export { resolveOpenClawMcpTransportAlias as i, isKnownCliMcpTypeAlias as n, normalizeConfiguredMcpServers as r, canonicalizeConfiguredMcpServer as t };
