import { b as uniqueValues } from "./string-normalization-CECOqf64.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as sensitive, r as SecretInputSchema } from "./zod-schema.sensitive-bEFwMmOC.mjs";
import { a as READ_SCOPE, c as TALK_SCOPE, i as QUESTIONS_SCOPE, l as TALK_SECRETS_SCOPE, n as APPROVALS_SCOPE, o as SESSION_READ_SCOPE, r as PAIRING_SCOPE, s as SESSION_WRITE_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { t as normalizeGitHubLogin } from "./github-login-COsXH2kL.mjs";
import { m as validateHttpOrigin, n as GatewayRemoteConfigSchema, u as ResponsesEndpointUrlFetchShape } from "./zod-schema.root-support-B_04-6fB.mjs";
import { isIP } from "node:net";
//#region src/gateway/control-ui-bootstrap-contract.ts
/** HTTP path for the Control UI bootstrap config payload. */
const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/control-ui-config.json";
/** Fragment marker selecting the host-authorized browser-owner bootstrap profile. */
const CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM = "bootstrapProfile";
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT = "owner";
/** Carries the gateway-configured Control UI mount path into browser bootstrap. */
const CONTROL_UI_BASE_PATH_ATTRIBUTE = "data-openclaw-control-ui-base-path";
/** Marks whether the served document CSP permits the terminal WASM runtime. */
const CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE = "data-openclaw-terminal-enabled";
const CONTROL_UI_ENVIRONMENT_ATTRIBUTE = "data-openclaw-environment";
const CONTROL_UI_ENVIRONMENT_COLORS = [
	"teal",
	"amber",
	"purple",
	"coral",
	"pink",
	"blue",
	"green",
	"red",
	"gray"
];
//#endregion
//#region src/config/gateway-portal-ingress.ts
/** Validate a bare DNS suffix with room for a random per-portal hostname label. */
function isValidPortalIngressDomain(domain) {
	try {
		if (new URL(`https://portal.${domain}`).hostname !== `portal.${domain.toLowerCase()}`) return false;
	} catch {
		return false;
	}
	return domain.length <= 220 && domain.includes(".") && isIP(domain) === 0 && domain.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/iu.test(label));
}
/** Reject a portal namespace containing a known Gateway/Control UI hostname. */
function portalIngressConflictsWithOrigin(domain, origin) {
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		const suffix = domain.toLowerCase();
		return hostname === suffix || hostname.endsWith(`.${suffix}`);
	} catch {
		return false;
	}
}
//#endregion
//#region src/config/zod-schema.gateway.ts
const OperatorScopeSchema = _enum([
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	SESSION_READ_SCOPE,
	SESSION_WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SCOPE,
	TALK_SECRETS_SCOPE
]);
const GatewayGitHubEndpointSchema = strictObject({
	host: string().trim().min(1).optional(),
	apiBaseUrl: string().url().optional()
}).superRefine((value, ctx) => {
	if (!value.host && !value.apiBaseUrl) return;
	const host = value.host?.toLowerCase();
	if (!host || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/u.test(host) || host.includes("..")) {
		ctx.addIssue({
			code: "custom",
			path: ["host"],
			message: "GitHub host must be a hostname"
		});
		return;
	}
	if (!value.apiBaseUrl) {
		ctx.addIssue({
			code: "custom",
			path: ["apiBaseUrl"],
			message: "GitHub API base URL is required with host"
		});
		return;
	}
	const api = new URL(value.apiBaseUrl);
	const cloudApi = api.hostname === `api.${host}` && api.pathname === "/";
	const serverApi = api.hostname === host && ["/api/v3", "/api/v3/"].includes(api.pathname);
	if (api.protocol !== "https:" || api.username || api.password || api.search || api.hash || !cloudApi && !serverApi) ctx.addIssue({
		code: "custom",
		path: ["apiBaseUrl"],
		message: "GitHub API base URL must match the configured HTTPS host"
	});
});
const GatewayOperatorRoleDefinitionSchema = strictObject({
	sessions: strictObject({ 
	/** Maximum access to another person's sessions without explicit membership. */
others: _enum([
		"none",
		"view",
		"suggest",
		"write"
	]) }),
	/** Require sandbox isolation for newly created sessions, or inherit agent policy by default. */
	sandbox: _enum(["inherit", "required"]).optional(),
	/** Agent IDs available for session creation and runs, or all agents when set to "*". */
	agents: union([literal("*"), array(string().trim().min(1).refine(isValidAgentId, "Invalid agent id")).transform((agents) => uniqueValues(agents.map(normalizeAgentId)))]),
	/** Optional model ceiling for this role; defaults to the source agent's primary and fallbacks. */
	modelPolicy: strictObject({
		sourceAgent: string().trim().min(1).refine(isValidAgentId, "Invalid agent id").transform(normalizeAgentId).optional(),
		allow: array(string().trim().min(1)).optional(),
		deny: array(string().trim().min(1)).optional()
	}).optional(),
	/** Ceiling applied to the authenticated profile's granted operator scopes. */
	scopes: array(OperatorScopeSchema).transform((scopes) => uniqueValues(scopes)),
	/** Required access-policy plugin; availability is checked at admission, not config parsing. */
	accessPolicyPlugin: string().trim().min(1).max(128).optional()
});
const GatewayOperatorRoleNameSchema = string().trim().min(1).max(128);
const GATEWAY_HTTP_LOOPBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"[::1]"
]);
const GatewayHttpImagesSchema = strictObject(ResponsesEndpointUrlFetchShape).optional();
function validateGatewayPublicOrigin(value) {
	if (!validateHttpOrigin(value)) return false;
	const url = new URL(value);
	return url.protocol === "https:" || GATEWAY_HTTP_LOOPBACK_HOSTS.has(url.hostname);
}
const GatewayConfigSchema = strictObject({
	/** Single multiplexed port for Gateway WS + HTTP (default: 18789). */
	port: number().int().min(1).max(65535).optional(),
	/**
	* Explicit gateway mode. When set to "remote", local gateway start is disabled.
	* When set to "local", the CLI may start the gateway locally.
	*/
	mode: union([literal("local"), literal("remote")]).optional(),
	/**
	* Bind address policy for the Gateway WebSocket + Control UI HTTP server.
	* - auto: Loopback (127.0.0.1) if available, else 0.0.0.0 (fallback to all interfaces)
	* - lan: 0.0.0.0 (all interfaces, no fallback, current BYOH path is IPv4-only)
	* - loopback: 127.0.0.1 (local-only)
	* - tailnet: Tailnet IPv4 plus 127.0.0.1 if available, else loopback only
	* - custom: User-specified IPv4 address (requires customBindHost); specific IPv4s also bind 127.0.0.1
	* IPv6-only BYOH is not natively supported on this path today. Use an IPv4 sidecar or proxy.
	* Default: loopback (127.0.0.1).
	*/
	bind: union([
		literal("auto"),
		literal("lan"),
		literal("loopback"),
		literal("custom"),
		literal("tailnet")
	]).optional(),
	/** Custom IPv4 address for bind="custom" mode. IPv6-only BYOH requires an IPv4 sidecar or proxy. */
	customBindHost: string().optional(),
	/** Externally reachable HTTPS origin for Gateway callback routes; HTTP only on loopback. */
	publicOrigin: string().url().refine(validateGatewayPublicOrigin, "gateway.publicOrigin must be a bare HTTPS origin; HTTP is allowed only for localhost, 127.0.0.1, or [::1]").optional(),
	/** Private HTTPS wildcard proxy forwarding to a dedicated loopback listener. */
	portals: strictObject({ ingress: strictObject({
		domain: string().refine(isValidPortalIngressDomain, "Portal ingress domain must be a bare DNS domain"),
		port: number().int().min(1).max(65535)
	}).optional() }).optional(),
	github: GatewayGitHubEndpointSchema.optional(),
	projects: strictObject({
		defaultRepository: strictObject({
			url: string().trim().min(1),
			ref: string().trim().min(1).max(255).optional()
		}).optional(),
		nativeGitHubSearch: boolean().optional()
	}).optional(),
	controlUi: strictObject({
		/**
		* @deprecated Upgrade-only transport input. Retained so releases that shipped
		* this break-glass flag can migrate an unpaired browser safely.
		*/
		dangerouslyDisableDeviceAuth: boolean().optional(),
		/** If false, the Gateway will not serve the Control UI (default /). */
		enabled: boolean().optional(),
		/** Optional base path prefix for the Control UI (e.g. "/openclaw"). */
		basePath: string().optional(),
		experimental: strictObject({ 
		/** Allow native UI from user-installed plugins (default false; bundled UI stays available). */
customPlugins: boolean().optional() }).optional(),
		/** Optional filesystem root for Control UI assets (defaults to dist/control-ui). */
		root: string().optional(),
		/** Optional visual label and named color distinguishing this Gateway environment. */
		environment: strictObject({
			label: string().trim().min(1).max(24),
			color: _enum(CONTROL_UI_ENVIRONMENT_COLORS)
		}).optional(),
		/** Show the Discord community invitation in this Gateway's Control UI (default true). */
		communityInvite: boolean().optional(),
		/** Seed fresh drafts from configured model/reasoning instead of remembered choices. */
		newSessionModelDefaults: _enum(["last-used", "configured"]).optional(),
		/** Optional service credential used only for Control UI GitHub previews and discovery. */
		github: strictObject({
			host: string().trim().regex(/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/iu).optional(),
			token: SecretInputSchema.optional().register(sensitive)
		}).optional(),
		/** Produce utility-model session status digests for subscribed Control UI clients (default true). */
		sessionObserver: boolean().optional(),
		/**
		* Embed sandbox mode for hosted Control UI previews.
		* - strict: no script execution inside embeds
		* - scripts: allow scripts while keeping embeds origin-isolated (default)
		* - trusted: allow scripts and same-origin privileges
		*/
		embedSandbox: union([
			literal("strict"),
			literal("scripts"),
			literal("trusted")
		]).optional(),
		/**
		* DANGEROUS: Allow hosted embeds to load absolute external http(s) URLs.
		* Default off; prefer hosted /__openclaw__/canvas or /__openclaw__/a2ui content.
		*/
		allowExternalEmbedUrls: boolean().optional(),
		/** Fetch public-site favicons through the Gateway for Control UI links (default true). */
		automaticallyFetchFavicons: boolean().optional(),
		/** Allowed browser origins for Control UI/WebChat websocket connections. */
		allowedOrigins: array(string()).optional(),
		/**
		* DANGEROUS: Keep Host-header origin fallback behavior.
		* Supported long-term for deployments that intentionally rely on this policy.
		*/
		dangerouslyAllowHostHeaderOriginFallback: boolean().optional()
	}).optional(),
	uploads: strictObject({ 
	/** Allow client file/image uploads to the Gateway (default true). Hot-applies. */
enabled: boolean().optional() }).optional(),
	cliAgents: strictObject({ 
	/** Show catalog-backed CLI agents in the new-session model picker. Default: true. */
enabled: boolean().optional() }).optional(),
	terminal: strictObject({
		/** Master switch for the operator terminal. Default: true; set false to opt out. */
		enabled: boolean().optional(),
		/**
		* Shell executable to launch. When unset the host login shell is used
		* ($SHELL on Unix, %ComSpec% on Windows).
		*/
		shell: string().optional(),
		/**
		* How long (seconds) a session survives after its connection drops, staying
		* reattachable via terminal.attach. 0 kills sessions on disconnect
		* immediately. Default: 300.
		*/
		detachedSessionTimeoutSeconds: number().int().min(0).optional()
	}).optional(),
	auth: strictObject({
		/**
		* Authentication mode for Gateway connections. Token/password mode selects the
		* configured secret; clients may send it in either auth.token or auth.password.
		*/
		mode: union([
			literal("none"),
			literal("token"),
			literal("password"),
			literal("trusted-proxy")
		]).optional(),
		/** Shared secret selected by token mode (plaintext or SecretRef). */
		token: SecretInputSchema.optional().register(sensitive),
		/** Shared secret selected by password mode (plaintext or SecretRef; consider env instead). */
		password: SecretInputSchema.optional().register(sensitive),
		/** Allow Tailscale identity headers when serve mode is enabled. */
		allowTailscale: boolean().optional(),
		/** Operator scopes granted to verified trusted-proxy or Tailscale identities. */
		identityScopes: record(string().min(1), array(OperatorScopeSchema)).optional(),
		/** Rate-limit configuration for failed authentication attempts. */
		rateLimit: strictObject({
			/** Maximum failed attempts per IP before blocking.  @default 10 */
			maxAttempts: number().optional(),
			/** Sliding window duration in milliseconds.  @default 60000 (1 min) */
			windowMs: number().optional(),
			/** Lockout duration in milliseconds after the limit is exceeded.  @default 300000 (5 min) */
			lockoutMs: number().optional(),
			/** Exempt localhost/loopback addresses from auth rate limiting.  @default true */
			exemptLoopback: boolean().optional()
		}).optional(),
		/**
		* Configuration for trusted-proxy auth mode.
		* Required when mode is "trusted-proxy".
		*/
		trustedProxy: strictObject({
			/**
			* Header name containing the authenticated user identity (required).
			* Common values: "x-forwarded-user", "x-remote-user", "x-pomerium-claim-email"
			*/
			userHeader: string().min(1, "userHeader is required for trusted-proxy mode"),
			/**
			* Additional headers that MUST be present for the request to be trusted.
			* Use this to verify the request actually came through the proxy.
			* Example: ["x-forwarded-proto", "x-forwarded-host"]
			*/
			requiredHeaders: array(string()).optional(),
			/**
			* Optional allowlist of user identities that can access the gateway.
			* If empty or omitted, all authenticated users from the proxy are allowed.
			* Example: ["nick@example.com", "admin@company.org"]
			*/
			allowUsers: array(string()).optional(),
			/**
			* Allow loopback proxy sources (127.0.0.1, ::1) in trusted-proxy mode.
			* Default false; enable only when a same-host reverse proxy is the intended
			* trust boundary and direct Gateway access is otherwise locked down.
			*/
			allowLoopback: boolean().optional(),
			/** Optional verified GitHub identity from one explicitly trusted Access OIDC provider. */
			cloudflareAccessOidc: strictObject({
				/** Exact Cloudflare Access issuer origin, including https://. */
				issuer: string().regex(/^https:\/\/[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.cloudflareaccess\.com$/u, "Expected a Cloudflare Access HTTPS issuer origin without a trailing slash"),
				/** Access identity-provider ID, not its display name or the OIDC subject. */
				providerId: string().trim().min(1),
				/** Forwarded claim containing a verified numeric GitHub account ID as a decimal string. */
				githubAccountIdClaim: string().trim().min(1)
			}).optional(),
			/**
			* Automatically approve new browser/native UI operator devices and same-key scope upgrades after
			* trusted-proxy authentication. Disabled by default; configured scopes cap grants.
			*/
			deviceAutoApprove: strictObject({
				/** Enable automatic browser enrollment and same-key scope upgrades. @default false */
				enabled: boolean().optional(),
				/**
				* Maximum operator scopes granted by automatic approval. Listing
				* operator.admin explicitly lets every proxy-authenticated user request
				* automatic full-admin device grants. Requests without scopes receive the
				* configured maximum. @default operator.read, operator.write,
				* operator.approvals, operator.questions
				*/
				scopes: array(string().min(1)).optional()
			}).optional()
		}).optional()
	}).optional(),
	/** Optional profile-bound operator roles; omitted preserves legacy authorization. */
	roles: strictObject({
		/** Required default for profiles without a valid explicit or GitHub login assignment. */
		default: GatewayOperatorRoleNameSchema,
		assignments: strictObject({ 
		/** Case-insensitive GitHub login assignments; explicit profile assignments win. */
byGithubLogin: record(string(), GatewayOperatorRoleNameSchema).optional() }).optional(),
		/** Closed capability bundles indexed by administrator-selected role names. */
		definitions: record(GatewayOperatorRoleNameSchema, GatewayOperatorRoleDefinitionSchema).refine((definitions) => Object.keys(definitions).length > 0, "gateway.roles.definitions must contain at least one role definition")
	}).superRefine((roles, ctx) => {
		if (!Object.hasOwn(roles.definitions, roles.default)) ctx.addIssue({
			code: "custom",
			message: "gateway.roles.default must name a configured role definition",
			path: ["default"]
		});
		const githubLogins = /* @__PURE__ */ new Set();
		for (const [login, role] of Object.entries(roles.assignments?.byGithubLogin ?? {})) {
			const normalizedLogin = normalizeGitHubLogin(login)?.toLowerCase();
			const path = [
				"assignments",
				"byGithubLogin",
				login
			];
			if (!normalizedLogin) ctx.addIssue({
				code: "custom",
				message: "Invalid GitHub login",
				path
			});
			else if (githubLogins.has(normalizedLogin)) ctx.addIssue({
				code: "custom",
				message: "Duplicate GitHub login",
				path
			});
			else githubLogins.add(normalizedLogin);
			if (!Object.hasOwn(roles.definitions, role)) ctx.addIssue({
				code: "custom",
				message: "gateway.roles.assignments.byGithubLogin must name a configured role definition",
				path
			});
		}
	}).optional(),
	/**
	* IPs of trusted reverse proxies (e.g. Traefik, nginx). When a connection
	* arrives from one of these IPs, the Gateway trusts `x-forwarded-for`
	* to determine the client IP for local pairing and HTTP checks.
	*/
	trustedProxies: array(string()).optional(),
	/**
	* Allow `x-real-ip` as a fallback only when `x-forwarded-for` is missing.
	* Default: false (safer fail-closed behavior).
	*/
	allowRealIpFallback: boolean().optional(),
	/** Tool access restrictions for HTTP /tools/invoke endpoint. */
	tools: strictObject({
		/** Tools to deny via gateway HTTP /tools/invoke (extends defaults). */
		deny: array(string()).optional(),
		/** Tools to explicitly allow (removes from default deny list). */
		allow: array(string()).optional()
	}).optional(),
	tailscale: strictObject({
		/** Tailscale exposure mode for the Gateway control UI. */
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		/**
		* Detect an external Funnel route left on the ordinary Gateway listener and
		* leave exposure unchanged with migration guidance. Gateway-authenticated
		* routes reject that ingress; plugin-authenticated webhooks keep their owner auth.
		* @deprecated Migrate to `mode="funnel"`, which uses managed ingress.
		*/
		preserveFunnel: boolean().optional()
	}).optional(),
	remote: GatewayRemoteConfigSchema,
	reload: strictObject({ mode: union([literal("off"), literal("hybrid")]).optional() }).optional(),
	tls: object({
		enabled: boolean().optional(),
		autoGenerate: boolean().optional(),
		certPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "certPath must not be blank"),
		keyPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "keyPath must not be blank"),
		caPath: string().optional()
	}).optional(),
	http: strictObject({
		endpoints: strictObject({
			chatCompletions: strictObject({
				enabled: boolean().optional(),
				images: GatewayHttpImagesSchema
			}).optional(),
			responses: strictObject({
				enabled: boolean().optional(),
				maxUrlParts: number().int().nonnegative().optional(),
				files: strictObject({
					...ResponsesEndpointUrlFetchShape,
					maxChars: number().int().positive().optional(),
					pdf: strictObject({
						maxPages: number().int().positive().optional(),
						maxPixels: number().int().positive().optional(),
						minTextChars: number().int().nonnegative().optional()
					}).optional()
				}).optional(),
				images: GatewayHttpImagesSchema
			}).optional()
		}).optional(),
		securityHeaders: strictObject({ strictTransportSecurity: union([string(), literal(false)]).optional() }).optional()
	}).optional(),
	push: strictObject({ apns: strictObject({ relay: strictObject({
		baseUrl: string().optional(),
		timeoutMs: number().int().positive().optional()
	}).optional() }).optional() }).optional(),
	nodes: strictObject({
		/** Browser routing policy for node-hosted browser proxies. */
		browser: strictObject({
			/** Routing mode (default: auto). */
			mode: union([
				literal("auto"),
				literal("manual"),
				literal("off")
			]).optional(),
			/** Pin to a specific node id/name (optional). */
			node: string().optional()
		}).optional(),
		/** Pairing policy for node-role gateway clients. */
		pairing: strictObject({
			/**
			* Silently approve trusted local device pairing and access upgrades.
			* Set false to require explicit approval; metadata refreshes remain automatic.
			* Default: true.
			*/
			autoApproveLocal: boolean().optional(),
			/**
			* Opt-in CIDR/IP allowlist for auto-approving first-time node-role pairing.
			* Only applies to fresh node pairing requests with no requested scopes.
			* Default: unset/disabled.
			*/
			autoApproveCidrs: array(string()).optional(),
			/**
			* SSH-verified auto-approval for first-time node-role pairing (default: enabled).
			* The gateway connects back to the pairing host over SSH (BatchMode, strict
			* host keys) and approves only when the remote `openclaw node identity`
			* output matches the pending request's device key. Set false to disable SSH
			* verification; this is independent of autoApproveCidrs, so unset that too for
			* manual-only node pairing. The object form tunes the probe:
			* - user: remote user (default: gateway process user)
			* - identity: SSH identity file (default: standard SSH resolution)
			* - timeoutMs: probe timeout (default: 7000)
			* - cidrs: CIDRs/IPs eligible for probing (default: private/CGNAT ranges)
			*/
			sshVerify: union([boolean(), strictObject({
				user: string().optional(),
				identity: string().optional(),
				timeoutMs: number().int().positive().optional(),
				cidrs: array(string()).optional()
			})]).optional()
		}).optional(),
		/** Controls whether paired nodes may publish agent-visible plugin tools (default: true). */
		pluginTools: strictObject({ 
		/** Accept node-published plugin tool descriptors (default: true). */
enabled: boolean().optional() }).optional(),
		/** Accept node-published skill descriptors (default: true). */
		allowSkills: boolean().optional(),
		commands: strictObject({
			/** Additional node.invoke commands to allow on the gateway. */
			allow: array(string()).optional(),
			/** Commands to deny even if they appear in the defaults or node claims. */
			deny: array(string()).optional()
		}).optional()
	}).optional()
}).superRefine((gateway, ctx) => {
	const ingress = gateway.portals?.ingress;
	if (!ingress) return;
	if ([gateway.publicOrigin, ...gateway.controlUi?.allowedOrigins ?? []].some((origin) => origin && portalIngressConflictsWithOrigin(ingress.domain, origin))) ctx.addIssue({
		code: "custom",
		path: [
			"portals",
			"ingress",
			"domain"
		],
		message: "Portal ingress must use a separate domain from Gateway and Control UI origins"
	});
	if (ingress.port === (gateway.port ?? 18789)) ctx.addIssue({
		code: "custom",
		path: [
			"portals",
			"ingress",
			"port"
		],
		message: "Portal ingress port must differ from the Gateway port"
	});
}).optional();
//#endregion
export { CONTROL_UI_BOOTSTRAP_CONFIG_PATH as a, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT as c, CONTROL_UI_BASE_PATH_ATTRIBUTE as i, CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE as l, isValidPortalIngressDomain as n, CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM as o, portalIngressConflictsWithOrigin as r, CONTROL_UI_ENVIRONMENT_ATTRIBUTE as s, GatewayConfigSchema as t };
