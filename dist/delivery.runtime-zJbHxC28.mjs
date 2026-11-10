import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { o as writeRuntimeJson, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import "./errors-DPfGDWk1.mjs";
import { l as prepareSessionSourceScope, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { o as copyReplyPayloadMetadata, s as formatBtwTextForExternalDelivery } from "./reply-payload-BLX_BF2U.mjs";
import { t as CommandOwnerRevokedError } from "./command-owner-authority-DGt-GTro.mjs";
import "./plugins-CCVkYF8m.mjs";
import { s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import { a as projectOutboundPayloadPlanForDelivery, c as projectOutboundPayloadPlanForOutbound, o as projectOutboundPayloadPlanForJson, r as formatOutboundPayloadLog, t as createOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { a as resolveResponsePrefixTemplate, r as normalizeReplyPayloadOutcome } from "./normalize-reply-Bw7WQh_g.mjs";
import { l as resolvePendingFinalDeliveryCompletion, n as sendDurableMessageBatchCore } from "./send-Ccg5tbzy.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import "./runtime-DV2_kfTG.mjs";
import { n as isNestedAgentLane } from "./lanes-BJoXx6GG.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-CXErM5gk.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-Cd0oOG4L.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-D2GvoKZ-.mjs";
import { n as normalizeSentMediaUrlsForDelivery } from "./delivery-evidence-values-CSe-71lq.mjs";
import { i as resolveMessagingToolPayloadDedupe, r as hasEnabledDeliveryOperation, t as filterMessagingToolMediaDuplicates } from "./reply-payloads-dedupe-BrUO_MCX.mjs";
import { r as createReplyMediaPathNormalizer } from "./reply-media-paths-y_fVmvUY.mjs";
import { t as createReplyPrefixContext } from "./reply-prefix-CIrEJZ7n.mjs";
import { t as resolveAgentOutboundIdentity } from "./identity-vjAGrTvy.mjs";
import { r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlanWithSessionRoute } from "./agent-delivery-DbfbUO7k.mjs";
import { a as selectSourceDeliverablePayloads, i as preDeliveryFailureStatus, n as deliveryStatusFromDurableSend, r as noVisiblePayloadStatus, t as buildDeliveryResult } from "./delivery-result-2UZHQJ-q.mjs";
//#region src/agents/command/delivery-authority.ts
function createRestartOnlyAbortSignal(source) {
	if (!source) return { dispose: () => {} };
	const controller = new AbortController();
	const onAbort = () => {
		if (isAgentRunRestartAbortReason(source.reason)) controller.abort(source.reason);
	};
	if (source.aborted) onAbort();
	else source.addEventListener("abort", onAbort, { once: true });
	return {
		signal: controller.signal,
		dispose: () => source.removeEventListener("abort", onAbort)
	};
}
function createAgentCommandDeliveryGuard(params, completion) {
	let prepared;
	const release = async () => {
		const previous = prepared;
		prepared = void 0;
		if (previous) await releaseSessionSourceAuthorities([previous]);
	};
	const rethrowDeliveryError = (error) => {
		const retryable = isAgentRunRestartAbortReason(error) || isAgentRunRestartAbortReason(params.opts.abortSignal?.reason) && completion?.commandOwnerReference != null && (error instanceof CommandOwnerRevokedError || isSessionWorkStartInvalidatedError(error) && error.code === "SESSION_WORK_START_INVALIDATED");
		throw new PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Agent final delivery source check failed", {
			cause: error,
			retryable
		});
	};
	const assertCurrent = () => {
		try {
			if (prepared) prepared.assertCurrent();
			else params.assertDeliveryCurrent?.();
		} catch (error) {
			rethrowDeliveryError(error);
		}
	};
	return Object.assign(assertCurrent, {
		prepare: async () => {
			await release();
			try {
				prepared = await prepareSessionSourceScope(params.assertDeliveryCurrent);
			} catch (error) {
				rethrowDeliveryError(error);
			}
			assertCurrent();
		},
		release
	});
}
//#endregion
//#region src/agents/command/delivery.ts
function isFreshDeliverySessionMatch(freshSessionEntry, expectedSessionId) {
	const normalizedExpected = expectedSessionId?.trim();
	return Boolean(normalizedExpected && freshSessionEntry.sessionId === normalizedExpected);
}
async function normalizeReplyMediaPathsForDelivery(params) {
	if (params.payloads.length === 0) return { payloads: params.payloads };
	const agentId = params.outboundSession?.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const workspaceDir = agentId ? resolveAgentWorkspaceDir(params.cfg, agentId) : void 0;
	if (!workspaceDir) return { payloads: params.payloads };
	const normalizeMediaPaths = createReplyMediaPathNormalizer({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId,
		workspaceDir,
		messageProvider: params.deliveryChannel,
		accountId: params.accountId
	});
	const result = [];
	for (const payload of params.payloads) result.push(await normalizeMediaPaths(payload));
	return {
		payloads: result,
		normalizeMediaPaths
	};
}
const UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
async function filterAlreadyDeliveredReplyPayloads(params) {
	const sentTexts = params.result.messagingToolSentTexts ?? [];
	const sentMediaUrls = params.result.messagingToolSentMediaUrls ?? [];
	const implicitToolAccountId = params.sourceAccountId ?? params.defaultAccountId;
	const sentTargets = (params.result.messagingToolSentTargets ?? []).flatMap((target) => {
		if (target.accountId || !params.accountId) return [target];
		return implicitToolAccountId ? [{
			...target,
			accountId: implicitToolAccountId
		}] : [];
	});
	if (sentTexts.length === 0 && sentMediaUrls.length === 0 && sentTargets.length === 0) return params.payloads;
	const decision = resolveMessagingToolPayloadDedupe({
		config: params.cfg,
		messageProvider: params.deliveryChannel,
		messagingToolSentTargets: sentTargets,
		originatingTo: params.deliveryTarget,
		originatingThreadId: params.threadId,
		accountId: params.accountId
	});
	if (!decision.matchingRoute) return params.payloads;
	const routeSentMediaUrls = decision.useGlobalSentMediaUrlEvidenceFallback ? sentMediaUrls : decision.routeSentMediaUrls;
	const rawRouteSentTexts = decision.useGlobalSentTextEvidenceFallback ? sentTexts : decision.routeSentTexts;
	const routeSentTexts = params.normalizeSentTexts?.(rawRouteSentTexts) ?? rawRouteSentTexts;
	const exactRouteSentTexts = new Set(routeSentTexts.filter((text) => Boolean(text.trim())));
	const normalizedSentMediaUrls = await normalizeSentMediaUrlsForDelivery({
		sentMediaUrls: routeSentMediaUrls,
		normalizeMediaPaths: params.normalizeMediaPaths
	});
	return filterMessagingToolMediaDuplicates({
		payloads: params.payloads,
		sentMediaUrls: normalizedSentMediaUrls
	}).flatMap((candidate) => {
		if (hasEnabledDeliveryOperation(candidate)) return [candidate];
		const effectiveCandidateText = formatBtwTextForExternalDelivery(candidate) ?? candidate.text ?? "";
		if (!effectiveCandidateText.trim() || !exactRouteSentTexts.has(effectiveCandidateText)) return [candidate];
		const withoutDuplicateText = copyReplyPayloadMetadata(candidate, {
			...candidate,
			text: void 0
		});
		return hasReplyPayloadContent(withoutDuplicateText, {
			trimText: true,
			extraContent: withoutDuplicateText.location != null
		}) ? [withoutDuplicateText] : [];
	});
}
function normalizeAgentCommandReplyPayloads(params) {
	const payloads = params.payloads ?? [];
	if (payloads.length === 0) return {
		kind: "suppress",
		reason: "empty"
	};
	const channel = params.deliveryChannel && !isInternalMessageChannel(params.deliveryChannel) ? normalizeAnyChannelId(params.deliveryChannel) ?? params.deliveryChannel : void 0;
	if (!channel) return {
		kind: "deliver",
		payload: payloads
	};
	const applyChannelTransforms = params.applyChannelTransforms ?? true;
	const deliveryPlugin = applyChannelTransforms ? params.plugin : void 0;
	const sessionKey = params.outboundSession?.key ?? params.opts.sessionKey;
	const agentId = params.outboundSession?.agentId ?? resolveSessionAgentId({
		sessionKey,
		config: params.cfg
	});
	const replyPrefix = createReplyPrefixContext({
		cfg: params.cfg,
		agentId,
		channel,
		accountId: params.accountId
	});
	const modelUsed = params.result.meta.agentMeta?.model;
	const providerUsed = params.result.meta.agentMeta?.provider;
	if (params.includeRunModelContext !== false && providerUsed && modelUsed) replyPrefix.onModelSelected({
		provider: providerUsed,
		model: modelUsed,
		thinkLevel: void 0
	});
	const responsePrefixContext = replyPrefix.responsePrefixContextProvider();
	const resolvedResponsePrefix = resolveResponsePrefixTemplate(replyPrefix.responsePrefix, responsePrefixContext);
	const responsePrefix = params.includeRunModelContext === false && resolvedResponsePrefix && UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN.test(resolvedResponsePrefix) ? void 0 : replyPrefix.responsePrefix;
	const deliveryMessaging = deliveryPlugin?.messaging;
	const transformReplyPayload = createChannelReplyTransform({
		messaging: deliveryMessaging,
		cfg: params.cfg,
		accountId: params.accountId
	});
	const normalizedPayloads = [];
	let suppressionReason;
	for (const payload of payloads) {
		const outcome = normalizeReplyPayloadOutcome(payload, {
			responsePrefix,
			applyChannelTransforms,
			responsePrefixContext,
			transformReplyPayload
		});
		if (outcome.kind === "deliver") normalizedPayloads.push(outcome.payload);
		else if (suppressionReason === void 0 || outcome.reason === "channel_transform") suppressionReason = outcome.reason;
	}
	return normalizedPayloads.length > 0 ? {
		kind: "deliver",
		payload: normalizedPayloads
	} : {
		kind: "suppress",
		reason: suppressionReason ?? "empty"
	};
}
async function deliverAgentCommandResult(params) {
	params.assertDeliveryCurrent?.();
	const { cfg, deps, runtime, opts, outboundSession, sessionEntry, result } = params;
	const effectiveSessionKey = outboundSession?.key ?? opts.sessionKey;
	const deliveryAgentId = outboundSession?.agentId ?? resolveSessionAgentId({
		sessionKey: effectiveSessionKey,
		config: cfg
	}) ?? resolveDefaultAgentId(cfg);
	const deliveryRequested = opts.deliver === true;
	const sourcePayloads = deliveryRequested && params.payloads ? selectSourceDeliverablePayloads(params.payloads, opts) : params.payloads;
	const suppressAutomaticDelivery = deliveryRequested && opts.sourceReplyDeliveryMode === "message_tool_only" && !sourcePayloads?.length;
	const payloads = suppressAutomaticDelivery ? params.payloads : sourcePayloads;
	const deliver = deliveryRequested && !suppressAutomaticDelivery;
	const bestEffortDeliver = opts.bestEffortDeliver === true;
	const turnSourceChannel = opts.runContext?.messageChannel ?? opts.messageChannel;
	const turnSourceTo = opts.runContext?.currentChannelId ?? opts.to;
	const turnSourceAccountId = opts.runContext?.accountId ?? opts.accountId;
	const turnSourceThreadId = opts.runContext?.currentThreadTs ?? opts.threadId;
	const explicitChannelHint = (opts.replyChannel ?? opts.channel)?.trim();
	const resolveDeliveryRouting = async (candidateSessionEntry) => {
		const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
			cfg,
			agentId: deliveryAgentId,
			currentSessionKey: effectiveSessionKey,
			sessionEntry: candidateSessionEntry,
			requestedChannel: opts.replyChannel ?? opts.channel,
			explicitTo: opts.replyTo ?? opts.to,
			explicitThreadId: opts.threadId,
			accountId: opts.replyAccountId ?? opts.accountId,
			wantsDelivery: deliver,
			preparedPlugin: params.preparedPlugin,
			turnSourceChannel,
			turnSourceTo,
			turnSourceAccountId,
			turnSourceThreadId
		});
		params.assertDeliveryCurrent?.();
		let deliveryChannel = deliveryPlan.resolvedChannel;
		let preparedPlugin = deliveryPlan.plugin;
		if (deliver && isInternalMessageChannel(deliveryChannel) && !explicitChannelHint) try {
			const selection = await resolveMessageChannelSelection({ cfg });
			params.assertDeliveryCurrent?.();
			deliveryChannel = selection.channel;
			preparedPlugin = selection.plugin;
		} catch {}
		const deliveryPlugin = deliver && !isInternalMessageChannel(deliveryChannel) ? preparedPlugin ?? getChannelPlugin(normalizeAnyChannelId(deliveryChannel) ?? deliveryChannel) : void 0;
		const isDeliveryChannelKnown = isInternalMessageChannel(deliveryChannel) || Boolean(deliveryPlugin);
		const targetMode = opts.deliveryTargetMode ?? deliveryPlan.deliveryTargetMode ?? (opts.to ? "explicit" : "implicit");
		const defaultAccountId = !deliveryPlan.resolvedAccountId && deliveryPlugin?.config?.listAccountIds ? resolveChannelDefaultAccountId({
			plugin: deliveryPlugin,
			cfg
		}) : void 0;
		const resolvedAccountId = deliveryPlan.resolvedAccountId ?? defaultAccountId;
		const resolved = deliver && isDeliveryChannelKnown && deliveryChannel ? await resolveAgentOutboundTarget({
			cfg,
			plan: {
				...deliveryPlan,
				resolvedChannel: deliveryChannel,
				plugin: deliveryPlugin ?? preparedPlugin,
				resolvedAccountId
			},
			targetMode,
			validateExplicitTarget: true
		}) : {
			resolvedTarget: null,
			resolvedTo: deliveryPlan.resolvedTo,
			targetMode
		};
		const resolvedThreadId = deliveryPlan.resolvedThreadId ?? opts.threadId;
		const replyTransport = deliveryPlugin?.threading?.resolveReplyTransport?.({
			cfg,
			accountId: resolvedAccountId,
			threadId: resolvedThreadId
		}) ?? null;
		return {
			deliveryChannel,
			deliveryPlugin,
			isDeliveryChannelKnown,
			defaultAccountId,
			resolvedAccountId,
			resolvedTarget: resolved.resolvedTarget,
			deliveryTarget: resolved.resolvedTo,
			resolvedReplyToId: replyTransport?.replyToId ?? void 0,
			resolvedThreadTarget: replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId ?? null : resolvedThreadId ?? null
		};
	};
	const deliveryRoutingFailureReason = (route) => {
		if (!deliver) return;
		if (isInternalMessageChannel(route.deliveryChannel)) return "channel_resolved_to_internal";
		if (!route.isDeliveryChannelKnown) return "unknown_channel";
		if (route.resolvedTarget && !route.resolvedTarget.ok) return "invalid_delivery_target";
		if (!route.deliveryTarget) return "no_delivery_target";
	};
	let deliveryRouting = await resolveDeliveryRouting(sessionEntry);
	params.assertDeliveryCurrent?.();
	const routingFailure = deliveryRoutingFailureReason(deliveryRouting);
	if (routingFailure && routingFailure !== "unknown_channel") {
		const freshSessionEntry = await params.resolveFreshSessionEntryForDelivery?.();
		params.assertDeliveryCurrent?.();
		const expectedFreshSessionId = params.expectedSessionIdForFreshDelivery ?? sessionEntry?.sessionId;
		if (freshSessionEntry && freshSessionEntry !== sessionEntry && isFreshDeliverySessionMatch(freshSessionEntry, expectedFreshSessionId)) {
			const freshRouting = await resolveDeliveryRouting(freshSessionEntry);
			params.assertDeliveryCurrent?.();
			if (!deliveryRoutingFailureReason(freshRouting)) {
				if (!opts.json) runtime.log(`[delivery] refreshed session routing before final delivery (session=${effectiveSessionKey ?? "unknown"} channel=${freshRouting.deliveryChannel})`);
				deliveryRouting = freshRouting;
			}
		}
	}
	const { deliveryChannel, isDeliveryChannelKnown, defaultAccountId, resolvedAccountId, resolvedTarget, deliveryTarget, resolvedReplyToId, resolvedThreadTarget, deliveryPlugin } = deliveryRouting;
	let deliveryLoggedError = false;
	const logDeliveryError = (err) => {
		deliveryLoggedError = true;
		const message = `Delivery failed (${deliveryChannel}${deliveryTarget ? ` to ${deliveryTarget}` : ""}): ${String(err)}`;
		runtime.error(message);
	};
	let strictPreDeliveryError;
	let deliveryStatus;
	const handlePreDeliveryError = (err, reason) => {
		deliveryStatus = preDeliveryFailureStatus(reason);
		if (!bestEffortDeliver) {
			if (opts.json) {
				strictPreDeliveryError = err;
				return;
			}
			throw err;
		}
		logDeliveryError(err);
	};
	if (deliver) {
		if (isInternalMessageChannel(deliveryChannel)) handlePreDeliveryError(/* @__PURE__ */ new Error("delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel"), "channel_resolved_to_internal");
		else if (!isDeliveryChannelKnown) handlePreDeliveryError(new Error(formatUnknownChannelMessage({ channel: deliveryChannel })), "unknown_channel");
		else if (resolvedTarget && !resolvedTarget.ok) handlePreDeliveryError(resolvedTarget.error, "invalid_delivery_target");
	}
	const normalizeReplyPayloads = (replyPayloads, includeRunModelContext = true) => normalizeAgentCommandReplyPayloads({
		cfg,
		opts,
		outboundSession,
		payloads: replyPayloads,
		result,
		deliveryChannel,
		plugin: deliveryPlugin,
		accountId: resolvedAccountId,
		applyChannelTransforms: deliver,
		includeRunModelContext
	});
	const replyNormalization = normalizeReplyPayloads(payloads);
	const normalizedReplyPayloads = replyNormalization.kind === "deliver" ? replyNormalization.payload : [];
	const canonicalReplyPayloads = projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan(normalizedReplyPayloads));
	const shouldFilterDeliveredPayloads = deliver && !deliveryStatus && Boolean(deliveryTarget) && !isInternalMessageChannel(deliveryChannel);
	const normalizeSentTexts = (sentTexts) => {
		const outcome = normalizeReplyPayloads(sentTexts.map((text) => ({ text })), false);
		return (outcome.kind === "deliver" ? outcome.payload : []).flatMap((payload) => payload.text?.trim() ? [payload.text] : []);
	};
	const filterDeliveredPayloads = (replyPayloads, normalizeMediaPaths) => {
		if (!shouldFilterDeliveredPayloads || !deliveryTarget) return Promise.resolve(replyPayloads);
		return filterAlreadyDeliveredReplyPayloads({
			cfg,
			payloads: replyPayloads,
			result,
			deliveryChannel,
			deliveryTarget,
			accountId: resolvedAccountId,
			sourceAccountId: turnSourceAccountId,
			defaultAccountId,
			threadId: resolvedThreadTarget ?? resolvedReplyToId ?? void 0,
			normalizeMediaPaths,
			normalizeSentTexts
		});
	};
	const rawFilteredReplyPayloads = await filterDeliveredPayloads(canonicalReplyPayloads);
	const mediaNormalization = deliver && !deliveryStatus && !isInternalMessageChannel(deliveryChannel) ? await normalizeReplyMediaPathsForDelivery({
		cfg,
		payloads: rawFilteredReplyPayloads,
		sessionKey: effectiveSessionKey,
		outboundSession,
		deliveryChannel,
		accountId: resolvedAccountId
	}) : { payloads: rawFilteredReplyPayloads };
	const mediaNormalizedReplyPayloads = await filterDeliveredPayloads(mediaNormalization.payloads, mediaNormalization.normalizeMediaPaths);
	params.assertDeliveryCurrent?.();
	const outboundPayloadPlan = createOutboundPayloadPlan(mediaNormalizedReplyPayloads);
	const normalizedPayloads = projectOutboundPayloadPlanForJson(outboundPayloadPlan);
	const completeDelivery = (status, deliverySucceeded) => {
		if (!opts.json && result.meta.requestShaping?.thinkingClamp) runtime.log(result.meta.requestShaping.thinkingClamp);
		if (opts.json) {
			const meta = result.meta;
			writeRuntimeJson(runtime, {
				payloads: [...normalizedPayloads],
				...meta ? { meta } : {},
				...status ? { deliveryStatus: status } : {}
			});
		}
		const deliveryResult = buildDeliveryResult({
			payloads: normalizedPayloads,
			meta: result.meta,
			result,
			deliverySucceeded,
			deliveryStatus: status
		});
		params.onDeliveryResult?.(deliveryResult, projectOutboundPayloadPlanForDelivery(outboundPayloadPlan));
		return deliveryResult;
	};
	if (strictPreDeliveryError) {
		completeDelivery(deliveryStatus);
		throw toErrorObject(strictPreDeliveryError, "Non-Error thrown");
	}
	const deliveryPayloads = projectOutboundPayloadPlanForOutbound(outboundPayloadPlan);
	if (deliveryPayloads.length === 0) {
		deliveryStatus = deliveryRequested ? deliveryStatus ?? noVisiblePayloadStatus(replyNormalization.kind === "suppress" ? replyNormalization.reason : void 0) : void 0;
		return completeDelivery(deliveryStatus, deliveryStatus?.succeeded === true ? true : void 0);
	}
	let deliverySucceeded = false;
	const printPayload = (payload) => {
		if (opts.json || isNestedAgentLane(opts.lane)) return;
		const output = formatOutboundPayloadLog(payload);
		if (!output) return;
		writeRuntimeStdout(runtime, output);
	};
	if (!deliver) {
		for (const payload of deliveryPayloads) printPayload(payload);
		return deliveryRequested && suppressAutomaticDelivery ? completeDelivery({
			...noVisiblePayloadStatus(),
			reason: "message_tool_only"
		}, true) : completeDelivery();
	}
	if (deliveryChannel && !isInternalMessageChannel(deliveryChannel)) {
		if (deliveryTarget && !deliveryStatus) {
			params.assertDeliveryCurrent?.();
			const completion = resolvePendingFinalDeliveryCompletion(payloads);
			const assertPlatformSendCurrent = createAgentCommandDeliveryGuard(params, completion);
			const restartAbort = createRestartOnlyAbortSignal(opts.abortSignal);
			let send;
			try {
				send = await sendDurableMessageBatchCore({
					cfg,
					channel: deliveryChannel,
					to: deliveryTarget,
					accountId: resolvedAccountId,
					payloads: deliveryPayloads,
					...completion ? {
						deliveryCompletion: completion,
						deliveryIntentId: completion.deliveryId
					} : {},
					session: outboundSession,
					identity: resolveAgentOutboundIdentity(cfg, deliveryAgentId),
					replyPayloadSendingHook: {
						kind: "final",
						channel: deliveryChannel,
						...effectiveSessionKey ? { sessionKey: effectiveSessionKey } : {},
						...opts.runId ? { runId: opts.runId } : {},
						context: {
							channelId: deliveryChannel,
							...resolvedAccountId ? { accountId: resolvedAccountId } : {},
							conversationId: deliveryTarget,
							...effectiveSessionKey ? { sessionKey: effectiveSessionKey } : {},
							...opts.runId ? { runId: opts.runId } : {}
						}
					},
					replyToId: resolvedReplyToId ?? null,
					threadId: resolvedThreadTarget ?? null,
					bestEffort: bestEffortDeliver,
					durability: bestEffortDeliver ? "best_effort" : "required",
					signal: restartAbort.signal,
					onDeliveryIntent: restartAbort.dispose,
					onPlatformSendDispatch: assertPlatformSendCurrent.prepare,
					assertDirectAdapterHandoff: assertPlatformSendCurrent,
					onError: logDeliveryError,
					onPayload: printPayload,
					deps: createOutboundSendDeps(deps)
				});
			} finally {
				restartAbort.dispose();
				await assertPlatformSendCurrent.release();
			}
			if (restartAbort.signal?.aborted && send.status === "failed") throw restartAbort.signal.reason;
			deliveryStatus = deliveryStatusFromDurableSend(send);
			if (!bestEffortDeliver && (send.status === "failed" || send.status === "partial_failed")) {
				completeDelivery(deliveryStatus, false);
				throw send.error;
			}
			deliverySucceeded = send.status === "sent" || send.status === "suppressed";
		}
	}
	if (!deliveryStatus) deliveryStatus = preDeliveryFailureStatus("no_delivery_target");
	if (!deliverySucceeded && !opts.json && !deliveryLoggedError) {
		const message = `[delivery] delivery requested but not completed: ${deliveryStatus?.status ?? "unknown"} (reason=${deliveryStatus?.reason ?? "none"} session=${effectiveSessionKey ?? "unknown"} channel=${deliveryChannel ?? "none"} target=${deliveryTarget ?? "none"} payloads=${deliveryPayloads.length})`;
		runtime.error(message);
	}
	return completeDelivery(deliveryStatus, deliverySucceeded);
}
//#endregion
export { deliverAgentCommandResult };
