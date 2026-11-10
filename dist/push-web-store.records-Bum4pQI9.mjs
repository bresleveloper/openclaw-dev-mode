import { f as asSafeIntegerInRange } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as isHttpsUrl } from "./url-protocol-De2aQ55s.mjs";
import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
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
		scheduledTaskFailed: false
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
const CATEGORY_TO_KEY = {
	"approval-requested": "approvalRequested",
	"agent-finished": "agentFinished",
	"agent-question": "agentQuestion",
	"human-mentioned": "humanMentioned",
	"scheduled-task-failed": "scheduledTaskFailed"
};
const CATEGORY_KEYS = Object.values(CATEGORY_TO_KEY);
function detailLevel(value) {
	return value === "private" || value === "identified" || value === "detailed" ? value : void 0;
}
function normalizeAgentIds(value) {
	if (!Array.isArray(value)) return;
	return normalizeUniqueTrimmedStringList(value).filter((entry) => entry.length <= 128).slice(0, 128);
}
function normalizeQuietHours(value) {
	if (!isRecord(value)) return;
	const startMinute = asSafeIntegerInRange(value.startMinute, {
		min: 0,
		max: 1439
	});
	const endMinute = asSafeIntegerInRange(value.endMinute, {
		min: 0,
		max: 1439
	});
	const timeZone = typeof value.timeZone === "string" ? value.timeZone.trim() : "";
	if (typeof value.enabled !== "boolean" || startMinute === void 0 || endMinute === void 0 || !timeZone || timeZone.length > 128) return;
	try {
		new Intl.DateTimeFormat("en-US", { timeZone }).format(0);
	} catch {
		return;
	}
	return {
		enabled: value.enabled,
		startMinute,
		endMinute,
		timeZone
	};
}
function normalizeCategories(source) {
	return Object.fromEntries(CATEGORY_KEYS.flatMap((key) => typeof source?.[key] === "boolean" ? [[key, source[key]]] : []));
}
function normalizeWebPushNotificationPreferences(value) {
	const source = isRecord(value) ? value : {};
	const categorySource = isRecord(source.categories) ? source.categories : {};
	return {
		categories: {
			...DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.categories,
			...normalizeCategories(categorySource)
		},
		detailLevel: detailLevel(source.detailLevel) ?? DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.detailLevel,
		quietHours: normalizeQuietHours(source.quietHours) ?? DEFAULT_WEB_PUSH_NOTIFICATION_PREFERENCES.quietHours,
		agentIds: normalizeAgentIds(source.agentIds) ?? []
	};
}
function normalizeWebPushDevicePreferences(value) {
	const source = isRecord(value) ? value : {};
	const categories = normalizeCategories(isRecord(source.categories) ? source.categories : void 0);
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
function hashWebPushEndpoint(endpoint) {
	return sha256HexPrefixCore(endpoint, 32);
}
function isValidWebPushEndpoint(endpoint) {
	if (!endpoint || endpoint.length > WEB_PUSH_MAX_ENDPOINT_LENGTH) return false;
	return isHttpsUrl(endpoint);
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
		devicePreferences: normalizeWebPushDevicePreferences(safeParseJson(row.preferences_json ?? ""))
	};
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
export { webPushAgentAllowed as _, hashWebPushEndpoint as a, webPushSubscriptionFromRow as c, WEB_PUSH_USER_PREFERENCES_KEY as d, isWebPushQuietHours as f, resolveEffectiveWebPushPreferences as g, normalizeWebPushNotificationPreferences as h, boundWebPushSubscriptionFromRow as i, webPushSubscriptionToRow as l, normalizeWebPushDisplayLabel as m, WEB_PUSH_VAPID_STATE_KEY as n, isValidWebPushEndpoint as o, normalizeWebPushDevicePreferences as p, WebPushSubscriptionBindingError as r, isValidWebPushKey as s, DEFAULT_WEB_PUSH_VAPID_SUBJECT as t, webPushSubscriptionsEqual as u, webPushCategoryEnabled as v };
