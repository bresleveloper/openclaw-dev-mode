import "./src-CdRlGRnW.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { _ as utf8ByteLengthWithinLimit, a as consumeLineBreak, c as isAsciiMarkerPrefixIgnoreCase, d as scanJsonObject, f as scanXmlishToolCall, g as startsWithAsciiMarkerIgnoreCase, h as skipWhitespace, i as HARMONY_MESSAGE_MARKER, l as isPlainTextToolNameChar, m as skipLineIndentation, n as HARMONY_CALL_MARKER, o as consumeStructuralLineBreakAfterHorizontalWhitespace, p as skipHorizontalWhitespace, r as HARMONY_CHANNEL_MARKER, s as indexOfAsciiMarkerIgnoreCase, t as END_TOOL_REQUEST, u as isXmlishNameChar } from "./grammar-CaCTkX_b.mjs";
//#region packages/tool-call-repair/src/contracts.ts
function isOffsetInProtectedRanges(offset, ranges) {
	return ranges.some((range) => offset >= range.start && offset < range.end);
}
//#endregion
//#region packages/tool-call-repair/src/payload.ts
const DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES = 256e3;
const MAX_PLAIN_TEXT_TOOL_NAME_CHARS = 120;
const HARMONY_CHANNELS = [
	"commentary",
	"analysis",
	"final"
];
function isLiteralPrefixAt(text, start, literal) {
	const available = text.length - start;
	return start >= 0 && available < literal.length && literal.startsWith(text.slice(start));
}
function scanToolNameEnd(text, start) {
	let end = start;
	while (isPlainTextToolNameChar(text[end])) {
		if (end - start === MAX_PLAIN_TEXT_TOOL_NAME_CHARS) return null;
		end += 1;
	}
	return end;
}
function candidate(syntax, name, nameComplete, payload, json) {
	return {
		syntax,
		name,
		nameComplete,
		...payload ? { payload } : {},
		...json ? { json } : {}
	};
}
function scanBracketOpening(text, start, structuralLineBreaks) {
	let cursor = start + 1;
	let syntax = "named-bracket";
	if (text.startsWith("tool:", cursor)) {
		syntax = "tool-bracket";
		cursor += 5;
	} else if (isLiteralPrefixAt(text, cursor, "tool:")) return { kind: "prefix" };
	const nameStart = cursor;
	const nameEnd = scanToolNameEnd(text, nameStart);
	if (nameEnd === null) return {
		kind: "invalid",
		at: nameStart + MAX_PLAIN_TEXT_TOOL_NAME_CHARS
	};
	const name = {
		start: nameStart,
		end: nameEnd
	};
	cursor = nameEnd;
	if (cursor === text.length) return {
		kind: "prefix",
		...nameStart === nameEnd ? {} : { candidate: candidate(syntax, name, false) }
	};
	if (nameStart === nameEnd || text[cursor] !== "]") return {
		kind: "invalid",
		at: cursor
	};
	cursor += 1;
	const value = candidate(syntax, name, true);
	if (syntax === "named-bracket") {
		const horizontalEnd = skipHorizontalWhitespace(text, cursor);
		if (horizontalEnd === text.length) return {
			kind: "prefix",
			candidate: value
		};
		const afterLineBreak = consumeStructuralLineBreakAfterHorizontalWhitespace(text, cursor, structuralLineBreaks);
		if (afterLineBreak === null) return {
			kind: "invalid",
			at: horizontalEnd,
			candidate: value
		};
		cursor = afterLineBreak;
	}
	return {
		kind: "complete",
		cursor,
		value
	};
}
function scanHarmonyOpening(text, start) {
	let cursor = start;
	if (text.startsWith("<|channel|>", cursor)) cursor += HARMONY_CHANNEL_MARKER.length;
	else if (isLiteralPrefixAt(text, cursor, "<|channel|>")) return { kind: "prefix" };
	else if (text[cursor] === "<") return {
		kind: "invalid",
		at: cursor
	};
	const channel = HARMONY_CHANNELS.find((value) => text.startsWith(value, cursor));
	if (!channel) return HARMONY_CHANNELS.some((value) => isLiteralPrefixAt(text, cursor, value)) ? { kind: "prefix" } : {
		kind: "invalid",
		at: cursor
	};
	cursor += channel.length;
	if (cursor === text.length) return { kind: "prefix" };
	if (text[cursor] !== " " && text[cursor] !== "	") return {
		kind: "invalid",
		at: cursor
	};
	cursor = skipHorizontalWhitespace(text, cursor);
	if (!text.startsWith("to=", cursor)) return isLiteralPrefixAt(text, cursor, "to=") ? { kind: "prefix" } : {
		kind: "invalid",
		at: cursor
	};
	cursor += 3;
	const nameStart = cursor;
	const nameEnd = scanToolNameEnd(text, nameStart);
	if (nameEnd === null) return {
		kind: "invalid",
		at: nameStart + MAX_PLAIN_TEXT_TOOL_NAME_CHARS
	};
	const name = {
		start: nameStart,
		end: nameEnd
	};
	cursor = nameEnd;
	if (cursor === text.length) return {
		kind: "prefix",
		...nameStart === nameEnd ? {} : { candidate: candidate("harmony", name, false) }
	};
	if (nameStart === nameEnd || text[cursor] !== " " && text[cursor] !== "	") return {
		kind: "invalid",
		at: cursor
	};
	cursor = skipHorizontalWhitespace(text, cursor);
	const value = candidate("harmony", name, true);
	if (!text.startsWith("code", cursor)) return isLiteralPrefixAt(text, cursor, "code") ? {
		kind: "prefix",
		candidate: value
	} : {
		kind: "invalid",
		at: cursor,
		candidate: value
	};
	cursor = skipWhitespace(text, cursor + 4);
	if (text.startsWith("<|message|>", cursor)) cursor = skipWhitespace(text, cursor + HARMONY_MESSAGE_MARKER.length);
	else if (isLiteralPrefixAt(text, cursor, "<|message|>")) return {
		kind: "prefix",
		candidate: value
	};
	else if (text[cursor] === "<") return {
		kind: "invalid",
		at: cursor,
		candidate: value
	};
	return {
		kind: "complete",
		cursor,
		value
	};
}
/** Uncapped structural scan shared by parsing, stripping, and stream buffering. */
function scanPlainTextJsonToolCall(text, start = 0, structuralLineBreaks) {
	const opening = text[start] === "[" ? scanBracketOpening(text, start, structuralLineBreaks) : scanHarmonyOpening(text, start);
	if (opening.kind !== "complete") return opening;
	const value = opening.value;
	const payloadStart = skipWhitespace(text, opening.cursor);
	if (payloadStart === text.length) return {
		kind: "prefix",
		candidate: value
	};
	if (text[payloadStart] !== "{") return {
		kind: "invalid",
		at: payloadStart,
		candidate: value
	};
	const json = scanJsonObject(text, payloadStart);
	const payload = {
		start: payloadStart,
		end: json.end
	};
	if (json.kind === "prefix") return {
		kind: "prefix",
		candidate: candidate(value.syntax, value.name, true, payload, json.state)
	};
	const closingCandidate = candidate(value.syntax, value.name, true, payload, json.state);
	const namedBracket = value.syntax === "named-bracket";
	const closingStart = skipWhitespace(text, json.end);
	if (namedBracket && closingStart === text.length) return {
		kind: "prefix",
		candidate: closingCandidate
	};
	const name = text.slice(value.name.start, value.name.end);
	const closings = namedBracket ? [END_TOOL_REQUEST, `[/${name}]`] : [
		HARMONY_CALL_MARKER,
		END_TOOL_REQUEST,
		`[/${name}]`
	];
	for (const closing of closings) {
		if (text.startsWith(closing, closingStart)) return {
			...value,
			payload,
			kind: "complete",
			end: closingStart + closing.length
		};
		if (closingStart < text.length && isLiteralPrefixAt(text, closingStart, closing)) return {
			kind: "prefix",
			candidate: closingCandidate
		};
	}
	return namedBracket ? {
		kind: "invalid",
		at: closingStart,
		candidate: closingCandidate
	} : {
		...value,
		payload,
		kind: "complete",
		end: json.end
	};
}
/** Classifies one JSON/XML call candidate and provides monotonic scan progress. */
function scanPlainTextToolCall(text, start = 0, options) {
	const xmlish = scanXmlishToolCall(text, start, options?.structuralLineBreaks);
	const json = scanPlainTextJsonToolCall(text, start, options?.structuralLineBreaks);
	const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
	const allowed = (scan) => {
		const value = scan.kind === "complete" ? scan : scan.candidate;
		if (!value) return { accepted: scan.kind === "prefix" };
		const name = text.slice(value.name.start, value.name.end);
		return (value.nameComplete ? options?.matcher?.hasExactName(name) ?? true : options?.matcher?.hasNamePrefix(name) ?? true) ? {
			accepted: true,
			...value.payload ? { payload: value.payload } : {}
		} : { accepted: false };
	};
	const xml = allowed(xmlish);
	const jsonValue = allowed(json);
	const branches = {
		json,
		matches: {
			json: jsonValue.accepted,
			xmlish: xml.accepted
		},
		xmlish
	};
	const overCap = (payload) => Boolean(payload && utf8ByteLengthWithinLimit(text, payload.start, payload.end, maxPayloadBytes) === null);
	const xmlOverCap = overCap(xml.payload);
	const jsonOverCap = overCap(jsonValue.payload);
	if (xml.accepted && xmlish.kind === "complete") return {
		...branches,
		end: xmlish.end,
		kind: "complete",
		next: xmlish.end,
		overCap: xmlOverCap,
		payloadStart: xmlish.payload.start
	};
	if (jsonValue.accepted && json.kind === "complete") {
		if (jsonOverCap || parseJsonArguments(text, json.payload)) return {
			...branches,
			end: json.end,
			kind: "complete",
			next: json.end,
			overCap: jsonOverCap,
			payloadStart: json.payload.start
		};
		return {
			...branches,
			at: json.end,
			kind: "invalid",
			next: json.end,
			overCap: false,
			payloadStart: json.payload.start
		};
	}
	if (xml.accepted && xmlish.kind === "invalid" && xmlOverCap && xml.payload) return {
		...branches,
		at: xmlish.at,
		kind: "invalid",
		next: xmlish.at,
		overCap: true,
		payloadStart: xml.payload.start
	};
	if (jsonValue.accepted && json.kind === "invalid" && jsonOverCap && jsonValue.payload) return {
		...branches,
		at: json.at,
		kind: "invalid",
		next: json.at,
		overCap: true,
		payloadStart: jsonValue.payload.start
	};
	const xmlPrefix = xml.accepted && xmlish.kind === "prefix";
	const jsonPrefix = jsonValue.accepted && json.kind === "prefix";
	if (xmlPrefix || jsonPrefix) {
		const payload = xmlPrefix ? xml.payload : jsonValue.payload;
		return {
			...branches,
			...xmlish.kind === "prefix" && xmlish.completeEnd !== void 0 ? { completeEnd: xmlish.completeEnd } : {},
			kind: "prefix",
			next: text.length,
			overCap: overCap(payload),
			...payload ? { payloadStart: payload.start } : {}
		};
	}
	let next = start + 1;
	if (xml.accepted) next = Math.max(next, xmlish.kind === "invalid" ? xmlish.at : text.length);
	if (jsonValue.accepted) next = Math.max(next, json.kind === "complete" ? json.end : json.kind === "invalid" ? json.at : text.length);
	return {
		...branches,
		at: next,
		kind: "invalid",
		next,
		overCap: false
	};
}
function parseJsonArguments(text, payload) {
	return safeParseJsonRecord(text.slice(payload.start, payload.end)) ?? null;
}
function extractXmlishParameterValue(text, start, end, structuralLineBreaks) {
	let value = text.slice(start, end);
	if (consumeLineBreak(text, skipHorizontalWhitespace(text, start)) === null) {
		const boundary = consumeStructuralLineBreakAfterHorizontalWhitespace(text, start, structuralLineBreaks);
		if (boundary !== null) {
			const offset = boundary - start;
			value = `${value.slice(0, offset)}\n${value.slice(offset)}`;
		}
	}
	const payloadStart = consumeLineBreak(value, 0);
	if (payloadStart === null) return value;
	return value.slice(payloadStart).replace(/(?:\r\n|[\r\n])$/u, "");
}
function parsePlainTextToolCallBlockAtAnySyntax(text, start, options, structuralLineBreaks) {
	for (const scanCall of [scanPlainTextJsonToolCall, scanXmlishToolCall]) {
		const scan = scanCall(text, start, structuralLineBreaks);
		if (scan.kind !== "complete") continue;
		const name = text.slice(scan.name.start, scan.name.end);
		if (options?.allowedToolNames && !options.allowedToolNames.has(name)) continue;
		const maxPayloadBytes = options?.maxPayloadBytes ?? DEFAULT_MAX_PLAIN_TEXT_TOOL_PAYLOAD_BYTES;
		if (utf8ByteLengthWithinLimit(text, scan.payload.start, scan.payload.end, maxPayloadBytes) === null) continue;
		const args = "parameters" in scan ? Object.fromEntries(scan.parameters.map((parameter) => [text.slice(parameter.name.start, parameter.name.end), extractXmlishParameterValue(text, parameter.value.start, parameter.value.end, structuralLineBreaks)])) : parseJsonArguments(text, scan.payload);
		if (args) return {
			arguments: args,
			end: scan.end,
			name,
			raw: text.slice(start, scan.end),
			start
		};
	}
	return null;
}
function parseStandalonePlainTextToolCallBlocks(text, options, structuralLineBreaks) {
	const blocks = [];
	const normalizedOptions = options ? {
		...options,
		allowedToolNames: options.allowedToolNames ? new Set(options.allowedToolNames) : void 0
	} : void 0;
	let cursor = skipWhitespace(text, 0);
	while (cursor < text.length) {
		const block = parsePlainTextToolCallBlockAtAnySyntax(text, cursor, normalizedOptions, structuralLineBreaks);
		if (!block) return null;
		blocks.push(block);
		cursor = skipWhitespace(text, block.end);
	}
	return blocks.length > 0 ? blocks : null;
}
/** Removes full-line standalone plain-text tool-call blocks from user-visible text. */
function stripPlainTextToolCallBlocks(text, options = {}) {
	if (!text || !/(?:^|[\r\n])[^\S\r\n]*\[(?:tool:)?[A-Za-z0-9_-]+\]/.test(text) && !/(?:^|[\r\n])[^\S\r\n]*(?:<\|channel\|>)?(?:commentary|analysis|final)[ \t]+to=/.test(text) && !/(?:^|[\r\n])[^\S\r\n]*<function=/i.test(text)) return text;
	const protectedRanges = options.resolveProtectedRanges?.(text) ?? [];
	let result = "";
	let cursor = 0;
	let index = 0;
	while (index < text.length) {
		if (!(index === 0 || text[index - 1] === "\n" || text[index - 1] === "\r")) {
			index += 1;
			continue;
		}
		const blockStart = skipLineIndentation(text, index);
		if (isOffsetInProtectedRanges(blockStart, protectedRanges)) {
			index += 1;
			continue;
		}
		const scan = scanPlainTextToolCall(text, blockStart);
		if (scan.kind === "prefix" && scan.completeEnd === void 0) return result + text.slice(cursor);
		if (scan.kind === "invalid") {
			index = Math.max(index + 1, scan.next);
			continue;
		}
		let blockEnd = scan.kind === "complete" ? scan.end : scan.completeEnd;
		if (blockEnd === void 0) return result + text.slice(cursor);
		result += text.slice(cursor, index);
		while (true) {
			const adjacentStart = skipLineIndentation(text, blockEnd);
			if (isOffsetInProtectedRanges(adjacentStart, protectedRanges)) break;
			const adjacent = scanPlainTextToolCall(text, adjacentStart);
			const adjacentEnd = adjacent.kind === "complete" ? adjacent.end : adjacent.kind === "prefix" ? adjacent.completeEnd : void 0;
			if (adjacentEnd === void 0 || adjacentEnd <= blockEnd) break;
			blockEnd = adjacentEnd;
		}
		const lineBreakStart = skipLineIndentation(text, blockEnd);
		cursor = lineBreakStart === text.length ? lineBreakStart : consumeLineBreak(text, lineBreakStart) ?? blockEnd;
		index = cursor;
	}
	result += text.slice(cursor);
	return result;
}
//#endregion
//#region packages/tool-call-repair/src/protection-fast-path.ts
function createProtectionScanState() {
	return {
		fenceChar: void 0,
		fenceLength: 0,
		paragraphAmbiguous: false,
		structuralUnknown: false,
		partialLine: ""
	};
}
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;
/** Blank means spaces and tabs only; Unicode spaces do not end a Markdown block. */
const BLANK_LINE = /^[ \t]*$/;
const BARE_CARRIAGE_RETURN = /\r(?!\n)/;
/** A fence-length delimiter run outside a fence that did not open one at column 0. */
const UNCLASSIFIED_FENCE_DELIMITER = /`{3,}|~{3,}/;
const UNMODELED_BLOCK_START = /^(?: {0,3}(?:>|[-*+](?:\s|$)|\d{1,9}[.)](?:\s|$))| {4,}| *\t)/;
/** Applies one whole line (newline excluded) to the carried state. */
function applyLine(state, line) {
	if (state.structuralUnknown) return;
	if (state.fenceChar) {
		const run = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line)?.[1];
		if (run && run[0] === state.fenceChar && run.length >= state.fenceLength) {
			state.fenceChar = void 0;
			state.fenceLength = 0;
		}
		return;
	}
	if (BLANK_LINE.test(line)) {
		state.paragraphAmbiguous = false;
		return;
	}
	const open = FENCE_OPEN.exec(line);
	const marker = open?.[1];
	if (marker) {
		const infoString = line.slice(open[0].length);
		if (state.paragraphAmbiguous || open[0].length !== marker.length || marker[0] === "`" && infoString.includes("`")) {
			state.structuralUnknown = true;
			return;
		}
		state.fenceChar = marker[0] === "~" ? "~" : "`";
		state.fenceLength = marker.length;
		return;
	}
	if (UNCLASSIFIED_FENCE_DELIMITER.test(line)) {
		state.structuralUnknown = true;
		return;
	}
	if (line.includes("`") || UNMODELED_BLOCK_START.test(line)) state.paragraphAmbiguous = true;
}
/** Feeds appended visible text into the carried state. */
function advanceProtectionScanState(state, text) {
	if (!text) return;
	if (BARE_CARRIAGE_RETURN.test(text)) {
		state.structuralUnknown = true;
		return;
	}
	let newline = text.indexOf("\n");
	if (newline === -1) {
		state.partialLine += text;
		return;
	}
	let line = (state.partialLine + text.slice(0, newline)).replace(/\r$/, "");
	applyLine(state, line);
	let cursor = newline + 1;
	newline = text.indexOf("\n", cursor);
	while (newline !== -1) {
		line = text.slice(cursor, newline).replace(/\r$/, "");
		applyLine(state, line);
		cursor = newline + 1;
		newline = text.indexOf("\n", cursor);
	}
	state.partialLine = text.slice(cursor);
}
/** Resolves candidate protection relative to incoming without mutating carried state. */
function resolveProtectionFastPath(carried, incoming) {
	if (carried.paragraphAmbiguous || carried.structuralUnknown) return;
	if (BARE_CARRIAGE_RETURN.test(incoming)) return;
	const state = { ...carried };
	const lineStarts = [];
	let index = 0;
	for (;;) {
		if (index >= incoming.length && !state.partialLine) break;
		const newline = incoming.indexOf("\n", index);
		const complete = newline !== -1;
		const line = `${state.partialLine}${incoming.slice(index, complete ? newline : void 0)}`.replace(/\r$/, "");
		const lineStartAbsolute = index - state.partialLine.length;
		if (state.fenceChar) lineStarts.push([lineStartAbsolute, true]);
		else if (!complete) return;
		else {
			const probe = { ...state };
			applyLine(probe, line);
			if (probe.paragraphAmbiguous || probe.structuralUnknown) return;
			const opened = probe.fenceChar ? FENCE_OPEN.exec(line) : null;
			if (opened?.[1]) {
				lineStarts.push([lineStartAbsolute, false]);
				lineStarts.push([lineStartAbsolute + (opened[0].length - opened[1].length), true]);
			} else lineStarts.push([lineStartAbsolute, false]);
		}
		if (!complete) break;
		applyLine(state, line);
		if (state.paragraphAmbiguous || state.structuralUnknown) return;
		state.partialLine = "";
		index = newline + 1;
	}
	let cursor = -1;
	let isProtected = false;
	return (offset) => {
		while (cursor + 1 < lineStarts.length) {
			const next = lineStarts[cursor + 1];
			if (next === void 0 || next[0] > offset) break;
			cursor += 1;
			isProtected = next[1];
		}
		return isProtected;
	};
}
//#endregion
//#region packages/tool-call-repair/src/stream-normalizer.ts
const MAX_PAYLOAD_BYTES = 256e3;
const MAX_PENDING_EVENTS = 256;
const MAX_PROTECTION_CONTEXT_CHARS = 1e6;
const MAX_TOOL_NAME_CHARS = 120;
function eventContentIndex(event) {
	const index = event.contentIndex;
	return typeof index === "number" && Number.isInteger(index) && index >= 0 ? index : 0;
}
function isTextStreamEvent(event) {
	return event.type === "text_start" || event.type === "text_delta" || event.type === "text_end";
}
function extractStandaloneCandidate(message, requireAssistantRole = false) {
	const record = asOptionalObjectRecord(message);
	if (!record || requireAssistantRole && record.role !== "assistant") return;
	if (typeof record.content === "string") return record.content.trim() ? {
		text: record.content,
		parts: []
	} : void 0;
	if (!Array.isArray(record.content)) return;
	const candidate = {
		text: "",
		parts: []
	};
	for (const [contentIndex, block] of record.content.entries()) {
		const value = asOptionalObjectRecord(block);
		if (!value) return;
		if (value.type !== "text") continue;
		if (typeof value.text !== "string") return;
		const start = candidate.text.length;
		candidate.text += value.text;
		candidate.parts.push({
			contentIndex,
			start,
			end: candidate.text.length
		});
	}
	return candidate.text.trim() ? candidate : void 0;
}
function scannedCall(scan) {
	if (scan.kind === "complete") return {
		end: scan.end,
		incomplete: false,
		overCap: scan.overCap,
		payloadStart: scan.payloadStart
	};
	if (scan.overCap && scan.payloadStart !== void 0) return {
		end: scan.kind === "prefix" ? scan.next : scan.at,
		incomplete: scan.kind === "prefix",
		overCap: true,
		payloadStart: scan.payloadStart
	};
	return null;
}
function scanHasNamedCandidate(scan) {
	return [scan.json, scan.xmlish].some((branch) => {
		const name = (branch.kind === "complete" ? branch : branch.candidate)?.name;
		return name !== void 0 && name.end > name.start;
	});
}
function consumeRemovedLineEnd(text, end) {
	const lineBreakStart = skipLineIndentation(text, end);
	if (lineBreakStart === text.length) return lineBreakStart;
	return consumeLineBreak(text, lineBreakStart) ?? end;
}
function findUtf8OverCapOffset(text, start) {
	let bytes = 0;
	for (let index = start; index < text.length;) {
		const code = text.codePointAt(index) ?? 0;
		index += code > 65535 ? 2 : 1;
		bytes += code <= 127 ? 1 : code <= 2047 ? 2 : code <= 65535 ? 3 : 4;
		if (bytes > MAX_PAYLOAD_BYTES) return index;
	}
	return null;
}
function findCallSequences(text, matcher, structuralBoundaries = [], structuralLineBreaks, protectedRanges = []) {
	const sequences = [];
	const structuralBoundarySet = new Set(structuralBoundaries);
	let structuralBoundaryIndex = 0;
	let index = 0;
	while (index < text.length) {
		if (!(index === 0 || text[index - 1] === "\n" || text[index - 1] === "\r" || structuralBoundarySet.has(index))) {
			index += 1;
			continue;
		}
		const sequenceStart = index;
		let callStart = skipLineIndentation(text, index);
		if (isOffsetInProtectedRanges(callStart, protectedRanges)) {
			index += 1;
			continue;
		}
		let sequenceEnd = callStart;
		let hasOverCap = false;
		let activeStart;
		let callCount = 0;
		const first = scanPlainTextToolCall(text, callStart, {
			matcher,
			maxPayloadBytes: MAX_PAYLOAD_BYTES,
			structuralLineBreaks
		});
		let call = scannedCall(first);
		if (!call && first.kind === "prefix" && scanHasNamedCandidate(first)) {
			activeStart = callStart;
			callCount = 1;
			sequenceEnd = text.length;
		}
		while (call && callStart < text.length) {
			if (call.incomplete && call.overCap) {
				const overCapOffset = findUtf8OverCapOffset(text, call.payloadStart);
				while (structuralBoundaryIndex < structuralBoundaries.length && (structuralBoundaries[structuralBoundaryIndex] ?? 0) < (overCapOffset ?? Infinity)) structuralBoundaryIndex += 1;
				let boundary;
				while (structuralBoundaryIndex < structuralBoundaries.length) {
					const offset = structuralBoundaries[structuralBoundaryIndex];
					structuralBoundaryIndex += 1;
					const boundaryScan = offset === void 0 ? void 0 : scanPlainTextToolCall(text, skipLineIndentation(text, offset), {
						matcher,
						maxPayloadBytes: MAX_PAYLOAD_BYTES,
						structuralLineBreaks
					});
					if (boundaryScan && scannedCall(boundaryScan)) {
						boundary = offset;
						break;
					}
				}
				if (boundary !== void 0) {
					call.end = boundary;
					call.incomplete = false;
				}
			}
			callCount += 1;
			hasOverCap ||= call.overCap;
			sequenceEnd = consumeRemovedLineEnd(text, call.end);
			if (call.incomplete) {
				activeStart = callStart;
				break;
			}
			const nextStart = skipWhitespace(text, call.end);
			if (nextStart >= text.length) break;
			if (isOffsetInProtectedRanges(nextStart, protectedRanges)) break;
			const nextScan = scanPlainTextToolCall(text, nextStart, {
				matcher,
				maxPayloadBytes: MAX_PAYLOAD_BYTES,
				structuralLineBreaks
			});
			const next = scannedCall(nextScan);
			if (!next) {
				if (nextScan.kind === "prefix" && scanHasNamedCandidate(nextScan)) {
					activeStart = nextStart;
					sequenceEnd = text.length;
				}
				break;
			}
			callStart = nextStart;
			call = next;
		}
		if (callCount > 0) {
			const aggregateOverCap = utf8ByteLengthWithinLimit(text, sequenceStart, sequenceEnd, MAX_PAYLOAD_BYTES) === null;
			sequences.push({
				start: sequenceStart,
				end: sequenceEnd,
				...activeStart === void 0 ? {} : { activeStart },
				overCap: hasOverCap || aggregateOverCap
			});
			index = Math.max(sequenceEnd, index + 1);
			continue;
		}
		index = Math.max(index + 1, first.next);
	}
	return sequences;
}
function createCandidateScanView(candidate) {
	const boundaries = candidate.parts.slice(1).map((part) => part.start);
	return {
		boundaries,
		text: candidate.text,
		...boundaries.length > 0 ? { structuralLineBreaks: { lineBreakOffsets: new Set(boundaries) } } : {}
	};
}
function findCandidateCallSequences(candidate, matcher, resolveProtectedRanges) {
	const view = createCandidateScanView(candidate);
	return findCallSequences(view.text, matcher, view.boundaries, view.structuralLineBreaks, resolveProtectedRanges?.(view.text));
}
function createRangeRemover(ranges) {
	let rangeIndex = 0;
	return (text, offset = 0) => {
		let result = "";
		let cursor = 0;
		const endOffset = offset + text.length;
		while ((ranges[rangeIndex]?.end ?? Infinity) <= offset) rangeIndex += 1;
		for (let range = ranges[rangeIndex]; range && range.start < endOffset; range = ranges[rangeIndex]) {
			const start = Math.max(0, range.start - offset);
			const end = Math.min(text.length, range.end - offset);
			if (end > start) {
				result += text.slice(cursor, Math.max(cursor, start));
				cursor = Math.max(cursor, end);
			}
			if (range.end > endOffset) break;
			rangeIndex += 1;
		}
		return cursor ? result + text.slice(cursor) : text;
	};
}
function projectRangesOntoMessage(record, candidate, ranges, preserveEmptyTextBlocks) {
	const removeRanges = createRangeRemover(ranges);
	if (typeof record.content === "string") return {
		message: {
			...record,
			content: removeRanges(record.content)
		},
		sourceToProjectedContentIndex: /* @__PURE__ */ new Map([[0, 0]])
	};
	if (!Array.isArray(record.content)) return {
		message: record,
		sourceToProjectedContentIndex: /* @__PURE__ */ new Map()
	};
	const parts = new Map(candidate.parts.map((part) => [part.contentIndex, part]));
	const content = [];
	const sourceToProjectedContentIndex = /* @__PURE__ */ new Map();
	for (const [index, block] of record.content.entries()) {
		const part = parts.get(index);
		const blockRecord = asOptionalObjectRecord(block);
		if (!part || blockRecord?.type !== "text" || typeof blockRecord.text !== "string") {
			sourceToProjectedContentIndex.set(index, content.length);
			content.push(block);
			continue;
		}
		const text = removeRanges(blockRecord.text, part.start);
		if (text || preserveEmptyTextBlocks) {
			sourceToProjectedContentIndex.set(index, content.length);
			content.push({
				...blockRecord,
				text
			});
		}
	}
	return {
		message: {
			...record,
			content
		},
		sourceToProjectedContentIndex
	};
}
/** Scrubs unsafe or mixed calls and maps each retained source content block. */
function projectScrubbedPlainTextToolCallMessage(params) {
	const record = asOptionalObjectRecord(params.message);
	const candidate = extractStandaloneCandidate(params.message, params.requireAssistantRole === true);
	if (!record || !candidate) return;
	const sequences = findCandidateCallSequences(candidate, params.matcher, params.resolveProtectedRanges);
	const visibleOutsideCalls = Boolean(createRangeRemover(sequences)(candidate.text).trim());
	const ranges = sequences.filter((sequence) => params.forceKnownCandidates || sequence.overCap || visibleOutsideCalls || params.forceIncompleteCandidates && sequence.activeStart !== void 0);
	return ranges.length > 0 ? projectRangesOntoMessage(record, candidate, ranges, params.preserveEmptyTextBlocks === true) : void 0;
}
function findPotentialCallStart(text, atLineStart, matcher, isProtected) {
	for (let index = 0; index < text.length;) {
		if (!(index === 0 && atLineStart || text[index - 1] === "\n" || text[index - 1] === "\r")) {
			index += 1;
			continue;
		}
		const start = skipLineIndentation(text, index);
		if (isProtected?.(start)) {
			index += 1;
			continue;
		}
		const scan = scanPlainTextToolCall(text, start, {
			matcher,
			maxPayloadBytes: MAX_PAYLOAD_BYTES
		});
		if (scan.kind === "prefix" || scannedCall(scan)) return index;
		index = Math.max(index + 1, scan.next);
	}
	return null;
}
/**
* Event order can differ from content-index order when providers interleave blocks
* or omit earlier deltas. Trust the carried scan only when the partial's preceding
* text agrees. Missing partials reuse the verdict, or trust the scan when uncached.
* A changed preceding length invalidates the cache; fresh nonempty comparisons
* check actual text, materializing only that bounded prefix.
*/
function resolvePrecedingContextTrust(partial, contentIndex, trackedLength, trackedPrefix, cached) {
	const candidate = extractStandaloneCandidate(partial);
	const part = candidate?.parts.find((entry) => entry.contentIndex === contentIndex);
	if (!candidate || !part) return {
		cache: cached,
		trusted: cached?.trusted ?? true
	};
	if (cached && cached.precedingLength === part.start) return {
		cache: cached,
		trusted: cached.trusted
	};
	const trusted = part.start === trackedLength && (part.start === 0 || candidate.text.slice(0, part.start) === trackedPrefix());
	return {
		cache: {
			precedingLength: part.start,
			trusted
		},
		trusted
	};
}
function resolvePartialProtectionCheck(params) {
	const candidate = extractStandaloneCandidate(params.partial);
	const record = asOptionalObjectRecord(params.partial);
	if (!candidate || !record) return;
	let blockStart = 0;
	let blockText;
	if (typeof record.content === "string") {
		if (params.contentIndex !== 0) return;
		blockText = record.content;
	} else {
		const part = candidate.parts.find((entry) => entry.contentIndex === params.contentIndex);
		if (!part) return;
		blockStart = part.start;
		blockText = candidate.text.slice(part.start, part.end);
	}
	const incomingStart = params.authoritative ? 0 : blockText.length - params.incoming.length;
	if (incomingStart < 0 || (params.authoritative ? blockText !== params.incoming : !blockText.endsWith(params.incoming))) return;
	const protectedRanges = params.resolveProtectedRanges(candidate.text);
	return (offset) => isOffsetInProtectedRanges(blockStart + incomingStart + offset, protectedRanges);
}
function nextAtLineStart(previous, text) {
	if (!text) return previous;
	return text.endsWith("\n") || text.endsWith("\r");
}
function eventTemplate(event) {
	const template = { ...event };
	delete template.content;
	delete template.delta;
	delete template.partial;
	return template;
}
function createSyntheticTextDelta(template, text, partial) {
	return {
		...eventTemplate(template),
		type: "text_delta",
		delta: text,
		...partial ? { partial } : {}
	};
}
function cappedUtf8ByteLength(text) {
	return utf8ByteLengthWithinLimit(text, 0, text.length, MAX_PAYLOAD_BYTES) ?? 256001;
}
function pendingEventBytes(record) {
	const delta = typeof record.delta === "string" ? cappedUtf8ByteLength(record.delta) : 0;
	const content = typeof record.content === "string" ? cappedUtf8ByteLength(record.content) : 0;
	return Math.min(256001, delta + content);
}
function pendingQueueOverCap(pending) {
	return pending.entryBytes > MAX_PAYLOAD_BYTES || (pending.entries?.length ?? 0) > MAX_PENDING_EVENTS;
}
function createPendingState(record, text, heldStart, sequenceOverCap = false, snapshotOffset = 0) {
	const entries = [...heldStart ? [{ ...heldStart }] : [], { ...record }];
	return {
		buffer: text,
		bufferBytes: cappedUtf8ByteLength(text),
		entries,
		entryBytes: entries.reduce((total, entry) => {
			return Math.min(256001, total + pendingEventBytes(entry));
		}, 0),
		kind: "candidate",
		nextScanChars: 256,
		parts: [{
			contentIndex: eventContentIndex(record),
			start: 0,
			end: text.length
		}],
		sequenceOverCap,
		snapshotOffset,
		template: eventTemplate(record)
	};
}
function queuePendingEvent(pending, record) {
	if (!pending.entries) return;
	const event = { ...record };
	pending.entryBytes = Math.min(256001, pending.entryBytes + pendingEventBytes(event));
	const previous = pending.entries.at(-1);
	if (typeof previous?.delta === "string" && typeof event.delta === "string" && previous.type === event.type && eventContentIndex(previous) === eventContentIndex(event)) {
		previous.delta += event.delta;
		if (Object.hasOwn(event, "partial")) previous.partial = event.partial;
	} else pending.entries.push(event);
}
function appendPendingText(pending, text, record) {
	queuePendingEvent(pending, record);
	if (text) {
		const start = pending.buffer.length;
		const high = pending.buffer.charCodeAt(pending.buffer.length - 1);
		const low = text.charCodeAt(0);
		const joinedPair = high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343;
		pending.bufferBytes = Math.min(256001, pending.bufferBytes + cappedUtf8ByteLength(text) - (joinedPair ? 2 : 0));
		pending.buffer += text;
		const contentIndex = eventContentIndex(record);
		const previous = pending.parts.at(-1);
		if (previous?.contentIndex === contentIndex) previous.end = pending.buffer.length;
		else pending.parts.push({
			contentIndex,
			start,
			end: pending.buffer.length
		});
	}
	pending.template = eventTemplate(record);
}
function replayFalsePositiveCandidate(pending) {
	return pending.entries ?? [createSyntheticTextDelta(pending.template, pending.buffer)];
}
function projectPendingAuxEvents(pending, projection, projectPartial, retainedTextContentIndex) {
	return (pending.entries ?? []).flatMap((event) => {
		if (isTextStreamEvent(event)) {
			if (event.type !== "text_start" || eventContentIndex(event) !== retainedTextContentIndex) return [];
		}
		let eventProjection = projection ?? projectPartial?.(event.partial);
		const projectedEvent = { ...event };
		if (eventProjection && typeof event.contentIndex === "number") {
			let contentIndex = eventProjection.sourceToProjectedContentIndex.get(event.contentIndex);
			if (contentIndex === void 0 && projection) {
				const partialProjection = projectPartial?.(event.partial);
				const partialContentIndex = partialProjection?.sourceToProjectedContentIndex.get(event.contentIndex);
				if (partialProjection && partialContentIndex !== void 0) {
					eventProjection = partialProjection;
					contentIndex = partialContentIndex;
				}
			}
			if (contentIndex === void 0) return [];
			projectedEvent.contentIndex = contentIndex;
		}
		if (eventProjection && Object.hasOwn(projectedEvent, "partial")) projectedEvent.partial = eventProjection.message;
		return [projectedEvent];
	});
}
function projectEventIndex(event, projection) {
	if (typeof event.contentIndex !== "number") return event;
	const contentIndex = projection.sourceToProjectedContentIndex.get(event.contentIndex);
	return contentIndex === void 0 ? void 0 : {
		...event,
		contentIndex
	};
}
function projectedTextForEvent(event, projection) {
	const content = asOptionalObjectRecord(projection.message)?.content;
	if (typeof content === "string") return content;
	const projectedIndex = projection.sourceToProjectedContentIndex.get(eventContentIndex(event));
	const block = Array.isArray(content) && projectedIndex !== void 0 ? asOptionalObjectRecord(content[projectedIndex]) : void 0;
	return block?.type === "text" && typeof block.text === "string" ? block.text : void 0;
}
const XML_PARAMETER_CLOSE = "</parameter>";
const XML_FUNCTION_CLOSE = "</function>";
const XML_PARAMETER_OPEN = "<parameter=";
function createOverCapSuppressor(candidate, matcher, force = false) {
	const view = createCandidateScanView(candidate);
	const start = skipLineIndentation(view.text, 0);
	const { json, matches, xmlish } = scanPlainTextToolCall(view.text, start, {
		matcher,
		maxPayloadBytes: MAX_PAYLOAD_BYTES,
		structuralLineBreaks: view.structuralLineBreaks
	});
	const value = json.kind === "prefix" ? json.candidate : json.kind === "complete" ? json : void 0;
	const state = value?.json ?? (json.kind === "complete" ? {
		depth: 0,
		escaped: false,
		inString: false
	} : void 0);
	const name = value ? view.text.slice(value.name.start, value.name.end) : "";
	const jsonSuppressor = value ? {
		kind: "json",
		carry: value.payload && state?.depth === 0 ? view.text.slice(skipWhitespace(view.text, value.payload.end)) : "",
		depth: state?.depth ?? 0,
		escaped: state?.escaped ?? false,
		inString: state?.inString ?? false,
		phase: !value.payload ? "opening" : state?.depth === 0 ? "closing" : "payload",
		...value.syntax === "named-bracket" ? { requiredClosing: `[/${name}]` } : { optionalClosings: [
			HARMONY_CALL_MARKER,
			END_TOOL_REQUEST,
			`[/${name}]`
		] }
	} : void 0;
	if (force && jsonSuppressor && value?.nameComplete === true && !value.payload && matches.json) return {
		allowXml: xmlish.kind === "prefix" && matches.xmlish,
		carry: "",
		json: jsonSuppressor,
		kind: "opening"
	};
	if (xmlish.kind === "prefix" && matches.xmlish && xmlish.candidate?.payload && (force || utf8ByteLengthWithinLimit(view.text, xmlish.candidate.payload.start, xmlish.candidate.payload.end, MAX_PAYLOAD_BYTES) === null)) {
		const phase = xmlish.candidate.activeParameterOpenEnd === void 0 ? "body" : "parameter";
		const markers = phase === "parameter" ? [XML_PARAMETER_CLOSE] : [XML_PARAMETER_OPEN, XML_FUNCTION_CLOSE];
		const markerStart = view.text.lastIndexOf("<");
		return {
			kind: "xml",
			carry: markerStart !== -1 && markers.some((marker) => isAsciiMarkerPrefixIgnoreCase(view.text, markerStart, marker)) ? view.text.slice(markerStart) : "",
			phase
		};
	}
	if (!value || !jsonSuppressor || !value.nameComplete && !value.payload || !matches.json || !state && !force || !value.payload && !force || !force && value.payload && utf8ByteLengthWithinLimit(view.text, value.payload.start, value.payload.end, MAX_PAYLOAD_BYTES) !== null) return;
	return jsonSuppressor;
}
function classifyPending(pending, matcher, resolveProtectedRanges, finalize = false) {
	const candidate = {
		text: pending.buffer,
		parts: pending.parts
	};
	const view = createCandidateScanView(candidate);
	const terminalScan = scanPlainTextToolCall(view.text, skipLineIndentation(view.text, 0), {
		matcher,
		maxPayloadBytes: MAX_PAYLOAD_BYTES,
		structuralLineBreaks: view.structuralLineBreaks
	});
	const hasNamedCandidate = scanHasNamedCandidate(terminalScan);
	const sequences = findCandidateCallSequences(candidate, matcher, resolveProtectedRanges);
	const overCapRanges = sequences.filter(({ overCap }) => overCap);
	const leading = sequences[0]?.start === 0 ? sequences[0] : void 0;
	if (leading?.activeStart !== void 0 && (pending.sequenceOverCap || overCapRanges.length > 0)) {
		const activeCandidate = {
			text: candidate.text.slice(leading.activeStart),
			parts: candidate.parts.filter((part) => part.end > (leading.activeStart ?? 0)).map((part) => ({
				contentIndex: part.contentIndex,
				start: Math.max(0, part.start - (leading.activeStart ?? 0)),
				end: part.end - (leading.activeStart ?? 0)
			}))
		};
		const suppressor = createOverCapSuppressor(activeCandidate, matcher, true);
		if (suppressor) return {
			kind: "suppress",
			suppressor
		};
		if (leading.activeStart > 0) return {
			kind: "trim",
			candidate: activeCandidate
		};
	}
	if (overCapRanges.length > 0) {
		const text = createRangeRemover(overCapRanges)(candidate.text);
		const suppressor = text ? void 0 : createOverCapSuppressor(candidate, matcher);
		return suppressor ? {
			kind: "suppress",
			suppressor
		} : {
			kind: "stripped",
			text
		};
	}
	if (leading && leading.activeStart === void 0 && skipWhitespace(candidate.text, leading.end) < candidate.text.length) return {
		kind: "stripped",
		text: createRangeRemover([leading])(candidate.text)
	};
	if (leading && leading.activeStart === void 0) return pending.sequenceOverCap || pending.bufferBytes > MAX_PAYLOAD_BYTES ? {
		kind: "stripped",
		text: ""
	} : { kind: "pending" };
	if (leading?.activeStart !== void 0) return !hasNamedCandidate && finalize ? { kind: "false-positive" } : { kind: "pending" };
	if (terminalScan.kind === "prefix" && !hasNamedCandidate && pending.bufferBytes > MAX_PAYLOAD_BYTES) return { kind: "false-positive" };
	if (terminalScan.kind === "prefix" && (!finalize || hasNamedCandidate)) return { kind: "pending" };
	return pending.sequenceOverCap ? {
		kind: "stripped",
		text: candidate.text
	} : { kind: "false-positive" };
}
function consumeXmlSuppressor(suppressor, chunk) {
	const text = suppressor.carry + chunk;
	suppressor.carry = "";
	let cursor = 0;
	while (true) {
		if (suppressor.phase === "parameter") {
			const close = indexOfAsciiMarkerIgnoreCase(text, XML_PARAMETER_CLOSE, cursor);
			if (close === -1) {
				suppressor.carry = text.slice(-11);
				return { complete: false };
			}
			cursor = close + 12;
			suppressor.phase = "body";
		}
		const markerStart = skipWhitespace(text, cursor);
		if (markerStart === text.length) return { complete: false };
		if (startsWithAsciiMarkerIgnoreCase(text, markerStart, XML_FUNCTION_CLOSE)) {
			const end = consumeRemovedLineEnd(text, markerStart + 11);
			return {
				complete: true,
				suffix: text.slice(end)
			};
		}
		if (isAsciiMarkerPrefixIgnoreCase(text, markerStart, XML_FUNCTION_CLOSE) || isAsciiMarkerPrefixIgnoreCase(text, markerStart, XML_PARAMETER_OPEN)) {
			suppressor.carry = text.slice(markerStart);
			return { complete: false };
		}
		if (startsWithAsciiMarkerIgnoreCase(text, markerStart, XML_PARAMETER_OPEN)) {
			const restLength = text.length - markerStart;
			const close = text.indexOf(">", markerStart + 11);
			if (close === -1 && restLength <= 131) {
				suppressor.carry = text.slice(markerStart);
				return { complete: false };
			}
			if (close === -1) return {
				complete: true,
				suffix: text.slice(markerStart)
			};
			const name = text.slice(markerStart + 11, close);
			if (!name || name.length > MAX_TOOL_NAME_CHARS || Array.from(name).some((character) => !isXmlishNameChar(character))) return {
				complete: true,
				suffix: text.slice(markerStart)
			};
			suppressor.phase = "parameter";
			cursor = close + 1;
			continue;
		}
		return {
			complete: true,
			suffix: text.slice(markerStart)
		};
	}
}
function consumeJsonSuppressor(suppressor, chunk) {
	let text = suppressor.carry + chunk;
	suppressor.carry = "";
	let cursor = 0;
	if (suppressor.phase === "opening") {
		cursor = skipWhitespace(text, cursor);
		if (cursor === text.length) return { complete: false };
		if (text[cursor] !== "{") return {
			complete: true,
			suffix: text.slice(cursor)
		};
		suppressor.depth = 1;
		suppressor.phase = "payload";
		cursor += 1;
	}
	if (suppressor.phase === "payload") {
		const scanned = scanJsonObject(text, cursor, suppressor);
		if (scanned.kind === "prefix") return { complete: false };
		suppressor.phase = "closing";
		text = text.slice(scanned.end);
	}
	const markerStart = skipWhitespace(text, 0);
	const rest = text.slice(markerStart);
	const closings = suppressor.requiredClosing ? [suppressor.requiredClosing, END_TOOL_REQUEST] : suppressor.optionalClosings ?? [];
	const closing = closings.find((marker) => rest.startsWith(marker));
	if (closing) {
		const end = consumeRemovedLineEnd(rest, closing.length);
		return {
			complete: true,
			suffix: rest.slice(end)
		};
	}
	if (closings.some((marker) => marker.startsWith(rest))) {
		suppressor.carry = suppressor.requiredClosing ? rest : text.slice(-Math.max(...closings.map((marker) => marker.length)));
		return { complete: false };
	}
	const end = suppressor.requiredClosing ? markerStart : consumeRemovedLineEnd(text, 0);
	return {
		complete: true,
		suffix: text.slice(end)
	};
}
function consumeOpeningSuppressor(suppressor, chunk) {
	if (suppressor.choice) return consumeOverCapSuppressor(suppressor.choice, chunk);
	const text = suppressor.carry + chunk;
	suppressor.carry = "";
	const start = skipWhitespace(text, 0);
	if (start === text.length) return { complete: false };
	const rest = text.slice(start);
	if (rest[0] === "{") {
		suppressor.choice = suppressor.json;
		return consumeJsonSuppressor(suppressor.choice, rest);
	}
	if (suppressor.allowXml) {
		if (isAsciiMarkerPrefixIgnoreCase(rest, 0, XML_PARAMETER_OPEN)) {
			suppressor.carry = rest;
			return { complete: false };
		}
		if (startsWithAsciiMarkerIgnoreCase(rest, 0, XML_PARAMETER_OPEN)) {
			suppressor.choice = {
				carry: "",
				kind: "xml",
				phase: "body"
			};
			return consumeXmlSuppressor(suppressor.choice, rest);
		}
	}
	return {
		complete: true,
		suffix: rest
	};
}
function consumeOverCapSuppressor(suppressor, chunk) {
	return suppressor.kind === "xml" ? consumeXmlSuppressor(suppressor, chunk) : suppressor.kind === "json" ? consumeJsonSuppressor(suppressor, chunk) : consumeOpeningSuppressor(suppressor, chunk);
}
function orderByContentIndex(events, message) {
	const contentLength = Array.isArray(message.content) ? message.content.length : 0;
	const order = (event) => {
		const index = asOptionalObjectRecord(event)?.contentIndex;
		return typeof index === "number" && Number.isInteger(index) && index >= 0 && index < contentLength ? index : contentLength;
	};
	return events.toSorted((left, right) => order(left) - order(right));
}
/** Coordinates bounded candidate buffering; terminal snapshots remain the source of truth. */
async function* normalizePlainTextToolCallStreamEvents(source, options) {
	let pending;
	let overCapSequenceOpen = false;
	let scrubFuturePartials = false;
	let forceScrubTerminal = false;
	let sawStreamStart = false;
	let preserveTerminalContentIndexes = false;
	const heldTextStarts = /* @__PURE__ */ new Map();
	const lineStarts = /* @__PURE__ */ new Map();
	const emittedTextUnits = /* @__PURE__ */ new Map();
	const protectionChunks = [];
	let protectionContextLength = 0;
	let protectionContextOverflow = false;
	let protectionBlockContentIndex;
	let protectionBlockStart = 0;
	let protectionBlockPrefixVerdict;
	let protectionScan = createProtectionScanState();
	let protectionScanAtBlockStart = createProtectionScanState();
	const beginProtectionBlock = (contentIndex) => {
		if (protectionBlockContentIndex === contentIndex) return;
		protectionBlockContentIndex = contentIndex;
		protectionBlockStart = protectionContextLength;
		protectionScanAtBlockStart = { ...protectionScan };
		protectionBlockPrefixVerdict = void 0;
	};
	const truncateProtectionContext = (length) => {
		while (protectionContextLength > length) {
			const tail = protectionChunks.at(-1);
			if (tail === void 0) {
				protectionContextLength = 0;
				return;
			}
			const retainedLength = tail.length - (protectionContextLength - length);
			if (retainedLength > 0) {
				protectionChunks[protectionChunks.length - 1] = tail.slice(0, retainedLength);
				protectionContextLength = length;
				return;
			}
			protectionChunks.pop();
			protectionContextLength -= tail.length;
		}
	};
	const advanceProtectionContext = (text, resetActiveBlock = false) => {
		if (!options.resolveProtectedRanges || protectionContextOverflow) return;
		if (resetActiveBlock) {
			truncateProtectionContext(protectionBlockStart);
			protectionScan = { ...protectionScanAtBlockStart };
		}
		if (protectionContextLength + text.length > MAX_PROTECTION_CONTEXT_CHARS) {
			protectionChunks.length = 0;
			protectionContextLength = 0;
			protectionContextOverflow = true;
			return;
		}
		if (text) {
			protectionChunks.push(text);
			advanceProtectionScanState(protectionScan, text);
		}
		protectionContextLength += text.length;
	};
	const materializeProtectionPrefix = (authoritative) => {
		if (protectionContextOverflow) return "";
		const context = protectionChunks.join("");
		return authoritative ? context.slice(0, protectionBlockStart) : context;
	};
	const materializeBoundedPrefix = (length) => {
		let result = "";
		for (const chunk of protectionChunks) {
			if (result.length >= length) break;
			result += chunk;
		}
		return result.slice(0, length);
	};
	const scrubSnapshot = (value, preserveEmptyTextBlocks = false, forceKnownCandidates = false) => {
		const forced = forceKnownCandidates ? projectScrubbedPlainTextToolCallMessage({
			forceKnownCandidates: true,
			matcher: options.matcher,
			message: value,
			preserveEmptyTextBlocks,
			resolveProtectedRanges: options.resolveProtectedRanges
		}) : void 0;
		if (forced) return forced;
		const normalized = options.normalizeTerminalMessage({
			allowPromotion: false,
			message: value,
			preserveEmptyTextBlocks,
			reason: "error"
		});
		return normalized?.kind === "scrubbed" ? normalized : void 0;
	};
	const sanitizeEventPartial = (record) => {
		if (record.partial === void 0) return record;
		const projection = scrubSnapshot(record.partial, true, true);
		if (!projection) return record;
		const projected = projectEventIndex(record, projection);
		return projected ? {
			...projected,
			partial: projection.message
		} : void 0;
	};
	const forceProjectPendingAux = (candidate, projection, retainedTextContentIndex) => projectPendingAuxEvents(candidate, projection, (message) => scrubSnapshot(message, true, true), retainedTextContentIndex);
	async function* normalizeEvents() {
		for await (const sourceEvent of source) {
			let record = asOptionalObjectRecord(sourceEvent);
			if (!record) {
				yield sourceEvent;
				continue;
			}
			const type = typeof record.type === "string" ? record.type : "";
			sawStreamStart ||= type === "start";
			if (scrubFuturePartials && !pending && type !== "done" && type !== "error" && record.partial !== void 0) {
				const sanitized = sanitizeEventPartial(record);
				if (!sanitized) continue;
				record = sanitized;
			}
			if (isTextStreamEvent(record)) {
				const text = typeof record.delta === "string" ? record.delta : typeof record.content === "string" ? record.content : void 0;
				const key = eventContentIndex(record);
				if (type === "text_start" && (text === void 0 || text === "") && !pending) {
					const previous = heldTextStarts.get(key);
					if (previous) yield previous;
					heldTextStarts.set(key, record);
					continue;
				}
				if (text === void 0) {
					if (pending?.kind === "candidate") queuePendingEvent(pending, record);
					else if (!pending) {
						const held = heldTextStarts.get(key);
						if (held) {
							yield held;
							heldTextStarts.delete(key);
						}
						yield record;
					}
					continue;
				}
				let incoming = text;
				let incomingRecord = record;
				const closesText = type === "text_end";
				let authoritative = closesText;
				let sequenceOverCap = false;
				beginProtectionBlock(eventContentIndex(record));
				while (true) {
					if (pending?.kind === "suppressing") {
						if (closesText) {
							const projection = scrubSnapshot(record.partial ?? {
								role: "assistant",
								content: incoming
							}, true, true);
							yield* forceProjectPendingAux(pending, projection);
							const novelText = (projection && projectedTextForEvent(record, projection))?.slice(emittedTextUnits.get(key) ?? 0);
							if (novelText && projection) yield createSyntheticTextDelta(record, novelText, projection.message);
							pending = void 0;
							scrubFuturePartials = true;
							break;
						}
						if (!pending.suppressor) {
							const projection = scrubSnapshot(record.partial, true, true);
							yield* forceProjectPendingAux(pending, projection);
							pending = void 0;
							continue;
						}
						const consumed = consumeOverCapSuppressor(pending.suppressor, incoming);
						if (!consumed.complete) break;
						scrubFuturePartials = true;
						overCapSequenceOpen = true;
						const partialProjection = scrubSnapshot(record.partial, true, true);
						const partial = partialProjection?.message;
						yield* forceProjectPendingAux(pending, partialProjection);
						incoming = consumed.suffix;
						sequenceOverCap = true;
						if (!incoming) {
							pending = {
								entryBytes: 0,
								kind: "suppressing"
							};
							break;
						}
						pending = void 0;
						incomingRecord = {
							...eventTemplate(record),
							type: "text_delta",
							delta: incoming,
							...partial ? { partial } : {}
						};
						authoritative = false;
					}
					if (!pending) {
						const atLineStart = authoritative || sequenceOverCap || overCapSequenceOpen || (lineStarts.get(key) ?? true);
						let callStart = findPotentialCallStart(incoming, atLineStart, options.matcher);
						if (callStart !== null && options.resolveProtectedRanges) {
							if (protectionContextOverflow) callStart = null;
							else {
								const carriedScan = authoritative ? protectionScanAtBlockStart : protectionScan;
								const precedingContextTrust = resolvePrecedingContextTrust(incomingRecord.partial, eventContentIndex(incomingRecord), protectionBlockStart, () => materializeBoundedPrefix(protectionBlockStart), protectionBlockPrefixVerdict);
								protectionBlockPrefixVerdict = precedingContextTrust.cache;
								let isProtectedAt = !!precedingContextTrust.trusted && options.protectedRangesFenceCompatible ? resolveProtectionFastPath(carriedScan, incoming) : void 0;
								if (!isProtectedAt) isProtectedAt = resolvePartialProtectionCheck({
									authoritative,
									contentIndex: eventContentIndex(incomingRecord),
									incoming,
									partial: incomingRecord.partial,
									resolveProtectedRanges: options.resolveProtectedRanges
								});
								if (!isProtectedAt) {
									const protectionPrefix = materializeProtectionPrefix(authoritative);
									const protectedRanges = options.resolveProtectedRanges(`${protectionPrefix}${incoming}`);
									isProtectedAt = (offset) => isOffsetInProtectedRanges(protectionPrefix.length + offset, protectedRanges);
								}
								callStart = findPotentialCallStart(incoming, atLineStart, options.matcher, isProtectedAt);
							}
						}
						if (callStart === null) {
							const held = heldTextStarts.get(key);
							if (held) {
								yield held;
								heldTextStarts.delete(key);
							}
							yield incomingRecord;
							if (incoming) {
								const continuesScrubbedSequence = overCapSequenceOpen;
								overCapSequenceOpen = false;
								const contentIndex = eventContentIndex(incomingRecord);
								preserveTerminalContentIndexes ||= (sequenceOverCap || continuesScrubbedSequence) && contentIndex > 0;
							}
							lineStarts.set(key, nextAtLineStart(atLineStart, incoming));
							advanceProtectionContext(incoming, authoritative);
							break;
						}
						const visiblePrefix = incoming.slice(0, callStart);
						advanceProtectionContext(visiblePrefix, authoritative);
						const emittedUnits = emittedTextUnits.get(key) ?? 0;
						const emittedPrefixUnits = authoritative ? emittedUnits : 0;
						const novelVisiblePrefix = visiblePrefix.slice(emittedPrefixUnits);
						if (novelVisiblePrefix) {
							const held = heldTextStarts.get(key);
							if (held) {
								yield held;
								heldTextStarts.delete(key);
							}
							const visibleProjection = scrubSnapshot(incomingRecord.partial, true, true);
							const visibleTemplate = visibleProjection ? projectEventIndex(incomingRecord, visibleProjection) : incomingRecord;
							if (visibleTemplate) yield createSyntheticTextDelta(visibleTemplate, novelVisiblePrefix, asOptionalObjectRecord(visibleProjection?.message));
						}
						const candidateText = incoming.slice(callStart);
						const candidateRecord = typeof incomingRecord.delta === "string" ? {
							...incomingRecord,
							delta: candidateText
						} : authoritative ? incomingRecord : {
							...incomingRecord,
							content: candidateText
						};
						const held = heldTextStarts.get(key);
						heldTextStarts.delete(key);
						pending = createPendingState(candidateRecord, candidateText, held, sequenceOverCap || overCapSequenceOpen, authoritative ? callStart : emittedUnits + callStart);
						overCapSequenceOpen = false;
					} else if (pending.kind === "candidate") {
						if (authoritative) {
							const contentIndex = eventContentIndex(incomingRecord);
							const partIndex = pending.parts.findLastIndex((part) => part.contentIndex === contentIndex);
							const part = pending.parts[partIndex];
							if (part) {
								const blockOffset = part.start === 0 ? pending.snapshotOffset : 0;
								const blockText = incoming.slice(blockOffset);
								const previousLength = part.end - part.start;
								const lengthDelta = blockText.length - previousLength;
								const candidateText = pending.buffer.slice(0, part.start) + blockText + pending.buffer.slice(part.end);
								const retained = pending.entries?.filter((event) => !isTextStreamEvent(event) || event.type === "text_start");
								pending.buffer = candidateText;
								pending.bufferBytes = cappedUtf8ByteLength(candidateText);
								pending.entries = [
									...retained ?? [],
									createSyntheticTextDelta(pending.template, candidateText, asOptionalObjectRecord(record.partial)),
									{
										...incomingRecord,
										content: incoming
									}
								];
								pending.parts = pending.parts.map((entry, index) => index < partIndex ? entry : index === partIndex ? {
									...entry,
									end: entry.start + blockText.length
								} : {
									...entry,
									start: entry.start + lengthDelta,
									end: entry.end + lengthDelta
								});
								if (part.start === 0) pending.snapshotOffset = 0;
								pending.template = eventTemplate(incomingRecord);
							} else appendPendingText(pending, incoming, incomingRecord);
						} else appendPendingText(pending, incoming, incomingRecord);
						if (!incoming && !authoritative) break;
					}
					if (pending.kind !== "candidate") break;
					if (!(authoritative || pending.bufferBytes > MAX_PAYLOAD_BYTES || pending.buffer.length <= 256 || pending.buffer.length >= pending.nextScanChars)) break;
					const classification = classifyPending(pending, options.matcher, options.resolveProtectedRanges);
					pending.nextScanChars = Math.max(pending.buffer.length + 1, pending.nextScanChars * 2);
					if (classification.kind === "pending") break;
					if (classification.kind === "trim") {
						scrubFuturePartials = true;
						const partialProjection = scrubSnapshot(record.partial, true, true);
						yield* forceProjectPendingAux(pending, partialProjection);
						const candidate = classification.candidate;
						pending.buffer = candidate.text;
						pending.bufferBytes = cappedUtf8ByteLength(candidate.text);
						pending.entries = void 0;
						pending.entryBytes = 0;
						pending.nextScanChars = 256;
						pending.parts = candidate.parts;
						pending.sequenceOverCap = true;
						pending.snapshotOffset = 0;
						pending.template = {
							...pending.template,
							contentIndex: candidate.parts[0]?.contentIndex ?? pending.template.contentIndex
						};
						break;
					}
					if (classification.kind === "suppress") {
						const entries = pending.entries?.filter((event) => !isTextStreamEvent(event));
						scrubFuturePartials = true;
						pending = {
							entries,
							entryBytes: entries?.reduce((total, entry) => {
								return Math.min(256001, total + pendingEventBytes(entry));
							}, 0) ?? 0,
							kind: "suppressing",
							suppressor: classification.suppressor
						};
						break;
					}
					if (classification.kind === "false-positive") {
						yield* replayFalsePositiveCandidate(pending);
						const replayText = pending.buffer;
						pending = void 0;
						if (replayText) {
							overCapSequenceOpen = false;
							lineStarts.set(key, nextAtLineStart(lineStarts.get(key) ?? true, replayText));
							advanceProtectionContext(replayText);
						}
						break;
					}
					scrubFuturePartials = true;
					const partialProjection = scrubSnapshot(record.partial, true, true);
					const authoritativeProjection = partialProjection ?? (authoritative ? scrubSnapshot({
						role: "assistant",
						content: pending.buffer
					}, true, true) : void 0);
					const projectedText = authoritativeProjection && projectedTextForEvent(pending.template, authoritativeProjection);
					const sanitizedText = projectedText ?? classification.text;
					overCapSequenceOpen = sanitizedText.length === 0;
					const outputProjection = partialProjection;
					const contentIndex = eventContentIndex(pending.template);
					const partial = outputProjection?.message ?? (contentIndex === 0 ? {
						role: "assistant",
						content: [{
							type: "text",
							text: sanitizedText
						}]
					} : void 0);
					yield* forceProjectPendingAux(pending, outputProjection, sanitizedText ? contentIndex : void 0);
					const emittedUnits = emittedTextUnits.get(key) ?? 0;
					const novelOffset = projectedText ? emittedUnits : authoritative ? Math.max(0, emittedUnits - pending.snapshotOffset) : 0;
					const novelText = sanitizedText.slice(novelOffset);
					preserveTerminalContentIndexes ||= sanitizedText.length > 0 && contentIndex > 0;
					if (novelText) yield createSyntheticTextDelta(pending.template, novelText, partial);
					lineStarts.set(key, nextAtLineStart(lineStarts.get(key) ?? true, sanitizedText));
					advanceProtectionContext(sanitizedText);
					pending = void 0;
					break;
				}
				if (closesText) {
					emittedTextUnits.delete(key);
					protectionBlockContentIndex = void 0;
					protectionBlockStart = protectionContextLength;
				}
				continue;
			}
			if (type === "done") {
				const requestedNormalization = options.normalizeTerminalMessage({
					allowPromotion: record.reason === "stop" || record.reason === "toolUse",
					message: record.message,
					preserveEmptyTextBlocks: preserveTerminalContentIndexes,
					reason: record.reason
				});
				const forcedProjection = forceScrubTerminal ? scrubSnapshot(record.message, preserveTerminalContentIndexes, true) : void 0;
				const terminalCandidate = requestedNormalization ? void 0 : extractStandaloneCandidate(record.message, false);
				const terminalCandidateProjection = terminalCandidate && findCandidateCallSequences(terminalCandidate, options.matcher, options.resolveProtectedRanges).some((sequence) => sequence.activeStart !== void 0) ? scrubSnapshot(record.message, preserveTerminalContentIndexes, true) : void 0;
				const normalized = forcedProjection ? {
					kind: "scrubbed",
					...forcedProjection
				} : forceScrubTerminal ? void 0 : requestedNormalization ?? (terminalCandidateProjection ? {
					kind: "scrubbed",
					...terminalCandidateProjection
				} : void 0);
				if (normalized?.kind === "promoted") {
					if (!sawStreamStart) {
						yield {
							type: "start",
							partial: {
								role: "assistant",
								content: []
							}
						};
						sawStreamStart = true;
					}
					const promoted = [...options.createPromotedToolCallEvents(normalized.message)];
					const auxiliary = pending?.kind === "candidate" ? forceProjectPendingAux(pending, normalized) : [];
					yield* orderByContentIndex([...promoted, ...auxiliary], normalized.message);
					yield {
						...record,
						reason: "toolUse",
						message: normalized.message
					};
				} else if (normalized?.kind === "scrubbed") {
					if (pending?.kind === "candidate") {
						const classification = classifyPending(pending, options.matcher, options.resolveProtectedRanges, true);
						if (classification.kind === "stripped" && classification.text) {
							const template = projectEventIndex(pending.template, normalized);
							if (template) {
								const projectedText = projectedTextForEvent(pending.template, normalized);
								const sanitizedText = projectedText ?? classification.text;
								const emittedUnits = emittedTextUnits.get(eventContentIndex(pending.template)) ?? 0;
								const novelText = sanitizedText.slice(projectedText ? emittedUnits : 0);
								if (novelText) yield createSyntheticTextDelta(template, novelText, normalized.message);
							}
						}
					}
					if (pending) yield* forceProjectPendingAux(pending, normalized);
					yield {
						...record,
						message: normalized.message
					};
				} else {
					let message = record.message;
					if (pending?.kind === "candidate" && classifyPending(pending, options.matcher, options.resolveProtectedRanges, true).kind === "false-positive") yield* replayFalsePositiveCandidate(pending);
					else if (pending) {
						const projection = scrubSnapshot(record.message, true, true);
						yield* forceProjectPendingAux(pending, projection);
						message = projection?.message ?? message;
					}
					yield message === record.message ? record : {
						...record,
						message
					};
				}
				pending = void 0;
				overCapSequenceOpen = false;
				scrubFuturePartials = false;
				forceScrubTerminal = false;
				sawStreamStart = false;
				preserveTerminalContentIndexes = false;
				heldTextStarts.clear();
				lineStarts.clear();
				emittedTextUnits.clear();
				protectionChunks.length = 0;
				protectionContextLength = 0;
				protectionContextOverflow = false;
				protectionBlockContentIndex = void 0;
				protectionBlockStart = 0;
				protectionScan = createProtectionScanState();
				protectionScanAtBlockStart = createProtectionScanState();
				if (options.stopAfterDone) return;
				continue;
			}
			if (type === "error") {
				const knownCandidate = pending?.kind === "suppressing" || pending?.kind === "candidate" && classifyPending(pending, options.matcher, options.resolveProtectedRanges, true).kind !== "false-positive";
				if (pending?.kind === "candidate" && !knownCandidate) yield* replayFalsePositiveCandidate(pending);
				const streamedPartial = scrubSnapshot(record.partial, true, knownCandidate);
				const streamedError = scrubSnapshot(record.error, preserveTerminalContentIndexes, knownCandidate);
				const projection = streamedPartial ?? streamedError;
				if (pending && knownCandidate) yield* forceProjectPendingAux(pending, projection);
				yield {
					...record,
					...streamedPartial ? { partial: streamedPartial.message } : {},
					...streamedError ? { error: streamedError.message } : {}
				};
				return;
			}
			if (pending) {
				if (!pending.entries) {
					const sanitized = sanitizeEventPartial(record);
					if (sanitized) yield sanitized;
					continue;
				}
				queuePendingEvent(pending, record);
				if (pendingQueueOverCap(pending)) {
					const classification = pending.kind === "candidate" ? classifyPending(pending, options.matcher, options.resolveProtectedRanges) : void 0;
					if (pending.kind === "candidate" && classification?.kind === "false-positive") {
						yield* replayFalsePositiveCandidate(pending);
						advanceProtectionContext(pending.buffer);
						pending = void 0;
						continue;
					}
					forceScrubTerminal = true;
					if (pending.kind === "candidate") scrubFuturePartials = true;
					if (!sawStreamStart) {
						yield {
							type: "start",
							partial: {
								role: "assistant",
								content: []
							}
						};
						sawStreamStart = true;
					}
					yield* forceProjectPendingAux(pending);
					pending.entries = void 0;
					pending.entryBytes = 0;
					if (classification?.kind === "suppress") pending = {
						entryBytes: 0,
						kind: "suppressing",
						suppressor: classification.suppressor
					};
				}
			} else {
				for (const held of heldTextStarts.values()) yield held;
				heldTextStarts.clear();
				yield record;
			}
		}
		if (pending?.kind === "candidate" && classifyPending(pending, options.matcher, options.resolveProtectedRanges, true).kind === "false-positive") yield* replayFalsePositiveCandidate(pending);
		else if (pending) yield* forceProjectPendingAux(pending);
		for (const held of heldTextStarts.values()) yield held;
	}
	for await (const event of normalizeEvents()) {
		const record = asOptionalObjectRecord(event);
		if (record?.type === "text_delta" && typeof record.delta === "string") {
			const key = eventContentIndex(record);
			const previous = emittedTextUnits.get(key) ?? 0;
			emittedTextUnits.set(key, previous + record.delta.length);
		}
		yield event;
	}
}
//#endregion
//#region packages/tool-call-repair/src/promote.ts
/** Builds the shared assistant-message shape for a repaired text tool call. */
function createPromotedPlainTextToolCallBlock(block, name) {
	return {
		type: "toolCall",
		id: `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
		name,
		arguments: block.arguments,
		partialArgs: JSON.stringify(block.arguments)
	};
}
/** Emits the complete provider-neutral lifecycle for promoted tool-call blocks. */
function createPromotedPlainTextToolCallEvents(message) {
	return (Array.isArray(message.content) ? message.content : []).flatMap((block, contentIndex) => {
		const toolCall = asOptionalObjectRecord(block);
		if (toolCall?.type !== "toolCall") return [];
		return [
			{
				type: "toolcall_start",
				contentIndex,
				partial: message
			},
			{
				type: "toolcall_delta",
				contentIndex,
				delta: typeof toolCall.partialArgs === "string" ? toolCall.partialArgs : "{}",
				partial: message
			},
			{
				type: "toolcall_end",
				contentIndex,
				toolCall,
				partial: message
			}
		];
	});
}
function resolveExactToolName(rawName, allowedToolNames) {
	return allowedToolNames.has(rawName) ? rawName : null;
}
function createPromotedToolCallBlocks(text, options, lineBreakOffsets) {
	const parsedBlocks = parseStandalonePlainTextToolCallBlocks(text, void 0, lineBreakOffsets ? { lineBreakOffsets } : void 0);
	if (!parsedBlocks) return;
	const protectedRanges = options.resolveProtectedRanges?.(text) ?? [];
	if (parsedBlocks.some((block) => isOffsetInProtectedRanges(block.start, protectedRanges))) return;
	const resolveToolName = options.resolveToolName ?? resolveExactToolName;
	const toolCalls = [];
	for (const block of parsedBlocks) {
		const resolvedName = resolveToolName(block.name, options.allowedToolNames);
		if (!resolvedName) return;
		toolCalls.push(options.createToolCallBlock(block, resolvedName));
	}
	return toolCalls;
}
function createPromotedToolCallBlocksFromTextParts(textParts, options) {
	const text = textParts.join("");
	if (!text.trim()) return [];
	let offset = 0;
	const lineBreakOffsets = new Set(textParts.slice(0, -1).map((part) => {
		offset += part.length;
		return offset;
	}));
	lineBreakOffsets.delete(text.length);
	return createPromotedToolCallBlocks(text, options, lineBreakOffsets);
}
/** Promotes text calls and maps source blocks retained in the projected message. */
function projectStandalonePlainTextToolCallMessage(options) {
	const messageRecord = asOptionalObjectRecord(options.message);
	if (!messageRecord || options.allowedToolNames.size === 0 || options.requireAssistantRole && messageRecord.role !== "assistant" || options.allowedStopReasons && !options.allowedStopReasons.has(messageRecord.stopReason)) return;
	const originalContent = messageRecord.content;
	if (typeof originalContent === "string") {
		const toolCalls = createPromotedToolCallBlocks(originalContent, options);
		if (!toolCalls) return;
		return {
			message: {
				...messageRecord,
				content: toolCalls,
				stopReason: "toolUse"
			},
			sourceToProjectedContentIndex: /* @__PURE__ */ new Map()
		};
	}
	if (!Array.isArray(originalContent)) return;
	const content = [];
	const sourceToProjectedContentIndex = /* @__PURE__ */ new Map();
	let promotedTextBlock = false;
	let textParts = [];
	const flushTextParts = () => {
		const toolCalls = createPromotedToolCallBlocksFromTextParts(textParts, options);
		textParts = [];
		if (!toolCalls) return false;
		content.push(...toolCalls);
		promotedTextBlock ||= toolCalls.length > 0;
		return true;
	};
	for (const [sourceIndex, block] of originalContent.entries()) {
		const blockRecord = asOptionalObjectRecord(block);
		if (!blockRecord) return;
		if (blockRecord.type === "text") {
			if (typeof blockRecord.text !== "string") return;
			textParts.push(blockRecord.text);
			continue;
		}
		if (!flushTextParts()) return;
		if (options.isRetainableNonTextBlock?.(blockRecord)) {
			sourceToProjectedContentIndex.set(sourceIndex, content.length);
			content.push(blockRecord);
			continue;
		}
		return;
	}
	if (!flushTextParts() || !promotedTextBlock) return;
	return {
		message: {
			...messageRecord,
			content,
			stopReason: "toolUse"
		},
		sourceToProjectedContentIndex
	};
}
//#endregion
export { projectScrubbedPlainTextToolCallMessage as a, normalizePlainTextToolCallStreamEvents as i, createPromotedPlainTextToolCallEvents as n, parseStandalonePlainTextToolCallBlocks as o, projectStandalonePlainTextToolCallMessage as r, stripPlainTextToolCallBlocks as s, createPromotedPlainTextToolCallBlock as t };
