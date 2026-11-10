import { startWebLoginWithQr, waitForWebLogin } from "../login-qr-runtime.js";
import "../login-qr-api.js";
import { optionalPositiveIntegerSchema, readPositiveIntegerParam } from "openclaw/plugin-sdk/channel-actions";
import { readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
//#region extensions/whatsapp/src/agent-tools-login.ts
const QR_DATA_URL_MAX_LENGTH = 16384;
var WhatsAppToolInputError = class extends Error {
	constructor(message) {
		super(message);
		this.status = 400;
		this.name = "ToolInputError";
	}
};
function createWhatsAppLoginTool(context) {
	if (context.senderIsOwner !== true) return null;
	return {
		label: "WhatsApp Login",
		name: "whatsapp_login",
		description: "Generate a WhatsApp QR code for linking, or wait for the scan to complete.",
		parameters: Type.Object({
			action: Type.Enum(["start", "wait"], { type: "string" }),
			timeoutMs: optionalPositiveIntegerSchema(),
			force: Type.Optional(Type.Boolean()),
			accountId: Type.Optional(Type.String()),
			currentQrDataUrl: Type.Optional(Type.String({
				maxLength: QR_DATA_URL_MAX_LENGTH,
				pattern: "^data:image/png;base64,.+$"
			}))
		}),
		execute: async (_toolCallId, args, signal) => {
			const beforeCredentialPersistence = async () => {
				context.assertInvocationCurrent?.();
				if (!signal || signal.aborted) throw new Error("WhatsApp login authority is no longer active.");
			};
			const renderReply = (params, noQrDetails) => {
				if (!params.qrDataUrl) return textResult(params.message, noQrDetails);
				const text = [
					params.message,
					"",
					"Open WhatsApp → Linked Devices and scan:",
					"",
					`![whatsapp-qr](${params.qrDataUrl})`
				].join("\n");
				return textResult(text, {
					connected: params.connected ?? false,
					qr: true
				});
			};
			const rawAction = args?.action;
			const action = rawAction === void 0 ? "start" : rawAction;
			if (action !== "start" && action !== "wait") throw new WhatsAppToolInputError("Unknown WhatsApp login action. Expected \"start\" or \"wait\".");
			const accountId = readNonBlankString(args.accountId);
			const timeoutMs = readPositiveIntegerParam(args, "timeoutMs");
			if (action === "wait") {
				const result = await waitForWebLogin({
					accountId,
					timeoutMs,
					currentQrDataUrl: readNonBlankString(args.currentQrDataUrl)
				});
				return renderReply(result, { connected: result.connected });
			}
			await beforeCredentialPersistence();
			return renderReply(await startWebLoginWithQr({
				accountId,
				timeoutMs,
				beforeCredentialPersistence,
				force: typeof args.force === "boolean" ? args.force : false
			}), { qr: false });
		}
	};
}
function registerWhatsAppLoginTool(api) {
	api.registerTool({
		contextVersion: 2,
		create: (context) => createWhatsAppLoginTool(context)
	}, { name: "whatsapp_login" });
}
//#endregion
export { registerWhatsAppLoginTool as n, createWhatsAppLoginTool as t };
