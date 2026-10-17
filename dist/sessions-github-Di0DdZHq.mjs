import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { Jr as validateSessionGitHubConfirmParams, Xr as validateSessionGitHubPublishParams, Yr as validateSessionGitHubOptionsParams, Zr as validateSessionGitHubStatusParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { n as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation.kernel-DAyC6kqY.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-FCVdRRgl.mjs";
import { o as prepareCurrentGitHubPublicationOptionsIdentity, r as hasSupportedGitHubPublicationTarget } from "./github-publication-availability-haOm1sSo.mjs";
import { r as GitHubPublicationKnownFailure } from "./github-publication-failure-3qOmYAmh.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
import { n as prepareSessionPullRequestGitHubRead } from "./control-ui-session-pr-request-BTQOuS8L.mjs";
import { r as sessionPullRequestRepositoryApiUrl } from "./control-ui-session-prs-checks-Bb10Gvfh.mjs";
import { t as captureGitHubPublicationRequester } from "./github-publication-requester-SJKvzuKs.mjs";
import { r as preparePersonalGitHubSessionAction, t as prepareGitHubPublicationOptionsRead } from "./github-personal-authorization-BW9W2okB.mjs";
//#region src/gateway/github-publication-relevance.ts
const gitObjectId = /^[a-f0-9]{40}$/iu;
/** Published history can supersede a failed attempt without changing its durable outcome. */
async function isGitHubPublicationSuperseded(snapshot, pullRequests, { fetchImpl = fetch, assertCurrent }) {
	assertCurrent();
	const tree = snapshot.workspace_tree;
	if (!tree || !gitObjectId.test(tree)) return false;
	const candidates = pullRequests.flatMap((pr) => {
		const head = pr.headSha;
		return pr.state !== "closed" && pr.branch === snapshot.branch && (!snapshot.repository || snapshot.repository.toLowerCase() === `${pr.owner}/${pr.repo}`.toLowerCase()) && head && gitObjectId.test(head) ? [{
			pr,
			head
		}] : [];
	});
	if (candidates.length === 0) return false;
	const read = prepareSessionPullRequestGitHubRead(new URL(candidates[0].pr.url).hostname, fetchImpl, assertCurrent, { optionalAuth: false });
	for (const { pr, head } of candidates) try {
		const root = sessionPullRequestRepositoryApiUrl({
			...pr,
			apiBaseUrl: read.apiBaseUrl
		});
		const published = await read.request(`${root}/git/commits/${head}`);
		if (!isRecord(published) || published.sha !== head || !isRecord(published.tree) || typeof published.tree.sha !== "string" || !gitObjectId.test(published.tree.sha)) continue;
		if (published.tree.sha === tree) return true;
		const source = snapshot.source_head_commit;
		if (!source || source === head || !gitObjectId.test(source)) continue;
		const compared = await read.request(`${root}/compare/${source}...${head}?per_page=1&page=2`);
		if (!isRecord(compared) || compared.status !== "ahead" && compared.status !== "identical") continue;
		const base = isRecord(compared.base_commit) ? compared.base_commit : null;
		const commit = base && isRecord(base.commit) ? base.commit : null;
		const baseTree = commit && isRecord(commit.tree) ? commit.tree : null;
		const mergeBase = isRecord(compared.merge_base_commit) ? compared.merge_base_commit : null;
		if (base?.sha === source && mergeBase?.sha === source && baseTree?.sha === tree) return true;
	} catch {
		read.assertCurrent();
	}
	return false;
}
//#endregion
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
async function isSessionPublicationSuperseded(options, session, snapshot, assertCurrent) {
	const { client, context } = options;
	const prOwner = context.controlUiSessionPullRequests;
	if (!client || !prOwner) return false;
	const readTarget = await prepareControlUiSessionPrRead({
		client,
		sessionKey: session.sessionKey,
		agentId: session.agentId,
		getRuntimeConfig: context.getRuntimeConfig,
		getSessionRowProjection: () => getSessionRowProjection(context),
		isCurrentClient: () => {
			assertCurrent();
			return true;
		}
	});
	assertCurrent();
	const target = await readTarget?.();
	assertCurrent();
	if (!target) return false;
	const assertReadCurrent = () => {
		assertCurrent();
		target.assertCurrent?.();
	};
	const published = await prOwner.read(target, assertReadCurrent, "publication");
	assertReadCurrent();
	return published.status === "ready" && !published.rateLimited ? isGitHubPublicationSuperseded(snapshot, published.pullRequests, { assertCurrent: assertReadCurrent }) : false;
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
		const read = await prepareGitHubPublicationOptionsRead(options, options.params);
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
		read.currentSession();
		const service = options.context.githubOAuthService?.personal;
		if (read.personal.kind === "eligible" && !service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const action = read.personal.kind === "eligible" ? read.personal.action : null;
		let personal = action ? await service.status(action) : null;
		const session = read.currentSession();
		const assertResponseCurrent = () => read.assertSessionUnchanged(session);
		const pendingPersonal = action ? await coordinator.personalPending(action, session) : null;
		assertResponseCurrent();
		if (action && personal) personal = service.revalidateStatus(action, personal);
		const latestShared = await coordinator.latestShared(session, options.params.idempotencyKey, (snapshot) => isSessionPublicationSuperseded(options, session, snapshot, assertResponseCurrent));
		assertResponseCurrent();
		if (action && personal) personal = service.revalidateStatus(action, personal);
		if (shared && read.sessionScoped) {
			if (!await hasSupportedGitHubPublicationTarget(session, assertResponseCurrent)) shared = null;
			assertResponseCurrent();
		}
		options.respond(true, {
			personal,
			shared,
			pendingPersonal,
			latestShared
		});
	}),
	"sessions.github.status": defineSessionGitHubMethod("sessions.github.status", validateSessionGitHubStatusParams, async (options) => {
		const read = await prepareGitHubPublicationOptionsRead(options, options.params);
		const service = options.context.githubPublicationService;
		if (!service) {
			options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup."));
			return;
		}
		const prepared = read.personal.kind === "eligible" ? await service.preparePersonalStatus(options.params.requestId) : void 0;
		const session = read.currentSession();
		const shared = await service.sharedStatus(session, options.params.requestId);
		if (shared) {
			read.assertSessionUnchanged(session);
			options.respond(true, shared);
			return;
		}
		if (read.personal.kind !== "eligible") throw new Error("GitHub publication was not found for this session and caller.");
		const result = service.personalStatus(read.personal.action, session, options.params.requestId, prepared);
		read.assertSessionUnchanged(session);
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
