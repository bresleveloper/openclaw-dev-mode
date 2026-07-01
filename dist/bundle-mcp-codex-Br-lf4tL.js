import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as isValidAgentId, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-CcYCBsqN.js";
import { r as normalizeCodexMcpServerConfig, t as buildCodexMcpServersConfig } from "./codex-mcp-config-BoXfq0NH.js";
//#region src/agents/cli-runner/toml-inline.ts
/**
* Minimal TOML inline serializer for CLI config overrides.
*/
function escapeTomlString(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
}
function formatTomlKey(key) {
	return /^[A-Za-z0-9_-]+$/.test(key) ? key : `"${escapeTomlString(key)}"`;
}
/** Serialize a supported value into TOML inline syntax. */
function serializeTomlInlineValue(value) {
	if (typeof value === "string") return `"${escapeTomlString(value)}"`;
	if (typeof value === "number" || typeof value === "bigint") return String(value);
	if (typeof value === "boolean") return value ? "true" : "false";
	if (Array.isArray(value)) return `[${value.map((entry) => serializeTomlInlineValue(entry)).join(", ")}]`;
	if (isRecord(value)) return `{ ${Object.entries(value).map(([key, entry]) => `${formatTomlKey(key)} = ${serializeTomlInlineValue(entry)}`).join(", ")} }`;
	throw new Error(`Unsupported TOML inline value: ${String(value)}`);
}
/** Format one CLI config override as `key=value`. */
function formatTomlConfigOverride(key, value) {
	return `${key}=${serializeTomlInlineValue(value)}`;
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-codex.ts
/**
* Codex CLI and app-server bundle MCP projection helpers.
*/
function normalizeAgentIds(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => isValidAgentId(entry)).map((entry) => normalizeAgentId(entry));
}
function readCodexProjectionConfig(server) {
	return isRecord(server.codex) ? server.codex : {};
}
function isCodexMcpServerAllowedForAgent(server, options) {
	const codex = readCodexProjectionConfig(server);
	if (!Object.hasOwn(codex, "agents")) return true;
	const agentIds = normalizeAgentIds(codex.agents);
	if (agentIds.length === 0 || !options?.agentId) return false;
	return agentIds.includes(normalizeAgentId(options.agentId));
}
/** Returns Codex CLI args with TOML MCP server overrides injected. */
function injectCodexMcpConfigArgs(args, config) {
	const overrides = serializeTomlInlineValue(buildCodexMcpServersConfig(config));
	return [
		...args ?? [],
		"-c",
		`mcp_servers=${overrides}`
	];
}
/**
* Codex app-server runtime (extensions/codex) receives its thread config as a
* JSON object through JSON-RPC `thread/start`/`thread/resume`, not as `-c` CLI
* args. This returns a thread-config patch projecting user-configured
* `cfg.mcp.servers` entries into Codex's `mcp_servers` table using the same
* per-server normalization the CLI path uses, so app-server agents see the
* same user MCP servers the CLI runtime exposes via `injectCodexMcpConfigArgs`.
*
* Only user-configured servers (`cfg.mcp.servers`) are projected. Plugin-
* curated app-server apps are already attached separately through the codex
* plugin thread-config `apps` patch, so they must not be re-projected here.
*/
function buildCodexUserMcpServersThreadConfigPatch(cfg, options) {
	const userServers = normalizeConfiguredMcpServers(cfg?.mcp?.servers);
	const entries = Object.entries(userServers);
	if (entries.length === 0) return;
	const mcp_servers = {};
	for (const [name, server] of entries) {
		if (server.enabled === false) continue;
		if (!isCodexMcpServerAllowedForAgent(server, options)) continue;
		mcp_servers[name] = normalizeCodexMcpServerConfig(name, server);
	}
	if (Object.keys(mcp_servers).length === 0) return;
	return { mcp_servers };
}
//#endregion
export { injectCodexMcpConfigArgs as n, formatTomlConfigOverride as r, buildCodexUserMcpServersThreadConfigPatch as t };
