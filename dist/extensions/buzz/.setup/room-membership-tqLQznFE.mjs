import { l as BUZZ_CHANNEL_ID_PATTERN } from "./types-CeupBG0P.mjs";
import { Relay, finalizeEvent } from "nostr-tools";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/buzz/src/event-order.ts
function isNewerBuzzRevision(candidate, current) {
	return !current || candidate.createdAt > current.createdAt || candidate.createdAt === current.createdAt && candidate.eventId < current.eventId;
}
//#endregion
//#region extensions/buzz/src/relay-subscription.ts
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
			else reject(error instanceof Error ? error : new Error(params.failureMessage, { cause: error }));
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
export { connectAuthenticatedBuzzRelay as a, openBuzzRelaySubscription as c, parseBuzzRoomMembershipEvent as i, queryBuzzRelaySnapshot as l, BUZZ_ROOM_SYSTEM_KIND as n, connectAuthenticatedBuzzRelaySession as o, parseBuzzRoomMembershipChangeEvent as r, parseBuzzAuthTag as s, BUZZ_ROOM_MEMBERSHIP_KIND as t, isNewerBuzzRevision as u };
