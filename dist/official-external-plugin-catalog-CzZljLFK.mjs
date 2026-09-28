import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-COfUtw4c.mjs";
import { c as resolveOpenClawReleaseCohortVersion, o as parseRegistryNpmSpec, r as isExactSemverVersion } from "./npm-registry-spec-CjcsDXUg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { p as selectNpmChannelVersion } from "./update-channels-BDINqyML.mjs";
import { n as isUnavailableClawHubTarget, t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget, t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { a as getFeedEntryInstallCandidateRecords, h as resolveOfficialExternalPluginId, m as resolveOfficialExternalPluginCatalogProfileConfig, o as getOfficialExternalPluginCatalogManifest, p as resolveOfficialExternalPluginCatalogEntryKey, s as hasKnownCatalogSourceRef, t as DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
//#region src/plugins/plugin-install-default-choice.ts
function normalizePluginInstallDefaultChoice(value) {
	return value === "clawhub" || value === "npm" || value === "local" ? value : void 0;
}
//#endregion
//#region src/infra/clawhub-integrity.ts
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
function normalizeClawHubSha256Integrity(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const prefixedBase64 = /^sha256-([A-Za-z0-9+/]+={0,1})$/.exec(trimmed);
	if (prefixedBase64?.[1]) {
		try {
			const decoded = Buffer.from(prefixedBase64[1], "base64");
			if (decoded.length === 32) return `sha256-${decoded.toString("base64")}`;
		} catch {
			return null;
		}
		return null;
	}
	const prefixedHex = /^sha256:([A-Fa-f0-9]{64})$/.exec(trimmed);
	if (prefixedHex?.[1]) return `sha256-${Buffer.from(prefixedHex[1], "hex").toString("base64")}`;
	if (/^[A-Fa-f0-9]{64}$/.test(trimmed)) return `sha256-${Buffer.from(trimmed, "hex").toString("base64")}`;
	return null;
}
/** Normalizes ClawHub SHA-256 metadata into lowercase hex form. */
function normalizeClawHubSha256Hex(value) {
	const trimmed = value.trim();
	if (!/^[A-Fa-f0-9]{64}$/.test(trimmed)) return null;
	return normalizeLowercaseStringOrEmpty(trimmed);
}
//#endregion
//#region src/plugins/install-channel-specs.ts
/** Only declared identities participate; a ClawHub slug never implies an npm package. */
function resolvePluginInstallSources(install, explicitSource) {
	const sources = [];
	for (const source of ["npm", "clawhub"]) {
		const spec = (source === "npm" ? install.npmSpec : install.clawhubSpec)?.trim();
		if (!spec || explicitSource && source !== explicitSource) continue;
		const integritySource = install.npmSpec?.trim() ? "npm" : "clawhub";
		sources.push({
			source,
			spec,
			...source === integritySource && install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}
		});
	}
	return sources;
}
function isUnavailablePluginSource(source, result) {
	if (result.ok) return false;
	return source === "npm" ? result.code === PLUGIN_INSTALL_ERROR_CODE.RELEASE_COHORT_UNAVAILABLE || isUnavailableNpmTarget({
		ok: false,
		code: result.code
	}) : isUnavailableClawHubTarget({
		ok: false,
		code: result.code
	}) || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE;
}
/** Availability alone permits a declared secondary; every attempt owns its artifact review. */
async function installWithSourceFallback(params) {
	for (const [index, source] of params.sources.entries()) {
		const attempt = await params.install(source);
		const secondary = params.sources[index + 1];
		if (!secondary || !isUnavailablePluginSource(source.source, params.result(attempt))) return {
			attempt,
			source
		};
		await params.onFallback(`${source.spec} unavailable; using ${secondary.spec} instead.`);
	}
	throw new Error("Plugin has no declared remote install source.");
}
var NpmChannelResolutionError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE;
	}
};
/** Bare specs and latest retain default intent while following the active release channel. */
function resolveDefaultNpmSpec(spec) {
	const parsed = parseRegistryNpmSpec(spec);
	if (!parsed) return null;
	if (parsed.selectorKind === "none" || parsed.selectorKind === "tag" && parsed.selector?.toLowerCase() === "latest") return parsed;
	return null;
}
function resolveCoreBoundNpmSpec(params) {
	if (params.updateChannel === "extended-stable" || params.updateChannel === "stable" && params.versionBoundToCore) {
		const target = resolveDefaultNpmSpec(params.spec);
		if (target && params.officialPackageName === target.name) {
			const coreVersion = params.coreVersion?.trim();
			if (!coreVersion || !isExactSemverVersion(coreVersion)) {
				const policy = params.updateChannel === "extended-stable" ? "Extended-stable" : "Version-bound";
				throw new Error(`${policy} plugin resolution for ${target.name} requires an exact core version.`);
			}
			const installVersion = params.versionBoundToCore ? resolveOpenClawReleaseCohortVersion(coreVersion) : coreVersion;
			return `${target.name}@${installVersion}`;
		}
	}
}
async function resolveNpmInstallSpecsForUpdateChannel(params) {
	const selectedSpec = params.installSpecOverride ?? resolveCoreBoundNpmSpec(params);
	const target = parseRegistryNpmSpec(params.spec);
	const selector = target?.selector?.toLowerCase();
	if (selectedSpec || params.updateChannel !== "beta" || !target || target.selectorKind !== "none" && !(target.selectorKind === "tag" && (selector === "latest" || selector === "beta"))) return {
		installSpec: selectedSpec ?? params.spec,
		recordSpec: params.spec
	};
	const { resolveNpmSpecMetadata } = await import("./install-source-utils-CqrhXih0.mjs");
	const resolveTag = async (tag) => {
		const result = await resolveNpmSpecMetadata({
			spec: `${target.name}@${tag}`,
			timeoutMs: params.timeoutMs
		});
		if (!result.ok) {
			if (result.category === "metadata-env") throw new NpmChannelResolutionError(`Could not resolve ${target.name}@${tag}: ${result.error}`);
			return {
				version: null,
				metadata: void 0
			};
		}
		if (result.metadata.name !== target.name || !isExactSemverVersion(result.metadata.version ?? "")) throw new NpmChannelResolutionError(`Invalid npm channel metadata for ${target.name}@${tag}.`);
		return {
			version: result.metadata.version ?? null,
			metadata: result.metadata,
			tag
		};
	};
	const [beta, latest] = await Promise.all([resolveTag("beta"), resolveTag("latest")]);
	const selected = selectNpmChannelVersion(beta, latest);
	if (!selected.version || !selected.metadata) return {
		installSpec: `${target.name}@latest`,
		recordSpec: params.spec
	};
	return {
		installSpec: `${target.name}@${selected.version}`,
		recordSpec: params.spec,
		npmResolution: selected.metadata,
		channelTag: selected.tag,
		...selected === latest && beta.version ? { channelReason: "tag-behind-latest" } : {}
	};
}
function resolveClawHubInstallSpecsForUpdateChannel(params) {
	const parsed = parseClawHubPluginSpec(params.spec);
	if (parsed && params.officialPackageName === parsed.name && (params.updateChannel === "extended-stable" || params.updateChannel === "stable" && params.versionBoundToCore)) {
		const npmSpec = resolveCoreBoundNpmSpec({
			...params,
			spec: `${parsed.name}${parsed.version ? `@${parsed.version}` : ""}`
		});
		return {
			installSpec: npmSpec ? `clawhub:${npmSpec}` : params.spec,
			recordSpec: params.spec
		};
	}
	if (params.updateChannel !== "beta" || !parsed || parsed.version && parsed.version.toLowerCase() !== "latest") return {
		installSpec: params.spec,
		recordSpec: params.spec
	};
	const betaSpec = `clawhub:${parsed.name}@beta`;
	return {
		installSpec: betaSpec,
		recordSpec: params.spec,
		fallbackSpec: params.spec,
		fallbackLabel: betaSpec
	};
}
/**
* Installs the channel-resolved spec, widening to the operator's own selector
* when that release has no published artifact. The degrade is announced rather
* than silent, because it changes which build the operator ends up running.
*/
async function installWithChannelFallback(params) {
	const result = await params.install(params.installSpec);
	const { fallbackSpec } = params;
	if (!fallbackSpec || fallbackSpec === params.installSpec || !params.isRetryable(result)) return result;
	await params.onFallback(`No ${params.installSpec} release is published; installing ${fallbackSpec} instead.`);
	return await params.install(fallbackSpec);
}
//#endregion
//#region src/plugins/official-external-plugin-catalog.ts
/** Reads official external plugin/channel/provider catalogs into manifest-like metadata. */
function getFeedEntryInstallCandidates(entry) {
	if (normalizeOptionalString(entry.state) !== "available") return [];
	if (normalizeOptionalString(entry.publisher?.trust) !== "official") return [];
	return getFeedEntryInstallCandidateRecords(entry);
}
const BUNDLED_CATALOG_SOURCE_REFS = new Set(Object.keys(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.sources ?? {}));
function* bundledOfficialExternalPluginCatalogEntries() {
	const seen = /* @__PURE__ */ new Set();
	for (const entry of BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES) {
		const candidates = (isRecord(entry.install) ? entry.install : void 0)?.candidates;
		if (Array.isArray(candidates) && candidates.some((candidate) => {
			if (!isRecord(candidate)) return false;
			return !hasKnownCatalogSourceRef(candidate, BUNDLED_CATALOG_SOURCE_REFS);
		})) continue;
		const key = resolveOfficialExternalPluginCatalogEntryKey(entry);
		if (key && !seen.has(key)) {
			seen.add(key);
			yield entry;
		}
	}
}
function findBundledOfficialExternalPluginCatalogEntry(matches) {
	for (const entry of bundledOfficialExternalPluginCatalogEntries()) if (matches(entry)) return entry;
}
function formatFeedInstallCandidateSpec(candidate) {
	const packageName = normalizeOptionalString(candidate.package);
	if (!packageName) return;
	const version = normalizeOptionalString(candidate.version);
	if (!version || packageName.endsWith(`@${version}`)) return packageName;
	return `${packageName}@${version}`;
}
function getFeedEntryCandidateSourceType(candidate, config) {
	const sourceRef = normalizeOptionalString(candidate.sourceRef);
	if (!sourceRef) return;
	return resolveOfficialExternalPluginCatalogProfileConfig(config).sources[sourceRef]?.type;
}
function resolveFeedEntryInstallSources(params) {
	const candidates = getFeedEntryInstallCandidates(params.entry);
	return ["npm", "clawhub"].flatMap((source) => {
		const candidate = candidates.find((entry) => getFeedEntryCandidateSourceType(entry, params.catalogConfig) === source && Boolean(normalizeOptionalString(entry.package)));
		const spec = candidate && formatFeedInstallCandidateSpec(candidate);
		if (!candidate || !spec) return [];
		const expectedIntegrity = source === "npm" ? normalizeNpmExpectedIntegrity(candidate.integrity) : normalizeClawHubSha256ExpectedIntegrity(candidate.integrity);
		return [{
			source,
			spec: source === "clawhub" ? `clawhub:${spec}` : spec,
			...expectedIntegrity ? { expectedIntegrity } : {}
		}];
	});
}
function resolveFeedEntryInstallCandidate(params) {
	const source = resolveFeedEntryInstallSources(params)[0];
	return source ? {
		...source.source === "npm" ? { npmSpec: source.spec } : { clawhubSpec: source.spec },
		defaultChoice: source.source,
		...source.expectedIntegrity ? { expectedIntegrity: source.expectedIntegrity } : {}
	} : null;
}
/** Source-specific catalog pins stay attached to the artifact they authenticate. */
function resolveOfficialExternalPluginInstallSources(entry, params) {
	const install = params?.resolvedInstall === void 0 ? resolveOfficialExternalPluginInstall(entry, params) : params.resolvedInstall;
	if (!install) return [];
	const candidates = resolveFeedEntryInstallSources({
		entry,
		catalogConfig: params?.catalogConfig
	});
	return candidates.length > 0 ? candidates : resolvePluginInstallSources(install);
}
function normalizeClawHubSha256ExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	return integrity ? normalizeClawHubSha256Integrity(integrity) ?? void 0 : void 0;
}
function normalizeNpmExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	if (!integrity || !/^[a-z0-9]+-[A-Za-z0-9+/=]+$/i.test(integrity)) return;
	return integrity;
}
/** Returns manifest metadata from an official external catalog entry when present. */
/** Returns legacy plugin ids used only for trusted update migrations. */
function resolveOfficialExternalPluginLegacyIds(entry) {
	return uniqueStrings((getOfficialExternalPluginCatalogManifest(entry)?.legacyPluginIds ?? []).map((pluginId) => normalizeOptionalString(pluginId)).filter((pluginId) => Boolean(pluginId)));
}
/** Returns former npm package names accepted only for trusted update migrations. */
function resolveOfficialExternalPluginLegacyNpmPackageNames(entry) {
	return uniqueStrings((getOfficialExternalPluginCatalogManifest(entry)?.legacyNpmPackageNames ?? []).map((packageName) => normalizeOptionalString(packageName)).filter((packageName) => Boolean(packageName)));
}
/** Returns the host-owned setup migration selected for an external channel cutover. */
function resolveOfficialExternalChannelCompatibilityMigration(channelId) {
	const entry = getOfficialExternalPluginCatalogEntry(channelId);
	return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(entry ?? {})?.channelHostConfig?.compatibilityMigration);
}
function resolveOfficialExternalPluginLookupIds(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const lookupIds = [normalizeOptionalString(manifest?.plugin?.id), normalizeOptionalString(manifest?.channel?.id)];
	for (const provider of manifest?.providers ?? []) {
		lookupIds.push(normalizeOptionalString(provider.id));
		for (const alias of provider.aliases ?? []) lookupIds.push(normalizeOptionalString(alias));
	}
	return uniqueStrings(lookupIds.filter((value) => Boolean(value)));
}
function resolveOfficialExternalPluginLabel(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.label) ?? normalizeOptionalString(manifest?.channel?.label) ?? normalizeOptionalString(manifest?.providers?.[0]?.name) ?? normalizeOptionalString(entry.title) ?? normalizeOptionalString(entry.name) ?? resolveOfficialExternalPluginId(entry) ?? "plugin";
}
function resolveOfficialExternalPluginInstall(entry, params) {
	const state = normalizeOptionalString(entry.state);
	const publisherTrust = normalizeOptionalString(entry.publisher?.trust);
	if ((state || publisherTrust) && (state !== "available" || publisherTrust !== "official")) return null;
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	const clawhubSpec = normalizeOptionalString(install?.clawhubSpec);
	const manifestNpmSpec = normalizeOptionalString(install?.npmSpec);
	const localPath = normalizeOptionalString(install?.localPath);
	const candidateInstall = resolveFeedEntryInstallCandidate({
		entry,
		catalogConfig: params?.catalogConfig
	});
	if (candidateInstall) return {
		...candidateInstall,
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	const hasFeedInstallCandidates = getFeedEntryInstallCandidateRecords(entry).length > 0;
	const npmSpec = manifestNpmSpec ?? (hasFeedInstallCandidates || clawhubSpec ? void 0 : normalizeOptionalString(entry.name));
	const defaultChoice = normalizePluginInstallDefaultChoice(install?.defaultChoice) ?? (npmSpec ? "npm" : clawhubSpec ? "clawhub" : localPath ? "local" : void 0);
	if (!clawhubSpec && !npmSpec && !localPath) return null;
	return {
		...clawhubSpec ? { clawhubSpec } : {},
		...npmSpec ? { npmSpec } : {},
		...localPath ? { localPath } : {},
		...defaultChoice ? { defaultChoice } : {},
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
}
async function loadConfiguredHostedOfficialExternalPluginCatalogEntries(params) {
	const { loadHostedOfficialExternalPluginCatalogEntries } = await import("./official-external-plugin-catalog-hosted-DjZLVJwp.mjs");
	return await loadHostedOfficialExternalPluginCatalogEntries(params);
}
function listOfficialExternalPluginCatalogEntries() {
	return [...bundledOfficialExternalPluginCatalogEntries()];
}
/** Returns whether an id is the canonical id of an official external plugin. */
function isOfficialExternalPluginId(pluginId) {
	const normalized = normalizeOptionalString(pluginId)?.toLowerCase();
	if (!normalized) return false;
	return findBundledOfficialExternalPluginCatalogEntry((entry) => resolveOfficialExternalPluginId(entry)?.toLowerCase() === normalized) !== void 0;
}
/** Resolves official external plugin owners for configured capability provider ids. */
function resolveOfficialExternalProviderContractPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of bundledOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providerIds = getOfficialExternalPluginCatalogManifest(entry)?.contracts?.[params.contract];
		if (pluginId && providerIds?.some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official web provider owners from matching documented environment credentials. */
function resolveOfficialExternalWebProviderContractPluginIdsForEnv(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of bundledOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const contractProviderIds = new Set((manifest?.contracts?.[params.contract] ?? []).map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
		if (pluginId && contractProviderIds.size > 0 && manifest?.webSearchProviders?.some((provider) => {
			const providerId = normalizeOptionalString(provider.id)?.toLowerCase();
			return providerId !== void 0 && contractProviderIds.has(providerId) && provider.envVars?.some((envVar) => Boolean(params.env[envVar]?.trim()));
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external plugin owners for configured model provider ids. */
function resolveOfficialExternalProviderPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => [provider.id, ...provider.aliases ?? []].some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		}))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external provider owners with configured environment credentials. */
function resolveOfficialExternalProviderPluginIdsForEnv(env) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => provider.envVars?.some((envVar) => Boolean(env[envVar]?.trim())))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
function listOfficialExternalChannelCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => Boolean(getOfficialExternalPluginCatalogManifest(entry)?.channel));
}
function listOfficialExternalChannelEnvVars() {
	return listOfficialExternalChannelCatalogEntries().flatMap((entry) => {
		const channel = getOfficialExternalPluginCatalogManifest(entry)?.channel;
		const channelId = normalizeOptionalString(channel?.id)?.toLowerCase();
		const envVars = uniqueStrings([
			...channel?.envVars ?? [],
			...channel?.configuredState?.env?.allOf ?? [],
			...channel?.configuredState?.env?.anyOf ?? []
		].map((envVar) => normalizeOptionalString(envVar)).filter((envVar) => Boolean(envVar)));
		return channelId && envVars.length > 0 ? [{
			channelId,
			envVars
		}] : [];
	});
}
const CHANNEL_SECRET_FIELD_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;
const CHANNEL_SECRET_ENV_PATTERN = /^[A-Z][A-Z0-9_]*$/;
/** Returns a validated host fallback secret contract for one external channel. */
function getOfficialExternalChannelSecretContract(channelId) {
	const normalizedChannelId = normalizeOptionalString(channelId)?.toLowerCase();
	if (!normalizedChannelId) return;
	const entry = listOfficialExternalChannelCatalogEntries().find((candidate) => {
		return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(candidate)?.channel?.id)?.toLowerCase() === normalizedChannelId;
	});
	const fields = getOfficialExternalPluginCatalogManifest(entry ?? {})?.channelSecrets?.fields;
	if (!fields) return;
	const normalizedFields = fields.flatMap((field) => {
		const fieldName = normalizeOptionalString(field.field);
		const activationField = normalizeOptionalString(field.activationField);
		const activationEnv = normalizeOptionalString(field.activationEnv);
		if (!fieldName || !CHANNEL_SECRET_FIELD_PATTERN.test(fieldName) || activationField !== void 0 && !CHANNEL_SECRET_FIELD_PATTERN.test(activationField) || activationEnv !== void 0 && !CHANNEL_SECRET_ENV_PATTERN.test(activationEnv)) return [];
		return [{
			field: fieldName,
			...activationField ? { activationField } : {},
			...activationEnv ? { activationEnv } : {}
		}];
	});
	return normalizedFields.length > 0 ? {
		channelId: normalizedChannelId,
		fields: normalizedFields
	} : void 0;
}
/** Returns trusted host validation clauses for one official external channel. */
function getOfficialExternalChannelHostSchemaAllOf(channelId) {
	const normalizedChannelId = normalizeOptionalString(channelId)?.toLowerCase();
	if (!normalizedChannelId) return [];
	const entry = listOfficialExternalChannelCatalogEntries().find((candidate) => {
		return normalizeOptionalString(getOfficialExternalPluginCatalogManifest(candidate)?.channel?.id)?.toLowerCase() === normalizedChannelId;
	});
	const clauses = getOfficialExternalPluginCatalogManifest(entry ?? {})?.channelHostConfig?.schemaAllOf;
	return Array.isArray(clauses) ? clauses.filter(isRecord) : [];
}
function listOfficialExternalProviderCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => (getOfficialExternalPluginCatalogManifest(entry)?.providers?.length ?? 0) > 0);
}
function getOfficialExternalPluginCatalogEntry(pluginId) {
	const normalized = pluginId.trim();
	if (!normalized) return;
	return findBundledOfficialExternalPluginCatalogEntry((entry) => resolveOfficialExternalPluginLookupIds(entry).includes(normalized));
}
function getOfficialExternalPluginCatalogEntryForPackage(packageName) {
	const normalized = packageName?.trim();
	if (!normalized) return;
	return findBundledOfficialExternalPluginCatalogEntry((entry) => normalizeOptionalString(entry.name) === normalized);
}
/** Source discovery alone does not make an external package part of the core distribution. */
function isExternallyDistributedPlugin(plugin) {
	const entry = getOfficialExternalPluginCatalogEntryForPackage(plugin.packageName);
	return plugin.packageBuild?.bundledDist === false || entry !== void 0 && resolveOfficialExternalPluginId(entry) === plugin.pluginId;
}
//#endregion
export { resolvePluginInstallSources as A, NpmChannelResolutionError as C, resolveClawHubInstallSpecsForUpdateChannel as D, isUnavailablePluginSource as E, normalizeClawHubSha256Integrity as M, normalizePluginInstallDefaultChoice as N, resolveDefaultNpmSpec as O, resolveOfficialExternalWebProviderContractPluginIdsForEnv as S, installWithSourceFallback as T, resolveOfficialExternalPluginLegacyNpmPackageNames as _, isExternallyDistributedPlugin as a, resolveOfficialExternalProviderPluginIds as b, listOfficialExternalChannelEnvVars as c, loadConfiguredHostedOfficialExternalPluginCatalogEntries as d, resolveOfficialExternalChannelCompatibilityMigration as f, resolveOfficialExternalPluginLegacyIds as g, resolveOfficialExternalPluginLabel as h, getOfficialExternalPluginCatalogEntryForPackage as i, normalizeClawHubSha256Hex as j, resolveNpmInstallSpecsForUpdateChannel as k, listOfficialExternalPluginCatalogEntries as l, resolveOfficialExternalPluginInstallSources as m, getOfficialExternalChannelSecretContract as n, isOfficialExternalPluginId as o, resolveOfficialExternalPluginInstall as p, getOfficialExternalPluginCatalogEntry as r, listOfficialExternalChannelCatalogEntries as s, getOfficialExternalChannelHostSchemaAllOf as t, listOfficialExternalProviderCatalogEntries as u, resolveOfficialExternalPluginLookupIds as v, installWithChannelFallback as w, resolveOfficialExternalProviderPluginIdsForEnv as x, resolveOfficialExternalProviderContractPluginIds as y };
