import { x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-maXyqxro.mjs";
import { t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-BzvKk5cf.mjs";
import { u as readMcpOAuthStoreReadOnly } from "./mcp-oauth-store-BXszHQwn.mjs";
import { a as completeMcpOAuthAuthorization, c as readMcpOAuthCredentialsStatus, f as startMcpOAuthAuthorization, n as clearMcpOAuthCredentials, s as countMcpOAuthPrincipals } from "./mcp-oauth-BoX-GO68.mjs";
import { t as startOAuthLoopbackCallbackServer } from "./oauth-loopback-callback-BTvKedhW.mjs";
import { t as parseConfigValue } from "./config-value-D2VJu0bm.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DDcOp4Ta.mjs";
import { i as updateConfiguredMcpServerTools, n as unsetConfiguredMcpServer, r as updateConfiguredMcpServer, t as setConfiguredMcpServer } from "./mcp-config-mutation-prwzNOrh.mjs";
import { t as resolveGatewayAuthOptions } from "./gateway-secret-options-M1xQSlWM.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import "commander";
//#region src/cli/mcp-cli.ts
const createSessionMcpRuntime = createLazyRuntimeMethod(() => import("./agents/agent-bundle-mcp-runtime.js"), (runtime) => runtime.createSessionMcpRuntime);
const disposeAllSessionMcpRuntimes = createLazyRuntimeMethod(() => import("./agents/agent-bundle-mcp-manager-api.js"), (runtime) => runtime.disposeAllSessionMcpRuntimes);
function fail(message, json) {
	if (json) printJson(formatCliJsonFailure(message));
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
	throw new Error(message);
}
function printJson(value) {
	defaultRuntime.writeJson(value);
}
async function loadMcpConfig(opts) {
	const loaded = await listConfiguredMcpServers();
	if (!loaded.ok) fail(loaded.error, opts?.json);
	return loaded;
}
function failUnknownMcpServer(name, configPath, opts) {
	fail(`No MCP server named "${name}" in ${configPath}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`, opts?.json);
}
function requireMcpServer(loaded, name, opts) {
	const server = loaded.mcpServers[name];
	if (!server) failUnknownMcpServer(name, loaded.path, opts);
	return server;
}
function selectMcpServers(loaded, name, opts) {
	return name ? { [name]: requireMcpServer(loaded, name, opts) } : loaded.mcpServers;
}
const MCP_OAUTH_CALLBACK_TIMEOUT_MS = 3e5;
function parseCsvList(value) {
	if (!value) return;
	const entries = value.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
	return entries.length > 0 ? entries : void 0;
}
function collectOption(value, previous = []) {
	return [...previous, value];
}
function parseKeyValueEntries(values, label) {
	const entries = {};
	for (const raw of values ?? []) {
		const separatorIndex = raw.indexOf("=");
		if (separatorIndex <= 0) fail(`${label} entries must use KEY=VALUE.`);
		const key = raw.slice(0, separatorIndex).trim();
		const value = raw.slice(separatorIndex + 1);
		if (!key) fail(`${label} entries must use a non-empty key.`);
		entries[key] = value;
	}
	return Object.keys(entries).length > 0 ? entries : void 0;
}
function parsePositiveNumberOption(value, label) {
	if (value === void 0) return;
	const parsed = parseStrictFiniteNumber(value);
	if (parsed === void 0 || parsed <= 0) fail(`${label} must be a positive number.`);
	return parsed;
}
function parseMcpApprovalModeOption(value) {
	if (value === void 0) return;
	const mode = normalizeLowercaseStringOrEmpty(value);
	if (mode !== "auto" && mode !== "prompt" && mode !== "approve") fail("--approval must be \"auto\", \"prompt\", or \"approve\".");
	return mode;
}
function parseOAuthConfig(opts) {
	const oauth = {
		...normalizeStringifiedOptionalString(opts.scope) ? { scope: opts.scope.trim() } : {},
		...normalizeStringifiedOptionalString(opts.redirectUrl) ? { redirectUrl: opts.redirectUrl.trim() } : {},
		...normalizeStringifiedOptionalString(opts.clientMetadataUrl) ? { clientMetadataUrl: opts.clientMetadataUrl.trim() } : {}
	};
	return Object.keys(oauth).length > 0 ? oauth : void 0;
}
function setOptionalField(target, key, value) {
	if (value !== void 0) target[key] = value;
}
function applyMcpTimeoutOptions(server, opts) {
	const requestTimeoutSeconds = parsePositiveNumberOption(opts.timeout, "--timeout");
	setOptionalField(server, "requestTimeoutMs", requestTimeoutSeconds === void 0 ? void 0 : requestTimeoutSeconds * 1e3);
	const connectionTimeoutSeconds = parsePositiveNumberOption(opts.connectTimeout, "--connect-timeout");
	setOptionalField(server, "connectionTimeoutMs", connectionTimeoutSeconds === void 0 ? void 0 : connectionTimeoutSeconds * 1e3);
}
function applyMcpOAuthOptions(server, opts, merge) {
	const auth = normalizeLowercaseStringOrEmpty(normalizeStringifiedOptionalString(opts.auth) ?? "");
	if (auth && auth !== "oauth") fail("Invalid --auth value. Use \"oauth\".");
	if (auth) server.auth = auth;
	const oauth = parseOAuthConfig({
		scope: opts.oauthScope,
		redirectUrl: opts.oauthRedirectUrl,
		clientMetadataUrl: opts.oauthClientMetadataUrl
	});
	if (oauth) server.oauth = merge ? {
		...asNullableRecord(server.oauth),
		...oauth
	} : oauth;
}
function applyMcpTlsOptions(server, opts) {
	if (opts.sslVerify !== void 0) {
		const sslVerify = normalizeLowercaseStringOrEmpty(opts.sslVerify);
		if (sslVerify !== "true" && sslVerify !== "false") fail("--ssl-verify must be true or false.");
		server.sslVerify = sslVerify === "true";
	}
	setOptionalField(server, "clientCert", normalizeStringifiedOptionalString(opts.clientCert));
	setOptionalField(server, "clientKey", normalizeStringifiedOptionalString(opts.clientKey));
}
const MCP_DOCTOR_CONCURRENCY = 4;
const MCP_CODEX_APPROVAL_ANNOTATION_HINT = "tools have no safety annotations; calls require approval in prompting session postures";
const SENSITIVE_HEADER_NAMES = /* @__PURE__ */ new Set([
	"authorization",
	"proxy-authorization",
	"x-api-key",
	"api-key",
	"api_key"
]);
const SENSITIVE_KEY_PATTERN = /(?:^|[_-])(api[_-]?key|authorization|bearer|password|secret|token)$/i;
function issue(level, message) {
	return {
		level,
		message
	};
}
function hasSensitiveKey(name) {
	return SENSITIVE_HEADER_NAMES.has(name.trim().toLowerCase()) || SENSITIVE_KEY_PATTERN.test(name);
}
function hasLiteralSensitiveValue(value) {
	return typeof value === "string" && value.trim().length > 0 && !value.trim().startsWith("$");
}
function resolveConfiguredPath(filePath, cwd) {
	if (path.isAbsolute(filePath)) return filePath;
	const base = typeof cwd === "string" && cwd.trim() ? cwd.trim() : process.cwd();
	return path.resolve(base, filePath);
}
async function fileExists(filePath) {
	try {
		return (await fs$1.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function directoryExists(filePath) {
	try {
		return (await fs$1.stat(filePath)).isDirectory();
	} catch {
		return false;
	}
}
async function isExecutable(filePath) {
	try {
		await fs$1.access(filePath, process.platform === "win32" ? constants.F_OK : constants.X_OK);
		return (await fs$1.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
function executableCandidates(command) {
	if (process.platform !== "win32") return [command];
	const extensions = (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";").map((entry) => entry.trim()).filter(Boolean);
	if (path.extname(command)) return [command];
	return [command, ...extensions.map((extension) => `${command}${extension.toLowerCase()}`)];
}
async function commandExists(command, cwd, env) {
	if (path.isAbsolute(command) || command.includes("/") || command.includes("\\")) return isExecutable(resolveConfiguredPath(command, cwd));
	const pathEntries = ((process.platform === "win32" ? resolveEnvironmentValue(env, "PATH") : env?.PATH) ?? process.env.PATH ?? "").split(path.delimiter).map((entry) => entry.trim() || ".");
	for (const pathEntry of pathEntries) {
		const resolvedPathEntry = path.isAbsolute(pathEntry) ? pathEntry : resolveConfiguredPath(pathEntry, cwd);
		for (const candidate of executableCandidates(command)) if (await isExecutable(path.join(resolvedPathEntry, candidate))) return true;
	}
	return false;
}
async function collectMcpDoctorIssues(params) {
	const issues = [];
	const { name, server } = params;
	const resolved = resolveMcpTransportConfig(name, server);
	const disabled = server.enabled === false;
	if (server.enabled === false) issues.push(issue("warning", "server is disabled"));
	if (!disabled) {
		if (!resolved) issues.push(issue("error", "server transport is invalid"));
		if (resolved?.kind === "stdio") {
			if (!await commandExists(resolved.command, resolved.cwd, resolved.env)) issues.push(issue("error", `stdio command not found or not executable: ${resolved.command}`));
			if (resolved.cwd && !await directoryExists(resolved.cwd)) issues.push(issue("error", `stdio cwd does not exist: ${resolved.cwd}`));
		}
		if (resolved?.kind === "http") {
			if (server.auth === "oauth") {
				if (asNullableRecord(server.oauth)?.identity !== "per-requester") {
					const authStatus = await readMcpOAuthCredentialsStatus(operatorMcpOAuthIdentity(name, resolved.url));
					if (authStatus.state === "requires-authorization") issues.push(issue("warning", `OAuth credentials require additional authorization; run ${formatCliCommand(`openclaw mcp login ${name}`)}`));
					else if (authStatus.state !== "authorized") issues.push(issue("warning", `OAuth credentials are not authorized; run ${formatCliCommand(`openclaw mcp login ${name}`)}`));
				}
				const headers = asNullableRecord(server.headers);
				if (headers && Object.keys(headers).some((key) => key.toLowerCase() === "authorization")) issues.push(issue("warning", "OAuth is enabled and the static Authorization header is ignored"));
			}
			if (resolved.sslVerify === false) issues.push(issue("warning", "TLS certificate verification is disabled"));
			if (resolved.clientCert && !await fileExists(resolveConfiguredPath(resolved.clientCert, ""))) issues.push(issue("error", `client certificate file does not exist: ${resolved.clientCert}`));
			if (resolved.clientKey && !await fileExists(resolveConfiguredPath(resolved.clientKey, ""))) issues.push(issue("error", `client key file does not exist: ${resolved.clientKey}`));
		}
	}
	for (const [field, values] of [["headers", asNullableRecord(server.headers)], ["env", asNullableRecord(server.env)]]) for (const [key, value] of Object.entries(values ?? {})) if (hasSensitiveKey(key) && hasLiteralSensitiveValue(value)) issues.push(issue("warning", `${field}.${key} contains a literal sensitive value; prefer an environment-backed value outside committed config`));
	const toolFilter = asNullableRecord(server.toolFilter);
	if (toolFilter && !Array.isArray(toolFilter.include) && !Array.isArray(toolFilter.exclude)) issues.push(issue("warning", "toolFilter is present but has no include or exclude list"));
	if (params.probe && server.enabled !== false && !issues.some((entry) => entry.level === "error")) {
		const probeIssues = await probeMcpServerIssues({
			config: params.config,
			name,
			server
		});
		issues.push(...probeIssues);
	}
	return issues;
}
async function probeMcpServerIssues(params) {
	const runtime = await createSessionMcpRuntime({
		sessionId: "openclaw-cli-mcp-doctor",
		workspaceDir: process.cwd(),
		cfg: buildMcpProbeConfig({
			config: params.config,
			servers: { [params.name]: params.server }
		}),
		manifestRegistry: { plugins: [] }
	});
	try {
		const result = await readMcpProbeResult(runtime);
		const diagnostic = result.diagnostics[0];
		if (diagnostic) return [issue("error", `probe failed: ${diagnostic.message}`)];
		const server = result.servers[params.name];
		if (!server) return [issue("error", "probe did not connect to this server")];
		return server.approvalHint ? [issue("info", `Codex approval mode: ${server.codexApprovalMode}; ${server.approvalHint}`)] : [];
	} catch (err) {
		return [issue("error", `probe failed: ${formatErrorMessage(err)}`)];
	} finally {
		await runtime.dispose();
	}
}
async function countConnectedMcpPrincipals(name, server) {
	const resolved = resolveMcpTransportConfig(name, server);
	if (server.auth !== "oauth" || resolved?.kind !== "http" || asNullableRecord(server.oauth)?.identity !== "per-requester") return;
	return countMcpOAuthPrincipals(operatorMcpOAuthIdentity(name, resolved.url));
}
async function buildMcpStatusEntries(servers) {
	const entries = Object.entries(servers).toSorted(([a], [b]) => a.localeCompare(b));
	return Promise.all(entries.map(async ([name, server]) => {
		const resolved = resolveMcpTransportConfig(name, server);
		const enabled = server.enabled !== false;
		const entry = {
			name,
			configured: true,
			enabled,
			ok: enabled && Boolean(resolved),
			transport: resolved?.transportType,
			launch: resolved?.description,
			requestTimeoutMs: resolved?.requestTimeoutMs,
			connectionTimeoutMs: resolved?.connectionTimeoutMs,
			supportsParallelToolCalls: resolved?.supportsParallelToolCalls,
			toolFilter: server.toolFilter,
			codex: server.codex
		};
		if (server.auth) entry.auth = server.auth;
		if (server.auth === "oauth" && resolved?.kind === "http" && asNullableRecord(server.oauth)?.identity !== "per-requester") {
			const identity = operatorMcpOAuthIdentity(name, resolved.url);
			const store = await readMcpOAuthStoreReadOnly(identity.storeKey);
			entry.authStatus = {
				hasTokens: Boolean(store.tokens),
				requiresAuthorization: store.pendingAuthorizationChallenge?.requiresAuthorization === true,
				hasClientInformation: Boolean(store.clientInformation),
				hasCodeVerifier: Boolean(store.codeVerifier),
				hasDiscoveryState: Boolean(store.discoveryState),
				hasLastAuthorizationUrl: Boolean(store.lastAuthorizationUrl),
				...await readMcpOAuthCredentialsStatus(identity, store)
			};
		} else entry.connectedPrincipals = await countConnectedMcpPrincipals(name, server);
		return entry;
	}));
}
async function readMcpProbeResult(runtime) {
	const { buildBundleMcpToolsFromCatalog } = await import("./agents/agent-bundle-mcp-materialize.js");
	const catalog = await runtime.getCatalog();
	const projectedTools = buildBundleMcpToolsFromCatalog({ catalog });
	return {
		generatedAt: new Date(catalog.generatedAt).toISOString(),
		servers: Object.fromEntries(Object.entries(catalog.servers).toSorted(([a], [b]) => a.localeCompare(b)).map(([name, server]) => {
			const codexApprovalMode = server.codexApprovalMode ?? "auto";
			const serverTools = catalog.tools.filter((tool) => tool.serverName === name);
			const approvalHint = codexApprovalMode === "auto" && serverTools.length > 0 && serverTools.every((tool) => Object.keys(tool.codexAnnotations ?? {}).length === 0) ? MCP_CODEX_APPROVAL_ANNOTATION_HINT : void 0;
			return [name, {
				launch: server.launchSummary,
				tools: server.toolCount,
				codexApprovalMode,
				...approvalHint ? { approvalHint } : {},
				...server.requestTimeoutMs ? { requestTimeoutMs: server.requestTimeoutMs } : {},
				...server.supportsParallelToolCalls ? { supportsParallelToolCalls: server.supportsParallelToolCalls } : {},
				...server.tools?.filteredCount ? { filteredTools: server.tools.filteredCount } : {},
				...server.resources ? { resources: true } : {},
				...server.prompts ? { prompts: true } : {},
				...server.tools?.listChanged || server.resources?.listChanged || server.prompts?.listChanged ? { listChanged: {
					tools: server.tools?.listChanged === true,
					resources: server.resources?.listChanged === true,
					prompts: server.prompts?.listChanged === true
				} } : {}
			}];
		})),
		tools: projectedTools.map((tool) => tool.name).toSorted(),
		diagnostics: catalog.diagnostics ?? []
	};
}
function buildMcpProbeConfig(params) {
	return {
		...params.config,
		mcp: {
			...params.config.mcp,
			servers: params.servers
		}
	};
}
const DEFAULT_MCP_PROBE_INITIALIZE_TIMEOUT_MS = 5e3;
function applyMcpProbeInitializeTimeout(server) {
	if (typeof server.connectionTimeoutMs === "number" && Number.isFinite(server.connectionTimeoutMs) && server.connectionTimeoutMs > 0) return server;
	return {
		...server,
		connectionTimeoutMs: DEFAULT_MCP_PROBE_INITIALIZE_TIMEOUT_MS
	};
}
function resolveMcpProbeIssue(params) {
	if (params.result.diagnostics.length > 0) {
		const first = expectDefined(params.result.diagnostics[0], "diagnostics entry at 0");
		return `MCP probe failed for "${first.serverName}" in ${params.path}: ${first.message}`;
	}
	for (const [name, server] of Object.entries(params.servers)) if (server.enabled !== false && !params.result.servers[name]) return `MCP probe did not connect to "${name}" in ${params.path}.`;
}
function failOnMcpProbeIssues(params) {
	const probeIssue = resolveMcpProbeIssue(params);
	if (probeIssue) fail(probeIssue);
}
async function probeMcpServersOrFail(params) {
	const probeServers = Object.fromEntries(Object.entries(params.servers).map(([name, server]) => [name, applyMcpProbeInitializeTimeout(server)]));
	const runtime = await createSessionMcpRuntime({
		sessionId: "openclaw-cli-mcp-probe",
		workspaceDir: process.cwd(),
		cfg: buildMcpProbeConfig({
			config: params.config,
			servers: probeServers
		}),
		manifestRegistry: { plugins: [] }
	});
	try {
		const result = await readMcpProbeResult(runtime);
		failOnMcpProbeIssues({
			result,
			servers: params.servers,
			path: params.path
		});
		return result;
	} finally {
		await runtime.dispose();
	}
}
const OPENCLAW_MCP_REGISTRY_SCOPE_NOTE = "Note: this command only shows OpenClaw-managed mcp.servers entries and does not include mcporter servers from config/mcporter.json.";
function registerMcpCli(program) {
	const mcp = program.command("mcp").description("Manage OpenClaw mcp.servers config and channel bridge");
	mcp.command("serve").description("Expose OpenClaw channels over MCP stdio").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--token-file <path>", "Read gateway token from file").option("--password <password>", "Gateway password (if required)").option("--password-file <path>", "Read gateway password from file").option("--claude-channel-mode <mode>", "Claude channel notification mode: auto, on, or off", "auto").option("-v, --verbose", "Verbose logging to stderr", false).action(async (opts) => {
		try {
			const { gatewayToken, gatewayPassword } = resolveGatewayAuthOptions(opts);
			const claudeChannelMode = normalizeLowercaseStringOrEmpty(normalizeStringifiedOptionalString(opts.claudeChannelMode) ?? "auto");
			if (claudeChannelMode !== "auto" && claudeChannelMode !== "on" && claudeChannelMode !== "off") throw new Error("Invalid --claude-channel-mode value. Use \"auto\", \"on\", or \"off\".");
			const { serveOpenClawChannelMcp } = await import("./channel-server-tZDvplS5.mjs");
			await serveOpenClawChannelMcp({
				gatewayUrl: opts.url,
				gatewayToken,
				gatewayPassword,
				claudeChannelMode,
				verbose: Boolean(opts.verbose)
			});
		} catch (err) {
			defaultRuntime.error(`MCP server failed to start: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep --require-rpc")} to inspect Gateway health.`);
			defaultRuntime.exit(1);
		}
	});
	mcp.command("list").description("List OpenClaw-managed MCP servers from mcp.servers").option("--json", "Print JSON").action(async (opts) => {
		const loaded = await loadMcpConfig(opts);
		if (opts.json) {
			printJson(loaded.mcpServers);
			return;
		}
		const entries = Object.entries(loaded.mcpServers).toSorted(([a], [b]) => a.localeCompare(b));
		if (entries.map(([name]) => name).length === 0) {
			defaultRuntime.log(`No OpenClaw-managed MCP servers configured in ${loaded.path}. Add one with ${formatCliCommand("openclaw mcp set <name> '{\"command\":\"uvx\",\"args\":[\"context7-mcp\"]}'")}.`);
			defaultRuntime.log(OPENCLAW_MCP_REGISTRY_SCOPE_NOTE);
			return;
		}
		defaultRuntime.log(`OpenClaw-managed MCP servers (${loaded.path}):`);
		for (const [name, server] of entries) {
			const connectedPrincipals = await countConnectedMcpPrincipals(name, server);
			const connected = connectedPrincipals === void 0 ? "" : ` (${connectedPrincipals} connected principal${connectedPrincipals === 1 ? "" : "s"})`;
			defaultRuntime.log(`- ${name}${connected}`);
		}
		defaultRuntime.log("");
		defaultRuntime.log(OPENCLAW_MCP_REGISTRY_SCOPE_NOTE);
	});
	mcp.command("show").description("Show one OpenClaw-managed MCP server or the full mcp.servers config").argument("[name]", "MCP server name").option("--json", "Print JSON").action(async (name, opts) => {
		const loaded = await loadMcpConfig(opts);
		const value = name ? requireMcpServer(loaded, name, opts) : loaded.mcpServers;
		if (opts.json) {
			printJson(value ?? {});
			return;
		}
		if (name) defaultRuntime.log(`OpenClaw-managed MCP server "${name}" (${loaded.path}):`);
		else defaultRuntime.log(`OpenClaw-managed MCP servers (${loaded.path}):`);
		printJson(value ?? {});
	});
	mcp.command("status").description("Show configured MCP server transport status without connecting").option("-v, --verbose", "Show transport, auth, timeout, and filter details", false).option("--json", "Print JSON").action(async (opts) => {
		const loaded = await loadMcpConfig(opts);
		const status = await buildMcpStatusEntries(loaded.mcpServers);
		if (opts.json) {
			printJson({
				path: loaded.path,
				servers: status
			});
			return;
		}
		if (status.length === 0) {
			defaultRuntime.log(`No MCP servers configured in ${loaded.path}.`);
			return;
		}
		defaultRuntime.log(`MCP server status (${loaded.path}):`);
		for (const entry of status) {
			const transport = entry.enabled ? entry.transport ?? "invalid" : "disabled";
			const auth = entry.auth === "oauth" ? " oauth" : "";
			const oauth = entry.authStatus?.state === "requires-authorization" ? " authorization-required" : entry.authStatus?.state === "authorized" ? " authorized" : "";
			const filters = entry.toolFilter ? " tool-filtered" : "";
			const parallel = entry.supportsParallelToolCalls ? " parallel" : "";
			const connected = entry.connectedPrincipals === void 0 ? "" : ` ${entry.connectedPrincipals}-principal${entry.connectedPrincipals === 1 ? "" : "s"}-connected`;
			defaultRuntime.log(`- ${entry.name}: ${transport}${auth}${oauth}${connected}${filters}${parallel}`);
			if (opts.verbose) {
				defaultRuntime.log(`  launch: ${entry.launch ?? "n/a"}`);
				defaultRuntime.log(`  timeouts: connect=${entry.connectionTimeoutMs ?? "n/a"}ms request=${entry.requestTimeoutMs ?? "n/a"}ms`);
				if (entry.auth === "oauth") defaultRuntime.log(entry.connectedPrincipals === void 0 ? `  oauth: ${entry.authStatus?.state ?? "unauthenticated"}` : `  oauth: per-requester, connected principals: ${entry.connectedPrincipals}`);
				if (entry.toolFilter) defaultRuntime.log(`  tools: ${JSON.stringify(entry.toolFilter)}`);
			}
		}
	});
	mcp.command("probe").description("Connect to configured MCP servers and list available capabilities").argument("[name]", "MCP server name").option("--json", "Print JSON").action(async (name, opts) => {
		const loaded = await loadMcpConfig(opts);
		const servers = selectMcpServers(loaded, name, opts);
		if (name && loaded.mcpServers[name]?.enabled === false) fail(`MCP server "${name}" is disabled in ${loaded.path}. Run ${formatCliCommand(`openclaw mcp configure ${name} --enable`)} before probing it.`, opts.json);
		if (!opts.json && Object.values(servers).every((server) => server.enabled === false)) {
			defaultRuntime.log(`No enabled MCP servers in ${loaded.path}. Add one with ${formatCliCommand("openclaw mcp add <name> --command <command>")} or enable one with ${formatCliCommand("openclaw mcp configure <name> --enable")}.`);
			return;
		}
		const runtime = await createSessionMcpRuntime({
			sessionId: "openclaw-cli-mcp-probe",
			workspaceDir: process.cwd(),
			cfg: buildMcpProbeConfig({
				config: loaded.config,
				servers
			}),
			manifestRegistry: { plugins: [] }
		});
		try {
			const result = await readMcpProbeResult(runtime);
			if (opts.json) printJson(result);
			else {
				defaultRuntime.log(`MCP probe (${loaded.path}):`);
				for (const [serverName, server] of Object.entries(result.servers)) {
					defaultRuntime.log(`- ${serverName}: ${server.tools} tools${server.resources ? ", resources" : ""}${server.prompts ? ", prompts" : ""}, Codex approval ${server.codexApprovalMode}`);
					if (server.approvalHint) defaultRuntime.log(`  i ${server.approvalHint}`);
				}
				for (const diagnostic of result.diagnostics) defaultRuntime.log(`! ${diagnostic.serverName}: ${diagnostic.message}`);
			}
			const probeIssue = resolveMcpProbeIssue({
				result,
				servers,
				path: loaded.path
			});
			if (probeIssue) {
				defaultRuntime.error(probeIssue);
				if (!requestExitAfterOneShotOutput(defaultRuntime, 1)) defaultRuntime.exit(1);
			}
		} finally {
			await runtime.dispose();
		}
	});
	mcp.command("doctor").description("Check configured MCP servers for static setup problems").argument("[name]", "MCP server name").option("--probe", "Also connect to each checked server", false).option("--json", "Print JSON").action(async (name, opts) => {
		const loaded = await loadMcpConfig(opts);
		const selected = selectMcpServers(loaded, name, opts);
		const tasks = Object.entries(selected).toSorted(([a], [b]) => a.localeCompare(b)).map(([serverName, server]) => async () => {
			const issues = await collectMcpDoctorIssues({
				name: serverName,
				server,
				config: loaded.config,
				path: loaded.path,
				probe: Boolean(opts.probe)
			});
			return {
				name: serverName,
				ok: !issues.some((entry) => entry.level === "error"),
				issues
			};
		});
		const { results: servers, firstError, hasError } = await runTasksWithConcurrency({
			tasks,
			limit: MCP_DOCTOR_CONCURRENCY
		});
		if (hasError) throw firstError;
		const ok = servers.every((server) => server.ok);
		if (opts.json) {
			printJson({
				path: loaded.path,
				ok,
				servers
			});
			if (!ok) fail("MCP doctor found errors.");
			return;
		}
		if (servers.length === 0) {
			defaultRuntime.log(`No MCP servers configured in ${loaded.path}. Add one with ${formatCliCommand("openclaw mcp add <name> --command <command>")}.`);
			return;
		}
		defaultRuntime.log(`MCP doctor (${loaded.path}):`);
		for (const server of servers) {
			defaultRuntime.log(`- ${server.name}: ${server.ok ? "ok" : "issues"}`);
			for (const entry of server.issues) {
				const prefix = entry.level === "error" ? "!" : entry.level === "warning" ? "-" : "i";
				defaultRuntime.log(`  ${prefix} ${entry.level}: ${entry.message}`);
			}
		}
		if (!ok) fail("MCP doctor found errors.");
	});
	mcp.command("add").description("Add one MCP server from flags and probe it before saving").argument("<name>", "MCP server name").option("--command <command>", "Stdio command to spawn").option("--arg <value>", "Repeatable stdio argument", collectOption, []).option("--env <key=value>", "Repeatable stdio environment entry", collectOption, []).option("--cwd <path>", "Working directory for stdio server").option("--url <url>", "HTTP MCP server URL").option("--transport <type>", "HTTP transport: streamable-http or sse").option("--header <key=value>", "Repeatable HTTP header", collectOption, []).option("--auth <mode>", "HTTP auth mode: oauth").option("--oauth-scope <scope>", "OAuth scope").option("--oauth-redirect-url <url>", "OAuth redirect URL").option("--oauth-client-metadata-url <url>", "OAuth client metadata URL").option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose").option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide").option("--timeout <seconds>", "Per-request timeout in seconds").option("--connect-timeout <seconds>", "Connection timeout in seconds").option("--parallel", "Mark this server safe for concurrent tool calls").option("--approval <mode>", "Codex MCP tool approval mode: auto, prompt, or approve").option("--disabled", "Save the server disabled", false).option("--ssl-verify <boolean>", "Verify HTTPS certificates: true or false").option("--client-cert <path>", "HTTP mutual TLS client certificate path").option("--client-key <path>", "HTTP mutual TLS client key path").option("--no-probe", "Save without connecting first").action(async (name, opts) => {
		const server = {};
		const command = normalizeStringifiedOptionalString(opts.command);
		const url = normalizeStringifiedOptionalString(opts.url);
		if (command && url) fail("Specify either --command for stdio or --url for HTTP, not both.");
		if (!command && !url) fail("Specify --command for stdio or --url for HTTP.");
		if (command) {
			server.command = command;
			if (opts.arg && opts.arg.length > 0) server.args = opts.arg;
			setOptionalField(server, "env", parseKeyValueEntries(opts.env, "--env"));
			setOptionalField(server, "cwd", normalizeStringifiedOptionalString(opts.cwd));
		}
		if (url) {
			server.url = url;
			setOptionalField(server, "transport", normalizeStringifiedOptionalString(opts.transport));
			setOptionalField(server, "headers", parseKeyValueEntries(opts.header, "--header"));
			applyMcpOAuthOptions(server, opts, false);
			applyMcpTlsOptions(server, opts);
		}
		if (opts.disabled) server.enabled = false;
		if (opts.parallel) server.supportsParallelToolCalls = true;
		const approvalMode = parseMcpApprovalModeOption(opts.approval);
		if (approvalMode) server.codex = { defaultToolsApprovalMode: approvalMode };
		applyMcpTimeoutOptions(server, opts);
		const include = parseCsvList(opts.include);
		const exclude = parseCsvList(opts.exclude);
		if (include || exclude) server.toolFilter = {
			...include ? { include } : {},
			...exclude ? { exclude } : {}
		};
		const loaded = await loadMcpConfig();
		const targetName = name.trim();
		if (targetName && Object.hasOwn(loaded.mcpServers, targetName)) fail(`MCP server ${JSON.stringify(targetName)} already exists.`);
		if (opts.probe !== false && server.enabled !== false && server.auth !== "oauth") await probeMcpServersOrFail({
			config: loaded.config,
			path: loaded.path,
			servers: { [name]: server }
		});
		const result = await setConfiguredMcpServer({
			name,
			server,
			createOnly: true
		});
		if (!result.ok) fail(result.error);
		defaultRuntime.log(`Saved MCP server "${name}" to ${result.path}.`);
		if (server.auth === "oauth") defaultRuntime.log(`Run ${formatCliCommand(`openclaw mcp login ${name}`)} to authorize this MCP server.`);
	});
	mcp.command("set").description("Set one OpenClaw-managed MCP server from a JSON object").argument("<name>", "MCP server name").argument("<value>", "JSON object, for example {\"command\":\"uvx\",\"args\":[\"context7-mcp\"]}").action(async (name, rawValue) => {
		const parsed = parseConfigValue(rawValue);
		if (parsed.error) fail(parsed.error);
		const result = await setConfiguredMcpServer({
			name,
			server: parsed.value
		});
		if (!result.ok) fail(result.error);
		defaultRuntime.log(`Saved MCP server "${name}" to ${result.path}.`);
	});
	mcp.command("tools").description("Update per-server MCP tool include/exclude filters").argument("<name>", "MCP server name").option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose").option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide").option("--clear", "Clear this server's MCP tool filter", false).action(async (name, opts) => {
		if (!opts.clear && opts.include === void 0 && opts.exclude === void 0) fail("Specify --include, --exclude, or --clear.");
		const result = await updateConfiguredMcpServerTools({
			name,
			tools: opts.clear ? null : {
				include: parseCsvList(opts.include),
				exclude: parseCsvList(opts.exclude)
			}
		});
		if (!result.ok) fail(result.error);
		if (!result.updated) failUnknownMcpServer(name, result.path);
		defaultRuntime.log(`Updated MCP tool selection for "${name}" in ${result.path}.`);
	});
	mcp.command("configure").description("Update MCP server operator controls without replacing the server").argument("<name>", "MCP server name").option("--enable", "Enable this saved server", false).option("--disable", "Disable this saved server", false).option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose").option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide").option("--clear-tools", "Clear this server's MCP tool filter", false).option("--timeout <seconds>", "Per-request timeout in seconds").option("--connect-timeout <seconds>", "Connection timeout in seconds").option("--clear-timeouts", "Clear request and connection timeout overrides", false).option("--parallel", "Mark this server safe for concurrent tool calls").option("--no-parallel", "Clear the concurrent tool-call marker").option("--approval <mode>", "Codex MCP tool approval mode: auto, prompt, or approve").option("--auth <mode>", "HTTP auth mode: oauth").option("--clear-auth", "Clear auth and OAuth metadata", false).option("--oauth-scope <scope>", "OAuth scope").option("--oauth-redirect-url <url>", "OAuth redirect URL").option("--oauth-client-metadata-url <url>", "OAuth client metadata URL").option("--ssl-verify <boolean>", "Verify HTTPS certificates: true or false").option("--client-cert <path>", "HTTP mutual TLS client certificate path").option("--client-key <path>", "HTTP mutual TLS client key path").option("--clear-tls", "Clear TLS verification and mTLS overrides", false).option("--probe", "Probe the updated server before saving", false).action(async (name, opts) => {
		if (opts.enable && opts.disable) fail("Specify only one of --enable or --disable.");
		const loaded = await loadMcpConfig();
		const next = { ...requireMcpServer(loaded, name) };
		if (opts.enable) delete next.enabled;
		if (opts.disable) next.enabled = false;
		if (opts.clearTools) delete next.toolFilter;
		else {
			const include = parseCsvList(opts.include);
			const exclude = parseCsvList(opts.exclude);
			if (include || exclude) next.toolFilter = {
				...asNullableRecord(next.toolFilter),
				...include ? { include } : {},
				...exclude ? { exclude } : {}
			};
		}
		if (opts.clearTimeouts) {
			delete next.requestTimeoutMs;
			delete next.connectionTimeoutMs;
		}
		applyMcpTimeoutOptions(next, opts);
		if (opts.parallel === true) next.supportsParallelToolCalls = true;
		else if (opts.parallel === false) {
			delete next.supportsParallelToolCalls;
			delete next.supports_parallel_tool_calls;
		}
		const approvalMode = parseMcpApprovalModeOption(opts.approval);
		if (approvalMode) next.codex = {
			...asNullableRecord(next.codex),
			defaultToolsApprovalMode: approvalMode
		};
		if (opts.clearAuth) {
			delete next.auth;
			delete next.oauth;
		}
		applyMcpOAuthOptions(next, opts, true);
		if (opts.clearTls) {
			delete next.sslVerify;
			delete next.ssl_verify;
			delete next.clientCert;
			delete next.client_cert;
			delete next.clientKey;
			delete next.client_key;
		}
		applyMcpTlsOptions(next, opts);
		if (opts.probe && next.enabled !== false && next.auth !== "oauth") await probeMcpServersOrFail({
			config: loaded.config,
			path: loaded.path,
			servers: { [name]: next }
		});
		if (opts.enable && Object.keys(next).length === 0) {
			const result = await unsetConfiguredMcpServer({ name });
			if (!result.ok) fail(result.error);
			defaultRuntime.log(`Removed disabled MCP override for "${name}" in ${result.path}.`);
			return;
		}
		const result = await updateConfiguredMcpServer({
			name,
			update: () => next
		});
		if (!result.ok) fail(result.error);
		if (!result.updated) failUnknownMcpServer(name, result.path);
		defaultRuntime.log(`Updated MCP server "${name}" in ${result.path}.`);
	});
	mcp.command("login").description("Authorize an OAuth MCP server").argument("<name>", "MCP server name").option("--code <code>", "Authorization code from the OAuth redirect").action(async (name, opts) => {
		const server = requireMcpServer(await loadMcpConfig(), name);
		if (asNullableRecord(server.oauth)?.identity === "per-requester") fail(`MCP server "${name}" uses per-requester OAuth. Senders connect from the channel via the MCP connect flow.`);
		if (server.auth !== "oauth") fail(`MCP server "${name}" is not configured with auth: "oauth".`);
		if (typeof server.url !== "string" || server.url.trim().length === 0) fail(`MCP server "${name}" needs a URL for OAuth login.`);
		const resolved = resolveMcpTransportConfig(name, server);
		if (!resolved || resolved.kind !== "http") fail(`MCP server "${name}" needs a valid HTTP transport for OAuth login.`);
		const identity = operatorMcpOAuthIdentity(name, resolved.url);
		if (opts.code) {
			await completeMcpOAuthAuthorization(identity, resolved, { code: opts.code });
			defaultRuntime.log(`MCP OAuth credentials saved for "${name}".`);
			return;
		}
		let callbackServer;
		const manualCommand = formatCliCommand(`openclaw mcp login ${name} --code <code>`);
		try {
			const session = await startMcpOAuthAuthorization(identity, resolved, {});
			if (session.status === "authorized") {
				defaultRuntime.log(`MCP OAuth credentials saved for "${name}".`);
				return;
			}
			if (session.state.length >= 16) try {
				callbackServer = await startOAuthLoopbackCallbackServer({
					redirectUrl: session.redirectUrl,
					expectedState: session.state,
					timeoutMs: MCP_OAUTH_CALLBACK_TIMEOUT_MS
				});
			} catch (error) {
				defaultRuntime.log(`Could not start the local OAuth callback (${formatErrorMessage(error)}).`);
			}
			defaultRuntime.log(`Open this URL to authorize "${name}":`);
			defaultRuntime.log(session.authorizationUrl);
			if (callbackServer) {
				defaultRuntime.log("Waiting for the browser to return to OpenClaw...");
				defaultRuntime.log(`If the callback cannot reach this terminal, run ${manualCommand}.`);
			} else defaultRuntime.log(`After approval, run ${manualCommand}.`);
			if (!callbackServer) return;
			let callback;
			try {
				callback = await callbackServer.waitForCallback();
			} catch (error) {
				fail(`${formatErrorMessage(error)}. Complete login manually with ${manualCommand}.`);
			}
			if (callback.type === "oauth_error") fail(`OAuth authorization did not complete. Retry login or use ${manualCommand}.`);
			await completeMcpOAuthAuthorization(identity, resolved, { code: callback.code });
			defaultRuntime.log(`MCP OAuth credentials saved for "${name}".`);
		} finally {
			await callbackServer?.close();
		}
	});
	mcp.command("logout").description("Clear stored OAuth credentials for an MCP server").argument("<name>", "MCP server name").action(async (name) => {
		const server = requireMcpServer(await loadMcpConfig(), name);
		if (asNullableRecord(server.oauth)?.identity === "per-requester") fail(`MCP server "${name}" uses per-requester OAuth. Remove or replace the server to clear requester credentials.`);
		const resolved = resolveMcpTransportConfig(name, server);
		if (!resolved || resolved.kind !== "http") fail(`MCP server "${name}" needs a valid HTTP transport for OAuth logout.`);
		await clearMcpOAuthCredentials(operatorMcpOAuthIdentity(name, resolved.url));
		defaultRuntime.log(`MCP OAuth credentials cleared for "${name}".`);
	});
	mcp.command("reload").description("Dispose cached MCP runtimes so new config is used on the next turn").action(async () => {
		await disposeAllSessionMcpRuntimes();
		defaultRuntime.log("Disposed cached MCP runtimes. Active agents use new MCP config on their next runtime build.");
	});
	mcp.command("unset").description("Remove one OpenClaw-managed MCP server").argument("<name>", "MCP server name").action(async (name) => {
		const result = await unsetConfiguredMcpServer({ name });
		if (!result.ok) fail(result.error);
		if (!result.removed) failUnknownMcpServer(name, result.path);
		defaultRuntime.log(`Removed MCP server "${name}" from ${result.path}.`);
	});
	applyParentDefaultHelpAction(mcp);
}
//#endregion
export { registerMcpCli };
