import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { t as clearBundledDiscoveryModeMemo } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { n as importConfigMachineState, r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
//#region src/infra/state-migrations.config-machine-state.ts
const BUNDLED_DISCOVERY_STATE_CUTOVER_VERSION = "2026.7.2";
/** Preserve retired machine-owned config fields before Doctor strips them. */
function migrateLegacyConfigMachineState(params) {
	const raw = params.config;
	const entries = [];
	const meta = asOptionalRecord(raw.meta);
	if (meta && Object.hasOwn(meta, "lastTouchedAt")) entries.push(["config.lastTouchedAt", meta.lastTouchedAt]);
	const installs = asOptionalRecord(asOptionalRecord(asOptionalRecord(raw.hooks)?.internal)?.installs);
	const hasInstalls = Boolean(installs && Object.keys(installs).length > 0);
	const plugins = asOptionalRecord(raw.plugins);
	if (plugins && Object.hasOwn(plugins, "bundledDiscovery")) entries.push(["plugins.bundledDiscovery", plugins.bundledDiscovery]);
	else if (Array.isArray(plugins?.allow) && plugins.allow.length > 0 && (typeof meta?.lastTouchedVersion !== "string" || compareOpenClawVersions(meta.lastTouchedVersion, BUNDLED_DISCOVERY_STATE_CUTOVER_VERSION) === -1)) {
		let hasCanonicalState = false;
		try {
			hasCanonicalState = readConfigMachineState("plugins.bundledDiscovery", { env: params.env }) !== void 0;
		} catch {}
		if (!hasCanonicalState) entries.push(["plugins.bundledDiscovery", "compat"]);
	}
	const canonicalTts = asOptionalRecord(raw.tts);
	const tts = canonicalTts && Object.hasOwn(canonicalTts, "prefsPath") ? canonicalTts : asOptionalRecord(asOptionalRecord(raw.messages)?.tts);
	if (tts && Object.hasOwn(tts, "prefsPath")) entries.push(["tts.prefsPath", tts.prefsPath]);
	const cron = asOptionalRecord(raw.cron);
	if (cron && Object.hasOwn(cron, "store")) entries.push(["cron.store", cron.store]);
	if (entries.length === 0 && !hasInstalls) return {
		changes: [],
		warnings: []
	};
	const result = importConfigMachineState(entries, { env: params.env });
	if (entries.some(([key]) => key === "plugins.bundledDiscovery")) clearBundledDiscoveryModeMemo();
	const changes = result.imported.map((key) => `Migrated ${key} → shared SQLite state`);
	changes.push(...result.kept.map((key) => `Kept existing shared SQLite ${key} state`));
	if (installs && hasInstalls) {
		updateConfigMachineState("hooks.internal.installs", (current) => ({
			...installs,
			...current
		}), { env: params.env });
		changes.push("Migrated hooks.internal.installs → shared SQLite state");
	}
	return {
		changes,
		warnings: []
	};
}
//#endregion
export { migrateLegacyConfigMachineState as t };
