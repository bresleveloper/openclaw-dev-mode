import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { n as parseBooleanValue, t as asBoolean } from "./boolean-CFfzB3ix.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { s as createMigrationManualItem } from "./migration-Cf1WpRKe.mjs";
import { l as sanitizeName } from "./helpers-DpSlwpMA.mjs";
import { i as resolveMcpEnvReferences, n as mcpValueHasEnvReferences } from "./config-env-zHFRJuH8.mjs";
//#region extensions/migrate-hermes/config-mcp.ts
const MCP_RESOURCE_UTILITY_TOOLS = ["resources_list", "resources_read"];
const MCP_PROMPT_UTILITY_TOOLS = ["prompts_list", "prompts_get"];
function readPositiveNumeric(value) {
	return asPositiveFiniteNumber(typeof value === "string" ? Number(value) : value);
}
function readToolFilterList(value) {
	if (typeof value === "string") return value.trim() ? [value.trim()] : [];
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) return;
	return [...new Set(value.map((entry) => entry.trim()).filter(Boolean))];
}
function hasUnsupportedToolPattern(pattern) {
	return pattern.includes("?") || pattern.includes("[");
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
function mapHermesMcpOauth(value) {
	const oauth = asOptionalRecord(value.oauth);
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
function planHermesMcpServer(params) {
	const { name, raw, includeSecrets, env } = params;
	let sensitive = raw.env !== void 0 || raw.headers !== void 0;
	let unresolved = false;
	const resolvedFields = {};
	for (const key of [
		...MCP_CONNECTION_FIELDS,
		"env",
		"headers"
	]) {
		const sourceValue = raw[key];
		if (sourceValue === void 0) continue;
		const requiresConsent = key === "env" || key === "headers" || mcpValueHasEnvReferences(sourceValue);
		sensitive ||= requiresConsent;
		if (requiresConsent && !includeSecrets) continue;
		const resolved = resolveMcpEnvReferences(sourceValue, env);
		unresolved ||= resolved.unresolved;
		if (!resolved.unresolved) resolvedFields[key] = resolved.value;
	}
	const { env: resolvedEnv, headers: resolvedHeaders, ...next } = resolvedFields;
	const transport = normalizeOptionalString(raw.transport) ?? normalizeOptionalString(raw.type);
	if (transport === "http" || transport === "streamable-http") next.transport = "streamable-http";
	else if (transport === "sse" || transport === "stdio") next.transport = transport;
	else if (!transport && normalizeOptionalString(next.url)) next.transport = "streamable-http";
	for (const [key, seconds] of [["connectionTimeoutMs", raw.connectTimeout ?? raw.connect_timeout], ["requestTimeoutMs", raw.timeout]]) if (next[key] === void 0 && typeof seconds === "number" && seconds > 0 && Number.isFinite(seconds * 1e3)) next[key] = seconds * 1e3;
	next.supportsParallelToolCalls = asBoolean(raw.supportsParallelToolCalls ?? raw.supports_parallel_tool_calls);
	next.sslVerify = asBoolean(raw.sslVerify ?? raw.ssl_verify);
	const auth = normalizeOptionalString(raw.auth);
	next.auth = auth === "oauth" ? "oauth" : void 0;
	next.oauth = mapHermesMcpOauth(raw);
	const certificate = mapHermesClientCertificate(raw);
	Object.assign(next, certificate);
	const tools = asOptionalRecord(raw.tools);
	const include = tools ? readToolFilterList(tools.include) : void 0;
	const exclude = tools ? readToolFilterList(tools.exclude) : void 0;
	const resources = parseBooleanValue(tools?.resources);
	const prompts = parseBooleanValue(tools?.prompts);
	const direct = asOptionalRecord(raw.toolFilter) ?? asOptionalRecord(raw.tool_filter);
	if (direct) {
		const directInclude = readToolFilterList(direct.include);
		const directExclude = readToolFilterList(direct.exclude);
		next.toolFilter = directInclude?.length ? { include: directInclude } : directExclude?.length ? { exclude: directExclude } : void 0;
	} else if (tools) {
		if (include !== void 0) {
			const allowed = [
				...include.filter((pattern) => !hasUnsupportedToolPattern(pattern)),
				...resources !== false ? MCP_RESOURCE_UTILITY_TOOLS : [],
				...prompts !== false ? MCP_PROMPT_UTILITY_TOOLS : []
			];
			next.toolFilter = allowed.length > 0 ? { include: allowed } : { exclude: ["*"] };
		} else {
			const denied = [
				...exclude ?? [],
				...resources === false ? MCP_RESOURCE_UTILITY_TOOLS : [],
				...prompts === false ? MCP_PROMPT_UTILITY_TOOLS : []
			];
			next.toolFilter = denied.length > 0 ? { exclude: denied } : void 0;
		}
	}
	if (include === void 0 && exclude?.some(hasUnsupportedToolPattern)) next.enabled = false;
	next.env = resolvedEnv;
	next.headers = resolvedHeaders;
	const mapped = Object.fromEntries(Object.entries(next).filter(([, entry]) => entry !== void 0));
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
	if (!includeSecrets && sensitive) add("secrets", `Hermes MCP server "${name}" has environment-backed values that were not imported without secret consent.`, "Re-run with --include-secrets or configure these values manually.");
	if (includeSecrets && unresolved) add("unresolved-secrets", `Hermes MCP server "${name}" references environment values that were not found in its .env file.`, "Define the missing values in OpenClaw's MCP server environment or headers manually.");
	const cert = raw.clientCert ?? raw.client_cert;
	const key = normalizeOptionalString(raw.clientKey) ?? normalizeOptionalString(raw.client_key);
	if (Array.isArray(cert) && cert.length === 3) add("client-cert-password", `Hermes MCP server "${name}" uses a password-protected client key, which OpenClaw cannot represent in MCP config.`, "Configure an unencrypted protected key path or an equivalent TLS proxy manually.");
	else if ((cert !== void 0 || key !== void 0) && !certificate.clientCert) add("client-cert", `Hermes MCP server "${name}" uses a combined or invalid client-certificate shape that was not imported.`, "Configure separate OpenClaw clientCert and clientKey file paths manually.");
	if (typeof (raw.sslVerify ?? raw.ssl_verify) === "string") add("tls-ca", `Hermes MCP server "${name}" uses a CA bundle path for TLS verification, which OpenClaw MCP config cannot represent.`, "Install the CA in the host trust store or configure an equivalent TLS proxy manually.");
	if (transport && ![
		"http",
		"streamable-http",
		"sse",
		"stdio"
	].includes(transport)) add("transport", `Hermes MCP server "${name}" uses unsupported transport "${transport}".`, "Configure an equivalent OpenClaw MCP transport manually.");
	if (auth && auth !== "oauth") add("auth", `Hermes MCP server "${name}" uses unsupported authentication mode "${auth}".`, "Configure an equivalent OpenClaw MCP authentication mode manually.");
	const oauth = asOptionalRecord(raw.oauth);
	if (auth === "oauth" || oauth) add("oauth-login", `Hermes MCP server "${name}" requires OAuth login in OpenClaw.`, `Run "openclaw mcp login ${name}" after migration.`);
	if (oauth && Object.keys(oauth).some((keyName) => ![
		"authProfileId",
		"scope",
		"redirectUrl",
		"clientMetadataUrl"
	].includes(keyName))) add("oauth-client", `Hermes MCP server "${name}" uses pre-registered OAuth client settings that were not copied into OpenClaw config.`, `Run "openclaw mcp login ${name}" and configure supported OAuth metadata manually.`);
	if ((include ?? exclude)?.some(hasUnsupportedToolPattern)) add("tool-patterns", include === void 0 ? `Hermes MCP server "${name}" was imported disabled because its tool exclusions use unsupported fnmatch patterns.` : `Hermes MCP server "${name}" has tool include patterns that were omitted because OpenClaw supports only exact names and "*".`, "Replace ? and bracket patterns with exact tool names or equivalent * patterns in mcp.servers toolFilter, then enable the server if disabled.");
	if (tools && (Object.keys(tools).some((keyName) => ![
		"include",
		"exclude",
		"resources",
		"prompts"
	].includes(keyName)) || tools.include !== void 0 && !include || tools.exclude !== void 0 && !exclude || tools.resources !== void 0 && resources === void 0 || tools.prompts !== void 0 && prompts === void 0)) add("tool-policy", `Hermes MCP server "${name}" has a tool policy that cannot be translated exactly.`, "Review and configure mcp.servers toolFilter manually.");
	const lifecycle = isRecord(raw.lifecycle) ? raw.lifecycle : {};
	const unsupported = [
		["preflight", raw.skip_preflight === true],
		["sampling", isRecord(raw.sampling) && raw.sampling.enabled !== false],
		["elicitation", isRecord(raw.elicitation) && raw.elicitation.enabled !== false],
		["lifecycle", readPositiveNumeric(raw.idle_timeout_seconds ?? lifecycle.idle_timeout_seconds) !== void 0 || readPositiveNumeric(raw.max_lifetime_seconds ?? lifecycle.max_lifetime_seconds) !== void 0],
		["keepalive", readPositiveNumeric(raw.keepalive_interval) !== void 0]
	];
	for (const [feature, configured] of unsupported) if (configured) add(feature, `Hermes MCP server "${name}" uses ${feature} behavior that OpenClaw MCP config does not expose.`, "Review the server requirement and configure an equivalent deployment or runtime policy manually.");
	return {
		server: normalizeOptionalString(mapped.command) || normalizeOptionalString(mapped.url) ? mapped : {},
		sensitive: includeSecrets && sensitive,
		items
	};
}
//#endregion
export { planHermesMcpServer as t };
