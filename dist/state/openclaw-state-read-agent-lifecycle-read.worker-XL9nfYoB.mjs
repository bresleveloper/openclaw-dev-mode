import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { a as tableExists } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import "./openclaw-state-read-agent-provenance-publication-CU3W2jjf.mjs";
//#region src/state/agent-provenance.kernel.ts
function agentProvenanceFromRow(row) {
	if (row.created_via !== "operator" && row.created_via !== "agent" && row.created_via !== "claw") throw new Error(`Invalid agent provenance created_via: ${row.created_via}`);
	return {
		agentId: row.agent_id,
		createdVia: row.created_via,
		creatorAgentId: row.creator_agent_id,
		createdAtMs: row.created_at_ms
	};
}
//#endregion
//#region src/state/agent-lifecycle-read.worker.ts
/** Seed one lifecycle snapshot; committed owner receipts maintain its in-process projection. */
function readAgentLifecycleStoreFacts(database, agentId) {
	const db = getNodeSqliteKysely(database);
	const base = db.selectFrom(db.selectNoFrom((eb) => eb.val(normalizeAgentId(agentId)).as("agent_id")).as("target"));
	const hasProvenance = tableExists(database, "agent_provenance");
	const hasJournal = tableExists(database, "agent_deletion_journal");
	const lifecycleQuery = base.$if(hasProvenance, (query) => query.leftJoin("agent_provenance as provenance", "provenance.agent_id", "target.agent_id").select([
		"provenance.agent_id as provenanceAgentId",
		"provenance.created_via as createdVia",
		"provenance.creator_agent_id as creatorAgentId",
		"provenance.created_at_ms as createdAtMs"
	])).$if(!hasProvenance, (query) => query.select((eb) => [
		eb.val(null).as("provenanceAgentId"),
		eb.val(null).as("createdVia"),
		eb.val(null).as("creatorAgentId"),
		eb.val(null).as("createdAtMs")
	])).$if(hasJournal, (query) => query.leftJoin("agent_deletion_journal as deletion", "deletion.agent_id", "target.agent_id").select("deletion.agent_id as deletedAgentId")).$if(!hasJournal, (query) => query.select((eb) => eb.val(null).as("deletedAgentId")));
	const row = executeSqliteQueryTakeFirstSync(database, lifecycleQuery);
	if (!row) throw new Error("Agent lifecycle lookup returned no target row");
	if (row.deletedAgentId != null || row.provenanceAgentId == null) return {
		deletionBlocked: row.deletedAgentId != null,
		provenance: null
	};
	if (row.createdVia == null || row.createdAtMs == null) throw new Error("Agent provenance is missing its durable incarnation fields");
	return {
		deletionBlocked: row.deletedAgentId != null,
		provenance: agentProvenanceFromRow({
			agent_id: row.provenanceAgentId,
			created_via: row.createdVia,
			creator_agent_id: row.creatorAgentId ?? null,
			created_at_ms: row.createdAtMs
		})
	};
}
const agentLifecycleReadOperations = { "agentLifecycle.read": (agentId, database) => ({
	type: "agentLifecycle.read",
	facts: readAgentLifecycleStoreFacts(database, agentId)
}) };
//#endregion
export { agentLifecycleReadOperations };
