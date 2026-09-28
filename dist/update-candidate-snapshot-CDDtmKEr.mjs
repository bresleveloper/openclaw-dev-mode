import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-BzetEUdq.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { c as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { n as withUpdateCandidateIoBudget, t as measureUpdateStateFiles } from "./update-candidate-io-Dx8FiSJf.mjs";
import { n as UpdateCandidateStateSnapshotSchema, r as collectStateDatabasePaths, t as UpdateCandidateSnapshotInventorySchema } from "./update-candidate-state-Cd-yslJu.mjs";
import { t as UpdateSnapshotCapacityError } from "./update-snapshot-capacity-ChVb8DDY.mjs";
import { r as resolveUpdateCaptureRoot } from "./update-capture-paths-CSUVJC6v.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { ensureAbsoluteDirectory } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/infra/update-candidate-snapshot.ts
function requiredSnapshotBytes(size) {
	return size.bytes * 2 + size.largest * 3 + (size.pluginBytes ?? 0) + 67108864;
}
function measureSnapshotCapacity(stateDir, size, env, previous) {
	const roots = [];
	if (env.TMPDIR?.trim()) roots.push({
		kind: "explicit-tmpdir",
		directory: path.resolve(env.TMPDIR)
	});
	const configuredTempDir = os.tmpdir();
	const systemTempDir = process.platform !== "win32" && env.TMPDIR?.trim() && path.resolve(configuredTempDir) === path.resolve(env.TMPDIR) ? process.env.TMP || process.env.TEMP || "/tmp" : configuredTempDir;
	roots.push({
		kind: "state-volume",
		directory: resolveUpdateCaptureRoot(resolvePathViaExistingAncestorSync$1(stateDir))
	}, {
		kind: "system-tmpdir",
		directory: path.resolve(systemTempDir)
	});
	const candidates = roots.filter((root, index) => roots.findIndex((other) => other.directory === root.directory) === index).map((root) => {
		const candidate = {
			kind: root.kind,
			directory: root.directory,
			availableBytes: tryReadDiskSpace(root.directory)?.availableBytes ?? null
		};
		const allocationError = previous?.candidates.find((entry) => entry.directory === root.directory)?.allocationError;
		if (allocationError) candidate.allocationError = allocationError;
		return candidate;
	});
	const requiredBytes = requiredSnapshotBytes(size);
	return {
		reason: "snapshot-capacity-insufficient",
		sqliteBytes: size.bytes,
		pluginBytes: size.pluginBytes,
		requiredBytes,
		candidates,
		selection: null
	};
}
/** Measure known SQLite families without allocating state or reading the candidate plugin inventory. */
async function measureInitialUpdateSnapshotState(params) {
	const files = await collectStateDatabasePaths(params);
	const size = await measureUpdateStateFiles([...files.values()].map(({ spellings }) => spellings[0]));
	return {
		capacity: measureSnapshotCapacity(params.stateDir, {
			...size,
			pluginBytes: null
		}, params.env),
		families: size.families
	};
}
async function assessInitialUpdateSnapshotCapacity(params) {
	const started = Date.now();
	const step = {
		name: "snapshot-space-preflight",
		command: "snapshot-space-preflight",
		cwd: params.stateDir
	};
	try {
		const { capacity, families } = await measureInitialUpdateSnapshotState(params);
		const refused = capacity.candidates.length > 0 && capacity.candidates.every((candidate) => candidate.availableBytes !== null && candidate.availableBytes < capacity.requiredBytes);
		const diagnostics = [
			"Snapshot size estimate: plugin copies and registered external databases are measured after staging.",
			`Initial snapshot needs ${formatDiskSpaceBytes(capacity.requiredBytes)} for ${formatDiskSpaceBytes(capacity.sqliteBytes)} of known SQLite files and temporary working space.`,
			...capacity.candidates.map((candidate) => `${candidate.kind} ${candidate.directory}: ${formatDiskSpaceBytes(capacity.requiredBytes)} needed; ${candidate.availableBytes === null ? "free space unknown" : `${formatDiskSpaceBytes(candidate.availableBytes)} free`}.`),
			...families.map((family) => `SQLite family ${family.path}: ${formatDiskSpaceBytes(family.bytes)} (database and supporting files).`)
		];
		if (refused) return {
			...step,
			durationMs: Date.now() - started,
			exitCode: 1,
			stderrTail: [
				"snapshot-capacity-insufficient: no eligible directory has enough free space for the required state snapshot.",
				...diagnostics,
				"Free space on a reported filesystem or set TMPDIR to a writable directory with enough space, then retry the update."
			].join("\n"),
			snapshotCapacity: capacity
		};
		return {
			...step,
			durationMs: Date.now() - started,
			exitCode: 0,
			diagnostics
		};
	} catch {
		return {
			...step,
			durationMs: Date.now() - started,
			exitCode: 0,
			warnings: ["Initial snapshot capacity could not be measured; continuing to the update snapshot check."]
		};
	}
}
async function allocateSnapshotRoot(capacity, current) {
	const fits = (candidate) => candidate.availableBytes !== null && candidate.availableBytes >= capacity.requiredBytes;
	for (const candidate of capacity.candidates.filter(fits)) {
		if (candidate.allocationError) continue;
		try {
			let directory = current?.root === candidate.directory ? current.directory : void 0;
			if (!directory) {
				const root = candidate.kind === "state-volume" ? candidate.directory : resolvePathViaExistingAncestorSync$1(candidate.directory);
				const ensured = await ensureAbsoluteDirectory(root, {
					mode: 448,
					scopeLabel: "update snapshot"
				});
				if (!ensured.ok) throw ensured.error;
				directory = await fs.realpath(await createPrivateSqliteTempDirectory(root, "openclaw-update-canary-"));
			}
			capacity.reason = candidate.kind;
			capacity.selection = {
				kind: candidate.kind,
				directory: candidate.directory
			};
			return directory;
		} catch (error) {
			if (!(error instanceof FsSafeError) && ![
				"EACCES",
				"EPERM",
				"EROFS",
				"ENOTDIR",
				"ENOENT",
				"EEXIST",
				"ELOOP",
				"ENOSPC"
			].some((code) => hasNodeErrorCode(error, code))) throw error;
			candidate.allocationError = error instanceof Error ? error.message : String(error);
		}
	}
	capacity.reason = capacity.candidates.some(fits) ? "snapshot-location-unavailable" : "snapshot-capacity-insufficient";
	throw new UpdateSnapshotCapacityError(capacity);
}
/** The parent owns both the child and its scratch root, including a killed SQLite operation. */
async function prepareUpdateCandidateStateSnapshot(params) {
	let { capacity } = await measureInitialUpdateSnapshotState(params);
	let directory = await allocateSnapshotRoot(capacity);
	let selectedRoot = capacity.selection;
	const inventoryDirectory = directory;
	const cleanupDirectories = () => [.../* @__PURE__ */ new Set([directory, inventoryDirectory])];
	const run = async (request) => {
		const workerEnv = params.workerEnv(directory);
		return await withUpdateCandidateIoBudget({
			directory,
			bytes: capacity.sqliteBytes + (capacity.pluginBytes ?? 0),
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			operation: "snapshot",
			nodeRunner: params.nodeRunner,
			env: workerEnv
		}, async (signal) => {
			const result = await runUtf8CommandWithTimeout([params.nodeRunner ?? process.execPath, ...resolveRuntimeWorkerArgv(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.updateCandidateState), params.nodeRunner)], {
				input: JSON.stringify({
					...request,
					stateDir: params.stateDir,
					config: params.config,
					targetStateDir: directory,
					candidateRoot: params.candidateRoot,
					env: {
						HOME: params.env.HOME,
						OPENCLAW_HOME: params.env.OPENCLAW_HOME,
						USERPROFILE: params.env.USERPROFILE,
						OPENCLAW_AGENT_DIR: params.env.OPENCLAW_AGENT_DIR,
						PI_CODING_AGENT_DIR: params.env.PI_CODING_AGENT_DIR,
						OPENCLAW_BUNDLED_PLUGINS_DIR: params.env.OPENCLAW_BUNDLED_PLUGINS_DIR,
						OPENCLAW_DISABLE_BUNDLED_PLUGINS: params.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS
					}
				}),
				baseEnv: workerEnv,
				signal,
				killGraceMs: 500,
				killProcessTree: true,
				requireProcessTreeExtinction: true,
				maxOutputBytes: {
					stdout: 1048576,
					stderr: 2e4
				},
				terminateOnOutputLimit: true
			});
			if (result.cleanup === "uncertain") throw Object.assign(/* @__PURE__ */ new Error("Update snapshot worker settlement is uncertain"), { cleanup: result.cleanup });
			signal.throwIfAborted();
			if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) throw new Error(`Update state snapshot failed (${result.outputLimitExceeded ? "output-limit" : result.termination}): ${redactSupportString(result.stderr, {
				env: params.env,
				stateDir: params.stateDir
			}, { maxLength: 2e4 })}`);
			return JSON.parse(result.stdout);
		});
	};
	try {
		const inventory = UpdateCandidateSnapshotInventorySchema.parse(await run({ mode: "inventory" }));
		const size = {
			...await measureUpdateStateFiles([...inventory.databases.values()].map(({ spellings }) => spellings[0])),
			pluginBytes: inventory.pluginBytes
		};
		capacity = measureSnapshotCapacity(params.stateDir, size, params.env, capacity);
		directory = await allocateSnapshotRoot(capacity, {
			root: selectedRoot.directory,
			directory
		});
		selectedRoot = capacity.selection;
		const { pluginPaths } = UpdateCandidateStateSnapshotSchema.parse(await run({
			mode: "snapshot",
			pluginPlanPath: path.join(inventoryDirectory, inventory.pluginPlan),
			databaseInventory: [...inventory.databases.keys()]
		}));
		return {
			stateDir: directory,
			pluginPaths,
			snapshotCapacity: {
				...capacity,
				selection: {
					...selectedRoot,
					directory
				}
			},
			cleanupDirectories: cleanupDirectories()
		};
	} catch (error) {
		if (isRecord(error) && error.cleanup === "uncertain") throw Object.assign(new Error(`Update snapshot cleanup could not be confirmed; retained scratch: ${cleanupDirectories().join(", ")}`, { cause: error }), { cleanup: "uncertain" });
		for (const ownedDirectory of cleanupDirectories()) await fs.rm(ownedDirectory, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
//#endregion
export { prepareUpdateCandidateStateSnapshot as n, assessInitialUpdateSnapshotCapacity as t };
