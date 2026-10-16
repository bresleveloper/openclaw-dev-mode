import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { Fi as validateSessionsFilesListParams, Ii as validateSessionsFilesRevealParams, Li as validateSessionsFilesSetParams, Ni as validateSessionsFilesAssetsParams, Pi as validateSessionsFilesGetParams } from "./src-l2dWvEsN.mjs";
import { n as SESSIONS_FILES_ASSETS_MAX_TOTAL_BYTES, r as SESSIONS_FILES_ASSET_MAX_BYTES } from "./sessions-DJqMAtE3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-CeRsYrid.mjs";
import { u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-BsloKGMb.mjs";
import "./session-transcript-readers-CDyCeaj9.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-BX-eWQU_.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-BvtSgErM.mjs";
import "./session-utils-CwljFiKR.mjs";
import { a as setSessionWorkspaceFile, i as resolveFileRoot, n as listSessionWorkspaceFiles, o as resolveSessionFileReadTarget, t as getSessionWorkspaceFile } from "./workspace-files-Dz7BzAmx.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import { f as statWorkspacePath, n as decodeUtf8Strict, s as readWorkspaceFile } from "./workspace-fs-CZ_zWXYP.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-Byq5IuxM.mjs";
import { a as sanitizePathForLog, i as resolveOpenPathCommand, n as formatOpenPathError, r as isHeadlessOpenPathError, t as execOpenPath } from "./open-path-CoU9BVjC.mjs";
import { a as resolveRepositoryArtifactPath, n as getRepositoryArtifact, r as listRepositoryArtifacts, t as resolveRepositoryWorkspaceAccess } from "./session-repository-workspace-access-DRB-tk8B.mjs";
import path from "node:path";
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
	const authorizeHostRead = () => hostAdmission ??= prepareHostRead();
	return {
		authorizeHostRead,
		withCurrent: withHostAuthority,
		hasHostRead: () => usedHostRead,
		release: () => placement?.release()
	};
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
const TOUCHED_FILES_CACHE_LIMIT = 256;
const TOUCHED_FILES_DELTA_MAX_MESSAGES = 1e3;
const TOUCHED_FILES_DELTA_MAX_BYTES = 1e6;
const touchedFilesCache = new LruCache(TOUCHED_FILES_CACHE_LIMIT);
const touchedFilesFolds = /* @__PURE__ */ new Map();
function sessionFilesError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
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
function isToolCallBlockType(value) {
	if (typeof value !== "string") return false;
	const normalized = value.toLowerCase().replace(/[_-]/g, "");
	return normalized === "toolcall" || normalized === "tooluse";
}
function collectTouchedFilesFromMessage(message, files) {
	const record = asOptionalObjectRecord(message);
	if (record?.role !== "assistant" || !Array.isArray(record.content)) return;
	for (const blockValue of record.content) {
		const block = asOptionalObjectRecord(blockValue);
		if (!block || !isToolCallBlockType(block.type)) continue;
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
	const cached = touchedFilesCache.get(cacheKey);
	let cursor = cached?.cursor;
	let files = cached?.files ?? /* @__PURE__ */ new Map();
	let maxBytes = TOUCHED_FILES_DELTA_MAX_BYTES;
	while (true) {
		const delta = readSessionTranscriptVisibleMessageDeltaCore(scope, {
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
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
}
async function loadSqliteTouchedFiles(scope, cacheKey) {
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
function loadSessionFileRoot(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	if (!loaded.entry?.sessionId) return {
		...loaded,
		agentId: void 0,
		root: void 0,
		fileRoot: void 0
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
	const loaded = loadSessionFileRoot(params);
	return loaded.entry?.execNode || loaded.root && getAgentWorkspaceAccess(loaded.root) ? void 0 : loaded.root;
}
async function loadSessionFiles(loaded, context) {
	const { storePath, entry, canonicalKey, agentId } = loaded;
	if (!entry?.sessionId || !storePath || !agentId) return { files: [] };
	if (entry.worktree?.id && loaded.root) {
		const { withSettledLocalWorkspacePath } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
		await withSettledLocalWorkspacePath({
			cwd: loaded.root,
			assertCurrent: () => {
				const current = loadGatewaySessionEntryReadOnly(canonicalKey, { agentId }).entry;
				if (current?.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.worktree?.id !== entry.worktree?.id) throw new Error("Session workspace changed during file read");
			}
		}, async () => {});
	}
	const repository = await resolveRepositoryWorkspaceAccess(loaded, context);
	const scope = {
		agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: canonicalKey,
		storePath
	};
	const target = await resolveTranscriptReadTarget(scope);
	const files = await loadSqliteTouchedFiles(toTranscriptReadScope(target), `${agentId}\0${entry.sessionId}\0${target.storePath ?? ""}`);
	return {
		repository,
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
	const read = retainSessionScopedRead(options, params.sessionKey, agentId, { requireMaterialized: true });
	const source = loadSessionFileRoot({
		...params,
		agentId
	});
	const hostRead = createSessionFileReadAuthority(options, {
		...source,
		agentId
	});
	try {
		const loaded = await loadSessionFiles(source, context);
		read?.assertCurrent();
		let result;
		let failure;
		if (request.kind === "list") {
			const query = {
				files: loaded.files,
				path: request.params.path,
				search: request.params.search
			};
			result = loaded.repository?.kind === "stored" ? await listRepositoryArtifacts(loaded.repository, query) : loaded.repository ? await loaded.repository.inspect("list", query) : await listSessionWorkspaceFiles({
				...loaded,
				...query,
				assertCurrent: () => read?.assertCurrent(),
				authorizeHostRead: hostRead.authorizeHostRead
			});
			read?.assertCurrent();
		} else if (request.kind === "assets") {
			const repository = loaded.repository;
			if (repository?.kind === "stored" && resolveRepositoryArtifactPath(request.params.path) === void 0) {
				respondSessionFileNotFound(respond, request.params.path, "outside_session_boundary");
				return;
			}
			result = await getSessionWorkspaceAssets({
				...loaded,
				path: request.params.path,
				refs: request.params.refs,
				authorizeHostRead: hostRead.authorizeHostRead,
				assertCurrent: () => read?.assertCurrent(),
				...repository ? { repositoryFile: async (path) => {
					return (repository.kind === "stored" ? await getRepositoryArtifact(repository, path) : await repository.inspect("get", {
						path,
						files: loaded.files
					})).file;
				} } : {}
			});
			read?.assertCurrent();
		} else {
			if (loaded.repository?.kind === "stored" && resolveRepositoryArtifactPath(request.params.path) === void 0) {
				respondSessionFileNotFound(respond, request.params.path, "outside_session_boundary");
				return;
			}
			const query = {
				files: loaded.files,
				path: request.params.path
			};
			const fileResult = loaded.repository?.kind === "stored" ? await getRepositoryArtifact(loaded.repository, request.params.path) : loaded.repository ? await loaded.repository.inspect("get", query) : await getSessionWorkspaceFile({
				...loaded,
				...query,
				assertCurrent: () => read?.assertCurrent(),
				authorizeHostRead: hostRead.authorizeHostRead
			});
			read?.assertCurrent();
			const { file } = fileResult;
			if (!file || file.missing) failure = () => respondSessionFileNotFound(respond, request.params.path, "reason" in fileResult && fileResult.reason === "outside_session_boundary" ? "outside_session_boundary" : void 0);
			else if (typeof file.content !== "string" && file.previewKind !== "unsupported") failure = () => respondSessionFileTooLarge(respond, file, request.params.path);
			result = fileResult;
		}
		const publish = failure ?? (() => respond(true, request.kind === "assets" ? result : {
			sessionKey: params.sessionKey,
			...result,
			...loaded.repository ? { root: void 0 } : {}
		}));
		if (hostRead.hasHostRead()) await hostRead.withCurrent(publish);
		else publish();
	} catch (error) {
		if (!hostRead.hasHostRead() || !(error instanceof SessionMutationAuthorizationChangedError)) throw error;
		respondSessionFileNotFound(respond, "path" in params ? params.path ?? "" : "", "outside_session_boundary");
	} finally {
		hostRead.release();
		read?.release();
	}
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
		const loaded = loadSessionFileRoot({
			...params,
			agentId
		});
		if (!loaded.agentId || !loaded.entry?.sessionId) {
			respondSessionFileNotFound(respond, params.path);
			return;
		}
		const repository = await resolveRepositoryWorkspaceAccess(loaded, context);
		if (repository?.kind === "stored") throw new Error("Start this cloud session before editing its repository files.");
		const authorize = () => sessionMutationAuthorization?.assertCurrent();
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
		respond(true, {
			sessionKey: params.sessionKey,
			...repository ? {} : { root: update.root },
			file: update.file
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
		const loaded = loadSessionFileRoot({
			sessionKey: params.key,
			agentId
		});
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
		const placement = loaded.entry?.sessionId ? context.workerSessionPlacementService?.getMany([loaded.entry.sessionId]).get(loaded.entry.sessionId) : void 0;
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
			await execOpenPath(command);
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
	})
};
//#endregion
export { sessionsFilesHandlers as n, resolveLocalSessionWorkspaceRoot as t };
