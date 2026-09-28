import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { mn as validateMentionsListParams, pn as validateMentionsDismissParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/mentions.ts
const mentionHandlers = {
	"mentions.list": ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateMentionsListParams, "mentions.list", respond)) return;
		if (!context.mentionInbox) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry."));
			return;
		}
		const result = context.mentionInbox.list(client);
		respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
	},
	"mentions.dismiss": ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateMentionsDismissParams, "mentions.dismiss", respond)) return;
		if (!context.mentionInbox) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry."));
			return;
		}
		const result = context.mentionInbox.dismiss(client, params.ids);
		respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
	}
};
//#endregion
export { mentionHandlers };
