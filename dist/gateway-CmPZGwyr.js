import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { d as resolveGatewayPort } from "./paths-BMBAvkNf.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { a as trimToUndefined } from "./credential-planner-DO_ztNwS.js";
import { r as resolveGatewayCredentialsFromConfig } from "./credentials-DesN22Ui.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-CcqJJIan.js";
import { c as callGateway } from "./call-5Sj7eTyY.js";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-UW4cZXf5.js";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-CwW_Szsp.js";
import { a as normalizeAnyChannelId } from "./registry-BUWrOy2m.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-CWdFCyWd.js";
import "./plugins-Cgf2sDSU.js";
import { h as readPositiveIntegerParam, y as readStringParam } from "./common-DWyiui3y.js";
import { n as copyPluginToolMeta } from "./tools-D0RJIgtl.js";
import { c as resolveMessageActionDiscoveryChannelId, l as resolveMessageActionDiscoveryForPlugin, r as createMessageActionDiscoveryContext, s as resolveCurrentChannelMessageToolDiscoveryAdapter } from "./message-action-discovery-BvfQ1me5.js";
import { n as channelPluginHasNativeApprovalPromptUi, t as NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY } from "./native-approval-prompt-ChZ3N9rZ.js";
import { t as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-DKW8iHbQ.js";
import { t as getOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-C4_aKCYZ.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-tools.params.ts
const RETRY_GUIDANCE_SUFFIX = " Supply correct parameters before retrying.";
const XML_ARG_VALUE_SUFFIX_RE = /<\/arg_value>>+$/;
const FILE_TOOL_PATH_PARAM_KEYS = /* @__PURE__ */ new Set(["path"]);
const HALLUCINATED_OFFICE_PATH_EXTENSION_RE = /\.(doc|ppt|xls)(?:odex|codex|xodex|xcodex)$/i;
const OFFICE_EXTENSION_BY_FAMILY = {
	doc: ".docx",
	ppt: ".pptx",
	xls: ".xlsx"
};
function parameterValidationError(message) {
	return /* @__PURE__ */ new Error(`${message}.${RETRY_GUIDANCE_SUFFIX}`);
}
function describeReceivedParamValue(value, allowEmpty = false) {
	if (value === void 0 || value === null) return;
	if (typeof value === "string") {
		if (allowEmpty || value.trim().length > 0) return;
		return "<empty-string>";
	}
	if (Array.isArray(value)) return "<array>";
	return `<${typeof value}>`;
}
function formatReceivedParamHint(record, groups) {
	const allowEmptyKeys = /* @__PURE__ */ new Set();
	for (const group of groups) if (group.allowEmpty) for (const key of group.keys) allowEmptyKeys.add(key);
	const received = [];
	for (const key of Object.keys(record)) {
		const detail = describeReceivedParamValue(record[key], allowEmptyKeys.has(key));
		if (record[key] === void 0 || record[key] === null) continue;
		received.push(detail ? `${key}=${detail}` : key);
	}
	return received.length > 0 ? ` (received: ${received.join(", ")})` : "";
}
function isValidEditReplacement(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.oldText === "string" && record.oldText.trim().length > 0 && typeof record.newText === "string";
}
function hasValidEditReplacements(record) {
	const edits = record.edits;
	return Array.isArray(edits) && edits.length > 0 && edits.every((entry) => isValidEditReplacement(entry));
}
/** Required parameter groups for file-style tools that need retry guidance. */
const REQUIRED_PARAM_GROUPS = {
	read: [{
		keys: ["path"],
		label: "path"
	}],
	write: [{
		keys: ["path"],
		label: "path"
	}, {
		keys: ["content"],
		label: "content"
	}],
	edit: [{
		keys: ["path"],
		label: "path"
	}, {
		keys: ["edits"],
		label: "edits",
		validator: hasValidEditReplacements
	}]
};
/** Return a record view of model-supplied tool params when possible. */
function getToolParamsRecord(params) {
	return params && typeof params === "object" ? params : void 0;
}
/** Strip extra closing markers sometimes produced in XML arg_value path params. */
function stripMalformedXmlArgValueSuffix(value) {
	return value.includes("</arg_value>") ? value.replace(XML_ARG_VALUE_SUFFIX_RE, "") : value;
}
/** Normalize known model-hallucinated Office/codex path extensions. */
function normalizeHallucinatedOfficePathExtension(value) {
	return value.replace(HALLUCINATED_OFFICE_PATH_EXTENSION_RE, (_match, family) => {
		return OFFICE_EXTENSION_BY_FAMILY[family.toLowerCase()] ?? _match;
	});
}
/** Normalize model-supplied file-tool path params without touching payload text. */
function normalizeFileToolPathParam(value) {
	return normalizeHallucinatedOfficePathExtension(stripMalformedXmlArgValueSuffix(value));
}
/** Strip malformed XML suffixes from selected string fields without mutating input. */
function stripMalformedXmlArgValueSuffixFromKeys(record, keys) {
	let normalized;
	for (const key of keys) {
		const value = record[key];
		if (typeof value !== "string") continue;
		const stripped = stripMalformedXmlArgValueSuffix(value);
		if (stripped !== value) {
			normalized ??= { ...record };
			normalized[key] = stripped;
		}
	}
	return normalized ?? record;
}
/** Normalize selected file-tool path fields without mutating input. */
function normalizeFileToolPathParamsFromKeys(record, keys) {
	let normalized;
	for (const key of keys) {
		const value = record[key];
		if (typeof value !== "string") continue;
		const normalizedValue = normalizeFileToolPathParam(value);
		if (normalizedValue !== value) {
			normalized ??= { ...record };
			normalized[key] = normalizedValue;
		}
	}
	return normalized ?? record;
}
function resolveFileToolPathParamKeys(groups) {
	const keys = /* @__PURE__ */ new Set();
	for (const group of groups ?? []) for (const key of group.keys) if (FILE_TOOL_PATH_PARAM_KEYS.has(key)) keys.add(key);
	return [...keys];
}
/** Throw actionable retry guidance when required tool params are missing. */
function assertRequiredParams(record, groups, toolName) {
	if (!record || typeof record !== "object") throw parameterValidationError(`Missing parameters for ${toolName}`);
	const missingLabels = [];
	for (const group of groups) if (!(group.validator?.(record) ?? group.keys.some((key) => {
		if (!(key in record)) return false;
		const value = record[key];
		if (typeof value !== "string") return false;
		if (group.allowEmpty) return true;
		return value.trim().length > 0;
	}))) {
		const label = group.label ?? group.keys.join(" or ");
		missingLabels.push(label);
	}
	if (missingLabels.length > 0) {
		const joined = missingLabels.join(", ");
		throw parameterValidationError(`Missing required ${missingLabels.length === 1 ? "parameter" : "parameters"}: ${joined}${formatReceivedParamHint(record, groups)}`);
	}
}
/** Wrap a tool execute function with required-parameter validation. */
function wrapToolParamValidation(tool, requiredParamGroups) {
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const record = getToolParamsRecord(params);
			const pathKeys = resolveFileToolPathParamKeys(requiredParamGroups);
			const normalizedParams = record && pathKeys.length > 0 ? normalizeFileToolPathParamsFromKeys(record, pathKeys) : params;
			if (requiredParamGroups?.length) assertRequiredParams(getToolParamsRecord(normalizedParams), requiredParamGroups, tool.name);
			return tool.execute(toolCallId, normalizedParams, signal, onUpdate);
		}
	};
}
//#endregion
//#region src/agents/before-tool-call-metadata.ts
const BEFORE_TOOL_CALL_WRAPPED = Symbol("beforeToolCallWrapped");
const BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS = Symbol("beforeToolCallDiagnosticOptions");
const BEFORE_TOOL_CALL_SOURCE_TOOL = Symbol("beforeToolCallSourceTool");
const BEFORE_TOOL_CALL_HOOK_CONTEXT = Symbol("beforeToolCallHookContext");
/** Return true when a tool already carries the before_tool_call wrapper marker. */
function isToolWrappedWithBeforeToolCallHook(tool) {
	return tool[BEFORE_TOOL_CALL_WRAPPED] === true;
}
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
function setBeforeToolCallDiagnosticsEnabled(tool, enabled) {
	const options = tool[BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS];
	if (options && typeof options === "object" && "emitDiagnostics" in options) options.emitDiagnostics = enabled;
}
/** Copy before_tool_call marker metadata when another wrapper replaces a tool. */
function copyBeforeToolCallHookMarker(source, target) {
	if (!isToolWrappedWithBeforeToolCallHook(source)) return;
	Object.defineProperty(target, BEFORE_TOOL_CALL_WRAPPED, {
		value: true,
		enumerable: true
	});
	const taggedSource = source;
	const sourceTool = taggedSource[BEFORE_TOOL_CALL_SOURCE_TOOL];
	if (sourceTool && typeof sourceTool === "object") Object.defineProperty(target, BEFORE_TOOL_CALL_SOURCE_TOOL, {
		value: sourceTool,
		enumerable: false
	});
	const hookContext = taggedSource[BEFORE_TOOL_CALL_HOOK_CONTEXT];
	Object.defineProperty(target, BEFORE_TOOL_CALL_HOOK_CONTEXT, {
		value: hookContext,
		enumerable: false
	});
}
//#endregion
//#region src/agents/channel-tool-metadata.ts
const channelAgentToolMeta = /* @__PURE__ */ new WeakMap();
/** Read channel metadata attached to a channel-owned agent tool. */
function getChannelAgentToolMeta(tool) {
	return channelAgentToolMeta.get(tool);
}
/** Attach channel ownership metadata to a concrete agent tool. */
function setChannelAgentToolMeta(tool, meta) {
	channelAgentToolMeta.set(tool, meta);
}
/** Copy channel metadata when wrapping or replacing a channel-owned tool. */
function copyChannelAgentToolMeta(source, target) {
	const meta = channelAgentToolMeta.get(source);
	if (meta) channelAgentToolMeta.set(target, meta);
}
//#endregion
//#region src/agents/channel-tools.ts
/**
* Channel-owned agent tool and prompt helpers.
* Discovers channel tools, message actions, prompt capabilities, reaction
* guidance, and weakly-attached channel metadata for wrapped tools.
*/
/**
* Get the list of supported message actions for a specific channel.
* Returns an empty array if channel is not found or has no actions configured.
*/
function listChannelSupportedActions(params) {
	const channelId = resolveMessageActionDiscoveryChannelId(params.channel);
	if (!channelId) return [];
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(channelId);
	if (!pluginActions?.actions) return [];
	return resolveMessageActionDiscoveryForPlugin({
		pluginId: pluginActions.pluginId,
		actions: pluginActions.actions,
		context: createMessageActionDiscoveryContext(params),
		includeActions: true
	}).actions;
}
/**
* Get the list of all supported message actions across all configured channels.
*/
function listAllChannelSupportedActions(params) {
	const actions = /* @__PURE__ */ new Set();
	for (const plugin of listChannelPlugins()) {
		const channelActions = resolveMessageActionDiscoveryForPlugin({
			pluginId: plugin.id,
			actions: plugin.actions,
			context: createMessageActionDiscoveryContext({
				...params,
				currentChannelProvider: plugin.id
			}),
			includeActions: true
		}).actions;
		for (const action of channelActions) actions.add(action);
	}
	return Array.from(actions);
}
/** List agent tools contributed by registered channel plugins. */
function listChannelAgentTools(params) {
	const tools = [];
	for (const plugin of listChannelPlugins()) {
		const entry = plugin.agentTools;
		if (!entry) continue;
		const resolved = typeof entry === "function" ? entry(params) : entry;
		if (Array.isArray(resolved)) {
			for (const tool of resolved) setChannelAgentToolMeta(tool, { channelId: plugin.id });
			tools.push(...resolved);
		}
	}
	return tools;
}
/** Resolve channel-specific message tool hints for system prompt assembly. */
function resolveChannelMessageToolHints(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return [];
	const resolve = getChannelPlugin(channelId)?.agentPrompt?.messageToolHints;
	if (!resolve) return [];
	return normalizeStringEntries(resolve({
		cfg: params.cfg ?? {},
		accountId: params.accountId
	}));
}
/** Resolve channel prompt capabilities, including native approval UI support. */
function resolveChannelPromptCapabilities(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return [];
	const plugin = getChannelPlugin(channelId);
	const cfg = params.cfg ?? {};
	const capabilities = normalizePromptCapabilities(plugin?.agentPrompt?.messageToolCapabilities?.({
		cfg,
		accountId: params.accountId
	}));
	if (channelPluginHasNativeApprovalPromptUi(plugin)) capabilities.push(NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY);
	return capabilities;
}
function normalizePromptCapabilities(capabilities) {
	return normalizeStringEntries(capabilities ?? []);
}
/** Resolve optional channel reaction guidance for assistant replies. */
function resolveChannelReactionGuidance(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return;
	const resolve = getChannelPlugin(channelId)?.agentPrompt?.reactionGuidance;
	if (!resolve) return;
	const resolved = resolve({
		cfg: params.cfg ?? {},
		accountId: params.accountId
	});
	if (!resolved?.level) return;
	return {
		level: resolved.level,
		channel: resolved.channelLabel?.trim() || channelId
	};
}
//#endregion
//#region src/agents/tool-terminal-presentation.ts
const terminalPresentationByTool = /* @__PURE__ */ new WeakMap();
function setToolTerminalPresentation(tool, formatter) {
	terminalPresentationByTool.set(tool, formatter);
	return tool;
}
function getToolTerminalPresentation(tool) {
	return terminalPresentationByTool.get(tool);
}
function copyToolTerminalPresentation(source, target) {
	const formatter = terminalPresentationByTool.get(source);
	if (formatter) terminalPresentationByTool.set(target, formatter);
}
//#endregion
//#region src/agents/tools/gateway-caller-context.ts
const gatewayToolCallerStorage = new AsyncLocalStorage();
function getGatewayToolCallerIdentity() {
	return gatewayToolCallerStorage.getStore();
}
async function withGatewayToolCallerIdentity(identity, run) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim()) return await run();
	return await gatewayToolCallerStorage.run({
		agentId: identity.agentId.trim(),
		sessionKey: identity.sessionKey.trim()
	}, run);
}
function wrapToolWithGatewayCallerIdentity(tool, identity) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim() || !tool.execute) return tool;
	const wrapped = {
		...tool,
		execute: async (...args) => await withGatewayToolCallerIdentity(identity, async () => await tool.execute?.(...args))
	};
	copyPluginToolMeta(tool, wrapped);
	copyChannelAgentToolMeta(tool, wrapped);
	copyBeforeToolCallHookMarker(tool, wrapped);
	copyToolTerminalPresentation(tool, wrapped);
	return wrapped;
}
//#endregion
//#region src/agents/tools/gateway.ts
/**
* Gateway call helpers for built-in tools.
*
* Resolves gateway URL/token overrides, local credentials, and least-privilege operator scopes.
*/
/** Reads common gateway options from tool parameters while preserving explicit token whitespace. */
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
/**
* Canonicalizes websocket URLs for allowlist comparisons without retaining paths or credentials.
*/
function canonicalizeToolGatewayWsUrl(raw) {
	const input = raw.trim();
	let url;
	try {
		url = new URL(input);
	} catch (error) {
		const message = formatErrorMessage(error);
		throw new Error(`invalid gatewayUrl: ${input} (${message})`, { cause: error });
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`invalid gatewayUrl protocol: ${url.protocol} (expected ws:// or wss://)`);
	if (url.username || url.password) throw new Error("invalid gatewayUrl: credentials are not allowed");
	if (url.search || url.hash) throw new Error("invalid gatewayUrl: query/hash not allowed");
	if (url.pathname && url.pathname !== "/") throw new Error("invalid gatewayUrl: path not allowed");
	return {
		origin: url.origin,
		key: `${url.protocol}//${normalizeLowercaseStringOrEmpty(url.host)}`
	};
}
function resolveLocalGatewayUrlKeys(cfg) {
	const port = resolveGatewayPort(cfg);
	return /* @__PURE__ */ new Set([
		`ws://127.0.0.1:${port}`,
		`wss://127.0.0.1:${port}`,
		`ws://localhost:${port}`,
		`wss://localhost:${port}`,
		`ws://[::1]:${port}`,
		`wss://[::1]:${port}`
	]);
}
function resolveConfiguredRemoteGatewayKey(cfg) {
	let remoteKey;
	const remoteUrl = normalizeOptionalString(cfg.gateway?.remote?.url) ?? "";
	if (remoteUrl) try {
		remoteKey = canonicalizeToolGatewayWsUrl(remoteUrl).key;
	} catch {}
	return remoteKey;
}
function resolveDefaultGatewayTarget(params) {
	if (params.envGatewayUrl) return "remote";
	if (params.cfg.gateway?.mode === "remote" && normalizeOptionalString(params.cfg.gateway.remote?.url)) return "remote";
	return "local";
}
function validateGatewayUrlOverrideForAgentTools(params) {
	const { cfg } = params;
	const localAllowed = resolveLocalGatewayUrlKeys(cfg);
	const remoteKey = resolveConfiguredRemoteGatewayKey(cfg);
	const parsed = canonicalizeToolGatewayWsUrl(params.urlOverride);
	if (localAllowed.has(parsed.key)) return {
		url: parsed.origin,
		target: "local"
	};
	if (remoteKey && parsed.key === remoteKey) return {
		url: parsed.origin,
		target: "remote"
	};
	const port = resolveGatewayPort(cfg);
	throw new Error([
		"gatewayUrl override rejected.",
		`Allowed: ws(s) loopback on port ${port} (127.0.0.1/localhost/[::1])`,
		"Or: configure gateway.remote.url and omit gatewayUrl to use the configured remote gateway."
	].join(" "));
}
function resolveGatewayOverrideToken(params) {
	if (params.explicitToken) return params.explicitToken;
	return resolveGatewayCredentialsFromConfig({
		cfg: params.cfg,
		env: process.env,
		modeOverride: params.target,
		remoteTokenFallback: params.target === "remote" ? "remote-only" : "remote-env-local",
		remotePasswordFallback: params.target === "remote" ? "remote-only" : "remote-env-local"
	}).token;
}
/**
* Resolves the gateway URL, token, and timeout for agent tool calls.
*/
function resolveGatewayOptions(opts) {
	const cfg = getRuntimeConfig();
	const validatedOverride = trimToUndefined(opts?.gatewayUrl) !== void 0 ? validateGatewayUrlOverrideForAgentTools({
		cfg,
		urlOverride: String(opts?.gatewayUrl)
	}) : void 0;
	const explicitToken = trimToUndefined(opts?.gatewayToken);
	const token = validatedOverride ? resolveGatewayOverrideToken({
		cfg,
		target: validatedOverride.target,
		explicitToken
	}) : explicitToken;
	const timeoutMs = typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.floor(opts.timeoutMs)) : 3e4;
	const envGatewayUrl = trimToUndefined(process.env.OPENCLAW_GATEWAY_URL);
	const target = validatedOverride?.target ?? resolveDefaultGatewayTarget({
		cfg,
		envGatewayUrl
	});
	return {
		url: validatedOverride?.url,
		token,
		timeoutMs,
		target
	};
}
const APPROVAL_RUNTIME_METHODS = /* @__PURE__ */ new Set([
	"exec.approval.request",
	"exec.approval.resolve",
	"exec.approval.waitDecision",
	"plugin.approval.request",
	"plugin.approval.waitDecision"
]);
const AGENT_RUNTIME_IDENTITY_METHODS = /* @__PURE__ */ new Set([
	"wake",
	"cron.list",
	"cron.get",
	"cron.add",
	"cron.update",
	"cron.remove",
	"cron.run",
	"cron.runs"
]);
function resolveApprovalRuntimeTokenForGatewayTool(params) {
	if (!APPROVAL_RUNTIME_METHODS.has(params.method)) return;
	if (trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
	if (params.target !== "local") return;
	return getOperatorApprovalRuntimeToken();
}
function resolveApprovalRequesterDeviceIdentityForGatewayTool(params) {
	if (!APPROVAL_RUNTIME_METHODS.has(params.method)) return;
	if (trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
	try {
		const identity = loadOrCreateDeviceIdentity();
		if (loadDeviceIdentityIfPresent()?.deviceId !== identity.deviceId) throw new Error("device identity is not persisted");
		return identity;
	} catch (error) {
		if (params.target === "local") return;
		throw new Error(["remote approval gateway calls require a stable device identity.", "Fix the OpenClaw state directory permissions or use the local approval-runtime gateway."].join(" "), { cause: error });
	}
}
function resolveAgentRuntimeIdentityTokenForGatewayTool(params) {
	if (!AGENT_RUNTIME_IDENTITY_METHODS.has(params.method)) return;
	const identity = getGatewayToolCallerIdentity();
	if (!identity) return;
	const hasGatewayUrlOverride = trimToUndefined(params.opts.gatewayUrl) !== void 0;
	const hasGatewayTokenOverride = trimToUndefined(params.opts.gatewayToken) !== void 0;
	if (hasGatewayUrlOverride || hasGatewayTokenOverride || params.target !== "local") throw new Error("agent cron gateway calls require the trusted local gateway context");
	return mintAgentRuntimeIdentityToken(identity);
}
function isStaleGatewayAgentRuntimeIdentityRejection(error) {
	const message = formatErrorMessage(error);
	if (message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it")) return true;
	return message.includes("invalid connect params") && message.includes("/auth") && message.includes("unexpected property 'agentRuntimeIdentityToken'");
}
function staleGatewayAgentRuntimeIdentityError(cause) {
	return new Error(["The running Gateway is from an older OpenClaw build and rejected current agent cron connection metadata.", "Restart the Gateway with `openclaw gateway restart`, then retry."].join(" "), { cause });
}
/**
* Calls a gateway method as the agent-tool backend client with least-privilege scopes.
*/
async function callGatewayTool(method, opts, params, extra) {
	const gateway = resolveGatewayOptions(opts);
	const scopes = Array.isArray(extra?.scopes) ? extra.scopes : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
	const approvalRuntimeToken = resolveApprovalRuntimeTokenForGatewayTool({
		method,
		opts,
		target: gateway.target
	});
	const agentRuntimeIdentityToken = resolveAgentRuntimeIdentityTokenForGatewayTool({
		method,
		opts,
		target: gateway.target
	});
	const deviceIdentity = resolveApprovalRequesterDeviceIdentityForGatewayTool({
		method,
		opts,
		target: gateway.target
	});
	try {
		return await callGateway({
			url: gateway.url,
			token: gateway.token,
			method,
			params,
			timeoutMs: gateway.timeoutMs,
			expectFinal: extra?.expectFinal,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			clientDisplayName: "agent",
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			...approvalRuntimeToken ? { approvalRuntimeToken } : {},
			...agentRuntimeIdentityToken ? { agentRuntimeIdentityToken } : {},
			...deviceIdentity ? { deviceIdentity } : {},
			scopes
		});
	} catch (error) {
		if (agentRuntimeIdentityToken && isStaleGatewayAgentRuntimeIdentityRejection(error)) throw staleGatewayAgentRuntimeIdentityError(error);
		throw error;
	}
}
//#endregion
export { wrapToolParamValidation as A, setBeforeToolCallDiagnosticsEnabled as C, normalizeFileToolPathParam as D, getToolParamsRecord as E, normalizeFileToolPathParamsFromKeys as O, isToolWrappedWithBeforeToolCallHook as S, assertRequiredParams as T, BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS as _, wrapToolWithGatewayCallerIdentity as a, BEFORE_TOOL_CALL_WRAPPED as b, setToolTerminalPresentation as c, listChannelSupportedActions as d, resolveChannelMessageToolHints as f, getChannelAgentToolMeta as g, copyChannelAgentToolMeta as h, withGatewayToolCallerIdentity as i, stripMalformedXmlArgValueSuffixFromKeys as k, listAllChannelSupportedActions as l, resolveChannelReactionGuidance as m, readGatewayCallOptions as n, copyToolTerminalPresentation as o, resolveChannelPromptCapabilities as p, resolveGatewayOptions as r, getToolTerminalPresentation as s, callGatewayTool as t, listChannelAgentTools as u, BEFORE_TOOL_CALL_HOOK_CONTEXT as v, REQUIRED_PARAM_GROUPS as w, copyBeforeToolCallHookMarker as x, BEFORE_TOOL_CALL_SOURCE_TOOL as y };
