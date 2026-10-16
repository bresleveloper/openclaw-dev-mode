import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { t as buildGatewayConnectionDetails } from "./call-DnqhP17M.mjs";
import { t as resolveGatewayProbeTarget } from "./probe-target-CzMPrY7s.mjs";
import { n as resolveGatewayProbeAuthSafe } from "./probe-auth-CUiOEilG.mjs";
import { r as probeGateway } from "./probe-B0qn0tgj.mjs";
//#region src/security/audit-gateway-probe.ts
async function probeSecurityAuditGateway(params) {
	const connection = buildGatewayConnectionDetails({ config: params.cfg });
	const url = connection.url;
	const probeTarget = resolveGatewayProbeTarget(params.cfg);
	const authResolution = resolveGatewayProbeAuthSafe({
		cfg: params.cfg,
		env: params.env,
		mode: probeTarget.mode,
		explicitAuth: params.explicitAuth
	});
	const res = await (params.probe ?? probeGateway)({
		url,
		config: params.cfg,
		env: params.env,
		configuredRemote: connection.urlSource === "config gateway.remote.url",
		originScopedDeviceAuth: probeTarget.mode === "remote" || Boolean(process.env.OPENCLAW_GATEWAY_URL?.trim()),
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
//#endregion
export { probeSecurityAuditGateway };
