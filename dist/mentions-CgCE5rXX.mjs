import { gn as validateMentionsListParams, hn as validateMentionsDismissParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/mentions.ts
const mentionHandlers = {
	"mentions.list": async ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateMentionsListParams, "mentions.list", respond)) return;
		if (!context.mentionInbox) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry."));
			return;
		}
		await context.mentionInbox.listAsync(client, (result) => {
			respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
		});
	},
	"mentions.dismiss": async ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateMentionsDismissParams, "mentions.dismiss", respond)) return;
		if (!context.mentionInbox) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry."));
			return;
		}
		await context.mentionInbox.dismissAsync(client, params.ids, (result) => {
			respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
		});
	}
};
//#endregion
export { mentionHandlers };
