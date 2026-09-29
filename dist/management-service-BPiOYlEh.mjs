import { D as withPluginCache, a as createPluginCache, f as getProcessPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord, o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { b as resolveIsConfigReadOnly } from "./paths-DehQwyE0.mjs";
import { i as parseConcreteConfigPathTokens } from "./dot-path-BSC76DAI.mjs";
import { f as readPluginCacheFile } from "./package-manifest-C8sTeZKW.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { r as isInstalledPluginEnabled, t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { f as validatePluginCategories } from "./manifest-DHkEL08H.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { o as loadPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-KhFe5dXK.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DPc05JSs.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-DJ92D1Xo.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CpKxe5XX.mjs";
import { _ as resolveClawHubBaseUrl, a as isClawHubTelemetryDisabled, d as readClawHubStringField, f as readRequiredClawHubBooleanField, h as readRequiredClawHubStringField, i as fetchClawHubJson, p as readRequiredClawHubNumberField, u as readClawHubStringArrayField, v as resolveClawHubImageUrl } from "./clawhub-client-D8cfvjQG.mjs";
import { a as parseClawHubPackageSecurityResponse } from "./clawhub-packages-DqSmfyli.mjs";
import { n as inspectBundleMcpRuntimeSupport, r as inspectNativePluginMcpRuntimeSupport } from "./bundle-mcp-BCbIrwKD.mjs";
import { n as inspectBundlePluginArtifact } from "./install-artifact-inspection-X2JhMF_r.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { c as resolvePluginInstallRecordIntegrity, l as resolvePluginInstallRecordTrust, n as buildPluginCapabilitySummary, r as computeDeclaredSurfaceHash, u as resolvePluginPackageDeclaredSurface } from "./capability-summary-CDNMLrkL.mjs";
import { i as resolvePendingPluginCapabilityReview } from "./capability-consent-Fw4XtIv4.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-BBXzSv64.mjs";
import { t as inspectBundleLspRuntimeSupport } from "./bundle-lsp-CaUzXSwj.mjs";
import { n as resolvePluginSkillDetails } from "./plugin-skills-CnAdRDnb.mjs";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-CufiiFq0.mjs";
import { t as loadHookEntriesFromDir } from "./discovery-C4C8d96P.mjs";
import { n as projectPluginInstallHealth } from "./status-snapshot-DXI2PCxQ.mjs";
import { _ as resolvePluginIconSource, a as getManagedPluginCache, c as normalizeFeaturedAt, d as prepareCatalogEntry, f as resolveInstalledHostedOfficialEntry, g as resolvePluginActivityIconSource, h as resolveOfficialEntryById, i as firstPluginError, l as normalizeKinds, m as resolveInstalledPluginPresentation, n as compareCatalogEntries, o as loadOfficialCatalog, p as resolveInstalledPluginClawHubIconSource, r as deriveLegacyPluginCategory, s as normalizeCatalogMetadata, u as prepareCatalogEntries, v as resolvePluginIconSources, y as withManagedPluginCache } from "./management-catalog-HkZv11Ak.mjs";
import path from "node:path";
//#region src/infra/clawhub-plugin-manifest.ts
function parseClawHubPluginCapabilities(summary) {
	const result = {};
	for (const field of ["providers", "channels"]) {
		const names = readClawHubStringArrayField(summary, field, "plugin manifest summary");
		if (names) result[field] = names;
	}
	if (summary.contracts != null) {
		if (!isRecord(summary.contracts)) throw new Error("Malformed ClawHub plugin manifest summary: expected contracts to be an object.");
		const contracts = summary.contracts;
		result.contracts = Object.fromEntries(Object.keys(contracts).toSorted().map((family) => {
			const names = readClawHubStringArrayField(contracts, family, "plugin contracts");
			if (!names) throw new Error(`Malformed ClawHub plugin contracts: expected ${family} to be a string array.`);
			return [family, names];
		}));
	}
	return result;
}
function parseClawHubPluginCompatibility(value, context) {
	if (!value) return;
	const compatibility = {
		pluginApiRange: readClawHubStringField(value, "pluginApiRange", context),
		builtWithOpenClawVersion: readClawHubStringField(value, "builtWithOpenClawVersion", context),
		pluginSdkVersion: readClawHubStringField(value, "pluginSdkVersion", context),
		minGatewayVersion: readClawHubStringField(value, "minGatewayVersion", context)
	};
	const entries = Object.entries(compatibility).filter((entry) => Boolean(entry[1]));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
//#endregion
//#region src/infra/clawhub-plugin-catalog.ts
const BARE_ICON_KEY = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;
const PLUGIN_CATEGORY_ICON_KEYS = /* @__PURE__ */ new Set([
	"activity",
	"book-open",
	"brain",
	"bot",
	"database",
	"git-branch",
	"globe",
	"message-circle",
	"message-square",
	"mic",
	"package",
	"palette",
	"shield",
	"wrench",
	"plug",
	"code-xml",
	"server",
	"files",
	"inbox",
	"list-todo",
	"calendar-days",
	"wallet-cards",
	"megaphone",
	"chart-no-axes-combined",
	"workflow",
	"search"
]);
function readOptionalNonNegativeNumber(value, field, context) {
	const candidate = value[field];
	if (candidate === void 0 || candidate === null) return;
	if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate < 0) throw new Error(`Malformed ClawHub ${context}: expected ${field} to be non-negative.`);
	return candidate;
}
function readOptionalBoolean(value, field, context) {
	return value[field] == null ? void 0 : readRequiredClawHubBooleanField(value, field, context);
}
function readOptionalRank(value, field, context) {
	const candidate = readOptionalNonNegativeNumber(value, field, context);
	if (candidate !== void 0 && !Number.isInteger(candidate)) throw new Error(`Malformed ClawHub ${context}: expected ${field} to be an integer.`);
	return candidate;
}
function parseCatalogPackage(value, context, baseUrl) {
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected package to be an object.`);
	const family = readRequiredClawHubStringField(value, "family", context);
	if (family !== "code-plugin" && family !== "bundle-plugin") throw new Error(`Malformed ClawHub ${context}: unsupported package family ${family}.`);
	const stats = value.stats;
	if (stats !== void 0 && stats !== null && !isRecord(stats)) throw new Error(`Malformed ClawHub ${context}: expected stats to be an object.`);
	const summary = readClawHubStringField(value, "summary", context);
	const ownerHandle = readClawHubStringField(value, "ownerHandle", context);
	const latestVersion = readClawHubStringField(value, "latestVersion", context);
	const runtimeId = readClawHubStringField(value, "runtimeId", context);
	const icon = readClawHubStringField(value, "icon", context) ?? readClawHubStringField(value, "ownerImage", context);
	const iconUrl = resolveClawHubImageUrl(icon, baseUrl) ?? icon;
	const verificationTier = readClawHubStringField(value, "verificationTier", context);
	const featured = readOptionalBoolean(value, "featured", context);
	const trending = readOptionalBoolean(value, "trending", context);
	const featuredRank = readOptionalRank(value, "featuredRank", context);
	const trendingRank = readOptionalRank(value, "trendingRank", context);
	const downloads = stats ? readOptionalNonNegativeNumber(stats, "downloads", `${context} stats`) : void 0;
	const installs = stats ? readOptionalNonNegativeNumber(stats, "installs", `${context} stats`) : void 0;
	return {
		packageName: readRequiredClawHubStringField(value, "name", context),
		displayName: readRequiredClawHubStringField(value, "displayName", context),
		family,
		isOfficial: readRequiredClawHubBooleanField(value, "isOfficial", context),
		categories: readClawHubStringArrayField(value, "categories", context) ?? [],
		...summary ? { summary } : {},
		...ownerHandle ? { ownerHandle } : {},
		...latestVersion ? { latestVersion } : {},
		...runtimeId ? { runtimeId } : {},
		...iconUrl ? { iconUrl } : {},
		...verificationTier ? { verificationTier } : {},
		...featured !== void 0 ? { featured } : {},
		...trending !== void 0 ? { trending } : {},
		...featuredRank !== void 0 ? { featuredRank } : {},
		...trendingRank !== void 0 ? { trendingRank } : {},
		...downloads !== void 0 ? { downloads } : {},
		...installs !== void 0 ? { installs } : {}
	};
}
function parsePluginCategories(value) {
	if (!isRecord(value) || !Array.isArray(value.categories)) throw new Error("Malformed ClawHub plugin categories response: expected categories to be an array.");
	const seenSlugs = /* @__PURE__ */ new Set();
	const seenOrders = /* @__PURE__ */ new Set();
	return value.categories.map((entry, index) => {
		if (!isRecord(entry)) throw new Error(`Malformed ClawHub plugin category ${index}: expected an object.`);
		const slug = readRequiredClawHubStringField(entry, "slug", `plugin category ${index}`);
		const icon = readRequiredClawHubStringField(entry, "icon", `plugin category ${index}`);
		const order = readRequiredClawHubNumberField(entry, "order", `plugin category ${index}`);
		if (!BARE_ICON_KEY.test(icon)) throw new Error(`Malformed ClawHub plugin category ${slug}: invalid icon key.`);
		if (!Number.isInteger(order) || order < 0 || seenSlugs.has(slug) || seenOrders.has(order)) throw new Error(`Malformed ClawHub plugin category ${slug}: duplicate or invalid ordering.`);
		seenSlugs.add(slug);
		seenOrders.add(order);
		return {
			slug,
			label: readRequiredClawHubStringField(entry, "label", `plugin category ${slug}`),
			description: readRequiredClawHubStringField(entry, "description", `plugin category ${slug}`),
			icon: PLUGIN_CATEGORY_ICON_KEYS.has(icon) ? icon : "package",
			order
		};
	}).toSorted((left, right) => left.order - right.order);
}
function parseCatalogList(value, baseUrl) {
	if (!isRecord(value) || !Array.isArray(value.items)) throw new Error("Malformed ClawHub plugin catalog response: expected items to be an array.");
	const nextCursor = readClawHubStringField(value, "nextCursor", "plugin catalog response");
	return {
		items: value.items.map((item, index) => parseCatalogPackage(item, `plugin catalog item ${index}`, baseUrl)),
		...nextCursor ? { nextCursor } : {}
	};
}
function parseCatalogSearch(value, baseUrl) {
	if (!isRecord(value) || !Array.isArray(value.results)) throw new Error("Malformed ClawHub plugin search response: expected results to be an array.");
	return { items: value.results.map((result, index) => {
		if (!isRecord(result)) throw new Error(`Malformed ClawHub plugin search result ${index}: expected an object.`);
		return parseCatalogPackage(result.package, `plugin search result ${index}`, baseUrl);
	}) };
}
function readOptionalRecord(source, field, context) {
	const value = source[field];
	if (value === void 0 || value === null) return;
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected ${field} to be an object.`);
	return value;
}
function parseManifest(value) {
	if (!value) return {
		configFields: [],
		mcpServers: [],
		skills: []
	};
	const { configFields, mcpServers, bundledSkills } = value;
	if (!Array.isArray(configFields) || !Array.isArray(mcpServers) || !Array.isArray(bundledSkills)) throw new Error("Malformed ClawHub plugin manifest summary: expected capability arrays.");
	const compatibility = parseClawHubPluginCompatibility(readOptionalRecord(value, "compatibility", "plugin manifest summary"), "plugin manifest compatibility");
	return {
		...compatibility ? { compatibility } : {},
		...parseClawHubPluginCapabilities(value),
		configFields: configFields.map((entry, index) => {
			if (!isRecord(entry)) throw new Error(`Malformed ClawHub plugin config field ${index}: expected an object.`);
			const description = readClawHubStringField(entry, "description", `plugin config field ${index}`);
			const field = {
				name: readRequiredClawHubStringField(entry, "name", `plugin config field ${index}`),
				required: readRequiredClawHubBooleanField(entry, "required", `plugin config field ${index}`),
				sensitive: readRequiredClawHubBooleanField(entry, "sensitive", `plugin config field ${index}`)
			};
			if (description) field.description = description;
			return field;
		}),
		mcpServers: mcpServers.map((entry, index) => {
			if (!isRecord(entry)) throw new Error(`Malformed ClawHub plugin MCP server ${index}: expected an object.`);
			return readRequiredClawHubStringField(entry, "name", `plugin MCP server ${index}`);
		}),
		skills: bundledSkills.map((entry, index) => {
			if (!isRecord(entry)) throw new Error(`Malformed ClawHub bundled skill ${index}: expected an object.`);
			const description = readClawHubStringField(entry, "description", `bundled skill ${index}`);
			const skill = { name: readRequiredClawHubStringField(entry, "name", `bundled skill ${index}`) };
			if (description) skill.description = description;
			return skill;
		})
	};
}
function parseVerification(value) {
	if (!value) return;
	const summary = readClawHubStringField(value, "summary", "plugin verification");
	const sourceRepo = readClawHubStringField(value, "sourceRepo", "plugin verification");
	const sourceCommit = readClawHubStringField(value, "sourceCommit", "plugin verification");
	const sourcePath = readClawHubStringField(value, "sourcePath", "plugin verification");
	const scanStatus = readClawHubStringField(value, "scanStatus", "plugin verification");
	return {
		tier: readRequiredClawHubStringField(value, "tier", "plugin verification"),
		...summary ? { summary } : {},
		...sourceRepo ? { sourceRepo } : {},
		...sourceCommit ? { sourceCommit } : {},
		...sourcePath ? { sourcePath } : {},
		...scanStatus ? { scanStatus } : {}
	};
}
function projectSecurity(value) {
	const trust = value.trust;
	const moderationStatus = trust.moderationState && trust.moderationState !== "approved" ? trust.moderationState : void 0;
	return {
		status: trust.blockedFromDownload ? "blocked" : trust.pending ? "pending" : trust.stale ? "stale" : moderationStatus ?? trust.scanStatus ?? "unknown",
		...value.verdict ? { verdict: value.verdict } : {},
		auditUrl: value.securityAuditUrl,
		summary: value.overview
	};
}
function parseVersions(value) {
	if (!isRecord(value) || !Array.isArray(value.items)) throw new Error("Malformed ClawHub plugin versions response: expected items to be an array.");
	return value.items.map((entry, index) => {
		if (!isRecord(entry)) throw new Error(`Malformed ClawHub plugin version ${index}: expected an object.`);
		const changelog = readClawHubStringField(entry, "changelog", `plugin version ${index}`);
		return {
			version: readRequiredClawHubStringField(entry, "version", `plugin version ${index}`),
			createdAt: readRequiredClawHubNumberField(entry, "createdAt", `plugin version ${index}`),
			changelog: changelog ?? "",
			tags: readClawHubStringArrayField(entry, "distTags", `plugin version ${index}`) ?? []
		};
	});
}
async function fetchClawHubPluginCatalog(params) {
	const query = params.query?.trim();
	const shared = {
		baseUrl: params.baseUrl,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	};
	if (query) {
		const searchSource = isClawHubTelemetryDisabled() ? void 0 : params.searchSource;
		return parseCatalogSearch(await fetchClawHubJson({
			...shared,
			path: "/api/v1/plugins/search",
			retryTransientReads: searchSource === void 0,
			search: {
				q: query,
				searchSource,
				category: params.category,
				isOfficial: params.intent === "official" ? "true" : void 0,
				limit: params.limit ? String(params.limit) : void 0
			}
		}), params.baseUrl);
	}
	return parseCatalogList(await fetchClawHubJson({
		...shared,
		path: "/api/v1/plugins",
		search: {
			category: params.category,
			cursor: params.cursor,
			featured: params.intent === "featured" ? "true" : void 0,
			isOfficial: params.intent === "official" ? "true" : void 0,
			officialFirst: params.intent === "featured" || params.intent === "trending" ? void 0 : "true",
			sort: params.intent === "featured" ? void 0 : params.intent === "trending" ? "trending" : "downloads",
			limit: params.limit ? String(params.limit) : void 0
		}
	}), params.baseUrl);
}
async function fetchClawHubPluginOverview(options = {}) {
	const value = await fetchClawHubJson({
		...options,
		path: "/api/v1/plugins/overview"
	});
	if (!isRecord(value) || !Array.isArray(value.items)) throw new Error("Malformed ClawHub plugin overview response: expected items to be an array.");
	return {
		items: value.items.map((item, index) => parseCatalogPackage(item, `plugin overview item ${index}`, options.baseUrl)),
		categories: parsePluginCategories(value)
	};
}
async function fetchClawHubPluginCategories(options = {}) {
	return parsePluginCategories(await fetchClawHubJson({
		...options,
		path: "/api/v1/plugins/categories"
	}));
}
/** Read effective categories for exact installed ClawHub package versions in one request. */
async function fetchClawHubPluginVersionCategories(params) {
	if (params.packages.length === 0) return [];
	if (params.packages.length > 200) throw new Error("ClawHub plugin category batch cannot exceed 200 packages.");
	const value = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		method: "POST",
		path: "/api/v1/packages/categories:batch",
		json: { packages: params.packages }
	});
	if (!isRecord(value) || !Array.isArray(value.packages)) throw new Error("Malformed ClawHub plugin category batch response: expected packages to be an array.");
	return value.packages.map((entry, index) => {
		if (!isRecord(entry)) throw new Error(`Malformed ClawHub plugin category batch item ${index}: expected an object.`);
		const rawCategories = entry.categories;
		let categories;
		if (rawCategories === null) categories = null;
		else {
			const validation = validatePluginCategories(rawCategories);
			if (!validation.ok || !validation.categories) throw new Error(`Malformed ClawHub plugin category batch item ${index}: expected categories to be a string array or null.`);
			categories = validation.categories;
		}
		return {
			name: readRequiredClawHubStringField(entry, "name", `plugin category batch item ${index}`),
			version: readRequiredClawHubStringField(entry, "version", `plugin category batch item ${index}`),
			categories
		};
	});
}
async function fetchClawHubPluginDetail(params) {
	const value = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		path: `/api/v1/packages/${encodeURIComponent(params.packageName)}/detail`,
		search: { version: params.version }
	});
	if (!isRecord(value)) throw new Error("Malformed ClawHub plugin detail response: expected an object.");
	if (!isRecord(value.package)) throw new Error("Malformed ClawHub plugin detail response: expected package to be an object.");
	const catalog = parseCatalogPackage(value.package, "plugin detail", params.baseUrl);
	const topics = readClawHubStringArrayField(value.package, "topics", "plugin detail") ?? [];
	const createdAt = readOptionalNonNegativeNumber(value.package, "createdAt", "plugin detail");
	const updatedAt = readOptionalNonNegativeNumber(value.package, "updatedAt", "plugin detail");
	const packageCompatibility = parseClawHubPluginCompatibility(readOptionalRecord(value.package, "compatibility", "plugin detail"), "plugin compatibility");
	const ownerRecord = readOptionalRecord(value, "owner", "plugin detail response");
	const ownerHandle = ownerRecord ? readClawHubStringField(ownerRecord, "handle", "plugin owner") : void 0;
	const ownerDisplayName = ownerRecord ? readClawHubStringField(ownerRecord, "displayName", "plugin owner") : void 0;
	const ownerImageUrl = ownerRecord ? readClawHubStringField(ownerRecord, "image", "plugin owner") : void 0;
	const versionRecord = readOptionalRecord(value, "version", "plugin detail response");
	const readme = readClawHubStringField(value, "readme", "plugin detail response");
	if (readme && Buffer.byteLength(readme, "utf8") > 524288) throw new Error("ClawHub plugin README exceeded 524288 bytes.");
	let security;
	if (value.security != null) try {
		security = projectSecurity(parseClawHubPackageSecurityResponse(value.security));
	} catch {}
	const manifest = parseManifest(versionRecord ? readOptionalRecord(versionRecord, "pluginManifestSummary", "plugin version") : readOptionalRecord(value.package, "pluginManifestSummary", "plugin detail"));
	const verification = parseVerification(versionRecord ? readOptionalRecord(versionRecord, "verification", "plugin version") : readOptionalRecord(value.package, "verification", "plugin detail"));
	const owner = {
		...ownerHandle ? { handle: ownerHandle } : {},
		...ownerDisplayName ? { displayName: ownerDisplayName } : {},
		...ownerImageUrl ? { imageUrl: ownerImageUrl } : {},
		...typeof ownerRecord?.official === "boolean" ? { official: ownerRecord.official } : {}
	};
	return {
		...catalog,
		...ownerHandle && !catalog.ownerHandle ? { ownerHandle } : {},
		...Object.keys(owner).length > 0 ? { owner } : {},
		topics,
		...createdAt !== void 0 ? { createdAt } : {},
		...updatedAt !== void 0 ? { updatedAt } : {},
		...readme ? { readme } : {},
		...verification?.sourceRepo ? { repositoryUrl: verification.sourceRepo } : {},
		...packageCompatibility ? { compatibility: packageCompatibility } : {},
		...manifest,
		versions: parseVersions(value.versions),
		...verification ? { verification } : {},
		...security ? { security } : {}
	};
}
//#endregion
//#region src/plugins/credential-descriptors.ts
function projectPluginCredentialDescriptors(pluginId, providers) {
	const fields = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		if (!provider.credentialPath || !provider.credentialLabel) continue;
		let path;
		try {
			path = parseConcreteConfigPathTokens(provider.credentialPath);
		} catch {
			continue;
		}
		if (path.length < 5 || path.length > 32 || path[0] !== "plugins" || path[1] !== "entries" || path[2] !== pluginId || path[3] !== "config") continue;
		const key = JSON.stringify(path);
		if (fields.has(key)) continue;
		const signupUrl = provider.signupUrl && URL.canParse(provider.signupUrl) && ["https:", "http:"].includes(new URL(provider.signupUrl).protocol) ? provider.signupUrl : void 0;
		fields.set(key, {
			path,
			label: provider.credentialLabel,
			envVars: [...provider.envVars],
			...provider.placeholder ? { placeholder: provider.placeholder } : {},
			...signupUrl ? { signupUrl } : {},
			...provider.requiresCredential !== void 0 ? { requiresCredential: provider.requiresCredential } : {}
		});
	}
	return [...fields.values()];
}
/** Metadata inspection must never enable or activate a plugin to discover a key field. */
function resolvePluginCredentialDescriptors(manifest) {
	const registry = getPluginRegistryForContext();
	const providers = [...registry?.webSearchProviders ?? [], ...registry?.webFetchProviders ?? []].filter((entry) => entry.pluginId === manifest.id).map((entry) => entry.provider);
	if (manifest.origin === "bundled") {
		const scope = { onlyPluginIds: [manifest.id] };
		if (manifest.contracts?.webSearchProviders?.length) providers.push(...resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(scope) ?? []);
		if (manifest.contracts?.webFetchProviders?.length) providers.push(...resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(scope) ?? []);
	} else if (manifest.trustedOfficialInstall) providers.push(...resolveWebSearchInstallCatalogEntries().filter((entry) => entry.pluginId === manifest.id).map((entry) => entry.provider));
	return projectPluginCredentialDescriptors(manifest.id, providers);
}
//#endregion
//#region src/plugins/installed-plugin-components.ts
function sorted(values) {
	return [...new Set(values)].toSorted();
}
function emptyInstalledPluginComponents() {
	return {
		mapped: [],
		skills: [],
		mcpServers: [],
		commands: [],
		hooks: [],
		lspServers: [],
		unavailable: {
			capabilities: [],
			mcpServers: [],
			lspServers: []
		}
	};
}
/** Projects only components that the installed OpenClaw runtime can actually use. */
function projectInstalledPluginComponents(params) {
	const { manifest, declared } = params;
	const skillDetails = manifest?.rootDir ? resolvePluginSkillDetails(manifest) : void 0;
	const skillNames = skillDetails?.map((skill) => skill.name) ?? sorted(declared.skills);
	if (manifest?.format !== "bundle" || !manifest.bundleFormat) {
		const mcp = manifest?.rootDir ? inspectNativePluginMcpRuntimeSupport({
			rootDir: manifest.rootDir,
			mcpServers: manifest.mcpServers ?? {}
		}) : void 0;
		const skills = skillNames;
		const mcpServers = sorted(mcp?.supportedServerNames ?? declared.mcpServers);
		const commands = sorted(declared.cliCommands);
		const hooks = sorted(declared.hooks);
		return {
			mapped: [
				...skills.length > 0 ? ["skills"] : [],
				...mcpServers.length > 0 ? ["mcpServers"] : [],
				...commands.length > 0 ? ["commands"] : [],
				...hooks.length > 0 ? ["hooks"] : []
			],
			skills,
			...skillDetails ? { skillDetails } : {},
			mcpServers,
			commands,
			hooks,
			lspServers: [],
			unavailable: {
				capabilities: [],
				mcpServers: sorted(mcp?.unsupportedServerNames ?? []),
				lspServers: []
			}
		};
	}
	const support = inspectBundlePluginArtifact({
		format: manifest.bundleFormat,
		capabilities: manifest.bundleCapabilities ?? []
	});
	const mapped = new Set(support.mapped);
	const hooks = mapped.has("hooks") && manifest.rootDir ? sorted((manifest.hooks ?? []).filter((dir) => loadHookEntriesFromDir({
		dir: path.resolve(manifest.rootDir, dir),
		rootDir: manifest.rootDir,
		pluginId: manifest.id,
		source: "openclaw-plugin"
	}).some(({ hook }) => Boolean(hook.handlerPath)))) : [];
	if (mapped.has("hooks") && hooks.length === 0) {
		mapped.delete("hooks");
		support.unavailable.push("hooks");
	}
	const mcp = manifest.rootDir ? inspectBundleMcpRuntimeSupport({
		pluginId: manifest.id,
		rootDir: manifest.rootDir,
		bundleFormat: manifest.bundleFormat
	}) : void 0;
	const lsp = manifest.rootDir ? inspectBundleLspRuntimeSupport({
		pluginId: manifest.id,
		rootDir: manifest.rootDir,
		bundleFormat: manifest.bundleFormat
	}) : void 0;
	return {
		mapped: sorted(mapped),
		skills: mapped.has("skills") ? skillNames : [],
		...mapped.has("skills") && skillDetails ? { skillDetails } : {},
		mcpServers: mapped.has("mcpServers") ? sorted(mcp?.supportedServerNames ?? []) : [],
		commands: [],
		hooks,
		lspServers: mapped.has("lspServers") ? sorted(lsp?.supportedServerNames ?? []) : [],
		unavailable: {
			capabilities: sorted(support.unavailable),
			mcpServers: sorted(mcp?.unsupportedServerNames ?? []),
			lspServers: sorted(lsp?.unsupportedServerNames ?? [])
		}
	};
}
//#endregion
//#region src/plugins/installed-plugin-overview.ts
/** Read presentation artifacts through the lifecycle-owned, bounded plugin root cache. */
function readInstalledPluginOverview(manifest) {
	if (!manifest) return;
	const read = (relativePath) => readPluginCacheFile({
		rootDir: manifest.rootDir,
		relativePath,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles(manifest),
		maxBytes: 524288
	});
	const readme = read("README.md");
	const packageFile = read("package.json");
	let pkg = {};
	if (packageFile.ok) try {
		pkg = asRecord(JSON.parse(packageFile.contents.toString("utf8")));
	} catch {}
	const repository = typeof pkg.repository === "string" ? pkg.repository : asRecord(pkg.repository).url;
	const repositoryUrl = normalizeOptionalString(repository);
	const documentationUrl = normalizeOptionalString(pkg.homepage);
	const publisherName = normalizeOptionalString(asRecord(pkg.author).name);
	return {
		...readme.ok ? { readme: readme.contents.toString("utf8") } : {},
		...repositoryUrl ? { repositoryUrl } : {},
		...documentationUrl ? { documentationUrl } : {},
		...publisherName ? { publisherName } : {}
	};
}
//#endregion
//#region src/plugins/plugin-config-enablement.ts
function resolvePluginConfigEnablement(params) {
	const manifest = params.manifest;
	if (!manifest?.configSchema) return { mode: "ready" };
	const entry = params.config.plugins?.entries?.[params.pluginId];
	const hasConfig = isRecord(entry) && Object.hasOwn(entry, "config");
	const result = validatePluginSchemaValue({
		origin: manifest.origin,
		schema: manifest.configSchema,
		cacheKey: manifest.schemaCacheKey ?? manifest.manifestPath,
		value: hasConfig ? entry.config : {},
		applyDefaults: true
	});
	if (result.ok) return { mode: "ready" };
	if (!hasConfig && !result.schemaError) return { mode: "missing" };
	return {
		mode: "invalid",
		error: result.errors[0]?.text ?? "invalid plugin config"
	};
}
//#endregion
//#region src/plugins/management-service.ts
function resolveManagedPluginState(params) {
	if (params.hasError) return "error";
	if (params.enabled) return "enabled";
	return params.setupMode === "missing" ? "needs-setup" : "disabled";
}
const CLAWHUB_CATEGORY_BATCH_LIMIT = 200;
function pluginVersionKey(name, version) {
	return JSON.stringify([name, version]);
}
function resolveManagedPluginDiagnostics(snapshot, config, env) {
	const isEnabled = createInstalledPluginEnabledPredicate(snapshot.index.plugins, config);
	const { diagnostics } = projectPluginInstallHealth({
		plugins: snapshot.index.plugins.map((record) => {
			const manifest = snapshot.byPluginId.get(record.pluginId);
			const enabled = isEnabled(record.pluginId);
			return {
				id: record.pluginId,
				source: manifest?.source ?? record.source ?? record.manifestPath,
				enabled,
				status: enabled ? "loaded" : "disabled"
			};
		}),
		diagnostics: [...snapshot.diagnostics]
	}, {
		metadata: snapshot,
		config,
		env
	});
	return diagnostics;
}
function resolveManagedPluginMetadataParams(config, env) {
	const workspace = resolvePluginControlPlaneWorkspace({
		config,
		env
	});
	return {
		config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	};
}
function resolveManagedPluginMetadata(config, env) {
	const boot = getProcessGatewayPluginMetadataSnapshot();
	const candidate = getProcessPluginCache().desiredMetadata;
	return candidate && candidate.boot === boot ? candidate.snapshot : resolvePluginMetadataSnapshot(resolveManagedPluginMetadataParams(config, env));
}
function loadFreshManagedPluginMetadata(config, env) {
	return getProcessGatewayPluginMetadataSnapshot() ? resolveConfigWidePluginMetadataSnapshot({
		config,
		env,
		allowCurrent: false
	}) : loadPluginMetadataSnapshot({
		...resolveManagedPluginMetadataParams(config, env),
		allowCurrent: false
	});
}
/** Publish desired install state for management without replacing the Gateway's boot facts. */
function refreshManagedPluginMetadata(params) {
	const env = params.env ?? process.env;
	const boot = getProcessGatewayPluginMetadataSnapshot();
	const cache = createPluginCache();
	const snapshot = withPluginCache(cache, () => loadFreshManagedPluginMetadata(params.config, env));
	if (boot) getProcessPluginCache().desiredMetadata = {
		boot,
		cache,
		snapshot
	};
	return snapshot;
}
/** Resolve ordered branding sources from package bytes and exact installed provenance. */
const resolveManagedPluginIconSources = withManagedPluginCache(async (params) => {
	const env = params.env ?? process.env;
	const metadata = resolveManagedPluginMetadata(params.config, env);
	return resolvePluginIconSources({
		metadata,
		pluginId: params.pluginId,
		env
	});
});
const resolveManagedPluginActivityIconSource = withManagedPluginCache(async (params) => {
	const metadata = resolveManagedPluginMetadata(params.config, params.env ?? process.env);
	return resolvePluginActivityIconSource({
		...params,
		metadata
	});
});
function normalizeManagedCatalogIconUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized || normalized.length > 2048) return;
	try {
		const url = new URL(normalized);
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && !url.hash ? url.href : void 0;
	} catch {
		return;
	}
}
/** Resolve only URLs currently owned by a manifest or bundled presentation catalog. */
function resolveManagedSetupCatalogIconUrl(params) {
	const requested = normalizeManagedCatalogIconUrl(params.iconUrl);
	if (!requested) return;
	const env = params.env ?? process.env;
	return [...resolveManifestProviderAuthChoices({
		config: params.config,
		env,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).map((choice) => choice.icon), ...listRecommendedToolInstalls().map((install) => install.icon)].some((iconUrl) => normalizeManagedCatalogIconUrl(iconUrl) === requested) ? requested : void 0;
}
/** Build cold installed state merged with the hosted official catalog and bundled curation. */
const listManagedPlugins = withManagedPluginCache(async (params) => {
	const sourceConfig = resolvePluginActivationSourceConfig({ config: params.config });
	const env = params.env ?? process.env;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env
	});
	const metadata = params.metadata ?? resolveManagedPluginMetadata(params.config, env);
	const officialCatalog = params.officialCatalog ?? await loadOfficialCatalog();
	const pluginDiagnostics = resolveManagedPluginDiagnostics(metadata, params.config, env);
	const officialEntries = prepareCatalogEntries(officialCatalog.entries);
	const bundledOfficialEntries = prepareCatalogEntries(listOfficialExternalPluginCatalogEntries());
	const installedIconsById = /* @__PURE__ */ new Map();
	const installedClawHubPackages = /* @__PURE__ */ new Set();
	const discoveryRegistry = resolveClawHubBaseUrl();
	const categoryTargetsByRegistry = /* @__PURE__ */ new Map();
	let categoryTargetCount = 0;
	const isEnabled = createInstalledPluginEnabledPredicate(metadata.index.plugins, params.config, env);
	const ownershipResolver = createInstalledPluginOwnershipResolver(metadata.index);
	const plugins = metadata.index.plugins.map((record) => {
		const enabled = isEnabled(record.pluginId);
		const manifest = metadata.byPluginId.get(record.pluginId);
		const localCatalog = normalizeCatalogMetadata(manifest?.catalog);
		const ownership = ownershipResolver.resolvePackage(record.pluginId);
		const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		const { entry: officialEntry, clawhubPackage } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries,
			bundledOfficialEntries
		});
		if (clawhubPackage) installedClawHubPackages.add(clawhubPackage);
		const officialCatalogMetadata = officialEntry ? normalizeCatalogMetadata(getOfficialExternalPluginCatalogManifest(officialEntry)?.catalog) : void 0;
		const catalog = clawhubPackage && officialCatalog.hostedFeaturedAuthoritative ? {
			...localCatalog,
			...officialCatalogMetadata,
			featured: officialEntry?.featured === true
		} : officialCatalogMetadata ? {
			...localCatalog,
			...officialCatalogMetadata
		} : localCatalog;
		const setup = resolvePluginConfigEnablement({
			config: sourceConfig,
			pluginId: record.pluginId,
			manifest
		});
		const configError = setup.mode === "invalid" ? setup.error : void 0;
		const error = firstPluginError(pluginDiagnostics, record.pluginId) ?? configError;
		const kind = normalizeKinds(manifest?.kind);
		const categories = manifest?.categories;
		const legacyCategory = deriveLegacyPluginCategory(manifest);
		const removable = record.origin !== "bundled" && Boolean(installOwner);
		const hostedListingAuthoritative = Boolean(clawhubPackage) && officialCatalog.hostedFeaturedAuthoritative === true;
		const featuredAt = hostedListingAuthoritative && catalog?.featured === true ? normalizeFeaturedAt(officialEntry?.featuredAt) : void 0;
		const presentation = resolveInstalledPluginPresentation({
			record,
			manifest,
			officialEntry,
			hostedListingAuthoritative
		});
		const plugin = {
			id: record.pluginId,
			name: presentation.name,
			installed: true,
			enabled,
			state: resolveManagedPluginState({
				enabled,
				hasError: Boolean(error),
				setupMode: setup.mode
			}),
			removable
		};
		if (record.packageName) plugin.packageName = record.packageName;
		const remoteIcon = resolveInstalledPluginClawHubIconSource({
			installRecord,
			clawhubPackage
		});
		const discoveryClawHubPackage = remoteIcon?.baseUrl === discoveryRegistry ? remoteIcon.packageName : void 0;
		if (discoveryClawHubPackage) plugin.clawhubPackage = discoveryClawHubPackage;
		if (presentation.description) plugin.description = presentation.description;
		if (presentation.version) plugin.version = presentation.version;
		if (kind) plugin.kind = kind;
		if (record.origin) plugin.origin = record.origin;
		if (catalog?.featured !== void 0) plugin.featured = catalog.featured;
		if (featuredAt !== void 0) plugin.featuredAt = featuredAt;
		if (catalog?.order !== void 0) plugin.order = catalog.order;
		const normalizedPluginId = metadata.normalizePluginId(record.pluginId);
		if (!installedIconsById.has(normalizedPluginId)) installedIconsById.set(normalizedPluginId, Boolean(resolvePluginIconSource({
			metadata,
			pluginId: record.pluginId
		}) || remoteIcon));
		if (installedIconsById.get(normalizedPluginId)) plugin.hasIcon = true;
		const iconOwner = metadata.byPluginId.get(normalizedPluginId);
		if (iconOwner?.activityIconPath) plugin.hasActivityIcon = true;
		if (iconOwner?.toolActivityIconPaths) plugin.activityIconTools = Object.keys(iconOwner.toolActivityIconPaths).toSorted();
		if (manifest?.channels.length) plugin.channelIds = [...manifest.channels];
		if (error) plugin.error = error;
		if (legacyCategory) plugin.category = legacyCategory;
		if (categories?.length) plugin.categories = [...categories];
		else if (record.origin !== "bundled" && installRecord?.source === "clawhub") {
			const name = normalizeOptionalString(installRecord.clawhubPackage);
			const version = normalizeOptionalString(installRecord.version);
			if (name && version) {
				const baseUrl = resolveClawHubBaseUrl(installRecord.clawhubUrl);
				let categoryTargets = categoryTargetsByRegistry.get(baseUrl);
				if (!categoryTargets) {
					categoryTargets = /* @__PURE__ */ new Map();
					categoryTargetsByRegistry.set(baseUrl, categoryTargets);
				}
				const key = pluginVersionKey(name, version);
				const target = categoryTargets.get(key);
				if (target) target.plugins.push(plugin);
				else if (categoryTargetCount < CLAWHUB_CATEGORY_BATCH_LIMIT) {
					categoryTargets.set(key, {
						request: {
							name,
							version
						},
						plugins: [plugin]
					});
					categoryTargetCount += 1;
				}
			}
		}
		return plugin;
	});
	const cache = getManagedPluginCache();
	const categoryCache = cache.pluginVersionCategories ?? /* @__PURE__ */ new Map();
	cache.pluginVersionCategories = categoryCache;
	for (const [baseUrl, categoryTargets] of categoryTargetsByRegistry) try {
		let load = categoryCache.get(baseUrl);
		if (!load) {
			load = fetchClawHubPluginVersionCategories({
				baseUrl,
				skipAuth: true,
				packages: [...categoryTargets.values()].map((target) => target.request)
			}).then((results) => new Map(results.map((result) => [pluginVersionKey(result.name, result.version), result.categories])));
			categoryCache.set(baseUrl, load);
			load.catch(() => {
				if (categoryCache.get(baseUrl) === load) categoryCache.delete(baseUrl);
			});
		}
		const resolved = await load;
		for (const [key, target] of categoryTargets) {
			const categories = resolved.get(key);
			if (!categories?.length) continue;
			for (const plugin of target.plugins) plugin.categories = [...categories];
		}
	} catch {}
	const installedIds = new Set(plugins.map((plugin) => plugin.id));
	const installedPackageNames = new Set(plugins.flatMap((plugin) => plugin.packageName ? [plugin.packageName] : []));
	for (const facts of officialEntries()) {
		const { entry, clawhub, npmPackage } = facts;
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const manifestCatalog = normalizeCatalogMetadata(manifest?.catalog);
		const catalog = manifestCatalog || typeof entry.featured === "boolean" ? {
			...manifestCatalog,
			...manifestCatalog?.featured === void 0 && typeof entry.featured === "boolean" ? { featured: entry.featured } : {}
		} : void 0;
		if (!pluginId || !catalog || installedIds.has(pluginId) || clawhub && (installedPackageNames.has(clawhub.name) || installedClawHubPackages.has(clawhub.name)) || npmPackage && installedPackageNames.has(npmPackage)) continue;
		const kind = normalizeKinds(entry.kind);
		const install = facts.selectedSource?.source === "clawhub" && clawhub && !clawhub.version ? {
			source: "clawhub",
			packageName: clawhub.name
		} : facts.install ? {
			source: "official",
			pluginId
		} : void 0;
		const packageName = npmPackage ?? clawhub?.name;
		const description = normalizeOptionalString(entry.description);
		const version = normalizeOptionalString(entry.version);
		const featuredAt = catalog.featured === true ? normalizeFeaturedAt(entry.featuredAt) : void 0;
		plugins.push({
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...packageName ? { packageName } : {},
			...description ? { description } : {},
			...version ? { version } : {},
			...kind ? { kind } : {},
			origin: "official",
			installed: false,
			enabled: false,
			state: "not-installed",
			...catalog.featured !== void 0 ? { featured: catalog.featured } : {},
			...featuredAt !== void 0 ? { featuredAt } : {},
			...catalog.order !== void 0 ? { order: catalog.order } : {},
			...install ? { install } : {}
		});
	}
	const diagnostics = getProcessGatewayPluginMetadataSnapshot() ? pluginDiagnostics : appendPluginControlPlaneWorkspaceDiagnostic(pluginDiagnostics, workspace);
	if (officialCatalog.error) diagnostics.push({
		level: "warn",
		message: `Official plugin catalog fallback: ${officialCatalog.error}`
	});
	return {
		plugins: plugins.toSorted(compareCatalogEntries),
		diagnostics,
		mutationAllowed: !resolveIsConfigReadOnly(env)
	};
});
/** Inspect one plugin's manifest, operator grants, and recorded install provenance. */
const inspectManagedPlugin = withManagedPluginCache(async (params) => {
	const env = params.env ?? process.env;
	const metadata = resolveManagedPluginMetadata(params.config, env);
	const pluginId = metadata.normalizePluginId(params.pluginId);
	const record = metadata.index.plugins.find((candidate) => candidate.pluginId === pluginId);
	const enabled = isInstalledPluginEnabled(metadata.index, pluginId, params.config);
	const pendingReview = resolvePendingPluginCapabilityReview(pluginId);
	if (pendingReview) {
		const manifest = metadata.byPluginId.get(pluginId);
		return {
			ok: true,
			plugin: {
				id: pluginId,
				name: pendingReview.name,
				...pendingReview.version ? { version: pendingReview.version } : {},
				...record?.origin ? { origin: record.origin } : {},
				installed: Boolean(record),
				enabled
			},
			declared: pendingReview.declared,
			overview: readInstalledPluginOverview(manifest),
			components: projectInstalledPluginComponents({
				manifest,
				declared: pendingReview.declared
			}),
			grants: pendingReview.grants,
			reviewToken: pendingReview.reviewToken,
			...pendingReview.source ? { source: pendingReview.source } : {},
			...pendingReview.trust ? { trust: pendingReview.trust } : {}
		};
	}
	const officialCatalog = await loadOfficialCatalog();
	if (record) {
		const manifest = metadata.byPluginId.get(pluginId);
		const ownership = createInstalledPluginOwnershipResolver(metadata.index, env).resolvePackage(pluginId);
		const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		const { entry: officialEntry, clawhubPackage } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries: prepareCatalogEntries(officialCatalog.entries),
			bundledOfficialEntries: prepareCatalogEntries(listOfficialExternalPluginCatalogEntries())
		});
		const spec = installRecord?.resolvedSpec ?? installRecord?.spec;
		const packageName = installRecord?.clawhubPackage ?? record.packageName;
		const source = installRecord ? {
			kind: installRecord.source,
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...resolvePluginInstallRecordIntegrity(installRecord)
		} : record.origin === "bundled" ? { kind: "bundled" } : void 0;
		const trust = resolvePluginInstallRecordTrust(installRecord);
		const summary = buildPluginCapabilitySummary({
			manifest: manifest ?? {},
			origin: record.origin,
			entryConfig: params.config.plugins?.entries?.[pluginId]
		});
		const declared = ownership.ok ? resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId) : summary.declared;
		if (!declared) throw new ManagedPluginLifecycleError(`Plugin package "${installOwner}" has incomplete manifest metadata.`);
		return {
			ok: true,
			plugin: {
				id: pluginId,
				...resolveInstalledPluginPresentation({
					record,
					manifest,
					officialEntry,
					hostedListingAuthoritative: Boolean(clawhubPackage) && officialCatalog.hostedFeaturedAuthoritative === true
				}),
				origin: record.origin,
				installed: true,
				enabled
			},
			...source ? { source } : {},
			...summary,
			declared,
			components: projectInstalledPluginComponents({
				manifest,
				declared
			}),
			overview: readInstalledPluginOverview(manifest),
			credentials: manifest ? resolvePluginCredentialDescriptors(manifest) : [],
			reviewToken: computeDeclaredSurfaceHash(declared),
			...trust ? { trust } : {}
		};
	}
	const entry = resolveOfficialEntryById(officialCatalog.entries, pluginId);
	if (!entry) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" not found.`, { kind: "invalid-request" });
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const { selectedSource, clawhub, npmPackage } = prepareCatalogEntry(entry);
	const packageName = npmPackage ?? clawhub?.name;
	const spec = selectedSource?.spec;
	const description = normalizeOptionalString(entry.description);
	const version = normalizeOptionalString(entry.version);
	const summary = buildPluginCapabilitySummary({
		manifest: manifest ?? {},
		origin: "official",
		entryConfig: params.config.plugins?.entries?.[pluginId]
	});
	return {
		ok: true,
		plugin: {
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...version ? { version } : {},
			...description ? { description } : {},
			origin: "official",
			installed: false,
			enabled: false
		},
		source: {
			kind: "official-catalog",
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...selectedSource?.expectedIntegrity ? {
				integrity: selectedSource.expectedIntegrity,
				integrityKind: selectedSource.source === "clawhub" ? "sha256" : "ssri"
			} : {}
		},
		...summary,
		components: emptyInstalledPluginComponents(),
		reviewToken: computeDeclaredSurfaceHash(summary.declared)
	};
});
//#endregion
export { resolveManagedPluginActivityIconSource as a, resolveManagedSetupCatalogIconUrl as c, fetchClawHubPluginCatalog as d, fetchClawHubPluginCategories as f, refreshManagedPluginMetadata as i, resolvePluginConfigEnablement as l, fetchClawHubPluginOverview as m, listManagedPlugins as n, resolveManagedPluginIconSources as o, fetchClawHubPluginDetail as p, loadFreshManagedPluginMetadata as r, resolveManagedPluginMetadata as s, inspectManagedPlugin as t, resolvePluginCredentialDescriptors as u };
