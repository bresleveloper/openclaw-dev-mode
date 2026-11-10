import { r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-BvQp5mZ3.mjs";
import { n as resolveRelativeSessionStoreMigrationTargets } from "./doctor-relative-session-store-paths-B9HJIscj.mjs";
import path from "node:path";
//#region src/commands/doctor-database-preflight.ts
/** Prepare fleet facts through the artifact-preserving schema readers. */
async function prepareDoctorDatabasePreflight(options = {}) {
	const { scope, preserveSourceArtifacts } = options;
	const databasePreflight = await import("./openclaw-database-preflight-D3lTU13W.mjs");
	const [{ createConfigIO }, targets, { listAgentIds, resolveAgentDir }, { openDoctorStateSchemaReadAdmission }] = await Promise.all([
		import("./io-Cwio_qp9.mjs"),
		import("./targets-BHY-ArLd.mjs"),
		import("./agent-scope-config-DdPit6I3.mjs"),
		import("./openclaw-state-db-doctor-schema-LYMvEo6h.mjs")
	]);
	const snapshot = scope === "state" || options.cfg ? void 0 : await createConfigIO({
		env: { ...process.env },
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	const cfg = scope === "state" ? void 0 : options.cfg ?? snapshot?.sourceConfig ?? snapshot?.config;
	let agentDatabaseMigrationDiscovery;
	const databaseSchemas = await databasePreflight.preflightOpenClawDatabaseSchemas({
		env: process.env,
		scope,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission,
		preserveSourceArtifacts,
		...cfg ? {
			configuredAgentDatabaseTargets: (registered) => [...listAgentIds(cfg).map((agentId) => ({
				agentId,
				path: path.join(resolveAgentDir(cfg, agentId), "openclaw-agent.sqlite")
			})), ...resolveRelativeSessionStoreMigrationTargets(cfg, process.env, registered).filter((target) => !isUpdateRehearsalReadOnlyPath(target.path, process.env))],
			configuredAgentDatabaseCandidatePaths: targets.resolveConfiguredAgentDatabaseCandidatePaths(cfg, { env: process.env }),
			agentAdmissionConfig: cfg,
			onAgentDatabaseDiscovery: (prepared) => {
				agentDatabaseMigrationDiscovery = prepared;
			}
		} : {}
	});
	if (databaseSchemas.incompatible.length > 0) throw new databasePreflight.OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible, { operation: "doctor" });
	const unreadableStateDatabase = databaseSchemas.indeterminate.find((database) => database.kind === "state");
	if (unreadableStateDatabase) throw new DoctorUnreadableStateDatabaseError(unreadableStateDatabase.path, unreadableStateDatabase.reason);
	return {
		...databaseSchemas,
		...agentDatabaseMigrationDiscovery ? {
			agentDatabaseMigrationDiscovery,
			agentDatabaseRecoveryConfigValid: snapshot?.valid === true
		} : {}
	};
}
//#endregion
export { prepareDoctorDatabasePreflight as t };
