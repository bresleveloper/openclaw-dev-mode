import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/canvas.ts
const CANVAS_DOCUMENT_PREVIEW_MAX_BYTES = 2097152;
const WIDGET_HTML_MAX_UTF8_BYTES = 10485760;
const CanvasDocumentPreviewParamsSchema = closedObject({ html: Type.String({
	maxLength: CANVAS_DOCUMENT_PREVIEW_MAX_BYTES,
	description: "Caller-owned HTML, limited to 2 MiB of UTF-8 data by the Gateway."
}) });
const CanvasDocumentViewParamsSchema = closedObject({ docId: Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^(?!\\.{1,2}$)[A-Za-z0-9._-]+$"
}) });
const CanvasDocumentViewResultSchema = closedObject({
	html: Type.String({ maxLength: WIDGET_HTML_MAX_UTF8_BYTES }),
	sandboxUrl: Type.String(),
	sandboxPort: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	sandboxOrigin: Type.Optional(Type.String())
});
//#endregion
export { WIDGET_HTML_MAX_UTF8_BYTES as a, CanvasDocumentViewResultSchema as i, CanvasDocumentPreviewParamsSchema as n, CanvasDocumentViewParamsSchema as r, CANVAS_DOCUMENT_PREVIEW_MAX_BYTES as t };
