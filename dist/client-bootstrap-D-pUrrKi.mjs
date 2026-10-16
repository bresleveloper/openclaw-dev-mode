import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { a as isWssUrl } from "./url-protocol-OU3K-ySz.mjs";
import { s as requireTlsFingerprint } from "./client-address-utils-BafGwQBm.mjs";
import { r as trimToUndefined } from "./credential-planner-qXtujUeq.mjs";
import { r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { n as resolveGatewayProbeSurfaceAuth, t as resolveGatewayInteractiveSurfaceAuth } from "./auth-surface-resolution-BI3JVU_1.mjs";
import { i as resolveGatewayDeviceAuthRoute, t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BcuL3xPn.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-DxDUO_P2.mjs";
//#region src/gateway/tls-fingerprint.ts
/** Resolve the certificate pin for one already-selected Gateway target. */
async function resolveGatewayConnectionTlsFingerprint(params) {
	const explicitTlsFingerprint = params.explicitTlsFingerprint ? requireTlsFingerprint(params.explicitTlsFingerprint) : void 0;
	if (explicitTlsFingerprint) return explicitTlsFingerprint;
	const remoteTlsFingerprint = params.config.gateway?.mode === "remote" && (params.urlSource === "config gateway.remote.url" || params.urlSource === "env OPENCLAW_GATEWAY_URL") ? params.config.gateway.remote?.tlsFingerprint ? requireTlsFingerprint(params.config.gateway.remote.tlsFingerprint) : void 0 : void 0;
	if (remoteTlsFingerprint) return remoteTlsFingerprint;
	if (!isWssUrl(params.url)) return;
	if (!(params.urlSource === "local loopback" || params.urlSource === "missing gateway.remote.url (fallback local)") || params.config.gateway?.tls?.enabled !== true) return;
	const { inspectGatewayTlsCertificate } = await import("./gateway-C_8m90Qi.mjs");
	const certificate = await inspectGatewayTlsCertificate(params.config.gateway.tls);
	return certificate.ok ? certificate.value.fingerprintSha256 : void 0;
}
//#endregion
//#region src/gateway/client-bootstrap.ts
/**
* Maps connection-detail source labels to the override kinds that affect auth fallback.
*/
function resolveGatewayUrlOverrideSource(urlSource) {
	if (urlSource === "cli --url") return "cli";
	if (urlSource === "env OPENCLAW_GATEWAY_URL") return "env";
}
var GatewayExplicitAuthRequiredError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayExplicitAuthRequiredError";
	}
};
async function ensureExplicitGatewayAuth(params) {
	if (!params.urlOverride || !params.urlOverrideSource) return;
	if (params.explicitAuth?.token || params.explicitAuth?.password) return;
	if (params.urlOverrideSource === "env" && (params.resolvedAuth?.token || params.resolvedAuth?.password)) return;
	if (params.deviceAuthScope && await params.allowStoredOriginAuth?.(params.deviceAuthScope) === true) return;
	const sourceHint = params.urlOverrideSource === "env" ? "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD alongside OPENCLAW_GATEWAY_URL; config credentials are intentionally not reused." : "For the default local or SSH-tunneled Gateway, remove --url to use the configured target.";
	throw new GatewayExplicitAuthRequiredError([
		"gateway url override requires explicit credentials",
		params.errorHint,
		sourceHint,
		params.configPath ? `Config: ${params.configPath}` : void 0
	].filter(Boolean).join("\n"));
}
function resolveExactConfiguredGatewayTarget(params) {
	if (params.config.gateway?.mode === "remote") {
		const remoteUrl = trimToUndefined(params.config.gateway.remote?.url);
		return remoteUrl && remoteUrl === params.explicitUrl ? {
			authSurface: "remote",
			tlsSource: "config gateway.remote.url"
		} : void 0;
	}
	const localGateway = {
		...params.config.gateway,
		mode: "local"
	};
	delete localGateway.remote;
	const localUrl = params.buildConnectionDetails({
		config: {
			...params.config,
			gateway: localGateway
		},
		ignoreEnvUrlOverride: true,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	}).url;
	const basePath = normalizeControlUiBasePath(params.config.gateway?.controlUi?.basePath ?? "");
	if (`${localUrl}${basePath}` === params.explicitUrl) return {
		authSurface: "local",
		tlsSource: "local loopback"
	};
	const publicOrigin = resolveGatewayPublicOrigin(params.config);
	if (publicOrigin && `${publicOrigin.replace(/^https:/u, "wss:").replace(/^http:/u, "ws:")}${basePath}` === params.explicitUrl) return { authSurface: "local" };
}
/** Resolve the only URL overrides allowed to displace configured Gateway targets. */
function resolveGatewayUrlOverride(params) {
	const cliUrl = trimToUndefined(params.gatewayUrl);
	if (cliUrl) return {
		url: cliUrl,
		source: "cli"
	};
	if (params.ignoreEnvUrlOverride || params.localPortOverride !== void 0) return {};
	const envUrl = trimToUndefined((params.env ?? process.env).OPENCLAW_GATEWAY_URL);
	return envUrl ? {
		url: envUrl,
		source: "env"
	} : {};
}
/**
* Resolves the URL, auth material, and handshake tuning needed to start a GatewayClient.
*/
async function resolveGatewayClientBootstrap(params) {
	const env = params.env ?? process.env;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: params.gatewayUrl,
		env,
		ignoreEnvUrlOverride: params.ignoreEnvUrlOverride,
		localPortOverride: params.localPortOverride
	});
	const buildConnectionDetails = params.buildConnectionDetails ?? buildGatewayConnectionDetailsWithResolvers;
	const connection = buildConnectionDetails({
		config: params.config,
		url: urlOverride.url,
		...params.configPath ? { configPath: params.configPath } : {},
		...urlOverride.source ? { urlSource: urlOverride.source } : {},
		ignoreEnvUrlOverride: true,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {},
		...params.serviceTargetUrl ? { serviceTargetUrl: params.serviceTargetUrl } : {}
	});
	const detectedUrlOverrideSource = resolveGatewayUrlOverrideSource(connection.urlSource);
	const urlOverrideSource = urlOverride.source ?? detectedUrlOverrideSource;
	const configuredTarget = params.allowConfiguredAuthForExactTarget && urlOverrideSource === "cli" ? resolveExactConfiguredGatewayTarget({
		buildConnectionDetails,
		config: params.config,
		explicitUrl: connection.url,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	}) : void 0;
	const tlsUrlSource = configuredTarget?.tlsSource ?? connection.urlSource;
	const tlsFingerprint = await resolveGatewayConnectionTlsFingerprint({
		config: params.config,
		url: connection.url,
		urlSource: tlsUrlSource,
		explicitTlsFingerprint: params.explicitTlsFingerprint
	});
	const surface = configuredTarget?.authSurface ?? params.modeOverride ?? (params.localPortOverride !== void 0 ? "local" : params.config.gateway?.mode === "remote" ? "remote" : "local");
	let auth;
	if (params.skipImplicitAuth) auth = explicitAuth;
	else if (urlOverrideSource && !configuredTarget) auth = params.suppressEnvAuthFallback ? explicitAuth : await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: connection.url,
		urlOverrideSource,
		modeOverride: params.modeOverride
	});
	else if (params.authPolicy === "probe") auth = await resolveGatewayProbeSurfaceAuth({
		config: params.config,
		env,
		surface
	});
	else if (params.authPolicy === "interactive") auth = await resolveGatewayInteractiveSurfaceAuth({
		config: params.config,
		env,
		explicitAuth,
		suppressEnvAuthFallback: params.suppressEnvAuthFallback,
		surface
	});
	else auth = await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		modeOverride: surface
	});
	const { deviceAuthScope, sshTunnel } = resolveGatewayDeviceAuthRoute({
		config: params.config,
		url: connection.url,
		remote: Boolean(urlOverrideSource || connection.urlSource === "config gateway.remote.url"),
		configuredRemote: !urlOverrideSource && connection.urlSource === "config gateway.remote.url" || configuredTarget?.authSurface === "remote",
		tlsFingerprint
	});
	if (params.overrideAuthErrorHint && !configuredTarget) await ensureExplicitGatewayAuth({
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		explicitAuth,
		resolvedAuth: auth,
		deviceAuthScope,
		allowStoredOriginAuth: params.allowStoredOriginAuth,
		errorHint: params.overrideAuthErrorHint,
		configPath: params.configPath
	});
	return {
		url: connection.url,
		urlSource: connection.urlSource,
		connectionDetails: connection,
		...urlOverrideSource ? { urlOverrideSource } : {},
		...deviceAuthScope ? { deviceAuthScope } : {},
		...sshTunnel ? { sshTunnel } : {},
		...auth.failureReason ? { authFailureReason: auth.failureReason } : {},
		...tlsFingerprint ? { tlsFingerprint } : {},
		auth: {
			token: auth.token,
			password: auth.password
		}
	};
}
//#endregion
export { resolveGatewayUrlOverride as i, ensureExplicitGatewayAuth as n, resolveGatewayClientBootstrap as r, GatewayExplicitAuthRequiredError as t };
