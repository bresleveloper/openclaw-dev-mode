import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { a as resolveBoardWidgetContentKindResourceUrls, i as resolveBoardWidgetContentKindByPluginKind } from "./board-widget-content-kinds-BjjfWoCI.mjs";
import { c as verifyBoardViewTicket, o as requireBoardViewTicketAuthority } from "./board-view-ticket-BuB3AftP.mjs";
import { t as buildWidgetDocument } from "./wrap-BfCYBZGL.mjs";
//#region src/gateway/board-widget-view.ts
async function withAuthorizedBoardWidgetView(store, ticket, consume, options = {}) {
	const claims = verifyBoardViewTicket(ticket, options);
	if (!claims) throw new BoardValidationError("invalid_operation", "board widget view ticket is invalid");
	requireBoardViewTicketAuthority(claims, options.gatewayContext);
	const session = {
		sessionKey: claims.sessionKey,
		agentId: claims.agentId
	};
	return await store.useWidgetDocument(session, claims.name, (document) => {
		const authority = requireBoardViewTicketAuthority(claims, options.gatewayContext);
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
}
//#endregion
export { withAuthorizedBoardWidgetView as t };
