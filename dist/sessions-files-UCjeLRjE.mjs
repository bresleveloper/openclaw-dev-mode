import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ci as validateSessionsFilesListParams, Si as validateSessionsFilesGetParams, Ti as validateSessionsFilesSetParams, wi as validateSessionsFilesRevealParams, zg as isCloudWorkerPlacementState } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-Cmb7QmaZ.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import "./session-transcript-readers-Bmg2Zjrq.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-fs-DfgXp1be.mjs";
import { a as setSessionWorkspaceFile, i as resolveFileRoot, n as listSessionWorkspaceFiles, t as getSessionWorkspaceFile } from "./workspace-files-BAVuuBet.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-CdOvbmSU.mjs";
import { a as sanitizePathForLog, i as resolveOpenPathCommand, n as formatOpenPathError, r as isHeadlessOpenPathError, t as execOpenPath } from "./open-path-zkREpntN.mjs";
import { n as getRepositoryArtifact, r as listRepositoryArtifacts, t as resolveRepositoryWorkspaceAccess } from "./session-repository-workspace-access-zUikoo-0.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-BhzcwJhq.mjs";
//#region src/gateway/server-methods/sessions-files.ts
const MAX_PREVIEW_BYTES = WORKSPACE_PREVIEW_MAX_BYTES;
const TOUCHED_FILES_CACHE_LIMIT = 256;
const TOUCHED_FILES_DELTA_MAX_MESSAGES = 1e3;
const TOUCHED_FILES_DELTA_MAX_BYTES = 1e6;
const touchedFilesCache = /* @__PURE__ */ new Map();
const touchedFilesFolds = /* @__PURE__ */ new Map();
function readTouchedFilesCache(key) {
	const cached = touchedFilesCache.get(key);
	if (cached) {
		touchedFilesCache.delete(key);
		touchedFilesCache.set(key, cached);
	}
	return cached;
}
function writeTouchedFilesCache(key, entry) {
	touchedFilesCache.delete(key);
	touchedFilesCache.set(key, entry);
	pruneMapToMaxSize(touchedFilesCache, TOUCHED_FILES_CACHE_LIMIT);
}
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
function addPatchFiles(files, args) {
	addRawPatchFiles(files, args.input);
	addStructuredPatchFiles(files, args.changes);
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
		else if (toolName === "apply_patch") addPatchFiles(files, args);
	}
}
async function foldSqliteTouchedFiles(scope, cacheKey) {
	let cached = readTouchedFilesCache(cacheKey);
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
			cached = {
				cursor: delta.cursor,
				files: /* @__PURE__ */ new Map()
			};
			cursor = cached.cursor;
			files = cached.files;
			writeTouchedFilesCache(cacheKey, cached);
			continue;
		}
		for (const event of delta.events) {
			const message = sqliteMessageEventWithSeq(event);
			if (message !== void 0) collectTouchedFilesFromMessage(message, files);
		}
		cached = {
			cursor: delta.cursor,
			files
		};
		cursor = cached.cursor;
		writeTouchedFilesCache(cacheKey, cached);
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
	const agentId = normalizeAgentId(loaded.agentId ?? parseAgentSessionKey(loaded.canonicalKey)?.agentId ?? params.agentId ?? parseAgentSessionKey(params.sessionKey)?.agentId);
	if (loaded.entry.repositoryWorkspaceId) return {
		...loaded,
		agentId,
		root: void 0,
		fileRoot: void 0,
		diffCwd: void 0
	};
	const { spawnedCwd, root, diffCwd } = resolveSessionWorkspaceRoots(loaded.cfg, agentId, loaded.entry);
	return {
		...loaded,
		agentId,
		root,
		fileRoot: resolveFileRoot({
			root,
			spawnedCwd
		}),
		diffCwd
	};
}
/**
* Canonical workspace root of a session that lives on this Gateway's own disk.
* Workspace identity surfaces must name the same directory the file routes
* open, so they read it from here instead of re-deriving the precedence.
*
* An exec-node session's directory only exists on the remote host, while the
* precedence below falls back to the local agent workspace — returning that
* would describe the wrong machine. `sessions.files.reveal` refuses the same
* case; callers here get "no local root" and their own absent-workspace path.
*/
function resolveLocalSessionWorkspaceRoot(params) {
	const loaded = loadSessionFileRoot(params);
	return loaded.entry?.execNode ? void 0 : loaded.root;
}
async function loadSessionFiles(params) {
	const loaded = loadSessionFileRoot(params);
	const { storePath, entry, canonicalKey, agentId } = loaded;
	if (!entry?.sessionId || !storePath || !agentId) return { files: [] };
	if (entry.worktree?.id && loaded.root) {
		const { withSettledLocalWorkspacePath } = await import("./local-workspace-projection-3aRCGRr2.mjs");
		await withSettledLocalWorkspacePath({
			cwd: loaded.root,
			assertCurrent: () => {
				const current = loadGatewaySessionEntryReadOnly(canonicalKey, { agentId }).entry;
				if (current?.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.worktree?.id !== entry.worktree?.id) throw new Error("Session workspace changed during file read");
			}
		}, async () => {});
	}
	const repository = resolveRepositoryWorkspaceAccess(loaded, params.context);
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
function respondSessionFileNotFound(respond, filePath) {
	respond(false, void 0, sessionFilesError("session_file_not_found", "session file not found", { path: filePath }));
}
function respondSessionFileTooLarge(respond, file, filePath) {
	respond(false, void 0, sessionFilesError("session_file_too_large", "session file is too large to preview", {
		maxPreviewBytes: MAX_PREVIEW_BYTES,
		path: file.path || filePath,
		size: file.size
	}));
}
function respondSessionFileUnsafe(respond, filePath) {
	respond(false, void 0, sessionFilesError("session_file_unsafe", "session file could not be written safely", { path: filePath }));
}
function requireSessionFilesAgentId(params) {
	const requestedAgent = resolveRequestedSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	return requestedAgent.agentId;
}
/** Gateway handlers for session files and workspace browsing. */
const sessionsFilesHandlers = {
	"sessions.files.list": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateSessionsFilesListParams, "sessions.files.list", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		const read = retainSessionScopedRead(options, params.sessionKey, agentId, true);
		try {
			const loaded = await loadSessionFiles({
				...params,
				agentId,
				context
			});
			read?.assertCurrent();
			const request = {
				files: loaded.files,
				path: params.path,
				search: params.search
			};
			const result = loaded.repository?.kind === "stored" ? await listRepositoryArtifacts(loaded.repository, request) : loaded.repository ? await loaded.repository.inspect("list", request) : await listSessionWorkspaceFiles({
				...loaded,
				...request
			});
			read?.assertCurrent();
			respond(true, {
				sessionKey: params.sessionKey,
				...result,
				...loaded.repository ? { root: void 0 } : {}
			});
		} finally {
			read?.release();
		}
	},
	"sessions.files.get": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateSessionsFilesGetParams, "sessions.files.get", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		const read = retainSessionScopedRead(options, params.sessionKey, agentId, true);
		try {
			const loaded = await loadSessionFiles({
				...params,
				agentId,
				context
			});
			read?.assertCurrent();
			const request = {
				files: loaded.files,
				path: params.path
			};
			const result = loaded.repository?.kind === "stored" ? await getRepositoryArtifact(loaded.repository, params.path) : loaded.repository ? await loaded.repository.inspect("get", request) : await getSessionWorkspaceFile({
				...loaded,
				...request
			});
			read?.assertCurrent();
			if (!result.file || result.file.missing) {
				respondSessionFileNotFound(respond, params.path);
				return;
			}
			if (typeof result.file.content !== "string" && result.file.previewKind !== "unsupported") {
				respondSessionFileTooLarge(respond, result.file, params.path);
				return;
			}
			respond(true, {
				sessionKey: params.sessionKey,
				...result,
				...loaded.repository ? { root: void 0 } : {}
			});
		} finally {
			read?.release();
		}
	},
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
		const repository = resolveRepositoryWorkspaceAccess(loaded, context);
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
		if (update.status === "too-large") {
			respond(false, void 0, sessionFilesError("session_file_too_large", "session file content is too large", {
				maxPreviewBytes: MAX_PREVIEW_BYTES,
				path: params.path,
				size: update.size
			}));
			return;
		}
		if (update.status === "conflict") {
			respond(false, void 0, sessionFilesError("session_file_conflict", "session file changed since it was read", {
				path: params.path,
				currentHash: update.currentHash
			}));
			return;
		}
		if (update.status === "unsafe") {
			respondSessionFileUnsafe(respond, params.path);
			return;
		}
		respond(true, {
			sessionKey: params.sessionKey,
			...repository ? {} : { root: update.root },
			file: update.file
		});
	},
	"sessions.files.reveal": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsFilesRevealParams, "sessions.files.reveal", respond)) return;
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
		if (loaded.entry?.execNode) {
			respond(true, {
				ok: false,
				path: workspaceRoot,
				error: "Cannot reveal this workspace because the session runs on an exec node."
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
	}
};
//#endregion
export { resolveLocalSessionWorkspaceRoot, sessionsFilesHandlers };
