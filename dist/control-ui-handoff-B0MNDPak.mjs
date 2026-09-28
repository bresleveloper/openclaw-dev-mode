import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { d as CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM, p as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT } from "./zod-schema-B-u3AXjg.mjs";
import "./config-DryArA1l.mjs";
import { t as createGatewayCredentialPlan } from "./credential-planner-D-JGW62E.mjs";
import { o as isSameProcessSpecificIpv4WithLoopbackListeners } from "./ports-format-CGjX8vQM.mjs";
import { n as inspectPortUsage } from "./ports-inspect-DXXAw_y-.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import { t as resolveGatewayInteractiveSurfaceAuth } from "./auth-surface-resolution-v1kKpTWA.mjs";
import { t as inspectGatewayTlsCertificate } from "./gateway-DTjFIb6X.mjs";
import { r as readResponseTextSnippet } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { n as resolveControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import "./control-ui-assets-C3-n9r4b.mjs";
import { r as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { r as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import "./onboard-helpers-0ZuVvEiw.mjs";
import { s as issueDeviceBootstrapToken } from "./device-bootstrap-BtrqJlcg.mjs";
//#region src/commands/control-ui-handoff.ts
const CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS = 2e3;
const CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES = 2048;
/** One canonical target keeps advertised identity, local browser delivery, and document probes distinct. */
async function resolveControlUiHandoffTarget(params) {
	const { config, env } = params;
	const port = resolveGatewayPort(config, env);
	const bind = config.gateway?.bind ?? "loopback";
	const basePath = config.gateway?.controlUi?.basePath;
	const customBindHost = config.gateway?.customBindHost;
	const tlsConfig = config.gateway?.tls;
	const tlsEnabled = tlsConfig?.enabled === true;
	const credentialPlan = createGatewayCredentialPlan({
		config,
		env
	});
	const resolvedAuth = await resolveGatewayInteractiveSurfaceAuth({
		config,
		env,
		surface: "local"
	});
	const authMode = config.gateway?.auth?.mode ?? (credentialPlan.localPassword.value || credentialPlan.envPassword ? "password" : "token");
	const gatewayAuthHandoff = authMode === "password" && !credentialPlan.localPassword.hasSecretRef ? resolvedAuth.password : void 0;
	const customBindIsWildcard = bind === "custom" && customBindHost?.trim() === "0.0.0.0";
	const browserBind = bind === "lan" || customBindIsWildcard || !tlsEnabled && (bind === "tailnet" || bind === "custom") ? "loopback" : bind;
	const configuredLinks = resolveControlUiLinks({
		port,
		bind,
		customBindHost,
		basePath,
		tlsEnabled
	});
	const links = browserBind === bind ? configuredLinks : resolveControlUiLinks({
		port,
		bind: browserBind,
		customBindHost,
		basePath,
		tlsEnabled
	});
	const configuredHost = new URL(configuredLinks.wsUrl).hostname;
	const loopbackAliasHost = browserBind === "loopback" && (bind === "tailnet" || bind === "custom") && configuredHost !== "127.0.0.1" && configuredHost !== "0.0.0.0" ? configuredHost : void 0;
	const documentUrl = new URL(links.httpUrl);
	documentUrl.hostname = "127.0.0.1";
	documentUrl.username = "";
	documentUrl.password = "";
	documentUrl.search = "";
	documentUrl.hash = "";
	const token = credentialPlan.localToken.value ?? credentialPlan.envToken ?? "";
	const includeTokenInUrl = Boolean(token) && !credentialPlan.localToken.hasSecretRef;
	return {
		port,
		basePath,
		bind,
		links,
		authMode,
		gatewayAuthHandoff,
		includeTokenInUrl,
		dashboardUrl: includeTokenInUrl ? `${links.httpUrl}#token=${encodeURIComponent(token)}` : links.httpUrl,
		documentUrl: documentUrl.toString(),
		probeUrl: loopbackAliasHost ? configuredLinks.wsUrl : links.wsUrl,
		loopbackAliasHost,
		tlsConfig
	};
}
/** Keep shared browser credentials on the same process proven by the configured Gateway endpoint. */
async function hasVerifiedControlUiLoopbackAlias(target) {
	if (!target.loopbackAliasHost) return true;
	const portUsage = await inspectPortUsage(target.port).catch(() => void 0);
	return Boolean(portUsage && isSameProcessSpecificIpv4WithLoopbackListeners(portUsage.listeners, target.port, target.loopbackAliasHost));
}
/** Mint the Control-UI-scoped one-time device grant immediately before actual delivery. */
async function issueControlUiBrowserHandoff({ httpUrl, wsUrl }) {
	const issued = await issueDeviceBootstrapToken({ profile: CONTROL_UI_OWNER_BOOTSTRAP_PROFILE });
	return {
		browserUrl: `${httpUrl}#${new URLSearchParams({
			bootstrapToken: issued.token,
			[CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM]: CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT,
			gatewayUrl: wsUrl
		}).toString()}`,
		expiresAtMs: issued.expiresAtMs
	};
}
/** Wait only for an explicitly preparing dashboard; fail immediately for terminal HTTP states. */
async function waitForControlUiDocument(params) {
	const now = params.deps?.now ?? Date.now;
	const sleepFor = params.deps?.sleep ?? sleep;
	const deadline = now() + (params.timeoutMs ?? 6e5);
	let tlsFingerprint;
	let tlsConnect;
	if (params.tlsConfig?.enabled === true) try {
		const certificate = await inspectGatewayTlsCertificate(params.tlsConfig);
		if (!certificate.ok) return {
			ready: false,
			reason: certificate.error
		};
		tlsFingerprint = certificate.value.fingerprintSha256;
		const expectedFingerprint = tlsFingerprint;
		tlsConnect = {
			ca: certificate.value.cert,
			allowPartialTrustChain: true,
			checkServerIdentity: (_hostname, peerCertificate) => normalizeTlsFingerprint(peerCertificate.fingerprint256 ?? "") === expectedFingerprint ? void 0 : /* @__PURE__ */ new Error("Gateway TLS certificate fingerprint mismatch.")
		};
	} catch (error) {
		return {
			ready: false,
			reason: error instanceof Error ? error.message : "Gateway TLS certificate is unavailable."
		};
	}
	let pendingReported = false;
	const origin = new URL(params.url).origin;
	const requestDocument = async (method, remainingMs) => await (params.deps?.fetch ?? fetchConfiguredLocalOriginWithSsrFGuard)({
		url: params.url,
		configuredLocalOriginBaseUrl: origin,
		policy: { allowedOrigins: [origin] },
		maxRedirects: 0,
		timeoutMs: Math.min(CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS, remainingMs),
		capture: false,
		auditContext: "gateway-control-ui-readiness",
		...tlsConnect ? { dispatcherPolicy: {
			mode: "direct",
			connect: tlsConnect
		} } : {},
		init: {
			method,
			headers: {
				Accept: "text/html",
				"Accept-Encoding": "identity"
			}
		}
	});
	while (true) {
		const remainingMs = deadline - now();
		if (remainingMs <= 0) return {
			ready: false,
			reason: "Control UI assets did not finish preparing in time."
		};
		try {
			const request = await requestDocument("HEAD", remainingMs);
			let pendingDelayMs;
			try {
				const mediaType = request.response.headers.get("content-type")?.split(";", 1)[0]?.trim();
				if (request.response.status === 200 && mediaType?.toLowerCase() === "text/html") return {
					ready: true,
					...tlsFingerprint ? { tlsFingerprint } : {}
				};
				const retryAfter = request.response.headers.get("retry-after");
				if (request.response.status !== 503 || !retryAfter || params.waitForPending === false) {
					let detail;
					if (request.response.status === 503 && !retryAfter) {
						const diagnostic = await requestDocument("GET", Math.max(1, deadline - now())).catch(() => void 0);
						if (diagnostic) try {
							const diagnosticType = diagnostic.response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
							if (diagnostic.response.status === 503 && diagnosticType === "text/plain") {
								const snippet = await readResponseTextSnippet(diagnostic.response, {
									maxBytes: CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES,
									maxChars: CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES,
									timeoutMs: CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS
								}).catch(() => void 0);
								detail = snippet ? sanitizeTerminalText(snippet) : void 0;
							}
						} finally {
							await diagnostic.release();
						}
					}
					return {
						ready: false,
						reason: request.response.status === 503 && retryAfter ? "Control UI assets are still preparing." : detail || `Control UI dashboard is unavailable (HTTP ${request.response.status}).`,
						status: request.response.status
					};
				}
				const retryAfterSeconds = Number(retryAfter);
				pendingDelayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1e3 : 1e3;
			} finally {
				await request.release();
			}
			if (!pendingReported) {
				pendingReported = true;
				params.onPending?.();
			}
			await sleepFor(Math.min(pendingDelayMs, Math.max(0, deadline - now())));
		} catch (error) {
			return {
				ready: false,
				reason: `Control UI dashboard is unavailable: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
}
//#endregion
export { waitForControlUiDocument as i, issueControlUiBrowserHandoff as n, resolveControlUiHandoffTarget as r, hasVerifiedControlUiLoopbackAlias as t };
