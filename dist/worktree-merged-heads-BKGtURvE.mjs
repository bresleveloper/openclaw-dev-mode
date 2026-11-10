import { r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as runGitReadOperation } from "./git-read-cache-BHZXzsG8.mjs";
import { n as prepareControlUiSessionPrServiceTarget } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import { t as withControlUiSessionPrSource } from "./control-ui-session-pr-source-BLg5MhE6.mjs";
import { r as readKnownSessionBranchMergedHeads } from "./control-ui-session-prs-DBKAiuUV.mjs";
//#region src/gateway/worktree-merged-heads.ts
/** Optional cap-ordering evidence; never starts a GitHub request or supplies removal authority. */
async function readKnownWorktreeMergedHeads(record, config) {
	if (record.ownerKind !== "session" || !record.ownerId) return [];
	const owner = getInProcessGatewayRequestContext();
	const projection = getSessionRowProjection(owner);
	if (!owner || !projection) return [];
	const currentProjection = () => getInProcessGatewayRequestContext() === owner && readRuntimeConfig() === config ? getSessionRowProjection(owner) : void 0;
	try {
		const requested = resolveRequestedSessionAgentId(config, record.ownerId);
		if (!requested.ok) return [];
		const target = await prepareControlUiSessionPrServiceTarget(currentProjection, {
			sessionKey: record.ownerId,
			agentId: requested.agentId
		});
		if (!target?.assertCurrent || typeof target.source !== "string") return [];
		const binding = projection.capture({
			key: target.params.sessionKey,
			agentId: target.params.agentId
		})?.entry?.worktree;
		if (binding?.id !== record.id || binding.branch !== record.branch || binding.repoRoot !== record.repoRoot) return [];
		const assertTargetCurrent = target.assertCurrent;
		const root = target.source;
		return await withControlUiSessionPrSource(target.readSource, async (assertSourceCurrent, sourceIdentity) => {
			const assertCurrent = () => {
				assertTargetCurrent();
				assertSourceCurrent();
			};
			assertCurrent();
			const context = await runGitReadOperation({
				type: "checkout.context",
				input: {
					root,
					githubHost: target.githubHost
				}
			});
			assertCurrent();
			return context?.branch === record.branch ? readKnownSessionBranchMergedHeads(context, {
				target,
				sourceIdentity,
				assertCurrent
			}) : [];
		});
	} catch {
		return [];
	}
}
//#endregion
export { readKnownWorktreeMergedHeads };
