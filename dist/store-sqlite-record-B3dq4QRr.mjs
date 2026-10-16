import "./src-CdRlGRnW.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { o as parseSkillProposalRecord } from "./store-record-CSGbu9Vk.mjs";
//#region src/skills/workshop/store-sqlite-record.ts
function parseJson(value) {
	return value === null ? void 0 : safeParseJson(value);
}
function parseSkillProposalRow(row) {
	const record = parseSkillProposalRecord(parseJson(row.record_json));
	if (!record || record.id !== row.proposal_id || record.kind !== row.kind || record.status !== row.status || record.createdAt !== row.created_at || record.updatedAt !== row.updated_at || record.draftHash !== row.draft_hash || record.origin?.agentId !== (row.origin_agent_id ?? void 0) || record.origin?.sessionKey !== (row.origin_session_key ?? void 0) || record.origin?.runId !== (row.origin_run_id ?? void 0) || record.origin?.messageId !== (row.origin_message_id ?? void 0)) return null;
	return record;
}
function readStoredProposalInDatabase(database, proposalId) {
	const kysely = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", proposalId));
	if (!row) return null;
	const record = parseSkillProposalRow(row);
	return record ? {
		record,
		row
	} : null;
}
function proposalRowValues(params) {
	const { record } = params;
	return {
		proposal_id: record.id,
		record_json: JSON.stringify(record),
		owner_agent_id: params.ownerAgentId,
		kind: record.kind,
		status: record.status,
		created_at: record.createdAt,
		updated_at: record.updatedAt,
		draft_hash: record.draftHash,
		origin_agent_id: record.origin?.agentId ?? null,
		origin_session_key: record.origin?.sessionKey ?? null,
		origin_run_id: record.origin?.runId ?? null,
		origin_message_id: record.origin?.messageId ?? null,
		applied_at: record.appliedAt ?? null,
		rejected_at: record.rejectedAt ?? null,
		quarantined_at: record.quarantinedAt ?? null,
		stale_at: record.staleAt ?? null,
		status_reason: record.statusReason ?? null
	};
}
function insertProposal(database, params) {
	const kysely = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, kysely.insertInto("skill_workshop_proposals").values(proposalRowValues(params)));
}
function updateProposal(database, current, record, ownerAgentId) {
	const kysely = getNodeSqliteKysely(database);
	const { proposal_id: _proposalId, ...values } = proposalRowValues({
		record,
		ownerAgentId: ownerAgentId ?? current.owner_agent_id
	});
	executeSqliteQuerySync(database, kysely.updateTable("skill_workshop_proposals").set(values).where("proposal_id", "=", record.id));
}
//#endregion
export { updateProposal as a, readStoredProposalInDatabase as i, parseJson as n, parseSkillProposalRow as r, insertProposal as t };
