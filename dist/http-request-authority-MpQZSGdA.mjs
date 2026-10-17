import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { W as readUserProfileAliasRevision } from "./user-profiles-internal-DlO1LBbo.mjs";
import { c as readOperatorRolePolicyRevision } from "./operator-role-policy-BqPaarjx.mjs";
import { i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, t as GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE } from "./operator-access-policy-DIBw5efa.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { r as isGatewayAuthPolicyCurrent, t as captureGatewayAuthPolicy } from "./auth-policy-RgN65hqI.mjs";
import { a as prepareGatewayHttpErrorResponse, c as sendGatewayAuthFailure, m as sendUnauthorized, u as sendJson } from "./http-common-D3e5uEH1.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
//#region src/gateway/http-operator-access.ts
function sendGatewayHttpAuthFailure(res, authResult) {
	if (authResult.reason !== "operator_access_denied") {
		sendGatewayAuthFailure(res, authResult);
		return;
	}
	if (!prepareGatewayHttpErrorResponse(res, "Forbidden")) return;
	sendJson(res, 403, { error: {
		message: GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE,
		type: "forbidden"
	} });
}
/** The listener belongs to this response, never to a reusable keep-alive socket. */
function bindHttpOperatorAccessAuthority(res, authority) {
	if (!authority) return true;
	if (!hasCurrentGatewayOperatorAccess(authority)) {
		if (!res.writableEnded && !res.destroyed) sendGatewayHttpAuthFailure(res, {
			ok: false,
			reason: "operator_access_denied"
		});
		return false;
	}
	if (res.writableEnded || res.destroyed) return false;
	const release = () => {
		authority.signal.removeEventListener("abort", revoke);
		res.off("finish", release);
		res.off("close", release);
	};
	const revoke = () => {
		release();
		if (!res.writableEnded && !res.destroyed) res.destroy();
	};
	authority.signal.addEventListener("abort", revoke, { once: true });
	res.once("finish", release);
	res.once("close", release);
	return true;
}
//#endregion
//#region src/gateway/http-request-authority.ts
/** Authority ended; its response has already been answered or closed. */
var GatewayHttpRequestAuthorityError = class extends Error {};
/** Request owners consume authority outcomes; unexpected failures keep their own diagnostics. */
function finishGatewayHttpAuthorityError(res, error) {
	if (error instanceof GatewayOperatorAccessDeniedError) {
		sendGatewayHttpAuthFailure(res, {
			ok: false,
			reason: "operator_access_denied"
		});
		return true;
	}
	return error instanceof GatewayHttpRequestAuthorityError;
}
function assertGatewayHttpRequestCurrent(requestAuth) {
	if (requestAuth.hasCurrentClientAuthority?.() === false) throw new ToolAuthorizationError("Gateway requester authority changed");
}
function captureHttpRequestAuthority(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const policy = captureGatewayAuthPolicy(cfg, null);
	const authGeneration = resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies ?? cfg.gateway?.trustedProxies);
	const roleRevision = cfg.gateway?.roles ? readOperatorRolePolicyRevision() : void 0;
	const aliasRevision = readUserProfileAliasRevision();
	return () => {
		const current = params.getRuntimeConfig?.() ?? getRuntimeConfig();
		return !params.req.socket?.destroyed && isGatewayAuthPolicyCurrent(policy, current) && (roleRevision === void 0 || roleRevision === readOperatorRolePolicyRevision()) && aliasRevision === readUserProfileAliasRevision() && authGeneration === resolveSharedGatewaySessionGeneration(params.getResolvedAuth?.() ?? params.auth, params.trustedProxies ?? current.gateway?.trustedProxies);
	};
}
function bindHttpResponseAuthority(auth, res, hasCurrentClientAuthority) {
	const assertCurrent = () => {
		if (res.writableEnded || res.destroyed) throw new GatewayHttpRequestAuthorityError("HTTP request authority expired");
		if (!hasCurrentGatewayOperatorAccess(auth.operatorAccessAuthority)) throw new GatewayOperatorAccessDeniedError();
		if (!hasCurrentClientAuthority()) {
			sendUnauthorized(res);
			throw new GatewayHttpRequestAuthorityError("Unauthorized");
		}
	};
	return {
		...auth,
		hasCurrentClientAuthority: () => !res.writableEnded && !res.destroyed && hasCurrentClientAuthority() && hasCurrentGatewayOperatorAccess(auth.operatorAccessAuthority),
		assertCurrent,
		revalidate: async () => assertCurrent()
	};
}
//#endregion
export { finishGatewayHttpAuthorityError as a, captureHttpRequestAuthority as i, assertGatewayHttpRequestCurrent as n, bindHttpOperatorAccessAuthority as o, bindHttpResponseAuthority as r, sendGatewayHttpAuthFailure as s, GatewayHttpRequestAuthorityError as t };
