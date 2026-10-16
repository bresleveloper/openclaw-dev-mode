import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
//#region src/commands/doctor/shared/codex-plugin-activation-warning.ts
/** Historical auto-enable writes cannot be distinguished from explicit plugin selection. */
function collectCodexPluginActivationWarnings(config) {
	const entry = config.plugins?.entries?.codex;
	const allow = config.plugins?.allow;
	if (entry?.enabled !== true || Object.keys(entry).length !== 2 || !isNativeSessionCatalogOptOutOnly("codex", { config: entry.config }) || allow && allow.length > 0 && !allow.includes("codex")) return [];
	return ["plugins.entries.codex contains only enabled=true and the session catalog privacy opt-out. This may be left over from machine auto-enablement in OpenClaw 2026.9.3/2026.9.4; Doctor cannot determine whether you enabled it intentionally. If you did not enable Codex, set plugins.entries.codex.enabled=false and remove \"codex\" from plugins.allow if present. No automatic repair was applied to this selection."];
}
//#endregion
export { collectCodexPluginActivationWarnings };
