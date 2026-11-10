import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape, aa as validateSessionsFilesSetParams, ia as validateSessionsFilesRevealParams, na as validateSessionsFilesGetParams, ra as validateSessionsFilesListParams, ta as validateSessionsFilesAssetsParams } from "./src-pLJQA6J5.mjs";
import { n as SESSIONS_FILES_ASSETS_MAX_TOTAL_BYTES, r as SESSIONS_FILES_ASSET_MAX_BYTES } from "./sessions-CVESrViJ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./io-DIF-KW3P.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as detectMime } from "./mime-C3j3dfQb.mjs";
import { A as projectSessionSharingEntry, v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { a as loadAgentIdentityFromWorkspaceAsync } from "./identity-file-BFsBDRA6.mjs";
import { i as loadIncognitoGatewaySessionEntryReadOnly } from "./session-utils-store-lW7Wu3P0.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OPzI_0T6.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { a as parseWorkspaceInspectionResult, t as WORKSPACE_INSPECTION_COMMAND } from "./workspace-inspection-protocol-Ddmi4OCQ.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { t as withSessionTranscriptDeltaReader } from "./session-transcript-delta-read-sYs0Hdkh.mjs";
import { a as setSessionWorkspaceFile, i as resolveFileRoot, n as listSessionWorkspaceFiles, o as resolveSessionFileReadTarget, r as populateSessionFilePreview, t as getSessionWorkspaceFile } from "./workspace-files-Bg7Vrj5O.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import { a as normalizeRelativePath, d as sortWorkspaceEntries, f as statWorkspacePath, n as decodeUtf8Strict, s as readWorkspaceFile } from "./workspace-fs-B8fFK4si.mjs";
import "./session-utils-CGx9I2of.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-COi00Wg4.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-qX7ujxKd.mjs";
import { a as sanitizePathForLog, i as resolveOpenPathCommand, n as formatOpenPathError, r as isHeadlessOpenPathError, t as execOpenPath } from "./open-path-DSpXaNx6.mjs";
import { n as readSessionRepositoryArtifacts } from "./session-repository-checkpoints-C4TGwsPq.mjs";
import path, { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/server-methods/session-file-read-authority.ts
/** Host reads borrow the turn owner's prepared facts and the placement owner's live observation. */
function createSessionFileReadAuthority(options, source) {
	const { context } = options;
	const { agentId } = source;
	let placement;
	let usedHostRead = false;
	const withHostAuthority = async (consume) => {
		if (!options.withSessionTurnAuthority || !source.entry?.sessionId) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "outside session boundary"));
		return options.withSessionTurnAuthority({
			sessionKey: source.canonicalKey,
			agentId,
			sessionId: source.entry.sessionId
		}, (entry) => {
			placement?.assertCurrent();
			const current = resolveSessionWorkspaceRoots(context.getRuntimeConfig(), agentId, entry, {
				sessionKey: source.canonicalKey,
				fileToolsOnGatewayHost: Boolean(placement && !placement.move && !placement.pendingResult && (!placement.placement || placement.placement.state === "local" || placement.placement.state === "reclaimed") && !entry.execNode && source.root && !getAgentWorkspaceAccess(source.root))
			});
			if (current.readScope !== "host" || current.root !== source.root || resolveFileRoot(current) !== source.fileRoot) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "outside session boundary"));
			return consume();
		});
	};
	let hostAdmission;
	const prepareHostRead = async () => {
		try {
			if (!placement && source.entry?.sessionId) placement = await context.workerSessionPlacementService?.prepareRuntimeRefresh?.(source.entry.sessionId);
			return await withHostAuthority(() => {
				usedHostRead = true;
				return true;
			});
		} catch (error) {
			if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
			return false;
		}
	};
	return {
		authorizeHostRead: () => hostAdmission ??= prepareHostRead(),
		withCurrent: withHostAuthority,
		hasHostRead: () => usedHostRead,
		release: () => placement?.release()
	};
}
//#endregion
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
function resolveRepositoryArtifactPath(requested) {
	const normalized = normalizeRelativePath(requested);
	return path.posix.isAbsolute(requested) || path.win32.isAbsolute(requested) || normalized.split("/").includes("..") ? void 0 : normalized;
}
/** Only cumulative changed artifacts are retained; no repository checkout is materialized. */
async function listRepositoryArtifacts(access, request) {
	const snapshot = await readArtifacts(access);
	const changed = new Map(snapshot?.changedEntries.filter((entry) => entry.type === "file").map((entry) => [entry.path, entry]) ?? []);
	const files = snapshot?.changes.map((entry) => fileEntry(entry.path, changed.get(entry.path)?.size)) ?? [];
	const folder = resolveRepositoryArtifactPath(request.path ?? "");
	if (folder === void 0) return {
		gitCheckout: true,
		files
	};
	const entries = /* @__PURE__ */ new Map();
	const query = request.search?.trim().toLowerCase();
	const prefix = folder ? `${folder}/` : "";
	for (const [filePath, entry] of changed) {
		if (query ? !filePath.toLowerCase().includes(query) : !filePath.startsWith(prefix)) continue;
		const remainder = filePath.slice(prefix.length);
		const name = query ? path.posix.basename(filePath) : remainder.split("/")[0];
		const selectedPath = query ? filePath : `${prefix}${name}`;
		const directory = !query && remainder.includes("/");
		entries.set(selectedPath, {
			path: selectedPath,
			name,
			kind: directory ? "directory" : "file",
			sessionKind: "modified",
			...directory ? {} : { size: entry.size }
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
	const selected = resolveRepositoryArtifactPath(requestedPath);
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
async function resolveRepositoryWorkspaceAccess(loaded, context, assertCallerCurrent) {
	const entry = loaded.entry;
	const workspaceId = entry?.repositoryWorkspaceId;
	if (!workspaceId) return;
	const scope = {
		agentId: loaded.agentId,
		sessionKey: loaded.canonicalKey,
		storePath: loaded.storePath
	};
	const metadata = captureSessionEntryMetadataRead(scope, assertCallerCurrent);
	let facts;
	let placementRead;
	let active = true;
	let unregister = () => {};
	const release = () => {
		active = false;
		facts?.release();
		placementRead?.release();
		unregister();
	};
	let readCurrent = () => metadata?.readCurrent();
	try {
		if (!metadata && !isIncognitoSessionKey(loaded.canonicalKey)) await withSessionEntryReadOnlyInWorker(scope, assertCallerCurrent, async (read) => {
			if (!read.ok) throw read.error;
			if (!facts) throw new Error("The cloud repository session source is unavailable.");
			facts.initialize({
				entry: read.value && projectSessionSharingEntry(read.value),
				membership: /* @__PURE__ */ new Set()
			});
			readCurrent = () => facts?.readCurrent()?.entry;
		}, (database, identity) => {
			facts = retainPreparedSessionSharingFacts({
				databaseIdentity: identity.key,
				sessionKey: loaded.canonicalKey,
				acquiring: true
			});
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				...database,
				revoke: release,
				close: async () => release()
			});
		});
		const store = getSessionRepositoryWorkspaceStore();
		const prepared = await store.prepare(workspaceId);
		const repository = prepared.current();
		if (!repository || repository.agentId !== loaded.agentId || repository.sessionKey !== loaded.canonicalKey) throw new Error("The cloud repository workspace is unavailable for this session.");
		if (!entry?.sessionId) throw new Error("The cloud repository session is unavailable.");
		const sessionId = entry.sessionId;
		const assertRoutingCurrent = captureSessionMutationRouting(loaded.cfg, void 0, [{
			agentId: loaded.agentId,
			sessionKey: loaded.canonicalKey
		}]);
		const assertSessionFacts = (current, expectedRevision) => {
			const source = prepared.current();
			if (current?.sessionId !== sessionId || current.repositoryWorkspaceId !== workspaceId || (current.lifecycleRevision ?? null) !== (entry.lifecycleRevision ?? null) || current.archivedAt !== entry.archivedAt || source?.agentId !== repository.agentId || source.sessionKey !== repository.sessionKey || expectedRevision !== void 0 && source.revision !== expectedRevision) throw new Error("The cloud repository workspace owner changed; refresh this session.");
		};
		const assertSession = (expectedRevision) => {
			assertCallerCurrent();
			if (!active) throw new Error("The cloud repository session source is unavailable.");
			assertSessionFacts(readCurrent(), expectedRevision);
		};
		const placements = context?.workerSessionPlacementService;
		const environments = context?.workerEnvironmentService;
		placementRead = await placements?.prepareSessionPlacement?.(sessionId);
		const placement = placementRead ? placementRead.current() : await readSessionWorkerPlacementAsync({
			context: context ?? {},
			sessionId
		});
		assertSession(repository.revision);
		if (placement?.state !== "active" || !environments) return {
			kind: "stored",
			repository,
			store,
			assertCurrent: () => assertSession(repository.revision),
			[Symbol.dispose]: release
		};
		const assertCurrent = (expectedRevision) => {
			assertSession(expectedRevision);
			const current = placementRead ? placementRead.current() : placements?.getMany([sessionId]).get(sessionId);
			const environment = environments.get(placement.environmentId);
			if (current?.state !== "active" || current.agentId !== repository.agentId || current.sessionKey !== repository.sessionKey || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || environment?.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== sessionId) throw new Error("The cloud workspace placement changed; refresh this session.");
		};
		return {
			kind: "active",
			repository,
			[Symbol.dispose]: release,
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
				return await runExclusiveSessionLifecycleMutation("workspace-edit", {
					scope: loaded.storePath,
					identities: [
						loaded.canonicalKey,
						...loaded.storeKeys,
						sessionId
					],
					run: () => {
						assertAuthorized();
						return mutationService.mutate({
							sessionId,
							sessionKey: repository.sessionKey,
							agentId: repository.agentId,
							assertCurrent: () => {
								authorize?.();
								assertRoutingCurrent((context?.getCommittedRuntimeConfig ?? context?.getRuntimeConfig)?.() ?? loaded.cfg);
							},
							assertEntryCurrent: (current) => assertSessionFacts(current),
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
						});
					}
				});
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/session-touched-files.ts
const TOUCHED_FILES_CACHE_LIMIT = 256;
const TOUCHED_FILES_DELTA_MAX_MESSAGES = 1e3;
const TOUCHED_FILES_DELTA_MAX_BYTES = 1e6;
const touchedFilesCache = new LruCache(TOUCHED_FILES_CACHE_LIMIT);
const touchedFilesFolds = /* @__PURE__ */ new Map();
function readPathArg(args) {
	return normalizeOptionalString(args.path) ?? normalizeOptionalString(args.file_path) ?? normalizeOptionalString(args.filePath) ?? normalizeOptionalString(args.file);
}
function addTouchedFile(files, filePath, kind) {
	if (!filePath) return;
	const existing = files.get(filePath);
	if (existing?.kind === "modified" || existing && kind === "read") return;
	files.set(filePath, {
		path: filePath,
		kind
	});
}
function addRawPatchFiles(files, input) {
	if (typeof input !== "string") return;
	for (const match of input.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)) addTouchedFile(files, match[1]?.trim(), "modified");
	for (const match of input.matchAll(/^\*\*\* Move to: (.+)$/gm)) addTouchedFile(files, match[1]?.trim(), "modified");
}
function addStructuredPatchFiles(files, changes) {
	if (!Array.isArray(changes)) return;
	for (const changeValue of changes) {
		const change = asOptionalObjectRecord(changeValue);
		addTouchedFile(files, normalizeOptionalString(change?.path), "modified");
		const kind = asOptionalObjectRecord(change?.kind);
		addTouchedFile(files, normalizeOptionalString(kind?.move_path) ?? normalizeOptionalString(kind?.movePath), "modified");
	}
}
function collectTouchedFilesFromMessage(message, files) {
	const record = asOptionalObjectRecord(message);
	if (record?.role !== "assistant" || !Array.isArray(record.content)) return;
	for (const blockValue of record.content) {
		const block = asOptionalObjectRecord(blockValue);
		if (!block || typeof block.type !== "string") continue;
		const type = block.type.toLowerCase().replace(/[_-]/g, "");
		if (type !== "toolcall" && type !== "tooluse") continue;
		const toolName = normalizeOptionalString(block.name)?.toLowerCase();
		const args = asOptionalObjectRecord(block.arguments) ?? asOptionalObjectRecord(block.input) ?? asOptionalObjectRecord(block.args);
		if (!toolName || !args) continue;
		if (toolName === "read") addTouchedFile(files, readPathArg(args), "read");
		else if (toolName === "write" || toolName === "edit") addTouchedFile(files, readPathArg(args), "modified");
		else if (toolName === "apply_patch") {
			addRawPatchFiles(files, args.input);
			addStructuredPatchFiles(files, args.changes);
		}
	}
}
async function foldSqliteTouchedFiles(scope, cacheKey) {
	return withSessionTranscriptDeltaReader(scope, async (reader) => {
		const cached = touchedFilesCache.get(cacheKey);
		let cursor = cached?.cursor;
		let files = cached?.files ?? /* @__PURE__ */ new Map();
		let maxBytes = TOUCHED_FILES_DELTA_MAX_BYTES;
		while (true) {
			const delta = await reader.visible({
				...cursor ? { cursor } : {},
				maxBytes,
				maxMessages: TOUCHED_FILES_DELTA_MAX_MESSAGES
			});
			if (delta.kind === "missing") {
				touchedFilesCache.delete(cacheKey);
				return /* @__PURE__ */ new Map();
			}
			if (delta.kind === "reset") {
				cursor = delta.cursor;
				files = /* @__PURE__ */ new Map();
				touchedFilesCache.set(cacheKey, {
					cursor,
					files
				});
				continue;
			}
			for (const event of delta.events) {
				const message = sqliteMessageEventWithSeq(event);
				if (message !== void 0) collectTouchedFilesFromMessage(message, files);
			}
			cursor = delta.cursor;
			touchedFilesCache.set(cacheKey, {
				cursor,
				files
			});
			if (!delta.hasMore) return files;
			if (delta.requiredBytes !== void 0) maxBytes = delta.requiredBytes;
			await setImmediate();
		}
	});
}
async function loadSessionTouchedFiles(scope, cacheKey) {
	const inFlight = touchedFilesFolds.get(cacheKey);
	if (inFlight) return inFlight;
	const fold = foldSqliteTouchedFiles(scope, cacheKey);
	touchedFilesFolds.set(cacheKey, fold);
	try {
		return await fold;
	} finally {
		touchedFilesFolds.delete(cacheKey);
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-file-assets.ts
function relativeAssetPath(ref) {
	const value = ref.trim();
	if (!value || value.startsWith("#")) return;
	try {
		const decoded = decodeURIComponent(value.split(/[?#]/u, 1)[0] ?? "").replaceAll("\\", "/");
		if (!decoded || decoded.startsWith("/") || decoded.startsWith("~") || decoded.includes("\0") || /^[a-z][a-z\d+.-]*:/iu.test(decoded)) return;
		return decoded;
	} catch {
		return;
	}
}
async function assetMime(buffer, filePath) {
	const extension = path.extname(filePath).toLowerCase();
	if (extension === ".css" || extension === ".js" || extension === ".mjs" || extension === ".cjs") return decodeUtf8Strict(buffer) === void 0 ? void 0 : extension === ".css" ? "text/css" : "text/javascript";
	const mime = await detectMime({
		buffer,
		filePath
	});
	return mime && /^(?:image|audio|video)\//u.test(mime) ? mime : void 0;
}
async function readAsset(params, relativePath, maxBytes) {
	if (params.repositoryFile) {
		const filePath = resolveRepositoryArtifactPath(path.posix.join(path.posix.dirname(params.path), relativePath));
		if (filePath === void 0) return "outside_session_boundary";
		let file;
		try {
			file = await params.repositoryFile(filePath);
		} catch {
			params.assertCurrent?.();
			return "not_found";
		}
		params.assertCurrent?.();
		if (!file || file.missing) return "not_found";
		const previewMaxBytes = Math.min(maxBytes, WORKSPACE_PREVIEW_MAX_BYTES);
		if (previewMaxBytes === 0 || file.size !== void 0 && file.size > previewMaxBytes) return "too_large";
		if (file.previewKind === "unsupported" || file.content === void 0 || !file.contentEncoding) return "unsupported";
		const buffer = Buffer.from(file.content, file.contentEncoding);
		return buffer.length > previewMaxBytes ? "too_large" : {
			buffer,
			filePath
		};
	}
	if (!params.root) return "not_found";
	const documentDirectory = path.dirname(path.resolve(params.root, params.path));
	const target = await resolveSessionFileReadTarget(params, path.resolve(documentDirectory, relativePath));
	params.assertCurrent?.();
	if (!target || target === "outside_session_boundary") return target ?? "not_found";
	const stat = await statWorkspacePath(target.root, target.path, params.assertCurrent);
	params.assertCurrent?.();
	if (!stat?.isFile) return "not_found";
	if (maxBytes === 0 || stat.size > maxBytes) return "too_large";
	const read = await readWorkspaceFile(target.root, target.path, {
		maxBytes,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return read && read !== "too-large" ? {
		buffer: read.buffer,
		filePath: target.absolutePath
	} : read === "too-large" ? "too_large" : "not_found";
}
async function getSessionWorkspaceAssets(params) {
	const assets = [];
	let remainingBytes = SESSIONS_FILES_ASSETS_MAX_TOTAL_BYTES;
	for (const ref of params.refs) {
		params.assertCurrent?.();
		const relativePath = relativeAssetPath(ref);
		if (!relativePath) {
			assets.push({
				ref,
				error: "unsupported"
			});
			continue;
		}
		const read = await readAsset(params, relativePath, Math.min(SESSIONS_FILES_ASSET_MAX_BYTES, remainingBytes));
		params.assertCurrent?.();
		if (typeof read === "string") {
			assets.push({
				ref,
				error: read
			});
			continue;
		}
		const mimeType = await assetMime(read.buffer, read.filePath);
		params.assertCurrent?.();
		if (!mimeType) {
			assets.push({
				ref,
				error: "unsupported"
			});
			continue;
		}
		remainingBytes -= read.buffer.length;
		assets.push({
			ref,
			mimeType,
			content: read.buffer.toString("base64")
		});
	}
	return { assets };
}
//#endregion
//#region src/gateway/server-methods/sessions-files.ts
function sessionFilesError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
function rejectDeviceFolderFiles(entry, respond) {
	if (!entry?.deviceFolder) return false;
	respond(false, void 0, sessionFilesError("device_folder_files_unavailable", "Files access is unavailable for existing folders on paired devices. Use the session's file tools on the selected device."));
	return true;
}
function loadSessionFileRoot(loaded) {
	if (!loaded.entry?.sessionId) return {
		...loaded,
		agentId: void 0,
		root: void 0,
		fileRoot: void 0,
		diffCwd: void 0
	};
	if (loaded.entry.repositoryWorkspaceId) return {
		...loaded,
		root: void 0,
		fileRoot: void 0,
		diffCwd: void 0
	};
	const { spawnedCwd, root, diffCwd } = resolveSessionWorkspaceRoots(loaded.cfg, loaded.agentId, loaded.entry);
	return {
		...loaded,
		root,
		fileRoot: resolveFileRoot({
			root,
			spawnedCwd
		}),
		diffCwd
	};
}
/**
* Reuse file-route workspace precedence, excluding remote-owned roots.
* Exec-node sessions can otherwise fall back to a local agent directory.
*/
function resolveLocalSessionWorkspaceRoot(params) {
	const metadata = params.source ? void 0 : captureSessionEntryMetadataRead(params, () => {});
	const entry = params.source ? params.source.entry : metadata?.readCurrent();
	const loaded = params.source || metadata ? {
		entry,
		root: entry?.sessionId && !entry.repositoryWorkspaceId ? resolveSessionWorkspaceRoots(params.source?.cfg ?? readRuntimeConfig(), params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey), entry).root : void 0
	} : isIncognitoSessionKey(params.sessionKey) ? loadSessionFileRoot(loadIncognitoGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId })) : void 0;
	if (!loaded) throw new Error("Session workspace metadata must be prepared before file access");
	return loaded.entry?.execNode || loaded.root && getAgentWorkspaceAccess(loaded.root) ? void 0 : loaded.root;
}
/** Keep actor metadata and its full planning row under one source lifetime. */
function withSessionFileRoot(params, cfg, consume) {
	return withGatewaySessionEntryReadOnly({
		cfg,
		key: params.sessionKey,
		agentId: params.agentId,
		projection: params.projection
	}, async (session, assertSourceCurrent) => {
		const metadata = captureSessionEntryMetadataRead(params, assertSourceCurrent);
		const loaded = loadSessionFileRoot(session);
		const assertCurrent = () => {
			assertSourceCurrent();
			if (!metadata) return;
			const current = metadata.readCurrent();
			if ([
				"sessionId",
				"lifecycleRevision",
				"archivedAt",
				"repositoryWorkspaceId",
				"deviceFolder",
				"sessionRoot",
				"spawnedCwd",
				"spawnedWorkspaceDir",
				"pendingWorktree",
				"pendingProjectGitUrl",
				"execNode",
				"permissionMode",
				"sandbox"
			].some((field) => !isDeepStrictEqual(current?.[field], session.entry?.[field])) || current?.worktree?.id !== session.entry?.worktree?.id) throw new Error("Session workspace changed during file access");
		};
		assertCurrent();
		const result = await consume(loaded, assertCurrent);
		assertCurrent();
		return result;
	});
}
async function loadSessionFiles(loaded, context, assertSourceCurrent) {
	const { storePath, entry, canonicalKey, agentId } = loaded;
	const metadata = captureSessionEntryMetadataRead({
		storePath,
		sessionKey: canonicalKey,
		agentId
	}, assertSourceCurrent);
	if (!entry?.sessionId || !storePath || !agentId) return { files: [] };
	if (entry.worktree?.id && loaded.root) {
		const { withSettledLocalWorkspacePath } = await import("./local-workspace-projection-B04UXZLe.mjs");
		await withSettledLocalWorkspacePath({
			cwd: loaded.root,
			assertCurrent: () => {
				assertSourceCurrent();
				const current = metadata ? metadata.readCurrent() : readRetainedSessionEntryFacts({
					agentId: loaded.readSource?.agentId ?? agentId,
					path: loaded.readSource?.path ?? storePath
				}, {
					sessionKeys: [canonicalKey],
					snapshotFields: []
				})?.entries.find((row) => row.sessionKey === canonicalKey)?.entry;
				if (current?.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.worktree?.id !== entry.worktree?.id) throw new Error("Session workspace changed during file read");
			}
		}, async () => {});
	}
	const scope = {
		agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: canonicalKey,
		storePath
	};
	const target = await resolveTranscriptReadTarget(scope);
	const sourceIdentity = captureSessionActorStorageOwner(scope, {
		assertCurrent: assertSourceCurrent,
		authorize() {}
	})?.owner?.identity.incarnation;
	const files = await loadSessionTouchedFiles(toTranscriptReadScope(target), `${agentId}\0${entry.sessionId}\0${target.storePath ?? ""}${sourceIdentity ? `\0${sourceIdentity}` : ""}`);
	return {
		repository: await resolveRepositoryWorkspaceAccess(loaded, context, assertSourceCurrent),
		root: loaded.root,
		fileRoot: loaded.fileRoot,
		diffCwd: loaded.diffCwd,
		files: [...files.values()].toSorted((a, b) => {
			if (a.kind !== b.kind) return a.kind === "modified" ? -1 : 1;
			return a.path.localeCompare(b.path);
		})
	};
}
function respondSessionFileNotFound(respond, filePath, reason) {
	respond(false, void 0, sessionFilesError("session_file_not_found", "session file not found", {
		path: filePath,
		...reason ? { reason } : {}
	}));
}
function respondSessionFileTooLarge(respond, file, filePath) {
	respond(false, void 0, sessionFilesError("session_file_too_large", "session file is too large to preview", {
		maxPreviewBytes: WORKSPACE_PREVIEW_MAX_BYTES,
		path: file.path || filePath,
		size: file.size
	}));
}
function requireSessionFilesAgentId(params) {
	const requestedAgent = resolveRequestedSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	return requestedAgent.agentId;
}
async function handleSessionFilesRead(options, request) {
	const { respond, context } = options;
	const { params } = request;
	const agentId = requireSessionFilesAgentId({
		cfg: context.getRuntimeConfig(),
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		respond
	});
	if (!agentId) return;
	const read = await retainSessionScopedRead(options, params.sessionKey, agentId, { requireMaterialized: true });
	return withSessionFileRoot({
		...params,
		agentId
	}, context.getRuntimeConfig(), async (source, assertSourceCurrent) => {
		if (rejectDeviceFolderFiles(source.entry, respond)) return;
		const assertCurrent = () => {
			assertSourceCurrent();
			read?.assertCurrent();
		};
		const hostRead = createSessionFileReadAuthority(options, {
			...source,
			agentId
		});
		try {
			try {
				var _usingCtx$1 = _usingCtx();
				const loaded = await loadSessionFiles(source, context, assertSourceCurrent);
				const repository = _usingCtx$1.u(loaded.repository);
				assertCurrent();
				if (request.kind !== "list" && repository?.kind === "stored" && resolveRepositoryArtifactPath(request.params.path) === void 0) {
					respondSessionFileNotFound(respond, request.params.path, "outside_session_boundary");
					return;
				}
				let result;
				let failure;
				if (request.kind === "list") {
					const query = {
						files: loaded.files,
						path: request.params.path,
						search: request.params.search
					};
					result = repository?.kind === "stored" ? await listRepositoryArtifacts(repository, query) : repository ? await repository.inspect("list", query) : await listSessionWorkspaceFiles({
						...loaded,
						...query,
						assertCurrent,
						authorizeHostRead: hostRead.authorizeHostRead
					});
					assertCurrent();
				} else if (request.kind === "assets") {
					result = await getSessionWorkspaceAssets({
						...loaded,
						path: request.params.path,
						refs: request.params.refs,
						authorizeHostRead: hostRead.authorizeHostRead,
						assertCurrent,
						...repository ? { repositoryFile: async (path) => {
							return (repository.kind === "stored" ? await getRepositoryArtifact(repository, path) : await repository.inspect("get", {
								path,
								files: loaded.files
							})).file;
						} } : {}
					});
					assertCurrent();
				} else {
					const query = {
						files: loaded.files,
						path: request.params.path
					};
					const fileResult = repository?.kind === "stored" ? await getRepositoryArtifact(repository, request.params.path) : repository ? await repository.inspect("get", query) : await getSessionWorkspaceFile({
						...loaded,
						...query,
						assertCurrent,
						authorizeHostRead: hostRead.authorizeHostRead
					});
					assertCurrent();
					const { file } = fileResult;
					if (!file || file.missing) failure = () => respondSessionFileNotFound(respond, request.params.path, "reason" in fileResult && fileResult.reason === "outside_session_boundary" ? "outside_session_boundary" : void 0);
					else if (typeof file.content !== "string" && file.previewKind !== "unsupported") failure = () => respondSessionFileTooLarge(respond, file, request.params.path);
					result = fileResult;
				}
				const publish = () => {
					assertSourceCurrent();
					if (failure) failure();
					else respond(true, request.kind === "assets" ? result : {
						sessionKey: params.sessionKey,
						...result,
						...repository ? { root: void 0 } : {}
					});
				};
				if (hostRead.hasHostRead()) await hostRead.withCurrent(publish);
				else publish();
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		} catch (error) {
			if (!hostRead.hasHostRead() || !(error instanceof SessionMutationAuthorizationChangedError)) throw error;
			respondSessionFileNotFound(respond, "path" in params ? params.path ?? "" : "", "outside_session_boundary");
		} finally {
			hostRead.release();
		}
	}).finally(() => read?.release());
}
const sessionsFilesHandlers = {
	"sessions.files.assets": defineValidatedGatewayHandler("sessions.files.assets", validateSessionsFilesAssetsParams, (options) => handleSessionFilesRead(options, {
		kind: "assets",
		params: options.params
	})),
	"sessions.files.list": defineValidatedGatewayHandler("sessions.files.list", validateSessionsFilesListParams, (options) => handleSessionFilesRead(options, {
		kind: "list",
		params: options.params
	})),
	"sessions.files.get": defineValidatedGatewayHandler("sessions.files.get", validateSessionsFilesGetParams, (options) => handleSessionFilesRead(options, {
		kind: "get",
		params: options.params
	})),
	"sessions.files.set": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsFilesSetParams, "sessions.files.set", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		return withSessionFileRoot({
			...params,
			agentId
		}, context.getRuntimeConfig(), async (loaded, assertSourceCurrent) => {
			try {
				var _usingCtx3 = _usingCtx();
				if (rejectDeviceFolderFiles(loaded.entry, respond)) return;
				if (!loaded.agentId || !loaded.entry?.sessionId) {
					respondSessionFileNotFound(respond, params.path);
					return;
				}
				const authorize = () => {
					assertSourceCurrent();
					sessionMutationAuthorization?.assertCurrent();
				};
				const repository = _usingCtx3.u(await resolveRepositoryWorkspaceAccess(loaded, context, authorize));
				if (repository?.kind === "stored") throw new Error("Start this cloud session before editing its repository files.");
				const update = repository ? await repository.inspect("set", {
					path: params.path,
					content: params.content,
					expectedHash: params.expectedHash
				}, authorize) : await setSessionWorkspaceFile({
					...params,
					root: loaded.root,
					fileRoot: loaded.fileRoot,
					assertCurrent: authorize
				});
				assertSourceCurrent();
				if (update.status === "missing") {
					respondSessionFileNotFound(respond, params.path);
					return;
				}
				if (update.status !== "updated") {
					const [type, message] = {
						"too-large": ["session_file_too_large", "session file content is too large"],
						conflict: ["session_file_conflict", "session file changed since it was read"],
						unsafe: ["session_file_unsafe", "session file could not be written safely"]
					}[update.status];
					respond(false, void 0, sessionFilesError(type, message, {
						path: params.path,
						...update.status === "too-large" ? {
							maxPreviewBytes: WORKSPACE_PREVIEW_MAX_BYTES,
							size: update.size
						} : update.status === "conflict" ? { currentHash: update.currentHash } : {}
					}));
					return;
				}
				const workspaceDir = repository ? void 0 : resolveAgentWorkspaceDir(loaded.cfg, agentId);
				if (workspaceDir && update.file.workspacePath && resolve(update.root, update.file.workspacePath) === resolve(workspaceDir, "IDENTITY.md")) {
					await loadAgentIdentityFromWorkspaceAsync(workspaceDir);
					authorize();
					context.broadcast("agent.identity.changed", { agentId });
				}
				respond(true, {
					sessionKey: params.sessionKey,
					...repository ? {} : { root: update.root },
					file: update.file
				});
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		});
	},
	"sessions.files.reveal": defineValidatedGatewayHandler("sessions.files.reveal", validateSessionsFilesRevealParams, async ({ params, respond, context }) => {
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.key,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		return withSessionFileRoot({
			sessionKey: params.key,
			agentId
		}, context.getRuntimeConfig(), async (loaded, assertCurrent) => {
			if (rejectDeviceFolderFiles(loaded.entry, respond)) return;
			if (loaded.entry?.repositoryWorkspaceId) {
				respond(true, {
					ok: false,
					error: "This repository exists only on the cloud session runner. Use the Files panel to browse it; there is no Gateway checkout to reveal."
				});
				return;
			}
			const workspaceRoot = loaded.root;
			if (!workspaceRoot) {
				respond(true, {
					ok: false,
					error: "No workspace root is available for this session."
				});
				return;
			}
			if (loaded.entry?.execNode || getAgentWorkspaceAccess(workspaceRoot)) {
				respond(true, {
					ok: false,
					path: workspaceRoot,
					error: loaded.entry?.execNode ? "Cannot reveal this workspace because the session runs on an exec node." : "Cannot reveal this workspace because its files live on a remote host."
				});
				return;
			}
			const placement = await readSessionWorkerPlacementAsync({
				context,
				sessionId: loaded.entry?.sessionId
			});
			if (isCloudWorkerPlacementState(placement?.state)) {
				respond(true, {
					ok: false,
					path: workspaceRoot,
					error: `Cannot reveal this workspace because the session runs remotely (${placement.state}).`
				});
				return;
			}
			const command = resolveOpenPathCommand(workspaceRoot);
			try {
				assertCurrent();
				await execOpenPath(command);
				assertCurrent();
				respond(true, {
					ok: true,
					path: workspaceRoot
				});
			} catch (error) {
				const errorMessage = formatOpenPathError(error);
				const detailedError = isHeadlessOpenPathError(error, command) ? `Cannot open path in headless environment. Path: ${workspaceRoot}. This environment appears to lack a graphical or terminal browser handler.` : `Failed to reveal session workspace: ${errorMessage}`;
				context.logGateway.warn(`sessions.files.reveal failed path=${sanitizePathForLog(workspaceRoot)}: ${errorMessage}`);
				respond(true, {
					ok: false,
					path: workspaceRoot,
					error: detailedError
				});
			}
		});
	})
};
//#endregion
export { loadRepositoryArtifactDiff as a, resolveRepositoryWorkspaceAccess as i, sessionsFilesHandlers as n, withSessionFileRoot as r, resolveLocalSessionWorkspaceRoot as t };
