import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { n as preserveReplyPayloadMediaSelectionCore } from "./reply-media-entries-Ce3gllsX.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import "./ingress-drain--vCVtuIF.mjs";
import { i as classifyGatewayStaleInstall } from "./stale-install-CLeiGj_K.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { o as resolveReceiptSourceId, t as createMessageReceiptFromOutboundResults } from "./receipt-Be_FOFUF.mjs";
import "./payloads-RF8yW6z7.mjs";
import "./reply-policy-D40tu-98.mjs";
import "./session-context-Kov7ff_A.mjs";
import { i as livePreviewFinalizerCapabilities, n as channelMessageReceiveAckPolicies, r as durableFinalDeliveryCapabilities, t as channelMessageLiveCapabilities } from "./types-GcWljJIT.mjs";
import { c as resolveTextChunkLimit } from "./chunk-BenoswI3.mjs";
import { _ as resolveChannelProgressDraftConfig, w as resolveChannelStreamingPreviewChunk } from "./streaming-CHnBADiw.mjs";
import "./live-TWzvpgza.mjs";
import "./outbound-echo-D3kCTGGn.mjs";
import "./progress-draft-compositor--b7XCEie.mjs";
import "./reply-pipeline-DIQNa18H.mjs";
import "./logging-Bxqdp3TD.mjs";
import "./ingress-monitor-BwjRnGhS.mjs";
import "./identity-BLDSV5e3.mjs";
import "./sanitize-text-DsEmcKIF.mjs";
//#region src/channels/message/ingress-drain-lifecycle.ts
/** Maps a drain lifecycle onto the reply-lane ownership surface. */
function bindIngressLifecycleToReplyOptions(lifecycle) {
	return { turnAdoptionLifecycle: {
		admission: "exclusive",
		onAdopted: lifecycle.onAdopted,
		onDeferred: lifecycle.onDeferred,
		onDeferredHeartbeat: lifecycle.onDeferredHeartbeat,
		deferredHeartbeatIntervalMs: lifecycle.deferredHeartbeatIntervalMs,
		onAbandoned: lifecycle.onAbandoned,
		abortSignal: lifecycle.abortSignal
	} };
}
//#endregion
//#region src/channels/message/ingress-errors.ts
function createChannelIngressError(name, options) {
	const IngressError = class extends Error {
		constructor(first, second, third) {
			const reasoned = options?.withReason === true;
			super(reasoned && typeof second === "string" ? second : first, reasoned ? third : typeof second === "string" ? void 0 : second);
			this.name = name;
			if (reasoned) this.reason = first;
		}
	};
	Object.defineProperty(IngressError, "name", {
		configurable: true,
		value: name
	});
	return IngressError;
}
//#endregion
//#region src/channels/draft-stream-loop.ts
function createDraftStreamLoop(params) {
	const throttleMs = resolveTimerTimeoutMs(params.throttleMs, 0, 0);
	const emptyValue = params.emptyValue ?? "";
	const isEmpty = params.isEmpty ?? ((value) => typeof value === "string" && value.trim().length === 0);
	const hasPendingValue = (value) => typeof value === "string" ? value.length > 0 : !isEmpty(value);
	let lastSentAt = 0;
	let pendingValue = emptyValue;
	let inFlightPromise;
	let timer;
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const retainUnsentValue = (value, background) => {
		if (!hasPendingValue(pendingValue)) pendingValue = value;
		else if (background && params.coalesceInFlight) schedule();
	};
	const flush = async (background = false) => {
		clearTimer();
		while (!params.isStopped()) {
			if (inFlightPromise) {
				await inFlightPromise;
				if (background && params.coalesceInFlight) return;
				continue;
			}
			const value = pendingValue;
			if (isEmpty(value)) {
				pendingValue = emptyValue;
				return;
			}
			pendingValue = emptyValue;
			let current;
			let sent;
			try {
				current = Promise.resolve(params.sendOrEditStreamMessage(value)).finally(() => {
					if (inFlightPromise === current) inFlightPromise = void 0;
				});
				inFlightPromise = current;
				sent = await current;
			} catch (err) {
				retainUnsentValue(value, background);
				throw err;
			}
			if (sent === false) {
				retainUnsentValue(value, background);
				return;
			}
			lastSentAt = Date.now();
			if (!hasPendingValue(pendingValue)) return;
			if (background && params.coalesceInFlight) {
				schedule();
				return;
			}
		}
	};
	const startBackgroundFlush = () => {
		flush(true).catch((err) => {
			try {
				params.onBackgroundFlushError?.(err);
			} catch {}
		});
	};
	const schedule = () => {
		if (timer) return;
		const delay = Math.max(0, throttleMs - (Date.now() - lastSentAt));
		timer = setTimeout(() => {
			startBackgroundFlush();
		}, delay);
	};
	return {
		update: (value) => {
			if (params.isStopped()) return;
			pendingValue = value;
			if (inFlightPromise) {
				if (!params.coalesceInFlight) schedule();
				return;
			}
			if (!timer && Date.now() - lastSentAt >= throttleMs) {
				startBackgroundFlush();
				return;
			}
			schedule();
		},
		flush: () => flush(),
		stop: () => {
			pendingValue = emptyValue;
			clearTimer();
		},
		resetPending: () => {
			pendingValue = emptyValue;
		},
		resetThrottleWindow: () => {
			lastSentAt = 0;
			clearTimer();
		},
		waitForInFlight: async () => {
			if (inFlightPromise) await inFlightPromise;
		},
		takePending: () => {
			const value = pendingValue;
			pendingValue = emptyValue;
			clearTimer();
			return value;
		}
	};
}
//#endregion
//#region src/channels/draft-stream-controls.ts
/**
* Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
*/
function createFinalizableDraftStreamControls(params) {
	const loop = createDraftStreamLoop({
		throttleMs: params.throttleMs,
		coalesceInFlight: params.coalesceInFlight,
		isStopped: params.isStopped,
		sendOrEditStreamMessage: params.sendOrEditStreamMessage,
		...params.emptyValue !== void 0 ? { emptyValue: params.emptyValue } : {},
		...params.isEmpty ? { isEmpty: params.isEmpty } : {}
	});
	const update = (value) => {
		if (params.isStopped() || params.isFinal()) return;
		loop.update(value);
	};
	const stop = async () => {
		params.markFinal();
		await loop.flush();
	};
	const stopForClear = async () => {
		params.markStopped();
		loop.stop();
		await loop.waitForInFlight();
	};
	const seal = async () => {
		params.markFinal();
		loop.stop();
		await loop.waitForInFlight();
	};
	return {
		loop,
		update,
		stop,
		seal,
		discardPending: stopForClear,
		stopForClear
	};
}
function createFinalizableDraftStreamControlsForState(params) {
	return createFinalizableDraftStreamControls({
		...params,
		isStopped: () => params.state.stopped,
		isFinal: () => params.state.final,
		markStopped: () => {
			params.state.stopped = true;
		},
		markFinal: () => {
			params.state.final = true;
		}
	});
}
async function takeMessageIdAfterStop(params) {
	await params.stopForClear();
	const messageId = params.readMessageId();
	params.clearMessageId();
	return messageId;
}
async function deleteFinalizableDraftMessage(params, messageId) {
	try {
		if (await params.deleteMessage(messageId) === false) return false;
	} catch (err) {
		params.warn?.(`${params.warnPrefix}: ${formatErrorMessage(err)}`);
		return false;
	}
	try {
		if (Object.is(params.readMessageId(), messageId)) params.clearMessageId();
		params.onDeleteSuccess?.(messageId);
	} catch (err) {
		params.warn?.(`${params.warnPrefix} after delete: ${formatErrorMessage(err)}`);
	}
	return true;
}
/**
* Stops a draft stream and deletes its preview message when the stored id is valid.
* Claims the current id before deletion; stateful callers can retain failures through
* onDeleteFailure without making overlapping clears delete the same message twice.
*/
async function clearFinalizableDraftMessage(params) {
	const messageId = await takeMessageIdAfterStop(params);
	if (!params.isValidMessageId(messageId)) return;
	if (!await deleteFinalizableDraftMessage(params, messageId)) params.onDeleteFailure?.(messageId);
}
function createFinalizableDraftLifecycle(params) {
	const controls = createFinalizableDraftStreamControlsForState(params);
	const pending = /* @__PURE__ */ new Map();
	let clearTail = Promise.resolve();
	let generation = 0;
	let discardThroughGeneration = -1;
	const claim = (messageId, owner) => {
		let retirement = pending.get(messageId);
		if (!retirement) {
			retirement = { owner };
			pending.set(messageId, retirement);
		}
		return retirement;
	};
	const attemptDelete = (messageId, retirement) => {
		retirement.attempt ??= Promise.resolve().then(async () => {
			try {
				const deleted = await deleteFinalizableDraftMessage(retirement.owner, messageId);
				if (deleted && pending.get(messageId) === retirement) pending.delete(messageId);
				return deleted;
			} finally {
				retirement.attempt = void 0;
			}
		});
		return retirement.attempt;
	};
	const drainDeletes = async (retainedId) => {
		const visited = /* @__PURE__ */ new Set();
		for (const [messageId, retirement] of pending) {
			if (visited.has(messageId) || Object.is(messageId, retainedId)) continue;
			visited.add(messageId);
			await attemptDelete(messageId, retirement);
		}
		return pending.size === 0;
	};
	const retire = async (messageId, options) => {
		const retirement = claim(messageId, params);
		if (!options?.defer) await attemptDelete(messageId, retirement);
	};
	const serializeCleanup = (operation) => {
		const cleanupRun = clearTail.catch(() => {}).then(operation);
		clearTail = cleanupRun;
		return cleanupRun;
	};
	const clearWithStop = (stopForClear, messageIdOwner) => {
		const owner = messageIdOwner ? {
			...params,
			...messageIdOwner
		} : params;
		return serializeCleanup(async () => {
			await stopForClear();
			const messageId = owner.readMessageId();
			if (owner.isValidMessageId(messageId)) claim(messageId, owner);
			else owner.clearMessageId();
			await drainDeletes();
		});
	};
	const stop = () => {
		const previousClear = clearTail.catch(() => {});
		const stopRun = Promise.allSettled([controls.stop(), previousClear]).then(async ([stopped]) => {
			if (stopped.status === "rejected") throw stopped.reason;
			await drainDeletes(params.readMessageId());
		});
		clearTail = stopRun;
		return stopRun;
	};
	const resetMessage = (throttle = "reset") => {
		params.clearMessageId();
		controls.loop.resetPending();
		if (throttle === "reset") controls.loop.resetThrottleWindow();
	};
	const reset = (mode = "preserve", throttle = "reset") => {
		if (mode === "discard") discardThroughGeneration = generation;
		generation += 1;
		params.state.stopped = false;
		params.state.final = false;
		resetMessage(throttle);
	};
	const createMessage = async (send, publish, retirementOptions) => {
		const startedGeneration = generation;
		const messageId = await send();
		if (startedGeneration === generation) return publish(messageId);
		if (startedGeneration <= discardThroughGeneration && params.isValidMessageId(messageId)) await retire(messageId, retirementOptions);
		return true;
	};
	const retireCurrent = async (stopForClear) => {
		const startedGeneration = generation;
		await stopForClear();
		if (startedGeneration !== generation) return;
		const messageId = params.readMessageId();
		params.clearMessageId();
		if (params.isValidMessageId(messageId)) await retire(messageId);
	};
	return {
		...controls,
		get generation() {
			return generation;
		},
		reset,
		resetMessage,
		createMessage,
		retireCurrent,
		stop,
		clear: () => clearWithStop(controls.stopForClear),
		clearWithStop,
		retire,
		cleanupPending: (prepareCleanup) => serializeCleanup(async () => {
			prepareCleanup?.();
			await drainDeletes(params.readMessageId());
		})
	};
}
//#endregion
//#region src/channels/transport/stall-watchdog.ts
function stringifyFailure(error) {
	try {
		return String(error);
	} catch {
		return "Unknown error";
	}
}
/** Creates a watchdog that reports once when an armed transport goes idle. */
function createArmableStallWatchdog(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const defaultCheckIntervalMs = Math.min(5e3, Math.max(250, timeoutMs / 6));
	const checkIntervalMs = resolveTimerTimeoutMs(params.checkIntervalMs, defaultCheckIntervalMs, 100);
	let armed = false;
	let stopped = false;
	let lastActivityAt = Date.now();
	let timer = null;
	const report = (message) => {
		try {
			const result = params.runtime?.error?.(message);
			Promise.resolve(result).catch(() => {});
		} catch {}
	};
	const reportTimeoutFailure = (error) => report(`[${params.label}] transport watchdog timeout handler failed: ${stringifyFailure(error)}`);
	const clearTimer = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	};
	const disarm = () => {
		armed = false;
	};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		disarm();
		clearTimer();
		params.abortSignal?.removeEventListener("abort", stop);
	};
	const arm = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
		armed = true;
	};
	const touch = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
	};
	const check = () => {
		if (!armed || stopped) return;
		const idleMs = Date.now() - lastActivityAt;
		if (idleMs < timeoutMs) return;
		disarm();
		report(`[${params.label}] transport watchdog timeout: idle ${Math.round(idleMs / 1e3)}s (limit ${Math.round(timeoutMs / 1e3)}s)`);
		try {
			Promise.resolve(params.onTimeout({
				idleMs,
				timeoutMs
			})).catch(reportTimeoutFailure);
		} catch (error) {
			reportTimeoutFailure(error);
		}
	};
	if (params.abortSignal?.aborted) stop();
	else {
		params.abortSignal?.addEventListener("abort", stop, { once: true });
		timer = setInterval(check, checkIntervalMs);
		timer.unref?.();
	}
	return {
		arm,
		touch,
		disarm,
		stop,
		isArmed: () => armed
	};
}
//#endregion
//#region src/channels/draft-streaming-chunking.ts
const DEFAULT_DRAFT_STREAM_MIN = 200;
const DEFAULT_DRAFT_STREAM_MAX = 800;
function resolveChannelDraftStreamingChunking(cfg, channelId, accountId, opts) {
	const textLimit = resolveTextChunkLimit(cfg, channelId, accountId, { fallbackLimit: opts.fallbackLimit });
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelCfg = cfg?.channels?.[channelId];
	const accountCfg = resolveChannelAccountEntry(channelCfg?.accounts, normalizedAccountId, channelId);
	const draftCfg = resolveChannelStreamingPreviewChunk(accountCfg) ?? resolveChannelStreamingPreviewChunk(channelCfg);
	const maxRequested = Math.max(1, Math.floor(draftCfg?.maxChars ?? DEFAULT_DRAFT_STREAM_MAX));
	const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
	const minRequested = Math.max(1, Math.floor(draftCfg?.minChars ?? DEFAULT_DRAFT_STREAM_MIN));
	return {
		minChars: Math.min(minRequested, maxChars),
		maxChars,
		breakPreference: draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence" ? draftCfg.breakPreference : "paragraph"
	};
}
//#endregion
//#region src/infra/outbound/send-deps.ts
/**
* Builds historical dependency keys for channel send functions.
*/
function resolveLegacyOutboundSendDepKeys(channelId) {
	const compact = channelId.replace(/[^a-z0-9]+/gi, "");
	if (!compact) return [];
	const pascal = compact.charAt(0).toUpperCase() + compact.slice(1);
	return pascal.startsWith("Ms") && pascal.length > 2 ? [`send${pascal}`, `sendMS${pascal.slice(2)}`] : [`send${pascal}`];
}
/**
* Resolves a channel send dependency from modern channel IDs or legacy helper keys.
*/
function resolveOutboundSendDep(deps, channelId, options) {
	const dynamic = deps?.[channelId];
	if (dynamic !== void 0) return dynamic;
	const legacyKeys = [...resolveLegacyOutboundSendDepKeys(channelId), ...options?.legacyKeys ?? []];
	for (const legacyKey of legacyKeys) {
		const legacy = deps?.[legacyKey];
		if (legacy !== void 0) return legacy;
	}
}
//#endregion
//#region src/channels/message/adapter.ts
const defaultManualReceiveAdapter = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
function defineChannelMessageAdapter(adapter) {
	return {
		...adapter,
		receive: adapter.receive ?? defaultManualReceiveAdapter
	};
}
//#endregion
//#region src/channels/message/outbound-bridge.ts
/**
* Legacy outbound bridge adapter.
*
* Wraps old channel send functions in the newer channel message adapter contract.
*/
function toMessageSendResult(result, params) {
	const receipt = result.receipt ? params.normalizeReceiptKind ? {
		...result.receipt,
		parts: result.receipt.parts.map((part) => ({
			...part,
			kind: params.kind
		}))
	} : result.receipt : createMessageReceiptFromOutboundResults({
		results: [result],
		kind: params.kind,
		threadId: params.threadId == null ? void 0 : String(params.threadId),
		replyToId: params.replyToId ?? void 0
	});
	const messageId = resolveReceiptSourceId({
		...result,
		receipt
	});
	return {
		...result.outcome !== void 0 ? { outcome: result.outcome } : {},
		...result.target !== void 0 ? { target: result.target } : {},
		...result.chatId !== void 0 ? { chatId: result.chatId } : {},
		...result.channelId !== void 0 ? { channelId: result.channelId } : {},
		...result.roomId !== void 0 ? { roomId: result.roomId } : {},
		...result.conversationId !== void 0 ? { conversationId: result.conversationId } : {},
		...result.toJid !== void 0 ? { toJid: result.toJid } : {},
		...result.pollId !== void 0 ? { pollId: result.pollId } : {},
		...result.timestamp !== void 0 ? { timestamp: result.timestamp } : {},
		...result.meta !== void 0 ? { meta: result.meta } : {},
		receipt,
		...messageId ? { messageId } : {}
	};
}
async function sendThroughOutboundBridge(ctx, kind, send) {
	const resultParams = {
		kind,
		...kind === "poll" ? { normalizeReceiptKind: true } : {},
		threadId: ctx.threadId,
		replyToId: ctx.replyToId
	};
	const { onDeliveryResult, ...outboundCtx } = ctx;
	return toMessageSendResult(await send({
		...outboundCtx,
		...onDeliveryResult ? { onDeliveryResult: async (result) => {
			await onDeliveryResult(toMessageSendResult(result, resultParams));
		} } : {}
	}), resultParams);
}
function hasRenderedPresentationBlocks(channelData) {
	return Object.values(channelData ?? {}).some((value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const blocks = value.presentationBlocks;
		return Array.isArray(blocks) && blocks.length > 0;
	});
}
function resolvePayloadReceiptKind(ctx) {
	if (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length) return ctx.payload.audioAsVoice ? "voice" : "media";
	if (Boolean(ctx.payload.presentation?.title || ctx.payload.presentation?.blocks?.length) || hasRenderedPresentationBlocks(ctx.payload.channelData) || ctx.payload.interactive || ctx.payload.location) return "card";
	if (ctx.payload.text?.trim() || ctx.text.trim()) return "text";
	return "unknown";
}
/** Converts legacy outbound send methods into a typed channel message adapter. */
function createChannelMessageAdapterFromOutbound(params) {
	const send = {};
	if (params.outbound.sendText) send.text = async (ctx) => sendThroughOutboundBridge(ctx, "text", (outboundCtx) => params.outbound.sendText(outboundCtx));
	if (params.outbound.sendMedia) send.media = async (ctx) => sendThroughOutboundBridge(ctx, ctx.audioAsVoice ? "voice" : "media", (outboundCtx) => params.outbound.sendMedia(outboundCtx));
	if (params.outbound.sendPayload) send.payload = async (ctx) => sendThroughOutboundBridge(ctx, resolvePayloadReceiptKind(ctx), (outboundCtx) => params.outbound.sendPayload(outboundCtx));
	if (params.outbound.sendPoll) send.poll = async (ctx) => sendThroughOutboundBridge(ctx, "poll", (outboundCtx) => params.outbound.sendPoll(outboundCtx));
	return {
		...params.id ? { id: params.id } : {},
		durableFinal: { capabilities: params.capabilities ?? params.outbound.deliveryCapabilities?.durableFinal },
		send,
		...params.live ? { live: params.live } : {},
		receive: params.receive ?? defaultManualReceiveAdapter
	};
}
//#endregion
//#region src/channels/message/durable-receive.ts
function normalizeDurableInboundReceiveId(id) {
	const normalized = id.trim();
	if (!normalized) throw new Error("Durable inbound receive id cannot be empty");
	return normalized;
}
/** Adapts the shared channel ingress queue to the durable receive journal API. */
function createDurableInboundReceiveJournalFromQueue(options) {
	const prune = async (protectId) => {
		if (options.retention) await options.queue.prune({
			...options.retention,
			...protectId === void 0 ? {} : { protectIds: [protectId] }
		});
	};
	return {
		accept: async (id, payload, acceptOptions) => {
			await prune();
			const eventId = normalizeDurableInboundReceiveId(id);
			const result = await options.queue.enqueue(eventId, payload, {
				...acceptOptions?.metadata === void 0 ? {} : { metadata: acceptOptions.metadata },
				...acceptOptions?.receivedAt === void 0 ? {} : { receivedAt: acceptOptions.receivedAt }
			});
			await prune(eventId);
			if (result.kind === "accepted") return {
				kind: "accepted",
				duplicate: false,
				record: result.record
			};
			if (result.kind === "completed") return {
				kind: "completed",
				duplicate: true,
				record: result.record
			};
			if (result.kind === "pending" || result.kind === "claimed") return {
				kind: "pending",
				duplicate: true,
				record: result.record
			};
			return {
				kind: "pending",
				duplicate: true,
				record: {
					id: result.record.id,
					payload,
					receivedAt: result.record.failedAt,
					updatedAt: result.record.failedAt,
					attempts: 0
				}
			};
		},
		pending: async () => {
			await prune();
			return await options.queue.listPending({ limit: "all" });
		},
		complete: async (id, completeOptions) => {
			await options.queue.complete(normalizeDurableInboundReceiveId(id), {
				...completeOptions?.metadata === void 0 ? {} : { metadata: completeOptions.metadata },
				...completeOptions?.completedAt === void 0 ? {} : { completedAt: completeOptions.completedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
		},
		release: async (id, releaseOptions) => {
			const released = await options.queue.release(normalizeDurableInboundReceiveId(id), {
				...releaseOptions?.lastError === void 0 ? {} : { lastError: releaseOptions.lastError },
				...releaseOptions?.releasedAt === void 0 ? {} : { releasedAt: releaseOptions.releasedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			return released;
		},
		deletePending: async (id) => {
			const deleted = await options.queue.delete(normalizeDurableInboundReceiveId(id));
			await prune();
			return deleted;
		}
	};
}
//#endregion
//#region src/channels/message/contracts.ts
async function verifyContractProofs(params) {
	const results = [];
	for (const key of params.keys) {
		if (!params.isDeclared(key)) {
			results.push(params.result(key, "not_declared"));
			continue;
		}
		const proof = params.proofs[key];
		if (!proof) throw new Error(params.missingProofError(key));
		await proof();
		results.push(params.result(key, "verified"));
	}
	return results;
}
async function verifyDurableFinalCapabilityProofs(params) {
	return await verifyContractProofs({
		keys: durableFinalDeliveryCapabilities,
		isDeclared: (capability) => params.capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${params.adapterName} declares durable final capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
async function verifyChannelMessageAdapterCapabilityProofs(params) {
	return await verifyDurableFinalCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.durableFinal?.capabilities,
		proofs: params.proofs
	});
}
async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params) {
	const { adapterName } = params;
	const receive = params.adapter.receive;
	const declared = new Set(receive?.supportedAckPolicies?.length ? receive.supportedAckPolicies : receive?.defaultAckPolicy ? [receive.defaultAckPolicy] : []);
	return await verifyContractProofs({
		keys: channelMessageReceiveAckPolicies,
		isDeclared: (policy) => declared.has(policy),
		proofs: params.proofs,
		missingProofError: (policy) => `${adapterName} declares receive ack policy "${policy}" without a contract proof`,
		result: (policy, status) => ({
			policy,
			status
		})
	});
}
async function verifyChannelMessageLiveFinalizerProofs(params) {
	const { adapterName } = params;
	const capabilities = params.adapter.live?.finalizer?.capabilities;
	return await verifyContractProofs({
		keys: livePreviewFinalizerCapabilities,
		isDeclared: (capability) => capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${adapterName} declares live preview finalizer capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
async function verifyChannelMessageLiveCapabilityAdapterProofs(params) {
	const { adapterName } = params;
	const capabilities = params.adapter.live?.capabilities;
	return await verifyContractProofs({
		keys: channelMessageLiveCapabilities,
		isDeclared: (capability) => capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${adapterName} declares live capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
//#endregion
//#region src/channels/message/receive.ts
const neverAbortedSignal = new AbortController().signal;
const ackStages = {
	after_receive_record: "receive_record",
	after_agent_dispatch: "agent_dispatch",
	after_durable_send: "durable_send",
	manual: void 0
};
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
function createMessageReceiveContext(params) {
	let nackInFlight;
	const ctx = {
		id: params.id,
		channel: params.channel,
		...params.accountId ? { accountId: params.accountId } : {},
		message: params.message,
		ackPolicy: params.ackPolicy ?? "after_receive_record",
		ackState: "pending",
		receivedAt: params.receivedAt ?? Date.now(),
		signal: params.signal ?? neverAbortedSignal,
		shouldAckAfter: (stage) => ackStages[ctx.ackPolicy] === stage,
		ack: async () => {
			if (ctx.ackState === "acked") return;
			await params.onAck?.();
			ctx.ackState = "acked";
			ctx.ackedAt = Date.now();
			delete ctx.nackErrorMessage;
		},
		nack: async (error) => {
			if (ctx.ackState === "nacked") return;
			if (nackInFlight) {
				await nackInFlight;
				return;
			}
			nackInFlight = (async () => {
				await params.onNack?.(error);
				ctx.ackState = "nacked";
				ctx.nackErrorMessage = formatErrorMessage(error);
			})();
			try {
				await nackInFlight;
			} finally {
				nackInFlight = void 0;
			}
		}
	};
	return ctx;
}
//#endregion
//#region src/channels/streaming-final-text.ts
const MIN_TRUNCATED_FINAL_PREFIX_CHARS = 48;
const MIN_TRUNCATED_FINAL_CONTINUATION_CHARS = 24;
function stripTrailingEllipsis(text) {
	return text.replace(/(?<!\s)(?:\s*(?:\.{3}|\u2026))+$/u, "").trimEnd();
}
function isPotentialTruncatedFinal(finalText) {
	const trimmedFinal = finalText.trimEnd();
	const untruncatedFinal = stripTrailingEllipsis(trimmedFinal);
	return untruncatedFinal.length >= MIN_TRUNCATED_FINAL_PREFIX_CHARS && untruncatedFinal !== trimmedFinal;
}
function selectLongerFinalText(params) {
	const finalText = params.finalText.trimEnd();
	if (!isPotentialTruncatedFinal(finalText)) return;
	const untruncatedFinal = stripTrailingEllipsis(finalText);
	for (const candidate of params.candidateTexts) {
		const candidateText = candidate?.trimEnd();
		if (!candidateText || candidateText.length <= finalText.length || !candidateText.startsWith(untruncatedFinal)) continue;
		const continuation = candidateText.slice(untruncatedFinal.length).trimStart();
		if (continuation.length >= MIN_TRUNCATED_FINAL_CONTINUATION_CHARS && /^[\p{L}\p{N}]/u.test(continuation)) return candidateText;
	}
}
async function resolveTranscriptBackedChannelFinalText(params) {
	if (params.payload && getReplyPayloadMetadata(params.payload)?.precedingInputAnswer || !isPotentialTruncatedFinal(params.finalText)) return params.finalText;
	const candidateText = await params.resolveCandidateText();
	return selectLongerFinalText({
		finalText: params.finalText,
		candidateTexts: [candidateText]
	}) ?? params.finalText;
}
//#endregion
//#region src/plugin-sdk/channel-outbound.ts
const loadChannelMessageRuntimeModule = createLazyRuntimeModule(() => import("./runtime-BYKn3_t5.mjs"));
/** Keep the current operation media selection when recovering other reply fields. */
function preserveReplyPayloadMediaSelection(source, recovered) {
	return preserveReplyPayloadMediaSelectionCore(source, recovered);
}
/**
* @deprecated Load-only bridge: the published Slack channel package
* (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
* it makes the installed plugin fail to load after a core upgrade. The config
* key it read is retired and doctor strips it, so this resolves the same
* "text"/"rich" answer pre-doctor configs produced and the default otherwise.
* Remove once managed releases have replaced the old npm latest/extended-stable
* packages and their upgrade window has closed.
*/
function resolveChannelProgressDraftRender(entry, defaultValue = "text") {
	const configured = resolveChannelProgressDraftConfig(entry).render;
	return configured === "rich" || configured === "text" ? configured : defaultValue;
}
async function loadChannelDurableDeliveryModule() {
	return await import("./durable-delivery-CHyn-53U.mjs").catch((error) => {
		const staleInstall = classifyGatewayStaleInstall(error);
		throw new PlatformMessageNotDispatchedError(staleInstall?.error.message ?? "Reply delivery runtime could not load before dispatch", { cause: error });
	});
}
/** Lazily forwards inbound reply delivery through the channel turn durable-delivery module. */
const deliverInboundReplyWithMessageSendContext = async (...args) => {
	return await (await loadChannelDurableDeliveryModule()).deliverInboundReplyWithMessageSendContextCore(...args);
};
/** Delivers a producer's prepared plan without reparsing literal text. */
const deliverStructuredInboundReplyWithMessageSendContext = async (...args) => {
	return await (await loadChannelDurableDeliveryModule()).deliverStructuredInboundReplyWithMessageSendContextCore(...args);
};
/** Sends a durable message batch without eager-loading channel message runtime internals. */
async function sendDurableMessageBatch(params) {
	return await (await loadChannelMessageRuntimeModule()).sendDurableMessageBatchCore(params);
}
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
async function withDurableMessageSendContext(params, run) {
	return await (await loadChannelMessageRuntimeModule()).withDurableMessageSendContextCore(params, run);
}
//#endregion
export { createFinalizableDraftLifecycle as C, createDraftStreamLoop as D, takeMessageIdAfterStop as E, createChannelIngressError as O, clearFinalizableDraftMessage as S, createFinalizableDraftStreamControlsForState as T, createChannelMessageAdapterFromOutbound as _, sendDurableMessageBatch as a, resolveChannelDraftStreamingChunking as b, resolveTranscriptBackedChannelFinalText as c, verifyChannelMessageAdapterCapabilityProofs as d, verifyChannelMessageLiveCapabilityAdapterProofs as f, createDurableInboundReceiveJournalFromQueue as g, verifyDurableFinalCapabilityProofs as h, resolveChannelProgressDraftRender as i, bindIngressLifecycleToReplyOptions as k, selectLongerFinalText as l, verifyChannelMessageReceiveAckPolicyAdapterProofs as m, deliverStructuredInboundReplyWithMessageSendContext as n, withDurableMessageSendContext as o, verifyChannelMessageLiveFinalizerProofs as p, preserveReplyPayloadMediaSelection as r, isPotentialTruncatedFinal as s, deliverInboundReplyWithMessageSendContext as t, createMessageReceiveContext as u, defineChannelMessageAdapter as v, createFinalizableDraftStreamControls as w, createArmableStallWatchdog as x, resolveOutboundSendDep as y };
