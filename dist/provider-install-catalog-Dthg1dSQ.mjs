import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { N as normalizePluginInstallDefaultChoice, p as resolveOfficialExternalPluginInstall, u as listOfficialExternalProviderCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { t as describePluginInstallSource } from "./install-source-info-DMwlOhrv.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { i as resolveManifestProviderAuthChoices, o as isProviderAuthChoicePlatformSupported } from "./provider-auth-choices-CBoGKnJX.mjs";
//#region src/plugins/provider-install-catalog.ts
const INSTALL_ORIGIN_PRIORITY = {
	config: 0,
	bundled: 1,
	global: 2,
	workspace: 3
};
function isPreferredOrigin(candidate, current) {
	return !current || INSTALL_ORIGIN_PRIORITY[candidate] < INSTALL_ORIGIN_PRIORITY[current];
}
function resolveInstallInfoFromInstallRecord(record) {
	if (!record) return null;
	const npmSpec = (record.resolvedSpec ?? record.spec)?.trim();
	const localPath = (record.installPath ?? record.sourcePath)?.trim();
	if (record.source === "clawhub" && record.spec?.trim()) return {
		clawhubSpec: record.spec.trim(),
		defaultChoice: "clawhub"
	};
	if (record.source === "npm" && npmSpec) return {
		npmSpec,
		defaultChoice: "npm",
		...record.integrity ? { expectedIntegrity: record.integrity } : {}
	};
	if (record.source === "path" && localPath) return {
		localPath,
		defaultChoice: "local"
	};
	return null;
}
function resolveInstallInfoFromPackageSource(params) {
	const source = isRecord(params.source) ? params.source : void 0;
	const npm = isRecord(source?.npm) ? source.npm : void 0;
	const clawhub = isRecord(source?.clawhub) ? source.clawhub : void 0;
	const local = isRecord(source?.local) ? source.local : void 0;
	const npmSpec = params.origin === "bundled" || params.origin === "config" ? normalizeOptionalString(npm?.spec) : void 0;
	const clawhubSpec = params.origin === "bundled" || params.origin === "config" ? normalizeOptionalString(clawhub?.spec) : void 0;
	const localPath = normalizeOptionalString(local?.path);
	if (!clawhubSpec && !npmSpec && !localPath) return null;
	const defaultChoice = normalizePluginInstallDefaultChoice(source?.defaultChoice);
	const expectedIntegrity = normalizeOptionalString(npm?.expectedIntegrity);
	return {
		...clawhubSpec ? { clawhubSpec } : {},
		...npmSpec ? { npmSpec } : {},
		...localPath ? { localPath } : {},
		...defaultChoice ? { defaultChoice } : clawhubSpec ? { defaultChoice: "clawhub" } : npmSpec ? { defaultChoice: "npm" } : {},
		...npmSpec && expectedIntegrity ? { expectedIntegrity } : {}
	};
}
function resolveInstallInfoFromRegistryRecord(params) {
	return resolveInstallInfoFromInstallRecord(params.installRecord) ?? resolveInstallInfoFromPackageSource({
		origin: params.record.origin,
		source: params.record.packageInstall
	});
}
function resolvePreferredInstallsByPluginId(params) {
	const preferredByPluginId = /* @__PURE__ */ new Map();
	const index = loadPluginRegistrySnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const installedPluginIds = new Set(index.plugins.map((record) => record.pluginId));
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	for (const record of index.plugins) {
		if (record.origin === "workspace" && params.includeUntrustedWorkspacePlugins === false && !resolveEffectiveEnableState({
			id: record.pluginId,
			origin: record.origin,
			config: normalizedConfig,
			rootConfig: params.config,
			enabledByDefault: record.enabledByDefault
		}).enabled) continue;
		const install = resolveInstallInfoFromRegistryRecord({
			record,
			installRecord: index.installRecords[record.pluginId]
		});
		if (!install) continue;
		const existing = preferredByPluginId.get(record.pluginId);
		if (!existing || isPreferredOrigin(record.origin, existing.origin)) preferredByPluginId.set(record.pluginId, {
			origin: record.origin,
			install,
			...record.packageName ? { packageName: record.packageName } : {}
		});
	}
	return {
		installedPluginIds,
		installsByPluginId: preferredByPluginId
	};
}
function resolveProviderInstallCatalogChoiceFields(choice) {
	return {
		...choice.choiceHint ? { choiceHint: choice.choiceHint } : {},
		...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
		...choice.assistantPriority !== void 0 ? { assistantPriority: choice.assistantPriority } : {},
		...choice.assistantVisibility ? { assistantVisibility: choice.assistantVisibility } : {},
		...choice.groupId ? { groupId: choice.groupId } : {},
		...choice.groupLabel ? { groupLabel: choice.groupLabel } : {},
		...choice.groupHint ? { groupHint: choice.groupHint } : {},
		...choice.optionKey ? { optionKey: choice.optionKey } : {},
		...choice.cliFlag ? { cliFlag: choice.cliFlag } : {},
		...choice.cliOption ? { cliOption: choice.cliOption } : {},
		...choice.cliDescription ? { cliDescription: choice.cliDescription } : {},
		...choice.onboardingScopes ? { onboardingScopes: choice.onboardingScopes } : {}
	};
}
function isProviderFlowScope(value) {
	return value === "text-inference" || value === "image-generation" || value === "music-generation";
}
function normalizeProviderAuthChoiceScopes(scopes) {
	if (!Array.isArray(scopes)) return;
	const normalized = scopes.filter(isProviderFlowScope);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveOfficialExternalProviderInstallCatalogEntries(params) {
	const entries = [];
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const pluginId = manifest?.plugin?.id?.trim();
		if (!manifest || !pluginId || params.installedPluginIds.has(pluginId)) continue;
		const install = resolveOfficialExternalPluginInstall(entry);
		if (!install) continue;
		for (const provider of manifest?.providers ?? []) {
			const providerId = provider.id?.trim();
			const label = provider.name?.trim() || manifest.plugin?.label?.trim() || entry.name?.trim();
			if (!providerId || !label) continue;
			const providerAliases = [...new Set((provider.aliases ?? []).map((alias) => alias.trim()).filter((alias) => alias && alias !== providerId))];
			for (const choice of provider.authChoices ?? []) {
				if (!isProviderAuthChoicePlatformSupported(choice.platforms)) continue;
				const methodId = choice.method?.trim();
				const choiceId = choice.choiceId?.trim();
				const choiceLabel = choice.choiceLabel?.trim();
				if (!methodId || !choiceId || !choiceLabel || params.seenChoiceIds.has(choiceId)) continue;
				entries.push({
					pluginId,
					providerId,
					...providerAliases.length > 0 ? { providerAliases } : {},
					methodId,
					choiceId,
					choiceLabel,
					...resolveProviderInstallCatalogChoiceFields({
						choiceHint: choice.choiceHint,
						modelTarget: choice.modelTarget,
						assistantPriority: choice.assistantPriority,
						assistantVisibility: choice.assistantVisibility,
						groupId: choice.groupId,
						groupLabel: choice.groupLabel,
						groupHint: choice.groupHint,
						optionKey: choice.optionKey,
						cliFlag: choice.cliFlag,
						cliOption: choice.cliOption,
						cliDescription: choice.cliDescription,
						onboardingScopes: normalizeProviderAuthChoiceScopes(choice.onboardingScopes)
					}),
					...choice.deprecatedChoiceIds?.length ? { deprecatedChoiceIds: [...choice.deprecatedChoiceIds] } : {},
					label,
					origin: "bundled",
					install,
					installSource: describePluginInstallSource(install, { expectedPackageName: entry.name })
				});
			}
		}
	}
	return entries;
}
/** Lists install catalog entries for provider setup choices. */
function resolveProviderInstallCatalogEntries(params) {
	const { installedPluginIds, installsByPluginId } = resolvePreferredInstallsByPluginId(params ?? {});
	const manifestEntries = resolveManifestProviderAuthChoices(params).flatMap((choice) => {
		const install = installsByPluginId.get(choice.pluginId);
		if (!install) return [];
		return [{
			...choice,
			label: choice.groupLabel ?? choice.choiceLabel,
			origin: install.origin,
			install: install.install,
			installSource: describePluginInstallSource(install.install, { expectedPackageName: install.packageName })
		}];
	});
	const officialEntries = resolveOfficialExternalProviderInstallCatalogEntries({
		installedPluginIds,
		seenChoiceIds: new Set(manifestEntries.map((entry) => entry.choiceId))
	});
	return [...manifestEntries, ...officialEntries].toSorted((left, right) => left.choiceLabel.localeCompare(right.choiceLabel));
}
/** Resolves one provider install catalog entry by setup choice id. */
function resolveProviderInstallCatalogEntry(choiceId, params) {
	const normalizedChoiceId = choiceId.trim();
	if (!normalizedChoiceId) return;
	return resolveProviderInstallCatalogEntries(params).find((entry) => entry.choiceId === normalizedChoiceId);
}
/** Resolves an uninstalled provider's deprecated setup choice to its replacement entry. */
function resolveDeprecatedProviderInstallCatalogEntry(choiceId, params) {
	const normalizedChoiceId = choiceId.trim();
	if (!normalizedChoiceId) return;
	return resolveProviderInstallCatalogEntries(params).find((entry) => entry.deprecatedChoiceIds?.includes(normalizedChoiceId));
}
//#endregion
export { resolveProviderInstallCatalogEntries as n, resolveProviderInstallCatalogEntry as r, resolveDeprecatedProviderInstallCatalogEntry as t };
