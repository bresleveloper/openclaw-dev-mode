import { t as asNullableRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { t as createSidecarLockManager } from "./openclaw-state-read-sidecar-lock-Clsgj0Iv.mjs";
import { i as getFsSafeLockConfig, n as isLockOwnerDefinitelyStale, r as shouldRemoveDeadOwnerOrExpiredLock, t as inspectStaleLockOwner } from "./openclaw-state-read-stale-lock-file-BZJVXTuc.mjs";
import { c as resolveEnvironmentValue, o as mergeProcessEnv, t as getFileLockProcessStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { s as withGitProcessOperation } from "./openclaw-state-read-errors-D64c1s5e.mjs";
import { a as enqueueGitRefMutation, c as executeGitCommandBytes, d as runCommandWithTimeout, f as decodeWindowsOutputBuffer, g as readCommandProcessFailure, h as hasCommandProcessCleanupError, l as normalizeGitPathForFilesystem, m as CommandProcessCleanupError, n as requestGitWorkerCommand, o as executeGitCommand, p as resolveWindowsConsoleEncoding, s as executeGitCommandBuffered, t as hasGitWorkerContext } from "./openclaw-state-read-git-worker-context-Bs8ZoHN0.mjs";
import { t as createLazyPromise } from "./openclaw-state-read-lazy-promise-DLFIcwoO.mjs";
import "./openclaw-state-read-owned-directory-observation-6SUeitZe.mjs";
import { constants } from "node:fs";
import path from "node:path";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { performance } from "node:perf_hooks";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock.js
function resolveFileLockManagerKey(targetPath, managerKey) {
	return managerKey ?? `fs-safe.file-lock:${targetPath}`;
}
function withLockDefaults(options) {
	const { managerKey: _managerKey, lockPath } = options;
	const acquireOptions = {};
	for (const key of Reflect.ownKeys(options)) {
		if (key === "managerKey" || key === "lockPath") continue;
		if (!Object.getOwnPropertyDescriptor(options, key)?.enumerable) continue;
		Object.defineProperty(acquireOptions, key, {
			value: Reflect.get(options, key),
			enumerable: true,
			writable: true,
			configurable: true
		});
	}
	const defaults = getFsSafeLockConfig();
	return {
		...acquireOptions,
		retry: acquireOptions.retry ?? defaults.retry,
		staleMs: acquireOptions.staleMs ?? defaults.staleMs ?? 3e4,
		staleRecovery: acquireOptions.staleRecovery ?? defaults.staleRecovery,
		timeoutMs: acquireOptions.timeoutMs ?? defaults.timeoutMs,
		...lockPath === void 0 ? {} : { lockPath }
	};
}
async function acquireFileLock$1(targetPath, options) {
	return await createFileLockManager(resolveFileLockManagerKey(targetPath, options.managerKey)).acquire(targetPath, options);
}
function createFileLockManager(key) {
	const manager = createSidecarLockManager(key);
	return {
		acquire: async (targetPath, options) => {
			return await manager.acquire({
				...withLockDefaults(options),
				targetPath
			});
		},
		withLock: async (targetPath, options, fn) => {
			return await manager.withLock({
				...withLockDefaults(options),
				targetPath
			}, fn);
		},
		drain: manager.drain,
		reset: manager.reset,
		heldEntries: manager.heldEntries
	};
}
//#endregion
//#region src/plugin-sdk/file-lock.ts
/** Stable error code used when lock acquisition retries are exhausted. */
const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
const FILE_LOCK_MANAGER_KEY = "openclaw.plugin-sdk.file-lock";
let currentProcessStartTime;
function getCurrentProcessStartTime() {
	if (currentProcessStartTime === void 0) currentProcessStartTime = getFileLockProcessStartTime(process.pid);
	return currentProcessStartTime;
}
function createCurrentProcessLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const starttime = getCurrentProcessStartTime();
	if (starttime !== null) payload.starttime = starttime;
	return payload;
}
function normalizeLockError(err, staleOwner = null) {
	if (err.code === "file_lock_timeout") throw Object.assign(new Error(err.message), {
		code: FILE_LOCK_TIMEOUT_ERROR_CODE,
		lockPath: err.lockPath ?? ""
	});
	if (err.code === "file_lock_stale") {
		const detail = staleOwner ? ` [${staleOwner.reason} pid=${staleOwner.pid} recorded-start=${staleOwner.recordedStarttime ?? "unknown"} observed-start=${staleOwner.observedStarttime ?? "unknown"}]` : "";
		throw Object.assign(/* @__PURE__ */ new Error(`${err.message}${detail}`), {
			code: FILE_LOCK_STALE_ERROR_CODE,
			lockPath: err.lockPath ?? ""
		});
	}
	throw err;
}
/** Acquire an owner-scoped process-local file lock backed by a `.lock` sidecar file. */
async function acquireFileLock(filePath, options) {
	options.assertResourceUnborrowed?.(filePath);
	const staleRecovery = options.staleRecovery ?? "remove-if-unchanged";
	let staleOwner = null;
	try {
		const lock = await acquireFileLock$1(filePath, {
			managerKey: FILE_LOCK_MANAGER_KEY,
			staleMs: options.stale,
			retry: options.retries,
			staleRecovery: staleRecovery === "remove-if-definitely-stale" ? "remove-if-unchanged" : staleRecovery,
			reentrantOwner: options.reentrantOwner,
			payload: () => {
				options.assertResourceUnborrowed?.(filePath);
				return createCurrentProcessLockPayload();
			},
			shouldReclaim: (params) => {
				if (staleRecovery === "fail-closed") {
					staleOwner = inspectStaleLockOwner({ payload: asNullableRecord(params.payload) });
					return staleOwner !== null;
				}
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asNullableRecord(params.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asNullableRecord(params.payload),
					staleMs: params.staleMs,
					nowMs: params.nowMs
				});
			},
			...staleRecovery === "remove-if-unchanged" || staleRecovery === "remove-if-definitely-stale" ? { shouldRemoveStaleLock: (snapshot) => {
				options.assertResourceUnborrowed?.(snapshot.normalizedTargetPath);
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asNullableRecord(snapshot.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asNullableRecord(snapshot.payload),
					staleMs: options.stale
				});
			} } : {}
		});
		const targetPath = lock.lockPath.slice(0, -5);
		try {
			options.assertResourceUnborrowed?.(targetPath);
		} catch (error) {
			await lock.release();
			throw error;
		}
		return {
			lockPath: lock.lockPath,
			release: async () => {
				options.assertResourceUnborrowed?.(targetPath);
				await lock.release();
			}
		};
	} catch (err) {
		return normalizeLockError(err, staleOwner);
	}
}
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
async function withFileLock(filePath, options, fn) {
	const lock = await acquireFileLock(filePath, options);
	let outcome;
	try {
		outcome = { value: await fn() };
	} catch (error) {
		outcome = { error };
	}
	try {
		await lock.release();
	} catch (error) {
		if ("error" in outcome) throw new AggregateError([outcome.error, error], "File operation failed and lock release is unresolved", { cause: error });
		throw error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/infra/git-ref-lock-repair.ts
const STALE_REF_LOCK_MS = 36e5;
const LOCAL_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	61267,
	1481003842,
	2435016766,
	4076150800
]);
function sameLock(left, right) {
	return right.isFile() && right.nlink === 1 && right.size === 0 && left.dev === right.dev && left.ino === right.ino && left.ctimeMs === right.ctimeMs && left.mtimeMs === right.mtimeMs && left.birthtimeMs === right.birthtimeMs;
}
async function regularRefPath(commonDirectory, relative) {
	let directory = commonDirectory;
	for (const component of relative.split(path.sep).slice(0, -1)) {
		directory = path.join(directory, component);
		if (!(await fs$1.lstat(directory)).isDirectory()) return false;
	}
	return true;
}
/** Reclaim only native Git locks whose exclusive-create owner cannot have survived this boot. */
async function clearStaleGitRemoteRefLocks(params) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent();
	};
	assertCurrent();
	if (process.platform !== "linux" || params.refs.length === 0) return 0;
	const storage = await fs$1.realpath(params.commonDirectory).then(async (commonDirectory) => ({
		commonDirectory,
		filesystem: await fs$1.statfs(commonDirectory),
		directory: await fs$1.stat(commonDirectory)
	})).catch(() => void 0);
	assertCurrent();
	if (!storage || !LOCAL_FILESYSTEM_TYPES.has(storage.filesystem.type)) return 0;
	const { commonDirectory, directory } = storage;
	try {
		return await withFileLock(path.join(commonDirectory, "openclaw-ref-lock-repair"), {
			retries: {
				retries: 0,
				factor: 1,
				minTimeout: 0,
				maxTimeout: 0
			},
			stale: 0,
			staleRecovery: "remove-if-definitely-stale"
		}, async () => {
			assertCurrent();
			const cutoff = Date.now() - os.uptime() * 1e3 - STALE_REF_LOCK_MS;
			let cleared = 0;
			for (const ref of new Set(params.refs)) {
				assertCurrent();
				const relative = `${ref}.lock`;
				const target = path.resolve(commonDirectory, relative);
				if (!ref.startsWith("refs/remotes/origin/") || path.relative(commonDirectory, target) !== relative) continue;
				try {
					const observed = await fs$1.lstat(target);
					if (!observed.isFile() || observed.nlink !== 1 || observed.size !== 0 || observed.dev !== directory.dev || observed.birthtimeMs <= 0 || Math.max(observed.birthtimeMs, observed.ctimeMs, observed.mtimeMs) >= cutoff || !await regularRefPath(commonDirectory, relative)) continue;
					const handle = await fs$1.open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
					try {
						if (!sameLock(observed, await handle.stat()) || !await regularRefPath(commonDirectory, relative) || !sameLock(observed, await fs$1.lstat(target))) continue;
						assertCurrent();
						await fs$1.unlink(target);
						cleared++;
					} finally {
						await handle.close();
					}
				} catch {
					assertCurrent();
				}
			}
			return cleared;
		});
	} catch {
		assertCurrent();
		return 0;
	}
}
//#endregion
//#region src/infra/git-repository-repair.ts
const log = createSubsystemLogger("git/repair");
const REPAIR_TIMEOUT_MS = 3e5;
const MAX_REFS = 5e4;
const MAX_MISSING_TIPS = 4096;
const OID = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
/** The caller keeps its checkout/ref mutation admission through repair and retry. */
async function withGitRepositoryRepair(params) {
	const { result } = params;
	if (result.termination !== "exit" || result.code !== 128 || result.cleanup === "uncertain" || result.outputLimitExceeded) return result;
	const stderr = typeof result.stderr === "string" ? result.stderr : Buffer.from(result.stderr).toString("utf8");
	if (!/which is in the commit graph file but not in the object database|trying to write ref '[^']+' with nonexistent object/iu.test(stderr)) return result;
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	log.warn(`Git repository has missing ref tips; attempting repair for ${params.cwd}`);
	try {
		const started = performance.now();
		const remainingBudget = () => {
			assertCurrent();
			const remaining = REPAIR_TIMEOUT_MS - (performance.now() - started);
			if (remaining <= 0) throw new Error("repair exceeded its five-minute budget");
			return Math.ceil(remaining);
		};
		const run = async (args, input) => {
			const outcome = await params.run([
				"-c",
				"core.commitGraph=false",
				"-c",
				"maintenance.auto=false",
				"-c",
				"fetch.writeCommitGraph=false",
				...args
			], {
				input,
				signal: params.signal,
				beforeRun: assertCurrent,
				timeoutMs: remainingBudget(),
				maxOutputBytes: 8388608,
				env: {
					GIT_NO_LAZY_FETCH: "1",
					GIT_NO_REPLACE_OBJECTS: "1"
				},
				killProcessTree: true
			});
			if (outcome.cleanup === "uncertain") throw new CommandProcessCleanupError();
			assertCurrent();
			if (outcome.termination !== "exit" || outcome.code !== 0 || outcome.stdoutTruncatedBytes || outcome.outputLimitExceeded) throw new Error(`repair ${args[0]} failed (${outcome.termination}, exit ${outcome.code})`);
			return outcome.stdout;
		};
		const rows = (await run(["for-each-ref", "--format=%(refname) %(objectname) %(symref)"])).trim().split("\n").filter(Boolean);
		if (rows.length > MAX_REFS) throw new Error(`repair inventory exceeds ${MAX_REFS} refs`);
		const refs = /* @__PURE__ */ new Map();
		const symbolicRefs = /* @__PURE__ */ new Map();
		for (const row of rows) {
			const [ref, oid, symbolic] = row.trim().split(" ");
			if (!ref?.startsWith("refs/") || !oid || !OID.test(oid)) throw new Error("repair received an invalid ref inventory");
			if (symbolic) symbolicRefs.set(ref, symbolic);
			else refs.set(ref, oid);
		}
		const worktrees = (await run([
			"worktree",
			"list",
			"--porcelain",
			"-z"
		])).split("\0");
		const protectedRefs = /* @__PURE__ */ new Set();
		const protect = (ref) => {
			let current = ref;
			while (!protectedRefs.has(current)) {
				protectedRefs.add(current);
				const target = symbolicRefs.get(current);
				if (!target) break;
				current = target;
			}
		};
		for (const ref of symbolicRefs.keys()) if (!ref.startsWith("refs/remotes/origin/")) protect(ref);
		for (const field of worktrees) if (field.startsWith("branch ")) protect(field.slice(7));
		const remoteRefs = /* @__PURE__ */ new Set();
		for (const row of (await run([
			"ls-remote",
			"--heads",
			"--",
			params.remote
		])).trim().split("\n").filter(Boolean)) {
			const [oid, ref] = row.split("	");
			if (!oid || !OID.test(oid) || !ref?.startsWith("refs/heads/")) throw new Error("repair received an invalid remote inventory");
			remoteRefs.add(`refs/remotes/origin/${ref.slice(11)}`);
		}
		if (remoteRefs.size > MAX_REFS) throw new Error(`repair inventory exceeds ${MAX_REFS} remote refs`);
		const tracking = [...refs.keys()].filter((ref) => ref.startsWith("refs/remotes/origin/"));
		const canonicalTracking = params.canonicalTracking || (await run([
			"config",
			"--get-all",
			"remote.origin.fetch"
		])).trim() === "+refs/heads/*:refs/remotes/origin/*";
		const cleared = await clearStaleGitRemoteRefLocks({
			commonDirectory: path.resolve(params.cwd, normalizeGitPathForFilesystem((await run(["rev-parse", "--git-common-dir"])).trim())),
			refs: [.../* @__PURE__ */ new Set([...tracking, ...remoteRefs])],
			assertCurrent: () => {
				remainingBudget();
			},
			signal: params.signal
		});
		const obsolete = canonicalTracking && params.pruneTracking !== false ? tracking.filter((ref) => !remoteRefs.has(ref) && !protectedRefs.has(ref)) : [];
		if (obsolete.length) {
			await run([
				"update-ref",
				"--no-deref",
				"--stdin"
			], `${obsolete.map((ref) => `delete ${ref} ${refs.get(ref)}`).join("\n")}\n`);
			for (const ref of obsolete) refs.delete(ref);
		}
		const tips = new Set(refs.values());
		for (const field of worktrees) if (field.startsWith("HEAD ") && OID.test(field.slice(5)) && !/^0+$/u.test(field.slice(5))) tips.add(field.slice(5));
		const missing = (tips.size ? await run(["cat-file", "--batch-check=%(objectname) %(objecttype)"], `${[...tips].join("\n")}\n`) : "").trim().split("\n").filter((row) => row.endsWith(" missing")).map((row) => row.split(" ")[0]);
		if (missing.length > MAX_MISSING_TIPS) throw new Error(`repair exceeds ${MAX_MISSING_TIPS} missing ref tips`);
		if (missing.length) await run([
			"-c",
			"fetch.negotiationAlgorithm=noop",
			"fetch",
			"--no-auto-maintenance",
			"--no-tags",
			"--no-prune",
			"--no-prune-tags",
			"--no-write-fetch-head",
			"--no-recurse-submodules",
			...(await run([
				"config",
				"--type=bool",
				"--default=false",
				"--get",
				"remote.origin.promisor"
			])).trim() === "true" ? ["--filter=blob:none"] : [],
			"--stdin",
			"--",
			params.remote
		], `${missing.join("\n")}\n`);
		assertCurrent();
		const retried = await params.retry();
		if (retried.cleanup === "uncertain") throw new CommandProcessCleanupError();
		assertCurrent();
		if (retried.termination !== "exit" || retried.code !== 0) throw new Error("fetch still fails after ref-tip repair");
		params.onRepaired?.(protectedRefs);
		log.warn(`Git repository repaired for ${params.cwd}: fetched ${missing.length} missing tips, pruned ${obsolete.length} obsolete tracking refs, cleared ${cleared} stale ref locks`);
		return retried;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		if (readCommandProcessFailure(error)?.cleanup === "uncertain") throw new CommandProcessCleanupError({ cause: error });
		assertCurrent();
		log.warn(`Git repository repair failed for ${params.cwd}: ${error instanceof Error ? error.message : "repair unavailable"}. Local branches and worktree HEADs were preserved; repair the clone's missing objects or ref locks, then retry.`);
		return result;
	}
}
createLazyPromise(async () => {
	try {
		return (await runCommandWithTimeout(["git", "--version"], { timeoutMs: 2e3 })).code === 0;
	} catch {
		return false;
	}
});
//#endregion
//#region src/agents/worktrees/git.ts
const REPAIRABLE_FETCH_FLAGS = /* @__PURE__ */ new Set([
	"--no-auto-maintenance",
	"--refetch",
	"--no-tags",
	"--no-write-fetch-head",
	"--no-recurse-submodules",
	"--recurse-submodules=no",
	"--stdin",
	"--prune",
	"--no-prune"
]);
function withNoGlob(value) {
	if (value?.trim().split(/\s+/).at(-1) === "noglob") return value;
	return value ? `${value} noglob` : "noglob";
}
/**
* Gateway-run Git must never execute repository hooks or filesystem monitors;
* the admin-gated setup script is the sole intentional repository-code path.
* Exported so other Gateway-owned callers that must bypass the `runGit`/
* `requireGit*` wrappers (e.g. a buffered, non-throwing invocation with a
* custom timeout) still pin the same invariant instead of reimplementing it.
*/
function gitEnvironment(env, args = [], platform = process.platform, inheritedEnv = process.env) {
	const baseEnv = env ?? inheritedEnv;
	const effectiveWindowsEnv = platform === "win32" && args.some((arg) => arg.endsWith("^{commit}")) ? mergeProcessEnv([inheritedEnv, env], platform) : void 0;
	const windowsNoGlob = effectiveWindowsEnv ? {
		MSYS: withNoGlob(resolveEnvironmentValue(effectiveWindowsEnv, "MSYS", platform)),
		CYGWIN: withNoGlob(resolveEnvironmentValue(effectiveWindowsEnv, "CYGWIN", platform))
	} : {};
	return {
		...baseEnv,
		...windowsNoGlob,
		GIT_CONFIG_COUNT: "2",
		GIT_CONFIG_KEY_0: "core.hooksPath",
		GIT_CONFIG_VALUE_0: os.devNull,
		GIT_CONFIG_KEY_1: "core.fsmonitor",
		GIT_CONFIG_VALUE_1: "false"
	};
}
/** Parent-only command execution for text consumers whose decoding runs in a worker. */
async function runGitBytes(cwd, args, options = {}) {
	return await runOwnedGitCommand(cwd, args, options, executeGitCommandBytes);
}
async function runOwnedGitCommand(cwd, args, options, execute) {
	const baseEnv = options.baseEnv ?? { ...process.env };
	const env = gitEnvironment(options.env, args, process.platform, baseEnv);
	return await withGitRefAdmission(cwd, args, async (gitArgs) => {
		const run = () => execute(cwd, gitArgs, {
			...options,
			beforeRun: gitArgs === args ? options.beforeRun : void 0,
			baseEnv,
			env,
			input: gitArgs === args ? options.input : void 0,
			killProcessTree: options.killProcessTree ?? (args[0] === "fetch" && gitArgs === args)
		});
		const result = await run();
		if (gitArgs !== args || args[0] !== "fetch" || result.code !== 128) return result;
		const [remote, refspec, ...extra] = args.slice(1).filter((arg) => !REPAIRABLE_FETCH_FLAGS.has(arg));
		if (remote !== "origin" || extra.length > 0 || refspec !== void 0 && !/^\+refs\/heads\/(.+):refs\/remotes\/origin\/\1$/u.test(refspec)) return result;
		return await withGitRepositoryRepair({
			cwd,
			result,
			remote: "origin",
			pruneTracking: !args.includes("--no-prune"),
			signal: options.signal,
			assertCurrent: options.beforeRun,
			retry: run,
			run: (repairArgs, repairOptions) => executeGitCommand(cwd, repairArgs, {
				...options,
				...repairOptions,
				baseEnv,
				env: {
					...env,
					...repairOptions.env
				}
			})
		});
	}, options.signal, options.refMutationDirectory);
}
async function withGitRefAdmission(cwd, args, run, signal, refMutationDirectory) {
	if (!(args[0] === "fetch" || args[0] === "update-ref" || args[0] === "merge" || args[0] === "worktree" && args[1] === "add" && !args.includes("--detach") || args[0] === "symbolic-ref" && args.length === 3 && !args[1]?.startsWith("-") || args[0] === "branch" && args.some((arg) => arg === "-d" || arg === "-D" || arg === "--delete"))) return await run(args);
	let commonDir = refMutationDirectory;
	if (!commonDir) {
		const resolved = await run(["rev-parse", "--git-common-dir"]);
		if (resolved.termination !== "exit" || resolved.code !== 0) return resolved;
		commonDir = typeof resolved.stdout === "string" ? resolved.stdout : decodeWindowsOutputBuffer({
			buffer: Buffer.from(resolved.stdout.buffer, resolved.stdout.byteOffset, resolved.stdout.byteLength),
			windowsEncoding: resolveWindowsConsoleEncoding()
		});
	}
	let entered = false;
	try {
		return await enqueueGitRefMutation(cwd, commonDir.trim(), () => {
			entered = true;
			return run(args);
		}, signal);
	} catch (error) {
		if (!entered && signal?.aborted && error === signal.reason) return await run(args);
		throw error;
	}
}
/** Byte-preserving Git transport shared by worker inventories and ordinary callers. */
async function runGitBuffered(cwd, args, options = {}) {
	if (hasGitWorkerContext()) {
		const { signal: _signal, beforeRun: _beforeRun, ...forwarded } = options;
		const result = await requestGitWorkerCommand({
			type: "git.buffer",
			input: {
				cwd,
				args,
				options: forwarded
			}
		});
		return {
			...result,
			stdout: Buffer.from(result.stdout.buffer, result.stdout.byteOffset, result.stdout.byteLength),
			stderr: Buffer.from(result.stderr.buffer, result.stderr.byteOffset, result.stderr.byteLength)
		};
	}
	const baseEnv = options.baseEnv ?? { ...process.env };
	const env = gitEnvironment(options.env, args, process.platform, baseEnv);
	return await withGitRefAdmission(cwd, args, (gitArgs) => {
		return executeGitCommandBuffered(cwd, gitArgs, {
			...options,
			beforeRun: gitArgs === args ? options.beforeRun : void 0,
			input: gitArgs === args ? options.input : void 0,
			baseEnv,
			env
		});
	}, options.signal, options.refMutationDirectory);
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-git.ts
const WORKSPACE_RESULT_GIT_TIMEOUT_MS = 6e5;
async function readWorkspaceResultGit(root, args, options, failureMessage = `git ${args[0]} failed`) {
	const result = await withGitProcessOperation("workspace.result", () => runGitBuffered(root, args, {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		...options
	}), "default");
	if (result.termination !== "exit" || result.code !== 0) throw new Error(result.stderr.toString("utf8").trim() || failureMessage);
	return result.stdout;
}
//#endregion
export { runGitBytes as i, readWorkspaceResultGit as n, runGitBuffered as r, WORKSPACE_RESULT_GIT_TIMEOUT_MS as t };
