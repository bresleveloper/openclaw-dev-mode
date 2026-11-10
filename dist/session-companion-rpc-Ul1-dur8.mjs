import { u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { Ji as validateSessionsCompanionAskParams, Ng as errorShape, Xi as validateSessionsCompanionStateParams, Yi as validateSessionsCompanionResetParams } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionStoreTarget } from "./session-store-key-DKpto8R6.mjs";
import { u as hiddenSessionNotFound } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionSharingMemoryFacts } from "./session-sharing-incognito-DepuXzQy.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as prepareSessionSharingSource } from "./session-sharing-source-DjDkn0NP.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { t as SessionCompanionAskError } from "./session-companion-errors-CRRY_D3O.mjs";
//#region src/gateway/session-companion-rpc.ts
function resolveCompanionTarget(params, context) {
	const companion = context.sessionCompanion;
	if (!companion) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable.")
	};
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionStoreTarget(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) return requested;
	return {
		ok: true,
		companion,
		...requested.value
	};
}
function companionTargetIsVisible(client, context, prepared) {
	if (client?.connId && context.isConnectionActive?.(client.connId) === false) return false;
	const cfg = context.getRuntimeConfig();
	const sharingTarget = prepared.target;
	if (!sharingTarget) return cfg.gateway?.roles === void 0;
	return prepareProjectedSessionSharing({
		client,
		cfg,
		profiles: prepared.profiles,
		isMember: (_target, id) => prepared.membership.has(id)
	}).entryFilter?.(sharingTarget.storeKey, sharingTarget.entry) !== false;
}
const sessionCompanionHandlers = {
	"sessions.companion.ask": defineValidatedGatewayHandler("sessions.companion.ask", validateSessionsCompanionAskParams, async ({ params, respond, client, context, signal, hasCurrentClientAuthority }) => {
		const { sessionKey, agentId, question, selectionContext, attachments } = params;
		if (!question.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "question must contain non-whitespace text"));
			return;
		}
		if (!client?.connId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Side chat questions require a connected client."));
			return;
		}
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		const sourceCfg = context.getRuntimeConfig();
		const sourceTargetScope = {
			agentId: target.agentId,
			sessionKey: target.sessionKey
		};
		const companion = target.companion;
		const connId = client.connId;
		const assertLifetimeCurrent = () => {
			signal?.throwIfAborted();
			if (context.sessionCompanion !== companion || client.connId !== connId || client.invalidated || hasCurrentClientAuthority?.() === false || context.isConnectionActive?.(connId) === false) throw new SessionCompanionAskError("session-missing", "Side chat is unavailable.");
		};
		const actorFacts = captureSessionSharingMemoryFacts({
			...sourceTargetScope,
			resolved: { storePath: resolveSessionStorePathCore(sourceCfg.session?.store, { agentId: target.agentId }) }
		}, assertLifetimeCurrent);
		let releaseSharing;
		let capturedOperator;
		let retainedSource;
		try {
			const profiles = await prepareSessionSharingProfiles(client);
			let readSharingFacts;
			if (actorFacts) readSharingFacts = actorFacts.readCurrent;
			else {
				const preparedFacts = await prepareSessionMutationFacts({
					cfg: sourceCfg,
					...sourceTargetScope,
					allowMissing: true
				});
				releaseSharing = preparedFacts.release;
				readSharingFacts = () => preparedFacts.readCurrent(context.getRuntimeConfig());
			}
			const initialSharingFacts = readSharingFacts();
			const initialSharingTarget = initialSharingFacts.target;
			if (!companionTargetIsVisible(client, context, {
				...initialSharingFacts,
				profiles
			})) {
				respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
				return;
			}
			const originalAttachments = attachments?.length ? structuredClone(attachments) : void 0;
			const assertInputCurrent = captureGatewayClientUploadCommitGuard({
				method: "sessions.companion.ask",
				requestParams: { attachments: originalAttachments },
				client,
				context
			});
			const sourceTarget = initialSharingTarget ?? {
				agentId: target.agentId,
				canonicalKey: target.sessionKey,
				storeKey: target.sessionKey,
				storePath: resolveSessionStorePathCore(sourceCfg.session?.store, { agentId: target.agentId })
			};
			const sourceStore = sourceCfg.session?.store;
			const sourceMainKey = sourceCfg.session?.mainKey;
			const sourceScope = sourceCfg.session?.scope;
			const refuseSource = () => {
				throw new SessionCompanionAskError("session-missing", "Side chat is unavailable.");
			};
			const assertSourceCurrent = Object.assign(() => {
				assertLifetimeCurrent();
				if (!companionTargetIsVisible(client, context, {
					...readSharingFacts(),
					profiles
				})) refuseSource();
			}, { async prepareSessionSource() {
				assertLifetimeCurrent();
				const read = await prepareSessionSharingSource(sourceTarget, assertLifetimeCurrent, actorFacts);
				const assertCurrent = () => {
					assertSourceCurrent();
					read.assertCurrent();
					const cfg = context.getRuntimeConfig();
					if (cfg.session?.store !== sourceStore || cfg.session?.mainKey !== sourceMainKey || cfg.session?.scope !== sourceScope) refuseSource();
				};
				try {
					assertCurrent();
				} catch (error) {
					await releaseSessionSourceAuthorities([read], [error]);
					throw error;
				}
				return {
					assertCurrent,
					checks: read.actorSource ? [] : [{
						predicate: {
							source: read.source,
							sessionKey: sourceTarget.storeKey,
							fields: [
								"sessionId",
								"createdActor",
								"visibility",
								"incognito"
							],
							expected: read.target?.entry
						},
						refuse: refuseSource
					}],
					release: read.release
				};
			} });
			assertInputCurrent?.();
			if (actorFacts) {
				retainedSource = await assertSourceCurrent.prepareSessionSource?.();
				retainedSource?.assertCurrent();
			}
			capturedOperator = await captureGatewayOperatorRunAuthority({
				client,
				context,
				hasCurrentClientAuthority,
				invocationAuthority: {
					assertCurrent: assertSourceCurrent,
					signal
				}
			});
			assertSourceCurrent();
			assertInputCurrent?.();
			const result = await companion.ask({
				sessionKey: target.sessionKey,
				agentId: target.agentId,
				question,
				...selectionContext ? { selectionContext } : {},
				...originalAttachments ? { attachments: originalAttachments } : {},
				connId,
				assertSourceCurrent,
				...assertInputCurrent ? { assertInputCurrent } : {},
				...capturedOperator ? { operatorAuthority: capturedOperator.authority } : {},
				...signal ? { signal } : {}
			});
			retainedSource?.assertCurrent();
			assertSourceCurrent();
			capturedOperator?.authority.assertCurrent();
			respond(true, result);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) {
				respond(false, void 0, error.error);
				return;
			}
			if (!(error instanceof SessionCompanionAskError)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat could not answer right now."));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, error.reason === "busy" ? {
				details: { code: GatewayErrorDetailCodes.SESSION_COMPANION_BUSY },
				retryable: true
			} : {
				details: { reason: error.reason },
				retryable: error.reason === "rate-limited" || error.reason === "context-unavailable",
				...error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : {}
			}));
		} finally {
			try {
				capturedOperator?.release();
				await retainedSource?.release?.();
			} finally {
				releaseSharing?.();
			}
		}
	}),
	"sessions.companion.state": defineValidatedGatewayHandler("sessions.companion.state", validateSessionsCompanionStateParams, async ({ params, respond, client, context }) => {
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		const profiles = await prepareSessionSharingProfiles(client);
		const facts = await prepareSessionMutationFacts({
			cfg: context.getRuntimeConfig(),
			sessionKey: target.sessionKey,
			agentId: target.agentId,
			allowMissing: true
		});
		try {
			if (!companionTargetIsVisible(client, context, {
				...facts.readCurrent(context.getRuntimeConfig()),
				profiles
			})) {
				respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
				return;
			}
			respond(true, target.companion.state({
				agentId: target.agentId,
				sessionKey: target.sessionKey
			}));
		} finally {
			facts.release();
		}
	}),
	"sessions.companion.reset": defineValidatedGatewayHandler("sessions.companion.reset", validateSessionsCompanionResetParams, ({ params, respond, context }) => {
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		target.companion.reset({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		});
		respond(true, { ok: true });
	})
};
//#endregion
export { sessionCompanionHandlers };
