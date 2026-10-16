import { n as DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE, t as DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES } from "./.setup/command-deploy-store-DFkBTViB.mjs";
import { t as runtime_doctor_migrations_exports } from "./.setup/runtime-doctor-migrations-BPV-R4G9.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./.setup/doctor-contract-Bg3NPAMw.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/discord/src/monitor/command-deploy-migration.ts
const detectDiscordCommandDeployCacheMigration = async ({ stateDir }) => {
	const sourcePath = path.join(stateDir, "discord", "command-deploy-cache.json");
	try {
		if (!(await fs.stat(sourcePath)).isFile()) return [];
	} catch {
		return [];
	}
	return [{
		kind: "plugin-state-import",
		label: "Discord command deployment cache",
		sourcePath,
		targetPath: `plugin state:${DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE}`,
		pluginId: "discord",
		namespace: DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE,
		maxEntries: DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES,
		scopeKey: "",
		cleanupSource: "remove",
		cleanupWhenEmpty: true,
		cleanupWarningDisposition: "recoverable",
		readEntries: () => []
	}];
};
//#endregion
//#region extensions/discord/doctor-contract-api.ts
const stateMigrations = [(0, runtime_doctor_migrations_exports.defineRetiredPluginStateMigration)({
	id: "discord-retired-state",
	label: "Discord retired model preferences and thread bindings",
	intermediateVersion: "2026.9.5",
	findSources: ({ stateDir }) => [path.join(stateDir, "discord", "model-picker-preferences.json"), path.join(stateDir, "discord", "thread-bindings.json")]
}), (0, runtime_doctor_migrations_exports.definePluginDoctorMigrationFromPlans)({
	id: "discord-legacy-state",
	label: "Discord command deployment cache",
	resolvePlans: detectDiscordCommandDeployCacheMigration
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
