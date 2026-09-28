import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { i as listDevicePairing } from "./device-pairing-DbLfxuuq.mjs";
import "./device-bootstrap-D68skYBI.mjs";
import { a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES, c as notifyRequestStoreKey, i as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE, l as notifySubscriberKey, n as DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS, o as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE, r as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES, u as notifySubscriberStoreKey } from "./notify-state-DpT3-FEN.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/device-pair/notify.ts
const NOTIFY_POLL_INTERVAL_MS = 1e4;
let notifyPollInFlight = null;
function formatStringList(values) {
	if (!Array.isArray(values) || values.length === 0) return "none";
	const normalized = values.map((value) => value.trim()).filter((value) => value.length > 0);
	return normalized.length > 0 ? normalized.join(", ") : "none";
}
function formatRoleList(request) {
	const role = normalizeOptionalString(request.role);
	if (role) return role;
	return formatStringList(request.roles);
}
function formatScopeList(request) {
	return formatStringList(request.scopes);
}
function formatPendingRequests(pending) {
	if (pending.length === 0) return "No pending device pairing requests.";
	const lines = ["Pending device pairing requests:"];
	for (const req of pending) {
		const label = normalizeOptionalString(req.displayName) || req.deviceId;
		const platform = normalizeOptionalString(req.platform);
		const ip = normalizeOptionalString(req.remoteIp);
		const parts = [
			`- ${req.requestId}`,
			label ? `name=${label}` : null,
			platform ? `platform=${platform}` : null,
			`role=${formatRoleList(req)}`,
			`scopes=${formatScopeList(req)}`,
			ip ? `ip=${ip}` : null
		].filter(Boolean);
		lines.push(parts.join(" · "));
	}
	return lines.join("\n");
}
function openNotifySubscriberStore(api) {
	const store = api.runtime.state.openKeyedStore({
		namespace: DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
		maxEntries: DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES
	});
	if (!store.observe || !store.compareAndApply) throw new Error("device-pair notify requires a runtime with atomic plugin state compare-and-apply support");
	return store;
}
function openNotifySeenRequestStore(api) {
	return api.runtime.state.openKeyedStore({
		namespace: DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE,
		maxEntries: DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES,
		defaultTtlMs: DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS
	});
}
function resolveNotifyTarget(ctx) {
	const to = normalizeOptionalString(ctx.senderId) || normalizeOptionalString(ctx.from) || normalizeOptionalString(ctx.to) || "";
	if (!to) return null;
	return {
		to,
		...ctx.accountId ? { accountId: ctx.accountId } : {},
		...ctx.messageThreadId != null ? { messageThreadId: ctx.messageThreadId } : {}
	};
}
function nextNotifySubscription(target, mode) {
	return {
		...target,
		mode,
		addedAtMs: Date.now(),
		armId: randomUUID()
	};
}
async function registerNotifySubscriber(params) {
	const assertCurrent = params.assertCurrent;
	const store = openNotifySubscriberStore(params.api);
	const key = notifySubscriberStoreKey(params.target);
	const current = await store.lookup(key);
	if (!params.refresh && current?.mode === params.mode) return false;
	await store.register(key, nextNotifySubscription(params.target, params.mode), { assertCurrent });
	return true;
}
function isSameNotifySubscription(current, expected) {
	if (expected.armId) return current.armId === expected.armId;
	return current.armId === void 0 && current.mode === expected.mode && current.addedAtMs === expected.addedAtMs && notifySubscriberKey(current) === notifySubscriberKey(expected);
}
function decideDeliveredNotifySubscriptionDeletion(current, delivered) {
	return {
		operation: "delete",
		action: current && isSameNotifySubscription(current, delivered) ? "delete" : "keep"
	};
}
async function deleteDeliveredNotifySubscription(store, key, delivered) {
	let observation = await store.observe(key);
	for (;;) {
		const result = await store.compareAndApply(key, observation.comparison, decideDeliveredNotifySubscriptionDeletion(observation.value, delivered));
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
function buildPairingRequestNotificationText(request) {
	const label = normalizeOptionalString(request.displayName) || request.deviceId;
	const platform = normalizeOptionalString(request.platform);
	const ip = normalizeOptionalString(request.remoteIp);
	const role = formatRoleList(request);
	const scopes = formatScopeList(request);
	return [
		"📲 New device pairing request",
		`ID: ${request.requestId}`,
		`Name: ${label}`,
		...platform ? [`Platform: ${platform}`] : [],
		`Role: ${role}`,
		`Scopes: ${scopes}`,
		...ip ? [`IP: ${ip}`] : [],
		"",
		`Approve: /pair approve ${request.requestId}`,
		"List pending: /pair pending"
	].join("\n");
}
function requestTimestampMs(request) {
	if (typeof request.ts !== "number" || !Number.isFinite(request.ts)) return null;
	const ts = Math.trunc(request.ts);
	return ts > 0 ? ts : null;
}
function shouldNotifySubscriberForRequest(subscriber, request) {
	if (subscriber.mode !== "once") return true;
	const ts = requestTimestampMs(request);
	if (ts == null) return false;
	return ts >= subscriber.addedAtMs;
}
async function notifySubscriber(params) {
	const send = (await params.api.runtime.channel.outbound.loadAdapter("telegram"))?.sendText;
	if (!send) {
		params.api.logger.warn("device-pair: telegram outbound adapter unavailable for pairing notifications");
		return false;
	}
	try {
		await send({
			cfg: params.api.config,
			to: params.subscriber.to,
			text: params.text,
			...params.subscriber.accountId ? { accountId: params.subscriber.accountId } : {},
			...params.subscriber.messageThreadId != null ? { threadId: params.subscriber.messageThreadId } : {}
		});
		return true;
	} catch (err) {
		params.api.logger.warn(`device-pair: failed to send pairing notification to ${params.subscriber.to}: ${formatErrorMessage(err)}`);
		return false;
	}
}
async function notifyPendingPairingRequests(params) {
	const subscriberStore = openNotifySubscriberStore(params.api);
	const seenRequestStore = openNotifySeenRequestStore(params.api);
	const [subscriberEntries, seenRequestEntries, pairing] = await Promise.all([
		subscriberStore.entries(),
		seenRequestStore.entries(),
		listDevicePairing()
	]);
	const subscribers = subscriberEntries.toSorted((a, b) => a.value.addedAtMs - b.value.addedAtMs);
	const pending = pairing.pending;
	const now = Date.now();
	const pendingIds = new Set(pending.map((entry) => entry.requestId));
	const notifiedRequestIds = /* @__PURE__ */ new Set();
	for (const entry of seenRequestEntries) {
		const requestId = normalizeOptionalString(entry.value.requestId);
		const notifiedAtMs = entry.value.notifiedAtMs;
		if (!requestId || !Number.isFinite(notifiedAtMs) || notifiedAtMs <= 0 || !pendingIds.has(requestId) || now - notifiedAtMs > 864e5) {
			await seenRequestStore.delete(entry.key);
			continue;
		}
		notifiedRequestIds.add(requestId);
	}
	if (subscribers.length > 0) {
		const deliveredOneShots = /* @__PURE__ */ new Set();
		for (const request of pending) {
			if (notifiedRequestIds.has(request.requestId)) continue;
			const text = buildPairingRequestNotificationText(request);
			let delivered = false;
			for (const entry of subscribers) {
				const subscriber = entry.value;
				if (subscriber.mode === "once" && deliveredOneShots.has(entry.key)) continue;
				if (!shouldNotifySubscriberForRequest(subscriber, request)) continue;
				const sent = await notifySubscriber({
					api: params.api,
					subscriber,
					text
				});
				delivered = delivered || sent;
				if (sent && subscriber.mode === "once") {
					deliveredOneShots.add(entry.key);
					await deleteDeliveredNotifySubscription(subscriberStore, entry.key, subscriber);
				}
			}
			if (delivered) {
				await seenRequestStore.register(notifyRequestStoreKey(request.requestId), {
					requestId: request.requestId,
					notifiedAtMs: now
				}, { ttlMs: DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS });
				notifiedRequestIds.add(request.requestId);
			}
		}
	}
}
async function runNotifyPoll(api) {
	if (notifyPollInFlight) return;
	notifyPollInFlight = notifyPendingPairingRequests({ api });
	try {
		await notifyPollInFlight;
	} finally {
		notifyPollInFlight = null;
	}
}
async function armPairNotifyOnce(params) {
	if (params.ctx.channel !== "telegram") return false;
	const target = resolveNotifyTarget(params.ctx);
	if (!target) return false;
	await registerNotifySubscriber({
		api: params.api,
		target,
		mode: "once",
		refresh: true,
		assertCurrent: params.ctx.assertOwnerCurrent
	});
	return true;
}
async function handleNotifyCommand(params) {
	const assertOwnerCurrent = params.ctx.assertOwnerCurrent;
	if (params.ctx.channel !== "telegram") return { text: "Pairing notifications are currently supported only on Telegram." };
	const target = resolveNotifyTarget(params.ctx);
	if (!target) return { text: "Could not resolve Telegram target for this chat." };
	const subscriberStore = openNotifySubscriberStore(params.api);
	const targetStoreKey = notifySubscriberStoreKey(target);
	if (params.action === "on" || params.action === "enable") {
		await registerNotifySubscriber({
			api: params.api,
			target,
			mode: "persistent",
			refresh: false,
			assertCurrent: assertOwnerCurrent
		});
		return { text: "✅ Pair request notifications enabled for this Telegram chat.\nI will ping here when a new device pairing request arrives." };
	}
	if (params.action === "off" || params.action === "disable") {
		await subscriberStore.delete(targetStoreKey, { assertCurrent: assertOwnerCurrent });
		return { text: "✅ Pair request notifications disabled for this Telegram chat." };
	}
	if (params.action === "once" || params.action === "arm") {
		await armPairNotifyOnce({
			api: params.api,
			ctx: params.ctx
		});
		return { text: "✅ One-shot pairing notification armed for this Telegram chat.\nI will notify on the next new pairing request, then auto-disable." };
	}
	if (params.action === "status" || params.action === "") {
		const [current, subscriberCount, pending] = await Promise.all([
			subscriberStore.lookup(targetStoreKey),
			subscriberStore.count ? subscriberStore.count() : subscriberStore.entries().then((entries) => entries.length),
			listDevicePairing()
		]);
		const enabled = Boolean(current);
		assertOwnerCurrent?.();
		const mode = current?.mode ?? "off";
		return { text: [
			`Pair request notifications: ${enabled ? "enabled" : "disabled"} for this chat.`,
			`Mode: ${mode}`,
			`Subscribers: ${subscriberCount}`,
			`Pending requests: ${pending.pending.length}`,
			"",
			"Use /pair notify on|off|once"
		].join("\n") };
	}
	return { text: "Usage: /pair notify on|off|once|status" };
}
function createPairingNotifierService(api) {
	let notifyInterval = null;
	return {
		id: "device-pair-notifier",
		start: () => {
			const tick = async () => {
				await runNotifyPoll(api);
			};
			notifyInterval = setInterval(() => {
				tick().catch((err) => {
					api.logger.warn(`device-pair: notify poll failed: ${formatErrorMessage(err)}`);
				});
			}, NOTIFY_POLL_INTERVAL_MS);
			notifyInterval.unref?.();
		},
		stop: async () => {
			if (notifyInterval) {
				clearInterval(notifyInterval);
				notifyInterval = null;
			}
		}
	};
}
//#endregion
export { handleNotifyCommand as i, createPairingNotifierService as n, formatPendingRequests as r, armPairNotifyOnce as t };
