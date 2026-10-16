import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as readConfigMachineStateRowInDatabase } from "./config-machine-state-DR7LQrw2.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-pMcF7uIi.mjs";
import { r as assertOpenClawStateLeasesWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { n as hashSkillProposalRevision, t as hashSkillProposalContent } from "./proposal-hash-Cnd47FBL.mjs";
import { f as SKILL_WORKSHOP_ROLLBACK_SCHEMA, r as assertProposalId, s as parseSkillProposalRollback } from "./store-record-CSGbu9Vk.mjs";
import { n as ensureSkillWorkshopSchemaInDatabase } from "./store-sqlite-schema-_R6vVtKb.mjs";
import { a as updateProposal, i as readStoredProposalInDatabase, n as parseJson, r as parseSkillProposalRow, t as insertProposal } from "./store-sqlite-record-B3dq4QRr.mjs";
import { i as readStoredSkillProposalEventInDatabase, n as listStoredSkillProposalEventsInDatabase, t as appendSkillProposalEvent } from "./store-sqlite-event-cIKxZIdh.mjs";
import path from "node:path";
//#region src/skills/workshop/collection-review.kernel.ts
const SKILL_COLLECTION_REVIEW_HISTORY_LIMIT = 20;
function experienceReviewKey(agentId, workspaceDir) {
	return sha256Hex(`${agentId}\0${path.resolve(workspaceDir)}`);
}
function readSkillCuratorReviewStatusInDatabase(database) {
	const row = readConfigMachineStateRowInDatabase(database.db, "skills.curatorState");
	const state = row ? JSON.parse(row.value_json) : void 0;
	return {
		lastAttemptAtMs: state?.lastAttemptAtMs ?? null,
		lastSuccessAtMs: state?.lastSuccessAtMs ?? null,
		lastError: state?.lastError ?? null,
		collectionReviews: state?.lastResult.collectionReviews ?? {},
		experienceReviews: state?.lastResult.experienceReviews ?? {}
	};
}
function recordSkillExperienceReviewOutcomeInDatabase(database, input) {
	const entryKey = experienceReviewKey(input.agentId, input.workspaceDir);
	const now = Date.now();
	updateConfigMachineStateInDatabase(database.db, "skills.curatorState", (current) => {
		const state = current?.lastResult;
		return {
			lastAttemptAtMs: 0,
			lastSuccessAtMs: null,
			lastError: null,
			...current,
			lastResult: {
				...state,
				experienceReviews: {
					...state?.experienceReviews,
					[entryKey]: input.review
				}
			}
		};
	}, now);
}
function parseStoredNames(value, field) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) throw new Error(`Invalid ${field} in stored skill collection review.`);
	return parsed;
}
function parseStoredDrops(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) throw new Error("Invalid dropped entries in stored skill collection review.");
	return parsed.map((entry) => {
		const record = asNullableRecord(entry);
		if (!record || typeof record.name !== "string" || typeof record.reason !== "string") throw new Error("Invalid dropped entry in stored skill collection review.");
		return {
			name: record.name,
			reason: record.reason
		};
	});
}
function readSkillCollectionBackupDropsInDatabase(database, input) {
	const kysely = getNodeSqliteKysely(database);
	const rows = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_collection_reviews").select("dropped_json").where("owner_agent_id", "=", input.agentId).where("backup_id", "=", input.backupId)).rows;
	return new Set(rows.flatMap((row) => parseStoredDrops(row.dropped_json).map((drop) => drop.name)));
}
function listSkillCollectionReviewOutcomesInDatabase(database, agentId) {
	const kysely = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_collection_reviews").select([
		"backup_id",
		"create_time",
		"kept_names_json",
		"written_names_json",
		"dropped_json"
	]).where("owner_agent_id", "=", agentId).orderBy("create_time", "desc").orderBy("review_id", "desc").limit(SKILL_COLLECTION_REVIEW_HISTORY_LIMIT)).rows.map((row) => ({
		createTime: row.create_time,
		backupId: row.backup_id,
		kept: parseStoredNames(row.kept_names_json, "kept names"),
		written: parseStoredNames(row.written_names_json, "written names"),
		dropped: parseStoredDrops(row.dropped_json)
	}));
}
//#endregion
//#region src/skills/workshop/curator.kernel.ts
function readSkillCuratorStateInDatabase(database, skillFiles) {
	const kysely = getNodeSqliteKysely(database.db);
	const reviewStatus = readSkillCuratorReviewStatusInDatabase(database);
	return {
		proposalRows: executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("kind", "=", "create").where("status", "=", "applied").orderBy("applied_at", "asc").orderBy("proposal_id", "asc")).rows,
		usageRows: skillFiles.length ? executeSqliteQuerySync(database.db, kysely.selectFrom("skill_usage").select([
			"skill_file",
			"last_used_at_ms",
			"use_count"
		]).where("skill_file", "in", skillFiles)).rows : [],
		reviewStatus
	};
}
function recordSkillUsageInDatabase(database, event) {
	const kysely = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, kysely.insertInto("skill_usage").values({
		skill_file: event.skillFile,
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: event.ts,
		last_used_at_ms: event.ts,
		use_count: 1,
		last_agent_id: event.agentId ?? null
	}).onConflict((conflict) => conflict.column("skill_file").doUpdateSet((eb) => ({
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: eb.fn("min", [eb.ref("first_used_at_ms"), eb.val(event.ts)]),
		last_used_at_ms: eb.fn("max", [eb.ref("last_used_at_ms"), eb.val(event.ts)]),
		use_count: eb("use_count", "+", 1),
		last_agent_id: eb.case().when("last_used_at_ms", "<=", event.ts).then(event.agentId ?? null).else(eb.ref("last_agent_id")).end()
	}))));
}
//#endregion
//#region src/skills/workshop/store-evaluation.kernel.ts
function recordSkillProposalEvaluationInDatabase(db, params) {
	assertProposalId(params.proposalId);
	const current = readStoredProposalInDatabase(db, params.proposalId);
	if (!current) throw new Error(`Skill proposal not found: ${params.proposalId}`);
	const { record } = current;
	if (record.status !== "pending" || record.proposedVersion !== params.expectedProposedVersion || hashSkillProposalRevision(record) !== params.expectedRevisionHash) throw new Error("Skill proposal changed while evaluation was running; discard the stale evaluation and retry.");
	const next = {
		...record,
		updatedAt: params.evaluation.completedAt,
		evaluation: params.evaluation
	};
	updateProposal(db, current.row, next);
	return {
		record: next,
		event: appendSkillProposalEvent(db, params.event)
	};
}
//#endregion
//#region src/skills/workshop/store-sqlite-rollback.ts
function skillProposalRollbackValues(rollback) {
	return {
		written_at: rollback.writtenAt,
		target_skill_file: rollback.targetSkillFile,
		action: rollback.action,
		previous_content_hash: rollback.previousContentHash ?? null,
		previous_content: rollback.previousContent ?? null,
		support_files_json: rollback.supportFiles ? JSON.stringify(rollback.supportFiles) : null
	};
}
function removeOtherPendingTargetRollbacks(database, params) {
	const kysely = getNodeSqliteKysely(database);
	const rows = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposal_rollbacks").innerJoin("skill_workshop_proposals", "skill_workshop_proposals.proposal_id", "skill_workshop_proposal_rollbacks.proposal_id").select("skill_workshop_proposal_rollbacks.proposal_id as proposalId").where("skill_workshop_proposal_rollbacks.target_skill_file", "=", params.targetSkillFile).where("skill_workshop_proposals.status", "=", "pending").where("skill_workshop_proposals.proposal_id", "!=", params.proposalId)).rows;
	for (const row of rows) executeSqliteQuerySync(database, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", row.proposalId));
}
function writeSkillProposalRollbackInDatabase(db, params) {
	assertProposalId(params.proposalId);
	const kysely = getNodeSqliteKysely(db);
	const proposal = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select([
		"proposal_id",
		"kind",
		"status"
	]).where("proposal_id", "=", params.proposalId));
	if (!proposal) throw new Error(`Skill proposal not found: ${params.proposalId}`);
	if (proposal.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${proposal.status}.`);
	removeOtherPendingTargetRollbacks(db, {
		proposalId: params.proposalId,
		targetSkillFile: params.rollback.targetSkillFile
	});
	const values = skillProposalRollbackValues(params.rollback);
	executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_proposal_rollbacks").values({
		proposal_id: params.proposalId,
		...values
	}).onConflict((conflict) => conflict.column("proposal_id").doUpdateSet(values)));
}
function readSkillProposalRollbackInDatabase(database, proposalId) {
	assertProposalId(proposalId);
	const kysely = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, kysely.selectFrom("skill_workshop_proposal_rollbacks").selectAll().where("proposal_id", "=", proposalId));
	if (!row) return null;
	return parseSkillProposalRollback({
		schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
		proposalId: row.proposal_id,
		writtenAt: row.written_at,
		targetSkillFile: row.target_skill_file,
		action: row.action,
		...row.previous_content_hash ? { previousContentHash: row.previous_content_hash } : {},
		...row.previous_content !== null ? { previousContent: row.previous_content } : {},
		...row.support_files_json ? { supportFiles: parseJson(row.support_files_json) } : {}
	});
}
function clearSkillProposalRollbackInDatabase(db, params) {
	assertProposalId(params.proposalId);
	const kysely = getNodeSqliteKysely(db);
	const proposal = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select(["record_json", "status"]).where("proposal_id", "=", params.proposalId));
	if (!proposal || proposal.status !== "pending" || proposal.record_json !== params.expectedRecordJson) return false;
	executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.proposalId));
	return true;
}
//#endregion
//#region src/skills/workshop/store-proposal.kernel.ts
function createSkillProposalInDatabase(db, params) {
	assertProposalId(params.record.id);
	const kysely = getNodeSqliteKysely(db);
	if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select("proposal_id").where("proposal_id", "=", params.record.id))) throw new Error(`Skill proposal already exists: ${params.record.id}`);
	if ((executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").select((eb) => eb.fn.countAll().as("count")).where("owner_agent_id", "=", params.ownerAgentId).where("status", "in", ["pending", "quarantined"]))?.count ?? 0) >= params.maxPending) throw new Error(`Skill Workshop pending proposal limit reached (${params.maxPending}).`);
	insertProposal(db, {
		record: params.record,
		ownerAgentId: params.ownerAgentId
	});
	return appendSkillProposalEvent(db, params.event);
}
function updateSkillProposalRecordInDatabase(db, params) {
	assertProposalId(params.record.id);
	const kysely = getNodeSqliteKysely(db);
	const current = readStoredProposalInDatabase(db, params.record.id);
	if (!current) throw new Error(`Skill proposal not found: ${params.record.id}`);
	if (current.row.status === "pending" && (params.record.status === "rejected" || params.record.status === "quarantined") && executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposal_rollbacks").select("proposal_id").where("proposal_id", "=", params.record.id))) throw new Error("Skill proposal has unfinished apply recovery. Run openclaw doctor --fix and restore the files it identifies before retrying.");
	if (params.invalidateRollback) executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.record.id));
	updateProposal(db, current.row, params.record, params.ownerAgentId);
	return params.event ? appendSkillProposalEvent(db, params.event) : void 0;
}
function listStoredSkillProposalsInDatabase(database, scope) {
	let query = getNodeSqliteKysely(database).selectFrom("skill_workshop_proposals").selectAll();
	if (scope.kind) query = query.where("kind", "=", scope.kind);
	if (scope.status) query = query.where("status", "=", scope.status);
	if (scope.agentId) query = query.where("owner_agent_id", "=", scope.agentId);
	else query = query.where("owner_agent_id", "is not", null);
	return executeSqliteQuerySync(database, query.orderBy("updated_at", "desc").orderBy("proposal_id", "asc")).rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record ? [{
			record,
			row
		}] : [];
	});
}
function importLegacySkillProposalInDatabase(db, params) {
	assertProposalId(params.record.id);
	const kysely = getNodeSqliteKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", params.record.id));
	if (current) {
		const existing = parseSkillProposalRow(current);
		if (!existing || existing.draftHash !== params.record.draftHash || existing.target.skillFile !== params.record.target.skillFile) throw new Error(`Legacy skill proposal conflicts with SQLite: ${params.record.id}`);
	} else insertProposal(db, {
		record: params.record,
		ownerAgentId: params.ownerAgentId
	});
	if (params.rollback) executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_proposal_rollbacks").values({
		proposal_id: params.record.id,
		...skillProposalRollbackValues(params.rollback)
	}).onConflict((conflict) => conflict.column("proposal_id").doNothing()));
	return current ? "already-imported" : "imported";
}
//#endregion
//#region src/skills/workshop/store-sqlite-transition.ts
function commitPendingSkillProposalTransitionInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	const current = readStoredProposalInDatabase(db, params.expected.id);
	if (!current || current.record.status !== "pending" || current.row.record_json !== JSON.stringify(params.expected)) return {
		state: "conflict",
		...current ? { current: current.record } : {}
	};
	if (params.invalidateRollback) executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_proposal_rollbacks").where("proposal_id", "=", params.expected.id));
	updateProposal(db, current.row, params.record);
	return {
		state: "committed",
		event: appendSkillProposalEvent(db, params.event)
	};
}
function readCommittedSkillProposalTransitionInDatabase(db, params) {
	const stored = readStoredProposalInDatabase(db, params.record.id);
	if (!stored || stored.row.record_json !== JSON.stringify(params.record)) return null;
	const event = readStoredSkillProposalEventInDatabase(db, params.event.eventId);
	if (!event || event.proposalId !== params.event.proposalId || event.proposedVersion !== params.event.proposedVersion || event.revisionHash !== params.event.revisionHash || event.type !== params.event.type) return null;
	return {
		state: "committed",
		event
	};
}
//#endregion
//#region src/skills/workshop/store.worker.ts
function assertWrite(db, input, stage) {
	if (input.leaseIdentities) assertOpenClawStateLeasesWorkerOwnedInTransaction(db, input.leaseIdentities, stage);
	else requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	});
}
function write(input, { open, stateOptions }, operationLabel, operation, proposalId) {
	const database = open();
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertWrite(db, input, "transaction");
		if (input.leaseIdentities) {
			const stored = proposalId ? readStoredProposalInDatabase(db, proposalId) : null;
			const { agentId } = input;
			for (const identity of input.leaseIdentities) if (!agentId || (identity.scope === "skill-collection" ? identity.key !== agentId : identity.scope !== "skill-workshop-target" || !stored || identity.key !== `${agentId}:${hashSkillProposalContent(stored.record.target.skillFile)}`) || stored !== null && stored.row.owner_agent_id !== null && stored.row.owner_agent_id !== agentId) throw new Error("Skill Workshop lease does not match its proposal target.");
		}
		const result = operation(database);
		assertWrite(db, input, "commit");
		return result;
	}, {
		database,
		...stateOptions()
	}, { operationLabel });
}
const skillCuratorOperations = {
	"skills.curator.read": (input, { open }) => readSkillCuratorStateInDatabase(open(), input.skillFiles),
	"skills.usage.record": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((current) => recordSkillUsageInDatabase(current, input), {
		database: open(),
		...stateOptions()
	})
};
const skillWorkshopOperations = {
	"workshop.events.list": (input, { open, stateOptions }) => {
		const database = open();
		ensureSkillWorkshopSchemaInDatabase(database, {
			database,
			...stateOptions()
		});
		return listStoredSkillProposalEventsInDatabase(database.db, input);
	},
	"workshop.schema.ensure": (input, { open, stateOptions }) => {
		const database = open();
		return ensureSkillWorkshopSchemaInDatabase(database, {
			database,
			...stateOptions()
		}, (db, stage) => assertWrite(db, input, stage));
	},
	"workshop.proposal.read": (input, { open }) => readStoredProposalInDatabase(open().db, input.value),
	"workshop.proposals.list": (input, { open }) => listStoredSkillProposalsInDatabase(open().db, input.value),
	"workshop.proposal.create": (input, context) => write(input, context, "skill-workshop.proposal.create", (database) => createSkillProposalInDatabase(database.db, input.value)),
	"workshop.proposal.update": (input, context) => write(input, context, "skill-workshop.proposal.update", (database) => updateSkillProposalRecordInDatabase(database.db, input.value), input.value.record.id),
	"workshop.proposal.import": (input, context) => write(input, context, "doctor.skill-workshop.import", (database) => importLegacySkillProposalInDatabase(database.db, input.value)),
	"workshop.proposal.evaluate": (input, context) => write(input, context, "skill-workshop.proposal.evaluate", (database) => recordSkillProposalEvaluationInDatabase(database.db, input.value), input.value.proposalId),
	"workshop.transition.commit": (input, context) => write(input, context, input.value.operationLabel, (database) => commitPendingSkillProposalTransitionInDatabase(database.db, input.value), input.value.expected.id),
	"workshop.transition.committed": (input, { open }) => readCommittedSkillProposalTransitionInDatabase(open().db, input.value),
	"workshop.rollback.read": (input, { open }) => readSkillProposalRollbackInDatabase(open().db, input.value),
	"workshop.rollback.write": (input, context) => write(input, context, "skill-workshop.rollback.write", (database) => writeSkillProposalRollbackInDatabase(database.db, input.value), input.value.proposalId),
	"workshop.rollback.clear": (input, context) => write(input, context, "skill-workshop.rollback.clear", (database) => clearSkillProposalRollbackInDatabase(database.db, input.value), input.value.proposalId),
	"workshop.collection.list": (input, { open }) => listSkillCollectionReviewOutcomesInDatabase(open().db, input.value),
	"workshop.collection.drops": (input, { open }) => readSkillCollectionBackupDropsInDatabase(open().db, input.value),
	"workshop.experience.record": (input, context) => write(input, context, "skill-workshop.experience.record", (database) => recordSkillExperienceReviewOutcomeInDatabase(database, input.value))
};
//#endregion
export { skillCuratorOperations, skillWorkshopOperations };
