import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { f as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-BEdbceu6.mjs";
import { a as managedWorktrees } from "./service-BPAgan76.mjs";
import { n as parseWorkerGitHubLaunchBinding } from "./launch-descriptor-DPZyXmqm.mjs";
import { a as matchesCurrentGitHubPublicationIdentity, n as currentGitHubPublicationConfig, o as prepareCurrentGitHubPublicationIdentity, p as sameGitHubPublicationWorkspace, u as prepareGitHubPublicationWorkspaceOwner } from "./github-publication-availability-DsIV42qE.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-rTdEnJZN.mjs";
//#region src/gateway/worker-environments/worker-github-binding.ts
async function prepareGitHubPublicationFact(params) {
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			if (params.assertCurrent?.() === false) return;
			const currentWorkspace = await prepareGitHubPublicationWorkspaceOwner(params);
			_usingCtx$1.u({ [Symbol.dispose]: () => currentWorkspace.release() });
			const workspace = currentWorkspace.initial;
			const identity = await prepareCurrentGitHubPublicationIdentity(params.agentId);
			const originUrl = workspace.kind === "repository" ? workspace.workspace.url : (await managedWorktrees.resolveRepositoryIdentity(workspace.worktree.path)).originUrl;
			const current = await currentWorkspace.read();
			if (params.assertCurrent?.() === false || !sameGitHubPublicationWorkspace(workspace, current) || !matchesCurrentGitHubPublicationIdentity({
				agentId: params.agentId,
				identity
			})) return;
			const remote = parseGitHubRemoteUrl(originUrl);
			const remoteUrl = remote && /^[A-Za-z0-9_.-]+$/u.test(remote.owner) && /^[A-Za-z0-9_.-]+$/u.test(remote.repo) ? `https://github.com/${remote.owner}/${remote.repo}.git` : void 0;
			const scope = identity.source === "agent-override" ? "agent" : identity.source === "system-configured" ? "system" : void 0;
			const gitAuthor = scope ? resolveConfiguredGitHubToolIdentity({
				config: currentGitHubPublicationConfig(),
				agentId: params.agentId,
				scope
			})?.gitAuthor : void 0;
			const binding = parseWorkerGitHubLaunchBinding({
				token: identity.env.GH_TOKEN,
				login: identity.account.login,
				branch: workspace.kind === "repository" ? workspace.workspace.branch : workspace.worktree.branch,
				...remoteUrl ? { remoteUrl } : {},
				...gitAuthor ? { gitAuthor } : {}
			});
			return {
				available: Boolean(identity.env.GH_TOKEN),
				...binding ? { github: binding } : {}
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch {
		return;
	}
}
//#endregion
export { prepareGitHubPublicationFact as t };
