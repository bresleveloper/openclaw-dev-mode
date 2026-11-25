import { a as listNostrAccountIds, c as normalizePubkey, n as nostrSetupContract, o as resolveDefaultNostrAccountId, r as nostrSetupWizard, s as resolveNostrAccount } from "./setup-surface-fC0kex9d.mjs";
import { l as validatePrivateKey, u as DEFAULT_RELAYS } from "./setup-adapter-CCRkU3LC.mjs";
import { n as NostrProfileSchema, t as nostrSetupPlugin } from "./channel.setup-DeVyQy6t.mjs";
import { createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageAdapterFromOutbound, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { DEFAULT_ACCOUNT_ID, formatPairingApproveHint } from "openclaw/plugin-sdk/channel-plugin-common";
import { buildChannelOutboundSessionRoute, stripChannelTargetPrefix } from "openclaw/plugin-sdk/core";
import { buildPassiveChannelStatusSummary, buildTrafficStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { isRecord, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseAccessGroupAllowFromEntry } from "openclaw/plugin-sdk/access-groups";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { SimplePool, finalizeEvent, getPublicKey, verifyEvent } from "nostr-tools";
import { decrypt, encrypt } from "nostr-tools/nip04";
import { createDirectDmPreCryptoGuardPolicy } from "openclaw/plugin-sdk/direct-dm-guard-policy";
import { captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { createFixedWindowRateLimiter } from "openclaw/plugin-sdk/webhook-ingress";
import { isStateDatabaseAdmissionClosedError, retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { withTimeout } from "openclaw/plugin-sdk/time-runtime";
// extensions/nostr/src/nostr-cursor.ts
const CURSOR_WRITE_RETRY_MS = [
	0,
	100,
	300
];
const CURSOR_RECOVERY_RETRY_MS = 1e3;
/** Tracks the largest EOSE-safe Nostr timestamp without skipping undurable relay events. */
function createNostrDurableCursor(options) {
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
			const nowSec = Math.floor(Date.now() / 1e3);
			durableCandidate = Math.max(durableCandidate ?? 0, Math.min(event.created_at, nowSec));
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
	const clearTimer = () => {
		clearTimeout(timer);
		timer = void 0;
	};
	const runFlush = async () => {
		for (;;) {
			if (!dirty) {
				await Promise.resolve();
				if (!dirty) return;
			}
			dirty = false;
			const cursor = desiredCursor;
			try {
				await Promise.resolve().then(() => writeWithRetry(cursor));
			} catch (error) {
				dirty = true;
				throw error;
			}
		}
	};
	const flush = () => {
		clearTimer();
		if (activeFlush) return activeFlush;
		activeFlush = runFlush().finally(() => {
			activeFlush = void 0;
		});
		return activeFlush;
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
					if (isStateDatabaseAdmissionClosedError(error)) throw error;
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
const NostrIngressPermanentError = createChannelIngressError("NostrIngressPermanentError", { withReason: true });
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value;
	throw new NostrIngressPermanentError("invalid-event", `Nostr event is missing ${field}.`);
}
function inspectNostrIngressEvent(event) {
	if (!isRecord(event)) throw new NostrIngressPermanentError("invalid-event", "Nostr event must be an object.");
	return {
		eventId: requiredString(event.id, "id"),
		laneKey: `direct:${requiredString(event.pubkey, "pubkey")}`
	};
}
/** Convert the retired persisted LRU seed into durable completion tombstones. */
async function migrateNostrLegacyRecentEventIds(params) {
	const migratedAt = Date.now();
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
	}
}
// extensions/nostr/src/runtime.ts
const { setRuntime: setNostrRuntime, getRuntime: getNostrRuntime } = createPluginRuntimeStore({
	pluginId: "nostr",
	errorMessage: "Nostr runtime not initialized"
});
// extensions/nostr/src/nostr-ingress.ts
const NOSTR_INGRESS_POLL_INTERVAL_MS = 500;
const NostrIngressAdmissionRejectedError = createChannelIngressError("NostrIngressAdmissionRejectedError", { withReason: true });
function deserializeNostrIngressEvent(rawEvent, claimedId) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claimedId} contains invalid JSON.`, { cause: error });
	}
	if (!isRecord(parsed) || typeof parsed.kind !== "number" || typeof parsed.created_at !== "number" || typeof parsed.content !== "string" || typeof parsed.sig !== "string" || !Array.isArray(parsed.tags)) throw new NostrIngressPermanentError("invalid-event", `Nostr ingress row ${claimedId} has an invalid event shape.`);
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
		inspect: ({ facts }) => facts,
		inspectAsync: async ({ facts }, context) => {
			if (context.phase === "admission") {
				await monitorStart;
				if (admissionFailure) throw admissionFailure;
				const pending = await getQueue().listPending({ limit: options.maxPendingEvents });
				const claims = await getQueue().listClaims();
				if (pending.length + claims.length >= options.maxPendingEvents) throw new NostrIngressAdmissionRejectedError("backpressure", "Nostr event exceeds the durable ingress backlog.");
			}
			return facts;
		},
		payload: {
			version: 1,
			serialize: ({ payload }) => ({
				receivedAt: payload.receivedAt,
				rawEvent: payload.rawEvent
			}),
			deserialize: (body, { claim }) => {
				const event = deserializeNostrIngressEvent(body.rawEvent, claim.id);
				return {
					event,
					facts: inspectNostrIngressEvent(event),
					receivedAt: body.receivedAt,
					payload: {
						version: 1,
						...body
					}
				};
			},
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
		deliver: ({ event }, lifecycle) => options.deliver(event, lifecycle),
		onDurableAdmission: ({ event }) => options.afterDurableAppend(event),
		onAdmissionFailure: (_event, error) => {
			if (error instanceof NostrIngressAdmissionRejectedError || error instanceof NostrIngressPermanentError) return;
			admissionFailure ??= new Error(`Nostr durable admission failed: ${formatErrorMessage(error)}`, { cause: error });
			throw admissionFailure;
		},
		pollIntervalMs: NOSTR_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e5,
			failedMaxEntries: 1e5
		},
		drain: {
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
	return {
		ready: () => monitorStart,
		receive: (event) => {
			if (stopping) return Promise.reject(createStoppedError());
			let prepared;
			try {
				prepared = prepareAdmission(event);
			} catch (error) {
				return Promise.reject(error);
			}
			queuedAdmissions += 1;
			return monitor.admit(prepared, { receivedAt: prepared.receivedAt }).then((result) => result.queueResult?.kind === "accepted" ? "accepted" : "duplicate").finally(() => {
				queuedAdmissions -= 1;
			});
		},
		stop: () => {
			if (stopTask) return stopTask;
			stopping = true;
			const pauseTask = monitor.pause();
			stopTask = (async () => {
				await monitorStart.catch(() => void 0);
				await pauseTask;
				await monitor.stop();
			})();
			return stopTask;
		},
		waitForIdle: async () => {
			await monitorStart;
			await monitor.waitForIdle();
		}
	};
}
// extensions/nostr/src/nostr-profile-core.ts
const PROFILE_FIELDS = [
	["name", "name"],
	["displayName", "display_name"],
	["about", "about"],
	["picture", "picture"],
	["banner", "banner"],
	["website", "website"],
	["nip05", "nip05"],
	["lud16", "lud16"]
];
/** Validates URLs and omits undefined fields for NIP-01 content. */
function profileToContent(profile) {
	const validated = NostrProfileSchema.parse(profile);
	const content = {};
	for (const [configKey, contentKey] of PROFILE_FIELDS) {
		const value = validated[configKey];
		if (value !== void 0) content[contentKey] = value;
	}
	return content;
}
function contentToProfile(content) {
	const profile = {};
	for (const [configKey, contentKey] of PROFILE_FIELDS) {
		const value = content[contentKey];
		if (value !== void 0) profile[configKey] = value;
	}
	return profile;
}
// extensions/nostr/src/nostr-profile.ts
const RELAY_PUBLISH_TIMEOUT_MS = 5e3;
/** Publish one signed kind:0 event, reporting each relay's result without retrying. */
async function publishProfile(pool, sk, relays, profile, lastPublishedAt) {
	const content = JSON.stringify(profileToContent(profile));
	const now = Math.floor(Date.now() / 1e3);
	const event = finalizeEvent({
		kind: 0,
		content,
		tags: [],
		created_at: lastPublishedAt !== void 0 ? Math.max(now, lastPublishedAt + 1) : now
	}, sk);
	const successes = [];
	const failures = [];
	const publishPromises = relays.map(async (relay) => {
		try {
			await withTimeout(Promise.resolve(pool.publish([relay], event)[0]), RELAY_PUBLISH_TIMEOUT_MS, { message: "timeout" });
			successes.push(relay);
		} catch (err) {
			failures.push({
				relay,
				error: formatErrorMessage(err)
			});
		}
	});
	await Promise.all(publishPromises);
	return {
		eventId: event.id,
		successes,
		failures,
		/** Unix timestamp when the event was created. */
		createdAt: event.created_at
	};
}
// extensions/nostr/src/state-account-id.ts
function normalizeNostrStateAccountId(accountId) {
	const trimmed = accountId?.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
}
// extensions/nostr/src/nostr-state-store.ts
const STORE_VERSION = 2;
const PROFILE_STATE_VERSION = 1;
function openNostrBusStateStore() {
	return getNostrRuntime().state.openKeyedStore({
		namespace: "bus-state",
		maxEntries: 256
	});
}
function openNostrProfileStateStore() {
	return getNostrRuntime().state.openKeyedStore({
		namespace: "profile-state",
		maxEntries: 256
	});
}
async function readNostrBusState(params) {
	return await openNostrBusStateStore().lookup(normalizeNostrStateAccountId(params.accountId)) ?? null;
}
async function writeNostrBusState(params) {
	const payload = {
		version: STORE_VERSION,
		lastProcessedAt: params.lastProcessedAt,
		gatewayStartedAt: params.gatewayStartedAt,
		recentEventIds: params.recentEventIds ?? []
	};
	await openNostrBusStateStore().register(normalizeNostrStateAccountId(params.accountId), payload);
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
	return await openNostrProfileStateStore().lookup(normalizeNostrStateAccountId(params.accountId)) ?? null;
}
async function writeNostrProfileState(params) {
	const payload = {
		version: PROFILE_STATE_VERSION,
		lastPublishedAt: params.lastPublishedAt,
		lastPublishedEventId: params.lastPublishedEventId,
		lastPublishResults: params.lastPublishResults
	};
	await openNostrProfileStateStore().register(normalizeNostrStateAccountId(params.accountId), payload);
}
// extensions/nostr/src/nostr-bus.ts
const STARTUP_LOOKBACK_SEC = 120;
const STATE_PERSIST_DEBOUNCE_MS = 5e3;
const NOSTR_INGRESS_ENVELOPE_OVERHEAD_BYTES = 16384;
const NOSTR_INGRESS_MAX_PENDING_EVENTS = 1e3;
const DEFAULT_EOSE_CONFIRM_DEADLINE_MS = 1e4;
/** Subscribe to NIP-04 encrypted DMs. */
async function startNostrBus(options) {
	const { privateKey, relays = DEFAULT_RELAYS, onMessage, authorizeSender, onError, onEose, onRejected } = options;
	const sk = validatePrivateKey(privateKey);
	const pk = getPublicKey(sk);
	const pool = new SimplePool();
	const admissionPubkeys = options.admissionPubkeys ? new Set(options.admissionPubkeys) : void 0;
	pool.onRelayConnectionSuccess = options.onConnect;
	const accountId = options.accountId ?? pk.slice(0, 16);
	const gatewayStartedAt = Math.floor(Date.now() / 1e3);
	const guardPolicy = createDirectDmPreCryptoGuardPolicy();
	let preferredRelay;
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
	const rejectIfRateLimited = (limiter, key) => {
		const limited = limiter.isRateLimited(key);
		if (limited) onRejected?.("rate_limited");
		return limited;
	};
	async function dispatchEvent(event, lifecycle) {
		if (event.pubkey === pk) {
			onRejected?.("self_message");
			return;
		}
		if (event.created_at > Math.floor(Date.now() / 1e3) + guardPolicy.maxFutureSkewSec) {
			onRejected?.("future");
			throw new Error(`Nostr event ${event.id} is too far in the future.`);
		}
		if (!guardPolicy.allowedKinds.includes(event.kind)) {
			onRejected?.("wrong_kind");
			return;
		}
		if (!event.tags.some((tag) => tag[0] === "p" && tag[1] === pk)) {
			onRejected?.("wrong_kind");
			return;
		}
		const replyTo = async (text) => {
			await sendEncryptedDm(event.pubkey, text, { replyToEventId: event.id });
		};
		if (Buffer.byteLength(event.content, "utf8") > guardPolicy.maxCiphertextBytes) {
			if (rejectIfRateLimited(globalRateLimiter, "global")) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
			onRejected?.("oversized_ciphertext");
			return;
		}
		if (rejectIfRateLimited(globalRateLimiter, "global")) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
		if (!verifyEvent(event)) {
			onRejected?.("invalid_signature");
			const error = new NostrIngressPermanentError("invalid-signature", `Nostr event ${event.id} has an invalid signature.`);
			onError?.(error, `event ${event.id}`);
			throw error;
		}
		if (rejectIfRateLimited(perSenderRateLimiter, event.pubkey)) throw new Error(`Nostr sender ${event.pubkey} hit the rate limit.`);
		if (authorizeSender) {
			if (await authorizeSender({
				senderPubkey: event.pubkey,
				reply: replyTo
			}) !== "allow") return;
		}
		let plaintext;
		try {
			plaintext = decrypt(sk, event.pubkey, event.content);
		} catch (error) {
			onRejected?.("decrypt_failed");
			onError?.(error, `decrypt from ${event.pubkey}`);
			throw new NostrIngressPermanentError("decrypt-failed", `Nostr event ${event.id} could not be decrypted.`, { cause: error });
		}
		if (Buffer.byteLength(plaintext, "utf8") > guardPolicy.maxPlaintextBytes) {
			onRejected?.("oversized_plaintext");
			return;
		}
		if (lifecycle.abortSignal.aborted) throw new Error(`Nostr event ${event.id} stopped before dispatch.`);
		await onMessage(event.pubkey, plaintext, replyTo, {
			eventId: event.id,
			createdAt: event.created_at
		}, lifecycle);
	}
	const dmFilter = {
		kinds: [4],
		"#p": [pk],
		since
	};
	const relayAbort = new AbortController();
	let closeRelaySubscriptions;
	let relayStopPromise;
	const stopRelays = (reason) => {
		relayStopPromise ??= (async () => {
			relayAbort.abort(reason);
			try {
				await closeRelaySubscriptions?.(reason);
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
	const handleRelayEvent = async (event) => {
		if (typeof event.created_at === "number" && event.created_at < since) {
			onRejected?.("stale");
			return;
		}
		if (admissionPubkeys && !admissionPubkeys.has(event.pubkey)) return;
		try {
			await ingress.receive(event);
		} catch (error) {
			onError?.(error, `durable admission for event ${event.id}`);
			if (error instanceof NostrIngressAdmissionRejectedError) {
				if (error.reason === "rate-limited") onRejected?.("rate_limited");
				if (error.reason !== "oversized-event") try {
					await persistTransientReplayCursor(event);
				} catch (cursorError) {
					onError?.(cursorError, "persist transient replay cursor");
					await stopRelays("cursor persistence failed");
					await cursorWriter.flushUntilSuccess();
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
			if (cursorPersistenceFailed) await cursorWriter.flushUntilSuccess();
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
		/** Separates real relay EOSE frames from nostr-tools timeout/close synthesis. */
		const subscriptionRelays = [...new Set(relays)];
		const subscriptions = [];
		const deadlineTimers = /* @__PURE__ */ new Set();
		let locallyClosing = false;
		const backfillStatus = new Map(subscriptionRelays.map((relay) => [relay, "pending"]));
		const settleBackfill = (relay, status) => {
			if (backfillStatus.get(relay) !== "pending") return;
			backfillStatus.set(relay, status);
			if ([...backfillStatus.values()].some((value) => value === "pending")) return;
			if ([...backfillStatus.values()].every((value) => value === "confirmed")) backfillFinalizePromise ??= ingress.waitForIdle().then(() => {
				const cursor = durableCursor.markBackfillComplete();
				if (cursor !== void 0) cursorWriter.schedule(cursor);
				onEose?.(subscriptionRelays.join(", "));
			}).catch((error) => onError?.(error, "finalize relay backfill"));
		};
		closeRelaySubscriptions = async (reason) => {
			locallyClosing = true;
			for (const timer of deadlineTimers) clearTimeout(timer);
			deadlineTimers.clear();
			await Promise.all(subscriptions.map(async (subscription) => subscription.close(reason)));
		};
		const onRelayEvent = (event) => {
			const task = handleRelayEvent(event);
			if (options.trackIngressTask) options.trackIngressTask(task.then(() => ingress.waitForIdle()));
		};
		for (const relay of subscriptionRelays) {
			let relayClosed = false;
			let deadlineReached = false;
			const deadlineTimer = setTimeout(() => {
				deadlineTimers.delete(deadlineTimer);
				deadlineReached = true;
				settleBackfill(relay, "incomplete");
			}, DEFAULT_EOSE_CONFIRM_DEADLINE_MS);
			deadlineTimer.unref?.();
			deadlineTimers.add(deadlineTimer);
			subscriptions.push(pool.subscribeMany([relay], dmFilter, {
				onevent: onRelayEvent,
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
					if (!locallyClosing && !relayAbort.signal.aborted) {
						const closeReasons = reasons.map(({ reason }) => reason);
						options.onDisconnect?.(relay);
						onError?.(/* @__PURE__ */ new Error(`Subscription closed: ${closeReasons.join(", ")}`), "subscription");
					}
				},
				maxWait: 11e3,
				abort: relayAbort.signal
			}));
		}
	} catch (error) {
		await Promise.allSettled([stopRelays("startup failed"), ingress.stop()]);
		throw error;
	}
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
	async function sendEncryptedDm(toPubkey, text, sendOptions) {
		const effect = captureEffectAuthority();
		const ciphertext = encrypt(sk, toPubkey, text);
		const tags = [["p", toPubkey]];
		if (sendOptions?.replyToEventId) tags.push(["e", sendOptions.replyToEventId]);
		const reply = finalizeEvent({
			kind: 4,
			content: ciphertext,
			tags,
			created_at: Math.floor(Date.now() / 1e3)
		}, sk);
		const sortedRelays = relays.toSorted((left, right) => Number(right === preferredRelay) - Number(left === preferredRelay));
		let lastError;
		for (const relay of sortedRelays) {
			sendOptions?.assertDirectAdapterHandoff?.();
			const recordFailure = (err) => {
				lastError = err instanceof Error ? err : new Error(String(err));
				onError?.(lastError, `publish to ${relay}`);
			};
			const connection = await pool.ensureRelay(relay, { connectionTimeout: pool.maxWaitForConnection }).catch((err) => {
				recordFailure(/* @__PURE__ */ new Error(`connection failure: ${String(err)}`));
			});
			if (!connection) continue;
			sendOptions?.assertDirectAdapterHandoff?.();
			if (sendOptions?.onPlatformSendDispatch) {
				await sendOptions.onPlatformSendDispatch();
				sendOptions.assertDirectAdapterHandoff?.();
			}
			let initiated = false;
			try {
				await effect.initiate(() => {
					sendOptions?.assertDirectAdapterHandoff?.();
					initiated = true;
					return connection.publish(reply);
				});
				preferredRelay = relay;
				return reply.id;
			} catch (err) {
				if (!initiated) throw err;
				recordFailure(err);
			}
		}
		throw new Error(`Failed to publish to any relay: ${lastError?.message}`);
	}
	return {
		close,
		publicKey: pk,
		sendDm: sendEncryptedDm,
		publishProfile: publishProfile$1,
		getProfileState
	};
}
// extensions/nostr/src/gateway.ts
const activeBuses = /* @__PURE__ */ new Map();
function normalizeRelayLifecycleKey(relay) {
	return new URL(relay).toString();
}
function projectNostrText(text, cfg, accountId) {
	const core = getNostrRuntime();
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg,
		channel: "nostr",
		accountId: accountId ?? resolveDefaultNostrAccountId(cfg)
	});
	const sanitizedText = sanitizeAssistantVisibleText(text);
	return sanitizedText ? stripMarkdown(core.channel.text.convertMarkdownTables(sanitizedText, tableMode)) : "";
}
function normalizeNostrAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	const accessGroup = parseAccessGroupAllowFromEntry(trimmed);
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
function resolveAdmissionPubkeys(account) {
	if (account.config.dmPolicy !== "allowlist" || !account.config.allowFrom?.length) return;
	const pubkeys = [];
	for (const entry of account.config.allowFrom) {
		if (typeof entry !== "string") return;
		const normalized = normalizeNostrAllowEntry(entry);
		if (!normalized || !/^[0-9a-f]{64}$/.test(normalized)) return;
		pubkeys.push(normalized);
	}
	return [...new Set(pubkeys)];
}
const nostrIngressIdentity = {
	key: "nostr-pubkey",
	normalizeEntry: normalizeNostrAllowEntry,
	normalizeSubject: normalizeNostrSenderPubkey,
	sensitivity: "pii",
	entryIdPrefix: "nostr-entry"
};
async function startNostrGatewayAccount(ctx) {
	const account = ctx.account;
	ctx.setStatus({
		accountId: account.accountId,
		publicKey: account.publicKey,
		profile: account.profile,
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
		const resolved = await resolveInboundAccess(input.senderPubkey, "");
		if (resolved.senderAccess.decision === "allow") return "allow";
		if (resolved.senderAccess.decision === "pairing") {
			await pairing.issueChallenge({
				senderId: input.senderPubkey,
				senderIdLine: `Your Nostr pubkey: ${input.senderPubkey}`,
				sendPairingReply: input.reply,
				onCreated: () => {
					ctx.log?.debug?.(`[${account.accountId}] nostr pairing request sender=${input.senderPubkey}`);
				},
				onReplyError: (err) => {
					ctx.log?.warn?.(`[${account.accountId}] nostr pairing reply failed for ${input.senderPubkey}: ${String(err)}`);
				}
			});
			return "pairing";
		}
		ctx.log?.debug?.(`[${account.accountId}] blocked Nostr sender ${input.senderPubkey} (${resolved.senderAccess.reasonCode})`);
		return "block";
	};
	await runPassiveAccountLifecycle({
		abortSignal: ctx.abortSignal,
		start: async () => {
			const bus = await startNostrBus({
				accountId: account.accountId,
				privateKey: account.privateKey,
				relays: account.relays,
				authorizeSender,
				admissionPubkeys: resolveAdmissionPubkeys(account),
				onMessage: async (senderPubkey, text, reply, meta, lifecycle) => {
					const resolvedAccess = await resolveInboundAccess(senderPubkey, text);
					if (resolvedAccess.senderAccess.decision !== "allow") {
						ctx.log?.warn?.(`[${account.accountId}] dropping Nostr DM after preflight drift (${senderPubkey}, ${resolvedAccess.senderAccess.reasonCode})`);
						return;
					}
					const { dispatchInboundDirectDm } = await import("openclaw/plugin-sdk/channel-inbound");
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
							const message = projectNostrText(payload.text ?? "", ctx.cfg, account.accountId);
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
				onRejected: (reason) => {
					ctx.log?.debug?.(`[${account.accountId}] Event rejected: ${reason}`);
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
}
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
		const aid = accountId ?? resolveDefaultNostrAccountId(cfg);
		const bus = activeBuses.get(aid);
		if (!bus) throw new Error(`Nostr bus not running for account ${aid}`);
		await bus.sendDm(id, message);
	}
};
const nostrOutboundAdapter = {
	deliveryMode: "direct",
	textChunkLimit: 4e3,
	chunker: chunkTextForOutbound,
	sanitizeText: ({ text, cfg, accountId }) => projectNostrText(text, cfg ?? {}, accountId),
	deliveryCapabilities: { durableFinal: {
		text: true,
		messageSendingHooks: true
	} },
	sendText: async ({ cfg, to, text, accountId, assertDirectAdapterHandoff, onPlatformSendDispatch }) => {
		const aid = accountId ?? resolveDefaultNostrAccountId(cfg);
		const bus = activeBuses.get(aid);
		if (!bus) throw new Error(`Nostr bus not running for account ${aid}`);
		const message = text ?? "";
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
	return activeBuses;
}
// extensions/nostr/src/channel.ts
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
	formatAllowFrom: (allowFrom) => normalizeStringEntries(allowFrom).map(normalizeNostrTarget).filter(Boolean)
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
		try {
			return {
				ok: true,
				to: normalizePubkey(stripNostrTargetPrefix(trimmed))
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
		...nostrSetupPlugin,
		setupContract: nostrSetupContract,
		setupWizard: nostrSetupWizard,
		config: {
			...nostrSetupPlugin.config,
			...nostrConfigAdapter
		},
		messaging: {
			targetPrefixes: ["nostr"],
			normalizeTarget: normalizeNostrTarget,
			inferTargetChatType: ({ to }) => {
				try {
					normalizePubkey(stripNostrTargetPrefix(to));
					return "direct";
				} catch {
					return;
				}
			},
			targetResolver: {
				looksLikeId: (input, normalized) => {
					const trimmed = normalized?.trim() || stripNostrTargetPrefix(input);
					return trimmed.startsWith("npub1") || trimmed.startsWith("NPUB1") || /^[0-9a-fA-F]{64}$/.test(trimmed);
				},
				hint: NOSTR_TARGET_HINT
			},
			resolveOutboundSessionRoute: resolveNostrOutboundSessionRoute
		},
		message: nostrMessageAdapter,
		status: createComputedAccountStatusAdapter({
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
		}),
		gateway: { startAccount: startNostrGatewayAccount }
	},
	pairing: { text: nostrPairingTextAdapter },
	security: { resolveDmPolicy: resolveNostrDmPolicy },
	outbound: nostrPluginOutboundAdapter
});
async function publishNostrProfile(accountId, profile) {
	const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
	const bus = getActiveNostrBuses().get(resolvedAccountId);
	if (!bus) throw new Error(`Nostr bus not running for account ${resolvedAccountId}`);
	return bus.publishProfile(profile);
}
async function getNostrProfileState(accountId = DEFAULT_ACCOUNT_ID) {
	const bus = getActiveNostrBuses().get(accountId);
	if (!bus) return null;
	return bus.getProfileState();
}
export { getNostrRuntime as a, contentToProfile as i, nostrPlugin as n, setNostrRuntime as o, publishNostrProfile as r, getNostrProfileState as t };
