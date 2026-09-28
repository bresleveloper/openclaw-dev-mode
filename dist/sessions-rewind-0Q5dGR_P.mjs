import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ei as validateSessionsForkParams, ea as validateSessionsRewindParams, oi as validateSessionsBranchesListParams, si as validateSessionsBranchesSwitchParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { g as resolveOperatorSessionCreation, l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Bt6aG_wj.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-1lXXOteg.mjs";
import { Z as getSessionRepositoryWorkspaceStore, tt as withSessionInitializationSource } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { F as switchSessionBranch, N as forkSessionAtMessage, P as rewindSessionToMessage } from "./session-accessor-C05KQ5A3.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as ModelSelectionLockedError } from "./model-overrides-FXSJttoI.mjs";
import { n as listSessionBranches } from "./session-accessor.sqlite-branches-C7qzW4ha.mjs";
import { b as readSessionUpstreamLink } from "./session-state-events-M0m1rzDq.mjs";
import { t as MEDIA_MAX_BYTES, u as readMediaBuffer } from "./store-BrX2xbJz.mjs";
import { a as parseInboundMediaUri } from "./media-reference-C0dWWfb0.mjs";
import { s as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import "./session-sharing-C_5FkkwM.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-COSfbADi.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as clearSessionQueues } from "./cleanup-Oz9EeewQ.mjs";
import { t as recordSessionCreated } from "./session-created-lHTOLS92.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget, u as respondSessionWorkerPlacementMutationError } from "./sessions-shared-DPyHwOCR.mjs";
import { n as prepareSessionForkFilesystemRoot } from "./session-create-root-DONGPA9n.mjs";
import { i as resolveSessionNativeRuntimeRestriction } from "./sessions-patch-model-selection-tMceuYT7.mjs";
import { t as buildDashboardSessionKey } from "./session-create-service-yGvu8Ia2.mjs";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.mjs";
import { t as forkSessionRepositoryWorkspace } from "./session-repository-checkpoints-fQXt07uG.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-CquDiumg.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
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
/** Keep the source incarnation, creator ceiling, and fork execution policy current until native I/O. */
function createUpstreamForkCurrentGuard(params) {
	const expectedEntry = params.source.entry;
	if (!expectedEntry) throw new Error(`Session ${params.sessionKey} changed during fork initialization`);
	const readCurrent = () => {
		params.commitGuard();
		const currentConfig = params.context.getRuntimeConfig();
		const source = loadAccessorSessionEntryForGatewayTarget({
			key: params.sessionKey,
			cfg: currentConfig,
			agentId: params.requestedAgentId
		});
		const sourceEntry = source.entry;
		const currentLink = sourceEntry ? readSessionUpstreamLink(source.canonicalKey, source.target.agentId) : void 0;
		const currentForkHarness = currentLink ? resolveUpstreamForkHarness(currentLink) : void 0;
		if (!sourceEntry || sourceEntry.sessionId !== expectedEntry.sessionId || sourceEntry.lifecycleRevision !== expectedEntry.lifecycleRevision || sourceEntry.initializationPending === true || source.target.agentId !== params.source.target.agentId || source.canonicalKey !== params.source.canonicalKey || source.storePath !== params.source.storePath || !currentLink || currentLink.catalogId !== params.link.catalogId || currentLink.hostId !== params.link.hostId || currentLink.threadId !== params.link.threadId || currentLink.upstreamKind !== params.link.upstreamKind || !isDeepStrictEqual(currentLink.upstreamRef, params.link.upstreamRef) || !currentForkHarness || currentForkHarness.harness !== params.forkHarness.harness || currentForkHarness.contract !== params.forkHarness.contract || currentForkHarness.sessionFork !== params.forkHarness.sessionFork) throw new Error(`Session ${params.sessionKey} changed during fork initialization`);
		const creationError = authorizeGatewaySessionCreation({
			cfg: currentConfig,
			client: params.client,
			agentId: source.target.agentId
		});
		if (creationError) throw new SessionMutationAuthorizationChangedError(creationError);
		return {
			currentConfig,
			currentForkHarness,
			source,
			sourceEntry
		};
	};
	const assertCurrent = () => {
		const { currentConfig, currentForkHarness, source, sourceEntry } = readCurrent();
		const executionEnvironment = currentForkHarness.contract === "v2" ? currentForkHarness.sessionFork.executionEnvironment ?? currentForkHarness.harness.executionEnvironment : currentForkHarness.harness.executionEnvironment;
		if (executionEnvironment !== "host-only") return;
		const currentSandbox = sourceEntry.sandbox === "required" || resolveCreatorSandbox(currentConfig, resolveOperatorSessionCreation(params.client)) === "required" ? "required" : void 0;
		const sourceModel = resolveSessionModelRef(currentConfig, sourceEntry, source.target.agentId);
		const policyHarness = currentForkHarness.harness.executionEnvironment === "host-only" ? currentForkHarness.harness : {
			...currentForkHarness.harness,
			executionEnvironment
		};
		const restriction = resolveSessionNativeRuntimeRestriction({
			operation: "fork",
			cfg: currentConfig,
			agentId: source.target.agentId,
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
	return {
		assertCurrent,
		assertRollbackCurrent: () => void 0
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-rewind.ts
const EXTERNAL_CONVERSATION_ERROR = "Session history changes are unavailable because this session is owned by an external agent harness.";
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
const sessionRewindHandlers = {
	"sessions.branches.list": async (options) => {
		if (!assertValidParams(options.params, validateSessionsBranchesListParams, "sessions.branches.list", options.respond)) return;
		await listBranches(options);
	},
	"sessions.branches.switch": async (options) => {
		if (!assertValidParams(options.params, validateSessionsBranchesSwitchParams, "sessions.branches.switch", options.respond)) return;
		await mutateSessionAtMessage(options, "switch");
	},
	"sessions.rewind": async (options) => {
		if (!assertValidParams(options.params, validateSessionsRewindParams, "sessions.rewind", options.respond)) return;
		await mutateSessionAtMessage(options, "rewind");
	},
	"sessions.fork": async (options) => {
		if (!assertValidParams(options.params, validateSessionsForkParams, "sessions.fork", options.respond)) return;
		await mutateSessionAtMessage(options, "fork");
	}
};
async function listBranches(options) {
	const { params, respond, context } = options;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, typeof params.agentId === "string" ? params.agentId : void 0);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const read = retainSessionScopedRead(options, sessionKey, requestedAgent.agentId);
	try {
		const current = loadAccessorSessionEntryForGatewayTarget({
			key: sessionKey,
			cfg,
			agentId: requestedAgent.agentId
		});
		if (!current.entry?.sessionId) {
			respond(true, { branches: [] }, void 0);
			return;
		}
		if (readSessionUpstreamLink(current.canonicalKey, current.target.agentId)) {
			respond(true, { branches: [] }, void 0);
			return;
		}
		const result = await listSessionBranches({
			agentId: current.target.agentId,
			sessionKey: current.canonicalKey,
			sessionStoreKey: current.sessionStoreKey,
			storePath: current.storePath
		});
		read?.assertCurrent();
		if (result.status !== "ok") {
			respondBranchListError(result, respond);
			return;
		}
		respond(true, { branches: result.branches }, void 0);
	} finally {
		read?.release();
	}
}
async function mutateSessionAtMessage(options, action) {
	const { params, respond, context, client } = options;
	const { sessionMutationCommitGuard, sessionMutationAuthorization } = options;
	const commitGuard = () => {
		sessionMutationCommitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
	};
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	const entryId = action === "switch" ? typeof params.leafEntryId === "string" ? params.leafEntryId.trim() : "" : typeof params.entryId === "string" ? params.entryId.trim() : "";
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, typeof params.agentId === "string" ? params.agentId : void 0);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const initial = loadAccessorSessionEntryForGatewayTarget({
		key: sessionKey,
		cfg,
		agentId: requestedAgent.agentId
	});
	if (!initial.entry?.sessionId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${sessionKey}`));
		return;
	}
	const rejectInitializing = (pending) => {
		if (!pending) return false;
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${sessionKey} is initializing; retry ${action} later.`));
		return true;
	};
	if (rejectInitializing(initial.entry.initializationPending)) return;
	if (action === "fork") {
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: initial.target.agentId
		});
		if (creationError) {
			respond(false, void 0, creationError);
			return;
		}
	}
	const initialSessionId = initial.entry.sessionId;
	const initialLifecycleRevision = initial.entry.lifecycleRevision;
	if (readSessionUpstreamLink(initial.canonicalKey, initial.target.agentId) && action !== "fork") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, EXTERNAL_CONVERSATION_ERROR));
		return;
	}
	const initialPlacementError = resolveSessionWorkerPlacementMutationError({
		action,
		context,
		key: sessionKey,
		sessionId: initial.entry.sessionId
	});
	if (initialPlacementError) {
		respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
		return;
	}
	const lifecycleIdentities = [
		sessionKey,
		initial.canonicalKey,
		initial.sessionStoreKey,
		initialSessionId,
		initialLifecycleRevision
	];
	let targetStillCurrent = true;
	let blockedByActiveRun = false;
	await runExclusiveSessionLifecycleMutation({
		scope: initial.storePath,
		identities: lifecycleIdentities,
		prepare: async () => {
			const current = loadAccessorSessionEntryForGatewayTarget({
				key: sessionKey,
				cfg,
				agentId: requestedAgent.agentId
			});
			targetStillCurrent = current.entry?.sessionId === initialSessionId && current.entry.lifecycleRevision === initialLifecycleRevision;
			if (!targetStillCurrent) return;
			blockedByActiveRun = isCompetingSessionWorkAdmissionActive(initial.storePath, lifecycleIdentities) || (asWorkerInferenceControl(context.workerEnvironmentService)?.hasInferenceForSession(initialSessionId) ?? false) || resolveVisibleActiveSessionRunState({
				context,
				requestedKey: sessionKey,
				canonicalKey: current.canonicalKey,
				sessionId: initialSessionId,
				agentId: requestedAgent.agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			}).active;
		},
		run: async () => {
			commitGuard();
			if (!targetStillCurrent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${sessionKey} changed; retry ${action}.`));
				return;
			}
			if (blockedByActiveRun) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, action === "switch" ? "Branch switch is unavailable while the agent is working." : `${action === "fork" ? "Fork" : "Rewind"} is unavailable while the agent is working.`));
				return;
			}
			const current = loadAccessorSessionEntryForGatewayTarget({
				key: sessionKey,
				cfg,
				agentId: requestedAgent.agentId
			});
			if (current.entry?.sessionId !== initialSessionId || current.entry.lifecycleRevision !== initialLifecycleRevision) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${sessionKey} changed; retry ${action}.`));
				return;
			}
			if (rejectInitializing(current.entry.initializationPending)) return;
			const upstreamLink = readSessionUpstreamLink(current.canonicalKey, current.target.agentId);
			const archived = current.entry.archivedAt !== void 0;
			if ((archived || upstreamLink) && action !== "fork") {
				const message = archived ? `${action === "switch" ? "Branch switch" : "Rewind"} is unavailable for archived sessions.` : EXTERNAL_CONVERSATION_ERROR;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
				return;
			}
			const placementError = resolveSessionWorkerPlacementMutationError({
				action,
				context,
				key: sessionKey,
				sessionId: current.entry.sessionId
			});
			if (placementError) {
				respondSessionWorkerPlacementMutationError(placementError, respond);
				return;
			}
			const targetKey = action === "fork" ? buildDashboardSessionKey(current.target.agentId, { incognito: current.entry.incognito === true || isIncognitoSessionKey(current.canonicalKey) }) : current.canonicalKey;
			const expectedState = {
				sessionId: current.entry.sessionId,
				lifecycleRevision: current.entry.lifecycleRevision
			};
			const upstreamForkHarness = upstreamLink ? resolveUpstreamForkHarness(upstreamLink) : void 0;
			if (upstreamLink && !upstreamForkHarness) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, EXTERNAL_CONVERSATION_ERROR));
				return;
			}
			const creation = resolveOperatorSessionCreation(client);
			const sandbox = action === "fork" ? resolveCreatorSandbox(cfg, creation) : void 0;
			const upstreamForkGuard = upstreamLink && upstreamForkHarness ? createUpstreamForkCurrentGuard({
				client,
				commitGuard,
				context,
				forkHarness: upstreamForkHarness,
				link: upstreamLink,
				requestedAgentId: requestedAgent.agentId,
				sessionKey,
				source: current,
				targetKey
			}) : {
				assertCurrent: commitGuard,
				assertRollbackCurrent: commitGuard
			};
			if (upstreamForkHarness) try {
				upstreamForkGuard.assertCurrent();
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) {
					respond(false, void 0, error.error);
					return;
				}
				throw error;
			}
			const upstreamFork = upstreamLink && upstreamForkHarness ? await withSessionInitializationSource(upstreamForkGuard, (assertCurrent) => {
				const forkParams = {
					targetKey,
					sandbox,
					source: {
						agentId: current.target.agentId,
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
					agentId: requestedAgent.agentId,
					reason: "fork"
				});
				return;
			}
			const forkWorkspace = action === "fork" ? prepareSessionForkFilesystemRoot({
				cfg,
				parent: current.entry,
				targetAgentId: current.target.agentId,
				sessionKey: targetKey,
				sandboxRequired: sandbox === "required"
			}) : void 0;
			if (forkWorkspace && !forkWorkspace.ok) {
				respond(false, void 0, forkWorkspace.error);
				return;
			}
			let result;
			let forkRepositoryWorkspaceId;
			const mutationParams = {
				agentId: current.target.agentId,
				commitGuard,
				sessionKey: current.canonicalKey,
				sessionStoreKey: current.sessionStoreKey,
				storePath: current.storePath
			};
			try {
				if (action === "fork" && current.entry.repositoryWorkspaceId) {
					const repositories = getSessionRepositoryWorkspaceStore();
					const source = repositories.get(current.entry.repositoryWorkspaceId);
					const assertRepositoryCurrent = () => {
						commitGuard();
						const sourceEntry = loadAccessorSessionEntryForGatewayTarget({
							key: current.canonicalKey,
							cfg,
							agentId: current.target.agentId
						}).entry;
						if (!source || source.agentId !== current.target.agentId || source.sessionKey !== current.canonicalKey || sourceEntry?.sessionId !== initialSessionId || sourceEntry.lifecycleRevision !== initialLifecycleRevision || sourceEntry.repositoryWorkspaceId !== source.workspaceId || repositories.get(source.workspaceId)?.revision !== source.revision) throw new Error("Repository workspace changed before session fork");
					};
					assertRepositoryCurrent();
					forkRepositoryWorkspaceId = (await forkSessionRepositoryWorkspace({
						sourceWorkspaceId: current.entry.repositoryWorkspaceId,
						agentId: current.target.agentId,
						sessionKey: targetKey,
						assertCurrent: assertRepositoryCurrent
					})).workspaceId;
					mutationParams.commitGuard = assertRepositoryCurrent;
				}
				result = await (action === "fork" ? forkSessionAtMessage({
					...mutationParams,
					entryId,
					targetKey,
					repositoryWorkspaceId: forkRepositoryWorkspaceId,
					forkWorkspace: forkWorkspace?.value,
					creation: {
						...creation,
						sandbox
					}
				}, expectedState) : action === "rewind" ? rewindSessionToMessage({
					...mutationParams,
					entryId
				}, expectedState) : switchSessionBranch({
					...mutationParams,
					leafEntryId: entryId
				}, expectedState));
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				if (error instanceof ModelSelectionLockedError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Failed to ${action} the local session. Try again.`));
				return;
			} finally {
				if (forkRepositoryWorkspaceId) {
					const forkEntry = () => loadAccessorSessionEntryForGatewayTarget({
						key: targetKey,
						cfg,
						agentId: current.target.agentId
					}).entry;
					if (forkEntry()?.repositoryWorkspaceId !== forkRepositoryWorkspaceId) await getSessionRepositoryWorkspaceStore().delete({
						workspaceId: forkRepositoryWorkspaceId,
						assertCurrent: () => {
							if (forkEntry()?.repositoryWorkspaceId === forkRepositoryWorkspaceId) throw new Error("Repository fork was committed before cleanup");
						}
					});
				}
			}
			if (result.status !== "created") {
				respondMessageCutError(result, action, entryId, respond);
				return;
			}
			const editorAttachments = action === "switch" ? [] : [..."editorAttachments" in result ? result.editorAttachments ?? [] : [], ...await resolveEditorMediaAttachments("editorMediaRefs" in result ? result.editorMediaRefs : void 0)];
			if (action !== "fork") clearSessionQueues(lifecycleIdentities);
			else recordSessionCreated(cfg, {
				sessionKey: result.key,
				agentId: current.target.agentId,
				entry: result.entry
			});
			respond(true, action === "fork" ? {
				sessionKey: result.key,
				..."editorText" in result && result.editorText ? { editorText: result.editorText } : {},
				...editorAttachments.length > 0 ? { editorAttachments } : {}
			} : action === "rewind" ? {
				..."editorText" in result && result.editorText ? { editorText: result.editorText } : {},
				...editorAttachments.length > 0 ? { editorAttachments } : {}
			} : {}, void 0);
			emitSessionsChanged(context, {
				sessionKey: action === "fork" ? result.key : current.canonicalKey,
				agentId: requestedAgent.agentId,
				reason: action === "switch" ? "branch-switch" : action
			});
		}
	});
}
function respondMessageCutError(result, action, entryId, respond) {
	const actionLabel = action === "switch" ? "branch switch" : action;
	const message = result.status === "conflict" ? `Session changed; retry ${action}.` : result.status === "missing-session" ? "session not found" : result.status === "missing-entry" ? `${action === "switch" ? "branch" : "message"} entry not found: ${entryId}` : result.status === "not-branch-tip" ? `entry is not a branch tip: ${entryId}` : result.status === "already-active" ? `branch is already active: ${entryId}` : result.status === "not-user-message" ? `entry is not a user message: ${entryId}` : result.status === "off-active-path" ? `message entry is not on the active path: ${entryId}` : result.status === "unsupported-storage" ? `session transcript storage does not support ${actionLabel}` : `failed to ${actionLabel} session`;
	respond(false, void 0, errorShape(result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, message));
}
function respondBranchListError(result, respond) {
	const message = result.status === "missing-session" ? "session not found" : result.status === "unsupported-storage" ? "session transcript storage does not support branch listing" : "failed to list session branches";
	respond(false, void 0, errorShape(result.status === "failed" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, message));
}
//#endregion
export { sessionRewindHandlers };
