import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { f as openClawStateDatabaseCache, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as tryResolveAmbientOwnerAgentId, T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import fs from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-recovery-files.ts
/** Offline SQLite recovery preserves journals before moving the main pathname. */
function moveSqliteFilesAside(sqlitePath, assertCurrent) {
	const recoveryFiles = inspectSqliteRecoveryFiles(sqlitePath);
	const moves = planSqliteRecoveryMoves(recoveryFiles.existing);
	const completed = [];
	try {
		for (const move of moves.toSorted((left, right) => {
			if (left.sourcePath === sqlitePath) return 1;
			if (right.sourcePath === sqlitePath) return -1;
			return left.sourcePath.localeCompare(right.sourcePath);
		})) {
			assertCurrent();
			fs.renameSync(move.sourcePath, move.destinationPath);
			completed.push(move);
		}
	} catch (error) {
		const rollbackErrors = [];
		const preservedPaths = [];
		for (const move of completed.toReversed()) try {
			assertCurrent();
			if (fs.lstatSync(move.sourcePath, { throwIfNoEntry: false })) throw new Error(`rollback source was recreated: ${move.sourcePath}`, { cause: error });
			fs.renameSync(move.destinationPath, move.sourcePath);
		} catch (rollbackError) {
			rollbackErrors.push(rollbackError);
			preservedPaths.push(move.destinationPath);
		}
		if (rollbackErrors.length > 0) {
			const rollbackDetails = rollbackErrors.map((rollbackError) => String(rollbackError)).join("; ");
			throw new Error(`Could not move corrupt SQLite file set aside or restore it: ${sqlitePath}; rollback failures: ${rollbackDetails}. Preserved recovery files: ${preservedPaths.join(", ")}`, { cause: error });
		}
		throw error;
	}
	return {
		movedFiles: moves.map((move) => move.destinationPath),
		skippedFiles: recoveryFiles.missing
	};
}
function inspectSqliteRecoveryFiles(sqlitePath) {
	const existing = [];
	const missing = [];
	for (const candidate of resolveSqliteDatabaseFilePaths(sqlitePath)) {
		const stat = fs.lstatSync(candidate, { throwIfNoEntry: false });
		if (!stat) missing.push(candidate);
		else if (!stat.isFile()) throw new Error(`SQLite recovery path is not a regular file: ${candidate}`);
		else existing.push(candidate);
	}
	return {
		existing,
		missing
	};
}
function planSqliteRecoveryMoves(sourcePaths) {
	const timestampSuffix = `.corrupt-${Date.now()}`;
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const suffix = attempt === 0 ? timestampSuffix : `${timestampSuffix}.${attempt}`;
		const moves = sourcePaths.map((sourcePath) => ({
			destinationPath: `${sourcePath}${suffix}`,
			sourcePath
		}));
		if (moves.every((move) => !fs.lstatSync(move.destinationPath, { throwIfNoEntry: false }))) return moves;
	}
	throw new Error(`Could not choose recovery paths for ${sourcePaths[0] ?? "SQLite files"}`);
}
//#endregion
//#region src/infra/state-migrations.agent-owner-guidance.ts
function formatAgentDatabaseOwnershipRepairHint(pathname) {
	const moves = planSqliteRecoveryMoves(resolveSqliteDatabaseFilePaths(pathname).filter((file) => fs.lstatSync(file, { throwIfNoEntry: false })));
	moves.sort((a, b) => Number(a.sourcePath === pathname) - Number(b.sourcePath === pathname));
	const action = moves.map(({ sourcePath, destinationPath }) => process.platform === "win32" ? `Move-Item -LiteralPath ${quotePowerShellArg(sourcePath)} -Destination ${quotePowerShellArg(destinationPath)} -ErrorAction Stop` : `mv -n -- ${quoteCliArg(sourcePath)} ${quoteCliArg(destinationPath)}`).join(process.platform === "win32" ? "; " : " && ");
	return `Preserve and inspect this database before accepting a fresh agent. With all OpenClaw processes stopped, the explicit quarantine move is${process.platform === "win32" ? " (PowerShell)" : ""}:\n${action}\nThen run openclaw doctor --fix and restart the Gateway.`;
}
//#endregion
//#region src/system-agent/agent-id.ts
const SYSTEM_AGENT_ID = "openclaw";
const SYSTEM_AGENT_ROSTER_ENTRIES = [{
	id: SYSTEM_AGENT_ID,
	kind: "system"
}, {
	id: "crestodian",
	kind: "system"
}];
const RESERVED_SYSTEM_AGENT_IDS = new Set(SYSTEM_AGENT_ROSTER_ENTRIES.map((entry) => normalizeAgentId(entry.id)));
function isReservedSystemAgentId(agentId) {
	return RESERVED_SYSTEM_AGENT_IDS.has(normalizeAgentId(agentId));
}
//#endregion
//#region src/state/agent-database-admission.ts
function createAgentDatabaseAdmissionErrorShape(refusal) {
	const retryable = refusal.code === "agent-database-inspection-pending";
	return {
		code: "UNAVAILABLE",
		message: `${refusal.reason}\n${refusal.repairHint}`,
		details: refusal,
		retryable,
		...retryable ? { retryAfterMs: 250 } : {}
	};
}
const refusalCauses = /* @__PURE__ */ new WeakMap();
const refusalsByState = /* @__PURE__ */ new Map();
const preparation = new AsyncLocalStorage();
function createAgentDatabaseInspectionRefusal(params) {
	const candidateSnapshotCapacity = resolveUpdateRehearsalRoot(process.env) && params.reason.includes("creating its private snapshot:") && /(?:code=(?:ENOSPC|EDQUOT)\b|errcode=13\b)/u.test(params.reason);
	const refusal = {
		agentId: params.agentId,
		paths: params.paths,
		code: params.pending ? "agent-database-inspection-pending" : "agent-database-inspection-failed",
		reason: params.reason,
		repairHint: candidateSnapshotCapacity ? "Free space in the reported snapshot cache, then retry the update. This candidate snapshot failure does not require repairing the serving database." : params.pending ? "Sessions remain unavailable until background inspection and preparation finish. If they cannot complete, stop the Gateway, run \"openclaw doctor --fix\", and restart." : "Sessions remain unavailable. Stop the Gateway, run \"openclaw doctor --fix\" to inspect and repair this agent database, and restart."
	};
	refusalCauses.set(refusal, params.cause);
	return refusal;
}
function stateKey(options) {
	return resolveOpenClawStateSqlitePath(options.env ?? process.env);
}
function sameKnownState(left, right) {
	if (left === right) return true;
	const leftIdentity = openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(left);
	const rightIdentity = openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(right);
	return Boolean(leftIdentity && rightIdentity && leftIdentity.key === rightIdentity.key);
}
/** Capture existing pending decisions; a later commit must never revoke their successors. */
function captureAgentDatabasePreparationDeletion(agentId, database) {
	const id = normalizeAgentId(agentId);
	const identityKey = requireOpenClawStateDatabaseIdentity(database).key;
	const databasePath = database.path;
	const captured = [...refusalsByState].flatMap(([key, owner]) => {
		const known = openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(key);
		const refusal = owner.refusals.get(id);
		return (key === databasePath || known?.key === identityKey) && refusal?.code === "agent-database-inspection-pending" ? [{
			key,
			owner,
			refusal
		}] : [];
	});
	return () => {
		if (openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(databasePath)?.key !== identityKey) return;
		for (const { key, owner, refusal } of captured) {
			if (refusalsByState.get(key) !== owner || owner.refusals.get(id) !== refusal || !sameKnownState(key, databasePath)) continue;
			const refusals = new Map(owner.refusals);
			refusals.set(id, createAgentDatabaseInspectionRefusal({
				...refusal,
				reason: `Agent ${id} was deleted during startup inspection`
			}));
			owner.refusals = refusals;
		}
	};
}
/** Capture only the live preparation whose native command must report fresh journal facts. */
function captureAgentDatabasePreparationJournal(agentId, options = {}) {
	const scope = preparation.getStore();
	if (!scope || scope.refusal.agentId !== normalizeAgentId(agentId) || !sameKnownState(scope.key, stateKey(options))) return;
	const assertCurrent = () => {
		if (!scope.active) throw new Error(`Agent database preparation has ended: ${agentId}`);
		scope.assertCurrent();
	};
	assertCurrent();
	return (present) => {
		assertCurrent();
		if (present !== false) throw new Error(`Agent ${scope.refusal.agentId} was deleted during startup inspection`);
	};
}
/** Ownership is derived from the inspected file; missing or corrupt metadata keeps normal refusal. */
function inspectAgentDatabaseAdmission(params) {
	const agentId = normalizeAgentId(params.agentId);
	const owner = params.metadata;
	if (owner?.role !== "agent" || !owner.agentId || owner.agentId === agentId) return;
	return {
		agentId,
		paths: [params.path],
		embeddedOwnerId: owner.agentId,
		code: "agent-database-ownership-mismatch",
		reason: `Refused agent ${agentId}: database ${params.path} belongs to agent ${owner.agentId}; requested agent ${agentId}.`,
		repairHint: formatAgentDatabaseOwnershipRepairHint(params.path)
	};
}
function canIsolateAgentDatabase(config, agentId) {
	return listAgentIds(config).includes(agentId) && !isReservedSystemAgentId(agentId) && agentId !== tryResolveAmbientOwnerAgentId(config) && agentId !== tryResolveLegacyCompatibilityAgentId(config);
}
/** Only a new admission pass replaces this boot's decisions; file edits never clear a live refusal. */
function recordAgentDatabaseAdmissions(refusals, options = {}) {
	const key = stateKey(options);
	const source = options.source ?? "diagnostic";
	if (source === "diagnostic" && refusalsByState.get(key)?.source === "startup") return;
	const byAgent = /* @__PURE__ */ new Map();
	for (const refusal of refusals) {
		const previous = byAgent.get(refusal.agentId);
		if (previous === refusal) continue;
		const merged = previous ? {
			...previous,
			paths: [.../* @__PURE__ */ new Set([...previous.paths, ...refusal.paths])],
			reason: `${previous.reason}\n${refusal.reason}`,
			repairHint: `${previous.repairHint}\n${refusal.repairHint}`
		} : refusal;
		if (previous) refusalCauses.set(merged, new AggregateError([new AgentDatabaseAdmissionError(previous), new AgentDatabaseAdmissionError(refusal)]));
		byAgent.set(refusal.agentId, merged);
	}
	refusalsByState.set(key, {
		source,
		refusals: byAgent
	});
}
function hasAgentDatabaseAdmissions(options = {}) {
	return refusalsByState.has(stateKey(options));
}
function readAgentDatabaseAdmissionRefusal(agentId, options = {}) {
	return readSelectedAgentDatabaseAdmissionRefusal(stateKey(options), normalizeAgentId(agentId), agentId);
}
function readSelectedAgentDatabaseAdmissionRefusal(key, agentId, requestedAgentId) {
	const refusal = refusalsByState.get(key)?.refusals.get(agentId);
	const scope = preparation.getStore();
	if (scope && scope.key === key && scope.refusal.agentId === agentId) {
		if (!scope.active) throw new Error(`Agent database preparation has ended: ${requestedAgentId}`);
		scope.assertCurrent();
		if (scope.refusal === refusal) return;
	}
	return refusal;
}
/** Preparation borrows only its own pending admission; public callers remain refused. */
async function preparePendingAgentDatabase(refusal, options, run) {
	const key = stateKey(options);
	const assertCurrent = () => {
		options.assertCurrent();
		if (refusal.code !== "agent-database-inspection-pending" || refusalsByState.get(key)?.refusals.get(refusal.agentId) !== refusal) throw new Error(`Agent database admission changed during preparation: ${refusal.agentId}`);
	};
	assertCurrent();
	const scope = {
		key,
		refusal,
		assertCurrent,
		active: true
	};
	try {
		await preparation.run(scope, run);
		scope.assertCurrent();
		const current = refusalsByState.get(key);
		const refusals = new Map(current.refusals);
		refusals.delete(refusal.agentId);
		current.refusals = refusals;
	} finally {
		scope.active = false;
	}
	sessionChanges.emit({
		all: true,
		scope: {
			agentId: refusal.agentId,
			topology: true
		}
	});
}
/** Runtime preparation adds its config-generation guard to the same admission borrow. */
async function withAgentDatabasePreparationGuard(assertCurrent, run) {
	const parent = preparation.getStore();
	if (!parent?.active) throw new Error("No pending agent database preparation owns this operation");
	const original = parent.assertCurrent;
	parent.assertCurrent = () => {
		original();
		assertCurrent();
	};
	const scope = {
		...parent,
		assertCurrent: () => {
			if (!parent.active) throw new Error("Agent database preparation has ended");
			parent.assertCurrent();
		}
	};
	try {
		scope.assertCurrent();
		return await preparation.run(scope, run);
	} finally {
		scope.active = false;
	}
}
function failPendingAgentDatabase(refusal, cause, options) {
	const key = stateKey(options);
	const current = refusalsByState.get(key);
	if (current?.refusals.get(refusal.agentId) !== refusal) return;
	const refusals = new Map(current.refusals);
	refusals.set(refusal.agentId, createAgentDatabaseInspectionRefusal({
		...refusal,
		reason: formatErrorMessage(cause),
		cause
	}));
	current.refusals = refusals;
}
function listAgentDatabaseAdmissionRefusals(options = {}) {
	return [...refusalsByState.get(stateKey(options))?.refusals.values() ?? []];
}
var AgentDatabaseAdmissionError = class extends Error {
	constructor(refusal) {
		super(`Agent ${refusal.agentId} (${refusal.paths.join(", ")}): ${refusal.reason}\n${refusal.repairHint}`, { cause: refusalCauses.get(refusal) });
		this.refusal = refusal;
		this.name = "AgentDatabaseAdmissionError";
	}
};
/** A proven owner mismatch needs operator action; unavailable inspections prove no mismatch. */
function isAgentDatabaseOwnershipMismatchError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => candidate instanceof AgentDatabaseAdmissionError && candidate.refusal.code === "agent-database-ownership-mismatch");
}
function assertAgentDatabaseAdmitted(agentId, options = {}) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, options);
	if (refusal) throw new AgentDatabaseAdmissionError(refusal);
}
/** Capture only the selector; refusal decisions and the caller's preparation remain live. */
function captureAgentDatabaseAdmission(agentId, options = {}) {
	const key = stateKey(options);
	const normalizedAgentId = normalizeAgentId(agentId);
	return () => {
		const refusal = readSelectedAgentDatabaseAdmissionRefusal(key, normalizedAgentId, agentId);
		if (refusal) throw new AgentDatabaseAdmissionError(refusal);
	};
}
/** Standalone diagnostics derive the same facts without borrowing another process's decision. */
async function evaluateAgentDatabaseAdmissions(config, options = {}) {
	const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-ClnnU5e8.mjs");
	const { resolveConfiguredAgentDatabaseCandidatePaths } = await import("./targets-Be8sKF4o.mjs");
	const env = options.env ?? process.env;
	return (await preflightOpenClawDatabaseSchemas({
		env,
		configuredAgentDatabaseTargets: [],
		configuredAgentDatabaseCandidatePaths: resolveConfiguredAgentDatabaseCandidatePaths(config, { env }),
		agentAdmissionConfig: config
	})).agentRefusals ?? [];
}
//#endregion
export { inspectSqliteRecoveryFiles as C, formatAgentDatabaseOwnershipRepairHint as S, recordAgentDatabaseAdmissions as _, captureAgentDatabasePreparationDeletion as a, SYSTEM_AGENT_ROSTER_ENTRIES as b, createAgentDatabaseInspectionRefusal as c, hasAgentDatabaseAdmissions as d, inspectAgentDatabaseAdmission as f, readAgentDatabaseAdmissionRefusal as g, preparePendingAgentDatabase as h, captureAgentDatabaseAdmission as i, evaluateAgentDatabaseAdmissions as l, listAgentDatabaseAdmissionRefusals as m, assertAgentDatabaseAdmitted as n, captureAgentDatabasePreparationJournal as o, isAgentDatabaseOwnershipMismatchError as p, canIsolateAgentDatabase as r, createAgentDatabaseAdmissionErrorShape as s, AgentDatabaseAdmissionError as t, failPendingAgentDatabase as u, withAgentDatabasePreparationGuard as v, moveSqliteFilesAside as w, isReservedSystemAgentId as x, SYSTEM_AGENT_ID as y };
