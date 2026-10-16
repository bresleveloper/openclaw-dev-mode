import { buildPluginConfigSchema, createPluginRuntimeStore, definePluginEntry } from "./api.js";
import { z } from "zod";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
import { randomUUID } from "node:crypto";
//#region extensions/visitor-access/src/errors.ts
/** Only curated operator-facing messages cross the tool/log boundary. */
var VisitorAccessError = class extends Error {};
function visitorErrorText(error, apiToken) {
	return (error instanceof VisitorAccessError ? error.message : "Visitor access operation failed. Check gateway health and retry; use visitor_list to inspect drift.").replaceAll(apiToken, "[redacted]");
}
//#endregion
//#region extensions/visitor-access/src/roles.ts
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
//#endregion
//#region extensions/visitor-access/src/access.ts
function createVisitorAccessReader(runtime) {
	return async (githubAccountIds = []) => {
		const { profiles, githubProfiles } = await runtime.gateway.request("users.list", githubAccountIds.length ? { githubAccountIds: [...new Set(githubAccountIds)] } : {}, { scopes: ["operator.read"] });
		const canonical = profiles.filter((profile) => !profile.mergedInto);
		const byEmail = new Map(canonical.flatMap((profile) => profile.emails.map((email) => [email, profile])));
		const byId = new Map(canonical.map((profile) => [profile.id, profile]));
		const byGithub = new Map(githubProfiles?.map(({ accountId, profileId }) => [accountId, byId.get(profileId)]));
		const profile = (target) => typeof target === "string" ? byEmail.get(target) : byGithub.get(target);
		const config = runtime.config.current();
		const roles = config.gateway?.roles;
		const access = (target) => describeAccess(profile(target), roles);
		return {
			describe: (target) => access(target).description,
			githubLogin: (target) => profile(target)?.githubIdentity?.login,
			assertGithubSelection(login, accountId) {
				const normalized = login.toLowerCase();
				const matches = canonical.filter((entry) => entry.githubIdentity?.login.toLowerCase() === normalized);
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
//#endregion
//#region extensions/visitor-access/src/cloudflare.ts
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
		per_page: z.number().int().positive().optional()
	}).optional()
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
		this.policiesUrl = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/access/apps/${encodeURIComponent(config.appId)}/policies`;
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
	async request(url, method, body, assertCurrent) {
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
				signal: this.signal ? AbortSignal.any([this.signal, AbortSignal.timeout(3e4)]) : AbortSignal.timeout(3e4)
			});
		} catch {
			throw new VisitorAccessError("Cloudflare request failed; check connectivity and retry. Policy state may need reconciliation.");
		}
		if (!response.ok) throw new VisitorAccessError(`Cloudflare request failed (HTTP ${response.status}); check the token's Access policy permissions and retry.`);
		let data;
		try {
			data = await response.json();
		} catch {
			throw new VisitorAccessError("Cloudflare returned an unreadable response; retry and inspect the visitor policy.");
		}
		const parsed = responseSchema.safeParse(data);
		if (!parsed.success) throw new VisitorAccessError("Cloudflare did not confirm the request; inspect the visitor policy before retrying.");
		return parsed.data;
	}
};
//#endregion
//#region extensions/visitor-access/src/config.ts
const visitorConfigSchema = z.strictObject({
	accountId: z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
	appId: z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/),
	apiToken: z.string().min(1),
	policyName: z.string().trim().min(1).max(200).default("Visitors (openclaw-managed)"),
	defaultTtlDays: z.number().int().min(0).max(3650).nullable().default(14),
	maxVisitors: z.number().int().min(1).max(500).default(50)
});
const visitorPluginSchema = buildPluginConfigSchema(visitorConfigSchema);
//#endregion
//#region extensions/visitor-access/src/runtime.ts
const visitorRuntimeStore = createPluginRuntimeStore({
	key: "plugin-runtime:visitor-access:active",
	errorMessage: "Start the Gateway with visitor-access enabled before managing visitors."
});
//#endregion
//#region extensions/visitor-access/src/tool-results.ts
const expiresAtSchema = Type.Union([Type.String(), Type.Null()], { description: "Null means an explicit forever grant." });
const visitorInviteDetailsSchema = Type.Object({
	outcome: Type.Union([Type.Literal("invited"), Type.Literal("renewed")]),
	grantId: Type.String(),
	email: Type.Optional(Type.String()),
	githubAccountId: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	githubLogin: Type.Optional(Type.String()),
	expiresAt: expiresAtSchema,
	gatewayAccess: Type.String(),
	signInUrl: Type.String()
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
		profileId: Type.Optional(Type.String({ description: "Canonical person selector for visitor_revoke." })),
		githubLogin: Type.Optional(Type.String({ description: "Current verified GitHub identity selected by the Gateway profile, when available. Use grantId to cancel one invitation; GitHub input selects its immutable account and the canonical person's recorded grants." })),
		invitedAt: Type.String(),
		expiresAt: expiresAtSchema,
		state: Type.Union([
			Type.Literal("managed"),
			Type.Literal("expired"),
			Type.Literal("missing_from_policy")
		], { description: "Missing policy membership takes precedence; expired grants await provider cleanup." }),
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
	omitted: Type.Integer({ description: "Rows omitted by the text output limits." })
}, { additionalProperties: false });
const visitorToolErrorSchema = Type.Object({ error: Type.Literal(true) }, { additionalProperties: false });
//#endregion
//#region extensions/visitor-access/src/tools.ts
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
			description: "Grant or renew visitor access to team.openclaw.ai. Requires administrator or designated-owner authority. Provide exactly one Team sign-in email or GitHub login. A GitHub invitation uses the immutable account ID, not public email. Checks restricted guest access and preserves existing assigned roles. Grants expire after the configured duration (14 days by default); forever must be explicit.",
			parameters: Type.Object({
				...identityFields$1,
				days: Type.Optional(Type.Integer({
					minimum: 1,
					maximum: 3650,
					description: "Grant duration in days; cannot be combined with forever."
				})),
				forever: Type.Optional(Type.Boolean({ description: "Explicitly grant access without expiry." }))
			}, {
				additionalProperties: false,
				oneOf: [{ required: ["email"] }, { required: ["github"] }]
			}),
			outputSchema: Type.Union([visitorInviteDetailsSchema, visitorToolErrorSchema]),
			run: (service, raw) => service.invite(raw, {
				assertCurrent,
				invitedVia: context.sessionKey ?? context.agentId
			})
		},
		{
			name: "visitor_revoke",
			label: "Revoke visitor",
			description: "Remove the recorded Visitor invitations selected for a canonical profileId, or cancel one invitation by grantId, including before first sign-in. Use the IDs returned by visitor_list or visitor_invite. Person selection keeps the selected identity current at local commit and before policy requests. Already committed expirations remain ended if cleanup fails. Email targets that address. GitHub login targets its immutable account and its canonical person's recorded invitations. An explicit email or GitHub login can remove that target's unmanaged policy entry. Do not combine profileId or grantId with another selector. Preserves saved work, existing PRs and independent staff access. Already absent grants are a no-op.",
			parameters: Type.Object({
				...identityFields$1,
				profileId: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 128
				})),
				grantId: Type.Optional(Type.String({ format: "uuid" }))
			}, { additionalProperties: false }),
			outputSchema: Type.Union([visitorRevokeDetailsSchema, visitorToolErrorSchema]),
			run: (service, raw) => service.revoke(raw, assertCurrent)
		},
		{
			name: "visitor_list",
			label: "List visitors",
			description: "List recorded visitor grants, current verified GitHub identities, current Gateway access, invitation and expiry dates, and drift from the Access policy. Grant expiry does not describe independent staff access. Unmanaged policy targets are reported and retained; missing policy targets are never automatically restored.",
			parameters: Type.Object({}, { additionalProperties: false }),
			outputSchema: Type.Union([visitorListDetailsSchema, visitorToolErrorSchema]),
			run: (service) => service.list(assertCurrent)
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
				const { text, details } = await run(runtime.service, raw);
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
//#endregion
//#region extensions/visitor-access/src/visitors.ts
function visitorGrantTarget(grant) {
	return "email" in grant ? grant.email : grant.githubAccountId;
}
const emailSchema = z.string().trim().max(254).pipe(z.email()).transform((email) => email.toLowerCase());
const identityFields = {
	github: z.string().trim().regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/).transform((login) => login.toLowerCase()).optional(),
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
	forever: z.boolean().optional()
}).refine((input) => input.email !== void 0 !== (input.github !== void 0));
const githubSchema = z.object({
	id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	login: identityFields.github.unwrap()
});
const grantIdSchema = z.uuid();
const DAY_MS = 864e5;
const MAX_TIMER_DELAY_MS = 2147483647;
const SIGN_IN_URL = "https://team.openclaw.ai";
function parseVisitorInput(schema, raw) {
	const result = schema.safeParse(raw);
	if (!result.success) throw new VisitorAccessError("Invalid visitor input. Use a valid email or GitHub login, days from 1 to 3650, or forever: true.");
	return result.data;
}
function expiryText(expiresAt) {
	return expiresAt === null ? "never (explicit forever grant)" : new Date(expiresAt).toISOString();
}
var VisitorAccessService = class {
	constructor(config, store, policy, logger, readAccess, fetcher = fetch, signal) {
		this.config = config;
		this.store = store;
		this.policy = policy;
		this.logger = logger;
		this.readAccess = readAccess;
		this.fetcher = fetcher;
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
		const authority = this.readAuthority(emails, void 0, githubAccountIds);
		if (!authority) throw new VisitorAccessError("An active visitor invitation is required. Ask a maintainer to invite or renew access.");
		return authority;
	}
	/** Unlike admission, an unavailable grant map must leave durable requests pending. */
	resume(emails, grantId, githubAccountIds = []) {
		return this.readAuthority(emails, grantId, githubAccountIds);
	}
	readAuthority(emails, grantId, githubAccountIds = []) {
		this.assertOpen();
		if (!this.ready) throw new VisitorAccessError("Visitor access is starting; retry shortly.");
		const now = Date.now();
		const state = [...emails.map((email) => email.trim().toLowerCase()), ...githubAccountIds.map(visitorTargetKey)].map((key) => this.grants.get(key)).find((entry) => entry && grantIdSchema.safeParse(entry.grant.grantId).success && (grantId === void 0 || entry.grant.grantId === grantId) && !entry.controller.signal.aborted && (entry.grant.expiresAt === null || entry.grant.expiresAt > now));
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
		let response;
		let body;
		try {
			response = await this.fetcher(`https://api.github.com/users/${encodeURIComponent(input.github)}`, {
				headers: {
					Accept: "application/vnd.github+json",
					"User-Agent": "OpenClaw-visitor-access"
				},
				redirect: "error",
				signal: this.signal ? AbortSignal.any([this.signal, AbortSignal.timeout(15e3)]) : AbortSignal.timeout(15e3)
			});
			if (!response.ok) throw new Error("GitHub lookup failed");
			body = await response.json();
		} catch {
			throw new VisitorAccessError("GitHub account lookup failed. Check the login and retry.");
		}
		const result = githubSchema.safeParse(body);
		if (!result.success) throw new VisitorAccessError("GitHub returned an invalid account identity. Check the login and retry.");
		return {
			target: result.data.id,
			githubLogin: result.data.login
		};
	}
	invite(raw, { invitedVia, assertCurrent }) {
		return this.serialize(async () => {
			const store = this.actionStore(assertCurrent);
			const input = parseVisitorInput(inviteSchema, raw);
			if (input.forever && input.days !== void 0) throw new VisitorAccessError("Choose days or forever: true, not both.");
			const days = input.days ?? this.config.defaultTtlDays;
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
				createdAt: previous?.createdAt ?? now,
				expiresAt
			};
			let gatewayAccess = "";
			await this.policy.update(async (targets) => {
				const entries = await store.entries();
				const known = /* @__PURE__ */ new Set([...targets.map(visitorTargetKey), ...entries.map((entry) => entry.key)]);
				if (!known.has(key) && known.size >= this.config.maxVisitors) throw new VisitorAccessError(`Visitor limit (${this.config.maxVisitors}) reached. Revoke an existing visitor before inviting another.`);
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
			await this.registerGrant(grant, continuous ? this.actionStore(() => {
				assertCurrent();
				if (previous.expiresAt !== null && previous.expiresAt <= Date.now()) throw new VisitorAccessError("The previous visitor grant expired before renewal was recorded. Check the grant and invite again.");
			}) : store);
			const who = typeof target === "number" ? `@${grant.githubLogin} (GitHub account ${target})` : grant.githubLogin ? `@${grant.githubLogin} (${target})` : target;
			return {
				text: `${previous ? "Renewed" : "Invited"} ${who}. Invitation ID: ${grantId}. Visitor grant expires: ${expiryText(grant.expiresAt)}. ${gatewayAccess}. Sign in at ${SIGN_IN_URL} using Team's existing login with ${typeof target === "number" ? "this GitHub account" : "this email"}. The link itself does not grant access.`,
				details: {
					outcome: previous ? "renewed" : "invited",
					grantId,
					...typeof target === "string" ? { email: target } : { githubAccountId: target },
					...grant.githubLogin ? { githubLogin: grant.githubLogin } : {},
					expiresAt: grant.expiresAt === null ? null : new Date(grant.expiresAt).toISOString(),
					gatewayAccess,
					signInUrl: SIGN_IN_URL
				}
			};
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
			if (input.profileId && !profile) throw new VisitorAccessError("Profile not found. Use the current canonical profileId from visitor_list.");
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
	list(assertCurrent) {
		return this.serialize(async () => {
			const policyTargets = (await this.policy.read(assertCurrent))?.targets ?? [];
			const targetKeys = new Set(policyTargets.map(visitorTargetKey));
			const entries = await this.store.entries();
			assertCurrent();
			const managed = new Set(entries.map((entry) => entry.key));
			const unmanaged = policyTargets.filter((target) => !managed.has(visitorTargetKey(target))).toSorted((left, right) => visitorTargetKey(left).localeCompare(visitorTargetKey(right)));
			const displayedTargets = [...entries.toSorted((left, right) => left.key.localeCompare(right.key)).map(({ value }) => visitorGrantTarget(value)), ...unmanaged].slice(0, this.config.maxVisitors);
			const access = await this.readAccess([...new Set(displayedTargets.filter((target) => typeof target === "number"))]);
			assertCurrent();
			const missing = entries.filter((entry) => !targetKeys.has(entry.key)).length;
			const summary = `Visitors: ${entries.length} recorded; ${targetKeys.size} in policy. Drift: ${unmanaged.length} unmanaged, ${missing} missing from policy.`;
			const lines = [summary];
			const details = {
				counts: {
					recorded: entries.length,
					inPolicy: targetKeys.size,
					unmanaged: unmanaged.length,
					missingFromPolicy: missing
				},
				grants: [],
				unmanaged: [],
				omitted: 0
			};
			const rows = entries.toSorted((a, b) => a.key.localeCompare(b.key)).map(({ value: grant }) => {
				const target = visitorGrantTarget(grant);
				const profileId = access.profileId(target);
				const missingFromPolicy = !targetKeys.has(visitorTargetKey(target));
				const expired = grant.expiresAt !== null && grant.expiresAt <= Date.now();
				const state = missingFromPolicy ? "MISSING FROM POLICY" : expired ? "EXPIRED; provider cleanup pending" : "managed";
				const gatewayAccess = access.describe(target);
				const githubLogin = access.githubLogin(target);
				const github = `Verified GitHub: ${githubLogin ? `@${githubLogin}` : "unavailable"}`;
				return {
					line: `${visitorTargetKey(target)} | ${github}${profileId ? ` | profileId ${profileId}` : ""}${grant.grantId ? ` | grantId ${grant.grantId}` : ""} | invited ${new Date(grant.createdAt).toISOString()} | grant expires ${expiryText(grant.expiresAt)} | ${state} | ${gatewayAccess}`,
					grant: {
						...typeof target === "string" ? { email: target } : { githubAccountId: target },
						...grant.grantId ? { grantId: grant.grantId } : {},
						...profileId ? { profileId } : {},
						...githubLogin ? { githubLogin } : {},
						invitedAt: new Date(grant.createdAt).toISOString(),
						expiresAt: grant.expiresAt === null ? null : new Date(grant.expiresAt).toISOString(),
						state: missingFromPolicy ? "missing_from_policy" : expired ? "expired" : "managed",
						gatewayAccess
					}
				};
			});
			rows.push(...unmanaged.map((target) => {
				const gatewayAccess = access.describe(target);
				return {
					line: `${visitorTargetKey(target)} | UNMANAGED: no grant record; retained until explicit revoke. | ${gatewayAccess}`,
					unmanaged: {
						...typeof target === "string" ? { email: target } : { githubAccountId: target },
						gatewayAccess
					}
				};
			}));
			let length = summary.length;
			let shown = 0;
			for (const row of rows.slice(0, this.config.maxVisitors)) {
				if (length + row.line.length + 1 > 11880) break;
				lines.push(row.line);
				if ("grant" in row) details.grants.push(row.grant);
				else details.unmanaged.push(row.unmanaged);
				length += row.line.length + 1;
				shown++;
			}
			if (shown < rows.length) {
				details.omitted = rows.length - shown;
				lines.push(`${rows.length - shown} entries omitted by output limits. Inspect the policy; revoke by profileId, grantId, email, or GitHub login.`);
			}
			return {
				text: lines.join("\n"),
				details
			};
		}, assertCurrent);
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
//#endregion
//#region extensions/visitor-access/index.ts
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
	const service = new VisitorAccessService(config, api.runtime.state.openKeyedStore({
		namespace: "visitor-grants",
		maxEntries: 500,
		overflowPolicy: "reject-new"
	}), new VisitorPolicyClient(config, fetch, lifetime.signal, () => api.runtime.config.current().gateway?.auth?.trustedProxy?.cloudflareAccessOidc), api.logger, createVisitorAccessReader(api.runtime), fetch, lifetime.signal);
	const runtime = {
		service,
		errorText: (error) => visitorErrorText(error, config.apiToken)
	};
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
	let startupSweep;
	const sweep = () => {
		sweeping ??= service.sweep().catch((error) => {
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
		return startupSweep ??= (async () => {
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
			await sweep();
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
			if (visitorRuntimeStore.tryGetRuntime() === runtime) visitorRuntimeStore.clearRuntime();
		}
	});
}
var visitor_access_default = definePluginEntry({
	id: "visitor-access",
	name: "Visitor Access",
	description: "Internal Cloudflare Access visitor grants with managed expiry.",
	configSchema: visitorPluginSchema,
	register: registerVisitorPlugin
});
//#endregion
export { visitor_access_default as default };
