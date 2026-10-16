import { u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { l as resolveInputFileLimits } from "./input-files-WhF8P9vt.mjs";
//#region src/media-understanding/file-extraction-limits.ts
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB = 20;
const INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP = 26214400;
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES = 20;
const INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP = 150;
function resolveInboundFileExtractionMaxBytes(defaults) {
	const maxMb = asPositiveFiniteNumber(defaults?.mediaMaxMb) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB;
	return Math.min(Math.floor(maxMb * 1024 * 1024), INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP);
}
function resolveInboundFileExtractionMaxPages(defaults) {
	const pages = asPositiveFiniteNumber(defaults?.pdfMaxPages) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES;
	return Math.min(Math.trunc(pages), INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP);
}
/** Builds inbound attachment extraction limits, sized to the agent's media/PDF config. */
function resolveFileExtractionLimits(cfg) {
	const files = cfg.gateway?.http?.endpoints?.responses?.files;
	const allowedMimesConfigured = Boolean(files?.allowedMimes?.length);
	const defaults = cfg.agents?.defaults;
	const inboundFiles = {
		...files,
		maxBytes: files?.maxBytes ?? resolveInboundFileExtractionMaxBytes(defaults),
		pdf: {
			...files?.pdf,
			maxPages: files?.pdf?.maxPages ?? resolveInboundFileExtractionMaxPages(defaults)
		}
	};
	return {
		...resolveInputFileLimits(inboundFiles),
		allowedMimesConfigured
	};
}
//#endregion
export { resolveFileExtractionLimits as t };
