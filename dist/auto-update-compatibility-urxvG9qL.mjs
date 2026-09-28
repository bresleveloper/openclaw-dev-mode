import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { l as runSqliteReadOnlyWorker, s as resolveSqliteInspectionBudget } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { t as readAgentDatabasePreflightTargets } from "./openclaw-agent-db-registry.read-CZdmnVd_.mjs";
import { n as preflightOpenClawDatabaseSchemas } from "./openclaw-database-preflight-DfCl_gJ5.mjs";
import { t as checkGitCandidateNodeRuntime } from "./update-runner-git-node-preflight-DJrN9_Ns.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/node-host/auto-update-compatibility.ts
const MANUAL_UPDATE_GUIDANCE = "Update OpenClaw manually with openclaw update, then restart the node.";
function assertNodeRuntimeSchemaVersions(schemaVersions) {
	if (schemaVersions?.state !== 18 || schemaVersions.agent !== 23) throw new Error(`Node auto-update deferred: the release changes database schemas. ${MANUAL_UPDATE_GUIDANCE}`);
}
/** Read the candidate's real startup contract without loading its execution graph. */
async function readNodeRuntimeUpdateManifest(packageRoot) {
	const manifest = asNullableRecord(await tryReadJson(path.join(packageRoot, "package.json"), { maxBytes: 1048576 }));
	const version = normalizeNullableString(manifest?.version);
	if (manifest?.name !== "openclaw" || !version) throw new Error("Node auto-update candidate has no valid OpenClaw package manifest.");
	const schemaVersions = parsePackageOpenClawSchemaVersions(manifest);
	assertNodeRuntimeSchemaVersions(schemaVersions);
	for (const relativePath of [
		"openclaw.mjs",
		"node-host-launcher.mjs",
		"dist/node-host-launcher-bootstrap.js"
	]) if (!(await fs.stat(path.join(packageRoot, relativePath))).isFile()) throw new Error(`Node auto-update candidate is missing ${relativePath}.`);
	if (!(await Promise.all(["dist/entry.js", "dist/entry.mjs"].map(async (relativePath) => {
		try {
			return (await fs.stat(path.join(packageRoot, relativePath))).isFile();
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return false;
			throw error;
		}
	}))).some(Boolean)) throw new Error("Node auto-update candidate is missing its built CLI entrypoint.");
	return {
		version,
		schemaVersions
	};
}
/** Recheck after waiting for idle; these observations do not authorize state migration. */
async function assertNodeRuntimeUpdateCompatible(params) {
	params.signal?.throwIfAborted();
	const { schemaVersions } = await readNodeRuntimeUpdateManifest(params.packageRoot);
	const nodeRuntimeFailure = await checkGitCandidateNodeRuntime(params.packageRoot);
	if (nodeRuntimeFailure) throw new Error(nodeRuntimeFailure.stderrTail ?? "Node runtime is incompatible with the update.");
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const current = await preflightOpenClawDatabaseSchemas({
		env,
		signal: params.signal,
		supportedVersions: schemaVersions,
		verifyCurrentSchemaShape: true
	});
	if (current.incompatible.length || current.indeterminate.length || current.pendingMigrations?.length) throw new Error(`Node auto-update deferred: existing databases require migration or repair. ${MANUAL_UPDATE_GUIDANCE}`);
	const statePath = resolveOpenClawStateSqlitePath(env);
	try {
		await fs.stat(statePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const preflightCopy = async (sourcePath, agentId) => {
		const copy = await prepareSqliteReadOnlyLocation(await fs.realpath(sourcePath), {
			preserveSourceArtifacts: true,
			signal: params.signal
		});
		let outcome;
		try {
			const consolidated = await runSqliteReadOnlyWorker(copy.location, {
				mode: "consolidated",
				stagingRoot: path.dirname(copy.location),
				signal: params.signal
			});
			const { timeoutMs } = resolveSqliteInspectionBudget("node update compatibility", sourcePath, (await fs.stat(consolidated)).size);
			const result = await runCommandWithTimeout([
				process.execPath,
				path.join(params.packageRoot, "openclaw.mjs"),
				"database",
				agentId === void 0 ? "preflight" : "preflight-agent",
				consolidated,
				...agentId === void 0 ? [] : ["--agent-id", agentId],
				"--json"
			], {
				timeoutMs,
				signal: params.signal,
				killProcessTree: true,
				env
			});
			let report = null;
			try {
				report = asNullableRecord(JSON.parse(result.stdout));
			} catch {}
			const expectedSchema = agentId === void 0 ? "openclaw.state-schema-preflight.v1" : "openclaw.agent-schema-preflight.v1";
			if (result.code !== 0 || report?.schema !== expectedSchema || report.status !== "exact") {
				const detail = normalizeNullableString(report?.reason) ?? result.stderr.trim();
				throw new Error(`Node auto-update candidate rejected the copied database${detail ? `: ${detail}` : "."} ${MANUAL_UPDATE_GUIDANCE}`);
			}
			if (agentId !== void 0) outcome = { agents: [] };
			else {
				const database = openNodeSqliteDatabase(consolidated, { readOnly: true });
				try {
					outcome = { agents: readAgentDatabasePreflightTargets(database, statePath) };
				} finally {
					database.close();
				}
			}
		} catch (error) {
			outcome = { error };
		}
		try {
			if (!await copy.cleanupAsync()) throw new Error(`Node auto-update database snapshot cleanup failed: ${copy.cleanupRoot ?? copy.location}`);
		} catch (error) {
			throw "error" in outcome ? new AggregateError([outcome.error, error], "Node auto-update compatibility and cleanup failed") : error;
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.agents;
	};
	const agents = await preflightCopy(statePath);
	for (const agent of agents) {
		try {
			await fs.stat(agent.path);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		await preflightCopy(agent.path, agent.agentId);
	}
	params.signal?.throwIfAborted();
}
//#endregion
export { assertNodeRuntimeUpdateCompatible as n, readNodeRuntimeUpdateManifest as r, assertNodeRuntimeSchemaVersions as t };
