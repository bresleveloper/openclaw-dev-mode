import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as getRemoteControlUiIngressContext, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { c as verifyBoardViewTicket, r as BoardGatewayUnavailableError } from "./board-view-ticket-DPSfmGZg.mjs";
import { i as respondPlainText, n as isReadHttpMethod, r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { d as sendMethodNotAllowed } from "./http-common-DyL3AdjD.mjs";
import { t as buildBoardWidgetContentSecurityPolicy } from "./board-sandbox-Ce6r23Gv.mjs";
import { t as prepareRemoteIngressSessionRead } from "./remote-ingress-session-read-DHaxwFZQ.mjs";
import { t as boardStore } from "./board-store-D0cYtso4.mjs";
import { t as withAuthorizedBoardWidgetView } from "./board-widget-view-FLBOCkZK.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-C1LFMGG7.mjs";
//#region src/gateway/board-http.ts
const BOARD_WIDGET_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
function parseBoardWidgetPath(pathname) {
	const match = /^\/__openclaw__\/board\/([^/]+)\/([^/]+)\/index\.html$/.exec(pathname);
	if (!match) return;
	try {
		const sessionKey = decodeURIComponent(match[1]);
		const name = decodeURIComponent(match[2]);
		if (!sessionKey || !BOARD_WIDGET_NAME_PATTERN.test(name)) return;
		return {
			sessionKey,
			name
		};
	} catch {
		return;
	}
}
async function handleBoardHttpRequest(req, res, opts = {}) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const pathname = url.pathname;
	if (!pathname.startsWith("/__openclaw__/board/")) return false;
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (!isReadHttpMethod(req.method)) {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const path = parseBoardWidgetPath(pathname);
	if (!path) {
		respondNotFound(res);
		return true;
	}
	const ticket = url.searchParams.get("bt");
	if (!ticket) {
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const ingress = getRemoteControlUiIngressContext(req);
			const claims = verifyBoardViewTicket(ticket, { nowMs: opts.nowMs });
			if (!claims) {
				respondPlainText(res, 401, "Unauthorized");
				return true;
			}
			const ingressRead = _usingCtx$1.u(await prepareRemoteIngressSessionRead(ingress?.resolvePrincipal(), claims.sessionKey, claims.agentId));
			return await withAuthorizedBoardWidgetView(opts.store ?? boardStore, ticket, (authorized) => {
				assertRemoteControlUiIngressCurrent(ingress);
				ingressRead.assertCurrent();
				if ((authorized.agentId ? sessionObserverScopeKey(authorized.sessionKey, authorized.agentId) : authorized.sessionKey) !== path.sessionKey || authorized.name !== path.name) {
					respondPlainText(res, 401, "Unauthorized");
					return true;
				}
				const html = authorized.document.html;
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.setHeader("Content-Length", String(Buffer.byteLength(html)));
				res.setHeader("Content-Security-Policy", buildBoardWidgetContentSecurityPolicy(authorized.document));
				res.setHeader("Cache-Control", "no-cache");
				res.end(req.method === "HEAD" ? void 0 : html);
				return true;
			}, {
				gatewayContext: opts.resolveGatewayContext?.(),
				nowMs: opts.nowMs
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		if (error instanceof BoardGatewayUnavailableError) {
			respondPlainText(res, 503, "Service Unavailable");
			return true;
		}
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
}
//#endregion
export { handleBoardHttpRequest };
