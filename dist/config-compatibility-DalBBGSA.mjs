import { f as resolveOfficialExternalChannelCompatibilityMigration } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { n as LEGACY_CONFIG_MIGRATIONS } from "./legacy-2ovrASa7.mjs";
//#region src/commands/channel-setup/config-compatibility.ts
function normalizeExternalChannelSetupConfig(params) {
	const migrationId = resolveOfficialExternalChannelCompatibilityMigration(params.channel);
	if (!migrationId) return params.cfg;
	const migration = LEGACY_CONFIG_MIGRATIONS.find((candidate) => candidate.id === migrationId);
	if (!migration) throw new Error(`Official external channel ${params.channel} references unknown compatibility migration ${migrationId}`);
	const next = structuredClone(params.cfg);
	migration.apply(next, []);
	return next;
}
//#endregion
export { normalizeExternalChannelSetupConfig as t };
