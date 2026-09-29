import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import "./artifacts-C9weQ_MG.mjs";
import "./paths-CcMbq5NY.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import "./main-session-De-bcoks.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { n as hasSessionMemberInDatabase, r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-Dh3YMern.mjs";
import { r as readSessionEntryInstanceId } from "./session-sharing-store.native-CfGI05Li.mjs";
import "./targets-Dmb8-YXN.mjs";
import "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import "./group-B8HN3m8j.mjs";
import { l as pruneStaleEntries } from "./store-maintenance-C5xEVYop.mjs";
import "./types-ByCc34Vn.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { r as collectActiveSessionWorkAdmissionKeys } from "./store-maintenance-runtime-C9xB-eDV.mjs";
import "./disk-budget-CH7vIk-L.mjs";
import { C as buildUpdatedSessionGoalStatus, S as buildUpdatedSessionGoalObjective, b as accountSessionGoalUsage, x as buildCreatedSessionGoal } from "./session-accessor-l-4ZHvKn.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-CwzWysXO.mjs";
import { v as applySessionEntryLifecycleMutation } from "./session-accessor.reset-0gTJAhVB.mjs";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { u as recordSessionGoalChanged } from "./session-state-events-CMg59EpB.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./main-session.runtime.js";
import { i as SessionWorkStartInvalidatedError } from "./lifecycle-WWQJH57y.mjs";
import "./reset-DqhvvJAq.mjs";
import "./session-key-BiOR3qX7.mjs";
import "./transcript-DgtCkbrJ.mjs";
import "./delivery-info-DQ_vEN9Q.mjs";
import "./cleanup-service-D-GfJ1eJ.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/goals.ts
const MODEL_UPDATABLE_SESSION_GOAL_STATUSES = ["complete", "blocked"];
function nowMs(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}
function cloneGoal(goal) {
	return { ...goal };
}
function recordGoalChange(options, entry, summary) {
	return recordSessionGoalChanged({
		sessionKey: options.sessionKey,
		entry,
		actor: options.actor,
		agentId: options.agentId,
		summary
	});
}
function resolveSessionGoalDisplayState(entry, now, options) {
	return accountSessionGoalUsage(entry, nowMs(now), options);
}
function goalsEqual(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function formatSessionGoalStatus(goal) {
	if (!goal) return "No goal for this session.\nStart one with /goal start <objective>.";
	const budget = goal.tokenBudget === void 0 ? "" : `Token budget: ${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
	const note = goal.lastStatusNote ? `Note: ${goal.lastStatusNote}` : "";
	const commands = resolveGoalCommandHint(goal.status);
	return [
		"Goal",
		`Status: ${goal.status}`,
		`Objective: ${goal.objective}`,
		`Tokens used: ${formatTokenCount(goal.tokensUsed)}`,
		...budget ? [budget] : [],
		...note ? [note] : [],
		"",
		`Commands: ${commands}`
	].join("\n");
}
function resolveGoalCommandHint(status) {
	switch (status) {
		case "active": return "/goal edit <objective>, /goal pause, /goal complete, /goal clear";
		case "paused":
		case "blocked":
		case "usage_limited":
		case "budget_limited": return "/goal resume, /goal edit <objective>, /goal clear";
		case "complete": return "/goal clear";
	}
	return "/goal";
}
async function getSessionGoal(options) {
	const now = nowMs(options.now);
	if (options.persist === false) {
		const entry = loadSessionEntryReadOnly({
			sessionKey: options.sessionKey,
			storePath: options.storePath
		}) ?? options.fallbackEntry;
		const projected = entry ? resolveSessionGoalDisplayState(entry, now, { adoptFreshBaseline: false }) : void 0;
		return projected ? {
			status: "found",
			goal: projected
		} : { status: "missing" };
	}
	let goal;
	if (!await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		const accounted = accountSessionGoalUsage(entry, now);
		goal = accounted ? cloneGoal(accounted) : void 0;
		if (!accounted || goalsEqual(accounted, entry.goal)) return null;
		return { goal: accounted };
	}, { fallbackEntry: options.fallbackEntry }) || !goal) return { status: "missing" };
	return {
		status: "found",
		goal
	};
}
async function createSessionGoal(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	const now = nowMs(options.now);
	let created;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		created = buildCreatedSessionGoal(entry, {
			objective,
			tokenBudget: options.tokenBudget
		}, now);
		return { goal: created };
	}, { fallbackEntry: options.fallbackEntry });
	if (!result || !created) throw new Error("session not found");
	await recordGoalChange(options, result, "goal created");
	return cloneGoal(created);
}
async function updateSessionGoalStatus(options) {
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		updated = buildUpdatedSessionGoalStatus(entry, options, now);
		return { goal: updated };
	});
	if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	await recordGoalChange(options, result, `goal status changed to ${updated.status}`);
	return cloneGoal(updated);
}
async function updateSessionGoalObjective(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		updated = buildUpdatedSessionGoalObjective(entry, objective, now);
		return { goal: updated };
	});
	if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	await recordGoalChange(options, result, "goal objective changed");
	return cloneGoal(updated);
}
async function clearSessionGoal(options) {
	let removed = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		if (!entry.goal) return null;
		removed = true;
		return { goal: void 0 };
	});
	if (result && removed) await recordGoalChange(options, result, "goal cleared");
	return Boolean(result && removed);
}
//#endregion
//#region src/config/sessions/session-registry-maintenance.ts
function parseCronRunSessionJobId(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return;
	return /^cron:([^:]+):run:[^:]+(?:$|:)/u.exec(parsed.rest)?.[1];
}
function buildSessionRegistryPreserveKeys(params) {
	const preserveKeys = collectActiveSessionWorkAdmissionKeys({
		storePath: params.storePath,
		store: params.store
	}) ?? /* @__PURE__ */ new Set();
	let preservedRunning = 0;
	for (const key of Object.keys(params.store)) {
		const jobId = parseCronRunSessionJobId(key);
		if (!jobId) {
			preserveKeys.add(key);
			continue;
		}
		if (params.runningCronJobIds.has(jobId)) {
			preserveKeys.add(key);
			preservedRunning += 1;
		}
	}
	return {
		preserveKeys,
		preservedRunning
	};
}
function pruneSessionRegistryStore(params) {
	const { preserveKeys, preservedRunning } = buildSessionRegistryPreserveKeys({
		runningCronJobIds: params.runningCronJobIds,
		storePath: params.storePath,
		store: params.store
	});
	const pruned = pruneStaleEntries(params.store, params.retentionMs, {
		log: false,
		onPruned: params.removals ? ({ key, entry }) => {
			params.removals?.push({
				sessionKey: key,
				expectedEntry: entry,
				archiveRemovedTranscript: true
			});
		} : void 0,
		preserveKeys
	});
	return {
		afterCount: Object.keys(params.store).length,
		preservedRunning,
		pruned
	};
}
/**
* Runs task session-registry maintenance for one resolved agent store.
* Preview prunes a clone; apply uses one store-sized write transaction and
* skips generic session maintenance so non-cron rows stay outside this sweep.
*/
async function runSessionRegistryMaintenanceForStore(params) {
	const { agentId, storePath } = params;
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(storePath, { agentId });
	if (sqliteTarget.path && !fs.existsSync(sqliteTarget.path)) return {
		beforeCount: 0,
		afterCount: 0,
		preservedRunning: 0,
		pruned: 0
	};
	const beforeStore = Object.fromEntries(listSessionEntriesCore({
		agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const beforeCount = Object.keys(beforeStore).length;
	if (!params.apply) {
		const previewStore = structuredClone(beforeStore);
		return {
			beforeCount,
			...pruneSessionRegistryStore({
				retentionMs: params.retentionMs,
				runningCronJobIds: params.runningCronJobIds,
				storePath,
				store: previewStore
			})
		};
	}
	const applyStore = structuredClone(beforeStore);
	const removals = [];
	const applied = pruneSessionRegistryStore({
		retentionMs: params.retentionMs,
		removals,
		runningCronJobIds: params.runningCronJobIds,
		storePath,
		store: applyStore
	});
	if (removals.length > 0) {
		const mutation = await applySessionEntryLifecycleMutation({
			agentId,
			storePath,
			removals,
			skipMaintenance: true
		});
		return {
			afterCount: mutation.afterCount,
			beforeCount,
			preservedRunning: applied.preservedRunning,
			pruned: mutation.removedEntries
		};
	}
	return {
		beforeCount,
		...applied
	};
}
//#endregion
//#region src/config/sessions/session-sharing-store.ts
function resolveDatabaseOptions$1(scope) {
	return toDatabaseOptions(resolveSqliteScope(scope));
}
function readSessionMembers(scope, fallback, operation) {
	const result = withOpenClawAgentDatabaseReadOnly(operation, resolveDatabaseOptions$1(scope));
	return result.found ? result.value : fallback;
}
function listSessionMembers(scope) {
	return readSessionMembers(scope, [], (database) => listSessionMembersInDatabase(database, resolveSqliteScope(scope).sessionKey));
}
/** Full membership evidence shares the existing read-only agent database worker. */
async function listSessionMembersInWorker(input) {
	const env = { ...input.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const resolved = resolveSqliteScope({
		...input,
		env
	});
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	if (isIncognitoOpenClawAgentSqlitePath(databasePath, options)) return listSessionMembers({
		...input,
		env
	});
	return await withSessionHistoryWorkerDatabase(options, (owner) => owner.readMembers({
		sessionKey: resolved.sessionKey,
		env
	}));
}
function isSessionMember(scope, identityId) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return false;
	return readSessionMembers(scope, false, (database) => hasSessionMemberInDatabase(database, resolveSqliteScope(scope).sessionKey, normalizedIdentityId));
}
//#endregion
//#region src/config/sessions/session-suggestion-store.kernel.ts
const MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR = 20;
const MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION = 100;
const MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS = 200;
const SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS = 3e4;
function suggestionDb(database) {
	return getNodeSqliteKysely(database.db);
}
function toSuggestion(row) {
	return {
		id: row.id,
		authorId: row.author_id,
		...row.author_label ? { authorLabel: row.author_label } : {},
		text: row.text,
		createdAt: row.created_at,
		state: row.state
	};
}
function assertSessionInstance(database, sessionKey, expectedSessionId) {
	if (expectedSessionId === void 0) return;
	if (readSessionEntryInstanceId(database, sessionKey) !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
}
function pruneResolvedSessionSuggestions(database, sessionKey) {
	const db = suggestionDb(database);
	const resolvedRows = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select("id").where("session_key", "=", sessionKey).where("state", "!=", "pending").orderBy("created_at", "desc").orderBy("id", "desc").limit((eb) => eb.lit(-1)).offset((eb) => eb.lit(MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS))).rows;
	if (resolvedRows.length === 0) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("id", "in", resolvedRows.map((row) => row.id)));
}
function addSessionSuggestionInDatabase(database, sessionKey, params) {
	const suggestion = params.suggestion;
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	pruneResolvedSessionSuggestions(database, sessionKey);
	const pendingCounts = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select((eb) => ["author_id", eb.fn.countAll().as("count")]).where("session_key", "=", sessionKey).where("state", "=", "pending").groupBy("author_id")).rows.reduce((counts, row) => ({
		session: counts.session + row.count,
		author: counts.author + (row.author_id === suggestion.authorId ? row.count : 0)
	}), {
		session: 0,
		author: 0
	});
	if (pendingCounts.session >= MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION) throw new Error("session pending suggestion limit reached");
	if (pendingCounts.author >= MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR) throw new Error("author pending suggestion limit reached");
	executeSqliteQuerySync(database.db, db.insertInto("session_suggestions").values({
		id: suggestion.id,
		session_key: sessionKey,
		author_id: suggestion.authorId,
		author_label: suggestion.authorLabel ?? null,
		text: suggestion.text,
		created_at: suggestion.createdAt,
		state: suggestion.state,
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}));
	return suggestion;
}
function listSessionSuggestionsInDatabase(database, sessionKey, params = {}) {
	let query = suggestionDb(database).selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]).where("session_key", "=", sessionKey);
	if (params.authorId?.trim()) query = query.where("author_id", "=", params.authorId.trim());
	if (params.pendingOnly) query = query.where("state", "=", "pending");
	return executeSqliteQuerySync(database.db, query.orderBy("created_at", "asc").orderBy("id", "asc")).rows.map(toSuggestion);
}
function claimSessionSuggestionDispatchInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state",
		"dispatch_token",
		"dispatch_started_at",
		"dispatch_resolution"
	]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
	if (!row) return null;
	const now = params.now ?? Date.now();
	const claimTtlMs = params.claimTtlMs ?? 3e4;
	if (row.dispatch_token && row.dispatch_started_at !== null && now - row.dispatch_started_at < claimTtlMs) return { kind: "busy" };
	if (row.dispatch_resolution && row.dispatch_resolution !== params.resolution) return {
		kind: "mismatch",
		resolution: row.dispatch_resolution
	};
	const token = randomUUID();
	executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
		dispatch_token: token,
		dispatch_started_at: now,
		dispatch_resolution: params.resolution
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
	return {
		kind: "claimed",
		suggestion: toSuggestion(row),
		token
	};
}
function releaseSessionSuggestionDispatchInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	return (executeSqliteQuerySync(database.db, suggestionDb(database).updateTable("session_suggestions").set({
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) > 0n;
}
function finalizeSessionSuggestionClaimInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token));
	if (!row) return null;
	if ((executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
		state: params.state,
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) === 0n) return null;
	pruneResolvedSessionSuggestions(database, sessionKey);
	return {
		...toSuggestion(row),
		state: params.state
	};
}
//#endregion
//#region src/config/sessions/session-suggestion-store.ts
function resolveDatabaseOptions(scope) {
	return toDatabaseOptions(resolveSqliteScope(scope));
}
function addSessionSuggestion(scope, params) {
	const authorId = params.authorId.trim();
	const authorLabel = params.authorLabel?.trim() || void 0;
	const text = params.text;
	if (!authorId || !text.trim()) throw new Error("suggestion author and text are required");
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	const suggestion = {
		id: params.id ?? randomUUID(),
		authorId,
		...authorLabel ? { authorLabel } : {},
		text,
		createdAt: params.createdAt ?? Date.now(),
		state: "pending"
	};
	runOpenClawAgentWriteTransaction((database) => addSessionSuggestionInDatabase(database, sessionKey, {
		suggestion,
		expectedSessionId: params.expectedSessionId
	}), options);
	return suggestion;
}
function listSessionSuggestions(scope, params = {}) {
	const options = resolveDatabaseOptions(scope);
	const database = openOpenClawAgentDatabase(options);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return listSessionSuggestionsInDatabase(database, sessionKey, params);
}
function claimSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => claimSessionSuggestionDispatchInDatabase(database, sessionKey, params), options);
}
function releaseSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => releaseSessionSuggestionDispatchInDatabase(database, sessionKey, params), options);
}
function finalizeSessionSuggestionClaim(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => finalizeSessionSuggestionClaimInDatabase(database, sessionKey, params), options);
}
//#endregion
export { updateSessionGoalObjective as _, releaseSessionSuggestionDispatch as a, listSessionMembers as c, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as d, clearSessionGoal as f, resolveSessionGoalDisplayState as g, getSessionGoal as h, listSessionSuggestions as i, listSessionMembersInWorker as l, formatSessionGoalStatus as m, claimSessionSuggestionDispatch as n, SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS as o, createSessionGoal as p, finalizeSessionSuggestionClaim as r, isSessionMember as s, addSessionSuggestion as t, runSessionRegistryMaintenanceForStore as u, updateSessionGoalStatus as v };
