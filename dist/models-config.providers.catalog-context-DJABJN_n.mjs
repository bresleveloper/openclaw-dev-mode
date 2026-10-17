import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { j as resolveRegisteredAgentIdForDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-CdIOmi51.mjs";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-oevwKU3u.mjs";
import { a as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { n as normalizePluginDiscoveryResult } from "./provider-discovery-BkPgLJBP.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
//#region src/agents/models-config.providers.catalog-context.ts
const log = createSubsystemLogger("agents/model-providers");
function buildPluginCatalogConfig(ctx, provider) {
	const providers = {
		...ctx.config?.models?.providers,
		...ctx.explicitProviders
	};
	if (Object.keys(providers).length === 0) return ctx.config ?? {};
	for (const [providerId, source] of Object.entries(providers)) {
		const runtime = findNormalizedProviderValue(ctx.discoveryAuthConfig?.models?.providers, providerId);
		if (runtime && matchesProviderPluginRef(provider, providerId)) providers[providerId] = {
			...source,
			headers: runtime.headers,
			request: runtime.request
		};
	}
	return {
		...ctx.config,
		models: {
			...ctx.config?.models,
			providers
		}
	};
}
async function prepareProviderCatalogRun(params) {
	const { authStore, isActive, ...catalogParams } = params;
	if (!params.provider.auth.some((method) => method.kind === "oauth" || method.kind === "device_code") || params.providerIds !== void 0 && !params.providerIds.some((providerId) => matchesProviderPluginRef(params.provider, providerId))) return catalogParams;
	const agentId = resolveRegisteredAgentIdForDir(params.agentDir, params.env);
	const { prepareProviderCatalogOAuthAuth } = await import("./models-config.providers.discovery-auth.runtime.js");
	const failedProfileIds = /* @__PURE__ */ new Set();
	const reportedOutcomes = [];
	const { resolveProviderAuth, failures } = await prepareProviderCatalogOAuthAuth({
		agentDir: params.agentDir,
		authStore,
		env: params.env,
		provider: params.provider.id,
		resolveProviderAuth: params.resolveProviderAuth,
		isActive,
		onPreparationFailure: (profileIds) => {
			for (const profileId of profileIds) failedProfileIds.add(profileId);
		}
	}, params.config);
	return {
		...catalogParams,
		reportCatalogOutcome: (outcome) => {
			reportedOutcomes.push({ ...outcome });
			params.reportCatalogOutcome?.(outcome);
		},
		resolveProviderAuth,
		finalizeCatalogResult: (result) => {
			if (failedProfileIds.size === 0 && failures.length === 0) return result;
			const providers = normalizePluginDiscoveryResult({
				provider: params.provider,
				result
			});
			const origins = [...new Set(Object.values(providers).flatMap(({ baseUrl }) => {
				const origin = URL.parse(baseUrl)?.origin;
				return origin ? [origin] : [];
			}))];
			const destination = origins.length ? `the live catalog returned ${origins.join(", ")}` : "no live provider catalog was returned";
			for (const failure of failures) {
				const login = buildOAuthRefreshFailureLoginCommand(params.provider.id, {
					profileId: failure.profileId,
					agentId
				});
				log.warn(`${params.provider.id}: OAuth profile ${JSON.stringify(failure.profileId)} could not be resolved (${failure.message}); ${destination}. Re-authenticate with ${login}.`);
			}
			if (failedProfileIds.size > 0) {
				const providersWithOutcomes = new Set(reportedOutcomes.map((outcome) => normalizeProviderId(outcome.provider)));
				const aliasContext = {
					config: params.config,
					env: params.env
				};
				const authProvider = resolveProviderIdForAuth(params.provider.id, aliasContext);
				for (const provider of params.providerIds ?? [params.provider.id]) {
					const normalized = normalizeProviderId(provider);
					if (resolveProviderIdForAuth(provider, aliasContext) !== authProvider || providers[normalized] || providersWithOutcomes.has(normalized)) continue;
					for (const profileId of failedProfileIds) {
						const outcome = {
							provider,
							profileId,
							status: "unavailable"
						};
						reportedOutcomes.push(outcome);
						params.reportCatalogOutcome?.(outcome);
					}
				}
			}
			return result ? {
				providers,
				outcomes: reportedOutcomes
			} : result;
		}
	};
}
async function reportProviderCatalogSecretFailure(error, params) {
	if (!isTrustedSecretSurfaceUnavailableError(error)) return false;
	const { resolveUnavailableDiscoveryAuthProfileId } = await import("./models-config.providers.discovery-auth.runtime.js");
	const profileId = resolveUnavailableDiscoveryAuthProfileId(error);
	for (const provider of params.providerIds ?? [params.provider.id]) params.reportCatalogOutcome?.({
		provider,
		...profileId ? { profileId } : {},
		status: "unavailable"
	});
	return true;
}
/** An authorized selected profile reuses normal bounded provider discovery without failover. */
async function loadSelectedProviderAccountCatalog(params) {
	const { providerId, profileId, authStore } = params;
	const assertCurrent = () => {
		params.assertCurrent();
		if (!params.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Selected account catalog changed");
	};
	const credential = authStore.profiles[profileId];
	if (!credential) return [];
	const [{ runProviderCatalogWithTimeout }, { createProviderAuthResolver }] = await Promise.all([import("./models-config.providers.implicit-DDU4hfzV.mjs"), import("./models-config.providers.secrets-136AMxH5.mjs")]);
	assertCurrent();
	const selectedStore = {
		...authStore,
		profiles: { [profileId]: credential }
	};
	const selectedConfig = {
		...params.config,
		auth: {
			...params.config.auth,
			order: {
				...params.config.auth?.order,
				[providerId]: [profileId]
			}
		}
	};
	const resolveAuth = createProviderAuthResolver(process.env, selectedStore, selectedConfig);
	const lockedAuth = (requested, options) => {
		assertCurrent();
		const auth = resolveAuth(requested, options);
		return auth.profileId === profileId ? auth : {
			apiKey: void 0,
			mode: "none",
			source: "none",
			preparationFailed: true
		};
	};
	const acquired = [];
	await withGuardedFetchRequestAuthority(assertCurrent, async () => runProviderCatalogWithTimeout({
		provider: params.provider,
		providerIds: [providerId],
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: process.env,
		authStore: selectedStore,
		timeoutMs: 5e3,
		resolveProviderAuth: (requested, options) => lockedAuth(requested ?? providerId, options),
		resolveProviderApiKey: (requested) => {
			const { mode, ...auth } = lockedAuth(requested ?? providerId);
			return {
				...auth,
				...mode === "api_key" || mode === "oauth" || mode === "token" ? { mode } : {}
			};
		},
		isActive: params.isCurrent,
		reportCatalogOutcome: (outcome) => {
			if (normalizeProviderId(outcome.provider) === providerId && outcome.profileId === profileId) acquired.push(outcome);
		}
	}));
	assertCurrent();
	return acquired;
}
//#endregion
export { reportProviderCatalogSecretFailure as i, loadSelectedProviderAccountCatalog as n, prepareProviderCatalogRun as r, buildPluginCatalogConfig as t };
