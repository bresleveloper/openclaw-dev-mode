import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { o as readCommandProcessFailure, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { i as resolveWindowsConsoleEncoding, n as decodeWindowsOutputBuffer } from "./windows-encoding-BZ9QWkjs.mjs";
import { a as executeGitCommand, d as normalizeGitPathForFilesystem, i as enqueueGitRefMutation, o as executeGitCommandBuffered, p as requireGitCommandOutput, r as createGitCommandError, s as executeGitCommandBytes } from "./git-exec-CvORirty.mjs";
import { i as requestGitWorkerCommand, r as hasGitWorkerContext } from "./git-worker-context-Bo3RTsYA.mjs";
import "./workspace-git-CiP8oVHR.mjs";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
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
//#endregion
//#region src/agents/worktrees/git.ts
const WORKTREE_CHECKOUT_TIMEOUT_MS = 3e5;
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
async function runGit(cwd, args, options = {}) {
	if (hasGitWorkerContext()) {
		const { signal: _signal, beforeRun: _beforeRun, ...forwarded } = options;
		const { stdout, stderr, windowsEncoding, ...metadata } = await requestGitWorkerCommand({
			type: "git.text",
			input: {
				cwd,
				args,
				options: forwarded
			}
		});
		return {
			...metadata,
			stdout: decodeWindowsOutputBuffer({
				buffer: Buffer.from(stdout.buffer, stdout.byteOffset, stdout.byteLength),
				windowsEncoding
			}),
			stderr: decodeWindowsOutputBuffer({
				buffer: Buffer.from(stderr.buffer, stderr.byteOffset, stderr.byteLength),
				windowsEncoding
			})
		};
	}
	return await runOwnedGitCommand(cwd, args, options, executeGitCommand);
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
async function requireGit(cwd, args, options = {}) {
	const result = await runGit(cwd, args, options);
	return requireGitCommandOutput(`git ${args.join(" ")}`, result).trim();
}
async function requireGitBuffer(cwd, args, options = {}) {
	const result = await runGitBuffered(cwd, args, options);
	if (result.termination !== "exit" || result.code !== 0) throw createGitCommandError(`git ${args.join(" ")}`, result);
	return result.stdout;
}
/** Git may return relative or Windows-native spellings for its administrative paths. */
async function resolveGitMetadataPath(cwd, name, options = {}) {
	return path.resolve(cwd, normalizeGitPathForFilesystem(await requireGit(cwd, [
		"rev-parse",
		"--git-path",
		name
	], options)));
}
function parseWorktreeList(output) {
	const entries = [];
	let current;
	for (const field of output.split("\0")) {
		if (!field) {
			if (current) {
				entries.push(current);
				current = void 0;
			}
			continue;
		}
		if (field.startsWith("worktree ")) {
			if (current) entries.push(current);
			current = { path: normalizeGitPathForFilesystem(field.slice(9)) };
		} else if (current && field.startsWith("HEAD ")) current.head = field.slice(5);
		else if (current && field === "locked") current.lockedReason = "";
		else if (current && field.startsWith("locked ")) current.lockedReason = field.slice(7);
		else if (current && field.startsWith("branch ")) current.branch = field.slice(7);
		else if (current && field === "detached") current.branch = null;
	}
	if (current) entries.push(current);
	return entries;
}
async function listGitWorktrees(repoRoot, options = {}) {
	return parseWorktreeList(requireGitCommandOutput("git worktree list", await runGit(repoRoot, [
		"worktree",
		"list",
		"--porcelain",
		"-z"
	], options)));
}
/** Resolve shared storage and its primary root without selecting or validating HEAD. */
async function resolveGitRepositoryPaths(sourceRoot, options = {}) {
	const commonRaw = normalizeGitPathForFilesystem(await requireGit(sourceRoot, ["rev-parse", "--git-common-dir"], options));
	const commonDir = await fs$1.realpath(path.resolve(sourceRoot, commonRaw));
	const primary = (await listGitWorktrees(sourceRoot, options))[0]?.path ?? sourceRoot;
	return {
		canonicalRoot: await fs$1.realpath(primary),
		commonDir
	};
}
async function hasSelfContainedGitMetadata(checkoutRoot) {
	return (await lstatIfExists(path.join(checkoutRoot, ".git")))?.isDirectory() ?? false;
}
async function worktreePathExists(target) {
	return await lstatIfExists(target) !== void 0;
}
async function lstatIfExists(target) {
	try {
		return await fs$1.lstat(target);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
//#endregion
export { lstatIfExists as a, resolveGitMetadataPath as c, runGitBuffered as d, runGitBytes as f, listGitWorktrees as i, resolveGitRepositoryPaths as l, withGitRepositoryRepair as m, gitEnvironment as n, requireGit as o, worktreePathExists as p, hasSelfContainedGitMetadata as r, requireGitBuffer as s, WORKTREE_CHECKOUT_TIMEOUT_MS as t, runGit as u };
