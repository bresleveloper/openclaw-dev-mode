import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-gpylD4Gq.mjs";
//#region src/state/agent-provenance.kernel.ts
function fromRow(row) {
	if (row.created_via !== "operator" && row.created_via !== "agent" && row.created_via !== "claw") throw new Error(`Invalid agent provenance created_via: ${row.created_via}`);
	return {
		agentId: row.agent_id,
		createdVia: row.created_via,
		creatorAgentId: row.creator_agent_id,
		createdAtMs: row.created_at_ms
	};
}
function readAgentProvenanceInDatabase(database, agentId) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_provenance").selectAll().where("agent_id", "=", normalizeAgentId(agentId)));
	return row ? fromRow(row) : void 0;
}
function listAgentProvenanceInDatabase(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_provenance").selectAll().orderBy("agent_id", "asc")).rows.map(fromRow);
}
/** Decode only requested provenance, in the caller's order, including its first error. */
function readAgentProvenanceBatchInDatabase(database, agentIds) {
	if (agentIds.length === 0) return [];
	const db = getNodeSqliteKysely(database);
	const requestedIds = JSON.stringify(agentIds.map(normalizeAgentId));
	const query = db.selectFrom((eb) => eb.fn("json_each", [eb.val(requestedIds)]).as("requested")).innerJoin("agent_provenance", "agent_provenance.agent_id", "requested.value").selectAll("agent_provenance").orderBy("requested.key", "asc");
	const records = [];
	for (const row of iterateSqliteQuerySync(database, query)) records.push(fromRow(row));
	return records;
}
//#endregion
//#region src/state/agent-provenance.schema.ts
const ensureAgentProvenanceSchema = createOpenClawStateSchemaEnsurer({
	table: "agent_provenance",
	operationLabel: "agent-provenance.schema.ensure"
});
//#endregion
//#region src/state/agent-provenance.ts
function recordAgentProvenance(agentId, provenance, options = {}) {
	ensureAgentProvenanceSchema(options);
	const id = normalizeAgentId(agentId);
	const creatorAgentId = provenance.creatorAgentId ? normalizeAgentId(provenance.creatorAgentId) : null;
	const createdAtMs = options.nowMs ?? Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		const db = getNodeSqliteKysely(sqlite);
		executeSqliteQuerySync(sqlite, db.insertInto("agent_provenance").values({
			agent_id: id,
			created_via: provenance.createdVia,
			creator_agent_id: creatorAgentId,
			created_at_ms: createdAtMs
		}).onConflict((conflict) => conflict.column("agent_id").doUpdateSet({
			created_via: provenance.createdVia,
			creator_agent_id: creatorAgentId,
			created_at_ms: createdAtMs
		})));
	}, options, { operationLabel: "agent-provenance.record" });
}
function readAgentProvenance(agentId, options = {}) {
	return withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => {
		try {
			return readAgentProvenanceInDatabase(db, agentId);
		} catch (error) {
			if (error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: agent_provenance") return;
			throw error;
		}
	}, options);
}
const DISPLAY_PROVENANCE_BATCH_SIZE = 256;
/** Presentation reads may wait; incarnation checks retain the synchronous reader above. */
async function readAgentProvenanceForDisplay(agentIds, options = {}) {
	if (agentIds.length === 0) return [];
	const context = captureOpenClawStateWorkerContext(options);
	const requestedIds = agentIds.map(normalizeAgentId);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	const records = [];
	for (let offset = 0; offset < requestedIds.length; offset += DISPLAY_PROVENANCE_BATCH_SIZE) {
		const batch = await executeOpenClawStateWorker(context, {
			type: "agentProvenance.readBatch",
			input: { agentIds: requestedIds.slice(offset, offset + DISPLAY_PROVENANCE_BATCH_SIZE) }
		});
		records.push(...batch);
	}
	return records;
}
async function listAgentProvenance(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return executeOpenClawStateWorker(context, {
		type: "agentProvenance.list",
		input: void 0
	});
}
/** Delete one row inside the caller's authoritative state transaction. */
function deleteAgentProvenanceForAgent(database, agentId) {
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.deleteFrom("agent_provenance").where("agent_id", "=", normalizeAgentId(agentId)));
}
//#endregion
export { recordAgentProvenance as a, readAgentProvenanceBatchInDatabase as c, readAgentProvenanceForDisplay as i, listAgentProvenance as n, ensureAgentProvenanceSchema as o, readAgentProvenance as r, listAgentProvenanceInDatabase as s, deleteAgentProvenanceForAgent as t };
