import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Gr as validateSessionGitHubOptionsParams, Kr as validateSessionGitHubPublishParams, Wr as validateSessionGitHubConfirmParams, qr as validateSessionGitHubStatusParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { t as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation-bdeiq4od.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-sharing-C4w_but1.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import "./session-utils-CJ7A982R.mjs";
import { a as prepareCurrentGitHubPublicationOptionsIdentity } from "./github-publication-availability-CE1CFSwV.mjs";
import { n as GitHubPublicationKnownFailure } from "./github-publication-failure-B1jd4XaP.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { t as captureGitHubPublicationRequester } from "./github-publication-requester-Y6oZYu3w.mjs";
import { r as preparePersonalGitHubSessionAction, t as prepareGitHubPublicationOptionsRead } from "./github-personal-authorization-C3psEao8.mjs";
//#region src/gateway/server-methods/sessions-github.ts
const sessionGitHubFailureMessages = {
	"sessions.github.publish": "GitHub publication request failed",
	"sessions.github.options": "GitHub publication options are unavailable.",
	"sessions.github.status": "GitHub publication status is unavailable.",
	"sessions.github.confirm": "GitHub publication confirmation failed."
};
function defineSessionGitHubMethod(...[method, validate, handler]) {
	return defineValidatedGatewayMethod(method, validate, async (options) => {
		const { agentId, sessionKey } = options.params;
		const key = sessionKey ?? getGatewayToolCallerIdentity()?.sessionKey;
		if (agentId !== void 0 && key) {
			const owner = resolveRequestedSessionAgentId(options.context.getRuntimeConfig(), key, agentId);
			if (!owner.ok) {
				options.respond(false, void 0, owner.error);
				return;
			}
		}
		try {
			return await handler(options);
		} catch (error) {
			const publishing = method === "sessions.github.publish";
			if (publishing && error instanceof SessionMutationAuthorizationChangedError) throw error;
			const acquisition = error instanceof OpenClawStateLeaseAcquisitionError ? error.outcome : void 0;
			const busy = error instanceof SessionWorkspaceReservationBusyError;
			const forbidden = acquisition ? acquisition.kind === "held" : !publishing && !busy;
			options.respond(false, void 0, errorShape(forbidden ? ErrorCodes.FORBIDDEN : ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : sessionGitHubFailureMessages[method], acquisition ? {
				retryable: acquisition.kind === "store-unavailable",
				details: { leaseAcquisition: acquisition }
			} : busy ? { retryable: true } : publishing && error instanceof GitHubPublicationKnownFailure && "idempotencyKey" in options.params && error.rejection?.idempotencyKey === options.params.idempotencyKey ? { details: error.rejection } : void 0));
		}
	});
}
const sessionsGitHubHandlers = {
	"sessions.github.publish": defineSessionGitHubMethod("sessions.github.publish", validateSessionGitHubPublishParams, async (options) => {
		const { params, respond, context, sessionMutationAuthorization } = options;
		const coordinator = context.githubPublicationService;
		if (!coordinator) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication is unavailable on this Gateway"));
			return;
		}
		const caller = getGatewayToolCallerIdentity();
		const sessionKey = caller?.sessionKey ?? params.sessionKey;
		if (!sessionKey || caller && params.sessionKey && params.sessionKey !== caller.sessionKey || caller && params.agentId && normalizeAgentId(params.agentId) !== normalizeAgentId(caller.agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session is invalid"));
			return;
		}
		const agentId = caller?.agentId ?? params.agentId;
		if (params.selection?.source === "personal") {
			if (!params.sessionKey) throw new Error("My GitHub publication requires an explicit session.");
			const action = preparePersonalGitHubSessionAction(options, {
				sessionKey: params.sessionKey,
				agentId
			});
			const result = await coordinator.requestPersonalForSession(params, action);
			action.assertCurrent();
			respond(true, result);
			return;
		}
		const loaded = loadGatewaySessionEntryReadOnly(sessionKey, agentId ? { agentId } : void 0);
		if (!loaded.entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session was not found"));
			return;
		}
		sessionMutationAuthorization?.assertCurrent();
		const session = {
			sessionKey: loaded.canonicalKey,
			agentId: caller?.agentId ?? loaded.agentId
		};
		const admitted = await captureGitHubPublicationRequester(options, session);
		try {
			const result = await coordinator.requestForSession({
				...params,
				...session,
				requester: admitted.requester,
				...caller?.operationalRunInstance?.runId ? { expectedRunId: caller.operationalRunInstance.runId } : {}
			});
			sessionMutationAuthorization?.assertCurrent();
			respond(true, result);
		} finally {
			admitted.release();
		}
	}),
	"sessions.github.options": defineSessionGitHubMethod("sessions.github.options", validateSessionGitHubOptionsParams, async (options) => {
		const read = prepareGitHubPublicationOptionsRead(options, options.params);
		const coordinator = options.context.githubPublicationService;
		if (!coordinator) {
			options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup."));
			return;
		}
		let shared = null;
		try {
			const identity = await prepareCurrentGitHubPublicationOptionsIdentity(read.session.agentId);
			shared = {
				source: identity.source,
				accountId: identity.account.accountId,
				login: identity.account.login
			};
		} catch {}
		const service = options.context.githubOAuthService?.personal;
		if (read.personal.kind === "eligible" && !service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const action = read.personal.kind === "eligible" ? read.personal.action : null;
		let personal = action ? await service.status(action) : null;
		const session = read.currentSession();
		const pendingPersonal = action ? await coordinator.personalPending(action, session) : null;
		read.currentSession();
		if (action && personal) personal = service.revalidateStatus(action, personal);
		const latestShared = coordinator.latestShared(session, options.params.idempotencyKey);
		read.currentSession();
		options.respond(true, {
			personal,
			shared,
			pendingPersonal,
			latestShared
		});
	}),
	"sessions.github.status": defineSessionGitHubMethod("sessions.github.status", validateSessionGitHubStatusParams, (options) => {
		const read = prepareGitHubPublicationOptionsRead(options, options.params);
		const service = options.context.githubPublicationService;
		if (!service) {
			options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup."));
			return;
		}
		const session = read.currentSession();
		const shared = service.sharedStatus(session, options.params.requestId);
		if (shared) {
			read.currentSession();
			options.respond(true, shared);
			return;
		}
		if (read.personal.kind !== "eligible") throw new Error("GitHub publication was not found for this session and caller.");
		const result = service.personalStatus(read.personal.action, session, options.params.requestId);
		read.currentSession();
		options.respond(true, result);
	}),
	"sessions.github.confirm": defineSessionGitHubMethod("sessions.github.confirm", validateSessionGitHubConfirmParams, async (options) => {
		const action = preparePersonalGitHubSessionAction(options, options.params);
		const service = options.context.githubPublicationService;
		if (!service) throw new Error("GitHub publication is unavailable.");
		const result = await service.confirmPersonal(options.params, action);
		action.assertCurrent();
		options.respond(true, result);
	})
};
//#endregion
export { sessionsGitHubHandlers };
