import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { s as requireTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import { l as nodeHostGatewaysShareOrigin, s as nodeHostCloudflareAccessConfigFromEnv } from "./config-DLlmgxee.mjs";
import { t as decodePairingSetupCode } from "./setup-code-BNyr2Ilv.mjs";
//#region src/cli/node-cli/gateway-options.ts
function gatewayConfigFromUrl(url, tlsFingerprint) {
	const parsed = new URL(url);
	const tls = parsed.protocol === "wss:";
	return {
		host: parsed.hostname,
		port: parsed.port ? Number.parseInt(parsed.port, 10) : tls ? 443 : 80,
		...parsed.pathname !== "/" ? { contextPath: parsed.pathname } : {},
		tls,
		...tlsFingerprint ? { tlsFingerprint } : {}
	};
}
function resolveNodePairGatewayOptions(input) {
	return resolveNodePairGatewayPayload(decodePairingSetupCode(input));
}
/** Project a validated pairing payload into the canonical node-host candidate list. */
function resolveNodePairGatewayPayload(payload) {
	const candidates = (payload.urls ?? [payload.url]).map((url) => gatewayConfigFromUrl(url, url === payload.url ? payload.tlsFingerprint : void 0));
	const primary = candidates[0];
	return {
		host: primary.host ?? "127.0.0.1",
		port: primary.port ?? 18789,
		...primary.contextPath ? { contextPath: primary.contextPath } : {},
		tls: primary.tls ?? false,
		...primary.tlsFingerprint ? { tlsFingerprint: primary.tlsFingerprint } : {},
		bootstrapToken: payload.bootstrapToken,
		candidates
	};
}
function resolveNodeGatewayOptions(options, config, pair, env = process.env) {
	const baselineHost = pair?.host ?? config?.gateway?.host ?? "127.0.0.1";
	const baselinePort = pair?.port ?? config?.gateway?.port ?? 18789;
	const host = normalizeOptionalString(options.host) || baselineHost;
	const port = options.port === void 0 ? baselinePort : parsePort(options.port);
	const endpointChanged = host !== baselineHost || port !== null && port !== baselinePort;
	const baselineTlsFingerprint = pair?.tlsFingerprint ?? config?.gateway?.tlsFingerprint;
	const selectedTlsFingerprint = options.tls === false ? void 0 : options.tlsFingerprint !== void 0 ? options.tlsFingerprint : endpointChanged ? void 0 : baselineTlsFingerprint;
	const baselineTls = pair?.tls ?? config?.gateway?.tls;
	const tlsFingerprint = selectedTlsFingerprint ? requireTlsFingerprint(selectedTlsFingerprint) : void 0;
	const tls = typeof options.tls === "boolean" ? options.tls : Boolean(tlsFingerprint) || (endpointChanged ? void 0 : baselineTls);
	const contextPath = normalizeOptionalString(options.contextPath) ?? (options.contextPath !== void 0 || endpointChanged ? void 0 : pair?.contextPath ?? config?.gateway?.contextPath);
	const hasExplicitEndpoint = options.host !== void 0 || options.port !== void 0 || options.contextPath !== void 0 || options.tls !== void 0 || options.tlsFingerprint !== void 0;
	const savedGatewayMatchesBaseline = !pair || config?.gateway !== void 0 && nodeHostGatewaysShareOrigin(config.gateway, pair.candidates[0]);
	const cloudflareAccess = (!endpointChanged && savedGatewayMatchesBaseline ? config?.gateway?.cloudflareAccess : void 0) ?? nodeHostCloudflareAccessConfigFromEnv(env);
	return {
		host,
		port,
		contextPath,
		tls,
		tlsFingerprint,
		cloudflareAccess,
		gatewayCandidates: pair && !hasExplicitEndpoint ? pair.candidates.map((candidate, index) => index === 0 && cloudflareAccess ? {
			...candidate,
			cloudflareAccess
		} : candidate) : void 0
	};
}
//#endregion
export { resolveNodePairGatewayOptions as n, resolveNodePairGatewayPayload as r, resolveNodeGatewayOptions as t };
