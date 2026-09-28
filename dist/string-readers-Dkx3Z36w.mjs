import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/utils/string-readers.ts
function isStringOption(value, options) {
	return typeof value === "string" && (Array.isArray(options) ? options.includes(value) : options.has(value));
}
function readTrimmedStringAlias(record, keys) {
	for (const key of keys) {
		const value = normalizeOptionalString(record[key]);
		if (value !== void 0) return value;
	}
}
function stripChannelPrefix(value, channelId) {
	if (!value) return;
	for (const prefix of [
		"channel:",
		"chat:",
		"user:"
	]) if (value.startsWith(prefix)) return value.slice(prefix.length);
	const prefix = `${channelId}:`;
	return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
//#endregion
export { readTrimmedStringAlias as n, stripChannelPrefix as r, isStringOption as t };
