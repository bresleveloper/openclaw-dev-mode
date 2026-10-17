import { Mi as validateSessionsDiffParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OA6C5SsW.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { n as loadCheckoutDiff } from "./session-diff-DOhRsGqZ.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { i as loadRepositoryArtifactDiff, t as resolveRepositoryWorkspaceAccess } from "./session-repository-workspace-access-XXymXD8B.mjs";
//#region src/gateway/server-methods/sessions-diff.ts
async function loadSessionDiff(params, context) {
	const empty = (unavailableReason) => ({
		sessionKey: params.sessionKey,
		files: [],
		additions: 0,
		deletions: 0,
		...unavailableReason ? { unavailableReason } : {}
	});
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	const { cfg, agentId, entry, storePath } = loaded;
	if (!entry?.sessionId || !storePath) return empty("unknown_session");
	const repository = await resolveRepositoryWorkspaceAccess(loaded, context);
	if (repository) {
		if (repository.kind === "stored") return await loadRepositoryArtifactDiff(repository, params);
		if (!repository.repository.baseCommit) throw new Error("The cloud repository is still preparing its base revision.");
		const result = await repository.inspect("diff", {
			scope: params.scope ?? "all",
			commit: params.commit,
			baseCommit: repository.repository.baseCommit
		});
		delete result.root;
		return result;
	}
	const { diffCwd: cwd, checkoutPending } = resolveSessionWorkspaceRoots(cfg, agentId, entry);
	if (!cwd) return empty(checkoutPending ? void 0 : "unknown_session");
	if (params.scope === "commit") {
		if (!params.commit) throw new TypeError("commit scope requires a commit");
		return await loadCheckoutDiff({
			commit: params.commit,
			cwd,
			scope: "commit",
			sessionKey: params.sessionKey
		});
	}
	return await loadCheckoutDiff({
		cwd,
		scope: params.scope ?? "all",
		sessionKey: params.sessionKey,
		baseline: entry.sessionDiffBaseline,
		sessionId: entry.sessionId
	});
}
const sessionsDiffHandlers = { "sessions.diff": async ({ params, respond, context }) => {
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
	respond(true, await loadSessionDiff({
		...params,
		...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
	}, context));
} };
//#endregion
export { sessionsDiffHandlers };
