import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as defaultSlotIdForKey } from "./slots-D4OMSTbt.mjs";
//#region src/status/memory-plugin.ts
/** Resolves whether memory status should be shown and which slot owns it. */
function resolveMemoryPluginStatus(cfg) {
	if (!(cfg.plugins?.enabled !== false)) return {
		enabled: false,
		slot: null,
		reason: "plugins disabled"
	};
	const raw = normalizeOptionalString(cfg.plugins?.slots?.memory) ?? "";
	if (normalizeOptionalLowercaseString(raw) === "none") return {
		enabled: false,
		slot: null,
		reason: "plugins.slots.memory=\"none\""
	};
	return {
		enabled: true,
		slot: raw || defaultSlotIdForKey("memory")
	};
}
//#endregion
export { resolveMemoryPluginStatus as t };
