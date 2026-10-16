import { t as isSelfContainedSvg } from "./svg-image-1iOdCRUI.mjs";
//#region packages/gateway-protocol/src/session-agent-status.ts
const SESSION_AGENT_ATTENTION_ICON_IDS = [
	"hand",
	"key",
	"alert",
	"flag",
	"lock",
	"hourglass"
];
const SESSION_COLOR_IDS = [
	"red",
	"blue",
	"green",
	"yellow",
	"purple",
	"orange",
	"pink",
	"cyan"
];
function normalizeSessionColorValue(value) {
	const normalized = value.trim().toLowerCase();
	return SESSION_COLOR_IDS.find((id) => id === normalized) ?? null;
}
const SESSION_ICON_GLYPH_IDS = [
	"braces",
	"book",
	"monitor",
	"bot",
	"kanban",
	"coins"
];
const SESSION_ICON_GLYPH_ID_SET = new Set(SESSION_ICON_GLYPH_IDS);
const SESSION_ICON_SVG_MAX_BYTES = 16384;
const SESSION_ICON_SVG_DATA_URL_PREFIX = "data:image/svg+xml,";
const SVG_DATA_URL_RE = /^data:image\/svg\+xml(?:;charset=utf-8)?(;base64)?,/iu;
function normalizeSessionSvgIcon(value) {
	if (value.length > 49216) return null;
	const dataUrl = SVG_DATA_URL_RE.exec(value);
	let source = value;
	try {
		if (dataUrl) {
			const payload = value.slice(dataUrl[0].length);
			source = dataUrl[1] ? new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(payload), (char) => char.charCodeAt(0))) : decodeURIComponent(payload);
		}
		source = source.trim();
		if (new TextEncoder().encode(source).byteLength > 16384 || !isSelfContainedSvg(source)) return null;
		return `${SESSION_ICON_SVG_DATA_URL_PREFIX}${encodeURIComponent(source)}`;
	} catch {
		return null;
	}
}
let sessionIconRe;
function sessionIconPattern() {
	if (sessionIconRe === void 0) try {
		sessionIconRe = /* @__PURE__ */ new RegExp("^\\p{RGI_Emoji}$", "v");
	} catch {
		sessionIconRe = null;
	}
	return sessionIconRe;
}
function isSingleNonAsciiGrapheme(value) {
	if (value.length > 16 || /^[!-~]$/u.test(value)) return false;
	return [...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(value)].length === 1;
}
function normalizeSessionIconValue(value) {
	const normalized = value.trim();
	if (!normalized) return null;
	if (SESSION_ICON_GLYPH_ID_SET.has(normalized)) return normalized;
	if (normalized.startsWith("<") || /^data:/iu.test(normalized)) return normalizeSessionSvgIcon(normalized);
	const pattern = sessionIconPattern();
	return (pattern ? pattern.test(normalized) : isSingleNonAsciiGrapheme(normalized)) ? normalized : null;
}
//#endregion
export { SESSION_ICON_SVG_MAX_BYTES as a, SESSION_ICON_SVG_DATA_URL_PREFIX as i, SESSION_COLOR_IDS as n, normalizeSessionColorValue as o, SESSION_ICON_GLYPH_IDS as r, normalizeSessionIconValue as s, SESSION_AGENT_ATTENTION_ICON_IDS as t };
