import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { M as validateCanvasDocumentPreviewParams, N as validateCanvasDocumentViewParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { d as isGatewaySubordinateWorkAdmissionClosed } from "./gateway-work-admission-CHv_0noy.mjs";
import { r as buildSandboxHostPath } from "./sandbox-host-BqeXhFy-.mjs";
import { n as readCanvasDocumentHtmlSource } from "./documents-KvEUOxC1.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-VMD9Rb60.mjs";
import { n as buildBoardWidgetSandboxPath } from "./board-sandbox-r8hAxy77.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/canvas.ts
const CANVAS_WIDGET_VIEW_MAX_BYTES = 2097152;
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
		const document = await readCanvasDocumentHtmlSource(invocation.params.docId, { maxBytes: CANVAS_WIDGET_VIEW_MAX_BYTES });
		if (document.cspSandbox !== "scripts" || Buffer.byteLength(document.html, "utf8") > CANVAS_WIDGET_VIEW_MAX_BYTES) throw new Error(CANVAS_WIDGET_UNAVAILABLE);
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
