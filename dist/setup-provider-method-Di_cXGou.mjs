import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-35XtW1Wg.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-CIqghIap.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { y as throwIfSetupInferenceCancelled } from "./setup-inference-core-CJd1l_r5.mjs";
import { c as supportsSetupTextInference } from "./setup-inference-auth-options-D3RRexV_.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-BNYfhiBg.mjs";
//#region src/system-agent/setup-provider-method.ts
/** Import under the mutation lease; keep provider callbacks owned through their materialization. */
async function withSetupProviderAuthMethod(params, consume) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		const activation = params.activation;
		const loaded = await withPluginLifecycleLease({ signal: params.signal ?? activation?.signal }, async () => withPluginCache(cache, async () => {
			const enabled = await enablePluginWithCapabilityConsent(params.cfg, params.choice.pluginId, {
				workspaceDir: params.workspace,
				beforePersistentEffect: params.beforePersistentEffect,
				onCapabilityConsent: activation?.prompter ? createPluginCapabilityConsentPrompter(activation.prompter, () => throwIfSetupInferenceCancelled(activation)) : void 0
			});
			if (!enabled.enabled) return { error: `${params.choice.choiceLabel} is disabled (${enabled.reason ?? "blocked"}).` };
			const provider = (params.deps.resolvePluginProviders ?? resolvePluginProvidersCore)({
				config: enabled.config,
				workspaceDir: params.workspace,
				mode: "setup",
				cache: true,
				includeUntrustedWorkspacePlugins: false,
				onlyPluginIds: [params.choice.pluginId]
			}).find((entry) => entry.pluginId === params.choice.pluginId && normalizeProviderId(entry.id) === normalizeProviderId(params.choice.providerId));
			const method = provider?.auth.find((entry) => entry.id === params.choice.methodId);
			if (!provider || !method || !supportsSetupTextInference(method.wizard?.onboardingScopes)) return { error: "That provider setup is not available on this Gateway." };
			return {
				config: enabled.config,
				provider,
				method
			};
		}));
		return "error" in loaded ? loaded : await withPluginCache(cache, () => consume(loaded));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { withSetupProviderAuthMethod as t };
