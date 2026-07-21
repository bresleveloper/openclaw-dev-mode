import { i as getLogger } from "./logger-DPps3u8A.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { p as resolveAgentIdFromSessionKey, u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import { a as resolveMainSessionKey } from "./main-session-D7Jmp9DO.js";
import { D as collectSessionMaintenancePreserveKeys, E as resolveMaintenanceConfig, F as cloneSessionStoreRecord, G as capEntryCount, H as enforceSessionDiskBudget, J as pruneStaleEntries, Q as shouldRunModelRunPrune, S as loadSessionStore, U as pruneUnreferencedSessionArtifacts, W as resolveSessionArtifactCanonicalPathsForEntry, Y as pruneStaleModelRunEntries, v as updateSessionStore } from "./store-Cvp82S16.js";
import { a as resolveSessionFilePath, c as resolveSessionTranscriptPathInDir, d as resolveStorePath, o as resolveSessionFilePathOptions } from "./paths-C2C4lJH6.js";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.js";
import { f as canonicalizeAbsoluteSessionFilePath, p as rewriteSessionFileForNewSessionId, s as resolveFreshSessionTotalTokens } from "./types-CoDcFuoc.js";
import { A as purgeDeletedAgentSessionEntries, C as patchSessionEntry, i as applySessionEntryLifecycleMutation, y as loadSessionEntry } from "./session-accessor-CwhXEUId.js";
import { i as resolveSessionStoreTargets } from "./targets-ChErRWTQ.js";
import "./delivery-info-C3YKGA0I.js";
import "./combined-store-gateway-CzF585qn.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./lifecycle-BS_t5emX.js";
import "./reset-DE-TpJ-C.js";
import "./session-key-D932f4xQ.js";
import "./transcript-B251TSj6.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/config/sessions/compaction-session-file.ts
function resolveCompactionSessionFile(params) {
	const pathOpts = resolveSessionFilePathOptions({
		agentId: resolveAgentIdFromSessionKey(params.sessionKey),
		storePath: params.storePath
	});
	const rewrittenSessionFile = rewriteSessionFileForNewSessionId({
		sessionFile: params.entry.sessionFile,
		previousSessionId: params.entry.sessionId,
		nextSessionId: params.newSessionId
	});
	const normalizedRewrittenSessionFile = rewrittenSessionFile && path.isAbsolute(rewrittenSessionFile) ? canonicalizeAbsoluteSessionFilePath(rewrittenSessionFile) : rewrittenSessionFile;
	return resolveSessionFilePath(params.newSessionId, normalizedRewrittenSessionFile ? { sessionFile: normalizedRewrittenSessionFile } : void 0, pathOpts);
}
//#endregion
//#region src/config/sessions/goals.ts
const MODEL_UPDATABLE_SESSION_GOAL_STATUSES = ["complete", "blocked"];
const TERMINAL_GOAL_STATUSES = /* @__PURE__ */ new Set(["complete"]);
function nowMs(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}
function normalizeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
function resolveEntryFreshTotalTokens(entry) {
	return normalizeTokenCount(resolveFreshSessionTotalTokens(entry));
}
function resolveEntryGoalStartTokens(entry) {
	return resolveEntryFreshTotalTokens(entry) ?? 0;
}
function normalizeTokenBudget(value) {
	const normalized = normalizeTokenCount(value);
	return normalized && normalized > 0 ? normalized : void 0;
}
function cloneGoal(goal) {
	return { ...goal };
}
function resolveSessionGoalDisplayState(entry, now, options) {
	return accountGoalUsage(entry, nowMs(now), options);
}
function accountGoalUsage(entry, now, options) {
	const goal = entry.goal;
	if (!goal) return;
	const totalTokens = resolveEntryFreshTotalTokens(entry);
	const hasFreshStart = goal.tokenStartFresh !== false;
	const shouldHoldStaleStart = !hasFreshStart && options?.adoptFreshBaseline === false;
	const shouldAdoptFreshStart = !shouldHoldStaleStart && totalTokens !== void 0 && !hasFreshStart;
	const tokenStart = shouldAdoptFreshStart ? totalTokens : normalizeTokenCount(goal.tokenStart) ?? totalTokens ?? 0;
	const tokensUsed = totalTokens === void 0 || shouldAdoptFreshStart || shouldHoldStaleStart ? goal.tokensUsed : Math.max(goal.tokensUsed, Math.max(0, totalTokens - tokenStart));
	const next = {
		...goal,
		tokenStart,
		tokenStartFresh: hasFreshStart || shouldAdoptFreshStart,
		tokensUsed
	};
	if (next.status === "active" && next.tokenBudget !== void 0 && tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
		next.updatedAt = now;
	}
	return next;
}
function goalsEqual(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function formatSessionGoalStatus(goal) {
	if (!goal) return "No goal for this session.\nStart one with /goal start <objective>.";
	const budget = goal.tokenBudget === void 0 ? "" : `\nToken budget: ${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
	const note = goal.lastStatusNote ? `\nNote: ${goal.lastStatusNote}` : "";
	const commands = resolveGoalCommandHint(goal.status);
	return [
		"Goal",
		`Status: ${goal.status}`,
		`Objective: ${goal.objective}`,
		`Tokens used: ${formatTokenCount(goal.tokensUsed)}`,
		...budget ? [budget.slice(1)] : [],
		...note ? [note.slice(1)] : [],
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
		const entry = loadSessionEntry({
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
	if (!await patchSessionEntry({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		const accounted = accountGoalUsage(entry, now);
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
	if (!await patchSessionEntry({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		if (entry.goal) throw new Error("goal already exists");
		const tokenBudget = normalizeTokenBudget(options.tokenBudget);
		const tokenStartFresh = resolveEntryFreshTotalTokens(entry) !== void 0;
		created = {
			schemaVersion: 1,
			id: crypto.randomUUID(),
			objective,
			status: "active",
			createdAt: now,
			updatedAt: now,
			tokenStart: resolveEntryGoalStartTokens(entry),
			tokenStartFresh,
			tokensUsed: 0,
			...tokenBudget ? { tokenBudget } : {},
			continuationTurns: 0
		};
		return { goal: created };
	}, { fallbackEntry: options.fallbackEntry }) || !created) throw new Error("session not found");
	return cloneGoal(created);
}
async function updateSessionGoalStatus(options) {
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	if (!await patchSessionEntry({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		const accounted = accountGoalUsage(entry, now);
		if (!accounted) throw new Error("goal not found");
		if (TERMINAL_GOAL_STATUSES.has(accounted.status) && accounted.status !== options.status) throw new Error(`goal is already ${accounted.status}`);
		const resetsBudgetWindow = options.status === "active" && (accounted.status === "budget_limited" || accounted.status === "usage_limited" || accounted.tokenBudget !== void 0 && accounted.tokensUsed >= accounted.tokenBudget);
		const freshTokenStart = resetsBudgetWindow ? resolveEntryFreshTotalTokens(entry) : void 0;
		const next = {
			...accounted,
			status: options.status,
			updatedAt: now,
			...options.note ? { lastStatusNote: options.note } : {},
			...options.status === "paused" ? { pausedAt: now } : {},
			...options.status === "blocked" ? { blockedAt: now } : {},
			...options.status === "complete" ? { completedAt: now } : {}
		};
		if (resetsBudgetWindow) {
			next.tokenStart = freshTokenStart ?? 0;
			next.tokenStartFresh = freshTokenStart !== void 0;
			next.tokensUsed = 0;
			delete next.budgetLimitedAt;
			delete next.usageLimitedAt;
		}
		if (next.status === "active" && next.tokenBudget !== void 0 && next.tokensUsed >= next.tokenBudget) {
			next.status = "budget_limited";
			next.budgetLimitedAt = now;
		}
		updated = next;
		return { goal: updated };
	}) || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	return cloneGoal(updated);
}
async function updateSessionGoalObjective(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	if (!await patchSessionEntry({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		const accounted = accountGoalUsage(entry, now);
		if (!accounted) throw new Error("goal not found");
		if (TERMINAL_GOAL_STATUSES.has(accounted.status)) throw new Error(`goal is already ${accounted.status}`);
		updated = {
			...accounted,
			objective,
			updatedAt: now
		};
		return { goal: updated };
	}) || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	return cloneGoal(updated);
}
async function clearSessionGoal(options) {
	let removed = false;
	const result = await patchSessionEntry({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		if (!entry.goal) return null;
		removed = true;
		return { goal: void 0 };
	});
	return Boolean(result && removed);
}
//#endregion
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveMainSessionKey(getRuntimeConfig());
}
//#endregion
//#region src/config/sessions/session-registry-maintenance.ts
function parseCronRunSessionJobId(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return;
	return /^cron:([^:]+):run:[^:]+$/u.exec(parsed.rest)?.[1];
}
function buildSessionRegistryPreserveKeys(params) {
	const preserveKeys = /* @__PURE__ */ new Set();
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
		store: params.store
	});
	const pruned = pruneStaleEntries(params.store, params.retentionMs, {
		log: false,
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
	if (!fs.existsSync(params.storePath)) return {
		afterCount: 0,
		beforeCount: 0,
		preservedRunning: 0,
		pruned: 0
	};
	const beforeStore = loadSessionStore(params.storePath, { skipCache: true });
	const beforeCount = Object.keys(beforeStore).length;
	if (!params.apply) {
		const previewStore = structuredClone(beforeStore);
		return {
			beforeCount,
			...pruneSessionRegistryStore({
				retentionMs: params.retentionMs,
				runningCronJobIds: params.runningCronJobIds,
				store: previewStore
			})
		};
	}
	return {
		beforeCount,
		...await updateSessionStore(params.storePath, (store) => pruneSessionRegistryStore({
			retentionMs: params.retentionMs,
			runningCronJobIds: params.runningCronJobIds,
			store
		}), { skipMaintenance: true })
	};
}
//#endregion
//#region src/config/sessions/cleanup-service.ts
const EMPTY_TRANSCRIPT_MAX_BYTES = 4096;
function isTranscriptMessageRole(role) {
	return role === "user" || role === "assistant" || role === "tool" || role === "toolResult" || role === "system";
}
function isTranscriptMessageRecord(entry) {
	if (!entry || typeof entry !== "object") return false;
	const record = entry;
	if (record.type === "message") return true;
	if (record.type === void 0 && record.message && typeof record.message === "object" && isTranscriptMessageRole(record.message.role)) return true;
	return record.type === void 0 && isTranscriptMessageRole(record.role);
}
function transcriptHasNoMessageRecords(transcriptPath) {
	let stat;
	try {
		stat = fs.statSync(transcriptPath);
	} catch {
		return false;
	}
	if (!stat.isFile() || stat.size > EMPTY_TRANSCRIPT_MAX_BYTES) return false;
	let raw;
	try {
		raw = fs.readFileSync(transcriptPath, "utf-8");
	} catch {
		return false;
	}
	const lines = raw.split(/\r?\n/u).filter((line) => line.trim().length > 0);
	if (lines.length === 0) return true;
	for (const line of lines) {
		let entry;
		try {
			entry = JSON.parse(line);
		} catch {
			return false;
		}
		if (isTranscriptMessageRecord(entry)) return false;
	}
	return true;
}
function transcriptExistsWithMessages(transcriptPath) {
	return fs.existsSync(transcriptPath) && !transcriptHasNoMessageRecords(transcriptPath);
}
function isStaleGeneratedBaseTranscript(params) {
	const generatedSessionId = extractGeneratedTranscriptSessionId(params.sessionFile);
	if (!generatedSessionId || generatedSessionId === params.sessionId) return false;
	return path.basename(params.sessionFile?.trim() ?? "") === `${generatedSessionId}.jsonl`;
}
/** Resolves the action label for one session key from cleanup key sets. */
function resolveSessionCleanupAction(params) {
	if (params.dmScopeRetiredKeys.has(params.key)) return "retire-dm-scope";
	if (params.missingKeys.has(params.key)) return "prune-missing";
	if (params.modelRunPrunedKeys.has(params.key)) return "prune-model-run";
	if (params.staleKeys.has(params.key)) return "prune-stale";
	if (params.cappedKeys.has(params.key)) return "cap-overflow";
	if (params.budgetEvictedKeys.has(params.key)) return "evict-budget";
	if (params.repairedKeys.has(params.key)) return "repair-session-file";
	return "keep";
}
function isMainScopeStaleDirectSessionKey(params) {
	if ((params.cfg.session?.dmScope ?? "main") !== "main") return false;
	if (params.activeKey && params.key === params.activeKey) return false;
	const parsed = parseAgentSessionKey(params.key);
	if (!parsed || normalizeAgentId(parsed.agentId) !== normalizeAgentId(params.targetAgentId)) return false;
	const parts = parsed.rest.split(":");
	if (parts[0] === "agent") return false;
	return parts.length === 2 && parts[0] === "direct" && Boolean(parts[1]) || parts.length === 3 && Boolean(parts[0]) && parts[1] === "direct" && Boolean(parts[2]) || parts.length === 4 && Boolean(parts[0]) && Boolean(parts[1]) && parts[2] === "direct" && Boolean(parts[3]);
}
function retireMainScopeDirectSessionEntries(params) {
	let retired = 0;
	for (const [key, entry] of Object.entries(params.store)) if (isMainScopeStaleDirectSessionKey({
		cfg: params.cfg,
		targetAgentId: params.targetAgentId,
		key,
		activeKey: params.activeKey
	})) {
		params.onRetired?.(key, entry);
		delete params.store[key];
		retired += 1;
	}
	return retired;
}
function serializeSessionCleanupResult(params) {
	if (params.summaries.length === 1) return params.summaries[0] ?? {};
	return {
		allAgents: true,
		mode: params.mode,
		dryRun: params.dryRun,
		stores: params.summaries
	};
}
function pruneMissingTranscriptEntries(params) {
	const sessionPathOpts = resolveSessionFilePathOptions({ storePath: params.storePath });
	const sessionsDir = path.dirname(params.storePath);
	let removed = 0;
	let repaired = 0;
	for (const [key, entry] of Object.entries(params.store)) {
		if (!entry?.sessionId) {
			if (parseAgentSessionKey(key)) continue;
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry);
			continue;
		}
		let canonicalTranscriptPath;
		try {
			canonicalTranscriptPath = resolveSessionTranscriptPathInDir(entry.sessionId, sessionsDir);
		} catch {}
		let transcriptPath;
		try {
			transcriptPath = resolveSessionFilePath(entry.sessionId, entry, sessionPathOpts);
		} catch {}
		if (isStaleGeneratedBaseTranscript({
			sessionId: entry.sessionId,
			sessionFile: entry.sessionFile
		}) && canonicalTranscriptPath && canonicalTranscriptPath !== transcriptPath && transcriptExistsWithMessages(canonicalTranscriptPath)) {
			const previousSessionFile = entry.sessionFile;
			entry.sessionFile = canonicalTranscriptPath;
			repaired += 1;
			params.onRepaired?.(key, entry, canonicalTranscriptPath, previousSessionFile);
			continue;
		}
		if (transcriptPath && transcriptExistsWithMessages(transcriptPath)) continue;
		if (!transcriptPath || !fs.existsSync(transcriptPath) || transcriptHasNoMessageRecords(transcriptPath)) {
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry);
		}
	}
	return {
		removed,
		repaired
	};
}
function addEntryArtifactPathsToSet(params) {
	const sessionsDir = path.dirname(params.storePath);
	for (const key of params.keys) {
		const entry = params.store[key];
		if (!entry) continue;
		for (const artifactPath of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir,
			entry
		})) params.paths.add(artifactPath);
	}
}
async function previewStoreCleanup(params) {
	const beforeStore = loadSessionStore(params.target.storePath, { skipCache: true });
	const previewStore = cloneSessionStoreRecord(beforeStore);
	const staleKeys = /* @__PURE__ */ new Set();
	const cappedKeys = /* @__PURE__ */ new Set();
	const missingKeys = /* @__PURE__ */ new Set();
	const repairedKeys = /* @__PURE__ */ new Set();
	const modelRunPrunedKeys = /* @__PURE__ */ new Set();
	const dmScopeRetiredKeys = /* @__PURE__ */ new Set();
	const missing = (params.fixMissing === true ? pruneMissingTranscriptEntries({
		store: previewStore,
		storePath: params.target.storePath,
		onPruned: (key) => {
			missingKeys.add(key);
		},
		onRepaired: (key) => {
			repairedKeys.add(key);
		}
	}) : {
		removed: 0,
		repaired: 0
	}).removed;
	const dmScopeRetired = params.fixDmScope === true ? retireMainScopeDirectSessionEntries({
		cfg: params.cfg,
		store: previewStore,
		targetAgentId: params.target.agentId,
		activeKey: params.activeKey,
		onRetired: (key) => {
			dmScopeRetiredKeys.add(key);
		}
	}) : 0;
	const preserveSessionKeys = collectSessionMaintenancePreserveKeys([params.activeKey]);
	const modelRunPruned = shouldRunModelRunPrune({
		maintenance: params.maintenance,
		entryCount: Object.keys(previewStore).length,
		force: true
	}) ? pruneStaleModelRunEntries(previewStore, params.maintenance.modelRunPruneAfterMs, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onPruned: ({ key }) => {
			modelRunPrunedKeys.add(key);
		}
	}) : 0;
	const pruned = pruneStaleEntries(previewStore, params.maintenance.pruneAfterMs, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onPruned: ({ key }) => {
			staleKeys.add(key);
		}
	});
	const capped = capEntryCount(previewStore, params.maintenance.maxEntries, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onCapped: ({ key }) => {
			cappedKeys.add(key);
		}
	});
	const entryCleanupArtifactPaths = /* @__PURE__ */ new Set();
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: modelRunPrunedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: staleKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: cappedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: dmScopeRetiredKeys
	});
	const beforeBudgetStore = cloneSessionStoreRecord(previewStore);
	const budgetRemovedFilePaths = /* @__PURE__ */ new Set();
	const diskBudget = await enforceSessionDiskBudget({
		store: previewStore,
		storePath: params.target.storePath,
		activeSessionKey: params.activeKey,
		preserveKeys: preserveSessionKeys,
		maintenance: params.maintenance,
		warnOnly: false,
		dryRun: true,
		onRemoveFile: (canonicalPath) => {
			budgetRemovedFilePaths.add(canonicalPath);
		}
	});
	const unreferencedArtifacts = await pruneUnreferencedSessionArtifacts({
		store: previewStore,
		storePath: params.target.storePath,
		olderThanMs: params.maintenance.pruneAfterMs,
		dryRun: true,
		excludeCanonicalPaths: /* @__PURE__ */ new Set([...budgetRemovedFilePaths, ...entryCleanupArtifactPaths])
	});
	const budgetEvictedKeys = /* @__PURE__ */ new Set();
	for (const key of Object.keys(beforeBudgetStore)) if (!Object.hasOwn(previewStore, key)) budgetEvictedKeys.add(key);
	for (const removedKey of [
		...missingKeys,
		...modelRunPrunedKeys,
		...staleKeys,
		...cappedKeys,
		...budgetEvictedKeys,
		...dmScopeRetiredKeys
	]) repairedKeys.delete(removedKey);
	const repaired = repairedKeys.size;
	const beforeCount = Object.keys(beforeStore).length;
	const afterPreviewCount = Object.keys(previewStore).length;
	const wouldMutate = missing > 0 || repaired > 0 || dmScopeRetired > 0 || modelRunPruned > 0 || pruned > 0 || capped > 0 || unreferencedArtifacts.removedFiles > 0 || (diskBudget?.removedEntries ?? 0) > 0 || (diskBudget?.removedFiles ?? 0) > 0;
	return {
		summary: {
			agentId: params.target.agentId,
			storePath: params.target.storePath,
			mode: params.mode,
			dryRun: params.dryRun,
			beforeCount,
			afterCount: afterPreviewCount,
			repaired,
			missing,
			dmScopeRetired,
			modelRunPruned,
			pruned,
			capped,
			unreferencedArtifacts,
			diskBudget,
			wouldMutate
		},
		beforeStore,
		repairedKeys,
		missingKeys,
		modelRunPrunedKeys,
		staleKeys,
		cappedKeys,
		budgetEvictedKeys,
		dmScopeRetiredKeys
	};
}
/** Runs session cleanup preview/apply for the selected store targets. */
async function runSessionsCleanup(params) {
	const { cfg, opts } = params;
	const maintenance = resolveMaintenanceConfig();
	const mode = opts.enforce ? "enforce" : maintenance.mode;
	const targets = params.targets ?? resolveSessionStoreTargets(cfg, {
		store: opts.store,
		agent: opts.agent,
		allAgents: opts.allAgents
	});
	const previewResults = [];
	for (const target of targets) {
		const result = await previewStoreCleanup({
			cfg,
			target,
			maintenance,
			mode,
			dryRun: Boolean(opts.dryRun),
			activeKey: opts.activeKey,
			fixMissing: Boolean(opts.fixMissing),
			fixDmScope: Boolean(opts.fixDmScope)
		});
		previewResults.push(result);
	}
	const appliedSummaries = [];
	if (!opts.dryRun) for (const target of targets) {
		const applyStore = loadSessionStore(target.storePath, { skipCache: true });
		const missingRemovals = [];
		const missingRepairPlans = [];
		const missingRepairs = [];
		const dmScopeRetiredRemovals = [];
		if (opts.fixMissing) pruneMissingTranscriptEntries({
			store: applyStore,
			storePath: target.storePath,
			onPruned: (sessionKey, entry) => {
				missingRemovals.push({
					sessionKey,
					expectedEntry: cloneSessionStoreRecord({ entry }).entry
				});
			},
			onRepaired: (sessionKey, entry, sessionFile, previousSessionFile) => {
				const expectedSessionId = entry.sessionId;
				missingRepairPlans.push({
					sessionKey,
					sessionFile
				});
				missingRepairs.push({
					sessionKey,
					buildEntry: ({ currentEntry }) => {
						if (!currentEntry || currentEntry.sessionId !== expectedSessionId || currentEntry.sessionFile !== previousSessionFile || !transcriptExistsWithMessages(sessionFile)) return;
						return {
							...currentEntry,
							sessionFile
						};
					}
				});
			}
		});
		if (opts.fixDmScope) retireMainScopeDirectSessionEntries({
			cfg,
			store: applyStore,
			targetAgentId: target.agentId,
			activeKey: opts.activeKey,
			onRetired: (sessionKey, entry) => {
				dmScopeRetiredRemovals.push({
					sessionKey,
					expectedEntry: cloneSessionStoreRecord({ entry }).entry,
					archiveRemovedTranscript: true
				});
			}
		});
		const removals = [...missingRemovals, ...dmScopeRetiredRemovals];
		const lifecycleResult = await applySessionEntryLifecycleMutation({
			storePath: target.storePath,
			removals,
			upserts: missingRepairs,
			activeSessionKey: opts.activeKey,
			maintenanceOverride: { mode },
			restrictArchivedTranscriptsToStoreDir: true,
			pruneUnreferencedArtifacts: mode === "warn" ? void 0 : {
				olderThanMs: maintenance.pruneAfterMs,
				dryRun: false
			}
		});
		const removedSessionKeys = new Set(lifecycleResult.removedSessionKeys);
		const postApplyStore = missingRepairPlans.length > 0 ? loadSessionStore(target.storePath, { skipCache: true }) : {};
		const repairedApplied = missingRepairPlans.filter(({ sessionKey, sessionFile }) => postApplyStore[sessionKey]?.sessionFile === sessionFile).length;
		const missingApplied = missingRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
		const dmScopeRetiredApplied = dmScopeRetiredRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
		const unreferencedArtifacts = mode === "warn" ? {
			scannedFiles: 0,
			removedFiles: 0,
			freedBytes: 0,
			olderThanMs: maintenance.pruneAfterMs
		} : lifecycleResult.unreferencedArtifacts ?? {
			scannedFiles: 0,
			removedFiles: 0,
			freedBytes: 0,
			olderThanMs: maintenance.pruneAfterMs
		};
		const preview = previewResults.find((result) => result.summary.storePath === target.storePath);
		const appliedReport = lifecycleResult.maintenanceReport;
		const summary = appliedReport === null ? {
			...preview?.summary ?? {
				agentId: target.agentId,
				storePath: target.storePath,
				mode,
				dryRun: false,
				beforeCount: 0,
				afterCount: 0,
				repaired: 0,
				missing: 0,
				dmScopeRetired: 0,
				modelRunPruned: 0,
				pruned: 0,
				capped: 0,
				unreferencedArtifacts,
				diskBudget: null,
				wouldMutate: false
			},
			dryRun: false,
			unreferencedArtifacts,
			wouldMutate: (preview?.summary.wouldMutate ?? false) || unreferencedArtifacts.removedFiles > 0,
			repaired: repairedApplied,
			applied: true,
			appliedCount: lifecycleResult.afterCount
		} : {
			agentId: target.agentId,
			storePath: target.storePath,
			mode: appliedReport.mode,
			dryRun: false,
			beforeCount: appliedReport.beforeCount,
			afterCount: appliedReport.afterCount,
			repaired: repairedApplied,
			missing: missingApplied,
			dmScopeRetired: dmScopeRetiredApplied,
			modelRunPruned: appliedReport.modelRunPruned,
			pruned: appliedReport.pruned,
			capped: appliedReport.capped,
			unreferencedArtifacts,
			diskBudget: appliedReport.diskBudget,
			wouldMutate: missingApplied > 0 || repairedApplied > 0 || dmScopeRetiredApplied > 0 || appliedReport.modelRunPruned > 0 || appliedReport.pruned > 0 || appliedReport.capped > 0 || unreferencedArtifacts.removedFiles > 0 || (appliedReport.diskBudget?.removedEntries ?? 0) > 0 || (appliedReport.diskBudget?.removedFiles ?? 0) > 0,
			applied: true,
			appliedCount: lifecycleResult.afterCount
		};
		appliedSummaries.push(summary);
	}
	return {
		mode,
		previewResults,
		appliedSummaries
	};
}
/** Purge session store entries for a deleted agent (#65524). Best-effort. */
async function purgeAgentSessionStoreEntries(cfg, agentId) {
	try {
		const normalizedAgentId = normalizeAgentId(agentId);
		const storeConfig = cfg.session?.store;
		await purgeDeletedAgentSessionEntries({
			cfg,
			agentId: normalizedAgentId,
			storeAgentId: typeof storeConfig === "string" && storeConfig.includes("{agentId}") ? normalizedAgentId : normalizeAgentId(resolveDefaultAgentId(cfg)),
			storePath: resolveStorePath(cfg.session?.store, { agentId: normalizedAgentId })
		});
	} catch (err) {
		getLogger().debug("session store purge skipped during agent delete", err);
	}
}
//#endregion
export { runSessionRegistryMaintenanceForStore as a, clearSessionGoal as c, getSessionGoal as d, resolveSessionGoalDisplayState as f, resolveCompactionSessionFile as h, serializeSessionCleanupResult as i, createSessionGoal as l, updateSessionGoalStatus as m, resolveSessionCleanupAction as n, resolveMainSessionKeyFromConfig as o, updateSessionGoalObjective as p, runSessionsCleanup as r, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as s, purgeAgentSessionStoreEntries as t, formatSessionGoalStatus as u };
