import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { l as assertSkillProposalEvaluationWithinLimit, n as parseJson, o as MAX_SKILL_PROPOSAL_EVALUATION_BYTES, u as parseSkillProposalEvaluation } from "./store-sqlite-record-B7LlWdpb.mjs";
import { i as openSkillWorkshopStore } from "./store-sqlite-schema-DWgDn_pU.mjs";
//#region src/skills/workshop/store-sqlite-event.ts
const STORED_EVENT_DATA_VERSION = 1;
const MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES = MAX_SKILL_PROPOSAL_EVALUATION_BYTES + 65536;
const MAX_SKILL_PROPOSAL_EVENTS_RESPONSE_BYTES = 2097152;
function appendSkillProposalEvent(database, event) {
	if (event.evaluation) assertSkillProposalEvaluationWithinLimit(event.evaluation);
	const storedData = event.payload || event.evaluation ? JSON.stringify([
		STORED_EVENT_DATA_VERSION,
		event.payload ?? null,
		event.evaluation ?? null
	]) : null;
	if (storedData && Buffer.byteLength(storedData, "utf8") > MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES) throw new Error(`Skill proposal event data exceeds ${MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES} bytes.`);
	const kysely = getNodeSqliteKysely(database);
	const inserted = executeSqliteQueryTakeFirstSync(database, kysely.insertInto("skill_workshop_proposal_events").values({
		event_id: event.eventId,
		proposal_id: event.proposalId,
		proposed_version: event.proposedVersion,
		revision_hash: event.revisionHash,
		event_type: event.type,
		occurred_at: event.occurredAt,
		actor_json: JSON.stringify(event.actor),
		correlation_id: event.correlationId ?? null,
		payload_json: storedData
	}).returning("sequence"));
	if (!inserted) throw new Error(`Failed to append Skill Workshop event: ${event.eventId}`);
	return {
		...event,
		sequence: inserted.sequence
	};
}
function readStoredSkillProposalEvent(eventId, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const row = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposal_events").selectAll().where("event_id", "=", eventId));
	return row ? parseStoredSkillProposalEventRow(row) : null;
}
function listStoredSkillProposalEventsInDatabase(database, input) {
	const kysely = getNodeSqliteKysely(database);
	const limit = Math.min(Math.max(input.limit ?? 100, 1), 200);
	let query = kysely.selectFrom("skill_workshop_proposal_events").innerJoin("skill_workshop_proposals", "skill_workshop_proposals.proposal_id", "skill_workshop_proposal_events.proposal_id").select([
		"skill_workshop_proposal_events.sequence",
		"skill_workshop_proposal_events.event_id",
		"skill_workshop_proposal_events.proposal_id",
		"skill_workshop_proposal_events.proposed_version",
		"skill_workshop_proposal_events.revision_hash",
		"skill_workshop_proposal_events.event_type",
		"skill_workshop_proposal_events.occurred_at",
		"skill_workshop_proposal_events.actor_json",
		"skill_workshop_proposal_events.correlation_id",
		"skill_workshop_proposal_events.payload_json"
	]).where("skill_workshop_proposal_events.sequence", ">", input.afterSequence ?? 0);
	if (input.proposalId) query = query.where("skill_workshop_proposal_events.proposal_id", "=", input.proposalId);
	if (input.agentId) query = query.where("skill_workshop_proposals.owner_agent_id", "=", input.agentId);
	else query = query.where("skill_workshop_proposals.owner_agent_id", "is not", null);
	const rows = executeSqliteQuerySync(database, query.orderBy("skill_workshop_proposal_events.sequence", "asc").limit(limit + 1)).rows;
	let hasMore = rows.length > limit;
	let responseBytes = 2;
	const events = [];
	for (const row of rows.slice(0, limit)) {
		const event = parseStoredSkillProposalEventRow(row);
		if (!event) continue;
		const eventBytes = Buffer.byteLength(JSON.stringify(event), "utf8") + 1;
		if (events.length > 0 && responseBytes + eventBytes > MAX_SKILL_PROPOSAL_EVENTS_RESPONSE_BYTES) {
			hasMore = true;
			break;
		}
		events.push(event);
		responseBytes += eventBytes;
	}
	return {
		events,
		...hasMore && events.length > 0 ? { nextSequence: events[events.length - 1].sequence } : {}
	};
}
/** Reads apply provenance through the caller's existing connection without opening a writable store. */
function readAppliedSkillProposalEvents(database) {
	const kysely = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposal_events").selectAll().where("event_type", "=", "applied").orderBy("sequence", "asc")).rows.flatMap((row) => {
		const event = parseStoredSkillProposalEventRow(row);
		return event ? [event] : [];
	});
}
function parseStoredSkillProposalEventRow(row) {
	const actor = parseSkillProposalEventActor(parseJson(row.actor_json));
	if (!actor || !isSkillProposalEventType(row.event_type)) return null;
	if (row.payload_json && Buffer.byteLength(row.payload_json, "utf8") > MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES) throw new Error(`Stored Skill Workshop event ${row.event_id} exceeds ${MAX_SKILL_PROPOSAL_EVENT_DATA_BYTES} bytes and cannot be replayed safely.`);
	const storedData = parseSkillProposalEventData(parseJson(row.payload_json));
	return {
		sequence: row.sequence,
		eventId: row.event_id,
		proposalId: row.proposal_id,
		proposedVersion: row.proposed_version,
		revisionHash: row.revision_hash,
		type: row.event_type,
		occurredAt: row.occurred_at,
		actor,
		...row.correlation_id ? { correlationId: row.correlation_id } : {},
		...storedData.payload ? { payload: storedData.payload } : {},
		...storedData.evaluation ? { evaluation: storedData.evaluation } : {}
	};
}
function isSkillProposalEventType(value) {
	return [
		"created",
		"revised",
		"evaluation_completed",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	].includes(value);
}
function parseSkillProposalEventActor(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const actor = value;
	if (![
		"agent",
		"gateway",
		"plugin",
		"system"
	].includes(actor.type) || actor.id !== void 0 && typeof actor.id !== "string") return null;
	return actor;
}
function parseSkillProposalEventData(value) {
	if (value === void 0) return {};
	if (Array.isArray(value)) {
		if (value.length !== 3 || value[0] !== STORED_EVENT_DATA_VERSION) return {};
		const payload = parseSkillProposalEventPayload(value[1]);
		const evaluation = parseSkillProposalEvaluation(value[2]) ?? void 0;
		return {
			...payload ? { payload } : {},
			...evaluation ? { evaluation } : {}
		};
	}
	const payload = parseSkillProposalEventPayload(value);
	return payload ? { payload } : {};
}
function parseSkillProposalEventPayload(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entries = Object.entries(value);
	if (entries.length > 32 || entries.some(([key, item]) => !key || key.length > 80 || item !== null && typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean")) return;
	if (entries.length === 0) return {};
	return Object.fromEntries(entries);
}
//#endregion
export { readStoredSkillProposalEvent as i, listStoredSkillProposalEventsInDatabase as n, readAppliedSkillProposalEvents as r, appendSkillProposalEvent as t };
