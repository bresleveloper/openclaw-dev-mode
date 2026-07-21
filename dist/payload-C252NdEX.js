//#region packages/tool-call-repair/src/grammar.ts
/** Legacy marker some models emit after a serialized JSON tool request. */
const END_TOOL_REQUEST = "[END_TOOL_REQUEST]";
/** Accepts either a complete literal or a still-streaming prefix of that literal. */
function matchesLiteralPrefix(text, literal) {
	return literal.startsWith(text) || text.startsWith(literal);
}
/** Tool names in bracket/plain-text repairs intentionally match provider-safe ids only. */
function isPlainTextToolNameChar(char) {
	return Boolean(char && /[A-Za-z0-9_-]/.test(char));
}
/** XML-ish function tags allow namespace punctuation used by some model families. */
function isXmlishNameChar(char) {
	return Boolean(char && /[A-Za-z0-9_.:-]/.test(char));
}
/** Skips spaces and tabs only, preserving line boundaries for grammar decisions. */
function skipHorizontalWhitespace(text, start) {
	let index = start;
	while (index < text.length && (text[index] === " " || text[index] === "	")) index += 1;
	return index;
}
/** Skips all JavaScript whitespace when line structure is no longer meaningful. */
function skipWhitespace(text, start) {
	let index = start;
	while (index < text.length && /\s/.test(text[index] ?? "")) index += 1;
	return index;
}
/** Consumes either Unix or Windows line endings and returns the first offset after them. */
function consumeLineBreak(text, start) {
	if (text[start] === "\r") return text[start + 1] === "\n" ? start + 2 : start + 1;
	if (text[start] === "\n") return start + 1;
	return null;
}
/** Finds the exclusive end offset of a balanced JSON object starting at `start`. */
function findJsonObjectEnd(text, start, maxPayloadBytes) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let index = start; index < text.length; index += 1) {
		if (maxPayloadBytes !== void 0 && index + 1 - start > maxPayloadBytes) return null;
		const char = text[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
			continue;
		}
		if (char === "\"") {
			inString = true;
			continue;
		}
		if (char === "{") {
			depth += 1;
			continue;
		}
		if (char === "}") {
			depth -= 1;
			if (depth === 0) return index + 1;
		}
	}
	return null;
}
/** Consumes one optional line break after a repaired serialized tool-call fragment. */
function skipSerializedToolCallTrailingLineBreak(text, cursor) {
	return consumeLineBreak(text, cursor) ?? cursor;
}
/** Accepts the legacy closing markers models append after JSON tool-call payloads. */
function consumeJsonToolClosingMarker(text, cursor) {
	let markerStart = cursor;
	while (markerStart < text.length && /\s/.test(text[markerStart] ?? "")) markerStart += 1;
	const rest = text.slice(markerStart);
	if (rest.startsWith("[END_TOOL_REQUEST]")) return skipSerializedToolCallTrailingLineBreak(text, markerStart + 18);
	const bracketClose = /^\[\/[A-Za-z0-9_-]+\]/.exec(rest);
	if (bracketClose) return skipSerializedToolCallTrailingLineBreak(text, markerStart + bracketClose[0].length);
	if (rest.startsWith("<|call|>")) return skipSerializedToolCallTrailingLineBreak(text, markerStart + 8);
	return skipSerializedToolCallTrailingLineBreak(text, cursor);
}
/** Finds JSON after bracketed tool syntax such as `[tool_name]\n{...}`. */
function findBracketedJsonPayloadStart(text) {
	if (!text.startsWith("[")) return null;
	const close = text.indexOf("]");
	if (close === -1) return null;
	let cursor = close + 1;
	cursor = skipHorizontalWhitespace(text, cursor);
	cursor = skipSerializedToolCallTrailingLineBreak(text, cursor);
	cursor = skipHorizontalWhitespace(text, cursor);
	return text[cursor] === "{" ? cursor : null;
}
/** Finds JSON after Harmony channel/tool headers while tolerating optional message markers. */
function findHarmonyJsonPayloadStart(text) {
	let cursor = 0;
	if (text.startsWith("<|channel|>")) cursor = 11;
	const rest = text.slice(cursor);
	const channel = [
		"commentary",
		"analysis",
		"final"
	].find((candidate) => rest.startsWith(candidate));
	if (!channel) return null;
	cursor += channel.length;
	cursor = skipHorizontalWhitespace(text, cursor);
	if (!text.slice(cursor).startsWith("to=")) return null;
	cursor += 3;
	const nameStart = cursor;
	while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
	if (cursor === nameStart) return null;
	cursor = skipHorizontalWhitespace(text, cursor);
	if (!text.slice(cursor).startsWith("code")) return null;
	cursor += 4;
	cursor = skipWhitespace(text, cursor);
	if (text.slice(cursor).startsWith("<|message|>")) cursor = skipWhitespace(text, cursor + 11);
	return text[cursor] === "{" ? cursor : null;
}
/** Case-insensitive marker compare for ASCII protocol tags without locale rules. */
function startsWithAsciiMarkerIgnoreCase(text, cursor, marker) {
	return text.slice(cursor, cursor + marker.length).toLowerCase() === marker;
}
/** Case-insensitive marker search for ASCII protocol tags without allocating regexes. */
function indexOfAsciiMarkerIgnoreCase(text, marker, start) {
	let cursor = start;
	while (cursor < text.length) {
		const next = text.indexOf(marker[0] ?? "", cursor);
		if (next === -1) return -1;
		if (startsWithAsciiMarkerIgnoreCase(text, next, marker)) return next;
		cursor = next + 1;
	}
	return -1;
}
/** Returns the end offset for a complete XML-ish or bracketed plain-text tool call. */
function findXmlishToolCallEnd(text) {
	let cursor;
	const xmlFunction = /^<function=[A-Za-z0-9_.:-]+>/i.exec(text);
	if (xmlFunction) cursor = xmlFunction[0].length;
	else {
		const bracketed = /^\[(?:tool:)?[A-Za-z0-9_-]+\]/.exec(text);
		if (!bracketed) return null;
		cursor = bracketed[0].length;
		cursor = skipHorizontalWhitespace(text, cursor);
		cursor = skipSerializedToolCallTrailingLineBreak(text, cursor);
	}
	cursor = skipWhitespace(text, cursor);
	if (!startsWithAsciiMarkerIgnoreCase(text, cursor, "<parameter=")) return null;
	while (cursor < text.length) {
		const parameterClose = indexOfAsciiMarkerIgnoreCase(text, "</parameter>", cursor);
		if (parameterClose === -1) return null;
		cursor = skipWhitespace(text, parameterClose + 12);
		if (startsWithAsciiMarkerIgnoreCase(text, cursor, "</function>")) return skipSerializedToolCallTrailingLineBreak(text, cursor + 11);
		if (!startsWithAsciiMarkerIgnoreCase(text, cursor, "<parameter=")) return skipSerializedToolCallTrailingLineBreak(text, cursor);
	}
	return null;
}
//#endregion
//#region packages/tool-call-repair/src/payload.ts
const DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES = 256e3;
function parseBracketOpening(text, start) {
	if (text[start] !== "[") return null;
	let cursor = start + 1;
	if (text.startsWith("tool:", cursor)) {
		cursor += 5;
		const nameStart = cursor;
		while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
		if (cursor === nameStart || text[cursor] !== "]") return null;
		return {
			allowsOptionalXmlishClose: true,
			end: cursor + 1,
			name: text.slice(nameStart, cursor),
			requiresClosing: false
		};
	}
	const nameStart = cursor;
	while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
	if (cursor === nameStart || text[cursor] !== "]") return null;
	const name = text.slice(nameStart, cursor);
	cursor += 1;
	cursor = skipHorizontalWhitespace(text, cursor);
	const afterLineBreak = consumeLineBreak(text, cursor);
	if (afterLineBreak === null) return null;
	return {
		end: afterLineBreak,
		name,
		requiresClosing: true
	};
}
function parseHarmonyOpening(text, start) {
	let cursor = start;
	if (text.startsWith("<|channel|>", cursor)) cursor += 11;
	const channelStart = cursor;
	while (/[A-Za-z_]/.test(text[cursor] ?? "")) cursor += 1;
	const channel = text.slice(channelStart, cursor);
	if (channel !== "commentary" && channel !== "analysis" && channel !== "final") return null;
	cursor = skipHorizontalWhitespace(text, cursor);
	if (!text.startsWith("to=", cursor)) return null;
	cursor += 3;
	const nameStart = cursor;
	while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
	if (cursor === nameStart) return null;
	const name = text.slice(nameStart, cursor);
	cursor = skipHorizontalWhitespace(text, cursor);
	if (!text.startsWith("code", cursor)) return null;
	cursor += 4;
	cursor = skipWhitespace(text, cursor);
	if (text.startsWith("<|message|>", cursor)) cursor = skipWhitespace(text, cursor + 11);
	return {
		end: cursor,
		name,
		requiresClosing: false
	};
}
function parseXmlishFunctionOpening(text, start) {
	const match = /^<function=([A-Za-z0-9_.:-]{1,120})>\s*/i.exec(text.slice(start));
	if (!match?.[1]) return null;
	return {
		end: start + match[0].length,
		name: match[1],
		requiresClosing: false
	};
}
function parseOpening(text, start) {
	return parseBracketOpening(text, start) ?? parseHarmonyOpening(text, start);
}
function consumeJsonObject(text, start, maxPayloadBytes) {
	const cursor = skipWhitespace(text, start);
	if (text[cursor] !== "{") return null;
	const end = findJsonObjectEnd(text, cursor, maxPayloadBytes);
	if (end === null) return null;
	const rawJson = text.slice(cursor, end);
	try {
		const parsed = JSON.parse(rawJson);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		return {
			end,
			value: parsed
		};
	} catch {
		return null;
	}
}
function parseClosing(text, start, name) {
	const cursor = skipWhitespace(text, start);
	if (text.startsWith("[END_TOOL_REQUEST]", cursor)) return cursor + 18;
	const namedClosing = `[/${name}]`;
	if (text.startsWith(namedClosing, cursor)) return cursor + namedClosing.length;
	return null;
}
function parseOptionalHarmonyClosing(text, start) {
	const cursor = skipWhitespace(text, start);
	if (text.startsWith("<|call|>", cursor)) return cursor + 8;
	return start;
}
function parsePlainTextToolCallBlockAt(text, start, options) {
	const opening = parseOpening(text, start);
	if (!opening) return null;
	const allowedToolNames = options?.allowedToolNames ? new Set(options.allowedToolNames) : void 0;
	if (allowedToolNames && !allowedToolNames.has(opening.name)) return null;
	const payload = consumeJsonObject(text, opening.end, options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES);
	if (!payload) return null;
	const closingEnd = opening.requiresClosing ? parseClosing(text, payload.end, opening.name) : parseOptionalHarmonyClosing(text, payload.end);
	if (closingEnd === null) return null;
	return {
		arguments: payload.value,
		end: closingEnd,
		name: opening.name,
		raw: text.slice(start, closingEnd),
		start
	};
}
function findXmlishParameterBlock(text, start) {
	const cursor = skipWhitespace(text, start);
	const openMatch = /^<parameter=([A-Za-z0-9_.:-]{1,120})>/i.exec(text.slice(cursor));
	if (!openMatch?.[1]) return null;
	const payloadStart = cursor + openMatch[0].length;
	const closeMatch = /<\/parameter>/i.exec(text.slice(payloadStart));
	if (!closeMatch) return null;
	const closeStart = payloadStart + closeMatch.index;
	return {
		closeStart,
		end: closeStart + closeMatch[0].length,
		name: openMatch[1],
		payloadStart,
		start: cursor
	};
}
function consumeXmlishParameterBlock(text, start, maxPayloadBytes) {
	const bounds = findXmlishParameterBlock(text, start);
	if (!bounds) return null;
	if (bounds.end - bounds.start > maxPayloadBytes) return null;
	return {
		end: bounds.end,
		name: bounds.name,
		value: extractXmlishParameterValue(text, bounds.payloadStart, bounds.closeStart)
	};
}
function extractXmlishParameterValue(text, start, end) {
	let payloadStart = start;
	let payloadEnd = end;
	const afterOpeningLineBreak = consumeLineBreak(text, payloadStart);
	if (afterOpeningLineBreak !== null) {
		payloadStart = afterOpeningLineBreak;
		if (payloadEnd > payloadStart && text[payloadEnd - 1] === "\n") {
			payloadEnd -= 1;
			if (payloadEnd > payloadStart && text[payloadEnd - 1] === "\r") payloadEnd -= 1;
		} else if (payloadEnd > payloadStart && text[payloadEnd - 1] === "\r") payloadEnd -= 1;
	}
	return text.slice(payloadStart, payloadEnd);
}
function consumeXmlishFunctionClose(text, start) {
	const cursor = skipWhitespace(text, start);
	return text.slice(cursor).toLowerCase().startsWith("</function>") ? cursor + 11 : null;
}
function consumeOptionalXmlishFunctionClose(text, start) {
	return consumeXmlishFunctionClose(text, start) ?? start;
}
function parseXmlishPlainTextToolCallBlockEndAt(text, start) {
	const opening = parseXmlishOpening(text, start);
	if (!opening) return null;
	let cursor = opening.end;
	let parameterCount = 0;
	while (true) {
		const parameter = findXmlishParameterBlock(text, cursor);
		if (!parameter) break;
		parameterCount += 1;
		cursor = parameter.end;
	}
	if (parameterCount === 0) return null;
	return opening.allowsOptionalXmlishClose ? consumeOptionalXmlishFunctionClose(text, cursor) : consumeXmlishFunctionClose(text, cursor);
}
function parseXmlishOpening(text, start) {
	return parseBracketOpening(text, start) ?? parseXmlishFunctionOpening(text, start);
}
function parseXmlishPlainTextToolCallBlockAt(text, start, options) {
	const opening = parseXmlishOpening(text, start);
	if (!opening) return null;
	const allowedToolNames = options?.allowedToolNames ? new Set(options.allowedToolNames) : void 0;
	if (allowedToolNames && !allowedToolNames.has(opening.name)) return null;
	const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
	const args = {};
	let cursor = opening.end;
	let parameterCount = 0;
	while (true) {
		const parameter = consumeXmlishParameterBlock(text, cursor, maxPayloadBytes);
		if (!parameter) break;
		if (parameter.end - opening.end > maxPayloadBytes) return null;
		args[parameter.name] = parameter.value;
		parameterCount += 1;
		cursor = parameter.end;
	}
	if (parameterCount === 0) return null;
	const end = opening.allowsOptionalXmlishClose ? consumeOptionalXmlishFunctionClose(text, cursor) : consumeXmlishFunctionClose(text, cursor);
	if (end === null) return null;
	return {
		arguments: args,
		end,
		name: opening.name,
		raw: text.slice(start, end),
		start
	};
}
function parseStandalonePlainTextToolCallBlocks(text, options) {
	const blocks = [];
	let cursor = skipWhitespace(text, 0);
	while (cursor < text.length) {
		const block = parsePlainTextToolCallBlockAt(text, cursor, options) ?? parseXmlishPlainTextToolCallBlockAt(text, cursor, options);
		if (!block) return null;
		blocks.push(block);
		cursor = skipWhitespace(text, block.end);
	}
	return blocks.length > 0 ? blocks : null;
}
/** Removes full-line standalone plain-text tool-call blocks from user-visible text. */
function stripPlainTextToolCallBlocks(text) {
	if (!text || !/\[(?:tool:)?[A-Za-z0-9_-]+\]/.test(text) && !/(?:^|\n)\s*(?:<\|channel\|>)?(?:commentary|analysis|final)\s+to=/.test(text) && !/(?:^|\n)\s*<function=[A-Za-z0-9_.:-]{1,120}>/i.test(text)) return text;
	let result = "";
	let cursor = 0;
	let index = 0;
	while (index < text.length) {
		if (!(index === 0 || text[index - 1] === "\n")) {
			index += 1;
			continue;
		}
		const blockStart = skipHorizontalWhitespace(text, index);
		const blockEnd = parsePlainTextToolCallBlockAt(text, blockStart)?.end ?? parseXmlishPlainTextToolCallBlockEndAt(text, blockStart);
		if (blockEnd === null) {
			index += 1;
			continue;
		}
		result += text.slice(cursor, index);
		cursor = blockEnd;
		const afterBlockLineBreak = consumeLineBreak(text, cursor);
		if (afterBlockLineBreak !== null) cursor = afterBlockLineBreak;
		index = cursor;
	}
	result += text.slice(cursor);
	return result;
}
//#endregion
export { findBracketedJsonPayloadStart as a, findXmlishToolCallEnd as c, matchesLiteralPrefix as d, consumeJsonToolClosingMarker as i, isPlainTextToolNameChar as l, stripPlainTextToolCallBlocks as n, findHarmonyJsonPayloadStart as o, END_TOOL_REQUEST as r, findJsonObjectEnd as s, parseStandalonePlainTextToolCallBlocks as t, isXmlishNameChar as u };
