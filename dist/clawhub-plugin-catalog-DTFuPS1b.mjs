import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as redactSensitiveUrl } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { n as validatePluginUiCapabilities } from "./plugin-ui-capabilities-C5nEC6Su.mjs";
import { t as validatePluginCategories } from "./src-COX2Khl5.mjs";
import { a as isClawHubTelemetryDisabled, d as readClawHubStringArrayField, f as readClawHubStringField, g as readRequiredClawHubStringField, h as readRequiredClawHubStringArrayField, i as fetchClawHubJson, m as readRequiredClawHubNumberField, o as isDefaultClawHubBaseUrl, p as readRequiredClawHubBooleanField, u as readClawHubNonEmptyStringFields, v as resolveClawHubBaseUrl, y as resolveClawHubImageUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { a as parseClawHubPackageSecurityResponse } from "./clawhub-packages-ZgTQkB-H.mjs";
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
		result.contracts = Object.fromEntries(Object.keys(contracts).toSorted().map((family) => [family, readRequiredClawHubStringArrayField(contracts, family, "plugin contracts")]));
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
	const scope = readClawHubStringField(entry, "scope", context);
	const setup = readClawHubStringField(entry, "setup", context);
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
		...scope ? { scope: truncateUtf16Safe(scope, 1e3) } : {},
		...setup ? { setup: truncateUtf16Safe(setup, 2e3) } : {},
		...endpointRedacted ? { endpointRedacted } : {}
	};
}
//#endregion
//#region src/infra/clawhub-plugin-release.ts
function projectSecurity(value, disposition) {
	const trust = value.trust;
	const moderationStatus = trust.moderationState && trust.moderationState !== "approved" ? trust.moderationState : void 0;
	const trustStatus = trust.pending ? "pending" : trust.stale ? "stale" : moderationStatus ?? trust.scanStatus ?? "unknown";
	const normalizedTrustStatus = trustStatus.trim().toLowerCase();
	return {
		status: disposition === "blocked" ? "blocked" : disposition !== "clean" && (normalizedTrustStatus === "clean" || normalizedTrustStatus === "benign") ? "review" : trustStatus,
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
		const { assessClawHubTrust } = await import("./clawhub-install-trust-ysdEeugO.mjs");
		const disposition = assessClawHubTrust(parsedSecurity);
		security = projectSecurity(parsedSecurity, disposition);
		trust = {
			disposition,
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
function readOptionalNonNegativeNumber(value, field, context, kind = "number") {
	const candidate = value[field];
	if (candidate === void 0 || candidate === null) return;
	if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate < 0) throw new Error(`Malformed ClawHub ${context}: expected ${field} to be non-negative.`);
	if (kind === "integer" && !Number.isInteger(candidate)) throw new Error(`Malformed ClawHub ${context}: expected ${field} to be an integer.`);
	return candidate;
}
function readOptionalBoolean(value, field, context) {
	return value[field] == null ? void 0 : readRequiredClawHubBooleanField(value, field, context);
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
	const featuredRank = readOptionalNonNegativeNumber(value, "featuredRank", context, "integer");
	const trendingRank = readOptionalNonNegativeNumber(value, "trendingRank", context, "integer");
	const downloads = stats ? readOptionalNonNegativeNumber(stats, "downloads", `${context} stats`) : void 0;
	const installs = stats ? readOptionalNonNegativeNumber(stats, "installs", `${context} stats`) : void 0;
	return {
		packageName: readRequiredClawHubStringField(value, "name", context),
		displayName: readRequiredClawHubStringField(value, "displayName", context),
		family,
		isOfficial: readOptionalBoolean(value, "isOfficial", context) === true,
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
			return Object.assign({
				name: readRequiredClawHubStringField(entry, "name", `plugin config field ${index}`),
				required: readRequiredClawHubBooleanField(entry, "required", `plugin config field ${index}`),
				sensitive: readRequiredClawHubBooleanField(entry, "sensitive", `plugin config field ${index}`)
			}, description ? { description } : {});
		}),
		mcpServers: mcpServerDetails.map(({ name }) => name),
		...mcpServerDetails.length ? { mcpServerDetails } : {},
		skills: bundledSkills.map((entry, index) => {
			if (!isRecord(entry)) throw new Error(`Malformed ClawHub bundled skill ${index}: expected an object.`);
			const description = readClawHubStringField(entry, "description", `bundled skill ${index}`);
			return Object.assign({ name: readRequiredClawHubStringField(entry, "name", `bundled skill ${index}`) }, description ? { description } : {});
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
				isOfficial: params.officialOnly || params.intent === "official" ? "true" : void 0,
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
			isOfficial: params.officialOnly || params.intent === "official" ? "true" : void 0,
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
		...params,
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
		...params,
		path: `/api/v1/packages/${encodeURIComponent(params.packageName)}/detail`,
		search: { version: params.version }
	});
	if (!isRecord(value)) throw new Error("Malformed ClawHub plugin detail response: expected an object.");
	if (!isRecord(value.package)) throw new Error("Malformed ClawHub plugin detail response: expected package to be an object.");
	const catalog = parseCatalogPackage(value.package, "plugin detail", params.baseUrl);
	if (catalog.packageName !== params.packageName.trim().toLowerCase()) throw new Error("ClawHub returned a different plugin package identity.");
	const tagsRecord = readOptionalRecord(value.package, "tags", "plugin detail") ?? {};
	const tags = Object.fromEntries(Object.keys(tagsRecord).map((tag) => [tag, readRequiredClawHubStringField(tagsRecord, tag, "plugin tags")]));
	const topics = readClawHubStringArrayField(value.package, "topics", "plugin detail") ?? [];
	const createdAt = readOptionalNonNegativeNumber(value.package, "createdAt", "plugin detail");
	const updatedAt = readOptionalNonNegativeNumber(value.package, "updatedAt", "plugin detail");
	const packageCompatibility = parseClawHubPluginCompatibility(readOptionalRecord(value.package, "compatibility", "plugin detail"), "plugin compatibility");
	const ownerRecord = readOptionalRecord(value, "owner", "plugin detail response");
	const ownerFields = readClawHubNonEmptyStringFields(ownerRecord ?? {}, ["handle", "displayName"], "plugin owner");
	const ownerHandle = ownerFields.handle;
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
		...ownerFields,
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
export { fetchClawHubPluginVersionCategories as a, fetchClawHubPluginOverview as i, fetchClawHubPluginCategories as n, fetchClawHubPluginDetail as r, fetchClawHubPluginCatalog as t };
