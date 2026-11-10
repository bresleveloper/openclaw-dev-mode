import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { C as defaultSlotIdForKey, s as isTestDefaultMemorySlotDisabled } from "./config-state-DkDfCu7E.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { i as isKnownCoreToolId } from "./tool-catalog-DGlfxTaj.mjs";
import { n as isAutomationsToolName, t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DaxQ5QU2.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { p as getChannelAgentToolMeta } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-BofcG96e.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { d as isGatewayAdmin, i as authorizePreparedSessionMutation, o as authorizeSessionAgentRun } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { _ as runBeforeToolCallHook } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { i as resolveStoredSessionPermissionPolicy } from "./tool-fs-policy-C65zBDHN.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { n as isMessageToolSendActionName } from "./message-action-names-cweW7syH.mjs";
import "./agent-tools-QGgE-Vnu.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
import { o as withOperatorToolGatewayAuthority } from "./server-plugin-in-process-authority-CiYjs5MA.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { c as readEmbeddedMessageDeliveryFact } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-B5FDP6Bm.mjs";
import { t as resolveGatewayScopedTools } from "./tool-resolution-DM1PdUA8.mjs";
import { i as assertGatewayUploadsEnabled, n as GATEWAY_UPLOADS_DISABLED_MESSAGE, r as areGatewayUploadsEnabled, s as isGatewayUploadRequest } from "./upload-policy-Bd2Za3Ho.mjs";
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
	if (err instanceof SessionMutationAuthorizationChangedError || err instanceof SessionMutationFactsUnavailableError) return 403;
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
		if (hasClientUploads) assertGatewayUploadsEnabled(readRuntimeConfig());
	};
	const sessionChecks = [];
	const assertCallerCurrent = () => {
		params.signal.throwIfAborted();
		params.assertInvocationCurrent?.();
	};
	const assertInvocationCurrent = () => {
		assertCallerCurrent();
		for (const check of sessionChecks) check();
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
		if (reasons.length > 0) return failure(400, "invalid_request", `memory tools are disabled in tests${` (${reasons.join(", ")})`}. Enable by setting plugins.slots.memory="${defaultSlotIdForKey("memory")}" (and check that plugins.enabled is not false).`);
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
		if (!internalRpc) assertGatewayUploadsEnabled(readRuntimeConfig());
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
	const sessionEntry = params.preparedSession ? params.preparedSession.entry : (await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: params.cfg,
		key: sessionKey,
		agentId: selectedAgentId,
		assertActive: assertInvocationCurrent
	})).entry;
	const profiles = isGatewayAdmin(client) && !params.cfg.gateway?.roles ? void 0 : await prepareSessionSharingProfiles(client);
	const prepareAuthorization = async (key, agentId, authorizeMissing) => {
		if (!profiles) {
			sessionChecks.push(() => {
				if (readRuntimeConfig().gateway?.roles) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Session role policy changed; retry the request"));
			});
			return () => null;
		}
		const facts = await prepareSessionMutationFacts({
			cfg: params.cfg,
			sessionKey: key,
			agentId,
			allowMissing: true
		});
		params.releaseSessionFacts.push(facts.release);
		const authorize = (cfg = params.cfg) => {
			const current = facts.readCurrent(cfg);
			const prepared = {
				policy: prepareProjectedSessionSharing({
					cfg,
					client,
					profiles,
					isMember: (_target, identityId) => current.membership.has(identityId)
				}).policy,
				aliases: profiles.readCurrent().profile?.aliases ?? /* @__PURE__ */ new Set()
			};
			return authorizePreparedSessionMutation({
				cfg,
				client,
				sessionKey: key,
				agentId
			}, current, prepared) ?? (!current.target ? authorizeMissing(cfg, prepared) : null);
		};
		sessionChecks.push(() => {
			const error = authorize(readRuntimeConfig());
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		});
		return authorize;
	};
	const primarySessionAuthorizationError = (await prepareAuthorization(sessionKey, selectedAgentId, (cfg, prepared) => authorizeSessionAgentRun({
		cfg,
		client,
		target: {
			agentId: selectedAgentId,
			canonicalKey: sessionKey
		}
	}, prepared)))();
	if (primarySessionAuthorizationError) return failure(403, "tool_call_blocked", primarySessionAuthorizationError.message);
	if (authenticatedUserProfile && (toolName === "sessions_spawn" || toolName === "sessions_send")) {
		const rawNestedSessionKey = normalizeOptionalString(args.sessionKey);
		const nestedSessionKey = rawNestedSessionKey ? normalizeSessionKeyPreservingOpaquePeerIds(rawNestedSessionKey) : void 0;
		const nestedAgentId = normalizeOptionalString(args.agentId);
		const targetAgent = nestedSessionKey ? resolveRequestedSessionAgentId(params.cfg, nestedSessionKey, nestedAgentId) : void 0;
		if (targetAgent && !targetAgent.ok) return failure(400, "invalid_request", targetAgent.error.message);
		const targetAgentId = targetAgent?.agentId ?? nestedAgentId ?? selectedAgentId;
		const authorizeCreation = (cfg = params.cfg, prepared) => authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: targetAgentId
		}, prepared ?? (profiles && prepareProjectedSessionSharing({
			cfg,
			client,
			profiles,
			isMember: () => false
		})));
		const authorizeNested = toolName === "sessions_send" && nestedSessionKey ? await prepareAuthorization(nestedSessionKey, targetAgentId, authorizeCreation) : authorizeCreation;
		if (authorizeNested === authorizeCreation) sessionChecks.push(() => {
			const error = authorizeCreation(readRuntimeConfig());
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		});
		const authorizationError = authorizeNested();
		const nestedSource = nestedSessionKey && captureSessionEntryMetadataRead({
			sessionKey: nestedSessionKey,
			agentId: targetAgentId
		}, () => {
			params.signal.throwIfAborted();
			params.assertInvocationCurrent?.();
		});
		if (nestedSource) {
			const initial = nestedSource.readCurrent();
			sessionChecks.push(() => {
				const current = nestedSource.readCurrent();
				const error = authorizeNested(readRuntimeConfig());
				if (error || current?.sessionId !== initial?.sessionId || current?.lifecycleRevision !== initial?.lifecycleRevision) throw new SessionMutationAuthorizationChangedError(error ?? errorShape(ErrorCodes.FORBIDDEN, "Target session changed; retry the request"));
			});
		}
		if (authorizationError) return failure(403, "tool_call_blocked", authorizationError.message);
	}
	if (isAgentHarnessSessionKey(sessionKey) && (!sessionEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, sessionEntry))) return failure(400, "invalid_request", AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
	const sessionWorkspace = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: sessionEntry?.spawnedBy,
		workspaceDir: sessionEntry?.spawnedWorkspaceDir,
		cwd: sessionEntry?.spawnedCwd
	}) ?? resolveAgentWorkspaceDir(params.cfg, selectedAgentId);
	const sessionPermissionPolicy = resolveStoredSessionPermissionPolicy(sessionEntry, sessionWorkspace);
	const resolveTools = (disablePluginTools) => resolveGatewayScopedTools({
		cfg: params.cfg,
		sessionKey,
		sessionId: sessionEntry?.sessionId,
		sessionPermissionPolicy,
		preparedSessionWorkspaceDir: sessionWorkspace,
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
	let { agentId, tools, workspaceDir } = await resolveTools(knownCoreTool);
	if (knownCoreTool && !tools.some((candidate) => candidate.name === toolName)) ({agentId, tools, workspaceDir} = await resolveTools(false));
	const requestedAgentId = normalizeOptionalString(params.input.agentId);
	if (requestedAgentId && agentId && selectedAgentId !== agentId) return failure(400, "invalid_request", `agent id "${requestedAgentId}" does not match session agent "${agentId}"`);
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
		const executedAction = asOptionalRecord(hookResult.params)?.action;
		const delivery = toolName === "message" && resolveToolSource(tool) === "core" && (isMessageToolSendActionName(executedAction) || executedAction === "poll" || executedAction === "broadcast") ? readEmbeddedMessageDeliveryFact(asOptionalRecord(asOptionalRecord(result)?.details)?.messageDelivery) : void 0;
		if (delivery?.status === "settled" || delivery?.partialDelivery === true) assertCallerCurrent();
		else assertInvocationCurrent();
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
	const releaseSessionFacts = [];
	const signal = params.signal ? AbortSignal.any([params.signal, requestAbort.signal]) : requestAbort.signal;
	try {
		const target = resolveSessionTarget({
			cfg: params.cfg,
			input: params.input
		});
		if (target.ok && isIncognitoSessionKey(target.sessionKey)) {
			const assertSourceCurrent = () => {
				signal.throwIfAborted();
				params.assertInvocationCurrent?.();
			};
			return await withSessionActorStorage(target, {
				lifetime: {
					assertCurrent: assertSourceCurrent,
					assertReadable: assertSourceCurrent
				},
				authority: {
					assertCurrent: assertSourceCurrent,
					authorize: assertSourceCurrent
				}
			}, ({ actor, authority }) => {
				const entry = actor.snapshot(authority)?.entry;
				const assertCurrent = () => {
					const current = actor.snapshot(authority)?.entry;
					if (current?.sessionId !== entry?.sessionId || current?.lifecycleRevision !== entry?.lifecycleRevision || current?.permissionMode !== entry?.permissionMode || current?.spawnedCwd !== entry?.spawnedCwd || current?.spawnedWorkspaceDir !== entry?.spawnedWorkspaceDir || current?.spawnedBy !== entry?.spawnedBy) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Session tool policy changed; retry the request"));
				};
				return invokeGatewayToolWithSignal({
					...params,
					signal,
					releaseSessionFacts,
					preparedSession: { entry },
					assertInvocationCurrent: assertCurrent
				});
			}) ?? {
				ok: false,
				status: 404,
				toolName: normalizeOptionalString(params.input.name ?? params.input.tool) ?? "",
				error: {
					type: "not_found",
					message: `Session not found: ${target.sessionKey}`
				}
			};
		}
		return await invokeGatewayToolWithSignal({
			...params,
			signal,
			releaseSessionFacts
		});
	} catch (error) {
		if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
		return {
			ok: false,
			status: 403,
			toolName: normalizeOptionalString(params.input.name ?? params.input.tool) ?? "",
			error: {
				type: "tool_call_blocked",
				message: error.message
			}
		};
	} finally {
		for (const release of releaseSessionFacts) release();
		requestAbort.abort();
	}
}
//#endregion
export { invokeGatewayTool as t };
