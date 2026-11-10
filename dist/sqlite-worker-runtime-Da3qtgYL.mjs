import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import "./node-sqlite-CYaq-2Hb.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import "./sqlite-transaction-CpDyZPQ0.mjs";
import "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as publishAgentSchemaMetadata, r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import "./sqlite-worker-contract-DhDutMia.mjs";
import "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as agentDatabaseValidationKey } from "./openclaw-agent-db-validation-facts-BQcDbrLo.mjs";
//#region src/state/openclaw-agent-db-schema-extension.worker.ts
/** Known derived-schema owners preserve agent contracts they do not change. */
function stageOpenClawAgentDatabaseSchemaExtension(db) {
	const validation = getSqliteDatabaseAdmission(db, agentDatabaseValidationKey);
	if (!validation?.schema || Atomics.load(new Int32Array(validation.schema.valid), 0) !== 1) return;
	const metadata = readExistingAgentSchemaMeta(db);
	if (!stageSqliteTransactionState(sqlPublicationAnchor(db), {
		stage: () => {},
		rollback: () => {},
		commit: () => {
			const facts = getAdmittedSqliteSchemaFacts(db);
			if (!facts) return;
			const valid = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
			Atomics.store(new Int32Array(valid), 0, 1);
			publishSqliteDatabaseAdmission(db, agentDatabaseValidationKey, {
				...validation,
				schema: {
					facts,
					valid
				}
			});
			if (metadata) publishAgentSchemaMetadata(db, metadata);
		}
	})) throw new Error("Agent schema extensions require a managed transaction");
}
//#endregion
export { stageOpenClawAgentDatabaseSchemaExtension as t };
