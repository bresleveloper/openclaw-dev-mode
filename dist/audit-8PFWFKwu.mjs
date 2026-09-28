import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { A as tryResolveDefaultAgentId, E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, T as hasAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { f as resolveConfigSecretRef, r as copyConfigResolutionFacts, u as hasUnresolvedConfigPath } from "./resolution-facts-CSuKIPux.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { c as emitTrustedSecurityEvent } from "./diagnostic-events-CVabF32H.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-KhFe5dXK.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as resolveExecModePolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { o as listRiskyConfiguredSafeBins } from "./exec-safe-bin-trust-DnYaEjcb.mjs";
import { t as createGatewayCredentialPlan } from "./credential-planner-D-JGW62E.mjs";
import { a as inspectPathPermissions, i as formatPermissionRemediation, r as formatPermissionDetail } from "./permissions-DOmAO-Zd.mjs";
import { r as isInvalidGatewaySecret } from "./known-weak-gateway-secrets-BzNXiOK5.mjs";
import { r as resolveGatewayAuthForConfig } from "./auth-resolve-BeCTtDNQ.mjs";
import { i as loadExecApprovals } from "./exec-approvals-store-CTT-ox-I.mjs";
import { u as isInterpreterLikeAllowlistPattern } from "./risks-HzTsadnl.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { n as resolveExecDefaults } from "./exec-defaults-aBiGwrXO.mjs";
import { t as DEFAULT_GATEWAY_HTTP_TOOL_DENY } from "./dangerous-tools-D5_2xo_6.mjs";
import { i as resolveMergedSafeBinProfileFixtures, n as listInterpreterLikeSafeBins } from "./exec-safe-bin-runtime-policy-eHJh3MzL.mjs";
import "./audit-fs-td54YTW0.mjs";
import { r as materializeGatewayAuthSecretRefs, t as canMaterializeGatewayAuthSecretRefsWithoutExec } from "./auth-config-utils-Dhjw7M6e.mjs";
import { n as normalizeConfiguredTrustedSafeBinDirs, t as normalizeConfiguredSafeBins } from "./exec-safe-bin-config-DOajtM2P.mjs";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-l9swrDqQ.mjs";
import { r as collectCoreInsecureOrDangerousFlags } from "./dangerous-config-flags-current--lXwjO9R.mjs";
import { t as collectEnabledInsecureOrDangerousFlags } from "./dangerous-config-flags-DSEcwezg.mjs";
import { t as collectExecFilesystemPolicyDriftHits } from "./exec-filesystem-policy-Dbe_Cr7-.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { isIP } from "node:net";
//#region src/security/audit-deep-code-safety.ts
/** Lazily load deep audit code paths so normal audits avoid plugin/skill scans. */
const loadAuditDeepModule = createLazyRuntimeModule(() => import("./audit.deep.runtime.js"));
/** Collect plugin and installed-skill code safety findings when deep audit is enabled. */
async function collectDeepCodeSafetyFindings(params) {
	if (!params.deep) return [];
	const auditDeep = await loadAuditDeepModule();
	return [...await auditDeep.collectPluginsCodeSafetyFindings({
		stateDir: params.stateDir,
		summaryCache: params.summaryCache
	}), ...await auditDeep.collectInstalledSkillsCodeSafetyFindings({
		cfg: params.cfg,
		stateDir: params.stateDir,
		workspaceDir: params.workspaceDir,
		summaryCache: params.summaryCache
	})];
}
//#endregion
//#region src/security/audit-deep-probe-findings.ts
/**
* Convert optional deep gateway probe results into security audit findings.
* This keeps CLI/audit callers aligned on check ids, titles, and remediation text.
*/
function collectDeepProbeFindings(params) {
	const findings = [];
	if (params.deep?.gateway?.attempted && !params.deep.gateway.ok) findings.push({
		checkId: "gateway.probe_failed",
		severity: "warn",
		title: "Gateway probe failed (deep)",
		detail: params.deep.gateway.error ?? "gateway unreachable",
		remediation: `Run "${formatCliCommand("openclaw status --all")}" to debug connectivity/auth, then re-run "${formatCliCommand("openclaw security audit --deep")}".`
	});
	if (params.authWarning) findings.push({
		checkId: "gateway.probe_auth_secretref_unavailable",
		severity: "warn",
		title: "Gateway probe auth SecretRef is unavailable",
		detail: params.authWarning,
		remediation: `Set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD in this shell or resolve the external secret provider, then re-run "${formatCliCommand("openclaw security audit --deep")}".`
	});
	return findings;
}
//#endregion
//#region src/security/audit-gateway-config.ts
function collectGatewayConfigFindings$1(cfg, sourceConfig, env, options = {}) {
	const findings = [];
	const bind = typeof cfg.gateway?.bind === "string" ? cfg.gateway.bind : "loopback";
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	const auth = resolveGatewayAuthForConfig({
		config: cfg,
		authOverride: options.gatewayAuthOverride,
		tailscaleMode,
		env
	});
	const controlUiEnabled = cfg.gateway?.controlUi?.enabled !== false;
	const controlUiAllowedOrigins = normalizeStringEntries(cfg.gateway?.controlUi?.allowedOrigins ?? []);
	const dangerouslyAllowHostHeaderOriginFallback = cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true;
	const trustedProxies = Array.isArray(cfg.gateway?.trustedProxies) ? cfg.gateway.trustedProxies : [];
	const hasToken = typeof auth.token === "string" && auth.token.trim().length > 0 && !hasUnresolvedConfigPath(sourceConfig, "gateway.auth.token");
	const hasPassword = typeof auth.password === "string" && auth.password.trim().length > 0 && !hasUnresolvedConfigPath(sourceConfig, "gateway.auth.password");
	const plan = createGatewayCredentialPlan({
		config: sourceConfig,
		env
	});
	const explicitAuthMode = options.gatewayAuthOverride?.mode ?? sourceConfig.gateway?.auth?.mode;
	const tokenConfigured = Boolean(hasToken || plan.envToken || plan.localToken.value || plan.localToken.hasSecretRef || plan.remoteToken.value || plan.remoteToken.hasSecretRef);
	const passwordConfigured = Boolean(hasPassword || (explicitAuthMode === "password" || explicitAuthMode !== "token" && explicitAuthMode !== "none" && explicitAuthMode !== "trusted-proxy" && !tokenConfigured) && (plan.envPassword || plan.localPassword.value || plan.localPassword.hasSecretRef));
	const hasGatewayAuth = (explicitAuthMode === "token" ? tokenConfigured : explicitAuthMode === "password" ? passwordConfigured : explicitAuthMode === "none" || explicitAuthMode === "trusted-proxy" ? false : tokenConfigured || passwordConfigured) || auth.mode === "trusted-proxy";
	const hasLoopbackAuth = hasGatewayAuth || auth.allowTailscale && tailscaleMode === "serve";
	const allowRealIpFallback = cfg.gateway?.allowRealIpFallback === true;
	const mdnsMode = cfg.discovery?.mdns?.mode ?? "minimal";
	const gatewayToolsAllowRaw = Array.isArray(cfg.gateway?.tools?.allow) ? cfg.gateway?.tools?.allow : [];
	const gatewayToolsAllow = new Set(gatewayToolsAllowRaw.map((v) => normalizeOptionalLowercaseString(v) ?? "").filter(Boolean));
	const reenabledOverHttp = DEFAULT_GATEWAY_HTTP_TOOL_DENY.filter((name) => gatewayToolsAllow.has(name));
	if (reenabledOverHttp.length > 0) {
		const extraRisk = bind !== "loopback" || tailscaleMode === "funnel";
		findings.push({
			checkId: "gateway.tools_invoke_http.dangerous_allow",
			severity: extraRisk ? "critical" : "warn",
			title: "Gateway HTTP /tools/invoke re-enables dangerous tools",
			detail: `gateway.tools.allow includes ${reenabledOverHttp.join(", ")} which removes them from the default HTTP deny list. This can allow remote session spawning / control-plane actions via HTTP and increases RCE blast radius if the gateway is reachable.`,
			remediation: "Remove these entries from gateway.tools.allow (recommended). If you keep them enabled, keep gateway.bind loopback-only (or tailnet-only), restrict network exposure, and treat the gateway token/password as full-admin."
		});
	}
	if (bind !== "loopback" && !hasGatewayAuth) findings.push({
		checkId: "gateway.bind_no_auth",
		severity: "critical",
		title: "Gateway binds beyond loopback without auth",
		detail: `gateway.bind="${bind}" but no gateway.auth token/password is configured.`,
		remediation: `Set gateway.auth (token recommended) or bind to loopback.`
	});
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg: sourceConfig,
		env
	});
	if (tokenConflict) findings.push({
		checkId: tokenConflict.checkId,
		severity: "warn",
		title: tokenConflict.title,
		detail: tokenConflict.detail,
		remediation: tokenConflict.remediation
	});
	if (bind === "loopback" && controlUiEnabled && trustedProxies.length === 0) findings.push({
		checkId: "gateway.trusted_proxies_missing",
		severity: "warn",
		title: "Reverse proxy headers are not trusted",
		detail: "gateway.bind is loopback and gateway.trustedProxies is empty. If you expose the Control UI through a reverse proxy, configure trusted proxies so local-client checks cannot be spoofed.",
		remediation: "Set gateway.trustedProxies to your proxy IPs or keep the Control UI local-only."
	});
	if (bind === "loopback" && controlUiEnabled && !hasLoopbackAuth) findings.push({
		checkId: "gateway.loopback_no_auth",
		severity: "critical",
		title: "Gateway auth missing on loopback",
		detail: "gateway.bind is loopback but no gateway auth secret is configured. If the Control UI is exposed through a reverse proxy, unauthenticated access is possible.",
		remediation: "Set gateway.auth (token recommended) or keep the Control UI local-only."
	});
	if (bind !== "loopback" && controlUiEnabled && controlUiAllowedOrigins.length === 0 && !dangerouslyAllowHostHeaderOriginFallback) findings.push({
		checkId: "gateway.control_ui.allowed_origins_required",
		severity: "critical",
		title: "Non-loopback Control UI missing explicit allowed origins",
		detail: "Control UI is enabled on a non-loopback bind but gateway.controlUi.allowedOrigins is empty. Strict origin policy requires explicit allowed origins for non-loopback deployments.",
		remediation: "Set gateway.controlUi.allowedOrigins to full trusted origins (for example https://control.example.com). If your deployment intentionally relies on Host-header origin fallback, set gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true."
	});
	if (controlUiAllowedOrigins.includes("*")) {
		const exposed = bind !== "loopback";
		findings.push({
			checkId: "gateway.control_ui.allowed_origins_wildcard",
			severity: exposed ? "critical" : "warn",
			title: "Control UI allowed origins contains wildcard",
			detail: "gateway.controlUi.allowedOrigins includes \"*\" which means allow any browser origin for Control UI/WebChat requests. This disables origin allowlisting and should be treated as an intentional allow-all policy.",
			remediation: "Replace wildcard origins with explicit trusted origins (for example https://control.example.com). Do not use \"*\" outside tightly controlled local testing."
		});
	}
	if (dangerouslyAllowHostHeaderOriginFallback) {
		const exposed = bind !== "loopback";
		findings.push({
			checkId: "gateway.control_ui.host_header_origin_fallback",
			severity: exposed ? "critical" : "warn",
			title: "DANGEROUS: Host-header origin fallback enabled",
			detail: "gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true enables Host-header origin fallback for Control UI/WebChat websocket checks and weakens DNS rebinding protections.",
			remediation: "Disable gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback and configure explicit gateway.controlUi.allowedOrigins."
		});
	}
	if (allowRealIpFallback) {
		const hasNonLoopbackTrustedProxy = trustedProxies.some((proxy) => !isStrictLoopbackTrustedProxyEntry(proxy));
		const exposed = bind !== "loopback" || auth.mode === "trusted-proxy" && hasNonLoopbackTrustedProxy;
		findings.push({
			checkId: "gateway.real_ip_fallback_enabled",
			severity: exposed ? "critical" : "warn",
			title: "X-Real-IP fallback is enabled",
			detail: "gateway.allowRealIpFallback=true trusts X-Real-IP when trusted proxies omit X-Forwarded-For. Misconfigured proxies that forward client-supplied X-Real-IP can spoof source IP and local-client checks.",
			remediation: "Keep gateway.allowRealIpFallback=false (default). Only enable this when your trusted proxy always overwrites X-Real-IP and cannot provide X-Forwarded-For."
		});
	}
	if (mdnsMode === "full") {
		const exposed = bind !== "loopback";
		findings.push({
			checkId: "discovery.mdns_full_mode",
			severity: exposed ? "critical" : "warn",
			title: "mDNS full mode can leak host metadata",
			detail: "discovery.mdns.mode=\"full\" publishes cliPath/sshPort in local-network TXT records. This can reveal usernames, filesystem layout, and management ports.",
			remediation: "Prefer discovery.mdns.mode=\"minimal\" (recommended) or \"off\", especially when gateway.bind is not loopback."
		});
	}
	if (tailscaleMode === "funnel") findings.push({
		checkId: "gateway.tailscale_funnel",
		severity: "critical",
		title: "Tailscale Funnel exposure enabled",
		detail: `gateway.tailscale.mode="funnel" exposes the Gateway publicly; keep auth strict and treat it as internet-facing.`,
		remediation: `Prefer tailscale.mode="serve" (tailnet-only) or set tailscale.mode="off".`
	});
	else if (tailscaleMode === "serve") findings.push({
		checkId: "gateway.tailscale_serve",
		severity: "info",
		title: "Tailscale Serve exposure enabled",
		detail: `gateway.tailscale.mode="serve" exposes the Gateway to your tailnet (loopback behind Tailscale).`
	});
	if (cfg.mcp?.apps?.enabled === true) findings.push({
		checkId: "mcp.apps.enabled",
		severity: "warn",
		title: "MCP Apps UI bridge enabled",
		detail: "mcp.apps.enabled=true allows configured MCP servers to provide interactive HTML. Views are CSP-restricted and origin-isolated, but they can call app-visible tools on their owning MCP server while the session runtime remains active.",
		remediation: "Keep this enabled only for MCP servers you trust. Disable with `openclaw config set mcp.apps.enabled false --strict-json` when it is not needed."
	});
	const enabledDangerousFlags = (options.collectDangerousConfigFlags ?? collectCoreInsecureOrDangerousFlags)(cfg);
	for (const enabledFlag of enabledDangerousFlags) findings.push({
		checkId: "config.insecure_or_dangerous_flags",
		severity: "warn",
		title: "Insecure or dangerous config flag enabled",
		detail: `Detected enabled flag: ${enabledFlag}.`,
		remediation: "Disable this flag when not actively debugging, or keep deployment scoped to trusted/local-only networks."
	});
	for (const credential of ["token", "password"]) {
		if (auth.mode !== credential) continue;
		const configValue = cfg.gateway?.auth?.[credential];
		const override = options.gatewayAuthOverride?.[credential];
		const localPlan = credential === "token" ? plan.localToken : plan.localPassword;
		let input = auth[credential] ?? override ?? configValue;
		if (override === void 0 && localPlan.refPath) input = hasUnresolvedConfigPath(cfg, localPlan.refPath) || resolveConfigSecretRef({
			config: cfg,
			path: localPlan.refPath,
			value: configValue,
			defaults: cfg.secrets?.defaults
		}) ? void 0 : configValue;
		const value = typeof input === "string" ? input.trim() : null;
		if (isInvalidGatewaySecret(input)) findings.push({
			checkId: `gateway.${credential}_placeholder_value`,
			severity: "critical",
			title: `Gateway ${credential} is a blank or undefined/null placeholder`,
			detail: `The selected Gateway ${credential} is a known non-secret value. Gateway startup rejects it.`,
			remediation: credential === "token" ? "Run `openclaw doctor --fix --generate-gateway-token` for an inline token; otherwise rotate its external secret source. Restart the Gateway afterward." : "Generate a real secret (for example, `openssl rand -hex 32`) and update OPENCLAW_GATEWAY_PASSWORD or gateway.auth.password (or its external source). Restart the Gateway afterward."
		});
		else if (value && value.length < 24) findings.push({
			checkId: `gateway.${credential}_too_short`,
			severity: "warn",
			title: `Gateway ${credential} looks short`,
			detail: `gateway auth ${credential} is ${value.length} chars; prefer a long random ${credential}.`
		});
	}
	if (auth.mode === "trusted-proxy") {
		const trustedProxyConfig = cfg.gateway?.auth?.trustedProxy;
		findings.push({
			checkId: "gateway.trusted_proxy_auth",
			severity: "critical",
			title: "Trusted-proxy auth mode enabled",
			detail: "gateway.auth.mode=\"trusted-proxy\" delegates authentication to a reverse proxy. Ensure your proxy (Pomerium, Caddy, nginx) handles auth correctly and that gateway.trustedProxies only contains IPs of your actual proxy servers.",
			remediation: "Verify: (1) Your proxy terminates TLS and authenticates users. (2) gateway.trustedProxies is restricted to proxy IPs only. (3) Direct access to the Gateway port is blocked by firewall. Same-host proxy requests are rejected unless gateway.auth.trustedProxy.allowLoopback=true and gateway.trustedProxies includes their loopback source; enable only for a deliberate same-host trust boundary. See /gateway/trusted-proxy-auth for setup guidance."
		});
		if (trustedProxies.length === 0) findings.push({
			checkId: "gateway.trusted_proxy_no_proxies",
			severity: "critical",
			title: "Trusted-proxy auth enabled but no trusted proxies configured",
			detail: "gateway.auth.mode=\"trusted-proxy\" but gateway.trustedProxies is empty. All requests will be rejected.",
			remediation: "Set gateway.trustedProxies to the IP(s) of your reverse proxy."
		});
		if (!trustedProxyConfig?.userHeader) findings.push({
			checkId: "gateway.trusted_proxy_no_user_header",
			severity: "critical",
			title: "Trusted-proxy auth missing userHeader config",
			detail: "gateway.auth.mode=\"trusted-proxy\" but gateway.auth.trustedProxy.userHeader is not configured.",
			remediation: "Set gateway.auth.trustedProxy.userHeader to the header name your proxy uses (e.g., \"x-forwarded-user\", \"x-pomerium-claim-email\")."
		});
		if (trustedProxyConfig?.allowLoopback === true) findings.push({
			checkId: "gateway.trusted_proxy_allow_loopback",
			severity: "warn",
			title: "Trusted-proxy auth allows loopback proxy sources",
			detail: "gateway.auth.trustedProxy.allowLoopback=true allows loopback-source requests from configured gateway.trustedProxies entries to satisfy trusted-proxy auth.",
			remediation: "Enable this only when a same-host reverse proxy is the intended trust boundary. Keep direct Gateway access private to the host and require the proxy to strip or overwrite identity headers."
		});
		if (trustedProxyConfig?.deviceAutoApprove?.enabled === true) {
			findings.push({
				checkId: "gateway.trusted_proxy_device_auto_approve",
				severity: "warn",
				title: "Trusted-proxy operator device auto-approval enabled",
				detail: "gateway.auth.trustedProxy.deviceAutoApprove.enabled=true delegates new browser and native UI operator device pairing entirely to the reverse-proxy identity.",
				remediation: "Enable this only when the proxy is the exclusive Gateway ingress, strongly authenticates users, overwrites identity headers, and restricts access with allowUsers."
			});
			if (trustedProxyConfig.deviceAutoApprove.scopes?.some((scope) => scope.trim() === "operator.admin")) findings.push({
				checkId: "gateway.trusted_proxy_device_auto_approve_admin",
				severity: "critical",
				title: "Trusted-proxy device auto-approval allows full admin",
				detail: "gateway.auth.trustedProxy.deviceAutoApprove.scopes includes operator.admin, so every proxy-authenticated user can auto-approve a new operator device with full admin; requests without scopes receive full admin automatically.",
				remediation: "Remove operator.admin and approve admin access manually, or grant admin per identity via gateway.auth.identityScopes."
			});
		}
		if ((trustedProxyConfig?.allowUsers ?? []).length === 0) findings.push({
			checkId: "gateway.trusted_proxy_no_allowlist",
			severity: "warn",
			title: "Trusted-proxy auth allows all authenticated users",
			detail: "gateway.auth.trustedProxy.allowUsers is empty, so any user authenticated by your proxy can access the Gateway.",
			remediation: "Consider setting gateway.auth.trustedProxy.allowUsers to restrict access to specific users (e.g., [\"nick@example.com\"])."
		});
	}
	if (bind !== "loopback" && auth.mode !== "trusted-proxy" && !cfg.gateway?.auth?.rateLimit) findings.push({
		checkId: "gateway.auth_no_rate_limit",
		severity: "warn",
		title: "No auth rate limiting configured",
		detail: "gateway.bind is not loopback but no gateway.auth.rateLimit is configured. Without rate limiting, brute-force auth attacks are not mitigated.",
		remediation: "Set gateway.auth.rateLimit (e.g. { maxAttempts: 10, windowMs: 60000, lockoutMs: 300000 })."
	});
	return findings;
}
function isStrictLoopbackTrustedProxyEntry(entry) {
	const candidate = entry.trim();
	if (!candidate) return false;
	if (!candidate.includes("/")) return candidate === "127.0.0.1" || candidate.toLowerCase() === "::1";
	const [rawIp, rawPrefix] = candidate.split("/", 2);
	if (!rawIp || !rawPrefix) return false;
	const ipVersion = isIP(rawIp.trim());
	const prefix = parseStrictNonNegativeInteger(rawPrefix);
	if (prefix === void 0) return false;
	if (ipVersion === 4) return rawIp.trim() === "127.0.0.1" && prefix === 32;
	if (ipVersion === 6) return prefix === 128 && normalizeLowercaseStringOrEmpty(rawIp) === "::1";
	return false;
}
//#endregion
//#region src/security/audit-mcporter-registry.ts
const MAX_MCPORTER_REGISTRY_BYTES = 16777216;
function isEnoent(error) {
	return error?.code === "ENOENT";
}
async function readBoundedMcporterRegistry(stateDir) {
	const registryPath = path.join(stateDir, "skills", "config", "mcporter.json");
	let handle;
	try {
		handle = await fs$1.open(registryPath, constants.O_RDONLY | constants.O_NONBLOCK);
	} catch (error) {
		return isEnoent(error) ? { status: "missing" } : {
			status: "rejected",
			reason: "unreadable"
		};
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) return {
			status: "rejected",
			reason: "non-regular"
		};
		if (stat.size > MAX_MCPORTER_REGISTRY_BYTES) return {
			status: "rejected",
			reason: "oversized"
		};
		const content = await readFileHandleBounded(handle, MAX_MCPORTER_REGISTRY_BYTES);
		let value;
		try {
			value = JSON.parse(content.toString("utf-8"));
		} catch {
			return {
				status: "rejected",
				reason: "malformed"
			};
		}
		return {
			status: "ok",
			value
		};
	} catch (error) {
		return {
			status: "rejected",
			reason: error instanceof FsSafeError && error.code === "too-large" ? "oversized" : "unreadable"
		};
	} finally {
		await handle.close();
	}
}
//#endregion
//#region src/security/audit.ts
const loadReadOnlyChannelPlugins = createLazyRuntimeModule(() => import("./read-only-U4qwYp6K.mjs"));
const loadAuditNonDeepModule = createLazyRuntimeModule(() => import("./audit.nondeep.runtime.js"));
const loadAuditChannelModule = createLazyRuntimeModule(() => import("./audit-channel.collect.runtime.js"));
const loadPluginMetadataRegistryLoaderModule = createLazyRuntimeModule(() => import("./metadata-registry-loader-Dy8FRwuj.mjs"));
const loadPluginAutoEnableModule = createLazyRuntimeModule(() => import("./plugin-auto-enable-BRkc-I-g.mjs"));
const loadChannelPluginIdsModule = createLazyRuntimeModule(() => import("./channel-plugin-ids-DFbOnITm.mjs"));
const loadPluginRuntimeModule = createLazyRuntimeModule(() => import("./runtime-_Jm6s-iG.mjs"));
const loadGatewayProbeDeps = createLazyRuntimeModule(() => Promise.all([
	import("./call-bfuNQIMk.mjs"),
	import("./probe-auth-x7nOzHDT.mjs"),
	import("./probe-D-o1d8Qn.mjs")
]).then(([callModule, probeAuthModule, probeModule]) => ({
	buildGatewayConnectionDetails: callModule.buildGatewayConnectionDetails,
	resolveGatewayProbeAuthSafe: probeAuthModule.resolveGatewayProbeAuthSafe,
	resolveGatewayProbeTarget: probeAuthModule.resolveGatewayProbeTarget,
	probeGateway: probeModule.probeGateway
})));
function countBySeverity(findings) {
	let critical = 0;
	let warn = 0;
	let info = 0;
	for (const f of findings) if (f.severity === "critical") critical += 1;
	else if (f.severity === "warn") warn += 1;
	else info += 1;
	return {
		critical,
		warn,
		info
	};
}
function emitSecurityAuditReportEvent(params) {
	const hasCritical = params.summary.critical > 0;
	const hasWarnings = params.summary.warn > 0;
	emitTrustedSecurityEvent({
		category: "audit",
		action: "security.audit.completed",
		outcome: hasCritical || hasWarnings ? "failure" : "success",
		severity: hasCritical ? "critical" : hasWarnings ? "medium" : "info",
		actor: { kind: "operator" },
		target: {
			kind: "config",
			name: "security.audit"
		},
		policy: {
			id: "security.audit",
			decision: "not_applicable"
		},
		control: {
			id: "security.audit",
			family: "authorization"
		},
		attributes: {
			critical_count: params.summary.critical,
			warn_count: params.summary.warn,
			info_count: params.summary.info,
			suppressed_count: params.suppressedCount,
			deep: params.deep,
			include_filesystem: params.includeFilesystem,
			include_channel_security: params.includeChannelSecurity
		}
	});
}
function normalizeSuppressionText(value) {
	return (value ?? "").trim().toLowerCase();
}
async function materializeAuditGatewayAuthRefs(params) {
	const materializeParams = {
		cfg: params.cfg,
		env: params.env,
		mode: params.cfg.gateway?.auth?.mode,
		hasTokenOverride: false,
		hasPasswordOverride: false,
		hasTokenFallback: Boolean(normalizeOptionalString(params.env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(normalizeOptionalString(params.env.OPENCLAW_GATEWAY_PASSWORD))
	};
	if (!canMaterializeGatewayAuthSecretRefsWithoutExec(materializeParams)) return params.cfg;
	try {
		return await materializeGatewayAuthSecretRefs(materializeParams);
	} catch {
		return params.cfg;
	}
}
function shouldMaterializeHooksGatewayAuthRefs(cfg) {
	return cfg.hooks?.enabled === true && Boolean(normalizeOptionalString(cfg.hooks.token));
}
function findingMatchesSuppression(finding, suppression) {
	const checkId = suppression.checkId.trim();
	if (!checkId || finding.checkId !== checkId) return false;
	const titleNeedle = normalizeSuppressionText(suppression.titleIncludes);
	if (titleNeedle && !finding.title.toLowerCase().includes(titleNeedle)) return false;
	const detailNeedle = normalizeSuppressionText(suppression.detailIncludes);
	if (detailNeedle && !finding.detail.toLowerCase().includes(detailNeedle)) return false;
	return true;
}
function buildSecurityAuditSuppressionsActiveFinding(params) {
	return {
		checkId: "security.audit.suppressions.active",
		severity: "info",
		title: "Security audit suppressions configured",
		detail: `security.audit.suppressions has ${params.configuredCount} configured suppression(s); ${params.suppressedCount} finding(s) moved to suppressedFindings.`,
		remediation: "Review suppressedFindings and remove suppressions when the accepted risk no longer applies."
	};
}
function applySecurityAuditSuppressions(findings, suppressions) {
	if (!Array.isArray(suppressions) || suppressions.length === 0) return {
		findings,
		suppressedFindings: []
	};
	const active = [];
	const suppressedFindings = [];
	for (const finding of findings) {
		const suppression = suppressions.find((candidate) => findingMatchesSuppression(finding, candidate));
		if (!suppression) {
			active.push(finding);
			continue;
		}
		const reason = suppression.reason?.trim();
		suppressedFindings.push({
			...finding,
			suppression: reason ? { reason } : {}
		});
	}
	return {
		findings: active,
		suppressedFindings
	};
}
function normalizeAllowFromList(list) {
	if (!Array.isArray(list)) return [];
	return normalizeStringEntries(list);
}
async function collectFilesystemFindings(params) {
	const findings = [];
	const stateDirPerms = await inspectPathPermissions(params.stateDir, {
		env: params.env,
		platform: params.platform,
		exec: params.execIcacls
	});
	if (stateDirPerms.ok) {
		if (stateDirPerms.isSymlink) findings.push({
			checkId: "fs.state_dir.symlink",
			severity: "warn",
			title: "State dir is a symlink",
			detail: `${params.stateDir} is a symlink; treat this as an extra trust boundary.`
		});
		if (stateDirPerms.worldWritable) findings.push({
			checkId: "fs.state_dir.perms_world_writable",
			severity: "critical",
			title: "State dir is world-writable",
			detail: `${formatPermissionDetail(params.stateDir, stateDirPerms)}; other users can write into your OpenClaw state.`,
			remediation: formatPermissionRemediation({
				targetPath: params.stateDir,
				perms: stateDirPerms,
				isDir: true,
				posixMode: 448,
				env: params.env
			})
		});
		else if (stateDirPerms.groupWritable) findings.push({
			checkId: "fs.state_dir.perms_group_writable",
			severity: "warn",
			title: "State dir is group-writable",
			detail: `${formatPermissionDetail(params.stateDir, stateDirPerms)}; group users can write into your OpenClaw state.`,
			remediation: formatPermissionRemediation({
				targetPath: params.stateDir,
				perms: stateDirPerms,
				isDir: true,
				posixMode: 448,
				env: params.env
			})
		});
		else if (stateDirPerms.groupReadable || stateDirPerms.worldReadable) findings.push({
			checkId: "fs.state_dir.perms_readable",
			severity: "warn",
			title: "State dir is readable by others",
			detail: `${formatPermissionDetail(params.stateDir, stateDirPerms)}; consider restricting to 700.`,
			remediation: formatPermissionRemediation({
				targetPath: params.stateDir,
				perms: stateDirPerms,
				isDir: true,
				posixMode: 448,
				env: params.env
			})
		});
	}
	const configPerms = await inspectPathPermissions(params.configPath, {
		env: params.env,
		platform: params.platform,
		exec: params.execIcacls
	});
	if (configPerms.ok) {
		const skipReadablePermWarnings = configPerms.isSymlink;
		if (configPerms.isSymlink) findings.push({
			checkId: "fs.config.symlink",
			severity: "warn",
			title: "Config file is a symlink",
			detail: `${params.configPath} is a symlink; make sure you trust its target.`
		});
		if (configPerms.worldWritable || configPerms.groupWritable) findings.push({
			checkId: "fs.config.perms_writable",
			severity: "critical",
			title: "Config file is writable by others",
			detail: `${formatPermissionDetail(params.configPath, configPerms)}; another user could change gateway/auth/tool policies.`,
			remediation: formatPermissionRemediation({
				targetPath: params.configPath,
				perms: configPerms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
		else if (!skipReadablePermWarnings && configPerms.worldReadable) findings.push({
			checkId: "fs.config.perms_world_readable",
			severity: "critical",
			title: "Config file is world-readable",
			detail: `${formatPermissionDetail(params.configPath, configPerms)}; config can contain tokens and private settings.`,
			remediation: formatPermissionRemediation({
				targetPath: params.configPath,
				perms: configPerms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
		else if (!skipReadablePermWarnings && configPerms.groupReadable) findings.push({
			checkId: "fs.config.perms_group_readable",
			severity: "warn",
			title: "Config file is group-readable",
			detail: `${formatPermissionDetail(params.configPath, configPerms)}; config can contain tokens and private settings.`,
			remediation: formatPermissionRemediation({
				targetPath: params.configPath,
				perms: configPerms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
	}
	return findings;
}
function collectGatewayConfigFindings(cfg, sourceConfig, env, options = {}) {
	return collectGatewayConfigFindings$1(cfg, sourceConfig, env, {
		collectDangerousConfigFlags: collectEnabledInsecureOrDangerousFlags,
		gatewayAuthOverride: options.gatewayAuthOverride
	});
}
async function collectPluginSecurityAuditFindings(context) {
	if (!context.loadPluginSecurityCollectors) return [];
	const { getActivePluginRegistry } = await loadPluginRuntimeModule();
	let collectors = getActivePluginRegistry()?.securityAuditCollectors ?? [];
	if (collectors.length === 0) {
		const { applyPluginAutoEnable } = await loadPluginAutoEnableModule();
		const autoEnabled = applyPluginAutoEnable({
			config: context.sourceConfig,
			env: context.env
		});
		const requestedPluginIds = /* @__PURE__ */ new Set();
		for (const pluginId of Object.keys(autoEnabled.autoEnabledReasons)) {
			const normalized = pluginId.trim();
			if (normalized) requestedPluginIds.add(normalized);
		}
		for (const pluginId of autoEnabled.config.plugins?.allow ?? []) {
			if (typeof pluginId !== "string") continue;
			const normalized = pluginId.trim();
			if (normalized) requestedPluginIds.add(normalized);
		}
		for (const [pluginId, entry] of Object.entries(autoEnabled.config.plugins?.entries ?? {})) {
			if (entry?.enabled === false) continue;
			const normalized = pluginId.trim();
			if (normalized) requestedPluginIds.add(normalized);
		}
		if (context.includeChannelSecurity && context.plugins !== void 0) {
			const { resolveConfiguredChannelPluginIds } = await loadChannelPluginIdsModule();
			const auditedChannelPluginIds = new Set(context.plugins.map((plugin) => plugin.id));
			for (const pluginId of resolveConfiguredChannelPluginIds({
				config: autoEnabled.config,
				activationSourceConfig: context.sourceConfig,
				workspaceDir: context.workspaceDir,
				env: context.env
			})) if (auditedChannelPluginIds.has(pluginId)) requestedPluginIds.delete(pluginId);
		}
		if (requestedPluginIds.size === 0) return [];
		collectors = (await loadPluginMetadataRegistryLoaderModule()).loadPluginMetadataRegistrySnapshot({
			config: autoEnabled.config,
			activationSourceConfig: context.sourceConfig,
			env: context.env,
			workspaceDir: context.workspaceDir,
			onlyPluginIds: [...requestedPluginIds]
		}).securityAuditCollectors ?? [];
	}
	return (await Promise.all(collectors.map(async (entry) => {
		try {
			return await entry.collector({
				config: context.cfg,
				sourceConfig: context.sourceConfig,
				env: context.env,
				stateDir: context.stateDir,
				configPath: context.configPath
			});
		} catch (err) {
			return [{
				checkId: `plugins.${entry.pluginId}.security_audit_failed`,
				severity: "warn",
				title: "Plugin security audit collector failed",
				detail: `${entry.pluginId}: ${String(err)}`
			}];
		}
	}))).flat();
}
function collectElevatedFindings(cfg) {
	const findings = [];
	const enabled = cfg.tools?.elevated?.enabled;
	const allowFrom = cfg.tools?.elevated?.allowFrom ?? {};
	const anyAllowFromKeys = Object.keys(allowFrom).length > 0;
	if (enabled === false) return findings;
	if (!anyAllowFromKeys) return findings;
	for (const [provider, list] of Object.entries(allowFrom)) {
		const normalized = normalizeAllowFromList(list);
		if (normalized.includes("*")) findings.push({
			checkId: `tools.elevated.allowFrom.${provider}.wildcard`,
			severity: "critical",
			title: "Elevated exec allowlist contains wildcard",
			detail: `tools.elevated.allowFrom.${provider} includes "*" which effectively approves everyone on that channel for elevated mode.`
		});
		else if (normalized.length > 25) findings.push({
			checkId: `tools.elevated.allowFrom.${provider}.large`,
			severity: "warn",
			title: "Elevated exec allowlist is large",
			detail: `tools.elevated.allowFrom.${provider} has ${normalized.length} entries; consider tightening elevated access.`
		});
	}
	return findings;
}
function collectExecRuntimeFindings(cfg) {
	const findings = [];
	const globalExecHost = cfg.tools?.exec?.host;
	const globalStrictInlineEval = cfg.tools?.exec?.strictInlineEval === true;
	const defaultSandboxMode = resolveSandboxConfigForAgent(cfg).mode;
	const defaultHostIsExplicitSandbox = globalExecHost === "sandbox";
	const approvals = loadExecApprovals();
	if (defaultHostIsExplicitSandbox && defaultSandboxMode === "off") findings.push({
		checkId: "tools.exec.host_sandbox_no_sandbox_defaults",
		severity: "warn",
		title: "Exec host is sandbox but sandbox mode is off",
		detail: "tools.exec.host is explicitly set to sandbox while agents.defaults.sandbox.mode=off. In this mode, exec fails closed because no sandbox runtime is available.",
		remediation: "Enable sandbox mode (`agents.defaults.sandbox.mode=\"non-main\"` or `\"all\"`) or set tools.exec.host to \"gateway\" with approvals."
	});
	const agents = listAgentEntries(cfg);
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const riskyAgents = agents.filter((entry) => entry && typeof entry === "object" && typeof entry.id === "string" && entry.tools?.exec?.host === "sandbox" && resolveSandboxConfigForAgent(cfg, entry.id).mode === "off").map((entry) => entry.id).slice(0, 5);
	if (riskyAgents.length > 0) findings.push({
		checkId: "tools.exec.host_sandbox_no_sandbox_agents",
		severity: "warn",
		title: "Agent exec host uses sandbox while sandbox mode is off",
		detail: `agents.entries.*.tools.exec.host is set to sandbox for: ${riskyAgents.join(", ")}. With sandbox mode off, exec fails closed for those agents.`,
		remediation: "Enable sandbox mode for these agents (`agents.entries.*.sandbox.mode`) or set their tools.exec.host to \"gateway\"."
	});
	const effectiveExecScopes = Array.from(new Map([{
		id: defaultAgentId ?? "global",
		security: resolveExecModePolicy({
			mode: cfg.tools?.exec?.mode,
			security: cfg.tools?.exec?.security ?? "deny",
			ask: cfg.tools?.exec?.ask ?? "off"
		}).security,
		host: cfg.tools?.exec?.host ?? "auto"
	}, ...agents.filter((entry) => Boolean(entry) && typeof entry === "object" && typeof entry.id === "string").map((entry) => {
		const inherited = resolveExecModePolicy({
			mode: cfg.tools?.exec?.mode,
			security: cfg.tools?.exec?.security ?? "deny",
			ask: cfg.tools?.exec?.ask ?? "off"
		});
		return {
			id: entry.id,
			security: resolveExecModePolicy({
				mode: entry.tools?.exec?.mode,
				security: entry.tools?.exec?.security ?? inherited.security,
				ask: entry.tools?.exec?.ask ?? inherited.ask
			}).security,
			host: entry.tools?.exec?.host ?? cfg.tools?.exec?.host ?? "auto"
		};
	})].map((entry) => [entry.id, entry])).values());
	const fullExecScopes = effectiveExecScopes.filter((entry) => entry.security === "full");
	const execEnabledScopes = effectiveExecScopes.filter((entry) => entry.security !== "deny");
	const openExecSurfacePaths = collectOpenExecSurfacePaths(cfg);
	if (fullExecScopes.length > 0) findings.push({
		checkId: "tools.exec.security_full_configured",
		severity: openExecSurfacePaths.length > 0 ? "critical" : "warn",
		title: "Exec security=full is configured",
		detail: `Full exec trust is enabled for: ${fullExecScopes.map((entry) => entry.id).join(", ")}.` + (openExecSurfacePaths.length > 0 ? ` Open channel access was also detected at:\n${openExecSurfacePaths.map((entry) => `- ${entry}`).join("\n")}` : ""),
		remediation: "Prefer tools.exec.mode=\"ask\" or \"allowlist\", and reserve \"full\" for tightly scoped break-glass agents only."
	});
	if (openExecSurfacePaths.length > 0 && execEnabledScopes.length > 0) findings.push({
		checkId: "security.exposure.open_channels_with_exec",
		severity: fullExecScopes.length > 0 ? "critical" : "warn",
		title: "Open channels can reach exec-enabled agents",
		detail: `Open DM/group access detected at:\n${openExecSurfacePaths.map((entry) => `- ${entry}`).join("\n")}\nExec-enabled scopes:\n${execEnabledScopes.map((entry) => `- ${entry.id}: security=${entry.security}, host=${entry.host}`).join("\n")}`,
		remediation: "Tighten dmPolicy/groupPolicy to pairing or allowlist, or disable exec for agents reachable from shared/public channels."
	});
	const execFilesystemPolicyHits = collectExecFilesystemPolicyDriftHits(cfg);
	if (execFilesystemPolicyHits.length > 0) findings.push({
		checkId: "tools.exec.fs_tools_disabled_but_exec_enabled",
		severity: "warn",
		title: "Filesystem tool policy does not make exec read-only",
		detail: `Found scopes where write/edit/apply_patch are unavailable but exec remains available:\n${execFilesystemPolicyHits.map((hit) => `- ${hit.scopeLabel}: runtime=[${hit.runtimeTools.join(", ")}], disabledFs=[${hit.disabledFilesystemTools.join(", ")}], exec.host=${hit.execHost}, sandbox=${hit.sandboxMode}, workspaceAccess=${hit.sandboxWorkspaceAccess}`).join("\n")}\nThe exec tool is a shell and can still write files wherever the selected host or sandbox filesystem permits it.`,
		remediation: "For read-only agents, deny exec and process too. If shell access is intentional, constrain the filesystem boundary with sandbox mode \"all\" and workspaceAccess \"ro\" or \"none\"."
	});
	const autoAllowSkillsHits = collectAutoAllowSkillsHits(approvals);
	if (autoAllowSkillsHits.length > 0) findings.push({
		checkId: "tools.exec.auto_allow_skills_enabled",
		severity: "warn",
		title: "autoAllowSkills is enabled for exec approvals",
		detail: `Implicit skill-bin allowlisting is enabled at:\n${autoAllowSkillsHits.map((entry) => `- ${entry}`).join("\n")}\nThis widens host exec trust beyond explicit manual allowlist entries.`,
		remediation: "Disable autoAllowSkills in exec approvals and keep manual allowlists tight when you need explicit host-exec trust."
	});
	const interpreterAllowlistHits = collectInterpreterAllowlistHits({
		approvals,
		strictInlineEvalForAgentId: (agentId) => {
			if (!agentId || agentId === "*") return globalStrictInlineEval;
			return agents.find((entry) => entry?.id === agentId)?.tools?.exec?.strictInlineEval ?? globalStrictInlineEval;
		}
	});
	if (interpreterAllowlistHits.length > 0) findings.push({
		checkId: "tools.exec.allowlist_interpreter_without_strict_inline_eval",
		severity: "warn",
		title: "Interpreter allowlist entries are missing strictInlineEval hardening",
		detail: `Interpreter/runtime allowlist entries were found without strictInlineEval enabled:\n${interpreterAllowlistHits.map((entry) => `- ${entry}`).join("\n")}`,
		remediation: "Set tools.exec.strictInlineEval=true (or per-agent tools.exec.strictInlineEval=true) when allowlisting interpreters like python, node, ruby, perl, php, lua, or osascript."
	});
	const classifyRiskySafeBinTrustedDir = (entry) => {
		const raw = entry.trim();
		if (!raw) return null;
		if (!path.isAbsolute(raw)) return "relative path (trust boundary depends on process cwd)";
		const normalized = path.resolve(raw).replace(/\\/g, "/").toLowerCase();
		if (normalized === "/tmp" || normalized.startsWith("/tmp/") || normalized === "/var/tmp" || normalized.startsWith("/var/tmp/") || normalized === "/private/tmp" || normalized.startsWith("/private/tmp/")) return "temporary directory is mutable and easy to poison";
		if (normalized === "/usr/local/bin" || normalized === "/opt/homebrew/bin" || normalized === "/opt/local/bin" || normalized === "/home/linuxbrew/.linuxbrew/bin") return "package-manager bin directory (often user-writable)";
		if (normalized.startsWith("/users/") || normalized.startsWith("/home/") || normalized.includes("/.local/bin")) return "home-scoped bin directory (typically user-writable)";
		if (/^[a-z]:\/users\//.test(normalized)) return "home-scoped bin directory (typically user-writable)";
		return null;
	};
	const globalExec = cfg.tools?.exec;
	const riskyTrustedDirHits = [];
	const collectRiskyTrustedDirHits = (scopePath, entries) => {
		for (const entry of normalizeConfiguredTrustedSafeBinDirs(entries)) {
			const reason = classifyRiskySafeBinTrustedDir(entry);
			if (!reason) continue;
			riskyTrustedDirHits.push(`- ${scopePath}.safeBinTrustedDirs: ${entry} (${reason})`);
		}
	};
	collectRiskyTrustedDirHits("tools.exec", globalExec?.safeBinTrustedDirs);
	for (const entry of agents) {
		if (!entry || typeof entry !== "object" || typeof entry.id !== "string") continue;
		collectRiskyTrustedDirHits(`agents.entries.${entry.id}.tools.exec`, entry.tools?.exec?.safeBinTrustedDirs);
	}
	const interpreterHits = [];
	const riskySemanticSafeBinHits = [];
	const globalSafeBins = normalizeConfiguredSafeBins(globalExec?.safeBins);
	if (globalSafeBins.length > 0) {
		const merged = resolveMergedSafeBinProfileFixtures({ global: globalExec }) ?? {};
		const interpreters = listInterpreterLikeSafeBins(globalSafeBins).filter((bin) => !merged[bin]);
		if (interpreters.length > 0) interpreterHits.push(`- tools.exec.safeBins: ${interpreters.join(", ")}`);
		for (const hit of listRiskyConfiguredSafeBins(globalSafeBins)) riskySemanticSafeBinHits.push(`- tools.exec.safeBins: ${hit.bin} (${hit.warning})`);
	}
	for (const entry of agents) {
		if (!entry || typeof entry !== "object" || typeof entry.id !== "string") continue;
		const agentExec = entry.tools?.exec;
		const agentSafeBins = normalizeConfiguredSafeBins(agentExec?.safeBins);
		if (agentSafeBins.length === 0) continue;
		const merged = resolveMergedSafeBinProfileFixtures({
			global: globalExec,
			local: agentExec
		}) ?? {};
		const interpreters = listInterpreterLikeSafeBins(agentSafeBins).filter((bin) => !merged[bin]);
		if (interpreters.length === 0) {
			for (const hit of listRiskyConfiguredSafeBins(agentSafeBins)) riskySemanticSafeBinHits.push(`- agents.entries.${entry.id}.tools.exec.safeBins: ${hit.bin} (${hit.warning})`);
			continue;
		}
		interpreterHits.push(`- agents.entries.${entry.id}.tools.exec.safeBins: ${interpreters.join(", ")}`);
		for (const hit of listRiskyConfiguredSafeBins(agentSafeBins)) riskySemanticSafeBinHits.push(`- agents.entries.${entry.id}.tools.exec.safeBins: ${hit.bin} (${hit.warning})`);
	}
	if (interpreterHits.length > 0) findings.push({
		checkId: "tools.exec.safe_bins_interpreter_unprofiled",
		severity: "warn",
		title: "safeBins includes interpreter/runtime binaries without explicit profiles",
		detail: `Detected interpreter-like safeBins entries missing explicit profiles:\n${interpreterHits.join("\n")}\nThese entries can turn safeBins into a broad execution surface when used with permissive argv profiles.`,
		remediation: "Remove interpreter/runtime bins from safeBins (prefer allowlist entries) or define hardened tools.exec.safeBinProfiles.<bin> rules."
	});
	if (riskySemanticSafeBinHits.length > 0) findings.push({
		checkId: "tools.exec.safe_bins_broad_behavior",
		severity: "warn",
		title: "safeBins includes binaries with broader semantics than low-risk stream filters",
		detail: `Detected risky safeBins entries:\n${riskySemanticSafeBinHits.join("\n")}\nThese tools expose semantics that do not fit the low-risk stdin-filter fast path.`,
		remediation: "Remove these binaries from safeBins and prefer explicit allowlist entries or approval-gated execution."
	});
	if (riskyTrustedDirHits.length > 0) findings.push({
		checkId: "tools.exec.safe_bin_trusted_dirs_risky",
		severity: "warn",
		title: "safeBinTrustedDirs includes risky mutable directories",
		detail: `Detected risky safeBinTrustedDirs entries:\n${riskyTrustedDirHits.slice(0, 10).join("\n")}` + (riskyTrustedDirHits.length > 10 ? `\n- +${riskyTrustedDirHits.length - 10} more entries.` : ""),
		remediation: "Prefer root-owned immutable bins, keep default trust dirs (/bin, /usr/bin), and avoid trusting temporary/home/package-manager paths unless tightly controlled."
	});
	return findings;
}
function collectAgentRosterFindings(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0 && !hasAgentRosterProperty(cfg)) return [];
	const defaultCount = agents.filter((agent) => agent?.default === true).length;
	const explicitOwnership = cfg.agents?.ownership === "explicit";
	if (explicitOwnership ? defaultCount === 0 : tryResolveLegacyCompatibilityAgentId(cfg) !== void 0) return [];
	return [{
		checkId: "config.agent_roster.invalid_default_count",
		severity: "warn",
		title: "Agent roster has an invalid default selection",
		detail: explicitOwnership ? `Expected no agents.entries default=true entries with agents.ownership=explicit, found ${defaultCount}.` : `Expected a resolvable default agent (sole entry, one default=true marker, or agents.ownership=explicit); found ${defaultCount} default markers across ${agents.length} configured agents.`,
		remediation: "Run `openclaw doctor --fix` to repair the authored agent roster."
	}];
}
function formatNamesPreview(names) {
	const visible = names.slice(0, 6);
	const suffix = names.length > visible.length ? `, +${names.length - visible.length} more` : "";
	return `${visible.join(", ")}${suffix}`;
}
function listConfiguredMcpServerNames(cfg) {
	return Object.entries(cfg.mcp?.servers ?? {}).filter(([, server]) => server?.enabled !== false).map(([name]) => name).toSorted();
}
async function readGlobalMcporterRegistrySummary(stateDir) {
	const outcome = await readBoundedMcporterRegistry(stateDir);
	if (outcome.status === "missing") return { status: "absent" };
	if (outcome.status === "rejected") return outcome;
	const mcpServers = asNullableRecord(asNullableRecord(outcome.value)?.mcpServers);
	if (!mcpServers) return { status: "absent" };
	const names = Object.entries(mcpServers).filter(([, value]) => asNullableRecord(value)?.enabled !== false).map(([name]) => name).toSorted();
	return names.length > 0 ? {
		status: "source",
		summary: {
			label: "skills/config/mcporter.json",
			names
		}
	} : { status: "absent" };
}
function describeMcporterRegistryRejection(reason) {
	switch (reason) {
		case "oversized": return "larger than the 16 MiB audit cap";
		case "unreadable": return "unreadable";
		case "non-regular": return "not a regular file";
		case "malformed": return "not valid JSON";
		default: return reason;
	}
}
function hasOwnSkillsAllowlist(entry) {
	return Boolean(entry && Object.hasOwn(entry, "skills"));
}
function collectAgentSkillMcpBoundaryScopes(cfg) {
	const agents = listAgentEntries(cfg);
	const defaultsHaveSkillAllowlist = hasOwnSkillsAllowlist(cfg.agents?.defaults);
	return [...defaultsHaveSkillAllowlist ? [{
		kind: "defaults",
		id: "agents.defaults",
		skillSource: "agents.defaults.skills"
	}] : [], ...agents.filter((entry) => Boolean(entry) && typeof entry === "object" && typeof entry.id === "string").flatMap((entry) => {
		if (hasOwnSkillsAllowlist(entry)) return [{
			kind: "agent",
			id: entry.id,
			skillSource: "agents.entries.*.skills",
			agentId: entry.id
		}];
		if (defaultsHaveSkillAllowlist) return [{
			kind: "agent",
			id: entry.id,
			skillSource: "agents.defaults.skills (inherited)",
			agentId: entry.id
		}];
		return [];
	})].flatMap((candidate) => {
		const agentId = candidate.kind === "agent" ? candidate.agentId : void 0;
		const sandboxMode = resolveSandboxConfigForAgent(cfg, agentId).mode;
		const exec = resolveExecDefaults({
			cfg,
			...candidate.kind === "defaults" ? { scope: { kind: "defaults" } } : { agentId },
			sandboxAvailable: sandboxMode !== "off"
		});
		if (exec.security === "deny" || exec.effectiveHost === "sandbox") return [];
		return [{
			id: candidate.id,
			skillSource: candidate.skillSource,
			execHost: exec.effectiveHost,
			execSecurity: exec.security,
			execAsk: exec.ask
		}];
	});
}
async function collectAgentSkillMcpBoundaryFindings(params) {
	const scopes = collectAgentSkillMcpBoundaryScopes(params.cfg);
	if (scopes.length === 0) return [];
	const findings = [];
	const sources = [];
	const configServerNames = listConfiguredMcpServerNames(params.cfg);
	if (configServerNames.length > 0) sources.push({
		label: "mcp.servers",
		names: configServerNames
	});
	const globalMcporterRegistry = await readGlobalMcporterRegistrySummary(params.stateDir);
	if (globalMcporterRegistry.status === "rejected") findings.push({
		checkId: "tools.exec.mcporter_registry_inspection_incomplete",
		severity: "warn",
		title: "Global mcporter registry could not be inspected",
		detail: `skills/config/mcporter.json exists but could not be safely inspected (${describeMcporterRegistryRejection(globalMcporterRegistry.reason)}). The MCP boundary inspection is incomplete: the audit could not verify which MCP servers a host exec process can reach.`,
		remediation: "Repair or remove skills/config/mcporter.json so the audit can inspect it: keep it a regular file readable by the gateway user, valid JSON, and below the 16 MiB audit cap."
	});
	else if (globalMcporterRegistry.status === "source") sources.push(globalMcporterRegistry.summary);
	if (sources.length === 0) return findings;
	findings.push({
		checkId: "tools.exec.agent_skill_mcp_boundary_drift",
		severity: "warn",
		title: "Agent skill allowlists do not constrain host exec MCP clients",
		detail: `Detected agent skill allowlists on host-exec-capable scopes:\n${scopes.slice(0, 8).map((scope) => `- ${scope.id}: ${scope.skillSource}, exec.host=${scope.execHost}, security=${scope.execSecurity}, ask=${scope.execAsk}`).join("\n")}` + (scopes.length > 8 ? `\n- +${scopes.length - 8} more scopes.` : "") + `\nMCP server registries visible to the gateway configuration/state:\n${sources.map((source) => `- ${source.label}: ${formatNamesPreview(source.names)}`).join("\n")}\nagents.*.skills filters OpenClaw skill visibility and snapshots; it is not a shell-time authorization boundary. A host exec process can run external MCP clients or read a global mcporter registry unless sandbox, filesystem, network, or MCP credential boundaries block it.`,
		remediation: "For agents that need per-agent MCP isolation, set their exec policy to security=\"deny\" or a tight allowlist, run them in sandbox/container/OS-user isolation where the global MCP registry is not readable, split sensitive MCP servers into a separate gateway/trust boundary, or require per-agent MCP credentials at the server layer."
	});
	return findings;
}
function collectOpenExecSurfacePaths(cfg) {
	const channels = asNullableRecord(cfg.channels);
	if (!channels) return [];
	const hits = /* @__PURE__ */ new Set();
	const seen = /* @__PURE__ */ new WeakSet();
	const visit = (value, scope) => {
		const record = asNullableRecord(value);
		if (!record || seen.has(record)) return;
		seen.add(record);
		if (record.groupPolicy === "open") hits.add(`${scope}.groupPolicy`);
		if (record.dmPolicy === "open") hits.add(`${scope}.dmPolicy`);
		for (const [key, nested] of Object.entries(record)) {
			if (key === "groups" || key === "accounts" || key === "dms") {
				visit(nested, `${scope}.${key}`);
				continue;
			}
			if (asNullableRecord(nested)) visit(nested, `${scope}.${key}`);
		}
	};
	for (const [channelId, channelValue] of Object.entries(channels)) visit(channelValue, `channels.${channelId}`);
	return Array.from(hits).toSorted();
}
function collectAutoAllowSkillsHits(approvals) {
	const hits = [];
	if (approvals.defaults?.autoAllowSkills === true) hits.push("defaults.autoAllowSkills");
	for (const [agentId, agent] of Object.entries(approvals.agents ?? {})) if (agent?.autoAllowSkills === true) hits.push(`agents.${agentId}.autoAllowSkills`);
	return hits;
}
function collectInterpreterAllowlistHits(params) {
	const hits = [];
	for (const [agentId, agent] of Object.entries(params.approvals.agents ?? {})) {
		if (!agent || params.strictInlineEvalForAgentId(agentId)) continue;
		for (const entry of agent.allowlist ?? []) {
			if (!isInterpreterLikeAllowlistPattern(entry.pattern)) continue;
			hits.push(`agents.${agentId}.allowlist: ${entry.pattern}`);
		}
	}
	return hits;
}
async function maybeProbeGateway(params) {
	const { buildGatewayConnectionDetails, resolveGatewayProbeAuthSafe, resolveGatewayProbeTarget } = await loadGatewayProbeDeps();
	const url = buildGatewayConnectionDetails({ config: params.cfg }).url;
	const probeTarget = resolveGatewayProbeTarget(params.cfg);
	const authResolution = resolveGatewayProbeAuthSafe({
		cfg: params.cfg,
		env: params.env,
		mode: probeTarget.mode,
		explicitAuth: params.explicitAuth
	});
	const res = await params.probe({
		url,
		auth: authResolution.auth,
		timeoutMs: params.timeoutMs
	}).catch((err) => ({
		ok: false,
		url,
		connectLatencyMs: null,
		error: String(err),
		close: null,
		health: null,
		status: null,
		presence: null,
		configSnapshot: null
	}));
	if (authResolution.warning && !res.ok) res.error = res.error ? `${res.error}; ${authResolution.warning}` : authResolution.warning;
	return {
		deep: { gateway: {
			attempted: true,
			url: redactSensitiveUrlLikeString(url),
			ok: res.ok,
			error: res.ok || res.error === null ? null : redactSensitiveUrlLikeString(res.error),
			close: res.close ? {
				code: res.close.code,
				reason: redactSensitiveUrlLikeString(res.close.reason)
			} : null
		} },
		authWarning: authResolution.warning
	};
}
async function createAuditExecutionContext(opts) {
	const cfg = opts.config;
	const sourceConfig = opts.sourceConfig ?? opts.config;
	const env = opts.env ?? process.env;
	const platform = opts.platform ?? process.platform;
	const includeFilesystem = opts.includeFilesystem !== false;
	const includeChannelSecurity = opts.includeChannelSecurity !== false;
	const deep = opts.deep === true;
	const deepTimeoutMs = Math.max(250, opts.deepTimeoutMs ?? 5e3);
	const stateDir = opts.stateDir ?? resolveStateDir(env);
	const configPath = opts.configPath ?? resolveConfigPath(env, stateDir);
	const workspaceDir = resolvePluginControlPlaneWorkspace({
		config: cfg,
		workspaceDir: opts.workspaceDir,
		env
	}).workspaceDir;
	const { readConfigSnapshotForAudit } = await loadAuditNonDeepModule();
	const configSnapshot = includeFilesystem ? opts.configSnapshot !== void 0 ? opts.configSnapshot : await readConfigSnapshotForAudit({
		env,
		configPath
	}).catch(() => null) : null;
	return {
		cfg,
		sourceConfig,
		env,
		platform,
		includeFilesystem,
		includeChannelSecurity,
		deep,
		deepTimeoutMs,
		stateDir,
		configPath,
		execIcacls: opts.execIcacls,
		execDockerRawFn: opts.execDockerRawFn,
		probeGatewayFn: opts.probeGatewayFn,
		plugins: opts.plugins,
		loadPluginSecurityCollectors: opts.loadPluginSecurityCollectors ?? deep,
		workspaceDir,
		configSnapshot,
		codeSafetySummaryCache: opts.codeSafetySummaryCache ?? /* @__PURE__ */ new Map(),
		deepProbeAuth: opts.deepProbeAuth,
		auditGatewayAuthOverride: opts.auditGatewayAuthOverride
	};
}
async function runSecurityAuditCore(opts) {
	const findings = [];
	const context = await createAuditExecutionContext(opts);
	const { cfg, env, platform, stateDir, configPath } = context;
	copyConfigResolutionFacts(context.sourceConfig, cfg);
	const auditNonDeep = await loadAuditNonDeepModule();
	findings.push(...auditNonDeep.collectAttackSurfaceSummaryFindings(cfg));
	findings.push(...collectAgentRosterFindings(context.sourceConfig));
	findings.push(...auditNonDeep.collectSyncedFolderFindings({
		stateDir,
		configPath
	}));
	findings.push(...collectGatewayConfigFindings(cfg, context.sourceConfig, env, { gatewayAuthOverride: context.auditGatewayAuthOverride }));
	findings.push(...await collectPluginSecurityAuditFindings(context));
	findings.push(...collectElevatedFindings(cfg));
	findings.push(...collectExecRuntimeFindings(cfg));
	findings.push(...await collectAgentSkillMcpBoundaryFindings({
		cfg,
		stateDir
	}));
	const hooksGatewayAuthCfg = shouldMaterializeHooksGatewayAuthRefs(cfg) ? await materializeAuditGatewayAuthRefs({
		cfg,
		env
	}) : cfg;
	findings.push(...auditNonDeep.collectHooksHardeningFindings(hooksGatewayAuthCfg, env, { gatewayAuthOverride: context.auditGatewayAuthOverride }));
	findings.push(...auditNonDeep.collectGatewayHttpNoAuthFindings(cfg, env, { gatewayAuthOverride: context.auditGatewayAuthOverride }));
	findings.push(...auditNonDeep.collectGatewayHttpSessionKeyOverrideFindings(cfg));
	findings.push(...auditNonDeep.collectSandboxDockerNoopFindings(cfg));
	findings.push(...auditNonDeep.collectSandboxDangerousConfigFindings(cfg));
	findings.push(...auditNonDeep.collectNodeDenyCommandPatternFindings(cfg));
	findings.push(...auditNonDeep.collectNodeDangerousAllowCommandFindings(cfg));
	findings.push(...auditNonDeep.collectMinimalProfileOverrideFindings(cfg));
	findings.push(...auditNonDeep.collectSecretsInConfigFindings(context.sourceConfig));
	findings.push(...auditNonDeep.collectModelHygieneFindings(cfg));
	findings.push(...auditNonDeep.collectSmallModelRiskFindings({
		cfg,
		env
	}));
	findings.push(...auditNonDeep.collectExposureMatrixFindings(cfg));
	findings.push(...auditNonDeep.collectLikelyMultiUserSetupFindings(cfg));
	findings.push(...auditNonDeep.collectCrossAgentSessionAccessFindings(cfg));
	if (context.includeFilesystem) {
		findings.push(...await collectFilesystemFindings({
			stateDir,
			configPath,
			env,
			platform,
			execIcacls: context.execIcacls
		}));
		if (context.configSnapshot) findings.push(...await auditNonDeep.collectIncludeFilePermFindings({
			configSnapshot: context.configSnapshot,
			env,
			platform,
			execIcacls: context.execIcacls
		}));
		findings.push(...await auditNonDeep.collectStateDeepFilesystemFindings({
			cfg,
			env,
			stateDir,
			platform,
			execIcacls: context.execIcacls
		}));
		findings.push(...await auditNonDeep.collectWorkspaceSkillSymlinkEscapeFindings({
			cfg,
			workspaceDir: context.workspaceDir
		}));
		findings.push(...await auditNonDeep.collectSandboxBrowserHashLabelFindings({
			execDockerRawFn: context.execDockerRawFn,
			timeoutMs: context.deepTimeoutMs
		}));
		findings.push(...await auditNonDeep.collectPluginsTrustFindings({
			cfg,
			stateDir
		}));
		findings.push(...await collectDeepCodeSafetyFindings({
			cfg,
			stateDir,
			deep: context.deep,
			workspaceDir: context.workspaceDir,
			summaryCache: context.codeSafetySummaryCache
		}));
	}
	let shouldAuditChannelSecurity = false;
	if (context.includeChannelSecurity) {
		if (context.plugins !== void 0) shouldAuditChannelSecurity = true;
		else {
			const { hasConfiguredChannelsForReadOnlyScope, resolveConfiguredChannelPluginIds } = await loadChannelPluginIdsModule();
			shouldAuditChannelSecurity = hasConfiguredChannelsForReadOnlyScope({
				config: cfg,
				activationSourceConfig: context.sourceConfig,
				workspaceDir: context.workspaceDir,
				env
			}) || resolveConfiguredChannelPluginIds({
				config: cfg,
				activationSourceConfig: context.sourceConfig,
				workspaceDir: context.workspaceDir,
				env
			}).length > 0;
		}
	}
	if (shouldAuditChannelSecurity) {
		const channelPlugins = context.plugins ?? (await loadReadOnlyChannelPlugins()).listReadOnlyChannelPluginsForConfig(cfg, {
			activationSourceConfig: context.sourceConfig,
			workspaceDir: context.workspaceDir,
			env,
			stateDir,
			includePersistedAuthState: true,
			includeSetupFallbackPlugins: true
		});
		const { collectChannelSecurityFindings } = await loadAuditChannelModule();
		findings.push(...await collectChannelSecurityFindings({
			cfg,
			sourceConfig: context.sourceConfig,
			plugins: channelPlugins
		}));
	}
	const deepProbeResult = context.deep ? await maybeProbeGateway({
		cfg,
		env,
		timeoutMs: context.deepTimeoutMs,
		probe: context.probeGatewayFn ?? (await loadGatewayProbeDeps()).probeGateway,
		explicitAuth: context.deepProbeAuth
	}) : void 0;
	const deep = deepProbeResult?.deep;
	findings.push(...collectDeepProbeFindings({
		deep,
		authWarning: deepProbeResult?.authWarning
	}));
	const configuredSuppressions = cfg.security?.audit?.suppressions;
	const filtered = applySecurityAuditSuppressions(findings, configuredSuppressions);
	const configuredSuppressionCount = configuredSuppressions?.length ?? 0;
	const activeFindings = configuredSuppressionCount > 0 ? [...filtered.findings, buildSecurityAuditSuppressionsActiveFinding({
		configuredCount: configuredSuppressionCount,
		suppressedCount: filtered.suppressedFindings.length
	})] : filtered.findings;
	const summary = countBySeverity(activeFindings);
	emitSecurityAuditReportEvent({
		summary,
		deep: context.deep,
		includeFilesystem: context.includeFilesystem,
		includeChannelSecurity: context.includeChannelSecurity,
		suppressedCount: filtered.suppressedFindings.length
	});
	return {
		ts: Date.now(),
		summary,
		findings: activeFindings,
		...filtered.suppressedFindings.length > 0 ? { suppressedFindings: filtered.suppressedFindings } : {},
		deep
	};
}
//#endregion
export { runSecurityAuditCore as t };
