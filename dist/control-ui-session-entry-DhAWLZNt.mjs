import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import "./version-CwNT1gaY.mjs";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-Bnus0Sst.mjs";
import { r as parseControlUiSessionReturnPath } from "./control-ui-session-entry-path-mAdcjKkp.mjs";
import { c as sendGatewayAuthFailure } from "./http-common-DyL3AdjD.mjs";
import { s as checkGatewayHttpRequestAuth, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DvoR_YDD.mjs";
import { t as resolveControlUiSessionPath } from "./control-ui-session-path-resolve-BzHBuCi1.mjs";
//#region src/gateway/control-ui-session-entry.ts
/** This endpoint must remain behind the deployment's authenticated proxy, unlike /chat. */
async function serveControlUiSessionEntry(params) {
	const { req, res, basePath, projection } = params;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	const url = new URL(req.url ?? "/", "http://localhost");
	const path = url.searchParams.get("path") ?? "";
	const target = parseControlUiSessionReturnPath(path, basePath);
	const probe = url.searchParams.get("probe") === "1";
	if (req.method !== "GET" || !target || url.searchParams.getAll("path").length !== 1 || url.searchParams.getAll("probe").length > 1 || [...url.searchParams.keys()].some((key) => key !== "path" && key !== "probe") || url.searchParams.has("probe") && !probe) {
		res.statusCode = 404;
		res.end("Not found");
		return true;
	}
	const auth = await checkGatewayHttpRequestAuth({
		...params,
		res: void 0
	}, true);
	if (!auth.ok) {
		if (!probe && (params.auth.mode === "token" || params.auth.mode === "password")) await params.serveApp(path);
		else sendGatewayAuthFailure(res, auth.authResult);
		return true;
	}
	const requestAuth = auth.requestAuth;
	const scopes = requestAuth.deviceOperatorScopes ?? resolveSharedSecretHttpOperatorScopes(req, requestAuth);
	const client = {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.CONTROL_UI,
				version: "internal",
				platform: "web",
				mode: GATEWAY_CLIENT_MODES.UI
			},
			role: "operator",
			scopes
		},
		authenticatedUserProfile: requestAuth.authenticatedUserProfile,
		internal: {
			operatorRoleActor: requestAuth.operatorRoleActor,
			operatorAccessAuthority: requestAuth.operatorAccessAuthority
		}
	};
	if (projection) prepareGatewayRecipientProfile(client);
	const selected = projection && authorizeOperatorScopesForMethod("chat.history", scopes).allowed ? await resolveControlUiSessionPath({
		target,
		projection,
		client,
		isCurrent: requestAuth.hasCurrentClientAuthority
	}) : null;
	if (!selected || !projection || !requestAuth.hasCurrentClientAuthority()) {
		res.statusCode = 403;
		res.end(probe ? void 0 : "Session unavailable. Reload the conversation or log in again.");
		return true;
	}
	const isCurrent = () => requestAuth.hasCurrentClientAuthority() && selected.isCurrent();
	if (probe) {
		res.statusCode = isCurrent() ? 204 : 403;
		res.end();
	} else {
		res.setHeader("X-OpenClaw-Session-Entry", "1");
		await params.serveApp(path, isCurrent);
	}
	return true;
}
//#endregion
export { serveControlUiSessionEntry };
