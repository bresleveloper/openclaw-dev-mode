import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { c as verifyBoardViewTicket, o as requireBoardViewTicketAuthority } from "./board-view-ticket-DPSfmGZg.mjs";
import { a as resolveBoardWidgetContentKindResourceUrls, i as resolveBoardWidgetContentKindByPluginKind } from "./board-widget-content-kinds-Dtlmq87Q.mjs";
import { t as buildWidgetDocument } from "./wrap-ByaJY2Sf.mjs";
import { t as prepareRemoteIngressSessionRead } from "./remote-ingress-session-read-DHaxwFZQ.mjs";
//#region src/gateway/board-widget-view.ts
async function withAuthorizedBoardWidgetView(store, ticket, consume, options = {}) {
	try {
		var _usingCtx$1 = _usingCtx();
		const claims = verifyBoardViewTicket(ticket, options);
		if (!claims) throw new BoardValidationError("invalid_operation", "board widget view ticket is invalid");
		const source = requireBoardViewTicketAuthority(claims, options.gatewayContext);
		const ingressRead = _usingCtx$1.u(await prepareRemoteIngressSessionRead(source.remoteIngressPrincipal, claims.sessionKey, claims.agentId));
		const session = {
			sessionKey: claims.sessionKey,
			agentId: claims.agentId
		};
		return await store.useWidgetDocument(session, claims.name, (document) => {
			const authority = requireBoardViewTicketAuthority(claims, options.gatewayContext);
			ingressRead.assertCurrent();
			if (claims.expiresAtMs <= (options.nowMs ?? Date.now())) throw new BoardValidationError("invalid_operation", "board widget view ticket is expired");
			if (!document || !("viewGeneration" in document) || document.grantState !== "none" && document.grantState !== "granted" || document.revision !== claims.revision || document.viewGeneration !== claims.viewGeneration) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
			if (claims.pluginFrame) {
				if (!("source" in document) || document.pluginKind !== claims.pluginFrame.pluginKind) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
				const registration = resolveBoardWidgetContentKindByPluginKind(authority.pluginRegistry, document.pluginKind);
				const resourceUrls = registration ? resolveBoardWidgetContentKindResourceUrls(registration, claims.pluginFrame.scopedHostUrl) : void 0;
				if (!registration || !resourceUrls) throw new BoardValidationError("invalid_operation", "board widget content kind is unavailable");
				const resourceOrigins = [...new Set(Object.values(resourceUrls).map((url) => new URL(url).origin))];
				const body = registration.definition.composeDocument({
					source: document.source,
					title: document.title ?? claims.name,
					resourceUrls,
					promptGranted: document.grantState === "granted" && document.declared?.tools?.includes("prompt") === true
				});
				const composed = {
					html: buildWidgetDocument(document.title ?? claims.name, body, {
						connectOrigins: document.declared?.netOrigins,
						scriptOrigins: resourceOrigins
					}),
					revision: document.revision,
					sha256: document.sha256,
					viewGeneration: document.viewGeneration,
					grantState: document.grantState,
					...document.declared ? { declared: document.declared } : {},
					resourceOrigins
				};
				return consume({
					...session,
					name: claims.name,
					document: composed
				});
			}
			if (!("html" in document)) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
			return consume({
				...session,
				name: claims.name,
				document
			});
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { withAuthorizedBoardWidgetView as t };
