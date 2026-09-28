import { startWebLoginWithQr, waitForWebLogin } from "../login-qr-runtime.js";
import "../login-qr-api.js";
import { optionalPositiveIntegerSchema, readPositiveIntegerParam } from "openclaw/plugin-sdk/channel-actions";
import { hasNonEmptyString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Type } from "typebox";
//#region extensions/whatsapp/src/agent-tools-login.ts
const QR_DATA_URL_MAX_LENGTH = 16384;
function readLoginStringPreservingWhitespace(value) {
	return hasNonEmptyString(value) ? value : void 0;
}
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
			const renderQrReply = (params) => {
				return {
					content: [{
						type: "text",
						text: [
							params.message,
							"",
							"Open WhatsApp → Linked Devices and scan:",
							"",
							`![whatsapp-qr](${params.qrDataUrl})`
						].join("\n")
					}],
					details: {
						connected: params.connected ?? false,
						qr: true
					}
				};
			};
			const action = args?.action ?? "start";
			const accountId = readLoginStringPreservingWhitespace(args.accountId);
			const timeoutMs = readPositiveIntegerParam(args, "timeoutMs");
			if (action === "wait") {
				const result = await waitForWebLogin({
					accountId,
					timeoutMs,
					currentQrDataUrl: readLoginStringPreservingWhitespace(args.currentQrDataUrl)
				});
				if (result.qrDataUrl) return renderQrReply({
					message: result.message,
					qrDataUrl: result.qrDataUrl,
					connected: result.connected
				});
				return {
					content: [{
						type: "text",
						text: result.message
					}],
					details: { connected: result.connected }
				};
			}
			await beforeCredentialPersistence();
			const result = await startWebLoginWithQr({
				accountId,
				timeoutMs,
				beforeCredentialPersistence,
				force: typeof args.force === "boolean" ? args.force : false
			});
			if (!result.qrDataUrl) return {
				content: [{
					type: "text",
					text: result.message
				}],
				details: { qr: false }
			};
			return renderQrReply({
				message: result.message,
				qrDataUrl: result.qrDataUrl,
				connected: result.connected
			});
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
