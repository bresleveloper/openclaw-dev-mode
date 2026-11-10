import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { C as tryResolveAgentOperationAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape, Qi as validateSessionsDeleteParams } from "./src-pLJQA6J5.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { a as handleSessionStateSessionDeleted } from "./session-state-events-BCzDVKh0.mjs";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as isModelSelectionLocked } from "./model-overrides-CgHG3YVT.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { a as isAgentHarnessSessionKey } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { a as rollbackPluginOwnedSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { s as prepareSessionWorkerPlacementRetirement } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as SessionResetCleanupError } from "./session-reset-cleanup-u-ZRUSad.mjs";
import { a as cleanupSessionBeforeMutation, o as emitSessionUnboundLifecycleEvent, r as emitGatewaySessionEndPluginHook } from "./session-reset-service-UpoJ2er7.mjs";
import { n as removeSessionWorktree } from "./session-worktree-lifecycle-BMwsFta4.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { n as prepareSessionLifecycleDrain, t as SessionLifecycleWorkspaceRecoveryError } from "./sessions-lifecycle-drain-bs9bSf42.mjs";
import { a as requireSessionKey, n as isAgentMainSessionKey } from "./sessions-shared-DECO-QN2.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/sessions-delete.ts
var SessionDeletionError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
/** Shared lifecycle owner for operator deletion and automatic Incognito expiry. */
async function deleteGatewaySession(options) {
	const assertCurrent = () => {
		options.assertCurrent?.();
		options.sessionMutationAuthorization?.assertCurrent();
	};
	return await withSessionActorStorage({
		sessionKey: options.params.key.trim(),
		agentId: options.params.agentId
	}, {
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize() {}
		}
	}, (memory) => deleteGatewaySessionInScope(options, memory)) ?? deleteGatewaySessionInScope(options);
}
async function deleteGatewaySessionInScope({ params: p, client, context, sessionMutationAuthorization, assertCurrent: assertCallerCurrent, onDeleted }, memory) {
	assertCallerCurrent?.();
	const key = p.key.trim();
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) return requestedAgent;
	const requestedAgentId = requestedAgent.agentId;
	const actorIdentity = memory && resolveSessionStoreIdentity({
		cfg,
		sessionKey: key,
		agentId: requestedAgentId
	});
	const actorOwner = memory;
	let durableEntry;
	let durableRead;
	try {
		const target = actorIdentity && actorOwner ? {
			agentId: actorOwner.agentId,
			canonicalKey: actorIdentity.canonicalKey,
			storeKeys: [actorIdentity.canonicalKey],
			storePath: actorOwner.path
		} : await resolveGatewaySessionStoreTargetInWorker({
			cfg,
			key,
			agentId: requestedAgentId,
			projection: "full",
			onSelected: (selected) => {
				if (isIncognitoSessionKey(selected.canonicalKey)) return;
				durableEntry = selected.store[selected.canonicalKey];
				const identity = readDatabasePathIdentitySync(selected.readSource?.path ?? selected.storePath);
				durableRead = retainPreparedSessionEntryPredicate({
					databaseIdentity: identity.key,
					sessionKey: selected.canonicalKey,
					entry: durableEntry,
					matches: (before, after) => {
						durableEntry = after;
						return before === void 0 === (after === void 0) && [
							"sessionId",
							"lifecycleRevision",
							"modelSelectionLocked",
							"pluginOwnerId",
							"agentHarnessId"
						].every((field) => isDeepStrictEqual(before?.[field], after?.[field])) && (p.archivedOnly !== true || after?.archivedAt !== void 0);
					}
				});
			},
			assertActive: () => {
				assertCallerCurrent?.();
				sessionMutationAuthorization?.assertCurrent();
			}
		});
		const { storePath } = target;
		const compatibilityDefaultAgentId = tryResolveAgentOperationAgentId(cfg);
		const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
		const protectedGlobalAgentId = persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : compatibilityDefaultAgentId;
		const explicitlySelectedGlobalAgentId = normalizeOptionalString(p.agentId) ?? parseAgentSessionKey(key)?.agentId;
		const isSelectedNonDefaultGlobal = target.canonicalKey === "global" && explicitlySelectedGlobalAgentId !== void 0 && normalizeAgentId(explicitlySelectedGlobalAgentId) !== protectedGlobalAgentId;
		const isMainSession = target.canonicalKey !== "global" && isAgentMainSessionKey(cfg, target.canonicalKey);
		if ((target.canonicalKey === "global" || isMainSession) && !isSelectedNonDefaultGlobal) return invalidSessionRequest(`Cannot delete the main session (${target.canonicalKey}).`);
		const deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
		const assertExternalCurrent = () => {
			assertCallerCurrent?.();
			sessionMutationAuthorization?.assertCurrent();
			memory?.actor.assertCurrent();
			memory?.authority.assertCurrent();
		};
		const readMemoryEntry = () => memory?.actor.storage.readCurrent({
			type: "session.entry.read",
			input: {}
		}, memory.authority);
		const initialDeleteEntry = memory ? readMemoryEntry() : durableEntry;
		const expectedSessionId = p.expectedSessionId?.trim();
		const expectedLifecycleRevision = p.expectedLifecycleRevision?.trim();
		const sessionChangedError = () => errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before deletion. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
		const resolveEntryError = (entry) => {
			const deletablePluginOwnedSession = normalizeOptionalString(entry?.pluginOwnerId) !== void 0 && entry?.agentHarnessId === void 0 && !isAgentHarnessSessionKey(target.canonicalKey);
			if (isModelSelectionLocked(entry) && !deletablePluginOwnedSession) return errorShape(ErrorCodes.INVALID_REQUEST, "This session cannot be deleted while model selection is locked.");
			if (p.archivedOnly === true && entry?.archivedAt === void 0) return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`);
			if (expectedSessionId && entry?.sessionId !== expectedSessionId || expectedLifecycleRevision && entry?.lifecycleRevision !== expectedLifecycleRevision) return sessionChangedError();
			return resolvePluginSessionOwnershipError({
				action: "delete",
				entry,
				key: target.canonicalKey,
				pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
			});
		};
		const initialError = resolveEntryError(initialDeleteEntry);
		if (initialError) return {
			ok: false,
			error: initialError
		};
		if (isIncognitoSessionKey(target.canonicalKey) && !memory) {
			assertExternalCurrent();
			if (p.expectedSessionUpdatedAt !== void 0) return {
				ok: false,
				error: sessionChangedError()
			};
			const result = {
				ok: true,
				key: target.canonicalKey,
				deleted: false,
				archived: []
			};
			onDeleted?.(result);
			return {
				ok: true,
				result
			};
		}
		const assertCurrent = () => {
			assertExternalCurrent();
			if (memory) {
				const entry = readMemoryEntry();
				const error = resolveEntryError(entry);
				if (error) throw new SessionDeletionError(error);
				return {
					...target,
					entry,
					legacyKey: void 0
				};
			}
			const current = {
				...target,
				entry: durableEntry,
				legacyKey: void 0
			};
			if (current.storePath !== storePath || current.canonicalKey !== target.canonicalKey || current.entry?.sessionId !== initialDeleteEntry?.sessionId || current.entry?.lifecycleRevision !== initialDeleteEntry?.lifecycleRevision) throw new SessionDeletionError(sessionChangedError());
			const error = resolveEntryError(current.entry);
			if (error) throw new SessionDeletionError(error);
			return current;
		};
		const deleteLifecycleIdentities = [
			target.canonicalKey,
			key,
			...target.storeKeys,
			initialDeleteEntry?.sessionId,
			expectedSessionId
		];
		let drain;
		let worktreePreserved;
		const deleteCurrent = async () => {
			try {
				const current = assertCurrent();
				try {
					drain = await prepareSessionLifecycleDrain({
						action: "delete",
						authorize: memory ? assertExternalCurrent : assertCurrent,
						beforeCancel: () => {
							if (p.expectedSessionUpdatedAt !== void 0 && assertCurrent().entry?.updatedAt !== p.expectedSessionUpdatedAt) throw new SessionDeletionError(sessionChangedError());
						},
						context,
						storePath,
						sessionKeys: Array.from(/* @__PURE__ */ new Set([
							key,
							target.canonicalKey,
							...target.storeKeys
						])),
						sessionId: current.entry?.sessionId,
						session: {
							ok: true,
							value: {
								cfg,
								storePath,
								entry: current.entry,
								canonicalKey: target.canonicalKey,
								agentId: target.agentId
							}
						},
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						defaultAgentId: compatibilityDefaultAgentId,
						lifecycleIdentities: deleteLifecycleIdentities.filter((identity) => Boolean(identity))
					});
				} catch (error) {
					assertCurrent();
					if (error instanceof SessionDeletionError) throw error;
					if (error instanceof SessionLifecycleWorkspaceRecoveryError) throw new SessionDeletionError(error.error);
					throw new SessionDeletionError(errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} could not safely stop before deletion: ${formatErrorMessage(error)} Retry after active work or worker recovery finishes.`, { retryable: true }));
				}
				return await runExclusiveSessionLifecycleMutation("delete", {
					scope: storePath,
					identities: deleteLifecycleIdentities,
					prepare: async () => drain?.handoffToMutation(),
					finalize: async () => drain?.release(),
					run: async () => {
						const { entry, legacyKey, canonicalKey } = assertCurrent();
						const retirement = await prepareSessionWorkerPlacementRetirement({
							context,
							sessionId: entry?.sessionId
						});
						const commitGuard = () => {
							assertCurrent();
							retirement.assertCurrent();
							if (drain?.hasAuthoritativeWork()) throw new SessionDeletionError(errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`, { retryable: true }));
						};
						commitGuard();
						const mutationCleanupError = await cleanupSessionBeforeMutation({
							cfg,
							key,
							target,
							entry,
							legacyKey,
							canonicalKey,
							reason: "session-delete",
							assertCurrent: memory ? () => {
								assertExternalCurrent();
								commitGuard();
							} : commitGuard
						});
						if (mutationCleanupError) throw new SessionDeletionError(mutationCleanupError);
						const postCleanupTarget = {
							entry: assertCurrent().entry,
							target
						};
						const postCleanupEntry = postCleanupTarget.entry;
						const deletedWorktreeId = normalizeOptionalString(postCleanupEntry?.worktree?.id);
						commitGuard();
						const pluginOwnerId = normalizeOptionalString(postCleanupEntry?.pluginOwnerId);
						const incognito = postCleanupEntry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
						const deletionParams = {
							agentId: target.agentId,
							archiveTranscript: incognito ? false : deleteTranscript,
							commitGuard,
							deleteDeliveryArtifacts: true,
							deleteTranscriptWithoutArchive: incognito,
							expectedEntry: memory ? void 0 : postCleanupEntry,
							expectedLifecycleRevision,
							expectedSessionId: initialDeleteEntry?.sessionId ?? null,
							expectedUpdatedAt: memory ? void 0 : postCleanupEntry?.updatedAt,
							storePath,
							target: {
								canonicalKey: target.canonicalKey,
								storeKeys: target.storeKeys
							}
						};
						const result = postCleanupEntry && pluginOwnerId && isModelSelectionLocked(postCleanupEntry) ? await rollbackPluginOwnedSessionEntryLifecycle({
							...deletionParams,
							expectedEntry: postCleanupEntry,
							expectedPluginOwnerId: pluginOwnerId,
							target: {
								canonicalKey: postCleanupTarget.target.canonicalKey,
								storeKeys: postCleanupTarget.target.storeKeys
							}
						}) : await deleteSessionEntryLifecycle(deletionParams);
						if (result.expectedEntryMismatch) throw new SessionDeletionError(sessionChangedError());
						if (result.deleted) {
							await retirement.retire();
							emitGatewaySessionEndPluginHook({
								cfg,
								sessionKey: target.canonicalKey ?? key,
								sessionId: result.deletedSessionId,
								storePath,
								agentId: target.agentId,
								reason: "deleted",
								archivedTranscripts: result.archivedTranscripts
							});
							await emitSessionUnboundLifecycleEvent({
								targetSessionKey: target.canonicalKey ?? key,
								reason: "session-delete",
								emitHooks: p.emitLifecycleHooks !== false
							});
							const deletedSessionKey = target.canonicalKey ?? key;
							await handleSessionStateSessionDeleted(deletedSessionKey, requestedAgentId);
							worktreePreserved = await removeSessionWorktree({
								id: deletedWorktreeId,
								sessionKey: deletedSessionKey,
								reason: "session-delete"
							});
						}
						return result;
					}
				});
			} finally {
				drain?.release();
			}
		};
		let deletion;
		try {
			deletion = await deleteCurrent();
		} catch (error) {
			if (error instanceof SessionResetCleanupError) return {
				ok: false,
				error: sessionChangedError()
			};
			if (!(error instanceof SessionDeletionError)) throw error;
			return {
				ok: false,
				error: error.error
			};
		}
		const response = {
			ok: true,
			key: target.canonicalKey,
			deleted: deletion.deleted,
			archived: deletion.archivedTranscripts.map((entry) => entry.archivedPath),
			...worktreePreserved ? { worktreePreserved } : {}
		};
		onDeleted?.(response);
		if (deletion.deleted) {
			emitSessionsChanged(context, {
				sessionKey: target.canonicalKey,
				sessionId: deletion.deletedSessionId,
				agentId: target.agentId,
				reason: "delete"
			});
			emitSessionsChanged(context, { reason: "delete" }, { preparedPublication: true });
		}
		return {
			ok: true,
			result: response
		};
	} finally {
		durableRead?.release();
	}
}
const sessionDeleteHandlers = { "sessions.delete": async (options) => {
	const { params, respond } = options;
	if (!assertValidParams(params, validateSessionsDeleteParams, "sessions.delete", respond)) return;
	if (!requireSessionKey(params.key, respond)) return;
	const result = await deleteGatewaySession({
		...options,
		params,
		onDeleted: (response) => respond(true, response, void 0)
	});
	if (!result.ok) respond(false, void 0, result.error);
} };
//#endregion
export { sessionDeleteHandlers as n, deleteGatewaySession as t };
