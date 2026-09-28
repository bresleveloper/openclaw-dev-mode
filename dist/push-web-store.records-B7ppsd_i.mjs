import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
//#region src/infra/push-web-preferences.ts
const WEB_PUSH_USER_PREFERENCES_KEY = "notifications.web.v1";
function normalizeWebPushDisplayLabel(value) {
	if (typeof value !== "string") return;
	return truncateUtf16Safe(sanitizeExecApprovalDisplayText(value.trim()), 80) || void 0;
}
const DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES = {
	categories: {
		approvalRequested: true,
		agentFinished: false,
		agentQuestion: false,
		humanMentioned: false,
		scheduledTaskFailed: false,
		backgroundTaskFailed: false
	},
	detailLevel: "private",
	quietHours: {
		enabled: false,
		startMinute: 1320,
		endMinute: 420,
		timeZone: "UTC"
	},
	agentIds: []
};
const CATEGORY_KEYS = [
	"approvalRequested",
	"agentFinished",
	"agentQuestion",
	"humanMentioned",
	"scheduledTaskFailed",
	"backgroundTaskFailed"
];
const CATEGORY_TO_KEY = {
	"approval-requested": "approvalRequested",
	"agent-finished": "agentFinished",
	"agent-question": "agentQuestion",
	"human-mentioned": "humanMentioned",
	"scheduled-task-failed": "scheduledTaskFailed",
	"background-task-failed": "backgroundTaskFailed"
};
function detailLevel(value) {
	return value === "private" || value === "identified" || value === "detailed" ? value : void 0;
}
function normalizeAgentIds(value) {
	if (!Array.isArray(value)) return;
	return [...new Set(value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry.length > 0 && entry.length <= 128))].slice(0, 128);
}
function normalizeQuietHours(value) {
	if (!isRecord(value)) return;
	const startMinute = value.startMinute;
	const endMinute = value.endMinute;
	const timeZone = typeof value.timeZone === "string" ? value.timeZone.trim() : "";
	if (typeof value.enabled !== "boolean" || !Number.isInteger(startMinute) || !Number.isInteger(endMinute) || Number(startMinute) < 0 || Number(startMinute) > 1439 || Number(endMinute) < 0 || Number(endMinute) > 1439 || !timeZone || timeZone.length > 128) return;
	try {
		new Intl.DateTimeFormat("en-US", { timeZone }).format(0);
	} catch {
		return;
	}
	return {
		enabled: value.enabled,
		startMinute: Number(startMinute),
		endMinute: Number(endMinute),
		timeZone
	};
}
function normalizeCategoryDefaults(value) {
	const source = isRecord(value) ? value : {};
	return Object.fromEntries(CATEGORY_KEYS.map((key) => [key, typeof source[key] === "boolean" ? source[key] : DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.categories[key]]));
}
function normalizeWebPushNotificationPreferences(value) {
	const source = isRecord(value) ? value : {};
	return {
		categories: normalizeCategoryDefaults(source.categories),
		detailLevel: detailLevel(source.detailLevel) ?? DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.detailLevel,
		quietHours: normalizeQuietHours(source.quietHours) ?? DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.quietHours,
		agentIds: normalizeAgentIds(source.agentIds) ?? []
	};
}
function normalizeWebPushDevicePreferences(value) {
	const source = isRecord(value) ? value : {};
	const categorySource = isRecord(source.categories) ? source.categories : void 0;
	const categories = categorySource ? Object.fromEntries(CATEGORY_KEYS.flatMap((key) => typeof categorySource[key] === "boolean" ? [[key, categorySource[key]]] : [])) : void 0;
	const normalizedDetailLevel = detailLevel(source.detailLevel);
	const normalizedQuietHours = normalizeQuietHours(source.quietHours);
	const normalizedAgentIds = normalizeAgentIds(source.agentIds);
	return {
		enabled: typeof source.enabled === "boolean" ? source.enabled : true,
		label: normalizeWebPushDisplayLabel(source.label) ?? "",
		...categories && Object.keys(categories).length > 0 ? { categories } : {},
		...normalizedDetailLevel ? { detailLevel: normalizedDetailLevel } : {},
		...normalizedQuietHours ? { quietHours: normalizedQuietHours } : {},
		...normalizedAgentIds ? { agentIds: normalizedAgentIds } : {}
	};
}
function resolveEffectiveWebPushPreferences(params) {
	const user = normalizeWebPushNotificationPreferences(params.user);
	const device = normalizeWebPushDevicePreferences(params.device);
	return {
		enabled: device.enabled,
		label: device.label,
		categories: {
			...user.categories,
			...device.categories
		},
		detailLevel: device.detailLevel ?? user.detailLevel,
		quietHours: device.quietHours ?? user.quietHours,
		agentIds: device.agentIds ?? user.agentIds
	};
}
function webPushCategoryEnabled(preferences, category) {
	const key = CATEGORY_TO_KEY[category];
	return key !== void 0 && preferences.enabled && preferences.categories[key] === true;
}
function isWebPushQuietHours(preferences, nowMs = Date.now()) {
	const quiet = preferences.quietHours;
	if (!quiet.enabled || quiet.startMinute === quiet.endMinute) return false;
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: quiet.timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(nowMs);
	const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
	const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
	const current = hour * 60 + minute;
	return quiet.startMinute < quiet.endMinute ? current >= quiet.startMinute && current < quiet.endMinute : current >= quiet.startMinute || current < quiet.endMinute;
}
function webPushAgentAllowed(preferences, agentId) {
	return preferences.agentIds.length === 0 || Boolean(agentId && preferences.agentIds.includes(agentId));
}
//#endregion
//#region src/infra/push-web-store.records.ts
const WEB_PUSH_VAPID_STATE_KEY = "webPush.vapidKeys";
const DEFAULT_WEB_PUSH_VAPID_SUBJECT = "https://openclaw.ai";
const WEB_PUSH_MAX_ENDPOINT_LENGTH = 2048;
const WEB_PUSH_MAX_KEY_LENGTH = 512;
function createWebPushVapidKeyPair(publicKey, privateKey, subject) {
	return {
		publicKey,
		privateKey,
		subject
	};
}
function hashWebPushEndpoint(endpoint) {
	return sha256HexPrefixCore(endpoint, 32);
}
function isValidWebPushEndpoint(endpoint) {
	if (!endpoint || endpoint.length > WEB_PUSH_MAX_ENDPOINT_LENGTH) return false;
	try {
		return new URL(endpoint).protocol === "https:";
	} catch {
		return false;
	}
}
function isValidWebPushKey(key) {
	return typeof key === "string" && key.length > 0 && key.length <= WEB_PUSH_MAX_KEY_LENGTH;
}
function webPushSubscriptionFromRow(row) {
	return {
		subscriptionId: row.subscription_id,
		endpoint: row.endpoint,
		keys: {
			p256dh: row.p256dh,
			auth: row.auth
		},
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function boundWebPushSubscriptionFromRow(row) {
	if (!row.device_id) return null;
	return {
		...webPushSubscriptionFromRow(row),
		deviceId: row.device_id,
		userProfileId: row.user_profile_id,
		devicePreferences: normalizeWebPushDevicePreferences(parseDevicePreferences(row.preferences_json))
	};
}
function parseDevicePreferences(value) {
	if (!value) return;
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
function webPushSubscriptionToRow(params) {
	return {
		endpoint_hash: params.endpointHash,
		subscription_id: params.subscription.subscriptionId,
		endpoint: params.subscription.endpoint,
		p256dh: params.subscription.keys.p256dh,
		auth: params.subscription.keys.auth,
		device_id: params.binding?.deviceId ?? null,
		user_profile_id: params.binding?.userProfileId ?? null,
		preferences_json: null,
		created_at_ms: params.subscription.createdAtMs,
		updated_at_ms: params.subscription.updatedAtMs
	};
}
function webPushSubscriptionsEqual(left, right) {
	return left.subscriptionId === right.subscriptionId && left.endpoint === right.endpoint && left.keys.p256dh === right.keys.p256dh && left.keys.auth === right.keys.auth && left.createdAtMs === right.createdAtMs && left.updatedAtMs === right.updatedAtMs;
}
var WebPushSubscriptionBindingError = class extends Error {};
//#endregion
export { resolveEffectiveWebPushPreferences as _, createWebPushVapidKeyPair as a, isValidWebPushKey as c, webPushSubscriptionsEqual as d, WEB_PUSH_USER_PREFERENCES_KEY as f, normalizeWebPushNotificationPreferences as g, normalizeWebPushDisplayLabel as h, boundWebPushSubscriptionFromRow as i, webPushSubscriptionFromRow as l, normalizeWebPushDevicePreferences as m, WEB_PUSH_VAPID_STATE_KEY as n, hashWebPushEndpoint as o, isWebPushQuietHours as p, WebPushSubscriptionBindingError as r, isValidWebPushEndpoint as s, DEFAULT_WEB_PUSH_VAPID_SUBJECT as t, webPushSubscriptionToRow as u, webPushAgentAllowed as v, webPushCategoryEnabled as y };
