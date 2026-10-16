import { D as isRecord, y as normalizeOptionalString } from "./number-coercion-CmpLVzZ6.mjs";
import { u as uniqueStrings } from "./string-normalization-C9v1UMOm.mjs";
//#region src/compat/legacy-names.ts
/** Canonical metadata key shared by package manifests and plugin catalogs. */
const MANIFEST_KEY = "openclaw";
//#endregion
//#region src/plugins/official-external-plugin-catalog-source.ts
var HostedCatalogSignedFeedMonotonicityError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "HostedCatalogSignedFeedMonotonicityError";
	}
};
const SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS = /* @__PURE__ */ new Set([1, 2]);
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL = "https://clawhub.ai/v1/feeds/plugins";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE = "clawhub-public";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID = "clawhub-official";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF = "public-clawhub";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF = "public-npm";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG = {
	feeds: { [DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE]: {
		url: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL,
		feedId: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID
	} },
	sources: {
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF]: {
			type: "clawhub",
			baseUrl: "https://clawhub.ai"
		},
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF]: {
			type: "npm",
			registry: "https://registry.npmjs.org/"
		}
	}
};
const ISO_CALENDAR_DATE_PREFIX_RE = /^(\d{4})-(\d{2})-(\d{2})/u;
function parseOfficialExternalPluginCatalogTimestamp(value) {
	const timestamp = value.trim();
	const parsed = Date.parse(timestamp);
	if (!Number.isFinite(parsed)) return;
	const calendarDate = ISO_CALENDAR_DATE_PREFIX_RE.exec(timestamp);
	if (!calendarDate) return parsed;
	const year = Number(calendarDate[1]);
	const month = Number(calendarDate[2]);
	const day = Number(calendarDate[3]);
	const daysInMonth = [
		31,
		year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1] ? parsed : void 0;
}
function isOfficialExternalPluginCatalogSequence(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
/** Compare authenticated feed ordering in both remote admission and snapshot writes. */
function isOfficialExternalPluginCatalogRollback(params) {
	const { candidate, current } = params;
	return candidate.sequence !== current.sequence ? candidate.sequence < current.sequence : candidate.generatedAt !== void 0 && current.generatedAt !== void 0 && Date.parse(candidate.generatedAt) < Date.parse(current.generatedAt);
}
function isOfficialExternalPluginCatalogFeed(raw) {
	if (!isRecord(raw)) return false;
	const sequence = raw.sequence;
	const generatedAt = raw.generatedAt;
	const generatedAtMs = typeof generatedAt === "string" ? parseOfficialExternalPluginCatalogTimestamp(generatedAt) : void 0;
	const entries = raw.entries;
	return typeof raw.schemaVersion === "number" && SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS.has(raw.schemaVersion) && typeof raw.id === "string" && raw.id.trim().length > 0 && typeof generatedAt === "string" && generatedAt.trim().length > 0 && generatedAtMs !== void 0 && isOfficialExternalPluginCatalogSequence(sequence) && Array.isArray(entries);
}
function parseOfficialExternalPluginCatalogEntries(raw) {
	const entries = Array.isArray(raw) ? raw : isOfficialExternalPluginCatalogFeed(raw) ? raw.entries : isRecord(raw) && !("schemaVersion" in raw) ? raw.entries ?? raw.packages ?? raw.plugins : void 0;
	return Array.isArray(entries) ? entries.filter((entry) => isRecord(entry)) : [];
}
function resolveOfficialExternalPluginCatalogProfileConfig(config) {
	const configuredDefaultFeed = config?.feeds?.[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE];
	const defaultFeed = DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.feeds?.[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE] ?? {
		url: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL,
		feedId: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_ID
	};
	return {
		feeds: {
			...config?.feeds,
			[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE]: {
				...defaultFeed,
				...configuredDefaultFeed
			}
		},
		sources: {
			...DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.sources,
			...config?.sources
		}
	};
}
function getFeedEntryInstallCandidateRecords(entry) {
	const candidates = (isRecord(entry.install) ? entry.install : void 0)?.candidates;
	if (!Array.isArray(candidates)) return [];
	return candidates.filter((candidate) => isRecord(candidate));
}
function getManifestInstallSourceRefCandidate(entry) {
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	if (!install) return;
	if (!Boolean(normalizeOptionalString(install.clawhubSpec) || normalizeOptionalString(install.npmSpec) || normalizeOptionalString(install.localPath))) return;
	return {
		sourceRef: normalizeOptionalString(install.sourceRef),
		package: normalizeOptionalString(install.npmSpec) ?? normalizeOptionalString(install.clawhubSpec)
	};
}
function hasKnownCatalogSourceRef(candidate, sourceRefs) {
	const sourceRef = normalizeOptionalString(candidate.sourceRef);
	return Boolean(sourceRef && sourceRefs.has(sourceRef));
}
function filterOfficialExternalPluginCatalogEntriesBySourceRefs(entries, params) {
	let configuredSourceRefs;
	return entries.filter((entry) => {
		const sourceRefs = configuredSourceRefs ??= new Set(Object.keys(resolveOfficialExternalPluginCatalogProfileConfig(params?.catalogConfig).sources));
		let candidates = getFeedEntryInstallCandidateRecords(entry);
		if (params?.requireManifestInstallSourceRef) {
			const manifestCandidate = getManifestInstallSourceRefCandidate(entry);
			if (manifestCandidate) candidates = [...candidates, manifestCandidate];
			else if (candidates.length === 0) candidates = [{}];
		}
		return candidates.every((candidate) => hasKnownCatalogSourceRef(candidate, sourceRefs));
	});
}
function dedupeOfficialExternalPluginCatalogEntries(entries) {
	const resolved = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = resolveOfficialExternalPluginCatalogEntryKey(entry);
		if (key && !resolved.has(key)) resolved.set(key, entry);
	}
	return [...resolved.values()];
}
function resolveOfficialExternalPluginCatalogEntryKey(entry) {
	const pluginId = resolveOfficialExternalPluginId(entry);
	if (pluginId) return `${normalizeOptionalString(entry.kind) ?? "plugin"}:${pluginId}`;
	return normalizeOptionalString(entry.name);
}
function getOfficialExternalPluginCatalogManifest(entry) {
	const manifest = entry[MANIFEST_KEY];
	return isRecord(manifest) ? manifest : void 0;
}
function resolveOfficialExternalPluginId(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.id) ?? normalizeOptionalString(manifest?.channel?.id) ?? normalizeOptionalString(manifest?.providers?.[0]?.id) ?? normalizeOptionalString(entry.id);
}
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST = ["clawhub.ai"];
function resolveHostedCatalogFeedUrl(raw) {
	let parsed;
	try {
		parsed = new URL(raw.trim());
	} catch {
		throw new Error("hosted catalog feed URL is invalid");
	}
	if (parsed.protocol !== "https:") throw new Error("hosted catalog feed URL must use HTTPS");
	if (parsed.username || parsed.password) throw new Error("hosted catalog feed URL must not include credentials");
	if (parsed.search || parsed.hash) throw new Error("hosted catalog feed URL must not include query strings or fragments");
	return parsed;
}
function resolveHostedCatalogFeedSource(params) {
	const explicitFeedUrl = normalizeOptionalString(params.feedUrl);
	const explicitProfileName = normalizeOptionalString(params.feedProfile);
	if (explicitFeedUrl) {
		const url = resolveHostedCatalogFeedUrl(explicitFeedUrl);
		if (!OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST.includes(url.hostname)) throw new Error("hosted catalog feed URL hostname is not allowed");
		const defaultProfile = explicitProfileName === void 0 ? resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE] : void 0;
		const profileName = explicitProfileName ?? (defaultProfile && resolveHostedCatalogFeedUrl(defaultProfile.url).href === url.href ? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE : void 0);
		const profileConfig = profileName === void 0 ? void 0 : resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig);
		const profile = profileName === void 0 ? void 0 : profileConfig?.feeds[profileName];
		if (profileName !== void 0 && !profile) throw new Error(`hosted catalog feed profile "${profileName}" is not configured`);
		return {
			url,
			hostnameAllowlist: OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST,
			...profile?.feedId ? { expectedFeedId: profile.feedId } : {},
			...profile?.verification ? { verification: profile.verification } : {}
		};
	}
	const profileName = explicitProfileName ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE;
	const profile = resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[profileName];
	if (!profile) throw new Error(`hosted catalog feed profile "${profileName}" is not configured`);
	const url = resolveHostedCatalogFeedUrl(profile.url);
	return {
		url,
		hostnameAllowlist: uniqueStrings([...OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST, url.hostname]),
		...profile.feedId ? { expectedFeedId: profile.feedId } : {},
		verification: profile.verification
	};
}
function shouldRequireManifestInstallSourceRef(params) {
	const feedUrl = normalizeOptionalString(params.feedUrl);
	if (feedUrl) try {
		return resolveHostedCatalogFeedUrl(feedUrl).href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
	const profileName = normalizeOptionalString(params.feedProfile) ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE;
	if (profileName !== DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE) return true;
	const profileConfig = resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig);
	const profileUrl = normalizeOptionalString(profileConfig.feeds[profileName]?.url);
	try {
		return resolveHostedCatalogFeedUrl(profileUrl ?? DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
}
//#endregion
export { MANIFEST_KEY as _, getFeedEntryInstallCandidateRecords as a, isOfficialExternalPluginCatalogFeed as c, parseOfficialExternalPluginCatalogTimestamp as d, resolveHostedCatalogFeedSource as f, shouldRequireManifestInstallSourceRef as g, resolveOfficialExternalPluginId as h, filterOfficialExternalPluginCatalogEntriesBySourceRefs as i, isOfficialExternalPluginCatalogRollback as l, resolveOfficialExternalPluginCatalogProfileConfig as m, HostedCatalogSignedFeedMonotonicityError as n, getOfficialExternalPluginCatalogManifest as o, resolveOfficialExternalPluginCatalogEntryKey as p, dedupeOfficialExternalPluginCatalogEntries as r, hasKnownCatalogSourceRef as s, DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG as t, parseOfficialExternalPluginCatalogEntries as u };
