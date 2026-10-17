import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { s as readSessionTranscriptUpdateVersion } from "./transcript-events-DUHAZLVw.mjs";
import { _ as validateArtifactsGetParams, g as validateArtifactsDownloadParams, v as validateArtifactsListParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-BH_EolwD.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { n as readSessionArtifacts } from "./session-transcript-readers-Z-j3mApc.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-BwpUabTn.mjs";
import { t as parseTranscriptImageArtifactId } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import { t as resolveChatAttachmentFrameBudgetBytes } from "./chat-attachment-frame-budget-BBmKdOhk.mjs";
import { d as resolveManagedOutgoingMediaArtifactDownload, f as resolveManagedOutgoingMediaUrlDownload } from "./managed-image-attachments-DbHPJZAc.mjs";
import { o as parseManagedOutgoingArtifactId } from "./managed-outgoing-artifact-id-Ba11Ib46.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as canCreateArtifactDownload, r as createArtifactDownload } from "./artifact-download-grants-tzwDxk5o.mjs";
import { i as toArtifactSummary } from "./artifacts-content-DvXNkzKV.mjs";
import { t as resolveSessionForRun } from "./server-session-key-Bb9pMs6R.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/artifacts-session-resolution.ts
/** RPCs and HTTP readers release their facts unless a download grant adopts them. */
function createArtifactSessionAccess(params) {
	const releases = /* @__PURE__ */ new Set();
	return {
		...params,
		retain(release) {
			releases.add(release);
		},
		detach(release) {
			releases.delete(release);
		},
		[Symbol.dispose]() {
			for (const release of releases) release();
			releases.clear();
		}
	};
}
function resolveQuerySession(query, cfg, projection) {
	const selected = !query.sessionKey && query.runId ? resolveSessionForRun(query.runId, {
		...query.agentId ? { agentId: query.agentId } : {},
		...projection ? { projection } : {}
	}) : void 0;
	const sessionKey = query.sessionKey ?? selected?.sessionKey;
	if (!sessionKey) return;
	let agentId = query.agentId ?? selected?.agentId;
	if (query.sessionKey) {
		const owner = resolveRequestedSessionAgentId(cfg, sessionKey, agentId);
		if (!owner.ok) throw new ArtifactSessionResolutionError(owner.error);
		agentId = owner.agentId;
	}
	const identity = resolveSessionStoreIdentity({
		cfg,
		sessionKey,
		agentId,
		preserveQualifiedAddress: !query.sessionKey
	});
	return {
		sessionKey: identity.canonicalKey,
		agentId: identity.agentId
	};
}
var ArtifactSessionResolutionError = class extends Error {
	constructor(shape) {
		super(shape.message);
		this.shape = shape;
	}
};
function throwArtifactSessionReadError(error) {
	if (error instanceof SessionMutationFactsUnavailableError) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.UNAVAILABLE, "session changed while reading artifact; reload the conversation", { retryable: true }));
	throw error;
}
function artifactResponseIsCurrent(found, respond) {
	try {
		found.assertCurrent?.();
		return true;
	} catch (error) {
		if (!(error instanceof ArtifactSessionResolutionError)) throw error;
		respond(false, void 0, error.shape);
		return false;
	}
}
async function prepareArtifactSessionResolution(input, projection) {
	const query = { ...input };
	if (!query.sessionKey && query.runId && projection?.sharingRevision === void 0) await projection?.ensureMaterialized();
	return async (access) => {
		const { client } = access;
		const resolveSession = (cfg) => resolveQuerySession(query, cfg, projection);
		const cfg = access.getRuntimeConfig();
		const resolved = resolveSession(cfg);
		if (!resolved) return;
		const facts = await prepareSessionMutationFacts({
			cfg,
			sessionKey: resolved.sessionKey,
			agentId: resolved.agentId,
			preserveQualifiedAddress: !query.sessionKey,
			allowMissing: true
		}).catch(throwArtifactSessionReadError);
		access.retain(facts.release);
		const readCurrent = () => {
			try {
				const currentConfig = access.getRuntimeConfig();
				const selected = resolveSession(currentConfig);
				if (selected?.sessionKey !== resolved.sessionKey || selected.agentId !== resolved.agentId) throw new SessionMutationFactsUnavailableError();
				const current = facts.readCurrent(currentConfig);
				const { target } = current;
				const error = authorizeIncognitoSessionTarget({
					client,
					sessionKey: query.sessionKey ?? resolved.sessionKey,
					target
				});
				const visibilityDenied = Boolean(target && createSessionListEntryFilter({
					client,
					cfg: currentConfig
				})?.(target.storeKey, target.entry) === false);
				if (!error && !visibilityDenied) return current;
				throw new ArtifactSessionResolutionError(query.sessionKey && error ? error : errorShape(ErrorCodes.INVALID_REQUEST, "no session found for artifact query", { details: { type: "artifact_scope_not_found" } }));
			} catch (error) {
				return throwArtifactSessionReadError(error);
			}
		};
		return {
			sessionKey: facts.storageTarget.canonicalKey,
			agentId: facts.storageTarget.agentId,
			...readCurrent(),
			readCurrent,
			release: facts.release
		};
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-image-page.ts
const CURSOR_TTL_MS = 9e5;
const cursors = /* @__PURE__ */ new WeakMap();
const internalCaller = {};
async function readArtifactImagePage(params) {
	const owner = params.client ?? internalCaller;
	let state = cursors.get(owner);
	if (!state) {
		state = /* @__PURE__ */ new Map();
		cursors.set(owner, state);
	}
	const now = Date.now();
	for (const [key, value] of state) if (value.expiresAt <= now) state.delete(key);
	const cursor = params.cursor ? state.get(params.cursor) : void 0;
	if (params.cursor && (!cursor || cursor.binding !== params.binding)) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.INVALID_REQUEST, "Image cursor expired or belongs to another session; restart artifacts.list", { details: { type: "artifact_cursor_invalid" } }));
	const page = await readSessionArtifacts(params.scope, {
		kind: "image-page",
		sessionKey: params.sessionKey,
		...params.filters,
		limit: params.limit,
		beforeSeq: cursor?.beforeSeq,
		imageOffset: cursor?.imageOffset,
		readWindow: cursor?.readWindow
	}).catch((error) => {
		if (cursor && isSessionTranscriptProjectionUnavailableError(error)) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.INVALID_REQUEST, "Transcript changed; restart artifacts.list", { details: { type: "artifact_cursor_invalid" } }));
		throw error;
	});
	let nextCursor;
	if (page.next) {
		nextCursor = randomUUID();
		state.set(nextCursor, {
			...page.next,
			binding: params.binding,
			expiresAt: now + CURSOR_TTL_MS
		});
		pruneMapToMaxSize(state, 128);
	}
	return {
		artifacts: page.artifacts,
		...nextCursor ? { nextCursor } : {},
		...page.omittedOversized ? { omittedOversized: true } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-session-read.ts
/** Authorization and transcript reads retain the same selected physical target. */
async function prepareArtifactSessionRead(query, access) {
	const selected = await (await prepareArtifactSessionResolution(query, access.projection))(access);
	if (!selected) return;
	const { sessionKey, release } = selected;
	const initial = selected.readCurrent();
	const { target } = initial;
	const entry = target?.entry;
	const sessionId = entry?.sessionId;
	const storePath = initial.sourcePath ?? target?.storePath;
	const lifecycleRevision = entry?.lifecycleRevision;
	const assertCurrent = () => {
		const current = selected.readCurrent();
		if ((current.sourcePath ?? current.target?.storePath) !== storePath || current.target?.entry.sessionId !== sessionId || current.target?.entry.lifecycleRevision !== lifecycleRevision) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.UNAVAILABLE, "session changed while reading artifact; reload the conversation", { retryable: true }));
	};
	if (!sessionId || !storePath) return {
		sessionKey,
		assertCurrent,
		release
	};
	return {
		sessionKey,
		scope: {
			agentId: initial.sourceAgentId ?? selected.agentId,
			sessionEntry: entry,
			sessionId,
			sessionKey,
			storePath
		},
		assertCurrent,
		release
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-transcript-images.ts
/** Recover only the referenced persisted bitmap; transcript bytes remain in their existing owner. */
async function findTranscriptImageArtifact(params, access, includeData) {
	const selected = await prepareArtifactSessionRead(params, access);
	if (!selected?.scope) return { sessionKey: selected?.sessionKey };
	const { artifact } = await readSessionArtifacts(selected.scope, {
		kind: "image",
		sessionKey: selected.sessionKey,
		artifactId: params.artifactId,
		includeData,
		runId: params.runId,
		messageRole: params.messageRole
	});
	selected.assertCurrent();
	return {
		sessionKey: selected.sessionKey,
		assertCurrent: selected.assertCurrent,
		artifact
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts.ts
const queuedArtifactDownloads = /* @__PURE__ */ new Map();
function createArtifactRequestAccess(request) {
	const { assertCurrent } = readGatewayRequestMutationAuthority(request);
	const { context, respond } = request;
	assertCurrent();
	return Object.assign(createArtifactSessionAccess({
		client: request.client,
		projection: getSessionRowProjection(context),
		getRuntimeConfig: () => {
			assertCurrent();
			return context.getRuntimeConfig();
		}
	}), {
		assertCurrent,
		respond: (...args) => {
			assertCurrent();
			respond(...args);
		}
	});
}
function artifactError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
async function loadArtifacts(query, access, opts = {}) {
	const selected = await prepareArtifactSessionRead(query, access);
	if (!selected?.scope) return {
		sessionKey: selected?.sessionKey,
		artifacts: []
	};
	const { sessionKey, scope, assertCurrent } = selected;
	const { storePath, sessionId, sessionEntry: entry } = scope;
	if (query.type === "image") {
		const page = await readArtifactImagePage({
			scope,
			binding: JSON.stringify([
				sessionKey,
				scope.agentId,
				sessionId,
				query.runId,
				query.messageRole
			]),
			client: access.client,
			cursor: query.cursor,
			limit: query.limit ?? 4,
			sessionKey,
			filters: {
				runId: query.runId,
				messageRole: query.messageRole
			}
		});
		assertCurrent();
		return {
			...page,
			sessionKey,
			assertCurrent
		};
	}
	const downloadIds = opts.downloadArtifactId ? /* @__PURE__ */ new Set([opts.downloadArtifactId]) : void 0;
	const queuedKey = downloadIds && !resolveSessionTranscriptReadFence(scope) ? JSON.stringify([
		storePath,
		scope.agentId,
		sessionKey,
		sessionId,
		entry?.lifecycleRevision,
		query.runId,
		query.messageRole,
		readSessionTranscriptUpdateVersion()
	]) : void 0;
	const queued = queuedKey ? queuedArtifactDownloads.get(queuedKey) : void 0;
	if (queued && opts.downloadArtifactId) {
		queued.ids.add(opts.downloadArtifactId);
		const loaded = await queued.result;
		assertCurrent();
		return {
			...loaded,
			assertCurrent
		};
	}
	const collect = async () => {
		if (queuedKey) queuedArtifactDownloads.delete(queuedKey);
		const { artifacts } = await readSessionArtifacts(scope, {
			kind: "list",
			sessionKey,
			runId: query.runId,
			messageRole: query.messageRole,
			includeDownloadData: opts.includeDownloadData,
			downloadArtifactIds: downloadIds ? [...downloadIds] : void 0
		});
		return {
			sessionKey,
			artifacts
		};
	};
	const result = queuedKey && downloadIds ? Promise.resolve().then(collect) : collect();
	if (queuedKey && downloadIds) queuedArtifactDownloads.set(queuedKey, {
		ids: downloadIds,
		result
	});
	const loaded = await result;
	assertCurrent();
	return {
		...loaded,
		assertCurrent
	};
}
function requireQueryable(params, respond) {
	if (params.sessionKey || params.runId) return true;
	respond(false, void 0, artifactError("artifact_query_unsupported", "artifacts require sessionKey or runId"));
	return false;
}
function respondArtifactNotFound(respond, requestedArtifactId) {
	respond(false, void 0, artifactError("artifact_not_found", "artifact not found", { artifactId: requestedArtifactId }));
}
async function runArtifactSessionOperation(respond, operation) {
	try {
		return {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		if (error instanceof ArtifactSessionResolutionError) {
			respond(false, void 0, error.shape);
			return { ok: false };
		}
		if (error instanceof AgentSelectionRequiredError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
			return { ok: false };
		}
		throw error;
	}
}
async function findArtifact(params, access, opts = {}) {
	if (parseTranscriptImageArtifactId(params.artifactId)) return findTranscriptImageArtifact(params, access, opts.includeDownloadData !== false);
	const loaded = await loadArtifacts(params, access, opts);
	return {
		sessionKey: loaded.sessionKey,
		artifact: loaded.artifacts.find((artifact) => artifact.id === params.artifactId),
		assertCurrent: loaded.assertCurrent
	};
}
async function prepareDownload(query, access) {
	const selected = await prepareArtifactSessionRead(query, access);
	if (!selected?.scope) return { sessionKey: selected?.sessionKey };
	const { selection } = await readSessionArtifacts(selected.scope, {
		...query,
		kind: "download-grant",
		sessionKey: selected.sessionKey
	});
	selected.assertCurrent();
	const result = {
		sessionKey: selected.sessionKey,
		assertCurrent: selected.assertCurrent,
		release: selected.release
	};
	return selection?.kind === "prepared" ? {
		...result,
		artifact: selection.download.artifact,
		download: selection.download
	} : {
		...result,
		artifact: selection?.artifact
	};
}
async function respondManagedArtifactDownload(query, access, respond, matched) {
	await runArtifactSessionOperation(respond, async () => {
		const resolved = await (await prepareArtifactSessionResolution(query, access.projection))(access);
		const cfg = access.getRuntimeConfig();
		const defaultAgentId = resolved ? tryResolveSessionCompatibilityOwnerAgentId(cfg, resolved.sessionKey) : void 0;
		const managed = resolved && (!matched || matched.sessionKey === resolved.sessionKey) ? await resolveManagedOutgoingMediaArtifactDownload({
			sessionKey: resolved.sessionKey,
			...resolved.agentId ? { agentId: resolved.agentId } : {},
			...defaultAgentId ? { defaultAgentId } : {},
			artifactId: query.artifactId
		}) : null;
		resolved?.readCurrent();
		if (!managed) {
			respondArtifactNotFound(respond, query.artifactId);
			return;
		}
		respond(true, {
			artifact: {
				id: managed.artifactId,
				type: managed.type,
				title: managed.title,
				...managed.mimeType ? { mimeType: managed.mimeType } : {},
				...managed.sizeBytes !== void 0 ? { sizeBytes: managed.sizeBytes } : {},
				sessionKey: managed.sessionKey,
				...matched?.runId ? { runId: matched.runId } : {},
				...matched?.messageSeq !== void 0 ? { messageSeq: matched.messageSeq } : {},
				source: "session-transcript",
				download: { mode: "url" }
			},
			url: managed.url,
			expiresAt: managed.expiresAt
		});
	});
}
const artifactsHandlers = {
	"artifacts.list": async (request) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const { params } = request;
			const access = _usingCtx$1.u(createArtifactRequestAccess(request));
			const { respond } = access;
			if (!assertValidParams(params, validateArtifactsListParams, "artifacts.list", respond)) return;
			if (!requireQueryable(params, respond)) return;
			if (params.type !== "image" && (params.limit !== void 0 || params.cursor !== void 0)) {
				respond(false, void 0, artifactError("artifact_query_unsupported", "limit and cursor require type image"));
				return;
			}
			const query = { ...params };
			const loaded = await runArtifactSessionOperation(respond, () => loadArtifacts(query, access, { includeDownloadData: false }));
			if (!loaded.ok) return;
			const { artifacts, sessionKey, nextCursor, omittedOversized } = loaded.value;
			if (!sessionKey && query.runId) {
				respond(false, void 0, artifactError("artifact_scope_not_found", "no session found for artifact query"));
				return;
			}
			if (artifactResponseIsCurrent(loaded.value, respond)) respond(true, {
				artifacts: artifacts.map(toArtifactSummary),
				...nextCursor ? { nextCursor } : {},
				...omittedOversized ? { omittedOversized: true } : {}
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	},
	"artifacts.get": async (request) => {
		try {
			var _usingCtx3 = _usingCtx();
			const { params } = request;
			const access = _usingCtx3.u(createArtifactRequestAccess(request));
			const { respond } = access;
			if (!assertValidParams(params, validateArtifactsGetParams, "artifacts.get", respond)) return;
			if (!requireQueryable(params, respond)) return;
			const query = { ...params };
			const found = await runArtifactSessionOperation(respond, () => findArtifact(query, access, { includeDownloadData: false }));
			if (!found.ok) return;
			const { artifact } = found.value;
			if (!artifact) {
				respondArtifactNotFound(respond, query.artifactId);
				return;
			}
			if (artifactResponseIsCurrent(found.value, respond)) respond(true, { artifact: toArtifactSummary(artifact) });
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			_usingCtx3.d();
		}
	},
	"artifacts.download": async (request) => {
		try {
			var _usingCtx4 = _usingCtx();
			const { params, client } = request;
			const access = _usingCtx4.u(createArtifactRequestAccess(request));
			const { respond, assertCurrent } = access;
			if (!assertValidParams(params, validateArtifactsDownloadParams, "artifacts.download", respond)) return;
			if (!requireQueryable(params, respond)) return;
			const query = { ...params };
			if (query.sessionKey && !query.runId && !query.messageRole && parseManagedOutgoingArtifactId(query.artifactId)) {
				await respondManagedArtifactDownload(query, access, respond);
				return;
			}
			let found = await runArtifactSessionOperation(respond, () => query.transport === "http" && canCreateArtifactDownload(client) ? prepareDownload(query, access) : findArtifact(query, access, { downloadArtifactId: query.artifactId }));
			assertCurrent();
			if (found.ok && found.value.download && !canCreateArtifactDownload(client)) {
				found = await runArtifactSessionOperation(respond, () => findArtifact(query, access, { downloadArtifactId: query.artifactId }));
				assertCurrent();
			}
			if (!found.ok) return;
			const { artifact } = found.value;
			if (!artifact) {
				respondArtifactNotFound(respond, query.artifactId);
				return;
			}
			if (parseManagedOutgoingArtifactId(artifact.id)) {
				await respondManagedArtifactDownload(query, access, respond, artifact);
				return;
			}
			if (artifact.download.mode === "unsupported") {
				respond(false, void 0, artifactError("artifact_download_unsupported", "artifact download is unsupported", { artifactId: artifact.id }));
				return;
			}
			if (found.value.download) {
				const assertArtifactCurrent = found.value.assertCurrent;
				const download = createArtifactDownload({
					client,
					prepared: found.value.download,
					release: found.value.release,
					assertCurrent: () => {
						assertCurrent();
						assertArtifactCurrent?.();
					},
					read: async (response) => {
						try {
							var _usingCtx5 = _usingCtx();
							const reader = _usingCtx5.u(createArtifactSessionAccess({
								getRuntimeConfig: access.getRuntimeConfig,
								client,
								projection: access.projection
							}));
							const selected = await prepareArtifactSessionRead(query, reader);
							if (!selected?.scope) return;
							const current = await readSessionArtifacts(selected.scope, {
								...query,
								kind: "download-response",
								sessionKey: selected.sessionKey,
								response
							});
							selected.assertCurrent();
							return current.response;
						} catch (_) {
							_usingCtx5.e = _;
						} finally {
							_usingCtx5.d();
						}
					}
				});
				access.detach(found.value.release);
				respond(true, {
					artifact: {
						...toArtifactSummary(artifact),
						download: { mode: "url" }
					},
					...download
				});
				return;
			}
			const managedUrl = artifact.download.mode === "url" && artifact.url && artifact.sessionKey ? await resolveManagedOutgoingMediaUrlDownload({
				sessionKey: artifact.sessionKey,
				url: artifact.url
			}) : null;
			if (!artifactResponseIsCurrent(found.value, respond)) return;
			const payload = {
				artifact: toArtifactSummary(artifact),
				...artifact.download.mode === "bytes" ? {
					encoding: "base64",
					data: artifact.data
				} : {},
				...artifact.download.mode === "url" ? {
					url: managedUrl?.url ?? artifact.url,
					...managedUrl ? { expiresAt: managedUrl.expiresAt } : {}
				} : {}
			};
			if (artifact.download.mode === "bytes") {
				const maxBase64Length = 4 * Math.floor(resolveChatAttachmentFrameBudgetBytes(MAX_PAYLOAD_BYTES) / 3);
				const envelopeBytes = Buffer.byteLength(JSON.stringify({
					type: "res",
					id: request.req.id,
					ok: true,
					payload: {
						...payload,
						data: ""
					}
				}));
				if ((artifact.data?.length ?? 0) > Math.min(maxBase64Length, 26214400 - envelopeBytes)) {
					respond(false, void 0, artifactError("artifact_download_unsupported", "artifact is too large for inline transfer; request transport: \"http\"", { artifactId: artifact.id }));
					return;
				}
			}
			respond(true, payload);
		} catch (_) {
			_usingCtx4.e = _;
		} finally {
			_usingCtx4.d();
		}
	}
};
//#endregion
export { artifactsHandlers };
