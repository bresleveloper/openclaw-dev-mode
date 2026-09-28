import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-CcdrhaFf.mjs";
//#region src/cli/command-config-resolution.ts
/** Resolve command-scoped secrets and return both raw resolved and effective config views. */
async function resolveCommandConfigWithSecrets(params) {
	const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
		config: params.config,
		commandName: params.commandName,
		targetIds: params.targetIds,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.mode ? { mode: params.mode } : {},
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {},
		...params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {},
		...params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {},
		...params.allowLocalExecSecretRefs !== void 0 ? { allowLocalExecSecretRefs: params.allowLocalExecSecretRefs } : {},
		...params.scrubUnresolvedSecretRefs !== void 0 ? { scrubUnresolvedSecretRefs: params.scrubUnresolvedSecretRefs } : {},
		...params.gatewaySecretResolveTimeoutMs !== void 0 ? { gatewaySecretResolveTimeoutMs: params.gatewaySecretResolveTimeoutMs } : {}
	});
	if (params.runtime) for (const entry of diagnostics) params.runtime.error(`[secrets] ${entry}`);
	return {
		resolvedConfig,
		effectiveConfig: params.autoEnable ? applyPluginAutoEnable({
			config: resolvedConfig,
			env: params.env ?? process.env
		}).config : resolvedConfig,
		diagnostics
	};
}
//#endregion
export { resolveCommandConfigWithSecrets as t };
