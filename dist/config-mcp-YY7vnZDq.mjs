import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as parseBooleanValue, t as asBoolean } from "./boolean-C30ltbL7.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { s as createMigrationManualItem } from "./migration-DepQtnwV.mjs";
import { u as sanitizeName } from "./helpers-CRQ7DHOz.mjs";
import { i as resolveMcpEnvReferences, n as mcpValueHasEnvReferences } from "./config-env-BJqi2jyi.mjs";
import "./config-provider-contract-DWIljPf7.mjs";
//#region extensions/migrate-hermes/config-mcp.ts
const MCP_RESOURCE_UTILITY_TOOLS = ["resources_list", "resources_read"];
const MCP_PROMPT_UTILITY_TOOLS = ["prompts_list", "prompts_get"];
function readPositiveNumeric(value) {
	if (typeof value === "number") return asPositiveFiniteNumber(value);
	if (typeof value !== "string" || !value.trim()) return;
	return asPositiveFiniteNumber(Number(value));
}
function readToolFilterList(value) {
	if (typeof value === "string") return value.trim() ? [value.trim()] : [];
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) return;
	return [...new Set(value.map((entry) => entry.trim()).filter(Boolean))];
}
function hasUnsupportedToolPattern(pattern) {
	return pattern.includes("?") || pattern.includes("[");
}
function mapHermesToolFilter(value) {
	const direct = isRecord(value.toolFilter) ? value.toolFilter : isRecord(value.tool_filter) ? value.tool_filter : void 0;
	if (direct) {
		const include = readToolFilterList(direct.include);
		const exclude = readToolFilterList(direct.exclude);
		if (include && include.length > 0) return { include };
		return exclude !== void 0 && exclude.length > 0 ? { exclude } : void 0;
	}
	const tools = isRecord(value.tools) ? value.tools : void 0;
	if (!tools) return;
	const include = readToolFilterList(tools.include);
	const exclude = readToolFilterList(tools.exclude);
	const resourcesEnabled = parseBooleanValue(tools.resources) !== false;
	const promptsEnabled = parseBooleanValue(tools.prompts) !== false;
	if (include !== void 0) {
		const allowed = [
			...include.filter((pattern) => !hasUnsupportedToolPattern(pattern)),
			...resourcesEnabled ? MCP_RESOURCE_UTILITY_TOOLS : [],
			...promptsEnabled ? MCP_PROMPT_UTILITY_TOOLS : []
		];
		return allowed.length > 0 ? { include: allowed } : { exclude: ["*"] };
	}
	const translatedExclude = [
		...exclude ?? [],
		...!resourcesEnabled ? MCP_RESOURCE_UTILITY_TOOLS : [],
		...!promptsEnabled ? MCP_PROMPT_UTILITY_TOOLS : []
	];
	return translatedExclude.length > 0 ? { exclude: translatedExclude } : void 0;
}
function mapHermesClientCertificate(value) {
	const cert = value.clientCert ?? value.client_cert;
	const key = normalizeOptionalString(value.clientKey) ?? normalizeOptionalString(value.client_key);
	if (Array.isArray(cert) && cert.length === 2) {
		const certPath = normalizeOptionalString(cert[0]);
		const keyPath = normalizeOptionalString(cert[1]);
		return certPath && keyPath ? {
			clientCert: certPath,
			clientKey: keyPath
		} : {};
	}
	const certPath = normalizeOptionalString(cert);
	return certPath && key ? {
		clientCert: certPath,
		clientKey: key
	} : {};
}
const MCP_CONNECTION_FIELDS = [
	"enabled",
	"command",
	"args",
	"cwd",
	"workingDirectory",
	"url",
	"connectionTimeoutMs",
	"requestTimeoutMs"
];
function importsMcpSensitiveValues(value, includeSecrets) {
	return includeSecrets && (value.env !== void 0 || value.headers !== void 0 || MCP_CONNECTION_FIELDS.some((key) => mcpValueHasEnvReferences(value[key])));
}
function mapHermesMcpOauth(value) {
	const oauth = isRecord(value.oauth) ? value.oauth : void 0;
	if (!oauth) return;
	const mapped = {};
	for (const key of [
		"authProfileId",
		"scope",
		"redirectUrl",
		"clientMetadataUrl"
	]) {
		const fieldValue = normalizeOptionalString(oauth[key]);
		if (fieldValue) mapped[key] = fieldValue;
	}
	return Object.keys(mapped).length > 0 ? mapped : void 0;
}
function mapMcpServer(value, includeSecrets, env) {
	const next = {};
	for (const key of MCP_CONNECTION_FIELDS) {
		const sourceValue = value[key];
		if (sourceValue === void 0) continue;
		if (!mcpValueHasEnvReferences(sourceValue)) {
			next[key] = sourceValue;
			continue;
		}
		if (includeSecrets) {
			const resolved = resolveMcpEnvReferences(sourceValue, env);
			if (!resolved.unresolved) next[key] = resolved.value;
		}
	}
	const transport = normalizeOptionalString(value.transport) ?? normalizeOptionalString(value.type);
	if (transport === "http" || transport === "streamable-http") next.transport = "streamable-http";
	else if (transport === "sse" || transport === "stdio") next.transport = transport;
	else if (!transport && normalizeOptionalString(next.url)) next.transport = "streamable-http";
	const connectionTimeoutSeconds = value.connectTimeout ?? value.connect_timeout;
	if (next.connectionTimeoutMs === void 0 && typeof connectionTimeoutSeconds === "number" && connectionTimeoutSeconds > 0 && Number.isFinite(connectionTimeoutSeconds * 1e3)) next.connectionTimeoutMs = connectionTimeoutSeconds * 1e3;
	const requestTimeoutSeconds = value.timeout;
	if (next.requestTimeoutMs === void 0 && typeof requestTimeoutSeconds === "number" && requestTimeoutSeconds > 0 && Number.isFinite(requestTimeoutSeconds * 1e3)) next.requestTimeoutMs = requestTimeoutSeconds * 1e3;
	next.supportsParallelToolCalls = asBoolean(value.supportsParallelToolCalls ?? value.supports_parallel_tool_calls);
	next.sslVerify = asBoolean(value.sslVerify ?? value.ssl_verify);
	next.auth = normalizeOptionalString(value.auth) === "oauth" ? "oauth" : void 0;
	next.oauth = mapHermesMcpOauth(value);
	Object.assign(next, mapHermesClientCertificate(value));
	next.toolFilter = mapHermesToolFilter(value);
	const tools = isRecord(value.tools) ? value.tools : void 0;
	if (tools && readToolFilterList(tools.include) === void 0 && readToolFilterList(tools.exclude)?.some(hasUnsupportedToolPattern)) next.enabled = false;
	if (includeSecrets) {
		for (const key of ["env", "headers"]) if (value[key] !== void 0) {
			const resolved = resolveMcpEnvReferences(value[key], env);
			if (!resolved.unresolved) next[key] = resolved.value;
		}
	}
	const mapped = Object.fromEntries(Object.entries(next).filter(([, entry]) => entry !== void 0));
	return normalizeOptionalString(mapped.command) || normalizeOptionalString(mapped.url) ? mapped : {};
}
function mcpManualItems(params) {
	const { name, raw } = params;
	const safeName = sanitizeName(name);
	const items = [];
	const add = (suffix, message, recommendation) => {
		items.push(createMigrationManualItem({
			id: `manual:mcp-server-${suffix}:${safeName}`,
			source: params.source,
			message,
			recommendation
		}));
	};
	const interpolatedValues = [
		...MCP_CONNECTION_FIELDS.map((key) => raw[key]),
		raw.env,
		raw.headers
	];
	if (!params.includeSecrets && (raw.env !== void 0 || raw.headers !== void 0 || interpolatedValues.some(mcpValueHasEnvReferences))) add("secrets", `Hermes MCP server "${name}" has environment-backed values that were not imported without secret consent.`, "Re-run with --include-secrets or configure these values manually.");
	if (params.includeSecrets && interpolatedValues.some((value) => value !== void 0 && resolveMcpEnvReferences(value, params.env).unresolved)) add("unresolved-secrets", `Hermes MCP server "${name}" references environment values that were not found in its .env file.`, "Define the missing values in OpenClaw's MCP server environment or headers manually.");
	const cert = raw.clientCert ?? raw.client_cert;
	const key = normalizeOptionalString(raw.clientKey) ?? normalizeOptionalString(raw.client_key);
	if (Array.isArray(cert) && cert.length === 3) add("client-cert-password", `Hermes MCP server "${name}" uses a password-protected client key, which OpenClaw cannot represent in MCP config.`, "Configure an unencrypted protected key path or an equivalent TLS proxy manually.");
	else if ((cert !== void 0 || key !== void 0) && !(Array.isArray(cert) && cert.length === 2 && normalizeOptionalString(cert[0]) && normalizeOptionalString(cert[1]) || normalizeOptionalString(cert) && key)) add("client-cert", `Hermes MCP server "${name}" uses a combined or invalid client-certificate shape that was not imported.`, "Configure separate OpenClaw clientCert and clientKey file paths manually.");
	if (typeof (raw.sslVerify ?? raw.ssl_verify) === "string") add("tls-ca", `Hermes MCP server "${name}" uses a CA bundle path for TLS verification, which OpenClaw MCP config cannot represent.`, "Install the CA in the host trust store or configure an equivalent TLS proxy manually.");
	const transport = normalizeOptionalString(raw.transport) ?? normalizeOptionalString(raw.type);
	if (transport && ![
		"http",
		"streamable-http",
		"sse",
		"stdio"
	].includes(transport)) add("transport", `Hermes MCP server "${name}" uses unsupported transport "${transport}".`, "Configure an equivalent OpenClaw MCP transport manually.");
	const auth = normalizeOptionalString(raw.auth);
	if (auth && auth !== "oauth") add("auth", `Hermes MCP server "${name}" uses unsupported authentication mode "${auth}".`, "Configure an equivalent OpenClaw MCP authentication mode manually.");
	const oauth = isRecord(raw.oauth) ? raw.oauth : void 0;
	if (auth === "oauth" || oauth) add("oauth-login", `Hermes MCP server "${name}" requires OAuth login in OpenClaw.`, `Run "openclaw mcp login ${name}" after migration.`);
	if (oauth && Object.keys(oauth).some((keyName) => ![
		"authProfileId",
		"scope",
		"redirectUrl",
		"clientMetadataUrl"
	].includes(keyName))) add("oauth-client", `Hermes MCP server "${name}" uses pre-registered OAuth client settings that were not copied into OpenClaw config.`, `Run "openclaw mcp login ${name}" and configure supported OAuth metadata manually.`);
	const tools = isRecord(raw.tools) ? raw.tools : void 0;
	const include = tools ? readToolFilterList(tools.include) : void 0;
	if ((include ?? (tools ? readToolFilterList(tools.exclude) : void 0))?.some(hasUnsupportedToolPattern)) add("tool-patterns", include === void 0 ? `Hermes MCP server "${name}" was imported disabled because its tool exclusions use unsupported fnmatch patterns.` : `Hermes MCP server "${name}" has tool include patterns that were omitted because OpenClaw supports only exact names and "*".`, "Replace ? and bracket patterns with exact tool names or equivalent * patterns in mcp.servers toolFilter, then enable the server if disabled.");
	if (tools && (Object.keys(tools).some((keyName) => ![
		"include",
		"exclude",
		"resources",
		"prompts"
	].includes(keyName)) || tools.include !== void 0 && !readToolFilterList(tools.include) || tools.exclude !== void 0 && !readToolFilterList(tools.exclude) || tools.resources !== void 0 && parseBooleanValue(tools.resources) === void 0 || tools.prompts !== void 0 && parseBooleanValue(tools.prompts) === void 0)) add("tool-policy", `Hermes MCP server "${name}" has a tool policy that cannot be translated exactly.`, "Review and configure mcp.servers toolFilter manually.");
	const lifecycle = isRecord(raw.lifecycle) ? raw.lifecycle : {};
	const unsupported = [
		["preflight", raw.skip_preflight === true],
		["sampling", isRecord(raw.sampling) && raw.sampling.enabled !== false],
		["elicitation", isRecord(raw.elicitation) && raw.elicitation.enabled !== false],
		["lifecycle", readPositiveNumeric(raw.idle_timeout_seconds ?? lifecycle.idle_timeout_seconds) !== void 0 || readPositiveNumeric(raw.max_lifetime_seconds ?? lifecycle.max_lifetime_seconds) !== void 0],
		["keepalive", readPositiveNumeric(raw.keepalive_interval) !== void 0]
	];
	for (const [feature, configured] of unsupported) if (configured) add(feature, `Hermes MCP server "${name}" uses ${feature} behavior that OpenClaw MCP config does not expose.`, "Review the server requirement and configure an equivalent deployment or runtime policy manually.");
	return [...new Map(items.map((item) => [item.id, item])).values()];
}
//#endregion
export { mapMcpServer as n, mcpManualItems as r, importsMcpSensitiveValues as t };
