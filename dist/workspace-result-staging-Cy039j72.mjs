import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { i as runCommandWithTimeout, n as runExec } from "./exec-shcN2-sN.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { h as withWorkspaceHashMemo, m as withWorkspaceHashContext, r as activeWorkspaceHashContext } from "./workspace-hash-memo-R41irJvf.mjs";
import { i as parseChangedWorkspaceResult } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { a as WORKER_RESULT_REF_PREFIX, i as WORKER_RESULT_CLEANUP_REF_PREFIX, o as requireWorkerResultStorageRef, r as WORKER_RESULT_CANDIDATE_REF_PREFIX } from "./workspace-result-inventory-TtCqUwu3.mjs";
import { a as localPath, b as readStagedWorkspaceManifestEntries, p as loadStagedWorkspaceManifest, v as prepareWorkspaceStageInput } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { o as assertWorkspaceMatchesManifest, s as inspectAcceptedWorkerWorkspace, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BoiN2pej.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { a as workspaceResultGitCommand, i as withWorkspaceResultRefMutation, n as requireWorkspaceResultGit, r as updateWorkspaceResultRefs, t as WORKSPACE_RESULT_GIT_TIMEOUT_MS } from "./workspace-result-git-BW82KNsM.mjs";
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
async function ensureWorkerWorkspaceResultRepository(root) {
	const resolved = await fs.realpath(root);
	const probe = await runCommandWithTimeout(workspaceResultGitCommand(resolved, ["rev-parse", "--git-dir"]), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576
	});
	if (probe.termination === "exit" && probe.code === 0) return resolved;
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
	const root = await ensureWorkerWorkspaceResultRepository(params.root);
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	const temporary = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-workspace-import-"));
	try {
		const inputPath = path.join(temporary, "fast-import");
		await prepareWorkspaceStageInput({
			...params,
			inputPath
		});
		const input = await fs.open(inputPath, "r");
		try {
			await withWorkspaceResultRefMutation(root, (baseEnv) => runExec("git", workspaceResultGitCommand(root, ["fast-import", "--quiet"]).slice(1), {
				baseEnv,
				stdinFileDescriptor: input.fd,
				timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
				maxBuffer: 1048576
			}));
		} finally {
			await input.close();
		}
		return await requireWorkspaceResultGit(root, ["rev-parse", `${stagedResultRef}^{commit}`]);
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function materializeStagedEntry(params) {
	const target = localPath(params.root, params.entry.path);
	await fs.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	if (params.entry.type === "symlink") {
		await fs.symlink(params.entry.target, target);
		return;
	}
	if (!params.content) throw new Error(`Cloud workspace staged content is missing: ${params.entry.path}`);
	await fs.writeFile(target, params.content, {
		mode: params.entry.mode,
		flag: "wx"
	});
	await fs.chmod(target, params.entry.mode);
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
			writes.push(() => materializeStagedEntry({
				root: stagingRoot,
				entry,
				content
			}));
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
	return await withWorkspaceHashContext(async () => await applyStagedWorkerWorkspaceResultWithMemo(params));
}
async function applyStagedWorkerWorkspaceResultWithMemo(params) {
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
		params.journal.commit(accepted.manifestRef);
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
				acceptance: {
					kind: "reconcile",
					publish: params.publishAcceptedManifest
				}
			}),
			changed: staged.changed
		};
	});
}
async function prepareRequestedWorkerWorkspaceResult(params) {
	const stagedResult = params.request.stagedResult;
	if (!stagedResult) throw new Error("Cloud workspace durable result staging was not requested");
	const candidateRef = preparedWorkerWorkspaceResultRef(stagedResult.ref);
	const active = activeWorkspaceHashContext();
	const hashMemo = active?.memo ?? /* @__PURE__ */ new Map();
	const metrics = active?.metrics;
	let appliedWorkspaceResult;
	await stageWorkerWorkspaceResult({
		root: params.request.localPath,
		stagingRoot: params.stagingRoot,
		stagedResultRef: candidateRef,
		baseManifestRef: params.request.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseManifestRaw: params.baseManifestRaw,
		currentManifestRaw: params.currentManifestRaw
	});
	return {
		applyPreparedStagedResult: async () => {
			const root = await ensureWorkerWorkspaceResultRepository(params.request.localPath);
			appliedWorkspaceResult = await withWorkspaceHashMemo(hashMemo, async () => await applyStagedWorkerWorkspaceResult({
				root,
				stagedResultRef: candidateRef,
				expectedBaseManifestRef: params.request.baseManifestRef,
				journal: params.request.journal,
				publishAcceptedManifest: params.publishAcceptedManifest
			}), metrics);
		},
		getAppliedWorkspaceResult: () => appliedWorkspaceResult,
		verifyLocalStable: async () => {
			if (!appliedWorkspaceResult) throw new Error("Cloud workspace staged result has not been applied");
			await appliedWorkspaceResult.verifyLocalStable();
		},
		publishStagedResult: async () => {
			const root = await ensureWorkerWorkspaceResultRepository(params.request.localPath);
			const commit = await requireWorkspaceResultGit(root, ["rev-parse", `${candidateRef}^{commit}`]);
			await updateWorkspaceResultRefs(root, [{
				ref: stagedResult.ref,
				objectId: commit
			}, { ref: candidateRef }]);
			stagedResult.record(stagedResult.ref);
		},
		discardPreparedStagedResult: async () => {
			await deleteStagedWorkerWorkspaceResult({
				root: params.request.localPath,
				stagedResultRef: candidateRef
			});
		}
	};
}
async function deleteStagedWorkerWorkspaceResult(params) {
	const root = await fs.realpath(params.root);
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	await updateWorkspaceResultRefs(root, [{ ref: stagedResultRef }, ...stagedResultRef.startsWith(`refs/openclaw/worker-results/`) ? [{ ref: preparedWorkerWorkspaceResultRef(stagedResultRef) }] : []]);
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
	]);
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
	}, { ref: cleanupRef }]);
}
async function deleteWorkerWorkspaceResultCleanupRefs(params) {
	const root = await fs.realpath(params.root);
	const cleanupRefs = (await requireWorkspaceResultGit(root, [
		"for-each-ref",
		"--format=%(refname)",
		`${WORKER_RESULT_CLEANUP_REF_PREFIX}/`
	])).split("\n").filter(Boolean);
	if (cleanupRefs.length > 0) await updateWorkspaceResultRefs(root, () => {
		const retainedRefs = params.retainedRefs?.();
		return cleanupRefs.map(requireWorkerResultStorageRef).filter((ref) => !retainedRefs?.has(ref)).map((ref) => ({ ref }));
	});
}
const workerWorkspaceResultStaging = {
	prepareRequestedWorkerWorkspaceResult,
	stageWorkerWorkspaceResult
};
//#endregion
export { hasWorkerWorkspaceResultRef as a, preparedWorkerWorkspaceResultRef as c, withStagedWorkerWorkspaceResult as d, workerWorkspaceResultRef as f, deleteWorkerWorkspaceResultCleanupRefs as i, readStagedWorkerWorkspaceResult as l, workerWorkspaceTransferPaths as m, cleanupWorkerWorkspaceResultRef as n, isWorkerWorkspaceResultCleanupRef as o, workerWorkspaceResultStaging as p, deleteStagedWorkerWorkspaceResult as r, moveStagedWorkerWorkspaceResultToCleanup as s, applyStagedWorkerWorkspaceResult as t, restoreStagedWorkerWorkspaceResultFromCleanup as u };
