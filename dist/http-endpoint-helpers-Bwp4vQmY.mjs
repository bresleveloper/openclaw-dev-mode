import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { d as resolveTrustedHttpOperatorScopes, r as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-DnAyBVQj.mjs";
import { a as readJsonBodyOrError, l as sendMethodNotAllowed, u as sendMissingScopeForbidden } from "./http-common-oJ4rIoMl.mjs";
import "./http-utils-B5XpnbIs.mjs";
//#region src/gateway/http-endpoint-helpers.ts
/** Handles a gateway POST JSON endpoint and returns the parsed body when authorized. */
async function handleGatewayPostJsonEndpoint(req, res, opts) {
	if (new URL(req.url ?? "/", "http://localhost").pathname !== opts.pathname) return false;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res);
		return;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return;
	const operatorScopes = opts.resolveOperatorScopes?.(req, requestAuth) ?? resolveTrustedHttpOperatorScopes(req, requestAuth);
	if (opts.requiredOperatorMethod) {
		const scopeAuth = authorizeOperatorScopesForMethod(opts.requiredOperatorMethod, operatorScopes);
		if (!scopeAuth.allowed) {
			sendMissingScopeForbidden(res, scopeAuth.missingScope);
			return;
		}
	}
	const body = await readJsonBodyOrError(req, res, opts.maxBodyBytes);
	if (body === void 0) return;
	try {
		await requestAuth.revalidate();
	} catch (error) {
		if (res.writableEnded || res.destroyed) return;
		throw error;
	}
	return {
		body,
		requestAuth,
		operatorScopes
	};
}
//#endregion
export { handleGatewayPostJsonEndpoint as t };
