import { a as listNostrAccountIds, c as normalizePubkey, n as nostrSetupContract, o as resolveDefaultNostrAccountId, r as nostrSetupWizard, s as resolveNostrAccount } from "./setup-surface-Dx8QxWSP.mjs";
import { a as collectStatusIssuesFromLastError, i as buildChannelConfigSchema, n as NostrProfileSchema, o as createDefaultChannelRuntimeState, r as DEFAULT_ACCOUNT_ID, s as formatPairingApproveHint, t as NostrConfigSchema } from "./config-schema-CkYd8ACn.mjs";
import { c as validatePrivateKey, l as DEFAULT_RELAYS } from "./setup-adapter-KJ_iGKiG.mjs";
import { t as normalizeNostrStateAccountId } from "./state-account-id-CvBZ9s6P.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageAdapterFromOutbound, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { buildPassiveChannelStatusSummary, buildTrafficStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createComputedAccountStatusAdapter } from "openclaw/plugin-sdk/status-helpers";
import { isRecord as isNostrIngressRecord, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { SimplePool, finalizeEvent, getPublicKey, verifyEvent } from "nostr-tools";
import { decrypt, encrypt } from "nostr-tools/nip04";
import { createDirectDmPreCryptoGuardPolicy } from "openclaw/plugin-sdk/direct-dm-guard-policy";
import { createFixedWindowRateLimiter } from "openclaw/plugin-sdk/webhook-ingress";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { buildChannelOutboundSessionRoute, stripChannelTargetPrefix } from "openclaw/plugin-sdk/core";
//#region extensions/nostr/src/metrics.ts
function createZeroMetricsState() {
	return {
		eventsReceived: 0,
		eventsProcessed: 0,
		eventsDuplicate: 0,
		eventsRejected: {
			invalidShape: 0,
			wrongKind: 0,
			stale: 0,
			future: 0,
			rateLimited: 0,
			invalidSignature: 0,
			oversizedCiphertext: 0,
			oversizedPlaintext: 0,
			decryptFailed: 0,
			selfMessage: 0
		},
		relays: /* @__PURE__ */ new Map(),
		rateLimiting: {
			perSenderHits: 0,
			globalHits: 0
		},
		decrypt: {
			success: 0,
			failure: 0
		},
		memory: {
			seenTrackerSize: 0,
			rateLimiterEntries: 0
		}
	};
}
function createMetricsSnapshot(state, snapshotAt) {
	const relays = {};
	for (const [url, stats] of state.relays) relays[url] = {
		...stats,
		messagesReceived: { ...stats.messagesReceived }
	};
	return {
		...state,
		eventsRejected: { ...state.eventsRejected },
		relays,
		rateLimiting: { ...state.rateLimiting },
		decrypt: { ...state.decrypt },
		memory: { ...state.memory },
		snapshotAt: snapshotAt ?? Date.now()
	};
}
/**
* Create a metrics collector instance.
* Optionally pass an onMetric callback to receive real-time metric events.
*/
function createMetrics(onMetric) {
	let state = createZeroMetricsState();
	function getOrCreateRelay(url) {
		let relay = state.relays.get(url);
		if (!relay) {
			relay = {
				connects: 0,
				disconnects: 0,
				reconnects: 0,
				errors: 0,
				messagesReceived: {
					event: 0,
					eose: 0,
					closed: 0,
					notice: 0,
					ok: 0,
					auth: 0
				},
				circuitBreakerState: "closed",
				circuitBreakerOpens: 0,
				circuitBreakerCloses: 0
			};
			state.relays.set(url, relay);
		}
		return relay;
	}
	function emit(name, value = 1, labels) {
		if (onMetric) onMetric({
			name,
			value,
			timestamp: Date.now(),
			labels
		});
		const relayUrl = labels?.relay;
		switch (name) {
			case "event.received":
				state.eventsReceived += value;
				break;
			case "event.processed":
				state.eventsProcessed += value;
				break;
			case "event.duplicate":
				state.eventsDuplicate += value;
				break;
			case "event.rejected.invalid_shape":
				state.eventsRejected.invalidShape += value;
				break;
			case "event.rejected.wrong_kind":
				state.eventsRejected.wrongKind += value;
				break;
			case "event.rejected.stale":
				state.eventsRejected.stale += value;
				break;
			case "event.rejected.future":
				state.eventsRejected.future += value;
				break;
			case "event.rejected.rate_limited":
				state.eventsRejected.rateLimited += value;
				break;
			case "event.rejected.invalid_signature":
				state.eventsRejected.invalidSignature += value;
				break;
			case "event.rejected.oversized_ciphertext":
				state.eventsRejected.oversizedCiphertext += value;
				break;
			case "event.rejected.oversized_plaintext":
				state.eventsRejected.oversizedPlaintext += value;
				break;
			case "event.rejected.decrypt_failed":
				state.eventsRejected.decryptFailed += value;
				break;
			case "event.rejected.self_message":
				state.eventsRejected.selfMessage += value;
				break;
			case "relay.connect":
				if (relayUrl) getOrCreateRelay(relayUrl).connects += value;
				break;
			case "relay.disconnect":
				if (relayUrl) getOrCreateRelay(relayUrl).disconnects += value;
				break;
			case "relay.reconnect":
				if (relayUrl) getOrCreateRelay(relayUrl).reconnects += value;
				break;
			case "relay.error":
				if (relayUrl) getOrCreateRelay(relayUrl).errors += value;
				break;
			case "relay.message.event":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.event += value;
				break;
			case "relay.message.eose":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.eose += value;
				break;
			case "relay.message.closed":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.closed += value;
				break;
			case "relay.message.notice":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.notice += value;
				break;
			case "relay.message.ok":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.ok += value;
				break;
			case "relay.message.auth":
				if (relayUrl) getOrCreateRelay(relayUrl).messagesReceived.auth += value;
				break;
			case "relay.circuit_breaker.open":
				if (relayUrl) {
					const r = getOrCreateRelay(relayUrl);
					r.circuitBreakerState = "open";
					r.circuitBreakerOpens += value;
				}
				break;
			case "relay.circuit_breaker.close":
				if (relayUrl) {
					const r = getOrCreateRelay(relayUrl);
					r.circuitBreakerState = "closed";
					r.circuitBreakerCloses += value;
				}
				break;
			case "relay.circuit_breaker.half_open":
				if (relayUrl) getOrCreateRelay(relayUrl).circuitBreakerState = "half_open";
				break;
			case "rate_limit.per_sender":
				state.rateLimiting.perSenderHits += value;
				break;
			case "rate_limit.global":
				state.rateLimiting.globalHits += value;
				break;
			case "decrypt.success":
				state.decrypt.success += value;
				break;
			case "decrypt.failure":
				state.decrypt.failure += value;
				break;
			case "memory.seen_tracker_size":
				state.memory.seenTrackerSize = value;
				break;
			case "memory.rate_limiter_entries": state.memory.rateLimiterEntries = value;
		}
	}
	function getSnapshot() {
		return createMetricsSnapshot(state);
	}
	function reset() {
		state = createZeroMetricsState();
	}
	return {
		emit,
		getSnapshot,
		reset
	};
}
/**
* Create a no-op metrics instance (for when metrics are disabled).
*/
function createNoopMetrics() {
	const emptySnapshot = createMetricsSnapshot(createZeroMetricsState(), 0);
	return {
		emit: () => {},
		getSnapshot: () => ({
			...emptySnapshot,
			snapshotAt: Date.now()
		}),
		reset: () => {}
	};
}
//#endregion
//#region extensions/nostr/src/nostr-cursor.ts
const CURSOR_WRITE_RETRY_MS = [
	0,
	100,
	300
];
const CURSOR_RECOVERY_RETRY_MS = 1e3;
/** Tracks the largest EOSE-safe Nostr timestamp without skipping undurable relay events. */
function createNostrDurableCursor(options) {
	const nowSec = options.nowSec ?? (() => Math.floor(Date.now() / 1e3));
	let durableCandidate;
	let transientReplayCeiling;
	let backfillComplete = false;
	const safeCandidate = () => {
		if (durableCandidate === void 0) return;
		return Math.min(durableCandidate, transientReplayCeiling ?? Number.MAX_SAFE_INTEGER);
	};
	return {
		recordDurableAppend: (event) => {
			if (!Number.isSafeInteger(event.created_at)) return;
			const previousSafeCandidate = safeCandidate();
			durableCandidate = Math.max(durableCandidate ?? 0, Math.min(event.created_at, nowSec()));
			const nextSafeCandidate = safeCandidate();
			return backfillComplete && nextSafeCandidate !== previousSafeCandidate ? nextSafeCandidate : void 0;
		},
		recordTransientRejection: (event) => {
			if (!Number.isSafeInteger(event.created_at) || event.created_at < options.since) return;
			const previousSafeCandidate = safeCandidate();
			transientReplayCeiling = Math.min(transientReplayCeiling ?? Number.MAX_SAFE_INTEGER, event.created_at + options.replayOverlapSec);
			const nextSafeCandidate = safeCandidate();
			return backfillComplete && nextSafeCandidate !== previousSafeCandidate ? nextSafeCandidate : void 0;
		},
		markBackfillComplete: () => {
			backfillComplete = true;
			return safeCandidate();
		}
	};
}
/** Serializes cursor writes so a safety rewind always lands after older progress writes. */
function createNostrCursorStateWriter(options) {
	let desiredCursor = Math.max(options.minimumCursor, options.initialCursor);
	let dirty = false;
	let timer;
	let writeTail = Promise.resolve();
	let activeFlush;
	let recoveryFlush;
	const writeWithRetry = async (cursor) => {
		try {
			await retryAsync(() => options.write(cursor), {
				attempts: CURSOR_WRITE_RETRY_MS.length,
				minDelayMs: 0,
				delayMs: ({ attempt }) => CURSOR_WRITE_RETRY_MS[attempt] ?? 0,
				sleep: (delayMs) => sleepWithAbort(delayMs)
			});
		} catch (error) {
			throw new Error("Nostr cursor state write failed.", { cause: error });
		}
	};
	const enqueueWrite = (cursor) => {
		const write = writeTail.then(() => writeWithRetry(cursor));
		writeTail = write.catch(() => void 0);
		return write;
	};
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const runFlush = async () => {
		for (;;) {
			if (!dirty) {
				await writeTail;
				if (!dirty) return;
			}
			dirty = false;
			const cursor = desiredCursor;
			try {
				await enqueueWrite(cursor);
			} catch (error) {
				dirty = true;
				throw error;
			}
		}
	};
	const flush = () => {
		clearTimer();
		if (activeFlush) return activeFlush;
		const tracked = runFlush().finally(() => {
			if (activeFlush === tracked) activeFlush = void 0;
		});
		activeFlush = tracked;
		return tracked;
	};
	const setDesiredCursor = (cursor) => {
		desiredCursor = Math.max(options.minimumCursor, cursor);
		dirty = true;
	};
	return {
		schedule: (cursor) => {
			setDesiredCursor(cursor);
			clearTimer();
			timer = setTimeout(() => {
				timer = void 0;
				flush().catch((error) => options.onBackgroundError?.(error));
			}, options.debounceMs);
			timer.unref?.();
		},
		persistNow: async (cursor) => {
			setDesiredCursor(cursor);
			await flush();
		},
		flush,
		flushUntilSuccess: () => {
			recoveryFlush ??= (async () => {
				for (;;) try {
					await flush();
					return;
				} catch (error) {
					options.onBackgroundError?.(error);
					await sleepWithAbort(CURSOR_RECOVERY_RETRY_MS);
				}
			})().finally(() => {
				recoveryFlush = void 0;
			});
			return recoveryFlush;
		}
	};
}
var NostrIngressPermanentError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.name = "NostrIngressPermanentError";
	}
};
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value;
	throw new NostrIngressPermanentError("invalid-event", `Nostr event is missing ${field}.`);
}
function inspectNostrIngressEvent(event) {
	if (!isNostrIngressRecord(event)) throw new NostrIngressPermanentError("invalid-event", "Nostr event must be an object.");
	return {
		eventId: requiredString(event.id, "id"),
		laneKey: `direct:${requiredString(event.pubkey, "pubkey")}`
	};
}
/** Convert the retired persisted LRU seed into durable completion tombstones. */
async function migrateNostrLegacyRecentEventIds(params) {
	const migratedAt = params.migratedAt ?? Date.now();
	let migrated = 0;
	for (const eventId of new Set(params.eventIds)) {
		if (!eventId.trim()) continue;
		const result = await params.queue.enqueue(eventId, {
			version: 1,
			receivedAt: migratedAt,
			rawEvent: ""
		}, {
			receivedAt: migratedAt,
			laneKey: `legacy:${eventId}`
		});
		if (result.kind === "accepted" || result.kind === "pending" && result.record.payload.rawEvent === "") {
			if (!await params.queue.complete(eventId, { completedAt: migratedAt })) throw new Error(`Failed to migrate Nostr replay event ${eventId}.`);
		}
		migrated += 1;
	}
	return migrated;
}
//#endregion
//#region extensions/nostr/src/runtime.ts
const { setRuntime: setNostrRuntime, getRuntime: getNostrRuntime } = createPluginRuntimeStore({
	pluginId: "nostr",
	errorMessage: "Nostr runtime not initialized"
});
//#endregion
//#region extensions/nostr/src/nostr-ingress.ts
const NOSTR_INGRESS_POLL_INTERVAL_MS = 500;
const NOSTR_INGRESS_APPEND_RETRY_MS = [
	0,
	100,
	300
];
const NostrIngressAdmissionRejectedError = createChannelIngressError("NostrIngressAdmissionRejectedError", { withReason: true });
function deserializeNostrIngressEvent(rawEvent, claimedId) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claimedId} contains invalid JSON.`, { cause: error });
	}
	if (!isNostrIngressRecord(parsed)) throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claimedId} has an invalid event shape.`);
	if (typeof parsed.kind !== "number" || typeof parsed.created_at !== "number" || typeof parsed.content !== "string" || typeof parsed.sig !== "string" || !Array.isArray(parsed.tags)) throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claimedId} has an invalid event shape.`);
	return parsed;
}
function createNostrIngress(options) {
	let queue = options.queue;
	let admissionFailure;
	let admissionWindowStartedAt = Date.now();
	let admissionWindowCount = 0;
	let queuedAdmissions = 0;
	let stopping = false;
	let stopTask;
	const createStoppedError = () => /* @__PURE__ */ new Error("Nostr ingress stopped");
	const getQueue = () => {
		queue ??= getNostrRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
		return queue;
	};
	const monitor = createChannelIngressMonitor({
		queue: getQueue,
		inspect: (event) => {
			const facts = inspectNostrIngressEvent(event);
			return {
				eventId: facts.eventId,
				laneKey: facts.laneKey
			};
		},
		payload: {
			version: 1,
			serialize: (event, { receivedAt }) => ({
				receivedAt,
				rawEvent: JSON.stringify(event)
			}),
			deserialize: (body, { claim }) => deserializeNostrIngressEvent(body.rawEvent, claim.id),
			encode: ({ body }) => ({
				version: 1,
				...body
			}),
			decode: (payload, { claim }) => {
				if (typeof payload !== "object" || payload === null || typeof payload.rawEvent !== "string") throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claim.id} has an invalid payload.`);
				return {
					version: payload.version,
					body: {
						receivedAt: typeof payload.receivedAt === "number" ? payload.receivedAt : 0,
						rawEvent: payload.rawEvent
					}
				};
			},
			createClaimError: (kind, claim) => new NostrIngressPermanentError("invalid-event", kind === "invalid-version" ? `Nostr ingress row ${claim.id} has an unsupported version.` : `Nostr ingress row ${claim.id} changed event identity.`)
		},
		deliver: (event, lifecycle) => options.deliver(event, lifecycle),
		pollIntervalMs: options.pollIntervalMs ?? NOSTR_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e5,
			failedMaxEntries: 1e5
		},
		drain: {
			adoptionStallTimeoutMs: options.adoptionStallTimeoutMs ?? DEFAULT_INGRESS_ADOPTION_STALL_MS,
			resolveNonRetryableFailure: (error) => error instanceof NostrIngressPermanentError ? {
				reason: error.reason,
				message: error.message
			} : null,
			onLog: (message) => options.onError?.(new Error(message), "ingress drain")
		},
		createStoppedError,
		onError: (error) => options.onError?.(error, "ingress drain")
	});
	const monitorStart = (async () => {
		monitor.ensureQueueAvailable();
		await migrateNostrLegacyRecentEventIds({
			queue: getQueue(),
			eventIds: options.legacyEventIds ?? []
		});
		if (!stopping) monitor.start();
	})();
	monitorStart.catch((error) => options.onError?.(error, "ingress drain"));
	let admissionTail = Promise.resolve();
	const prepareAdmission = (event) => {
		const facts = inspectNostrIngressEvent(event);
		const receivedAt = Date.now();
		if (receivedAt - admissionWindowStartedAt >= options.admissionRateLimit.windowMs) {
			admissionWindowStartedAt = receivedAt;
			admissionWindowCount = 0;
		}
		if (admissionWindowCount >= options.admissionRateLimit.maxEvents) throw new NostrIngressAdmissionRejectedError("rate-limited", "Nostr event exceeds the durable admission rate.");
		admissionWindowCount += 1;
		if (queuedAdmissions >= options.maxQueuedAdmissions) throw new NostrIngressAdmissionRejectedError("backpressure", "Nostr event exceeds the in-memory admission backlog.");
		let payload;
		let serializedPayload;
		try {
			payload = {
				version: 1,
				receivedAt,
				rawEvent: JSON.stringify(event)
			};
			serializedPayload = JSON.stringify(payload);
		} catch (error) {
			throw new NostrIngressPermanentError("invalid-event", "Nostr event could not be serialized for durable ingress.", { cause: error });
		}
		if (Buffer.byteLength(serializedPayload, "utf8") > options.maxSerializedPayloadBytes) throw new NostrIngressAdmissionRejectedError("oversized-event", "Nostr event exceeds the durable ingress size limit.");
		return {
			event,
			facts,
			receivedAt,
			payload
		};
	};
	const admitOnce = async (prepared) => {
		await monitorStart;
		const pending = await getQueue().listPending({ limit: options.maxPendingEvents });
		const claims = await getQueue().listClaims();
		if (pending.length + claims.length >= options.maxPendingEvents) throw new NostrIngressAdmissionRejectedError("backpressure", "Nostr event exceeds the durable ingress backlog.");
		try {
			return await retryAsync(async () => {
				const result = await getQueue().enqueue(prepared.facts.eventId, prepared.payload, {
					receivedAt: prepared.receivedAt,
					laneKey: prepared.facts.laneKey
				});
				options.afterDurableAppend(prepared.event);
				monitor.requestDrain();
				return result.kind === "accepted" ? "accepted" : "duplicate";
			}, {
				attempts: NOSTR_INGRESS_APPEND_RETRY_MS.length,
				minDelayMs: 0,
				delayMs: ({ attempt }) => NOSTR_INGRESS_APPEND_RETRY_MS[attempt] ?? 0,
				sleep: (delayMs) => sleepWithAbort(delayMs)
			});
		} catch (error) {
			throw new Error(`Nostr durable admission failed: ${formatErrorMessage(error)}`, { cause: error });
		}
	};
	return {
		ready: async () => {
			await monitorStart;
		},
		receive: (event) => {
			if (stopping) return Promise.reject(createStoppedError());
			let prepared;
			try {
				prepared = prepareAdmission(event);
			} catch (error) {
				return Promise.reject(error);
			}
			queuedAdmissions += 1;
			const settledAdmission = admissionTail.then(async () => {
				if (admissionFailure) throw admissionFailure;
				try {
					return await admitOnce(prepared);
				} catch (error) {
					if (error instanceof NostrIngressAdmissionRejectedError || error instanceof NostrIngressPermanentError) throw error;
					admissionFailure = error instanceof Error ? error : new Error(formatErrorMessage(error), { cause: error });
					throw admissionFailure;
				}
			}).finally(() => {
				queuedAdmissions -= 1;
			});
			admissionTail = settledAdmission.then(() => void 0, () => void 0);
			return settledAdmission;
		},
		stop: () => {
			if (stopTask) return stopTask;
			stopping = true;
			const pauseTask = monitor.pause();
			stopTask = (async () => {
				await admissionTail;
				await monitorStart.catch(() => void 0);
				await pauseTask;
				await monitor.stop();
			})();
			return stopTask;
		},
		waitForIdle: async () => {
			await admissionTail;
			await monitorStart;
			await monitor.waitForIdle();
		}
	};
}
//#endregion
//#region extensions/nostr/src/nostr-profile-core.ts
/**
* Convert our config profile schema to NIP-01 content format.
* Strips undefined fields and validates URLs.
*/
function profileToContent(profile) {
	const validated = NostrProfileSchema.parse(profile);
	const content = {};
	if (validated.name !== void 0) content.name = validated.name;
	if (validated.displayName !== void 0) content.display_name = validated.displayName;
	if (validated.about !== void 0) content.about = validated.about;
	if (validated.picture !== void 0) content.picture = validated.picture;
	if (validated.banner !== void 0) content.banner = validated.banner;
	if (validated.website !== void 0) content.website = validated.website;
	if (validated.nip05 !== void 0) content.nip05 = validated.nip05;
	if (validated.lud16 !== void 0) content.lud16 = validated.lud16;
	return content;
}
/**
* Convert NIP-01 content format back to our config profile schema.
* Useful for importing existing profiles from relays.
*/
function contentToProfile(content) {
	const profile = {};
	if (content.name !== void 0) profile.name = content.name;
	if (content.display_name !== void 0) profile.displayName = content.display_name;
	if (content.about !== void 0) profile.about = content.about;
	if (content.picture !== void 0) profile.picture = content.picture;
	if (content.banner !== void 0) profile.banner = content.banner;
	if (content.website !== void 0) profile.website = content.website;
	if (content.nip05 !== void 0) profile.nip05 = content.nip05;
	if (content.lud16 !== void 0) profile.lud16 = content.lud16;
	return profile;
}
//#endregion
//#region extensions/nostr/src/nostr-profile.ts
/**
* Nostr Profile Management (NIP-01 kind:0)
*
* Profile events are "replaceable" - the latest created_at wins.
* This module handles profile event creation and publishing.
*/
/**
* Create a signed kind:0 profile event.
*
* @param sk - Private key as Uint8Array (32 bytes)
* @param profile - Profile data to include
* @param lastPublishedAt - Previous profile timestamp (for monotonic guarantee)
* @returns Signed Nostr event
*/
function createProfileEvent(sk, profile, lastPublishedAt) {
	const content = profileToContent(profile);
	const contentJson = JSON.stringify(content);
	const now = Math.floor(Date.now() / 1e3);
	const createdAt = lastPublishedAt !== void 0 ? Math.max(now, lastPublishedAt + 1) : now;
	return finalizeEvent({
		kind: 0,
		content: contentJson,
		tags: [],
		created_at: createdAt
	}, sk);
}
/** Per-relay publish timeout (ms) */
const RELAY_PUBLISH_TIMEOUT_MS = 5e3;
/**
* Publish a profile event to multiple relays.
*
* Best-effort: publishes to all relays in parallel, reports per-relay results.
* Does NOT retry automatically - caller should handle retries if needed.
*
* @param pool - SimplePool instance for relay connections
* @param relays - Array of relay WebSocket URLs
* @param event - Signed profile event (kind:0)
* @returns Publish results with successes and failures
*/
async function publishProfileEvent(pool, relays, event) {
	const successes = [];
	const failures = [];
	const publishPromises = relays.map(async (relay) => {
		let timer;
		try {
			const timeoutPromise = new Promise((_, reject) => {
				timer = setTimeout(() => reject(/* @__PURE__ */ new Error("timeout")), RELAY_PUBLISH_TIMEOUT_MS);
			});
			await Promise.race([pool.publish([relay], event)[0], timeoutPromise]);
			successes.push(relay);
		} catch (err) {
			const errorMessage = formatErrorMessage(err);
			failures.push({
				relay,
				error: errorMessage
			});
		} finally {
			if (timer) clearTimeout(timer);
		}
	});
	await Promise.all(publishPromises);
	return {
		eventId: event.id,
		successes,
		failures,
		createdAt: event.created_at
	};
}
/**
* Create and publish a profile event in one call.
*
* @param pool - SimplePool instance
* @param sk - Private key as Uint8Array
* @param relays - Array of relay URLs
* @param profile - Profile data
* @param lastPublishedAt - Previous timestamp for monotonic ordering
* @returns Publish results
*/
async function publishProfile(pool, sk, relays, profile, lastPublishedAt) {
	return publishProfileEvent(pool, relays, createProfileEvent(sk, profile, lastPublishedAt));
}
//#endregion
//#region extensions/nostr/src/nostr-relay-subscription.ts
const DEFAULT_EOSE_CONFIRM_DEADLINE_MS = 1e4;
const LIBRARY_EOSE_TIMEOUT_MARGIN_MS = 1e3;
/** Separates real relay EOSE frames from nostr-tools timeout/close synthesis. */
function createNostrRelaySubscriptionGroup(options) {
	const relays = [...new Set(options.relays)];
	const subscriptions = [];
	const deadlineTimers = /* @__PURE__ */ new Set();
	let locallyClosing = false;
	const backfillStatus = new Map(relays.map((relay) => [relay, "pending"]));
	const confirmDeadlineMs = options.eoseConfirmDeadlineMs ?? DEFAULT_EOSE_CONFIRM_DEADLINE_MS;
	const settleBackfill = (relay, status) => {
		if (backfillStatus.get(relay) !== "pending") return;
		backfillStatus.set(relay, status);
		if ([...backfillStatus.values()].some((value) => value === "pending")) return;
		if ([...backfillStatus.values()].every((value) => value === "confirmed")) options.onBackfillComplete(relays);
	};
	const clearDeadlines = () => {
		for (const timer of deadlineTimers) clearTimeout(timer);
		deadlineTimers.clear();
	};
	return {
		start: () => {
			for (const relay of relays) {
				let relayClosed = false;
				let deadlineReached = false;
				const deadlineTimer = setTimeout(() => {
					deadlineTimers.delete(deadlineTimer);
					deadlineReached = true;
					settleBackfill(relay, "incomplete");
				}, confirmDeadlineMs);
				deadlineTimer.unref?.();
				deadlineTimers.add(deadlineTimer);
				subscriptions.push(options.pool.subscribeMany([relay], options.filter, {
					onevent: options.onEvent,
					oneose: () => {
						queueMicrotask(() => {
							if (!relayClosed && !deadlineReached) {
								clearTimeout(deadlineTimer);
								deadlineTimers.delete(deadlineTimer);
								settleBackfill(relay, "confirmed");
							}
						});
					},
					onclose: (reasons) => {
						relayClosed = true;
						clearTimeout(deadlineTimer);
						deadlineTimers.delete(deadlineTimer);
						settleBackfill(relay, "incomplete");
						if (!locallyClosing && !options.abort.aborted) options.onClose(relay, reasons.map(({ reason }) => reason));
					},
					maxWait: confirmDeadlineMs + LIBRARY_EOSE_TIMEOUT_MARGIN_MS,
					abort: options.abort
				}));
			}
		},
		close: async (reason) => {
			locallyClosing = true;
			clearDeadlines();
			await Promise.all(subscriptions.map(async (subscription) => subscription.close(reason)));
		}
	};
}
//#endregion
//#region extensions/nostr/src/nostr-state-store.ts
const STORE_VERSION = 2;
const PROFILE_STATE_VERSION = 1;
function openNostrBusStateStore(env) {
	return getNostrRuntime().state.openKeyedStore({
		namespace: "bus-state",
		maxEntries: 256,
		...env ? { env } : {}
	});
}
function openNostrProfileStateStore(env) {
	return getNostrRuntime().state.openKeyedStore({
		namespace: "profile-state",
		maxEntries: 256,
		...env ? { env } : {}
	});
}
async function readNostrBusState(params) {
	return await openNostrBusStateStore(params.env).lookup(normalizeNostrStateAccountId(params.accountId)) ?? null;
}
async function writeNostrBusState(params) {
	const payload = {
		version: STORE_VERSION,
		lastProcessedAt: params.lastProcessedAt,
		gatewayStartedAt: params.gatewayStartedAt,
		recentEventIds: (params.recentEventIds ?? []).filter((x) => typeof x === "string")
	};
	await openNostrBusStateStore(params.env).register(normalizeNostrStateAccountId(params.accountId), payload);
}
/**
* Determine the `since` timestamp for subscription.
* Returns the later of: lastProcessedAt or gatewayStartedAt (both from state),
* falling back to `now` for fresh starts.
*/
function computeSinceTimestamp(state, nowSec = Math.floor(Date.now() / 1e3)) {
	if (!state) return nowSec;
	const candidates = [state.lastProcessedAt, state.gatewayStartedAt].filter((t) => t !== null && t > 0);
	if (candidates.length === 0) return nowSec;
	return Math.max(...candidates);
}
async function readNostrProfileState(params) {
	return await openNostrProfileStateStore(params.env).lookup(normalizeNostrStateAccountId(params.accountId)) ?? null;
}
async function writeNostrProfileState(params) {
	const payload = {
		version: PROFILE_STATE_VERSION,
		lastPublishedAt: params.lastPublishedAt,
		lastPublishedEventId: params.lastPublishedEventId,
		lastPublishResults: params.lastPublishResults
	};
	await openNostrProfileStateStore(params.env).register(normalizeNostrStateAccountId(params.accountId), payload);
}
//#endregion
//#region extensions/nostr/src/nostr-bus.ts
const STARTUP_LOOKBACK_SEC = 120;
const STATE_PERSIST_DEBOUNCE_MS = 5e3;
const NOSTR_INGRESS_ENVELOPE_OVERHEAD_BYTES = 16384;
const NOSTR_INGRESS_MAX_PENDING_EVENTS = 1e3;
const DEFAULT_INBOUND_GUARD_POLICY = createDirectDmPreCryptoGuardPolicy();
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_RESET_MS = 3e4;
const HEALTH_WINDOW_MS = 6e4;
function createCircuitBreaker(relay, metrics, threshold = CIRCUIT_BREAKER_THRESHOLD, resetMs = CIRCUIT_BREAKER_RESET_MS) {
	const state = {
		state: "closed",
		failures: 0,
		lastFailure: 0,
		lastSuccess: Date.now()
	};
	return {
		canAttempt() {
			if (state.state === "closed") return true;
			if (state.state === "open") {
				if (Date.now() - state.lastFailure >= resetMs) {
					state.state = "half_open";
					metrics.emit("relay.circuit_breaker.half_open", 1, { relay });
					return true;
				}
				return false;
			}
			return true;
		},
		recordSuccess() {
			if (state.state === "half_open") {
				state.state = "closed";
				state.failures = 0;
				metrics.emit("relay.circuit_breaker.close", 1, { relay });
			} else if (state.state === "closed") state.failures = 0;
			state.lastSuccess = Date.now();
		},
		recordFailure() {
			state.failures++;
			state.lastFailure = Date.now();
			if (state.state === "half_open") {
				state.state = "open";
				metrics.emit("relay.circuit_breaker.open", 1, { relay });
			} else if (state.state === "closed" && state.failures >= threshold) {
				state.state = "open";
				metrics.emit("relay.circuit_breaker.open", 1, { relay });
			}
		},
		getState() {
			return state.state;
		}
	};
}
function createRelayHealthTracker() {
	const stats = /* @__PURE__ */ new Map();
	function getOrCreate(relay) {
		let s = stats.get(relay);
		if (!s) {
			s = {
				successCount: 0,
				failureCount: 0,
				latencySum: 0,
				latencyCount: 0,
				lastSuccess: 0,
				lastFailure: 0
			};
			stats.set(relay, s);
		}
		return s;
	}
	return {
		recordSuccess(relay, latencyMs) {
			const s = getOrCreate(relay);
			s.successCount++;
			s.latencySum += latencyMs;
			s.latencyCount++;
			s.lastSuccess = Date.now();
		},
		recordFailure(relay) {
			const s = getOrCreate(relay);
			s.failureCount++;
			s.lastFailure = Date.now();
		},
		getScore(relay) {
			const s = stats.get(relay);
			if (!s) return .5;
			const total = s.successCount + s.failureCount;
			if (total === 0) return .5;
			const successRate = s.successCount / total;
			const now = Date.now();
			const recencyBonus = s.lastSuccess > s.lastFailure ? Math.max(0, 1 - (now - s.lastSuccess) / HEALTH_WINDOW_MS) * .2 : 0;
			const avgLatency = s.latencyCount > 0 ? s.latencySum / s.latencyCount : 1e3;
			const latencyPenalty = Math.min(.2, avgLatency / 1e4);
			return Math.max(0, Math.min(1, successRate + recencyBonus - latencyPenalty));
		},
		getSortedRelays(relays) {
			return [...relays].toSorted((a, b) => this.getScore(b) - this.getScore(a));
		}
	};
}
/**
* Start the Nostr DM bus - subscribes to NIP-04 encrypted DMs
*/
async function startNostrBus(options) {
	const { privateKey, relays = DEFAULT_RELAYS, onMessage, authorizeSender, onError, onEose, onMetric } = options;
	const sk = validatePrivateKey(privateKey);
	const pk = getPublicKey(sk);
	const pool = new SimplePool();
	pool.onRelayConnectionSuccess = options.onConnect;
	const accountId = options.accountId ?? pk.slice(0, 16);
	const gatewayStartedAt = Math.floor(Date.now() / 1e3);
	const guardPolicy = createDirectDmPreCryptoGuardPolicy({
		...DEFAULT_INBOUND_GUARD_POLICY,
		...options.guardPolicy,
		rateLimit: {
			...DEFAULT_INBOUND_GUARD_POLICY.rateLimit,
			...options.guardPolicy?.rateLimit
		}
	});
	const metrics = onMetric ? createMetrics(onMetric) : createNoopMetrics();
	const circuitBreakers = /* @__PURE__ */ new Map();
	const healthTracker = createRelayHealthTracker();
	for (const relay of relays) circuitBreakers.set(relay, createCircuitBreaker(relay, metrics));
	const state = await readNostrBusState({ accountId });
	const baseSince = computeSinceTimestamp(state, gatewayStartedAt);
	const since = Math.max(0, baseSince - STARTUP_LOOKBACK_SEC);
	const cursorStartedAt = state?.gatewayStartedAt ?? gatewayStartedAt;
	const initialCursor = Math.max(baseSince, state?.lastProcessedAt ?? cursorStartedAt);
	const cursorWriter = createNostrCursorStateWriter({
		initialCursor,
		minimumCursor: baseSince,
		debounceMs: STATE_PERSIST_DEBOUNCE_MS,
		write: async (cursor) => {
			await writeNostrBusState({
				accountId,
				lastProcessedAt: cursor,
				gatewayStartedAt: cursorStartedAt,
				recentEventIds: []
			});
		},
		onBackgroundError: (error) => onError?.(error, "persist state")
	});
	const durableCursor = createNostrDurableCursor({
		since,
		replayOverlapSec: STARTUP_LOOKBACK_SEC
	});
	const perSenderRateLimiter = createFixedWindowRateLimiter({
		windowMs: guardPolicy.rateLimit.windowMs,
		maxRequests: guardPolicy.rateLimit.maxPerSenderPerWindow,
		maxTrackedKeys: guardPolicy.rateLimit.maxTrackedSenderKeys
	});
	const globalRateLimiter = createFixedWindowRateLimiter({
		windowMs: guardPolicy.rateLimit.windowMs,
		maxRequests: guardPolicy.rateLimit.maxGlobalPerWindow,
		maxTrackedKeys: 1
	});
	const updateRateLimiterSizeMetric = () => {
		metrics.emit("memory.rate_limiter_entries", perSenderRateLimiter.size() + globalRateLimiter.size());
	};
	const rejectIfGlobalRateLimited = () => {
		updateRateLimiterSizeMetric();
		if (globalRateLimiter.isRateLimited("global")) {
			metrics.emit("rate_limit.global");
			metrics.emit("event.rejected.rate_limited");
			updateRateLimiterSizeMetric();
			return true;
		}
		updateRateLimiterSizeMetric();
		return false;
	};
	const rejectIfVerifiedSenderRateLimited = (senderPubkey) => {
		updateRateLimiterSizeMetric();
		if (perSenderRateLimiter.isRateLimited(senderPubkey)) {
			metrics.emit("rate_limit.per_sender");
			metrics.emit("event.rejected.rate_limited");
			updateRateLimiterSizeMetric();
			return true;
		}
		updateRateLimiterSizeMetric();
		return false;
	};
	async function dispatchEvent(event, lifecycle) {
		if (event.pubkey === pk) {
			metrics.emit("event.rejected.self_message");
			return;
		}
		if (event.created_at > Math.floor(Date.now() / 1e3) + guardPolicy.maxFutureSkewSec) {
			metrics.emit("event.rejected.future");
			throw new Error(`Nostr event ${event.id} is too far in the future.`);
		}
		if (!guardPolicy.allowedKinds.includes(event.kind)) {
			metrics.emit("event.rejected.wrong_kind");
			return;
		}
		let targetsUs = false;
		for (const tag of event.tags) if (tag[0] === "p" && tag[1] === pk) {
			targetsUs = true;
			break;
		}
		if (!targetsUs) {
			metrics.emit("event.rejected.wrong_kind");
			return;
		}
		const replyTo = async (text) => {
			await sendEncryptedDm(pool, sk, event.pubkey, text, relays, metrics, circuitBreakers, healthTracker, onError, { replyToEventId: event.id });
		};
		if (Buffer.byteLength(event.content, "utf8") > guardPolicy.maxCiphertextBytes) {
			if (rejectIfGlobalRateLimited()) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
			metrics.emit("event.rejected.oversized_ciphertext");
			return;
		}
		if (rejectIfGlobalRateLimited()) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
		if (!verifyEvent(event)) {
			metrics.emit("event.rejected.invalid_signature");
			const error = new NostrIngressPermanentError("invalid-signature", `Nostr event ${event.id} has an invalid signature.`);
			onError?.(error, `event ${event.id}`);
			throw error;
		}
		if (rejectIfVerifiedSenderRateLimited(event.pubkey)) throw new Error(`Nostr sender ${event.pubkey} hit the rate limit.`);
		if (authorizeSender) {
			if (await authorizeSender({
				senderPubkey: event.pubkey,
				reply: replyTo
			}) !== "allow") return;
		}
		let plaintext;
		try {
			plaintext = decrypt(sk, event.pubkey, event.content);
			metrics.emit("decrypt.success");
		} catch (error) {
			metrics.emit("decrypt.failure");
			metrics.emit("event.rejected.decrypt_failed");
			onError?.(error, `decrypt from ${event.pubkey}`);
			throw new NostrIngressPermanentError("decrypt-failed", `Nostr event ${event.id} could not be decrypted.`, { cause: error });
		}
		if (Buffer.byteLength(plaintext, "utf8") > guardPolicy.maxPlaintextBytes) {
			metrics.emit("event.rejected.oversized_plaintext");
			return;
		}
		if (lifecycle.abortSignal.aborted) throw new Error(`Nostr event ${event.id} stopped before dispatch.`);
		await onMessage(event.pubkey, plaintext, replyTo, {
			eventId: event.id,
			createdAt: event.created_at
		}, lifecycle);
		metrics.emit("event.processed");
	}
	const dmFilter = {
		kinds: [4],
		"#p": [pk],
		since
	};
	const relayAbort = new AbortController();
	let relaySubscriptions;
	let relayStopPromise;
	const stopRelays = (reason) => {
		relayStopPromise ??= (async () => {
			relayAbort.abort(reason);
			try {
				await relaySubscriptions?.close(reason);
			} catch (error) {
				onError?.(error, "close subscription");
			} finally {
				try {
					pool.close(relays);
				} catch (error) {
					onError?.(error, "close relay pool");
				}
			}
		})();
		return relayStopPromise;
	};
	const ingress = createNostrIngress({
		accountId,
		legacyEventIds: state?.recentEventIds ?? [],
		maxSerializedPayloadBytes: guardPolicy.maxCiphertextBytes + NOSTR_INGRESS_ENVELOPE_OVERHEAD_BYTES,
		maxPendingEvents: NOSTR_INGRESS_MAX_PENDING_EVENTS,
		maxQueuedAdmissions: guardPolicy.rateLimit.maxGlobalPerWindow,
		admissionRateLimit: {
			windowMs: guardPolicy.rateLimit.windowMs,
			maxEvents: guardPolicy.rateLimit.maxGlobalPerWindow
		},
		afterDurableAppend: (event) => {
			const cursor = durableCursor.recordDurableAppend(event);
			if (cursor !== void 0) cursorWriter.schedule(cursor);
		},
		deliver: dispatchEvent,
		onError
	});
	const persistTransientReplayCursor = async (event) => {
		const cursor = durableCursor.recordTransientRejection(event);
		if (cursor !== void 0) await cursorWriter.persistNow(cursor);
	};
	const recoverCursorPersistence = async () => {
		await cursorWriter.flushUntilSuccess();
	};
	const handleRelayEvent = async (event) => {
		metrics.emit("event.received");
		if (typeof event.created_at === "number" && event.created_at < since) {
			metrics.emit("event.rejected.stale");
			return;
		}
		try {
			if (await ingress.receive(event) === "duplicate") metrics.emit("event.duplicate");
		} catch (error) {
			onError?.(error, `durable admission for event ${event.id}`);
			if (error instanceof NostrIngressAdmissionRejectedError) {
				if (error.reason === "rate-limited") {
					metrics.emit("rate_limit.global");
					metrics.emit("event.rejected.rate_limited");
				}
				if (error.reason !== "oversized-event") try {
					await persistTransientReplayCursor(event);
				} catch (cursorError) {
					onError?.(cursorError, "persist transient replay cursor");
					await stopRelays("cursor persistence failed");
					await recoverCursorPersistence();
				}
				return;
			}
			if (error instanceof NostrIngressPermanentError) return;
			let cursorPersistenceFailed = false;
			try {
				await persistTransientReplayCursor(event);
			} catch (cursorError) {
				onError?.(cursorError, "persist transient replay cursor");
				cursorPersistenceFailed = true;
			}
			await stopRelays("durable admission failed");
			if (cursorPersistenceFailed) await recoverCursorPersistence();
		}
	};
	let backfillFinalizePromise;
	try {
		await ingress.ready();
		await writeNostrBusState({
			accountId,
			lastProcessedAt: initialCursor,
			gatewayStartedAt: cursorStartedAt,
			recentEventIds: []
		});
		relaySubscriptions = createNostrRelaySubscriptionGroup({
			pool,
			relays,
			filter: dmFilter,
			abort: relayAbort.signal,
			onEvent: (event) => {
				const task = handleRelayEvent(event);
				if (options.trackIngressTask) options.trackIngressTask(task.then(() => ingress.waitForIdle()));
			},
			onBackfillComplete: (confirmedRelays) => {
				backfillFinalizePromise ??= ingress.waitForIdle().then(() => {
					const cursor = durableCursor.markBackfillComplete();
					if (cursor !== void 0) cursorWriter.schedule(cursor);
					for (const relay of confirmedRelays) metrics.emit("relay.message.eose", 1, { relay });
					onEose?.(confirmedRelays.join(", "));
				}).catch((error) => onError?.(error, "finalize relay backfill"));
			},
			onClose: (relay, reasons) => {
				metrics.emit("relay.message.closed", 1, { relay });
				options.onDisconnect?.(relay);
				onError?.(/* @__PURE__ */ new Error(`Subscription closed: ${reasons.join(", ")}`), "subscription");
			}
		});
		relaySubscriptions.start();
	} catch (error) {
		await Promise.allSettled([stopRelays("startup failed"), ingress.stop()]);
		throw error;
	}
	const sendDm = async (toPubkey, text, sendOptions) => {
		return await sendEncryptedDm(pool, sk, toPubkey, text, relays, metrics, circuitBreakers, healthTracker, onError, sendOptions);
	};
	const publishProfile$1 = async (profile) => {
		const lastPublishedAt = (await readNostrProfileState({ accountId }))?.lastPublishedAt ?? void 0;
		const result = await publishProfile(pool, sk, relays, profile, lastPublishedAt);
		const publishResults = {};
		for (const relay of result.successes) publishResults[relay] = "ok";
		for (const { relay, error } of result.failures) publishResults[relay] = error === "timeout" ? "timeout" : "failed";
		await writeNostrProfileState({
			accountId,
			lastPublishedAt: result.createdAt,
			lastPublishedEventId: result.eventId,
			lastPublishResults: publishResults
		});
		return result;
	};
	const getProfileState = async () => {
		const stateLocal = await readNostrProfileState({ accountId });
		return {
			lastPublishedAt: stateLocal?.lastPublishedAt ?? null,
			lastPublishedEventId: stateLocal?.lastPublishedEventId ?? null,
			lastPublishResults: stateLocal?.lastPublishResults ?? null
		};
	};
	let closePromise;
	const close = () => {
		closePromise ??= (async () => {
			await stopRelays("closed by caller");
			await ingress.stop();
			await backfillFinalizePromise;
			await cursorWriter.flushUntilSuccess();
			perSenderRateLimiter.clear();
			globalRateLimiter.clear();
		})();
		return closePromise;
	};
	return {
		close,
		publicKey: pk,
		sendDm,
		getMetrics: () => metrics.getSnapshot(),
		publishProfile: publishProfile$1,
		getProfileState
	};
}
/**
* Send an encrypted DM to a pubkey
*/
async function sendEncryptedDm(pool, sk, toPubkey, text, relays, metrics, circuitBreakers, healthTracker, onError, options) {
	const ciphertext = encrypt(sk, toPubkey, text);
	const tags = [["p", toPubkey]];
	if (options?.replyToEventId) tags.push(["e", options.replyToEventId]);
	const reply = finalizeEvent({
		kind: 4,
		content: ciphertext,
		tags,
		created_at: Math.floor(Date.now() / 1e3)
	}, sk);
	const sortedRelays = healthTracker.getSortedRelays(relays);
	let lastError;
	for (const relay of sortedRelays) {
		options?.assertDirectAdapterHandoff?.();
		const cb = circuitBreakers.get(relay);
		if (cb && !cb.canAttempt()) continue;
		const startTime = Date.now();
		const recordFailure = (err) => {
			lastError = err instanceof Error ? err : new Error(String(err));
			const latency = Date.now() - startTime;
			cb?.recordFailure();
			healthTracker.recordFailure(relay);
			metrics.emit("relay.error", 1, {
				relay,
				latency
			});
			onError?.(lastError, `publish to ${relay}`);
		};
		const connection = await pool.ensureRelay(relay, { connectionTimeout: pool.maxWaitForConnection }).catch((err) => {
			recordFailure(/* @__PURE__ */ new Error(`connection failure: ${String(err)}`));
		});
		if (!connection) continue;
		options?.assertDirectAdapterHandoff?.();
		if (options?.onPlatformSendDispatch) {
			await options.onPlatformSendDispatch();
			options.assertDirectAdapterHandoff?.();
		}
		try {
			await connection.publish(reply);
			const latency = Date.now() - startTime;
			cb?.recordSuccess();
			healthTracker.recordSuccess(relay, latency);
			return reply.id;
		} catch (err) {
			recordFailure(err);
		}
	}
	throw new Error(`Failed to publish to any relay: ${lastError?.message}`);
}
//#endregion
//#region extensions/nostr/src/gateway.ts
const activeBuses = /* @__PURE__ */ new Map();
const ACCESS_GROUP_PREFIX = "accessGroup:";
function normalizeRelayLifecycleKey(relay) {
	return new URL(relay).toString();
}
function parseNostrAccessGroupAllowFromEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed.startsWith(ACCESS_GROUP_PREFIX)) return null;
	return trimmed.slice(12).trim() || null;
}
function normalizeNostrAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	const accessGroup = parseNostrAccessGroupAllowFromEntry(trimmed);
	if (accessGroup) return `accessGroup:${accessGroup}`;
	try {
		return normalizePubkey(trimmed.replace(/^nostr:/i, ""));
	} catch {
		return null;
	}
}
function normalizeNostrSenderPubkey(value) {
	try {
		return normalizePubkey(value);
	} catch {
		return null;
	}
}
const nostrIngressIdentity = {
	key: "nostr-pubkey",
	normalizeEntry: normalizeNostrAllowEntry,
	normalizeSubject: normalizeNostrSenderPubkey,
	sensitivity: "pii",
	entryIdPrefix: "nostr-entry"
};
const startNostrGatewayAccount = async (ctx) => {
	const account = ctx.account;
	ctx.setStatus({
		accountId: account.accountId,
		publicKey: account.publicKey,
		lifecycle: "starting"
	});
	ctx.log?.info?.(`[${account.accountId}] starting Nostr provider (pubkey: ${account.publicKey})`);
	if (!account.configured) throw new Error("Nostr private key not configured");
	const channelRuntime = ctx.channelRuntime;
	if (!channelRuntime?.inbound?.buildContext) throw new Error("Nostr requires its registered channel runtime context builder");
	const runtime = getNostrRuntime();
	const pairing = createChannelPairingController({
		core: runtime,
		channel: "nostr",
		accountId: account.accountId
	});
	const resolveInboundAccess = async (senderPubkey, rawBody, contextBinding) => await channelRuntime.inbound.ingress.resolveStable({
		channelId: "nostr",
		accountId: account.accountId,
		identity: nostrIngressIdentity,
		cfg: ctx.cfg,
		useDefaultPairingStore: true,
		subject: { stableId: senderPubkey },
		conversation: {
			kind: "direct",
			id: senderPubkey
		},
		contextBinding,
		dmPolicy: account.config.dmPolicy ?? "pairing",
		allowFrom: account.config.allowFrom,
		command: runtime.channel.commands.shouldComputeCommandAuthorized(rawBody, ctx.cfg) ? { modeWhenAccessGroupsOff: "configured" } : void 0
	});
	const connectedRelays = /* @__PURE__ */ new Set();
	const authorizeSender = async (input) => {
		const resolved = await resolveInboundAccess(input.senderId, "");
		if (resolved.senderAccess.decision === "allow") return "allow";
		if (resolved.senderAccess.decision === "pairing") {
			await pairing.issueChallenge({
				senderId: input.senderId,
				senderIdLine: `Your Nostr pubkey: ${input.senderId}`,
				sendPairingReply: input.reply,
				onCreated: () => {
					ctx.log?.debug?.(`[${account.accountId}] nostr pairing request sender=${input.senderId}`);
				},
				onReplyError: (err) => {
					ctx.log?.warn?.(`[${account.accountId}] nostr pairing reply failed for ${input.senderId}: ${String(err)}`);
				}
			});
			return "pairing";
		}
		ctx.log?.debug?.(`[${account.accountId}] blocked Nostr sender ${input.senderId} (${resolved.senderAccess.reasonCode})`);
		return "block";
	};
	await runPassiveAccountLifecycle({
		abortSignal: ctx.abortSignal,
		start: async () => {
			const bus = await startNostrBus({
				accountId: account.accountId,
				privateKey: account.privateKey,
				relays: account.relays,
				authorizeSender: async ({ senderPubkey, reply }) => await authorizeSender({
					senderId: senderPubkey,
					reply
				}),
				onMessage: async (senderPubkey, text, reply, meta, lifecycle) => {
					const resolvedAccess = await resolveInboundAccess(senderPubkey, text);
					if (resolvedAccess.senderAccess.decision !== "allow") {
						ctx.log?.warn?.(`[${account.accountId}] dropping Nostr DM after preflight drift (${senderPubkey}, ${resolvedAccess.senderAccess.reasonCode})`);
						return;
					}
					const { dispatchInboundDirectDm } = await import("./inbound-direct-dm-runtime-DHn9NoYN.mjs");
					await dispatchInboundDirectDm({
						channelRuntime,
						resolveChannelIngress: async (contextBinding) => {
							const exactAccess = await resolveInboundAccess(senderPubkey, text, contextBinding);
							if (!exactAccess.senderAccess.allowed) throw new Error(`Nostr sender authorization changed before dispatch (${senderPubkey})`);
							return exactAccess;
						},
						cfg: ctx.cfg,
						channel: "nostr",
						channelLabel: "Nostr",
						accountId: account.accountId,
						peer: {
							kind: "direct",
							id: senderPubkey
						},
						senderId: senderPubkey,
						senderAddress: `nostr:${senderPubkey}`,
						recipientAddress: `nostr:${account.publicKey}`,
						conversationLabel: senderPubkey,
						rawBody: text,
						messageId: meta.eventId,
						timestamp: meta.createdAt * 1e3,
						commandAuthorized: resolvedAccess.commandAccess.requested ? resolvedAccess.commandAccess.authorized : void 0,
						turnAdoptionLifecycle: bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle,
						deliver: async (payload) => {
							const outboundText = payload && typeof payload === "object" && "text" in payload ? payload.text ?? "" : "";
							const sanitizedText = sanitizeAssistantVisibleText(outboundText);
							if (!sanitizedText) return;
							const tableMode = runtime.channel.text.resolveMarkdownTableMode({
								cfg: ctx.cfg,
								channel: "nostr",
								accountId: account.accountId
							});
							const message = stripMarkdown(runtime.channel.text.convertMarkdownTables(sanitizedText, tableMode));
							if (message) await reply(message);
						},
						onRecordError: (err) => {
							ctx.log?.error?.(`[${account.accountId}] failed recording Nostr inbound session: ${String(err)}`);
						},
						onDispatchError: (err, info) => {
							ctx.log?.error?.(`[${account.accountId}] Nostr ${info.kind} reply failed: ${String(err)}`);
						}
					});
				},
				onError: (error, context) => {
					ctx.log?.error?.(`[${account.accountId}] Nostr error (${context}): ${error.message}`);
				},
				onConnect: (relay) => {
					connectedRelays.add(normalizeRelayLifecycleKey(relay));
					ctx.setStatus(channelReadyPatch({ accountId: account.accountId }));
					ctx.log?.debug?.(`[${account.accountId}] Connected to relay: ${relay}`);
				},
				onDisconnect: (relay) => {
					connectedRelays.delete(normalizeRelayLifecycleKey(relay));
					if (connectedRelays.size === 0) ctx.setStatus({
						accountId: account.accountId,
						connected: false,
						lifecycle: "recovering"
					});
					ctx.log?.debug?.(`[${account.accountId}] Disconnected from relay: ${relay}`);
				},
				onEose: (relays) => {
					ctx.log?.debug?.(`[${account.accountId}] EOSE received from relays: ${relays}`);
				},
				onMetric: (event) => {
					if (event.name.startsWith("event.rejected.")) ctx.log?.debug?.(`[${account.accountId}] Metric: ${event.name} ${JSON.stringify(event.labels)}`);
					else if (event.name === "relay.circuit_breaker.open") ctx.log?.warn?.(`[${account.accountId}] Circuit breaker opened for relay: ${event.labels?.relay}`);
					else if (event.name === "relay.circuit_breaker.close") ctx.log?.info?.(`[${account.accountId}] Circuit breaker closed for relay: ${event.labels?.relay}`);
					else if (event.name === "relay.error") ctx.log?.debug?.(`[${account.accountId}] Relay error: ${event.labels?.relay}`);
				}
			});
			activeBuses.set(account.accountId, bus);
			ctx.log?.info?.(`[${account.accountId}] Nostr provider started with ${account.relays.length} configured relay(s)`);
			return { stop: async () => {
				if (activeBuses.get(account.accountId) === bus) activeBuses.delete(account.accountId);
				await bus.close();
				ctx.log?.info?.(`[${account.accountId}] Nostr provider stopped`);
			} };
		},
		stop: async (monitor) => {
			await monitor.stop();
		}
	});
};
const nostrPairingTextAdapter = {
	idLabel: "nostrPubkey",
	message: "Your pairing request has been approved!",
	normalizeAllowEntry: (entry) => {
		try {
			return normalizePubkey(entry.trim().replace(/^nostr:/i, ""));
		} catch {
			return entry.trim();
		}
	},
	notify: async ({ cfg, id, message, accountId }) => {
		const bus = activeBuses.get(accountId ?? resolveDefaultNostrAccountId(cfg));
		if (bus) await bus.sendDm(id, message);
	}
};
const nostrOutboundAdapter = {
	deliveryMode: "direct",
	textChunkLimit: 4e3,
	chunker: chunkTextForOutbound,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	deliveryCapabilities: { durableFinal: {
		text: true,
		messageSendingHooks: true
	} },
	sendText: async ({ cfg, to, text, accountId, assertDirectAdapterHandoff, onPlatformSendDispatch }) => {
		const core = getNostrRuntime();
		const aid = accountId ?? resolveDefaultNostrAccountId(cfg);
		const bus = activeBuses.get(aid);
		if (!bus) throw new Error(`Nostr bus not running for account ${aid}`);
		const tableMode = core.channel.text.resolveMarkdownTableMode({
			cfg,
			channel: "nostr",
			accountId: aid
		});
		const message = stripMarkdown(core.channel.text.convertMarkdownTables(text ?? "", tableMode));
		if (!message) throw new Error("Nostr send requires non-empty text after markdown stripping.");
		const normalizedTo = normalizePubkey(to);
		const eventId = await bus.sendDm(normalizedTo, message, {
			assertDirectAdapterHandoff,
			onPlatformSendDispatch
		});
		return attachChannelToResult("nostr", {
			to: normalizedTo,
			messageId: eventId
		});
	}
};
function getActiveNostrBuses() {
	return new Map(activeBuses);
}
//#endregion
//#region extensions/nostr/src/session-route.ts
function resolveNostrOutboundSessionRoute(params) {
	const rawTarget = stripChannelTargetPrefix(params.target, "nostr");
	let target;
	try {
		target = normalizePubkey(rawTarget);
	} catch {
		return null;
	}
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "nostr",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: "direct",
			id: target
		},
		chatType: "direct",
		from: `nostr:${target}`,
		to: `nostr:${target}`
	});
}
//#endregion
//#region extensions/nostr/src/channel.ts
const NOSTR_TARGET_HINT = "<npub|hex pubkey|nostr:npub...>";
function stripNostrTargetPrefix(target) {
	return target.trim().replace(/^nostr:/i, "");
}
function normalizeNostrTarget(target) {
	const cleaned = stripNostrTargetPrefix(target);
	try {
		return normalizePubkey(cleaned);
	} catch {
		return target.trim();
	}
}
function inferNostrTargetChatType(target) {
	try {
		normalizePubkey(stripNostrTargetPrefix(target));
		return "direct";
	} catch {
		return;
	}
}
const resolveNostrDmPolicy = createScopedDmSecurityResolver({
	channelKey: "nostr",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	defaultPolicy: "pairing",
	approveHint: formatPairingApproveHint("nostr"),
	normalizeEntry: normalizeNostrTarget
});
const nostrConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "nostr",
	resolveAccount: (cfg) => resolveNostrAccount({ cfg }),
	listAccountIds: listNostrAccountIds,
	defaultAccountId: resolveDefaultNostrAccountId,
	deleteMode: "clear-fields",
	clearBaseFields: [
		"name",
		"defaultAccount",
		"privateKey",
		"relays",
		"dmPolicy",
		"allowFrom",
		"profile"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeStringEntries(allowFrom).map((entry) => {
		if (entry === "*") return "*";
		return normalizeNostrTarget(entry);
	}).filter(Boolean)
});
const nostrMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "nostr",
	outbound: nostrOutboundAdapter
});
const nostrPluginOutboundAdapter = {
	...nostrOutboundAdapter,
	resolveTarget: ({ to }) => {
		const trimmed = to?.trim() ?? "";
		if (!trimmed) return {
			ok: false,
			error: missingTargetError("Nostr", NOSTR_TARGET_HINT)
		};
		const normalized = normalizeNostrTarget(trimmed);
		try {
			return {
				ok: true,
				to: normalizePubkey(normalized)
			};
		} catch {
			return {
				ok: false,
				error: /* @__PURE__ */ new Error("Nostr target must be a 64-character hex pubkey or npub value")
			};
		}
	}
};
const nostrPlugin = createChatChannelPlugin({
	base: {
		id: "nostr",
		meta: {
			id: "nostr",
			label: "Nostr",
			selectionLabel: "Nostr",
			docsPath: "/channels/nostr",
			docsLabel: "nostr",
			blurb: "Decentralized DMs via Nostr relays (NIP-04)",
			order: 100
		},
		capabilities: {
			chatTypes: ["direct"],
			media: false
		},
		reload: { configPrefixes: ["channels.nostr"] },
		configSchema: buildChannelConfigSchema(NostrConfigSchema),
		setupContract: nostrSetupContract,
		setupWizard: nostrSetupWizard,
		config: {
			...nostrConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: { publicKey: account.publicKey }
			})
		},
		messaging: {
			targetPrefixes: ["nostr"],
			normalizeTarget: normalizeNostrTarget,
			inferTargetChatType: ({ to }) => inferNostrTargetChatType(to),
			targetResolver: {
				looksLikeId: (input, normalized) => {
					const trimmed = normalized?.trim() || stripNostrTargetPrefix(input);
					return trimmed.startsWith("npub1") || trimmed.startsWith("NPUB1") || /^[0-9a-fA-F]{64}$/.test(trimmed);
				},
				hint: NOSTR_TARGET_HINT
			},
			resolveOutboundSessionRoute: (params) => resolveNostrOutboundSessionRoute(params)
		},
		message: nostrMessageAdapter,
		status: { ...createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("nostr", accounts),
			buildChannelSummary: ({ snapshot }) => buildPassiveChannelStatusSummary(snapshot, { publicKey: snapshot.publicKey ?? null }),
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					publicKey: account.publicKey,
					profile: account.profile,
					...buildTrafficStatusSummary(runtime)
				}
			})
		}) },
		gateway: { startAccount: startNostrGatewayAccount }
	},
	pairing: { text: nostrPairingTextAdapter },
	security: { resolveDmPolicy: resolveNostrDmPolicy },
	outbound: nostrPluginOutboundAdapter
});
/**
* Publish a profile (kind:0) for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @param profile - Profile data to publish
* @returns Publish results with successes and failures
* @throws Error if account is not running
*/
async function publishNostrProfile(accountId, profile) {
	const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
	const bus = getActiveNostrBuses().get(resolvedAccountId);
	if (!bus) throw new Error(`Nostr bus not running for account ${resolvedAccountId}`);
	return bus.publishProfile(profile);
}
/**
* Get profile publish state for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @returns Profile publish state or null if account not running
*/
async function getNostrProfileState(accountId = DEFAULT_ACCOUNT_ID) {
	const bus = getActiveNostrBuses().get(accountId);
	if (!bus) return null;
	return bus.getProfileState();
}
//#endregion
export { getNostrRuntime as a, contentToProfile as i, nostrPlugin as n, setNostrRuntime as o, publishNostrProfile as r, getNostrProfileState as t };
