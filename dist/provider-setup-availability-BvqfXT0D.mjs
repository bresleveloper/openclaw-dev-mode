import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-yRbPluWX.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-CGIaZ9Jy.mjs";
//#region src/plugins/provider-setup-availability.ts
const log = createSubsystemLogger("plugins/provider-setup-availability");
/** Import accepted choices under a short lease; retain their callbacks through every probe. */
async function probeSetupProviderChoices(params, probe) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		const env = params.env ?? process.env;
		const discovery = await withPluginLifecycleLease({
			env,
			signal: params.signal
		}, async () => withPluginCache(cache, async () => {
			let config = params.config;
			const choices = [];
			for (const choice of params.choices) {
				params.signal?.throwIfAborted();
				const enabled = await enablePluginWithCapabilityConsent(params.config, choice.pluginId, {
					env,
					workspaceDir: params.workspaceDir
				});
				params.signal?.throwIfAborted();
				if (enabled.enabled) {
					config = (params.enablePluginInConfig ?? enablePluginInConfig)(config, choice.pluginId).config;
					choices.push(choice);
				}
			}
			const providers = choices.length ? (params.resolvePluginProviders ?? resolvePluginProvidersCore)({
				config,
				workspaceDir: params.workspaceDir,
				env,
				mode: "setup",
				pluginMetadataSnapshot: params.metadataSnapshot,
				cache: true,
				includeUntrustedWorkspacePlugins: false,
				onlyPluginIds: uniqueStrings(choices.map((choice) => choice.pluginId))
			}) : [];
			return {
				config,
				choices,
				providers
			};
		}));
		params.signal?.throwIfAborted();
		return await withPluginCache(cache, () => Promise.all(discovery.choices.map((choice) => probe(choice, discovery.providers.find((provider) => provider.pluginId === choice.pluginId && normalizeProviderId(provider.id) === normalizeProviderId(choice.providerId)), {
			config: discovery.config,
			env,
			workspaceDir: params.workspaceDir,
			signal: params.signal
		}))));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Detect reachable provider-owned services for the classic setup picker. */
async function detectAvailableSetupProviderIds(params) {
	const env = params.env ?? process.env;
	const metadataSnapshot = loadManifestMetadataSnapshot({
		...params,
		env
	});
	const choices = resolveManifestProviderAuthChoices({
		...params,
		env,
		metadataSnapshot,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => choice.appGuidedDiscovery === true && choice.assistantVisibility !== "manual-only" && (!choice.onboardingScopes || choice.onboardingScopes.includes("text-inference")));
	const detected = await probeSetupProviderChoices({
		...params,
		env,
		choices,
		metadataSnapshot
	}, async (choice, provider, context) => {
		const method = provider?.auth.find((candidate) => normalizeProviderId(candidate.id) === normalizeProviderId(choice.methodId));
		if (!method?.appGuidedSetup?.detectAvailability) return;
		try {
			return await method.appGuidedSetup.detectAvailability(context) ? choice.providerId : void 0;
		} catch (error) {
			log.debug(`Provider availability detection failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
			return;
		}
	});
	return new Set(detected.filter((providerId) => Boolean(providerId)));
}
//#endregion
export { detectAvailableSetupProviderIds, probeSetupProviderChoices };
