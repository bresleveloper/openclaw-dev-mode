import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { o as classifyGatewayConnectFailure, t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-q_NaMExM.mjs";
import { t as resolveGatewayProbeTarget } from "./probe-target-CzMPrY7s.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
//#region src/cli/daemon-cli/probe.ts
const probeGatewayModuleLoader = createLazyImportLoader(() => import("./probe-Cl0u_9Ie.mjs"));
const CONNECT_ERROR_DETAIL_CODE_VALUES = new Set(Object.values(ConnectErrorDetailCodes));
function resolveProbeFailureMessage(result) {
	const closeHint = result.close ? `gateway closed (${result.close.code}): ${result.close.reason}` : null;
	if (closeHint && (!result.error || result.error === "timeout")) return closeHint;
	return result.error ?? closeHint ?? "gateway probe failed";
}
function projectGatewayConnectFailure(params) {
	const failure = classifyGatewayConnectFailure(params);
	const detailCode = readConnectErrorDetailCode(params.details);
	return {
		kind: failure.kind,
		...detailCode && CONNECT_ERROR_DETAIL_CODE_VALUES.has(detailCode) ? { detailCode } : {}
	};
}
/** Probe Gateway connectivity or read-capability status with optional RPC verification. */
async function probeGatewayStatus(opts) {
	const kind = opts.requireRpc ? "read" : "connect";
	let auth;
	let server;
	let eventLoop;
	let gatewayReached = false;
	try {
		const result = await withProgress({
			label: "Checking gateway status...",
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => {
			if (opts.requireRpc) {
				const allowRpcConfigCredentials = opts.allowRpcConfigCredentials !== false;
				if (!allowRpcConfigCredentials && !opts.token && !opts.password) throw new Error("gateway status RPC skipped because configured gateway credentials are disabled for this status request");
				const { resolveProbeAuthSummary } = await probeGatewayModuleLoader.load();
				const { callGateway } = await import("./call-CWvmXO5x.mjs");
				await callGateway({
					...opts.urlOverride ? { url: opts.urlOverride } : { serviceTargetUrl: opts.url },
					localPortOverride: opts.localPortOverride,
					token: opts.token,
					password: opts.password,
					tlsFingerprint: opts.tlsFingerprint,
					preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
					...allowRpcConfigCredentials && opts.config ? { config: opts.config } : {},
					method: "status",
					timeoutMs: opts.timeoutMs,
					sharedStateMode: "read-only",
					skipImplicitAuth: true,
					...opts.configPath ? { configPath: opts.configPath } : {},
					onHelloOk: (hello) => {
						gatewayReached = true;
						auth = resolveProbeAuthSummary({
							role: hello.auth.role,
							scopes: hello.auth.scopes,
							authMetadataPresent: true
						});
						server = hello.server;
						eventLoop = hello.snapshot?.health?.eventLoop;
					}
				});
				return {
					ok: true,
					auth,
					server
				};
			}
			const { probeGateway } = await probeGatewayModuleLoader.load();
			return await probeGateway({
				url: opts.url,
				configuredRemote: !opts.urlOverride && opts.localPortOverride === void 0 && opts.url !== process.env.OPENCLAW_GATEWAY_URL?.trim() && resolveGatewayProbeTarget(opts.config ?? {}).mode === "remote",
				...opts.urlOverride || opts.localPortOverride === void 0 && (resolveGatewayProbeTarget(opts.config ?? {}).mode === "remote" || opts.url === process.env.OPENCLAW_GATEWAY_URL?.trim()) ? { originScopedDeviceAuth: true } : {},
				...opts.config ? { config: opts.config } : {},
				auth: {
					token: opts.token,
					password: opts.password
				},
				tlsFingerprint: opts.tlsFingerprint,
				...opts.preauthHandshakeTimeoutMs !== void 0 ? { preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs } : {},
				timeoutMs: opts.timeoutMs,
				includeDetails: false
			});
		});
		auth = result.auth;
		server = result.server;
		const serverSummary = server ? { server } : {};
		const version = server?.version ?? null;
		if (result.ok) return {
			ok: true,
			kind,
			capability: kind === "read" ? auth?.capability && auth.capability !== "unknown" ? auth.capability : "read_only" : auth?.capability,
			auth,
			...serverSummary,
			...version != null ? { version } : {}
		};
		const error = redactSensitiveUrlLikeString(resolveProbeFailureMessage(result));
		return {
			ok: false,
			kind,
			...result.gatewayReached ? { gatewayReached: true } : {},
			...result.error === "timeout" && !result.close ? { timedOut: true } : {},
			capability: auth?.capability,
			auth,
			...serverSummary,
			...version != null ? { version } : {},
			connectFailure: projectGatewayConnectFailure({
				details: result.connectErrorDetails,
				message: error,
				reason: result.close?.reason
			}),
			error
		};
	} catch (err) {
		const error = redactSensitiveUrlLikeString(formatErrorMessage(err));
		return {
			ok: false,
			kind,
			...gatewayReached || isGatewayProtocolResponseError(err) ? { gatewayReached: true } : {},
			...isGatewayTransportError(err) && err.kind === "timeout" ? { timedOut: true } : {},
			...auth ? {
				auth,
				capability: auth.capability
			} : {},
			...server ? {
				server,
				...server.version != null ? { version: server.version } : {}
			} : {},
			...eventLoop ? { eventLoop } : {},
			connectFailure: projectGatewayConnectFailure({
				message: error,
				...isGatewayProtocolResponseError(err) ? { details: err.details } : {}
			}),
			error
		};
	}
}
//#endregion
export { probeGatewayStatus as t };
