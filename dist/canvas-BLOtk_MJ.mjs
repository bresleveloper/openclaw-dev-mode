import { N as validateCanvasDocumentPreviewParams, P as validateCanvasDocumentViewParams } from "./src-l2dWvEsN.mjs";
import { d as isGatewaySubordinateWorkAdmissionClosed } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { a as WIDGET_HTML_MAX_UTF8_BYTES } from "./canvas-CTYLqV3I.mjs";
import { r as buildSandboxHostPath } from "./sandbox-host-BRz3YO81.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as readCanvasDocumentHtmlSource } from "./documents-CFQyKfP2.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-_RMQn10s.mjs";
import { n as buildBoardWidgetSandboxPath } from "./board-sandbox-Ca0D_WuE.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/canvas.ts
const CANVAS_WIDGET_UNAVAILABLE = "Canvas widget unavailable; reload the chat or ask the agent to recreate it.";
const CANVAS_PREVIEW_UNAVAILABLE = "Canvas preview unavailable; reload the file preview and try again.";
/** Both stored widgets and caller-owned previews use the same live isolated host. */
async function respondWithCanvasHtml(invocation, readHtml, unavailableMessage, sandboxUrl) {
	const { context, client, respond } = invocation;
	const resolveContext = context.resolveGatewayContext;
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const assertActive = () => {
		invocation.signal?.throwIfAborted();
		invocation.sessionMutationCommitGuard?.();
		if (!resolveContext || resolveContext() !== context || context.resolveGatewayContext !== resolveContext || context.getGatewayMethodRegistry?.() !== methodRegistry || client?.invalidated === true || client?.connId && context.isConnectionActive?.(client.connId) === false || isGatewaySubordinateWorkAdmissionClosed() || !isCoreCanvasHostEnabled(context.getRuntimeConfig())) throw new Error(unavailableMessage);
	};
	try {
		assertActive();
		const [html, sandboxPort] = await Promise.all([readHtml(), context.getMcpAppSandboxPort?.() ?? context.ensureSandboxHostPort?.()]);
		assertActive();
		if (sandboxPort === void 0) throw new Error(unavailableMessage);
		const configuredOrigin = context.getRuntimeConfig().mcp?.apps?.sandboxOrigin;
		respond(true, {
			html,
			sandboxUrl,
			sandboxPort,
			...configuredOrigin ? { sandboxOrigin: new URL(configuredOrigin).origin } : {}
		});
	} catch {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, unavailableMessage));
	}
}
const canvasHandlers = {
	"canvas.document.view": defineValidatedGatewayMethod("canvas.document.view", validateCanvasDocumentViewParams, (invocation) => respondWithCanvasHtml(invocation, async () => {
		const document = await readCanvasDocumentHtmlSource(invocation.params.docId, { maxBytes: WIDGET_HTML_MAX_UTF8_BYTES });
		if (document.cspSandbox !== "scripts" || Buffer.byteLength(document.html, "utf8") > 10485760) throw new Error(CANVAS_WIDGET_UNAVAILABLE);
		return document.html;
	}, CANVAS_WIDGET_UNAVAILABLE, buildBoardWidgetSandboxPath({ grantState: "none" }))),
	"canvas.document.preview": defineValidatedGatewayMethod("canvas.document.preview", validateCanvasDocumentPreviewParams, async (invocation) => {
		const { html } = invocation.params;
		if (Buffer.byteLength(html, "utf8") > 2097152) {
			invocation.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid canvas.document.preview params: html must not exceed 2 MiB of UTF-8 data"));
			return;
		}
		await respondWithCanvasHtml(invocation, () => html, CANVAS_PREVIEW_UNAVAILABLE, buildSandboxHostPath({ blockDescendantFrames: true }));
	})
};
//#endregion
export { canvasHandlers };
