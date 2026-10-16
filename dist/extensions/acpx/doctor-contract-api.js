import { t as runtime_doctor_migrations_exports } from "./.setup/runtime-doctor-migrations-hxP-CXX7.mjs";
//#region extensions/acpx/doctor-contract-api.ts
const ACPX_CONFIG_PATH = [
	"plugins",
	"entries",
	"acpx",
	"config"
];
const RETIRED_ACPX_CONFIG_KEYS = ["strictWindowsCmdWrapper", "queueOwnerTtlSeconds"];
/** Retired ACPX config that `openclaw doctor --fix` removes before strict validation. */
const legacyConfigRules = RETIRED_ACPX_CONFIG_KEYS.map((key) => ({
	path: [...ACPX_CONFIG_PATH, key],
	message: `${[...ACPX_CONFIG_PATH, key].join(".")} is retired and ignored by the embedded ACPX runtime. Run "openclaw doctor --fix".`
}));
/** Removes retired plugin-owned config without keeping runtime compatibility keys. */
function normalizeCompatibilityConfig({ cfg }) {
	const entry = (0, runtime_doctor_migrations_exports.asObjectRecord)(cfg.plugins?.entries?.acpx);
	const pluginConfig = (0, runtime_doctor_migrations_exports.asObjectRecord)(entry?.config);
	const retiredKeys = RETIRED_ACPX_CONFIG_KEYS.filter((key) => Object.hasOwn(pluginConfig ?? {}, key));
	if (!pluginConfig || retiredKeys.length === 0) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextEntry = (0, runtime_doctor_migrations_exports.asObjectRecord)(nextConfig.plugins?.entries?.acpx);
	const nextPluginConfig = (0, runtime_doctor_migrations_exports.asObjectRecord)(nextEntry?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	for (const key of retiredKeys) delete nextPluginConfig[key];
	return {
		config: nextConfig,
		changes: [`Removed retired ACPX plugin config: ${retiredKeys.map((key) => [...ACPX_CONFIG_PATH, key].join(".")).join(", ")}.`]
	};
}
const stateMigrations = [{
	id: "acpx-session-owner-resources",
	label: "ACP session owners",
	doctorOnly: true,
	phase: "after-session-repair",
	async collectBackupResources(input) {
		return (await import("./.setup/session-owner-migration-C73lfijV.mjs")).acpxSessionOwnerMigration.collectBackupResources(input);
	},
	async detectLegacyState(input) {
		return (await import("./.setup/session-owner-migration-C73lfijV.mjs")).acpxSessionOwnerMigration.detectLegacyState(input);
	},
	async migrateLegacyState(input) {
		return (await import("./.setup/session-owner-migration-C73lfijV.mjs")).acpxSessionOwnerMigration.migrateLegacyState(input);
	}
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
