import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { u as listOfficialExternalProviderCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { r as parseProviderPluginMethodChoice } from "./provider-plugin-choice-Dpa6rQvC.mjs";
//#region src/plugins/provider-auth-choice-platform.ts
/** Keep setup and cold-install choices on the platforms their provider supports. */
function isProviderAuthChoicePlatformSupported(platforms) {
	return platforms === void 0 || Array.isArray(platforms) && platforms.includes(process.platform);
}
//#endregion
//#region src/plugins/provider-auth-choices.ts
const PROVIDER_AUTH_CHOICE_ORIGIN_PRIORITY = {
	config: 0,
	bundled: 1,
	global: 2,
	workspace: 3
};
const DESCRIPTOR_LABEL_ACRONYMS = /* @__PURE__ */ new Map([
	["api", "API"],
	["jwt", "JWT"],
	["oauth", "OAuth"],
	["oidc", "OIDC"],
	["pkce", "PKCE"],
	["saml", "SAML"],
	["sso", "SSO"]
]);
function resolveProviderAuthChoiceOriginPriority(origin) {
	if (!origin) return Number.MAX_SAFE_INTEGER;
	return PROVIDER_AUTH_CHOICE_ORIGIN_PRIORITY[origin] ?? Number.MAX_SAFE_INTEGER;
}
function projectProviderAuthChoice(candidate) {
	const { pluginId, providerId, methodId, choiceId, declaration } = candidate;
	if (!declaration) {
		const providerLabel = formatDescriptorLabel(providerId);
		const methodLabel = formatDescriptorLabel(methodId);
		return {
			pluginId,
			providerId,
			methodId,
			choiceId,
			choiceLabel: methodId === "api-key" ? `${providerLabel} API key` : `${providerLabel} ${methodLabel}`,
			groupId: providerId,
			groupLabel: providerLabel
		};
	}
	const { provider: _provider, method: _method, choiceId: _choiceId, choiceLabel, ...metadata } = declaration;
	return {
		pluginId,
		providerId,
		methodId,
		choiceId,
		choiceLabel: choiceLabel ?? choiceId,
		...metadata
	};
}
function formatDescriptorLabel(value) {
	return sanitizeForLog(value).trim().split(/[-_\s]+/gu).filter(Boolean).map((part) => {
		const lower = part.toLowerCase();
		const acronym = DESCRIPTOR_LABEL_ACRONYMS.get(lower);
		if (acronym) return acronym;
		return `${lower.slice(0, 1).toUpperCase()}${lower.slice(1)}`;
	}).join(" ");
}
function normalizeManifestAuthDescriptorId(value) {
	return sanitizeForLog(value).trim();
}
function toSetupProviderAuthChoiceCandidate(params) {
	return {
		pluginId: params.plugin.id,
		origin: params.plugin.origin,
		providerId: params.providerId,
		methodId: params.methodId,
		choiceId: `${params.providerId}-${params.methodId}`
	};
}
function listSetupProviderAuthChoiceCandidates(plugin) {
	if (plugin.setup?.requiresRuntime !== false && plugin.setupSource) return [];
	const explicitProviderMethods = new Set((plugin.providerAuthChoices ?? []).map((choice) => `${choice.provider}::${choice.method}`));
	return (plugin.setup?.providers ?? []).flatMap((provider) => {
		const providerId = normalizeManifestAuthDescriptorId(provider.id);
		if (!providerId) return [];
		return (provider.authMethods ?? []).map(normalizeManifestAuthDescriptorId).filter(Boolean).filter((methodId) => !explicitProviderMethods.has(`${providerId}::${methodId}`)).map((methodId) => toSetupProviderAuthChoiceCandidate({
			plugin,
			providerId,
			methodId
		}));
	});
}
function resolveManifestProviderAuthChoiceCandidates(params, declaredOnly = false) {
	const registry = (params?.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params?.config ?? {},
		workspaceDir: params?.workspaceDir,
		env: params?.env ?? process.env
	})).manifestRegistry;
	const normalizedConfig = normalizePluginsConfig(params?.config?.plugins);
	return registry.plugins.flatMap((plugin) => {
		if (params?.pluginId && plugin.id !== params.pluginId) return [];
		if (declaredOnly && !passesManifestOwnerBasePolicy({
			plugin,
			normalizedConfig
		})) return [];
		if (plugin.origin === "workspace" && params?.includeWorkspacePlugins === false) return [];
		if (plugin.origin === "workspace" && params?.includeUntrustedWorkspacePlugins === false && !resolveEffectiveEnableState({
			id: plugin.id,
			origin: plugin.origin,
			config: normalizedConfig,
			rootConfig: params?.config
		}).enabled) return [];
		const choices = [];
		for (const choice of plugin.providerAuthChoices ?? []) {
			if (!params?.includeUnsupportedPlatforms && !isProviderAuthChoicePlatformSupported(choice.platforms)) continue;
			choices.push({
				pluginId: plugin.id,
				origin: plugin.origin,
				providerId: choice.provider,
				methodId: choice.method,
				choiceId: choice.choiceId,
				declaration: choice
			});
		}
		if (!declaredOnly) choices.push(...listSetupProviderAuthChoiceCandidates(plugin));
		return choices;
	});
}
function pickPreferredManifestAuthChoice(candidates) {
	let preferred;
	let ambiguous = false;
	for (const candidate of candidates) {
		if (!preferred) {
			preferred = candidate;
			continue;
		}
		if (resolveProviderAuthChoiceOriginPriority(candidate.origin) < resolveProviderAuthChoiceOriginPriority(preferred.origin)) {
			preferred = candidate;
			ambiguous = false;
		} else if (resolveProviderAuthChoiceOriginPriority(candidate.origin) === resolveProviderAuthChoiceOriginPriority(preferred.origin)) ambiguous = true;
	}
	return ambiguous ? void 0 : preferred;
}
function resolvePreferredManifestAuthChoicesByChoiceId(candidates) {
	const byChoiceId = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const normalizedChoiceId = candidate.choiceId.trim();
		if (!normalizedChoiceId) continue;
		const group = byChoiceId.get(normalizedChoiceId) ?? [];
		group.push(candidate);
		byChoiceId.set(normalizedChoiceId, group);
	}
	return [...byChoiceId.values()].flatMap((group) => {
		const preferred = pickPreferredManifestAuthChoice(group);
		return preferred ? [preferred] : [];
	});
}
function resolvePreferredManifestAuthChoiceMetadata(params) {
	const preferred = pickPreferredManifestAuthChoice(resolveManifestProviderAuthChoiceCandidates(params.config).filter(params.matches));
	return preferred ? projectProviderAuthChoice(preferred) : void 0;
}
function resolveManifestProviderAuthChoices(params) {
	return resolvePreferredManifestAuthChoicesByChoiceId(resolveManifestProviderAuthChoiceCandidates(params)).map(projectProviderAuthChoice);
}
/** Executable declarations exclude workspace code and honor current plugin policy. */
function resolveManifestDeclaredProviderAuthChoices(params) {
	return resolvePreferredManifestAuthChoicesByChoiceId(resolveManifestProviderAuthChoiceCandidates({
		...params,
		includeWorkspacePlugins: false
	}, true)).map(projectProviderAuthChoice);
}
function resolveManifestProviderAuthChoice(choiceId, params) {
	const normalized = choiceId.trim();
	if (!normalized) return;
	const explicit = parseProviderPluginMethodChoice(normalized);
	return resolvePreferredManifestAuthChoiceMetadata({
		config: params,
		matches: (choice) => explicit ? Boolean(explicit.providerId && explicit.methodId) && normalizeProviderId(choice.providerId) === normalizeProviderId(explicit.providerId) && normalizeOptionalLowercaseString(choice.methodId) === normalizeOptionalLowercaseString(explicit.methodId) : choice.choiceId === normalized
	});
}
function resolveManifestDeprecatedProviderAuthChoice(choiceId, params) {
	const normalized = choiceId.trim();
	if (!normalized) return;
	return resolvePreferredManifestAuthChoiceMetadata({
		config: params,
		matches: (choice) => choice.declaration?.deprecatedChoiceIds?.includes(normalized) === true
	});
}
function resolveManifestProviderOnboardAuthFlags(params) {
	const preferredByFlag = /* @__PURE__ */ new Map();
	for (const candidate of resolveManifestProviderAuthChoiceCandidates(params)) {
		const choice = candidate.declaration;
		if (!choice?.optionKey || !choice.cliFlag || !choice.cliOption) continue;
		const dedupeKey = `${choice.optionKey}::${choice.cliFlag}`;
		const existing = preferredByFlag.get(dedupeKey);
		if (existing && resolveProviderAuthChoiceOriginPriority(candidate.origin) >= resolveProviderAuthChoiceOriginPriority(existing.origin)) continue;
		preferredByFlag.set(dedupeKey, {
			origin: candidate.origin,
			flag: {
				optionKey: choice.optionKey,
				authChoice: candidate.choiceId,
				cliFlag: choice.cliFlag,
				cliOption: choice.cliOption,
				description: choice.cliDescription ?? choice.choiceLabel ?? candidate.choiceId
			}
		});
	}
	return [...preferredByFlag.values()].map(({ flag }) => flag);
}
function resolveOfficialExternalProviderOnboardAuthFlags() {
	const flags = [];
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		for (const provider of manifest?.providers ?? []) for (const choice of provider.authChoices ?? []) {
			if (!isProviderAuthChoicePlatformSupported(choice.platforms)) continue;
			const optionKey = choice.optionKey?.trim();
			const authChoice = choice.choiceId?.trim();
			const cliFlag = choice.cliFlag?.trim();
			const cliOption = choice.cliOption?.trim();
			if (!optionKey || !authChoice || !cliFlag || !cliOption) continue;
			flags.push({
				optionKey,
				authChoice,
				cliFlag,
				cliOption,
				description: choice.cliDescription?.trim() || choice.choiceLabel?.trim() || authChoice
			});
		}
	}
	return flags;
}
/** Resolves onboard auth flags from installed manifests and official cold-install metadata. */
function resolveProviderOnboardAuthFlags(params) {
	const flags = resolveManifestProviderOnboardAuthFlags(params);
	const seen = new Set(flags.map((flag) => `${flag.optionKey}::${flag.cliFlag}`));
	for (const flag of resolveOfficialExternalProviderOnboardAuthFlags()) {
		const dedupeKey = `${flag.optionKey}::${flag.cliFlag}`;
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);
		flags.push(flag);
	}
	return flags;
}
//#endregion
export { resolveProviderOnboardAuthFlags as a, resolveManifestProviderAuthChoices as i, resolveManifestDeprecatedProviderAuthChoice as n, isProviderAuthChoicePlatformSupported as o, resolveManifestProviderAuthChoice as r, resolveManifestDeclaredProviderAuthChoices as t };
