import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { b as parseWorkerGitHubLaunchBinding } from "./worker-process-protocol-B6pCNPWA.mjs";
import { p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { a as managedWorktrees } from "./service-JxB03j7i.mjs";
import { i as prepareCurrentGitHubPublicationIdentity, n as currentGitHubPublicationConfig, r as matchesCurrentGitHubPublicationIdentity, s as resolveGitHubPublicationWorkspaceOwner, u as sameGitHubPublicationWorkspace } from "./github-publication-availability-CE1CFSwV.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CloOx2kv.mjs";
//#region src/gateway/worker-environments/worker-github-binding.ts
const log = createSubsystemLogger("gateway/worker-github");
async function prepareWorkerGitHubBinding(params) {
	try {
		if (params.assertCurrent?.() === false) return;
		const workspace = resolveGitHubPublicationWorkspaceOwner(params);
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
		if (!sameGitHubPublicationWorkspace(workspace, resolveGitHubPublicationWorkspaceOwner(params)) || !matchesCurrentGitHubPublicationIdentity({
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
