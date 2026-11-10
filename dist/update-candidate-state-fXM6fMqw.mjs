import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { o as normalizeWindowsPathPreservingCase, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { f as maintenanceOwnerHasSourceCustody, l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { Fn as object, Jn as string, Mn as nullable, Nt as array, Pn as number, Un as record, nr as tuple, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as runtimeProcessEntrypoints, t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { c as removeTempDirectory, d as retainSnapshotWork, h as withPreparedSqliteSnapshot, s as releaseSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as inspectSqliteSchemaHeaderInProcess, o as prepareSqliteReadOnlyLocationInProcess, s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { m as resolvePrivateSqliteSnapshotStagingRoot, n as createSqliteSnapshotStagingDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { a as tableExists, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { a as sealUpdateCandidatePluginCodeLinks, t as UpdateCandidatePluginCodeLinkReceiptSchema } from "./update-candidate-plugin-code-links-BYVVtSuY.mjs";
import { t as tryInspectSqliteReadOnlyInProcess } from "./sqlite-readonly-inspection-CJMJKqt8.mjs";
import { c as resolveUpdateCandidateStateIdentity, i as queueStateDatabaseSpelling, l as resolveUpdateCandidateStatePath, n as UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME, t as StateDatabaseDiscoverySchema } from "./update-candidate-paths-C60j7F-O.mjs";
import { a as createUpdateStateSnapshotReporter, i as createUpdateStateIoReporter, n as createUpdateStateInspectionDiagnostics, t as UPDATE_STATE_INSPECTION_PROGRESS_PREFIX } from "./update-candidate-state.diagnostics-pxNUuLSH.mjs";
import { n as withUpdateCandidateIoBudget } from "./update-candidate-io-BDP-YZR-.mjs";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/state/agent-database-path-discovery.ts
/** Keep directory spellings until the consuming owner validates database identity. */
async function listDefaultAgentDatabasePaths(stateDir) {
	let entries;
	try {
		entries = await fs.readdir(path.join(stateDir, "agents"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => ({
		agentId: entry.name,
		path: path.resolve(stateDir, "agents", entry.name, "agent", "openclaw-agent.sqlite")
	}));
}
//#endregion
//#region src/infra/update-candidate-state.process.ts
/** A bounded command result does not release snapshot ownership before late process cleanup. */
function withUpdateStateInspectionWork(run, signal) {
	let stop = () => {};
	const work = withCommandProcessScope((stopScope) => {
		stop = stopScope;
		return run();
	}, signal);
	return retainSnapshotWork(work, () => stop());
}
async function withStateInspectionCleanup(stagingRoot, inspect) {
	let outcome;
	try {
		outcome = { value: await inspect() };
	} catch (cause) {
		outcome = { cause };
	}
	if ("cause" in outcome && hasCommandProcessCleanupError(outcome.cause)) {
		releaseSnapshotTempDirectory(stagingRoot);
		throw new Error(`${formatErrorMessageWithCode(outcome.cause)}. Staging retained at ${stagingRoot}. Confirm that update workers have stopped before retrying the update.`, { cause: outcome.cause });
	}
	if (!removeTempDirectory(stagingRoot)) throw new Error(`State schema inspection snapshot cleanup failed: ${stagingRoot}`, { cause: "cause" in outcome ? outcome.cause : void 0 });
	if ("cause" in outcome) throw outcome.cause;
	return outcome.value;
}
//#endregion
//#region src/infra/update-candidate-state.inspection.ts
const WORKER_STARTUP_PHASES = /* @__PURE__ */ new Map([
	["versions", "schema inspection startup"],
	["database-generations", "database generation verification"],
	["database-backup", "database backup"],
	["database-restore-preparation", "database restore preparation"]
]);
async function runUpdateStateInspectionWorker(params) {
	const selectedUrl = resolveRuntimeWorkerUrl({
		...params.readOnlySource ? runtimeProcessEntrypoints.sqliteReadOnly : runtimeProcessEntrypoints.updateCandidateState,
		root: params.root
	});
	const source = params.root === void 0 ? captureRuntimeWorkerSource(selectedUrl) : { moduleUrl: selectedUrl };
	const workerUrl = source.moduleUrl;
	const sourceTsconfigPath = /\.[cm]?ts$/.test(fileURLToPath(workerUrl)) ? fileURLToPath(new URL("../../tsconfig.json", workerUrl)) : void 0;
	const inspection = createUpdateStateInspectionDiagnostics({
		operation: "State schema inspection",
		phase: WORKER_STARTUP_PHASES.get(params.input.mode) ?? "shared database discovery",
		paths: params.readOnlySource ? [params.readOnlySource] : params.sources ?? (params.input.mode === "discover" ? [path.resolve(params.input.stateDir, "state", "openclaw.sqlite")] : params.databases.map((database) => database.path)),
		retryAdvice: params.retryAdvice
	});
	try {
		const timeoutMs = Math.max(params.timeoutMs ?? 0, resolveAggregateSqliteInspectionTimeoutMs("state schema inspection", params.databases));
		const run = (signal) => runUtf8CommandWithTimeout([
			params.nodeRunner,
			...resolveRuntimeWorkerArgv(workerUrl, params.nodeRunner),
			...params.readOnlySource ? [
				SQLITE_READONLY_CHILD_ARG,
				"sync",
				params.readOnlySource,
				params.stagingRoot
			] : []
		], {
			cwd: os.tmpdir(),
			input: params.readOnlySource ? void 0 : JSON.stringify({
				...params.input,
				env: {
					HOME: params.sourceEnv.HOME,
					OPENCLAW_HOME: params.sourceEnv.OPENCLAW_HOME,
					USERPROFILE: params.sourceEnv.USERPROFILE,
					OPENCLAW_AGENT_DIR: params.sourceEnv.OPENCLAW_AGENT_DIR,
					PI_CODING_AGENT_DIR: params.sourceEnv.PI_CODING_AGENT_DIR
				}
			}),
			baseEnv: params.sourceEnv,
			env: {
				XDG_CACHE_HOME: params.stagingRoot,
				...sourceTsconfigPath ? { TSX_TSCONFIG_PATH: sourceTsconfigPath } : {}
			},
			killGraceMs: 500,
			killProcessTree: true,
			maxOutputBytes: {
				stdout: 1048576,
				stderr: 2e4
			},
			outputCapture: {
				stdout: "head",
				stderr: "discard"
			},
			terminateOnOutputLimit: { stdout: true },
			onOutputChunk: inspection.onOutputChunk,
			signal,
			...params.ioBudget === "deadline" ? { timeoutMs } : {}
		});
		const work = withUpdateStateInspectionWork(() => params.ioBudget === "deadline" ? run(params.signal) : withUpdateCandidateIoBudget({
			directory: params.stagingRoot,
			bytes: params.databases.reduce((total, database) => total + Number(database.sizeBytes ?? 0), 0),
			timeoutMs,
			signal: params.signal,
			nodeRunner: params.nodeRunner,
			env: params.sourceEnv
		}, run), params.signal);
		source.runtimeGeneration?.retain(work, async () => {
			await work.catch((error) => {
				if (hasCommandProcessCleanupError(error)) throw error;
			});
		});
		return {
			...await work,
			stderr: inspection.stderr(),
			inspection
		};
	} catch (error) {
		if (!hasCommandProcessCleanupError(error)) params.signal?.throwIfAborted();
		throw inspection.failure(error);
	}
}
function parseUpdateStateInspectionWorker(result, schema) {
	if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) {
		const signal = result.signal ? `, signal ${result.signal}` : "";
		throw result.inspection.failure(result.stderr || (result.outputLimitExceeded ? "Worker output exceeded its capture limit" : result.stdout), `${result.termination}${signal}`);
	}
	try {
		return schema.parse(JSON.parse(result.stdout));
	} catch (error) {
		throw result.inspection.failure(error);
	}
}
//#endregion
//#region src/infra/update-candidate-state.sizes.ts
const inventorySource = `
  const fs = require("node:fs");
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    const result = [];
    const progress = path => {
      try {
        fs.writeSync(2, ${JSON.stringify(UPDATE_STATE_INSPECTION_PROGRESS_PREFIX)} + JSON.stringify({ phase: "metadata inventory", path }) + "\\n");
      } catch (error) {
        // Advisory progress must not abort inventory when its nonblocking pipe is full.
        // Drop this write without queueing bytes or delaying the metadata reads.
        if (error.code !== "EAGAIN" && error.code !== "EWOULDBLOCK") throw error;
      }
    };
    for (const file of JSON.parse(input).files) {
      let size;
      progress(file);
      try { size = fs.statSync(file, { bigint: true }).size; }
      catch (error) {
        if (error.code !== "ENOENT") result.push({ path: file });
        continue;
      }
      for (const suffix of ["-wal", "-shm", "-journal"]) {
        progress(file + suffix);
        try { size += fs.statSync(file + suffix, { bigint: true }).size; }
        catch (error) {
          if (error.code !== "ENOENT") { size = undefined; break; }
        }
      }
      result.push({ path: file, sizeBytes: size?.toString() });
    }
    process.stdout.write(JSON.stringify(result));
  });
`;
const inventorySchema = array(object({
	path: string(),
	sizeBytes: string().regex(/^\d+$/).optional()
}));
async function updateStateDatabaseExists(file) {
	try {
		await fs.access(file);
		return true;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
/** Maintenance custody permits metadata reads without an isolated inventory process. */
async function readUpdateStateDatabaseSizesInProcess(files, signal) {
	const result = [];
	for (const file of files) {
		signal?.throwIfAborted();
		let sizeBytes;
		try {
			sizeBytes = (await fs.stat(file, { bigint: true })).size;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) result.push({
				path: file,
				sizeBytes: void 0
			});
			continue;
		}
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += (await fs.stat(file + suffix, { bigint: true })).size;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) {
				sizeBytes = void 0;
				break;
			}
		}
		result.push({
			path: file,
			sizeBytes
		});
	}
	return result;
}
/** Measure SQLite families in a bounded child so metadata cannot block updater cancellation. */
async function readUpdateStateDatabaseSizes(files, options) {
	const budget = resolveAggregateSqliteInspectionTimeoutMs("state schema inventory", files.map((file) => ({
		path: file,
		sizeBytes: void 0
	})));
	const inspection = createUpdateStateInspectionDiagnostics({
		operation: "State schema inventory",
		phase: "metadata inventory",
		paths: files
	});
	let result;
	try {
		result = await withUpdateStateInspectionWork(() => runUtf8CommandWithTimeout([
			options.nodeRunner,
			"--input-type=commonjs",
			"--eval",
			inventorySource
		], {
			cwd: os.tmpdir(),
			input: JSON.stringify({ files }),
			baseEnv: options.sourceEnv,
			env: { XDG_CACHE_HOME: options.stagingRoot },
			signal: options.signal,
			timeoutMs: resolveTimerTimeoutMs(Math.max(options.timeoutMs ?? 0, budget), budget),
			killGraceMs: 500,
			killProcessTree: true,
			maxOutputBytes: {
				stdout: 1048576,
				stderr: 2e4
			},
			outputCapture: {
				stdout: "head",
				stderr: "discard"
			},
			terminateOnOutputLimit: { stdout: true },
			onOutputChunk: inspection.onOutputChunk
		}), options.signal);
	} catch (error) {
		if (!hasCommandProcessCleanupError(error)) options.signal?.throwIfAborted();
		throw inspection.failure(error);
	}
	options.signal?.throwIfAborted();
	if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) throw inspection.failure(inspection.stderr() || (result.outputLimitExceeded ? "Worker output exceeded its capture limit" : ""), result.termination);
	try {
		return inventorySchema.parse(JSON.parse(result.stdout)).map((entry) => ({
			path: entry.path,
			sizeBytes: entry.sizeBytes === void 0 ? void 0 : BigInt(entry.sizeBytes)
		}));
	} catch (error) {
		throw inspection.failure(error);
	}
}
//#endregion
//#region src/infra/update-candidate-state.ts
const UpdateStateSchemaVersionsSchema = array(object({
	path: string(),
	userVersion: number().nullable(),
	contentVersion: number().optional()
}));
const UpdateCandidateStateSnapshotSchema = object({
	versions: UpdateStateSchemaVersionsSchema,
	pluginPaths: record(string(), string()),
	pluginCodeLinks: UpdateCandidatePluginCodeLinkReceiptSchema.optional()
});
/** Older inspection workers report only the published version; agent stores never defer it. */
function resolveUpdateStateContentVersion(entry) {
	return entry.contentVersion ?? entry.userVersion;
}
function updateStateSchemaVersionsMatch(before, after, params) {
	const versions = new Map(after.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
	const candidate = params.candidateSchemaVersions;
	if (!candidate) return before.length === after.length && before.every((entry) => versions.get(entry.path) === resolveUpdateStateContentVersion(entry));
	const baseline = new Map(before.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
	return before.every((entry) => resolveUpdateStateContentVersion(entry) === null || versions.get(entry.path) === resolveUpdateStateContentVersion(entry)) && after.every((entry) => {
		const version = resolveUpdateStateContentVersion(entry);
		if (version === null || baseline.get(entry.path) === version) return true;
		const supported = entry.path === params.sharedPath ? candidate.state : candidate.agent;
		return baseline.get(entry.path) == null && version === supported;
	});
}
const UpdateCandidateStateInventorySchema = array(tuple([string(), StateDatabaseDiscoverySchema])).transform((entries) => new Map(entries));
const UpdateCandidateSnapshotInventorySchema = object({
	databases: UpdateCandidateStateInventorySchema,
	pluginBytes: number().nonnegative(),
	pluginPlan: literal(UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME),
	warnings: array(string()).default([])
});
const UpdateStateSchemaInspectionPlanSchema = object({
	files: array(tuple([string(), StateDatabaseDiscoverySchema])),
	sharedVersion: UpdateStateSchemaVersionsSchema.element
});
function collectRegisteredPaths(db, shared, files) {
	return (tableExists(db, "agent_databases") ? executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("agent_databases").select("path").select((eb) => tableHasColumn(db, "agent_databases", "agent_id") ? eb.ref("agent_id").as("agent_id") : eb.val(null).as("agent_id")).orderBy("path")).rows : []).map(({ path: stored, agent_id: agentId }) => {
		const source = resolveOpenClawRegisteredAgentDatabasePath(shared, stored);
		queueStateDatabaseSpelling(files, resolveOpenClawStateDirForDatabasePath(shared), source, typeof agentId === "string" && agentId.length > 0 ? {
			role: "agent",
			agentId
		} : void 0, stored);
		return {
			stored,
			source
		};
	});
}
async function withStateDatabaseSnapshot(file, read, stagingRoot, onProgress, preserveSourceArtifacts = false) {
	const progress = createUpdateStateSnapshotReporter(file, "shared database snapshot", onProgress);
	const snapshot = preserveSourceArtifacts ? prepareSqliteReadOnlyLocationSyncInProcess(file, stagingRoot) : await prepareSqliteReadOnlyLocationInProcess(file, stagingRoot, void 0, progress.onProgress);
	return withPreparedSqliteSnapshot(snapshot, async (location) => {
		progress.complete((await fs.stat(location)).size);
		return read(location);
	});
}
async function collectStateDatabasePaths(input, options = {}) {
	const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
	const stateRoot = path.resolve(input.stateDir);
	const files = /* @__PURE__ */ new Map();
	const queue = (file, owner) => {
		queueStateDatabaseSpelling(files, stateRoot, file, owner);
	};
	queue(shared, { role: "global" });
	const directories = options.includeUnconfiguredAgents !== false ? (await listDefaultAgentDatabasePaths(input.stateDir)).map((entry) => entry.agentId) : [];
	const configured = Object.entries(input.config.agents?.entries ?? {});
	for (const directory of [input.env?.OPENCLAW_AGENT_DIR, input.env?.PI_CODING_AGENT_DIR]) if (directory?.trim()) queue(path.join(resolveUserPath(directory, input.env), "openclaw-agent.sqlite"));
	const projected = (input.config.agents?.list ?? []).map((agent) => [agent.id, agent]);
	for (const [id, agent] of [...configured, ...projected]) {
		directories.push(id);
		if (agent.agentDir) queue(path.join(resolveUserPath(agent.agentDir, input.env), "openclaw-agent.sqlite"), {
			role: "agent",
			agentId: id
		});
	}
	for (const id of /* @__PURE__ */ new Set(["main", ...directories])) queue(path.resolve(input.stateDir, "agents", id, "agent", "openclaw-agent.sqlite"), {
		role: "agent",
		agentId: id
	});
	return new Map([...files.entries()].toSorted(([, a], [, b]) => a.spellings[0] < b.spellings[0] ? -1 : a.spellings[0] > b.spellings[0] ? 1 : 0));
}
/** Released updaters compare exact response paths, so every raw alias is published. */
function publishStateDatabaseVersions(files, inspected) {
	const versions = [];
	for (const [identity, discovery] of files) {
		const result = inspected.get(identity);
		if (!result) continue;
		for (const spelling of discovery.spellings) versions.push({
			path: spelling,
			...result
		});
	}
	return versions;
}
/** Read registrations and plugin ownership from one shared generation before budgeting. */
async function readUpdateCandidateStateInventoryInProcess(input) {
	await fs.mkdir(input.targetStateDir, {
		recursive: true,
		mode: 448
	});
	const planPath = path.join(input.targetStateDir, UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME);
	await fs.writeFile(planPath, "", {
		mode: 384,
		flag: "wx"
	});
	let progressAt = Date.now();
	const reportInventoryIo = createUpdateStateIoReporter(input.stateDir, "plugin inventory", input.onProgress);
	const onProgress = async () => {
		reportInventoryIo();
		const now = Date.now();
		if (now - progressAt < 1e3) return;
		progressAt = now;
		await fs.utimes(planPath, new Date(now), new Date(now));
	};
	const { prepareUpdateCandidatePlugins, readUpdateCandidatePluginIndex } = await import("./update-candidate-plugins-BnvDszcZ.mjs");
	const files = await collectStateDatabasePaths(input);
	const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
	const measure = async (sharedPluginIndex) => {
		input.onProgress?.({
			phase: "plugin inventory",
			path: input.stateDir
		});
		const plugins = await prepareUpdateCandidatePlugins({
			...input,
			sharedPluginIndex,
			onProgress
		});
		await fs.writeFile(planPath, JSON.stringify(plugins));
		return {
			databases: files,
			pluginBytes: plugins.bytes,
			pluginPlan: UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME,
			warnings: plugins.warnings
		};
	};
	if (await updateStateDatabaseExists(shared)) {
		input.onProgress?.({
			phase: "shared database inspection",
			path: shared
		});
		const metadata = tryInspectSqliteReadOnlyInProcess(shared, (db) => {
			collectRegisteredPaths(db, shared, files);
			return readUpdateCandidatePluginIndex(db);
		});
		if (metadata) return measure(metadata);
		return withStateDatabaseSnapshot(shared, async (location) => {
			try {
				var _usingCtx$1 = _usingCtx();
				const db = _usingCtx$1.u(openNodeSqliteDatabase(location, { readOnly: true }));
				collectRegisteredPaths(db, shared, files);
				return measure({ value: readUpdateCandidatePluginIndex(db) });
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}, input.targetStateDir, input.onProgress);
	}
	return measure();
}
function readSharedDatabaseVersion(location, shared, files) {
	try {
		var _usingCtx3 = _usingCtx();
		const db = _usingCtx3.u(openNodeSqliteDatabase(location, { readOnly: true }));
		collectRegisteredPaths(db, shared, files);
		return {
			userVersion: readSqliteUserVersion(db),
			contentVersion: readStateSchemaContentVersion(db)
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
}
/** Discover registered stores from the same private shared-database generation used for inspection. */
async function discoverUpdateStateSchemaInspectionInProcess(input) {
	const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
	input.onProgress?.({
		phase: "shared database discovery",
		path: shared
	});
	const files = await collectStateDatabasePaths(input);
	if (!await updateStateDatabaseExists(shared)) return {
		files: [...files],
		sharedVersion: {
			path: shared,
			userVersion: null
		}
	};
	const sharedVersion = await withStateDatabaseSnapshot(shared, (location) => ({
		path: shared,
		...readSharedDatabaseVersion(location, shared, files)
	}), input.stagingRoot, input.onProgress, input.preserveSourceArtifacts);
	return {
		files: [...files],
		sharedVersion
	};
}
/** Missing databases stay explicit so creation is schema-checked and loss blocks rollback. */
async function readUpdateStateSchemaVersionsInProcess(input) {
	const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
	const files = input.inspectionPlan ? new Map(input.inspectionPlan.files) : await collectStateDatabasePaths(input);
	const sharedIdentity = resolveUpdateCandidateStateIdentity(input.stateDir, shared);
	const inspected = /* @__PURE__ */ new Map();
	for (const [identity, discovery] of files) {
		const file = discovery.spellings[0];
		if (identity === sharedIdentity && input.inspectionPlan) {
			const { userVersion, contentVersion } = input.inspectionPlan.sharedVersion;
			inspected.set(identity, {
				userVersion,
				...contentVersion === void 0 ? {} : { contentVersion }
			});
			continue;
		}
		input.onProgress?.({
			phase: file === shared ? "shared database inspection" : "agent schema inspection",
			path: file
		});
		if (!await updateStateDatabaseExists(file)) {
			inspected.set(identity, { userVersion: null });
			continue;
		}
		if (file !== shared) {
			const { userVersion } = await inspectSqliteSchemaHeaderInProcess(file, input.stagingRoot, void 0, input.preserveSourceArtifacts);
			inspected.set(identity, { userVersion });
			continue;
		}
		inspected.set(identity, await withStateDatabaseSnapshot(file, (location) => readSharedDatabaseVersion(location, shared, files), input.stagingRoot, input.onProgress, input.preserveSourceArtifacts));
	}
	return publishStateDatabaseVersions(files, inspected);
}
/** Released candidates can snapshot shared state even when they cannot expose discovery. */
async function discoverLegacyUpdateStateSchemaInspection(params) {
	params.signal?.throwIfAborted();
	const shared = path.resolve(params.input.stateDir, "state", "openclaw.sqlite");
	const files = await collectStateDatabasePaths(params.input);
	if (!await updateStateDatabaseExists(shared)) return {
		files: [...files],
		sharedVersion: {
			path: shared,
			userVersion: null
		}
	};
	const stagingRoot = await createSqliteSnapshotStagingDirectory(params.stagingRoot, params.root !== void 0, params.signal);
	return withStateInspectionCleanup(stagingRoot, async () => {
		const snapshot = parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
			...params,
			stagingRoot,
			readOnlySource: shared
		}), object({
			ok: literal(true),
			location: string()
		}));
		const relative = path.relative(stagingRoot, snapshot.location);
		if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Legacy state inspection returned a snapshot outside parent-owned staging.");
		const sharedVersion = {
			path: shared,
			...readSharedDatabaseVersion(snapshot.location, shared, files)
		};
		return {
			files: [...files],
			sharedVersion
		};
	});
}
/** Raw fingerprint reads need their own process so descriptor closes cannot release caller locks. */
async function readUpdateDatabaseGenerationsIsolated(paths, options = {}) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	const maintenanceOwner = options.acquisition?.mode === "maintenance-owner" && paths.every((pathname) => maintenanceOwnerHasSourceCustody(scope, pathname));
	const { root, timeoutMs, env: sourceEnv = process.env, signal: caller } = options;
	const controller = new AbortController();
	const signal = caller ? AbortSignal.any([caller, controller.signal]) : controller.signal;
	const stagingRoot = await createSqliteSnapshotStagingDirectory(resolvePrivateSqliteSnapshotStagingRoot(sourceEnv), root !== void 0, signal);
	const inspection = withStateInspectionCleanup(stagingRoot, async () => {
		const worker = {
			nodeRunner: process.execPath,
			sourceEnv,
			stagingRoot,
			timeoutMs,
			signal
		};
		const generations = parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
			...worker,
			root,
			retryAdvice: options.retryAdvice,
			sources: paths,
			...maintenanceOwner ? { ioBudget: "deadline" } : {},
			input: {
				mode: "database-generations",
				paths,
				stateDir: resolveStateDir(sourceEnv),
				config: {}
			},
			databases: maintenanceOwner ? await readUpdateStateDatabaseSizesInProcess(paths, signal) : await readUpdateStateDatabaseSizes(paths, worker)
		}), record(string(), nullable(string().regex(/^[a-f0-9]{64}$/u))));
		if (Object.keys(generations).length !== new Set(paths).size || paths.some((pathname) => !Object.hasOwn(generations, pathname))) throw new Error("Database generation worker did not return the supplied inventory.");
		return generations;
	});
	return retainSnapshotWork(inspection, () => controller.abort());
}
/** Schema fencing reads private copies in candidate workers under size-aware deadlines. */
async function readUpdateStateSchemaVersions({ root, nodeRunner = process.execPath, timeoutMs, signal: callerSignal, onInventory, ...input }) {
	if (root === null) throw new Error("The active installation root is unknown; state inspection is unsafe.");
	const controller = new AbortController();
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	signal.throwIfAborted();
	const sourceEnv = input.env ?? process.env;
	const stagingRoot = await createSqliteSnapshotStagingDirectory(resolvePrivateSqliteSnapshotStagingRoot(sourceEnv), root !== void 0, signal);
	const inspection = withStateInspectionCleanup(stagingRoot, async () => {
		const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
		const sizeOptions = {
			nodeRunner,
			signal,
			sourceEnv,
			stagingRoot,
			timeoutMs
		};
		const discoveryParams = {
			input: {
				...input,
				mode: "discover",
				stagingRoot
			},
			nodeRunner,
			root,
			signal,
			sourceEnv,
			stagingRoot,
			timeoutMs,
			databases: await readUpdateStateDatabaseSizes([shared], sizeOptions)
		};
		const discoveryResult = await runUpdateStateInspectionWorker(discoveryParams);
		const legacyWorker = discoveryResult.code !== 0 && discoveryResult.stderr.includes("Unknown update state inspection mode");
		const discovery = legacyWorker ? await discoverLegacyUpdateStateSchemaInspection({
			...discoveryParams,
			input
		}) : parseUpdateStateInspectionWorker(discoveryResult, UpdateStateSchemaInspectionPlanSchema);
		onInventory?.(new Map(discovery.files));
		const sharedIdentity = resolveUpdateCandidateStateIdentity(input.stateDir, shared);
		const files = legacyWorker ? discovery.files.flatMap(([, database]) => database.spellings) : discovery.files.filter(([identity]) => identity !== sharedIdentity).map(([, database]) => database.spellings[0]);
		return parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
			...discoveryParams,
			input: legacyWorker ? {
				...input,
				mode: "versions"
			} : {
				...input,
				mode: "versions",
				stagingRoot,
				inspectionPlan: discovery
			},
			databases: await readUpdateStateDatabaseSizes(files, sizeOptions)
		}), UpdateStateSchemaVersionsSchema);
	});
	return retainSnapshotWork(inspection, () => controller.abort());
}
/** Keep snapshot dependencies out of schema inspection; rebind registry paths to private copies. */
async function snapshotUpdateCandidateState(input) {
	const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
	const { AGENT_FTS_SCHEMAS } = await import("./openclaw-agent-fts-schema-UlFD-Dr9.mjs");
	const { copyUpdateCandidatePlugins, UpdateCandidatePluginPlanSchema } = await import("./update-candidate-plugins-BnvDszcZ.mjs");
	const plugins = UpdateCandidatePluginPlanSchema.parse(JSON.parse(await fs.readFile(input.pluginPlanPath, "utf8")));
	const admittedDatabases = new Set(input.databaseInventory);
	const sourceRoot = path.resolve(input.stateDir);
	const shared = path.join(sourceRoot, "state", "openclaw.sqlite");
	const { createUpdateCandidateExecApprovalsProjection } = await import("./update-candidate-exec-approvals-BpEauxRy.mjs");
	const targetPath = (source) => path.join(resolveUpdateCandidateStatePath(sourceRoot, input.targetStateDir, path.dirname(source)), path.basename(source));
	const execApprovals = createUpdateCandidateExecApprovalsProjection(sourceRoot, targetPath);
	const files = await collectStateDatabasePaths(input);
	const inspected = /* @__PURE__ */ new Map();
	for (const [identity, discovery] of files) {
		if (!admittedDatabases.has(identity)) throw new Error(`State database registration changed after snapshot inventory: ${discovery.spellings[0]}`);
		const file = discovery.spellings[0];
		if (!await updateStateDatabaseExists(file)) {
			inspected.set(identity, { userVersion: null });
			continue;
		}
		const target = targetPath(file);
		let contentVersion;
		await fs.mkdir(path.dirname(target), {
			recursive: true,
			mode: 448
		});
		const progress = createUpdateStateSnapshotReporter(file, "database snapshot", input.onProgress);
		const snapshot = await createVerifiedSqliteSnapshot({
			sourcePath: file,
			targetPath: target,
			sourceAcquisition: {
				mode: "isolated-process",
				stagingRoot: input.targetStateDir
			},
			integrity: discovery.owners?.some((owner) => owner.role === "agent") ? { ftsSchemas: AGENT_FTS_SCHEMAS } : void 0,
			preserveRowIds: true,
			onProgress: progress.onProgress,
			...file === shared ? { transform: (db) => {
				contentVersion = readStateSchemaContentVersion(db);
				const queries = getNodeSqliteKysely(db);
				execApprovals.rebaseReceipt(db);
				for (const table of ["agent_database_leases", "state_leases"]) if (tableExists(db, table)) executeSqliteQuerySync(db, queries.deleteFrom(table));
				for (const { stored, source } of collectRegisteredPaths(db, shared, files)) {
					const rebound = targetPath(source);
					const reboundStored = path.relative(input.targetStateDir, rebound);
					const resolvedRebound = resolveOpenClawRegisteredAgentDatabasePath(shared, reboundStored);
					const sameRegisteredDatabase = source === resolvedRebound || process.platform === "win32" && normalizeWindowsPathPreservingCase(source) === normalizeWindowsPathPreservingCase(resolvedRebound);
					if (stored !== reboundStored && sameRegisteredDatabase) executeSqliteQuerySync(db, queries.deleteFrom("agent_databases").where("path", "=", stored).where("agent_id", "in", queries.selectFrom("agent_databases").select("agent_id").where("path", "=", reboundStored)));
					executeSqliteQuerySync(db, queries.updateTable("agent_databases").set({ path: reboundStored }).where("path", "=", stored));
				}
			} } : {}
		});
		progress.complete((await fs.stat(target)).size);
		inspected.set(identity, {
			userVersion: snapshot.userVersion,
			...contentVersion === void 0 ? {} : { contentVersion }
		});
	}
	input.onProgress?.({
		phase: "execution approvals snapshot",
		path: sourceRoot
	});
	await execApprovals.copySources();
	const versions = publishStateDatabaseVersions(files, inspected);
	const pluginCodeLinks = [];
	input.onProgress?.({
		phase: "plugin snapshot",
		path: sourceRoot
	});
	return {
		versions,
		pluginPaths: await copyUpdateCandidatePlugins(plugins, {
			...input,
			onProgress: createUpdateStateIoReporter(sourceRoot, "plugin snapshot", input.onProgress),
			onCodeLink: (fact) => pluginCodeLinks.push(fact)
		}),
		pluginCodeLinks: await sealUpdateCandidatePluginCodeLinks(input.pluginPlanPath, pluginCodeLinks)
	};
}
//#endregion
export { listDefaultAgentDatabasePaths as _, discoverUpdateStateSchemaInspectionInProcess as a, readUpdateStateSchemaVersions as c, snapshotUpdateCandidateState as d, updateStateSchemaVersionsMatch as f, runUpdateStateInspectionWorker as g, parseUpdateStateInspectionWorker as h, collectStateDatabasePaths as i, readUpdateStateSchemaVersionsInProcess as l, readUpdateStateDatabaseSizesInProcess as m, UpdateCandidateStateSnapshotSchema as n, readUpdateCandidateStateInventoryInProcess as o, readUpdateStateDatabaseSizes as p, UpdateStateSchemaInspectionPlanSchema as r, readUpdateDatabaseGenerationsIsolated as s, UpdateCandidateSnapshotInventorySchema as t, resolveUpdateStateContentVersion as u };
