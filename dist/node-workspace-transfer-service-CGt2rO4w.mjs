import { c as isPathInside } from "./fs-safe-BAPek8At.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-C_0BsNDD.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-cppt7dT0.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { i as MAX_RECONCILIATION_TOTAL_BYTES } from "./workspace-manifest-453LPGpv.mjs";
import { d as computeWorkspaceFileSnapshot, f as decodeWorkspaceManifest, u as captureWorkspaceSnapshot } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { o as assertWorkspaceMatchesManifest } from "./workspace-reconcile-BoiN2pej.mjs";
import { m as workerWorkspaceTransferPaths } from "./workspace-result-staging-Cy039j72.mjs";
import { i as readWorkspaceTransferPaths, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-CqvrrDw_.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-DcOK2Mxs.mjs";
import { o as probeWorkspaceGitMode } from "./workspace-sync-helpers-Bg34ooyi.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-workspace-transfer-snapshot.ts
const TRANSFER_TIMEOUT_MS$1 = 6e5;
async function prepareNodeWorkspaceTransferSnapshot(params) {
	const root = await fs.realpath(params.localPath);
	const git = await probeWorkspaceGitMode({
		localPath: root,
		commandOptions: {
			timeoutMs: TRANSFER_TIMEOUT_MS$1,
			maxOutputBytes: 262144,
			maxCombinedOutputBytes: 524288,
			baseEnv: {
				...process.env,
				GIT_TERMINAL_PROMPT: "0",
				GIT_ASKPASS: ""
			},
			signal: params.signal
		},
		runTask: runCommandWithTimeout
	});
	let baseCommit = null;
	let includePaths;
	if (git.mode === "git") {
		if (await fs.realpath(git.gitRoot) !== root) throw new Error("Worker git workspace sync requires the managed worktree root");
		baseCommit = git.baseCommit;
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(baseCommit)) throw new Error("Worker workspace Git base is not a commit id");
		const transferList = await createWorkspaceGitTransferList({
			gitRoot: root,
			temporaryDirectory: path.join(params.temporaryRoot, "inventory"),
			signal: params.signal ?? AbortSignal.timeout(TRANSFER_TIMEOUT_MS$1),
			timeoutMs: TRANSFER_TIMEOUT_MS$1
		});
		const transferable = await readWorkspaceTransferPaths(transferList, params.signal);
		const manifestPaths = new Set(transferable);
		for (const relative of transferable) {
			const segments = relative.split("/");
			for (let index = 1; index < segments.length; index += 1) manifestPaths.add(segments.slice(0, index).join("/"));
		}
		includePaths = manifestPaths;
	}
	return {
		...await captureWorkspaceSnapshot({
			root,
			baseCommit,
			includePaths,
			signal: params.signal
		}),
		root
	};
}
function nodeWorkspaceTransferEntryPath(root, relative) {
	const candidate = path.join(root, ...relative.split("/"));
	if (candidate !== root && !isPathInside(root, candidate)) throw new Error("Workspace transfer entry escaped its staging root");
	return candidate;
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-transfer-token.ts
const NODE_WORKSPACE_TRANSFER_TOKEN_BYTES = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
/** Mint one process-local bearer. Its owner stores every authority binding separately. */
function mintNodeWorkspaceTransferToken(generateToken = generateSecureToken) {
	const token = generateToken(NODE_WORKSPACE_TRANSFER_TOKEN_BYTES);
	if (!TOKEN_PATTERN.test(token)) throw new Error("Workspace transfer token generator returned an invalid bearer");
	registerSecretValueForRedaction(token);
	return token;
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-upload-reader.ts
const MAX_UPLOAD_BYTES = MAX_WORKSPACE_MANIFEST_BYTES * 2 + MAX_RECONCILIATION_TOTAL_BYTES + MAX_WORKSPACE_INVENTORY_ENTRIES * 8 + 8;
var NodeWorkspaceTransferLimitError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "workspace-transfer-limit";
	}
};
function isNodeWorkspaceTransferLimitError(error) {
	return error instanceof NodeWorkspaceTransferLimitError;
}
var NodeWorkspaceTransferInvalidError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.code = "workspace-transfer-invalid";
	}
};
function nodeWorkspaceTransferInvalidReason(error) {
	return error instanceof NodeWorkspaceTransferInvalidError ? error.reason : void 0;
}
var RequestByteReader = class {
	#iterator;
	#signal;
	#assertCurrent;
	#pending;
	#done;
	constructor(request, signal, assertCurrent) {
		this.#pending = Buffer.alloc(0);
		this.#done = false;
		this.bytesRead = 0;
		this.#iterator = request[Symbol.asyncIterator]();
		this.#signal = signal;
		this.#assertCurrent = assertCurrent;
	}
	async take(maxBytes) {
		this.#signal.throwIfAborted();
		if (this.#pending.length === 0 && !this.#done) {
			const next = await this.#iterator.next();
			this.#assertCurrent();
			this.#signal.throwIfAborted();
			this.#done = Boolean(next.done);
			if (!next.done) {
				if (!Buffer.isBuffer(next.value)) throw new NodeWorkspaceTransferInvalidError("payload", "Workspace transfer upload must contain binary data");
				this.#pending = next.value;
			}
		}
		if (this.#pending.length === 0) return Buffer.alloc(0);
		const count = Math.min(maxBytes, this.#pending.length);
		const value = this.#pending.subarray(0, count);
		this.#pending = count === this.#pending.length ? Buffer.alloc(0) : this.#pending.subarray(count);
		this.bytesRead += value.byteLength;
		if (this.bytesRead > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
		return value;
	}
	async readExactly(bytes) {
		const chunks = [];
		let remaining = bytes;
		while (remaining > 0) {
			const chunk = await this.take(remaining);
			if (chunk.length === 0) throw new NodeWorkspaceTransferInvalidError("premature_eof", "Workspace transfer upload ended before its declared payload");
			chunks.push(chunk);
			remaining -= chunk.length;
		}
		return Buffer.concat(chunks, bytes);
	}
	async assertEnd() {
		if ((await this.take(1)).length !== 0) throw new NodeWorkspaceTransferInvalidError("trailing_bytes", "Workspace transfer upload contains trailing bytes");
	}
};
async function streamUploadFile(params) {
	if ((await params.reader.readExactly(8)).readBigUInt64BE() !== BigInt(params.entry.size)) throw new NodeWorkspaceTransferInvalidError("file_size", "Workspace transfer file size differs from its manifest");
	const hash = createHash("sha256");
	let offset = 0;
	while (offset < params.entry.size) {
		const chunk = await params.reader.take(Math.min(65536, params.entry.size - offset));
		if (chunk.length === 0) throw new NodeWorkspaceTransferInvalidError("premature_eof", "Workspace transfer upload ended mid-file");
		hash.update(chunk);
		await writeFileWindowFully(params.handle, chunk, offset, { assertBeforeMutation: params.assertCurrent });
		params.assertCurrent();
		offset += chunk.length;
	}
	if (hash.digest("hex") !== params.entry.sha256) throw new NodeWorkspaceTransferInvalidError("file_digest", "Workspace transfer file digest differs from its manifest");
}
/** Stages one bounded upload before its context owner publishes the authenticated result. */
async function readNodeWorkspaceUpload(params) {
	const { assertCurrent } = params;
	let stagingRoot;
	try {
		assertCurrent();
		const contentLength = Number(params.request.headers["content-length"]);
		if (!Number.isSafeInteger(contentLength) || contentLength < 8 || contentLength > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
		const reader = new RequestByteReader(params.request, params.signal, assertCurrent);
		const readManifest = async (expectedRef) => {
			const bytes = (await reader.readExactly(4)).readUInt32BE();
			if (bytes < 2 || bytes > 67108864) throw new NodeWorkspaceTransferLimitError("Workspace transfer manifest exceeds its byte limit");
			const raw = (await reader.readExactly(bytes)).toString("utf8");
			try {
				const decoded = await decodeWorkspaceManifest(raw, expectedRef, params.signal);
				return {
					raw,
					ref: decoded.manifestRef,
					manifest: decoded.manifest
				};
			} catch (error) {
				if (error instanceof WorkerTaskError || params.signal.aborted && error === params.signal.reason) throw error;
				throw new NodeWorkspaceTransferInvalidError("manifest", "Workspace transfer manifest is invalid", { cause: error });
			}
		};
		const base = await readManifest(params.baseManifestRef);
		assertCurrent();
		const current = await readManifest();
		assertCurrent();
		let transferPaths;
		try {
			transferPaths = workerWorkspaceTransferPaths(current.manifest, base.manifest, params.signal);
		} catch (error) {
			if (params.signal.aborted && error === params.signal.reason) throw error;
			throw new NodeWorkspaceTransferInvalidError("manifest", "Workspace transfer manifests cannot be reconciled", { cause: error });
		}
		assertCurrent();
		const transferPathSet = new Set(transferPaths);
		stagingRoot = await fs.mkdtemp(path.join(params.temporaryRoot, "upload-"));
		const currentByPath = new Map(current.manifest.entries.map((entry) => [entry.path, entry]));
		for (const relative of transferPaths) {
			const entry = currentByPath.get(relative);
			if (!entry) continue;
			try {
				const destination = nodeWorkspaceTransferEntryPath(stagingRoot, relative);
				await fs.mkdir(path.dirname(destination), {
					recursive: true,
					mode: 448
				});
				assertCurrent();
				if (entry.type === "symlink") {
					await fs.symlink(entry.target, destination);
					assertCurrent();
				} else {
					const handle = await fs.open(destination, "wx", entry.mode);
					try {
						await streamUploadFile({
							reader,
							handle,
							entry,
							assertCurrent
						});
					} finally {
						await handle.close();
					}
					assertCurrent();
				}
			} catch (error) {
				if (error instanceof NodeWorkspaceTransferInvalidError) throw error;
				if (params.signal.aborted || !params.isAuthorized()) throw error;
				throw new NodeWorkspaceTransferInvalidError("staging", "Workspace transfer payload could not be staged", { cause: error });
			}
		}
		await reader.assertEnd();
		assertCurrent();
		if (reader.bytesRead !== contentLength) throw new NodeWorkspaceTransferInvalidError("content_length", "Workspace transfer upload length is inconsistent");
		try {
			await assertWorkspaceMatchesManifest({
				root: stagingRoot,
				manifest: current.manifest,
				entries: current.manifest.entries.filter((entry) => transferPathSet.has(entry.path))
			});
		} catch (error) {
			if (error instanceof WorkerTaskError || params.signal.aborted && error === params.signal.reason) throw error;
			throw new NodeWorkspaceTransferInvalidError("staging", "Workspace transfer payload did not match its staged result", { cause: error });
		}
		assertCurrent();
		return {
			base: base.manifest,
			baseManifestRef: params.baseManifestRef,
			baseRaw: base.raw,
			current: current.manifest,
			currentManifestRef: current.ref,
			currentRaw: current.raw,
			stagingRoot
		};
	} catch (error) {
		if (stagingRoot) await fs.rm(stagingRoot, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-transfer-service.ts
const TRANSFER_TIMEOUT_MS = 6e5;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
function contextOwnerValid(context, owner) {
	const environment = owner?.environment;
	const credential = owner?.credential;
	return Boolean(!context.abortController.signal.aborted && context.isAuthorized() && environment && credential && environment.state === "attached" && environment.destroyRequestedAtMs === null && environment.ownerEpoch === context.ownerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === context.sessionId && credential.ownerEpoch === context.ownerEpoch && credential.sessionId === context.sessionId);
}
function capabilityMatchesContext(capability, context) {
	return capability.environmentId === context.environmentId && capability.ownerEpoch === context.ownerEpoch && capability.sessionId === context.sessionId && capability.generation === context.generation;
}
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
	const isCurrentContext = (context) => contexts.get(context.environmentId) === context && contextOwnerValid(context, options.getOwner(context.environmentId));
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
		if (!context.abortController.signal.aborted) context.abortController.abort(/* @__PURE__ */ new Error("Node workspace transfer context closed"));
		context.stopWatchingOwnerSignal?.();
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
		if (!isCurrentContext(context) || isAuthorized?.() === false) throw new Error("Node workspace transfer owner is no longer current");
		const token = mintNodeWorkspaceTransferToken();
		context.downloads.set(token, {
			direction: "download",
			token,
			environmentId: context.environmentId,
			ownerEpoch: context.ownerEpoch,
			sessionId: context.sessionId,
			generation: context.generation,
			manifestRef,
			expiresAtMs: now() + TRANSFER_TIMEOUT_MS,
			...isAuthorized ? { isAuthorized } : {},
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
		if (!isCurrentContext(context) || !capabilityMatchesContext(capability, context) || capability.expiresAtMs <= now()) return false;
		return capability.direction === "download" ? context.downloads.get(capability.token) === capability && !capability.signal?.aborted && capability.isAuthorized?.() !== false : context.upload === capability && !capability.abortController.signal.aborted && (capability.state === "receiving" || capability.state === "completed");
	};
	const assertAuthorizationCurrent = (authorization) => {
		if (!authorizationCurrent(authorization)) throw new Error("Workspace transfer authority closed");
	};
	const routeMatchesDownload = (context, capability, route) => {
		if (route.direction !== "download" || route.environmentId !== context.environmentId) return false;
		return route.kind === "blob" ? Boolean(context.snapshots.get(capability.manifestRef)?.manifest.entries.some((entry) => entry.type === "file" && entry.sha256 === route.sha256)) : route.manifestRef === capability.manifestRef;
	};
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
		async prepareRepository(params) {
			await contextOperations.enqueue(params.environmentId, async () => {
				const previous = contexts.get(params.environmentId);
				if (previous) await closeContext(previous);
				await ensureTemporaryRoot();
				params.signal?.throwIfAborted();
				const abortController = new AbortController();
				const context = {
					...params,
					temporaryRoot: await fs.mkdtemp(path.join(temporaryBaseRoot, "context-")),
					currentManifestRef: params.baseManifestRef,
					snapshots: /* @__PURE__ */ new Map(),
					downloads: /* @__PURE__ */ new Map(),
					abortController
				};
				if (params.signal) {
					const abort = () => abortController.abort(params.signal.reason);
					params.signal.addEventListener("abort", abort, { once: true });
					context.stopWatchingOwnerSignal = () => params.signal?.removeEventListener("abort", abort);
					if (params.signal.aborted) abort();
				}
				contexts.set(params.environmentId, context);
				if (!isCurrentContext(context)) {
					await closeContext(context);
					throw new Error("Node repository workspace authority closed");
				}
			});
		},
		async prepareSync(params) {
			return await contextOperations.enqueue(params.environmentId, async () => {
				const previous = contexts.get(params.environmentId);
				if (previous) await closeContext(previous);
				await ensureTemporaryRoot();
				const abortController = new AbortController();
				const context = {
					...params,
					localPath: await fs.realpath(params.localPath),
					temporaryRoot: await fs.mkdtemp(path.join(temporaryBaseRoot, "context-")),
					currentManifestRef: "",
					snapshots: /* @__PURE__ */ new Map(),
					baseCommit: null,
					downloads: /* @__PURE__ */ new Map(),
					abortController
				};
				if (params.signal) {
					const abortFromOwner = () => abortController.abort(params.signal.reason);
					params.signal.addEventListener("abort", abortFromOwner, { once: true });
					context.stopWatchingOwnerSignal = () => params.signal?.removeEventListener("abort", abortFromOwner);
					if (params.signal.aborted) abortFromOwner();
				}
				try {
					const snapshot = await prepareNodeWorkspaceTransferSnapshot({
						localPath: params.localPath,
						temporaryRoot: context.temporaryRoot,
						signal: AbortSignal.any([context.abortController.signal, AbortSignal.timeout(TRANSFER_TIMEOUT_MS)])
					});
					context.snapshots.set(snapshot.manifestRef, snapshot);
					context.baseCommit = snapshot.manifest.baseCommit;
					context.currentManifestRef = snapshot.manifestRef;
					contexts.set(context.environmentId, context);
					return {
						snapshot,
						token: mintDownload(context, snapshot.manifestRef)
					};
				} catch (error) {
					await closeContext(context);
					throw error;
				}
			});
		},
		prepareUpload(environmentId, baseManifestRef) {
			const context = contexts.get(environmentId);
			if (!context || !MANIFEST_REF_PATTERN.test(baseManifestRef) || !isCurrentContext(context)) throw new Error("Node workspace transfer context is unavailable");
			if (context.upload) throw new Error("Node workspace transfer upload is already active");
			const token = mintNodeWorkspaceTransferToken();
			context.upload = {
				direction: "upload",
				token,
				environmentId: context.environmentId,
				ownerEpoch: context.ownerEpoch,
				sessionId: context.sessionId,
				generation: context.generation,
				baseManifestRef,
				expiresAtMs: now() + TRANSFER_TIMEOUT_MS,
				state: "ready",
				abortController: new AbortController()
			};
			return token;
		},
		takeUpload(environmentId, baseManifestRef) {
			const context = contexts.get(environmentId);
			const operation = context?.upload;
			if (!context || !operation || operation.state !== "completed" || operation.abortController.signal.aborted || operation.baseManifestRef !== baseManifestRef || !operation.uploaded || !isCurrentContext(context)) throw new Error("Node workspace transfer upload did not complete");
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
		publishSnapshot(environmentId, snapshot) {
			const context = contexts.get(environmentId);
			if (!context || !isCurrentContext(context)) throw new Error("Node workspace transfer context is unavailable");
			context.snapshots.set(snapshot.manifestRef, snapshot);
			context.currentManifestRef = snapshot.manifestRef;
			pruneSnapshots(context);
			return mintDownload(context, snapshot.manifestRef);
		},
		revoke(environmentId, token) {
			const context = contexts.get(environmentId);
			context?.downloads.delete(token);
			if (context) pruneSnapshots(context);
			if (context?.upload?.token === token && context.upload.state === "ready") context.upload = void 0;
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
			if (!upload || !isCurrentContext(context) || upload.token !== params.token || upload.state !== "ready" || upload.expiresAtMs <= now() || !capabilityMatchesContext(upload, context) || params.route.kind !== "reconcile" || params.route.environmentId !== context.environmentId || params.route.baseManifestRef !== upload.baseManifestRef) return;
			upload.state = "receiving";
			return {
				context,
				capability: upload,
				route: params.route
			};
		},
		isAuthorizationCurrent: authorizationCurrent,
		authorizationSignal(authorization) {
			const signal = authorization.context.abortController.signal;
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
				signal: AbortSignal.any([context.abortController.signal, AbortSignal.timeout(TRANSFER_TIMEOUT_MS)])
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
			if (context && !context.abortController.signal.aborted) context.abortController.abort(reason ?? /* @__PURE__ */ new Error("Worker environment credential revoked"));
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
export { isNodeWorkspaceTransferLimitError as n, nodeWorkspaceTransferInvalidReason as r, createNodeWorkspaceTransferService as t };
