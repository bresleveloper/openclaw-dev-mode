import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as readCommandProcessFailure, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { o as WorktreeRepositoryError, r as WorktreePendingContentionError, s as hasWorktreeUnknownOutcome } from "./errors-WYf-uyBk.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { a as executeGitCommand, d as normalizeGitPathForFilesystem, i as enqueueGitRefMutation, p as requireGitCommandOutput, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { i as listGitWorktrees, o as requireGit, p as worktreePathExists, u as runGit } from "./git-CljZIJM8.mjs";
import { t as runGitWorkerOperation } from "./git-worker-DahANBH3.mjs";
import { a as withWorktreeMutationLease, c as releasePendingWorktree, d as WorktreeCapacityContentionError, i as withWorktreeAllocationLease, m as estimateWorktreeGitBytes, o as readPendingWorktrees, r as waitForWorktreeCapacity, t as WORKTREE_CREATE_LEASE_WAIT_MS } from "./allocation-qJnLlg7h.mjs";
import { i as timeWorktreePreparationPhase, r as startWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { c as withWorktreeRunEnd, i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { t as acquireWorktreeRunLease } from "./run-lease-D02SNP3d.mjs";
import { a as prepareWorktreeRegistryGuard, f as readRegistryWorktrees, s as readLiveRegistryWorktreeByOwner } from "./registry-read-Do2Ks9un.mjs";
import { u as updateRegistryWorktree } from "./registry-BVVI2fBI.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CsrQ5-l1.mjs";
import { n as resolveRepository, r as resolveRepositoryFromRealPath } from "./repository-paths-D7rjAU03.mjs";
import { n as indexWorktreePaths } from "./gc-dependencies-B22hkB14.mjs";
import { i as validateName, n as appendNameOrdinal } from "./name-C9NcRALZ.mjs";
import { t as createCrustaceanSlug } from "./session-slug-mrhmi8jZ.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/agents/worktrees/base-ref.ts
const log = createSubsystemLogger("agents/worktrees");
const remoteDefaults = resolveGlobalMap(Symbol.for("openclaw.worktreeRemoteDefaults"));
const BASE_FRESHNESS_MS = 3e4;
var InvalidWorktreeBaseRefError = class extends Error {
	constructor(options) {
		super("Worktree base ref does not resolve to a commit. Choose a local or remote branch and retry.", options);
		this.name = "InvalidWorktreeBaseRefError";
	}
};
async function resolveWorktreeCreationBase(repoRoot, params) {
	if (params.checkoutCommit) {
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(params.checkoutCommit)) throw new Error("Worktree checkout commit is invalid");
		return {
			commit: params.checkoutCommit,
			gitOperand: params.checkoutCommit,
			recordRef: params.baseRef ?? params.checkoutCommit,
			fetchSucceeded: void 0,
			warning: void 0
		};
	}
	return params.prepareBase && !params.baseRef ? await params.prepareBase({
		signal: params.signal,
		assertCurrent: params.commitGuard,
		localDefault: "fast-forward"
	}) : await resolveWorktreeBase(repoRoot, params.baseRef, params.signal, params.commitGuard, "fast-forward");
}
async function resolveWorktreeBase(repoRoot, baseRef, signal, assertCurrent, localDefault = "preserve") {
	if (baseRef) {
		const verified = await runGit(repoRoot, [
			"-c",
			"core.warnAmbiguousRefs=true",
			"rev-parse",
			"--verify",
			"--end-of-options",
			`${baseRef === "-" ? "@{-1}" : baseRef}^{commit}`
		], {
			signal,
			beforeRun: assertCurrent
		});
		signal?.throwIfAborted();
		if (verified.termination === "exit" && typeof verified.code === "number" && verified.code !== 0) throw new InvalidWorktreeBaseRefError({ cause: createGitCommandError("git rev-parse --verify", verified) });
		const commit = requireGitCommandOutput("git rev-parse --verify", verified).trim();
		if (!commit || commit.includes("\n") || verified.stderr.trim()) throw new InvalidWorktreeBaseRefError({ cause: createGitCommandError("git rev-parse --verify", verified) });
		return {
			commit,
			gitOperand: baseRef !== "-" && baseRef.startsWith("-") ? commit : baseRef,
			recordRef: baseRef
		};
	}
	const options = {
		signal,
		beforeRun: () => {
			signal?.throwIfAborted();
			assertCurrent?.();
		},
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_TERMINAL_PROMPT: "0"
		}
	};
	const commonDir = await fs.realpath(path.resolve(repoRoot, normalizeGitPathForFilesystem(await requireGit(repoRoot, ["rev-parse", "--git-common-dir"], options))));
	return await withWorktreeBasePreparation({
		repoRoot: await fs.realpath(repoRoot),
		commonDir
	}, (resolve) => resolve({
		signal,
		assertCurrent,
		localDefault
	}));
}
/** Capture a creation cohort before capacity waits, without fetching until a source owner consumes it. */
async function withWorktreeBasePreparation(repository, run) {
	const key = JSON.stringify([repository.commonDir, repository.repoRoot].map((directory) => process.platform === "win32" ? directory.toLowerCase() : directory));
	const cached = remoteDefaults.get(key);
	const shared = cached && (cached.borrowers > 0 && cached.attempt?.refreshedAt === void 0 || Date.now() - (cached.attempt?.refreshedAt ?? -Infinity) < BASE_FRESHNESS_MS) ? cached : { borrowers: 0 };
	shared.borrowers++;
	remoteDefaults.set(key, shared);
	pruneMapToMaxSize(remoteDefaults, 32);
	let active = true;
	const resolutions = [];
	const resolve = async ({ signal, assertCurrent, localDefault = "preserve" }) => {
		const options = {
			signal,
			beforeRun: () => {
				if (!active) throw new Error("Worktree base preparation is closed");
				signal?.throwIfAborted();
				assertCurrent?.();
			},
			env: {
				GIT_NO_LAZY_FETCH: "1",
				GIT_TERMINAL_PROMPT: "0"
			}
		};
		const settled = (attempt, pending) => pending.catch((error) => {
			attempt.refreshedAt = void 0;
			if (hasWorktreeUnknownOutcome(error)) throw error;
			if (readCommandProcessFailure(error)?.cleanup === "uncertain") throw new CommandProcessCleanupError({ cause: error });
			throw error;
		});
		options.beforeRun();
		let attempt = shared.attempt;
		if (!attempt) {
			const started = { pending: timeWorktreePreparationPhase("baseRefresh", () => fetchRemoteDefault(repository.repoRoot, options)).then(async (base) => {
				const preparationKey = base.commit;
				await timeWorktreePreparationPhase("baseHydration", () => estimateWorktreeGitBytes(repository.repoRoot, base.commit, {
					signal,
					assertCurrent: options.beforeRun,
					preparationKey
				}));
				base.preparationKey = preparationKey;
				options.beforeRun();
				if (base.fetchSucceeded) started.refreshedAt = Date.now();
				return base;
			}) };
			started.pending = settled(started, started.pending);
			attempt = shared.attempt = started;
		}
		if (localDefault === "fast-forward" && !attempt.forwarded) {
			attempt.forwarded = true;
			attempt.pending = settled(attempt, attempt.pending.then(async (base) => {
				const warning = await timeWorktreePreparationPhase("baseFastForward", () => fastForwardLocalDefault(repository, base.branch, base.commit, options));
				return warning ? {
					...base,
					warning: [base.warning, redactSensitiveText(warning)].filter(Boolean).join("\n")
				} : base;
			}));
		}
		const selected = await timeWorktreePreparationPhase("baseWait", () => attempt.pending);
		options.beforeRun();
		const { branch: _branch, ...base } = selected;
		return base;
	};
	try {
		return await run((options) => {
			const pending = resolve(options);
			resolutions.push(pending);
			return pending;
		});
	} finally {
		active = false;
		await Promise.allSettled(resolutions);
		if (--shared.borrowers === 0 && !shared.attempt?.refreshedAt && remoteDefaults.get(key) === shared) remoteDefaults.delete(key);
	}
}
async function fetchRemoteDefault(repoRoot, options) {
	const cached = await runGit(repoRoot, [
		"symbolic-ref",
		"--quiet",
		"refs/remotes/origin/HEAD"
	], options);
	const advertised = await runGit(repoRoot, [
		"ls-remote",
		"--symref",
		"origin",
		"HEAD"
	], {
		...options,
		timeoutMs: 3e4
	});
	options.signal?.throwIfAborted();
	const advertisedOk = advertised.termination === "exit" && advertised.code === 0;
	const advertisedBranch = advertisedOk ? /^ref: refs\/heads\/(.+)\tHEAD\r?$/mu.exec(advertised.stdout)?.[1] : void 0;
	const cachedBranch = cached.termination === "exit" && cached.code === 0 ? /^refs\/remotes\/origin\/(.+)$/u.exec(cached.stdout.trim())?.[1] : void 0;
	let branch = advertisedBranch ?? cachedBranch;
	const warnings = [];
	if (!advertisedOk) warnings.push(createGitCommandError("git ls-remote origin HEAD", advertised).message);
	else if (!advertisedBranch) warnings.push("origin did not advertise a default branch; using its cached default.");
	if (!branch || branch === "HEAD") throw new Error(`Remote default branch is unavailable. Repair origin or choose an explicit worktree base ref. ${redactSensitiveText(warnings.join("\n"))}`);
	let remoteRef = `refs/remotes/origin/${branch}`;
	const fetched = await runGit(repoRoot, [
		"fetch",
		"--no-auto-maintenance",
		"--no-recurse-submodules",
		"--no-tags",
		"origin",
		`+refs/heads/${branch}:${remoteRef}`
	], {
		...options,
		timeoutMs: 6e4
	});
	if (fetched.cleanup === "uncertain") throw new CommandProcessCleanupError();
	options.signal?.throwIfAborted();
	const fetchSucceeded = fetched.termination === "exit" && fetched.code === 0;
	if (!fetchSucceeded) {
		warnings.push(createGitCommandError("git fetch origin default branch", fetched).message);
		branch = cachedBranch ?? branch;
		remoteRef = `refs/remotes/origin/${branch}`;
	}
	const verified = await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		`${remoteRef}^{commit}`
	], options);
	if (verified.termination !== "exit" || verified.code !== 0) throw new Error(`Remote default ${remoteRef} is unavailable. Repair origin or choose an explicit worktree base ref. ${redactSensitiveText(warnings.join("\n"))}`);
	const commit = requireGitCommandOutput("git rev-parse remote default", verified).trim();
	if (fetchSucceeded && advertisedBranch && cachedBranch !== branch) await requireGit(repoRoot, [
		"symbolic-ref",
		"refs/remotes/origin/HEAD",
		remoteRef
	], options);
	return {
		branch,
		commit,
		gitOperand: remoteRef,
		recordRef: `origin/${branch}`,
		fetchSucceeded,
		...warnings.length ? { warning: redactSensitiveText(warnings.join("\n")) } : {}
	};
}
var LocalDefaultBusyError = class extends Error {};
async function assertWorktreeGitOperationsIdle(commonDir, localRef, options) {
	try {
		const worktreesDir = path.join(commonDir, "worktrees");
		const worktrees = await fs.readdir(worktreesDir).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		});
		const busy = () => new LocalDefaultBusyError("Local default retained: finish or abort the Git rebase, am, or bisect operation reserving it before advancing it.");
		if ((await fs.readdir(commonDir)).some((name) => [
			"rebase-merge",
			"rebase-apply",
			"BISECT_LOG"
		].includes(name))) throw busy();
		const read = async (directory, name) => await fs.readFile(path.join(directory, name), "utf8").catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		});
		const checked = await runTasksWithConcurrency({
			limit: 16,
			errorMode: "stop",
			tasks: worktrees.map((name) => async () => {
				options.signal?.throwIfAborted();
				options.beforeRun?.();
				const directory = path.join(worktreesDir, name);
				for (const file of [
					"rebase-merge/head-name",
					"rebase-apply/head-name",
					"rebase-merge/update-refs"
				]) if ((await read(directory, file))?.trim().split("\n").includes(localRef)) throw busy();
				const bisect = (await read(directory, "BISECT_START"))?.trim();
				if (bisect === localRef || bisect === localRef.slice(11)) {
					if (await read(directory, "BISECT_LOG") !== void 0) throw busy();
				}
			})
		});
		if (checked.hasError) throw checked.firstError;
	} catch (error) {
		options.signal?.throwIfAborted();
		options.beforeRun?.();
		if (error instanceof LocalDefaultBusyError) throw error;
		throw new LocalDefaultBusyError("Local default retained: Git worktree operation state could not be checked. Inspect Git worktree metadata before retrying.", { cause: error });
	}
}
async function fastForwardLocalDefault({ repoRoot, commonDir }, branch, commit, options) {
	const localRef = `refs/heads/${branch}`;
	const local = await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		localRef
	], options);
	if (local.termination !== "exit" || local.code !== 0 || local.stdout.trim() === commit) return;
	const previous = local.stdout.trim();
	const ancestor = await runGit(repoRoot, [
		"merge-base",
		"--is-ancestor",
		previous,
		commit
	], options);
	if (ancestor.termination !== "exit" || ancestor.code !== 0) return;
	const primary = await runGit(repoRoot, [
		"symbolic-ref",
		"--quiet",
		"HEAD"
	], options);
	if (primary.termination !== "exit" || primary.code !== 0 || primary.stdout.trim() !== localRef) return;
	const advanced = await enqueueGitRefMutation(repoRoot, commonDir, () => withWorktreeGitConfig(repoRoot, true, options, async (git) => {
		try {
			await assertWorktreeGitOperationsIdle(commonDir, localRef, options);
			const checkouts = (await listGitWorktrees(repoRoot, options)).filter((entry) => entry.branch === localRef);
			const checkout = checkouts[0];
			if (!checkout || checkouts.length > 1 || path.resolve(checkout.path) !== path.resolve(repoRoot) || checkout.lockedReason !== void 0) throw new LocalDefaultBusyError();
			const sparse = await runGit(repoRoot, [
				"config",
				"--bool",
				"core.sparseCheckout"
			], options);
			if (sparse.termination !== "exit" || sparse.code !== 0 && sparse.code !== 1 || sparse.stdout.trim() === "true") throw new LocalDefaultBusyError();
			const dirty = await git.run(repoRoot, [
				"status",
				"--porcelain",
				"--untracked-files=all"
			], options);
			if (dirty.termination !== "exit" || dirty.code !== 0 || dirty.stdout.trim()) throw new LocalDefaultBusyError();
			const current = await runGit(repoRoot, [
				"symbolic-ref",
				"--quiet",
				"HEAD"
			], options);
			if (current.termination !== "exit" || current.code !== 0 || current.stdout.trim() !== localRef) throw new LocalDefaultBusyError();
			return await git.withContentEnvironment((env) => executeGitCommand(repoRoot, [
				"merge",
				"--ff-only",
				"--no-edit",
				"--no-stat",
				"--no-overwrite-ignore",
				commit
			], {
				...options,
				env,
				killProcessTree: true
			}));
		} catch (error) {
			if (error instanceof LocalDefaultBusyError) return error;
			throw error;
		}
	}), options.signal);
	if (advanced instanceof LocalDefaultBusyError) return advanced.message || void 0;
	if (advanced.termination !== "exit" || advanced.code !== 0) return createGitCommandError("git fast-forward local default", advanced).message;
}
/** Report the immutable commit captured by checkout registration, not an earlier ref value. */
async function logWorktreeBase(repoRoot, base, commit, context) {
	const committedAt = Number(await requireGit(repoRoot, [
		"show",
		"-s",
		"--no-show-signature",
		"--no-notes",
		"--format=%ct",
		commit
	], {
		signal: context.signal,
		beforeRun: context.assertCurrent,
		env: { GIT_NO_LAZY_FETCH: "1" }
	}));
	const ageDays = Math.max(0, (context.now / 1e3 - committedAt) / 86400);
	const stale = ageDays > 7;
	const message = `worktree base ${base.recordRef} at ${commit} (commit age ${ageDays.toFixed(1)} days; fetch ${base.fetchSucceeded === void 0 ? "not requested" : base.fetchSucceeded ? "succeeded" : "failed"})${base.warning ? `: ${base.warning}` : ""}${stale ? "; base is older than 7 days. Check origin before starting work." : ""}`;
	const metadata = {
		worktreePath: context.worktreePath,
		ownerId: context.ownerId,
		baseRef: base.recordRef,
		baseCommit: commit,
		ageDays,
		fetchSucceeded: base.fetchSucceeded
	};
	if (base.warning || stale) log.warn(message, metadata);
	else log.info(message, metadata);
}
//#endregion
//#region src/agents/worktrees/owner.ts
function assertOwnerWorktreeReuse(record, params, repoRoot) {
	if (record.repoRoot !== repoRoot) throw new Error(`worktree owner ${params.ownerKind ?? "manual"} ${params.ownerId} is already bound to another repository`);
	if (record.ownerKind === "workboard" && params.baseRef && params.baseRef !== record.baseRef) throw new Error(`worktree ${record.name} already uses base ref ${record.baseRef}; requested ${params.baseRef}. Existing checkout preserved; use a new owner and name for a different base.`);
}
function worktreeOwnerMatches(record, params) {
	return record.ownerKind === (params.ownerKind ?? "manual") && (record.ownerId ?? void 0) === (params.ownerId ?? void 0);
}
//#endregion
//#region src/agents/worktrees/service-preparation.ts
async function readWorktreeGitInventory(repoRoot, suppliedName) {
	const [branches, worktrees] = await Promise.all([requireGit(repoRoot, [
		"for-each-ref",
		"--format=%(refname)",
		"refs/heads/openclaw/"
	]), suppliedName === void 0 ? listGitWorktrees(repoRoot) : []]);
	return {
		branches: new Set(branches.split("\n")),
		paths: new Set(worktrees.map((entry) => path.resolve(entry.path)))
	};
}
async function prepareWorktreeDestination(params) {
	const { env, repository } = params;
	const configuredRoot = params.configuredRoot ?? path.join(resolveStateDir(env), "worktrees");
	await fs.mkdir(configuredRoot, { recursive: true });
	const root = path.join(await fs.realpath(configuredRoot), repository.fingerprint);
	const name = await resolveWorktreeName(env, params.gitInventory, repository.fingerprint, root, params.owner, params.suggestedName, params.suppliedName);
	return {
		root,
		name,
		worktreePath: path.join(root, name),
		branch: `openclaw/${name}`
	};
}
async function createWithWorktreeAllocation(input, run, rollbackPublished) {
	const params = {
		...input,
		waitBudget: { remainingMs: WORKTREE_CREATE_LEASE_WAIT_MS }
	};
	for (;;) {
		const publication = { id: randomUUID() };
		try {
			const allocated = startWorktreePreparationPhase("allocate");
			try {
				return await withWorktreeMutationLease({
					...params,
					id: publication.id
				}, async (guard) => {
					allocated();
					try {
						return await run(guard, publication);
					} catch (error) {
						if (!hasWorktreeUnknownOutcome(error) && !(error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_LOST") && publication.pending && !await worktreePathExists(publication.pending.path)) try {
							await releasePendingWorktree(params.env, publication.id, { leaseSet: guard.workerAuthority.leaseSet });
							publication.pending = void 0;
						} catch (cleanupError) {
							throw new AggregateError([error, cleanupError], "Worktree slot rollback failed", { cause: cleanupError });
						}
						throw error;
					}
				});
			} finally {
				allocated();
			}
		} catch (error) {
			if (hasWorktreeUnknownOutcome(error)) throw error;
			const failures = [error];
			if (publication.pending) try {
				await withWorktreeAllocationLease({
					env: params.env,
					id: publication.id
				}, async (allocation) => {
					if (publication.pending && !await worktreePathExists(publication.pending.path)) await releasePendingWorktree(params.env, publication.id, allocation.workerAuthority);
				});
			} catch (cleanupError) {
				failures.push(cleanupError);
			}
			if (params.withSource && publication.record) try {
				await rollbackPublished(publication.record);
			} catch (cleanupError) {
				failures.push(cleanupError);
			}
			if (failures.length > 1) throw new AggregateError(failures, failures.map(String).join("\n"), { cause: error });
			if (error instanceof WorktreePendingContentionError && !publication.record) {
				await withWorktreeMutationLease({
					...params,
					id: error.worktreeId
				}, async () => {});
				await withWorktreeAllocationLease(params, async () => {
					const pending = (await readPendingWorktrees(params.env)).find(({ record, state }) => record.id === error.worktreeId && state === "pending");
					if (pending) {
						await requireNewWorktreeBranch(pending.record.repoRoot, pending.record.branch);
						throw new Error("Worktree creation did not settle; run openclaw worktrees gc to recover its pending slot", { cause: error });
					}
				});
				continue;
			}
			if (error instanceof WorktreeCapacityContentionError && !publication.record) {
				await waitForWorktreeCapacity(error, params);
				continue;
			}
			throw error;
		}
	}
}
/** Source custody can begin inside allocation and outlive its short reservation interval. */
async function withWorktreeSources(env, run) {
	const context = captureWorktreeRunEndContext(env);
	const held = /* @__PURE__ */ new Map();
	const retainRepository = async (params) => timeWorktreePreparationPhase("sources", async () => {
		const records = (await readRegistryWorktrees(env, { liveOnly: true })).filter((record) => record.id !== params.restoringId);
		const { repository } = params;
		const source = await runGitWorkerOperation({
			type: "worktree.eviction-source",
			input: {
				sourceRoot: repository.sourceRoot,
				commonDir: repository.commonDir,
				requiredPaths: [repository.repoRoot, ...params.requiredPaths ?? []],
				records: records.map(({ id, path: checkoutPath, repoRoot }) => ({
					id,
					path: checkoutPath,
					repoRoot
				}))
			}
		}, {
			signal: params.signal,
			assertCurrent: params.commitGuard
		});
		if (!source.complete) throw new Error("Managed worktree source Git storage cannot be inspected safely. Repair its Git metadata before retrying.");
		const ancestors = indexWorktreePaths(source.ownedPaths);
		const reuseTargets = records.filter((record) => params.ownerId && worktreeOwnerMatches(record, params) || params.name === record.name && record.repoFingerprint === repository.fingerprint);
		const retainSources = async (paths) => {
			const needed = /* @__PURE__ */ new Set([
				...source.worktreeIds,
				...reuseTargets.map(({ id }) => id),
				...paths.flatMap((required) => [...ancestors(required)])
			]);
			for (const record of records) {
				if (!needed.has(record.id) || held.has(record.id)) continue;
				params.commitGuard();
				const missing = !await worktreePathExists(record.path);
				params.commitGuard();
				held.set(record.id, await acquireWorktreeRunLease(record.id, {
					env,
					source: {
						context,
						record
					},
					...missing ? { allowMissingCheckout: true } : {}
				}));
				if (held.size % 8 === 0) await setImmediate();
			}
			params.commitGuard();
		};
		await retainSources([]);
		params.commitGuard();
		return retainSources;
	});
	let outcome;
	try {
		outcome = {
			ok: true,
			value: await run(retainRepository)
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	if (outcome.ok || !hasWorktreeUnknownOutcome(outcome.error)) {
		const cleanupErrors = (await timeWorktreePreparationPhase("sourceRelease", () => Promise.allSettled([...held.values()].map(async (lease) => await lease.release())))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (cleanupErrors.length > 0) throw new AggregateError([...outcome.ok ? [] : [outcome.error], ...cleanupErrors], "Worktree source custody could not settle");
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
async function withWorktreeSource(params, run) {
	const { withSource, ...operation } = params;
	params.commitGuard?.();
	if (!withSource) return await run(operation);
	return await withSource((source) => {
		const commitGuard = () => {
			params.commitGuard?.();
			source.assertCurrent();
		};
		commitGuard();
		const signal = params.signal && source.signal ? AbortSignal.any([params.signal, source.signal]) : source.signal ?? params.signal;
		const rollbackGuard = () => {
			params.rollbackGuard();
			source.assertCheckoutCurrent?.();
		};
		const workerAuthority = {
			...params.workerAuthority,
			assertCurrent: () => {
				signal?.throwIfAborted();
				(params.workerAuthority ? params.workerAuthority.assertCurrent : params.commitGuard)?.();
				(source.workerAuthority ? source.workerAuthority.assertCurrent : source.assertCurrent)?.();
			},
			predicates: [...params.workerAuthority?.predicates ?? [], ...source.workerAuthority?.predicates ?? []]
		};
		return run({
			...operation,
			signal,
			commitGuard,
			rollbackGuard,
			workerAuthority
		});
	});
}
async function findWorktreeByName(env, fingerprint, name) {
	return (await readRegistryWorktrees(env)).find((record) => record.repoFingerprint === fingerprint && record.name === name);
}
async function resolveWorktreeName(env, gitInventory, fingerprint, root, owner, suggestedName, suppliedName) {
	if (suppliedName !== void 0) {
		if (gitInventory.branches.has(`refs/heads/openclaw/${suppliedName}`)) throw new Error(`branch already exists: openclaw/${suppliedName}`);
		return suppliedName;
	}
	validateName(suggestedName);
	for (let ordinal = 1; ordinal <= 1e3; ordinal += 1) {
		const candidate = ordinal === 1 ? suggestedName : appendNameOrdinal(suggestedName, ordinal);
		const worktreePath = path.join(root, candidate);
		const registered = await findWorktreeByName(env, fingerprint, candidate);
		if (owner.ownerId && registered && registered.removedAt === void 0 && worktreeOwnerMatches(registered, owner)) return candidate;
		if (!registered && !(await readPendingWorktrees(env)).some(({ record }) => record.repoFingerprint === fingerprint && record.name === candidate) && !await worktreePathExists(worktreePath) && !gitInventory.branches.has(`refs/heads/openclaw/${candidate}`) && !gitInventory.paths.has(path.resolve(worktreePath))) return candidate;
	}
	throw new Error(`no available worktree name for ${suggestedName}`);
}
async function requireNewWorktreeBranch(repoRoot, branch) {
	const existing = await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	]);
	if (existing.code === 0) throw new Error(`branch already exists: ${branch}`);
	if (existing.code !== 1) throw createGitCommandError("git show-ref --verify", existing);
}
/** Rebind a live checkout only after its canonical repository and recorded origin agree. */
async function rebindLiveWorktreeRepository(env, record, guard = {}) {
	return withWorktreeRunEnd(env, async () => {
		const worktreePath = await fs.realpath(record.path);
		const repository = await resolveRepositoryFromRealPath(worktreePath, record.path);
		if (repository.sourceRoot !== worktreePath) throw new WorktreeRepositoryError(`repository does not own worktree: ${record.path}`);
		if ((await resolveRepository(record.repoRoot)).originUrl !== repository.originUrl) throw new WorktreeRepositoryError(`repository origin does not match: ${record.path}`);
		guard.signal?.throwIfAborted();
		guard.commitGuard?.();
		const authority = {
			...guard.workerAuthority,
			assertCurrent: guard.workerAuthority?.assertCurrent ?? guard.commitGuard,
			predicates: [...guard.workerAuthority?.predicates ?? [], {
				kind: "binding",
				record
			}]
		};
		if (record.repoRoot === repository.repoRoot && record.repoFingerprint === repository.fingerprint) {
			await prepareWorktreeRegistryGuard(captureWorktreeRunEndContext(env), authority);
			guard.signal?.throwIfAborted();
			return record;
		}
		const rebind = (workerAuthority) => updateRegistryWorktree(env, record.id, { repositoryIdentity: {
			repoRoot: repository.repoRoot,
			repoFingerprint: repository.fingerprint
		} }, { workerAuthority });
		if (authority.leaseSet?.mutationWorktreeIds?.includes(record.id)) await rebind(authority);
		else await withWorktreeMutationLease({
			env,
			id: record.id,
			...guard,
			workerAuthority: authority
		}, (held) => rebind(held.workerAuthority));
		guard.signal?.throwIfAborted();
		guard.commitGuard?.();
		return {
			...record,
			repoRoot: repository.repoRoot,
			repoFingerprint: repository.fingerprint
		};
	});
}
async function removeFailedWorktree(repoRoot, worktreePath, branch, rollbackGuard) {
	const options = {
		beforeRun: rollbackGuard,
		killProcessTree: true
	};
	const removed = await runGit(repoRoot, [
		"worktree",
		"remove",
		"--force",
		worktreePath
	], options);
	const deletedBranch = branch ? await runGit(repoRoot, [
		"branch",
		"-D",
		branch
	], options) : void 0;
	if (removed.code !== 0) return createGitCommandError("git worktree remove", removed);
	if (deletedBranch && deletedBranch.code !== 0) return createGitCommandError("git branch -D", deletedBranch);
}
async function createOwnedWorktree(params, repository, env, now, create) {
	if (params.ownerId) {
		const existing = await readLiveRegistryWorktreeByOwner(captureWorktreeRunEndContext(env), params.ownerKind ?? "manual", params.ownerId);
		if (existing && params.profiles?.length) throw new Error("Source profiles require a new worktree; use a new owner and name.");
		if (existing && await worktreePathExists(existing.path)) return await withWorktreeSource(params, async (current) => {
			const validated = await rebindLiveWorktreeRepository(env, existing, current);
			assertOwnerWorktreeReuse(validated, current, repository.repoRoot);
			current.commitGuard?.();
			return {
				record: validated,
				materialized: false
			};
		});
		if (existing) await withWorktreeSource(params, async (current) => {
			current.commitGuard?.();
			await updateRegistryWorktree(env, existing.id, { removedAt: now() }, { workerAuthority: {
				...current.workerAuthority,
				predicates: [...current.workerAuthority.predicates ?? [], {
					kind: "binding",
					record: existing
				}]
			} });
		});
	}
	return await create(params.name ?? params.suggestedName ?? createCrustaceanSlug());
}
//#endregion
export { readWorktreeGitInventory as a, withWorktreeSource as c, InvalidWorktreeBaseRefError as d, logWorktreeBase as f, withWorktreeBasePreparation as h, prepareWorktreeDestination as i, withWorktreeSources as l, resolveWorktreeCreationBase as m, createWithWorktreeAllocation as n, rebindLiveWorktreeRepository as o, resolveWorktreeBase as p, findWorktreeByName as r, removeFailedWorktree as s, createOwnedWorktree as t, worktreeOwnerMatches as u };
