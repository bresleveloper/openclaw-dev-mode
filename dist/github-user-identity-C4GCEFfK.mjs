import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { O as normalizeGitHubLogin } from "./user-profile-list-B5pNqyXa.mjs";
import { g as classifyTailscaleLogin, h as resolveCanonicalCachedGitHubIdentity } from "./user-profiles-BA6bh7Le.mjs";
import { n as ensureCanonicalUserProfileForEmail, o as syncCanonicalGitHubIdentity } from "./user-profile-writes-ColUfz03.mjs";
import { n as gitHubPublicApi, r as githubApiToken } from "./github-public-api-GYcLjPMx.mjs";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/host-account-name.ts
let cachedName;
async function readAccountCommand(command, args) {
	try {
		const { stdout } = await runExec(command, args, {
			timeoutMs: 1e3,
			maxBuffer: 16384,
			logOutput: false
		});
		return stdout;
	} catch {
		return null;
	}
}
async function readHostAccountName() {
	if (process.platform !== "darwin" && process.platform !== "linux") return null;
	const { username } = os.userInfo();
	const normalizeName = (value) => {
		const name = value?.trim();
		return name && name.toLowerCase() !== username.toLowerCase() ? truncateUtf16Safe(name, 256) : null;
	};
	if (process.platform === "darwin") {
		const fullName = normalizeName(await readAccountCommand("/usr/bin/id", ["-F"]));
		if (fullName) return fullName;
		return normalizeName((await readAccountCommand("/usr/bin/dscl", [
			".",
			"-read",
			`/Users/${username}`,
			"RealName"
		]))?.replace(/^RealName:\s*/u, ""));
	}
	const fields = (await readAccountCommand("getent", ["passwd", username]) ?? await fs.readFile("/etc/passwd", "utf8")).split("\n").find((line) => line.split(":", 1)[0] === username)?.split(":");
	return normalizeName(fields?.[4]?.split(",", 1)[0]);
}
/** Best-effort human name for the gateway host account; never seeds a login name. */
function resolveHostAccountName() {
	cachedName ??= readHostAccountName().catch(() => null);
	return cachedName;
}
//#endregion
//#region src/gateway/gateway-owner-profile.ts
/** Owner attribution never supplies a verified login or changes operator authority. */
function shouldUseGatewayOwnerProfile(params) {
	return params.role === "operator" && !params.authenticatedUserId && (!params.rolesConfigured || params.authMethod === "token" || params.authMethod === "password");
}
//#endregion
//#region src/gateway/github-user-identity.ts
const CLOUDFLARE_ACCESS_USER_HEADER = "cf-access-authenticated-user-email";
const CLOUDFLARE_ACCESS_ASSERTION_HEADER = "cf-access-jwt-assertion";
const CLOUDFLARE_ACCESS_HOST_SUFFIX = ".cloudflareaccess.com";
const CLOUDFLARE_ACCESS_IDENTITY_PATH = "/cdn-cgi/access/get-identity";
const ACCESS_ASSERTION_MAX_BYTES = 16384;
const ACCESS_IDENTITY_MAX_BYTES = 65536;
const JWT_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/u;
const GITHUB_IDENTITY_CACHE_MS = 9e5;
const GITHUB_IDENTITY_CACHE_LIMIT = 200;
const GITHUB_ETAG_MAX_LENGTH = 1024;
const identityMetadataCaches = /* @__PURE__ */ new WeakMap();
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function cloudflareAccessIssuer(assertion) {
	if (Buffer.byteLength(assertion, "utf8") > ACCESS_ASSERTION_MAX_BYTES) throw new Error("Cloudflare Access assertion is invalid");
	const segments = assertion.split(".");
	if (segments.length !== 3 || segments.some((segment) => !JWT_SEGMENT_PATTERN.test(segment))) throw new Error("Cloudflare Access assertion is invalid");
	let payload;
	try {
		payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf8"));
	} catch {
		throw new Error("Cloudflare Access assertion is invalid");
	}
	if (!isRecord(payload) || typeof payload.iss !== "string") throw new Error("Cloudflare Access assertion issuer is invalid");
	let issuer;
	try {
		issuer = new URL(payload.iss);
	} catch {
		throw new Error("Cloudflare Access assertion issuer is invalid");
	}
	if (issuer.protocol !== "https:" || issuer.username || issuer.password || issuer.port || issuer.pathname !== "/" || issuer.search || issuer.hash || !issuer.hostname.endsWith(CLOUDFLARE_ACCESS_HOST_SUFFIX)) throw new Error("Cloudflare Access assertion issuer is invalid");
	return issuer;
}
async function resolveCloudflareAccessIdentity(assertion, authenticatedPrincipal, oidcConfig) {
	const issuer = cloudflareAccessIssuer(assertion);
	let payload;
	try {
		const response = await fetch(`${issuer.origin}${CLOUDFLARE_ACCESS_IDENTITY_PATH}`, {
			headers: { Cookie: `CF_Authorization=${assertion}` },
			redirect: "manual",
			signal: AbortSignal.timeout(gitHubPublicApi.GITHUB_REQUEST_TIMEOUT_MS)
		});
		if (!response.ok) {
			await response.body?.cancel().catch(() => {});
			throw new Error("identity response was not successful");
		}
		const body = await gitHubPublicApi.readBoundedResponse(response, ACCESS_IDENTITY_MAX_BYTES);
		payload = JSON.parse(body.toString("utf8"));
	} catch {
		throw new Error("Cloudflare Access identity lookup failed");
	}
	if (!isRecord(payload)) throw new Error("Cloudflare Access identity response is invalid");
	const email = typeof payload.email === "string" ? payload.email.trim() : "";
	if (!email || email.toLowerCase() !== authenticatedPrincipal.trim().toLowerCase()) throw new Error("Cloudflare Access identity principal did not match");
	if (!isRecord(payload.idp)) throw new Error("Cloudflare Access identity provider is invalid");
	if (payload.idp.type === "oidc") {
		if (!oidcConfig || issuer.origin !== oidcConfig.issuer || payload.idp.id !== oidcConfig.providerId || !isRecord(payload.oidc_fields) || !Object.hasOwn(payload.oidc_fields, oidcConfig.githubAccountIdClaim)) return { provider: "oidc" };
		const claim = payload.oidc_fields[oidcConfig.githubAccountIdClaim];
		if (typeof claim !== "string" || !/^[1-9][0-9]*$/u.test(claim) || !Number.isSafeInteger(Number(claim))) throw new Error("Cloudflare Access OIDC GitHub account id is invalid");
		return {
			provider: "oidc",
			accountId: Number(claim)
		};
	}
	if (payload.idp.type !== "github") throw new Error("Cloudflare Access identity provider is unsupported");
	if (typeof payload.id !== "number" || !Number.isSafeInteger(payload.id) || payload.id <= 0) throw new Error("Cloudflare Access GitHub account id is invalid");
	const initialDisplayName = typeof payload.name === "string" && payload.name.trim() ? payload.name : void 0;
	return {
		provider: "github",
		accountId: payload.id,
		...initialDisplayName ? { initialDisplayName } : {}
	};
}
async function resolveGitHubUserIdentityByLogin(username) {
	const requestedLogin = normalizeGitHubLogin(username);
	if (!requestedLogin) throw new TypeError("GitHub username is invalid");
	const token = githubApiToken();
	let payload;
	try {
		payload = await gitHubPublicApi.fetchGitHubJson(`${gitHubPublicApi.GITHUB_API_ORIGIN}/users/${encodeURIComponent(requestedLogin)}`, fetch, token);
	} catch (error) {
		if (error instanceof gitHubPublicApi.ControlUiGitHubError) throw error;
		throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub request failed");
	}
	if (!isRecord(payload)) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub response was not an object");
	const accountId = payload.id;
	if (!Number.isSafeInteger(accountId) || typeof accountId !== "number" || accountId <= 0) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub response omitted a valid account id");
	return parseGitHubUserIdentity(accountId, payload);
}
function parseGitHubUserIdentity(accountId, payload) {
	if (!isRecord(payload) || payload.id !== accountId) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub account id did not match");
	const login = typeof payload.login === "string" ? normalizeGitHubLogin(payload.login) : void 0;
	if (!login) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub response omitted a valid login");
	return {
		accountId,
		login,
		name: readNonBlankString(payload.name)
	};
}
function resolveGitHubUserIdentityById(accountId, token, fetchImpl) {
	const cache = identityMetadataCaches.get(fetchImpl) ?? {
		values: /* @__PURE__ */ new Map(),
		pending: /* @__PURE__ */ new Map()
	};
	identityMetadataCaches.set(fetchImpl, cache);
	const key = `${accountId}:${gitHubPublicApi.githubApiCredentialCacheScope(token)}`;
	const cached = cache.values.get(key);
	if (cached && cached.expiresAt > Date.now()) return Promise.resolve({
		identity: cached.identity,
		refreshed: false
	});
	const promise = getOrCreatePromise(cache.pending, key, async () => {
		try {
			const response = await gitHubPublicApi.fetchGitHubApi(`${gitHubPublicApi.GITHUB_API_ORIGIN}/user/${accountId}`, fetchImpl, token, void 0, void 0, cached?.etag);
			let identity;
			if (response.status === 304 && cached?.etag) {
				await gitHubPublicApi.discardResponse(response);
				identity = cached.identity;
			} else identity = parseGitHubUserIdentity(accountId, await gitHubPublicApi.readGitHubJsonResponse(response));
			const rawEtag = response.headers.get("etag") ?? (response.status === 304 ? cached?.etag : void 0);
			const etag = rawEtag && rawEtag.length <= GITHUB_ETAG_MAX_LENGTH ? rawEtag : void 0;
			if (cache.pending.get(key) === promise) {
				cache.values.set(key, {
					identity,
					etag,
					expiresAt: Date.now() + GITHUB_IDENTITY_CACHE_MS
				});
				pruneMapToMaxSize(cache.values, GITHUB_IDENTITY_CACHE_LIMIT);
			}
			return identity;
		} catch (error) {
			if (cache.pending.get(key) === promise && error instanceof gitHubPublicApi.ControlUiGitHubError && !error.retryable) cache.values.delete(key);
			throw error;
		}
	}, { evictOnSettled: true });
	pruneMapToMaxSize(cache.pending, GITHUB_IDENTITY_CACHE_LIMIT);
	return promise.then((identity) => ({
		identity,
		refreshed: true
	}));
}
function cloudflareAccessAssertion(params) {
	const trustedProxy = params.authConfig?.trustedProxy;
	if (!params.authResult.ok || params.authResult.method !== "trusted-proxy" || params.authConfig?.mode !== "trusted-proxy" || normalizeLowercaseStringOrEmpty(trustedProxy?.userHeader) !== CLOUDFLARE_ACCESS_USER_HEADER || !trustedProxy?.requiredHeaders?.some((header) => normalizeLowercaseStringOrEmpty(header) === CLOUDFLARE_ACCESS_ASSERTION_HEADER)) return;
	const principal = params.authResult.user?.trim();
	const assertion = headerValue(params.requestHeaders?.[CLOUDFLARE_ACCESS_ASSERTION_HEADER])?.trim();
	return principal && assertion ? {
		assertion,
		principal
	} : void 0;
}
function createAuthenticatedGitHubIdentitySync(params) {
	const options = { assertCurrent: params.assertCurrent };
	const tailscaleLogin = params.authResult.tailscaleIdentity ? classifyTailscaleLogin(params.authResult.tailscaleIdentity.login) : void 0;
	if (tailscaleLogin?.kind === "provider" && tailscaleLogin.provider === "github") return createLazyPromise(async () => {
		params.assertCurrent?.();
		const identity = await resolveGitHubUserIdentityByLogin(tailscaleLogin.subject);
		params.assertCurrent?.();
		const profile = await syncCanonicalGitHubIdentity({
			identity,
			authenticationAlias: {
				kind: "github-login",
				login: tailscaleLogin.subject
			},
			initialDisplayName: params.authResult.tailscaleIdentity?.name
		}, options);
		params.assertCurrent?.();
		return {
			profileId: profile.id,
			updatedAt: profile.updatedAt
		};
	});
	const access = cloudflareAccessAssertion(params);
	if (!access) return;
	return createLazyPromise(async () => {
		params.assertCurrent?.();
		const accessIdentity = await resolveCloudflareAccessIdentity(access.assertion, access.principal, params.authConfig?.trustedProxy?.cloudflareAccessOidc);
		params.assertCurrent?.();
		const accountId = accessIdentity.accountId;
		if (accountId === void 0) {
			const profile = await ensureCanonicalUserProfileForEmail(access.principal, options);
			params.assertCurrent?.();
			return {
				profileId: profile.id,
				updatedAt: profile.updatedAt
			};
		}
		const identityBinding = {
			accountId,
			email: access.principal
		};
		const token = githubApiToken();
		let lookup;
		try {
			lookup = await gitHubPublicApi.withOptionalGitHubAuth(token, (requestToken) => resolveGitHubUserIdentityById(accountId, requestToken, fetch));
		} catch (error) {
			if (error instanceof gitHubPublicApi.ControlUiGitHubError && error.retryable) {
				params.assertCurrent?.();
				const cached = await resolveCanonicalCachedGitHubIdentity(identityBinding);
				params.assertCurrent?.();
				if (cached) return cached;
			}
			throw error instanceof gitHubPublicApi.ControlUiGitHubError ? error : new gitHubPublicApi.ControlUiGitHubError(502, "GitHub request failed");
		}
		params.assertCurrent?.();
		if (!lookup.refreshed) {
			const cached = await resolveCanonicalCachedGitHubIdentity(identityBinding);
			params.assertCurrent?.();
			if (cached) return cached;
		}
		const profile = await syncCanonicalGitHubIdentity({
			identity: lookup.identity,
			authenticationAlias: {
				kind: "email",
				email: access.principal
			},
			initialDisplayName: accessIdentity.provider === "github" ? accessIdentity.initialDisplayName : void 0,
			preserveEmailProfile: accessIdentity.provider === "oidc"
		}, options);
		params.assertCurrent?.();
		return {
			profileId: profile.id,
			updatedAt: profile.updatedAt
		};
	});
}
//#endregion
export { shouldUseGatewayOwnerProfile as n, resolveHostAccountName as r, createAuthenticatedGitHubIdentitySync as t };
