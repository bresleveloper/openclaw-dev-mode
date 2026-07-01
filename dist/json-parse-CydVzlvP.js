import { parse } from "partial-json";
//#region src/llm/utils/json-parse.ts
const VALID_JSON_ESCAPES = new Set([
	"\"",
	"\\",
	"/",
	"b",
	"f",
	"n",
	"r",
	"t",
	"u"
]);
const JSON_CONTROL_ESCAPES = new Set([
	"b",
	"f",
	"n",
	"r",
	"t"
]);
function isControlCharacter(char) {
	const codePoint = char.codePointAt(0);
	return codePoint !== void 0 && codePoint >= 0 && codePoint <= 31;
}
function escapeControlCharacter(char) {
	switch (char) {
		case "\b": return "\\b";
		case "\f": return "\\f";
		case "\n": return "\\n";
		case "\r": return "\\r";
		case "	": return "\\t";
		default: return `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`;
	}
}
/**
* Repairs malformed JSON string literals by:
* - escaping raw control characters inside strings
* - doubling backslashes before invalid escape characters
*/
function repairJson(json) {
	let repaired = "";
	let inString = false;
	let stringValuePrefix = "";
	for (let index = 0; index < json.length; index++) {
		const char = json[index];
		if (!inString) {
			repaired += char;
			if (char === "\"") {
				inString = true;
				stringValuePrefix = "";
			}
			continue;
		}
		if (char === "\"") {
			repaired += char;
			inString = false;
			stringValuePrefix = "";
			continue;
		}
		if (char === "\\") {
			const nextChar = json[index + 1];
			if (nextChar === void 0) {
				repaired += "\\\\";
				continue;
			}
			if (nextChar === "u") {
				const unicodeDigits = json.slice(index + 2, index + 6);
				if (/^[0-9a-fA-F]{4}$/.test(unicodeDigits)) {
					repaired += `\\u${unicodeDigits}`;
					stringValuePrefix += `\\u${unicodeDigits}`;
					index += 5;
					continue;
				}
				repaired += "\\\\";
				stringValuePrefix += "\\";
				continue;
			}
			if (JSON_CONTROL_ESCAPES.has(nextChar) && looksLikeWindowsPathPrefix(stringValuePrefix)) {
				repaired += "\\\\";
				stringValuePrefix += "\\";
				continue;
			}
			if (VALID_JSON_ESCAPES.has(nextChar)) {
				repaired += `\\${nextChar}`;
				stringValuePrefix += nextChar === "\\" ? "\\" : `\\${nextChar}`;
				index += 1;
				continue;
			}
			repaired += "\\\\";
			stringValuePrefix += "\\";
			continue;
		}
		repaired += isControlCharacter(char) ? escapeControlCharacter(char) : char;
		stringValuePrefix += char;
	}
	return repaired;
}
function parseJsonWithRepair(json) {
	const repairedJson = repairJson(json);
	if (repairedJson !== json) return JSON.parse(repairedJson);
	return JSON.parse(json);
}
function looksLikeWindowsPathPrefix(prefix) {
	const tail = prefix.slice(-160);
	return /(?:^|[^A-Za-z0-9])[A-Za-z]:(?:[\\/][^"\\/:*?<>|\r\n]*)*$/.test(tail);
}
function asStreamingJsonRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
/**
* Attempts to parse potentially incomplete JSON during streaming.
* Always returns a valid object, even if the JSON is incomplete.
*
* @param partialJson The partial JSON string from streaming
* @returns Parsed object or empty object if parsing fails
*/
function parseStreamingJson(partialJson) {
	if (!partialJson || partialJson.trim() === "") return {};
	try {
		return asStreamingJsonRecord(parseJsonWithRepair(partialJson));
	} catch {
		try {
			return asStreamingJsonRecord(parse(partialJson));
		} catch {
			try {
				return asStreamingJsonRecord(parse(repairJson(partialJson)));
			} catch {
				return {};
			}
		}
	}
}
//#endregion
export { parseStreamingJson as n, parseJsonWithRepair as t };
