import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { l as resolveInputFileLimits } from "./input-files-BWC1h4-H.mjs";
//#region src/media-understanding/file-extraction-limits.ts
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB = 20;
const INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP = 26214400;
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES = 20;
const INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP = 150;
function resolveFileExtractionLimits(cfg) {
	const files = cfg.gateway?.http?.endpoints?.responses?.files;
	const allowedMimesConfigured = Boolean(files?.allowedMimes?.length);
	const defaults = cfg.agents?.defaults;
	const maxMb = asPositiveFiniteNumber(defaults?.mediaMaxMb) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB;
	const maxPages = asPositiveFiniteNumber(defaults?.pdfMaxPages) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES;
	const inboundFiles = {
		...files,
		maxBytes: files?.maxBytes ?? Math.min(Math.floor(maxMb * 1024 * 1024), INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP),
		pdf: {
			...files?.pdf,
			maxPages: files?.pdf?.maxPages ?? Math.min(Math.trunc(maxPages), INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP)
		}
	};
	return {
		...resolveInputFileLimits(inboundFiles),
		allowedMimesConfigured
	};
}
//#endregion
export { resolveFileExtractionLimits as t };
