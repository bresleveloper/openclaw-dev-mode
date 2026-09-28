import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ts as validateUsersMentionableParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/users-mentionable.ts
const usersMentionableHandlers = { "users.mentionable": async ({ client, context, params, respond }) => {
	if (!assertValidParams(params, validateUsersMentionableParams, "users.mentionable", respond)) return;
	if (!context.mentionInbox) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The mention directory is unavailable. Reconnect to retry."));
		return;
	}
	await context.mentionInbox.mentionable(client, params, (result) => {
		respond(result.ok, result.ok ? result.value : void 0, result.ok ? void 0 : result.error);
	});
} };
//#endregion
export { usersMentionableHandlers };
