import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { O as listAgentIds, a as resolveAgentDir, p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, f as repairPluginModelCatalogTransportMetadata, i as inspectLegacyPluginModelCatalogs, o as migrateLegacyPluginModelCatalogs, s as repairPersistedPluginModelCatalogs } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
//#region src/commands/doctor-plugin-model-catalog.ts
/** Doctor-owned migration and repair of persisted generated provider catalogs. */
function resolveMigrationAgentDirs(params) {
	if (params.agentDirs) return [...new Set(params.agentDirs)].toSorted((left, right) => left.localeCompare(right));
	const env = params.env ?? process.env;
	const agentIds = listAgentIds(params.cfg);
	const configuredAgentDirs = agentIds.length > 0 ? agentIds.map((agentId) => resolveAgentDir(params.cfg, agentId, env)) : [resolveDefaultAgentDir(params.cfg, env)];
	return [...new Set(configuredAgentDirs)].toSorted((left, right) => left.localeCompare(right));
}
/** Imports released sidecars and repairs persisted SQLite catalogs only with Doctor authority. */
async function maybeMigrateLegacyPluginModelCatalogs(params) {
	const warnings = [];
	const agents = [];
	for (const agentDir of resolveMigrationAgentDirs(params)) {
		const inspected = inspectLegacyPluginModelCatalogs(agentDir);
		const agentWarnings = inspected.warnings.map((warning) => shortenHomePath(warning));
		const migrations = inspected.catalogs;
		const repairablePluginIds = loadPersistedPluginModelCatalogsReadOnly(agentDir).filter(({ contents }) => repairPluginModelCatalogTransportMetadata(contents).removedModelCount > 0).map(({ pluginId }) => pluginId);
		agents.push({
			agentDir,
			migrations,
			warnings: agentWarnings,
			repairablePluginIds
		});
		warnings.push(...agentWarnings);
	}
	const migrations = agents.flatMap((agent) => agent.migrations);
	const detected = migrations.length + agents.reduce((count, agent) => count + agent.repairablePluginIds.length, 0);
	for (const warning of warnings) params.runtime.error(warning);
	const emitNote = params.note ?? note;
	if (detected > 0) {
		const details = migrations.length > 0 ? ["Legacy generated provider catalogs contain model and credential state.", ...migrations.map((migration) => `- ${shortenHomePath(migration.pathname)}`)] : [];
		for (const agent of agents) for (const pluginId of agent.repairablePluginIds) details.push(`Generated catalog ${pluginId} in ${shortenHomePath(agent.agentDir)} contains model rows without transport API metadata.`);
		details.push("Run openclaw doctor --fix to verify and repair these catalogs.");
		emitNote(details.join("\n"), "Plugin model catalogs");
	}
	if (!(params.prompter.shouldRepair || detected > 0 && await params.prompter.confirmAutoFix({
		message: "Repair generated provider model catalogs now?",
		initialValue: true
	}))) return {
		detected,
		migrated: 0,
		repaired: 0,
		warnings
	};
	let migrated = 0;
	const repairs = [];
	for (const agent of agents) {
		const result = migrateLegacyPluginModelCatalogs({
			agentDir: agent.agentDir,
			...agent.migrations.length > 0 ? { expectedContents: new Map(agent.migrations.map((migration) => [migration.pluginId, migration.contents])) } : {}
		});
		migrated += result.migrated;
		for (const warning of result.warnings) {
			const displayWarning = shortenHomePath(warning);
			if (warnings.includes(displayWarning)) continue;
			warnings.push(displayWarning);
			params.runtime.error(displayWarning);
		}
		if (agent.warnings.length === 0 && result.warnings.length === 0) repairs.push(...repairPersistedPluginModelCatalogs({
			agentDir: agent.agentDir,
			catalogs: loadPersistedPluginModelCatalogsReadOnly(agent.agentDir)
		}));
	}
	if (migrated > 0) emitNote(`Migrated and verified ${migrated} generated provider catalog${migrated === 1 ? "" : "s"} in agent SQLite.`, "Doctor changes");
	if (repairs.length > 0) emitNote(repairs.map(({ pluginId, removedModelCount }) => `Repaired generated model catalog ${pluginId}: removed ${removedModelCount} model row(s) without transport API metadata.`).join("\n"), "Doctor changes");
	return {
		detected,
		migrated,
		repaired: repairs.length,
		warnings
	};
}
//#endregion
export { maybeMigrateLegacyPluginModelCatalogs };
