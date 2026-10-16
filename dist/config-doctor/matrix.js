import { a as defineChannelAliasMigration, j as isRecord, o as stripRetiredChannelKeys } from "./runtime-doctor-migrations-BhouWAUC.js";
import "./string-coerce-runtime-CM4JCyJk.js";
//#region extensions/matrix/src/doctor-contract.ts
function parseMatrixStreamingMode(value) {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toLowerCase();
	return normalized === "partial" || normalized === "quiet" || normalized === "progress" || normalized === "off" ? normalized : null;
}
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "matrix",
	streaming: {
		defaultMode: "off",
		resolveMode: (entry) => {
			const streaming = isRecord(entry.streaming) ? entry.streaming : null;
			const parsed = parseMatrixStreamingMode(streaming ? streaming.mode : entry.streaming);
			if (parsed) return parsed;
			return entry.streaming === true ? "partial" : "off";
		}
	},
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const withoutJunkStreamMode = stripRetiredChannelKeys({
		cfg,
		channelId: "matrix",
		keys: /* @__PURE__ */ new Set(["streamMode"]),
		scope: "root-and-accounts",
		onRemove: ({ key, pathPrefix }) => changes.push(`Removed ${pathPrefix}.${key} (never read by the Matrix runtime).`)
	}).config;
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: withoutJunkStreamMode,
		changes
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
