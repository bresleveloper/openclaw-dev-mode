import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { S as tryResolveAgentOperationAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import { Ai as validateSessionsDeleteParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { a as isAgentHarnessSessionKey } from "./agent-harness-session-key-D8EQIzja.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-GoxISURZ.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as invalidSessionRequest, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as rollbackPluginOwnedSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BH4CIDLX.mjs";
import { s as isModelSelectionLocked } from "./model-overrides-uZFvcSRc.mjs";
import { a as handleSessionStateSessionDeleted } from "./session-state-events-B7wdeeGU.mjs";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-BH2MRg79.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { a as prepareSessionWorkerPlacementRetirement } from "./session-placement-lifecycle-D5GPja58.mjs";
import { i as loadGatewaySessionEntryReadOnly, r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-Dc1i92s7.mjs";
import "./session-utils-CwljFiKR.mjs";
import { a as emitGatewaySessionEndPluginHook, r as emitSessionUnboundLifecycleEvent, t as cleanupSessionBeforeMutation } from "./session-reset-service-Dk1rOu8r.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BbxQNnS-.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget, n as isAgentMainSessionKey, o as requireSessionKey } from "./sessions-shared-CHxhVZeL.mjs";
import { r as removeSessionWorktree } from "./session-worktree-lifecycle-CYReL6sV.mjs";
import { n as prepareSessionLifecycleDrain, t as SessionLifecycleWorkspaceRecoveryError } from "./sessions-lifecycle-drain-lgus5FMy.mjs";
//#region src/gateway/server-methods/sessions-delete.ts
var SessionDeletionError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
/** Shared lifecycle owner for operator deletion and automatic Incognito expiry. */
async function deleteGatewaySession({ params: p, client, context, sessionMutationAuthorization, assertCurrent: assertCallerCurrent, onDeleted }) {
	assertCallerCurrent?.();
	const key = p.key.trim();
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) return requestedAgent;
	const requestedAgentId = requestedAgent.agentId;
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg,
		key,
		agentId: requestedAgentId,
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
	const initialDeleteEntry = loadGatewaySessionEntry(key, { agentId: requestedAgentId }).entry;
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
	const assertCurrent = () => {
		assertCallerCurrent?.();
		sessionMutationAuthorization?.assertCurrent();
		const current = loadGatewaySessionEntryReadOnly(key, { agentId: requestedAgentId });
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
					authorize: assertCurrent,
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
					const retirement = prepareSessionWorkerPlacementRetirement({
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
						assertCurrent: commitGuard
					});
					if (mutationCleanupError) throw new SessionDeletionError(mutationCleanupError);
					const postCleanupTarget = loadAccessorSessionEntryForGatewayTarget({
						key,
						cfg,
						agentId: requestedAgentId
					});
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
						expectedEntry: postCleanupEntry,
						expectedLifecycleRevision,
						expectedSessionId: initialDeleteEntry?.sessionId ?? null,
						expectedUpdatedAt: postCleanupEntry?.updatedAt,
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
						retirement.retire();
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
						handleSessionStateSessionDeleted(deletedSessionKey, requestedAgentId);
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
