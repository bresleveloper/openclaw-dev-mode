import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./artifacts-C6u8F4sP.mjs";
import "./paths-YgcBNLgG.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import "./group-qLatmSbQ.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { u as recordSessionGoalChanged } from "./session-state-events-BCzDVKh0.mjs";
import "./main-session-CHYPkxYr.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as pruneStaleEntries, u as shouldPreserveMaintenanceEntry } from "./store-maintenance-BqMt1Twc.mjs";
import "./types-BGDhC4_W.mjs";
import { d as buildUpdatedSessionGoalObjective, f as buildUpdatedSessionGoalStatus, l as accountSessionGoalUsage, u as buildCreatedSessionGoal } from "./goals-operation-policy-qSLTo9UN.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { l as projectionLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import "./targets-DJGC6v85.mjs";
import { l as withSessionEntryReadOnlyInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as collectActiveSessionWorkAdmissionKeys } from "./store-maintenance-preserve-BGAXgKIR.mjs";
import "./disk-budget-3DpjwM_1.mjs";
import { l as listSessionChildEntriesReadOnly } from "./session-accessor.entry-BLpjjUTc.mjs";
import { _ as applySessionEntryLifecycleMutation } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import "./main-session.runtime.js";
import "./lifecycle-CKc8qk3B.mjs";
import "./reset-DlE-iD9Z.mjs";
import "./session-key-Sn5H-nwW.mjs";
import "./transcript-BSOdHT4f.mjs";
import { n as withSessionRegistryEntriesInWorker } from "./session-entry-read-maintenance-B4xDRK3G.mjs";
import "./session-reaction-store-CRimN3Hk.mjs";
import "./delivery-info-BlWXIzDQ.mjs";
import "./cleanup-service-BHj-66gM.mjs";
import "./context-token-provenance-1ZLJbdqW.mjs";
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
		case "complete": return "/goal resume, /goal clear";
	}
	return "/goal";
}
async function getSessionGoal(options) {
	const now = nowMs(options.now);
	if (options.persist === false) return withSessionEntryReadOnlyInWorker({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, () => {}, async (read) => {
		if (!read.ok) throw read.error;
		const entry = read.value ?? options.fallbackEntry;
		const goal = entry ? resolveSessionGoalDisplayState(entry, now, { adoptFreshBaseline: false }) : void 0;
		return goal ? {
			status: "found",
			goal
		} : { status: "missing" };
	});
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
async function pruneSessionRegistryStore(params) {
	const { store, storePath, agentId } = params;
	const preserveKeys = collectActiveSessionWorkAdmissionKeys({
		storePath,
		store
	}) ?? /* @__PURE__ */ new Set();
	let preservedRunning = 0;
	for (const key of Object.keys(store)) {
		const parsed = parseAgentSessionKey(key);
		const jobId = /^cron:([^:]+):run:[^:]+(?:$|:)/u.exec(parsed?.rest ?? "")?.[1];
		if (jobId && params.runningCronJobIds.has(jobId)) {
			preserveKeys.add(key);
			preservedRunning += 1;
		}
	}
	const candidates = [];
	pruneStaleEntries(store, params.retentionMs, {
		log: false,
		onPruned: ({ key, entry }) => candidates.push({
			sessionKey: key,
			entry
		}),
		preserveKeys
	});
	const pending = candidates.map(({ sessionKey }) => sessionKey);
	const seen = new Set(pending);
	const parents = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < pending.length;) {
		const keys = pending.slice(offset, offset + 32);
		offset += keys.length;
		for (const target of params.childStores ?? [{
			agentId,
			storePath
		}]) {
			const children = await listSessionChildEntriesReadOnly({
				...target,
				sessionKey: "",
				projection: "list"
			}, keys);
			params.assertCurrent?.();
			for (const { sessionKey, entry } of [...candidates, ...children]) {
				const parent = entry.spawnedBy;
				if (!parent || !keys.includes(parent)) continue;
				parents.set(sessionKey, parent);
				if (entry.archivedAt === void 0) preserveKeys.add(parent);
				else if (!seen.has(sessionKey)) {
					seen.add(sessionKey);
					pending.push(sessionKey);
				}
			}
		}
	}
	for (const key of preserveKeys) {
		const parent = parents.get(key);
		if (parent) preserveKeys.add(parent);
	}
	const removals = [];
	for (const { sessionKey, entry } of candidates) if (preserveKeys.has(sessionKey)) store[sessionKey] = entry;
	else removals.push({
		sessionKey,
		expectedEntry: entry,
		archiveRemovedTranscript: true
	});
	const now = Date.now();
	let nextSweepAtMs = null;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry
		}) || typeof entry.updatedAt !== "number" || !Number.isFinite(entry.updatedAt)) continue;
		const expiresAt = entry.updatedAt + params.retentionMs + 1;
		const deadline = expiresAt <= now ? now + 6e4 : expiresAt;
		nextSweepAtMs = Math.min(nextSweepAtMs ?? Infinity, deadline);
	}
	return {
		preservedRunning,
		pruned: removals.length,
		nextSweepAtMs,
		removals
	};
}
/**
* Runs session-registry maintenance for one resolved agent store.
* Preview and apply consume bounded snapshots under one physical reader owner.
* The lifecycle owner commits removals without running generic session maintenance.
*/
async function runSessionRegistryMaintenanceForStore(params) {
	params.assertCurrent?.();
	const { agentId, storePath } = params;
	const summary = {
		preservedRunning: 0,
		pruned: 0,
		nextSweepAtMs: null
	};
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(storePath, { agentId });
	if (sqliteTarget.path && !fs.existsSync(sqliteTarget.path)) return summary;
	let rowRevision = 0;
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if (sessionChangeScopeAffectsStoredRows(change) && ("all" in change || change.factsInvalidated === true || change.facts?.kind === "entry" || change.facts?.kind === "replacement" || change.facts?.kind === "removed")) rowRevision += 1;
	});
	try {
		await withSessionRegistryEntriesInWorker({
			agentId,
			storePath
		}, async (entries, assertReaderCurrent) => {
			const assertCurrent = () => {
				params.assertCurrent?.();
				assertReaderCurrent();
			};
			assertCurrent();
			const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			const revision = rowRevision;
			const planned = await pruneSessionRegistryStore({
				...params,
				store,
				assertCurrent
			});
			const { removals, preservedRunning } = planned;
			let { pruned, nextSweepAtMs } = planned;
			if (params.apply && removals.length > 0) {
				const mutation = await applySessionEntryLifecycleMutation({
					agentId,
					storePath,
					removals,
					skipMaintenance: true,
					commitGuard() {
						assertCurrent();
						if (rowRevision !== revision) throw new Error("Session ancestry changed before cron registry cleanup");
					}
				});
				assertCurrent();
				if (mutation.removedEntries !== pruned) nextSweepAtMs = Date.now() + 6e4;
				pruned = mutation.removedEntries;
			}
			summary.preservedRunning += preservedRunning;
			summary.pruned += pruned;
			if (nextSweepAtMs !== null) summary.nextSweepAtMs = Math.min(summary.nextSweepAtMs ?? Infinity, nextSweepAtMs);
		});
		return summary;
	} finally {
		unsubscribe();
	}
}
//#endregion
//#region src/config/sessions/session-sharing-store.ts
/** Current management metadata and evidence share the projection worker's read snapshot. */
async function readSessionMembersInWorker(input) {
	const memory = captureSessionActorStorageOwner(input, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return await withSessionActorStorage(input, {
		authority: memory.authority,
		lifetime: {
			assertCurrent: () => memory.authority.assertCurrent(),
			assertReadable: () => memory.authority.assertCurrent()
		}
	}, (binding) => binding.actor.storage.read({
		type: "session.members.read",
		input: {}
	}, binding.authority)) ?? {
		entry: void 0,
		members: []
	};
	const resolved = resolveSqliteScope(input);
	const env = { ...resolved.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = toDatabaseOptions({
		...resolved,
		env
	});
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	return await withSessionStoreReaderInWorker({
		agentId: options.agentId,
		storePath: databasePath,
		env
	}, ({ reader, continuation }) => reader.readMembers({
		sessionKey: resolved.sessionKey,
		env,
		continuation
	}), {
		backing: true,
		dataOnly: true,
		lane: projectionLane
	});
}
//#endregion
//#region src/config/sessions/session-suggestion-store.read.ts
async function listSessionSuggestions(input, params = {}) {
	const memory = captureSessionActorStorageOwner(input, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const query = {
			type: "session.suggestions.read",
			input: { params: structuredClone(params) }
		};
		return await withSessionActorStorage(input, {
			authority: memory.authority,
			lifetime: {
				assertCurrent: () => memory.authority.assertCurrent(),
				assertReadable: () => memory.authority.assertCurrent()
			}
		}, (binding) => binding.actor.storage.read(query, binding.authority)) ?? [];
	}
	const storePath = resolveSessionStorePathForScope(input);
	const scope = {
		...input,
		env: captureSessionTranscriptStorageEnvironment(input.env ?? process.env)
	};
	const filters = { ...params };
	return withSessionStoreReaderInWorker({
		...scope,
		storePath
	}, ({ reader, logicalAgentId }) => reader.readSuggestions({
		sessionKey: resolveSqliteSessionKey(scope.sessionKey, logicalAgentId),
		params: filters,
		env: scope.env
	}), {
		dataOnly: true,
		lane: projectionLane
	});
}
//#endregion
export { clearSessionGoal as a, getSessionGoal as c, updateSessionGoalStatus as d, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as i, resolveSessionGoalDisplayState as l, readSessionMembersInWorker as n, createSessionGoal as o, runSessionRegistryMaintenanceForStore as r, formatSessionGoalStatus as s, listSessionSuggestions as t, updateSessionGoalObjective as u };
