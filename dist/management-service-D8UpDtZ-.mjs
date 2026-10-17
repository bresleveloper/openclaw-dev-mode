import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as withPluginCache, a as createPluginCache, d as getPluginMetadataSnapshotCache, f as getProcessPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as parseConcreteConfigPathTokens, n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { a as redactSensitiveUrl, o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { p as isValidSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import { S as resolveIsConfigReadOnly } from "./paths-DGIwWbpu.mjs";
import { f as resolveConfigSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-HH1cnmIY.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { r as isInstalledPluginEnabled, t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-Zl-RSskC.mjs";
import { n as validatePluginUiCapabilities } from "./plugin-ui-capabilities-C5nEC6Su.mjs";
import { m as validatePluginCategories } from "./manifest-BXjFCp0F.mjs";
import { h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { g as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-B7ojvzQW.mjs";
import { o as loadPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BSuk9I48.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-vFKiQH3N.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-Dz1QBmPR.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CzrjMN2p.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-B0gcrw-D.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-BAZLWoC_.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BWz3K_lG.mjs";
import { c as resolvePluginInstallRecordIntegrity, l as resolvePluginInstallRecordTrust, n as buildPluginCapabilitySummary, r as computeDeclaredSurfaceHash, u as resolvePluginPackageDeclaredSurface } from "./capability-summary-4nSs_R5Q.mjs";
import { i as resolvePendingPluginCapabilityReview } from "./capability-consent-Bs3_uw8H.mjs";
import { a as isClawHubTelemetryDisabled, d as readClawHubStringArrayField, f as readClawHubStringField, g as readRequiredClawHubStringField, i as fetchClawHubJson, m as readRequiredClawHubNumberField, o as isDefaultClawHubBaseUrl, p as readRequiredClawHubBooleanField, u as readClawHubNonEmptyStringFields, v as resolveClawHubBaseUrl, y as resolveClawHubImageUrl } from "./clawhub-client-D-mEumEV.mjs";
import { a as parseClawHubPackageSecurityResponse } from "./clawhub-packages-U1mzSSOu.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-BIajIczI.mjs";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-D2NI7IIk.mjs";
import { n as projectPluginInstallHealth } from "./status-snapshot-DxVlNIA-.mjs";
import { _ as resolvePluginIconSource, a as loadOfficialCatalog, c as normalizeKinds, d as projectPluginCatalogCategoryFacts, f as resolveInstalledHostedOfficialEntry, g as resolvePluginActivityIconSource, h as resolveOfficialEntryById, i as getManagedPluginCache, l as prepareCatalogEntries, m as resolveInstalledPluginPresentation, n as compareCatalogEntries, o as normalizeCatalogMetadata, p as resolveInstalledPluginClawHubIconSource, r as firstPluginError, s as normalizeFeaturedAt, u as prepareCatalogEntry, v as resolvePluginIconSources, y as withManagedPluginCache } from "./management-catalog-WXw--Fds.mjs";
import { d as emptyInstalledPluginComponents, f as projectInstalledPluginComponents, l as projectPluginOverviewCapabilities, s as projectClawHubPluginInspection, u as readInstalledPluginOverview } from "./catalog-discovery-bzOzSctU.mjs";
import { t as normalizeCatalogIconUrl } from "./catalog-icon-registry-QbEIkWWZ.mjs";
import { t as resolveOperatorMcpOAuthConfig } from "./mcp-operator-auth-CB1S0Mkd.mjs";
//#region src/infra/clawhub-plugin-manifest.ts
function parseClawHubPluginCapabilities(summary) {
	const result = {};
	const ui = validatePluginUiCapabilities(summary.uiCapabilities);
	if (ui.ok && ui.capabilities !== void 0) result.uiCapabilities = ui.capabilities;
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
	const compatibility = readClawHubNonEmptyStringFields(value, [
		"pluginApiRange",
		"builtWithOpenClawVersion",
		"pluginSdkVersion",
		"minGatewayVersion"
	], context);
	return Object.keys(compatibility).length > 0 ? compatibility : void 0;
}
function parseClawHubPluginMcpServer(entry, index) {
	const context = `plugin MCP server ${index}`;
	if (!isRecord(entry)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
	const name = readRequiredClawHubStringField(entry, "name", context);
	const rawUrl = readClawHubStringField(entry, "url", context);
	const scope = readClawHubStringField(entry, "scope", context)?.slice(0, 1e3);
	const setup = readClawHubStringField(entry, "setup", context)?.slice(0, 2e3);
	let url;
	let endpointRedacted = entry.endpointRedacted === true;
	if (rawUrl && !endpointRedacted) {
		try {
			const parsed = new URL(rawUrl);
			const host = parsed.hostname.replace(/\.$/u, "");
			if (rawUrl.length <= 2048 && parsed.protocol === "https:" && !parsed.username && !parsed.password && !parsed.hash && !parsed.port && host.includes(".") && !/^[\d.]+$/u.test(host) && !host.includes(":") && !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/u.test(host) && redactSensitiveUrl(rawUrl) === rawUrl) url = rawUrl;
		} catch {}
		endpointRedacted = !url;
	}
	return {
		name,
		...url ? { url } : {},
		...entry.transport === "streamable-http" || entry.transport === "sse" || entry.transport === "stdio" ? { transport: entry.transport } : {},
		...entry.auth === "oauth" || entry.auth === "api-key" || entry.auth === "none" ? { auth: entry.auth } : {},
		...scope ? { scope } : {},
		...setup ? { setup } : {},
		...endpointRedacted ? { endpointRedacted } : {}
	};
}
//#endregion
//#region src/infra/clawhub-plugin-release.ts
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
/** Project exact release facts; listing and artifact URLs cannot prove stored download bytes. */
async function readClawHubPluginReleaseFacts(params) {
	const { value, versionRecord } = params;
	const selectedRelease = versionRecord ? {
		version: readRequiredClawHubStringField(versionRecord, "version", "selected plugin release"),
		...versionRecord.createdAt != null ? { createdAt: readRequiredClawHubNumberField(versionRecord, "createdAt", "selected plugin release") } : {},
		...versionRecord.changelog != null ? { changelog: readClawHubStringField(versionRecord, "changelog", "selected plugin release") ?? void 0 } : {},
		tags: readClawHubStringArrayField(versionRecord, "distTags", "selected plugin release") ?? []
	} : null;
	if (params.version && selectedRelease?.version !== params.version) throw new Error("ClawHub did not return the requested plugin release.");
	const readme = readClawHubStringField(value, "readme", "plugin detail response");
	if (readme && Buffer.byteLength(readme, "utf8") > 524288) throw new Error("ClawHub plugin README exceeded 524288 bytes.");
	let security;
	let trust;
	let downloadability = selectedRelease ? {
		status: "unknown",
		reason: "ClawHub does not expose artifact storage availability for this release."
	} : {
		status: "unavailable",
		reason: "The listing has no selected release."
	};
	if (value.security != null) try {
		const parsedSecurity = parseClawHubPackageSecurityResponse(value.security);
		if (!selectedRelease || parsedSecurity.package?.name && parsedSecurity.package.name !== params.packageName || parsedSecurity.release?.version && parsedSecurity.release.version !== selectedRelease.version) throw new Error("ClawHub security metadata does not describe the selected release.");
		security = projectSecurity(parsedSecurity);
		const { assessClawHubTrust } = await import("./clawhub-install-trust-BUkkIjtN.mjs");
		trust = {
			disposition: assessClawHubTrust(parsedSecurity.trust),
			reasons: parsedSecurity.trust.reasons,
			pending: parsedSecurity.trust.pending,
			stale: parsedSecurity.trust.stale
		};
		if (parsedSecurity.trust.blockedFromDownload) downloadability = {
			status: "unavailable",
			reason: parsedSecurity.trust.reasons.join("; ") || "ClawHub blocks downloads of this release."
		};
	} catch {}
	return {
		selectedRelease,
		readme,
		security,
		trust,
		downloadability
	};
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
	"monitor",
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
	const stats = readOptionalRecord(value, "stats", context);
	const display = readClawHubNonEmptyStringFields(value, [
		"summary",
		"ownerHandle",
		"latestVersion",
		"runtimeId"
	], context);
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
		...display,
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
		const pinnedPackages = readClawHubStringArrayField(entry, "pinnedPackages", `plugin category ${slug}`);
		if (pinnedPackages && (new Set(pinnedPackages).size !== pinnedPackages.length || pinnedPackages.some((name) => !name.trim() || name !== name.trim()))) throw new Error(`Malformed ClawHub plugin category ${slug}: duplicate or invalid pinned package.`);
		seenSlugs.add(slug);
		seenOrders.add(order);
		return {
			slug,
			label: readRequiredClawHubStringField(entry, "label", `plugin category ${slug}`),
			description: readRequiredClawHubStringField(entry, "description", `plugin category ${slug}`),
			icon: PLUGIN_CATEGORY_ICON_KEYS.has(icon) ? icon : "package",
			order,
			...pinnedPackages ? { pinnedPackages } : {}
		};
	}).toSorted((left, right) => left.order - right.order);
}
function parseCatalogList(value, baseUrl) {
	if (!isRecord(value) || !Array.isArray(value.items)) throw new Error("Malformed ClawHub plugin catalog response: expected items to be an array.");
	const nextCursor = readClawHubStringField(value, "nextCursor", "plugin catalog response");
	return {
		items: value.items.map((item, index) => parseCatalogPackage(item, `plugin catalog item ${index}`, baseUrl)),
		...nextCursor ? { nextCursor } : {},
		...value.categories !== void 0 ? { categories: parsePluginCategories(value) } : {}
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
	const mcpServerDetails = mcpServers.map(parseClawHubPluginMcpServer);
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
		mcpServers: mcpServerDetails.map(({ name }) => name),
		...mcpServerDetails.length ? { mcpServerDetails } : {},
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
	const display = readClawHubNonEmptyStringFields(value, [
		"summary",
		"sourceRepo",
		"sourceCommit",
		"sourcePath",
		"scanStatus"
	], "plugin verification");
	return {
		tier: readRequiredClawHubStringField(value, "tier", "plugin verification"),
		...display
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
			curated: (params.intent ?? "all") === "all" && params.category ? "true" : void 0,
			sort: params.intent === "featured" ? void 0 : params.intent === "trending" ? "trending" : "downloads",
			limit: params.limit ? String(params.limit) : void 0
		}
	}), params.baseUrl);
}
async function fetchClawHubPluginOverview(options = {}) {
	const value = await fetchClawHubJson({
		...options,
		skipAuth: options.skipAuth ?? (!options.token && isDefaultClawHubBaseUrl(options.baseUrl)),
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
		skipAuth: options.skipAuth ?? (!options.token && isDefaultClawHubBaseUrl(options.baseUrl)),
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
	if (catalog.packageName !== params.packageName.trim().toLowerCase()) throw new Error("ClawHub returned a different plugin package identity.");
	const tagsRecord = readOptionalRecord(value.package, "tags", "plugin detail");
	const tags = Object.fromEntries(Object.keys(tagsRecord ?? {}).map((tag) => [tag, readRequiredClawHubStringField(tagsRecord ?? {}, tag, "plugin tags")]));
	const topics = readClawHubStringArrayField(value.package, "topics", "plugin detail") ?? [];
	const createdAt = readOptionalNonNegativeNumber(value.package, "createdAt", "plugin detail");
	const updatedAt = readOptionalNonNegativeNumber(value.package, "updatedAt", "plugin detail");
	const packageCompatibility = parseClawHubPluginCompatibility(readOptionalRecord(value.package, "compatibility", "plugin detail"), "plugin compatibility");
	const ownerRecord = readOptionalRecord(value, "owner", "plugin detail response");
	const ownerHandle = ownerRecord ? readClawHubStringField(ownerRecord, "handle", "plugin owner") : void 0;
	const ownerDisplayName = ownerRecord ? readClawHubStringField(ownerRecord, "displayName", "plugin owner") : void 0;
	const ownerImageUrl = ownerRecord ? readClawHubStringField(ownerRecord, "image", "plugin owner") : void 0;
	const versionRecord = readOptionalRecord(value, "version", "plugin detail response");
	const { selectedRelease, readme, security, trust, downloadability } = await readClawHubPluginReleaseFacts({
		value,
		versionRecord,
		packageName: catalog.packageName,
		version: params.version
	});
	const manifestRecord = versionRecord ? readOptionalRecord(versionRecord, "pluginManifestSummary", "plugin version") : void 0;
	const manifest = parseManifest(manifestRecord);
	const verification = parseVerification(versionRecord ? readOptionalRecord(versionRecord, "verification", "plugin version") : void 0);
	const owner = {
		...ownerHandle ? { handle: ownerHandle } : {},
		...ownerDisplayName ? { displayName: ownerDisplayName } : {},
		...ownerImageUrl ? { imageUrl: ownerImageUrl } : {},
		...typeof ownerRecord?.official === "boolean" ? { official: ownerRecord.official } : {}
	};
	return {
		...catalog,
		registry: resolveClawHubBaseUrl(params.baseUrl),
		tags,
		selectedRelease,
		downloadability,
		metadata: {
			manifest: manifestRecord ? "available" : "missing",
			readme: readme != null ? "available" : "missing",
			security: security ? "available" : "missing"
		},
		...trust ? { trust } : {},
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
//#region src/plugins/credential-inspection.ts
/** Never resolve references; authored literals require the explicit administrator reveal flow. */
function inspectPluginCredentialValue(config, descriptor, env, reveal = false) {
	let value = config;
	for (const segment of descriptor.path) value = value !== null && typeof value === "object" && Object.hasOwn(value, segment) ? Reflect.get(value, segment) : void 0;
	const path = formatConcreteConfigPath(descriptor.path, config);
	const ref = resolveConfigSecretRef({
		config,
		path,
		value,
		defaults: config.secrets?.defaults,
		includeResolved: true
	});
	if (ref && isValidSecretRef(ref)) return {
		kind: "reference",
		ref,
		unresolved: hasUnresolvedConfigPath(config, path)
	};
	if (typeof value === "string" && value.length) return {
		kind: "literal",
		...reveal ? { value } : {}
	};
	if (value !== void 0 && value !== "") return { kind: "invalid" };
	const envVar = descriptor.envVars.find((name) => Boolean(env[name]?.trim()));
	return envVar ? {
		kind: "environment",
		envVar
	} : { kind: "missing" };
}
//#endregion
//#region src/plugins/mcp-auth-status.ts
function resolvePluginMcpAuthDeclarations(config, metadata) {
	const cache = getPluginMetadataSnapshotCache(metadata);
	let byConfig = cache.metadata.mcpAuthDeclarations.get(metadata);
	if (!byConfig) {
		byConfig = /* @__PURE__ */ new WeakMap();
		cache.metadata.mcpAuthDeclarations.set(metadata, byConfig);
	}
	const cached = byConfig.get(config);
	if (cached) return cached;
	const bundled = withPluginCache(cache, () => loadEnabledBundleMcpConfig({
		cfg: config,
		workspaceDir: metadata.workspaceDir ?? "",
		manifestRegistry: metadata.manifestRegistry
	}));
	const declarations = /* @__PURE__ */ new Map();
	for (const [serverName, pluginId] of Object.entries(bundled.pluginIdsByServer).toSorted(([a], [b]) => a.localeCompare(b))) {
		const transport = resolveMcpTransportConfig(serverName, bundled.config.mcpServers[serverName], { logWarnings: false });
		if (transport?.kind === "http") {
			const servers = declarations.get(pluginId) ?? [];
			servers.push({
				serverName,
				url: transport.url
			});
			declarations.set(pluginId, servers);
		}
	}
	byConfig.set(config, declarations);
	return declarations;
}
/** Project stored auth state only for a plugin's matching, operator-owned connections. */
async function readPluginMcpAuthStatus(params) {
	if (!params.config.mcp?.servers) return;
	const identities = (resolvePluginMcpAuthDeclarations(params.config, params.metadata).get(params.pluginId) ?? []).flatMap(({ serverName: name, url }) => {
		const configured = resolveOperatorMcpOAuthConfig(name, params.config.mcp?.servers?.[name]);
		return configured && configured.url === url ? [operatorMcpOAuthIdentity(name, configured.url)] : [];
	});
	if (identities.length === 0) return;
	const { readMcpOAuthCredentialsStatuses } = await import("./mcp-oauth-DtfTyNJ_.mjs");
	const statuses = await readMcpOAuthCredentialsStatuses(identities);
	return identities.map((identity, index) => ({
		serverName: identity.serverName,
		state: statuses[index].state
	}));
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
/** Resolve only URLs currently owned by a manifest or bundled presentation catalog. */
function resolveManagedSetupCatalogIconUrl(params) {
	const requested = normalizeCatalogIconUrl(normalizeOptionalString(params.iconUrl) ?? "");
	if (!requested) return;
	const env = params.env ?? process.env;
	return [...resolveManifestProviderAuthChoices({
		config: params.config,
		env,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).map((choice) => choice.icon), ...listRecommendedToolInstalls().map((install) => install.icon)].some((iconUrl) => normalizeCatalogIconUrl(normalizeOptionalString(iconUrl) ?? "") === requested) ? requested : void 0;
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
		Object.assign(plugin, projectPluginCatalogCategoryFacts(manifest, enabled));
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
		if (!plugin.categories?.length && record.origin !== "bundled" && installRecord?.source === "clawhub") {
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
			...clawhub ? { clawhubPackage: clawhub.name } : {},
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
	if (params.clawhub) {
		const [remote, local] = await Promise.all([fetchClawHubPluginDetail(params.clawhub), listManagedPlugins({
			config: params.config,
			env
		})]);
		return projectClawHubPluginInspection({
			remote,
			local,
			config: params.config
		});
	}
	if (!params.pluginId) throw new ManagedPluginLifecycleError("A plugin inspection identity is required.", { kind: "invalid-request" });
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
		const mcpAuth = enabled ? await readPluginMcpAuthStatus({
			config: params.config,
			pluginId,
			metadata
		}) : void 0;
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
			credentials: manifest ? resolvePluginCredentialDescriptors(manifest).map((descriptor) => {
				const credential = inspectPluginCredentialValue(params.config, descriptor, env);
				const status = credential.kind === "reference" ? credential.unresolved ? "unresolved" : "configured" : credential.kind === "literal" || credential.kind === "environment" ? "configured" : credential.kind;
				return Object.assign({}, descriptor, { status });
			}) : [],
			...mcpAuth ? { mcpAuth } : {},
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
		overview: { capabilities: projectPluginOverviewCapabilities(summary.declared, manifest?.uiCapabilities) },
		reviewToken: computeDeclaredSurfaceHash(summary.declared)
	};
});
//#endregion
export { resolveManagedPluginActivityIconSource as a, resolveManagedSetupCatalogIconUrl as c, resolvePluginCredentialDescriptors as d, fetchClawHubPluginCatalog as f, fetchClawHubPluginOverview as h, refreshManagedPluginMetadata as i, resolvePluginConfigEnablement as l, fetchClawHubPluginDetail as m, listManagedPlugins as n, resolveManagedPluginIconSources as o, fetchClawHubPluginCategories as p, loadFreshManagedPluginMetadata as r, resolveManagedPluginMetadata as s, inspectManagedPlugin as t, inspectPluginCredentialValue as u };
