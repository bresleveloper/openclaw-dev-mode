//#region src/infra/unicode-visibility.ts
const INVISIBLE_UNICODE_RE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\u{E0000}-\u{E007F}]/gu;
function stripInvisibleUnicode(text) {
	return text.replace(INVISIBLE_UNICODE_RE, "");
}
//#endregion
export { stripInvisibleUnicode as t };
