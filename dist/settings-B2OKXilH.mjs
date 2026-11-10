import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./state-DNPW_vEt.mjs";
//#region src/auto-reply/reply/queue/normalize.ts
const queueModes = /* @__PURE__ */ new Map([
	["interrupt", "interrupt"],
	["interrupts", "interrupt"],
	["abort", "interrupt"],
	["steer", "steer"],
	["steering", "steer"],
	["followup", "followup"],
	["follow-ups", "followup"],
	["followups", "followup"],
	["collect", "collect"],
	["coalesce", "collect"]
]);
const persistedQueueModes = new Map([
	...queueModes,
	["queue", "steer"],
	["queued", "steer"],
	["steer+backlog", "followup"],
	["steer-backlog", "followup"],
	["steer_backlog", "followup"]
]);
const queueDropPolicies = /* @__PURE__ */ new Map([
	["old", "old"],
	["oldest", "old"],
	["new", "new"],
	["newest", "new"],
	["summarize", "summarize"],
	["summary", "summarize"]
]);
/** Normalizes user-entered queue mode aliases from directives/config. */
function normalizeQueueMode(raw) {
	return queueModes.get(normalizeOptionalLowercaseString(raw) ?? "");
}
/** Normalizes persisted legacy queue mode aliases into current queue modes. */
function normalizePersistedQueueMode(raw) {
	return persistedQueueModes.get(normalizeOptionalLowercaseString(raw) ?? "");
}
/** Normalizes queue drop policy aliases from directives/config. */
function normalizeQueueDropPolicy(raw) {
	return queueDropPolicies.get(normalizeOptionalLowercaseString(raw) ?? "");
}
//#endregion
//#region src/auto-reply/reply/queue/settings.ts
function normalizeQueueDebounce(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
function resolveQueueSettingsCore(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	const queueCfg = params.cfg.messages?.queue;
	const providerModeRaw = channelKey ? queueCfg?.byChannel?.[channelKey] : void 0;
	const resolvedMode = params.inlineMode ?? normalizePersistedQueueMode(params.sessionEntry?.queueMode) ?? normalizeQueueMode(providerModeRaw) ?? normalizeQueueMode(queueCfg?.mode) ?? "steer";
	const debounceRaw = params.inlineOptions?.debounceMs ?? params.sessionEntry?.queueDebounceMs ?? normalizeQueueDebounce(channelKey ? queueCfg?.debounceMsByChannel?.[channelKey] : void 0) ?? params.pluginDebounceMs ?? 500;
	const capRaw = params.inlineOptions?.cap ?? params.sessionEntry?.queueCap ?? queueCfg?.cap ?? 20;
	const dropRaw = params.inlineOptions?.dropPolicy ?? params.sessionEntry?.queueDrop ?? normalizeQueueDropPolicy(queueCfg?.drop) ?? "summarize";
	return {
		mode: resolvedMode,
		debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : void 0,
		cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : void 0,
		dropPolicy: dropRaw
	};
}
//#endregion
export { normalizeQueueMode as i, resolveQueueSettingsCore as n, normalizeQueueDropPolicy as r, normalizeQueueDebounce as t };
