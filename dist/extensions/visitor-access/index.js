import { buildPluginConfigSchema, createPluginRuntimeStore, definePluginEntry } from "./api.js";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { z } from "zod";
import { resolveGatewayPublicOrigin } from "openclaw/plugin-sdk/config-contracts";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
import { createHash, randomUUID } from "node:crypto";
import { listAgentIds, resolveAgentConfig, tryResolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
// src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
// packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
// src/plugins/http-path-prefix.ts
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
// src/gateway/security-path.ts
const MAX_PATH_DECODE_PASSES = 32;
function normalizePathSeparators(pathname) {
	const collapsed = pathname.replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed;
	return collapsed.replace(/\/+$/, "");
}
function normalizePathForSecurity(pathname) {
	return normalizePathSeparators(normalizeLowercaseStringOrEmpty(URL.parse(pathname, "http://localhost")?.pathname ?? pathname)) || "/";
}
function buildCanonicalPathCandidates(pathname) {
	const candidates = /* @__PURE__ */ new Set([normalizePathForSecurity(pathname)]);
	let decoded = pathname;
	let malformedEncoding = false;
	for (let pass = 0; pass < MAX_PATH_DECODE_PASSES; pass++) {
		let nextDecoded;
		try {
			nextDecoded = decodeURIComponent(decoded);
		} catch {
			malformedEncoding = true;
			break;
		}
		if (nextDecoded === decoded) break;
		decoded = nextDecoded;
		candidates.add(normalizePathForSecurity(decoded));
	}
	let decodePassLimitReached = false;
	if (!malformedEncoding) try {
		decodePassLimitReached = decodeURIComponent(decoded) !== decoded;
	} catch {
		malformedEncoding = true;
	}
	return {
		candidates: [...candidates],
		decodePassLimitReached,
		malformedEncoding
	};
}
function canonicalizePathForSecurity(pathname) {
	const { candidates, decodePassLimitReached, malformedEncoding } = buildCanonicalPathCandidates(pathname);
	return {
		canonicalPath: candidates[candidates.length - 1] ?? "/",
		candidates,
		decodePassLimitReached,
		malformedEncoding,
		rawNormalizedPath: normalizePathSeparators(normalizeLowercaseStringOrEmpty(pathname)) || "/"
	};
}
const PROTECTED_PLUGIN_ROUTE_PREFIXES = ["/api/channels"];
// src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
// \0openclaw:bundled-sdk:openclaw/plugin-sdk/gateway-config-runtime
var gateway_config_runtime_exports = /* @__PURE__ */ __exportAll({
	classifyGatewayProbePath: () => classifyGatewayProbePath,
	isProtectedPluginRoutePathFromContext: () => isProtectedPluginRoutePathFromContext,
	resolvePluginRoutePathContext: () => resolvePluginRoutePathContext
});
import * as import_openclaw_plugin_sdk_gateway_config_runtime from "openclaw/plugin-sdk/gateway-config-runtime";
__reExport(gateway_config_runtime_exports, import_openclaw_plugin_sdk_gateway_config_runtime);
// extensions/visitor-access/src/errors.ts
/** Only curated operator-facing messages cross the tool/log boundary. */
var VisitorAccessError = class extends Error {};
function visitorErrorText(error, apiToken) {
	return (error instanceof VisitorAccessError ? error.message : "Visitor access operation failed. Check gateway health and retry; use visitor_list to inspect drift.").replaceAll(apiToken, "[redacted]");
}
// extensions/visitor-access/src/roles.ts
/** Match the Gateway's current assignment/default fallback, not a person's display identity. */
function profileUsesVisitorRole(roles, profile) {
	return profile.id !== "gateway-owner" && (!profile.role || profile.role === roles?.default || !Object.hasOwn(roles?.definitions ?? {}, profile.role));
}
function isRestrictedVisitorRole(role) {
	return role.accessPolicyPlugin === "visitor-access" && role.sessions.others === "view" && role.sandbox === "required" && role.modelPolicy !== void 0 && (role.agents === "*" || role.agents.length > 0) && role.scopes.includes("operator.sessions.write") && role.scopes.every((scope) => scope === "operator.sessions.read" || scope === "operator.sessions.write");
}
/** Visitor Access manages the configured default; other assigned roles remain independently owned. */
function resolveVisitorRole(config) {
	const roles = config.gateway?.roles;
	const name = roles?.default;
	const role = name && roles && Object.hasOwn(roles.definitions, name) ? roles.definitions[name] : void 0;
	if (!name || !role || !isRestrictedVisitorRole(role)) throw new VisitorAccessError("Visitor Access requires gateway.roles.default to allow isolated own-session work and shared-session viewing with only operator.sessions.write and optional operator.sessions.read scopes, accessPolicyPlugin: \"visitor-access\", and an explicit modelPolicy. Use modelPolicy: {} for the source agent's primary and fallbacks, and configure exclusions before enabling guest access.");
	return name;
}
// extensions/visitor-access/src/access.ts
function createVisitorAccessReader(runtime) {
	return async (githubAccountIds = []) => {
		const { profiles, githubProfiles } = await runtime.gateway.request("users.list", githubAccountIds.length ? { githubAccountIds: [...new Set(githubAccountIds)] } : {}, { scopes: ["operator.read"] });
		const canonical = profiles.filter((profile) => !profile.mergedInto);
		const byEmail = new Map(canonical.flatMap((profile) => profile.emails.map((email) => [email, profile])));
		const byId = new Map(canonical.map((profile) => [profile.id, profile]));
		const byGithub = new Map(githubProfiles?.map(({ accountId, profileId }) => [accountId, byId.get(profileId)]));
		const profile = (target) => typeof target === "string" ? byEmail.get(target) : byGithub.get(target);
		const config = runtime.config.current();
		const roles = (0, gateway_config_runtime_exports.isNamedOperatorRoleEnforcementEnabled)(config) ? config.gateway?.roles : void 0;
		const access = (target) => describeAccess(profile(target), roles);
		return {
			describe: (target) => access(target).description,
			githubLogin: (target) => {
				const identity = profile(target)?.githubIdentity;
				return (identity?.host ?? "github.com") === "github.com" ? identity?.login : void 0;
			},
			assertGithubSelection(login, accountId) {
				const normalized = login.toLowerCase();
				const matches = canonical.filter((entry) => (entry.githubIdentity?.host ?? "github.com") === "github.com" && entry.githubIdentity?.login.toLowerCase() === normalized);
				if (matches.length > 1 || matches[0] && matches[0].id !== profile(accountId)?.id) throw new VisitorAccessError("The GitHub login conflicts with the Gateway's verified profile. Use a current profileId, grantId, or exact invitation email.");
			},
			profileId: (target) => profile(target)?.id,
			resolveProfile: (profileId) => byId.get(profileId),
			withProfile(profileId, targets, run) {
				const withIdentity = runtime.gateway.withUserProfileIdentity;
				if (!withIdentity) throw new VisitorAccessError("This Gateway cannot keep profile bindings current. Update OpenClaw before person-wide revocation.");
				return withIdentity({
					profileId,
					emails: targets.filter((target) => typeof target === "string"),
					githubAccountIds: targets.filter((target) => typeof target === "number")
				}, run);
			},
			assertInvitable(target) {
				resolveVisitorRole(config);
				const result = access(target);
				if (!result.invitable) throw new VisitorAccessError(`${result.description}. Configure a default role with isolated own-session work and shared-session viewing before inviting this person.`);
			}
		};
	};
}
function describeAccess(profile, roles) {
	if (profile && !profileUsesVisitorRole(roles, {
		id: profile.id,
		role: profile.effectiveRole ?? profile.role
	})) return {
		invitable: true,
		description: profile.id === "gateway-owner" ? "Gateway access: shared owner authority retained; this invitation does not restrict it" : `Gateway access: existing role ${JSON.stringify(profile.effectiveRole ?? profile.role)} retained; this invitation does not restrict it`
	};
	if (!roles) return {
		invitable: false,
		description: "Gateway access is unrestricted: roles are disabled"
	};
	const assignedRole = profile?.role && Object.hasOwn(roles.definitions, profile.role) ? profile.role : void 0;
	const roleName = profile?.effectiveRole ?? assignedRole ?? roles.default;
	const role = roleName && Object.hasOwn(roles.definitions, roleName) ? roles.definitions[roleName] : void 0;
	if (!role) return {
		invitable: false,
		description: `Gateway access could not be verified: default role ${JSON.stringify(roleName ?? "")} is unavailable`
	};
	const source = profile?.roleSource === "githubLogin" ? "GitHub login" : profile?.roleSource ?? (assignedRole ? "assigned" : "default");
	const identity = !profile ? "; first sign-in pending" : profile.role && !assignedRole ? `; unavailable assignment ${JSON.stringify(profile.role)}` : "";
	if (isRestrictedVisitorRole(role)) return {
		invitable: true,
		description: `Gateway access: restricted guest (${source} role ${JSON.stringify(roleName)}${identity})`
	};
	return {
		invitable: false,
		description: `Gateway default role ${JSON.stringify(roleName)} does not provide restricted guest access`
	};
}
// extensions/visitor-access/src/cloudflare.ts
const policyReferenceSchema = z.object({
	id: z.string().min(1).max(128).refine((value) => value !== "." && value !== ".."),
	name: z.string()
});
const emailRuleSchema = z.strictObject({ email: z.strictObject({ email: z.email().max(254) }) });
const githubRuleSchema = z.strictObject({ oidc: z.strictObject({
	identity_provider_id: z.string().min(1),
	claim_name: z.string().min(1),
	claim_value: z.string().regex(/^[1-9][0-9]*$/u).refine((value) => Number.isSafeInteger(Number(value)))
}) });
const managedPolicySchema = policyReferenceSchema.extend({
	decision: z.literal("allow"),
	include: z.array(z.union([emailRuleSchema, githubRuleSchema])).max(1e4),
	exclude: z.array(z.unknown()).max(0).optional(),
	require: z.array(z.unknown()).max(0).optional()
}).passthrough();
const responseSchema = z.object({
	success: z.literal(true),
	result: z.unknown(),
	result_info: z.object({
		total_pages: z.number().int().nonnegative().optional(),
		total_count: z.number().int().nonnegative().optional(),
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional()
	}).optional()
});
const accountUserSchema = z.object({
	access_seat: z.boolean(),
	gateway_seat: z.boolean(),
	seat_uid: z.string().min(1).optional()
});
const entitlementSchema = z.object({
	id: z.string(),
	deleted_date: z.string(),
	allocation: z.unknown()
});
const seatAllocationSchema = z.object({
	type: z.literal("max_count"),
	value: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
});
function requireGithubProvider(provider) {
	if (!provider) throw new VisitorAccessError("GitHub account invitations require the existing trusted-proxy Cloudflare Access OIDC provider and GitHub account-ID claim mapping. Configure that sign-in mapping before inviting by GitHub account.");
	return provider;
}
function visitorTargetKey(target) {
	return typeof target === "string" ? target : `github:${target}`;
}
var VisitorPolicyClient = class {
	constructor(config, fetcher = fetch, signal, readGithubProvider) {
		this.config = config;
		this.fetcher = fetcher;
		this.signal = signal;
		this.readGithubProvider = readGithubProvider;
		this.accountUrl = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}`;
		this.policiesUrl = `${this.accountUrl}/access/apps/${encodeURIComponent(config.appId)}/policies`;
	}
	async read(assertCurrent) {
		const policy = await this.readPolicy(assertCurrent);
		return policy ? {
			id: policy.id,
			targets: this.policyTargets(policy)
		} : void 0;
	}
	async update(change, assertCurrent) {
		const policy = await this.readPolicy(assertCurrent);
		const configured = this.readGithubProvider?.();
		const githubProvider = configured && { ...configured };
		const current = policy ? this.policyTargets(policy, githubProvider) : [];
		if (this.signal?.aborted) throw new VisitorAccessError("Visitor access is stopping; retry after the gateway starts.");
		const targets = [...new Set(await change(current))];
		const usesGithub = [...current, ...targets].some((target) => typeof target === "number");
		const assertPolicyCurrent = () => {
			assertCurrent?.();
			if (usesGithub) {
				const currentProvider = this.readGithubProvider?.();
				if (currentProvider?.issuer !== githubProvider?.issuer || currentProvider?.providerId !== githubProvider?.providerId || currentProvider?.githubAccountIdClaim !== githubProvider?.githubAccountIdClaim) throw new VisitorAccessError("The GitHub account-ID mapping changed; inspect the visitor policy before retrying.");
				requireGithubProvider(githubProvider);
			}
		};
		assertPolicyCurrent();
		if (targets.length === current.length && targets.every((target) => current.includes(target))) return targets;
		if (policy && targets.length === 0) {
			await this.request(`${this.policiesUrl}/${encodeURIComponent(policy.id)}`, "DELETE", void 0, assertPolicyCurrent);
			assertPolicyCurrent();
			return targets;
		}
		const payload = { ...policy };
		for (const key of [
			"id",
			"account_id",
			"created_at",
			"updated_at"
		]) delete payload[key];
		payload.name = this.config.policyName;
		payload.decision = "allow";
		payload.include = targets.map((target) => {
			if (typeof target === "string") return { email: { email: target } };
			const provider = requireGithubProvider(githubProvider);
			return { oidc: {
				identity_provider_id: provider.providerId,
				claim_name: provider.githubAccountIdClaim,
				claim_value: String(target)
			} };
		});
		const url = policy ? `${this.policiesUrl}/${encodeURIComponent(policy.id)}` : this.policiesUrl;
		await this.request(url, policy ? "PUT" : "POST", payload, assertPolicyCurrent);
		assertPolicyCurrent();
		return targets;
	}
	async readAccountSeats(assertCurrent) {
		const deadline = AbortSignal.timeout(1e4);
		const diagnostics = [];
		const observe = async (label, read) => {
			try {
				const value = await read();
				assertCurrent?.();
				this.signal?.throwIfAborted();
				return value;
			} catch (error) {
				assertCurrent?.();
				this.signal?.throwIfAborted();
				diagnostics.push(`${label} unavailable: ${error instanceof VisitorAccessError ? error.message : "Cloudflare returned invalid seat data or the observation timed out; inspect account seats."}`);
				return null;
			}
		};
		const read = (suffix, permission) => this.request(`${this.accountUrl}${suffix}`, "GET", void 0, assertCurrent, {
			permission,
			signal: deadline
		});
		const [capacity, occupied] = await Promise.all([observe("Seat allocation", async () => {
			const response = await read("/entitlements", "Account Read");
			const active = z.array(entitlementSchema).max(1e4).parse(response.result).filter((entry) => entry.id === "teams.users_allowed" && entry.deleted_date === "");
			if (active.length !== 1) throw new VisitorAccessError("No unique current teams.users_allowed allocation; inspect the account entitlements.");
			return seatAllocationSchema.parse(active[0].allocation).value;
		}), observe("Seat occupancy", async () => {
			const seats = /* @__PURE__ */ new Set();
			let count = 0;
			for (let page = 1; page <= 100; page++) {
				const response = await read(`/access/users?page=${page}&per_page=100`, "Access: Audit Logs Read");
				const users = z.array(accountUserSchema).max(1e3).parse(response.result);
				count += users.length;
				for (const user of users) if (user.access_seat || user.gateway_seat) {
					if (!user.seat_uid) throw new VisitorAccessError("An occupied user has no seat ID; inspect the account users.");
					seats.add(user.seat_uid);
				}
				const info = response.result_info;
				if (info?.page !== void 0 && info.page !== page) throw new VisitorAccessError("Cloudflare returned a different users page; retry the seat observation.");
				if (info?.total_pages === void 0 ? users.length < (info?.per_page ?? 100) : page >= info.total_pages) {
					if (info?.total_count !== void 0 && count !== info.total_count) throw new VisitorAccessError("Cloudflare returned an incomplete users list; retry the seat observation.");
					return seats.size;
				}
			}
			throw new VisitorAccessError("The account users list exceeds the inspection limit; inspect seats in Cloudflare.");
		})]);
		const remaining = capacity === null || occupied === null ? null : Math.max(0, capacity - occupied);
		return {
			status: remaining === null ? "unknown" : remaining === 0 ? "full" : "available",
			capacity,
			occupied,
			remaining,
			diagnostics: diagnostics.toSorted()
		};
	}
	assertGithubConfigured() {
		return requireGithubProvider(this.readGithubProvider?.());
	}
	policyTargets(policy, githubProvider = this.readGithubProvider?.()) {
		return [...new Set(policy.include.map((rule) => {
			if ("email" in rule) return rule.email.email.toLowerCase();
			const provider = requireGithubProvider(githubProvider);
			if (rule.oidc.identity_provider_id !== provider.providerId || rule.oidc.claim_name !== provider.githubAccountIdClaim) throw new VisitorAccessError("The visitor policy has an OIDC rule outside the configured GitHub account-ID mapping; inspect the policy before retrying.");
			return Number(rule.oidc.claim_value);
		}))];
	}
	async readPolicy(assertCurrent) {
		let reference;
		for (let page = 1; page <= 100; page += 1) {
			const response = await this.request(`${this.policiesUrl}?page=${page}&per_page=100`, "GET", void 0, assertCurrent);
			const policies = z.array(policyReferenceSchema).max(100).safeParse(response.result);
			if (!policies.success) throw new VisitorAccessError("Cloudflare returned an invalid policy list; inspect the Access application.");
			for (const policy of policies.data) {
				if (policy.name !== this.config.policyName) continue;
				if (reference) throw new VisitorAccessError("Multiple Access policies have the configured visitor policy name; make the name unique before retrying.");
				reference = policy;
			}
			const totalPages = response.result_info?.total_pages;
			const pageSize = response.result_info?.per_page ?? 100;
			if (totalPages === void 0 ? policies.data.length < pageSize : page >= totalPages) {
				if (!reference) return;
				const detail = await this.request(`${this.policiesUrl}/${encodeURIComponent(reference.id)}`, "GET", void 0, assertCurrent);
				const parsed = managedPolicySchema.safeParse(detail.result);
				if (!parsed.success || parsed.data.id !== reference.id || parsed.data.name !== this.config.policyName) throw new VisitorAccessError("The visitor policy changed or is not a supported email/GitHub-account allow policy. Inspect its name, decision, include, require, and exclude rules before retrying.");
				return parsed.data;
			}
		}
		throw new VisitorAccessError("The Access application has too many policies to inspect safely; reduce its policy count before retrying.");
	}
	async request(url, method, body, assertCurrent, options = {}) {
		let response;
		assertCurrent?.();
		try {
			response = await this.fetcher(url, {
				method,
				headers: {
					Authorization: `Bearer ${this.config.apiToken}`,
					"Content-Type": "application/json"
				},
				body: body === void 0 ? void 0 : JSON.stringify(body),
				redirect: "error",
				signal: AbortSignal.any([
					...this.signal ? [this.signal] : [],
					...options.signal ? [options.signal] : [],
					AbortSignal.timeout(3e4)
				])
			});
		} catch {
			throw new VisitorAccessError("Cloudflare request failed; check connectivity and retry. Policy state may need reconciliation.");
		}
		if (!response.ok) throw new VisitorAccessError(`Cloudflare request failed (HTTP ${response.status}); check the token's ${options.permission ?? "Access policy"} permissions and retry.`);
		const data = await readProviderJsonResponse(response, "Cloudflare").catch(() => {
			throw new VisitorAccessError("Cloudflare returned an unreadable response; retry and inspect the visitor policy.");
		});
		const parsed = responseSchema.safeParse(data);
		if (!parsed.success) throw new VisitorAccessError("Cloudflare did not confirm the request; inspect the visitor policy before retrying.");
		return parsed.data;
	}
};
// extensions/visitor-access/src/config.ts
const visitorConfigSchema = z.strictObject({
	accountId: z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
	appId: z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
	apiToken: z.string().min(1),
	policyName: z.string().trim().min(1).max(200).default("Visitors (openclaw-managed)"),
	defaultTtlDays: z.number().int().min(0).max(3650).nullable().default(14),
	maxVisitors: z.number().int().min(1).max(500).default(50)
});
const visitorLimitsSchema = visitorConfigSchema.pick({
	maxVisitors: true,
	defaultTtlDays: true
}).strip();
const visitorPluginSchema = buildPluginConfigSchema(visitorConfigSchema);
// extensions/visitor-access/src/invite-result.ts
/**
* Where a visitor signs in: the operator-declared public Gateway origin plus the Control UI base
* path, as for other external Control UI links. Undefined when the Control UI is disabled or no
* usable gateway.publicOrigin is configured; callers must not substitute a guessed address.
*/
function resolveVisitorSignInUrl({ gateway }) {
	const origin = gateway?.controlUi?.enabled === false ? void 0 : resolveGatewayPublicOrigin({ gateway: { publicOrigin: gateway?.publicOrigin } });
	if (!origin) return;
	const url = new URL(origin);
	url.pathname = gateway?.controlUi?.basePath?.trim() || "/";
	return url.pathname === "/" ? origin : url.href;
}
function expiryText(expiresAt) {
	return expiresAt === null ? "never (explicit forever grant)" : new Date(expiresAt).toISOString();
}
function utcMinute$1(epochMs) {
	return `${new Date(epochMs).toISOString().slice(0, 16).replace("T", " ")} UTC`;
}
function accountSeatsText(seats) {
	return [
		`Cloudflare account seats (shared across applications and devices): ${seats.occupied ?? "unknown"} / ${seats.capacity ?? "unknown"}; ${seats.remaining === null ? "remaining unknown" : `${seats.remaining} remaining`}.`,
		seats.status === "full" ? "WARNING: new login identities cannot obtain a seat while the account is full. Already-seated identities can keep using their seat; renewing an invitation does not allocate another. An account operator must review seat consumers or capacity in Cloudflare One overview. No seats were removed." : seats.status === "unknown" ? "Seat availability is unknown; check Cloudflare One overview before promising a new login." : "This is an observation, not a seat reservation or login guarantee.",
		...seats.diagnostics
	].join(" ");
}
/** Tool result for a committed invite or renewal; the note appears only in the invitation text. */
function visitorInviteResult({ renewed, target, grant, gatewayAccess, signInUrl, noteSupplied, accountSeats }) {
	const { grantId, githubLogin, expiresAt } = grant;
	const who = typeof target === "number" ? `@${githubLogin} (GitHub account ${target})` : githubLogin ? `@${githubLogin} (${target})` : target;
	const noteStored = Boolean(grant.note?.trim());
	const inviter = grant.invitedBy?.label?.replace(/\s+/gu, " ").trim();
	const invitationIdentity = typeof target === "string" ? `the email ${target}` : githubLogin ? `your GitHub account @${githubLogin}` : `the GitHub account with ID ${target}`;
	const message = grant.note?.trim();
	const invitationText = [
		inviter ? `${inviter} invited you to OpenClaw.` : "You're invited to OpenClaw.",
		signInUrl ? `Sign in at ${signInUrl} with ${invitationIdentity}.` : `Ask ${inviter ?? "the person who invited you"} for the OpenClaw sign-in address, then sign in with ${invitationIdentity}.`,
		expiresAt === null ? "Your access does not expire." : `Your access expires on ${utcMinute$1(expiresAt)}.`,
		...message ? [
			"",
			`Note from ${inviter ?? "your inviter"}:`,
			message
		] : []
	].join("\n");
	const identity = typeof target === "number" ? "this GitHub account" : "this email";
	const signIn = signInUrl ? `Sign in at ${signInUrl} using Team's existing login with ${identity}. The link itself does not grant access.` : `No sign-in URL: set gateway.publicOrigin and keep the Control UI enabled to include one. The visitor signs in with ${identity} at the address you share.`;
	const noteStatus = noteStored ? noteSupplied ? " Inviter note stored." : " Existing inviter note kept." : "";
	return {
		text: `${renewed ? "Renewed" : "Invited"} ${who}. Invitation ID: ${grantId}. Visitor grant expires: ${expiryText(expiresAt)}. ${gatewayAccess}. ${signIn}${noteStatus}\n\n${accountSeatsText(accountSeats)}\n\nInvitation text to share with the visitor:\n${invitationText}`,
		details: {
			outcome: renewed ? "renewed" : "invited",
			accountSeats,
			grantId,
			...typeof target === "string" ? { email: target } : { githubAccountId: target },
			...githubLogin ? { githubLogin } : {},
			expiresAt: expiresAt === null ? null : new Date(expiresAt).toISOString(),
			gatewayAccess,
			...signInUrl ? { signInUrl } : {},
			noteStored,
			invitationText
		}
	};
}
// extensions/visitor-access/src/runtime.ts
const visitorRuntimeStore = createPluginRuntimeStore({
	key: "plugin-runtime:visitor-access:active",
	errorMessage: "Start the Gateway with visitor-access enabled before managing visitors."
});
// extensions/visitor-access/src/grant-record.ts
const VISITOR_NOTE_MAX_CHARS = 1e3;
const INVITER_LABEL_MAX_CHARS = 200;
const ONBOARDING_ERROR_MAX_CHARS = 500;
const visitorNoteSchema = z.string().max(VISITOR_NOTE_MAX_CHARS);
/** Grant keys for an identity, checking emails before GitHub accounts. */
function visitorIdentityKeys({ emails, githubAccountIds = [] }) {
	return [...emails.map((email) => email.trim().toLowerCase()), ...githubAccountIds.map(visitorTargetKey)];
}
function visitorGrantTarget(grant) {
	return "email" in grant ? grant.email : grant.githubAccountId;
}
/**
* Renewal keeps the recorded inviter, note, and onboarding progress unless replaced; grants
* recorded before onboarding metadata keep their absent progress. New invitations start pending.
*/
function invitationMetadata(previous, supplied, now) {
	const { invitedBy } = supplied;
	const inviter = invitedBy ? {
		profileId: invitedBy.profileId,
		...invitedBy.label ? { label: invitedBy.label.slice(0, INVITER_LABEL_MAX_CHARS) } : {}
	} : previous?.invitedBy;
	const note = supplied.note ?? previous?.note;
	const onboarding = previous ? previous.onboarding : {
		state: "pending",
		updatedAt: now
	};
	return {
		...inviter ? { invitedBy: inviter } : {},
		...note !== void 0 ? { note } : {},
		...onboarding ? { onboarding } : {}
	};
}
/** Decide one compare-and-set against the current durable record of an active grant. */
function compareAndSetGrantOnboarding(current, { expected, next }, now) {
	const recorded = current.onboarding;
	if (expected === null ? recorded !== void 0 : recorded?.state !== expected.state || recorded.updatedAt !== expected.updatedAt) return {
		applied: false,
		reason: "conflict",
		...recorded ? { onboarding: recorded } : {}
	};
	const { state, welcomeSessionKey, welcomeSessionId, error } = next;
	return {
		applied: true,
		onboarding: {
			state,
			...welcomeSessionKey ? { welcomeSessionKey } : {},
			...welcomeSessionId ? { welcomeSessionId } : {},
			...error ? { error: error.slice(0, ONBOARDING_ERROR_MAX_CHARS) } : {},
			updatedAt: Math.max(now, (recorded?.updatedAt ?? -1) + 1)
		}
	};
}
// extensions/visitor-access/src/tool-results.ts
const expiresAtSchema = Type.Union([Type.String(), Type.Null()], { description: "Null means an explicit forever grant." });
const visitorAccountSeatsSchema = Type.Object({
	status: Type.Union([
		Type.Literal("available"),
		Type.Literal("full"),
		Type.Literal("unknown")
	]),
	capacity: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	occupied: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	remaining: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	diagnostics: Type.Array(Type.String())
}, {
	additionalProperties: false,
	description: "Fresh account-wide seat observation, not reserved capacity or a login guarantee. Null means unavailable, never zero inferred from failure."
});
const visitorInviteDetailsSchema = Type.Object({
	outcome: Type.Union([Type.Literal("invited"), Type.Literal("renewed")]),
	accountSeats: visitorAccountSeatsSchema,
	grantId: Type.String(),
	email: Type.Optional(Type.String()),
	githubAccountId: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	githubLogin: Type.Optional(Type.String()),
	expiresAt: expiresAtSchema,
	gatewayAccess: Type.String(),
	signInUrl: Type.Optional(Type.String({ description: "Absent without gateway.publicOrigin or when the Control UI is disabled." })),
	noteStored: Type.Boolean({ description: "Whether the grant now carries an inviter note." }),
	invitationText: Type.String({ description: "Plain text for the inviter to hand to the visitor; contains no credentials." })
}, {
	additionalProperties: false,
	oneOf: [{ required: ["email"] }, { required: ["githubAccountId"] }]
});
const visitorRevokeDetailsSchema = Type.Object({
	outcome: Type.Union([Type.Literal("revoked"), Type.Literal("not_found")]),
	emails: Type.Array(Type.String()),
	githubAccountIds: Type.Optional(Type.Array(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))),
	githubLogin: Type.Optional(Type.String())
}, { additionalProperties: false });
const visitorListDetailsSchema = Type.Object({
	accountSeats: visitorAccountSeatsSchema,
	counts: Type.Object({
		recorded: Type.Integer(),
		inPolicy: Type.Integer(),
		unmanaged: Type.Integer(),
		missingFromPolicy: Type.Integer()
	}, { additionalProperties: false }),
	grants: Type.Array(Type.Object({
		email: Type.Optional(Type.String({ description: "Grant selector; pass this email to visitor_revoke." })),
		githubAccountId: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		})),
		grantId: Type.Optional(Type.String({ description: "Stable selector for canceling this invitation." })),
		profileId: Type.Optional(Type.String({ description: "Person ID for visitor_revoke." })),
		githubLogin: Type.Optional(Type.String({ description: "Current verified GitHub identity selected by the Gateway profile, when available. Use grantId to cancel one invitation; GitHub input selects its immutable account and the person's recorded grants." })),
		invitedAt: Type.String(),
		expiresAt: expiresAtSchema,
		state: Type.Union([
			Type.Literal("managed"),
			Type.Literal("expired"),
			Type.Literal("missing_from_policy")
		], { description: "Missing policy membership takes precedence; expired grants await provider cleanup." }),
		welcome: Type.Optional(Type.Object({
			state: Type.Union([
				Type.Literal("pending"),
				Type.Literal("ready"),
				Type.Literal("failed")
			]),
			sessionKey: Type.Optional(Type.String({ description: "This invitation's welcome session, once reserved. A deleted session is not recreated." }))
		}, {
			additionalProperties: false,
			description: "Welcome-session progress for this invitation; absent on grants recorded before onboarding."
		})),
		gatewayAccess: Type.String()
	}, {
		additionalProperties: false,
		oneOf: [{ required: ["email"] }, { required: ["githubAccountId"] }]
	})),
	unmanaged: Type.Array(Type.Object({
		email: Type.Optional(Type.String()),
		githubAccountId: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		})),
		gatewayAccess: Type.String()
	}, {
		additionalProperties: false,
		oneOf: [{ required: ["email"] }, { required: ["githubAccountId"] }]
	})),
	omitted: Type.Integer({
		minimum: 0,
		description: "Rows remaining after this page; counts describe the whole inventory."
	}),
	nextCursor: Type.Union([Type.String(), Type.Null()], { description: "Pass as cursor to visitor_list for the next page. Null means complete. A changed inventory requires restarting without cursor; access and metadata are read fresh on each page." })
}, { additionalProperties: false });
const visitorToolErrorSchema = Type.Object({ error: Type.Literal(true) }, { additionalProperties: false });
// extensions/visitor-access/src/tools.ts
const identityFields$1 = {
	github: Type.Optional(Type.String({
		description: "GitHub login, without @.",
		minLength: 1,
		maxLength: 39
	})),
	email: Type.Optional(Type.String({
		description: "Email the visitor uses with Team's existing sign-in.",
		minLength: 1,
		maxLength: 254
	}))
};
const VisitorInviteParameters = Type.Object({
	...identityFields$1,
	days: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650,
		description: "Grant duration in days; cannot be combined with forever."
	})),
	forever: Type.Optional(Type.Boolean({ description: "Explicitly grant access without expiry." })),
	note: Type.Optional(Type.String({
		maxLength: VISITOR_NOTE_MAX_CHARS,
		description: "Free-text message from the inviter to the visitor, included in the invitation text; may include a session link. Replaces the stored note; omit to keep it on renewal."
	}))
}, {
	additionalProperties: false,
	oneOf: [{ required: ["email"] }, { required: ["github"] }]
});
const VisitorInviteOutputSchema = Type.Union([visitorInviteDetailsSchema, visitorToolErrorSchema]);
const VisitorRevokeParameters = Type.Object({
	...identityFields$1,
	profileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	grantId: Type.Optional(Type.String({ format: "uuid" }))
}, { additionalProperties: false });
const VisitorRevokeOutputSchema = Type.Union([visitorRevokeDetailsSchema, visitorToolErrorSchema]);
const VisitorListParameters = Type.Object({
	cursor: Type.Optional(Type.String({
		maxLength: 76,
		description: "Copy nextCursor from the previous page; omit to start an inventory."
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500,
		description: "Maximum rows for this page, also bounded by maxVisitors and output limits."
	}))
}, { additionalProperties: false });
const VisitorListOutputSchema = Type.Union([visitorListDetailsSchema, visitorToolErrorSchema]);
function createVisitorTools(context) {
	let runtime = visitorRuntimeStore.tryGetRuntime();
	const assertCurrent = () => {
		context.assertInvocationCurrent();
		if (context.senderIsOwner !== true) throw new VisitorAccessError("Only administrators and designated owners can manage visitors.");
	};
	return [
		{
			name: "visitor_invite",
			label: "Invite visitor",
			description: "Grant or renew visitor access to the Team Gateway. Requires administrator or designated-owner authority. Provide exactly one Team sign-in email or GitHub login. A GitHub invitation uses the immutable account ID, not public email. Checks restricted guest access and preserves existing assigned roles. Grants expire after the configured duration (14 days by default); forever must be explicit. An optional note from you to the visitor, such as a session link to start from, is stored with the grant; renewal without a note keeps the existing one. Reports fresh shared Cloudflare seat capacity separately from the visitor cap, and warns when a new login cannot obtain a seat. Grant success is not first-login success; existing seats and renewals are never blocked by this diagnostic. Unavailable seat reads are reported, never assumed to be zero. The result includes invitationText: short plain text naming the inviter, sign-in address, identity to use, expiry, and note, ready to hand to the visitor.",
			parameters: VisitorInviteParameters,
			outputSchema: VisitorInviteOutputSchema,
			run: async ({ service, readInviter, readSignInUrl }, raw) => service.invite(raw, {
				assertCurrent,
				invitedVia: context.sessionKey ?? context.agentId,
				invitedBy: await readInviter(),
				signInUrl: readSignInUrl()
			})
		},
		{
			name: "visitor_revoke",
			label: "Revoke visitor",
			description: "Remove the recorded Visitor invitations selected for a profileId, or cancel one invitation by grantId, including before first sign-in. Use the IDs returned by visitor_list or visitor_invite. Person selection keeps the selected identity current at local commit and before policy requests. Already committed expirations remain ended if cleanup fails. Email targets that address. GitHub login targets its immutable account and its person's recorded invitations. An explicit email or GitHub login can remove that target's unmanaged policy entry. Do not combine profileId or grantId with another selector. Preserves saved work, existing PRs and independent staff access. Already absent grants are a no-op.",
			parameters: VisitorRevokeParameters,
			outputSchema: VisitorRevokeOutputSchema,
			run: ({ service }, raw) => service.revoke(raw, assertCurrent)
		},
		{
			name: "visitor_list",
			label: "List visitors",
			description: "List recorded visitor grants, current verified GitHub identities, current Gateway access, invitation and expiry dates, and drift from the Access policy. Includes fresh account-wide Cloudflare seat occupancy/allocation separately from these app-policy counts; full accounts warn about new logins, and unavailable reads stay explicitly unknown. Grant expiry does not describe independent staff access or reclaim account seats. Unmanaged policy targets are reported and retained; missing policy targets are never automatically restored. Start with {}; pass nextCursor as cursor until nextCursor is null to inspect every row. Counts cover the whole inventory; omitted counts rows remaining after this page. If the inventory changes, restart without a cursor. Pages read current access and metadata, not a frozen snapshot.",
			parameters: VisitorListParameters,
			outputSchema: VisitorListOutputSchema,
			run: ({ service }, raw) => service.list(assertCurrent, raw)
		}
	].map(({ name, label, description, parameters, outputSchema, run }) => ({
		name,
		label,
		description,
		parameters,
		outputSchema,
		async execute(_id, raw) {
			runtime ??= visitorRuntimeStore.tryGetRuntime();
			if (!runtime) return {
				...textResult("Start the Gateway with visitor-access enabled before managing visitors.", { error: true }),
				isError: true
			};
			try {
				assertCurrent();
				const { text, details } = await run(runtime, raw);
				return textResult(text, details);
			} catch (error) {
				return {
					...textResult(runtime.errorText(error), { error: true }),
					isError: true
				};
			}
		}
	}));
}
// extensions/visitor-access/src/visitor-input.ts
const emailSchema = z.string().trim().max(254).pipe(z.email()).transform((email) => email.toLowerCase());
const identityFields = {
	github: z.string().trim().min(1).transform((login) => login.toLowerCase()).optional(),
	email: emailSchema.optional()
};
const revokeSchema = z.strictObject({
	...identityFields,
	profileId: z.string().trim().min(1).max(128).optional(),
	grantId: z.uuid().optional()
});
const inviteSchema = z.strictObject({
	...identityFields,
	days: z.number().int().min(1).max(3650).optional(),
	forever: z.boolean().optional(),
	note: visitorNoteSchema.optional()
}).refine((input) => input.email !== void 0 !== (input.github !== void 0));
const listSchema = z.strictObject({
	cursor: z.string().regex(/^v1:[a-f0-9]{64}:[1-9]\d{0,7}$/).optional(),
	limit: z.number().int().min(1).max(500).optional()
});
const grantIdSchema = z.uuid();
function parseVisitorInput(schema, raw) {
	const result = schema.safeParse(raw);
	if (!result.success) throw new VisitorAccessError(`Invalid visitor input. Use a valid email or GitHub login, days from 1 to 3650, or forever: true. A note must be a string of at most ${VISITOR_NOTE_MAX_CHARS} characters.`);
	return result.data;
}
// extensions/visitor-access/src/visitor-list.ts
async function listVisitors(raw, { store, policy: client, readAccess, readLimits, assertCurrent }) {
	const input = listSchema.safeParse(raw);
	if (!input.success) throw new VisitorAccessError("Invalid visitor list input. Use limit from 1 to 500 and the previous nextCursor, or omit cursor to start again.");
	const policyTargets = (await client.read(assertCurrent))?.targets ?? [];
	const targetKeys = new Set(policyTargets.map(visitorTargetKey));
	const entries = (await store.entries()).toSorted((left, right) => left.key.localeCompare(right.key));
	assertCurrent();
	const managed = new Set(entries.map((entry) => entry.key));
	const unmanaged = policyTargets.filter((target) => !managed.has(visitorTargetKey(target))).toSorted((left, right) => visitorTargetKey(left).localeCompare(visitorTargetKey(right)));
	const inventory = createHash("sha256").update(JSON.stringify([entries.map(({ key }) => key), unmanaged.map(visitorTargetKey)])).digest("hex");
	const offset = input.data.cursor ? Number(input.data.cursor.split(":")[2]) : 0;
	const total = entries.length + unmanaged.length;
	if (input.data.cursor && (input.data.cursor.split(":")[1] !== inventory || offset >= total)) throw new VisitorAccessError("Visitor inventory changed or cursor is invalid. Restart visitor_list without cursor.");
	const { maxVisitors } = readLimits();
	const pageSize = Math.min(input.data.limit ?? maxVisitors, maxVisitors);
	const pageEntries = entries.slice(offset, offset + pageSize);
	const pageUnmanaged = unmanaged.slice(Math.max(0, offset - entries.length), Math.max(0, offset + pageSize - entries.length));
	const displayedTargets = [...pageEntries.map(({ value }) => visitorGrantTarget(value)), ...pageUnmanaged];
	const access = await readAccess([...new Set(displayedTargets.filter((target) => typeof target === "number"))]);
	assertCurrent();
	const missing = entries.filter((entry) => !targetKeys.has(entry.key)).length;
	const accountSeats = await client.readAccountSeats(assertCurrent);
	const lines = [`Visitors: ${entries.length} recorded; ${targetKeys.size} in policy. Drift: ${unmanaged.length} unmanaged, ${missing} missing from policy.`, accountSeatsText(accountSeats)];
	const details = {
		accountSeats,
		counts: {
			recorded: entries.length,
			inPolicy: targetKeys.size,
			unmanaged: unmanaged.length,
			missingFromPolicy: missing
		},
		grants: [],
		unmanaged: [],
		omitted: 0,
		nextCursor: null
	};
	const rows = pageEntries.map(({ value: grant }) => {
		const target = visitorGrantTarget(grant);
		const profileId = access.profileId(target);
		const missingFromPolicy = !targetKeys.has(visitorTargetKey(target));
		const expired = grant.expiresAt !== null && grant.expiresAt <= Date.now();
		const state = missingFromPolicy ? "MISSING FROM POLICY" : expired ? "EXPIRED; provider cleanup pending" : "managed";
		const gatewayAccess = access.describe(target);
		const githubLogin = access.githubLogin(target);
		const github = `Verified GitHub: ${githubLogin ? `@${githubLogin}` : "unavailable"}`;
		const welcome = grant.onboarding && {
			state: grant.onboarding.state,
			...grant.onboarding.welcomeSessionKey ? { sessionKey: grant.onboarding.welcomeSessionKey } : {}
		};
		const welcomeText = welcome ? ` | welcome ${welcome.state}${welcome.sessionKey ? ` ${welcome.sessionKey}` : ""}` : "";
		return {
			line: `${visitorTargetKey(target)} | ${github}${profileId ? ` | profileId ${profileId}` : ""}${grant.grantId ? ` | grantId ${grant.grantId}` : ""} | invited ${new Date(grant.createdAt).toISOString()} | grant expires ${expiryText(grant.expiresAt)} | ${state}${welcomeText} | ${gatewayAccess}`,
			grant: {
				...typeof target === "string" ? { email: target } : { githubAccountId: target },
				...grant.grantId ? { grantId: grant.grantId } : {},
				...profileId ? { profileId } : {},
				...githubLogin ? { githubLogin } : {},
				invitedAt: new Date(grant.createdAt).toISOString(),
				expiresAt: grant.expiresAt === null ? null : new Date(grant.expiresAt).toISOString(),
				state: missingFromPolicy ? "missing_from_policy" : expired ? "expired" : "managed",
				...welcome ? { welcome } : {},
				gatewayAccess
			}
		};
	});
	rows.push(...pageUnmanaged.map((target) => {
		const gatewayAccess = access.describe(target);
		return {
			line: `${visitorTargetKey(target)} | UNMANAGED: no grant record; retained until explicit revoke. | ${gatewayAccess}`,
			unmanaged: {
				...typeof target === "string" ? { email: target } : { githubAccountId: target },
				gatewayAccess
			}
		};
	}));
	let length = lines.join("\n").length;
	let shown = 0;
	for (const row of rows) {
		if (length + row.line.length + 1 > 11760) {
			if (shown === 0) throw new VisitorAccessError("A visitor row exceeds the list output budget. Inspect its profile or welcome-session metadata before listing again.");
			break;
		}
		lines.push(row.line);
		if ("grant" in row) details.grants.push(row.grant);
		else details.unmanaged.push(row.unmanaged);
		length += row.line.length + 1;
		shown++;
	}
	details.omitted = total - offset - shown;
	if (details.omitted > 0) {
		details.nextCursor = `v1:${inventory}:${offset + shown}`;
		lines.push(`${details.omitted} entries omitted from this page. Continue visitor_list with cursor: ${details.nextCursor}`);
	}
	assertCurrent();
	return {
		text: lines.join("\n"),
		details
	};
}
// extensions/visitor-access/src/visitors.ts
const DAY_MS = 864e5;
const MAX_TIMER_DELAY_MS = 2147483647;
var VisitorAccessService = class {
	constructor(readLimits, store, policy, logger, readAccess, resolveGitHubAccount, signal) {
		this.readLimits = readLimits;
		this.store = store;
		this.policy = policy;
		this.logger = logger;
		this.readAccess = readAccess;
		this.resolveGitHubAccount = resolveGitHubAccount;
		this.signal = signal;
		this.pending = Promise.resolve();
		this.grants = /* @__PURE__ */ new Map();
		this.ready = false;
		this.closed = false;
	}
	initialize() {
		return this.initialized ??= this.serialize(async () => {
			const entries = await this.store.entries();
			this.assertOpen();
			for (const { value } of entries) if (grantIdSchema.safeParse(value.grantId).success || value.expiresAt !== null && value.expiresAt <= Date.now()) this.publishGrant(value);
			this.ready = true;
			this.scheduleExpiry();
		});
	}
	close() {
		this.closed = true;
		clearTimeout(this.expiryTimer);
		this.expiryTimer = void 0;
		for (const { controller } of this.grants.values()) controller.abort(new VisitorAccessError("Visitor access is stopping."));
		this.grants.clear();
	}
	assertOpen() {
		this.signal?.throwIfAborted();
		if (this.closed) throw new VisitorAccessError("Visitor access is stopping; retry after the Gateway starts.");
	}
	authorize(emails, githubAccountIds = []) {
		return this.readAuthority(emails, void 0, githubAccountIds);
	}
	/** An unavailable grant map must leave durable requests pending. */
	resume(emails, grantId, githubAccountIds = []) {
		return this.readAuthority(emails, grantId, githubAccountIds);
	}
	/** The first current grant among target keys, optionally with an exact grantId. */
	findActiveGrant(keys, grantId) {
		this.assertOpen();
		if (!this.ready) throw new VisitorAccessError("Visitor access is starting; retry shortly.");
		const now = Date.now();
		for (const key of keys) {
			const entry = this.grants.get(key);
			if (entry !== void 0 && (grantId === void 0 || entry.grant.grantId === grantId) && grantIdSchema.safeParse(entry.grant.grantId).success && !entry.controller.signal.aborted && (entry.grant.expiresAt === null || entry.grant.expiresAt > now)) return entry;
		}
	}
	/** Plugin-internal onboarding API; see README "Onboarding record". */
	findActiveInvitation(grantId) {
		const state = this.findActiveGrant(this.grants.keys(), grantId);
		return state && {
			...structuredClone(state.grant),
			grantId
		};
	}
	/** Plugin-internal onboarding API; see README "Onboarding record". */
	compareAndSetOnboarding(params) {
		return this.serialize(async () => {
			const state = this.findActiveGrant(this.grants.keys(), params.grantId);
			if (!state) return {
				applied: false,
				reason: "inactive"
			};
			const key = visitorTargetKey(visitorGrantTarget(state.grant));
			const store = this.actionStore(() => {
				params.assertCurrent?.();
				if (!this.findActiveGrant([key], params.grantId)) throw new VisitorAccessError("Visitor access ended during onboarding. Invite again to retry.");
			});
			const current = await store.lookup(key);
			if (!current || current.grantId !== params.grantId) return {
				applied: false,
				reason: "inactive"
			};
			const result = compareAndSetGrantOnboarding(current, params, Date.now());
			if (result.applied) await this.registerGrant({
				...current,
				onboarding: result.onboarding
			}, store);
			return structuredClone(result);
		}, params.assertCurrent);
	}
	readAuthority(emails, grantId, githubAccountIds = []) {
		const state = this.findActiveGrant(visitorIdentityKeys({
			emails,
			githubAccountIds
		}), grantId);
		if (!state) return;
		const assertCurrent = () => {
			this.assertOpen();
			if (state.grant.expiresAt !== null && state.grant.expiresAt <= Date.now()) state.controller.abort(new VisitorAccessError("Visitor access expired."));
			if (this.grants.get(visitorTargetKey(visitorGrantTarget(state.grant))) !== state || state.controller.signal.aborted) throw new VisitorAccessError("Visitor access ended. Ask a maintainer to renew access.");
		};
		return Object.freeze({
			grantId: state.grant.grantId,
			assertCurrent,
			signal: this.signal ? AbortSignal.any([state.controller.signal, this.signal]) : state.controller.signal
		});
	}
	publishGrant(grant) {
		if (this.closed) return;
		const key = visitorTargetKey(visitorGrantTarget(grant));
		const previous = this.grants.get(key);
		if (previous && previous.grant.grantId !== grant.grantId) previous.controller.abort(new VisitorAccessError("Visitor access was replaced."));
		if (previous && previous.grant.expiresAt !== null && previous.grant.expiresAt <= Date.now()) previous.controller.abort(new VisitorAccessError("Visitor access expired."));
		const state = previous && !previous.controller.signal.aborted ? previous : {
			grant,
			controller: new AbortController()
		};
		state.grant = grant;
		this.grants.set(key, state);
		if (grant.expiresAt !== null && grant.expiresAt <= Date.now()) state.controller.abort(new VisitorAccessError("Visitor access ended."));
	}
	scheduleExpiry() {
		clearTimeout(this.expiryTimer);
		this.expiryTimer = void 0;
		if (this.closed) return;
		let next = Infinity;
		for (const { grant, controller } of this.grants.values()) if (!controller.signal.aborted && grant.expiresAt !== null) next = Math.min(next, grant.expiresAt);
		if (next === Infinity) return;
		this.expiryTimer = setTimeout(() => {
			this.expiryTimer = void 0;
			const now = Date.now();
			for (const { grant, controller } of this.grants.values()) if (grant.expiresAt !== null && grant.expiresAt <= now) controller.abort(new VisitorAccessError("Visitor access expired."));
			this.scheduleExpiry();
		}, Math.max(0, Math.min(next - Date.now(), MAX_TIMER_DELAY_MS)));
		this.expiryTimer.unref();
	}
	async registerGrant(grant, store) {
		this.assertOpen();
		await store.register(visitorTargetKey(visitorGrantTarget(grant)), grant);
		this.publishGrant(grant);
		this.scheduleExpiry();
	}
	async deleteGrant(email, store) {
		this.assertOpen();
		await store.delete(email);
		this.grants.get(email)?.controller.abort(new VisitorAccessError("Visitor access ended."));
		this.grants.delete(email);
		this.scheduleExpiry();
	}
	serialize(operation, assertCurrent) {
		const result = this.pending.then(() => {
			this.assertOpen();
			assertCurrent?.();
			return operation();
		});
		this.pending = result.catch(() => {});
		return result;
	}
	async waitForIdle() {
		await this.pending;
	}
	actionStore(assertCurrent) {
		if (!this.store.withCurrent) throw new VisitorAccessError("This Gateway cannot authorize visitor grant writes. Update OpenClaw before managing visitors.");
		return this.store.withCurrent({ assertCurrent: () => {
			this.assertOpen();
			assertCurrent?.();
		} });
	}
	async resolveTarget(input) {
		if (input.email) return { target: input.email };
		if (!input.github) throw new VisitorAccessError("Provide an email or GitHub login.");
		if (!this.resolveGitHubAccount) throw new VisitorAccessError("This Gateway cannot resolve GitHub accounts. Update OpenClaw before managing GitHub visitors.");
		const result = await this.resolveGitHubAccount({
			login: input.github,
			signal: this.signal
		});
		this.assertOpen();
		if (result.error) {
			const { statusCode, retryAtMs, credentialConfigured, message } = result.error;
			if (statusCode === 404) throw new VisitorAccessError(`GitHub login ${input.github} was not found. Check the login and retry.`);
			if (statusCode === 400) throw new VisitorAccessError(`${input.github} is not a valid GitHub login. Check the login and retry.`);
			if (statusCode === 429) {
				const retry = retryAtMs === void 0 ? "retry later" : `retry after ${new Date(retryAtMs).toISOString()}`;
				const hint = credentialConfigured ? "" : " Configure gateway.controlUi.github.token to increase the GitHub API quota.";
				throw new VisitorAccessError(`GitHub rate limit reached while resolving ${input.github}; ${retry}.${hint}`);
			}
			throw new VisitorAccessError(`GitHub account lookup failed (${message}). Retry later.`);
		}
		return {
			target: result.accountId,
			githubLogin: result.login
		};
	}
	invite(raw, { invitedVia, invitedBy, signInUrl, assertCurrent }) {
		return this.serialize(async () => {
			const store = this.actionStore(assertCurrent);
			const input = parseVisitorInput(inviteSchema, raw);
			if (input.forever && input.days !== void 0) throw new VisitorAccessError("Choose days or forever: true, not both.");
			const days = input.days ?? this.readLimits().defaultTtlDays;
			let expiresAt = null;
			if (!input.forever) {
				if (!days) throw new VisitorAccessError("No default duration is configured. Pass days or explicitly pass forever: true.");
				expiresAt = Date.now() + days * DAY_MS;
			}
			const { target, githubLogin: resolvedLogin } = await this.resolveTarget(input);
			if (typeof target === "number") this.policy.assertGithubConfigured();
			const key = visitorTargetKey(target);
			const previous = await store.lookup(key);
			const now = Date.now();
			const githubLogin = resolvedLogin ?? previous?.githubLogin;
			const provenance = invitedVia?.slice(0, 256) ?? previous?.invitedVia;
			const grant = {
				...typeof target === "string" ? { email: target } : { githubAccountId: target },
				...githubLogin ? { githubLogin } : {},
				...provenance ? { invitedVia: provenance } : {},
				...invitationMetadata(previous, {
					invitedBy,
					note: input.note
				}, now),
				createdAt: previous?.createdAt ?? now,
				expiresAt
			};
			const accountSeats = await this.policy.readAccountSeats(assertCurrent);
			let gatewayAccess = "";
			await this.policy.update(async (targets) => {
				const entries = await store.entries();
				const known = /* @__PURE__ */ new Set([...targets.map(visitorTargetKey), ...entries.map((entry) => entry.key)]);
				const { maxVisitors } = this.readLimits();
				if (!known.has(key) && known.size >= maxVisitors) throw new VisitorAccessError(`Visitor limit (${maxVisitors}) reached. Revoke an existing visitor before inviting another.`);
				const access = await this.readAccess(typeof target === "number" ? [target] : []);
				access.assertInvitable(target);
				gatewayAccess = access.describe(target);
				if (!previous) await this.registerGrant({
					...grant,
					expiresAt: now
				}, store);
				return [.../* @__PURE__ */ new Set([...targets, target])];
			}, assertCurrent);
			const continuous = previous && grantIdSchema.safeParse(previous.grantId).success && (previous.expiresAt === null || previous.expiresAt > Date.now());
			const grantId = continuous ? grantIdSchema.parse(previous.grantId) : randomUUID();
			grant.grantId = grantId;
			if (!continuous) grant.onboarding = {
				state: "pending",
				updatedAt: now
			};
			await this.registerGrant(grant, continuous ? this.actionStore(() => {
				assertCurrent();
				if (previous.expiresAt !== null && previous.expiresAt <= Date.now()) throw new VisitorAccessError("The previous visitor grant expired before renewal was recorded. Check the grant and invite again.");
			}) : store);
			return visitorInviteResult({
				accountSeats,
				renewed: previous !== void 0,
				target,
				grant: {
					...grant,
					grantId
				},
				gatewayAccess,
				signInUrl,
				noteSupplied: input.note !== void 0
			});
		}, assertCurrent);
	}
	revoke(raw, assertCurrent) {
		return this.serialize(async () => {
			const store = this.actionStore(assertCurrent);
			const input = parseVisitorInput(revokeSchema, raw);
			if ((input.profileId || input.grantId) && Object.values(input).filter((value) => value !== void 0).length !== 1) throw new VisitorAccessError("Choose profileId, grantId, or email/GitHub; do not combine selectors.");
			if (!input.email && !input.github && !input.profileId && !input.grantId) throw new VisitorAccessError("Provide a profileId, grantId, email, or GitHub login.");
			const entries = await store.entries();
			const directTarget = input.email ?? (input.github ? (await this.resolveTarget(input)).target : void 0);
			const recordedAccountIds = entries.flatMap(({ value }) => "githubAccountId" in value ? [value.githubAccountId] : []);
			const selection = input.profileId ? await this.readAccess(recordedAccountIds) : typeof directTarget === "number" ? await this.readAccess([directTarget]) : void 0;
			const profileId = input.profileId ?? (directTarget === void 0 ? void 0 : selection?.profileId(directTarget));
			const profile = profileId ? selection?.resolveProfile(profileId) : void 0;
			if (!input.email && input.github && typeof directTarget === "number") selection?.assertGithubSelection(input.github, directTarget);
			if (input.profileId && !profile) throw new VisitorAccessError("Profile not found. Use the current profileId from visitor_list.");
			const access = profile && !input.profileId ? await this.readAccess(recordedAccountIds) : selection;
			assertCurrent();
			const selected = profile ? entries.filter(({ value }) => access?.profileId(visitorGrantTarget(value)) === profile.id) : input.grantId ? entries.filter(({ value }) => value.grantId === input.grantId) : entries.filter(({ key }) => directTarget !== void 0 && key === visitorTargetKey(directTarget));
			if (input.grantId && selected.length > 1) throw new VisitorAccessError("Multiple invitations have that grantId. List visitors and cancel by an exact target.");
			const targets = new Map(selected.map(({ key, value }) => [key, visitorGrantTarget(value)]));
			if (directTarget !== void 0) targets.set(visitorTargetKey(directTarget), directTarget);
			const revokeSelected = async (assertProfileCurrent) => {
				const assertRevocationCurrent = () => {
					assertCurrent();
					assertProfileCurrent?.();
				};
				const currentStore = this.actionStore(assertRevocationCurrent);
				const now = Date.now();
				for (const { value } of selected) if (value.expiresAt === null || value.expiresAt > now) await this.registerGrant({
					...value,
					expiresAt: now
				}, currentStore);
				let removed = false;
				await this.policy.update((policyTargets) => {
					assertRevocationCurrent();
					removed = selected.length > 0 || policyTargets.some((target) => targets.has(visitorTargetKey(target)));
					return policyTargets.filter((target) => !targets.has(visitorTargetKey(target)));
				}, assertRevocationCurrent);
				for (const key of targets.keys()) await this.deleteGrant(key, currentStore);
				const who = input.profileId ? `profile ${input.profileId}` : input.grantId ? `invitation ${input.grantId}` : !input.email && input.github ? `@${input.github} (GitHub account ${directTarget})` : [...targets.keys()].join(", ");
				const githubAccountIds = [...targets.values()].filter((target) => typeof target === "number").toSorted((left, right) => left - right);
				return {
					text: removed ? `Revoked visitor access for ${who}.` : `No visitor grant found for ${who}; nothing to revoke.`,
					details: {
						outcome: removed ? "revoked" : "not_found",
						emails: [...targets.values()].filter((target) => typeof target === "string").toSorted(),
						...githubAccountIds.length ? { githubAccountIds } : {},
						...!input.email && input.github ? { githubLogin: input.github } : {}
					}
				};
			};
			const withRecordedTargets = (assertSelectionCurrent) => profile && access ? access.withProfile(profile.id, selected.map(({ value }) => visitorGrantTarget(value)), (assertTargetsCurrent) => revokeSelected(() => {
				assertSelectionCurrent?.();
				assertTargetsCurrent();
			})) : revokeSelected(assertSelectionCurrent);
			return profile && selection && typeof directTarget === "number" ? await selection.withProfile(profile.id, [directTarget], withRecordedTargets) : await withRecordedTargets();
		}, assertCurrent);
	}
	list(assertCurrent, raw = {}) {
		return this.serialize(() => listVisitors(raw, {
			store: this.store,
			policy: this.policy,
			readAccess: this.readAccess,
			readLimits: this.readLimits,
			assertCurrent: () => {
				this.assertOpen();
				assertCurrent();
			}
		}), assertCurrent);
	}
	sweep() {
		return this.serialize(async () => {
			const store = this.actionStore();
			const entries = await store.entries();
			const expired = new Set(entries.filter(({ value }) => value.expiresAt !== null && value.expiresAt <= Date.now()).map((entry) => entry.key));
			for (const { key, value } of entries) if (expired.has(key)) this.publishGrant(value);
			this.scheduleExpiry();
			const managed = new Set(entries.map((entry) => entry.key));
			await this.policy.update(async (targets) => {
				const keys = new Set(targets.map(visitorTargetKey));
				for (const target of targets) {
					const key = visitorTargetKey(target);
					if (!managed.has(key)) this.logger.warn(`visitor-access: unmanaged policy ${typeof target === "string" ? "email" : "GitHub account"} ${target}; retained.`);
				}
				for (const { key, value } of entries) {
					if (value.grantId === void 0 && !expired.has(key) && keys.has(key)) await this.registerGrant({
						...value,
						grantId: randomUUID()
					}, store);
					if (!keys.has(key) && !expired.has(key)) this.logger.warn(`visitor-access: ${key} is recorded but missing from policy; invite again to restore access or revoke to remove the record.`);
				}
				return targets.filter((target) => !expired.has(visitorTargetKey(target)));
			});
			for (const email of expired) {
				await this.deleteGrant(email, store);
				this.logger.info(`visitor-access: expired grant removed for ${email}.`);
			}
		});
	}
};
// extensions/visitor-access/src/welcome.ts
const WELCOME_ENSURE_METHOD = "visitor-access.welcome.ensure";
const RETRY_AFTER_MS = 1e3;
/**
* Sets up each guest invitation's welcome session once. The pull caller selects nothing:
* the invitation comes from the grant the Gateway admitted for this connection.
*/
var VisitorWelcome = class {
	constructor(service, gateway, config, logger) {
		this.service = service;
		this.gateway = gateway;
		this.config = config;
		this.logger = logger;
		this.inFlight = /* @__PURE__ */ new Set();
	}
	async ensure(client) {
		const grant = client?.internal?.operatorAccessAuthority?.gatewayAccessGrant;
		const guest = client?.authenticatedUserProfile;
		if (grant?.pluginId !== "visitor-access" || !guest) return { status: "not_applicable" };
		let invitation;
		try {
			invitation = this.service.findActiveInvitation(grant.grantId);
			const recorded = invitation?.onboarding;
			if (recorded?.state === "ready" && recorded.welcomeSessionKey) return await this.readyWelcome(recorded.welcomeSessionKey);
		} catch (error) {
			return failed(error);
		}
		if (!invitation) return { status: "not_applicable" };
		if (this.inFlight.has(invitation.grantId)) return {
			status: "pending",
			retryAfterMs: RETRY_AFTER_MS
		};
		this.inFlight.add(invitation.grantId);
		try {
			return await this.setUp(invitation, guest, client.preparedSessionProfile?.githubLogin);
		} finally {
			this.inFlight.delete(invitation.grantId);
		}
	}
	/**
	* A welcome session deleted after setup stays deleted: the record keeps its key so setup
	* never recreates it, and the guest is not sent to a session that no longer exists.
	* Before ready, retries deliberately resume the reserved key, even for a removed partial session.
	*/
	async readyWelcome(sessionKey) {
		const agentId = agentFromKey(sessionKey);
		const { session } = await this.gateway.request("sessions.describe", {
			key: sessionKey,
			agentId
		}, { scopes: ["operator.sessions.read"] });
		return session ? {
			status: "ready",
			sessionKey,
			agentId,
			created: false
		} : { status: "not_applicable" };
	}
	async setUp(invitation, guest, githubLogin) {
		const { grantId, onboarding: recorded } = invitation;
		const advance = (from, next) => this.service.compareAndSetOnboarding({
			grantId,
			expected: from ? {
				state: from.state,
				updatedAt: from.updatedAt
			} : null,
			next
		});
		let reservation;
		try {
			const config = this.config();
			const reservedKey = recorded?.welcomeSessionKey;
			const agentId = reservedKey ? agentFromKey(reservedKey) : chooseGuestAgent(config);
			const sessionKey = reservedKey ?? `agent:${agentId}:dashboard:${randomUUID()}`;
			const reserved = await advance(recorded, {
				state: "pending",
				welcomeSessionKey: sessionKey
			});
			if (!reserved.applied) return reserved.reason === "inactive" ? { status: "not_applicable" } : {
				status: "pending",
				retryAfterMs: RETRY_AFTER_MS
			};
			reservation = reserved.onboarding;
			const name = guest.displayName?.replace(/\s+/gu, " ").trim() || void 0;
			const titleName = name || githubLogin?.trim();
			await this.gateway.request("sessions.create", {
				key: sessionKey,
				agentId,
				displayName: titleName ? `Welcome ${titleName}` : "Welcome"
			});
			const inviter = invitation.invitedBy?.profileId === guest.profileId ? void 0 : invitation.invitedBy;
			const label = inviter?.label?.replace(/\s+/gu, " ").trim() || void 0;
			const greeting = name ? `Welcome to OpenClaw, ${name}.` : "Welcome to OpenClaw.";
			const access = invitation.expiresAt === null ? "Your guest access does not expire." : `Your guest access runs through ${utcMinute(invitation.expiresAt)}.`;
			const mentionText = `@${label ?? "inviter"}`;
			const invited = inviter ? `${mentionText} invited you. ${access}` : `You were invited as a guest. ${access}`;
			const note = invitation.note?.trim();
			const capabilities = guestCapabilities(config, agentId).map((line) => `- ${line}`);
			const text = [
				greeting,
				"",
				invited,
				...note ? [
					"",
					`Note from ${label ?? "your inviter"}:`,
					note
				] : [],
				"",
				`This is your own session with ${agentName(config, agentId)}. As a guest you can:`,
				...capabilities
			].join("\n");
			const start = greeting.length + 2;
			const message = {
				text,
				mentions: inviter ? [{
					profileId: inviter.profileId,
					start,
					end: start + mentionText.length
				}] : []
			};
			await this.gateway.appendAgentMessage({
				sessionKey,
				agentId,
				text: message.text,
				...message.mentions.length ? { mentions: message.mentions } : {},
				idempotencyKey: `visitor-welcome:${grantId}`
			});
			const done = await advance(reservation, {
				state: "ready",
				welcomeSessionKey: sessionKey
			});
			if (done.applied) return {
				status: "ready",
				sessionKey,
				agentId,
				created: true
			};
			return done.reason === "inactive" ? { status: "not_applicable" } : {
				status: "pending",
				retryAfterMs: RETRY_AFTER_MS
			};
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			this.logger.warn(`visitor-access: welcome setup failed: ${detail}`);
			if (reservation) {
				const recordedFailure = await advance(reservation, {
					state: "failed",
					welcomeSessionKey: reservation.welcomeSessionKey,
					error: detail
				}).catch(() => void 0);
				if (recordedFailure && !recordedFailure.applied && recordedFailure.reason === "inactive") return { status: "not_applicable" };
			}
			return failed(error);
		}
	}
};
function failed(error) {
	return {
		status: "failed",
		retryable: true,
		message: error instanceof VisitorAccessError ? error.message : "Your welcome session could not be set up yet. Reload to try again."
	};
}
function agentFromKey(sessionKey) {
	const agentId = /^agent:([^:]+):/u.exec(sessionKey)?.[1];
	if (!agentId) throw new VisitorAccessError("The reserved welcome session key is invalid.");
	return agentId;
}
function guestRole(config) {
	const role = (config.gateway?.roles)?.definitions[resolveVisitorRole(config)];
	if (!role) throw new VisitorAccessError("The guest role is not configured.");
	return role;
}
/** The default agent when the guest role permits it, otherwise the role's first agent. */
function chooseGuestAgent(config) {
	const { agents } = guestRole(config);
	const permitted = agents === "*" ? listAgentIds(config) : agents;
	const preferred = tryResolveDefaultAgentId(config);
	const agentId = preferred && permitted.includes(preferred) ? preferred : permitted[0];
	if (!agentId) throw new VisitorAccessError("No agent is available to guests. Ask a maintainer to add one.");
	return agentId;
}
function agentName(config, agentId) {
	const agent = resolveAgentConfig(config, agentId);
	return agent?.identity?.name?.trim() || agent?.name?.trim() || agentId;
}
function utcMinute(epochMs) {
	return `${new Date(epochMs).toISOString().slice(0, 16).replace("T", " ")} UTC`;
}
/** Guest capabilities stated from the live guest role, never from fixed claims. */
function guestCapabilities(config, agentId) {
	const role = guestRole(config);
	const agents = role.agents === "*" ? void 0 : role.agents.map((id) => agentName(config, id));
	const lines = [agents ? `start your own sessions with ${agents.join(" or ")}` : "start your own sessions with any agent on this Gateway"];
	if (role.sandbox === "required") lines.push(`have ${agentName(config, agentId)} work in a private sandbox`);
	if (role.sessions.others === "view") lines.push("read other people's sessions");
	else if (role.sessions.others === "write") lines.push("read and reply in other people's sessions");
	return lines;
}
// extensions/visitor-access/index.ts
function registerVisitorPlugin(api) {
	if (api.registrationMode === "cli-metadata") return;
	for (const name of [
		"visitor_invite",
		"visitor_revoke",
		"visitor_list"
	]) api.registerTool({
		contextVersion: 2,
		create: (ctx) => createVisitorTools(ctx).find((tool) => tool.name === name)
	}, { name });
	if (api.registrationMode !== "full") return;
	const config = visitorConfigSchema.parse(api.pluginConfig);
	const lifetime = new AbortController();
	const service = new VisitorAccessService(() => visitorLimitsSchema.parse(api.runtime.config.current().plugins?.entries?.[api.id]?.config), api.runtime.state.openKeyedStore({
		namespace: "visitor-grants",
		maxEntries: 500,
		overflowPolicy: "reject-new"
	}), new VisitorPolicyClient(config, fetch, lifetime.signal, () => api.runtime.config.current().gateway?.auth?.trustedProxy?.cloudflareAccessOidc), api.logger, createVisitorAccessReader(api.runtime), api.runtime.gateway.resolveGitHubAccount, lifetime.signal);
	const runtime = {
		service,
		async readInviter() {
			try {
				const { profile } = await api.runtime.gateway.request("users.self", {}, { scopes: ["operator.read"] });
				return profile.id === "gateway-owner" ? void 0 : {
					profileId: profile.id,
					...profile.displayName ? { label: profile.displayName } : {}
				};
			} catch {
				return;
			}
		},
		readSignInUrl: () => resolveVisitorSignInUrl(api.runtime.config.current()),
		errorText: (error) => visitorErrorText(error, config.apiToken)
	};
	const welcome = new VisitorWelcome(service, api.runtime.gateway, () => api.runtime.config.current({ clone: true }), api.logger);
	api.registerGatewayMethod(WELCOME_ENSURE_METHOD, async ({ client, respond }) => {
		respond(true, await welcome.ensure(client));
	}, {
		scope: "operator.sessions.write",
		profileAccess: "required"
	});
	api.registerGatewayAccessPolicy({
		resume({ profile, grantId }) {
			return service.resume(profile.emails, grantId, profile.githubAccountIds);
		},
		authorize({ config: currentConfig, profile, requiredByRole }) {
			const roles = currentConfig.gateway?.roles;
			if (!requiredByRole || !profileUsesVisitorRole(roles, {
				id: profile.profileId,
				role: profile.assignedRole
			})) return;
			resolveVisitorRole(currentConfig);
			return service.authorize(profile.emails, profile.githubAccountIds);
		}
	});
	let interval;
	let sweeping;
	let starting;
	const sweep = () => {
		sweeping ??= (api.lifecycle.runInBackgroundContext?.(() => service.sweep()) ?? service.sweep()).catch((error) => {
			if (!lifetime.signal.aborted) api.logger.error(`visitor-access sweep failed: ${visitorErrorText(error, config.apiToken)}`);
		}).finally(() => {
			sweeping = void 0;
		});
		return sweeping;
	};
	const start = () => {
		lifetime.signal.throwIfAborted();
		const active = visitorRuntimeStore.tryGetRuntime();
		if (active && active !== runtime) throw new Error("A visitor-access Gateway service is already running.");
		return starting ??= (async () => {
			await service.initialize();
			lifetime.signal.throwIfAborted();
			const current = visitorRuntimeStore.tryGetRuntime();
			if (current && current !== runtime) {
				service.close();
				throw new Error("A visitor-access Gateway service is already running.");
			}
			visitorRuntimeStore.setRuntime(runtime);
			interval ??= setInterval(() => {
				sweep();
			}, 36e5);
			interval.unref();
			sweep();
		})();
	};
	api.on("gateway_start", start);
	api.registerService({
		id: "visitor-access-expiry",
		start,
		async stop() {
			clearInterval(interval);
			interval = void 0;
			service.close();
			lifetime.abort();
			await service.waitForIdle();
			await sweeping;
			if (visitorRuntimeStore.tryGetRuntime() === runtime) visitorRuntimeStore.clearRuntime();
		}
	});
}
var visitor_access_default = definePluginEntry({
	id: "visitor-access",
	name: "Visitor Access",
	description: "Internal Cloudflare Access visitor grants with managed expiry.",
	configSchema: visitorPluginSchema,
	reload: { hotPrefixes: ["plugins.entries.visitor-access.config.maxVisitors", "plugins.entries.visitor-access.config.defaultTtlDays"] },
	register: registerVisitorPlugin
});
export { visitor_access_default as default };
