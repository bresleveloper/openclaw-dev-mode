import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { b as parseStrictPositiveInteger, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { i as parseComparableSemver, t as compareComparableSemver } from "./semver-compare-ComZ6Fah.js";
import { n as readResponseWithLimit, t as readResponseTextSnippet } from "./read-response-with-limit-MDCSJrlg.js";
import { a as parseSemver, n as isAtLeast } from "./runtime-guard-DFX4PxCB.js";
import { n as createTempDownloadTarget } from "./temp-download-BObIC861.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/infra/clawhub.ts
const DEFAULT_CLAWHUB_URL = "https://clawhub.ai";
const DEFAULT_GITHUB_CODELOAD_URL = "https://codeload.github.com";
const DEFAULT_FETCH_TIMEOUT_MS = 3e4;
const SKILL_CARD_MAX_BYTES = 256 * 1024;
const CLAWHUB_JSON_MAX_BYTES = 16 * 1024 * 1024;
const CLAWHUB_ERROR_BODY_MAX_BYTES = 8 * 1024;
const CLAWHUB_ERROR_BODY_MAX_CHARS = 400;
function resolveClawHubRequestTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_FETCH_TIMEOUT_MS);
}
var ClawHubRequestError = class extends Error {
	constructor(params) {
		super(`ClawHub ${params.path} failed (${params.status}): ${params.body}`);
		this.name = "ClawHubRequestError";
		this.status = params.status;
		this.requestPath = params.path;
		this.responseBody = params.body;
	}
};
function normalizeBaseUrl(baseUrl) {
	const envValue = normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_URL) || normalizeOptionalString(process.env.CLAWHUB_URL) || DEFAULT_CLAWHUB_URL;
	return (normalizeOptionalString(baseUrl) || envValue).replace(/\/+$/, "") || DEFAULT_CLAWHUB_URL;
}
function normalizeGitHubCodeloadBaseUrl() {
	return (normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_GITHUB_CODELOAD_BASE_URL) || normalizeOptionalString(process.env.CLAWHUB_GITHUB_CODELOAD_BASE_URL) || DEFAULT_GITHUB_CODELOAD_URL).replace(/\/+$/, "") || DEFAULT_GITHUB_CODELOAD_URL;
}
function extractTokenFromClawHubConfig(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return normalizeOptionalString(record.accessToken) ?? normalizeOptionalString(record.authToken) ?? normalizeOptionalString(record.apiToken) ?? normalizeOptionalString(record.token) ?? extractTokenFromClawHubConfig(record.auth) ?? extractTokenFromClawHubConfig(record.session) ?? extractTokenFromClawHubConfig(record.credentials) ?? extractTokenFromClawHubConfig(record.user);
}
function resolveClawHubConfigPaths() {
	const explicit = normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_CONFIG_PATH) || normalizeOptionalString(process.env.CLAWHUB_CONFIG_PATH) || normalizeOptionalString(process.env.CLAWDHUB_CONFIG_PATH);
	if (explicit) return [explicit];
	const xdgConfigHome = normalizeOptionalString(process.env.XDG_CONFIG_HOME);
	const configHome = xdgConfigHome && xdgConfigHome.length > 0 ? xdgConfigHome : path.join(os.homedir(), ".config");
	const xdgPath = path.join(configHome, "clawhub", "config.json");
	if (process.platform === "darwin") return [path.join(os.homedir(), "Library", "Application Support", "clawhub", "config.json"), xdgPath];
	return [xdgPath];
}
async function resolveClawHubAuthToken() {
	const envToken = normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_TOKEN) || normalizeOptionalString(process.env.CLAWHUB_TOKEN) || normalizeOptionalString(process.env.CLAWHUB_AUTH_TOKEN);
	if (envToken) return envToken;
	for (const configPath of resolveClawHubConfigPaths()) try {
		const raw = await fs.readFile(configPath, "utf8");
		const token = extractTokenFromClawHubConfig(JSON.parse(raw));
		if (token) return token;
	} catch {}
}
function normalizePartialComparableVersion(version) {
	const trimmed = version.trim();
	return /^[vV]?[0-9]+\.[0-9]+$/.test(trimmed) ? {
		version: `${trimmed}.0`,
		isPartial: true
	} : {
		version: trimmed,
		isPartial: false
	};
}
function compareSemver(left, right) {
	return compareComparableSemver(parseComparableSemver(normalizePartialComparableVersion(left).version), parseComparableSemver(normalizePartialComparableVersion(right).version));
}
function upperBoundForCaret(version) {
	const parsed = parseComparableSemver(normalizePartialComparableVersion(version).version);
	if (!parsed) return null;
	if (parsed.major > 0) return `${parsed.major + 1}.0.0`;
	if (parsed.minor > 0) return `0.${parsed.minor + 1}.0`;
	return `0.0.${parsed.patch + 1}`;
}
function matchWildcardComparator(token) {
	const match = /^(>=|<=|>|<|=|\^|~)?\s*([*xX])$/.exec(token);
	if (!match) return null;
	const operator = match[1];
	return operator === ">" || operator === "<" ? "none" : "any";
}
function shouldPreservePluginApiPrereleaseFloor(target) {
	return Boolean(parseComparableSemver(normalizePartialComparableVersion(target).version)?.prerelease?.length);
}
function normalizePluginApiVersionForComparator(version, target) {
	const normalizedCorrection = normalizeOpenClawNumericCorrectionForPluginApi(version);
	if (normalizedCorrection) return normalizedCorrection;
	return shouldPreservePluginApiPrereleaseFloor(target) ? version : normalizeOpenClawReleaseSuffixForPluginApi(version);
}
function satisfiesComparator(version, token) {
	const trimmed = token.trim();
	if (!trimmed) return true;
	const wildcard = matchWildcardComparator(trimmed);
	if (wildcard) return wildcard === "any" && parseComparableSemver(version) != null;
	if (trimmed.startsWith("^")) {
		const base = trimmed.slice(1).trim();
		const upperBound = upperBoundForCaret(base);
		const comparableVersion = normalizePluginApiVersionForComparator(version, base);
		const lowerCmp = compareSemver(comparableVersion, base);
		const upperCmp = upperBound ? compareSemver(comparableVersion, upperBound) : null;
		return lowerCmp != null && upperCmp != null && lowerCmp >= 0 && upperCmp < 0;
	}
	const match = /^(>=|<=|>|<|=)?\s*(.+)$/.exec(trimmed);
	if (!match) return false;
	const operator = match[1];
	const target = match[2]?.trim();
	if (!target) return false;
	const comparableVersion = normalizePluginApiVersionForComparator(version, target);
	const normalizedTarget = normalizePartialComparableVersion(target);
	const cmp = compareSemver(comparableVersion, normalizedTarget.version);
	if (cmp == null) return false;
	switch (operator) {
		case ">=": return cmp >= 0;
		case "<=": return cmp <= 0;
		case ">": return cmp > 0;
		case "<": return cmp < 0;
		default: return normalizedTarget.isPartial && !operator ? cmp >= 0 : cmp === 0;
	}
}
function satisfiesSemverRange(version, range) {
	const tokens = normalizeStringEntries(range.trim().split(/\s+/));
	if (tokens.length === 0) return false;
	return tokens.every((token) => satisfiesComparator(version, token));
}
const OPENCLAW_RELEASE_SUFFIX_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)(?:-\d+|-(?:alpha|beta|rc)\.\d+)$/i;
const OPENCLAW_NUMERIC_CORRECTION_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)-\d+$/;
function normalizeOpenClawNumericCorrectionForPluginApi(pluginApiVersion) {
	return OPENCLAW_NUMERIC_CORRECTION_PATTERN.exec(pluginApiVersion.trim())?.[1];
}
function normalizeOpenClawReleaseSuffixForPluginApi(pluginApiVersion) {
	return OPENCLAW_RELEASE_SUFFIX_PATTERN.exec(pluginApiVersion.trim())?.[1] ?? pluginApiVersion;
}
function buildUrl(params) {
	if (params.url) {
		const url = new URL(params.url, `${normalizeBaseUrl(params.baseUrl)}/`);
		for (const [key, value] of Object.entries(params.search ?? {})) {
			if (!value) continue;
			url.searchParams.set(key, value);
		}
		return url;
	}
	if (!params.path) throw new Error("ClawHub request path is required");
	const url = new URL(`${normalizeBaseUrl(params.baseUrl)}/`);
	url.pathname = `${url.pathname.replace(/\/+$/, "")}${params.path.startsWith("/") ? params.path : `/${params.path}`}`;
	for (const [key, value] of Object.entries(params.search ?? {})) {
		if (!value) continue;
		url.searchParams.set(key, value);
	}
	return url;
}
async function clawhubRequest(params) {
	const url = buildUrl(params);
	const token = params.skipAuth ? void 0 : normalizeOptionalString(params.token) || await resolveClawHubAuthToken();
	const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`ClawHub request timed out after ${timeoutMs}ms`)), timeoutMs);
	try {
		const headers = {
			...token ? { Authorization: `Bearer ${token}` } : {},
			...params.json === void 0 ? {} : { "Content-Type": "application/json" }
		};
		const init = { signal: controller.signal };
		if (params.method) init.method = params.method;
		if (Object.keys(headers).length > 0) init.headers = headers;
		if (params.json !== void 0) init.body = JSON.stringify(params.json);
		return {
			response: await (params.fetchImpl ?? fetch)(url, init),
			url,
			hasToken: Boolean(token)
		};
	} finally {
		clearTimeout(timeout);
	}
}
async function readErrorBody(response, timeoutMs) {
	try {
		return await readResponseTextSnippet(response, {
			maxBytes: CLAWHUB_ERROR_BODY_MAX_BYTES,
			maxChars: CLAWHUB_ERROR_BODY_MAX_CHARS,
			chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs)
		}) || response.statusText || `HTTP ${response.status}`;
	} catch {
		return response.statusText || `HTTP ${response.status}`;
	}
}
async function buildClawHubError(response, url, hasToken, timeoutMs) {
	let body = await readErrorBody(response, timeoutMs);
	if (response.status === 429) {
		const suffix = formatRateLimitSuffix(response.headers, hasToken);
		if (suffix) body = `${body} ${suffix}`;
	}
	return new ClawHubRequestError({
		path: url.pathname,
		status: response.status,
		body
	});
}
function formatRateLimitSuffix(headers, hasToken) {
	const reset = normalizeHeaderValue(headers.get("RateLimit-Reset")) ?? normalizeHeaderValue(headers.get("Retry-After"));
	const segments = [];
	if (reset && Number.isFinite(Number(reset))) segments.push(`(resets in ${reset}s)`);
	if (!hasToken) segments.push("Sign in for higher rate limits.");
	return segments.join(" ");
}
async function fetchJson(params) {
	const { response, url, hasToken } = await clawhubRequest(params);
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	return parseClawHubJsonBody(response, url, params.timeoutMs);
}
async function parseClawHubJsonBody(response, url, timeoutMs) {
	const buffer = await readResponseWithLimit(response, CLAWHUB_JSON_MAX_BYTES, {
		chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs),
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`ClawHub ${url.pathname} response exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`ClawHub ${url.pathname} response stalled after ${chunkTimeoutMs}ms`)
	});
	try {
		return JSON.parse(new TextDecoder().decode(buffer));
	} catch (cause) {
		throw new Error(`ClawHub ${url.pathname} returned malformed JSON`, { cause });
	}
}
async function readClawHubResponseBytes(params) {
	const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
	return await readResponseWithLimit(params.response, params.maxBytes ?? Number.MAX_SAFE_INTEGER, {
		chunkTimeoutMs: timeoutMs,
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`ClawHub ${params.resourceLabel} exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`ClawHub ${params.resourceLabel} body stalled after ${chunkTimeoutMs}ms`)
	});
}
/** Resolves the configured ClawHub base URL, falling back to the default public host. */
function resolveClawHubBaseUrl(baseUrl) {
	return normalizeBaseUrl(baseUrl);
}
function isDefaultClawHubBaseUrl(baseUrl) {
	return normalizeBaseUrl(baseUrl) === normalizeBaseUrl(DEFAULT_CLAWHUB_URL);
}
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
function buildGitHubZipUrl(repo, commit) {
	const url = new URL(`${normalizeGitHubCodeloadBaseUrl()}/`);
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/${repo.split("/").map((segment) => encodeURIComponent(segment)).join("/")}/zip/${encodeURIComponent(commit)}`;
	return url.toString();
}
function formatSha256Integrity(bytes) {
	return `sha256-${createHash("sha256").update(bytes).digest("base64")}`;
}
function formatSha256Hex(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}
function formatSha512Integrity(bytes) {
	return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}
function formatSha1Hex(bytes) {
	return createHash("sha1").update(bytes).digest("hex");
}
function normalizeHeaderValue(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length > 0 ? normalized : void 0;
}
function safePackageTarballName(name, version) {
	return `${name.replace(/^@/, "").replace(/[\\/]+/g, "-").replace(/[^A-Za-z0-9._-]/g, "-") || "package"}-${version}.tgz`;
}
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
async function fetchClawHubPackageDetail(params) {
	return await fetchJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubPackageVersion(params) {
	return await fetchJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubPackageArtifact(params) {
	return await fetchJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function searchClawHubPackages(params) {
	return (await fetchJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/packages/search",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			q: params.query.trim(),
			family: params.family,
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? [];
}
async function searchClawHubSkills(params) {
	return (await fetchJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/search",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			q: params.query.trim(),
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? [];
}
async function fetchClawHubSkillDetail(params) {
	return await fetchJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: params.ownerHandle ? { ownerHandle: params.ownerHandle } : void 0
	});
}
async function fetchClawHubSkillInstallResolution(params) {
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/install`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			ownerHandle: params.ownerHandle,
			forceInstall: params.forceInstall ? "1" : void 0
		}
	});
	const isStructuredBlock = [
		403,
		409,
		410,
		423
	].includes(response.status);
	if (!response.ok && !isStructuredBlock) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	return parseClawHubJsonBody(response, url, params.timeoutMs);
}
async function fetchClawHubSkillVerification(params) {
	return await fetchJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/verify`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: buildVersionOrTagSearch(params)
	});
}
async function fetchClawHubSkillSecurityVerdicts(params) {
	return await fetchJson({
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
	const explicitToken = normalizeOptionalString(params.token);
	const skipAuth = cardUrl != null && explicitToken == null && new URL(cardUrl, `${normalizeBaseUrl(params.baseUrl)}/`).origin !== new URL(`${normalizeBaseUrl(params.baseUrl)}/`).origin;
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		url: cardUrl,
		path: slug ? `/api/v1/skills/${encodeURIComponent(slug)}/card` : void 0,
		token: explicitToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: cardUrl ? void 0 : buildVersionOrTagSearch(params),
		skipAuth
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubResponseBytes({
		response,
		maxBytes: SKILL_CARD_MAX_BYTES,
		timeoutMs: params.timeoutMs,
		resourceLabel: slug ? `skill card for ${slug}` : `skill card at ${url.pathname}`
	});
	return new TextDecoder().decode(bytes);
}
async function downloadClawHubPackageArchive(params) {
	if (params.artifact === "clawpack") {
		if (!params.version) throw new Error("ClawPack package downloads require an explicit version.");
		const { response, url, hasToken } = await clawhubRequest({
			baseUrl: params.baseUrl,
			path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact/download`,
			token: params.token,
			timeoutMs: params.timeoutMs,
			fetchImpl: params.fetchImpl
		});
		if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
		const bytes = await readClawHubResponseBytes({
			response,
			timeoutMs: params.timeoutMs,
			resourceLabel: `ClawPack download for ${params.name}@${params.version}`
		});
		const sha256Hex = formatSha256Hex(bytes);
		const npmIntegrity = formatSha512Integrity(bytes);
		const npmShasum = formatSha1Hex(bytes);
		const headerSha256 = normalizeClawHubSha256Hex(response.headers.get("X-ClawHub-Artifact-Sha256") ?? response.headers.get("X-ClawHub-ClawPack-Sha256") ?? "");
		if (!headerSha256) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" is missing X-ClawHub-Artifact-Sha256.`);
		if (headerSha256 !== sha256Hex) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared sha256 ${headerSha256}, got ${sha256Hex}.`);
		const headerNpmIntegrity = normalizeHeaderValue(response.headers.get("X-ClawHub-Npm-Integrity"));
		if (headerNpmIntegrity && headerNpmIntegrity !== npmIntegrity) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm integrity ${headerNpmIntegrity}, got ${npmIntegrity}.`);
		const headerNpmShasum = normalizeHeaderValue(response.headers.get("X-ClawHub-Npm-Shasum"));
		if (headerNpmShasum && headerNpmShasum !== npmShasum) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm shasum ${headerNpmShasum}, got ${npmShasum}.`);
		const npmTarballName = normalizeHeaderValue(response.headers.get("X-ClawHub-Npm-Tarball-Name")) ?? safePackageTarballName(params.name, params.version);
		const specVersion = parseStrictPositiveInteger(response.headers.get("X-ClawHub-ClawPack-Spec-Version"));
		const target = await createTempDownloadTarget({
			prefix: "openclaw-clawhub-clawpack",
			fileName: npmTarballName,
			tmpDir: os.tmpdir()
		});
		await fs.writeFile(target.path, bytes);
		return {
			archivePath: target.path,
			integrity: normalizeClawHubSha256Integrity(sha256Hex) ?? formatSha256Integrity(bytes),
			sha256Hex,
			artifact: "clawpack",
			clawpackHeaderSha256: headerSha256,
			...typeof specVersion === "number" && Number.isSafeInteger(specVersion) && specVersion >= 0 ? { clawpackHeaderSpecVersion: specVersion } : {},
			npmIntegrity,
			npmShasum,
			npmTarballName,
			cleanup: target.cleanup
		};
	}
	const search = params.version ? { version: params.version } : params.tag ? { tag: params.tag } : void 0;
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/download`,
		search,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubResponseBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `package archive download for ${params.name}`
	});
	const sha256Hex = formatSha256Hex(bytes);
	const target = await createTempDownloadTarget({
		prefix: "openclaw-clawhub-package",
		fileName: `${params.name}.zip`,
		tmpDir: os.tmpdir()
	});
	await fs.writeFile(target.path, bytes);
	return {
		archivePath: target.path,
		integrity: formatSha256Integrity(bytes),
		sha256Hex,
		artifact: "archive",
		cleanup: target.cleanup
	};
}
async function downloadClawHubSkillArchive(params) {
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		path: "/api/v1/download",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			slug: params.slug,
			ownerHandle: params.ownerHandle,
			version: params.version,
			tag: params.version ? void 0 : params.tag
		}
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubResponseBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `skill archive download for ${params.slug}`
	});
	const sha256Hex = formatSha256Hex(bytes);
	const target = await createTempDownloadTarget({
		prefix: "openclaw-clawhub-skill",
		fileName: `${params.slug}.zip`,
		tmpDir: os.tmpdir()
	});
	await fs.writeFile(target.path, bytes);
	return {
		archivePath: target.path,
		integrity: formatSha256Integrity(bytes),
		sha256Hex,
		artifact: "archive",
		cleanup: target.cleanup
	};
}
async function downloadClawHubSkillArchiveUrl(params) {
	const explicitToken = normalizeOptionalString(params.token);
	const requestUrl = new URL(params.url, `${normalizeBaseUrl(params.baseUrl)}/`);
	const registryOrigin = new URL(`${normalizeBaseUrl(params.baseUrl)}/`).origin;
	const skipAuth = explicitToken == null && requestUrl.origin !== registryOrigin;
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		url: params.url,
		token: explicitToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		skipAuth
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubResponseBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `skill archive download at ${url.pathname}`
	});
	const sha256Hex = formatSha256Hex(bytes);
	const target = await createTempDownloadTarget({
		prefix: "openclaw-clawhub-skill",
		fileName: "skill.zip",
		tmpDir: os.tmpdir()
	});
	await fs.writeFile(target.path, bytes);
	return {
		archivePath: target.path,
		integrity: formatSha256Integrity(bytes),
		sha256Hex,
		artifact: "archive",
		cleanup: target.cleanup
	};
}
async function downloadClawHubGitHubSkillArchive(params) {
	const { response, url, hasToken } = await clawhubRequest({
		url: buildGitHubZipUrl(params.repo, params.commit),
		skipAuth: true,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubResponseBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `GitHub source archive for ${params.repo}@${params.commit}`
	});
	const sha256Hex = formatSha256Hex(bytes);
	const target = await createTempDownloadTarget({
		prefix: "openclaw-clawhub-github-skill",
		fileName: `${params.commit}.zip`,
		tmpDir: os.tmpdir()
	});
	await fs.writeFile(target.path, bytes);
	return {
		archivePath: target.path,
		integrity: formatSha256Integrity(bytes),
		sha256Hex,
		artifact: "archive",
		cleanup: target.cleanup
	};
}
async function reportClawHubSkillInstallTelemetry(params) {
	const token = normalizeOptionalString(params.token) ?? await resolveClawHubAuthToken();
	if (!token || isClawHubTelemetryDisabled()) return;
	const skills = Object.entries(params.skills).map(([slug, entry]) => ({
		slug,
		version: entry.version ?? null
	})).filter((entry) => entry.slug.length > 0);
	const { response, url, hasToken } = await clawhubRequest({
		baseUrl: params.baseUrl,
		path: "/api/cli/telemetry/install",
		method: "POST",
		token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		json: { roots: [{
			rootId: createHash("sha256").update(path.resolve(params.root)).digest("hex"),
			label: formatTelemetryRootLabel(params.root),
			skills
		}] }
	});
	if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
}
function isClawHubTelemetryDisabled() {
	const raw = process.env.CLAWHUB_DISABLE_TELEMETRY ?? process.env.CLAWDHUB_DISABLE_TELEMETRY;
	if (!raw) return false;
	return [
		"1",
		"true",
		"yes",
		"on"
	].includes(raw.trim().toLowerCase());
}
function formatTelemetryRootLabel(root) {
	const home = os.homedir();
	const absolute = path.resolve(root);
	if (absolute === home) return "~";
	const normalized = absolute.replaceAll("\\", "/");
	const normalizedHome = home.replaceAll("\\", "/");
	const withinHome = normalized.startsWith(`${normalizedHome}/`);
	const tail = (withinHome ? normalized.slice(normalizedHome.length + 1) : normalized).split("/").filter(Boolean).slice(-2).join("/");
	return withinHome ? `~/${tail}` : tail || absolute;
}
/** Resolves the preferred latest package version from detail metadata. */
function resolveLatestVersionFromPackage(detail) {
	return detail.package?.latestVersion ?? detail.package?.tags?.latest ?? null;
}
/** Checks whether a host plugin API version satisfies a ClawHub plugin API range. */
function satisfiesPluginApiRange(pluginApiVersion, pluginApiRange) {
	if (!pluginApiRange) return true;
	return satisfiesSemverRange(pluginApiVersion, pluginApiRange);
}
/** Checks whether the current gateway version satisfies a package minimum gateway version. */
function satisfiesGatewayMinimum(currentVersion, minGatewayVersion) {
	if (!minGatewayVersion) return true;
	const current = parseSemver(currentVersion);
	const minimum = parseSemver(minGatewayVersion);
	if (!current || !minimum) return false;
	return isAtLeast(current, minimum);
}
//#endregion
export { searchClawHubSkills as C, searchClawHubPackages as S, reportClawHubSkillInstallTelemetry as _, downloadClawHubSkillArchiveUrl as a, satisfiesGatewayMinimum as b, fetchClawHubPackageVersion as c, fetchClawHubSkillInstallResolution as d, fetchClawHubSkillSecurityVerdicts as f, normalizeClawHubSha256Integrity as g, normalizeClawHubSha256Hex as h, downloadClawHubSkillArchive as i, fetchClawHubSkillCard as l, isDefaultClawHubBaseUrl as m, downloadClawHubGitHubSkillArchive as n, fetchClawHubPackageArtifact as o, fetchClawHubSkillVerification as p, downloadClawHubPackageArchive as r, fetchClawHubPackageDetail as s, ClawHubRequestError as t, fetchClawHubSkillDetail as u, resolveClawHubBaseUrl as v, satisfiesPluginApiRange as x, resolveLatestVersionFromPackage as y };
