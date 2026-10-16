import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CdRlGRnW.mjs";
import { n as asNullableObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import { s as isUnscopedSessionKeySentinel } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { Ht as DesktopAvailabilitySchema } from "./agents-models-skills-C5tzwL7k.mjs";
import { Hn as validateNodePresenceActivityPayload, kn as validateNodeHostStatsPayload } from "./src-l2dWvEsN.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-ba6LAy2M.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-00MgEWj5.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { O as NODE_PRESENCE_ALIVE_REASONS } from "./nodes-DPtrbB1Q.mjs";
import { l as resolveAgentHarnessSessionContextError } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { g as upsertSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { i as deleteMediaBuffer } from "./store-A0dMc8iV.mjs";
import { t as buildOutboundSessionContext } from "./session-context-Kov7ff_A.mjs";
import { n as sendDurableMessageBatchCore } from "./send-BOL6c5DR.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import "./runtime-D_39_b__.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import { i as scopedHeartbeatWakeOptionsForPolicy, n as resolveEventSessionRoutingPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-yXV1vWY_.mjs";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-0e9R_Y2U.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { a as resolveOutboundTarget } from "./targets-CO7mQVz4.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as NODE_HOST_STATS_EVENT } from "./node-host-stats-B8fF3nyX.mjs";
import { f as updatePairedDevicePresence } from "./device-pairing-Drmq_Czv.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import { r as agentCommandFromIngress } from "./agent-command-CFAOMl1G.mjs";
import "./agent-BuY13J4W.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-BBDKPSK_.mjs";
import { h as registerApnsRegistration, y as ApnsRegistrationPairingChangedError } from "./push-apns-store-BNQPyh4x.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { o as parseMessageWithAttachments, s as persistInboundImagesForTranscript, t as INLINE_IMAGE_DURABLE_OMISSION_MARKER } from "./chat-attachments-C335Q8xj.mjs";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-Bgzo6FoE.mjs";
import "./push-apns-DWV7vQst.mjs";
import { randomUUID } from "node:crypto";
import { Value } from "typebox/value";
//#region src/shared/node-presence.ts
/** Gateway event name used by node hosts to refresh their last-seen presence. */
const NODE_PRESENCE_ALIVE_EVENT = "node.presence.alive";
/** Gateway event name used by interactive nodes to report recent local input. */
const NODE_PRESENCE_ACTIVITY_EVENT = "node.presence.activity";
const NODE_PRESENCE_ALIVE_REASON_SET = new Set(Object.values(NODE_PRESENCE_ALIVE_REASONS));
/** Normalizes untrusted presence trigger values, defaulting unknown input to background. */
function normalizeNodePresenceAliveReason(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (normalized && NODE_PRESENCE_ALIVE_REASON_SET.has(normalized)) return normalized;
	return "background";
}
//#endregion
//#region src/gateway/server-node-events-apns.ts
async function registerNodeApnsEvent(ctx, nodeId, obj, authority) {
	const transport = normalizeLowercaseStringOrEmpty(obj.transport) || "direct";
	const topic = typeof obj.topic === "string" ? obj.topic : "";
	const environment = obj.environment;
	try {
		const expectedPairingGeneration = await authority?.resolveApnsRegistrationGeneration?.();
		if (!expectedPairingGeneration) {
			ctx.logGateway.warn(`push apns register rejected node=${nodeId}: stale or invalidated pairing session`);
			return "pairing-changed";
		}
		if (transport === "relay") {
			const gatewayDeviceId = normalizeOptionalString(obj.gatewayDeviceId) ?? "";
			const currentGatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
			if (!gatewayDeviceId || gatewayDeviceId !== currentGatewayDeviceId) {
				ctx.logGateway.warn(`push relay register rejected node=${nodeId}: gateway identity mismatch`);
				return;
			}
		}
		await registerApnsRegistration({
			nodeId,
			...transport === "relay" ? {
				transport: "relay",
				relayHandle: typeof obj.relayHandle === "string" ? obj.relayHandle : "",
				sendGrant: typeof obj.sendGrant === "string" ? obj.sendGrant : "",
				installationId: typeof obj.installationId === "string" ? obj.installationId : "",
				distribution: obj.distribution,
				relayOrigin: obj.relayOrigin,
				tokenDebugSuffix: obj.tokenDebugSuffix
			} : {
				transport: "direct",
				token: typeof obj.token === "string" ? obj.token : ""
			},
			topic,
			environment,
			expectedPairingGeneration,
			...authority?.assertApnsRegistrationCurrent ? { assertCurrent: authority.assertApnsRegistrationCurrent } : {}
		});
	} catch (err) {
		if (err instanceof ApnsRegistrationPairingChangedError) {
			ctx.logGateway.warn(`push apns register rejected node=${nodeId}: stale or invalidated pairing session`);
			return "pairing-changed";
		}
		ctx.logGateway.warn(`push apns register failed node=${nodeId}: ${formatForLog(err)}`);
	}
}
//#endregion
//#region src/gateway/server-node-events.ts
const MAX_EXEC_EVENT_OUTPUT_CHARS = 180;
const MAX_NOTIFICATION_EVENT_TEXT_CHARS = 120;
const VOICE_TRANSCRIPT_DEDUPE_WINDOW_MS = 1500;
const MAX_RECENT_VOICE_TRANSCRIPTS = 200;
const EXEC_FINISHED_RUN_DEDUPE_WINDOW_MS = 6e5;
const MAX_RECENT_EXEC_FINISHED_RUNS = 2e3;
const NODE_PRESENCE_PERSIST_MIN_INTERVAL_MS = 6e4;
const MAX_RECENT_NODE_PRESENCE_KEYS = 1024;
const recentVoiceTranscripts = /* @__PURE__ */ new Map();
const pendingVoiceTranscriptReservations = /* @__PURE__ */ new Map();
const recentExecFinishedRuns = /* @__PURE__ */ new Map();
const recentNodePresencePersistAt = /* @__PURE__ */ new Map();
function normalizeFiniteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : null;
}
function dispatchNodeAgentCommand(ctx, nodeId, input, isConnectionCurrent, onAdmissionRejected) {
	runWithGatewayIndependentRootWorkContinuation(async () => {
		if (isConnectionCurrent && !await isConnectionCurrent()) {
			await onAdmissionRejected?.();
			return;
		}
		await agentCommandFromIngress(input, defaultRuntime, ctx.deps);
	}, "node-events:agent-turn").catch((err) => {
		ctx.logGateway.warn(`agent failed node=${nodeId}: ${formatForLog(err)}`);
	});
}
function resolveVoiceTranscriptFingerprint(obj, text) {
	const eventId = normalizeOptionalString(obj.eventId) ?? normalizeOptionalString(obj.providerEventId) ?? normalizeOptionalString(obj.transcriptId);
	if (eventId) return `event:${eventId}`;
	const callId = normalizeOptionalString(obj.providerCallId) ?? normalizeOptionalString(obj.callId);
	const sequence = normalizeFiniteInteger(obj.sequence) ?? normalizeFiniteInteger(obj.seq);
	if (callId && sequence !== null) return `call-seq:${callId}:${sequence}`;
	const eventTimestamp = normalizeFiniteInteger(obj.timestamp) ?? normalizeFiniteInteger(obj.ts) ?? normalizeFiniteInteger(obj.eventTimestamp);
	if (callId && eventTimestamp !== null) return `call-ts:${callId}:${eventTimestamp}`;
	if (eventTimestamp !== null) return `timestamp:${eventTimestamp}|text:${text}`;
	return `text:${text}`;
}
function shouldDropDuplicateVoiceTranscript(params) {
	const previous = recentVoiceTranscripts.get(params.sessionKey);
	if (previous && previous.fingerprint === params.fingerprint && params.now - previous.ts <= VOICE_TRANSCRIPT_DEDUPE_WINDOW_MS) return true;
	recentVoiceTranscripts.set(params.sessionKey, {
		fingerprint: params.fingerprint,
		ts: params.now
	});
	if (recentVoiceTranscripts.size > MAX_RECENT_VOICE_TRANSCRIPTS) {
		const cutoff = params.now - VOICE_TRANSCRIPT_DEDUPE_WINDOW_MS * 2;
		for (const [key, value] of recentVoiceTranscripts) {
			if (value.ts < cutoff) recentVoiceTranscripts.delete(key);
			if (recentVoiceTranscripts.size <= MAX_RECENT_VOICE_TRANSCRIPTS) break;
		}
		pruneMapToMaxSize(recentVoiceTranscripts, MAX_RECENT_VOICE_TRANSCRIPTS);
	}
	return false;
}
function reserveVoiceTranscript(params) {
	const decision = createDeferredCore();
	const reservation = {
		fingerprint: params.fingerprint,
		receivedAt: params.receivedAt,
		status: "pending",
		resolve: decision.resolve,
		rejectDecision: decision.reject,
		decision: decision.promise
	};
	const queue = pendingVoiceTranscriptReservations.get(params.sessionKey) ?? [];
	queue.push(reservation);
	pendingVoiceTranscriptReservations.set(params.sessionKey, queue);
	const drain = () => {
		while (queue[0]?.status === "rejected") {
			const next = queue.shift();
			if (!next) break;
			next.resolve(null);
		}
		const next = queue[0];
		if (!next) {
			pendingVoiceTranscriptReservations.delete(params.sessionKey);
			return;
		}
		if (next.status !== "ready") return;
		next.status = "checking";
		(async () => {
			try {
				const admission = (next.isConnectionCurrent ? await next.isConnectionCurrent() : true) && !shouldDropDuplicateVoiceTranscript({
					sessionKey: params.sessionKey,
					fingerprint: next.fingerprint,
					now: next.receivedAt
				}) && next.start ? { work: next.start() } : null;
				queue.shift();
				next.resolve(admission);
			} catch (err) {
				queue.shift();
				next.rejectDecision(err);
			}
			drain();
		})();
	};
	const settle = (status) => {
		if (reservation.status !== "pending") return;
		reservation.status = status;
		drain();
	};
	return {
		admit: ({ isConnectionCurrent, start }) => {
			reservation.isConnectionCurrent = isConnectionCurrent;
			reservation.start = start;
			settle("ready");
			return reservation.decision;
		},
		reject: () => settle("rejected")
	};
}
function dispatchReservedVoiceAgentCommand(params) {
	runWithGatewayIndependentRootWorkContinuation(async () => {
		if (params.isConnectionCurrent && !await params.isConnectionCurrent()) {
			params.reservation.reject();
			return;
		}
		const admission = await params.reservation.admit({
			isConnectionCurrent: params.isConnectionCurrent,
			start: () => {
				params.onStart();
				return agentCommandFromIngress(params.input, defaultRuntime, params.ctx.deps);
			}
		});
		if (!admission) return;
		await admission.work;
	}, "node-events:voice-turn").catch((err) => {
		params.reservation.reject();
		params.ctx.logGateway.warn(`agent failed node=${params.nodeId}: ${formatForLog(err)}`);
	});
}
function shouldDropDuplicateExecFinished(params) {
	const fingerprint = `${params.sessionKey}::${params.runId}`;
	const previousTs = recentExecFinishedRuns.get(fingerprint);
	if (typeof previousTs === "number" && params.now - previousTs <= EXEC_FINISHED_RUN_DEDUPE_WINDOW_MS) return true;
	recentExecFinishedRuns.set(fingerprint, params.now);
	pruneBoundedTimestampMap(recentExecFinishedRuns, {
		now: params.now,
		ttlMs: EXEC_FINISHED_RUN_DEDUPE_WINDOW_MS,
		maxEntries: MAX_RECENT_EXEC_FINISHED_RUNS
	});
	return false;
}
function pruneBoundedTimestampMap(map, params) {
	if (map.size <= params.maxEntries) return;
	const cutoff = params.now - params.ttlMs;
	for (const [key, ts] of map) {
		if (ts < cutoff) map.delete(key);
		if (map.size <= params.maxEntries) return;
	}
	pruneMapToMaxSize(map, params.maxEntries);
}
function compactNodeEventText(raw, maxChars) {
	return truncateUtf16WithEllipsis(raw.replace(/\s+/g, " ").trim(), maxChars);
}
async function touchSessionStore(params) {
	const { storePath } = params;
	if (!storePath) return;
	await upsertSessionEntryCore({
		sessionKey: params.canonicalKey,
		storePath
	}, {
		sessionId: params.sessionId,
		updatedAt: params.now,
		thinkingLevel: params.entry?.thinkingLevel,
		fastMode: params.entry?.fastMode,
		verboseLevel: params.entry?.verboseLevel,
		reasoningLevel: params.entry?.reasoningLevel,
		systemSent: params.entry?.systemSent,
		sendPolicy: params.entry?.sendPolicy,
		delivery: params.entry?.delivery
	});
}
function queueSessionStoreTouch(params) {
	runWithGatewayIndependentRootWorkContinuation(async () => {
		if (params.isConnectionCurrent && !await params.isConnectionCurrent()) return;
		await touchSessionStore(params);
	}, "node-events:voice-persist").catch((err) => {
		params.ctx.logGateway.warn("voice session-store update failed: " + formatForLog(err));
	});
}
async function isNodeEventConnectionCurrent(opts) {
	if (!opts?.isConnectionCurrent) return true;
	try {
		return await opts.isConnectionCurrent();
	} catch {
		return false;
	}
}
function pairingChangedResult(event) {
	return {
		ok: true,
		event,
		handled: false,
		reason: "pairing_changed"
	};
}
async function cleanupNodeEventMedia(media, ctx) {
	for (const { id } of media) try {
		await deleteMediaBuffer(id);
	} catch (cleanupErr) {
		ctx.logGateway.warn(`Failed to cleanup orphaned media ${id}: ${formatErrorMessage(cleanupErr)}`);
	}
}
function parsePayloadObject(payloadJSON) {
	return payloadJSON ? asNullableObjectRecord(safeParseJson(payloadJSON)) : null;
}
async function sendReceiptAck(params) {
	const resolved = resolveOutboundTarget({
		channel: params.channel,
		to: params.to,
		cfg: params.cfg,
		mode: "explicit"
	});
	if (!resolved.ok) throw new Error(String(resolved.error));
	const session = buildOutboundSessionContext({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
	const send = await sendDurableMessageBatchCore({
		cfg: params.cfg,
		channel: params.channel,
		to: resolved.to,
		payloads: [{ text: params.text }],
		session,
		bestEffort: true,
		durability: "best_effort",
		deps: createOutboundSendDeps(params.deps)
	});
	if (send.status === "failed") throw send.error;
}
const handleNodeEvent = async (ctx, nodeId, evt, opts) => {
	if (!await isNodeEventConnectionCurrent(opts)) return pairingChangedResult(evt.event);
	switch (evt.event) {
		case "node.desktop.availability": {
			const availability = parsePayloadObject(evt.payloadJSON);
			if (!Value.Check(DesktopAvailabilitySchema, availability)) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "invalid_payload"
			};
			const updated = ctx.updateNodeDesktopAvailability?.({
				nodeId,
				connId: opts?.connId,
				availability
			});
			if (updated === null || updated === void 0) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "stale_connection"
			};
			return {
				ok: true,
				event: evt.event,
				handled: true,
				reason: updated ? "updated" : "unchanged"
			};
		}
		case "voice.transcript": {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj) return;
			const text = normalizeOptionalString(obj.text) ?? "";
			if (!text) return;
			if (text.length > 2e4) return;
			const sessionKeyRaw = normalizeOptionalString(obj.sessionKey) ?? "";
			const cfg = getRuntimeConfig();
			const rawMainKey = normalizeMainKey(cfg.session?.mainKey);
			const sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : rawMainKey;
			const { storePath, entry, canonicalKey } = loadGatewaySessionEntry(sessionKey);
			if (resolveAgentHarnessSessionContextError(canonicalKey, entry)) return;
			const receivedAt = Date.now();
			const fingerprint = resolveVoiceTranscriptFingerprint(obj, text);
			const sessionId = entry?.sessionId ?? randomUUID();
			const runId = randomUUID();
			const transcriptReservation = reserveVoiceTranscript({
				sessionKey: canonicalKey,
				fingerprint,
				receivedAt
			});
			dispatchReservedVoiceAgentCommand({
				ctx,
				nodeId,
				input: {
					runId,
					message: text,
					sessionId,
					sessionKey: canonicalKey,
					thinking: "low",
					deliver: false,
					messageChannel: "node",
					inputProvenance: {
						kind: "external_user",
						sourceChannel: "voice",
						sourceTool: "gateway.voice.transcript"
					},
					allowModelOverride: false
				},
				reservation: transcriptReservation,
				isConnectionCurrent: opts?.isConnectionCurrent,
				onStart: () => {
					queueSessionStoreTouch({
						ctx,
						storePath,
						canonicalKey,
						entry,
						sessionId,
						now: receivedAt,
						isConnectionCurrent: opts?.isConnectionCurrent
					});
					ctx.addChatRun(runId, {
						sessionKey: canonicalKey,
						clientRunId: runId
					});
				}
			});
			return;
		}
		case "agent.request": {
			if (!evt.payloadJSON) return;
			let link;
			try {
				link = JSON.parse(evt.payloadJSON);
			} catch {
				return;
			}
			const sessionKeyRaw = (link?.sessionKey ?? "").trim();
			const sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : `node-${nodeId}`;
			const cfg = getRuntimeConfig();
			const { storePath, entry, canonicalKey } = loadGatewaySessionEntry(sessionKey);
			if (resolveAgentHarnessSessionContextError(canonicalKey, entry)) return;
			let message = (link?.message ?? "").trim();
			let transcriptMessage = message;
			const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(link?.attachments ?? void 0);
			let images = [];
			let imageOrder = [];
			let offloadedRefs = [];
			if (!message && normalizedAttachments.length === 0) return;
			if (message.length > 2e4) return;
			if (normalizedAttachments.length > 0) {
				const sessionAgentId = resolveSessionAgentId({
					sessionKey,
					config: cfg
				});
				const modelRef = resolveSessionModelRef(cfg, entry, sessionAgentId);
				const supportsInlineImages = await resolveGatewayModelSupportsImages({
					loadGatewayModelCatalog: ctx.loadGatewayModelCatalog,
					loadGatewayModelCatalogSnapshot: ctx.loadGatewayModelCatalogSnapshot,
					agentId: sessionAgentId,
					provider: modelRef.provider,
					model: modelRef.model
				});
				if (!await isNodeEventConnectionCurrent(opts)) return pairingChangedResult(evt.event);
				try {
					const parsed = await parseMessageWithAttachments(message, normalizedAttachments, {
						maxBytes: resolveChatAttachmentMaxBytes(cfg),
						log: ctx.logGateway,
						supportsInlineImages,
						acceptNonImage: false
					});
					if (!await isNodeEventConnectionCurrent(opts)) {
						await cleanupNodeEventMedia(parsed.offloadedRefs ?? [], ctx);
						return pairingChangedResult(evt.event);
					}
					message = parsed.message.trim();
					images = parsed.images;
					imageOrder = parsed.imageOrder;
					offloadedRefs = parsed.offloadedRefs;
					if (message.length > 2e4) {
						ctx.logGateway.warn(`agent.request message exceeds limit after attachment parsing (length=${message.length})`);
						if (parsed.offloadedRefs && parsed.offloadedRefs.length > 0) await cleanupNodeEventMedia(parsed.offloadedRefs, ctx);
						return;
					}
				} catch (err) {
					ctx.logGateway.warn(`agent.request attachment parse failed: ${formatErrorMessage(err)}`);
					return;
				}
			}
			if (!message && images.length === 0) return;
			const channelRaw = normalizeOptionalString(link?.channel) ?? "";
			let channel = normalizeAnyChannelId(channelRaw) ?? void 0;
			let to = normalizeOptionalString(link?.to);
			const deliverRequested = Boolean(link?.deliver);
			const wantsReceipt = Boolean(link?.receipt);
			const receiptText = normalizeOptionalString(link?.receiptText) || "Just received your iOS share + request, working on it.";
			const now = Date.now();
			const sessionId = entry?.sessionId ?? randomUUID();
			if (!await isNodeEventConnectionCurrent(opts)) {
				await cleanupNodeEventMedia(offloadedRefs ?? [], ctx);
				return pairingChangedResult(evt.event);
			}
			await touchSessionStore({
				storePath,
				canonicalKey,
				entry,
				sessionId,
				now
			});
			if (!await isNodeEventConnectionCurrent(opts)) {
				await cleanupNodeEventMedia(offloadedRefs ?? [], ctx);
				return pairingChangedResult(evt.event);
			}
			if (deliverRequested && (!channel || !to)) {
				const entryContext = deliveryContextFromSession(entry);
				const entryChannel = entryContext?.channel ? normalizeAnyChannelId(entryContext.channel) : void 0;
				const entryTo = normalizeOptionalString(entryContext?.to) ?? "";
				if (!channel && entryChannel) channel = entryChannel;
				if (!to && entryTo) to = entryTo;
			}
			const deliver = deliverRequested && Boolean(channel && to);
			const deliveryChannel = deliver ? channel : void 0;
			const deliveryTo = deliver ? to : void 0;
			if (deliverRequested && !deliver) ctx.logGateway.warn(`agent delivery disabled node=${nodeId}: missing session delivery route (channel=${channel ?? "-"} to=${to ?? "-"})`);
			if (!await isNodeEventConnectionCurrent(opts)) {
				await cleanupNodeEventMedia(offloadedRefs ?? [], ctx);
				return pairingChangedResult(evt.event);
			}
			const persistedTranscriptMedia = await persistInboundImagesForTranscript({
				images,
				offloadedRefs,
				log: ctx.logGateway,
				logContext: "agent.request"
			});
			if (!await isNodeEventConnectionCurrent(opts)) {
				await cleanupNodeEventMedia(persistedTranscriptMedia.entries, ctx);
				return pairingChangedResult(evt.event);
			}
			if (persistedTranscriptMedia.omission === "inline-image-save-failed") transcriptMessage = [transcriptMessage, INLINE_IMAGE_DURABLE_OMISSION_MARKER].filter(Boolean).join("\n");
			const transcriptMedia = persistedTranscriptMedia.entries.map((media) => media.fact);
			if (wantsReceipt && deliveryChannel && deliveryTo) runWithGatewayIndependentRootWorkContinuation(async () => {
				if (!await isNodeEventConnectionCurrent(opts)) return;
				await sendReceiptAck({
					cfg,
					deps: ctx.deps,
					sessionKey: canonicalKey,
					channel: deliveryChannel,
					to: deliveryTo,
					text: receiptText
				});
			}, "node-events:delivery").catch((err) => {
				ctx.logGateway.warn(`agent receipt failed node=${nodeId}: ${formatForLog(err)}`);
			});
			else if (wantsReceipt) ctx.logGateway.warn(`agent receipt skipped node=${nodeId}: missing delivery route (channel=${deliveryChannel ?? "-"} to=${deliveryTo ?? "-"})`);
			dispatchNodeAgentCommand(ctx, nodeId, {
				runId: sessionId,
				message,
				images,
				imageOrder,
				...transcriptMedia.length > 0 || persistedTranscriptMedia.omission === "inline-image-save-failed" ? {
					transcriptMessage,
					...transcriptMedia.length > 0 ? { transcriptMedia } : {}
				} : {},
				sessionId,
				sessionKey: canonicalKey,
				thinking: link?.thinking ?? void 0,
				deliver,
				to: deliveryTo,
				channel: deliveryChannel,
				timeout: typeof link?.timeoutSeconds === "number" ? link.timeoutSeconds.toString() : void 0,
				messageChannel: "node",
				allowModelOverride: false
			}, opts?.isConnectionCurrent, () => cleanupNodeEventMedia(persistedTranscriptMedia.entries, ctx));
			return;
		}
		case "notifications.changed": {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj) return;
			const change = normalizeLowercaseStringOrEmpty(obj.change);
			if (change !== "posted" && change !== "removed") return;
			const key = normalizeOptionalString(obj.key);
			if (!key) return;
			const requestedSessionKey = normalizeOptionalString(obj.sessionKey);
			let target;
			try {
				target = requestedSessionKey ? { sessionKey: requestedSessionKey } : resolveSystemMainSessionTarget(getRuntimeConfig());
			} catch (error) {
				ctx.logGateway.warn(`notification event not delivered node=${nodeId}: ${formatErrorMessage(error)}`);
				return;
			}
			const { canonicalKey: sessionKey, entry, agentId } = loadGatewaySessionEntry(target.sessionKey, { agentId: target.agentId });
			if (resolveAgentHarnessSessionContextError(sessionKey, entry)) return;
			const packageName = normalizeOptionalString(obj.packageName);
			const title = compactNodeEventText(normalizeOptionalString(obj.title) ?? "", MAX_NOTIFICATION_EVENT_TEXT_CHARS);
			const text = compactNodeEventText(normalizeOptionalString(obj.text) ?? "", MAX_NOTIFICATION_EVENT_TEXT_CHARS);
			let summary = `Notification ${change} (node=${nodeId} key=${key}`;
			if (packageName) summary += ` package=${packageName}`;
			summary += ")";
			if (change === "posted") {
				const messageParts = [title, text].filter(Boolean);
				if (messageParts.length > 0) summary += `: ${messageParts.join(" - ")}`;
			}
			if (enqueueSystemEvent(summary, withSystemEventOwner({
				sessionKey,
				contextKey: `notification:${key}`
			}, agentId))) requestSessionEventWake({
				source: "notifications-event",
				intent: "event",
				reason: "notifications-event",
				agentId,
				sessionKey
			});
			return;
		}
		case "chat.subscribe":
		case "chat.unsubscribe": {
			const sessionKey = normalizeOptionalString(parsePayloadObject(evt.payloadJSON)?.sessionKey);
			if (!sessionKey) return;
			const { canonicalKey } = loadGatewaySessionEntry(sessionKey);
			if (evt.event === "chat.subscribe") await ctx.nodeSubscribe(nodeId, canonicalKey, opts?.connId);
			else await ctx.nodeUnsubscribe(nodeId, canonicalKey, opts?.connId);
			return;
		}
		case "exec.started":
		case "exec.finished":
		case "exec.denied": {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj) return;
			const sessionKeyRaw = normalizeOptionalString(obj.sessionKey) ?? `node-${nodeId}`;
			const { canonicalKey: sessionKey, agentId } = loadGatewaySessionEntry(sessionKeyRaw);
			const cfg = getRuntimeConfig();
			const runId = normalizeOptionalString(obj.runId) ?? "";
			if (!ctx.authorizeNodeSystemRunEvent({
				nodeId,
				connId: opts?.connId,
				...runId ? { runId } : {},
				sessionKey: sessionKeyRaw,
				terminal: evt.event === "exec.finished" || evt.event === "exec.denied"
			})) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "unmatched_exec_event"
			};
			if (cfg.tools?.exec?.notifyOnExit === false || obj.suppressNotifyOnExit === true || evt.event === "exec.denied") return;
			const command = normalizeOptionalString(obj.command) ?? "";
			const exitCode = typeof obj.exitCode === "number" && Number.isFinite(obj.exitCode) ? obj.exitCode : void 0;
			const timedOut = obj.timedOut === true;
			const output = normalizeOptionalString(obj.output) ?? "";
			let text;
			if (evt.event === "exec.started") {
				text = `Exec started (node=${nodeId}${runId ? ` id=${runId}` : ""})`;
				if (command) text += `: ${command}`;
			} else {
				const exitLabel = timedOut ? "timeout" : `code ${exitCode ?? "?"}`;
				const compactOutput = compactNodeEventText(output, MAX_EXEC_EVENT_OUTPUT_CHARS);
				if (!(timedOut || exitCode !== 0 || compactOutput.length > 0)) return;
				if (runId && shouldDropDuplicateExecFinished({
					sessionKey,
					runId,
					now: Date.now()
				})) return;
				text = `Exec finished (node=${nodeId}${runId ? ` id=${runId}` : ""}, ${exitLabel})`;
				if (compactOutput) text += `\n${compactOutput}`;
			}
			const eventRouting = resolveEventSessionRoutingPolicy({
				cfg,
				sessionKey
			});
			if (enqueueSystemEvent(text, withSystemEventOwner({
				sessionKey: resolveEventSessionKeyForPolicy(sessionKey, eventRouting),
				contextKey: runId ? `exec:${runId}` : "exec"
			}, agentId))) requestSessionEventWake(scopedHeartbeatWakeOptionsForPolicy(sessionKey, {
				source: "exec-event",
				intent: "event",
				reason: "exec-event",
				coalesceMs: 0,
				...isUnscopedSessionKeySentinel(sessionKey) ? { agentId } : {}
			}, eventRouting));
			return;
		}
		case "push.apns.register": {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj) return;
			return await registerNodeApnsEvent(ctx, nodeId, obj, opts) === "pairing-changed" ? pairingChangedResult(evt.event) : void 0;
		}
		case NODE_HOST_STATS_EVENT: {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj || !validateNodeHostStatsPayload(obj)) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "invalid_payload"
			};
			const hostStats = ctx.updateNodeHostStats?.({
				nodeId,
				connId: opts?.connId,
				stats: obj
			});
			if (!hostStats) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "stale_connection"
			};
			ctx.broadcast("node.hostStats", {
				nodeId,
				hostStats
			}, { dropIfSlow: true });
			return {
				ok: true,
				event: evt.event,
				handled: true,
				reason: "updated"
			};
		}
		case NODE_PRESENCE_ACTIVITY_EVENT: {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj || !validateNodePresenceActivityPayload(obj)) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "invalid_payload"
			};
			if ("action" in obj) {
				const cleared = ctx.clearNodePresenceActivity?.({
					nodeId,
					connId: opts?.connId
				});
				if (cleared === null || cleared === void 0) return {
					ok: true,
					event: evt.event,
					handled: false,
					reason: "stale_connection"
				};
				if (cleared) ctx.broadcast("node.presence", {
					nodeId,
					lastActiveAtMs: null,
					presenceUpdatedAtMs: null
				}, { dropIfSlow: true });
				return {
					ok: true,
					event: evt.event,
					handled: true,
					reason: cleared ? "cleared" : "already_clear"
				};
			}
			if (obj.source !== "app" && opts?.presenceAllowed !== true) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "permission_required"
			};
			const updated = ctx.updateNodePresenceActivity?.({
				nodeId,
				connId: opts?.connId,
				...obj
			});
			if (!updated) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "stale_connection"
			};
			ctx.broadcast("node.presence", {
				nodeId,
				...updated
			}, { dropIfSlow: true });
			return {
				ok: true,
				event: evt.event,
				handled: true,
				reason: "updated"
			};
		}
		case NODE_PRESENCE_ALIVE_EVENT: {
			const obj = parsePayloadObject(evt.payloadJSON);
			if (!obj) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "invalid_payload"
			};
			const deviceId = normalizeOptionalString(opts?.deviceId);
			if (!deviceId) return {
				ok: true,
				event: evt.event,
				handled: false,
				reason: "missing_device_identity"
			};
			const pairingGeneration = opts?.pairingGeneration;
			if (!pairingGeneration || pairingGeneration.nodeId !== deviceId) return pairingChangedResult(evt.event);
			const now = Date.now();
			const presenceOwnerKey = `${deviceId}\0${pairingGeneration.key}`;
			if (now - (recentNodePresencePersistAt.get(presenceOwnerKey) ?? 0) < NODE_PRESENCE_PERSIST_MIN_INTERVAL_MS) return {
				ok: true,
				event: evt.event,
				handled: true,
				reason: "throttled"
			};
			const lastSeenReason = normalizeNodePresenceAliveReason(obj.trigger);
			try {
				if (!await updatePairedDevicePresence(deviceId, {
					lastSeenAtMs: now,
					lastSeenReason
				}, pairingGeneration)) return pairingChangedResult(evt.event);
				recentNodePresencePersistAt.set(presenceOwnerKey, now);
				pruneBoundedTimestampMap(recentNodePresencePersistAt, {
					now,
					ttlMs: NODE_PRESENCE_PERSIST_MIN_INTERVAL_MS * 10,
					maxEntries: MAX_RECENT_NODE_PRESENCE_KEYS
				});
				return {
					ok: true,
					event: evt.event,
					handled: true,
					reason: "persisted"
				};
			} catch (err) {
				ctx.logGateway.warn(`node presence alive failed node=${nodeId}: ${formatForLog(err)}`);
				return {
					ok: true,
					event: evt.event,
					handled: false,
					reason: "persist_failed"
				};
			}
		}
		default: return {
			ok: true,
			event: evt.event,
			handled: false,
			reason: "unsupported_event"
		};
	}
};
//#endregion
export { handleNodeEvent };
