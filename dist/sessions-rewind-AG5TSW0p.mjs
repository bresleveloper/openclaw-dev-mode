import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, Pa as validateSessionsRewindParams, Ri as validateSessionsBranchesListParams, oa as validateSessionsForkParams, zi as validateSessionsBranchesSwitchParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { p as listSessionBranches } from "./session-accessor-Czw4l8kI.mjs";
import { D as getSessionRepositoryWorkspaceStore, I as prepareSessionCapabilityRead, j as withSessionInitializationSource } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as mutateSessionAtMessageWithPreconditions } from "./session-accessor.sqlite-message-cut-CcapwxKq.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import "./session-sharing-DuL10izq.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-BDZ8eM01.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { a as withPreparedSessionEventRow } from "./session-event-prepared-row-PHOK4R6h.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CAoWtmWT.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as MEDIA_MAX_BYTES, u as readMediaBuffer } from "./store-BOkrav0N.mjs";
import "./media-reference-Dlq4zAi4.mjs";
import { l as readSessionWorkerPlacementAsync, u as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import { r as prepareSessionForkFilesystemRoot } from "./session-create-root-lHgGqSce.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-CjvcBZOl.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-Bk4Jd75M.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-COi00Wg4.mjs";
import { t as forkSessionRepositoryWorkspace } from "./session-repository-checkpoints-C4TGwsPq.mjs";
import "./sessions-shared-DECO-QN2.mjs";
import { a as resolveSessionNativeRuntimeRestriction } from "./sessions-patch-model-selection-HDHD8IDv.mjs";
import { t as buildDashboardSessionKey } from "./session-create-key-BJp-9Sd1.mjs";
import { t as waitForTerminalSessionRunSettlement } from "./session-run-settlement-mY-e-9lD.mjs";
import { n as prepareSessionUpstreamLink, r as readCurrentSessionUpstreamLink, t as captureSessionUpstreamLinkReadSource } from "./session-upstream-links-runtime-3vVKBo1p.mjs";
import path from "node:path";
//#region src/gateway/server-methods/session-rewind-editor-media.ts
const EDITOR_MEDIA_REF_LIMIT = 10;
async function resolveEditorMediaAttachments(refs) {
	if (!refs) return [];
	const seen = /* @__PURE__ */ new Set();
	const attachments = [];
	for (const ref of refs) {
		let id;
		try {
			id = parseInboundMediaUri(ref.path)?.id ?? path.basename(ref.path);
		} catch {
			continue;
		}
		if (seen.has(id)) continue;
		seen.add(id);
		if (seen.size > EDITOR_MEDIA_REF_LIMIT) break;
		try {
			const media = await readMediaBuffer(id, "inbound", MEDIA_MAX_BYTES);
			attachments.push({
				mimeType: ref.contentType,
				data: media.buffer.toString("base64")
			});
		} catch {}
	}
	return attachments;
}
//#endregion
//#region src/gateway/server-methods/session-rewind-repository-entries.ts
/** Source edits revoke the fork; a changed destination conservatively retains its repository. */
async function prepareRewindRepositoryEntries(source, targetKey, assertCurrent) {
	const scope = {
		agentId: source.agentId,
		sessionKey: source.canonicalKey,
		storePath: source.storePath
	};
	const memory = getSessionActorStorageBinding(scope);
	const metadata = captureSessionEntryMetadataRead(scope, assertCurrent);
	const memoryOwner = memory && captureSessionActorStorageOwner(memory);
	if (memory || metadata || isIncognitoSessionKey(source.canonicalKey)) {
		const read = (key) => {
			if (memory) return memoryOwner?.owner?.readSession(key, memory.authority)?.entry;
			if (metadata) return key === source.canonicalKey ? metadata.readCurrent() : captureSessionEntryMetadataRead({
				...scope,
				sessionKey: key
			}, assertCurrent)?.readCurrent();
		};
		return {
			readSource: () => read(source.canonicalKey),
			isForkUnclaimed: (workspaceId) => read(targetKey)?.repositoryWorkspaceId !== workspaceId,
			[Symbol.dispose]() {}
		};
	}
	let active = true;
	let databaseIdentity;
	let unregister = () => {};
	const retained = /* @__PURE__ */ new Map();
	const release = () => {
		active = false;
		for (const predicate of retained.values()) predicate.release();
		unregister();
	};
	try {
		const entries = await withSessionEntriesFromStoresInWorker([{
			...scope,
			sessionKeys: [source.canonicalKey, targetKey],
			projection: "list"
		}], ([read]) => {
			assertCurrent();
			const selected = new Map(read.result.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			if (!active || !databaseIdentity?.startsWith("file:")) throw new Error("Repository fork session source is unavailable");
			for (const key of [source.canonicalKey, targetKey]) retained.set(key, retainPreparedSessionEntryPredicate({
				databaseIdentity,
				sessionKey: key,
				entry: selected.get(key),
				matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision && before?.repositoryWorkspaceId === after?.repositoryWorkspaceId
			}));
			return selected;
		}, { prepareSource: (_input, database, identity) => {
			databaseIdentity = identity.key;
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				...database,
				revoke: release,
				close: async () => release()
			});
		} });
		return {
			readSource: () => {
				if (!active || !retained.get(source.canonicalKey)?.isCurrent()) throw new Error("Repository fork session owner changed");
				return entries.get(source.canonicalKey);
			},
			isForkUnclaimed: (workspaceId) => active && retained.get(targetKey)?.isCurrent() === true && entries.get(targetKey)?.repositoryWorkspaceId !== workspaceId,
			[Symbol.dispose]: release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-branches-list.ts
async function listSessionBranchesForGateway(options) {
	const { params, respond, context } = options;
	const sessionKey = params.sessionKey.trim();
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const read = await retainSessionScopedRead(options, sessionKey, requestedAgent.agentId, { allowMetadataChanges: true });
	const run = () => withGatewaySessionEntryReadOnly({
		key: sessionKey,
		cfg,
		agentId: requestedAgent.agentId,
		excludeInternalEffects: true,
		projection: "list",
		prepared: read?.prepared
	}, async (current, assertCurrent) => {
		const upstreamLink = current.entry?.sessionId ? await prepareSessionUpstreamLink(captureSessionUpstreamLinkReadSource(), current.canonicalKey, current.agentId) : void 0;
		assertCurrent();
		read?.assertCurrent();
		if (!current.entry?.sessionId || upstreamLink) {
			respond(true, { branches: [] }, void 0);
			return;
		}
		const memory = getSessionActorStorageBinding({
			sessionKey: current.canonicalKey,
			agentId: current.agentId,
			storePath: current.storePath
		});
		const result = memory ? await memory.actor.storage.read({
			type: "session.history.branches",
			input: {}
		}, memory.authority) : await listSessionBranches({
			agentId: current.agentId,
			sessionKey: current.canonicalKey,
			sessionStoreKey: current.canonicalKey,
			storePath: current.storePath
		});
		assertCurrent();
		read?.assertCurrent();
		if (result.status !== "ok") {
			respond(false, void 0, errorShape(result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, {
				"missing-session": "session not found",
				"unsupported-storage": "session transcript storage does not support branch listing",
				failed: "failed to list session branches"
			}[result.status]));
			return;
		}
		respond(true, { branches: result.branches }, void 0);
	});
	const assertCurrent = () => read?.assertCurrent();
	try {
		if (!await withSessionActorStorage({
			sessionKey,
			agentId: requestedAgent.agentId
		}, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: {
				assertCurrent,
				authorize() {}
			}
		}, async () => {
			await run();
			return true;
		})) await run();
	} finally {
		read?.release();
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-fork-runtime-guard.ts
function resolveUpstreamForkHarness(link) {
	const matches = [];
	for (const { harness } of listRegisteredAgentHarnesses()) if (harness.sessionForkV2?.upstreamKinds.includes(link.upstreamKind)) matches.push({
		harness,
		contract: "v2",
		sessionFork: harness.sessionForkV2
	});
	else if (harness.sessionFork?.upstreamKinds.includes(link.upstreamKind)) matches.push({
		harness,
		contract: "legacy",
		sessionFork: harness.sessionFork
	});
	return matches.length === 1 ? matches[0] : void 0;
}
/** Keep source identity and execution authority current until native I/O. */
async function prepareUpstreamForkCurrentGuard(params) {
	const expectedEntry = params.source.entry;
	if (!expectedEntry) throw new Error(`Session ${params.sessionKey} changed during fork initialization`);
	const sourceMetadata = captureSessionEntryMetadataRead({
		agentId: params.source.agentId,
		sessionKey: params.source.canonicalKey,
		storePath: params.source.storePath
	}, params.commitGuard);
	const assertCurrent = () => {
		params.commitGuard();
		const currentConfig = params.context.getRuntimeConfig();
		const source = params.source;
		const sourceEntry = sourceMetadata ? sourceMetadata.readCurrent() : readRetainedSessionEntryFacts({
			agentId: source.readSource?.agentId ?? source.agentId,
			path: source.readSource?.path ?? source.storePath
		}, { sessionKeys: [source.canonicalKey] })?.entries.find((row) => row.sessionKey === source.canonicalKey)?.entry;
		if (!sourceEntry || sourceEntry.sessionId !== expectedEntry.sessionId || sourceEntry.lifecycleRevision !== expectedEntry.lifecycleRevision || sourceEntry.initializationPending === true || source.agentId !== params.source.agentId || source.canonicalKey !== params.source.canonicalKey || source.storePath !== params.source.storePath) throw new Error(`Session ${params.sessionKey} changed during fork initialization`);
		const creationError = authorizeGatewaySessionCreation({
			cfg: currentConfig,
			client: params.client,
			agentId: source.agentId
		});
		if (creationError) throw new SessionMutationAuthorizationChangedError(creationError);
		const currentForkHarness = params.forkHarness;
		const executionEnvironment = currentForkHarness.contract === "v2" ? currentForkHarness.sessionFork.executionEnvironment ?? currentForkHarness.harness.executionEnvironment : currentForkHarness.harness.executionEnvironment;
		if (executionEnvironment !== "host-only") return;
		const currentSandbox = sourceEntry.sandbox === "required" || resolveCreatorSandbox(currentConfig, resolveOperatorSessionCreation(params.client)) === "required" ? "required" : void 0;
		const sourceModel = resolveSessionModelRef(currentConfig, sourceEntry, source.agentId);
		const policyHarness = currentForkHarness.harness.executionEnvironment === "host-only" ? currentForkHarness.harness : {
			...currentForkHarness.harness,
			executionEnvironment
		};
		const restriction = resolveSessionNativeRuntimeRestriction({
			operation: "fork",
			cfg: currentConfig,
			agentId: source.agentId,
			sessionKey: params.targetKey,
			entry: currentSandbox === "required" ? { sandbox: "required" } : {},
			persistedEntry: void 0,
			harness: policyHarness,
			provider: sourceModel.provider,
			modelId: sourceModel.model,
			callerCanConsent: false
		});
		if (restriction) throw new SessionMutationAuthorizationChangedError(restriction);
	};
	const prepared = await prepareSessionCapabilityRead(assertCurrent);
	return {
		assertCurrent: prepared.read,
		release: prepared.release,
		assertRollbackCurrent: () => void 0
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-rewind.ts
const EXTERNAL_CONVERSATION_ERROR = "Session history changes are unavailable because this session is owned by an external agent harness.";
const sessionRewindHandlers = {
	"sessions.branches.list": defineValidatedGatewayHandler("sessions.branches.list", validateSessionsBranchesListParams, listSessionBranchesForGateway),
	"sessions.branches.switch": defineValidatedGatewayHandler("sessions.branches.switch", validateSessionsBranchesSwitchParams, (options) => mutateSessionAtMessage(options, "switch")),
	"sessions.rewind": defineValidatedGatewayHandler("sessions.rewind", validateSessionsRewindParams, (options) => mutateSessionAtMessage(options, "rewind")),
	"sessions.fork": defineValidatedGatewayHandler("sessions.fork", validateSessionsForkParams, (options) => mutateSessionAtMessage(options, "fork"))
};
async function mutateSessionAtMessage(options, action) {
	const { params, respond, context } = options;
	const sessionKey = params.sessionKey.trim();
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const run = () => withGatewaySessionEntryReadOnly({
		key: sessionKey,
		cfg,
		agentId: requestedAgent.agentId,
		excludeInternalEffects: true
	}, async (initial, assertSourceCurrent) => mutatePreparedSessionAtMessage({
		options,
		action,
		cfg,
		requestedAgentId: requestedAgent.agentId,
		initial,
		assertSourceCurrent
	}));
	const assertCurrent = () => {
		options.sessionMutationCommitGuard?.();
		options.sessionMutationAuthorization?.assertCurrent();
	};
	if (!await withSessionActorStorage({
		sessionKey,
		agentId: requestedAgent.agentId
	}, {
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize() {}
		}
	}, async () => {
		await run();
		return true;
	})) await run();
}
async function mutatePreparedSessionAtMessage({ options, action, cfg, requestedAgentId, initial, assertSourceCurrent }) {
	const { params, respond, context, client } = options;
	const memory = getSessionActorStorageBinding({
		sessionKey: initial.canonicalKey,
		agentId: initial.agentId,
		storePath: initial.storePath
	});
	const reject = (message, code = ErrorCodes.INVALID_REQUEST) => respond(false, void 0, errorShape(code, message));
	const { sessionMutationCommitGuard, sessionMutationAuthorization } = options;
	const commitGuard = () => {
		sessionMutationCommitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
	};
	const sessionKey = params.sessionKey.trim();
	const entryId = ("leafEntryId" in params ? params.leafEntryId : params.entryId).trim();
	const loadCurrent = () => withGatewaySessionEntryReadOnly({
		key: sessionKey,
		cfg,
		agentId: requestedAgentId,
		excludeInternalEffects: true
	}, async (current) => {
		assertSourceCurrent();
		commitGuard();
		return current;
	});
	if (!initial.entry?.sessionId) {
		reject(`session not found: ${sessionKey}`);
		return;
	}
	const rejectInitializing = (pending) => {
		if (!pending) return false;
		reject(`Session ${sessionKey} is initializing; retry ${action} later.`, ErrorCodes.UNAVAILABLE);
		return true;
	};
	if (rejectInitializing(initial.entry.initializationPending)) return;
	if (action === "fork") {
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: initial.agentId
		});
		if (creationError) {
			respond(false, void 0, creationError);
			return;
		}
	}
	const assertMutationCurrent = () => {
		assertSourceCurrent();
		commitGuard();
	};
	const initialSessionId = initial.entry.sessionId;
	const initialLifecycleRevision = initial.entry.lifecycleRevision;
	const upstreamContext = captureSessionUpstreamLinkReadSource();
	const upstreamLink = action === "fork" ? await prepareSessionUpstreamLink(upstreamContext, initial.canonicalKey, initial.agentId) : void 0;
	assertMutationCurrent();
	const lifecycleIdentities = [
		sessionKey,
		initial.canonicalKey,
		initialSessionId,
		initialLifecycleRevision
	];
	const terminalSettled = await waitForTerminalSessionRunSettlement({
		context,
		storePath: initial.storePath,
		requestedKey: sessionKey,
		canonicalKey: initial.canonicalKey,
		sessionId: initialSessionId,
		agentId: requestedAgentId,
		defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey),
		signal: options.signal
	});
	let blockedByActiveRun = false;
	await runExclusiveSessionLifecycleMutation(action, {
		scope: initial.storePath,
		identities: lifecycleIdentities,
		prepare: async () => {
			const current = await loadCurrent();
			blockedByActiveRun = !terminalSettled || isCompetingSessionWorkAdmissionActive(initial.storePath, lifecycleIdentities) || (getWorkerInferenceSessionControl(context.workerEnvironmentService)?.hasSession(initialSessionId) ?? false) || resolveVisibleActiveSessionRunState({
				context,
				requestedKey: sessionKey,
				canonicalKey: current.canonicalKey,
				sessionId: initialSessionId,
				agentId: requestedAgentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			}).active;
		},
		run: async () => {
			try {
				var _usingCtx$1 = _usingCtx();
				assertMutationCurrent();
				if (blockedByActiveRun) {
					reject(action === "switch" ? "Branch switch is unavailable while the agent is working." : `${action === "fork" ? "Fork" : "Rewind"} is unavailable while the agent is working.`, ErrorCodes.UNAVAILABLE);
					return;
				}
				const current = await loadCurrent();
				if (!current.entry || !memory && (current.entry?.sessionId !== initialSessionId || current.entry.lifecycleRevision !== initialLifecycleRevision || current.storePath !== initial.storePath || current.canonicalKey !== initial.canonicalKey || current.agentId !== initial.agentId)) {
					reject(`Session ${sessionKey} changed; retry ${action}.`);
					return;
				}
				if (rejectInitializing(current.entry.initializationPending)) return;
				upstreamContext.assertCurrent();
				const archived = current.entry.archivedAt !== void 0;
				if ((archived || upstreamLink) && action !== "fork") {
					reject(archived ? `${action === "switch" ? "Branch switch" : "Rewind"} is unavailable for archived sessions.` : EXTERNAL_CONVERSATION_ERROR);
					return;
				}
				await readSessionWorkerPlacementAsync({
					context,
					sessionId: current.entry.sessionId
				});
				const placementError = resolveSessionWorkerPlacementMutationError({
					action,
					context,
					key: sessionKey,
					sessionId: current.entry.sessionId
				});
				if (placementError) {
					reject(placementError.message);
					return;
				}
				const targetKey = action === "fork" ? buildDashboardSessionKey(current.agentId, { incognito: current.entry.incognito === true || isIncognitoSessionKey(current.canonicalKey) }) : current.canonicalKey;
				const expectedState = {
					sessionId: current.entry.sessionId,
					lifecycleRevision: current.entry.lifecycleRevision
				};
				const upstreamForkHarness = upstreamLink ? resolveUpstreamForkHarness(upstreamLink) : void 0;
				if (upstreamLink && !upstreamForkHarness) {
					reject(EXTERNAL_CONVERSATION_ERROR);
					return;
				}
				const creation = resolveOperatorSessionCreation(client);
				const sandbox = action === "fork" ? resolveCreatorSandbox(cfg, creation) : void 0;
				let upstreamForkGuard;
				try {
					upstreamForkGuard = upstreamLink && upstreamForkHarness ? await prepareUpstreamForkCurrentGuard({
						client,
						commitGuard: assertMutationCurrent,
						context,
						forkHarness: upstreamForkHarness,
						requestedAgentId,
						sessionKey,
						source: current,
						targetKey
					}) : {
						assertCurrent: assertMutationCurrent,
						assertRollbackCurrent: assertMutationCurrent
					};
				} catch (error) {
					if (error instanceof SessionMutationAuthorizationChangedError) {
						respond(false, void 0, error.error);
						return;
					}
					throw error;
				}
				const upstreamFork = await (async () => {
					try {
						return upstreamLink && upstreamForkHarness ? await withSessionInitializationSource(upstreamForkGuard, (assertCurrent) => {
							const forkParams = {
								targetKey,
								sandbox,
								source: {
									agentId: current.agentId,
									sessionId: initialSessionId,
									sessionKey: current.canonicalKey,
									storePath: current.storePath,
									entryId
								},
								upstream: {
									catalogId: upstreamLink.catalogId,
									hostId: upstreamLink.hostId,
									kind: upstreamLink.upstreamKind,
									threadId: upstreamLink.threadId,
									ref: upstreamLink.upstreamRef
								}
							};
							return upstreamForkHarness.contract === "v2" ? upstreamForkHarness.sessionFork.fork({
								...forkParams,
								assertCurrent
							}) : upstreamForkHarness.sessionFork.fork(forkParams);
						}) : void 0;
					} finally {
						upstreamForkGuard.release?.();
					}
				})();
				if (upstreamFork?.status === "failed") {
					respond(false, void 0, errorShape(upstreamFork.code === "upstream-unavailable" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, upstreamFork.message, { details: { reason: upstreamFork.code } }));
					return;
				}
				if (upstreamFork?.status === "created") {
					respond(true, {
						sessionKey: upstreamFork.key,
						...upstreamFork.editorText !== void 0 ? { editorText: upstreamFork.editorText } : {}
					}, void 0);
					emitSessionsChanged(context, {
						sessionKey: upstreamFork.key,
						agentId: requestedAgentId,
						reason: "fork"
					});
					return;
				}
				const forkWorkspace = action === "fork" ? prepareSessionForkFilesystemRoot({
					cfg,
					parent: current.entry,
					targetAgentId: current.agentId,
					sessionKey: targetKey,
					sandboxRequired: sandbox === "required"
				}) : void 0;
				if (forkWorkspace && !forkWorkspace.ok) {
					respond(false, void 0, forkWorkspace.error);
					return;
				}
				let result;
				let repositoryForkCommitted = false;
				let forkRepository;
				const repositoryEntries = _usingCtx$1.u(action === "fork" && current.entry.repositoryWorkspaceId ? await prepareRewindRepositoryEntries(current, targetKey, assertMutationCurrent) : void 0);
				const mutationParams = {
					agentId: current.agentId,
					commitGuard: assertMutationCurrent,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.canonicalKey,
					storePath: current.storePath
				};
				const upstreamChanged = new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, action === "fork" ? "Session changed; retry fork." : EXTERNAL_CONVERSATION_ERROR));
				const assertLocalUpstreamCurrent = () => {
					if (readCurrentSessionUpstreamLink(upstreamContext, current.canonicalKey, current.agentId)) throw upstreamChanged;
				};
				try {
					if (action === "fork" && current.entry.repositoryWorkspaceId) {
						const repositories = getSessionRepositoryWorkspaceStore();
						const repositorySource = captureOpenClawStateWorkerContext({ path: repositories.path });
						const preparedSource = await repositories.prepare(current.entry.repositoryWorkspaceId);
						const source = preparedSource.workspace;
						if (!source) throw new Error("Repository workspace changed before session fork");
						const assertRepositoryOwnerCurrent = () => {
							repositorySource.admission.assertCurrent();
							assertMutationCurrent();
							if (source.agentId !== current.agentId || source.sessionKey !== current.canonicalKey || preparedSource.current()?.revision !== source.revision) throw new Error("Repository workspace changed before session fork");
						};
						const assertRepositoryCurrent = () => {
							assertRepositoryOwnerCurrent();
							assertLocalUpstreamCurrent();
							const sourceEntry = repositoryEntries?.readSource();
							if (sourceEntry?.sessionId !== initialSessionId || sourceEntry.lifecycleRevision !== initialLifecycleRevision || sourceEntry.repositoryWorkspaceId !== source.workspaceId) throw new Error("Repository workspace changed before session fork");
						};
						assertRepositoryCurrent();
						forkRepository = {
							workspaceId: (await forkSessionRepositoryWorkspace({
								sourceWorkspaceId: current.entry.repositoryWorkspaceId,
								agentId: current.agentId,
								sessionKey: targetKey,
								assertCurrent: assertRepositoryCurrent
							})).workspaceId,
							sourceWorkspaceId: source.workspaceId,
							store: repositories,
							source: repositorySource
						};
						mutationParams.commitGuard = assertRepositoryOwnerCurrent;
					}
					const forkParams = {
						...mutationParams,
						entryId,
						targetKey,
						repositoryWorkspaceId: forkRepository?.workspaceId,
						forkWorkspace: forkWorkspace?.value,
						creation: {
							...creation,
							sandbox
						}
					};
					result = await mutateSessionAtMessageWithPreconditions(action === "fork" ? forkParams : {
						...mutationParams,
						entryId
					}, action, memory ? void 0 : expectedState, {
						sourceRepositoryWorkspaceId: forkRepository?.sourceWorkspaceId,
						assertUpstreamCurrent: assertLocalUpstreamCurrent
					});
					repositoryForkCommitted = result.status === "created";
				} catch (error) {
					if (error === upstreamChanged) {
						respond(false, void 0, upstreamChanged.error);
						return;
					}
					if (error instanceof SessionMutationAuthorizationChangedError) throw error;
					if (error instanceof ModelSelectionLockedError) {
						reject(error.message);
						return;
					}
					reject(`Failed to ${action} the local session. Try again.`, ErrorCodes.UNAVAILABLE);
					return;
				} finally {
					if (forkRepository && !repositoryForkCommitted) {
						const { workspaceId, store, source } = forkRepository;
						if (repositoryEntries?.isForkUnclaimed(workspaceId)) await store.delete({
							workspaceId,
							assertCurrent: () => {
								source.admission.assertCurrent();
								if (!repositoryEntries?.isForkUnclaimed(workspaceId)) throw new Error("Repository fork was committed before cleanup");
							}
						});
					}
				}
				if (result.status !== "created") {
					const actionLabel = action === "switch" ? "branch switch" : action;
					const message = {
						conflict: `Session changed; retry ${action}.`,
						"missing-session": "session not found",
						"missing-entry": `${action === "switch" ? "branch" : "message"} entry not found: ${entryId}`,
						"not-branch-tip": `entry is not a branch tip: ${entryId}`,
						"already-active": `branch is already active: ${entryId}`,
						"not-user-message": `entry is not a user message: ${entryId}`,
						"off-active-path": `message entry is not on the active path: ${entryId}`,
						"unsupported-storage": `session transcript storage does not support ${actionLabel}`,
						failed: `failed to ${actionLabel} session`
					}[result.status];
					reject(message, result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST);
					return;
				}
				const committedResult = result;
				const complete = async () => {
					const editorAttachments = action === "switch" ? [] : [..."editorAttachments" in committedResult ? committedResult.editorAttachments ?? [] : [], ...await resolveEditorMediaAttachments("editorMediaRefs" in committedResult ? committedResult.editorMediaRefs : void 0)];
					if (action !== "fork") clearSessionLifecycleQueues({
						keys: lifecycleIdentities,
						agentId: current.agentId,
						sessionKey: current.canonicalKey,
						sessionId: initialSessionId,
						assertCurrent: () => {}
					});
					else await recordSessionCreated(cfg, {
						sessionKey: committedResult.key,
						agentId: current.agentId,
						entry: committedResult.entry
					});
					respond(true, action === "switch" ? {} : {
						...action === "fork" ? { sessionKey: committedResult.key } : {},
						..."editorText" in committedResult && committedResult.editorText ? { editorText: committedResult.editorText } : {},
						...editorAttachments.length > 0 ? { editorAttachments } : {}
					}, void 0);
					const payload = {
						sessionKey: action === "fork" ? committedResult.key : current.canonicalKey,
						sessionId: committedResult.entry.sessionId,
						agentId: requestedAgentId,
						reason: action === "switch" ? "branch-switch" : action
					};
					if (memory) try {
						await withPreparedSessionEventRow(getSessionRowProjection(context), payload.sessionKey, payload.agentId, (sessionRows) => emitSessionsChanged(context, payload, {
							preparedPublication: true,
							sessionRows
						}));
					} catch (error) {
						sessionLog.warn(`Session change preparation failed: ${String(error)}`);
						emitSessionsChanged(context, payload, { preparedPublication: true });
					}
					else emitSessionsChanged(context, payload);
				};
				if (memory) {
					const assertCurrent = readGatewayRequestMutationAuthority(options).assertLifetimeCurrent;
					const actor = await memory.actor.storage.acquire(committedResult.key, {
						assertCurrent,
						assertReadable: assertCurrent
					});
					try {
						await runWithSessionActorStorage({
							...memory,
							actor,
							authority: {
								assertCurrent,
								authorize() {}
							}
						}, complete);
					} finally {
						await actor.release();
					}
				} else await complete();
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}
	});
}
//#endregion
export { sessionRewindHandlers };
