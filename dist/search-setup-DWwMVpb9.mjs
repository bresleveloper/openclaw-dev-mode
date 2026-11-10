import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./ref-contract-Bfd9_-Lp.mjs";
import { f as normalizeSecretInputString, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { g as resolveDefaultAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-yRbPluWX.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-D_H3kjvG.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { t as sortPluginEntriesById } from "./plugin-entry-order-DxrT0ucv.mjs";
import { a as hasAuthProfileForProvider } from "./model-config.helpers-CFSHDCes.mjs";
import { t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
import { c as resolveWebSearchProviderId } from "./runtime-DTeyaROR.mjs";
import { r as t } from "./i18n-CwUnB3fI.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-P722AY9p.mjs";
//#region src/flows/search-setup.ts
const SEARCH_INSTALL_CATALOG_ENTRY = Symbol("search-install-catalog-entry");
const WEB_SEARCH_DOCS_URL = "https://docs.openclaw.ai/tools/web";
const CODEX_HOSTED_SEARCH_PROVIDER_ID = "codex";
function resolveSearchProviderOptions(config) {
	const runtimeProviders = sortPluginEntriesById(resolvePluginWebSearchProviders({
		config,
		env: process.env,
		mode: "setup"
	}));
	const seenProviderIds = new Set(runtimeProviders.map((provider) => provider.id));
	const seenPluginIds = new Set(runtimeProviders.map((provider) => provider.pluginId));
	const normalizedPluginsConfig = normalizePluginsConfig(config?.plugins);
	const installCatalogProviders = resolveWebSearchInstallCatalogEntries().filter((entry) => !seenProviderIds.has(entry.provider.id) && !seenPluginIds.has(entry.pluginId) && resolveEffectiveEnableState({
		id: entry.pluginId,
		origin: "global",
		config: normalizedPluginsConfig,
		rootConfig: config,
		enabledByDefault: true
	}).enabled).map((entry) => Object.assign({}, entry.provider, { [SEARCH_INSTALL_CATALOG_ENTRY]: entry }));
	return sortPluginEntriesById([...runtimeProviders, ...installCatalogProviders]).filter((entry) => entry.onboardingScopes?.includes("text-inference") ?? false).toSorted((left, right) => left.label.localeCompare(right.label) || left.id.localeCompare(right.id));
}
function defaultModelUsesCodexRuntime(config) {
	if (!resolveAgentModelPrimaryValue(config.agents?.defaults?.model)) return false;
	const defaultModel = resolveDefaultModelForAgent({ cfg: config });
	if (defaultModel.provider === CODEX_HOSTED_SEARCH_PROVIDER_ID) return true;
	return resolveAgentHarnessPolicy({
		provider: defaultModel.provider,
		modelId: defaultModel.model,
		config
	}).runtime === "codex";
}
function resolveSearchProviderEntry(config, provider) {
	return resolveSearchProviderOptions(config).find((entry) => entry.id === provider);
}
function hasKeyInEnv(entry) {
	return entry.envVars.some((k) => Boolean(normalizeOptionalString(process.env[k])));
}
function providerIsReady(config, authStore, entry) {
	if (entry.requiresCredential === false) return true;
	if (entry.authProviderId && hasAuthProfileForProvider({
		provider: entry.authProviderId,
		authStore
	})) return true;
	return hasExistingKey(config, entry.id) || hasKeyInEnv(entry);
}
function rawKeyValue(config, provider) {
	return resolveSearchProviderEntry(config, provider)?.getConfiguredCredentialValue?.(config);
}
function resolveExistingKey(config, provider) {
	return normalizeSecretInputString(rawKeyValue(config, provider));
}
function hasExistingKey(config, provider) {
	return hasConfiguredSecretInput(rawKeyValue(config, provider));
}
function buildSearchEnvRef(config, provider) {
	const entry = resolveSearchProviderEntry(config, provider) ?? resolveSearchProviderOptions().find((candidate) => candidate.id === provider);
	const resolvedEnvVar = entry?.envVars.find((k) => Boolean(normalizeOptionalString(process.env[k]))) ?? entry?.envVars[0];
	if (!resolvedEnvVar) throw new Error(`No env var mapping for search provider "${provider}" at ${entry?.credentialPath ?? "unknown path"} in secret-input-mode=ref.`);
	return {
		source: "env",
		provider: DEFAULT_SECRET_PROVIDER_ALIAS,
		id: resolvedEnvVar
	};
}
function applySearchProviderSelectionConfig(config, providerEntry, search) {
	const next = {
		...config,
		tools: {
			...config.tools,
			web: {
				...config.tools?.web,
				search
			}
		}
	};
	if (providerEntry.applySelectionConfig) return providerEntry.applySelectionConfig(next);
	if (providerEntry.pluginId) return enablePluginInConfig(next, providerEntry.pluginId).config;
	return next;
}
function applySearchProviderSelection(config, provider, key) {
	const providerEntry = resolveSearchProviderEntry(config, provider);
	if (!providerEntry) return config;
	const next = applySearchProviderSelectionConfig(config, providerEntry, {
		...config.tools?.web?.search,
		provider,
		enabled: true
	});
	if (key !== void 0) providerEntry.setConfiguredCredentialValue?.(next, key);
	return next;
}
function preserveDisabledState(original, result) {
	if (original.tools?.web?.search?.enabled !== false) return result;
	const next = {
		...result,
		tools: {
			...result.tools,
			web: {
				...result.tools?.web,
				search: {
					...result.tools?.web?.search,
					enabled: false
				}
			}
		}
	};
	const provider = next.tools?.web?.search?.provider;
	if (typeof provider !== "string") return next;
	const providerEntry = resolveSearchProviderEntry(original, provider);
	if (!providerEntry?.pluginId) return next;
	const pluginId = providerEntry.pluginId;
	const originalPluginEntry = original.plugins?.entries?.[pluginId];
	const resultPluginEntry = next.plugins?.entries?.[pluginId];
	const nextPlugins = { ...next.plugins };
	if (Array.isArray(original.plugins?.allow)) nextPlugins.allow = [...original.plugins.allow];
	else delete nextPlugins.allow;
	if (resultPluginEntry || originalPluginEntry) {
		const nextEntries = { ...nextPlugins.entries };
		const patchedEntry = { ...resultPluginEntry };
		if (typeof originalPluginEntry?.enabled === "boolean") patchedEntry.enabled = originalPluginEntry.enabled;
		else delete patchedEntry.enabled;
		nextEntries[pluginId] = patchedEntry;
		nextPlugins.entries = nextEntries;
	}
	return {
		...next,
		plugins: nextPlugins
	};
}
function completedSearchSetup(config) {
	return {
		outcome: "completed",
		config
	};
}
async function finalizeSearchProviderSetup(params) {
	let next = params.nextConfig;
	const installEntry = params.entry[SEARCH_INSTALL_CATALOG_ENTRY];
	if (installEntry && next.tools?.web?.search?.enabled !== false) {
		const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-B3WrPhvj.mjs");
		const installed = await ensureOnboardingPluginInstalled({
			cfg: next,
			entry: {
				pluginId: installEntry.pluginId,
				label: installEntry.label,
				install: installEntry.install,
				...installEntry.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {}
			},
			prompter: params.prompter,
			runtime: params.runtime,
			autoConfirmSingleSource: true,
			...params.opts?.beforePersistentEffect ? { beforePersistentEffect: params.opts.beforePersistentEffect } : {}
		});
		if (!installed.installed) {
			if (installed.status === "skipped") return {
				outcome: "kept-current",
				config: params.originalConfig,
				reason: "provider-install-skipped",
				providerId: params.entry.id
			};
			return {
				outcome: "install-failed",
				config: params.originalConfig,
				providerId: params.entry.id,
				reason: installed.status === "timed_out" ? "timed-out" : "failed"
			};
		}
		next = installed.cfg;
	}
	if (params.opts?.preserveDisabledSearchState !== false) next = preserveDisabledState(params.originalConfig, next);
	if (!params.entry.runSetup) return completedSearchSetup(next);
	next = await params.entry.runSetup({
		config: next,
		runtime: params.runtime,
		prompter: params.prompter,
		quickstartDefaults: params.opts?.quickstartDefaults,
		secretInputMode: params.opts?.secretInputMode
	});
	return completedSearchSetup(params.opts?.preserveDisabledSearchState === false ? next : preserveDisabledState(params.originalConfig, next));
}
async function runSearchSetupFlow(config, runtime, prompter, opts) {
	const authStore = await ensureAuthProfileStoreWithoutExternalProfilesAsync(resolveDefaultAgentDir(config));
	const availableProviderOptions = resolveSearchProviderOptions(config);
	const codexRecommended = defaultModelUsesCodexRuntime(config) && availableProviderOptions.some((entry) => entry.id === CODEX_HOSTED_SEARCH_PROVIDER_ID);
	const preferred = codexRecommended ? availableProviderOptions.find((entry) => entry.id === CODEX_HOSTED_SEARCH_PROVIDER_ID) : void 0;
	const providerOptions = preferred ? [preferred, ...availableProviderOptions.filter((entry) => entry.id !== preferred.id)] : [...availableProviderOptions];
	if (providerOptions.length === 0) {
		await prompter.note([
			t("wizard.search.noProvidersByPolicy"),
			t("wizard.search.noProvidersAction"),
			t("wizard.search.docsLine", { url: WEB_SEARCH_DOCS_URL })
		].join("\n"), t("wizard.search.title"));
		return {
			outcome: "kept-current",
			config,
			reason: "no-providers"
		};
	}
	await prompter.note([
		t("wizard.search.intro"),
		t("wizard.search.chooseProvider"),
		t("wizard.search.docsLine", { url: WEB_SEARCH_DOCS_URL })
	].join("\n"), t("wizard.search.title"));
	const existingProvider = config.tools?.web?.search?.provider;
	const defaultChoice = (() => {
		if (existingProvider && providerOptions.some((entry) => entry.id === existingProvider)) return existingProvider;
		if (codexRecommended) return CODEX_HOSTED_SEARCH_PROVIDER_ID;
		const searchForAutoDetect = {
			...config.tools?.web?.search,
			provider: void 0
		};
		const autoDetectedId = resolveWebSearchProviderId({
			config,
			search: searchForAutoDetect,
			authStore,
			providers: [...providerOptions]
		});
		const autoDetected = providerOptions.find((entry) => entry.id === autoDetectedId);
		if (autoDetected) return autoDetected.id;
		const detected = providerOptions.find((entry) => entry.requiresCredential !== false && providerIsReady(config, authStore, entry));
		if (detected) return detected.id;
		return "__skip__";
	})();
	const options = providerOptions.map((entry) => {
		const credentialHint = entry.requiresCredential === false ? t("wizard.search.keyFree") : providerIsReady(config, authStore, entry) ? t("wizard.search.configured") : entry.credentialLabel ? t("wizard.search.credentialRequired", { label: entry.credentialLabel }) : t("wizard.search.apiKeyRequired");
		const hint = normalizeOptionalString([normalizeOptionalString(entry.hint), credentialHint].filter(Boolean).join(" · "));
		return {
			value: entry.id,
			label: hint ? `${entry.label} (${hint})` : entry.label
		};
	});
	const choice = await prompter.select({
		message: t("wizard.search.providerPrompt"),
		options: [...options, {
			value: "__skip__",
			label: t("common.skipForNow"),
			hint: t("wizard.search.configureLaterHint")
		}],
		initialValue: defaultChoice,
		searchable: true
	});
	if (choice === "__skip__") return {
		outcome: "kept-current",
		config,
		reason: "user-skipped"
	};
	const entry = resolveSearchProviderEntry(config, choice) ?? providerOptions.find((e) => e.id === choice);
	if (!entry) return {
		outcome: "kept-current",
		config,
		reason: "provider-unavailable",
		providerId: choice
	};
	if (entry.pluginId && !(SEARCH_INSTALL_CATALOG_ENTRY in entry) && (opts?.preserveDisabledSearchState === false || config.tools?.web?.search?.enabled !== false)) {
		const enabled = await enablePluginWithCapabilityConsent(config, entry.pluginId, { onCapabilityConsent: createPluginCapabilityConsentPrompter(prompter, opts?.beforePersistentEffect) });
		if (!enabled.enabled) {
			await prompter.note(enabled.reason ?? "Plugin could not be enabled.", "Web search unavailable");
			return {
				outcome: "install-failed",
				config: enabled.config,
				providerId: choice,
				reason: "failed"
			};
		}
	}
	const finalizeSelection = (nextConfig) => finalizeSearchProviderSetup({
		originalConfig: config,
		nextConfig,
		entry,
		runtime,
		prompter,
		opts
	});
	const credentialLabel = entry.requiresCredential === false ? `${entry.label} setup` : normalizeOptionalString(entry.credentialLabel) || `${entry.label} API key`;
	const existingKey = resolveExistingKey(config, choice);
	const keyConfigured = hasExistingKey(config, choice);
	const envAvailable = hasKeyInEnv(entry);
	const authProviderId = entry.authProviderId;
	const providerAuthProfileAvailable = authProviderId ? hasAuthProfileForProvider({
		provider: authProviderId,
		authStore
	}) : false;
	const oauthAuthProfileAvailable = authProviderId && providerAuthProfileAvailable ? hasAuthProfileForProvider({
		provider: authProviderId,
		authStore,
		type: "oauth"
	}) : false;
	if (opts?.quickstartDefaults && (providerAuthProfileAvailable || keyConfigured || envAvailable)) return await finalizeSelection(applySearchProviderSelection(config, choice, existingKey || void 0));
	if (entry.requiresCredential === false) {
		await prompter.note([
			`${entry.label} works without an API key.`,
			"OpenClaw will enable the plugin and use it as your web_search provider.",
			`Docs: ${entry.docsUrl ?? "https://docs.openclaw.ai/tools/web"}`
		].join("\n"), "Web search");
		return await finalizeSelection(applySearchProviderSelection(config, choice));
	}
	if (entry.credentialNote) await prompter.note(entry.credentialNote, entry.label);
	if (providerAuthProfileAvailable && authProviderId) {
		const authProviderLabel = authProviderId === "xai" ? "xAI" : authProviderId;
		await prompter.note([
			oauthAuthProfileAvailable ? `${entry.label} can use your existing ${authProviderLabel} OAuth sign-in for web_search.` : `${entry.label} can use your existing ${authProviderLabel} auth profile for web_search.`,
			oauthAuthProfileAvailable ? "No separate API key is required; API-key auth remains available as a fallback." : "No separate web-search key is required; API-key auth remains available as a fallback.",
			`Docs: ${entry.docsUrl ?? WEB_SEARCH_DOCS_URL}`
		].join("\n"), "Web search");
		return await finalizeSelection(applySearchProviderSelection(config, choice));
	}
	if (opts?.secretInputMode === "ref") {
		if (keyConfigured) return await finalizeSelection(applySearchProviderSelection(config, choice));
		const ref = buildSearchEnvRef(config, choice);
		await prompter.note([
			"Secret references enabled — OpenClaw will store a reference instead of the API key.",
			`Env var: ${ref.id}${envAvailable ? " (detected)" : ""}.`,
			...envAvailable ? [] : [`Set ${ref.id} in the Gateway environment.`],
			"Docs: https://docs.openclaw.ai/tools/web"
		].join("\n"), "Web search");
		return await finalizeSelection(applySearchProviderSelection(config, choice, ref));
	}
	const keyInput = await prompter.text({
		message: keyConfigured ? `${credentialLabel} (leave blank to keep current)` : envAvailable ? `${credentialLabel} (leave blank to use env var)` : credentialLabel,
		placeholder: keyConfigured ? "Leave blank to keep current" : entry.placeholder,
		sensitive: true
	});
	const key = normalizeOptionalString(keyInput) ?? "";
	if (key) return await finalizeSelection(applySearchProviderSelection(config, choice, key));
	if (existingKey) return await finalizeSelection(applySearchProviderSelection(config, choice, existingKey));
	if (keyConfigured || envAvailable) return await finalizeSelection(applySearchProviderSelection(config, choice));
	await prompter.note([
		`No ${credentialLabel} stored — web_search won't work until a key is available.`,
		`Get your key at: ${entry.signupUrl}`,
		"Docs: https://docs.openclaw.ai/tools/web"
	].join("\n"), "Web search");
	return completedSearchSetup(applySearchProviderSelectionConfig(config, entry, {
		...config.tools?.web?.search,
		enabled: false,
		provider: choice
	}));
}
//#endregion
export { runSearchSetupFlow as a, resolveSearchProviderOptions as i, hasKeyInEnv as n, resolveExistingKey as r, hasExistingKey as t };
