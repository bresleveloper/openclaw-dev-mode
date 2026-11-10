import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
//#region src/state/agent-provenance-publication.ts
const agentProvenancePublication = createStateDomainPublication({
	domain: "agent-provenance",
	keyOf: (row) => row.agentId,
	isValue: (value) => isRecord(value) && typeof value.agentId === "string" && (value.createdVia === "operator" || value.createdVia === "agent" || value.createdVia === "claw") && (value.creatorAgentId === null || typeof value.creatorAgentId === "string") && typeof value.createdAtMs === "number"
});
function withAgentProvenancePublication(createAdmission, context) {
	return (operation) => {
		const owner = createAdmission(operation);
		const publication = agentProvenancePublication.begin({
			identity: context.admission.identity.key,
			assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
		});
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			if (isRecord(facts) && facts.provenanceAuthority !== void 0) publication.committed(facts.provenanceAuthority);
		});
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				publication.finish(owner.admission.settlement?.kind === "completed", true);
			}
		};
		return owner;
	};
}
//#endregion
//#region src/state/agent-provenance.ts
async function recordAgentProvenance(agentId, provenance, options = {}) {
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const input = {
		agentId: normalizeAgentId(agentId),
		createdVia: provenance.createdVia,
		creatorAgentId: provenance.creatorAgentId ? normalizeAgentId(provenance.creatorAgentId) : null,
		createdAtMs: options.nowMs ?? Date.now()
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "agentProvenance.record",
		input
	}), { createAdmission: withAgentProvenancePublication(createSqliteWorkerWriteAdmission(context.admission.assertCurrent, [context.admission.databasePath]), context) });
}
const DISPLAY_PROVENANCE_BATCH_SIZE = 256;
/** Read provenance for the selected presentation roster in bounded worker batches. */
async function readAgentProvenanceForDisplay(agentIds, options = {}) {
	if (agentIds.length === 0) return [];
	const context = captureOpenClawStateWorkerContext(options);
	const requestedIds = agentIds.map(normalizeAgentId);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return executeOpenClawStateWorker(context, {
		type: "agentProvenance.list",
		input: void 0
	});
}
/** Delete one row inside the caller's authoritative state transaction. */
function deleteAgentProvenanceForAgent(database, agentId) {
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.deleteFrom("agent_provenance").where("agent_id", "=", normalizeAgentId(agentId)));
	agentProvenancePublication.stageDeletions(database, [normalizeAgentId(agentId)]);
}
//#endregion
export { agentProvenancePublication as a, recordAgentProvenance as i, listAgentProvenance as n, withAgentProvenancePublication as o, readAgentProvenanceForDisplay as r, deleteAgentProvenanceForAgent as t };
