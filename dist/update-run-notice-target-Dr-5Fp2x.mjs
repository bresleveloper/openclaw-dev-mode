import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { a as mergeDeliveryContext, r as hasDeliveryTargetFields } from "./delivery-context.shared-CW8dxG7X.mjs";
import { g as recordUpdateRunVerification } from "./update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import "./with-timeout-DI2A0gT4.mjs";
import { r as prepareCommandOwnerAuthority, t as isConfiguredCommandOwner } from "./command-auth-rFSl4uOZ.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as parseSessionThreadInfo } from "./thread-info-cIAJ239O.mjs";
import { c as isProvenDeliveryNotSentError, i as findPlatformMessageRejectedError } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import "./delivery-queue-sqlite-BghoE75G.mjs";
import { t as prepareOutboundPayloadBatch } from "./deliver-prepare-Rgnsll-n.mjs";
import { a as runOutboundDeliveryCommitHooks } from "./delivery-queue-reconciliation-Di9zMXli.mjs";
import { t as buildOutboundSessionContext } from "./session-context-B-tubEEv.mjs";
import { g as OUTBOUND_DELIVERY_LOG_SCOPE, l as createMessageSentEmitter, r as withActiveDeliveryClaim, t as drainPendingDeliveriesCore, u as createQueuedDeliveryOwner } from "./delivery-queue-recovery-DYFcangb.mjs";
import { n as sendDurableMessageBatchCore } from "./send-BI-ZW_ne.mjs";
import { g as acceptedPreparedOutboundEntries } from "./delivery-queue-sqlite-namespace.kernel-CbSzRfE6.mjs";
import { M as failPendingDelivery, T as withStableDeliveryPreparation, a as failDeliveryAfterPlatformSend, c as findDeliveryIntentOwner, f as loadPendingDelivery, i as failDelivery, o as failDeliveryBeforePlatformSend, x as reserveDeliveryAttempt } from "./delivery-queue-storage-S92YhW29.mjs";
import { i as stageAndEnqueueOutboundDelivery, n as deliverOutboundPayloadsInternal } from "./deliver-DAtm9gA8.mjs";
import "./runtime-CT_qLH6Y.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as createAccountActionGate } from "./account-action-gate-C_U0Com2.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { a as resolveOutboundTarget } from "./targets-xfpX_XXd.mjs";
//#region src/gateway/server-restart-sentinel-notice.ts
const log$1 = createSubsystemLogger("gateway/restart-sentinel");
const RESTART_NOTICE_RECOVERY_DELAY_MS = process.env.VITEST ? 1 : 1e3;
const RESTART_NOTICE_MAX_ATTEMPTS = 45;
const RESTART_NOTICE_RECOVERY_MAX_CYCLES = 46;
/** Resolve once before an update can replace lazily loaded channel modules. */
function resolveGatewayLifecycleNoticeRoute(params) {
	const origin = params.deliveryContext;
	const channel = origin?.channel ? normalizeChannelId(origin.channel) : null;
	if (!channel || !origin?.to) return;
	const resolved = resolveOutboundTarget({
		cfg: params.cfg,
		channel,
		to: origin.to,
		accountId: origin.accountId,
		mode: "implicit"
	});
	if (!resolved.ok) return;
	const threadId = params.threadId ?? stringifyRouteThreadId(origin.threadId);
	const transport = getChannelPlugin(channel)?.threading?.resolveReplyTransport?.({
		cfg: params.cfg,
		accountId: origin.accountId,
		threadId
	});
	return {
		channel,
		to: resolved.to,
		accountId: origin.accountId,
		replyToId: transport?.replyToId ?? void 0,
		threadId: transport && Object.hasOwn(transport, "threadId") ? stringifyRouteThreadId(transport.threadId) : threadId
	};
}
/** Return bounded delivery status while managed scopes retain the complete attempt. */
async function sendGatewayLifecycleNotice(params, capturedContext) {
	let delivered = false;
	try {
		const context = capturedContext ?? captureDeliveryQueueStateContext();
		await withTimeout(trackAsyncWork(async () => {
			const queued = await enqueueGatewayLifecycleNotice(params, params.deliveryIntentId, context);
			if (!queued.created) return;
			await deliverGatewayLifecycleNoticeAttempt({
				...params,
				summary: "update.run notice",
				queueId: queued.id
			}, () => {
				delivered = true;
			}, context);
		}), 1e4, "update.run notice");
	} catch (error) {
		log$1.warn(`update.run notice failed: ${formatErrorMessage(error)}`);
	}
	return delivered;
}
const activeRestartNoticeEnqueues = /* @__PURE__ */ new Map();
async function enqueueRestartSentinelNotice(params, context = captureDeliveryQueueStateContext()) {
	return await enqueueGatewayLifecycleNotice(params, params.deliveryIntentId ?? `restart-sentinel-notice:${params.sessionKey}:${params.revision}`, context);
}
async function enqueueGatewayLifecycleNotice(params, deliveryIntentId, context) {
	const active = activeRestartNoticeEnqueues.get(deliveryIntentId);
	if (active) {
		await active;
		return {
			id: deliveryIntentId,
			created: false
		};
	}
	const enqueue = enqueueRestartSentinelNoticeOwned(params, deliveryIntentId, context);
	activeRestartNoticeEnqueues.set(deliveryIntentId, enqueue);
	try {
		return await enqueue;
	} finally {
		if (activeRestartNoticeEnqueues.get(deliveryIntentId) === enqueue) activeRestartNoticeEnqueues.delete(deliveryIntentId);
	}
}
async function enqueueRestartSentinelNoticeOwned(params, deliveryIntentId, context) {
	const claim = await withActiveDeliveryClaim(deliveryIntentId, async () => {
		const preparation = await withStableDeliveryPreparation({
			id: deliveryIntentId,
			run: async (owner) => await enqueueRestartSentinelNoticeClaimed(params, deliveryIntentId, owner, context)
		}, context);
		if (preparation.status === "claimed") return preparation.value;
		if (await findDeliveryIntentOwner(deliveryIntentId, void 0, context)) return {
			id: deliveryIntentId,
			created: false
		};
		throw new Error(`Restart sentinel notice has an active producer without durable custody`);
	});
	if (claim.status === "claimed") return claim.value;
	if (await findDeliveryIntentOwner(deliveryIntentId, void 0, context)) return {
		id: deliveryIntentId,
		created: false
	};
	throw new Error(`Restart sentinel notice has an active producer without durable custody`);
}
async function enqueueRestartSentinelNoticeClaimed(params, deliveryIntentId, preparationOwner, context) {
	const delivery = {
		cfg: params.cfg,
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		replyToId: params.replyToId,
		threadId: params.threadId,
		payloads: [{ text: params.message }],
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			sessionKey: params.sessionKey
		}),
		bestEffort: false,
		queuePolicy: "required",
		completionRetention: "permanent",
		maxRetries: RESTART_NOTICE_MAX_ATTEMPTS,
		deliveryIntentId,
		deliveryQueueStateContext: context,
		deliveryQueueStateDir: context.stateDir
	};
	const preparedBatch = await prepareOutboundPayloadBatch(delivery, { onBeforeFirstModifier: preparationOwner.beforeFirstModifier });
	await preparationOwner.markPrepared();
	const queued = await stageAndEnqueueOutboundDelivery(delivery, preparedBatch, { getStablePreparation: preparationOwner.current });
	if (!queued?.created) throw new Error("Restart sentinel notice could not acquire durable queue custody");
	preparationOwner.markPublished();
	return queued;
}
async function waitForRecoveryDrain() {
	await new Promise((resolve) => {
		setTimeout(resolve, RESTART_NOTICE_RECOVERY_DELAY_MS).unref?.();
	});
}
async function drainFailedRestartSentinelNotice(params, context) {
	for (let cycle = 1; cycle <= RESTART_NOTICE_RECOVERY_MAX_CYCLES; cycle += 1) {
		const beforeDrain = await loadPendingDelivery(params.queueId, void 0, context).catch((error) => {
			log$1.warn(`${params.summary}: restart notice recovery reload failed: ${String(error)}`, {
				queueId: params.queueId,
				sessionKey: params.sessionKey,
				cycle
			});
		});
		if (beforeDrain === null) return;
		if ((beforeDrain ? Math.max(beforeDrain.attemptCount ?? 0, beforeDrain.retryCount) : 0) < RESTART_NOTICE_MAX_ATTEMPTS) await waitForRecoveryDrain();
		await drainPendingDeliveriesCore({
			drainKey: `restart-recovery:${params.queueId}`,
			logLabel: `${params.summary}: restart notice recovery`,
			cfg: params.cfg,
			log: log$1,
			deliver: deliverOutboundPayloadsInternal,
			selectEntry: (entry) => ({
				match: entry.id === params.queueId,
				bypassBackoff: true
			})
		}, deliverOutboundPayloadsInternal, context).catch((error) => {
			log$1.warn(`${params.summary}: restart notice recovery drain failed: ${String(error)}`, {
				queueId: params.queueId,
				sessionKey: params.sessionKey,
				cycle
			});
		});
	}
	const pending = await loadPendingDelivery(params.queueId, void 0, context).catch((error) => {
		log$1.warn(`${params.summary}: restart notice terminal reload failed: ${String(error)}`, {
			queueId: params.queueId,
			sessionKey: params.sessionKey
		});
	});
	if (pending === null) return;
	log$1.warn(`${params.summary}: restart notice remains queued after bounded recovery`, {
		queueId: params.queueId,
		sessionKey: params.sessionKey,
		retryCount: pending?.retryCount ?? null,
		attemptCount: pending?.attemptCount ?? null,
		maxAttempts: RESTART_NOTICE_MAX_ATTEMPTS
	});
}
async function deliverRestartSentinelNotice(params, context = captureDeliveryQueueStateContext()) {
	let delivered = false;
	const claim = await deliverGatewayLifecycleNoticeAttempt(params, () => {
		delivered = true;
	}, context);
	if (claim.status === "claimed-by-other-owner") log$1.info(`${params.summary}: durable restart notice claimed by recovery`, { sessionKey: params.sessionKey });
	if (claim.status === "claimed-by-other-owner" || !claim.value) await drainFailedRestartSentinelNotice(params, context);
	return delivered;
}
async function deliverGatewayLifecycleNoticeAttempt(params, onDelivered, context = captureDeliveryQueueStateContext()) {
	const messageSentEvents = [];
	const flushTerminalObservers = async (results, runId) => {
		const { emitMessageSent } = createMessageSentEmitter({
			hookRunner: getGlobalHookRunner(),
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			sessionKeyForInternalHooks: params.sessionKey,
			runId,
			logPrefix: OUTBOUND_DELIVERY_LOG_SCOPE
		});
		for (const event of messageSentEvents) emitMessageSent(event);
		messageSentEvents.length = 0;
		if (results.length > 0) await runOutboundDeliveryCommitHooks(results);
	};
	return await withActiveDeliveryClaim(params.queueId, async () => {
		const owner = createQueuedDeliveryOwner({ queueId: params.queueId }, context);
		try {
			if ((await reserveDeliveryAttempt(params.queueId, RESTART_NOTICE_MAX_ATTEMPTS, void 0, void 0, context)).status === "exhausted") return false;
		} catch (err) {
			log$1.warn(`${params.summary}: outbound delivery attempt reservation failed; queued for recovery: ${formatErrorMessage(err)}`, {
				channel: params.channel,
				to: params.to,
				sessionKey: params.sessionKey
			});
			return false;
		}
		try {
			const pending = await loadPendingDelivery(params.queueId, void 0, context);
			if (!pending) return true;
			const session = buildOutboundSessionContext({
				cfg: params.cfg,
				sessionKey: params.sessionKey
			});
			const send = await sendDurableMessageBatchCore({
				cfg: params.cfg,
				channel: params.channel,
				to: params.to,
				accountId: params.accountId,
				replyToId: params.replyToId,
				threadId: params.threadId,
				payloads: acceptedPreparedOutboundEntries(pending.preparedBatch).map((entry) => entry.payload),
				preparedBatch: pending.preparedBatch,
				session,
				deps: params.deps,
				bestEffort: false,
				skipQueue: true,
				deliveryQueueId: params.queueId,
				deliveryQueueOwner: owner,
				deferCommitHooks: true,
				onMessageSentEvent: (event) => messageSentEvents.push(event)
			}, void 0, context);
			if (send.status === "failed" || send.status === "partial_failed") throw send.error;
			const results = send.status === "sent" ? send.results : [];
			if (send.status === "sent" && results.length === 0) throw new Error("outbound delivery returned no results");
			if (results.length > 0) onDelivered?.();
			try {
				await owner.ack();
				await flushTerminalObservers(results, pending.preparedBatch.runId);
				return true;
			} catch (err) {
				const error = formatErrorMessage(err);
				await owner.fail(results.length > 0 ? failDeliveryAfterPlatformSend : failDelivery, error).catch(() => void 0);
				log$1.warn(`${params.summary}: outbound delivery ack failed; queued for recovery: ${error}`, {
					channel: params.channel,
					to: params.to,
					sessionKey: params.sessionKey
				});
				return false;
			}
		} catch (err) {
			const error = formatErrorMessage(err);
			if (findPlatformMessageRejectedError(err)) {
				try {
					const pending = await loadPendingDelivery(params.queueId, void 0, context);
					if (pending) {
						if ((await failPendingDelivery({
							id: params.queueId,
							entry: pending
						}, void 0, context)).status === "failed") await flushTerminalObservers([], pending.preparedBatch.runId);
					}
				} catch (persistError) {
					log$1.warn(`${params.summary}: permanent rejection persistence failed; queued for recovery: ${formatErrorMessage(persistError)}`, {
						channel: params.channel,
						to: params.to,
						sessionKey: params.sessionKey
					});
					return false;
				}
				log$1.warn(`${params.summary}: outbound delivery permanently rejected: ${error}`, {
					channel: params.channel,
					to: params.to,
					sessionKey: params.sessionKey
				});
				return true;
			}
			const recordFailure = isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery;
			await owner.fail(recordFailure, error).catch(() => void 0);
			log$1.warn(`${params.summary}: outbound delivery failed; queued for recovery: ${String(err)}`, {
				channel: params.channel,
				to: params.to,
				sessionKey: params.sessionKey
			});
			return false;
		}
	});
}
//#endregion
//#region src/gateway/update-run-notice-target.ts
const log = createSubsystemLogger("gateway/update-run");
function isUpdateNoticeSendEnabled(cfg, route) {
	const channel = asOptionalRecord(cfg.channels?.[route.channel]);
	const plugin = route.accountId ? void 0 : getChannelPlugin(route.channel);
	const accountId = normalizeAccountId(route.accountId ?? (plugin ? resolveChannelDefaultAccountId({
		plugin,
		cfg
	}) : void 0));
	const account = asOptionalRecord(resolveChannelAccountEntry(asOptionalRecord(channel?.accounts), accountId, route.channel, normalizeAccountId));
	const baseSendMessage = asOptionalRecord(channel?.actions)?.sendMessage;
	const accountSendMessage = asOptionalRecord(account?.actions)?.sendMessage;
	return createAccountActionGate({
		baseActions: { sendMessage: typeof baseSendMessage === "boolean" ? baseSendMessage : void 0 },
		accountActions: { sendMessage: typeof accountSendMessage === "boolean" ? accountSendMessage : void 0 }
	})("sendMessage");
}
async function prepareUpdateNoticeOwner(cfg, route, env) {
	const requester = {
		...route,
		senderId: route.to
	};
	if (isConfiguredCommandOwner(cfg, requester)) return await prepareCommandOwnerAuthority(cfg, requester, { env });
	if (route.chatType !== "direct") return;
	const plugin = getChannelPlugin(route.channel);
	const targetKind = plugin?.messaging?.inferTargetChatType?.({ to: route.to });
	if (targetKind && targetKind !== "direct") return;
	const owner = await prepareCommandOwnerAuthority(cfg, requester, { env });
	if (owner.source) return owner;
	if (targetKind !== "direct" || !plugin?.config.formatAllowFrom) return;
	const target = plugin.messaging?.normalizeTarget?.(route.to) ?? route.to;
	const senderIds = plugin.config.formatAllowFrom({
		cfg,
		accountId: route.accountId,
		allowFrom: [target]
	});
	for (const senderId of senderIds) {
		const translatedOwner = await prepareCommandOwnerAuthority(cfg, {
			...route,
			senderId
		}, { env });
		if (translatedOwner.source) return translatedOwner;
	}
}
async function prepareUpdateRunNoticeTarget(cfg, target, env) {
	if (target.kind !== "route") return target;
	const route = { ...target.route };
	if (!isUpdateNoticeSendEnabled(cfg, route)) return {
		kind: "none",
		reason: `update lifecycle notices are disabled by ${route.channel} actions.sendMessage policy`
	};
	const owner = await prepareUpdateNoticeOwner(cfg, route, env);
	return owner ? authorizeUpdateRunNoticeTarget(cfg, {
		kind: "route",
		route,
		owner
	}) : {
		kind: "none",
		reason: "target is not a current command owner"
	};
}
function authorizeUpdateRunNoticeTarget(cfg, target) {
	if (target.kind === "route" && !isUpdateNoticeSendEnabled(cfg, target.route)) return {
		kind: "none",
		reason: `update lifecycle notices are disabled by ${target.route.channel} actions.sendMessage policy`
	};
	return target.kind === "route" && !target.owner.isCurrent(cfg) ? {
		kind: "none",
		reason: "target is not a current command owner"
	} : target;
}
function recordUpdateRunNoticeSkipped(runId, reason, env) {
	log.warn(`lifecycle notice skipped: ${reason}`, { runId });
	if (runId && getUpdateRun(runId, { env })?.verification.noticeDelivered !== true) recordUpdateRunVerification(runId, { noticeDelivered: false }, { env });
}
/** Resolve the origin once; internal sessions intentionally have no external delivery context. */
async function resolveUpdateRunNoticeTarget(params) {
	const session = params.session ?? (params.sessionKey ? loadGatewaySessionEntry(params.sessionKey, { env: params.env }) : void 0);
	const routingKey = params.sessionKey ?? session?.canonicalKey;
	const { baseSessionKey, threadId } = parseSessionThreadInfo(routingKey);
	let context = deliveryContextFromSession(session?.entry);
	let chatType = sessionDeliveryOrigin(session?.entry)?.chatType ?? "direct";
	if (!hasDeliveryTargetFields(context) && baseSessionKey && baseSessionKey !== routingKey) {
		const { entry } = loadGatewaySessionEntry(baseSessionKey, { env: params.env });
		chatType = sessionDeliveryOrigin(session?.entry)?.chatType ?? sessionDeliveryOrigin(entry)?.chatType ?? "direct";
		context = mergeDeliveryContext(context, deliveryContextFromSession(entry));
	}
	const origin = mergeDeliveryContext(params.explicitDeliveryContext, context);
	if (isInternalMessageChannel(origin?.channel) || !origin?.channel && session?.entry?.delivery?.kind !== "external") return session?.entry ? {
		kind: "internal",
		session: {
			...session,
			entry: session.entry
		}
	} : {
		kind: "none",
		reason: "no delivery target"
	};
	const route = resolveGatewayLifecycleNoticeRoute({
		cfg: params.cfg,
		deliveryContext: origin,
		threadId: params.threadId ?? (params.sessionKey ? threadId : void 0)
	});
	return await prepareUpdateRunNoticeTarget(params.cfg, route ? {
		kind: "route",
		route: {
			...route,
			chatType
		}
	} : {
		kind: "none",
		reason: "no delivery target"
	}, params.env);
}
//#endregion
export { enqueueRestartSentinelNotice as a, deliverRestartSentinelNotice as i, recordUpdateRunNoticeSkipped as n, sendGatewayLifecycleNotice as o, resolveUpdateRunNoticeTarget as r, authorizeUpdateRunNoticeTarget as t };
