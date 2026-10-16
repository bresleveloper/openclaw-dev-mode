import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, M as parseAgentSessionKey, O as parseThreadSessionSuffix } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, w as selectApplicableRuntimeConfig } from "./runtime-snapshot-DYptB0Cf.mjs";
import "./operator-scopes-DsrPoRc4.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { Hr as validateSendParams, fr as validatePollParams, vn as validateMessageActionParams } from "./src-l2dWvEsN.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { a as isAgentHarnessSessionKey, m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as DEDUPE_MAX } from "./server-constants-BH_EolwD.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { n as OutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-CyorchNP.mjs";
import { r as maybeResolvePluginMessagingTarget } from "./target-normalization-CUrXIAtg.mjs";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-RF8yW6z7.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-D6JiS64U.mjs";
import { n as resolveAgentScopedOutboundMediaAccess } from "./read-capability-BtubP49K.mjs";
import { o as OutboundHandoffRejectedError } from "./delivery-queue-reconciliation-CMzHkur3.mjs";
import { c as selectMessageActionRequesterIdentity, i as resolveMessageActionTurnAuthorization, r as readMessageActionInvocationConfig } from "./message-action-turn-capability-BbHQ1t6i.mjs";
import { t as buildOutboundSessionContext } from "./session-context-Kov7ff_A.mjs";
import { n as sendDurableMessageBatchCore } from "./send-BOL6c5DR.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DMBKJyb_.mjs";
import { d as isChannelPartialDeliveryError, u as createChannelPartialDeliveryError } from "./live-TWzvpgza.mjs";
import "./runtime-D_39_b__.mjs";
import { n as resolveChannelThreadAddressing } from "./thread-addressing-BlOSfiVQ.mjs";
import { n as readInProcessSessionDeliveryGeneration } from "./in-process-session-delivery-CX7--QA6.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { n as normalizePollInput } from "./polls-C-v11_tu.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-CUk3wUGA.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-B3dNeoAP.mjs";
import { a as resolveOutboundSessionRoute, r as ensureOutboundSessionEntry } from "./outbound-session-BzsWVtaq.mjs";
import { a as resolveOutboundTarget } from "./targets-CO7mQVz4.mjs";
import { _ as isFencedProviderReadAction, c as hydrateAttachmentParamsForAction, g as dispatchChannelMessageAction, n as resolveImplicitMessageActionTarget, p as resolveAttachmentMediaPolicy, r as actionHasTarget, v as isScheduledMessageWriteAction } from "./message-action-normalization-CWJw11Q5.mjs";
import { t as extractToolPayload } from "./tool-payload-DZFNUv-K.mjs";
import { a as mirrorDeliveredSourceReplyToTranscript, n as cancelTerminalSourceReplyDelivery, o as reconcileTerminalSourceReplyDelivery, t as beginTerminalSourceReplyDelivery } from "./source-reply-mirror-Cq35K4yN.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import "./deps-BPCWhUW0.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as resolveSandboxedSessionCreation } from "./operator-session-run-D_EW5pyV.mjs";
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
	const assertDeliveryCurrent = !isFencedProviderReadAction(params.request.action) ? params.authorization?.deliveryAttempt?.assertCurrent : void 0;
	const scheduledPolicy = assertReadCurrent || assertScheduledWriteCurrent ? params.authorization?.scheduled?.policy : void 0;
	const agentRuntimeAuthority = createAgentRuntimeAuthorityGuard(params.client, params.context, params.respond, assertActionCurrent || assertDeliveryCurrent ? () => {
		params.sessionMutationCommitGuard?.();
		assertActionCurrent?.();
		assertDeliveryCurrent?.();
	} : params.sessionMutationCommitGuard);
	const assertDirectAdapterHandoff = params.assertClientUploadAllowed ? () => {
		agentRuntimeAuthority.commitGuard?.();
		params.assertClientUploadAllowed?.();
	} : agentRuntimeAuthority.commitGuard;
	const beforeDeliveryAttempt = () => isFencedProviderReadAction(params.request.action) ? void 0 : params.authorization?.deliveryAttempt?.beforeAttempt();
	return {
		assertReadCurrent,
		assertScheduledWriteCurrent,
		beforeDeliveryAttempt,
		onPlatformSendDispatch: assertDirectAdapterHandoff ? async () => assertDirectAdapterHandoff() : void 0,
		routeAccountId: normalizeOptionalString(params.request.accountId) ?? normalizeOptionalString(params.request.params.accountId) ?? (scheduledPolicy?.mode === "account" ? scheduledPolicy.ownerAccountId : void 0),
		agentRuntimeAuthority,
		assertDirectAdapterHandoff
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
	const unsentError = params.err instanceof OutboundDeliveryError && !params.err.sentBeforeError && params.err.queueCustody !== "held" ? params.err.cause : params.err;
	const authorizationError = unsentError instanceof OutboundHandoffRejectedError ? unsentError.cause : unsentError;
	if (authorizationError instanceof SessionMutationAuthorizationChangedError) return createGatewayInflightResult({
		...params,
		result: {
			ok: false,
			error: authorizationError.error
		}
	});
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
function scheduleDeliveredSourceReplyTranscriptMirror(params) {
	const queueKey = params.mirror.sessionKey?.trim() || "__global__";
	return sourceReplyTranscriptMirrorQueue.enqueue(queueKey, () => mirrorDeliveredSourceReplyToTranscriptBestEffort(params));
}
//#endregion
//#region src/gateway/server-methods/send-account-route.ts
async function resolveMessageOperationAccountRoute(params) {
	const accountIds = /* @__PURE__ */ new Set();
	for (const requestedAccountId of params.accountIds) {
		const accountId = await validateExplicitMessageAccountSelection({
			cfg: params.cfg,
			channel: params.channel,
			accountId: requestedAccountId,
			plugin: params.plugin
		});
		if (accountId !== void 0) accountIds.add(accountId);
	}
	if (accountIds.size > 1) throw new Error(params.conflictMessage);
	const accountId = accountIds.values().next().value;
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
//#endregion
//#region src/gateway/server-methods/message-operation-route.ts
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
	const acquired = createDeferredCore();
	const held = createDeferredCore();
	getMessageOperationRouteBindingQueue(params.context).enqueue(params.binding.key, async () => {
		acquired.resolve();
		await held.promise;
	});
	await acquired.promise;
	return held.resolve;
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
		reservedRoute: getMessageOperationRouteBindings(params.context).get(key)?.route
	};
}
/** Validate under the route lock; publish only for accepted replay or newly admitted input. */
function prepareMessageOperationRouteBinding(params) {
	const binding = params.binding;
	if (!binding) return () => void 0;
	const bindings = getMessageOperationRouteBindings(params.context);
	const existing = bindings.get(binding.key);
	if (existing && existing.route.requestScope !== params.route.requestScope) return;
	return () => {
		bindings.set(binding.key, existing ? {
			...existing,
			ts: Date.now()
		} : {
			ts: Date.now(),
			route: params.route,
			retainUntilSettled: false
		});
		pruneMessageOperationRouteBindings(bindings, Date.now());
	};
}
function updateMessageOperationRouteBinding(params) {
	if (!params.binding) return;
	const bindings = getMessageOperationRouteBindings(params.context);
	const existing = bindings.get(params.binding.key);
	if (existing?.route.requestScope === params.requestScope) {
		bindings.set(params.binding.key, {
			...existing,
			...!params.retainUntilSettled ? { ts: Date.now() } : {},
			retainUntilSettled: params.retainUntilSettled
		});
		if (!params.retainUntilSettled) pruneMessageOperationRouteBindings(bindings, Date.now());
	}
}
async function withMessageOperationRoute(params) {
	if (params.replayResults === false) {
		const resolved = await params.resolveChannel(params.requestChannel);
		if (!resolved) return;
		try {
			const accountRoute = await resolveMessageOperationAccountRoute({
				...resolved,
				accountIds: params.routeAccountIds(void 0),
				conflictMessage: params.conflictMessage
			});
			const authorize = params.authorize ?? (() => true);
			const assertCurrent = () => {
				if (!authorize()) throw new Error("agent runtime authority is no longer active");
			};
			assertCurrent();
			params.assertNewInputAllowed?.();
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
			respondMessageOperationAdmissionError({
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
		const reservedReplay = binding?.reservedRoute ? resolveGatewayInflightRequest({
			context: params.context,
			prefix: params.prefix,
			idempotencyKey: params.idempotencyKey,
			respond: params.respond,
			conversationReadOrigin: params.conversationReadOrigin,
			operation: params.operation,
			requestScope: binding.reservedRoute.requestScope
		}) : void 0;
		if (reservedReplay?.kind === "handled") {
			releaseLock();
			await reservedReplay.done;
			return;
		}
		const resolved = await params.resolveChannel(binding?.reservedRoute?.channel ?? params.requestChannel);
		if (!resolved) return;
		let accountRoute;
		try {
			accountRoute = await resolveMessageOperationAccountRoute({
				...resolved,
				accountIds: params.routeAccountIds(binding),
				conflictMessage: params.conflictMessage
			});
		} catch (error) {
			respondMessageOperationAdmissionError({
				respond: params.respond,
				channel: resolved.channel,
				error
			});
			return;
		}
		const publishBinding = prepareMessageOperationRouteBinding({
			context: params.context,
			binding,
			route: {
				channel: resolved.channel,
				accountId: accountRoute.effectiveAccountId,
				requestScope: accountRoute.requestScope
			}
		});
		if (!publishBinding) {
			respondMessageOperationAdmissionError({
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
			publishBinding();
			releaseLock();
			await inflight.done;
			return;
		}
		if (params.authorize && !params.authorize()) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
			return;
		}
		try {
			params.assertNewInputAllowed?.();
		} catch (error) {
			respondMessageOperationAdmissionError({
				respond: params.respond,
				channel: resolved.channel,
				error
			});
			return;
		}
		publishBinding();
		updateMessageOperationRouteBinding({
			context: params.context,
			binding,
			requestScope: accountRoute.requestScope,
			retainUntilSettled: true
		});
		const work = params.work({
			...resolved,
			accountId: accountRoute.accountId,
			idem: inflight.idem,
			dedupeKey: inflight.dedupeKey,
			authorize: params.authorize ?? (() => true)
		}).finally(() => {
			updateMessageOperationRouteBinding({
				context: params.context,
				binding,
				requestScope: accountRoute.requestScope,
				retainUntilSettled: false
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
function respondMessageOperationAdmissionError(params) {
	const error = params.error instanceof SessionMutationAuthorizationChangedError ? params.error.error : errorShape(ErrorCodes.INVALID_REQUEST, String(params.error));
	params.respond(false, void 0, error, {
		channel: params.channel,
		error: formatForLog(params.error)
	});
}
//#endregion
//#region src/gateway/server-methods/send-channel-resolution.ts
async function resolveRequestedChannel(params) {
	const channelInput = readStringValue(params.requestChannel);
	const normalizedChannel = channelInput ? normalizeMessageChannel(channelInput) : void 0;
	if (params.rejectWebchatAsInternalOnly && normalizedChannel === "webchat") return { error: errorShape(ErrorCodes.INVALID_REQUEST, "unsupported channel: webchat (internal-only). Use `chat.send` for WebChat UI messages or choose a deliverable channel.") };
	if (channelInput && !normalizedChannel) return { error: errorShape(ErrorCodes.INVALID_REQUEST, params.unsupportedMessage(channelInput)) };
	const cfg = params.config ?? params.context.getRuntimeConfig();
	let channel = normalizedChannel;
	if (!channel) try {
		channel = (await resolveMessageChannelSelection({ cfg })).channel;
	} catch (err) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(err)) };
	}
	return {
		cfg,
		channel
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
function resolveMessageActionRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
//#endregion
//#region src/gateway/server-methods/send.ts
const sendHandlers = {
	"message.action": async ({ params: request, respond, context, client, sessionMutationCommitGuard }) => {
		if (!assertValidParams(request, validateMessageActionParams, "message.action", respond)) return;
		const assertClientUploadAllowed = captureGatewayClientUploadCommitGuard({
			method: "message.action",
			requestParams: request,
			client,
			context
		});
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
			authorization: trustedContext.messageActionAuthorization,
			assertClientUploadAllowed
		});
		const assertDirectAdapterHandoff = messageAuthority.assertDirectAdapterHandoff;
		const onPlatformSendDispatch = messageAuthority.onPlatformSendDispatch;
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
			assertNewInputAllowed: assertClientUploadAllowed,
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
				const { cfg: selectedCfg, channel } = resolved;
				const cfg = trustedContext.messageActionConfig ?? resolveMessageActionRuntimeConfig(selectedCfg);
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
						const sessionKey = normalizeOptionalString(request.sessionKey);
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
							assertClientUploadAllowed,
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
							sessionId: normalizeOptionalString(request.sessionId),
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
								const { runMessageAction } = await import("./message-action-runner-DTiZg3h5.mjs");
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
								await messageAuthority.beforeDeliveryAttempt();
								assertDirectAdapterHandoff?.();
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
					if (!isChannelPartialDeliveryError(err) && !authorize()) return createGatewayInflightAuthorityFailure({
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
		const assertClientUploadAllowed = captureGatewayClientUploadCommitGuard({
			method: "send",
			requestParams: request,
			client,
			context
		});
		const sessionGeneration = readInProcessSessionDeliveryGeneration(request);
		const to = normalizeOptionalString(request.to) ?? "";
		const message = request.message?.trim() ? request.message : "";
		const mediaUrl = normalizeOptionalString(request.mediaUrl);
		const mediaUrls = normalizeArrayBackedTrimmedStringList(request.mediaUrls);
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
		const messageAuthority = createMessageActionRuntimeAuthority({
			client,
			context,
			respond,
			sessionMutationCommitGuard,
			request: {
				action: "send",
				accountId: request.accountId,
				params: {}
			},
			authorization: messageActionAuthorization,
			assertClientUploadAllowed
		});
		const agentRuntimeAuthority = messageAuthority.agentRuntimeAuthority;
		const hasAgentRuntimeAuthority = client?.internal?.agentRuntimeIdentity !== void 0;
		const commitAgentRuntimeAuthority = messageAuthority.assertDirectAdapterHandoff;
		const onPlatformSendDispatch = messageAuthority.onPlatformSendDispatch;
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
			assertNewInputAllowed: assertClientUploadAllowed,
			resolveChannel: async (requestChannel) => {
				const resolved = await resolveRequestedChannel({
					requestChannel,
					unsupportedMessage: (input) => `unsupported channel: ${input}`,
					context,
					config: messageActionConfig,
					rejectWebchatAsInternalOnly: true
				});
				if ("error" in resolved) {
					respond(false, void 0, resolved.error, void 0);
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
					const idLikeTarget = await withChannelReadAuthority(messageActionAuthorization?.scheduled ? commitAgentRuntimeAuthority : void 0, () => maybeResolvePluginMessagingTarget({
						cfg,
						channel,
						input: resolvedTarget.to,
						accountId,
						requireIdLike: true
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
					const effectiveAgentId = explicitAgentId ?? sessionAgentId ?? implicitAgent?.agentId;
					if (!effectiveAgentId) return {
						ok: false,
						error: errorShape(ErrorCodes.INVALID_REQUEST, "agent selection is required"),
						meta: { channel }
					};
					const sendArgs = {
						mediaUrl,
						mediaUrls,
						buffer,
						filename: normalizeOptionalString(request.filename),
						contentType: normalizeOptionalString(request.contentType)
					};
					await hydrateAttachmentParamsForAction({
						cfg,
						channel,
						accountId,
						args: sendArgs,
						action: "send",
						assertClientUploadAllowed,
						mediaPolicy: resolveAttachmentMediaPolicy({ mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, effectiveAgentId) })
					});
					const hydratedMediaUrl = normalizeOptionalString(sendArgs.mediaUrl);
					const hydratedMediaUrls = normalizeArrayBackedTrimmedStringList(sendArgs.mediaUrls);
					const outboundDeps = context.deps ? createOutboundSendDeps(context.deps) : void 0;
					const outboundPayloads = [{
						text: message,
						mediaUrl: hydratedMediaUrl,
						mediaUrls: hydratedMediaUrls,
						...request.asVoice === true ? { audioAsVoice: true } : {}
					}];
					const outboundPayloadPlan = createOutboundPayloadPlan(outboundPayloads);
					const { text: mirrorText, mediaUrls: mirrorMediaUrls } = projectOutboundPayloadPlanForMirror(outboundPayloadPlan);
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
					await messageAuthority.beforeDeliveryAttempt();
					commitAgentRuntimeAuthority?.();
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
						...sessionGeneration ? {
							deliveryIntentId: idem,
							reusePendingDeliveryIntent: true,
							durability: "required"
						} : {},
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
					}, void 0, void 0, sessionGeneration);
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
					if (!isChannelPartialDeliveryError(err) && hasAgentRuntimeAuthority && !agentRuntimeAuthority.hasActive()) return createGatewayInflightAuthorityFailure({
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
		const commitAgentRuntimeAuthority = messageAuthority.assertDirectAdapterHandoff;
		const onPlatformSendDispatch = messageAuthority.onPlatformSendDispatch;
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
					await messageAuthority.beforeDeliveryAttempt();
					commitAgentRuntimeAuthority?.();
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
					if (!isChannelPartialDeliveryError(err) && hasAgentRuntimeAuthority && !agentRuntimeAuthority.hasActive()) return createGatewayInflightAuthorityFailure({
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
