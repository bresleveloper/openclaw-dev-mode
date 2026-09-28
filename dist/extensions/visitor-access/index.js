import { buildPluginConfigSchema, createPluginRuntimeStore, definePluginEntry } from "./api.js";
import { z } from "zod";
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
	return role.accessPolicyPlugin === "visitor-access" && role.sessions.others === "view" && role.sandbox === "required" && (role.agents === "*" || role.agents.length > 0) && role.scopes.includes("operator.sessions.write") && role.scopes.every((scope) => scope === "operator.sessions.read" || scope === "operator.sessions.write");
}
/** Visitor Access manages the configured default; other assigned roles remain independently owned. */
function resolveVisitorRole(config) {
	const roles = config.gateway?.roles;
	const name = roles?.default;
	const role = name && roles && Object.hasOwn(roles.definitions, name) ? roles.definitions[name] : void 0;
	if (!name || !role || !isRestrictedVisitorRole(role)) throw new VisitorAccessError("Visitor Access requires gateway.roles.default to allow isolated own-session work and shared-session viewing with only operator.sessions.write and optional operator.sessions.read scopes, and accessPolicyPlugin: \"visitor-access\".");
	return name;
}
//#endregion
//#region extensions/visitor-access/src/access.ts
function createVisitorAccessReader(runtime) {
	return async () => {
		const { profiles } = await runtime.gateway.request("users.list", {}, { scopes: ["operator.read"] });
		const byEmail = new Map(profiles.flatMap((profile) => profile.emails.map((email) => [email, profile])));
		const config = runtime.config.current();
		const roles = config.gateway?.roles;
		const access = (email) => describeAccess(byEmail.get(email), roles);
		return {
			describe: (email) => access(email).description,
			assertInvitable(email) {
				resolveVisitorRole(config);
				const result = access(email);
				if (!result.invitable) throw new VisitorAccessError(`${result.description}. Configure a default role with isolated own-session work and shared-session viewing before inviting this person.`);
			}
		};
	};
}
function describeAccess(profile, roles) {
	if (profile && !profileUsesVisitorRole(roles, profile)) return {
		invitable: true,
		description: profile.id === "gateway-owner" ? "Gateway access: shared owner authority retained; this invitation does not restrict it" : `Gateway access: existing role ${JSON.stringify(profile.role)} retained; this invitation does not restrict it`
	};
	if (!roles) return {
		invitable: false,
		description: "Gateway access is unrestricted: roles are disabled"
	};
	const assignedRole = profile?.role && Object.hasOwn(roles.definitions, profile.role) ? profile.role : void 0;
	const roleName = assignedRole ?? roles.default;
	const role = roleName && Object.hasOwn(roles.definitions, roleName) ? roles.definitions[roleName] : void 0;
	if (!role) return {
		invitable: false,
		description: `Gateway access could not be verified: default role ${JSON.stringify(roleName ?? "")} is unavailable`
	};
	const source = assignedRole ? "assigned" : "default";
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
const managedPolicySchema = policyReferenceSchema.extend({
	decision: z.literal("allow"),
	include: z.array(emailRuleSchema).max(1e4),
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
var VisitorPolicyClient = class {
	constructor(config, fetcher = fetch, signal) {
		this.config = config;
		this.fetcher = fetcher;
		this.signal = signal;
		this.policiesUrl = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/access/apps/${encodeURIComponent(config.appId)}/policies`;
	}
	async read(assertCurrent) {
		const policy = await this.readPolicy(assertCurrent);
		return policy ? {
			id: policy.id,
			emails: this.policyEmails(policy)
		} : void 0;
	}
	async update(change, assertCurrent) {
		const policy = await this.readPolicy(assertCurrent);
		const current = policy ? this.policyEmails(policy) : [];
		if (this.signal?.aborted) throw new VisitorAccessError("Visitor access is stopping; retry after the gateway starts.");
		const emails = [...new Set(await change(current))];
		if (emails.length === current.length && emails.every((email) => current.includes(email))) return emails;
		if (policy && emails.length === 0) {
			await this.request(`${this.policiesUrl}/${encodeURIComponent(policy.id)}`, "DELETE", void 0, assertCurrent);
			return emails;
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
		payload.include = emails.map((email) => ({ email: { email } }));
		const url = policy ? `${this.policiesUrl}/${encodeURIComponent(policy.id)}` : this.policiesUrl;
		await this.request(url, policy ? "PUT" : "POST", payload, assertCurrent);
		return emails;
	}
	policyEmails(policy) {
		return [...new Set(policy.include.map((rule) => rule.email.email.toLowerCase()))];
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
				if (!parsed.success || parsed.data.id !== reference.id || parsed.data.name !== this.config.policyName) throw new VisitorAccessError("The visitor policy changed or is not an email-only allow policy. Inspect its name, decision, include, require, and exclude rules before retrying.");
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
			description: "Grant or renew visitor access to team.openclaw.ai. Requires administrator or designated-owner authority. Provide the Team sign-in email or a GitHub login with a matching public email. Checks restricted guest access and preserves existing assigned roles. Grants expire after the configured duration (14 days by default); forever must be explicit.",
			parameters: Type.Object({
				...identityFields$1,
				days: Type.Optional(Type.Integer({
					minimum: 1,
					maximum: 3650,
					description: "Grant duration in days; cannot be combined with forever."
				})),
				forever: Type.Optional(Type.Boolean({ description: "Explicitly grant access without expiry." }))
			}, { additionalProperties: false }),
			run: (service, raw) => service.invite(raw, {
				assertCurrent,
				invitedVia: context.sessionKey ?? context.agentId
			})
		},
		{
			name: "visitor_revoke",
			label: "Revoke visitor",
			description: "Remove visitor access by email or GitHub login. GitHub login removes all recorded grants for that login. Explicit email can also remove an unmanaged policy entry. Already absent grants are a no-op.",
			parameters: Type.Object(identityFields$1, { additionalProperties: false }),
			run: (service, raw) => service.revoke(raw, assertCurrent)
		},
		{
			name: "visitor_list",
			label: "List visitors",
			description: "List recorded visitor grants, current Gateway access, invitation and expiry dates, and drift from the Access policy. Grant expiry does not describe independent staff access. Unmanaged policy emails are reported and retained; missing policy emails are never automatically restored.",
			parameters: Type.Object({}, { additionalProperties: false }),
			run: (service) => service.list(assertCurrent)
		}
	].map(({ name, label, description, parameters, run }) => ({
		name,
		label,
		description,
		parameters,
		async execute(_id, raw) {
			runtime ??= visitorRuntimeStore.tryGetRuntime();
			if (!runtime) return {
				content: [{
					type: "text",
					text: "Start the Gateway with visitor-access enabled before managing visitors."
				}],
				details: { error: true },
				isError: true
			};
			try {
				assertCurrent();
				return {
					content: [{
						type: "text",
						text: await run(runtime.service, raw)
					}],
					details: {}
				};
			} catch (error) {
				return {
					content: [{
						type: "text",
						text: runtime.errorText(error)
					}],
					details: { error: true },
					isError: true
				};
			}
		}
	}));
}
//#endregion
//#region extensions/visitor-access/src/visitors.ts
const emailSchema = z.string().trim().max(254).pipe(z.email()).transform((email) => email.toLowerCase());
const identityFields = {
	github: z.string().trim().regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/).transform((login) => login.toLowerCase()).optional(),
	email: emailSchema.optional()
};
const revokeSchema = z.strictObject(identityFields);
const inviteSchema = z.strictObject({
	...identityFields,
	days: z.number().int().min(1).max(3650).optional(),
	forever: z.boolean().optional()
});
const githubSchema = z.object({ email: z.string().nullable() });
const grantIdSchema = z.uuid();
const DAY_MS = 864e5;
const MAX_TIMER_DELAY_MS = 2147483647;
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
	/** The canonical profile's email aliases select an active grant, never a GitHub display login. */
	authorize(emails) {
		const authority = this.readAuthority(emails);
		if (!authority) throw new VisitorAccessError("An active visitor invitation is required. Ask a maintainer to invite or renew access.");
		return authority;
	}
	/** Unlike admission, an unavailable grant map must leave durable requests pending. */
	resume(emails, grantId) {
		return this.readAuthority(emails, grantId);
	}
	readAuthority(emails, grantId) {
		this.assertOpen();
		if (!this.ready) throw new VisitorAccessError("Visitor access is starting; retry shortly.");
		const now = Date.now();
		const state = emails.map((email) => this.grants.get(email.trim().toLowerCase())).find((entry) => entry && grantIdSchema.safeParse(entry.grant.grantId).success && (grantId === void 0 || entry.grant.grantId === grantId) && !entry.controller.signal.aborted && (entry.grant.expiresAt === null || entry.grant.expiresAt > now));
		if (!state) return;
		const assertCurrent = () => {
			this.assertOpen();
			if (state.grant.expiresAt !== null && state.grant.expiresAt <= Date.now()) state.controller.abort(new VisitorAccessError("Visitor access expired."));
			if (this.grants.get(state.grant.email) !== state || state.controller.signal.aborted) throw new VisitorAccessError("Visitor access ended. Ask a maintainer to renew access.");
		};
		return Object.freeze({
			grantId: state.grant.grantId,
			assertCurrent,
			signal: this.signal ? AbortSignal.any([state.controller.signal, this.signal]) : state.controller.signal
		});
	}
	publishGrant(grant) {
		if (this.closed) return;
		const previous = this.grants.get(grant.email);
		if (previous && previous.grant.grantId !== grant.grantId) previous.controller.abort(new VisitorAccessError("Visitor access was replaced."));
		if (previous && previous.grant.expiresAt !== null && previous.grant.expiresAt <= Date.now()) previous.controller.abort(new VisitorAccessError("Visitor access expired."));
		const state = previous && !previous.controller.signal.aborted ? previous : {
			grant,
			controller: new AbortController()
		};
		state.grant = grant;
		this.grants.set(grant.email, state);
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
		await store.register(grant.email, grant);
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
	async resolveEmail(input) {
		if (input.email) return input.email;
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
			throw new VisitorAccessError("GitHub email lookup failed. Check the login and retry, or pass email explicitly.");
		}
		const result = githubSchema.safeParse(body);
		if (!result.success || result.data.email === null) throw new VisitorAccessError("No public GitHub email is available. Ask the visitor for their Team sign-in email and pass email explicitly.");
		return parseVisitorInput(emailSchema, result.data.email);
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
			const email = await this.resolveEmail(input);
			const previous = await store.lookup(email);
			const now = Date.now();
			const githubLogin = input.github ?? previous?.githubLogin;
			const provenance = invitedVia?.slice(0, 256) ?? previous?.invitedVia;
			const grant = {
				email,
				...githubLogin ? { githubLogin } : {},
				...provenance ? { invitedVia: provenance } : {},
				createdAt: previous?.createdAt ?? now,
				expiresAt
			};
			let gatewayAccess = "";
			await this.policy.update(async (emails) => {
				const entries = await store.entries();
				const known = /* @__PURE__ */ new Set([...emails, ...entries.map((entry) => entry.key)]);
				if (!known.has(email) && known.size >= this.config.maxVisitors) throw new VisitorAccessError(`Visitor limit (${this.config.maxVisitors}) reached. Revoke an existing visitor before inviting another.`);
				const access = await this.readAccess();
				access.assertInvitable(email);
				gatewayAccess = access.describe(email);
				if (!previous) await this.registerGrant({
					...grant,
					expiresAt: now
				}, store);
				return [.../* @__PURE__ */ new Set([...emails, email])];
			}, assertCurrent);
			const continuous = previous && grantIdSchema.safeParse(previous.grantId).success && (previous.expiresAt === null || previous.expiresAt > Date.now());
			grant.grantId = continuous ? previous.grantId : randomUUID();
			await this.registerGrant(grant, continuous ? this.actionStore(() => {
				assertCurrent();
				if (previous.expiresAt !== null && previous.expiresAt <= Date.now()) throw new VisitorAccessError("The previous visitor grant expired before renewal was recorded. Check the grant and invite again.");
			}) : store);
			const who = grant.githubLogin ? `@${grant.githubLogin} (${email})` : email;
			return `${previous ? "Renewed" : "Invited"} ${who}. Visitor grant expires: ${expiryText(grant.expiresAt)}. ${gatewayAccess}. Sign in at https://team.openclaw.ai using Team's existing login with this email. The link itself does not grant access.`;
		}, assertCurrent);
	}
	revoke(raw, assertCurrent) {
		return this.serialize(async () => {
			const store = this.actionStore(assertCurrent);
			const input = parseVisitorInput(revokeSchema, raw);
			if (!input.email && !input.github) throw new VisitorAccessError("Provide an email or GitHub login.");
			const entries = await store.entries();
			const matching = input.email ? [input.email] : entries.filter((entry) => entry.value.githubLogin === input.github).map((entry) => entry.key);
			const targets = new Set(matching.length ? matching : [await this.resolveEmail(input)]);
			const now = Date.now();
			for (const { key, value } of entries) if (targets.has(key) && (value.expiresAt === null || value.expiresAt > now)) await this.registerGrant({
				...value,
				expiresAt: now
			}, store);
			let removed = false;
			await this.policy.update((emails) => {
				removed = emails.some((email) => targets.has(email)) || entries.some((entry) => targets.has(entry.key));
				return emails.filter((email) => !targets.has(email));
			}, assertCurrent);
			for (const email of targets) {
				assertCurrent();
				await this.deleteGrant(email, store);
			}
			const who = targets.size > 1 ? `@${input.github} (${targets.size} recorded emails)` : [...targets].join(", ");
			return removed ? `Revoked visitor access for ${who}.` : `No visitor grant found for ${who}; nothing to revoke.`;
		}, assertCurrent);
	}
	list(assertCurrent) {
		return this.serialize(async () => {
			const policy = await this.policy.read(assertCurrent);
			const emails = new Set(policy?.emails ?? []);
			const entries = await this.store.entries();
			const access = await this.readAccess();
			assertCurrent();
			const managed = new Set(entries.map((entry) => entry.key));
			const unmanaged = [...emails].filter((email) => !managed.has(email)).toSorted();
			const missing = entries.filter((entry) => !emails.has(entry.key)).length;
			const summary = `Visitors: ${entries.length} recorded; ${emails.size} in policy. Drift: ${unmanaged.length} unmanaged, ${missing} missing from policy.`;
			const lines = [summary];
			const rows = entries.toSorted((a, b) => a.key.localeCompare(b.key)).map(({ value: grant }) => {
				const state = !emails.has(grant.email) ? "MISSING FROM POLICY" : grant.expiresAt !== null && grant.expiresAt <= Date.now() ? "EXPIRED; provider cleanup pending" : "managed";
				return `${grant.email} | ${grant.githubLogin ? `@${grant.githubLogin}` : "GitHub unknown"} | invited ${new Date(grant.createdAt).toISOString()} | grant expires ${expiryText(grant.expiresAt)} | ${state} | ${access.describe(grant.email)}`;
			});
			rows.push(...unmanaged.map((email) => `${email} | UNMANAGED: no grant record; retained until explicit revoke. | ${access.describe(email)}`));
			let length = summary.length;
			let shown = 0;
			for (const row of rows.slice(0, this.config.maxVisitors)) {
				if (length + row.length + 1 > 11880) break;
				lines.push(row);
				length += row.length + 1;
				shown++;
			}
			if (shown < rows.length) lines.push(`${rows.length - shown} entries omitted by output limits. Inspect the Access policy and revoke by explicit email.`);
			return lines.join("\n");
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
			await this.policy.update(async (emails) => {
				for (const email of emails) if (!managed.has(email)) this.logger.warn(`visitor-access: unmanaged policy email ${email}; retained.`);
				for (const { key, value } of entries) {
					if (value.grantId === void 0 && !expired.has(key) && emails.includes(key)) await this.registerGrant({
						...value,
						grantId: randomUUID()
					}, store);
					if (!emails.includes(key) && !expired.has(key)) this.logger.warn(`visitor-access: ${key} is recorded but missing from policy; invite again to restore access or revoke to remove the record.`);
				}
				return emails.filter((email) => !expired.has(email));
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
	}), new VisitorPolicyClient(config, fetch, lifetime.signal), api.logger, createVisitorAccessReader(api.runtime), fetch, lifetime.signal);
	const runtime = {
		service,
		errorText: (error) => visitorErrorText(error, config.apiToken)
	};
	api.registerGatewayAccessPolicy({
		resume({ profile, grantId }) {
			return service.resume(profile.emails, grantId);
		},
		authorize({ config: currentConfig, profile, requiredByRole }) {
			const roles = currentConfig.gateway?.roles;
			if (!requiredByRole || !profileUsesVisitorRole(roles, {
				id: profile.profileId,
				role: profile.assignedRole
			})) return;
			resolveVisitorRole(currentConfig);
			return service.authorize(profile.emails);
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
