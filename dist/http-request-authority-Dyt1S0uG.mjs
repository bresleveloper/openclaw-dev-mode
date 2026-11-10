import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { o as emitInternalDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { m as readUserProfileAliasRevision } from "./user-profile-events-CXjmX5Qy.mjs";
import "./io-DIF-KW3P.mjs";
import { c as readOperatorRolePolicyRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { a as getRemoteControlUiIngressContext, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { d as runHttpConnectionRequest, l as createHttpRequestAbortSignal, p as waitForHttpRequestRejection } from "./http-body-DZQjJc2J.mjs";
import { i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, t as GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE } from "./operator-access-policy-D9L4Y9uO.mjs";
import { r as isGatewayAuthPolicyCurrent, t as captureGatewayAuthPolicy } from "./auth-policy-BnNZPB_e.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { a as prepareGatewayHttpErrorResponse, c as sendGatewayAuthFailure, m as sendUnauthorized, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
function bindHttpOperatorAccessAuthority(res, authority, replyOnFailure = true) {
	if (!authority) return true;
	if (!hasCurrentGatewayOperatorAccess(authority)) {
		if (replyOnFailure && !res.writableEnded && !res.destroyed) sendGatewayHttpAuthFailure(res, {
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
/** Replaces startup custody with the live Gateway and one disconnect-aware request scope. */
function runGatewayHttpRequest(req, res, context, handle) {
	const run = async () => {
		const ingress = getRemoteControlUiIngressContext(req);
		assertRemoteControlUiIngressCurrent(ingress);
		const work = new AsyncWorkScope();
		const requestContext = work.run(() => AsyncLocalStorage.snapshot());
		const client = createHttpRequestAbortSignal(req, res);
		const shutdown = context?.requestEntryLifetime?.signal;
		const signal = AbortSignal.any([
			client.signal,
			...shutdown ? [shutdown] : [],
			...ingress ? [ingress.signal] : []
		]);
		let cancelledBy;
		const cancel = () => requestContext(() => {
			cancelledBy = client.signal.aborted ? "client" : "shutdown";
			work.beginClose(signal.reason);
			if (cancelledBy === "shutdown" && !res.writableFinished && !res.destroyed) res.destroy();
		});
		signal.addEventListener("abort", cancel, { once: true });
		if (signal.aborted) cancel();
		let failed = false;
		try {
			await work.track(() => runHttpConnectionRequest(req, async () => {
				failed = await handle() === "failed";
			}, res));
		} catch (error) {
			failed = true;
			throw error;
		} finally {
			signal.removeEventListener("abort", cancel);
			client.cleanup();
			if (cancelledBy && !failed && res.statusCode < 500 && !(cancelledBy === "client" && waitForHttpRequestRejection(req))) emitInternalDiagnosticEvent({
				type: "gateway.http.cancelled",
				source: cancelledBy
			});
			await requestContext(() => work.drain());
		}
	};
	return context ? context.trackExecution(run) : run();
}
/** Authority ended; its response has already been answered or closed. */
var GatewayHttpRequestAuthorityError = class extends Error {};
/** Request owners consume authority outcomes; unexpected failures keep their own diagnostics. */
function finishGatewayHttpAuthorityError(res, error) {
	const signal = getAsyncWorkSignal();
	if (signal?.aborted && (error === signal.reason || isAbortError(error))) {
		if (!res.writableEnded && !res.destroyed) res.destroy();
		return true;
	}
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
	const cfg = params.cfg ?? readRuntimeConfig();
	const policy = captureGatewayAuthPolicy(cfg, null);
	const authGeneration = resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies ?? cfg.gateway?.trustedProxies);
	const roleRevision = cfg.gateway?.roles ? readOperatorRolePolicyRevision() : void 0;
	const aliasRevision = readUserProfileAliasRevision();
	const ingress = getRemoteControlUiIngressContext(params.req);
	return () => {
		if (ingress) try {
			assertRemoteControlUiIngressCurrent(ingress);
		} catch {
			return false;
		}
		const current = params.getRuntimeConfig?.() ?? readRuntimeConfig();
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
export { finishGatewayHttpAuthorityError as a, sendGatewayHttpAuthFailure as c, captureHttpRequestAuthority as i, assertGatewayHttpRequestCurrent as n, runGatewayHttpRequest as o, bindHttpResponseAuthority as r, bindHttpOperatorAccessAuthority as s, GatewayHttpRequestAuthorityError as t };
