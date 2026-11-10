import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, ea as validateSessionsDiffParams } from "./src-pLJQA6J5.mjs";
import "./io-DIF-KW3P.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { n as loadCheckoutDiff } from "./session-diff-n8q3cLrB.mjs";
import { n as startSlowRequestDiagnostics } from "./slow-request-diagnostics-Ba6xRXbV.mjs";
import { t as retainSessionScopedRead } from "./session-scoped-read-COi00Wg4.mjs";
import { a as loadRepositoryArtifactDiff, i as resolveRepositoryWorkspaceAccess, r as withSessionFileRoot } from "./sessions-files-DZDEywjm.mjs";
//#region src/gateway/server-methods/sessions-diff.ts
async function loadSessionDiff(params, context, assertAuthorized = () => {}) {
	try {
		var _usingCtx$1 = _usingCtx();
		let worktreeCount = 0;
		let returnedFileCount = 0;
		const timing = _usingCtx$1.u(context && startSlowRequestDiagnostics(context.logGateway, "slow session checkout diff", "sessions.diff", "resolve", () => ({
			worktreeCount,
			returnedFileCount,
			scope: params.scope ?? "all"
		})));
		const empty = (unavailableReason) => ({
			sessionKey: params.sessionKey,
			files: [],
			additions: 0,
			deletions: 0,
			...unavailableReason ? { unavailableReason } : {}
		});
		return withSessionFileRoot({
			...params,
			projection: ["sessionDiffBaseline"]
		}, context?.getRuntimeConfig() ?? readRuntimeConfig(), async (loaded, assertSourceCurrent) => {
			try {
				var _usingCtx3 = _usingCtx();
				const { agentId, entry, storePath } = loaded;
				const assertCurrent = () => {
					assertSourceCurrent();
					assertAuthorized();
				};
				assertCurrent();
				if (!entry?.sessionId || !storePath || !agentId) return empty("unknown_session");
				const repository = _usingCtx3.u(await resolveRepositoryWorkspaceAccess({
					...loaded,
					agentId
				}, context, assertCurrent));
				assertCurrent();
				if (repository) {
					if (repository.kind === "stored") {
						const result = await loadRepositoryArtifactDiff(repository, params);
						assertCurrent();
						return result;
					}
					if (!repository.repository.baseCommit) throw new Error("The cloud repository is still preparing its base revision.");
					const result = await repository.inspect("diff", {
						scope: params.scope ?? "all",
						commit: params.commit,
						baseCommit: repository.repository.baseCommit
					});
					assertCurrent();
					delete result.root;
					return result;
				}
				const cwd = loaded.diffCwd;
				const checkoutPending = Boolean(entry.pendingWorktree || entry.pendingProjectGitUrl);
				if (!cwd) return empty(checkoutPending ? void 0 : "unknown_session");
				worktreeCount = 1;
				timing?.mark("git");
				const input = {
					cwd,
					sessionKey: params.sessionKey
				};
				let result;
				if (params.scope === "commit") {
					if (!params.commit) throw new TypeError("commit scope requires a commit");
					result = await loadCheckoutDiff({
						...input,
						commit: params.commit,
						scope: "commit"
					});
				} else result = await loadCheckoutDiff({
					...input,
					scope: params.scope ?? "all",
					baseline: entry.sessionDiffBaseline,
					sessionId: entry.sessionId
				});
				assertCurrent();
				returnedFileCount = result.files.length;
				timing?.mark("response");
				return result;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
const sessionsDiffHandlers = { "sessions.diff": async (options) => {
	const { params, respond, context } = options;
	if (!assertValidParams(params, validateSessionsDiffParams, "sessions.diff", respond)) return;
	if ((params.scope ?? "all") === "commit" !== (params.commit !== void 0)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid sessions.diff params: commit must be set if and only if scope is commit"));
		return;
	}
	const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const read = requestedAgent.agentId && isIncognitoSessionKey(params.sessionKey) ? await retainSessionScopedRead(options, params.sessionKey, requestedAgent.agentId, { requireMaterialized: true }) : void 0;
	try {
		const result = await loadSessionDiff({
			...params,
			...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
		}, context, () => read?.assertCurrent());
		read?.assertCurrent();
		respond(true, result);
	} finally {
		read?.release();
	}
} };
//#endregion
export { sessionsDiffHandlers };
