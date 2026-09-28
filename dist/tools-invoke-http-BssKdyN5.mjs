import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-evzAFJT4.mjs";
import { l as resolveOpenAiCompatibleHttpSenderIsOwner, o as authorizeScopedGatewayHttpRequestOrReply, p as assertGatewayHttpRequestCurrent, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DnAyBVQj.mjs";
import { n as getHeader } from "./http-header-value-Be14tJQx.mjs";
import { a as readJsonBodyOrError, c as sendJson, h as watchClientDisconnect, l as sendMethodNotAllowed } from "./http-common-oJ4rIoMl.mjs";
import "./http-utils-B5XpnbIs.mjs";
import { t as invokeGatewayTool } from "./tools-invoke-shared-aXkf_8uV.mjs";
//#region src/gateway/tools-invoke-http.ts
const DEFAULT_BODY_BYTES = 2097152;
/** Handle `/tools/invoke` requests and return false when another HTTP route should handle them. */
async function handleToolsInvokeHttpRequest(req, res, opts) {
	let url;
	try {
		url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
	} catch {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({
			error: "bad_request",
			message: "Invalid request URL"
		}));
		return true;
	}
	if (url.pathname !== "/tools/invoke") return false;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		operatorMethod: "agent",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg, requestAuth, operatorScopes } = authResult;
	if (req.socket.destroyed || res.destroyed || res.socket?.destroyed) return true;
	const abortController = new AbortController();
	const operatorAccessAuthority = requestAuth.operatorAccessAuthority;
	const signal = operatorAccessAuthority ? AbortSignal.any([abortController.signal, operatorAccessAuthority.signal]) : abortController.signal;
	const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
	try {
		const bodyUnknown = await readJsonBodyOrError(req, res, opts.maxBodyBytes ?? DEFAULT_BODY_BYTES);
		if (bodyUnknown === void 0 || signal.aborted) return true;
		await requestAuth.revalidate();
		const body = bodyUnknown ?? {};
		const messageChannel = normalizeMessageChannel(getHeader(req, "x-openclaw-message-channel") ?? "");
		const accountId = normalizeOptionalString(getHeader(req, "x-openclaw-account-id"));
		const agentTo = normalizeOptionalString(getHeader(req, "x-openclaw-message-to"));
		const agentThreadId = normalizeOptionalString(getHeader(req, "x-openclaw-thread-id"));
		const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth);
		const client = createSyntheticPluginRuntimeClient({
			authenticatedUserProfile: requestAuth.authenticatedUserProfile,
			operatorRoleActor: requestAuth.operatorRoleActor,
			operatorAccessAuthority,
			scopes: operatorScopes
		});
		const context = opts.resolveGatewayContext?.();
		if (resolveGatewayOperatorRoleActor(client)?.kind === "operator" && !context) {
			sendJson(res, 503, { error: {
				message: "Gateway context is unavailable; retry shortly.",
				type: "unavailable"
			} });
			return true;
		}
		const outcome = await withPluginRuntimeGatewayRequestScope({
			client,
			context,
			resolveGatewayContext: opts.resolveGatewayContext,
			signal,
			hasCurrentClientAuthority: () => !signal.aborted && requestAuth.hasCurrentClientAuthority(),
			isWebchatConnect: () => false
		}, () => invokeGatewayTool({
			cfg,
			input: body,
			messageChannel: messageChannel ?? void 0,
			accountId,
			agentTo,
			agentThreadId,
			authenticatedUserProfile: requestAuth.authenticatedUserProfile,
			operatorRoleActor: requestAuth.operatorRoleActor,
			operatorScopes,
			senderIsOwner,
			conversationReadOrigin: "direct-operator",
			toolCallIdPrefix: "http",
			signal,
			assertInvocationCurrent: () => assertGatewayHttpRequestCurrent(requestAuth)
		}));
		if (signal.aborted) return true;
		if (outcome.ok) sendJson(res, outcome.status, {
			ok: true,
			result: outcome.result
		});
		else sendJson(res, outcome.status, {
			ok: false,
			error: outcome.error
		});
	} catch (error) {
		if (!res.writableEnded && !res.destroyed) throw error;
	} finally {
		stopWatchingDisconnect();
		abortController.abort(/* @__PURE__ */ new Error("HTTP tool invocation authority ended"));
	}
	return true;
}
//#endregion
export { handleToolsInvokeHttpRequest };
