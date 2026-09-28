//#region src/gateway/mcp-http.protocol.ts
/** Server identity advertised by the local MCP loopback initialize response. */
const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** Protocol-facing loopback server version, independent from the OpenClaw app version. */
const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** MCP protocol versions accepted by the loopback HTTP bridge, newest first for negotiation. */
const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"];
/**
* Builds a JSON-RPC success response, using null for notifications or malformed missing ids.
*/
function jsonRpcResult(id, result) {
	return {
		jsonrpc: "2.0",
		id: id ?? null,
		result
	};
}
/**
* Builds a JSON-RPC error response with the same id normalization as success responses.
*/
function jsonRpcError(id, code, message) {
	return {
		jsonrpc: "2.0",
		id: id ?? null,
		error: {
			code,
			message
		}
	};
}
//#endregion
export { jsonRpcResult as a, jsonRpcError as i, MCP_LOOPBACK_SERVER_VERSION as n, MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS as r, MCP_LOOPBACK_SERVER_NAME as t };
