import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DrqHZ423.mjs";
//#region src/cli/command-config-resolution.ts
/** Resolve command-scoped secrets and return both raw resolved and effective config views. */
async function resolveCommandConfigWithSecrets(params) {
	const { runtime, autoEnable, env, ...resolution } = params;
	const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway(resolution);
	if (runtime) for (const entry of diagnostics) runtime.error(`[secrets] ${entry}`);
	return {
		resolvedConfig,
		effectiveConfig: autoEnable ? applyPluginAutoEnable({
			config: resolvedConfig,
			env: env ?? process.env
		}).config : resolvedConfig,
		diagnostics
	};
}
//#endregion
export { resolveCommandConfigWithSecrets as t };
