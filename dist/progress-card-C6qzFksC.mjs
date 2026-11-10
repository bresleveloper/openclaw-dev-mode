import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Lr as validateProgressCardGetParams, Ng as errorShape, Rr as validateProgressCardPutParams, zr as validateProgressCardRefreshParams } from "./src-pLJQA6J5.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { r as resolveRequestedSessionStoreTarget } from "./session-store-key-DKpto8R6.mjs";
import "./progress-card-store-BAskGyMI.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { r as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-Cjgdy85s.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { n as captureGatewaySessionStoreScope } from "./board-store-D0cYtso4.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-C1LFMGG7.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-COi00Wg4.mjs";
//#region src/session-cards/session-actor-progress-card-store.ts
/** Stores private progress cards in the session actor selected by the routing owner. */
function createSessionActorProgressCardStore(resolve) {
	return {
		async get(sessionKey, agentId) {
			const binding = resolve(sessionKey, agentId);
			return await binding.actor.storage.read({
				type: "progressCard.get",
				input: { sessionKey: binding.actor.target.sessionKey }
			}, binding.authority);
		},
		async put(sessionKey, input, agentId) {
			const binding = resolve(sessionKey, agentId);
			const result = await binding.actor.storage.mutate({
				type: "progressCard.put",
				input: {
					sessionKey: binding.actor.target.sessionKey,
					...structuredClone({
						markdown: input.markdown,
						steps: input.steps,
						expectedRevision: input.expectedRevision
					})
				}
			}, {
				...binding.authority,
				assertCurrent() {
					binding.authority.assertCurrent();
					input.assertCurrent?.();
				}
			});
			const value = readSessionActorStorageResult(result);
			return "card" in value ? value : { card: null };
		}
	};
}
//#endregion
//#region src/gateway/progress-card-store.ts
function captureProgressCardTarget(sessionKey, agentId, assertCallerCurrent) {
	const scope = captureGatewaySessionStoreScope(sessionKey, agentId);
	const assertCurrent = () => {
		assertCallerCurrent?.();
	};
	return {
		scope,
		assertCurrent
	};
}
const progressCardStore = {
	async get(sessionKey, agentId) {
		const selected = getSessionActorStorageBinding({});
		if (selected?.actor.target.sessionKey === sessionKey && (!agentId || agentId === selected.agentId)) return createSessionActorProgressCardStore(() => selected).get(sessionKey, agentId);
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		const { scope, assertCurrent } = captureProgressCardTarget(sessionKey, agentId);
		if (isIncognitoSessionKey(scope.sessionKey)) return await withSessionActorStorage({
			...scope,
			env
		}, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: {
				assertCurrent,
				authorize: assertCurrent
			}
		}, (binding) => createSessionActorProgressCardStore(() => binding).get(scope.sessionKey, scope.agentId)) ?? null;
		const target = await prepareSqliteTargetFromSessionStorePath(scope.storePath, {
			agentId: scope.agentId,
			env
		});
		return await withSessionHistoryWorkerDatabase({
			agentId: target.agentId ?? scope.agentId,
			path: target.path,
			env
		}, (owner) => owner.readProgressCard({
			sessionKey: scope.sessionKey,
			env
		}));
	},
	async put(sessionKey, input, agentId) {
		const selected = getSessionActorStorageBinding({});
		if (selected?.actor.target.sessionKey === sessionKey && (!agentId || agentId === selected.agentId)) return createSessionActorProgressCardStore(() => selected).put(sessionKey, input, agentId);
		const capturedInput = structuredClone({
			markdown: input.markdown,
			steps: input.steps,
			expectedRevision: input.expectedRevision
		});
		const { scope: resolved, assertCurrent } = captureProgressCardTarget(sessionKey, agentId, input.assertCurrent);
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		if (isIncognitoSessionKey(resolved.sessionKey)) {
			const result = await withSessionActorStorage({
				...resolved,
				env
			}, {
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				},
				authority: {
					assertCurrent,
					authorize: assertCurrent
				}
			}, (binding) => createSessionActorProgressCardStore(() => binding).put(resolved.sessionKey, {
				...capturedInput,
				assertCurrent
			}, resolved.agentId));
			if (!result) throw new IncognitoSessionMissingError();
			return result;
		}
		assertCurrent();
		const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(resolved.storePath);
		const candidates = captureSessionStoreReadCandidates(resolved.storePath);
		const identities = new Map(candidates.filter((candidate) => !candidate.scope).map((candidate) => {
			const identity = readDatabasePathIdentitySync(candidate.path);
			return [identity.canonicalPath, identity];
		}));
		const prepare = () => withSessionStoreTarget({
			...resolved,
			env,
			candidates
		}, async (target, owner) => {
			const options = {
				...target.database,
				env
			};
			const identity = identities.get(options.path) ?? readDatabasePathIdentitySync(options.path);
			if (!identities.has(options.path) && identity.key.startsWith("file:")) throw new Error("Progress-card target appeared after source capture");
			const execution = captureOpenClawAgentDatabaseExecution(options, identity.key.startsWith("file:") ? { expectedIdentity: {
				kind: "file",
				physicalIdentity: identity.key.slice(5),
				nativeLocation: identity.canonicalPath,
				birthtime: identity.birthtime
			} } : { expectedCreationIdentity: identity });
			const assertOwnerCurrent = () => {
				assertCurrent();
				owner.assertCurrent();
				execution.assertCurrent();
			};
			try {
				return await runOpenClawAgentWriteAdmission(options, async () => {
					await owner.refreshBeforeDispatch(() => execution.assertCurrent());
					await runOpenClawAgentWorkerWrite(options, () => execution.prepare({
						assertCurrent: assertOwnerCurrent,
						onRegistryChange: owner.onRegistryChange,
						createAdmission(binding) {
							return () => ({
								nativeLocations: binding.nativeLocations,
								admission: createSqliteWorkerOperationAdmission((request, grant) => {
									binding.authorize(request);
									assertOwnerCurrent();
									if (!grant()) throw new Error("Progress-card preparation authority expired");
								}, binding.attachment)
							});
						}
					}));
					await owner.revalidateTarget();
					const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
						moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.progressCardStore),
						input: void 0
					});
					try {
						const receipt = await worker.execute({
							type: "put",
							input: {
								sessionKey: resolved.sessionKey,
								...capturedInput
							}
						}, assertOwnerCurrent);
						if (!receipt.ok) {
							const error = /* @__PURE__ */ new Error("Progress-card transaction failed");
							retainOpenClawStateWorkerErrorPayload(error, receipt.error);
							throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
						}
						return receipt.value;
					} finally {
						await worker.close();
					}
				}, true);
			} finally {
				await execution.release();
			}
		}, assertCurrent);
		const result = await withSessionHistoryWorkerReadCandidates(candidates, async (custody) => {
			const persist = () => {
				custody.assertCurrent();
				return prepare();
			};
			return unsuffixed.agentId || unsuffixed.shared ? runOpenClawAgentWriteAdmission({
				agentId: resolved.agentId,
				path: unsuffixed.path,
				env
			}, persist, true) : persist();
		});
		return "card" in result ? result : { card: null };
	}
};
//#endregion
//#region src/gateway/server-methods/progress-card.ts
function resolveProgressCardSession(params, context, respond) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionStoreTarget(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) {
		respond(false, void 0, requested.error);
		return;
	}
	const { sessionKey, agentId } = requested.value;
	return {
		sessionKey,
		agentId,
		scopeKey: sessionObserverScopeKey(sessionKey, agentId)
	};
}
function projectProgressCard(card, scopeKey) {
	return card ? {
		...card,
		sessionKey: scopeKey
	} : null;
}
function createProgressCardHandlers(store = progressCardStore) {
	return {
		"progressCard.refresh": async (invocation) => {
			const { params, respond, context, sessionMutationAuthorization } = invocation;
			if (!assertValidParams(params, validateProgressCardRefreshParams, "progressCard.refresh", respond)) return;
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			const readCard = async () => {
				sessionMutationAuthorization?.assertCurrent();
				const card = await store.get(session.sessionKey, session.agentId);
				sessionMutationAuthorization?.assertCurrent();
				return card;
			};
			const card = await readCard();
			if (!card) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "There is no progress card to refresh."));
				return;
			}
			const { requestProgressCardRefresh } = await import("./progress-card-refresh-7mcMitKu.mjs");
			invocation.sessionMutationCommitGuard?.();
			sessionMutationAuthorization?.assertCurrent();
			await requestProgressCardRefresh(invocation, session, card, params.idempotencyKey, readCard);
		},
		"progressCard.get": async (options) => {
			const { params, respond, context, sessionMutationAuthorization } = options;
			if (!assertValidParams(params, validateProgressCardGetParams, "progressCard.get", respond)) return;
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			sessionMutationAuthorization?.assertCurrent();
			const read = await retainSessionScopedRead(options, session.sessionKey, session.agentId);
			try {
				const card = await store.get(session.sessionKey, session.agentId);
				sessionMutationAuthorization?.assertCurrent();
				read?.assertCurrent();
				respond(true, { card: projectProgressCard(card, session.scopeKey) }, void 0);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			} finally {
				read?.release();
			}
		},
		"progressCard.put": async (invocation) => {
			const { params, respond, context, sessionMutationAuthorization } = invocation;
			if (!assertValidParams(params, validateProgressCardPutParams, "progressCard.put", respond)) return;
			let input;
			try {
				input = normalizeProgressCardInput({
					markdown: params.markdown,
					plan: params.plan
				});
			} catch (error) {
				if (!(error instanceof ProgressCardInputError)) throw error;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			if (params.expectedRevision !== void 0 && (input.markdown || input.steps?.length)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "expectedRevision is only valid when clearing a card"));
				return;
			}
			const session = resolveProgressCardSession(params, context, respond);
			if (!session) return;
			sessionMutationAuthorization?.assertCurrent();
			const assertCurrent = () => {
				invocation.signal?.throwIfAborted();
				invocation.sessionMutationCommitGuard?.();
				sessionMutationAuthorization?.assertCurrent();
			};
			try {
				const result = await store.put(session.sessionKey, {
					...input,
					expectedRevision: params.expectedRevision,
					assertCurrent
				}, session.agentId);
				assertCurrent();
				if (params.expectedRevision === void 0 || result.card === null) context.broadcast("progressCard.changed", {
					sessionKey: session.scopeKey,
					revision: result.card?.revision ?? null
				}, {
					sessionKeys: [session.sessionKey],
					agentId: session.agentId
				});
				respond(true, { card: projectProgressCard(result.card, session.scopeKey) }, void 0);
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		}
	};
}
const progressCardHandlers = createProgressCardHandlers();
//#endregion
export { progressCardHandlers };
