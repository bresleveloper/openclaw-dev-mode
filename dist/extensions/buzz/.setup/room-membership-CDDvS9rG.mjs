import { l as BUZZ_CHANNEL_ID_PATTERN, m as parseBuzzTarget, u as buildBuzzTarget } from "./types-DRUZMyTx.mjs";
import { t as applyBuzzDirectoryQueryAndLimit } from "./directory-query-D1BNu8nO.mjs";
import { Relay, finalizeEvent } from "nostr-tools";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { safeParseJson, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/buzz/src/event-order.ts
function isNewerBuzzRevision(candidate, current) {
	return !current || candidate.createdAt > current.createdAt || candidate.createdAt === current.createdAt && candidate.eventId < current.eventId;
}
const BUZZ_ROOM_METADATA_KIND = 39e3;
const DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT = 2e3;
const HEX_PUBLIC_KEY_PATTERN$2 = /^[0-9a-f]{64}$/u;
const MAX_DIRECTORY_NAME_CHARS = 512;
const MAX_DIRECTORY_HANDLE_CHARS = 320;
const MAX_DIRECTORY_URL_CHARS = 4096;
function normalizeBoundedString(value, maxChars) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? truncateUtf16Safe(trimmed, maxChars) : void 0;
}
function readPreferredString(params) {
	if (Object.hasOwn(params.content, params.primary)) return normalizeBoundedString(params.content[params.primary], params.maxChars);
	return normalizeBoundedString(params.content[params.fallback], params.maxChars);
}
function fallbackPublicKeyLabel(publicKey) {
	return `${publicKey.slice(0, 8)}...${publicKey.slice(-6)}`;
}
function parseBuzzDirectoryProfileEvent(event) {
	const publicKey = event.pubkey.trim().toLowerCase();
	if (event.kind !== 0 || !HEX_PUBLIC_KEY_PATTERN$2.test(publicKey)) return;
	const content = safeParseJson(event.content);
	if (!isRecord(content)) return;
	return {
		publicKey,
		displayName: readPreferredString({
			content,
			primary: "display_name",
			fallback: "name",
			maxChars: MAX_DIRECTORY_NAME_CHARS
		}),
		handle: normalizeBoundedString(content.nip05, MAX_DIRECTORY_HANDLE_CHARS),
		avatarUrl: readPreferredString({
			content,
			primary: "picture",
			fallback: "image",
			maxChars: MAX_DIRECTORY_URL_CHARS
		}),
		createdAt: event.created_at,
		eventId: event.id
	};
}
function parseBuzzDirectoryRoomEvent(event) {
	if (event.kind !== 39e3) return;
	const roomId = event.tags.find((tag) => tag[0] === "d")?.[1]?.trim().toLowerCase();
	if (!roomId) return;
	try {
		parseBuzzTarget(roomId);
	} catch {
		return;
	}
	return {
		roomId,
		name: normalizeBoundedString(event.tags.find((tag) => tag[0] === "name")?.[1], MAX_DIRECTORY_NAME_CHARS),
		archived: event.tags.some((tag) => tag[0] === "archived" && tag[1] === "true"),
		createdAt: event.created_at,
		eventId: event.id
	};
}
var BuzzDirectoryState = class {
	#publicKey;
	#fallbackProfileName;
	#configuredRoomIds;
	#profileLimit;
	#memberships = /* @__PURE__ */ new Map();
	#profilePublicKeys = /* @__PURE__ */ new Set();
	#profiles = /* @__PURE__ */ new Map();
	#rooms = /* @__PURE__ */ new Map();
	constructor(params) {
		this.#publicKey = params.publicKey.trim().toLowerCase();
		this.#fallbackProfileName = params.fallbackProfileName.trim() || "OpenClaw";
		this.#configuredRoomIds = new Set(params.channelIds.map(parseBuzzTarget));
		const requestedProfileLimit = params.profileLimit ?? DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT;
		this.#profileLimit = Number.isFinite(requestedProfileLimit) && requestedProfileLimit >= 0 ? Math.floor(requestedProfileLimit) : DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT;
		if (this.#profileLimit > 0) this.#profilePublicKeys.add(this.#publicKey);
	}
	replaceMemberships(memberships) {
		const nextMemberships = /* @__PURE__ */ new Map();
		const memberPublicKeys = /* @__PURE__ */ new Set();
		for (const roomId of this.#configuredRoomIds) {
			const membership = memberships.get(roomId);
			if (!membership) continue;
			nextMemberships.set(roomId, membership);
			for (const publicKey of membership.members) memberPublicKeys.add(publicKey);
		}
		memberPublicKeys.delete(this.#publicKey);
		const nextProfilePublicKeys = this.#profileLimit === 0 ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set([this.#publicKey, ...[...memberPublicKeys].toSorted().slice(0, this.#profileLimit - 1)]);
		const profileSelectionChanged = nextProfilePublicKeys.size !== this.#profilePublicKeys.size || [...nextProfilePublicKeys].some((publicKey) => !this.#profilePublicKeys.has(publicKey));
		this.#memberships = nextMemberships;
		this.#profilePublicKeys = nextProfilePublicKeys;
		for (const publicKey of this.#profiles.keys()) if (!nextProfilePublicKeys.has(publicKey)) this.#profiles.delete(publicKey);
		return profileSelectionChanged;
	}
	profilePublicKeys() {
		return [...this.#profilePublicKeys];
	}
	activeRoomIds() {
		return [...this.#configuredRoomIds].filter((roomId) => !this.#rooms.get(roomId)?.archived);
	}
	isRoomArchived(roomId) {
		return this.#rooms.get(parseBuzzTarget(roomId))?.archived === true;
	}
	isBotMember(roomId, publicKey) {
		return this.isMember(roomId, publicKey) && this.#memberships.get(parseBuzzTarget(roomId))?.roles.get(publicKey) === "bot";
	}
	isMember(roomId, publicKey) {
		const normalizedRoomId = parseBuzzTarget(roomId);
		return !this.#rooms.get(normalizedRoomId)?.archived && this.#memberships.get(normalizedRoomId)?.members.has(publicKey) === true;
	}
	applyProfileEvent(event) {
		const profile = parseBuzzDirectoryProfileEvent(event);
		if (!profile || !this.#profilePublicKeys.has(profile.publicKey) || !isNewerBuzzRevision(profile, this.#profiles.get(profile.publicKey))) return false;
		this.#profiles.set(profile.publicKey, profile);
		return true;
	}
	applyRoomEvent(event) {
		const room = parseBuzzDirectoryRoomEvent(event);
		if (!room || !this.#configuredRoomIds.has(room.roomId) || !isNewerBuzzRevision(room, this.#rooms.get(room.roomId))) return false;
		this.#rooms.set(room.roomId, room);
		return true;
	}
	resolveSenderName(publicKey) {
		const normalized = publicKey.trim().toLowerCase();
		return this.#profiles.get(normalized)?.displayName ?? fallbackPublicKeyLabel(normalized);
	}
	resolveRoomName(roomId) {
		const normalized = parseBuzzTarget(roomId);
		return this.#rooms.get(normalized)?.name ?? normalized;
	}
	self() {
		return this.#buildUserEntry(this.#publicKey);
	}
	listPeers(params) {
		const peers = /* @__PURE__ */ new Set();
		for (const roomId of this.activeRoomIds()) {
			const membership = this.#memberships.get(roomId);
			if (!membership) continue;
			for (const publicKey of membership.members) if (publicKey !== this.#publicKey) peers.add(publicKey);
		}
		const entries = [...peers].map((publicKey) => this.#buildUserEntry(publicKey)).toSorted(compareDirectoryEntries);
		return applyBuzzDirectoryQueryAndLimit(entries, params);
	}
	listGroups(params) {
		const entries = this.activeRoomIds().map((roomId) => this.#buildRoomEntry(roomId)).toSorted(compareDirectoryEntries);
		return applyBuzzDirectoryQueryAndLimit(entries, params);
	}
	listGroupMembers(params) {
		let roomId;
		try {
			roomId = parseBuzzTarget(params.groupId);
		} catch {
			return [];
		}
		if (this.#rooms.get(roomId)?.archived) return [];
		const membership = this.#memberships.get(roomId);
		if (!membership) return [];
		const entries = [...membership.members].map((publicKey) => {
			const entry = this.#buildUserEntry(publicKey);
			entry.raw = {
				publicKey,
				role: membership.roles.get(publicKey),
				roomId
			};
			return entry;
		}).toSorted(compareDirectoryEntries);
		return applyBuzzDirectoryQueryAndLimit(entries, { limit: params.limit });
	}
	mentionMembers(roomId) {
		const normalized = parseBuzzTarget(roomId);
		if (this.#rooms.get(normalized)?.archived) return;
		const membership = this.#memberships.get(normalized);
		if (!membership) return;
		return [...membership.members].map((publicKey) => ({
			publicKey,
			displayName: this.#profiles.get(publicKey)?.displayName
		})).toSorted((left, right) => left.publicKey.localeCompare(right.publicKey));
	}
	#buildUserEntry(publicKey) {
		const profile = this.#profiles.get(publicKey);
		return {
			kind: "user",
			id: publicKey,
			name: profile?.displayName ?? (publicKey === this.#publicKey ? this.#fallbackProfileName : fallbackPublicKeyLabel(publicKey)),
			handle: profile?.handle,
			avatarUrl: profile?.avatarUrl,
			raw: { publicKey }
		};
	}
	#buildRoomEntry(roomId) {
		const room = this.#rooms.get(roomId);
		return {
			kind: "group",
			id: buildBuzzTarget(roomId),
			name: room?.name ?? roomId,
			handle: room?.name ? `#${room.name}` : void 0,
			raw: { roomId }
		};
	}
};
function compareDirectoryEntries(a, b) {
	const aLabel = a.name ?? a.handle ?? a.id;
	const bLabel = b.name ?? b.handle ?? b.id;
	return aLabel.localeCompare(bLabel) || a.id.localeCompare(b.id);
}
//#endregion
//#region extensions/buzz/src/subscription-budget.ts
const BUZZ_DIRECTORY_MAX_PROFILE_SUBSCRIPTIONS = 10;
const BUZZ_MAX_CONFIGURED_ROOMS = 1020;
function resolveBuzzSubscriptionBudget(roomCount) {
	if (!Number.isSafeInteger(roomCount) || roomCount < 0) throw new Error("Buzz configured room count must be a non-negative integer");
	const availableProfileSubscriptions = 1020 - roomCount;
	if (availableProfileSubscriptions < 0) throw new Error(`Buzz supports at most ${BUZZ_MAX_CONFIGURED_ROOMS} configured rooms per account`);
	return { profileLimit: Math.min(BUZZ_DIRECTORY_MAX_PROFILE_SUBSCRIPTIONS, availableProfileSubscriptions) * 200 };
}
//#endregion
//#region extensions/buzz/src/relay-subscription.ts
const snapshotQueries = /* @__PURE__ */ new WeakMap();
function openBuzzRelaySubscription(relay, filters, params, requestFilters = filters) {
	relay.idleSince = void 0;
	relay.ongoingOperations += 1;
	let subscription;
	try {
		subscription = relay.prepareSubscription(filters, params);
	} catch (error) {
		relay.ongoingOperations -= 1;
		if (relay.ongoingOperations === 0) {
			relay.idleSince = Date.now();
			relay.scheduleIdleClose();
		}
		throw error;
	}
	const frame = JSON.stringify([
		"REQ",
		subscription.id,
		...requestFilters
	]);
	relay.send(frame).catch((error) => {
		if (subscription.closed || relay.openSubs.get(subscription.id) !== subscription) return;
		const message = error instanceof Error ? error.message : String(error);
		subscription.close(`Buzz relay subscription request failed: ${message}`);
	});
	return subscription;
}
async function queryBuzzRelaySnapshot(params) {
	params.signal?.throwIfAborted();
	const queries = snapshotQueries.get(params.relay) ?? {
		active: 0,
		waiting: []
	};
	snapshotQueries.set(params.relay, queries);
	if (queries.active >= 3) await new Promise((resolve, reject) => {
		const grant = () => {
			params.signal?.removeEventListener("abort", onAbort);
			resolve();
		};
		const onAbort = () => {
			const index = queries.waiting.indexOf(grant);
			if (index < 0) return;
			queries.waiting.splice(index, 1);
			params.signal?.removeEventListener("abort", onAbort);
			const reason = params.signal?.reason ?? new Error(params.abortMessage);
			reject(reason instanceof Error ? reason : snapshotFailure(params.failureMessage, reason));
		};
		queries.waiting.push(grant);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) onAbort();
	});
	else queries.active += 1;
	try {
		params.signal?.throwIfAborted();
		return await queryBuzzRelaySnapshotNow(params);
	} finally {
		const next = queries.waiting.shift();
		if (next) next();
		else {
			queries.active -= 1;
			if (queries.active === 0) snapshotQueries.delete(params.relay);
		}
	}
}
async function queryBuzzRelaySnapshotNow(params) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		let receivedEose = false;
		let subscriptionClosed = false;
		let subscription;
		const timeout = setTimeout(() => {
			const error = new Error(params.timeoutMessage);
			finish(error);
			params.onTimeout?.(error);
			if (params.closeRelayOnTimeout !== false) params.relay.close();
		}, params.timeoutMs ?? 1e4);
		const closeAfterRealEose = () => {
			if (receivedEose && subscription && !subscriptionClosed) {
				subscriptionClosed = true;
				subscription.close(params.closeReason);
			}
		};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			closeAfterRealEose();
			if (error === void 0) resolve(params.result());
			else reject(error instanceof Error ? error : snapshotFailure(params.failureMessage, error));
		};
		const onAbort = () => finish(params.signal?.reason ?? new Error(params.abortMessage));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			subscription = openBuzzRelaySubscription(params.relay, params.filters, {
				onevent: params.onEvent,
				oneose: () => {
					receivedEose = true;
					if (settled) closeAfterRealEose();
					else finish();
				},
				onclose: (reason) => {
					if (reason !== params.closeReason) finish(new Error(params.closeMessage(reason)));
				}
			});
		} catch (error) {
			finish(error);
			return;
		}
		closeAfterRealEose();
		if (params.checkAbortAfterSubscribe && params.signal?.aborted) onAbort();
	});
}
function snapshotFailure(message, error) {
	return message === void 0 ? new Error(String(error)) : new Error(message, { cause: error });
}
//#endregion
//#region extensions/buzz/src/relay-auth.ts
const AUTH_CHALLENGE_TIMEOUT_MS = 2e4;
const AUTH_CHALLENGE_POLL_MS = 25;
const RELAY_SESSION_SETUP_TIMEOUT_MS = 2e4;
const HEX_PUBLIC_KEY_PATTERN$1 = /^[0-9a-f]{64}$/u;
const BUZZ_RELAY_SOFTWARE = "https://github.com/block/buzz";
const BUZZ_LOCAL_DEV_RELAY_PUBLIC_KEY = "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
function parseBuzzAuthTag(raw) {
	if (!raw.trim()) return;
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed) || parsed.length !== 4 || parsed[0] !== "auth" || parsed.some((value) => typeof value !== "string")) throw new Error("Buzz authTag must be [\"auth\",\"<pubkey>\",\"<conditions>\",\"<signature>\"]");
	return parsed;
}
async function waitWithSignal(promise, signal) {
	signal.throwIfAborted();
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			const reason = signal.reason;
			reject(reason instanceof Error ? reason : new Error("Buzz relay authentication aborted", { cause: reason }));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
	});
}
function createBuzzAuthSigner(params) {
	return async (template) => finalizeEvent({
		...template,
		tags: params.authTag ? [...template.tags, params.authTag] : template.tags
	}, params.secretKey);
}
function isLoopbackRelayUrl(relayUrl) {
	const hostname = new URL(relayUrl).hostname.toLowerCase();
	return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
async function resolveBuzzRelayPublicKey(params) {
	const infoUrl = new URL(params.relayUrl);
	infoUrl.protocol = infoUrl.protocol === "wss:" ? "https:" : "http:";
	const url = infoUrl.toString();
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: { headers: { Accept: "application/nostr+json" } },
		signal: params.signal,
		policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(url),
		auditContext: "buzz.relay_info"
	});
	try {
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			throw new Error(`Buzz relay information request failed with HTTP ${response.status}`);
		}
		const document = await readProviderJsonObjectResponse(response, "Buzz relay information");
		const relayPublicKey = typeof document.self === "string" ? document.self.trim().toLowerCase() : "";
		if (HEX_PUBLIC_KEY_PATTERN$1.test(relayPublicKey)) return relayPublicKey;
		if (document.software === BUZZ_RELAY_SOFTWARE && isLoopbackRelayUrl(params.relayUrl)) return BUZZ_LOCAL_DEV_RELAY_PUBLIC_KEY;
		throw new Error("Buzz relay information document is missing a valid NIP-11 self public key");
	} finally {
		await release();
	}
}
async function connectAndAuthenticateBuzzRelay(params) {
	const signAuth = createBuzzAuthSigner({
		secretKey: params.secretKey,
		authTag: params.authTag
	});
	await params.relay.connect({ abort: params.signal });
	await authenticateBuzzRelay({
		relay: params.relay,
		signAuth,
		signal: params.signal
	});
	params.relay.onauth = signAuth;
}
async function connectAuthenticatedBuzzRelay(params) {
	const relay = new Relay(params.relayUrl, { enableReconnect: false });
	try {
		await connectAndAuthenticateBuzzRelay({
			...params,
			relay
		});
		return relay;
	} catch (error) {
		relay.close();
		throw error;
	}
}
async function connectAuthenticatedBuzzRelaySession(params) {
	const relay = new Relay(params.relayUrl, { enableReconnect: false });
	const setupAbort = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, setupAbort.signal]) : setupAbort.signal;
	let setupTimedOut = false;
	const setupTimeout = setTimeout(() => {
		setupTimedOut = true;
		setupAbort.abort(/* @__PURE__ */ new Error("Timed out setting up Buzz relay session"));
	}, RELAY_SESSION_SETUP_TIMEOUT_MS);
	const authPromise = connectAndAuthenticateBuzzRelay({
		...params,
		relay,
		signal
	});
	const relayIdentityPromise = resolveBuzzRelayPublicKey({
		relayUrl: params.relayUrl,
		signal
	});
	try {
		const [, relayPublicKey] = await Promise.all([authPromise, relayIdentityPromise]);
		return {
			relay,
			relayPublicKey
		};
	} catch (error) {
		setupAbort.abort(error);
		relay.close();
		await Promise.allSettled([authPromise, relayIdentityPromise]);
		if (setupTimedOut && !params.signal?.aborted) throw new Error("Timed out setting up Buzz relay session", { cause: error });
		throw error;
	} finally {
		clearTimeout(setupTimeout);
	}
}
async function authenticateBuzzRelay(params) {
	const challengeTimeout = AbortSignal.timeout(AUTH_CHALLENGE_TIMEOUT_MS);
	const signal = params.signal ? AbortSignal.any([params.signal, challengeTimeout]) : challengeTimeout;
	try {
		while (true) {
			signal.throwIfAborted();
			try {
				await waitWithSignal(params.relay.auth(params.signAuth), signal);
				return;
			} catch (error) {
				if (!(error instanceof Error && error.message === "can't perform auth, no challenge was received")) throw error;
				await waitWithSignal(new Promise((resolve) => {
					setTimeout(resolve, AUTH_CHALLENGE_POLL_MS);
				}), signal);
			}
		}
	} catch (error) {
		if (challengeTimeout.aborted && !params.signal?.aborted) throw new Error("Timed out waiting for Buzz NIP-42 authentication challenge", { cause: error });
		throw error;
	}
}
//#endregion
//#region extensions/buzz/src/room-membership.ts
const BUZZ_ROOM_MEMBERSHIP_KIND = 39002;
const BUZZ_ROOM_SYSTEM_KIND = 40099;
const HEX_PUBLIC_KEY_PATTERN = /^[0-9a-f]{64}$/u;
const MEMBERSHIP_CHANGE_TYPES = /* @__PURE__ */ new Set([
	"member_joined",
	"member_left",
	"member_removed"
]);
function parseBuzzRoomMembershipEvent(event, relayPublicKey) {
	if (event.kind !== 39002 || event.pubkey.toLowerCase() !== relayPublicKey) return;
	const roomId = event.tags.find((tag) => tag[0] === "d")?.[1]?.trim().toLowerCase();
	if (!roomId || !BUZZ_CHANNEL_ID_PATTERN.test(roomId)) return;
	const members = /* @__PURE__ */ new Set();
	const roles = /* @__PURE__ */ new Map();
	for (const tag of event.tags) {
		if (tag[0] !== "p") continue;
		const publicKey = tag[1]?.trim().toLowerCase();
		if (!publicKey || !HEX_PUBLIC_KEY_PATTERN.test(publicKey)) continue;
		members.add(publicKey);
		const role = tag[3]?.trim().toLowerCase();
		if (role) roles.set(publicKey, role);
	}
	return {
		roomId,
		createdAt: event.created_at,
		eventId: event.id,
		publisherPublicKey: event.pubkey.toLowerCase(),
		members,
		roles
	};
}
function parseBuzzRoomMembershipChangeEvent(event, membership) {
	if (event.kind !== 40099 || event.pubkey.toLowerCase() !== membership.publisherPublicKey || !event.tags.some((tag) => tag[0] === "h" && tag[1]?.toLowerCase() === membership.roomId)) return;
	try {
		const content = JSON.parse(event.content);
		if (typeof content.type !== "string" || !MEMBERSHIP_CHANGE_TYPES.has(content.type)) return;
		const target = typeof content.target === "string" ? content.target.trim().toLowerCase() : content.type === "member_left" && typeof content.actor === "string" ? content.actor.trim().toLowerCase() : "";
		if (!HEX_PUBLIC_KEY_PATTERN.test(target)) return;
		return {
			type: content.type,
			targetPublicKey: target
		};
	} catch {
		return;
	}
}
//#endregion
export { connectAuthenticatedBuzzRelay as a, openBuzzRelaySubscription as c, resolveBuzzSubscriptionBudget as d, BUZZ_ROOM_METADATA_KIND as f, parseBuzzRoomMembershipEvent as i, queryBuzzRelaySnapshot as l, isNewerBuzzRevision as m, BUZZ_ROOM_SYSTEM_KIND as n, connectAuthenticatedBuzzRelaySession as o, BuzzDirectoryState as p, parseBuzzRoomMembershipChangeEvent as r, parseBuzzAuthTag as s, BUZZ_ROOM_MEMBERSHIP_KIND as t, BUZZ_MAX_CONFIGURED_ROOMS as u };
