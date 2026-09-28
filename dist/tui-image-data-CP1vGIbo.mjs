import "./image-processor-config-StN3hXY9.mjs";
import { p as createImageProcessor, u as readImageMetadataFromHeader } from "./image-ops-CU4vxSlO.mjs";
//#region src/tui/tui-image-data.ts
const TUI_IMAGE_MAX_BYTES = 12582912;
const TUI_IMAGE_MAX_SIDE = 300;
function decodeTuiImageData(source) {
	if (!source.startsWith("data:")) return;
	if (source.length > Math.ceil(4194304) * 4 + 100) throw new Error("Image exceeds the preview byte limit");
	const match = /^data:image\/(?:png|jpeg|gif|webp);base64,([A-Za-z0-9+/]*={0,2})$/i.exec(source);
	if (!match?.[1]) throw new Error("Unsupported inline image");
	return Buffer.from(match[1], "base64");
}
async function prepareTuiImage(buffer, signal) {
	signal.throwIfAborted();
	if (buffer.byteLength > 12582912) throw new Error("Image exceeds the preview byte limit");
	const dimensions = readImageMetadataFromHeader(buffer);
	if (!dimensions || dimensions.width * dimensions.height > 25e6) throw new Error("Unsupported image or image exceeds the preview pixel limit");
	const { data } = await createImageProcessor().encode(buffer, {
		format: "png",
		resize: {
			maxSide: TUI_IMAGE_MAX_SIDE,
			enlarge: false
		},
		compressionLevel: 8,
		signal
	});
	signal.throwIfAborted();
	if (data.byteLength > 12582912) throw new Error("Image exceeds the preview byte limit");
	return {
		data: data.toString("base64"),
		mimeType: "image/png"
	};
}
//#endregion
export { decodeTuiImageData as n, prepareTuiImage as r, TUI_IMAGE_MAX_BYTES as t };
