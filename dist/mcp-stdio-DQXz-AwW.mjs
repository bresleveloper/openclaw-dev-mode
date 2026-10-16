import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-CECOqf64.mjs";
import { a as normalizeEnvVarKey, i as isDangerousHostInheritedEnvVarName, r as isDangerousHostEnvVarName } from "./host-env-security-BgpkByrc.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-BHSPUYQR.mjs";
//#region src/agents/mcp-config-shared.ts
/**
* Shared MCP config coercion helpers.
*
* MCP transport setup uses these functions to normalize loose JSON config into
* string records/arrays while dropping unsafe host environment variables.
*/
const MCP_EXPLICIT_CREDENTIAL_ENV_KEYS = /* @__PURE__ */ new Set([
	"AMQP_URL",
	"AWS_ACCESS_KEY_ID",
	"AWS_SECRET_ACCESS_KEY",
	"AWS_SECURITY_TOKEN",
	"AWS_SESSION_TOKEN",
	"AZURE_CLIENT_ID",
	"AZURE_CLIENT_SECRET",
	"DATABASE_URL",
	"GH_TOKEN",
	"GITHUB_TOKEN",
	"GITLAB_TOKEN",
	"MONGODB_URI",
	"NODE_AUTH_TOKEN",
	"NPM_TOKEN",
	"REDIS_URL"
]);
function isDangerousMcpStdioEnvVarName(rawKey) {
	if (isDangerousHostEnvVarName(rawKey)) return true;
	const key = normalizeEnvVarKey(rawKey);
	if (!key || MCP_EXPLICIT_CREDENTIAL_ENV_KEYS.has(key.toUpperCase())) return false;
	return isDangerousHostInheritedEnvVarName(key);
}
function toMcpFilteredStringRecord(value, onDroppedEntry, filterEnv = false) {
	if (!isRecord(value)) return;
	let droppedByKey = false;
	const entries = [];
	for (const [key, entry] of Object.entries(value)) {
		if (filterEnv && isDangerousMcpStdioEnvVarName(key)) droppedByKey = true;
		else if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
			entries.push([key, String(entry)]);
			continue;
		}
		onDroppedEntry?.(key, entry);
	}
	return entries.length > 0 || droppedByKey ? Object.fromEntries(entries) : void 0;
}
/** Coerces string/number/boolean entries from a config object into strings. */
function toMcpStringRecord(value, options) {
	return toMcpFilteredStringRecord(value, options?.onDroppedEntry);
}
/** Coerces MCP env config while dropping dangerous inherited host env names. */
function toMcpEnvRecord(value, options) {
	return toMcpFilteredStringRecord(value, options?.onDroppedEntry, true);
}
//#endregion
//#region src/agents/mcp-stdio.ts
/**
* Stdio MCP launch config normalization.
* Accepts OpenClaw and upstream MCP config field names, keeping only
* command/args/env/cwd needed to spawn a stdio server.
*/
/** Resolve raw MCP server config into a stdio launch config. */
function resolveStdioMcpServerLaunchConfig(raw, options) {
	if (!isRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.command !== "string" || raw.command.trim().length === 0) {
		if (typeof raw.url === "string" && raw.url.trim().length > 0) return {
			ok: false,
			reason: "not a stdio server (has url)"
		};
		return {
			ok: false,
			reason: "its command is missing"
		};
	}
	const cwd = typeof raw.cwd === "string" && raw.cwd.trim().length > 0 ? raw.cwd : typeof raw.workingDirectory === "string" && raw.workingDirectory.trim().length > 0 ? raw.workingDirectory : void 0;
	return {
		ok: true,
		config: {
			command: raw.command,
			args: Array.isArray(raw.args) ? filterStringEntries(raw.args) : void 0,
			env: toMcpEnvRecord(raw.env, { onDroppedEntry: options?.onDroppedEnv }),
			cwd
		}
	};
}
/** Describe a stdio MCP launch config for diagnostics. */
function describeStdioMcpServerLaunchConfig(config) {
	const redactedArgs = Array.isArray(config.args) ? redactSensitiveArgv(config.args) : [];
	const args = redactedArgs.length > 0 ? ` ${redactedArgs.join(" ")}` : "";
	const cwd = config.cwd ? ` (cwd=${config.cwd})` : "";
	return `${config.command}${args}${cwd}`;
}
//#endregion
export { resolveStdioMcpServerLaunchConfig as n, toMcpStringRecord as r, describeStdioMcpServerLaunchConfig as t };
