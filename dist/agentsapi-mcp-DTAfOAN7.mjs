import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { t as decodeHeaderEnvPlaceholder } from "./bundle-mcp-adapter-DfH5O5-o.mjs";
import { s as loadAgentHarnessMcpConfig } from "./agent-harness-runtime-BxShxpgh.mjs";
//#region extensions/agentsapi/agentsapi-mcp.ts
async function buildAgentsApiMcpTools(params) {
	const loaded = await loadAgentHarnessMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		toolOverrides: params.toolOverrides
	});
	for (const diagnostic of loaded.diagnostics) log.warn(`Agents API MCP: ${diagnostic.pluginId}: ${diagnostic.message}`);
	for (const name of loaded.requesterScopedServerNames) skipUnsupportedServer(name, "requester-scoped connections are not supported");
	return Object.entries(loaded.config.mcpServers).toSorted(([left], [right]) => left.localeCompare(right)).flatMap(([name, server]) => {
		const transport = normalizeLowercaseStringOrEmpty(server.transport) || "sse";
		if (server.command || transport === "stdio") return skipUnsupportedServer(name, "stdio forwarding is not supported");
		if (typeof server.url !== "string" || !server.url.trim()) return skipUnsupportedServer(name, "an HTTP URL is required");
		if (transport !== "streamable-http") return skipUnsupportedServer(name, "an explicit Streamable HTTP transport is required");
		if (server.auth === "oauth" || server.oauth) return skipUnsupportedServer(name, "Gateway OAuth is not supported; configure HTTP authentication headers");
		if (server.clientCert || server.clientKey || server.sslVerify === false) return skipUnsupportedServer(name, "custom TLS settings are not supported");
		const filter = isRecord(server.toolFilter) ? server.toolFilter : {};
		const include = normalizeTrimmedStringList(filter.include);
		const exclude = [...normalizeTrimmedStringList(filter.exclude), ...params.toolOverrides?.mcpToolsDeny?.[name] ?? []];
		if ([...include, ...exclude].some((tool) => tool.includes("*"))) return skipUnsupportedServer(name, "tool filters require exact tool names");
		if (exclude.length && !include.length) return skipUnsupportedServer(name, "toolFilter.include is required to enforce tool exclusions");
		const allowedTools = include.length ? include.filter((tool) => !exclude.includes(tool)).toSorted() : void 0;
		let headers;
		try {
			headers = resolveHeaders(name, server.headers);
		} catch (error) {
			return skipUnsupportedServer(name, formatErrorMessage(error));
		}
		return [{
			type: "mcp",
			server_label: name,
			transport: {
				type: "http",
				server_url: server.url,
				...headers && { headers }
			},
			connection_origin: "environment",
			...allowedTools && { allowed_tools: allowedTools }
		}];
	});
}
function skipUnsupportedServer(name, reason) {
	log.error(`Agents API MCP server ${name} skipped: ${reason}`);
	return [];
}
function resolveHeaders(serverName, raw) {
	if (raw === void 0) return;
	if (!isRecord(raw)) throw new Error(`Agents API MCP server ${serverName} requires an object of HTTP headers`);
	return Object.fromEntries(Object.entries(raw).map(([name, value]) => {
		if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") throw new Error(`Agents API MCP server ${serverName} has an invalid HTTP header ${name}`);
		const text = String(value);
		const placeholder = decodeHeaderEnvPlaceholder(text);
		if (!placeholder) return [name, text];
		const resolved = process.env[placeholder.envVar];
		if (!resolved) throw new Error(`Agents API MCP server ${serverName} requires environment variable ${placeholder.envVar}`);
		return [name, placeholder.bearer ? `Bearer ${resolved}` : resolved];
	}));
}
//#endregion
export { buildAgentsApiMcpTools as t };
