import { Fn as validateMentionsListParams, Ng as errorShape, Pn as validateMentionsDismissParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
//#region src/gateway/server-methods/mentions.ts
function mentionHandler(method, validate) {
	return async ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validate, method, respond)) return;
		if (!context.mentionInbox) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry."));
			return;
		}
		const publish = (result) => {
			respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
		};
		if (params.ids) await context.mentionInbox.dismissAsync(client, params.ids, publish);
		else await context.mentionInbox.listAsync(client, publish);
	};
}
const mentionHandlers = {
	"mentions.list": mentionHandler("mentions.list", validateMentionsListParams),
	"mentions.dismiss": mentionHandler("mentions.dismiss", validateMentionsDismissParams)
};
//#endregion
export { mentionHandlers };
