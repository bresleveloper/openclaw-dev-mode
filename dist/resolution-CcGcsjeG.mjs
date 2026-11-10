import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
//#region src/image-generation/resolution.ts
function normalizeImageGenerationResolution(raw) {
	const normalized = raw?.trim().toUpperCase();
	if (!normalized) return;
	if (normalized === "1K" || normalized === "2K" || normalized === "4K") return normalized;
	throw new ToolInputError("resolution must be one of 1K, 2K, or 4K");
}
//#endregion
export { normalizeImageGenerationResolution as t };
