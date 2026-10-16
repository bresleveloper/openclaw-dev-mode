import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./artifacts-BvSTVPj-.mjs";
import "./paths-dpReqUI8.mjs";
import { u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./main-session-00MgEWj5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as resolveSessionStorePathForScope, s as withSessionHistoryWorkerDatabase, u as projectionLane } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { n as hasSessionMemberInDatabase, r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-BCRJJ2WM.mjs";
import { c as pruneStaleEntries } from "./store-maintenance-CGOlSbiV.mjs";
import "./targets-BbcRkdUC.mjs";
import "./group-DiW6xNkZ.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { a as listSessionSuggestionsInDatabase } from "./session-suggestion-store.kernel-BJlDtUvU.mjs";
import "./session-suggestion-store-Ds6yg9Y3.mjs";
import { o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { i as collectActiveSessionWorkAdmissionKeys } from "./store-maintenance-runtime-CXttvsi9.mjs";
import "./disk-budget-7sFA2NUn.mjs";
import "./types-BZlUzQZy.mjs";
import { d as withSessionRegistryEntriesInWorker, f as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { g as applySessionEntryLifecycleMutation } from "./session-accessor.reset-DWr6djSD.mjs";
import { c as accountSessionGoalUsage, d as buildUpdatedSessionGoalStatus, l as buildCreatedSessionGoal, u as buildUpdatedSessionGoalObjective } from "./goals-operations-DSJHMBAH.mjs";
import "./transcript-CEhnMlD1.mjs";
import "./session-key-DRL62oER.mjs";
import "./reset-BvpOh-VC.mjs";
import { u as recordSessionGoalChanged } from "./session-state-events-B7wdeeGU.mjs";
import "./lifecycle-BH2MRg79.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
import "./main-session.runtime.js";
import "./session-reaction-store-DPqZlHQb.mjs";
import "./delivery-info-COt2T8KL.mjs";
import "./cleanup-service-CThkApeP.mjs";
import "./context-token-provenance-Djv3AdiI.mjs";
import fs from "node:fs";
//#region src/config/sessions/goals.ts
const MODEL_UPDATABLE_SESSION_GOAL_STATUSES = ["complete", "blocked"];
function nowMs(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
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
		goal = accounted ? { ...accounted } : void 0;
		if (!accounted || JSON.stringify(accounted) === JSON.stringify(entry.goal)) return null;
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
	return { ...created };
}
async function updateSessionGoalStatus(options) {
	return updateSessionGoal(options, (entry, now) => buildUpdatedSessionGoalStatus(entry, options, now), (goal) => `goal status changed to ${goal.status}`);
}
async function updateSessionGoalObjective(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	return updateSessionGoal(options, (entry, now) => buildUpdatedSessionGoalObjective(entry, objective, now), () => "goal objective changed");
}
async function updateSessionGoal(options, update, summarize) {
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		updated = update(entry, now);
		return { goal: updated };
	});
	if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	await recordGoalChange(options, result, summarize(updated));
	return { ...updated };
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
* Runs session-registry maintenance for one resolved agent store.
* Preview and apply select removals from one owned worker snapshot.
* The lifecycle owner commits removals without running generic session maintenance.
*/
async function runSessionRegistryMaintenanceForStore(params) {
	params.assertCurrent?.();
	const { agentId, storePath } = params;
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(storePath, { agentId });
	if (sqliteTarget.path && !fs.existsSync(sqliteTarget.path)) return {
		beforeCount: 0,
		afterCount: 0,
		preservedRunning: 0,
		pruned: 0
	};
	return await withSessionRegistryEntriesInWorker({
		agentId,
		storePath
	}, async (entries, assertReaderCurrent) => {
		const assertCurrent = () => {
			params.assertCurrent?.();
			assertReaderCurrent();
		};
		assertCurrent();
		const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
		const beforeCount = Object.keys(store).length;
		const removals = [];
		const planned = pruneSessionRegistryStore({
			retentionMs: params.retentionMs,
			removals: params.apply ? removals : void 0,
			runningCronJobIds: params.runningCronJobIds,
			storePath,
			store
		});
		if (removals.length > 0) {
			const mutation = await applySessionEntryLifecycleMutation({
				agentId,
				storePath,
				removals,
				skipMaintenance: true,
				beforeCommitInTransaction: assertCurrent
			});
			assertCurrent();
			return {
				afterCount: mutation.afterCount,
				beforeCount,
				preservedRunning: planned.preservedRunning,
				pruned: mutation.removedEntries
			};
		}
		return {
			beforeCount,
			...planned
		};
	});
}
//#endregion
//#region src/config/sessions/session-sharing-store.ts
function readSessionMembers(scope, fallback, operation) {
	const resolved = resolveSqliteScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => operation(database, resolved.sessionKey), toDatabaseOptions(resolved));
	return result.found ? result.value : fallback;
}
function listSessionMembers(scope) {
	return readSessionMembers(scope, [], listSessionMembersInDatabase);
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
	}), projectionLane);
}
function isSessionMember(scope, identityId) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return false;
	return readSessionMembers(scope, false, (database, sessionKey) => hasSessionMemberInDatabase(database, sessionKey, normalizedIdentityId));
}
//#endregion
//#region src/config/sessions/session-suggestion-store.read.ts
async function listSessionSuggestions(input, params = {}) {
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env)
	};
	const storePath = resolveSessionStorePathForScope(scope);
	const filters = { ...params };
	const agentId = parseAgentSessionKey(scope.sessionKey)?.agentId ?? scope.agentId ?? scope.defaultAgentId;
	if (agentId && isIncognitoOpenClawAgentSqlitePath(storePath, {
		agentId,
		env: scope.env
	})) {
		const database = getOpenIncognitoAgentDatabase(agentId, storePath);
		return database ? listSessionSuggestionsInDatabase(database, resolveSqliteSessionKey(scope.sessionKey, agentId), filters) : [];
	}
	return withSessionStoreReaderInWorker({
		...scope,
		storePath
	}, ({ reader, logicalAgentId }) => reader.readSuggestions({
		sessionKey: resolveSqliteSessionKey(scope.sessionKey, logicalAgentId),
		params: filters,
		env: scope.env
	}), { dataOnly: true });
}
//#endregion
export { runSessionRegistryMaintenanceForStore as a, createSessionGoal as c, resolveSessionGoalDisplayState as d, updateSessionGoalObjective as f, listSessionMembersInWorker as i, formatSessionGoalStatus as l, isSessionMember as n, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as o, updateSessionGoalStatus as p, listSessionMembers as r, clearSessionGoal as s, listSessionSuggestions as t, getSessionGoal as u };
