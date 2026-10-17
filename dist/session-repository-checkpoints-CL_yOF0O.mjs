import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { t as runGitWorkerOperation } from "./git-worker-pOqNR_b6.mjs";
import { g as parseWorkspaceManifestPair } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { a as workspaceResultCheckpointInitArgs, i as withWorkspaceResultRefMutation, n as requireWorkspaceResultGit, r as updateWorkspaceResultRefs } from "./workspace-result-git-KRqOPo1o.mjs";
import { c as preparedWorkerWorkspaceResultRef, d as withStagedWorkerWorkspaceResult, f as workerWorkspaceResultRef, p as workerWorkspaceResultStaging, r as deleteStagedWorkerWorkspaceResult } from "./workspace-result-staging-BH0OcWj7.mjs";
import { i as readGitHubRepositoryPublicationMetadata } from "./github-repository-publication-snapshot-BcNvA0c6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/session-repository-checkpoints.ts
const publicationRef = (ref) => workerWorkspaceResultRef(`publication-${createHash("sha256").update(ref).digest("hex")}`);
const workspaceLog = createSubsystemLogger("gateway/worker-workspace");
async function owner(params) {
	const store = params.store ?? getSessionRepositoryWorkspaceStore();
	const prepared = await store.prepare(params.workspaceId);
	const workspace = prepared.workspace;
	if (!workspace) throw new Error("Repository workspace no longer exists");
	return {
		store,
		workspace,
		current: prepared.current,
		root: store.artifactPath(params.workspaceId)
	};
}
function checkpointRef(workspace, ref) {
	const selected = ref ?? workspace.checkpointRef;
	if (!selected || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(selected)) throw new Error("Repository workspace has no valid checkpoint");
	return selected;
}
function assertBase(workspace, snapshot) {
	if (!workspace.baseCommit || snapshot.base.baseCommit !== workspace.baseCommit || snapshot.current.baseCommit !== workspace.baseCommit || snapshot.baseManifestRef !== workspace.baseManifestHash) throw new Error("Repository checkpoint does not match its pinned base");
	return workspace.baseCommit;
}
async function refObjects(root, refs, baseEnv) {
	const output = await requireWorkspaceResultGit(root, [
		"for-each-ref",
		"--format=%(refname) %(objectname)",
		...refs
	], { baseEnv });
	const objects = /* @__PURE__ */ new Map();
	for (const line of output.split("\n")) {
		const separator = line.indexOf(" ");
		const ref = line.slice(0, separator);
		if (refs.includes(ref)) objects.set(ref, line.slice(separator + 1));
	}
	return objects;
}
async function readSessionRepositoryArtifacts(params) {
	const { workspace, root } = await owner(params);
	const ref = checkpointRef(workspace, params.checkpointRef);
	const snapshot = await runGitWorkerOperation({
		type: "workspace.artifacts",
		input: {
			root,
			ref,
			previewPath: params.previewPath
		}
	}, { assertCurrent: params.assertCurrent });
	assertBase(workspace, snapshot);
	if (ref === workspace.checkpointRef && snapshot.currentManifestRef !== workspace.manifestHash) throw new Error("Repository checkpoint differs from its accepted manifest");
	return snapshot;
}
async function publicationBinding(root, currentManifestRef) {
	const raw = await fs.readFile(path.join(root, "binding.json"), "utf8");
	const binding = JSON.parse(raw);
	if (!isRecord(binding) || binding.currentManifestRef !== currentManifestRef || typeof binding.publicationDigest !== "string") throw new Error("Repository publication checkpoint binding changed");
	const { snapshot } = await readGitHubRepositoryPublicationMetadata(root, binding.publicationDigest);
	return {
		publicationDigest: binding.publicationDigest,
		snapshot
	};
}
async function withSessionRepositoryCheckpoint(params, use) {
	const { workspace, root } = await owner(params);
	const ref = checkpointRef(workspace, params.checkpointRef);
	return await withStagedWorkerWorkspaceResult({
		root,
		stagedResultRef: ref
	}, async (snapshot) => {
		assertBase(workspace, snapshot);
		if (ref === workspace.checkpointRef && snapshot.currentManifestRef !== workspace.manifestHash) throw new Error("Repository checkpoint differs from its accepted manifest");
		if (!params.includePublication) return await use(snapshot);
		let useStarted = false;
		try {
			const companion = publicationRef(ref);
			if (!(await refObjects(root, [companion])).get(companion)) {
				useStarted = true;
				return await use(snapshot);
			}
			return await withStagedWorkerWorkspaceResult({
				root,
				stagedResultRef: companion
			}, async (publication) => {
				const binding = await publicationBinding(publication.stagingRoot, snapshot.currentManifestRef);
				if (binding.snapshot.baseCommit !== workspace.baseCommit) throw new Error("Repository publication checkpoint base changed");
				useStarted = true;
				return await use({
					...snapshot,
					publicationStagingRoot: publication.stagingRoot,
					publicationDigest: binding.publicationDigest
				});
			});
		} catch (error) {
			if (useStarted) throw error;
			workspaceLog.warn(`Repository publication checkpoint unavailable: ${boundedWorkerError(error)}`);
			return await use(snapshot);
		}
	});
}
async function recoverSessionRepositoryCheckpoint(params) {
	const { store, workspace, current: currentWorkspace } = await owner(params);
	const snapshot = await readSessionRepositoryArtifacts(params);
	params.assertCurrent();
	const current = currentWorkspace();
	if (current?.checkpointRef === params.checkpointRef && current.manifestHash === snapshot.currentManifestRef) return current;
	return store.acceptCheckpoint({
		workspaceId: params.workspaceId,
		expectedRevision: params.expectedRevision ?? workspace.revision,
		checkpointRef: params.checkpointRef,
		manifestHash: snapshot.currentManifestRef,
		assertCurrent: params.assertCurrent
	});
}
async function stageSessionRepositoryCheckpoint(params) {
	const { store, workspace, current: currentWorkspace, root } = await owner(params);
	params.assertCurrent();
	const ref = checkpointRef(workspace, params.checkpointRef ?? workerWorkspaceResultRef(randomUUID()));
	const candidateRef = preparedWorkerWorkspaceResultRef(workerWorkspaceResultRef(randomUUID()));
	const companionCandidate = preparedWorkerWorkspaceResultRef(workerWorkspaceResultRef(randomUUID()));
	const { base, current } = await parseWorkspaceManifestPair({
		baseRaw: params.baseManifestRaw,
		baseRef: params.baseManifestRef,
		currentRaw: params.currentManifestRaw,
		currentRef: params.currentManifestRef
	});
	const baseCommit = assertBase(workspace, {
		base,
		current,
		baseManifestRef: params.baseManifestRef
	});
	const assertRevision = () => {
		params.assertCurrent();
		const latest = currentWorkspace();
		if (!latest || latest.revision !== params.expectedRevision && !(latest.checkpointRef === ref && latest.manifestHash === params.currentManifestRef)) throw new Error("Repository workspace revision changed");
	};
	assertRevision();
	await fs.mkdir(root, {
		recursive: true,
		mode: 448
	});
	assertRevision();
	await requireWorkspaceResultGit(root, workspaceResultCheckpointInitArgs());
	assertRevision();
	let discardPromise;
	const discard = () => {
		discardPromise ??= updateWorkspaceResultRefs(root, [{ ref: candidateRef }, { ref: companionCandidate }]).catch((error) => {
			discardPromise = void 0;
			throw error;
		});
		return discardPromise;
	};
	try {
		const objectId = await workerWorkspaceResultStaging.stageWorkerWorkspaceResult({
			...params,
			root,
			stagedResultRef: candidateRef,
			assertCurrent: assertRevision
		});
		assertRevision();
		let companionId;
		if (params.publicationStagingRoot || params.publicationDigest) try {
			if (!params.publicationStagingRoot || !params.publicationDigest) throw new Error("Repository publication checkpoint is incomplete");
			const { publicationStagingRoot, publicationDigest, currentManifestRef } = params;
			assertRevision();
			const { raw: metadata, snapshot } = await readGitHubRepositoryPublicationMetadata(publicationStagingRoot, publicationDigest);
			if (snapshot.baseCommit !== baseCommit) throw new Error("Repository publication checkpoint base changed");
			assertRevision();
			companionId = await workerWorkspaceResultStaging.stageWorkerWorkspaceResult({
				root,
				assertCurrent: assertRevision,
				stagedResultRef: companionCandidate,
				stagingRoot: publicationStagingRoot,
				publication: {
					metadata,
					publicationDigest,
					currentManifestRef,
					baseCommit
				}
			});
		} catch (error) {
			await deleteStagedWorkerWorkspaceResult({
				root,
				stagedResultRef: companionCandidate
			});
			assertRevision();
			workspaceLog.warn(`Repository publication checkpoint unavailable: ${boundedWorkerError(error)}`);
		}
		const verify = async () => {
			const objects = (await requireWorkspaceResultGit(root, [
				"rev-parse",
				`${candidateRef}^{commit}`,
				...companionId ? [`${companionCandidate}^{commit}`] : []
			])).split("\n");
			if (objects[0] !== objectId) throw new Error("Repository checkpoint preparation changed");
			if (companionId && objects[1] !== companionId) throw new Error("Repository publication preparation changed");
			assertRevision();
		};
		await verify();
		return {
			checkpointRef: ref,
			verify,
			discard,
			publish: async () => {
				await withWorkspaceResultRefMutation(root, async (baseEnv) => {
					const updates = [];
					const targets = [[ref, objectId], [publicationRef(ref), companionId]];
					const existingObjects = await refObjects(root, targets.map(([target]) => target), baseEnv);
					for (const [target, expected] of targets) {
						const existing = existingObjects.get(target);
						if (existing !== void 0 && existing !== expected) throw new Error("Repository checkpoint identity already contains a different result");
						if (expected !== void 0 && existing === void 0) updates.push(`create ${target}\0${expected}\0`);
					}
					assertRevision();
					if (updates.length) await requireWorkspaceResultGit(root, [
						"update-ref",
						"--stdin",
						"-z"
					], {
						input: Buffer.from(updates.join("")),
						baseEnv,
						beforeInput: assertRevision
					});
				});
				const accepted = await recoverSessionRepositoryCheckpoint({
					...params,
					store,
					checkpointRef: ref
				});
				await discard();
				return accepted;
			}
		};
	} catch (error) {
		await discard();
		throw error;
	}
}
async function forkSessionRepositoryWorkspace(params) {
	const store = params.store ?? getSessionRepositoryWorkspaceStore();
	const sourceContext = captureOpenClawStateWorkerContext({ path: store.path });
	const assertCurrent = () => {
		sourceContext.admission.assertCurrent();
		params.assertCurrent();
	};
	const source = (await owner({
		workspaceId: params.sourceWorkspaceId,
		store
	})).workspace;
	if (await store.find(params) !== void 0) throw new Error("Fork session already owns a repository workspace");
	let target = await store.create({
		...params,
		url: source.url,
		requestedRef: source.requestedRef ?? void 0,
		runSetupScript: source.runSetupScript,
		assertCurrent
	});
	try {
		assertCurrent();
		if (source.baseCommit) target = await store.bindBase({
			workspaceId: target.workspaceId,
			expectedRevision: target.revision,
			baseCommit: source.baseCommit,
			baseManifestHash: source.baseManifestHash ?? void 0,
			assertCurrent
		});
		if (source.checkpointRef) target = await withSessionRepositoryCheckpoint({
			workspaceId: source.workspaceId,
			store,
			includePublication: true
		}, async (snapshot) => {
			const prepared = await stageSessionRepositoryCheckpoint({
				...snapshot,
				store,
				workspaceId: target.workspaceId,
				expectedRevision: target.revision,
				assertCurrent
			});
			try {
				return await prepared.publish();
			} finally {
				await prepared.discard();
			}
		});
		assertCurrent();
		return target;
	} catch (error) {
		await store.delete({
			workspaceId: target.workspaceId,
			assertCurrent: () => sourceContext.admission.assertCurrent()
		});
		throw error;
	}
}
//#endregion
export { withSessionRepositoryCheckpoint as a, stageSessionRepositoryCheckpoint as i, readSessionRepositoryArtifacts as n, recoverSessionRepositoryCheckpoint as r, forkSessionRepositoryWorkspace as t };
