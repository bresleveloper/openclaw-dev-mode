import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, _i as validateSessionGitHubOptionsParams, gi as validateSessionGitHubConfirmParams, vi as validateSessionGitHubPublishParams, yi as validateSessionGitHubStatusParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as GitHubIdentityError } from "./github-read-identity-BB6UxasN.mjs";
import { i as hasSupportedGitHubPublicationTarget, l as prepareGitHubPublicationSession, s as prepareCurrentGitHubPublicationOptionsIdentity } from "./github-publication-availability-DsIV42qE.mjs";
import { r as GitHubPublicationKnownFailure } from "./github-publication-failure-ByPq2Muc.mjs";
import { t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { n as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation.kernel-Bjfj6oO6.mjs";
import { a as prepareSessionPullRequestGitHubRead, r as sessionPullRequestRepositoryApiUrl } from "./control-ui-session-prs-checks-tC5krxrs.mjs";
import { n as prepareGitHubPublicationRequesterV2 } from "./github-publication-requester-Det-4INz.mjs";
import { r as preparePersonalGitHubSessionActionV2, t as prepareGitHubPublicationOptionsRead } from "./github-personal-authorization-D6PeAZTm.mjs";
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
const GITHUB_OPTIONS_TIMEOUT_MS = 5e3;
var GitHubOptionsTimeoutError = class extends Error {
	constructor() {
		super("GitHub publication options timed out after 5 seconds; retry the request.");
	}
};
const sessionGitHubFailureMessages = {
	"sessions.github.publish": "GitHub publication request failed",
	"sessions.github.options": "GitHub publication options are unavailable.",
	"sessions.github.status": "GitHub publication status is unavailable.",
	"sessions.github.confirm": "GitHub publication confirmation failed."
};
function publicationStateUnavailableError() {
	return errorShape(ErrorCodes.UNAVAILABLE, "GitHub publication state is unavailable; retry after Gateway startup.");
}
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
			const timedOut = error instanceof GitHubOptionsTimeoutError;
			const forbidden = acquisition ? acquisition.kind === "held" : !publishing && !busy && !timedOut;
			options.respond(false, void 0, errorShape(forbidden ? ErrorCodes.FORBIDDEN : ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : sessionGitHubFailureMessages[method], acquisition ? {
				retryable: acquisition.kind === "store-unavailable",
				details: { leaseAcquisition: acquisition }
			} : busy || timedOut ? { retryable: true } : publishing && error instanceof GitHubPublicationKnownFailure && "idempotencyKey" in options.params && error.rejection?.idempotencyKey === options.params.idempotencyKey ? { details: error.rejection } : void 0));
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
		try {
			var _usingCtx$1 = _usingCtx();
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
			if (params.selection?.source === "personal") try {
				var _usingCtx3 = _usingCtx();
				if (!params.sessionKey) throw new Error("My GitHub publication requires an explicit session.");
				const admitted = await preparePersonalGitHubSessionActionV2(options, {
					sessionKey: params.sessionKey,
					agentId
				});
				_usingCtx3.u({ [Symbol.dispose]: () => admitted.release() });
				const result = await coordinator.requestPersonalForSessionV2(params, admitted.action);
				admitted.action.assertCurrent();
				respond(true, result);
				return;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
			const loaded = _usingCtx$1.u(await prepareGitHubPublicationSession(sessionKey, {
				agentId,
				assertCurrent: () => sessionMutationAuthorization?.assertCurrent()
			})).loaded;
			if (!loaded.entry?.sessionId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "GitHub publication session was not found"));
				return;
			}
			sessionMutationAuthorization?.assertCurrent();
			const session = {
				sessionKey: loaded.canonicalKey,
				agentId: caller?.agentId ?? loaded.agentId
			};
			const admitted = await prepareGitHubPublicationRequesterV2(options, session);
			_usingCtx$1.u({ [Symbol.dispose]: () => admitted.release() });
			const result = await coordinator.requestForSessionV2({
				...params,
				...session,
				requester: admitted.requester,
				...caller?.operationalRunInstance?.runId ? { expectedRunId: caller.operationalRunInstance.runId } : {}
			});
			sessionMutationAuthorization?.assertCurrent();
			respond(true, result);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	}),
	"sessions.github.options": defineSessionGitHubMethod("sessions.github.options", validateSessionGitHubOptionsParams, async (options) => {
		const deadline = new AbortController();
		await raceWithTimeout(async () => {
			try {
				var _usingCtx4 = _usingCtx();
				const read = _usingCtx4.u(await prepareGitHubPublicationOptionsRead(options, options.params, deadline.signal));
				const coordinator = options.context.githubPublicationService;
				if (!coordinator) {
					options.respond(false, void 0, publicationStateUnavailableError());
					return;
				}
				const service = options.context.githubOAuthService?.personal;
				if (read.personal.kind === "eligible" && !service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
				const action = read.personal.kind === "eligible" ? read.personal.action : null;
				const session = read.currentSession();
				const assertResponseCurrent = () => read.assertSessionUnchanged(session);
				let sharedUnavailableReason;
				const [identity, personalSnapshot, pendingPersonal, latestShared] = await Promise.all([
					prepareCurrentGitHubPublicationOptionsIdentity(read.session.agentId, assertResponseCurrent).catch((error) => {
						sharedUnavailableReason = error instanceof GitHubIdentityError ? error.reason : "unverified";
						return null;
					}),
					action ? service.status(action) : null,
					action ? coordinator.personalPending(action, session) : null,
					coordinator.latestShared(session, options.params.idempotencyKey, (snapshot) => isSessionPublicationSuperseded(options, session, snapshot, assertResponseCurrent))
				]);
				let shared = identity ? {
					source: identity.source,
					accountId: identity.account.accountId,
					login: identity.account.login
				} : null;
				if (shared && read.sessionScoped) {
					if (!await hasSupportedGitHubPublicationTarget(session, assertResponseCurrent)) {
						shared = null;
						sharedUnavailableReason = "unsupported_workspace";
					}
				}
				assertResponseCurrent();
				const personal = action && personalSnapshot ? service.revalidateStatus(action, personalSnapshot) : personalSnapshot;
				options.respond(true, {
					personal,
					shared,
					...identity?.stale || personal?.stale ? { stale: true } : {},
					...sharedUnavailableReason ? { sharedUnavailableReason } : {},
					pendingPersonal,
					latestShared
				});
			} catch (_) {
				_usingCtx4.e = _;
			} finally {
				_usingCtx4.d();
			}
		}, GITHUB_OPTIONS_TIMEOUT_MS, () => {
			const error = new GitHubOptionsTimeoutError();
			deadline.abort(error);
			throw error;
		}, { ref: false });
	}),
	"sessions.github.status": defineSessionGitHubMethod("sessions.github.status", validateSessionGitHubStatusParams, async (options) => {
		try {
			var _usingCtx5 = _usingCtx();
			const read = _usingCtx5.u(await prepareGitHubPublicationOptionsRead(options, options.params));
			const service = options.context.githubPublicationService;
			if (!service) {
				options.respond(false, void 0, publicationStateUnavailableError());
				return;
			}
			const prepared = read.personal.kind === "eligible" ? await service.preparePersonalStatus(options.params.requestId) : void 0;
			_usingCtx5.u({ [Symbol.dispose]: () => prepared?.release() });
			const session = read.currentSession();
			const shared = await service.sharedStatus(session, options.params.requestId);
			if (shared) {
				read.assertSessionUnchanged(session);
				options.respond(true, shared);
				return;
			}
			if (read.personal.kind !== "eligible") throw new Error("GitHub publication was not found for this session and caller.");
			const result = await service.personalStatusAsync(read.personal.action, session, options.params.requestId, prepared);
			read.assertSessionUnchanged(session);
			options.respond(true, result);
		} catch (_) {
			_usingCtx5.e = _;
		} finally {
			_usingCtx5.d();
		}
	}),
	"sessions.github.confirm": defineSessionGitHubMethod("sessions.github.confirm", validateSessionGitHubConfirmParams, async (options) => {
		try {
			var _usingCtx6 = _usingCtx();
			const service = options.context.githubPublicationService;
			if (!service) throw new Error("GitHub publication is unavailable.");
			const admitted = await preparePersonalGitHubSessionActionV2(options, options.params);
			_usingCtx6.u({ [Symbol.dispose]: () => admitted.release() });
			const result = await service.confirmPersonalV2(options.params, admitted.action);
			admitted.action.assertCurrent();
			options.respond(true, result);
		} catch (_) {
			_usingCtx6.e = _;
		} finally {
			_usingCtx6.d();
		}
	})
};
//#endregion
export { sessionsGitHubHandlers };
