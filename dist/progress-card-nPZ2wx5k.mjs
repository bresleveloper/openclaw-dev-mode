import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { f as withOpenClawAgentDatabaseAsync, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { br as validateProgressCardRefreshParams, vr as validateProgressCardGetParams, yr as validateProgressCardPutParams } from "./src-l2dWvEsN.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { a as writeSessionProgressCard, r as readSessionProgressCard } from "./progress-card-store-CRs-FKxG.mjs";
import { b as withSessionStoreTarget } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { n as resolveRequestedSessionStoreTarget } from "./session-store-key-Ci099tm9.mjs";
import { r as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-B6Lf4ir_.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as captureGatewaySessionStoreScope } from "./board-store-BgNADjZg.mjs";
import { g as sessionObserverScopeKey } from "./session-observer-model-C0wERbCb.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-NfeOD3At.mjs";
//#region src/gateway/progress-card-store.ts
const progressCardStore = {
	async get(sessionKey, agentId) {
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		const scope = captureGatewaySessionStoreScope(sessionKey, agentId);
		const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(scope.storePath);
		if (isIncognitoOpenClawAgentSqlitePath(unsuffixed.path, {
			agentId: scope.agentId,
			env
		})) {
			const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, scope.sessionKey), {
				agentId: scope.agentId,
				path: unsuffixed.path,
				env
			});
			return result.found ? result.value : null;
		}
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
		const resolved = captureGatewaySessionStoreScope(sessionKey, agentId);
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		const capturedInput = structuredClone({
			markdown: input.markdown,
			steps: input.steps,
			expectedRevision: input.expectedRevision
		});
		const assertCurrent = () => {
			input.assertCurrent?.();
			const current = captureGatewaySessionStoreScope(sessionKey, agentId);
			if (current.agentId !== resolved.agentId || current.storePath !== resolved.storePath || current.sessionKey !== resolved.sessionKey) throw new Error("progress-card session changed; retry");
		};
		assertCurrent();
		const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(resolved.storePath);
		if (isIncognitoOpenClawAgentSqlitePath(unsuffixed.path, {
			agentId: resolved.agentId,
			env
		})) {
			const databaseOptions = {
				agentId: resolved.agentId,
				path: unsuffixed.path,
				env
			};
			const result = await runOpenClawAgentWriteAdmission(databaseOptions, () => withOpenClawAgentDatabaseAsync(databaseOptions, () => runOpenClawAgentWriteTransaction((database) => {
				assertCurrent();
				return writeSessionProgressCard(database.db, resolved.sessionKey, capturedInput);
			}, databaseOptions, { operationLabel: "progress-card.put" }), assertCurrent), true);
			return "card" in result ? result : { card: null };
		}
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
			const { requestProgressCardRefresh } = await import("./progress-card-refresh-Bm_1KClY.mjs");
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
			const read = retainSessionScopedRead(options, session.sessionKey, session.agentId);
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
