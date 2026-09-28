import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { i as openSkillWorkshopStore, n as ensureSkillWorkshopSchema, t as databaseOptions } from "./store-sqlite-schema-DWgDn_pU.mjs";
import path from "node:path";
//#region src/skills/workshop/collection-review-state.ts
const SKILL_COLLECTION_REVIEW_HISTORY_LIMIT = 20;
function experienceReviewKey(agentId, workspaceDir) {
	return sha256Hex(`${agentId}\0${path.resolve(workspaceDir)}`);
}
function readSkillCuratorReviewStatus(options = {}) {
	const state = readConfigMachineState("skills.curatorState", options);
	return {
		lastAttemptAtMs: state?.lastAttemptAtMs ?? null,
		lastSuccessAtMs: state?.lastSuccessAtMs ?? null,
		lastError: state?.lastError ?? null,
		collectionReviews: state?.lastResult.collectionReviews ?? {},
		experienceReviews: state?.lastResult.experienceReviews ?? {}
	};
}
function recordSkillExperienceReviewOutcome(agentId, workspaceDir, review, options = {}) {
	const entryKey = experienceReviewKey(agentId, workspaceDir);
	updateConfigMachineState("skills.curatorState", (current) => {
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
					[entryKey]: review
				}
			}
		};
	}, options);
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
function readSkillCollectionBackupDrops(agentId, backupId, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_collection_reviews").select("dropped_json").where("owner_agent_id", "=", agentId).where("backup_id", "=", backupId)).rows;
	return new Set(rows.flatMap((row) => parseStoredDrops(row.dropped_json).map((drop) => drop.name)));
}
function listSkillCollectionReviewOutcomes(agentId, options = {}) {
	ensureSkillWorkshopSchema(options);
	const database = openOpenClawStateDatabase(databaseOptions(options));
	const kysely = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_collection_reviews").select([
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
export { recordSkillExperienceReviewOutcome as i, readSkillCollectionBackupDrops as n, readSkillCuratorReviewStatus as r, listSkillCollectionReviewOutcomes as t };
