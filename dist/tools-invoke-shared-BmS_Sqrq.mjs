import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as defaultSlotIdForKey } from "./slots-DarSawuQ.mjs";
import { s as isTestDefaultMemorySlotDisabled } from "./config-state-DY_WJYue.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { i as isKnownCoreToolId } from "./tool-catalog-DyHnjiiS.mjs";
import { n as isAutomationsToolName, t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { b as runBeforeToolCallHook } from "./agent-tools.before-tool-call-CVkimGUL.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-D8EQIzja.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { p as getChannelAgentToolMeta } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import "./common-Dyxcwsy8.mjs";
import "./agent-tools-CkKxECNx.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
import { l as withOperatorToolGatewayAuthority } from "./server-plugin-in-process-dispatch-CakmmEh-.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-0NHGAu9Q.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { _ as resolveSessionSharingTarget, a as authorizeResolvedSessionMutation, o as authorizeSessionAgentRun } from "./session-sharing-policy-BVt5saXn.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CBwhju1Y.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { t as resolveGatewayScopedTools } from "./tool-resolution-Bd6Hg737.mjs";
import { i as assertGatewayUploadsEnabled, n as GATEWAY_UPLOADS_DISABLED_MESSAGE, r as areGatewayUploadsEnabled, s as isGatewayUploadRequest } from "./upload-policy-B7cW3IFl.mjs";
//#region src/gateway/tool-upload-policy.ts
/** New client bytes, not a request to deliver a file already owned by the Gateway. */
function isToolUploadRequest(toolName, args) {
	if (!isRecord(args)) return false;
	switch (toolName) {
		case "file_write": return typeof args.contentBase64 === "string";
		case "workboard_attachment_add": return true;
		case "message": return isGatewayUploadRequest("message.action", { params: args });
		default: return false;
	}
}
//#endregion
//#region src/gateway/tools-invoke-shared.ts
const MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
function resolveSessionTarget(params) {
	const rawSessionKey = normalizeOptionalString(params.input.sessionKey) ?? "main";
	const resolved = resolveRequestedSessionAgentId(params.cfg, rawSessionKey, normalizeOptionalString(params.input.agentId));
	if (!resolved.ok) return resolved;
	return {
		ok: true,
		agentId: resolved.agentId,
		sessionKey: resolveStoredSessionKeyForAgentStore({
			cfg: params.cfg,
			agentId: resolved.agentId,
			sessionKey: rawSessionKey
		})
	};
}
function resolveMemoryToolDisableReasons(cfg) {
	if (!process.env.VITEST) return [];
	const reasons = [];
	const plugins = cfg.plugins;
	const slotRaw = plugins?.slots?.memory;
	const slotDisabled = slotRaw === null || normalizeOptionalLowercaseString(slotRaw) === "none";
	const pluginsDisabled = plugins?.enabled === false;
	const defaultDisabled = isTestDefaultMemorySlotDisabled(cfg);
	if (pluginsDisabled) reasons.push("plugins.enabled=false");
	if (slotDisabled) reasons.push(slotRaw === null ? "plugins.slots.memory=null" : "plugins.slots.memory=\"none\"");
	if (!pluginsDisabled && !slotDisabled && defaultDisabled) reasons.push("memory plugin disabled by test default");
	return reasons;
}
function mergeActionIntoArgsIfSupported(params) {
	const { toolSchema, action, args } = params;
	if (!action || args.action !== void 0) return args;
	const schemaObj = toolSchema;
	return Boolean(schemaObj && typeof schemaObj === "object" && schemaObj.properties && "action" in schemaObj.properties) ? {
		...args,
		action
	} : args;
}
function resolveToolInputErrorStatus(err) {
	if (err instanceof SessionMutationAuthorizationChangedError) return 403;
	if (err instanceof GatewayClientRequestError && err.code === ErrorCodes.FORBIDDEN) return 403;
	if (err instanceof ToolInputError) {
		const status = err.status;
		return typeof status === "number" ? status : 400;
	}
	if (typeof err !== "object" || err === null || !("name" in err)) return null;
	const name = err.name;
	if (name !== "ToolInputError" && name !== "ToolAuthorizationError") return null;
	const status = err.status;
	if (typeof status === "number") return status;
	return name === "ToolAuthorizationError" ? 403 : 400;
}
function resolveToolSource(tool) {
	if (getPluginToolMeta(tool)) return "plugin";
	if (getChannelAgentToolMeta(tool)) return "channel";
	return "core";
}
async function invokeGatewayToolWithSignal(params) {
	let hasClientUploads = false;
	const assertCapturedInputCommitAllowed = () => {
		params.signal.throwIfAborted();
		if (hasClientUploads) assertGatewayUploadsEnabled(getRuntimeConfig());
	};
	const assertInvocationCurrent = () => {
		params.signal.throwIfAborted();
		params.assertInvocationCurrent?.();
	};
	const conversationReadOrigin = normalizeConversationReadInvocationOrigin(params.conversationReadOrigin);
	const requestedToolName = normalizeOptionalString(params.input.name ?? params.input.tool) ?? "";
	const toolName = isAutomationsToolName(requestedToolName) ? AUTOMATIONS_TOOL_NAME : requestedToolName;
	const failure = (status, type, message, details) => ({
		ok: false,
		status,
		toolName,
		error: {
			type,
			message,
			...details
		}
	});
	if (!toolName) return failure(400, "invalid_request", "tools.invoke requires name");
	if (process.env.VITEST && MEMORY_TOOL_NAMES.has(toolName)) {
		const reasons = resolveMemoryToolDisableReasons(params.cfg);
		if (reasons.length > 0) return failure(400, "invalid_request", `memory tools are disabled in tests${` (${reasons.join(", ")})`}. Enable by setting plugins.slots.memory="${defaultSlotIdForKey("memory")}" (and ensure plugins.enabled is not false).`);
	}
	const knownCoreTool = isKnownCoreToolId(toolName);
	const gatewayRequestedTools = knownCoreTool ? [] : [toolName];
	const action = normalizeOptionalString(params.input.action);
	const argsRaw = params.input.args;
	const args = argsRaw && typeof argsRaw === "object" && !Array.isArray(argsRaw) ? argsRaw : {};
	const sourceClient = getPluginRuntimeGatewayRequestScope()?.client;
	const internalRpc = params.toolCallIdPrefix === "rpc" && (sourceClient?.internal?.syntheticClient === true || sourceClient?.internal?.agentRuntimeIdentity !== void 0);
	const assertInputCommitAllowed = () => {
		params.signal.throwIfAborted();
		if (!internalRpc) assertGatewayUploadsEnabled(getRuntimeConfig());
	};
	hasClientUploads = !internalRpc && isToolUploadRequest(toolName, args);
	if (hasClientUploads && !areGatewayUploadsEnabled(params.cfg)) return failure(403, "tool_call_blocked", GATEWAY_UPLOADS_DISABLED_MESSAGE);
	const sessionTarget = resolveSessionTarget({
		cfg: params.cfg,
		input: params.input
	});
	if (!sessionTarget.ok) return failure(400, "invalid_request", sessionTarget.error.message);
	const { agentId: selectedAgentId, sessionKey } = sessionTarget;
	const authenticatedUserProfile = params.cfg.gateway?.roles ? params.authenticatedUserProfile : void 0;
	const client = createSyntheticPluginRuntimeClient({
		...authenticatedUserProfile ? { authenticatedUserProfile } : {},
		operatorRoleActor: params.operatorRoleActor,
		scopes: params.senderIsOwner ? [ADMIN_SCOPE] : [...params.operatorScopes ?? []]
	});
	const sessionEntry = loadGatewaySessionEntryReadOnly(sessionKey, { agentId: selectedAgentId }).entry;
	const primarySessionAuthorizationError = authorizeResolvedSessionMutation({
		cfg: params.cfg,
		client,
		sessionKey,
		agentId: selectedAgentId
	}) ?? (!sessionEntry ? authorizeSessionAgentRun({
		cfg: params.cfg,
		client,
		target: {
			agentId: selectedAgentId,
			canonicalKey: sessionKey
		}
	}) : null);
	if (primarySessionAuthorizationError) return failure(403, "tool_call_blocked", primarySessionAuthorizationError.message);
	if (authenticatedUserProfile && (toolName === "sessions_spawn" || toolName === "sessions_send")) {
		const nestedSessionKey = normalizeOptionalString(args.sessionKey);
		const nestedAgentId = normalizeOptionalString(args.agentId);
		const targetAgent = nestedSessionKey ? resolveRequestedSessionAgentId(params.cfg, nestedSessionKey, nestedAgentId) : void 0;
		if (targetAgent && !targetAgent.ok) return failure(400, "invalid_request", targetAgent.error.message);
		const targetAgentId = targetAgent?.agentId ?? nestedAgentId ?? selectedAgentId;
		const existingTarget = toolName === "sessions_send" && nestedSessionKey ? resolveSessionSharingTarget({
			cfg: params.cfg,
			sessionKey: nestedSessionKey,
			agentId: targetAgentId
		}) : null;
		const authorizationError = (toolName === "sessions_send" && nestedSessionKey ? authorizeResolvedSessionMutation({
			cfg: params.cfg,
			client,
			sessionKey: nestedSessionKey,
			agentId: targetAgentId
		}) : null) ?? (!existingTarget ? authorizeGatewaySessionCreation({
			cfg: params.cfg,
			client,
			agentId: targetAgentId
		}) : null);
		if (authorizationError) return failure(403, "tool_call_blocked", authorizationError.message);
	}
	if (isAgentHarnessSessionKey(sessionKey) && (!sessionEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, sessionEntry))) return failure(400, "invalid_request", AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
	const resolveTools = (disablePluginTools) => resolveGatewayScopedTools({
		cfg: params.cfg,
		sessionKey,
		sessionId: sessionEntry?.sessionId,
		agentId: selectedAgentId,
		messageProvider: params.messageChannel,
		accountId: params.accountId,
		agentTo: params.agentTo,
		agentThreadId: params.agentThreadId,
		senderIsOwner: params.senderIsOwner,
		clientCaps: params.clientCaps,
		conversationReadOrigin,
		allowGatewaySubagentBinding: true,
		allowMediaInvokeCommands: true,
		surface: "http",
		assertInvocationCurrent,
		assertInputCommitAllowed,
		disablePluginTools,
		gatewayRequestedTools
	});
	let { agentId, tools, workspaceDir } = resolveTools(knownCoreTool);
	if (knownCoreTool && !tools.some((candidate) => candidate.name === toolName)) ({agentId, tools, workspaceDir} = resolveTools(false));
	const requestedAgentId = normalizeOptionalString(params.input.agentId);
	if (requestedAgentId && agentId && requestedAgentId !== agentId) return failure(400, "invalid_request", `agent id "${requestedAgentId}" does not match session agent "${agentId}"`);
	const tool = tools.find((candidate) => candidate.name === toolName);
	if (!tool) return failure(404, "not_found", `Tool not available: ${toolName}`);
	try {
		const idempotencyKey = normalizeOptionalString(params.input.idempotencyKey);
		const toolCallId = idempotencyKey ? `${params.toolCallIdPrefix}-${conversationReadOrigin}-${idempotencyKey}` : `${params.toolCallIdPrefix}-${conversationReadOrigin}-${Date.now()}`;
		const toolArgs = mergeActionIntoArgsIfSupported({
			toolSchema: tool.parameters,
			action,
			args
		});
		assertInvocationCurrent();
		const hookResult = await runBeforeToolCallHook({
			toolName,
			params: toolArgs,
			toolCallId,
			ctx: {
				agentId,
				config: params.cfg,
				sessionKey,
				workspaceDir,
				loopDetection: resolveToolLoopDetectionConfig({
					cfg: params.cfg,
					agentId
				})
			},
			signal: params.signal,
			approvalMode: params.approvalMode
		});
		if (hookResult.blocked) return failure(403, "tool_call_blocked", hookResult.reason, { requiresApproval: hookResult.deniedReason === "plugin-approval" });
		hasClientUploads ||= !internalRpc && isToolUploadRequest(toolName, hookResult.params);
		const result = await withOperatorToolGatewayAuthority({
			authenticatedUserProfile,
			operatorRoleActor: params.operatorRoleActor,
			scopes: client.connect.scopes ?? [],
			assertCurrent: assertInvocationCurrent,
			assertInputCommitAllowed: assertCapturedInputCommitAllowed
		}, async () => {
			assertInvocationCurrent();
			assertCapturedInputCommitAllowed();
			return await tool.execute?.(toolCallId, hookResult.params, params.signal);
		});
		return {
			ok: true,
			status: 200,
			toolName,
			source: resolveToolSource(tool),
			result
		};
	} catch (err) {
		const inputStatus = resolveToolInputErrorStatus(err);
		if (inputStatus !== null) return failure(inputStatus === 403 ? 403 : 400, "tool_error", formatErrorMessage(err) || "invalid tool arguments");
		if (!params.signal?.aborted) logWarn(`tools-invoke: tool execution failed: ${String(err)}`);
		return failure(500, "tool_error", "tool execution failed");
	}
}
/** Resolves, authorizes, and invokes one gateway-visible core/plugin/channel tool. */
async function invokeGatewayTool(params) {
	const requestAbort = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, requestAbort.signal]) : requestAbort.signal;
	try {
		return await invokeGatewayToolWithSignal({
			...params,
			signal
		});
	} finally {
		requestAbort.abort();
	}
}
//#endregion
export { invokeGatewayTool as t };
