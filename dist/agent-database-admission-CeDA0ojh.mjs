import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as isSqliteLockError, i as isSqliteCorruptionError, l as sqliteErrorCode, r as formatSqliteReadOnlyInspectionFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
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
function formatAgentDatabaseCorruptionRepairHint(agentId, error) {
	if (formatSqliteReadOnlyInspectionFailure(error).includes("creating its private snapshot:")) return;
	if (!collectNestedErrorCandidates(error).some((candidate) => isSqliteCorruptionError(candidate) || ["SQLITE_CORRUPT", "SQLITE_NOTADB"].includes(sqliteErrorCode(candidate) ?? "") || candidate instanceof Error && isTerminalSqliteIntegrityError(candidate))) return;
	return `Stop the Gateway, back up this database and its SQLite sidecars, then run "${formatCliCommand(`openclaw doctor --session-sqlite recover --session-sqlite-agent ${quoteCliArg(agentId)}`)}" against the same state/config. Recovery repairs supported index corruption or preserves damaged files with a .corrupt-<timestamp> suffix. Restore a verified backup if you need the previous sessions, then restart the Gateway.`;
}
function formatAgentDatabaseOwnershipRepairHint(pathname) {
	const moves = planSqliteRecoveryMoves(resolveSqliteDatabaseFilePaths(pathname).filter((file) => fs.lstatSync(file, { throwIfNoEntry: false })));
	moves.sort((a, b) => Number(a.sourcePath === pathname) - Number(b.sourcePath === pathname));
	const action = moves.map(({ sourcePath, destinationPath }) => process.platform === "win32" ? `Move-Item -LiteralPath ${quotePowerShellArg(sourcePath)} -Destination ${quotePowerShellArg(destinationPath)} -ErrorAction Stop` : `mv -n -- ${quoteCliArg(sourcePath)} ${quoteCliArg(destinationPath)}`).join(process.platform === "win32" ? "; " : " && ");
	return `Preserve and inspect this database before accepting a fresh agent. With all OpenClaw processes stopped, the explicit quarantine move is${process.platform === "win32" ? " (PowerShell)" : ""}:\n${action}\nThen run openclaw doctor --fix and restart the Gateway.`;
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
const startupFtsRepairs = /* @__PURE__ */ new Map();
function recordAgentDatabaseStartupFtsRepair(key, statePath, message) {
	if (message === void 0 && startupFtsRepairs.has(key)) throw new Error("Startup FTS repair was already attempted. Run openclaw doctor --fix.");
	startupFtsRepairs.set(key, {
		statePath,
		message
	});
	if (message) createSubsystemLogger("state/agent-db").warn(message);
}
function listAgentDatabaseStartupFtsRepairs() {
	const key = stateKey({});
	return [...startupFtsRepairs.values()].flatMap((entry) => entry.statePath === key && entry.message ? [entry.message] : []);
}
const preparation = new AsyncLocalStorage();
function createAgentDatabaseInspectionRefusal(params) {
	const candidateSnapshotCapacity = resolveUpdateRehearsalRoot(process.env) && params.reason.includes("creating its private snapshot:") && /(?:code=(?:ENOSPC|EDQUOT)\b|errcode=13\b)/u.test(params.reason);
	const locked = !params.pending && isSqliteLockError(params.cause);
	const refusal = {
		agentId: params.agentId,
		paths: params.paths,
		code: params.pending ? "agent-database-inspection-pending" : "agent-database-inspection-failed",
		reason: locked ? "database locked by another process" : params.reason,
		repairHint: locked ? "Close other processes accessing this database, then restart the Gateway to retry admission. Lock contention does not require database repair." : candidateSnapshotCapacity ? "Free space in the reported snapshot cache, then retry the update. This candidate snapshot failure does not require repairing the serving database." : params.pending ? "Sessions remain unavailable until background inspection and preparation finish. If they cannot complete, stop the Gateway, run \"openclaw doctor --fix\", and restart." : `Sessions remain unavailable. ${formatAgentDatabaseCorruptionRepairHint(params.agentId, params.cause) ?? "Stop the Gateway, run \"openclaw doctor --fix\" to inspect and repair this agent database, and restart."}`
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
function captureAgentDatabasePreparationDeletionForIdentity(agentId, { identityKey, databasePath }) {
	const id = normalizeAgentId(agentId);
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
	const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-D3lTU13W.mjs");
	const { resolveConfiguredAgentDatabaseCandidatePaths } = await import("./targets-BHY-ArLd.mjs");
	const env = options.env ?? process.env;
	return (await preflightOpenClawDatabaseSchemas({
		env,
		configuredAgentDatabaseTargets: [],
		configuredAgentDatabaseCandidatePaths: resolveConfiguredAgentDatabaseCandidatePaths(config, { env }),
		agentAdmissionConfig: config
	}, "runtime")).agentRefusals ?? [];
}
//#endregion
export { moveSqliteFilesAside as C, inspectSqliteRecoveryFiles as S, readAgentDatabaseAdmissionRefusal as _, captureAgentDatabasePreparationDeletionForIdentity as a, formatAgentDatabaseCorruptionRepairHint as b, createAgentDatabaseInspectionRefusal as c, hasAgentDatabaseAdmissions as d, inspectAgentDatabaseAdmission as f, preparePendingAgentDatabase as g, listAgentDatabaseStartupFtsRepairs as h, captureAgentDatabaseAdmission as i, evaluateAgentDatabaseAdmissions as l, listAgentDatabaseAdmissionRefusals as m, assertAgentDatabaseAdmitted as n, captureAgentDatabasePreparationJournal as o, isAgentDatabaseOwnershipMismatchError as p, canIsolateAgentDatabase as r, createAgentDatabaseAdmissionErrorShape as s, AgentDatabaseAdmissionError as t, failPendingAgentDatabase as u, recordAgentDatabaseAdmissions as v, formatAgentDatabaseOwnershipRepairHint as x, recordAgentDatabaseStartupFtsRepair as y };
