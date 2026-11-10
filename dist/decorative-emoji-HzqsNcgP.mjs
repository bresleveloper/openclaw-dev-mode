import { r as splitGraphemes } from "./ansi-Xy3t0ZdY.mjs";
//#region packages/terminal-core/src/decorative-emoji.ts
const EMOJI_GRAPHEME_PATTERN = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u;
/** Detect terminals with known emoji rendering support. */
function isKnownEmojiTerminal(env) {
	const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
	const term = (env.TERM ?? "").toLowerCase();
	return termProgram.includes("iterm") || termProgram.includes("apple_terminal") || termProgram.includes("ghostty") || termProgram.includes("wezterm") || termProgram.includes("vscode") || term.includes("ghostty") || term.includes("wezterm") || Boolean(env.WT_SESSION);
}
/** Return true when locale variables indicate UTF-8 output support. */
function hasUtf8Locale(env) {
	const locale = [
		env.LC_ALL,
		env.LC_CTYPE,
		env.LANG
	].find((value) => typeof value === "string" && value.trim().length > 0);
	if (!locale) return true;
	return /utf-?8/i.test(locale);
}
/** Return true when decorative emoji should be emitted for the target terminal. */
function supportsDecorativeEmoji(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	return options.isTty ?? process.stdout.isTTY ? (env.TERM ?? "").toLowerCase() !== "dumb" && hasUtf8Locale(env) && (isKnownEmojiTerminal(env) || platform === "darwin") : false;
}
/** Return the emoji only when decorative emoji output is supported. */
function decorativeEmoji(emoji, options = {}) {
	return supportsDecorativeEmoji(options) ? emoji : "";
}
/** Prefix text with a decorative emoji when supported. */
function decorativePrefix(emoji, text, options = {}) {
	const prefix = decorativeEmoji(emoji, options);
	return prefix ? `${prefix} ${text}` : text;
}
/** Strip decorative emoji for terminals that should not receive them. */
function stripDecorativeEmojiForTerminal(text, options = {}) {
	if (supportsDecorativeEmoji(options)) return text;
	return splitGraphemes(text).filter((grapheme) => !EMOJI_GRAPHEME_PATTERN.test(grapheme)).join("").replace(/\s{2,}/g, " ").trim();
}
//#endregion
export { supportsDecorativeEmoji as i, decorativePrefix as n, stripDecorativeEmojiForTerminal as r, decorativeEmoji as t };
