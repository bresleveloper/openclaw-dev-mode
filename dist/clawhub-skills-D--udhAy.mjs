import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as withClawHubResponse, c as readClawHubBooleanField, f as readClawHubStringField, g as readRequiredClawHubStringField, i as fetchClawHubJson, l as readClawHubBytes, m as readRequiredClawHubNumberField, n as createClawHubError, r as decodeClawHubResponseBody, s as parseClawHubJsonBody, t as ClawHubRequestError, v as resolveClawHubBaseUrl, y as resolveClawHubImageUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { t as reportClawHubInstallTelemetry } from "./clawhub-telemetry-CpI4NNiL.mjs";
//#region src/infra/clawhub-skills.ts
const SKILL_CARD_MAX_BYTES = 262144;
const SKILL_VERIFICATION_MAX_BYTES = 67108864;
const CLAWHUB_SKILLS_SH_TRUST_STATE = "not-scanned-by-clawhub";
const CLAWHUB_SKILLS_SH_TRUST_LABEL = "Not scanned by ClawHub";
/** Marks a reference ClawHub resolves from an external source it never scanned. */
const CLAWHUB_SKILLS_SH_REF_PREFIX = "skills-sh:";
/** Source variants ClawHub resolves search results from. Anything else is unidentifiable. */
const CLAWHUB_NATIVE_SOURCE_KIND = "clawhub";
const CLAWHUB_SKILLS_SH_SOURCE_KIND = "skills-sh";
const CLAWHUB_SUPPORTED_INSTALL_KINDS = /* @__PURE__ */ new Set([
	"clawhub",
	"github",
	"skills-sh"
]);
function buildVersionOrTagSearch(params) {
	const version = normalizeOptionalString(params.version);
	const ownerHandle = normalizeOptionalString(params.ownerHandle);
	const tag = version ? void 0 : normalizeOptionalString(params.tag);
	const selection = version ? { version } : tag ? { tag } : void 0;
	return selection || ownerHandle ? {
		...selection,
		...ownerHandle ? { ownerHandle } : {}
	} : void 0;
}
async function searchClawHubSkills(params) {
	const registry = resolveClawHubBaseUrl(params.baseUrl);
	const query = params.query.trim();
	const request = {
		...params,
		baseUrl: registry
	};
	let entries;
	if (query) entries = (await fetchClawHubJson({
		...request,
		path: "/api/v1/search",
		search: {
			q: query,
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? [];
	else entries = ((await fetchClawHubJson({
		...request,
		path: "/api/v1/trending",
		search: {
			kind: "skills",
			limit: String(Math.min(params.limit ?? 20, 100))
		}
	})).items ?? []).map((entry) => ({
		score: 0,
		slug: entry.slug,
		displayName: entry.displayName,
		summary: entry.summary ?? void 0,
		source: entry.source,
		install: entry.install,
		official: entry.official,
		ownerHandle: entry.publisher?.handle,
		updatedAt: entry.metrics?.updatedAt ?? void 0
	}));
	return entries.flatMap((entry) => mapClawHubSkillSearchEntry(entry, registry));
}
async function fetchClawHubSkillCatalog(params) {
	const query = params.query?.trim();
	if (query && params.cursor) throw new Error("ClawHub skill search does not support a cursor.");
	const registry = resolveClawHubBaseUrl(params.baseUrl);
	const trending = !query && params.feed === "trending";
	const result = await fetchClawHubJson({
		...params,
		baseUrl: registry,
		path: query ? "/api/v1/packages/search" : trending ? "/api/v1/trending" : "/api/v1/packages",
		search: {
			...trending ? { kind: "skills" } : {
				family: "skill",
				...query ? { q: query } : { sort: "downloads" },
				isOfficial: params.officialOnly ? "true" : void 0
			},
			limit: String(Math.min(params.limit ?? 100, 100)),
			cursor: params.cursor
		}
	});
	const rows = isRecord(result) ? result[query ? "results" : "items"] : void 0;
	if (!isRecord(result) || !Array.isArray(rows)) throw new Error("Malformed ClawHub skill catalog: expected a result array.");
	const nextCursor = readClawHubStringField(result, "nextCursor", "skill catalog");
	const items = rows.map((row, index) => {
		const context = `skill catalog item ${index}`;
		if (!isRecord(row)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
		const value = query ? row.package : row;
		if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected a package object.`);
		const entry = {
			score: 0,
			slug: readRequiredClawHubStringField(value, trending ? "slug" : "name", context),
			displayName: readRequiredClawHubStringField(value, "displayName", context),
			official: readClawHubBooleanField(value, trending ? "official" : "isOfficial", context),
			summary: readClawHubStringField(value, "summary", context) ?? void 0,
			icon: readClawHubStringField(value, "icon", context)
		};
		if (trending) {
			const publisher = value.publisher;
			const metrics = value.metrics;
			const install = value.install;
			if (publisher !== null && publisher !== void 0 && !isRecord(publisher) || metrics !== void 0 && !isRecord(metrics) || !isRecord(install)) throw new Error(`Malformed ClawHub ${context}: invalid trending identity or metrics.`);
			return Object.assign(entry, {
				source: readRequiredClawHubStringField(value, "source", context),
				install: {
					kind: readRequiredClawHubStringField(install, "kind", context),
					reference: readRequiredClawHubStringField(install, "reference", context)
				},
				ownerHandle: publisher ? readClawHubStringField(publisher, "handle", context) : void 0,
				updatedAt: metrics ? readRequiredClawHubNumberField(metrics, "updatedAt", context) : void 0
			});
		}
		if (value.family !== "skill") throw new Error(`Malformed ClawHub ${context}: expected skill family.`);
		entry.score = query ? readRequiredClawHubNumberField(row, "score", context) : 0;
		return Object.assign(entry, {
			source: CLAWHUB_NATIVE_SOURCE_KIND,
			ownerHandle: readClawHubStringField(value, "ownerHandle", context),
			version: readClawHubStringField(value, "latestVersion", context) ?? void 0,
			updatedAt: readRequiredClawHubNumberField(value, "updatedAt", context)
		});
	}).flatMap((entry) => mapClawHubSkillSearchEntry(entry, registry));
	if (trending) for (let offset = 0; offset < items.length; offset += 4) await Promise.all(items.slice(offset, offset + 4).map(async (item) => {
		if (item.installOnly) {
			item.official = void 0;
			return;
		}
		const detail = await fetchClawHubJson({
			...params,
			baseUrl: registry,
			path: `/api/v1/packages/${encodeURIComponent(item.slug)}`,
			search: {
				family: "skill",
				ownerHandle: item.ownerHandle ?? void 0
			}
		});
		if (!isRecord(detail) || !isRecord(detail.package)) throw new Error("Malformed ClawHub skill listing: expected a package object.");
		const listing = detail.package;
		item.official = listing.family === "skill" && listing.name === item.slug && listing.ownerHandle === item.ownerHandle ? readClawHubBooleanField(listing, "isOfficial", "skill listing") : void 0;
	}));
	return {
		items,
		...nextCursor ? { nextCursor } : {}
	};
}
/**
* Records each result's own source once, here, so no consumer rebuilds it. A row whose source is
* unknown, or whose external reference is missing, is dropped rather than published under
* `@owner/slug`: that spelling would point install at a different publisher's skill.
*/
function mapClawHubSkillSearchEntry(entry, registry) {
	const { install: _install, source: _source, ...rest } = entry;
	const base = {
		...rest,
		registry,
		icon: resolveClawHubImageUrl(entry.icon, registry)
	};
	const source = normalizeOptionalString(entry.source);
	const installKind = normalizeOptionalString(entry.install?.kind);
	const reference = normalizeOptionalString(entry.install?.reference);
	if (installKind && !CLAWHUB_SUPPORTED_INSTALL_KINDS.has(installKind)) return [];
	switch (source) {
		case CLAWHUB_SKILLS_SH_SOURCE_KIND:
			if (!reference?.startsWith("skills-sh:")) return [];
			return {
				...base,
				installRef: reference,
				installOnly: true,
				trustState: CLAWHUB_SKILLS_SH_TRUST_STATE
			};
		case CLAWHUB_NATIVE_SOURCE_KIND: {
			const ownerHandle = normalizeOptionalString(entry.ownerHandle);
			return ownerHandle ? {
				...base,
				installRef: `@${ownerHandle}/${entry.slug}`
			} : [];
		}
		default: return [];
	}
}
async function fetchClawHubSkillDetail(params) {
	const registry = resolveClawHubBaseUrl(params.baseUrl);
	const detail = await fetchClawHubJson({
		...params,
		baseUrl: registry,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}`,
		search: params.ownerHandle ? { ownerHandle: params.ownerHandle } : void 0
	});
	if (detail.skill && detail.skill.slug !== params.slug) throw new Error("ClawHub returned details for a different skill.");
	if (params.ownerHandle && detail.owner?.handle && detail.owner.handle !== params.ownerHandle) throw new Error("ClawHub returned details for a different publisher.");
	if (!params.includeInspection && params.version === void 0) return {
		...detail,
		skill: detail.skill ? {
			...detail.skill,
			icon: resolveClawHubImageUrl(detail.skill.icon, registry)
		} : null
	};
	const ownerHandle = params.ownerHandle ?? detail.owner?.handle ?? void 0;
	const version = normalizeOptionalString(params.version) ?? detail.latestVersion?.version;
	const request = {
		...params,
		baseUrl: registry,
		ownerHandle,
		version
	};
	const warnings = [];
	const [release, card] = version ? await Promise.allSettled([fetchClawHubJson({
		...request,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/versions/${encodeURIComponent(version)}`,
		search: ownerHandle ? { ownerHandle } : void 0
	}), fetchClawHubSkillCard(request)]) : [];
	if (release?.status === "rejected") warnings.push(`Selected release details unavailable: ${String(release.reason)}`);
	const returnedVersion = release?.status === "fulfilled" ? release.value.version : void 0;
	const selectedVersion = returnedVersion?.version === version ? returnedVersion : void 0;
	const releaseMismatch = release?.status === "fulfilled" && selectedVersion === void 0;
	if (releaseMismatch) warnings.push("ClawHub returned details for a different release.");
	const releaseUnavailable = release?.status === "rejected" && release.reason instanceof ClawHubRequestError && [404, 410].includes(release.reason.status);
	const security = selectedVersion?.security;
	const validSecurity = security && typeof security.status === "string" && security.status.trim().length > 0 && typeof security.hasWarnings === "boolean" && typeof security.hasScanResult === "boolean";
	const isLatest = version !== void 0 && version === detail.latestVersion?.version;
	const canUseLatest = isLatest && !releaseUnavailable && !releaseMismatch;
	const displayRelease = selectedVersion ?? (canUseLatest ? detail.latestVersion : void 0);
	return {
		...detail,
		registry,
		source: "clawhub",
		installRef: ownerHandle ? `@${ownerHandle}/${params.slug}` : params.slug,
		selectedRelease: displayRelease ? {
			version: displayRelease.version,
			createdAt: displayRelease.createdAt,
			changelog: displayRelease.changelog,
			...selectedVersion ? { tags: Object.entries(detail.skill?.tags ?? {}).filter(([, taggedVersion]) => taggedVersion === selectedVersion.version).map(([tag]) => tag) } : {}
		} : null,
		downloadability: !version ? {
			status: "unknown",
			reason: "The listing has no hosted release; source-backed availability is not reported."
		} : releaseUnavailable ? {
			status: "unavailable",
			reason: "The selected release is not available from ClawHub."
		} : {
			status: "unknown",
			reason: release?.status === "rejected" ? `Selected release details unavailable: ${String(release.reason)}` : releaseMismatch ? "ClawHub returned details for a different release." : "ClawHub does not report downloadability for a selected skill release."
		},
		card: card?.status === "fulfilled" ? {
			status: "available",
			content: card.value
		} : {
			status: "unavailable",
			reason: card?.status === "rejected" ? String(card.reason) : "No published release is available for a skill card."
		},
		requirements: canUseLatest && detail.metadata?.setup ? {
			status: "available",
			setup: detail.metadata.setup,
			os: detail.metadata.os,
			systems: detail.metadata.systems,
			scope: "registry-setup",
			note: "Registry setup keys combine environment and configuration requirements; binary requirements are not reported."
		} : {
			status: "unavailable",
			reason: isLatest ? "ClawHub does not report setup requirements for this release." : "ClawHub reports structured setup requirements only for the latest release."
		},
		security: validSecurity ? {
			status: "available",
			scanStatus: security.status,
			hasWarnings: security.hasWarnings,
			hasScanResult: security.hasScanResult,
			checkedAt: typeof security.checkedAt === "number" ? security.checkedAt : null,
			summary: typeof security.scanners?.llm?.summary === "string" ? security.scanners.llm.summary : null,
			virustotalUrl: typeof security.virustotalUrl === "string" ? security.virustotalUrl : null
		} : {
			status: "unavailable",
			reason: "ClawHub has no security scan snapshot for this release."
		},
		warnings,
		skill: detail.skill ? {
			...detail.skill,
			icon: resolveClawHubImageUrl(detail.skill.icon, registry)
		} : null,
		owner: detail.owner ? {
			...detail.owner,
			image: resolveClawHubImageUrl(detail.owner.image, registry)
		} : detail.owner
	};
}
async function fetchClawHubSkillInstallResolution(params) {
	return await withClawHubResponse({
		...params,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/install`,
		search: {
			ownerHandle: params.ownerHandle,
			reference: params.requestedReference,
			forceInstall: params.forceInstall ? "1" : void 0
		}
	}, async ({ response, url, hasToken }) => {
		const isStructuredBlock = [
			403,
			409,
			410,
			423
		].includes(response.status);
		if (!response.ok && !isStructuredBlock) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
		return parseClawHubJsonBody(response, url, params.timeoutMs);
	});
}
async function fetchClawHubSkillVerification(params) {
	return await fetchClawHubJson({
		...params,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/verify`,
		maxResponseBytes: SKILL_VERIFICATION_MAX_BYTES,
		search: {
			...buildVersionOrTagSearch(params),
			reference: params.requestedReference
		}
	});
}
async function fetchClawHubSkillSecurityVerdicts(params) {
	return await fetchClawHubJson({
		...params,
		path: "/api/v1/skills/-/security-verdicts",
		method: "POST",
		json: { items: params.items }
	});
}
async function fetchClawHubSkillCard(params) {
	const cardUrl = normalizeOptionalString(params.url);
	const slug = normalizeOptionalString(params.slug);
	if (!cardUrl && !slug) throw new Error("ClawHub skill card fetch requires a slug or card URL");
	const providedToken = normalizeOptionalString(params.token);
	const skipAuth = cardUrl != null && providedToken == null && new URL(cardUrl, `${resolveClawHubBaseUrl(params.baseUrl)}/`).origin !== new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`).origin;
	return await withClawHubResponse({
		...params,
		url: cardUrl,
		path: slug ? `/api/v1/skills/${encodeURIComponent(slug)}/card` : void 0,
		token: providedToken,
		search: cardUrl ? void 0 : buildVersionOrTagSearch(params),
		skipAuth
	}, async ({ response, url, hasToken }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
		const bytes = await readClawHubBytes({
			response,
			maxBytes: SKILL_CARD_MAX_BYTES,
			timeoutMs: params.timeoutMs,
			resourceLabel: slug ? `skill card for ${slug}` : `skill card at ${url.pathname}`
		});
		return decodeClawHubResponseBody(bytes);
	});
}
async function reportClawHubSkillInstallTelemetry(params) {
	return await reportClawHubInstallTelemetry(params, () => {
		const slug = params.slug.trim();
		return slug ? {
			event: "install",
			slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { reference: params.requestedReference } : {},
			...params.trustState ? { trustState: params.trustState } : {},
			version: params.version ?? void 0
		} : void 0;
	});
}
//#endregion
export { fetchClawHubSkillCatalog as a, fetchClawHubSkillSecurityVerdicts as c, searchClawHubSkills as d, fetchClawHubSkillCard as i, fetchClawHubSkillVerification as l, CLAWHUB_SKILLS_SH_TRUST_LABEL as n, fetchClawHubSkillDetail as o, CLAWHUB_SKILLS_SH_TRUST_STATE as r, fetchClawHubSkillInstallResolution as s, CLAWHUB_SKILLS_SH_REF_PREFIX as t, reportClawHubSkillInstallTelemetry as u };
