import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CfQwrdOt.mjs";
import { a as managedWorktrees } from "./service-DvlxnA92.mjs";
import { a as prepareCurrentGitHubPublicationIdentity, f as sameGitHubPublicationWorkspace, i as matchesCurrentGitHubPublicationIdentity, l as prepareGitHubPublicationWorkspaceOwner, n as currentGitHubPublicationConfig } from "./github-publication-availability-0ldF1lrO.mjs";
import { r as parseWorkerGitHubLaunchBinding } from "./launch-descriptor-BQV4k-tD.mjs";
//#region src/gateway/worker-environments/worker-github-binding.ts
const log = createSubsystemLogger("gateway/worker-github");
async function prepareWorkerGitHubBinding(params) {
	try {
		if (params.assertCurrent?.() === false) return;
		const currentWorkspace = await prepareGitHubPublicationWorkspaceOwner(params);
		const workspace = currentWorkspace();
		if (params.assertCurrent?.() === false) return;
		const identity = await prepareCurrentGitHubPublicationIdentity(params.agentId).catch(() => {
			const config = currentGitHubPublicationConfig();
			if (["agent", "system"].some((scope) => resolveConfiguredGitHubToolIdentity({
				config,
				agentId: params.agentId,
				scope
			})) && params.assertCurrent?.() !== false) log.warn("Worker GitHub identity unavailable; reconnect the shared GitHub account in Settings.");
			else log.debug("Worker GitHub identity unavailable.");
		});
		if (!identity || params.assertCurrent?.() === false) return;
		const originUrl = workspace.kind === "repository" ? workspace.workspace.url : (await managedWorktrees.resolveRepositoryIdentity(workspace.worktree.path)).originUrl;
		if (params.assertCurrent?.() === false) return;
		if (!sameGitHubPublicationWorkspace(workspace, currentWorkspace()) || !matchesCurrentGitHubPublicationIdentity({
			agentId: params.agentId,
			identity
		})) return;
		const token = identity.env.GH_TOKEN;
		if (!token) return;
		const remote = parseGitHubRemoteUrl(originUrl);
		const remoteUrl = remote && /^[A-Za-z0-9_.-]+$/u.test(remote.owner) && /^[A-Za-z0-9_.-]+$/u.test(remote.repo) ? `https://github.com/${remote.owner}/${remote.repo}.git` : void 0;
		const scope = identity.source === "agent-override" ? "agent" : identity.source === "system-configured" ? "system" : void 0;
		const gitAuthor = scope ? resolveConfiguredGitHubToolIdentity({
			config: currentGitHubPublicationConfig(),
			agentId: params.agentId,
			scope
		})?.gitAuthor : void 0;
		const binding = parseWorkerGitHubLaunchBinding({
			token,
			login: identity.account.login,
			branch: workspace.kind === "repository" ? workspace.workspace.branch : workspace.worktree.branch,
			...remoteUrl ? { remoteUrl } : {},
			...gitAuthor ? { gitAuthor } : {}
		});
		if (!binding) log.debug("Worker GitHub binding does not meet the worker launch contract.");
		return binding;
	} catch {
		log.debug("Worker GitHub binding unavailable for the current session workspace.");
		return;
	}
}
//#endregion
export { prepareWorkerGitHubBinding as t };
