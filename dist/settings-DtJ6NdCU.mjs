import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./state-B1aZH2hx.mjs";
//#region src/auto-reply/reply/queue/normalize.ts
/** Normalizes user-entered queue mode aliases from directives/config. */
function normalizeQueueMode(raw) {
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (!cleaned) return;
	if (cleaned === "interrupt" || cleaned === "interrupts" || cleaned === "abort") return "interrupt";
	if (cleaned === "steer" || cleaned === "steering") return "steer";
	if (cleaned === "followup" || cleaned === "follow-ups" || cleaned === "followups") return "followup";
	if (cleaned === "collect" || cleaned === "coalesce") return "collect";
}
/** Normalizes persisted legacy queue mode aliases into current queue modes. */
function normalizePersistedQueueMode(raw) {
	const normalized = normalizeQueueMode(raw);
	if (normalized) return normalized;
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (cleaned === "queue" || cleaned === "queued") return "steer";
	if (cleaned === "steer+backlog" || cleaned === "steer-backlog" || cleaned === "steer_backlog") return "followup";
}
/** Normalizes queue drop policy aliases from directives/config. */
function normalizeQueueDropPolicy(raw) {
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (!cleaned) return;
	if (cleaned === "old" || cleaned === "oldest") return "old";
	if (cleaned === "new" || cleaned === "newest") return "new";
	if (cleaned === "summarize" || cleaned === "summary") return "summarize";
}
//#endregion
//#region src/auto-reply/reply/queue/settings.ts
/** Resolve per-channel debounce override from debounceMsByChannel map. */
function resolveChannelDebounce(byChannel, channelKey) {
	if (!channelKey || !byChannel) return;
	const value = byChannel[channelKey];
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
function resolveQueueSettingsCore(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	const queueCfg = params.cfg.messages?.queue;
	const providerModeRaw = channelKey && queueCfg?.byChannel ? queueCfg.byChannel[channelKey] : void 0;
	const resolvedMode = params.inlineMode ?? normalizePersistedQueueMode(params.sessionEntry?.queueMode) ?? normalizeQueueMode(providerModeRaw) ?? normalizeQueueMode(queueCfg?.mode) ?? "steer";
	const debounceRaw = params.inlineOptions?.debounceMs ?? params.sessionEntry?.queueDebounceMs ?? resolveChannelDebounce(queueCfg?.debounceMsByChannel, channelKey) ?? params.pluginDebounceMs ?? 500;
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
export { normalizeQueueDropPolicy as n, normalizeQueueMode as r, resolveQueueSettingsCore as t };
