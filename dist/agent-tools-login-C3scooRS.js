import { h as readPositiveIntegerParam } from "./common-DWyiui3y.js";
import { a as optionalPositiveIntegerSchema } from "./typebox-B_TbP7xZ.js";
import "./channel-actions-BCdRlnH7.js";
import { n as waitForWebLogin, t as startWebLoginWithQr } from "./login-qr-runtime-DJT6RFyu.js";
import "./login-qr-api-CKB89e2H.js";
import { Type } from "typebox";
//#region extensions/whatsapp/src/agent-tools-login.ts
const QR_DATA_URL_MAX_LENGTH = 16384;
function readOptionalString(value) {
	return typeof value === "string" && value.trim() ? value : void 0;
}
function createWhatsAppLoginTool() {
	return {
		label: "WhatsApp Login",
		name: "whatsapp_login",
		description: "Generate a WhatsApp QR code for linking, or wait for the scan to complete.",
		parameters: Type.Object({
			action: Type.Unsafe({
				type: "string",
				enum: ["start", "wait"]
			}),
			timeoutMs: optionalPositiveIntegerSchema(),
			force: Type.Optional(Type.Boolean()),
			accountId: Type.Optional(Type.String()),
			currentQrDataUrl: Type.Optional(Type.String({
				maxLength: QR_DATA_URL_MAX_LENGTH,
				pattern: "^data:image/png;base64,"
			}))
		}),
		execute: async (_toolCallId, args) => {
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
			const accountId = readOptionalString(args.accountId);
			const timeoutMs = readPositiveIntegerParam(args, "timeoutMs");
			if (action === "wait") {
				const result = await waitForWebLogin({
					accountId,
					timeoutMs,
					currentQrDataUrl: readOptionalString(args.currentQrDataUrl)
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
			const result = await startWebLoginWithQr({
				accountId,
				timeoutMs,
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
//#endregion
export { createWhatsAppLoginTool as t };
