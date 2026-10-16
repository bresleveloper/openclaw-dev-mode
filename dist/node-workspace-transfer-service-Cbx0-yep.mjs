import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import { i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { d as computeWorkspaceFileSnapshot, u as captureWorkspaceSnapshot } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-4x9Itm3z.mjs";
import { a as prepareNodeWorkspaceTransferSnapshot, i as nodeWorkspaceTransferEntryPath, r as readNodeWorkspaceUpload } from "./node-workspace-upload-reader-AYpk0XZE.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/node-workspace-transfer-owner.ts
function isNodeWorkspaceTransferOwnerCurrent(binding, owner) {
	const environment = owner?.environment;
	const credential = owner?.credential;
	return Boolean(environment && credential && environment.state === "attached" && environment.destroyRequestedAtMs === null && environment.ownerEpoch === binding.ownerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === binding.sessionId && credential.ownerEpoch === binding.ownerEpoch && credential.sessionId === binding.sessionId);
}
function createNodeWorkspaceSyncAuthorization(owner, authorize, getOwner) {
	return {
		assertCurrent: () => {
			owner.signal?.throwIfAborted();
			authorize?.();
			if (!owner.isAuthorized() || !isNodeWorkspaceTransferOwnerCurrent(owner, getOwner(owner.environmentId))) throw new Error("Node workspace transfer owner is no longer current");
		},
		isOperationAuthorized: () => {
			try {
				authorize?.();
				return true;
			} catch {
				return false;
			}
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-transfer-service.ts
const TRANSFER_TIMEOUT_MS = 6e5;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
function createNodeWorkspaceTransferService(options) {
	const contexts = /* @__PURE__ */ new Map();
	const contextOperations = new KeyedAsyncQueue();
	const now = options.now ?? Date.now;
	const temporaryBaseRoot = options.temporaryRoot ?? path.join(resolveStateDir(), "tmp", "node-workspace-transfer");
	let temporaryRootReady;
	const ensureTemporaryRoot = () => {
		temporaryRootReady ??= (async () => {
			await fs.rm(temporaryBaseRoot, {
				recursive: true,
				force: true
			});
			await fs.mkdir(temporaryBaseRoot, {
				recursive: true,
				mode: 448
			});
		})();
		return temporaryRootReady;
	};
	const isCurrentContext = (context) => contexts.get(context.environmentId) === context && !context.signal.aborted && context.isAuthorized() && isNodeWorkspaceTransferOwnerCurrent(context, options.getOwner(context.environmentId));
	const discardUpload = (context, operation) => {
		if (!operation.disposal) {
			operation.abortController.abort(/* @__PURE__ */ new Error("Node workspace upload discarded"));
			operation.disposal = (async () => {
				const receiving = operation.receiving;
				try {
					await receiving?.result.catch((error) => {
						if (!receiving.signal.aborted || error !== receiving.signal.reason) throw error;
					});
				} finally {
					try {
						if (operation.uploaded) await fs.rm(operation.uploaded.stagingRoot, {
							recursive: true,
							force: true
						});
					} finally {
						if (context.upload === operation) context.upload = void 0;
					}
				}
			})();
		}
		return operation.disposal;
	};
	const closeContext = async (context) => {
		if (!context.signal.aborted) context.abortController.abort(/* @__PURE__ */ new Error("Node workspace transfer context closed"));
		const settled = await Promise.allSettled([context.pack?.catch(() => void 0), context.upload ? discardUpload(context, context.upload) : void 0]);
		await fs.rm(context.temporaryRoot, {
			recursive: true,
			force: true
		});
		if (contexts.get(context.environmentId) === context) contexts.delete(context.environmentId);
		const failed = settled.find((result) => result.status === "rejected");
		if (failed) throw failed.reason;
	};
	const closeEnvironment = (environmentId) => contextOperations.enqueue(environmentId, async () => {
		const context = contexts.get(environmentId);
		if (context) await closeContext(context);
	});
	const mintDownload = (context, manifestRef, isAuthorized, signal) => {
		signal?.throwIfAborted();
		if (!isCurrentContext(context) || !isAuthorized()) throw new Error("Node workspace transfer owner is no longer current");
		const token = generateSecureToken({
			bytes: 32,
			redact: true
		});
		context.downloads.set(token, {
			direction: "download",
			token,
			manifestRef,
			expiresAtMs: now() + TRANSFER_TIMEOUT_MS,
			isAuthorized,
			...signal ? { signal } : {}
		});
		return token;
	};
	const pruneSnapshots = (context) => {
		const retained = /* @__PURE__ */ new Set([context.currentManifestRef, ...[...context.downloads.values()].map((download) => download.manifestRef)]);
		for (const manifestRef of context.snapshots.keys()) if (!retained.has(manifestRef)) context.snapshots.delete(manifestRef);
	};
	const authorizationCurrent = (authorization) => {
		const { capability, context } = authorization;
		if (!isCurrentContext(context) || capability.expiresAtMs <= now()) return false;
		return capability.direction === "download" ? context.downloads.get(capability.token) === capability && !capability.signal?.aborted && capability.isAuthorized() : context.upload === capability && capability.isAuthorized() && !capability.abortController.signal.aborted && (capability.state === "receiving" || capability.state === "completed");
	};
	const assertAuthorizationCurrent = (authorization) => {
		if (!authorizationCurrent(authorization)) throw new Error("Workspace transfer authority closed");
	};
	const routeMatchesDownload = (context, capability, route) => {
		if (route.direction !== "download" || route.environmentId !== context.environmentId) return false;
		return route.kind === "blob" ? Boolean(context.snapshots.get(capability.manifestRef)?.manifest.entries.some((entry) => entry.type === "file" && entry.sha256 === route.sha256)) : route.manifestRef === capability.manifestRef;
	};
	async function replaceContext(params) {
		const { authorize, ...owner } = params;
		const { assertCurrent, isOperationAuthorized } = createNodeWorkspaceSyncAuthorization(owner, authorize, options.getOwner);
		return await contextOperations.enqueue(params.environmentId, async () => {
			assertCurrent();
			const previous = contexts.get(params.environmentId);
			if (previous) {
				await closeContext(previous);
				assertCurrent();
			}
			await ensureTemporaryRoot();
			assertCurrent();
			const abortController = new AbortController();
			const context = {
				...owner,
				temporaryRoot: await fs.mkdtemp(path.join(temporaryBaseRoot, "context-")),
				currentManifestRef: params.kind === "repository" ? params.baseManifestRef : "",
				baseCommit: params.kind === "repository" ? params.baseCommit : null,
				snapshots: /* @__PURE__ */ new Map(),
				downloads: /* @__PURE__ */ new Map(),
				abortController,
				signal: params.signal ? AbortSignal.any([params.signal, abortController.signal]) : abortController.signal
			};
			try {
				assertCurrent();
				let snapshot;
				if (params.kind === "sync") {
					snapshot = await prepareNodeWorkspaceTransferSnapshot({
						localPath: params.localPath,
						temporaryRoot: context.temporaryRoot,
						signal: AbortSignal.any([context.signal, AbortSignal.timeout(TRANSFER_TIMEOUT_MS)])
					});
					assertCurrent();
					context.snapshots.set(snapshot.manifestRef, snapshot);
					context.localPath = snapshot.root;
					context.baseCommit = snapshot.manifest.baseCommit;
					context.currentManifestRef = snapshot.manifestRef;
				}
				contexts.set(context.environmentId, context);
				return snapshot ? {
					snapshot,
					token: mintDownload(context, snapshot.manifestRef, isOperationAuthorized)
				} : void 0;
			} catch (error) {
				await closeContext(context);
				throw error;
			}
		});
	}
	return {
		initialize: ensureTemporaryRoot,
		async prepareAttachments(params) {
			params.signal.throwIfAborted();
			const context = contexts.get(params.environmentId);
			if (!context || !isCurrentContext(context) || !params.isAuthorized()) throw new Error("Worker attachment transfer authority closed");
			const root = await fs.realpath(params.localPath);
			params.signal.throwIfAborted();
			const actual = await captureWorkspaceSnapshot({
				root,
				baseCommit: null,
				signal: params.signal
			});
			params.signal.throwIfAborted();
			if (!isCurrentContext(context) || !params.isAuthorized()) throw new Error("Worker attachment transfer authority closed");
			const snapshot = {
				...actual,
				root
			};
			context.snapshots.set(snapshot.manifestRef, snapshot);
			return {
				snapshot,
				token: mintDownload(context, snapshot.manifestRef, params.isAuthorized, params.signal)
			};
		},
		prepareRepository: (params) => replaceContext({
			...params,
			kind: "repository"
		}),
		prepareSync: (params) => replaceContext({
			...params,
			kind: "sync"
		}),
		prepareUpload(environmentId, baseManifestRef, authorize) {
			authorize?.();
			const context = contexts.get(environmentId);
			if (!context || !MANIFEST_REF_PATTERN.test(baseManifestRef) || !isCurrentContext(context)) throw new Error("Node workspace transfer context is unavailable");
			if (context.upload) throw new Error("Node workspace transfer upload is already active");
			const token = generateSecureToken({
				bytes: 32,
				redact: true
			});
			const { isOperationAuthorized } = createNodeWorkspaceSyncAuthorization(context, authorize, options.getOwner);
			context.upload = {
				direction: "upload",
				token,
				baseManifestRef,
				expiresAtMs: now() + TRANSFER_TIMEOUT_MS,
				state: "ready",
				isAuthorized: isOperationAuthorized,
				abortController: new AbortController()
			};
			return token;
		},
		takeUpload(environmentId, baseManifestRef) {
			const context = contexts.get(environmentId);
			const operation = context?.upload;
			if (!context || !operation || operation.state !== "completed" || !operation.isAuthorized() || operation.abortController.signal.aborted || operation.baseManifestRef !== baseManifestRef || !operation.uploaded || !isCurrentContext(context)) throw new Error("Node workspace transfer upload did not complete");
			context.upload = void 0;
			return operation.uploaded;
		},
		async discardUpload(environmentId, token) {
			const context = contexts.get(environmentId);
			const operation = context?.upload;
			if (context && operation?.token === token) await discardUpload(context, operation);
		},
		getSnapshot(environmentId, manifestRef) {
			return contexts.get(environmentId)?.snapshots.get(manifestRef);
		},
		publishSnapshot(environmentId, snapshot, authorize) {
			authorize?.();
			const context = contexts.get(environmentId);
			if (!context || !isCurrentContext(context)) throw new Error("Node workspace transfer context is unavailable");
			context.snapshots.set(snapshot.manifestRef, snapshot);
			context.currentManifestRef = snapshot.manifestRef;
			pruneSnapshots(context);
			const { isOperationAuthorized } = createNodeWorkspaceSyncAuthorization(context, authorize, options.getOwner);
			return mintDownload(context, snapshot.manifestRef, isOperationAuthorized);
		},
		async revoke(environmentId, token) {
			const context = contexts.get(environmentId);
			context?.downloads.delete(token);
			if (context) pruneSnapshots(context);
			const upload = context?.upload;
			if (context && upload?.token === token) await discardUpload(context, upload);
		},
		authorize(params) {
			const context = contexts.get(params.route.environmentId);
			if (!context) return;
			const download = context.downloads.get(params.token);
			if (download) {
				const authorization = {
					context,
					capability: download,
					route: params.route
				};
				if (!authorizationCurrent(authorization) || !routeMatchesDownload(context, download, params.route)) return;
				return authorization;
			}
			const upload = context.upload;
			if (!upload || !isCurrentContext(context) || upload.token !== params.token || upload.state !== "ready" || !upload.isAuthorized() || upload.expiresAtMs <= now() || params.route.kind !== "reconcile" || params.route.environmentId !== context.environmentId || params.route.baseManifestRef !== upload.baseManifestRef) return;
			upload.state = "receiving";
			return {
				context,
				capability: upload,
				route: params.route
			};
		},
		isAuthorizationCurrent: authorizationCurrent,
		authorizationSignal(authorization) {
			const signal = authorization.context.signal;
			const capability = authorization.capability;
			return capability.direction === "download" && capability.signal ? AbortSignal.any([signal, capability.signal]) : capability.direction === "upload" ? AbortSignal.any([signal, capability.abortController.signal]) : signal;
		},
		snapshot(authorization) {
			if (authorization.capability.direction !== "download" || authorization.route.kind !== "manifest" && authorization.route.kind !== "pack" || !authorizationCurrent(authorization)) return;
			return authorization.context.snapshots.get(authorization.capability.manifestRef);
		},
		async pack(authorization) {
			if (authorization.route.kind !== "pack" || !authorizationCurrent(authorization)) return;
			const { context, route } = authorization;
			const snapshot = context.snapshots.get(route.manifestRef);
			const { baseCommit } = context;
			if (!context.localPath || !baseCommit || snapshot?.manifest.baseCommit !== baseCommit) return;
			if (!context.pack) context.pack = prepareWorkerWorkspaceGitPack({
				root: context.localPath,
				baseCommit,
				temporaryRoot: context.temporaryRoot,
				signal: AbortSignal.any([context.signal, AbortSignal.timeout(TRANSFER_TIMEOUT_MS)])
			}).catch((error) => {
				context.pack = void 0;
				throw error;
			});
			const packPath = await context.pack;
			return authorizationCurrent(authorization) ? packPath : void 0;
		},
		blob(authorization) {
			if (authorization.capability.direction !== "download" || authorization.route.kind !== "blob" || !authorizationCurrent(authorization)) return;
			const snapshot = authorization.context.snapshots.get(authorization.capability.manifestRef);
			const sha256 = authorization.route.sha256;
			const entry = snapshot?.manifest.entries.find((candidate) => candidate.type === "file" && candidate.sha256 === sha256 && (!snapshot.blobPaths || snapshot.blobPaths.has(candidate.path)));
			return snapshot && entry?.type === "file" ? {
				path: nodeWorkspaceTransferEntryPath(snapshot.root, entry.path),
				size: entry.size,
				sha256: entry.sha256
			} : void 0;
		},
		async receiveUpload(params) {
			const { authorization } = params;
			const operation = authorization.capability;
			if (operation.direction !== "upload" || authorization.route.kind !== "reconcile" || operation.state !== "receiving") throw new Error("Workspace transfer upload owner is unavailable");
			const signal = AbortSignal.any([params.signal, operation.abortController.signal]);
			const result = (async () => {
				const assertCurrent = () => {
					signal.throwIfAborted();
					assertAuthorizationCurrent(authorization);
				};
				let uploaded;
				try {
					signal.throwIfAborted();
					uploaded = await readNodeWorkspaceUpload({
						request: params.request,
						baseManifestRef: operation.baseManifestRef,
						temporaryRoot: authorization.context.temporaryRoot,
						signal,
						assertCurrent,
						isAuthorized: () => authorizationCurrent(authorization)
					});
					assertCurrent();
					const context = authorization.context;
					if (context.localPath && !context.snapshots.has(uploaded.baseManifestRef)) {
						if (context.baseCommit !== uploaded.base.baseCommit) {
							await context.pack?.catch(() => void 0);
							assertCurrent();
							context.pack = void 0;
							context.baseCommit = uploaded.base.baseCommit;
						}
						context.snapshots.set(uploaded.baseManifestRef, {
							manifest: uploaded.base,
							manifestRef: uploaded.baseManifestRef,
							rawManifest: uploaded.baseRaw,
							root: context.localPath
						});
						context.currentManifestRef = uploaded.baseManifestRef;
					}
					operation.uploaded = uploaded;
					operation.state = "completed";
					return { manifestRef: uploaded.currentManifestRef };
				} catch (error) {
					if (uploaded) await fs.rm(uploaded.stagingRoot, {
						recursive: true,
						force: true
					});
					if (authorization.context.upload === operation && !operation.disposal) authorization.context.upload = void 0;
					throw error;
				}
			})();
			operation.receiving = {
				result,
				signal
			};
			return await result;
		},
		async verifyBlob(params) {
			const snapshot = await computeWorkspaceFileSnapshot(params.path, Math.min(params.size, MAX_WORKSPACE_INVENTORY_TOTAL_BYTES));
			return snapshot.type === "file" && snapshot.size === params.size && snapshot.sha256 === params.sha256;
		},
		fenceEnvironment(environmentId, reason) {
			const context = contexts.get(environmentId);
			if (context && !context.signal.aborted) context.abortController.abort(reason ?? /* @__PURE__ */ new Error("Worker environment credential revoked"));
			closeEnvironment(environmentId).catch(() => void 0);
		},
		close: closeEnvironment,
		async closeAll() {
			await temporaryRootReady;
			const closed = await Promise.allSettled([...contexts.keys()].map(closeEnvironment));
			closed.push(...await Promise.allSettled([fs.rm(temporaryBaseRoot, {
				recursive: true,
				force: true
			})]));
			const failure = closed.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		}
	};
}
//#endregion
export { createNodeWorkspaceTransferService };
