import { r as cloneEnvWithPlatformSemantics } from "../config-env-vars-BHneg24Q.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as setSqliteBusyTimeout } from "../sqlite-busy-timeout-COlIRjFZ.mjs";
import { C as readSqliteDatabaseIntegrityVerification } from "../sqlite-database-admission-CqdNF9iE.mjs";
import { r as readSqliteIntegrityFileIdentity } from "../sqlite-file-generation-Cmk6kG35.mjs";
import { t as withSqliteSourceReadDatabase } from "../sqlite-source-handle-BWHiHQXK.mjs";
import { t as adoptSqliteSchemaContracts } from "../sqlite-schema-contract-C7_zBR7q.mjs";
import { t as configureSqliteMaintenanceCache } from "../sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { t as tryInspectSqliteReadOnlyInProcess } from "../sqlite-readonly-inspection-CJMJKqt8.mjs";
import { n as serializeAgentSchemaInspectionError } from "../openclaw-agent-schema-inspection-response-DlRM0OA1.mjs";
import { t as inspectAgentDatabaseSchema } from "../openclaw-agent-schema-inspection-B11T-wM9.mjs";
import { n as inspectStateDatabaseSchema, t as captureStateSchemaInspectionContracts } from "../openclaw-state-schema-preflight-Bedbs0Wt.mjs";
//#region src/state/openclaw-agent-schema-inspection.worker.ts
if (!process.send || !process.disconnect) throw new Error("Agent schema inspection requires parent IPC.");
const send = (response) => process.send?.(response);
const disconnect = process.disconnect.bind(process);
process.on("message", (request) => {
	if (request.type === "close") {
		disconnect();
		return;
	}
	const { requestId } = request;
	try {
		if (request.type === "inspect-state") {
			const { input, snapshot } = request;
			adoptSqliteSchemaContracts(input.schemaContracts ?? []);
			const inspect = (database) => inspectStateDatabaseSchema(database, input);
			let inspection;
			if (snapshot) {
				readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
				inspection = withSqliteSourceReadDatabase(snapshot.pathname, "snapshot", (database) => {
					readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
					return inspect(database);
				}, { timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
				readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
			} else inspection = tryInspectSqliteReadOnlyInProcess(input.pathname, inspect)?.value;
			send({
				requestId,
				ok: true,
				inspection: null,
				schemaContracts: captureStateSchemaInspectionContracts().filter((contract) => !input.schemaContracts?.some((prior) => prior.schemaSql === contract.schemaSql)),
				stateInspection: inspection ? {
					...inspection,
					inspectionErrors: inspection.inspectionErrors.map(serializeAgentSchemaInspectionError)
				} : null
			});
			return;
		}
		const { input, snapshot } = request;
		if (input.env) input.env = cloneEnvWithPlatformSemantics(input.env);
		const readVerification = () => !snapshot && input.requireStartupMigrationReadiness ? readSqliteDatabaseIntegrityVerification(input.pathname) : void 0;
		const inspect = (database, verification = readVerification()) => {
			setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			if (input.requireStartupMigrationReadiness) configureSqliteMaintenanceCache(database);
			return inspectAgentDatabaseSchema(database, {
				...input,
				startupIntegrityVerification: verification
			});
		};
		let inspection;
		if (snapshot) {
			readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
			inspection = withSqliteSourceReadDatabase(snapshot.pathname, "snapshot", (database) => {
				readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
				return inspect(database);
			});
			readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
		} else inspection = tryInspectSqliteReadOnlyInProcess(input.pathname, inspect, { allowClosedWal: readVerification() !== void 0 })?.value;
		send({
			requestId,
			ok: true,
			inspection: inspection ? {
				...inspection,
				failure: inspection.failure ? serializeAgentSchemaInspectionError(inspection.failure) : void 0
			} : null
		});
	} catch (error) {
		send({
			requestId,
			ok: false,
			error: serializeAgentSchemaInspectionError(error)
		});
	}
});
//#endregion
export {};
