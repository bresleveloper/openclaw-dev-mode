import { f as resolveOfficialExternalChannelCompatibilityMigration } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { r as LEGACY_CONFIG_MIGRATIONS } from "./legacy-Ccc1pb1u.mjs";
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
