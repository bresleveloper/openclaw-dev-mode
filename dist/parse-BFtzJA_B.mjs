import { n as splitMediaOutput } from "./parse-output-DRIp2d_R.mjs";
import { t as findMarkdownImageSpans } from "./image-spans-CfcZ_3i7.mjs";
//#region src/media/parse.ts
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
function splitMediaFromOutput(raw, options = {}) {
	const extractMarkdownImages = options.markdownImageAllowlist !== void 0 || options.extractMarkdownImages === true;
	return splitMediaOutput(raw, options, extractMarkdownImages ? {
		scan: findMarkdownImageSpans,
		allowlist: options.markdownImageAllowlist
	} : void 0);
}
//#endregion
export { splitMediaFromOutput as t };
