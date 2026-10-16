import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as runCommandWithTimeout, n as runExec } from "./exec-DJvyCA0D.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { h as withWorkspaceHashMemo, i as activeWorkspaceHashContext, m as withWorkspaceHashContext } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { i as parseChangedWorkspaceResult } from "./workspace-manifest-comparison-BXiy_dh_.mjs";
import { a as WORKER_RESULT_REF_PREFIX, i as WORKER_RESULT_CLEANUP_REF_PREFIX, o as requireWorkerResultStorageRef, r as WORKER_RESULT_CANDIDATE_REF_PREFIX } from "./workspace-result-inventory-TtCqUwu3.mjs";
import { a as localPath, b as readStagedWorkspaceManifestEntries, m as loadStagedWorkspaceManifest, v as prepareWorkspaceStageInput } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { a as assertWorkspaceMatchesManifest, o as inspectAcceptedWorkerWorkspace, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-DEtkg-5s.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { i as withWorkspaceResultRefMutation, n as requireWorkspaceResultGit, o as workspaceResultGitCommand, r as updateWorkspaceResultRefs, t as WORKSPACE_RESULT_GIT_TIMEOUT_MS } from "./workspace-result-git-KRqOPo1o.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-result-staging.ts
const WORKER_RESULT_CLAIM_ID_PATTERN = /^[A-Za-z0-9-]+$/u;
const workspaceLog = createSubsystemLogger("gateway/worker-workspace");
function workerWorkspaceTransferPaths(current, base, signal) {
	signal?.throwIfAborted();
	return parseChangedWorkspaceResult(base, current).entries.map((entry) => entry.path);
}
function requireWorkerResultRef(ref) {
	if (!ref.startsWith(`refs/openclaw/worker-results/`)) throw new Error("Cloud workspace staged result reference is invalid");
	return requireWorkerResultStorageRef(ref);
}
function workerWorkspaceResultRef(claimId) {
	if (!WORKER_RESULT_CLAIM_ID_PATTERN.test(claimId)) throw new Error("Cloud workspace result claim id is invalid");
	return `${WORKER_RESULT_REF_PREFIX}/${claimId}`;
}
function preparedWorkerWorkspaceResultRef(stagedResultRef) {
	const ref = requireWorkerResultRef(stagedResultRef);
	return `${WORKER_RESULT_CANDIDATE_REF_PREFIX}/${ref.slice(WORKER_RESULT_REF_PREFIX.length + 1)}`;
}
function cleanupWorkerWorkspaceResultRef(stagedResultRef) {
	const ref = requireWorkerResultRef(stagedResultRef);
	return `${WORKER_RESULT_CLEANUP_REF_PREFIX}/${ref.slice(WORKER_RESULT_REF_PREFIX.length + 1)}`;
}
function isWorkerWorkspaceResultCleanupRef(ref) {
	return ref.startsWith(`${WORKER_RESULT_CLEANUP_REF_PREFIX}/`);
}
async function hasGitAdminPath(root) {
	let current = root;
	while (true) {
		try {
			await fs.lstat(path.join(current, ".git"));
			return true;
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		const parent = path.dirname(current);
		if (parent === current) return false;
		current = parent;
	}
}
async function ensureWorkerWorkspaceResultRepository(root, assertCurrent) {
	const resolved = await fs.realpath(root);
	const probe = await runCommandWithTimeout(workspaceResultGitCommand(resolved, ["rev-parse", "--git-dir"]), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576
	});
	if (probe.termination === "exit" && probe.code === 0) return resolved;
	assertCurrent?.();
	await requireWorkspaceResultGit(resolved, [
		"init",
		"--quiet",
		"--object-format=sha1"
	]);
	return resolved;
}
async function hasWorkerWorkspaceResultRef(params) {
	let root;
	try {
		root = await fs.realpath(params.root);
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
	if (!await hasGitAdminPath(root)) {
		const bare = await runCommandWithTimeout(workspaceResultGitCommand(root, ["rev-parse", "--is-bare-repository"]), {
			timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
			maxOutputBytes: 1024
		});
		if (bare.termination !== "exit" || bare.code !== 0 || bare.stdout.trim() !== "true") return false;
	}
	const result = await runCommandWithTimeout(workspaceResultGitCommand(root, [
		"show-ref",
		"--verify",
		"--quiet",
		requireWorkerResultStorageRef(params.stagedResultRef)
	]), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576
	});
	if (result.termination === "exit" && result.code === 0) return true;
	if (result.termination === "exit" && result.code === 1) return false;
	throw new Error((result.stderr || result.stdout || "git show-ref failed").trim());
}
async function stageWorkerWorkspaceResult(params) {
	const root = await ensureWorkerWorkspaceResultRepository(params.root, params.assertCurrent);
	params.assertCurrent?.();
	const temporary = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-workspace-import-"));
	try {
		const inputPath = path.join(temporary, "fast-import");
		params.assertCurrent?.();
		await prepareWorkspaceStageInput({
			...params,
			inputPath
		});
		params.assertCurrent?.();
		const input = await fs.open(inputPath, "r");
		try {
			const { stdout } = await withWorkspaceResultRefMutation(root, (baseEnv) => {
				params.assertCurrent?.();
				return runExec("git", workspaceResultGitCommand(root, ["fast-import", "--quiet"]).slice(1), {
					baseEnv,
					stdinFileDescriptor: input.fd,
					timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
					maxBuffer: 1048576
				});
			});
			return stdout.trim();
		} finally {
			await input.close();
		}
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function readStagedWorkerWorkspaceResult(root, stagedResultRef) {
	const { objectsByPath, ...snapshot } = await loadStagedWorkspaceManifest(root, stagedResultRef);
	const readEntries = () => readStagedWorkspaceManifestEntries({
		root,
		objectsByPath,
		entries: snapshot.changedEntries
	});
	return {
		...snapshot,
		readEntries
	};
}
async function withStagedWorkerWorkspaceResult(params, use) {
	return await withMaterializedWorkerWorkspaceResult(await readStagedWorkerWorkspaceResult(params.root, params.stagedResultRef), use);
}
async function withMaterializedWorkerWorkspaceResult(snapshot, use) {
	const stagingRoot = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-checkpoint-payload-"));
	try {
		let writes = [];
		const flush = async () => {
			const result = await runTasksWithConcurrency({
				tasks: writes,
				limit: 4,
				errorMode: "stop"
			});
			writes = [];
			if (result.hasError) throw result.firstError;
		};
		for await (const { entry, content } of snapshot.readEntries()) {
			writes.push(async () => {
				const target = localPath(stagingRoot, entry.path);
				await fs.mkdir(path.dirname(target), {
					recursive: true,
					mode: 448
				});
				if (entry.type === "symlink") {
					await fs.symlink(entry.target, target);
					return;
				}
				if (!content) throw new Error(`Cloud workspace staged content is missing: ${entry.path}`);
				await fs.writeFile(target, content, {
					mode: entry.mode,
					flag: "wx"
				});
				await fs.chmod(target, entry.mode);
			});
			if (writes.length === 4) await flush();
		}
		await flush();
		await assertWorkspaceMatchesManifest({
			root: stagingRoot,
			manifest: snapshot.current,
			entries: snapshot.changedEntries
		});
		return await use({
			...snapshot,
			stagingRoot
		});
	} finally {
		await runBestEffortCleanup({
			cleanup: () => fs.rm(stagingRoot, {
				recursive: true,
				force: true
			}),
			onError: (error) => workspaceLog.warn(`worker workspace staging cleanup failed: ${boundedWorkerError(error)}`)
		});
	}
}
async function applyStagedWorkerWorkspaceResult(params) {
	return await withWorkspaceHashContext(async () => {
		const root = await fs.realpath(params.root);
		const staged = await readStagedWorkerWorkspaceResult(root, params.stagedResultRef);
		if (params.alreadyAccepted || staged.baseManifestRef !== params.expectedBaseManifestRef) {
			const accepted = await inspectAcceptedWorkerWorkspace({
				root,
				expectedManifestRef: params.expectedBaseManifestRef,
				allowAdvancedLocalState: true,
				base: staged.base,
				current: staged.current
			});
			if (!accepted) throw new Error("Cloud workspace staged result does not match the placement base");
			params.assertCurrent?.();
			await params.journal.commit(accepted.manifestRef);
			return {
				...accepted,
				changed: staged.changed
			};
		}
		return await withMaterializedWorkerWorkspaceResult(staged, async ({ stagingRoot }) => {
			return {
				...await applyStagedWorkerWorkspace({
					root,
					stagingRoot,
					baseManifestRef: staged.baseManifestRef,
					currentManifestRef: staged.currentManifestRef,
					base: staged.base,
					current: staged.current,
					journal: params.journal,
					assertCurrent: params.assertCurrent,
					acceptance: {
						kind: "reconcile",
						publish: params.publishAcceptedManifest
					}
				}),
				changed: staged.changed
			};
		});
	});
}
async function prepareRequestedWorkerWorkspaceResult(params) {
	const stagedResult = params.request.stagedResult;
	const candidateRef = preparedWorkerWorkspaceResultRef(stagedResult.ref);
	const { memo: hashMemo = /* @__PURE__ */ new Map(), metrics } = activeWorkspaceHashContext() ?? {};
	let appliedWorkspaceResult;
	const root = await fs.realpath(params.request.localPath);
	const commit = await stageWorkerWorkspaceResult({
		root,
		stagingRoot: params.stagingRoot,
		stagedResultRef: candidateRef,
		baseManifestRef: params.request.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseManifestRaw: params.baseManifestRaw,
		currentManifestRaw: params.currentManifestRaw,
		assertCurrent: params.request.assertCurrent
	});
	const unchanged = params.unchanged;
	const applyPreparedStagedResult = async () => {
		if (unchanged) {
			await unchanged.verifyLocalStable();
			params.request.assertCurrent?.();
			await params.request.journal.commit(unchanged.manifestRef);
			appliedWorkspaceResult = unchanged;
			return;
		}
		appliedWorkspaceResult = await withWorkspaceHashMemo(hashMemo, async () => await applyStagedWorkerWorkspaceResult({
			root,
			stagedResultRef: candidateRef,
			expectedBaseManifestRef: params.request.baseManifestRef,
			journal: params.request.journal,
			assertCurrent: params.request.assertCurrent,
			publishAcceptedManifest: params.publishAcceptedManifest
		}), metrics);
	};
	return {
		applyPreparedStagedResult,
		...unchanged ? { acceptUnchangedStagedResult: applyPreparedStagedResult } : {},
		getAppliedWorkspaceResult: () => appliedWorkspaceResult,
		verifyLocalStable: async () => {
			const local = appliedWorkspaceResult ?? unchanged;
			if (!local) throw new Error("Cloud workspace staged result has not been applied");
			await local.verifyLocalStable();
		},
		publishStagedResult: async () => {
			await updateWorkspaceResultRefs(root, [{
				ref: stagedResult.ref,
				objectId: commit
			}, { ref: candidateRef }], params.request.assertCurrent);
			params.request.assertCurrent?.();
			await stagedResult.record(stagedResult.ref);
			params.request.assertCurrent?.();
		},
		discardPreparedStagedResult: async () => {
			await deleteStagedWorkerWorkspaceResult({
				root: params.request.localPath,
				stagedResultRef: candidateRef,
				assertCurrent: params.request.assertCurrent
			});
		}
	};
}
async function deleteStagedWorkerWorkspaceResult(params) {
	const root = await fs.realpath(params.root);
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	await updateWorkspaceResultRefs(root, [{ ref: stagedResultRef }, ...stagedResultRef.startsWith(`refs/openclaw/worker-results/`) ? [{ ref: preparedWorkerWorkspaceResultRef(stagedResultRef) }] : []], params.assertCurrent);
}
async function moveStagedWorkerWorkspaceResultToCleanup(params) {
	const root = await fs.realpath(params.root);
	const stagedResultRef = requireWorkerResultRef(params.stagedResultRef);
	const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
	const commit = await requireWorkspaceResultGit(root, ["rev-parse", `${stagedResultRef}^{commit}`]);
	await updateWorkspaceResultRefs(root, [
		{
			ref: cleanupRef,
			objectId: commit
		},
		{ ref: stagedResultRef },
		{ ref: preparedWorkerWorkspaceResultRef(stagedResultRef) }
	], params.assertCurrent);
	return cleanupRef;
}
async function restoreStagedWorkerWorkspaceResultFromCleanup(params) {
	const root = await fs.realpath(params.root);
	const cleanupRef = requireWorkerResultStorageRef(params.cleanupRef);
	if (!isWorkerWorkspaceResultCleanupRef(cleanupRef)) throw new Error("Cloud workspace cleanup result reference is invalid");
	const stagedResultRef = requireWorkerResultRef(params.stagedResultRef);
	const commit = await requireWorkspaceResultGit(root, ["rev-parse", `${cleanupRef}^{commit}`]);
	await updateWorkspaceResultRefs(root, [{
		ref: stagedResultRef,
		objectId: commit
	}, { ref: cleanupRef }], params.assertCurrent);
}
async function deleteWorkerWorkspaceResultCleanupRefs(params) {
	const root = await fs.realpath(params.root);
	const cleanupRefs = (await requireWorkspaceResultGit(root, [
		"for-each-ref",
		"--format=%(refname)",
		`${WORKER_RESULT_CLEANUP_REF_PREFIX}/`
	])).split("\n").filter(Boolean);
	if (cleanupRefs.length > 0) await updateWorkspaceResultRefs(root, async () => {
		const retainedRefs = await params.retainedRefs?.();
		return cleanupRefs.map(requireWorkerResultStorageRef).filter((ref) => !retainedRefs?.has(ref)).map((ref) => ({ ref }));
	});
}
const workerWorkspaceResultStaging = {
	prepareRequestedWorkerWorkspaceResult,
	stageWorkerWorkspaceResult
};
//#endregion
export { hasWorkerWorkspaceResultRef as a, preparedWorkerWorkspaceResultRef as c, withStagedWorkerWorkspaceResult as d, workerWorkspaceResultRef as f, deleteWorkerWorkspaceResultCleanupRefs as i, readStagedWorkerWorkspaceResult as l, workerWorkspaceTransferPaths as m, cleanupWorkerWorkspaceResultRef as n, isWorkerWorkspaceResultCleanupRef as o, workerWorkspaceResultStaging as p, deleteStagedWorkerWorkspaceResult as r, moveStagedWorkerWorkspaceResultToCleanup as s, applyStagedWorkerWorkspaceResult as t, restoreStagedWorkerWorkspaceResultFromCleanup as u };
