import { $o as validateToolsGitHubAuthorizeCancelParams, Ng as errorShape, as as validateToolsGitHubConfigureParams, os as validateToolsGitHubStatusParams, rs as validateToolsGitHubAuthorizeStartParams, ts as validateToolsGitHubAuthorizePollParams } from "./src-pLJQA6J5.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as consumeGitHubSetupHandoff } from "./secret-store-d5UF_g7X.mjs";
import { f as resolveConfiguredGitHubToolIdentity, h as resolveManagedGitHubProfileDir, n as createManagedGitHubProfileId, p as resolveGitHubToolIdentityStatus, r as installManagedGitHubProfile } from "./github-tool-identity-BEdbceu6.mjs";
import { n as GitHubCliUnavailableError, t as updateGitHubToolIdentityConfig } from "./github-tool-identity-config-fur8LsB3.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
//#region src/gateway/server-methods/tools-github.ts
const toolsGitHubHandlers = {
	"tools.github.status": defineValidatedGatewayHandler("tools.github.status", validateToolsGitHubStatusParams, async ({ params, respond, context }) => {
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig()
		});
		if (!resolved) return;
		respond(true, await resolveGitHubToolIdentityStatus({
			config: resolved.cfg,
			sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? resolved.cfg,
			agentId: resolved.agentId,
			selectedScope: params.selectedScope
		}));
	}),
	"tools.github.configure": defineValidatedGatewayHandler("tools.github.configure", validateToolsGitHubConfigureParams, async ({ params, respond, context }) => {
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig()
		});
		if (!resolved) return;
		try {
			const previousIdentity = resolveConfiguredGitHubToolIdentity({
				config: resolved.cfg,
				agentId: resolved.agentId,
				scope: params.scope
			});
			let nextConfig = resolved.cfg;
			if (params.mode === "inherit") nextConfig = await updateGitHubToolIdentityConfig({
				scope: params.scope,
				agentId: resolved.agentId,
				expectedIdentity: previousIdentity ?? null
			});
			else {
				const gitAuthor = params.gitAuthor ? {
					...params.gitAuthor.name !== void 0 ? { name: params.gitAuthor.name.trim() } : {},
					...params.gitAuthor.email !== void 0 ? { email: params.gitAuthor.email.trim() } : {}
				} : void 0;
				const token = await consumeGitHubSetupHandoff({ name: params.secretName });
				if (!token) throw new Error("temporary GitHub credential is unavailable");
				const profileId = createManagedGitHubProfileId();
				const profileDir = resolveManagedGitHubProfileDir({
					agentId: resolved.agentId,
					scope: params.scope,
					profileId
				});
				await installManagedGitHubProfile({
					profileDir,
					token,
					commitConfig: async (account) => {
						const identity = {
							profileId,
							gitAuthor: gitAuthor ?? {
								name: account.login,
								email: `${account.accountId}+${account.login}@users.noreply.github.com`
							}
						};
						nextConfig = await updateGitHubToolIdentityConfig({
							scope: params.scope,
							agentId: resolved.agentId,
							identity,
							expectedIdentity: previousIdentity ?? null
						});
					}
				});
			}
			if (previousIdentity?.kind === "oauth") await context.githubOAuthService?.retireProfileAsync(previousIdentity.profileId);
			respond(true, await resolveGitHubToolIdentityStatus({
				config: nextConfig,
				agentId: resolved.agentId,
				selectedScope: params.scope
			}));
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub identity setup failed"));
		}
	}),
	"tools.github.authorize.start": defineValidatedGatewayHandler("tools.github.authorize.start", validateToolsGitHubAuthorizeStartParams, async ({ params, respond, context }) => {
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig()
		});
		if (!resolved) return;
		try {
			const service = context.githubOAuthService;
			if (!service) throw new Error("GitHub authorization lifecycle is unavailable.");
			respond(true, await service.startAuthorization({
				scope: params.scope,
				agentId: resolved.agentId
			}));
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof GitHubCliUnavailableError ? error.message : "GitHub authorization could not start"));
		}
	}),
	"tools.github.authorize.poll": defineValidatedGatewayHandler("tools.github.authorize.poll", validateToolsGitHubAuthorizePollParams, async ({ params, respond, context }) => {
		const service = context.githubOAuthService;
		if (!service) throw new Error("GitHub authorization lifecycle is unavailable.");
		respond(true, await service.pollAuthorization(params.requestId));
	}, () => errorShape(ErrorCodes.UNAVAILABLE, "GitHub authorization polling failed")),
	"tools.github.authorize.cancel": defineValidatedGatewayHandler("tools.github.authorize.cancel", validateToolsGitHubAuthorizeCancelParams, async ({ params, respond, context }) => {
		const service = context.githubOAuthService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub authorization lifecycle is unavailable"));
			return;
		}
		respond(true, { cancelled: await service.cancelAuthorizationAsync(params.requestId) });
	})
};
//#endregion
export { toolsGitHubHandlers };
