import { c as looksLikeBuzzTarget, l as normalizeBuzzTarget, n as resolveBuzzAccountConfig, o as buildBuzzTarget, s as isConfiguredBuzzChannel, u as parseBuzzTarget } from "./account-config-BKcQfUTN.mjs";
import { a as resolveBuzzPublicKey, i as resolveBuzzAccount, n as assertBuzzAccountAvailable, r as decodeBuzzPrivateKey } from "./directory-query-Dzs2hVjW.mjs";
import { n as startBuzzRoomMembershipNotifications, r as discoverBuzzRooms, t as buzzSetupPlugin } from "./channel.setup-CPcHHUnQ.mjs";
import { a as BuzzRelayRateLimitError, c as BUZZ_MAX_CONFIGURED_ROOMS, d as BuzzDirectoryState, f as isNewerBuzzRevision, h as parseBuzzAuthTag, i as parseBuzzRoomMembershipEvent, l as resolveBuzzSubscriptionBudget, m as connectAuthenticatedBuzzRelaySession, n as BUZZ_ROOM_SYSTEM_KIND, o as openBuzzRelaySubscription, p as connectAuthenticatedBuzzRelay, r as parseBuzzRoomMembershipChangeEvent, s as queryBuzzRelaySnapshot, t as BUZZ_ROOM_MEMBERSHIP_KIND, u as BUZZ_ROOM_METADATA_KIND } from "./room-membership-ByrLunJd.mjs";
import { n as listBuzzDirectoryPeersFromConfig, t as listBuzzDirectoryGroupsFromConfig } from "./directory-config-4LKbchce.mjs";
import { a as formatBuzzMessageForAgent, c as inspectBuzzMentionSyntax, i as buildBuzzMessageTags, l as resolveBuzzMessageMentions, n as BUZZ_INBOUND_MESSAGE_KINDS, o as isBuzzInboundMessageKind, r as BUZZ_TYPING_INDICATOR_KIND, s as parseBuzzMessageEvent, t as BUZZ_DIFF_MESSAGE_KIND } from "./message-event-CbDvEPrA.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-Ce3J1y_d.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelDirectoryAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { parseThreadSessionSuffix, resolveAgentRoute, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { compareEvents, finalizeEvent, verifyEvent } from "nostr-tools";
import { asNonArrayRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { createDeferred } from "openclaw/plugin-sdk/concurrency-runtime";
import { safeParseJson, truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { computeBackoff, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { chunkItems } from "openclaw/plugin-sdk/text-chunking";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { createDeferred as createDeferred$1 } from "openclaw/plugin-sdk/extension-shared";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { createChannelReplayGuard } from "openclaw/plugin-sdk/persistent-dedupe";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
import { normalizeURL } from "nostr-tools/utils";
import { buildChannelInboundEventContext, createChannelInboundEnvelopeBuilderAsync, logInboundDrop, recordDroppedChannelInboundHistory } from "openclaw/plugin-sdk/channel-inbound";
import { createSubsystemLogger } from "openclaw/plugin-sdk/logging-core";
import { buildHistoryContext, createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { createHash } from "node:crypto";
// extensions/buzz/src/directory-relay.ts
const BUZZ_ROOM_QUERY_CHUNK_SIZE = 1e3;
const PROFILE_SUBSCRIPTION_REPLACED_REASON = "directory profile subscription replaced";
const PROFILE_SUBSCRIPTION_FAILED_REASON = "directory profile subscription generation failed";
const DIRECTORY_SHUTDOWN_REASON = "directory shutdown";
const DIRECTORY_QUERY_COMPLETE_REASON = "directory query complete";
async function queryBuzzDirectoryBatch(params) {
	params.signal?.throwIfAborted();
	await queryBuzzRelaySnapshot({
		relay: params.relay,
		filters: [params.filter],
		signal: params.signal,
		timeoutMessage: "Timed out loading Buzz directory snapshot",
		abortMessage: "Buzz directory query aborted",
		failureMessage: "Buzz directory query failed",
		closeReason: DIRECTORY_QUERY_COMPLETE_REASON,
		closeMessage: (reason) => `Buzz directory query closed: ${reason}`,
		onEvent: params.onEvent,
		result: () => {},
		onTimeout: params.onTimeout,
		closeRelayOnTimeout: !params.onTimeout
	});
}
async function queryBuzzDirectoryProfiles(params) {
	for (const authors of chunkItems(params.publicKeys, 200)) await queryBuzzDirectoryBatch({
		relay: params.relay,
		filter: {
			kinds: [0],
			authors,
			limit: authors.length
		},
		onEvent: (event) => {
			params.state.applyProfileEvent(event);
		},
		signal: params.signal
	});
}
async function queryBuzzDirectoryRooms(params) {
	for (const roomIds of chunkItems(params.channelIds, BUZZ_ROOM_QUERY_CHUNK_SIZE)) await queryBuzzDirectoryBatch({
		relay: params.relay,
		filter: {
			kinds: [BUZZ_ROOM_METADATA_KIND],
			authors: [params.relayPublicKey],
			"#d": roomIds,
			limit: roomIds.length
		},
		onEvent: (event) => {
			if (event.pubkey.toLowerCase() === params.relayPublicKey && params.state.applyRoomEvent(event)) params.onRoomChanged?.();
		},
		onTimeout: params.onTimeout,
		signal: params.signal
	});
}
function startBuzzDirectoryRelay(params) {
	let closed = false;
	let profileSubscriptions = [];
	const pendingRoomIds = /* @__PURE__ */ new Set();
	let refreshInFlight;
	let fatalErrorReported = false;
	const reportError = (error) => {
		if (closed || params.signal?.aborted) return;
		params.onError?.(error instanceof Error ? error : new Error("Buzz directory refresh failed", { cause: error }));
	};
	const reportFatalError = (error) => {
		if (closed || params.signal?.aborted || fatalErrorReported) return;
		fatalErrorReported = true;
		params.onFatalError?.(error);
		params.relay.close();
	};
	const closeProfileSubscriptions = (reason, skip) => {
		const current = profileSubscriptions;
		profileSubscriptions = [];
		for (const subscription of current) if (subscription !== skip && !subscription.closed) subscription.close(reason);
	};
	const replaceProfilePublicKeys = (publicKeys) => {
		if (closed || params.signal?.aborted) return;
		closeProfileSubscriptions(PROFILE_SUBSCRIPTION_REPLACED_REASON);
		for (const authors of chunkItems(publicKeys, 200)) {
			const subscription = openBuzzRelaySubscription(params.relay, [{
				kinds: [0],
				authors,
				limit: authors.length
			}], {
				onevent: (event) => {
					params.state.applyProfileEvent(event);
				},
				onclose: (reason) => {
					if (reason !== PROFILE_SUBSCRIPTION_REPLACED_REASON && reason !== PROFILE_SUBSCRIPTION_FAILED_REASON && reason !== DIRECTORY_SHUTDOWN_REASON && reason !== "relay connection closed by us") {
						closeProfileSubscriptions(PROFILE_SUBSCRIPTION_FAILED_REASON, subscription);
						reportError(/* @__PURE__ */ new Error(`Buzz profile subscription closed: ${reason}`));
					}
				}
			});
			profileSubscriptions.push(subscription);
		}
	};
	const refreshRooms = (channelIds) => {
		if (closed || params.signal?.aborted) return Promise.resolve();
		for (const channelId of channelIds) pendingRoomIds.add(channelId);
		if (refreshInFlight) return refreshInFlight;
		refreshInFlight = (async () => {
			while (pendingRoomIds.size > 0) {
				if (closed || params.signal?.aborted) {
					pendingRoomIds.clear();
					return;
				}
				const nextRoomIds = [...pendingRoomIds];
				pendingRoomIds.clear();
				await queryBuzzDirectoryRooms({
					relay: params.relay,
					relayPublicKey: params.relayPublicKey,
					state: params.state,
					channelIds: nextRoomIds,
					onRoomChanged: params.onRoomChanged,
					onTimeout: reportFatalError,
					signal: params.signal
				});
				const changedRoomId = nextRoomIds.find((channelId) => params.subscribedRoomIds.has(channelId) === params.state.isRoomArchived(channelId));
				if (changedRoomId) {
					reportFatalError(/* @__PURE__ */ new Error(`Buzz room ${changedRoomId} archive status changed; rebuilding subscriptions`));
					return;
				}
			}
		})().finally(() => {
			refreshInFlight = void 0;
		});
		return refreshInFlight;
	};
	return {
		replaceProfilePublicKeys,
		refreshRooms,
		close: () => {
			closed = true;
			closeProfileSubscriptions(DIRECTORY_SHUTDOWN_REASON);
			pendingRoomIds.clear();
		}
	};
}
// extensions/buzz/src/replay-dispatch.ts
const REPLAY_DISPATCH_CONCURRENCY = 8;
const BUZZ_REPLAY_DISPATCH_MAX_PENDING = 1024;
const REPLAY_HISTORY_MAX_PER_ROOM = 100;
function createBuzzReplayDispatchQueue(params) {
	const pending = [];
	let pendingHead = 0;
	let active = 0;
	let closed = false;
	const drained = createDeferred();
	const settleDrained = () => {
		if (closed && active === 0) drained.resolve();
	};
	let reserved = 0;
	const reservationWaiters = [];
	const availableCapacity = () => BUZZ_REPLAY_DISPATCH_MAX_PENDING - (pending.length - pendingHead) - reserved;
	const compactPending = () => {
		if (pendingHead > 256 && pendingHead * 2 >= pending.length) {
			pending.splice(0, pendingHead);
			pendingHead = 0;
		}
	};
	const drain = () => {
		if (closed) return;
		const startCount = Math.min(REPLAY_DISPATCH_CONCURRENCY - active, pending.length - pendingHead);
		for (let index = 0; index < startCount; index += 1) {
			const task = pending[pendingHead];
			pendingHead += 1;
			compactPending();
			active += 1;
			Promise.resolve().then(task).catch(params.onTaskError).finally(() => {
				active -= 1;
				settleDrained();
				drain();
			});
		}
		settleReservationWaiters();
	};
	const enqueueTask = (task) => {
		if (closed) return "closed";
		if (active < REPLAY_DISPATCH_CONCURRENCY) {
			pending.push(task);
			drain();
			return "accepted";
		}
		if (availableCapacity() <= 0) return "overflow";
		pending.push(task);
		return "accepted";
	};
	const createReservation = (slots) => {
		let remaining = slots;
		reserved += slots;
		return {
			enqueue(task) {
				if (closed) return "closed";
				if (remaining === 0) return "overflow";
				remaining -= 1;
				reserved -= 1;
				pending.push(task);
				drain();
				return "accepted";
			},
			release() {
				reserved -= remaining;
				remaining = 0;
				settleReservationWaiters();
			}
		};
	};
	const settleReservationWaiters = () => {
		while (reservationWaiters.length > 0) {
			const waiter = reservationWaiters[0];
			if (closed) {
				reservationWaiters.shift();
				waiter.resolve(void 0);
				continue;
			}
			if (availableCapacity() < waiter.slots) return;
			reservationWaiters.shift();
			waiter.resolve(createReservation(waiter.slots));
		}
	};
	return {
		enqueue: enqueueTask,
		async reserveCapacity(slots) {
			if (closed) return;
			if (reservationWaiters.length === 0 && availableCapacity() >= slots) return createReservation(slots);
			return await new Promise((resolve) => {
				reservationWaiters.push({
					slots,
					resolve
				});
			});
		},
		async close() {
			closed = true;
			pending.length = 0;
			pendingHead = 0;
			settleReservationWaiters();
			settleDrained();
			await drained.promise;
		}
	};
}
function resolveBuzzRoomHistoryLimit(roomCount) {
	return Math.min(REPLAY_HISTORY_MAX_PER_ROOM, Math.floor(1032 / roomCount));
}
// extensions/buzz/src/room-membership-query.ts
const RELAY_QUERY_EVENT_LIMIT = 1e3;
const MEMBERSHIP_QUERY_COMPLETE_REASON = "membership snapshot loaded";
async function queryBuzzRoomMemberships(params) {
	const memberships = /* @__PURE__ */ new Map();
	for (const channelIds of chunkItems(params.channelIds, RELAY_QUERY_EVENT_LIMIT)) {
		const configuredRooms = new Set(channelIds);
		await queryBuzzRelaySnapshot({
			relay: params.relay,
			filters: [{
				kinds: [BUZZ_ROOM_MEMBERSHIP_KIND],
				authors: [params.relayPublicKey],
				"#d": channelIds,
				limit: channelIds.length
			}],
			signal: params.signal,
			timeoutMessage: "Timed out loading Buzz room membership snapshot",
			abortMessage: "Buzz room membership query aborted",
			failureMessage: "Buzz room membership query failed",
			closeReason: MEMBERSHIP_QUERY_COMPLETE_REASON,
			closeMessage: (reason) => `Buzz room membership query closed: ${reason}`,
			onEvent: (event) => {
				const membership = parseBuzzRoomMembershipEvent(event, params.relayPublicKey);
				if (membership && configuredRooms.has(membership.roomId) && isNewerBuzzRevision(membership, memberships.get(membership.roomId))) memberships.set(membership.roomId, membership);
			},
			result: () => {}
		});
	}
	return memberships;
}
// extensions/buzz/src/room-membership-tracker.ts
const HISTORY_PAGE_COMPLETE_REASON = "buzz room history page loaded";
const MEMBERSHIP_READY_TIMEOUT_MS = 1e4;
const BUZZ_ROOM_METADATA_EDIT_KIND = 9002;
const MEMBERSHIP_REFRESH_DELAYS_MS = [
	100,
	500,
	1500,
	3e3
];
const MEMBERSHIP_EVENT_CACHE_MAX_ENTRIES = 1e4;
async function createBuzzRoomMembershipTracker(params) {
	const historicalRooms = /* @__PURE__ */ new Set();
	const historyPages = /* @__PURE__ */ new Map();
	const seenEventIds = /* @__PURE__ */ new Map();
	const blockedRooms = /* @__PURE__ */ new Set();
	const deniedMembers = /* @__PURE__ */ new Map();
	const pendingMemberships = /* @__PURE__ */ new Map();
	const refreshes = /* @__PURE__ */ new Map();
	const restoringRooms = /* @__PURE__ */ new Map();
	const withMembershipQueryLock = createAsyncLock();
	const memberships = await queryBuzzRoomMemberships(params);
	params.signal?.throwIfAborted();
	const effectiveMemberships = () => {
		if (blockedRooms.size === 0 && deniedMembers.size === 0) return memberships;
		const effective = /* @__PURE__ */ new Map();
		for (const [channelId, membership] of memberships) {
			if (blockedRooms.has(channelId)) continue;
			const denied = deniedMembers.get(channelId);
			if (!denied || denied.size === 0) {
				effective.set(channelId, membership);
				continue;
			}
			effective.set(channelId, {
				...membership,
				members: new Set([...membership.members].filter((publicKey) => !denied.has(publicKey))),
				roles: new Map([...membership.roles].filter(([publicKey]) => !denied.has(publicKey)))
			});
		}
		return effective;
	};
	const isMember = (channelId, publicKey) => !blockedRooms.has(channelId) && !deniedMembers.get(channelId)?.has(publicKey.trim().toLowerCase()) && memberships.get(channelId)?.members.has(publicKey.trim().toLowerCase()) === true;
	const markSystemEventSeen = (eventId) => {
		if (seenEventIds.has(eventId)) return false;
		seenEventIds.set(eventId, true);
		pruneMapToMaxSize(seenEventIds, MEMBERSHIP_EVENT_CACHE_MAX_ENTRIES);
		return true;
	};
	const reportSystemEventError = (error) => {
		if (params.signal?.aborted) return;
		params.onFatalError?.(error instanceof Error ? error : new Error(String(error)));
		params.relay.close();
	};
	const replaceMembership = (membership) => {
		if (membership.roles.get(params.botPublicKey) !== "bot" || !membership.members.has(params.botPublicKey)) {
			blockedRooms.add(membership.roomId);
			throw new Error(`Buzz bot no longer has the Bot role in room ${membership.roomId}`);
		}
		memberships.set(membership.roomId, membership);
		params.onMembershipsChanged?.(effectiveMemberships());
	};
	const queryMembership = (channelId) => withMembershipQueryLock(async () => {
		params.signal?.throwIfAborted();
		return (await queryBuzzRoomMemberships({
			relay: params.relay,
			relayPublicKey: params.relayPublicKey,
			channelIds: [channelId],
			signal: params.signal
		})).get(channelId);
	});
	const refreshMembership = async (channelId, state) => {
		for (const delayMs of MEMBERSHIP_REFRESH_DELAYS_MS) {
			const generation = state.generation;
			state.lastAttemptedGeneration = generation;
			await sleepWithAbort(delayMs, params.signal);
			if (state.generation !== generation) continue;
			let refreshed;
			try {
				refreshed = await queryMembership(channelId);
				params.signal?.throwIfAborted();
			} catch (error) {
				if (params.signal?.aborted) throw error;
				continue;
			}
			if (state.generation !== generation || !refreshed) continue;
			const current = memberships.get(channelId);
			if (current && isNewerBuzzRevision(current, refreshed)) refreshed = current;
			const pending = pendingMemberships.get(channelId);
			if (!(!pending || [...pending].every(([publicKey, expected]) => refreshed.members.has(publicKey) === (expected === "present")))) continue;
			pendingMemberships.delete(channelId);
			deniedMembers.delete(channelId);
			blockedRooms.delete(channelId);
			replaceMembership(refreshed);
			return;
		}
		if (state.generation !== state.lastAttemptedGeneration) return;
		blockedRooms.add(channelId);
		throw new Error(`Could not refresh Buzz room membership for ${channelId}`);
	};
	const refreshMembershipOnce = (channelId) => {
		const current = refreshes.get(channelId);
		if (current) {
			current.generation += 1;
			return current.promise;
		}
		const state = {
			generation: 1,
			lastAttemptedGeneration: 0,
			promise: Promise.resolve()
		};
		state.promise = refreshMembership(channelId, state).finally(() => {
			refreshes.delete(channelId);
			if (state.generation !== state.lastAttemptedGeneration && pendingMemberships.has(channelId) && !params.signal?.aborted) refreshMembershipOnce(channelId).catch(reportSystemEventError);
		});
		refreshes.set(channelId, state);
		return state.promise;
	};
	const handleSystemEvent = (event) => {
		if (!markSystemEventSeen(event.id)) return;
		const channelId = event.tags.find((tag) => tag[0] === "h")?.[1]?.trim().toLowerCase();
		if (!channelId) return;
		if (event.kind === BUZZ_ROOM_METADATA_EDIT_KIND) {
			params.onRoomMetadataChanged?.(channelId);
			return;
		}
		const membership = memberships.get(channelId);
		if (!membership) return;
		const change = parseBuzzRoomMembershipChangeEvent(event, membership);
		if (!change) return;
		const restoring = restoringRooms.get(channelId);
		if (restoring?.historical) return;
		if (restoring) restoring.generation += 1;
		const expected = change.type === "member_joined" ? "present" : "absent";
		const pending = pendingMemberships.get(channelId) ?? /* @__PURE__ */ new Map();
		pending.set(change.targetPublicKey, expected);
		pendingMemberships.set(channelId, pending);
		if (expected === "absent") {
			const denied = deniedMembers.get(channelId) ?? /* @__PURE__ */ new Set();
			denied.add(change.targetPublicKey);
			deniedMembers.set(channelId, denied);
		}
		if (change.targetPublicKey === params.botPublicKey) blockedRooms.add(channelId);
		params.onMembershipsChanged?.(effectiveMemberships());
		return refreshMembershipOnce(channelId);
	};
	const handleRoomEvent = (event, reservation) => {
		if (params.signal?.aborted) return;
		const channelId = event.tags.find((tag) => tag[0] === "h")?.[1];
		const restoring = channelId ? restoringRooms.get(channelId) : void 0;
		if (restoring && isBuzzInboundMessageKind(event.kind)) {
			restoring.until = Math.max(restoring.until ?? event.created_at, event.created_at);
			return;
		}
		if (event.kind === 39002) {
			const membership = parseBuzzRoomMembershipEvent(event, params.relayPublicKey);
			if (membership && memberships.has(membership.roomId) && isNewerBuzzRevision(membership, memberships.get(membership.roomId))) try {
				replaceMembership(membership);
			} catch (error) {
				reportSystemEventError(error);
			}
			return;
		}
		if (isBuzzInboundMessageKind(event.kind)) {
			params.onMessageEvent(event, isMember, reservation);
			return;
		}
		handleSystemEvent(event)?.catch(reportSystemEventError);
	};
	const skippedRooms = /* @__PURE__ */ new Set();
	const initialRoomIds = [];
	for (const channelId of params.channelIds) if (memberships.get(channelId)?.roles.get(params.botPublicKey) !== "bot") {
		skippedRooms.add(channelId);
		params.onRoomUnavailable?.(/* @__PURE__ */ new Error(`Buzz bot does not have the Bot role in configured room ${channelId}`));
	} else initialRoomIds.push(channelId);
	if (params.channelIds.length > 0 && initialRoomIds.length === 0) throw new Error(`Buzz bot does not have the Bot role in any configured room: ${params.channelIds.join(", ")}`);
	const subscribeRoom = (channelId) => {
		params.signal?.throwIfAborted();
		return new Promise((resolve, reject) => {
			let settled = false;
			const finish = (error) => {
				if (settled) return;
				settled = true;
				clearTimeout(timeout);
				params.signal?.removeEventListener("abort", onAbort);
				if (error === void 0) resolve();
				else reject(error instanceof Error ? error : new Error("Buzz room membership loading failed", { cause: error }));
			};
			const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz membership loading aborted"));
			const timeout = setTimeout(() => {
				finish(/* @__PURE__ */ new Error(`Timed out loading Buzz room membership changes for ${channelId}`));
				params.relay.close();
			}, MEMBERSHIP_READY_TIMEOUT_MS);
			params.signal?.addEventListener("abort", onAbort, { once: true });
			const filters = [
				{
					kinds: [BUZZ_ROOM_SYSTEM_KIND, BUZZ_ROOM_METADATA_EDIT_KIND],
					"#h": [channelId],
					since: params.since
				},
				{
					kinds: [BUZZ_ROOM_MEMBERSHIP_KIND],
					authors: [params.relayPublicKey],
					"#d": [channelId],
					limit: 1
				},
				{
					kinds: [...BUZZ_INBOUND_MESSAGE_KINDS],
					"#h": [channelId],
					since: params.messageSince(channelId),
					limit: params.messageLimit
				}
			];
			try {
				openBuzzRelaySubscription(params.relay, filters, {
					onevent: (event) => {
						if (params.signal?.aborted) return;
						if (!historicalRooms.has(channelId) && isBuzzInboundMessageKind(event.kind)) {
							const page = historyPages.get(channelId);
							if (page) {
								page.count += 1;
								page.oldest = Math.min(page.oldest, event.created_at);
							} else historyPages.set(channelId, {
								count: 1,
								oldest: event.created_at
							});
						}
						handleRoomEvent(event);
					},
					oneose: () => {
						historicalRooms.add(channelId);
						const restoring = restoringRooms.get(channelId);
						if (restoring) restoring.historical = false;
						finish();
					},
					onclose: (reason) => {
						const error = /* @__PURE__ */ new Error(`Buzz membership subscription closed for ${channelId}: ${reason}`);
						if (!historicalRooms.has(channelId)) finish(error);
						else if (reason !== "shutdown" && reason !== "relay connection closed by us" && !params.signal?.aborted) reportSystemEventError(error);
					}
				}, filters.map((filter) => Object.assign({}, filter, { "#h": [channelId] })));
			} catch (error) {
				finish(error);
			}
		});
	};
	const initialSubscriptions = [];
	try {
		for (const channelId of initialRoomIds) initialSubscriptions.push(subscribeRoom(channelId));
		await Promise.all(initialSubscriptions);
	} catch (error) {
		params.relay.close();
		await Promise.allSettled(initialSubscriptions);
		throw error;
	}
	const historyTails = /* @__PURE__ */ new Map();
	const catchUpHistory = async (channelIds, recoveryUntil) => {
		await Promise.all(channelIds.map((channelId) => {
			const task = (historyTails.get(channelId) ?? Promise.resolve()).then(async () => {
				for (let attempt = 0;; attempt++) try {
					const page = historyPages.get(channelId);
					const until = recoveryUntil ?? page?.oldest;
					if (params.signal?.aborted) return;
					if (until === void 0 || recoveryUntil === void 0 && page && page.count < params.messageLimit) return;
					const since = params.messageSince(channelId);
					const limit = params.messageLimit;
					if (await (async () => {
						async function queryBuzzRoomHistoryPage(range) {
							const events = [];
							let overLimit = false;
							return await queryBuzzRelaySnapshot({
								relay: params.relay,
								filters: [{
									kinds: [...BUZZ_INBOUND_MESSAGE_KINDS],
									"#h": [channelId],
									since: range.since,
									until: range.until,
									...range.requestLimit === void 0 ? {} : { limit: range.requestLimit }
								}],
								signal: params.signal,
								timeoutMessage: `Timed out loading Buzz room history for ${channelId}`,
								abortMessage: "Buzz room history query aborted",
								failureMessage: "Buzz room history query failed",
								closeReason: HISTORY_PAGE_COMPLETE_REASON,
								closeMessage: (reason) => `Buzz room history query closed for ${channelId}: ${reason}`,
								onEvent: (event) => {
									if (range.skipEventIds?.has(event.id)) return;
									if (events.length < range.maxEvents) events.push(event);
									else overLimit = true;
								},
								result: () => ({
									events,
									overLimit
								})
							});
						}
						async function drainBuzzRoomHistoryRange(range) {
							if (params.signal?.aborted) return "aborted";
							const historyPage = await queryBuzzRoomHistoryPage({
								since: range.since,
								until: range.until,
								maxEvents: 1024,
								skipEventIds: range.skipEventIds
							});
							if (!historyPage.overLimit || range.since === range.until) {
								if (historyPage.events.length === 0) return "complete";
								const reservation = await params.reserveDispatchCapacity(historyPage.events.length);
								if (!reservation) return "aborted";
								try {
									for (const event of historyPage.events) handleRoomEvent(event, reservation);
								} finally {
									reservation.release();
								}
								return historyPage.overLimit ? "timestamp-over-limit" : "complete";
							}
							const midpoint = Math.floor((range.since + range.until) / 2);
							const newer = await drainBuzzRoomHistoryRange({
								...range,
								since: midpoint + 1
							});
							if (newer !== "complete") return newer;
							return await drainBuzzRoomHistoryRange({
								...range,
								until: midpoint
							});
						}
						let historyUntil = until;
						while (true) {
							if (params.signal?.aborted) return "aborted";
							const reservation = await params.reserveDispatchCapacity(limit);
							if (!reservation) return "aborted";
							let historyPage;
							try {
								if (params.signal?.aborted) return "aborted";
								historyPage = await queryBuzzRoomHistoryPage({
									since,
									until: historyUntil,
									requestLimit: limit,
									maxEvents: limit
								});
								if (historyPage.events.length === 0) return "complete";
								for (const event of historyPage.events) handleRoomEvent(event, reservation);
							} finally {
								reservation.release();
							}
							let oldest = historyUntil;
							for (const event of historyPage.events) oldest = Math.min(oldest, event.created_at);
							const skipEventIds = new Set(historyPage.events.map((event) => event.id));
							if (historyPage.overLimit) return await drainBuzzRoomHistoryRange({
								since,
								until: historyUntil,
								skipEventIds
							});
							if (historyPage.events.length < limit) return "complete";
							if (oldest >= historyUntil) {
								const historyOutcome = await drainBuzzRoomHistoryRange({
									since: historyUntil,
									until: historyUntil,
									skipEventIds
								});
								if (historyOutcome !== "complete") return historyOutcome;
								if (historyUntil <= since) return "complete";
								historyUntil -= 1;
								continue;
							}
							historyUntil = oldest;
						}
					})() === "timestamp-over-limit") params.onHistoryError?.(/* @__PURE__ */ new Error(`Buzz room ${channelId} kept more than ${BUZZ_REPLAY_DISPATCH_MAX_PENDING} additional messages at one timestamp; older history was not recovered`));
					return;
				} catch (error) {
					if (!(error instanceof BuzzRelayRateLimitError) || attempt >= 3 || params.signal?.aborted) throw error;
					await sleepWithAbort(error.retryAfterMs, params.signal);
				}
			}).catch((error) => {
				if (error instanceof BuzzRelayRateLimitError) params.onHistoryError?.(error);
				else reportSystemEventError(error);
			});
			historyTails.set(channelId, task);
			return task;
		}));
	};
	const restorations = /* @__PURE__ */ new Map();
	const restoreRoom = async (channelId, state) => {
		while (!params.signal?.aborted) {
			const generation = state.generation;
			let refreshed = await queryMembership(channelId);
			params.signal?.throwIfAborted();
			if (generation !== state.generation) continue;
			const current = memberships.get(channelId);
			if (current && (!refreshed || isNewerBuzzRevision(current, refreshed))) refreshed = current;
			if (!refreshed) return;
			if (refreshed.roles.get(params.botPublicKey) !== "bot") {
				memberships.set(channelId, refreshed);
				params.onMembershipsChanged?.(effectiveMemberships());
				return;
			}
			replaceMembership(refreshed);
			params.signal?.throwIfAborted();
			skippedRooms.delete(channelId);
			const restoring = {
				historical: true,
				generation: 0
			};
			restoringRooms.set(channelId, restoring);
			await subscribeRoom(channelId);
			while (!params.signal?.aborted) {
				const refresh = refreshes.get(channelId);
				if (refresh) await refresh.promise;
				params.signal?.throwIfAborted();
				const reconciliationGeneration = restoring.generation;
				let confirmed = await queryMembership(channelId);
				params.signal?.throwIfAborted();
				if (reconciliationGeneration !== restoring.generation || refreshes.has(channelId)) continue;
				const latest = memberships.get(channelId);
				if (latest && confirmed && isNewerBuzzRevision(latest, confirmed)) confirmed = latest;
				if (!confirmed) throw new Error(`Buzz room membership missing after restoration for ${channelId}`);
				replaceMembership(confirmed);
				params.signal?.throwIfAborted();
				restoringRooms.delete(channelId);
				await catchUpHistory([channelId], restoring.until);
				return;
			}
			return;
		}
	};
	return {
		memberships: effectiveMemberships,
		catchUpHistory: () => catchUpHistory(initialRoomIds),
		handleNotification: (notification) => {
			if (params.signal?.aborted || seenEventIds.has(notification.eventId)) return true;
			if (!skippedRooms.has(notification.roomId)) return false;
			markSystemEventSeen(notification.eventId);
			const existing = restorations.get(notification.roomId);
			if (existing) {
				existing.generation += 1;
				return true;
			}
			const state = {
				generation: 1,
				promise: Promise.resolve()
			};
			restorations.set(notification.roomId, state);
			state.promise = restoreRoom(notification.roomId, state).catch(reportSystemEventError).finally(() => restorations.delete(notification.roomId));
			return true;
		},
		close: async () => {
			await Promise.allSettled([
				...[...restorations.values()].map((state) => state.promise),
				...[...refreshes.values()].map((state) => state.promise),
				...historyTails.values()
			]);
		}
	};
}
// extensions/buzz/src/buzz-bus.ts
const PRESENCE_KIND = 20001;
const PRESENCE_HEARTBEAT_INTERVAL_MS = 3e4;
const REPLAY_TTL_MS = 2592e6;
const REPLAY_MAX_ENTRIES = 1e4;
const REPLAY_STATE_MAX_ENTRIES = 5e4;
const REPLAY_NAMESPACE_PREFIX = "buzz.inbound-dedupe";
const THREAD_ROOT_CACHE_MAX_ENTRIES = 1024;
const PROFILE_KIND = 0;
const AGENT_PROFILE_KIND = 10100;
const DEFAULT_CHANNEL_ADD_POLICY = "anyone";
const CHANNEL_ADD_POLICIES = /* @__PURE__ */ new Set([
	"anyone",
	"owner_only",
	"nobody"
]);
function parseProfileContent(event) {
	return asNonArrayRecord(event ? safeParseJson(event.content) : void 0);
}
function resolveProfileTags(event, authTag) {
	const existingTags = event?.tags ?? [];
	if (!authTag) return existingTags;
	return [...existingTags.filter((tag) => tag[0] !== "auth"), authTag];
}
function hasConfiguredAuthTag(event, authTag) {
	if (!authTag) return true;
	const authTags = event?.tags.filter((tag) => tag[0] === "auth") ?? [];
	return authTags.length === 1 && JSON.stringify(authTags[0]) === JSON.stringify(authTag);
}
function buildProfileEvent(params) {
	const now = Math.floor(Date.now() / 1e3);
	return finalizeEvent({
		kind: params.kind,
		content: JSON.stringify(params.content),
		created_at: params.current ? Math.max(now, params.current.created_at + 1) : now,
		tags: params.tags
	}, params.secretKey);
}
function buildBuzzTextEvent(params) {
	return finalizeEvent({
		kind: 9,
		content: params.text,
		created_at: Math.floor(Date.now() / 1e3),
		tags: buildBuzzMessageTags(params)
	}, params.secretKey);
}
async function sendBuzzTextOneShot(params) {
	const effect = captureEffectAuthority();
	const secretKey = decodeBuzzPrivateKey(params.privateKey);
	const mentionSyntax = inspectBuzzMentionSyntax(params.text);
	const needsDirectory = mentionSyntax.hasAtMention || mentionSyntax.hasExplicitIdentity;
	const signal = needsDirectory ? AbortSignal.timeout(3e4) : void 0;
	const publicKey = needsDirectory ? resolveBuzzPublicKey(params.privateKey) : "";
	const connection = {
		relayUrl: params.relayUrl,
		secretKey,
		authTag: parseBuzzAuthTag(params.authTag ?? "")
	};
	const session = needsDirectory ? await connectAuthenticatedBuzzRelaySession({
		...connection,
		signal
	}) : void 0;
	const relay = session?.relay ?? await connectAuthenticatedBuzzRelay(connection);
	try {
		let mentionedPubkeys;
		if (session) {
			const directory = new BuzzDirectoryState({
				publicKey,
				fallbackProfileName: "OpenClaw",
				channelIds: [params.channelId]
			});
			directory.replaceMemberships(await queryBuzzRoomMemberships({
				relay,
				relayPublicKey: session.relayPublicKey,
				channelIds: [params.channelId],
				signal
			}));
			if (mentionSyntax.hasAtMention) await queryBuzzDirectoryProfiles({
				relay,
				state: directory,
				publicKeys: directory.profilePublicKeys(),
				signal
			});
			mentionedPubkeys = resolveBuzzMessageMentions({
				text: params.text,
				members: directory.mentionMembers(params.channelId),
				senderPublicKey: publicKey
			});
		}
		const event = buildBuzzTextEvent({
			...params,
			secretKey,
			mentionedPubkeys
		});
		await effect.initiate(() => {
			signal?.throwIfAborted();
			return relay.publish(event);
		});
		return event.id;
	} finally {
		relay.close();
	}
}
async function startBuzzBus(options) {
	const subscriptionBudget = resolveBuzzSubscriptionBudget(options.channelIds.length);
	const secretKey = decodeBuzzPrivateKey(options.privateKey);
	const publicKey = resolveBuzzPublicKey(options.privateKey);
	const authTag = parseBuzzAuthTag(options.authTag ?? "");
	const sessionStartedAt = Math.floor(Date.now() / 1e3);
	const lifecycleAbort = new AbortController();
	const presenceScheduler = options.scheduler.scope();
	const signal = AbortSignal.any([
		lifecycleAbort.signal,
		presenceScheduler.signal,
		...options.signal ? [options.signal] : []
	]);
	const reportFatalError = (error) => {
		if (signal.aborted) return;
		lifecycleAbort.abort(error);
		options.onFatalError?.(error);
	};
	const replayGuard = createChannelReplayGuard({
		dedupe: {
			pluginId: "buzz",
			namespacePrefix: REPLAY_NAMESPACE_PREFIX,
			ttlMs: REPLAY_TTL_MS,
			memoryMaxSize: REPLAY_MAX_ENTRIES,
			stateMaxEntries: REPLAY_STATE_MAX_ENTRIES,
			onDiskError: (error) => {
				options.onDedupeError?.(error instanceof Error ? error : new Error(String(error)));
			}
		},
		buildReplayKey: (event) => event.id,
		namespace: () => options.accountId
	});
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: options.relayUrl,
		secretKey,
		authTag,
		signal
	});
	const dispatchQueue = createBuzzReplayDispatchQueue({ onTaskError: (error) => {
		options.onMessageError?.(error instanceof Error ? error : new Error(String(error)));
	} });
	const directory = new BuzzDirectoryState({
		publicKey,
		fallbackProfileName: options.profileName ?? "OpenClaw",
		channelIds: options.channelIds,
		profileLimit: subscriptionBudget.profileLimit
	});
	let directoryRelay;
	let profileTask;
	async function syncProfile() {
		const displayName = options.profileName?.trim() ?? "";
		if (!displayName) return;
		signal.throwIfAborted();
		const currentProfiles = /* @__PURE__ */ new Map();
		await queryBuzzRelaySnapshot({
			relay,
			filters: [{
				kinds: [PROFILE_KIND],
				authors: [publicKey],
				limit: 1
			}, {
				kinds: [AGENT_PROFILE_KIND],
				authors: [publicKey],
				limit: 1
			}],
			signal,
			timeoutMessage: "Timed out loading current Buzz profile",
			abortMessage: "Buzz profile query aborted",
			failureMessage: "Buzz profile query failed",
			closeReason: "profile query complete",
			closeMessage: (reason) => `Buzz profile query closed: ${reason}`,
			onEvent: (event) => {
				const current = currentProfiles.get(event.kind);
				if (!current || compareEvents(event, current) < 0) currentProfiles.set(event.kind, event);
			},
			result: () => currentProfiles,
			onTimeout: reportFatalError
		});
		signal.throwIfAborted();
		const currentMetadata = currentProfiles.get(PROFILE_KIND);
		const currentAgentProfile = currentProfiles.get(AGENT_PROFILE_KIND);
		const metadataContent = parseProfileContent(currentMetadata);
		const agentContent = parseProfileContent(currentAgentProfile);
		const resolvedDisplayName = normalizeOptionalString(metadataContent.display_name) ?? normalizeOptionalString(agentContent.display_name) ?? normalizeOptionalString(agentContent.name) ?? displayName;
		const events = [];
		if (metadataContent.display_name !== resolvedDisplayName || !hasConfiguredAuthTag(currentMetadata, authTag)) {
			metadataContent.display_name = resolvedDisplayName;
			events.push(buildProfileEvent({
				kind: PROFILE_KIND,
				content: metadataContent,
				current: currentMetadata,
				tags: resolveProfileTags(currentMetadata, authTag),
				secretKey
			}));
		}
		let agentProfileChanged = false;
		if (!normalizeOptionalString(agentContent.name)) {
			agentContent.name = resolvedDisplayName;
			agentProfileChanged = true;
		}
		if (!normalizeOptionalString(agentContent.display_name)) {
			agentContent.display_name = resolvedDisplayName;
			agentProfileChanged = true;
		}
		if (typeof agentContent.channel_add_policy !== "string" || !CHANNEL_ADD_POLICIES.has(agentContent.channel_add_policy)) {
			agentContent.channel_add_policy = DEFAULT_CHANNEL_ADD_POLICY;
			agentProfileChanged = true;
		}
		if (agentProfileChanged) events.push(buildProfileEvent({
			kind: AGENT_PROFILE_KIND,
			content: agentContent,
			current: currentAgentProfile,
			tags: currentAgentProfile?.tags ?? [],
			secretKey
		}));
		const lastEvent = events.at(-1);
		if (!lastEvent) return;
		for (const event of events) {
			signal.throwIfAborted();
			await relay.publish(event);
		}
		signal.throwIfAborted();
		return lastEvent.id;
	}
	let membershipTracker;
	const threadRoots = /* @__PURE__ */ new Map();
	const rememberThreadRoot = (event) => {
		const root = parseBuzzMessageEvent(event);
		if (!root || root.threadId || !verifyEvent(event)) return;
		threadRoots.set(event.id, {
			channelId: root.channelId.toLowerCase(),
			isBotOwned: event.pubkey === publicKey
		});
		pruneMapToMaxSize(threadRoots, THREAD_ROOT_CACHE_MAX_ENTRIES);
	};
	const bus = {
		publicKey,
		directory,
		refreshDirectory: async () => await directoryRelay?.refreshRooms(options.channelIds),
		isBotOwnedThread: async ({ channelId, threadId }) => {
			signal.throwIfAborted();
			if (!threadRoots.has(threadId)) try {
				await queryBuzzRelaySnapshot({
					relay,
					filters: [{
						ids: [threadId],
						kinds: [...BUZZ_INBOUND_MESSAGE_KINDS],
						limit: 1
					}],
					signal,
					timeoutMessage: "Timed out loading Buzz thread root",
					abortMessage: "Buzz thread root query aborted",
					failureMessage: "Buzz thread root query failed",
					closeReason: "thread root loaded",
					closeMessage: (reason) => `Buzz thread root query closed: ${reason}`,
					onEvent: (event) => {
						if (event.id === threadId) rememberThreadRoot(event);
					},
					result: () => {},
					onTimeout: reportFatalError
				});
			} catch (error) {
				signal.throwIfAborted();
				options.onMessageError?.(error instanceof Error ? error : new Error("Buzz thread root query failed", { cause: error }));
				return false;
			}
			signal.throwIfAborted();
			const root = threadRoots.get(threadId);
			return root?.channelId === channelId && root.isBotOwned;
		},
		sendText: async ({ channelId, text, threadId, replyToId }) => {
			const effect = captureEffectAuthority();
			signal.throwIfAborted();
			const mentionSyntax = inspectBuzzMentionSyntax(text);
			const mentionedPubkeys = mentionSyntax.hasAtMention || mentionSyntax.hasExplicitIdentity ? resolveBuzzMessageMentions({
				text,
				members: directory.mentionMembers(channelId),
				senderPublicKey: publicKey
			}) : [];
			const event = buildBuzzTextEvent({
				secretKey,
				channelId,
				text,
				threadId,
				replyToId,
				mentionedPubkeys
			});
			await effect.initiate(() => {
				signal.throwIfAborted();
				return relay.publish(event);
			});
			rememberThreadRoot(event);
			return event.id;
		},
		sendTyping: async ({ channelId, threadId, replyToId }) => {
			if (signal.aborted || !relay.connected) return;
			const event = finalizeEvent({
				kind: BUZZ_TYPING_INDICATOR_KIND,
				content: "",
				created_at: Math.floor(Date.now() / 1e3),
				tags: buildBuzzMessageTags({
					channelId,
					threadId,
					replyToId
				})
			}, secretKey);
			await captureEffectAuthority().initiate(() => {
				signal.throwIfAborted();
				return relay.send(JSON.stringify(["EVENT", event]));
			});
		},
		close: async () => {
			lifecycleAbort.abort(/* @__PURE__ */ new Error("Buzz bus closed"));
			presenceScheduler.beginClose();
			await dispatchQueue.close();
			directoryRelay?.close();
			replayGuard.clearMemory();
			threadRoots.clear();
			relay.close();
			await membershipTracker?.close();
			await Promise.all([presenceScheduler.stop(), profileTask]);
		}
	};
	try {
		await queryBuzzDirectoryRooms({
			relay,
			relayPublicKey,
			state: directory,
			channelIds: options.channelIds,
			signal
		});
		const activeChannelIds = directory.activeRoomIds();
		directoryRelay = startBuzzDirectoryRelay({
			relay,
			relayPublicKey,
			state: directory,
			subscribedRoomIds: new Set(activeChannelIds),
			signal,
			onError: options.onDirectoryError,
			onFatalError: reportFatalError,
			onRoomChanged: options.onRoomDirectoryChanged
		});
		startBuzzRoomMembershipNotifications({
			relay,
			relayPublicKey,
			botPublicKey: publicKey,
			configuredRoomIds: options.channelIds,
			since: sessionStartedAt,
			signal,
			onNotification: (notification) => membershipTracker?.handleNotification(notification) ?? false,
			onFatalError: reportFatalError
		});
		membershipTracker = activeChannelIds.length > 0 ? await createBuzzRoomMembershipTracker({
			relay,
			relayPublicKey,
			channelIds: activeChannelIds,
			botPublicKey: publicKey,
			since: sessionStartedAt,
			messageSince: (channelId) => options.since?.(channelId) ?? sessionStartedAt,
			messageLimit: resolveBuzzRoomHistoryLimit(activeChannelIds.length),
			reserveDispatchCapacity: (slots) => dispatchQueue.reserveCapacity(slots),
			onHistoryError: options.onHistoryError,
			onRoomUnavailable: options.onRoomUnavailable,
			onMessageEvent: (event, isMember, reservation) => {
				if (signal.aborted) return;
				if (event.pubkey === publicKey) {
					rememberThreadRoot(event);
					return;
				}
				const message = parseBuzzMessageEvent(event);
				if (!message || !isMember(message.channelId, event.pubkey)) return;
				if ((reservation ?? dispatchQueue).enqueue(async () => {
					await replayGuard.processGuarded(event, async () => {
						const assertCurrent = () => {
							signal.throwIfAborted();
							if (!isMember(message.channelId, event.pubkey)) throw new Error("Buzz sender is no longer a room member");
						};
						assertCurrent();
						await options.onMessage(message, bus, signal, assertCurrent);
					});
				}) !== "overflow") return;
				if (reservation) {
					options.onHistoryError?.(/* @__PURE__ */ new Error(`Buzz room ${message.channelId} returned more history than the ${BUZZ_REPLAY_DISPATCH_MAX_PENDING}-message pending limit allows`));
					return;
				}
				dispatchQueue.close();
				reportFatalError(/* @__PURE__ */ new Error(`Buzz inbound replay exceeded the ${BUZZ_REPLAY_DISPATCH_MAX_PENDING}-message pending limit`));
			},
			onFatalError: reportFatalError,
			onMembershipsChanged: (memberships) => {
				if (directory.replaceMemberships(memberships)) directoryRelay?.replaceProfilePublicKeys(directory.profilePublicKeys());
			},
			onRoomMetadataChanged: (channelId) => {
				directoryRelay?.refreshRooms([channelId]).catch((error) => {
					if (!signal.aborted) options.onDirectoryError?.(error instanceof Error ? error : new Error("Buzz room directory refresh failed", { cause: error }));
				});
			},
			signal
		}) : void 0;
		directory.replaceMemberships(membershipTracker?.memberships() ?? /* @__PURE__ */ new Map());
		directoryRelay.replaceProfilePublicKeys(directory.profilePublicKeys());
		membershipTracker?.catchUpHistory();
		let presenceErrorReported = false;
		presenceScheduler.schedule({
			id: "presence",
			delayMs: 0,
			everyMs: PRESENCE_HEARTBEAT_INTERVAL_MS,
			run: async () => {
				try {
					await relay.publish(finalizeEvent({
						kind: PRESENCE_KIND,
						content: "online",
						created_at: Math.floor(Date.now() / 1e3),
						tags: []
					}, secretKey));
					presenceErrorReported = false;
				} catch (error) {
					if (signal.aborted) return;
					const failure = error instanceof Error ? error : new Error("Buzz presence heartbeat failed", { cause: error });
					if (failure.message === "publish timed out") reportFatalError(failure);
					else if (!presenceErrorReported) {
						presenceErrorReported = true;
						options.onPresenceError?.(failure);
					}
				}
			}
		});
		if (options.profileName?.trim()) profileTask = syncProfile().then((eventId) => {
			if (!signal.aborted && eventId !== void 0) options.onProfilePublished?.(eventId);
		}).catch((error) => {
			if (signal.aborted) return;
			options.onProfileError?.(error instanceof Error ? error : new Error("Buzz profile sync failed", { cause: error }));
		});
		return bus;
	} catch (error) {
		lifecycleAbort.abort(error);
		presenceScheduler.beginClose();
		await dispatchQueue.close();
		directoryRelay?.close();
		relay.close();
		await presenceScheduler.stop();
		throw error;
	}
}
// src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
// extensions/buzz/src/runtime.ts
const { setRuntime: setBuzzRuntime, getRuntime: getBuzzRuntime } = createPluginRuntimeStore({
	pluginId: "buzz",
	errorMessage: "Buzz runtime not initialized"
});
// extensions/buzz/src/inbound.ts
const log = createSubsystemLogger("buzz/inbound");
const HISTORY_ENTRY_BYTES = 512;
const HISTORY_CONTEXT_BYTES = 1024;
async function handleBuzzInbound(params) {
	const runtime = getBuzzRuntime();
	const { account, cfg, bus, message, signal, historyMap } = params;
	const channelId = parseBuzzTarget(message.channelId);
	const target = buildBuzzTarget(channelId);
	const textForAgent = formatBuzzMessageForAgent(message);
	const route = resolveAgentRoute({
		cfg,
		channel: "buzz",
		accountId: account.accountId,
		peer: {
			kind: "group",
			id: target
		}
	});
	route.sessionKey = resolveThreadSessionKeys({
		baseSessionKey: route.sessionKey,
		threadId: message.threadId
	}).sessionKey;
	const supportsTextInterpretation = message.kind !== BUZZ_DIFF_MESSAGE_KIND;
	const textMention = supportsTextInterpretation && runtime.channel.mentions.matchesMentionPatterns(message.text, runtime.channel.mentions.buildMentionRegexes(cfg, route.agentId));
	const wasMentioned = message.mentionedPubkeys.includes(bus.publicKey) || textMention;
	const shouldComputeCommandAuthorized = supportsTextInterpretation && runtime.channel.commands.shouldComputeCommandAuthorized(message.text, cfg);
	const hasControlCommand = shouldComputeCommandAuthorized && runtime.channel.text.hasControlCommand(message.text, cfg);
	const groupConfig = account.config.groups?.[channelId];
	const requireMention = groupConfig?.requireMention ?? true;
	const isBotOwnedThread = message.threadId && !wasMentioned && groupConfig?.requireMentionInBotThreads !== void 0 && groupConfig.requireMentionInBotThreads !== requireMention ? await bus.isBotOwnedThread({
		channelId,
		threadId: message.threadId
	}) : false;
	params.assertCurrent();
	const mentionPolicy = resolveBotThreadMentionPolicy({
		isBotOwnedThread,
		requireMentionInBotThreads: groupConfig?.requireMentionInBotThreads,
		requireMention
	});
	const access = await runtime.channel.inbound.ingress.resolveStable({
		channelId: "buzz",
		accountId: account.accountId,
		identity: {
			key: "buzz-pubkey",
			entryIdPrefix: "buzz-entry"
		},
		subject: { stableId: message.senderPubkey },
		conversation: {
			kind: "group",
			id: channelId,
			threadId: message.threadId
		},
		contextBinding: {
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			nativeChannelId: channelId,
			messageId: message.id,
			inboundEventKind: "user_request"
		},
		mentionFacts: {
			canDetectMention: true,
			wasMentioned
		},
		groupPolicy: groupConfig?.groupPolicy ?? account.config.groupPolicy,
		groupAllowFrom: groupConfig?.groupAllowFrom ?? account.config.groupAllowFrom,
		policy: { activation: {
			requireMention: mentionPolicy.requireMention,
			allowTextCommands: true
		} },
		command: shouldComputeCommandAuthorized ? {
			allowTextCommands: true,
			hasControlCommand
		} : void 0
	});
	params.assertCurrent();
	const historyKey = JSON.stringify([channelId, message.threadId ?? null]);
	const historyLimit = account.config.historyLimit ?? 0;
	if (access.ingress.admission !== "dispatch") {
		if (access.ingress.reasonCode === "activation_skipped") {
			const groupsPath = (cfg.channels?.buzz)?.accounts?.[account.accountId] ? `channels.buzz.accounts[${JSON.stringify(account.accountId)}].groups` : "channels.buzz.groups";
			logInboundDrop({
				log: log.info,
				channel: "buzz",
				reason: "no mention",
				target: channelId,
				onceKey: JSON.stringify([account.accountId, channelId]),
				hint: `Mention patterns can be derived from the agent identity name. Set ${groupsPath}[${JSON.stringify(channelId)}].requireMention=false to process messages without a mention.`
			});
			await recordDroppedChannelInboundHistory({
				input: {
					id: message.id,
					timestamp: message.createdAt * 1e3,
					rawText: truncateUtf8Prefix(textForAgent, HISTORY_ENTRY_BYTES)
				},
				preflight: {
					admission: {
						kind: "drop",
						reason: "missing-mention",
						recordHistory: true
					},
					message: { senderLabel: message.senderPubkey },
					history: {
						historyMap,
						key: historyKey,
						limit: historyLimit,
						shouldRecord: () => !signal.aborted && bus.directory.isMember(channelId, message.senderPubkey)
					}
				}
			});
		}
		return;
	}
	const pendingHistory = createChannelHistoryWindow({ historyMap }).buildInboundHistory({
		historyKey,
		limit: historyLimit
	}) ?? [];
	const historyEntries = [];
	let historyText = "";
	for (const entry of pendingHistory.toReversed()) {
		if (!bus.directory.isMember(channelId, entry.sender)) continue;
		const nextText = [`${truncateUtf8Prefix(bus.directory.resolveSenderName(entry.sender), 128)}: ${entry.body}`, historyText].filter(Boolean).join("\n");
		if (Buffer.byteLength(buildHistoryContext({
			historyText: nextText,
			currentMessage: ""
		})) > HISTORY_CONTEXT_BYTES) break;
		historyEntries.unshift(entry);
		historyText = nextText;
	}
	if (historyEntries.length) historyMap.set(historyKey, historyEntries);
	else historyMap.delete(historyKey);
	const consumedIds = new Set(historyEntries.map((entry) => entry.messageId));
	const bodyForAgent = buildHistoryContext({
		historyText,
		currentMessage: textForAgent
	});
	const senderName = bus.directory.resolveSenderName(message.senderPubkey);
	const roomName = bus.directory.resolveRoomName(channelId);
	const body = (await createChannelInboundEnvelopeBuilderAsync({
		cfg,
		route
	}))({
		channel: "Buzz",
		from: senderName,
		timestamp: /* @__PURE__ */ new Date(message.createdAt * 1e3),
		body: textForAgent
	});
	const ctxPayload = (params.buildContext ?? buildChannelInboundEventContext)({
		channelIngress: access,
		channel: "buzz",
		accountId: route.accountId ?? account.accountId,
		messageId: message.id,
		messageIdFull: message.id,
		timestamp: message.createdAt * 1e3,
		from: target,
		sender: {
			id: message.senderPubkey,
			name: senderName
		},
		conversation: {
			kind: "group",
			id: channelId,
			label: roomName,
			threadId: message.threadId,
			nativeChannelId: channelId
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: target,
			originatingTo: target,
			replyToId: message.id,
			messageThreadId: message.threadId,
			threadParentId: message.threadId ? channelId : void 0
		},
		message: {
			body,
			bodyForAgent,
			rawBody: message.text,
			commandBody: supportsTextInterpretation ? message.text : ""
		},
		access: {
			commands: { authorized: access.commandAccess.authorized },
			mentions: {
				canDetectMention: true,
				wasMentioned
			}
		},
		extra: {
			GroupSubject: roomName,
			BuzzEventKind: message.kind
		}
	});
	const replyTarget = {
		channelId,
		threadId: account.config.replyToMode === "off" ? void 0 : message.threadId,
		replyToId: account.config.replyToMode === "off" ? void 0 : message.threadId ?? message.id
	};
	if ((await runtime.channel.inbound.dispatch({
		cfg,
		channel: "buzz",
		accountId: account.accountId,
		route,
		ctxPayload,
		botLoopProtection: bus.directory.isBotMember(channelId, message.senderPubkey) ? {
			scopeId: `buzz:${normalizeURL(account.relayUrl)}`,
			conversationId: channelId,
			senderId: message.senderPubkey,
			receiverId: bus.publicKey,
			eventId: message.id,
			defaultsConfig: cfg.channels?.defaults?.botLoopProtection,
			defaultEnabled: true
		} : void 0,
		log: (event) => {
			if (event.reason === "bot-loop-protection") log.warn(`[${account.accountId}] Buzz bot-pair loop suppressed in ${channelId}`);
		},
		delivery: {
			deliver: async (payload) => {
				const text = payload.text ?? "";
				if (!text.trim()) return;
				await bus.sendText({
					...replyTarget,
					text
				});
			},
			onError: (error) => {
				throw error instanceof Error ? error : new Error(String(error));
			}
		},
		replyOptions: { abortSignal: signal },
		replyPipeline: { typing: {
			start: async () => {
				await bus.sendTyping(replyTarget);
			},
			keepaliveIntervalMs: 3e3,
			onStartError: (error) => {
				log.error(`[${account.accountId}] Buzz typing failed for ${channelId}: ${String(error)}`);
			}
		} },
		record: { onRecordError: (error) => {
			throw error instanceof Error ? error : /* @__PURE__ */ new Error(`Buzz session record failed: ${String(error)}`);
		} }
	})).dispatched) {
		const remaining = historyMap.get(historyKey)?.filter((entry) => !consumedIds.has(entry.messageId));
		if (remaining?.length) historyMap.set(historyKey, remaining);
		else historyMap.delete(historyKey);
	}
}
// extensions/buzz/src/recovery-watermark.ts
function roomCursorKey(channelId) {
	return `room:${channelId}`;
}
function openBuzzRecoveryWatermarkStore(params) {
	const accountScope = createHash("sha256").update(params.accountId).digest("hex").slice(0, 16);
	return getBuzzRuntime().state.openKeyedStore({
		namespace: `buzz.recovery-watermark-${accountScope}`,
		maxEntries: BUZZ_MAX_CONFIGURED_ROOMS,
		overflowPolicy: "reject-new"
	});
}
async function resolveBuzzRecoverySince(params) {
	const { store, channelIds, nowSeconds, lookbackSeconds } = params;
	const configuredKeys = new Set(channelIds.map(roomCursorKey));
	const activations = new Map((await store.entries()).map(({ key, value }) => [key, value]));
	for (const key of activations.keys()) if (key.startsWith("room:") && !configuredKeys.has(key)) await store.delete(key);
	const sinceByRoom = /* @__PURE__ */ new Map();
	const retentionFloor = nowSeconds - lookbackSeconds;
	for (const channelId of channelIds) {
		const key = roomCursorKey(channelId);
		const activation = activations.get(key);
		if (activation === void 0) {
			await store.register(key, { seconds: nowSeconds });
			activations.set(key, { seconds: nowSeconds });
			sinceByRoom.set(channelId, nowSeconds);
			continue;
		}
		if (typeof activation.seconds !== "number" || !Number.isFinite(activation.seconds)) throw new Error(`Invalid Buzz recovery watermark for room ${channelId}`);
		sinceByRoom.set(channelId, Math.min(Math.max(activation.seconds, retentionFloor), nowSeconds));
	}
	return sinceByRoom;
}
// extensions/buzz/src/gateway.ts
const activeBuses = /* @__PURE__ */ new Map();
const RECONNECT_BACKOFF = {
	initialMs: 1e3,
	maxMs: 3e4,
	factor: 2,
	jitter: .2
};
const RECONNECT_STABLE_MS = 6e4;
const RECONNECT_LOOKBACK_SECONDS = 86400;
function getActiveBuzzBus(accountId) {
	return activeBuses.get(accountId);
}
function resolveBuzzProfileName(params) {
	const explicitName = params.account.config.name?.trim();
	if (explicitName) return explicitName;
	const runtime = getBuzzRuntime();
	const agentIds = new Set(params.channelIds.map((channelId) => runtime.channel.routing.resolveAgentRoute({
		cfg: params.cfg,
		channel: "buzz",
		accountId: params.account.accountId,
		peer: {
			kind: "group",
			id: buildBuzzTarget(channelId)
		}
	}).agentId));
	if (agentIds.size !== 1) return "OpenClaw";
	const agentId = agentIds.values().next().value;
	return agentId ? runtime.agent.resolveAgentIdentity(params.cfg, agentId)?.name?.trim() || "OpenClaw" : "OpenClaw";
}
async function startBuzzGatewayAccount(ctx) {
	const buildContext = ctx.channelRuntime?.inbound.buildContext;
	const account = ctx.account;
	assertBuzzAccountAvailable(account);
	if (!account.configured) throw new Error(`Buzz is not configured for account "${account.accountId}"`);
	const channelIds = Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([channelId]) => parseBuzzTarget(channelId));
	if (channelIds.length === 0) {
		const { configPath } = resolveBuzzAccountConfig({
			cfg: ctx.cfg,
			accountId: account.accountId
		});
		throw new Error(`Buzz requires at least one enabled ${configPath}.groups entry`);
	}
	const configuredChannelIds = new Set(channelIds);
	const profileName = resolveBuzzProfileName({
		cfg: ctx.cfg,
		account,
		channelIds
	});
	const watermarkStore = openBuzzRecoveryWatermarkStore({ accountId: account.accountId });
	let reconnectAttempt = 0;
	while (!ctx.abortSignal.aborted) {
		const historyMap = /* @__PURE__ */ new Map();
		let bus;
		let cycleError;
		let connectedAt;
		const { promise: busFailure, resolve: reportBusFailure } = createDeferred$1();
		try {
			const nowSeconds = Math.floor(Date.now() / 1e3);
			const sinceByRoom = await resolveBuzzRecoverySince({
				store: watermarkStore,
				channelIds,
				nowSeconds,
				lookbackSeconds: RECONNECT_LOOKBACK_SECONDS
			});
			bus = await startBuzzBus({
				scheduler: ctx.scheduler,
				accountId: account.accountId,
				relayUrl: account.relayUrl,
				privateKey: account.privateKey,
				authTag: account.authTag,
				profileName,
				channelIds,
				since: (channelId) => sinceByRoom.get(channelId) ?? nowSeconds,
				signal: ctx.abortSignal,
				onMessage: async (message, sessionBus, signal, assertCurrent) => {
					if (!isConfiguredBuzzChannel(configuredChannelIds, message.channelId)) return;
					await handleBuzzInbound({
						account,
						cfg: ctx.cfg,
						bus: sessionBus,
						message,
						signal,
						assertCurrent,
						historyMap,
						buildContext
					});
				},
				onMessageError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz message failed: ${error.message}`);
				},
				onFatalError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz bus failed: ${error.message}`);
					reportBusFailure(error);
				},
				onDedupeError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz replay state failed: ${error.message}`);
				},
				onHistoryError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz history recovery incomplete: ${error.message}`);
				},
				onRoomUnavailable: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz room skipped: ${error.message}`);
				},
				onPresenceError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz presence heartbeat failed: ${error.message}`);
				},
				onProfilePublished: () => {
					ctx.log?.info?.(`[${account.accountId}] Buzz bot profile published as "${profileName}"`);
				},
				onProfileError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz bot profile sync failed: ${error.message}`);
				},
				onDirectoryError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz directory refresh failed: ${error.message}`);
				},
				onRoomDirectoryChanged: ctx.invalidateDirectoryCache
			});
			ctx.invalidateDirectoryCache?.();
			connectedAt = Date.now();
			activeBuses.set(account.accountId, bus);
			ctx.setStatus(channelReadyPatch({
				accountId: account.accountId,
				configured: true,
				enabled: account.enabled,
				baseUrl: account.relayUrl,
				publicKey: bus.publicKey
			}));
			ctx.log?.info?.(`[${account.accountId}] Buzz connected to ${account.relayUrl} for ${bus.directory.activeRoomIds().length} channel(s)`);
			throw await racePromiseWithAbortSignal(busFailure, ctx.abortSignal);
		} catch (error) {
			if (ctx.abortSignal.aborted) return;
			cycleError = error instanceof Error ? error : new Error(String(error));
		} finally {
			if (activeBuses.get(account.accountId) === bus) activeBuses.delete(account.accountId);
			await bus?.close();
			historyMap.clear();
			ctx.setStatus({
				accountId: account.accountId,
				running: false,
				...cycleError ? { lifecycle: "recovering" } : {},
				...cycleError ? { lastError: cycleError.message } : {}
			});
		}
		if (!cycleError || ctx.abortSignal.aborted) return;
		if (connectedAt !== void 0 && Date.now() - connectedAt >= RECONNECT_STABLE_MS) reconnectAttempt = 0;
		reconnectAttempt += 1;
		const delayMs = computeBackoff(RECONNECT_BACKOFF, reconnectAttempt);
		ctx.log?.info?.(`[${account.accountId}] Buzz reconnecting in ${delayMs}ms after: ${cycleError.message}`);
		try {
			await sleepWithAbort(delayMs, ctx.abortSignal);
		} catch {
			if (!ctx.abortSignal.aborted) throw cycleError;
		}
	}
}
const buzzOutboundAdapter = {
	deliveryMode: "direct",
	textChunkLimit: 16e3,
	deliveryCapabilities: { durableFinal: {
		text: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	sendText: async ({ cfg, to, text, accountId, threadId, replyToId }) => {
		const runtime = getBuzzRuntime();
		const account = resolveBuzzAccount({
			cfg,
			accountId
		});
		const resolvedAccountId = account.accountId;
		assertBuzzAccountAvailable(account);
		if (!account.enabled) throw new Error(`Buzz is disabled for account ${resolvedAccountId}`);
		if (!account.configured) throw new Error(`Buzz is not configured for account ${resolvedAccountId}`);
		const bus = activeBuses.get(resolvedAccountId);
		const channelId = parseBuzzTarget(to);
		const tableMode = runtime.channel.text.resolveMarkdownTableMode({
			cfg,
			channel: "buzz",
			accountId: resolvedAccountId
		});
		const outboundMessage = {
			channelId,
			text: runtime.channel.text.convertMarkdownTables(text ?? "", tableMode),
			threadId: threadId == null ? void 0 : String(threadId),
			replyToId: replyToId == null ? void 0 : String(replyToId)
		};
		const messageId = bus ? await bus.sendText(outboundMessage) : await sendBuzzTextOneShot({
			relayUrl: account.relayUrl,
			privateKey: account.privateKey,
			authTag: account.authTag,
			...outboundMessage
		});
		return attachChannelToResult("buzz", {
			to: channelId,
			messageId
		});
	}
};
async function sendBuzzTyping(params) {
	const account = resolveBuzzAccountConfig(params);
	if (!account.config.enabled) return;
	const bus = activeBuses.get(account.accountId);
	if (!bus) return;
	await bus.sendTyping({
		channelId: parseBuzzTarget(params.to),
		threadId: account.config.replyToMode === "off" || params.threadId == null ? void 0 : String(params.threadId)
	});
}
// extensions/buzz/src/channel.ts
const DIRECTORY_LIVE_TIMEOUT_MS = 1e4;
async function loadBuzzDirectoryState(params, refreshRooms) {
	const account = resolveBuzzAccount(params);
	if (account.enabled) assertBuzzAccountAvailable(account);
	if (!account.publicKey) return null;
	const channelIds = Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([roomId]) => parseBuzzTarget(roomId));
	const state = new BuzzDirectoryState({
		publicKey: account.publicKey,
		fallbackProfileName: account.name ?? "OpenClaw",
		channelIds
	});
	if (!account.enabled || !account.configured || channelIds.length === 0) return state;
	const activeBus = getActiveBuzzBus(account.accountId);
	if (activeBus) {
		if (refreshRooms) try {
			await activeBus.refreshDirectory();
		} catch {}
		return activeBus.directory;
	}
	const timeoutSignal = AbortSignal.timeout(DIRECTORY_LIVE_TIMEOUT_MS);
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: account.relayUrl,
		secretKey: decodeBuzzPrivateKey(account.privateKey),
		authTag: parseBuzzAuthTag(account.authTag),
		signal: timeoutSignal
	});
	try {
		await queryBuzzDirectoryRooms({
			relay,
			relayPublicKey,
			state,
			channelIds,
			signal: timeoutSignal
		});
		const activeChannelIds = state.activeRoomIds();
		state.replaceMemberships(activeChannelIds.length > 0 ? await queryBuzzRoomMemberships({
			relay,
			relayPublicKey,
			channelIds: activeChannelIds,
			signal: timeoutSignal
		}) : /* @__PURE__ */ new Map());
		await queryBuzzDirectoryProfiles({
			relay,
			state,
			publicKeys: state.profilePublicKeys(),
			signal: timeoutSignal
		});
		return state;
	} finally {
		relay.close();
	}
}
const buzzMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "buzz",
	outbound: buzzOutboundAdapter
});
const buzzPlugin = createChatChannelPlugin({
	base: {
		...buzzSetupPlugin,
		threading: { resolveReplyTransport: ({ replyDelivery, threadId, replyToId, replyToIsExplicit }) => {
			if (replyDelivery?.replyToMode === "off") return {
				threadId: null,
				replyToId: null
			};
			return threadId && replyToId && !replyToIsExplicit ? {
				threadId,
				replyToId: String(threadId)
			} : null;
		} },
		agentPrompt: { messageToolHints: () => ["- Buzz targets: use a configured room UUID, `buzz:<ROOM_UUID>`, or a unique current room name. Use the UUID when room names are ambiguous.", "- Buzz mentions: write a unique current room member as `@Display Name`. For an explicit identity, include `nostr:npub...`; the public key must belong to the target room. Any unresolved or ambiguous label needs an explicit identity for every intended member."] },
		config: {
			...buzzSetupPlugin.config,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: {
					baseUrl: account.relayUrl,
					publicKey: account.publicKey,
					tokenStatus: account.tokenStatus
				}
			}),
			resolveAllowFrom: ({ cfg, accountId }) => resolveBuzzAccount({
				cfg,
				accountId
			}).config.groupAllowFrom,
			resolveDefaultTo: ({ cfg, accountId }) => resolveBuzzAccount({
				cfg,
				accountId
			}).config.defaultTo
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		messaging: {
			targetPrefixes: ["buzz"],
			normalizeTarget: normalizeBuzzTarget,
			inferTargetChatType: () => "group",
			targetResolver: {
				looksLikeId: looksLikeBuzzTarget,
				hint: "<room UUID|configured room name>"
			},
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target, replyToId, threadId, currentSessionKey }) => {
				const normalized = buildBuzzTarget(parseBuzzTarget(target));
				const baseRoute = buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "buzz",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: "group",
						id: normalized
					},
					chatType: "group",
					from: `buzz:${accountId ?? "default"}`,
					to: normalized
				});
				return buildThreadAwareOutboundSessionRoute({
					route: baseRoute,
					replyToId,
					threadId,
					currentSessionKey,
					canRecoverCurrentThread: () => true
				});
			},
			resolveSessionConversation: ({ rawId }) => {
				const { baseSessionKey, threadId } = parseThreadSessionSuffix(rawId);
				const channelId = parseBuzzTarget(baseSessionKey ?? rawId);
				return {
					id: channelId,
					threadId,
					baseConversationId: channelId,
					parentConversationCandidates: [channelId]
				};
			}
		},
		status: {
			...createComputedAccountStatusAdapter({
				defaultRuntime: createDefaultChannelRuntimeState("default"),
				buildChannelSummary: ({ snapshot }) => ({
					ok: snapshot.configured,
					label: snapshot.configured ? "configured" : "missing config",
					detail: snapshot.baseUrl ?? ""
				}),
				resolveAccountSnapshot: ({ account }) => ({
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: account.configured,
					extra: {
						baseUrl: account.relayUrl,
						publicKey: account.publicKey,
						tokenStatus: account.tokenStatus
					}
				})
			}),
			probeAccount: async ({ account, timeoutMs }) => {
				assertBuzzAccountAvailable(account);
				const rooms = await discoverBuzzRooms({
					relayUrl: account.relayUrl,
					privateKey: account.privateKey,
					authTag: account.authTag,
					timeoutMs
				});
				return {
					ok: true,
					publicKey: account.publicKey,
					roomCount: rooms.length,
					rooms: rooms.map((room) => ({
						id: room.id,
						name: room.name
					}))
				};
			}
		},
		gateway: {
			apiVersion: 2,
			startAccount: startBuzzGatewayAccount
		},
		heartbeat: { sendTyping: sendBuzzTyping },
		directory: createChannelDirectoryAdapter({
			self: async (params) => (await loadBuzzDirectoryState(params, false))?.self() ?? null,
			listPeers: listBuzzDirectoryPeersFromConfig,
			listPeersLive: async (params) => (await loadBuzzDirectoryState(params, false))?.listPeers(params) ?? [],
			listGroups: listBuzzDirectoryGroupsFromConfig,
			listGroupsLive: async (params) => {
				if (!resolveBuzzAccountConfig(params).config.enabled) return listBuzzDirectoryGroupsFromConfig(params);
				return (await loadBuzzDirectoryState(params, true))?.listGroups(params) ?? [];
			},
			listGroupMembers: async (params) => (await loadBuzzDirectoryState(params, false))?.listGroupMembers(params) ?? []
		}),
		message: buzzMessageAdapter
	},
	outbound: buzzOutboundAdapter
});
export { getBuzzRuntime as n, setBuzzRuntime as r, buzzPlugin as t };
