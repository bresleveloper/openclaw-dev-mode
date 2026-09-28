import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, E as parseThreadSessionSuffix, O as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { E as selectApplicableRuntimeConfig, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Rr as validateSendParams, gn as validateMessageActionParams, ur as validatePollParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { m as resolveSandboxedSessionCreation, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Bt6aG_wj.mjs";
import { a as isAgentHarnessSessionKey, m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { n as OutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { t as DEDUPE_MAX } from "./server-constants-Dx_kHnY5.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { r as resolveChannelThreadAddressing } from "./thread-addressing-BePl-7CH.mjs";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-6BYNCORY.mjs";
import { c as selectMessageActionRequesterIdentity, i as resolveMessageActionTurnAuthorization, r as readMessageActionInvocationConfig } from "./message-action-turn-capability-CfssNzR2.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { a as maybeResolveIdLikeTarget } from "./target-resolver-BGltLgX1.mjs";
import { n as sendDurableMessageBatchCore } from "./send-BI-ZW_ne.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-Do6h8EVN.mjs";
import { d as createChannelPartialDeliveryError, f as isChannelPartialDeliveryError } from "./live-CJusMVR5.mjs";
import "./runtime-CT_qLH6Y.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { c as isScheduledMessageWriteAction, n as resolveImplicitMessageActionTarget, o as dispatchChannelMessageAction, p as hydrateAttachmentParamsForAction, r as actionHasTarget, s as isFencedProviderReadAction, v as resolveAttachmentMediaPolicy } from "./message-action-normalization-BV8cl6P0.mjs";
import { a as mirrorDeliveredSourceReplyToTranscript, n as cancelTerminalSourceReplyDelivery, o as reconcileTerminalSourceReplyDelivery, t as beginTerminalSourceReplyDelivery } from "./source-reply-mirror-BVzhleac.mjs";
import { n as normalizePollInput } from "./polls-C-v11_tu.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-DMoOHJCh.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-CUe0piJd.mjs";
import { a as resolveOutboundSessionRoute, r as ensureOutboundSessionEntry } from "./outbound-session-kP4MplS_.mjs";
import { a as resolveOutboundTarget } from "./targets-xfpX_XXd.mjs";
import { t as extractToolPayload } from "./tool-payload-C3fv8w4C.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
import "./deps-BhgnghrK.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority--ezHAh8Z.mjs";
import { n as resolveGatewayInflightRequest$1, r as runGatewayInflightWork } from "./inflight-C7tVF6RA.mjs";
import { t as resolveGatewayConversationReadOrigin } from "./conversation-read-origin-BZPQEFI6.mjs";
//#region src/gateway/server-methods/message-action-context.ts
/** Redeem host-only message authority from a trusted local agent runtime. */
function resolveAgentRuntimeMessageActionAuthorization(client) {
	const identity = client?.internal?.agentRuntimeIdentity;
	const messageActionContext = identity?.messageActionContext;
	return identity && messageActionContext?.turnCapability ? resolveMessageActionTurnAuthorization({
		token: messageActionContext.turnCapability,
		agentId: identity.agentId,
		runId: identity.operationalRunInstance.runId,
		sessionKey: identity.sessionKey,
		sessionId: messageActionContext.sessionId
	}) : void 0;
}
/** Resolve the admitted config only while the matching bound action is dispatched. */
function resolveAgentRuntimeMessageActionConfig(client) {
	const token = client?.internal?.agentRuntimeIdentity?.messageActionContext?.turnCapability;
	return resolveAgentRuntimeMessageActionAuthorization(client)?.scheduled ? readMessageActionInvocationConfig(token) : void 0;
}
/** Retain the live caller and scheduled source through this action's requests. */
function createMessageActionRuntimeAuthority(params) {
	const assertScheduledSourceCurrent = params.authorization?.scheduled?.assertSourceCurrent ?? params.authorization?.scheduled?.assertCurrent;
	const assertReadCurrent = isFencedProviderReadAction(params.request.action) ? assertScheduledSourceCurrent ?? params.authorization?.assertDashboardReadCurrent : void 0;
	const assertScheduledWriteCurrent = isScheduledMessageWriteAction(params.request.action) ? assertScheduledSourceCurrent : void 0;
	const assertActionCurrent = assertReadCurrent ?? assertScheduledWriteCurrent ?? params.authorization?.scheduled?.assertCurrent;
	const scheduledPolicy = assertReadCurrent || assertScheduledWriteCurrent ? params.authorization?.scheduled?.policy : void 0;
	return {
		assertReadCurrent,
		assertScheduledWriteCurrent,
		routeAccountId: normalizeOptionalString(params.request.accountId) ?? normalizeOptionalString(params.request.params.accountId) ?? (scheduledPolicy?.mode === "account" ? scheduledPolicy.ownerAccountId : void 0),
		agentRuntimeAuthority: createAgentRuntimeAuthorityGuard(params.client, params.context, params.respond, assertActionCurrent ? () => {
			params.sessionMutationCommitGuard?.();
			assertActionCurrent();
		} : params.sessionMutationCommitGuard)
	};
}
function resolveTrustedMessageActionToolContext(params) {
	const identity = params.client?.internal?.agentRuntimeIdentity;
	const messageActionContext = identity?.messageActionContext;
	if (!identity || !messageActionContext) return {
		ok: true,
		toolContext: void 0,
		...selectMessageActionRequesterIdentity(void 0),
		sessionId: void 0,
		sourceReplySessionKey: void 0,
		sourceReplyFinal: void 0,
		sourceReplyToolCallId: void 0,
		runtimeAgentId: void 0
	};
	if (Date.now() >= messageActionContext.expiresAtMs) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "message.action agent runtime context has expired")
	};
	const requestSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(params.request.sessionKey);
	const identitySessionKey = normalizeSessionKeyPreservingOpaquePeerIds(identity.sessionKey);
	const identityAgentId = normalizeAgentId(identity.agentId);
	const requestAgentId = normalizeOptionalString(params.request.agentId);
	const sessionAgentId = parseAgentSessionKey(requestSessionKey)?.agentId;
	const requestSessionId = normalizeOptionalString(params.request.sessionId);
	const sourceReplySessionKey = normalizeSessionKeyPreservingOpaquePeerIds(messageActionContext.sourceReplySessionKey) || void 0;
	const sourceReplySessionAgentId = parseAgentSessionKey(sourceReplySessionKey)?.agentId;
	if (!requestSessionKey || requestSessionKey !== identitySessionKey || requestAgentId && normalizeAgentId(requestAgentId) !== identityAgentId || sessionAgentId && normalizeAgentId(sessionAgentId) !== identityAgentId || messageActionContext.sessionId && requestSessionId !== messageActionContext.sessionId || sourceReplySessionKey && sourceReplySessionAgentId && normalizeAgentId(sourceReplySessionAgentId) !== identityAgentId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "message.action agent runtime identity does not match the requested session")
	};
	const messageActionAuthorization = resolveAgentRuntimeMessageActionAuthorization(params.client);
	return {
		ok: true,
		toolContext: messageActionContext.toolContext,
		...selectMessageActionRequesterIdentity(messageActionContext),
		sessionId: messageActionContext.sessionId,
		sourceReplySessionKey,
		sourceReplyFinal: messageActionContext.sourceReplyFinal,
		sourceReplyToolCallId: messageActionContext.sourceReplyToolCallId,
		runtimeAgentId: identityAgentId,
		messageActionAuthorization,
		messageActionConfig: messageActionAuthorization?.scheduled ? readMessageActionInvocationConfig(messageActionContext.turnCapability) : void 0
	};
}
//#endregion
//#region src/gateway/server-methods/message-operation-result.ts
function buildGatewayDeliveryPayload(params) {
	const payload = {
		runId: params.runId,
		messageId: params.result.messageId,
		channel: params.channel
	};
	for (const key of [
		"chatId",
		"channelId",
		"toJid",
		"conversationId",
		"pollId"
	]) if (key in params.result) payload[key] = params.result[key];
	return payload;
}
function createGatewayInflightResult(params) {
	if (params.dedupeKey !== void 0) params.context.dedupe.set(params.dedupeKey, {
		ts: Date.now(),
		...params.result
	});
	return {
		...params.result,
		meta: {
			channel: params.channel,
			...params.meta
		}
	};
}
function createGatewayInflightSuccess(params) {
	return createGatewayInflightResult({
		...params,
		result: {
			ok: true,
			payload: params.payload
		}
	});
}
function createGatewayInflightUnavailableFailure(params) {
	const partialDelivery = isChannelPartialDeliveryError(params.err) ? params.err.deliveryResult : void 0;
	const queuedDelivery = !partialDelivery && params.err instanceof OutboundDeliveryError && params.err.queueCustody === "held";
	const error = errorShape(ErrorCodes.UNAVAILABLE, String(params.err), partialDelivery ? {
		details: { partialDelivery },
		retryable: false
	} : queuedDelivery ? { details: { code: GatewayErrorDetailCodes.OUTBOUND_DELIVERY_QUEUED } } : void 0);
	return createGatewayInflightResult({
		...params,
		result: {
			ok: false,
			error
		},
		meta: { error: formatForLog(params.err) }
	});
}
function createGatewayInflightAuthorityFailure(params) {
	return createGatewayInflightResult({
		...params,
		result: {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active")
		}
	});
}
async function mirrorDeliveredSourceReplyToTranscriptBestEffort(params) {
	try {
		if (!await mirrorDeliveredSourceReplyToTranscript(params.mirror) && params.mirror.sourceReplyFinal === true) params.context.logGateway?.warn?.("Terminal source reply receipt was not mirrored; restart recovery is fail-closed.", {
			channel: params.mirror.channel,
			sessionKey: params.mirror.sessionKey
		});
	} catch (err) {
		params.context.logGateway?.warn?.("Source reply transcript mirror failed after delivery.", {
			error: formatForLog(err),
			channel: params.mirror.channel,
			sessionKey: params.mirror.sessionKey
		});
	}
}
const sourceReplyTranscriptMirrorQueue = new KeyedAsyncQueue();
function resolveSourceReplyTranscriptMirrorQueueKey(mirror) {
	return mirror.sessionKey?.trim() || "__global__";
}
function scheduleDeliveredSourceReplyTranscriptMirror(params) {
	const queueKey = resolveSourceReplyTranscriptMirrorQueueKey(params.mirror);
	return sourceReplyTranscriptMirrorQueue.enqueue(queueKey, () => mirrorDeliveredSourceReplyToTranscriptBestEffort(params));
}
//#endregion
//#region src/gateway/server-methods/send.ts
const MESSAGE_OPERATION_ROUTE_BINDING_MAX = DEDUPE_MAX * 4;
const messageOperationRouteBindings = /* @__PURE__ */ new WeakMap();
const messageOperationRouteBindingQueues = /* @__PURE__ */ new WeakMap();
function pruneMessageOperationRouteBindings(bindings, now) {
	for (const [key, entry] of bindings) if (!entry.retainUntilSettled && now - entry.ts > 3e5) bindings.delete(key);
	const excess = bindings.size - MESSAGE_OPERATION_ROUTE_BINDING_MAX;
	if (excess <= 0) return;
	const oldestSettledKeys = [...bindings.entries()].filter(([, entry]) => !entry.retainUntilSettled).toSorted(([, left], [, right]) => left.ts - right.ts).slice(0, excess).map(([key]) => key);
	for (const key of oldestSettledKeys) bindings.delete(key);
}
function getMessageOperationRouteBindings(context) {
	let bindings = messageOperationRouteBindings.get(context);
	if (!bindings) {
		bindings = /* @__PURE__ */ new Map();
		messageOperationRouteBindings.set(context, bindings);
	}
	pruneMessageOperationRouteBindings(bindings, Date.now());
	return bindings;
}
function getMessageOperationRouteBindingQueue(context) {
	let queue = messageOperationRouteBindingQueues.get(context);
	if (!queue) {
		queue = new KeyedAsyncQueue();
		messageOperationRouteBindingQueues.set(context, queue);
	}
	return queue;
}
async function acquireMessageOperationRouteBindingLock(params) {
	if (!params.binding) return () => void 0;
	let signalAcquired;
	let signalRelease;
	const acquired = new Promise((resolve) => {
		signalAcquired = resolve;
	});
	const held = new Promise((resolve) => {
		signalRelease = resolve;
	});
	getMessageOperationRouteBindingQueue(params.context).enqueue(params.binding.key, async () => {
		signalAcquired?.();
		await held;
	});
	await acquired;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		signalRelease?.();
	};
}
function resolveMessageOperationAuthorityScope(params) {
	return params.prefix === "message.action" ? `:${params.conversationReadOrigin ?? "delegated"}:${params.operation ?? "unknown"}` : "";
}
function resolveGatewayInflightRequest(params) {
	const idem = params.idempotencyKey;
	const authorityScope = resolveMessageOperationAuthorityScope(params);
	const requestScope = params.requestScope ? `:${params.requestScope}` : "";
	const dedupeKey = `${params.prefix}${authorityScope}${requestScope}:${idem}`;
	return resolveGatewayInflightRequest$1({
		context: params.context,
		dedupeKey,
		idempotencyKey: idem,
		respond: params.respond
	});
}
function parseMessageOperationRoute(requestScope) {
	if (!requestScope) return;
	try {
		const parsed = JSON.parse(requestScope);
		if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== "string" || typeof parsed[1] !== "string") return;
		const channel = normalizeMessageChannel(parsed[0]);
		const accountId = normalizeOptionalAccountId(parsed[1]);
		if (!channel || channel !== parsed[0] || !accountId || accountId !== parsed[1]) return;
		return {
			channel,
			accountId,
			requestScope
		};
	} catch {
		return;
	}
}
function resolveMessageOperationRouteBinding(params) {
	const rawChannel = readStringValue(params.requestChannel);
	const channel = rawChannel ? normalizeMessageChannel(rawChannel) : void 0;
	if (rawChannel && !channel) return;
	const normalizedAccountIds = params.accountIds.filter((value) => value !== void 0 && value !== null && (typeof value !== "string" || value.trim())).map((value) => typeof value === "string" ? normalizeOptionalAccountId(value) : void 0);
	if (normalizedAccountIds.some((accountId) => !accountId)) return;
	const distinctAccountIds = [...new Set(normalizedAccountIds)];
	if (distinctAccountIds.length > 1) return;
	const accountId = distinctAccountIds[0];
	const authorityScope = resolveMessageOperationAuthorityScope(params);
	const explicitRouteScope = JSON.stringify([channel ?? null, accountId ?? null]);
	const key = `${params.prefix}${authorityScope}:route-binding:${explicitRouteScope}:${params.idempotencyKey}`;
	return {
		key,
		reservedRoute: parseMessageOperationRoute(getMessageOperationRouteBindings(params.context).get(key)?.requestScope)
	};
}
function bindMessageOperationRoute(params) {
	if (!params.binding) return true;
	const bindings = getMessageOperationRouteBindings(params.context);
	const existing = bindings.get(params.binding.key);
	if (existing) {
		if (existing.requestScope !== params.requestScope) return false;
		bindings.set(params.binding.key, {
			...existing,
			ts: Date.now()
		});
		return true;
	}
	bindings.set(params.binding.key, {
		ts: Date.now(),
		requestScope: params.requestScope,
		retainUntilSettled: false
	});
	pruneMessageOperationRouteBindings(bindings, Date.now());
	return true;
}
function refreshMessageOperationRouteBinding(params) {
	if (!params.binding) return;
	const bindings = getMessageOperationRouteBindings(params.context);
	const existing = bindings.get(params.binding.key);
	if (existing?.requestScope === params.requestScope) {
		bindings.set(params.binding.key, {
			...existing,
			ts: Date.now(),
			retainUntilSettled: false
		});
		pruneMessageOperationRouteBindings(bindings, Date.now());
	}
}
function retainMessageOperationRouteBinding(params) {
	if (!params.binding) return;
	const bindings = getMessageOperationRouteBindings(params.context);
	const existing = bindings.get(params.binding.key);
	if (existing?.requestScope === params.requestScope) bindings.set(params.binding.key, {
		...existing,
		retainUntilSettled: true
	});
}
function replayReservedMessageOperationRoute(params) {
	if (!params.binding?.reservedRoute) return;
	const inflight = resolveGatewayInflightRequest({
		context: params.context,
		prefix: params.prefix,
		idempotencyKey: params.idempotencyKey,
		respond: params.respond,
		conversationReadOrigin: params.conversationReadOrigin,
		operation: params.operation,
		requestScope: params.binding.reservedRoute.requestScope
	});
	if (inflight.kind === "ready") return;
	return inflight.done;
}
function resolveMessageOperationAccountRoute(params) {
	const accountIds = params.accountIds.map((accountId) => validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		channel: params.channel,
		accountId,
		plugin: params.plugin
	})).filter((accountId) => accountId !== void 0);
	const distinctAccountIds = [...new Set(accountIds)];
	if (distinctAccountIds.length > 1) throw new Error(params.conflictMessage);
	const accountId = distinctAccountIds[0];
	const effectiveAccountId = accountId ?? normalizeAccountId(resolveChannelDefaultAccountId({
		plugin: params.plugin,
		cfg: params.cfg
	}));
	return {
		accountId,
		effectiveAccountId,
		requestScope: JSON.stringify([params.channel, effectiveAccountId])
	};
}
async function withMessageOperationRoute(params) {
	if (params.replayResults === false) {
		const resolved = await params.resolveChannel(params.requestChannel);
		if (!resolved) return;
		try {
			const accountRoute = resolveMessageOperationAccountRoute({
				...resolved,
				accountIds: params.routeAccountIds(void 0),
				conflictMessage: params.conflictMessage
			});
			const authorize = params.authorize ?? (() => true);
			const assertCurrent = () => {
				if (!authorize()) throw new Error("agent runtime authority is no longer active");
			};
			assertCurrent();
			const result = await params.work({
				...resolved,
				accountId: accountRoute.effectiveAccountId,
				idem: params.idempotencyKey,
				dedupeKey: void 0,
				authorize
			});
			assertCurrent();
			params.respond(result.ok, result.payload, result.error, result.meta);
		} catch (error) {
			respondGatewayInvalidRequest({
				respond: params.respond,
				channel: resolved.channel,
				error
			});
		}
		return;
	}
	const bindingParams = {
		context: params.context,
		prefix: params.prefix,
		idempotencyKey: params.idempotencyKey,
		conversationReadOrigin: params.conversationReadOrigin,
		operation: params.operation,
		requestChannel: params.requestChannel,
		accountIds: params.bindingAccountIds
	};
	let binding = resolveMessageOperationRouteBinding(bindingParams);
	const releaseLock = await acquireMessageOperationRouteBindingLock({
		context: params.context,
		binding
	});
	try {
		binding = resolveMessageOperationRouteBinding(bindingParams);
		const reservedReplay = replayReservedMessageOperationRoute({
			context: params.context,
			binding,
			prefix: params.prefix,
			idempotencyKey: params.idempotencyKey,
			respond: params.respond,
			conversationReadOrigin: params.conversationReadOrigin,
			operation: params.operation
		});
		if (reservedReplay) {
			releaseLock();
			await reservedReplay;
			return;
		}
		const resolved = await params.resolveChannel(binding?.reservedRoute?.channel ?? params.requestChannel);
		if (!resolved) return;
		let accountRoute;
		try {
			accountRoute = resolveMessageOperationAccountRoute({
				...resolved,
				accountIds: params.routeAccountIds(binding),
				conflictMessage: params.conflictMessage
			});
		} catch (error) {
			respondGatewayInvalidRequest({
				respond: params.respond,
				channel: resolved.channel,
				error
			});
			return;
		}
		if (!bindMessageOperationRoute({
			context: params.context,
			binding,
			requestScope: accountRoute.requestScope
		})) {
			respondGatewayInvalidRequest({
				respond: params.respond,
				channel: resolved.channel,
				error: "idempotency key is already bound to a different message route"
			});
			return;
		}
		const inflight = resolveGatewayInflightRequest({
			context: params.context,
			prefix: params.prefix,
			idempotencyKey: params.idempotencyKey,
			respond: params.respond,
			conversationReadOrigin: params.conversationReadOrigin,
			operation: params.operation,
			requestScope: accountRoute.requestScope
		});
		if (inflight.kind === "handled") {
			releaseLock();
			await inflight.done;
			return;
		}
		if (params.authorize && !params.authorize()) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
			return;
		}
		retainMessageOperationRouteBinding({
			context: params.context,
			binding,
			requestScope: accountRoute.requestScope
		});
		const work = params.work({
			...resolved,
			accountId: accountRoute.accountId,
			idem: inflight.idem,
			dedupeKey: inflight.dedupeKey,
			authorize: params.authorize ?? (() => true)
		}).finally(() => {
			refreshMessageOperationRouteBinding({
				context: params.context,
				binding,
				requestScope: accountRoute.requestScope
			});
		});
		const inflightWork = runGatewayInflightWork({
			...inflight,
			work,
			respond: params.respond
		});
		releaseLock();
		await inflightWork;
	} finally {
		releaseLock();
	}
}
function respondGatewayInvalidRequest(params) {
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(params.error)), {
		channel: params.channel,
		error: formatForLog(params.error)
	});
}
async function resolveRequestedChannel(params) {
	const channelInput = readStringValue(params.requestChannel);
	const normalizedChannel = channelInput ? normalizeMessageChannel(channelInput) : void 0;
	if (params.rejectWebchatAsInternalOnly && normalizedChannel === "webchat") return { error: errorShape(ErrorCodes.INVALID_REQUEST, "unsupported channel: webchat (internal-only). Use `chat.send` for WebChat UI messages or choose a deliverable channel.") };
	if (channelInput && !normalizedChannel) return { error: errorShape(ErrorCodes.INVALID_REQUEST, params.unsupportedMessage(channelInput)) };
	const sourceCfg = params.config ?? params.context.getRuntimeConfig();
	const cfg = sourceCfg;
	let channel = normalizedChannel;
	if (!channel) try {
		channel = (await resolveMessageChannelSelection({ cfg })).channel;
	} catch (err) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(err)) };
	}
	return {
		cfg,
		sourceCfg,
		channel
	};
}
async function resolveInternalDeliveryChannel(requestChannel, context, config) {
	const resolvedChannel = await resolveRequestedChannel({
		requestChannel,
		unsupportedMessage: (input) => `unsupported channel: ${input}`,
		context,
		config,
		rejectWebchatAsInternalOnly: true
	});
	if ("error" in resolvedChannel) return {
		kind: "failed",
		result: {
			ok: false,
			error: resolvedChannel.error
		}
	};
	return {
		kind: "ready",
		...resolvedChannel
	};
}
function resolveGatewayOutboundTarget(params) {
	const resolved = resolveOutboundTarget({
		channel: params.channel,
		to: params.to,
		cfg: params.cfg,
		accountId: params.accountId,
		mode: "explicit"
	});
	if (!resolved.ok) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, String(resolved.error))
	};
	return {
		ok: true,
		to: resolved.to
	};
}
function resolveMessageActionRuntimeConfig(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return params.cfg;
	const selected = selectApplicableRuntimeConfig({
		inputConfig: params.sourceCfg,
		runtimeConfig,
		runtimeSourceConfig
	});
	if (selected === runtimeConfig && selected !== params.cfg) return selected;
	return params.cfg;
}
const sendHandlers = {
	"message.action": async ({ params: request, respond, context, client, sessionMutationCommitGuard }) => {
		if (!assertValidParams(request, validateMessageActionParams, "message.action", respond)) return;
		const trustedContext = resolveTrustedMessageActionToolContext({
			client,
			request
		});
		if (!trustedContext.ok) {
			respond(false, void 0, trustedContext.error);
			return;
		}
		const conversationReadOrigin = resolveGatewayConversationReadOrigin({
			client,
			requestedOrigin: request.conversationReadOrigin
		});
		const messageAuthority = createMessageActionRuntimeAuthority({
			client,
			context,
			respond,
			sessionMutationCommitGuard,
			request,
			authorization: trustedContext.messageActionAuthorization
		});
		const assertDirectAdapterHandoff = messageAuthority.agentRuntimeAuthority.commitGuard;
		const onPlatformSendDispatch = assertDirectAdapterHandoff ? async () => assertDirectAdapterHandoff() : void 0;
		const downstreamToolContext = trustedContext.toolContext ? {
			...trustedContext.toolContext,
			skipCrossContextDecoration: true
		} : void 0;
		const downstreamMessageActionAuthorization = trustedContext.messageActionAuthorization ? {
			...trustedContext.messageActionAuthorization,
			toolContext: downstreamToolContext
		} : void 0;
		await withMessageOperationRoute({
			context,
			prefix: "message.action",
			operation: request.action,
			idempotencyKey: request.idempotencyKey,
			respond,
			conversationReadOrigin,
			requestChannel: request.channel,
			bindingAccountIds: [messageAuthority.routeAccountId, request.params.accountId],
			routeAccountIds: (binding) => [
				messageAuthority.routeAccountId,
				request.params.accountId,
				binding?.reservedRoute?.accountId
			],
			conflictMessage: "message.action accountId does not match params.accountId",
			authorize: messageAuthority.agentRuntimeAuthority.hasActive,
			replayResults: messageAuthority.assertReadCurrent === void 0,
			resolveChannel: async (requestChannel) => {
				const resolved = await resolveRequestedChannel({
					requestChannel,
					unsupportedMessage: (input) => `unsupported channel: ${input}`,
					context,
					config: trustedContext.messageActionConfig,
					rejectWebchatAsInternalOnly: true
				});
				if ("error" in resolved) {
					respond(false, void 0, resolved.error);
					return;
				}
				const { cfg: selectedCfg, sourceCfg, channel } = resolved;
				const cfg = trustedContext.messageActionConfig ?? resolveMessageActionRuntimeConfig({
					cfg: selectedCfg,
					sourceCfg
				});
				const plugin = resolveOutboundChannelPlugin({
					channel,
					cfg
				});
				const canonicalAction = (request.action === "send" && Boolean(plugin?.message?.send?.text || plugin?.outbound?.sendText) || request.action === "poll" && Boolean(plugin?.outbound?.sendPoll)) && (!plugin?.actions?.handleAction || plugin.actions.supportsAction?.({ action: request.action }) === false);
				if (!plugin || !plugin.actions?.handleAction && !canonicalAction) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Channel ${channel} does not support action ${request.action}.`));
					return;
				}
				return {
					cfg,
					channel,
					plugin,
					canonicalAction
				};
			},
			work: async ({ cfg, channel, plugin, canonicalAction, accountId, dedupeKey, authorize }) => {
				try {
					return await withChannelReadAuthority(request.action === "download-file" || messageAuthority.assertReadCurrent ? assertDirectAdapterHandoff : void 0, async () => {
						const sessionKey = normalizeOptionalString(request.sessionKey) ?? void 0;
						const requestedAgentId = normalizeOptionalString(request.agentId) ?? trustedContext.runtimeAgentId;
						const sessionOwner = sessionKey ? resolveRequestedSessionAgentId(cfg, sessionKey, requestedAgentId) : void 0;
						if (sessionOwner && !sessionOwner.ok) return {
							ok: false,
							error: sessionOwner.error,
							meta: { channel }
						};
						const agentId = sessionOwner?.agentId ?? requestedAgentId;
						const sourceReplySessionKey = trustedContext.sourceReplySessionKey;
						const sourceReplyOwner = sourceReplySessionKey ? resolveRequestedSessionAgentId(cfg, sourceReplySessionKey, agentId) : void 0;
						if (sourceReplyOwner && !sourceReplyOwner.ok) return {
							ok: false,
							error: sourceReplyOwner.error,
							meta: { channel }
						};
						if (request.action === "send" && cfg.gateway?.roles) {
							const actionAgent = agentId ?? sourceReplyOwner?.agentId ?? resolveRequestedSessionAgentId(cfg, "main");
							if (typeof actionAgent !== "string" && !actionAgent.ok) return {
								ok: false,
								error: actionAgent.error,
								meta: { channel }
							};
							const actionAgentId = typeof actionAgent === "string" ? actionAgent : actionAgent.agentId;
							const agentAccessError = authorizeGatewaySessionCreation({
								cfg,
								client,
								agentId: actionAgentId
							});
							if (agentAccessError) return {
								ok: false,
								error: agentAccessError,
								meta: { channel }
							};
						}
						if (accountId) request.params.accountId = accountId;
						if (canonicalAction && request.action === "send" && !normalizeOptionalString(request.params.target) && !actionHasTarget("send", request.params, {
							channel,
							aliasSpec: plugin.actions?.messageActionTargetAliases?.send ?? null
						}) && !resolveImplicitMessageActionTarget(trustedContext.toolContext)) {
							const target = resolveOutboundTarget({
								channel,
								plugin,
								cfg,
								accountId
							});
							if (!target.ok) throw target.error;
							request.params.to = target.to;
						}
						const resolvedMediaAccess = resolveAgentScopedOutboundMediaAccess({
							cfg,
							agentId,
							sessionKey,
							messageProvider: sessionKey ? void 0 : channel,
							accountId: sessionKey ? trustedContext.requesterAccountId ?? accountId : accountId,
							requesterSenderId: trustedContext.requesterSenderId,
							requesterSenderName: trustedContext.requesterSenderName,
							requesterSenderUsername: trustedContext.requesterSenderUsername,
							requesterSenderE164: trustedContext.requesterSenderE164
						});
						const mediaAccess = {
							localRoots: resolvedMediaAccess.localRoots,
							...resolvedMediaAccess.workspaceDir ? { workspaceDir: resolvedMediaAccess.workspaceDir } : {}
						};
						if (request.action === "send") await hydrateAttachmentParamsForAction({
							cfg,
							channel,
							accountId,
							args: request.params,
							action: "send",
							mediaPolicy: resolveAttachmentMediaPolicy({ mediaAccess: resolvedMediaAccess })
						});
						const sourceReplyMirror = {
							action: request.action,
							channel,
							actionParams: request.params,
							cfg,
							accountId,
							currentAccountId: trustedContext.requesterAccountId,
							sessionKey: sourceReplySessionKey ?? sessionKey,
							sessionId: trustedContext.sessionId,
							agentId,
							toolContext: trustedContext.toolContext,
							replyToIsExplicit: request.reply?.source === "explicit",
							idempotencyKey: request.idempotencyKey,
							toolCallId: trustedContext.sourceReplyToolCallId,
							...trustedContext.sourceReplyFinal !== void 0 ? { sourceReplyFinal: trustedContext.sourceReplyFinal } : {}
						};
						const terminalDeliveryStart = trustedContext.sourceReplyFinal === true ? await beginTerminalSourceReplyDelivery(sourceReplyMirror) : void 0;
						if (terminalDeliveryStart && "outcome" in terminalDeliveryStart) return createGatewayInflightSuccess({
							context,
							dedupeKey,
							payload: terminalDeliveryStart.result,
							channel
						});
						const terminalDeliveryReceipt = terminalDeliveryStart;
						if (!authorize()) {
							await cancelTerminalSourceReplyDelivery(terminalDeliveryReceipt);
							return createGatewayInflightAuthorityFailure({
								context,
								dedupeKey,
								channel
							});
						}
						const gatewayClientScopes = client?.connect?.scopes ?? [];
						const inboundEventKind = request.inboundTurnKind === "room_event" ? "room_event" : "user_request";
						const actionContext = {
							channel,
							action: request.action,
							cfg,
							params: request.params,
							reply: request.reply,
							accountId,
							deliveryRetryOwner: trustedContext.runtimeAgentId ? "caller" : void 0,
							...selectMessageActionRequesterIdentity(trustedContext),
							senderIsOwner: gatewayClientScopes.includes("operator.admin") ? request.senderIsOwner === true : false,
							conversationReadOrigin,
							sessionKey,
							sessionId: normalizeOptionalString(request.sessionId) ?? void 0,
							inboundEventKind,
							agentId,
							mediaAccess,
							mediaLocalRoots: mediaAccess.localRoots,
							toolContext: downstreamToolContext,
							dryRun: false,
							messageActionAuthorization: downstreamMessageActionAuthorization,
							gatewayClientScopes,
							assertDirectAdapterHandoff,
							onPlatformSendDispatch,
							skipQueue: client?.internal?.agentRuntimeIdentity !== void 0 && (request.action === "send" || Boolean(trustedContext.messageActionAuthorization?.scheduled))
						};
						const settleTerminalDelivery = async (deliveredPayload, mirrorTranscript = true) => {
							try {
								await reconcileTerminalSourceReplyDelivery({
									deliveredPayload,
									mirror: sourceReplyMirror,
									receipt: terminalDeliveryReceipt
								});
							} catch (err) {
								context.logGateway?.warn?.("Terminal source reply receipt reconciliation failed.", {
									error: formatForLog(err),
									channel,
									sessionKey
								});
							}
							if (mirrorTranscript) await scheduleDeliveredSourceReplyTranscriptMirror({
								context,
								mirror: {
									...sourceReplyMirror,
									deliveredPayload
								}
							});
						};
						let payload;
						try {
							if (canonicalAction || messageAuthority.assertScheduledWriteCurrent) {
								const { runMessageAction } = await import("./message-action-runner-Fo7xyho1.mjs");
								payload = (await runMessageAction({
									...actionContext,
									gatewayOwnedDelivery: true,
									...request.action === "send" ? {
										suppressTranscriptMirror: true,
										actionOrigin: trustedContext.runtimeAgentId ? "message-tool" : void 0
									} : {},
									params: {
										...request.params,
										channel,
										...accountId ? { accountId } : {},
										idempotencyKey: request.idempotencyKey
									}
								})).payload;
							} else {
								const handled = await dispatchChannelMessageAction(actionContext);
								if (handled) payload = extractToolPayload(handled);
								else {
									await cancelTerminalSourceReplyDelivery(terminalDeliveryReceipt);
									return createGatewayInflightResult({
										context,
										dedupeKey,
										channel,
										result: {
											ok: false,
											error: errorShape(ErrorCodes.INVALID_REQUEST, `Message action ${request.action} not supported for channel ${channel}.`)
										}
									});
								}
							}
						} catch (err) {
							if (isChannelPartialDeliveryError(err)) await settleTerminalDelivery(err.deliveryResult, false);
							throw err;
						}
						await settleTerminalDelivery(payload);
						return request.action === "download-file" ? {
							ok: true,
							payload,
							meta: { channel }
						} : createGatewayInflightSuccess({
							context,
							dedupeKey,
							payload,
							channel
						});
					}, void 0, (result) => {
						if (request.action === "download-file" && result.ok) createGatewayInflightSuccess({
							context,
							dedupeKey,
							payload: result.payload,
							channel
						});
					});
				} catch (err) {
					if (isChannelPartialDeliveryError(err)) return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
					if (!authorize()) return createGatewayInflightAuthorityFailure({
						context,
						dedupeKey,
						channel
					});
					return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
				}
			}
		});
	},
	send: async ({ params: request, respond, context, client, sessionMutationCommitGuard }) => {
		if (!assertValidParams(request, validateSendParams, "send", respond)) return;
		const to = normalizeOptionalString(request.to) ?? "";
		const message = request.message?.trim() ? request.message : "";
		const mediaUrl = normalizeOptionalString(request.mediaUrl);
		const mediaUrls = Array.isArray(request.mediaUrls) ? request.mediaUrls.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry)) : void 0;
		const buffer = readStringValue(request.buffer);
		if (!message && !mediaUrl && (mediaUrls?.length ?? 0) === 0 && !buffer) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid send params: text or media is required"));
			return;
		}
		const requestedAccountId = normalizeOptionalString(request.accountId);
		const replyToId = normalizeOptionalString(request.replyToId);
		const threadId = normalizeOptionalString(request.threadId);
		const messageActionAuthorization = resolveAgentRuntimeMessageActionAuthorization(client);
		const messageActionConfig = resolveAgentRuntimeMessageActionConfig(client);
		const agentRuntimeAuthority = createMessageActionRuntimeAuthority({
			client,
			context,
			respond,
			sessionMutationCommitGuard,
			request: {
				action: "send",
				accountId: request.accountId,
				params: {}
			},
			authorization: messageActionAuthorization
		}).agentRuntimeAuthority;
		const hasAgentRuntimeAuthority = client?.internal?.agentRuntimeIdentity !== void 0;
		const commitAgentRuntimeAuthority = agentRuntimeAuthority.commitGuard;
		const onPlatformSendDispatch = commitAgentRuntimeAuthority ? async () => commitAgentRuntimeAuthority() : void 0;
		await withMessageOperationRoute({
			context,
			prefix: "send",
			idempotencyKey: request.idempotencyKey,
			respond,
			requestChannel: request.channel,
			bindingAccountIds: [request.accountId],
			routeAccountIds: (binding) => [requestedAccountId, binding?.reservedRoute?.accountId],
			conflictMessage: "send account selections do not match",
			authorize: agentRuntimeAuthority.hasActive,
			resolveChannel: async (requestChannel) => {
				const resolved = await resolveInternalDeliveryChannel(requestChannel, context, messageActionConfig);
				if (resolved.kind !== "ready") {
					const result = resolved.result;
					respond(result.ok, result.payload, result.error, result.meta);
					return;
				}
				const { cfg, channel } = resolved;
				const plugin = resolveOutboundChannelPlugin({
					channel,
					cfg
				});
				if (!plugin) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported channel: ${channel}`));
					return;
				}
				return {
					cfg,
					channel,
					plugin
				};
			},
			work: async ({ cfg, channel, accountId, idem, dedupeKey, authorize }) => {
				try {
					const resolvedTarget = resolveGatewayOutboundTarget({
						channel,
						to,
						cfg,
						accountId
					});
					if (!resolvedTarget.ok) return {
						ok: false,
						error: resolvedTarget.error,
						meta: { channel }
					};
					const idLikeTarget = await withChannelReadAuthority(messageActionAuthorization?.scheduled ? commitAgentRuntimeAuthority : void 0, () => maybeResolveIdLikeTarget({
						cfg,
						channel,
						input: resolvedTarget.to,
						accountId
					}));
					const deliveryTarget = idLikeTarget?.to ?? resolvedTarget.to;
					const providedSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(request.sessionKey) || void 0;
					const explicitAgentId = normalizeOptionalString(request.agentId);
					const sessionOwner = providedSessionKey ? resolveRequestedSessionAgentId(cfg, providedSessionKey, explicitAgentId) : void 0;
					if (sessionOwner && !sessionOwner.ok) return {
						ok: false,
						error: sessionOwner.error,
						meta: { channel }
					};
					const sessionAgentId = sessionOwner?.agentId;
					const implicitAgent = !explicitAgentId && !sessionAgentId ? resolveRequestedSessionAgentId(cfg, "main") : void 0;
					if (implicitAgent && !implicitAgent.ok) return {
						ok: false,
						error: implicitAgent.error,
						meta: { channel }
					};
					const effectiveAgentId = explicitAgentId ?? sessionAgentId ?? (implicitAgent?.ok ? implicitAgent.agentId : null);
					if (!effectiveAgentId) return {
						ok: false,
						error: errorShape(ErrorCodes.INVALID_REQUEST, "agent selection is required"),
						meta: { channel }
					};
					const sendArgs = {
						mediaUrl,
						mediaUrls,
						buffer,
						filename: normalizeOptionalString(request.filename) ?? void 0,
						contentType: normalizeOptionalString(request.contentType) ?? void 0
					};
					await hydrateAttachmentParamsForAction({
						cfg,
						channel,
						accountId,
						args: sendArgs,
						action: "send",
						mediaPolicy: resolveAttachmentMediaPolicy({ mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, effectiveAgentId) })
					});
					const hydratedMediaUrl = normalizeOptionalString(sendArgs.mediaUrl);
					const hydratedMediaUrls = Array.isArray(sendArgs.mediaUrls) ? sendArgs.mediaUrls.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry)) : void 0;
					const outboundDeps = context.deps ? createOutboundSendDeps(context.deps) : void 0;
					const outboundPayloads = [{
						text: message,
						mediaUrl: hydratedMediaUrl,
						mediaUrls: hydratedMediaUrls,
						...request.asVoice === true ? { audioAsVoice: true } : {}
					}];
					const outboundPayloadPlan = createOutboundPayloadPlan(outboundPayloads);
					const mirrorProjection = projectOutboundPayloadPlanForMirror(outboundPayloadPlan);
					const mirrorText = mirrorProjection.text;
					const mirrorMediaUrls = mirrorProjection.mediaUrls;
					const derivedRoute = await resolveOutboundSessionRoute({
						cfg,
						channel,
						agentId: effectiveAgentId,
						accountId,
						target: deliveryTarget,
						currentSessionKey: providedSessionKey,
						resolvedTarget: idLikeTarget,
						replyToId,
						threadId
					});
					const providedSessionBaseKey = parseThreadSessionSuffix(providedSessionKey).baseSessionKey ?? providedSessionKey;
					const shouldUseDerivedThreadSessionKey = resolveChannelThreadAddressing(channel) === "message" && Boolean(providedSessionKey) && Boolean(normalizeOptionalString(derivedRoute?.threadId)) && normalizeOptionalLowercaseString(derivedRoute?.baseSessionKey) === normalizeOptionalLowercaseString(providedSessionBaseKey) && normalizeOptionalLowercaseString(derivedRoute?.sessionKey) !== providedSessionKey;
					const outboundRoute = derivedRoute ? providedSessionKey ? shouldUseDerivedThreadSessionKey ? {
						...derivedRoute,
						baseSessionKey: derivedRoute.baseSessionKey ?? providedSessionKey
					} : {
						...derivedRoute,
						sessionKey: providedSessionKey,
						baseSessionKey: providedSessionKey
					} : derivedRoute : null;
					const outboundSessionKey = outboundRoute?.sessionKey ?? providedSessionKey;
					if (outboundSessionKey) {
						const agentAccessError = authorizeGatewaySessionCreation({
							cfg,
							client,
							agentId: effectiveAgentId
						});
						if (agentAccessError) return {
							ok: false,
							error: agentAccessError,
							meta: { channel }
						};
					}
					if (outboundSessionKey && isAgentHarnessSessionKey(outboundSessionKey)) {
						const { canonicalKey, entry } = loadGatewaySessionEntry(outboundSessionKey);
						const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, entry);
						if (missingHarnessSessionError) return {
							ok: false,
							error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError),
							meta: { channel }
						};
					}
					let outboundRoutePersisted = false;
					const commitOutboundSessionRoute = async () => {
						if (outboundRoutePersisted || !outboundRoute) return;
						outboundRoutePersisted = true;
						await ensureOutboundSessionEntry({
							cfg,
							channel,
							accountId,
							route: outboundRoute,
							creation: resolveSandboxedSessionCreation(client, cfg),
							sourceSessionKey: client?.internal?.agentRuntimeIdentity?.sessionKey
						});
					};
					const outboundSession = buildOutboundSessionContext({
						cfg,
						agentId: effectiveAgentId,
						sessionKey: outboundSessionKey,
						conversationType: outboundRoute?.chatType
					});
					if (!authorize()) return createGatewayInflightAuthorityFailure({
						context,
						dedupeKey,
						channel
					});
					const send = await sendDurableMessageBatchCore({
						cfg,
						channel,
						to: deliveryTarget,
						accountId,
						payloads: outboundPayloads,
						replyToId: replyToId ?? null,
						session: outboundSession,
						gifPlayback: request.gifPlayback,
						forceDocument: request.forceDocument,
						threadId: outboundRoute?.threadId ?? threadId ?? null,
						deps: outboundDeps,
						gatewayClientScopes: client?.connect?.scopes ?? [],
						silent: request.silent,
						formatting: request.parseMode ? { parseMode: request.parseMode } : void 0,
						onDeliveryResult: commitOutboundSessionRoute,
						onPlatformSendDispatch,
						assertDirectAdapterHandoff: commitAgentRuntimeAuthority,
						skipQueue: hasAgentRuntimeAuthority,
						mirror: outboundSessionKey ? {
							sessionKey: outboundSessionKey,
							agentId: effectiveAgentId,
							text: mirrorText || message,
							mediaUrls: mirrorMediaUrls.length > 0 ? mirrorMediaUrls : void 0,
							idempotencyKey: idem
						} : void 0
					});
					if (send.status === "sent" || send.status === "partial_failed") await commitOutboundSessionRoute();
					if (send.status === "failed") throw send.error;
					if (send.status === "partial_failed") throw createChannelPartialDeliveryError(send.error, {
						messageIds: send.results.map((result) => result.messageId),
						receipt: send.receipt,
						visibleReplySent: true
					});
					const result = (send.status === "sent" ? send.results : []).at(-1);
					if (!result) throw new Error("No delivery result");
					return createGatewayInflightSuccess({
						context,
						dedupeKey,
						payload: buildGatewayDeliveryPayload({
							runId: idem,
							channel,
							result
						}),
						channel
					});
				} catch (err) {
					if (isChannelPartialDeliveryError(err)) return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
					if (hasAgentRuntimeAuthority && !agentRuntimeAuthority.hasActive()) return createGatewayInflightAuthorityFailure({
						context,
						dedupeKey,
						channel
					});
					return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
				}
			}
		});
	},
	poll: async ({ params: request, respond, context, client, sessionMutationCommitGuard }) => {
		if (!assertValidParams(request, validatePollParams, "poll", respond)) return;
		const messageAuthority = createMessageActionRuntimeAuthority({
			client,
			context,
			respond,
			sessionMutationCommitGuard,
			request: {
				action: "poll",
				accountId: request.accountId,
				params: {}
			},
			authorization: resolveAgentRuntimeMessageActionAuthorization(client)
		});
		const messageActionConfig = resolveAgentRuntimeMessageActionConfig(client);
		const agentRuntimeAuthority = messageAuthority.agentRuntimeAuthority;
		const hasAgentRuntimeAuthority = client?.internal?.agentRuntimeIdentity !== void 0;
		const commitAgentRuntimeAuthority = agentRuntimeAuthority.commitGuard;
		const onPlatformSendDispatch = commitAgentRuntimeAuthority ? async () => commitAgentRuntimeAuthority() : void 0;
		await withMessageOperationRoute({
			context,
			prefix: "poll",
			idempotencyKey: request.idempotencyKey,
			respond,
			requestChannel: request.channel,
			bindingAccountIds: [request.accountId],
			routeAccountIds: (binding) => [request.accountId, binding?.reservedRoute?.accountId],
			conflictMessage: "poll account selections do not match",
			authorize: agentRuntimeAuthority.hasActive,
			resolveChannel: async (requestChannel) => {
				const resolved = await resolveRequestedChannel({
					requestChannel,
					unsupportedMessage: (input) => `unsupported poll channel: ${input}`,
					context,
					config: messageActionConfig
				});
				if ("error" in resolved) {
					respond(false, void 0, resolved.error);
					return;
				}
				const { cfg, channel } = resolved;
				const plugin = resolveOutboundChannelPlugin({
					channel,
					cfg
				});
				const outbound = plugin?.outbound;
				if (typeof request.durationSeconds === "number" && outbound?.supportsPollDurationSeconds !== true) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `durationSeconds is not supported for ${channel} polls`));
					return;
				}
				if (typeof request.isAnonymous === "boolean" && outbound?.supportsAnonymousPolls !== true) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `isAnonymous is not supported for ${channel} polls`));
					return;
				}
				if (!plugin || !outbound?.sendPoll) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported poll channel: ${channel}`));
					return;
				}
				return {
					cfg,
					channel,
					plugin,
					outbound,
					sendPoll: outbound.sendPoll
				};
			},
			work: async ({ cfg, channel, accountId, idem, dedupeKey, authorize, outbound, sendPoll }) => {
				const poll = {
					question: request.question,
					options: request.options,
					maxSelections: request.maxSelections,
					durationSeconds: request.durationSeconds,
					durationHours: request.durationHours
				};
				const threadId = normalizeOptionalString(request.threadId);
				try {
					const resolvedTarget = resolveGatewayOutboundTarget({
						channel,
						to: request.to.trim(),
						cfg,
						accountId
					});
					if (!resolvedTarget.ok) return {
						ok: false,
						error: resolvedTarget.error
					};
					const normalized = outbound.pollMaxOptions ? normalizePollInput(poll, { maxOptions: outbound.pollMaxOptions }) : normalizePollInput(poll);
					if (!authorize()) return createGatewayInflightAuthorityFailure({
						context,
						dedupeKey,
						channel
					});
					return createGatewayInflightSuccess({
						context,
						dedupeKey,
						payload: buildGatewayDeliveryPayload({
							runId: idem,
							channel,
							result: await sendPoll({
								cfg,
								to: resolvedTarget.to,
								poll: normalized,
								accountId,
								threadId,
								silent: request.silent,
								isAnonymous: request.isAnonymous,
								gatewayClientScopes: client?.connect?.scopes ?? [],
								onPlatformSendDispatch,
								assertDirectAdapterHandoff: commitAgentRuntimeAuthority
							})
						}),
						channel
					});
				} catch (err) {
					if (isChannelPartialDeliveryError(err)) return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
					if (hasAgentRuntimeAuthority && !agentRuntimeAuthority.hasActive()) return createGatewayInflightAuthorityFailure({
						context,
						dedupeKey,
						channel
					});
					return createGatewayInflightUnavailableFailure({
						context,
						dedupeKey,
						channel,
						err
					});
				}
			}
		});
	}
};
//#endregion
export { sendHandlers };
