import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
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
			if (pathExists(move.sourcePath)) throw new Error(`rollback source was recreated: ${move.sourcePath}`, { cause: error });
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
	for (const candidate of resolveSqliteDatabaseFilePaths(sqlitePath)) try {
		if (!fs.lstatSync(candidate).isFile()) throw new Error(`SQLite recovery path is not a regular file: ${candidate}`);
		existing.push(candidate);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) {
			missing.push(candidate);
			continue;
		}
		throw error;
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
		if (moves.every((move) => !pathExists(move.destinationPath))) return moves;
	}
	throw new Error(`Could not choose recovery paths for ${sourcePaths[0] ?? "SQLite files"}`);
}
function pathExists(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
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
const refusalsByState = /* @__PURE__ */ new Map();
const preparation = new AsyncLocalStorage();
function createAgentDatabaseInspectionRefusal(params) {
	return {
		agentId: params.agentId,
		paths: params.paths,
		code: params.pending ? "agent-database-inspection-pending" : "agent-database-inspection-failed",
		reason: params.reason,
		repairHint: params.pending ? "Sessions remain unavailable until background inspection and preparation finish. If they cannot complete, stop the Gateway, run \"openclaw doctor --fix\", and restart." : "Sessions remain unavailable. Stop the Gateway, run \"openclaw doctor --fix\" to inspect and repair this agent database, and restart."
	};
}
function stateKey(options) {
	return resolveOpenClawStateSqlitePath(options.env ?? process.env);
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
		byAgent.set(refusal.agentId, previous ? {
			...previous,
			paths: [.../* @__PURE__ */ new Set([...previous.paths, ...refusal.paths])],
			reason: `${previous.reason}\n${refusal.reason}`,
			repairHint: `${previous.repairHint}\n${refusal.repairHint}`
		} : refusal);
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
	const key = stateKey(options);
	const refusal = refusalsByState.get(key)?.refusals.get(normalizeAgentId(agentId));
	const scope = preparation.getStore();
	if (scope && scope.key === key && scope.refusal.agentId === normalizeAgentId(agentId)) {
		if (!scope.active) throw new Error(`Agent database preparation has ended: ${agentId}`);
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
		refusalsByState.set(key, {
			...current,
			refusals
		});
	} finally {
		scope.active = false;
	}
	sessionChanges.emit({
		all: true,
		scope: "stores"
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
function failPendingAgentDatabase(refusal, reason, options) {
	const key = stateKey(options);
	const current = refusalsByState.get(key);
	if (current?.refusals.get(refusal.agentId) !== refusal) return;
	const refusals = new Map(current.refusals);
	refusals.set(refusal.agentId, createAgentDatabaseInspectionRefusal({
		...refusal,
		reason
	}));
	refusalsByState.set(key, {
		...current,
		refusals
	});
}
function listAgentDatabaseAdmissionRefusals(options = {}) {
	return [...refusalsByState.get(stateKey(options))?.refusals.values() ?? []];
}
var AgentDatabaseAdmissionError = class extends Error {
	constructor(refusal) {
		super(`${refusal.reason}\n${refusal.repairHint}`);
		this.refusal = refusal;
		this.name = "AgentDatabaseAdmissionError";
	}
};
function assertAgentDatabaseAdmitted(agentId, options = {}) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, options);
	if (refusal) throw new AgentDatabaseAdmissionError(refusal);
}
/** Standalone diagnostics derive the same facts without borrowing another process's decision. */
async function evaluateAgentDatabaseAdmissions(config, options = {}) {
	const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-DwZaE6VW.mjs");
	const { resolveConfiguredAgentDatabaseCandidatePaths } = await import("./targets-D9kWQ1Aj.mjs");
	const env = options.env ?? process.env;
	return (await preflightOpenClawDatabaseSchemas({
		env,
		configuredAgentDatabaseTargets: [],
		configuredAgentDatabaseCandidatePaths: resolveConfiguredAgentDatabaseCandidatePaths(config, { env }),
		agentAdmissionConfig: config
	})).agentRefusals ?? [];
}
//#endregion
export { formatAgentDatabaseOwnershipRepairHint as _, evaluateAgentDatabaseAdmissions as a, inspectAgentDatabaseAdmission as c, readAgentDatabaseAdmissionRefusal as d, recordAgentDatabaseAdmissions as f, isReservedSystemAgentId as g, SYSTEM_AGENT_ROSTER_ENTRIES as h, createAgentDatabaseInspectionRefusal as i, listAgentDatabaseAdmissionRefusals as l, SYSTEM_AGENT_ID as m, assertAgentDatabaseAdmitted as n, failPendingAgentDatabase as o, withAgentDatabasePreparationGuard as p, canIsolateAgentDatabase as r, hasAgentDatabaseAdmissions as s, AgentDatabaseAdmissionError as t, preparePendingAgentDatabase as u, inspectSqliteRecoveryFiles as v, moveSqliteFilesAside as y };
