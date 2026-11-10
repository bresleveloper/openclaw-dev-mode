import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { i as WorktreeRemovalContentionError } from "./errors-WYf-uyBk.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { i as listGitWorktrees, p as worktreePathExists, u as runGit } from "./git-CljZIJM8.mjs";
import { c as withWorktreeRunEnd, r as captureWorktreeRegistryMutation, s as setWorktreeRunEndCleanupFailure } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { i as runWorktreeRegistryCommand, n as claimWorktreeRemovalRow } from "./registry-run-end-C_3vIy6v.mjs";
import { f as readRegistryWorktrees, u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { c as releaseWorktreeRunLeaseRow } from "./registry-BVVI2fBI.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/agents/worktrees/git-lock.ts
const OPENCLAW_LOCK_PATTERN = /^openclaw pid=(\d+)$/;
async function lockState(record) {
	return classifyLockReason((await listGitWorktrees(record.repoRoot)).find((candidate) => path.resolve(candidate.path) === path.resolve(record.path))?.lockedReason);
}
function classifyLockReason(reason) {
	if (reason === void 0) return { kind: "none" };
	const match = OPENCLAW_LOCK_PATTERN.exec(reason);
	if (!match) return {
		kind: "foreign",
		reason
	};
	const pid = Number(match[1]);
	return isPidDefinitelyDead(pid) ? {
		kind: "dead",
		pid
	} : {
		kind: "live",
		pid
	};
}
/** One GC pass may skip these paths; removal still rechecks locks and HEAD under its lease. */
function createWorktreeGcPrefilter() {
	const repositories = /* @__PURE__ */ new Map();
	return async (record) => {
		const root = path.resolve(record.repoRoot);
		let reasons = repositories.get(root);
		if (!reasons) {
			reasons = listGitWorktrees(root).then((entries) => new Map(entries.map((entry) => [path.resolve(entry.path), entry])));
			repositories.set(root, reasons);
		}
		const entry = (await reasons).get(path.resolve(record.path));
		const state = classifyLockReason(entry?.lockedReason);
		if (state.kind === "live" || state.kind === "foreign") return "worktree has a live or foreign lock";
		if (entry?.branch !== void 0 && entry.branch !== `refs/heads/${record.branch}`) return "branch-moved";
	};
}
function heldByThisProcess(state) {
	return state.kind === "live" && state.pid === process.pid;
}
/** A pending ref owns recovery even after its remover exits or registry activity changes. */
async function assertManagedWorktreeRemovalComplete(record, options) {
	const pending = await runGit(record.repoRoot, [
		"show-ref",
		"--verify",
		"--quiet",
		`refs/openclaw/removals/${record.id}`
	], options);
	options?.signal?.throwIfAborted();
	options?.beforeRun?.();
	if (pending.termination !== "exit" || pending.code !== 0 && pending.code !== 1) throw createGitCommandError("git show-ref --verify pending removal", pending);
	if (pending.code === 0) throw new WorktreeRemovalContentionError("busy", "Worktree removal is incomplete; recover its preserved snapshot before continuing");
}
async function runLock(record, options) {
	return await runGit(record.repoRoot, [
		"worktree",
		"lock",
		"--reason",
		`openclaw pid=${process.pid}`,
		record.path
	], options);
}
async function lockWorktreeForProcess(record, options) {
	const result = await runLock(record, options);
	if (result.code === 0) return true;
	const state = await lockState(record);
	if (heldByThisProcess(state)) return false;
	if (state.kind !== "dead") throw createGitCommandError("git worktree lock", result);
	await unlockWorktree(record, options);
	const retry = await runLock(record, options);
	if (retry.code !== 0 && !heldByThisProcess(await lockState(record))) throw createGitCommandError("git worktree lock", retry);
	return retry.code === 0;
}
async function unlockWorktree(record, options) {
	const result = await runGit(record.repoRoot, [
		"worktree",
		"unlock",
		record.path
	], options);
	if (result.code !== 0) throw createGitCommandError("git worktree unlock", result);
}
//#endregion
//#region src/agents/worktrees/run-lease-store.ts
async function admitWorktreeRunLeaseRowAsync(context, input, onSettlement) {
	await runLeaseCommand(context, {
		type: "worktrees.admitRunLease",
		input
	}, onSettlement);
	context.admission.assertCurrent();
}
async function releaseWorktreeRunLeaseRowAsync(env, worktreeId, token, context = captureOpenClawStateWorkerContext({ env })) {
	await runLeaseCommand(context, {
		type: "worktrees.releaseRunLease",
		input: {
			worktreeId,
			token
		}
	});
}
async function reapWorktreeRunLeases(env, scopes, assertCurrent) {
	if (scopes.length > 0) await runLeaseCommand(captureOpenClawStateWorkerContext({ env }), {
		type: "worktrees.reapRunLeases",
		input: { scopes }
	}, void 0, assertCurrent);
}
async function runLeaseCommand(context, command, onSettlement, assertCurrent) {
	let mutation;
	const ids = command.type === "worktrees.reapRunLeases" ? command.input.scopes.map((scope) => scope.slice(13)) : [command.input.worktreeId];
	try {
		mutation = captureWorktreeRegistryMutation(context, ids.map((id) => ({
			id,
			fields: ["leases"]
		})), { settlement: command.type === "worktrees.releaseRunLease" });
	} catch (error) {
		onSettlement?.("not-entered");
		throw error;
	}
	await runWorktreeRegistryCommand(context, (scope) => scope.execute(command), {
		assertCurrent: () => mutation.assertAuthority(() => assertCurrent?.()),
		mutation,
		onSettlement,
		unknownMessage: "Worktree run lease outcome is unknown; custody retained",
		recover: () => ({ value: void 0 })
	});
}
//#endregion
//#region src/agents/worktrees/run-lease.ts
const log = createSubsystemLogger("agents/worktrees");
const RELEASE_MAX_ATTEMPTS = 3;
const heldGitLocks = /* @__PURE__ */ new Map();
const gitLockTransitionTails = /* @__PURE__ */ new Map();
const pendingLeaseCleanups = /* @__PURE__ */ new Set();
let exitCleanupRegistered = false;
function withGitLockTransition(id, task) {
	return enqueueKeyedTask({
		tails: gitLockTransitionTails,
		key: id,
		task
	});
}
async function retainGitLock(context, id) {
	await withGitLockTransition(id, async () => {
		const held = heldGitLocks.get(id) ?? {
			refcount: 0,
			gitLocked: false
		};
		const needsLock = held.refcount === 0 && !held.gitLocked;
		held.refcount += 1;
		heldGitLocks.set(id, held);
		if (!needsLock) return;
		let record;
		try {
			record = await readRegistryWorktree(context, id);
			if (!record) return;
			const options = { beforeRun: () => context.admission.assertCurrent() };
			await assertManagedWorktreeRemovalComplete(record, options);
			await lockWorktreeForProcess(record, options);
			held.gitLocked = true;
		} catch (error) {
			heldGitLocks.delete(id);
			throw new Error(`managed worktree is unusable because its Git removal guard could not be acquired: ${record?.path ?? id}; checkout preserved. Repair its Git metadata or create a new worktree before retrying: ${formatErrorMessage(error)}`, { cause: error });
		}
	});
}
async function releaseGitLock(cleanup) {
	return await withGitLockTransition(cleanup.id, async () => {
		const held = heldGitLocks.get(cleanup.id);
		if (!cleanup.refcountReleased) {
			cleanup.refcountReleased = true;
			if (held) held.refcount -= 1;
		}
		if (!held) return true;
		if (held.refcount > 0) return true;
		if (!held.gitLocked) {
			heldGitLocks.delete(cleanup.id);
			return true;
		}
		try {
			const record = await readRegistryWorktree(cleanup.context, cleanup.id);
			if (record) await unlockWorktree(record);
		} catch (error) {
			log.warn(`failed to unlock worktree ${cleanup.id}: ${formatErrorMessage(error)}`);
			return false;
		}
		heldGitLocks.delete(cleanup.id);
		return true;
	});
}
async function realpathOrSelf(candidate) {
	try {
		return await fs.realpath(candidate);
	} catch {
		return path.resolve(candidate);
	}
}
async function resolveWorktreeForPath(params) {
	const env = params.env ?? process.env;
	const context = captureOpenClawStateWorkerContext({ env });
	const boundId = params.sessionEntry?.worktree?.id;
	if (boundId !== void 0) {
		const record = await readRegistryWorktree(context, boundId);
		if (!record || record.removedAt !== void 0) throw new Error(`managed worktree was removed: ${record?.path ?? boundId}`);
		return {
			context,
			record
		};
	}
	const records = await readRegistryWorktrees(context.environment, { liveOnly: true });
	context.admission.assertCurrent();
	if (records.length === 0) return;
	const bases = /* @__PURE__ */ new Map();
	for (const record of records) bases.set(record.id, await realpathOrSelf(record.path));
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of params.candidatePaths) {
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		const real = await realpathOrSelf(candidate);
		for (const record of records) {
			const base = bases.get(record.id);
			if (base && (real === base || real.startsWith(`${base}${path.sep}`))) {
				context.admission.assertCurrent();
				return {
					context,
					record
				};
			}
		}
	}
	context.admission.assertCurrent();
}
async function deleteRunLeaseRowWithRetries(cleanup) {
	for (let attempt = 1; attempt <= RELEASE_MAX_ATTEMPTS; attempt += 1) try {
		await releaseWorktreeRunLeaseRowAsync(cleanup.env, cleanup.id, cleanup.token, cleanup.context);
		return true;
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) {
			cleanup.admissionSettled = false;
			throw error;
		}
		log.warn(`failed to release worktree run lease for ${cleanup.id} (attempt ${attempt}): ${formatErrorMessage(error)}`);
		if (attempt < RELEASE_MAX_ATTEMPTS) await sleep(25 * attempt);
	}
	return false;
}
async function runLeaseCleanup(cleanup) {
	if (!cleanup.admissionSettled) return false;
	try {
		if (!cleanup.rowDeleted) cleanup.rowDeleted = await deleteRunLeaseRowWithRetries(cleanup);
		if (cleanup.rowDeleted && (!cleanup.gitRetained || await releaseGitLock(cleanup))) {
			setWorktreeRunEndCleanupFailure(cleanup.context, cleanup);
			cleanup.failure = void 0;
			pendingLeaseCleanups.delete(cleanup);
			return true;
		}
		retainCleanupFailure(cleanup, /* @__PURE__ */ new Error("Managed worktree run lease cleanup did not settle; custody retained"));
		return false;
	} catch (error) {
		retainCleanupFailure(cleanup, error);
		throw error;
	}
}
function retainCleanupFailure(cleanup, error) {
	cleanup.failure = error;
	pendingLeaseCleanups.add(cleanup);
	setWorktreeRunEndCleanupFailure(cleanup.context, cleanup, { error });
}
async function drainPendingLeaseCleanups() {
	for (const cleanup of pendingLeaseCleanups) if (await runLeaseCleanup(cleanup)) pendingLeaseCleanups.delete(cleanup);
}
function ensureExitCleanupRegistered() {
	if (exitCleanupRegistered) return;
	exitCleanupRegistered = true;
	process.on("exit", () => {
		for (const cleanup of pendingLeaseCleanups) if (cleanup.admissionSettled && !cleanup.rowDeleted) try {
			cleanup.context.admission.assertCurrent();
			releaseWorktreeRunLeaseRow(cleanup.context.environment, cleanup.id, cleanup.token);
		} catch {}
	});
}
async function acquireWorktreeRunLease(id, opts = {}) {
	const ready = createDeferredCore();
	const releaseRequested = createDeferredCore();
	const settled = withWorktreeRunEnd(opts.source?.context.environment ?? opts.env ?? process.env, async () => {
		const lease = await acquireWorktreeRunLeaseInScope(id, opts);
		ready.resolve({
			id: lease.id,
			token: lease.token,
			release() {
				releaseRequested.resolve();
				return settled;
			}
		});
		await releaseRequested.promise;
		await lease.release();
	}, { independent: true });
	settled.catch(ready.reject);
	return ready.promise;
}
async function acquireWorktreeRunLeaseInScope(id, opts) {
	const env = opts.env ?? process.env;
	const context = opts.source?.context ?? captureOpenClawStateWorkerContext({ env });
	const observed = opts.source ? structuredClone(opts.source.record) : void 0;
	if (observed && observed.id !== id) throw new Error("Worktree run source belongs to another worktree");
	ensureExitCleanupRegistered();
	await drainPendingLeaseCleanups();
	const token = randomUUID();
	const pid = process.pid;
	const startTime = getFileLockProcessStartTime(pid);
	const cleanup = {
		env,
		context,
		id,
		token,
		rowDeleted: false,
		admissionSettled: false,
		gitRetained: false,
		refcountReleased: true
	};
	try {
		await admitWorktreeRunLeaseRowAsync(context, {
			worktreeId: id,
			token,
			pid,
			startTime,
			now: Date.now(),
			observed,
			...opts.exclusive || opts.allowMissingCheckout ? { exclusive: true } : {}
		}, (kind) => {
			cleanup.admissionSettled = kind !== "unknown";
			cleanup.rowDeleted = kind === "not-entered";
		});
		const record = opts.allowMissingCheckout ? await readRegistryWorktree(context, id) : void 0;
		if (!record || await worktreePathExists(record.path)) {
			await retainGitLock(context, id);
			cleanup.gitRetained = true;
			cleanup.refcountReleased = false;
		}
		context.admission.assertCurrent();
	} catch (error) {
		if (!await runLeaseCleanup(cleanup)) retainCleanupFailure(cleanup, error);
		throw error;
	}
	let release;
	return {
		id,
		token,
		release: () => release ??= runLeaseCleanup(cleanup).then((complete) => {
			if (!complete) throw toErrorObject(cleanup.failure, "Managed worktree run lease cleanup remains unsettled");
		})
	};
}
function claimWorktreeRemoval(env, params) {
	const pid = process.pid;
	return claimWorktreeRemovalRow(env, {
		...params,
		pid,
		startTime: getFileLockProcessStartTime(pid),
		now: Date.now()
	});
}
const testing = {
	drainPendingCleanupsForTest: drainPendingLeaseCleanups,
	resetForTest() {
		for (const cleanup of pendingLeaseCleanups) setWorktreeRunEndCleanupFailure(cleanup.context, cleanup);
		heldGitLocks.clear();
		gitLockTransitionTails.clear();
		pendingLeaseCleanups.clear();
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.worktreeRunLeaseTestApi")] = { testing };
//#endregion
export { reapWorktreeRunLeases as a, lockState as c, withGitLockTransition as i, lockWorktreeForProcess as l, claimWorktreeRemoval as n, assertManagedWorktreeRemovalComplete as o, resolveWorktreeForPath as r, createWorktreeGcPrefilter as s, acquireWorktreeRunLease as t, unlockWorktree as u };
