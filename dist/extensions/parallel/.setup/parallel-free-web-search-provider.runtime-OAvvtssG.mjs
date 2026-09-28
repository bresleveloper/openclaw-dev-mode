import { t as executeParallelSearchRequest } from "./parallel-search-normalize-Jruxwvw_.mjs";
import { createRequire } from "node:module";
import { mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig, withTrustedWebSearchEndpoint } from "openclaw/plugin-sdk/provider-web-search";
import { randomUUID } from "node:crypto";
import { readPluginPackageVersion } from "openclaw/plugin-sdk/extension-shared";
import { ProviderHttpError, readProviderTextResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/parallel/src/parallel-mcp-search.runtime.ts
const PARALLEL_MCP_SEARCH_URL = "https://search.parallel.ai/mcp";
const MCP_PROTOCOL_VERSION = "2025-06-18";
const MCP_TIMEOUT_SECONDS = 30;
const PARALLEL_MCP_ERROR_BODY_LIMIT_BYTES = 8192;
const require = createRequire(import.meta.url);
const PLUGIN_VERSION = readPluginPackageVersion({ require });
const USER_AGENT = `openclaw-parallel/${PLUGIN_VERSION} (${process.platform})`;
function mcpHeaders(params) {
	const headers = {
		"Content-Type": "application/json",
		"User-Agent": USER_AGENT,
		Accept: "application/json, text/event-stream"
	};
	if (params.sessionId) headers["Mcp-Session-Id"] = params.sessionId;
	if (params.protocolVersion) headers["MCP-Protocol-Version"] = params.protocolVersion;
	return headers;
}
/**
* Select the first result/error matching requestId from a fully read JSON or SSE body,
* falling back to the last result/error when no id matches. JSON batches are flattened
* one level; multiline SSE data fields are joined and malformed events are skipped.
*/
function selectMcpEnvelope(text, requestId) {
	let envelope = {};
	const selectMessage = (message) => {
		if (!isRecord(message) || !("result" in message || "error" in message)) return false;
		envelope = message;
		return message.id === requestId;
	};
	const selectPayload = (json) => {
		try {
			const payload = JSON.parse(json);
			return Array.isArray(payload) ? payload.some(selectMessage) : selectMessage(payload);
		} catch {
			return false;
		}
	};
	const body = (text ?? "").trim();
	if (!body) return envelope;
	if (body.startsWith("{") || body.startsWith("[")) {
		selectPayload(body);
		return envelope;
	}
	let dataLines = [];
	const flush = () => {
		if (dataLines.length === 0) return false;
		const matched = selectPayload(dataLines.join("\n"));
		dataLines = [];
		return matched;
	};
	for (const raw of body.split("\n")) {
		const line = raw.replace(/\r$/, "");
		if (line.startsWith("data:")) dataLines.push(line.slice(5).replace(/^ /, ""));
		else if (line.trim() === "" && flush()) return envelope;
	}
	flush();
	return envelope;
}
/**
* Extract the tool result payload from a `tools/call` envelope.
*
* Prefers `structuredContent` (authoritative machine-readable form); otherwise
* scans text blocks for the first JSON-parseable one. Throws on a JSON-RPC
* error or a tool-level `isError`.
*/
function extractMcpToolPayload(envelope) {
	if ("error" in envelope) throw new Error(`Parallel MCP error: ${truncateUtf16Safe(JSON.stringify(envelope.error), 500)}`);
	const result = isRecord(envelope.result) ? envelope.result : {};
	if (result.isError) throw new Error(`Parallel MCP tool error: ${truncateUtf16Safe(JSON.stringify(result), 500)}`);
	if (isRecord(result.structuredContent)) return result.structuredContent;
	const content = Array.isArray(result.content) ? result.content : [];
	for (const block of content) if (isRecord(block) && block.type === "text" && typeof block.text === "string" && block.text) try {
		const parsed = JSON.parse(block.text);
		if (isRecord(parsed)) return parsed;
	} catch {}
	throw new Error(`Parallel MCP returned no parseable content: ${truncateUtf16Safe(JSON.stringify(result), 500)}`);
}
async function postMcp(params) {
	return withTrustedWebSearchEndpoint({
		url: PARALLEL_MCP_SEARCH_URL,
		timeoutSeconds: params.timeoutSeconds,
		signal: params.signal,
		init: {
			method: "POST",
			headers: mcpHeaders({
				sessionId: params.sessionId,
				protocolVersion: params.protocolVersion
			}),
			body: JSON.stringify(params.body)
		}
	}, async (response) => ({
		ok: response.ok,
		status: response.status,
		statusText: response.statusText,
		text: response.ok ? await readProviderTextResponse(response, "Parallel MCP") : await readResponseTextLimited(response, PARALLEL_MCP_ERROR_BODY_LIMIT_BYTES),
		sessionIdHeader: response.headers.get("mcp-session-id")
	}));
}
/**
* Run the MCP handshake then a single `tools/call`, returning the tool payload.
*
* initialize -> (capture `Mcp-Session-Id` header + negotiated protocolVersion)
* -> notifications/initialized -> tools/call. Anonymous (no bearer token).
*/
async function mcpCall(toolName, args, timeoutSeconds, signal) {
	const initId = randomUUID();
	const init = await postMcp({
		timeoutSeconds,
		signal,
		body: {
			jsonrpc: "2.0",
			id: initId,
			method: "initialize",
			params: {
				protocolVersion: MCP_PROTOCOL_VERSION,
				capabilities: {},
				clientInfo: {
					name: "openclaw-parallel",
					version: PLUGIN_VERSION
				}
			}
		}
	});
	if (!init.ok) throw new ProviderHttpError(`Parallel MCP initialize failed (${init.status}): ${init.text || init.statusText}`, { status: init.status });
	const sessionId = init.sessionIdHeader ?? void 0;
	const initEnvelope = selectMcpEnvelope(init.text, initId);
	const negotiatedVersion = (isRecord(initEnvelope.result) && typeof initEnvelope.result.protocolVersion === "string" ? initEnvelope.result.protocolVersion : void 0) ?? MCP_PROTOCOL_VERSION;
	const initialized = await postMcp({
		body: {
			jsonrpc: "2.0",
			method: "notifications/initialized"
		},
		sessionId,
		protocolVersion: negotiatedVersion,
		timeoutSeconds,
		signal
	});
	if (!initialized.ok) throw new ProviderHttpError(`Parallel MCP notifications/initialized failed (${initialized.status}): ${initialized.text || initialized.statusText}`, { status: initialized.status });
	const callId = randomUUID();
	const call = await postMcp({
		body: {
			jsonrpc: "2.0",
			id: callId,
			method: "tools/call",
			params: {
				name: toolName,
				arguments: args
			}
		},
		sessionId,
		protocolVersion: negotiatedVersion,
		timeoutSeconds,
		signal
	});
	if (!call.ok) throw new ProviderHttpError(`Parallel MCP tools/call failed (${call.status}): ${call.text || call.statusText}`, { status: call.status });
	return extractMcpToolPayload(selectMcpEnvelope(call.text, callId));
}
function normalizeMcpSessionId(value) {
	return value?.trim() || randomUUID();
}
/**
* Run a `web_search` tool call against the free hosted Search MCP and return a
* `ParallelSearchResponse`-compatible object so the runtime's existing result
* normalization (`normalizeParallelResults`) is reused verbatim.
*/
async function runParallelMcpSearch(params) {
	const sessionId = normalizeMcpSessionId(params.sessionId);
	const args = {
		objective: params.objective ?? params.searchQueries.join(" "),
		search_queries: [...params.searchQueries],
		session_id: sessionId
	};
	if (params.modelName) args.model_name = params.modelName;
	const payload = await mcpCall("web_search", args, params.timeoutSeconds ?? MCP_TIMEOUT_SECONDS, params.signal);
	const results = (Array.isArray(payload.results) ? payload.results : []).slice(0, Math.max(params.maxResults, 1));
	return {
		search_id: typeof payload.search_id === "string" ? payload.search_id : void 0,
		session_id: sessionId,
		results,
		warnings: payload.warnings,
		usage: payload.usage
	};
}
//#endregion
//#region extensions/parallel/src/parallel-free-web-search-provider.runtime.ts
async function executeParallelFreeWebSearchProviderTool(ctx, args, signal) {
	signal?.throwIfAborted();
	const searchConfig = mergeScopedSearchConfig(ctx.searchConfig, "parallel-free", resolveProviderWebSearchPluginConfig(ctx.config, "parallel-free"));
	return executeParallelSearchRequest({
		provider: "parallel-free",
		endpoint: PARALLEL_MCP_SEARCH_URL,
		args,
		searchConfig,
		signal,
		search: ({ count, clientModel, ...request }, timeoutSeconds) => runParallelMcpSearch({
			...request,
			maxResults: count,
			modelName: clientModel,
			timeoutSeconds,
			signal
		})
	});
}
//#endregion
export { executeParallelFreeWebSearchProviderTool };
