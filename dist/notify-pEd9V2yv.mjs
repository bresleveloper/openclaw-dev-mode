import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as listDevicePairing } from "./device-pairing-_Xo0MHGf.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./device-bootstrap-BlN58LGR.mjs";
import { a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE, i as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES, n as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES, o as notifyRequestStoreKey, r as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE, s as notifySubscriberStoreKey, t as DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS } from "./notify-state-DO3HCUPv.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/device-pair/notify.ts
const NOTIFY_POLL_INTERVAL_MS = 1e4;
const notifyStateListeners = /* @__PURE__ */ new Set();
async function writeNotifyState(write) {
	try {
		return await write();
	} finally {
		for (const listener of notifyStateListeners) listener();
	}
}
function formatStringList(values) {
	return normalizeTrimmedStringList(values).join(", ") || "none";
}
function formatRoleList(request) {
	return normalizeOptionalString(request.role) ?? formatStringList(request.roles);
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
			`scopes=${formatStringList(req.scopes)}`,
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
	await writeNotifyState(() => store.register(key, nextNotifySubscription(params.target, params.mode), { assertCurrent }));
	return true;
}
function buildPairingRequestNotificationText(request) {
	const label = normalizeOptionalString(request.displayName) || request.deviceId;
	const platform = normalizeOptionalString(request.platform);
	const ip = normalizeOptionalString(request.remoteIp);
	const role = formatRoleList(request);
	const scopes = formatStringList(request.scopes);
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
async function notifyPendingPairingRequests(params) {
	const subscriberStore = openNotifySubscriberStore(params.api);
	const seenRequestStore = openNotifySeenRequestStore(params.api);
	const [subscriberEntries, seenRequestEntries] = await Promise.all([subscriberStore.entries(), seenRequestStore.entries()]);
	if (subscriberEntries.length === 0 && seenRequestEntries.length === 0) return false;
	const pairing = await listDevicePairing();
	const subscribers = subscriberEntries.toSorted((a, b) => a.value.addedAtMs - b.value.addedAtMs);
	const pending = pairing.pending;
	const now = Date.now();
	const pendingIds = new Set(pending.map((entry) => entry.requestId));
	const notifiedRequestIds = /* @__PURE__ */ new Set();
	for (const entry of seenRequestEntries) {
		const requestId = normalizeOptionalString(entry.value.requestId);
		const notifiedAtMs = entry.value.notifiedAtMs;
		if (!requestId || !Number.isFinite(notifiedAtMs) || notifiedAtMs <= 0 || !pendingIds.has(requestId) || now - notifiedAtMs > 864e5) {
			await writeNotifyState(() => seenRequestStore.delete(entry.key));
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
				if (deliveredOneShots.has(entry.key)) continue;
				const send = (await params.api.runtime.channel.outbound.loadAdapter("telegram"))?.sendText;
				if (!send) {
					params.api.logger.warn("device-pair: telegram outbound adapter unavailable for pairing notifications");
					continue;
				}
				const observation = await subscriberStore.observe(entry.key);
				const subscriber = observation.value;
				if (!subscriber || !shouldNotifySubscriberForRequest(subscriber, request)) continue;
				try {
					await send({
						cfg: params.api.config,
						to: subscriber.to,
						text,
						...subscriber.accountId ? { accountId: subscriber.accountId } : {},
						...subscriber.messageThreadId != null ? { threadId: subscriber.messageThreadId } : {}
					});
				} catch (err) {
					params.api.logger.warn(`device-pair: failed to send pairing notification to ${subscriber.to}: ${formatErrorMessage(err)}`);
					continue;
				}
				delivered = true;
				if (subscriber.mode === "once") {
					deliveredOneShots.add(entry.key);
					await writeNotifyState(() => subscriberStore.compareAndApply(entry.key, observation.comparison, {
						operation: "delete",
						action: "delete"
					}));
				}
			}
			if (delivered) {
				await writeNotifyState(() => seenRequestStore.register(notifyRequestStoreKey(request.requestId), {
					requestId: request.requestId,
					notifiedAtMs: now
				}, { ttlMs: DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS }));
				notifiedRequestIds.add(request.requestId);
			}
		}
	}
	return true;
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
		await writeNotifyState(() => subscriberStore.delete(targetStoreKey, { assertCurrent: assertOwnerCurrent }));
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
function startPairingNotifier(api, scheduler) {
	if (scheduler.signal.aborted) return;
	let scheduled = false;
	let running = false;
	let wakeRequested = false;
	function scheduleNext() {
		if (scheduler.signal.aborted || scheduled || running) return;
		scheduled = true;
		scheduler.schedule({
			id: "notifications",
			delayMs: NOTIFY_POLL_INTERVAL_MS,
			run: async () => {
				scheduled = false;
				running = true;
				wakeRequested = false;
				let active = true;
				try {
					active = await notifyPendingPairingRequests({ api });
				} catch (err) {
					api.logger.warn(`device-pair: notify poll failed: ${formatErrorMessage(err)}`);
				} finally {
					running = false;
					if (active || wakeRequested) scheduleNext();
				}
			}
		});
	}
	const wake = () => {
		if (running) wakeRequested = true;
		else scheduleNext();
	};
	notifyStateListeners.add(wake);
	scheduler.signal.addEventListener("abort", () => notifyStateListeners.delete(wake), { once: true });
	scheduleNext();
}
//#endregion
export { startPairingNotifier as i, formatPendingRequests as n, handleNotifyCommand as r, armPairNotifyOnce as t };
