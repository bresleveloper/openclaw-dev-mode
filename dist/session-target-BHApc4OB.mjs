import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { c as visibleWidth } from "./ansi-CWsy0bu4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-HKRZ1hRc.mjs";
import { o as callGateway, r as GatewayStoredDeviceAuthUnavailableError } from "./call-C_MP4_Gs.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-Dr91v3w1.mjs";
import "./client-CpsABkfT.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { t as GatewayTransportError } from "./transport-error-C-c71VUr.mjs";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-BE52ybIt.mjs";
import { t as formatTextCell } from "./text-format-D_7c--rP.mjs";
import { r as parseSessionTargetInput, t as SessionTargetParseError } from "./session-ref-D2ziHKFX.mjs";
//#region src/cli/session-target.ts
function gatewayUrlForTarget(target) {
	return target.kind === "url" ? `${target.origin}${target.basePath}` : void 0;
}
async function callSessionTargetGateway(params) {
	const explicitUrl = params.gateway.url?.trim() || void 0;
	try {
		return await callGateway({
			config: params.gateway.config,
			url: explicitUrl,
			token: params.gateway.token,
			password: params.gateway.password,
			tlsFingerprint: params.gateway.tlsFingerprint,
			method: params.method,
			params: params.request,
			mode: GATEWAY_CLIENT_MODES.CLI,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			...explicitUrl ? {
				useStoredDeviceAuth: true,
				requiredStoredDeviceAuthScopes: [params.requiredScope]
			} : {}
		});
	} catch (error) {
		throw shapeTargetError(error, explicitUrl, params.shortRef === true);
	}
}
function candidateId(key) {
	return (key.match(/([0-9a-f]{8}-[0-9a-f-]{27})$/iu)?.[1]?.replaceAll("-", "") ?? key).slice(0, 16);
}
function formatAmbiguousCandidates(candidates, gatewayUrl) {
	const rows = candidates.map((candidate) => ({
		name: sanitizeTerminalText(candidate.displayName?.trim() || "(unnamed)").replace(/\s+/gu, " "),
		id: candidateId(candidate.key)
	}));
	const nameWidth = Math.max(...rows.map((row) => visibleWidth(row.name)));
	const width = Math.max(7, Math.min(40, nameWidth));
	return [
		"Session reference is ambiguous:",
		`${"SESSION".padEnd(width)}  ID PREFIX`,
		...rows.map((row) => `${formatTextCell(row.name, width)}  ${row.id}`),
		`Pass a longer reference. ${sessionsListHint(gatewayUrl)}`
	].join("\n");
}
function sessionsListHint(gatewayUrl) {
	return gatewayUrl ? `Choose a full session key from that gateway's Control UI (${controlUiBaseUrl(gatewayUrl)}).` : "Run `openclaw sessions list` to choose a full session key.";
}
function controlUiBaseUrl(gatewayUrl) {
	const url = new URL(gatewayUrl);
	url.protocol = url.protocol === "wss:" ? "https:" : url.protocol === "ws:" ? "http:" : url.protocol;
	return sanitizeTerminalText(url.toString().replace(/\/$/u, ""));
}
function isPriorGatewayShortIdRejection(error) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("invalid sessions.resolve params:") && error.message.includes("unexpected property 'shortId'");
}
function unreachableTargetError(error, gatewayUrl) {
	if (!gatewayUrl) return error;
	const hostname = new URL(gatewayUrl).hostname;
	const displayGatewayUrl = projectGatewayUrlForDiagnostics(gatewayUrl);
	const tailscaleHint = hostname.endsWith(".ts.net") ? " For this .ts.net host, check that Tailscale is connected and the gateway is reachable on your tailnet." : "";
	return /* @__PURE__ */ new Error(`${error.message}\nCould not reach gateway ${displayGatewayUrl}. Check whether the gateway is down and whether its tailnet or SSH tunnel is reachable.${tailscaleHint}`);
}
function shapeTargetError(error, gatewayUrl, shortRef) {
	if (shortRef && isPriorGatewayShortIdRejection(error)) return /* @__PURE__ */ new Error(`This gateway predates short-link resolution; pass the full session key. ${sessionsListHint(gatewayUrl)}`);
	if (error instanceof GatewayStoredDeviceAuthUnavailableError && gatewayUrl) return /* @__PURE__ */ new Error(`No stored device auth for ${gatewayUrl}. Pass --token or --password once, approve the pairing request in that gateway's Control UI (Settings > Devices), then retry.`);
	if (!(error instanceof Error)) return new Error(String(error));
	if (/tls fingerprint/iu.test(error.message)) return error;
	if (error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("No session found")) return /* @__PURE__ */ new Error(`${error.message}\n${sessionsListHint(gatewayUrl)}`);
	const failure = classifyGatewayConnectFailure({
		...error instanceof GatewayClientRequestError ? { details: error.details } : {},
		...error instanceof GatewayTransportError ? { reason: error.reason } : {},
		message: error.message
	});
	if (failure.kind === "identity-proxy") return /* @__PURE__ */ new Error(`${failure.userMessage}\n${failure.remediation}`);
	if (failure.kind === "unreachable") return unreachableTargetError(error, gatewayUrl ?? (error instanceof GatewayTransportError ? error.connectionDetails.url : void 0));
	return failure.remediation ? /* @__PURE__ */ new Error(`${failure.userMessage}\n${failure.remediation}`) : error;
}
async function resolveSessionTarget(params) {
	const parsed = parseSessionTargetInput(params.raw);
	const targetUrl = gatewayUrlForTarget(parsed);
	if (targetUrl && params.gateway?.url) throw new Error("pass one target: use either the session URL or --url, not both");
	const gateway = {
		...params.gateway,
		url: targetUrl ?? params.gateway?.url
	};
	if (parsed.ref.kind === "main") {
		if (parsed.kind !== "url") throw new SessionTargetParseError();
		const agents = await callSessionTargetGateway({
			gateway,
			method: "agents.list",
			request: {},
			requiredScope: params.requiredScope ?? "operator.read"
		});
		return {
			gateway,
			agentId: parsed.agentId,
			sessionKey: resolveCanonicalMainSessionKey({
				agentId: parsed.agentId,
				mainKey: agents.mainKey,
				sessionScope: agents.scope
			})
		};
	}
	const ref = parsed.ref;
	const result = await callSessionTargetGateway({
		gateway,
		method: "sessions.resolve",
		request: ref.kind === "short" ? {
			shortId: ref.shortId,
			...ref.slugHint ? { slugHint: ref.slugHint } : {}
		} : { key: ref.sessionKey },
		requiredScope: params.requiredScope ?? "operator.read",
		shortRef: ref.kind === "short"
	});
	if (result.ok) {
		const keyOwner = parseAgentSessionKey(result.key)?.agentId;
		const owner = normalizeAgentIdStrict(result.agentId ?? keyOwner);
		if (!owner.ok || keyOwner && keyOwner !== owner.value) throw new Error("Gateway returned a session without a consistent agent identity.");
		return {
			gateway,
			sessionKey: result.key,
			agentId: owner.value
		};
	}
	if (result.candidates?.length) throw new Error(formatAmbiguousCandidates(result.candidates, gateway.url));
	throw new Error(`No session found.\n${sessionsListHint(gateway.url)}`);
}
//#endregion
export { resolveSessionTarget as n, callSessionTargetGateway as t };
