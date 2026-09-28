import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { a as parseWorkspaceInspectionResult, t as WORKSPACE_INSPECTION_COMMAND } from "./workspace-inspection-protocol-gfcfg3Iv.mjs";
import { a as normalizeRelativePath, d as sortWorkspaceEntries } from "./workspace-fs-DfgXp1be.mjs";
import { r as populateSessionFilePreview } from "./workspace-files-BAVuuBet.mjs";
import { n as readSessionRepositoryArtifacts } from "./session-repository-checkpoints-fQXt07uG.mjs";
import path from "node:path";
//#region src/gateway/server-methods/session-repository-artifacts.ts
async function readArtifacts(access, previewPath) {
	access.assertCurrent();
	if (!access.repository.checkpointRef) return;
	const snapshot = await readSessionRepositoryArtifacts({
		store: access.store,
		workspaceId: access.repository.workspaceId,
		checkpointRef: access.repository.checkpointRef,
		previewPath,
		assertCurrent: access.assertCurrent
	});
	access.assertCurrent();
	return snapshot;
}
function fileEntry(filePath, size) {
	return {
		path: filePath,
		workspacePath: filePath,
		name: path.posix.basename(filePath),
		kind: "modified",
		missing: size === void 0,
		...size === void 0 ? {} : { size }
	};
}
function artifactPath(requested) {
	const normalized = normalizeRelativePath(requested);
	return path.posix.isAbsolute(requested) || path.win32.isAbsolute(requested) || normalized.split("/").includes("..") ? void 0 : normalized;
}
/** Only cumulative changed artifacts are retained; no repository checkout is materialized. */
async function listRepositoryArtifacts(access, request) {
	const snapshot = await readArtifacts(access);
	const changed = new Map(snapshot?.changedEntries.filter((entry) => entry.type === "file").map((entry) => [entry.path, entry]) ?? []);
	const files = snapshot?.changes.map((entry) => fileEntry(entry.path, changed.get(entry.path)?.size)) ?? [];
	const folder = artifactPath(request.path ?? "");
	if (folder === void 0) return {
		gitCheckout: true,
		files
	};
	const entries = /* @__PURE__ */ new Map();
	const query = request.search?.trim().toLowerCase();
	for (const [filePath, entry] of changed) {
		if (query) {
			if (filePath.toLowerCase().includes(query)) entries.set(filePath, {
				path: filePath,
				name: path.posix.basename(filePath),
				kind: "file",
				size: entry.size,
				sessionKind: "modified"
			});
			continue;
		}
		const prefix = folder ? `${folder}/` : "";
		if (!filePath.startsWith(prefix)) continue;
		const remainder = filePath.slice(prefix.length);
		const name = remainder.split("/")[0];
		entries.set(`${prefix}${name}`, {
			path: `${prefix}${name}`,
			name,
			kind: remainder.includes("/") ? "directory" : "file",
			sessionKind: "modified",
			...remainder.includes("/") ? {} : { size: entry.size }
		});
	}
	const limit = query ? 500 : 250;
	const parent = path.posix.dirname(folder);
	return {
		gitCheckout: true,
		files,
		browser: {
			path: query ? "" : folder,
			...query ? { search: request.search } : folder ? { parentPath: parent === "." ? "" : parent } : {},
			entries: sortWorkspaceEntries([...entries.values()]).slice(0, limit),
			...entries.size > limit ? { truncated: true } : {}
		}
	};
}
async function getRepositoryArtifact(access, requestedPath) {
	const selected = artifactPath(requestedPath);
	const snapshot = await readArtifacts(access, selected);
	const entry = snapshot?.changedEntries.find((candidate) => candidate.path === selected);
	if (!snapshot || entry?.type !== "file") throw new Error("This file is not a retained changed artifact. Start the cloud session to read its repository files.");
	const file = fileEntry(entry.path, entry.size);
	if (snapshot.preview !== void 0) {
		const content = Buffer.from(snapshot.preview.buffer, snapshot.preview.byteOffset, snapshot.preview.byteLength);
		access.assertCurrent();
		await populateSessionFilePreview(file, content);
		delete file.hash;
	}
	access.assertCurrent();
	return { file };
}
async function loadRepositoryArtifactDiff(access, params) {
	const snapshot = await readArtifacts(access);
	return {
		sessionKey: params.sessionKey,
		branch: access.repository.branch,
		...access.repository.baseCommit ? { baseRef: access.repository.baseCommit } : {},
		files: !params.scope || params.scope === "all" ? snapshot?.changes ?? [] : [],
		additions: 0,
		deletions: 0,
		unavailableReason: "workspace_stopped"
	};
}
//#endregion
//#region src/gateway/server-methods/session-repository-workspace-access.ts
/** Repository identity never resolves through the Gateway's local workspace defaults. */
function resolveRepositoryWorkspaceAccess(loaded, context) {
	const entry = loaded.entry;
	const workspaceId = entry?.repositoryWorkspaceId;
	if (!workspaceId) return;
	const store = getSessionRepositoryWorkspaceStore();
	const repository = store.get(workspaceId);
	if (!repository || repository.agentId !== loaded.agentId || repository.sessionKey !== loaded.canonicalKey) throw new Error("The cloud repository workspace is unavailable for this session.");
	if (!entry?.sessionId) throw new Error("The cloud repository session is unavailable.");
	const sessionId = entry.sessionId;
	const assertSession = (expectedRevision) => {
		const current = loadGatewaySessionEntryReadOnly(loaded.canonicalKey, { agentId: repository.agentId });
		const source = store.get(workspaceId);
		if (current.entry?.sessionId !== sessionId || current.entry?.repositoryWorkspaceId !== workspaceId || (current.entry.lifecycleRevision ?? null) !== (entry.lifecycleRevision ?? null) || current.entry.archivedAt !== entry.archivedAt || source?.agentId !== repository.agentId || source.sessionKey !== repository.sessionKey || expectedRevision !== void 0 && source.revision !== expectedRevision) throw new Error("The cloud repository workspace owner changed; refresh this session.");
	};
	const placements = context?.workerSessionPlacementService;
	const environments = context?.workerEnvironmentService;
	const placement = placements?.getMany([sessionId]).get(sessionId);
	if (placement?.state !== "active" || !environments) return {
		kind: "stored",
		repository,
		store,
		assertCurrent: () => assertSession(repository.revision)
	};
	const assertCurrent = (expectedRevision) => {
		assertSession(expectedRevision);
		const current = placements?.getMany([sessionId]).get(sessionId);
		const environment = environments.get(placement.environmentId);
		if (current?.state !== "active" || current.agentId !== repository.agentId || current.sessionKey !== repository.sessionKey || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || environment?.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== sessionId) throw new Error("The cloud workspace placement changed; refresh this session.");
	};
	return {
		kind: "active",
		repository,
		async inspect(operation, request, authorize) {
			const assertAuthorized = () => {
				assertCurrent(operation === "set" ? void 0 : repository.revision);
				authorize?.();
			};
			const run = async (assertOperation = assertAuthorized) => {
				assertOperation();
				const tunnel = await environments.startTunnel({
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				});
				assertOperation();
				if (tunnel.environmentId !== placement.environmentId || tunnel.ownerEpoch !== placement.activeOwnerEpoch) throw new Error("The cloud workspace tunnel owner changed.");
				const result = await tunnel.runWorkspaceCommand({
					argv: [WORKSPACE_INSPECTION_COMMAND],
					input: JSON.stringify({
						...request,
						operation,
						sessionKey: repository.sessionKey
					}),
					transportRetry: operation === "set" ? "never" : "idempotent",
					assertCurrent: assertOperation,
					timeoutMs: 3e4
				});
				assertOperation();
				if (result.termination !== "exit" || result.code !== 0 || result.outputLimitExceeded) throw new Error("Cloud workspace inspection failed; reconnect the session runner and retry.");
				return parseWorkspaceInspectionResult(operation, result.stdout);
			};
			if (operation !== "set") return await run();
			const mutationService = context?.workerRepositoryWorkspaceMutationService;
			if (!mutationService) throw new Error("Cloud repository editing is unavailable; restart the Gateway and retry.");
			return await runExclusiveSessionLifecycleMutation({
				scope: loaded.storePath,
				identities: [
					loaded.canonicalKey,
					...loaded.storeKeys,
					sessionId
				],
				run: () => mutationService.mutate({
					sessionId,
					sessionKey: repository.sessionKey,
					agentId: repository.agentId,
					assertCurrent: assertAuthorized,
					mutate: async (assertMutationCurrent) => {
						const value = await run(() => {
							assertAuthorized();
							assertMutationCurrent();
						});
						return {
							changed: "status" in value && value.status === "updated",
							value
						};
					}
				})
			});
		}
	};
}
//#endregion
export { loadRepositoryArtifactDiff as i, getRepositoryArtifact as n, listRepositoryArtifacts as r, resolveRepositoryWorkspaceAccess as t };
