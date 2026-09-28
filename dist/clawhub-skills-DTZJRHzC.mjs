import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { _ as resolveClawHubBaseUrl, a as isClawHubTelemetryDisabled, g as resolveClawHubAuthToken, i as fetchClawHubJson, l as readClawHubBytes, n as createClawHubError, r as decodeClawHubResponseBody, s as parseClawHubJsonBody, v as resolveClawHubImageUrl, y as withClawHubResponse } from "./clawhub-client-D8cfvjQG.mjs";
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
	if (version) return {
		version,
		...ownerHandle ? { ownerHandle } : {}
	};
	const tag = normalizeOptionalString(params.tag);
	if (tag) return {
		tag,
		...ownerHandle ? { ownerHandle } : {}
	};
	return ownerHandle ? { ownerHandle } : void 0;
}
async function searchClawHubSkills(params) {
	const registry = resolveClawHubBaseUrl(params.baseUrl);
	const query = params.query.trim();
	const request = {
		baseUrl: registry,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
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
	return entries.flatMap((entry) => {
		const mapped = toClawHubSkillSearchResult(entry, registry);
		return mapped ? [mapped] : [];
	});
}
/**
* Records each result's own source once, here, so no consumer rebuilds it. A row whose source is
* unknown, or whose external reference is missing, is dropped rather than published under
* `@owner/slug`: that spelling would point install at a different publisher's skill.
*/
function toClawHubSkillSearchResult(entry, registry) {
	const { install: _install, source: _source, ...rest } = entry;
	const base = {
		...rest,
		registry,
		icon: resolveClawHubImageUrl(entry.icon, registry)
	};
	const source = normalizeOptionalString(entry.source);
	const installKind = normalizeOptionalString(entry.install?.kind);
	const reference = normalizeOptionalString(entry.install?.reference);
	if (installKind && !CLAWHUB_SUPPORTED_INSTALL_KINDS.has(installKind)) return;
	switch (source) {
		case CLAWHUB_SKILLS_SH_SOURCE_KIND:
			if (!reference?.startsWith("skills-sh:")) return;
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
			} : void 0;
		}
		default: return;
	}
}
async function fetchClawHubSkillDetail(params) {
	const detail = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: params.ownerHandle ? { ownerHandle: params.ownerHandle } : void 0
	});
	return {
		...detail,
		skill: detail.skill ? {
			...detail.skill,
			icon: resolveClawHubImageUrl(detail.skill.icon, params.baseUrl)
		} : null
	};
}
async function fetchClawHubSkillInstallResolution(params) {
	return await withClawHubResponse({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/install`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
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
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/verify`,
		maxResponseBytes: SKILL_VERIFICATION_MAX_BYTES,
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			...buildVersionOrTagSearch(params),
			reference: params.requestedReference
		}
	});
}
async function fetchClawHubSkillSecurityVerdicts(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/skills/-/security-verdicts",
		method: "POST",
		json: { items: params.items },
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubSkillCard(params) {
	const cardUrl = normalizeOptionalString(params.url);
	const slug = normalizeOptionalString(params.slug);
	if (!cardUrl && !slug) throw new Error("ClawHub skill card fetch requires a slug or card URL");
	const providedToken = normalizeOptionalString(params.token);
	const skipAuth = cardUrl != null && providedToken == null && new URL(cardUrl, `${resolveClawHubBaseUrl(params.baseUrl)}/`).origin !== new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`).origin;
	return await withClawHubResponse({
		baseUrl: params.baseUrl,
		url: cardUrl,
		path: slug ? `/api/v1/skills/${encodeURIComponent(slug)}/card` : void 0,
		token: providedToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
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
	const token = normalizeOptionalString(params.token) ?? await resolveClawHubAuthToken();
	if (!token || isClawHubTelemetryDisabled()) return;
	const slug = params.slug.trim();
	if (!slug) return;
	return await withClawHubResponse({
		baseUrl: params.baseUrl,
		path: "/api/cli/telemetry/install",
		method: "POST",
		token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		json: {
			event: "install",
			slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { reference: params.requestedReference } : {},
			...params.trustState ? { trustState: params.trustState } : {},
			version: params.version ?? void 0
		}
	}, async ({ response, url, hasToken }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	});
}
//#endregion
export { fetchClawHubSkillDetail as a, fetchClawHubSkillVerification as c, fetchClawHubSkillCard as i, reportClawHubSkillInstallTelemetry as l, CLAWHUB_SKILLS_SH_TRUST_LABEL as n, fetchClawHubSkillInstallResolution as o, CLAWHUB_SKILLS_SH_TRUST_STATE as r, fetchClawHubSkillSecurityVerdicts as s, CLAWHUB_SKILLS_SH_REF_PREFIX as t, searchClawHubSkills as u };
