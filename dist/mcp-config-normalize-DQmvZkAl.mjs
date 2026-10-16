import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
//#region src/config/mcp-config-normalize.ts
const CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT = {
	http: "streamable-http",
	"streamable-http": "streamable-http",
	sse: "sse",
	stdio: "stdio"
};
/** Reads the canonical transport prepared by config migration or bundle ingestion. */
function resolveConfiguredMcpTransport(server) {
	if (!isRecord(server)) return;
	return normalizeLowercaseStringOrEmpty(server.transport) || void 0;
}
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
	for (const [legacy, canonical, type] of [
		[
			"workingDirectory",
			"cwd",
			"string"
		],
		[
			"supports_parallel_tool_calls",
			"supportsParallelToolCalls",
			"boolean"
		],
		[
			"ssl_verify",
			"sslVerify",
			"boolean"
		],
		[
			"client_cert",
			"clientCert",
			"string"
		],
		[
			"client_key",
			"clientKey",
			"string"
		]
	]) {
		if (typeof next[legacy] === type && typeof next[canonical] !== type) next[canonical] = next[legacy];
		delete next[legacy];
	}
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
	return Object.fromEntries(Object.entries(value).flatMap(([name, server]) => isRecord(server) ? [[name, { ...server }]] : []));
}
//#endregion
export { resolveOpenClawMcpTransportAlias as a, resolveConfiguredMcpTransport as i, isKnownCliMcpTypeAlias as n, normalizeConfiguredMcpServers as r, canonicalizeConfiguredMcpServer as t };
