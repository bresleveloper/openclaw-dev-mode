import { a as listNostrAccountIds, c as normalizePubkey, n as nostrSetupContract, o as resolveDefaultNostrAccountId, r as nostrSetupWizard, s as resolveNostrAccount } from "./setup-surface-CadI9603.mjs";
import { l as validatePrivateKey, u as DEFAULT_RELAYS } from "./setup-adapter-DTqb2Hne.mjs";
import { n as NostrProfileSchema, t as nostrSetupPlugin } from "./channel.setup-B2tWt-Ro.mjs";
import { createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageAdapterFromOutbound, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { DEFAULT_ACCOUNT_ID, formatPairingApproveHint } from "openclaw/plugin-sdk/channel-plugin-common";
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
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { withTimeout } from "openclaw/plugin-sdk/time-runtime";
import { buildChannelOutboundSessionRoute, stripChannelTargetPrefix } from "openclaw/plugin-sdk/core";
//#region extensions/nostr/src/metrics.ts
function createMetrics(onMetric) {
	return { emit(name, value = 1, labels) {
		onMetric?.({
			name,
			value,
			timestamp: Date.now(),
			labels
		});
	} };
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
		deliver: options.deliver,
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
//#endregion
//#region extensions/nostr/src/nostr-profile.ts
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
//#endregion
//#region extensions/nostr/src/nostr-relay-subscription.ts
const DEFAULT_EOSE_CONFIRM_DEADLINE_MS = 1e4;
/** Separates real relay EOSE frames from nostr-tools timeout/close synthesis. */
function createNostrRelaySubscriptionGroup(options) {
	const relays = [...new Set(options.relays)];
	const subscriptions = [];
	const deadlineTimers = /* @__PURE__ */ new Set();
	let locallyClosing = false;
	const backfillStatus = new Map(relays.map((relay) => [relay, "pending"]));
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
				}, DEFAULT_EOSE_CONFIRM_DEADLINE_MS);
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
					maxWait: 11e3,
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
//#region extensions/nostr/src/state-account-id.ts
function normalizeNostrStateAccountId(accountId) {
	const trimmed = accountId?.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
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
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_RESET_MS = 3e4;
const HEALTH_WINDOW_MS = 6e4;
function createCircuitBreaker(relay, metrics) {
	const state = {
		state: "closed",
		failures: 0,
		lastFailure: 0
	};
	return {
		canAttempt() {
			if (state.state === "open") {
				if (Date.now() - state.lastFailure >= CIRCUIT_BREAKER_RESET_MS) {
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
		},
		recordFailure() {
			state.failures++;
			state.lastFailure = Date.now();
			if (state.state === "half_open" || state.state === "closed" && state.failures >= CIRCUIT_BREAKER_THRESHOLD) {
				state.state = "open";
				metrics.emit("relay.circuit_breaker.open", 1, { relay });
			}
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
			const successRate = s.successCount / total;
			const now = Date.now();
			const recencyBonus = s.lastSuccess > s.lastFailure ? Math.max(0, 1 - (now - s.lastSuccess) / HEALTH_WINDOW_MS) * .2 : 0;
			const avgLatency = s.successCount > 0 ? s.latencySum / s.successCount : 1e3;
			const latencyPenalty = Math.min(.2, avgLatency / 1e4);
			return Math.max(0, Math.min(1, successRate + recencyBonus - latencyPenalty));
		},
		getSortedRelays(relays) {
			return relays.toSorted((a, b) => this.getScore(b) - this.getScore(a));
		}
	};
}
/** Subscribe to NIP-04 encrypted DMs. */
async function startNostrBus(options) {
	const { privateKey, relays = DEFAULT_RELAYS, onMessage, authorizeSender, onError, onEose, onMetric } = options;
	const sk = validatePrivateKey(privateKey);
	const pk = getPublicKey(sk);
	const pool = new SimplePool();
	pool.onRelayConnectionSuccess = options.onConnect;
	const accountId = options.accountId ?? pk.slice(0, 16);
	const gatewayStartedAt = Math.floor(Date.now() / 1e3);
	const guardPolicy = createDirectDmPreCryptoGuardPolicy(options.guardPolicy);
	const metrics = createMetrics(onMetric);
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
	const rejectIfRateLimited = (limiter, key, metric) => {
		updateRateLimiterSizeMetric();
		const limited = limiter.isRateLimited(key);
		if (limited) {
			metrics.emit(metric);
			metrics.emit("event.rejected.rate_limited");
		}
		updateRateLimiterSizeMetric();
		return limited;
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
		if (!event.tags.some((tag) => tag[0] === "p" && tag[1] === pk)) {
			metrics.emit("event.rejected.wrong_kind");
			return;
		}
		const replyTo = async (text) => {
			await sendEncryptedDm(event.pubkey, text, { replyToEventId: event.id });
		};
		if (Buffer.byteLength(event.content, "utf8") > guardPolicy.maxCiphertextBytes) {
			if (rejectIfRateLimited(globalRateLimiter, "global", "rate_limit.global")) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
			metrics.emit("event.rejected.oversized_ciphertext");
			return;
		}
		if (rejectIfRateLimited(globalRateLimiter, "global", "rate_limit.global")) throw new Error(`Nostr event ${event.id} hit the global rate limit.`);
		if (!verifyEvent(event)) {
			metrics.emit("event.rejected.invalid_signature");
			const error = new NostrIngressPermanentError("invalid-signature", `Nostr event ${event.id} has an invalid signature.`);
			onError?.(error, `event ${event.id}`);
			throw error;
		}
		if (rejectIfRateLimited(perSenderRateLimiter, event.pubkey, "rate_limit.per_sender")) throw new Error(`Nostr sender ${event.pubkey} hit the rate limit.`);
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
		const sortedRelays = healthTracker.getSortedRelays(relays);
		let lastError;
		for (const relay of sortedRelays) {
			sendOptions?.assertDirectAdapterHandoff?.();
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
				const latency = Date.now() - startTime;
				cb?.recordSuccess();
				healthTracker.recordSuccess(relay, latency);
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
//#endregion
//#region extensions/nostr/src/gateway.ts
const activeBuses = /* @__PURE__ */ new Map();
function normalizeRelayLifecycleKey(relay) {
	return new URL(relay).toString();
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
							const sanitizedText = sanitizeAssistantVisibleText(payload.text ?? "");
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
			inferTargetChatType: ({ to }) => inferNostrTargetChatType(to),
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
//#endregion
export { getNostrRuntime as a, contentToProfile as i, nostrPlugin as n, setNostrRuntime as o, publishNostrProfile as r, getNostrProfileState as t };
