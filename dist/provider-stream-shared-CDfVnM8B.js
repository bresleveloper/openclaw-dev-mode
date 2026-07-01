import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as createAssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { i as streamSimple } from "./stream-Bs1DzXcN.js";
import { a as findBracketedJsonPayloadStart, c as findXmlishToolCallEnd, d as matchesLiteralPrefix, i as consumeJsonToolClosingMarker, l as isPlainTextToolNameChar, o as findHarmonyJsonPayloadStart, s as findJsonObjectEnd, t as parseStandalonePlainTextToolCallBlocks, u as isXmlishNameChar } from "./payload-C252NdEX.js";
import { a as resolveOpenAIReasoningEffortForModel, t as resolveOpenAIReasoningEffortMap } from "./openai-reasoning-compat-Cl2fIGts.js";
import "./anthropic-payload-policy-CehSAjdE.js";
import "./moonshot-thinking-CJBD7Bdh.js";
import { randomUUID } from "node:crypto";
//#region packages/tool-call-repair/src/stream-normalizer.ts
const TEXT_TOOL_CALL_BUFFER_MAX_CHARS = 256e3;
const TEXT_TOOL_CALL_SUPPRESSED_SCAN_MAX_CHARS = 32e4;
function asRecord$1(value) {
	return value && typeof value === "object" ? value : void 0;
}
function couldStillBeJsonPayload(text, start) {
	let cursor = start;
	while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
	return cursor >= text.length || text[cursor] === "{";
}
function couldStillBeXmlishParameterPayload(text, start) {
	let cursor = start;
	while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
	if (cursor >= text.length) return true;
	return matchesLiteralPrefix(text.slice(cursor).toLowerCase(), "<parameter=");
}
function couldStillBeBracketedStandaloneToolCall(text, matcher) {
	if (!text.startsWith("[")) return false;
	if (matchesLiteralPrefix(text, "[tool:")) {
		if (text.length <= 6) return true;
		let cursor = 6;
		while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
		const name = text.slice(6, cursor);
		if (!name || !matcher.hasNamePrefix(name)) return false;
		if (cursor >= text.length) return true;
		if (text[cursor] !== "]") return false;
		if (!matcher.hasExactName(name)) return false;
		return couldStillBeJsonPayload(text, cursor + 1) || couldStillBeXmlishParameterPayload(text, cursor + 1);
	}
	let cursor = 1;
	while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
	const name = text.slice(1, cursor);
	if (!name || !matcher.hasNamePrefix(name)) return false;
	if (cursor >= text.length) return true;
	if (text[cursor] !== "]") return false;
	if (!matcher.hasExactName(name)) return false;
	cursor += 1;
	while (text[cursor] === " " || text[cursor] === "	") cursor += 1;
	if (cursor >= text.length) return true;
	if (text[cursor] === "\r") {
		if (cursor + 1 >= text.length) return true;
		const payloadStart = text[cursor + 1] === "\n" ? cursor + 2 : cursor + 1;
		return couldStillBeJsonPayload(text, payloadStart) || couldStillBeXmlishParameterPayload(text, payloadStart);
	}
	if (text[cursor] !== "\n") return false;
	return couldStillBeJsonPayload(text, cursor + 1) || couldStillBeXmlishParameterPayload(text, cursor + 1);
}
function couldStillBeXmlishFunctionToolCall(text, matcher) {
	if (!matchesLiteralPrefix(text.toLowerCase(), "<function=")) return false;
	if (text.length <= 10) return true;
	let cursor = 10;
	while (isXmlishNameChar(text[cursor])) cursor += 1;
	const name = text.slice(10, cursor);
	if (!name || !matcher.hasNamePrefix(name)) return false;
	if (cursor >= text.length) return true;
	if (text[cursor] !== ">") return false;
	if (!matcher.hasExactName(name)) return false;
	return couldStillBeXmlishParameterPayload(text, cursor + 1);
}
function couldStillBeHarmonyStandaloneToolCall(text, matcher) {
	const channelMarker = "<|channel|>";
	let cursor = 0;
	if (matchesLiteralPrefix(text, channelMarker)) {
		if (text.length <= 11) return true;
		cursor = 11;
	}
	const rest = text.slice(cursor);
	const channel = [
		"commentary",
		"analysis",
		"final"
	].find((candidate) => matchesLiteralPrefix(rest, candidate));
	if (!channel) return false;
	if (rest.length <= channel.length) return true;
	cursor += channel.length;
	while (text[cursor] === " " || text[cursor] === "	") cursor += 1;
	if (cursor >= text.length) return true;
	const toMarker = "to=";
	const toRest = text.slice(cursor);
	if (!matchesLiteralPrefix(toRest, toMarker)) return false;
	if (toRest.length <= 3) return true;
	cursor += 3;
	const nameStart = cursor;
	while (isPlainTextToolNameChar(text[cursor])) cursor += 1;
	const name = text.slice(nameStart, cursor);
	if (!name || !matcher.hasNamePrefix(name)) return false;
	if (cursor >= text.length) return true;
	while (text[cursor] === " " || text[cursor] === "	") cursor += 1;
	if (cursor >= text.length) return true;
	if (!matcher.hasExactName(name)) return false;
	const codeMarker = "code";
	const codeRest = text.slice(cursor);
	if (!matchesLiteralPrefix(codeRest, codeMarker)) return false;
	if (codeRest.length <= 4) return true;
	cursor += 4;
	while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
	if (cursor >= text.length) return true;
	if (matchesLiteralPrefix(text.slice(cursor), "<|message|>")) return true;
	return text[cursor] === "{";
}
function hasExactSerializedToolCallPrefix(text, matcher) {
	const bracketed = /^\[(?:tool:)?([A-Za-z0-9_-]+)\]/.exec(text);
	if (bracketed?.[1]) return matcher.hasExactName(bracketed[1]);
	const xmlish = /^<function=([A-Za-z0-9_.:-]+)>/i.exec(text);
	if (xmlish?.[1]) return matcher.hasExactName(xmlish[1]);
	const harmony = /^(?:<\|channel\|>)?(?:commentary|analysis|final)\s+to=([A-Za-z0-9_-]+)\s+code\b/.exec(text);
	return Boolean(harmony?.[1] && matcher.hasExactName(harmony[1]));
}
function stripCompleteSerializedToolCallPrefix(text, matcher) {
	if (matcher && !hasExactSerializedToolCallPrefix(text, matcher)) return null;
	const xmlishEnd = findXmlishToolCallEnd(text);
	if (xmlishEnd !== null) return text.slice(xmlishEnd);
	const jsonStart = findBracketedJsonPayloadStart(text) ?? findHarmonyJsonPayloadStart(text);
	if (jsonStart === null) return null;
	const jsonEnd = findJsonObjectEnd(text, jsonStart);
	if (jsonEnd === null) return null;
	return text.slice(consumeJsonToolClosingMarker(text, jsonEnd));
}
function stripSerializedToolCallPrefixes(text, matcher) {
	let current = text;
	let changed = false;
	for (let count = 0; count < 32; count += 1) {
		const next = stripCompleteSerializedToolCallPrefix(current.trimStart(), matcher);
		if (next === null) {
			if (changed && hasExactSerializedToolCallPrefix(current.trimStart(), matcher)) return "";
			return changed ? current : null;
		}
		changed = true;
		current = next;
		if (!current.trim()) return current;
	}
	return hasExactSerializedToolCallPrefix(current.trimStart(), matcher) ? "" : current;
}
function getPlainTextToolCallBufferState(text, matcher) {
	const trimmed = text.trimStart();
	if (trimmed.length === 0) return text.length > TEXT_TOOL_CALL_BUFFER_MAX_CHARS ? "impossible" : "possible";
	if (!(couldStillBeBracketedStandaloneToolCall(trimmed, matcher) || couldStillBeXmlishFunctionToolCall(trimmed, matcher) || couldStillBeHarmonyStandaloneToolCall(trimmed, matcher))) return "impossible";
	if (text.length <= TEXT_TOOL_CALL_BUFFER_MAX_CHARS) return "possible";
	const textAfterCompleteToolBlocks = stripSerializedToolCallPrefixes(trimmed, matcher);
	return textAfterCompleteToolBlocks !== null && textAfterCompleteToolBlocks.trim() ? "impossible" : "over-cap";
}
function getTextToolCallEventText(event) {
	if (typeof event.delta === "string") return event.delta;
	return typeof event.content === "string" ? event.content : void 0;
}
function appendTextToolCallBuffer(bufferedText, event) {
	const text = getTextToolCallEventText(event);
	if (text === void 0) return bufferedText;
	if (typeof event.content === "string" && !bufferedText) return text;
	return typeof event.delta === "string" ? bufferedText + text : bufferedText;
}
function hasSuppressedToolCallClosingMarker(text) {
	if (!text) return false;
	const lowerText = text.toLowerCase();
	return lowerText.includes("</parameter>") || lowerText.includes("</function>") || text.includes("[END_TOOL_REQUEST]") || text.includes("<|call|>") || text.includes("}") || /\[\/[A-Za-z0-9_.:-]+\]/.test(text);
}
function shouldRescanSuppressedTextToolCallBuffer(previousBufferedText, event) {
	const eventText = getTextToolCallEventText(event);
	if (!eventText) return false;
	return hasSuppressedToolCallClosingMarker(previousBufferedText.slice(-2048) + eventText);
}
function truncateSuppressedTextToolCallBuffer(text) {
	if (text.length <= TEXT_TOOL_CALL_SUPPRESSED_SCAN_MAX_CHARS) return text;
	return text.slice(0, TEXT_TOOL_CALL_BUFFER_MAX_CHARS) + text.slice(-64e3);
}
function appendSuppressedTextToolCallBuffer(bufferedText, event) {
	const nextText = appendTextToolCallBuffer(bufferedText, event);
	if (nextText === bufferedText) return {
		changed: false,
		scanText: bufferedText,
		text: bufferedText
	};
	return {
		changed: true,
		scanText: nextText,
		text: truncateSuppressedTextToolCallBuffer(nextText)
	};
}
function shouldSuppressBufferedTextBlock(blockText, bufferedText) {
	const normalizedBlock = blockText.trim();
	const normalizedBuffer = bufferedText.trim();
	const normalizedSuppressedPrefix = bufferedText.slice(0, TEXT_TOOL_CALL_BUFFER_MAX_CHARS).trim();
	return Boolean(normalizedBlock && normalizedBuffer) && (normalizedBuffer.startsWith(normalizedBlock) || normalizedBlock.startsWith(normalizedBuffer) || bufferedText.length >= TEXT_TOOL_CALL_SUPPRESSED_SCAN_MAX_CHARS && Boolean(normalizedSuppressedPrefix) && normalizedBlock.startsWith(normalizedSuppressedPrefix));
}
function scrubBufferedTextFromContent(content, bufferedText, matcher, options) {
	if (Array.isArray(content)) {
		if (typeof options?.onlyTextIndex === "number") {
			const block = content[options.onlyTextIndex];
			const record = asRecord$1(block);
			if (record?.type !== "text" || typeof record.text !== "string" || !shouldSuppressBufferedTextBlock(record.text, bufferedText)) return {
				changed: false,
				content
			};
			const nextContent = [...content];
			if (options.preserveEmptyTextBlocks) nextContent[options.onlyTextIndex] = {
				...record,
				text: ""
			};
			else nextContent.splice(options.onlyTextIndex, 1);
			return {
				changed: true,
				content: nextContent
			};
		}
		const overCapPrefix = scrubOverCapTextPrefixFromContent(content, matcher, options);
		if (overCapPrefix.changed) return overCapPrefix;
		let changed = false;
		const nextContent = content.flatMap((block) => {
			const record = asRecord$1(block);
			if (record?.type === "text" && typeof record.text === "string" && shouldSuppressBufferedTextBlock(record.text, bufferedText)) {
				changed = true;
				return options?.preserveEmptyTextBlocks ? [{
					...record,
					text: ""
				}] : [];
			}
			return [block];
		});
		return changed ? {
			changed,
			content: nextContent
		} : {
			changed: false,
			content
		};
	}
	if (typeof content === "string" && shouldSuppressBufferedTextBlock(content, bufferedText)) return {
		changed: true,
		content: ""
	};
	return {
		changed: false,
		content
	};
}
function scrubOverCapTextPrefixFromContent(content, matcher, options) {
	let currentContent = content;
	let changed = false;
	for (let count = 0; count < 32; count += 1) {
		const scrubbed = scrubFirstOverCapTextPrefixFromContent(currentContent, matcher, options);
		if (!scrubbed.changed || !Array.isArray(scrubbed.content)) return changed ? {
			changed: true,
			content: currentContent
		} : scrubbed;
		currentContent = scrubbed.content;
		changed = true;
	}
	return {
		changed,
		content: currentContent
	};
}
function scrubFirstOverCapTextPrefixFromContent(content, matcher, options) {
	const suppressedTextIndexes = /* @__PURE__ */ new Set();
	let accumulated = "";
	let reachedOverCap = false;
	for (let index = 0; index < content.length; index += 1) {
		const record = asRecord$1(content[index]);
		if (record?.type !== "text" || typeof record.text !== "string") continue;
		if (!record.text.trim()) continue;
		if (!accumulated && !hasExactSerializedToolCallPrefix(record.text.trimStart(), matcher)) continue;
		if (reachedOverCap && hasExactSerializedToolCallPrefix(record.text.trimStart(), matcher)) break;
		if (reachedOverCap && suppressedTextIndexes.size === 1 && !hasSuppressedToolCallClosingMarker(record.text)) break;
		accumulated = accumulated ? `${accumulated}\n${record.text}` : record.text;
		suppressedTextIndexes.add(index);
		const state = getPlainTextToolCallBufferState(accumulated, matcher);
		if (state === "over-cap") {
			reachedOverCap = true;
			const strippedSuffix = stripSerializedToolCallPrefixes(accumulated, matcher);
			if (strippedSuffix !== null) return scrubSuppressedTextIndexesFromContent(content, suppressedTextIndexes, options, strippedSuffix, index);
			continue;
		}
		if (state === "impossible") {
			if (reachedOverCap) {
				const strippedSuffix = stripSerializedToolCallPrefixes(accumulated, matcher);
				if (strippedSuffix !== null) return scrubSuppressedTextIndexesFromContent(content, suppressedTextIndexes, options, strippedSuffix, index);
				return scrubSuppressedTextIndexesFromContent(content, suppressedTextIndexes, options);
			}
			accumulated = "";
			suppressedTextIndexes.clear();
			reachedOverCap = false;
		}
	}
	if (reachedOverCap) return scrubSuppressedTextIndexesFromContent(content, suppressedTextIndexes, options);
	return {
		changed: false,
		content
	};
}
function scrubSuppressedTextIndexesFromContent(content, suppressedTextIndexes, options, visibleSuffix, visibleSuffixIndex) {
	return {
		changed: true,
		content: content.flatMap((block, blockIndex) => {
			if (!suppressedTextIndexes.has(blockIndex)) return [block];
			const blockRecord = asRecord$1(block);
			if (visibleSuffixIndex === blockIndex && visibleSuffix !== void 0 && visibleSuffix.trim() && blockRecord) return [{
				...blockRecord,
				text: visibleSuffix
			}];
			return options?.preserveEmptyTextBlocks && blockRecord ? [{
				...blockRecord,
				text: ""
			}] : [];
		})
	};
}
function stripPlainTextToolCallsFromContent(content, matcher, options) {
	if (Array.isArray(content)) {
		const textBlocks = content.map((block, index) => ({
			index,
			record: asRecord$1(block)
		})).filter((entry) => entry.record?.type === "text" && typeof entry.record.text === "string");
		const joinedText = textBlocks.map((entry) => String(entry.record.text)).join("\n");
		if (joinedText.trim()) {
			const strippedJoined = stripSerializedToolCallPrefixes(joinedText.trim(), matcher);
			if (strippedJoined !== null && strippedJoined !== joinedText) {
				const firstTextIndex = textBlocks[0]?.index;
				return {
					changed: true,
					content: content.flatMap((block, index) => {
						const record = asRecord$1(block);
						if (record?.type !== "text" || typeof record.text !== "string") return [block];
						if (options?.preserveEmptyTextBlocks) return [{
							...record,
							text: index === firstTextIndex && strippedJoined.trim() ? strippedJoined : ""
						}];
						return index === firstTextIndex && strippedJoined.trim() ? [{
							...record,
							text: strippedJoined
						}] : [];
					})
				};
			}
		}
		let changed = false;
		const nextContent = [];
		for (const block of content) {
			const record = asRecord$1(block);
			if (record?.type !== "text" || typeof record.text !== "string") {
				nextContent.push(block);
				continue;
			}
			const strippedText = stripSerializedToolCallPrefixes(record.text, matcher);
			if (strippedText === null || strippedText === record.text) {
				nextContent.push(block);
				continue;
			}
			changed = true;
			if (strippedText.trim()) nextContent.push({
				...record,
				text: strippedText
			});
			else if (options?.preserveEmptyTextBlocks) nextContent.push({
				...record,
				text: ""
			});
		}
		return changed ? {
			changed,
			content: nextContent
		} : {
			changed: false,
			content
		};
	}
	if (typeof content === "string") {
		const strippedText = stripSerializedToolCallPrefixes(content, matcher);
		if (strippedText !== null && strippedText !== content) return {
			changed: true,
			content: strippedText
		};
	}
	return {
		changed: false,
		content
	};
}
function stripOverCapPlainTextToolCallsFromContent(content, matcher, options) {
	if (Array.isArray(content)) {
		let changed = false;
		const nextContent = [];
		for (const block of content) {
			const record = asRecord$1(block);
			if (record?.type !== "text" || typeof record.text !== "string" || record.text.length <= TEXT_TOOL_CALL_BUFFER_MAX_CHARS) {
				nextContent.push(block);
				continue;
			}
			const strippedText = stripSerializedToolCallPrefixes(record.text, matcher);
			if (strippedText === null || strippedText === record.text) {
				nextContent.push(block);
				continue;
			}
			changed = true;
			if (strippedText.trim()) nextContent.push({
				...record,
				text: strippedText
			});
			else if (options?.preserveEmptyTextBlocks) nextContent.push({
				...record,
				text: ""
			});
		}
		return changed ? {
			changed,
			content: nextContent
		} : {
			changed: false,
			content
		};
	}
	if (typeof content === "string" && content.length > TEXT_TOOL_CALL_BUFFER_MAX_CHARS) {
		const strippedText = stripSerializedToolCallPrefixes(content, matcher);
		if (strippedText !== null && strippedText !== content) return {
			changed: true,
			content: strippedText
		};
	}
	return {
		changed: false,
		content
	};
}
function scrubPlainTextToolCallContent(content, bufferedText, matcher, options) {
	const scrubbed = scrubBufferedTextFromContent(content, bufferedText, matcher, options);
	const stripped = options?.onlyTextIndex === void 0 ? stripPlainTextToolCallsFromContent(scrubbed.content, matcher, options) : {
		changed: false,
		content: scrubbed.content
	};
	return stripped.changed ? stripped : scrubbed;
}
function shouldPreserveEmptyTextBlocksForEventIndex(content, bufferedText, matcher, eventContentIndex) {
	if (typeof eventContentIndex !== "number" || !Number.isInteger(eventContentIndex) || eventContentIndex < 0 || !Array.isArray(content)) return false;
	const currentBlock = content[eventContentIndex];
	if (currentBlock === void 0) return false;
	const scrubbed = scrubPlainTextToolCallContent(content, bufferedText, matcher);
	return scrubbed.changed && Array.isArray(scrubbed.content) && scrubbed.content[eventContentIndex] !== currentBlock;
}
function scrubBufferedTextFromPartial(event, bufferedText, matcher, contentIndex, options) {
	const partial = asRecord$1(event.partial);
	if (!partial) return event;
	const preserveEmptyTextBlocks = options?.preserveEmptyTextBlocks === true || shouldPreserveEmptyTextBlocksForEventIndex(partial.content, bufferedText, matcher, event.contentIndex);
	const scrubbed = scrubPlainTextToolCallContent(partial.content, bufferedText, matcher, {
		onlyTextIndex: contentIndex,
		preserveEmptyTextBlocks
	});
	if (!scrubbed.changed) return event;
	return {
		...event,
		partial: {
			...partial,
			content: scrubbed.content
		}
	};
}
function scrubBufferedTextFromMessage(event, bufferedText, matcher, contentIndex) {
	const message = asRecord$1(event.message);
	if (!message) return event;
	const scrubbed = scrubPlainTextToolCallContent(message.content, bufferedText, matcher, { onlyTextIndex: contentIndex });
	if (!scrubbed.changed) return event;
	return {
		...event,
		message: {
			...message,
			content: scrubbed.content
		}
	};
}
function scrubBufferedTextFromError(event, bufferedText, matcher, contentIndex) {
	const error = asRecord$1(event.error);
	if (!error) return event;
	const scrubbed = scrubPlainTextToolCallContent(error.content, bufferedText, matcher, { onlyTextIndex: contentIndex });
	if (!scrubbed.changed) return event;
	return {
		...event,
		error: {
			...error,
			content: scrubbed.content
		}
	};
}
function replaceTextContentWithVisibleSuffix(record, visibleText, contentIndex, matcher) {
	if (typeof record.content === "string") return {
		...record,
		content: visibleText
	};
	if (!Array.isArray(record.content)) return record;
	const originalContent = record.content;
	if (typeof contentIndex === "number") {
		const content = originalContent.flatMap((block, index) => {
			if (index !== contentIndex) return [block];
			const blockRecord = asRecord$1(block);
			if (blockRecord?.type !== "text" || typeof blockRecord.text !== "string") return [block];
			if (matcher && !hasExactSerializedToolCallPrefix(blockRecord.text.trimStart(), matcher)) return [block];
			return visibleText.trim() ? [{
				...blockRecord,
				text: visibleText
			}] : [];
		});
		if (matcher && content.every((block, index) => block === originalContent[index])) return replaceTextContentWithVisibleSuffix(record, visibleText, void 0, matcher);
		return {
			...record,
			content
		};
	}
	if (originalContent.filter((block) => {
		const blockRecord = asRecord$1(block);
		return blockRecord?.type === "text" && typeof blockRecord.text === "string";
	}).length !== 1) {
		if (!matcher) return record;
		let replaced = false;
		const content = originalContent.flatMap((block) => {
			const blockRecord = asRecord$1(block);
			if (blockRecord?.type !== "text" || typeof blockRecord.text !== "string") return [block];
			if (replaced) return [block];
			if (!hasExactSerializedToolCallPrefix(blockRecord.text.trimStart(), matcher)) return [block];
			replaced = true;
			return visibleText.trim() ? [{
				...blockRecord,
				text: visibleText
			}] : [];
		});
		return replaced ? {
			...record,
			content
		} : record;
	}
	let replaced = false;
	const content = originalContent.flatMap((block) => {
		const blockRecord = asRecord$1(block);
		if (blockRecord?.type !== "text" || typeof blockRecord.text !== "string") return [block];
		if (replaced) return [];
		replaced = true;
		return visibleText.trim() ? [{
			...blockRecord,
			text: visibleText
		}] : [];
	});
	return {
		...record,
		content
	};
}
function scrubReclassifiedMixedTextFromPartial(event, visibleText, contentIndex, matcher) {
	const partial = asRecord$1(event.partial);
	if (!partial) return event;
	return {
		...event,
		partial: replaceTextContentWithVisibleSuffix(partial, visibleText, contentIndex, matcher)
	};
}
function scrubReclassifiedMixedTextFromError(event, visibleText, contentIndex, matcher) {
	const error = asRecord$1(event.error);
	if (!error) return event;
	return {
		...event,
		error: replaceTextContentWithVisibleSuffix(error, visibleText, contentIndex, matcher)
	};
}
/** Scrubs final messages whose streamed plain-text tool-call prefix exceeded the buffer cap. */
function scrubOverCapPlainTextToolCallMessage(params) {
	const record = asRecord$1(params.message);
	const candidateText = params.candidateText;
	if (!record || !candidateText) return;
	const bufferState = getPlainTextToolCallBufferState(candidateText, params.matcher);
	if (bufferState === "impossible") {
		if (candidateText.length <= TEXT_TOOL_CALL_BUFFER_MAX_CHARS) return;
		const visibleText = stripSerializedToolCallPrefixes(candidateText, params.matcher);
		if (visibleText?.trim() && !Array.isArray(record.content)) {
			const replaced = replaceTextContentWithVisibleSuffix(record, visibleText, void 0, params.matcher);
			if (replaced !== record) return replaced;
		}
		if (Array.isArray(record.content)) {
			const overCap = scrubOverCapTextPrefixFromContent(record.content, params.matcher);
			const stripped = stripOverCapPlainTextToolCallsFromContent(overCap.content, params.matcher);
			if (!overCap.changed && !stripped.changed) return;
			return {
				...record,
				content: stripped.changed ? stripped.content : overCap.content
			};
		}
		return;
	}
	if (bufferState !== "over-cap") return;
	const scrubbed = scrubPlainTextToolCallContent(record.content, candidateText, params.matcher);
	return {
		...record,
		content: scrubbed.content
	};
}
function createScrubbedTextDeltaEvent(event, text) {
	const partial = asRecord$1(event.partial);
	const syntheticContent = typeof event.contentIndex === "number" ? Array.from({ length: event.contentIndex + 1 }, (_, index) => ({
		type: "text",
		text: index === event.contentIndex ? text : ""
	})) : [{
		type: "text",
		text
	}];
	const scrubbedPartial = partial ? replaceTextContentWithVisibleSuffix(partial, text, event.contentIndex) : {
		role: "assistant",
		content: syntheticContent
	};
	const eventWithoutTextEndContent = { ...event };
	delete eventWithoutTextEndContent.content;
	return {
		...eventWithoutTextEndContent,
		type: "text_delta",
		delta: text,
		partial: scrubbedPartial
	};
}
function appendReclassifiedVisibleDelta(visibleText, event) {
	return typeof event.delta === "string" ? `${visibleText}${event.delta}` : visibleText;
}
function isAllowedTextToolCallLikeEvent(event, matcher) {
	const text = getTextToolCallEventText(event);
	return Boolean(text?.trim() && getPlainTextToolCallBufferState(text, matcher) !== "impossible");
}
function isBufferedTextEvent(bufferedEvent) {
	const bufferedRecord = asRecord$1(bufferedEvent);
	const bufferedType = typeof bufferedRecord?.type === "string" ? bufferedRecord.type : "";
	return bufferedType === "text_start" || bufferedType === "text_delta" || bufferedType === "text_end";
}
/** Buffers provider stream text long enough to promote or hide leaked plain-text tool calls. */
async function* normalizePlainTextToolCallStreamEvents(source, options) {
	const bufferedEvents = [];
	let bufferedText = "";
	let suppressingOverCapTextToolCall = false;
	let suppressedTextContentIndex;
	let hasSuppressedTextContentIndex = false;
	let reclassifiedMixedTextContentIndex;
	let hasReclassifiedMixedTextContentIndex = false;
	let scrubReclassifiedMixedTextFromDone = false;
	let reclassifiedMixedVisibleText;
	const flushBufferedEvents = () => {
		const events = bufferedEvents.splice(0);
		bufferedText = "";
		return events;
	};
	function* flushScrubbedBufferedNonTextEvents(resetBufferedText) {
		const events = bufferedEvents.splice(0);
		const textToScrub = bufferedText;
		if (resetBufferedText) bufferedText = "";
		for (const bufferedEvent of events) {
			if (isBufferedTextEvent(bufferedEvent)) continue;
			const bufferedRecord = asRecord$1(bufferedEvent);
			yield bufferedRecord ? scrubBufferedTextFromPartial(bufferedRecord, textToScrub, options.matcher, hasSuppressedTextContentIndex ? suppressedTextContentIndex : void 0, { preserveEmptyTextBlocks: suppressingOverCapTextToolCall }) : bufferedEvent;
		}
	}
	function* suppressBufferedTextEvents() {
		suppressingOverCapTextToolCall = true;
		yield* flushScrubbedBufferedNonTextEvents(false);
	}
	for await (const event of source) {
		const record = asRecord$1(event);
		if (!record) {
			yield event;
			continue;
		}
		const type = typeof record.type === "string" ? record.type : "";
		if (type === "text_start" || type === "text_delta" || type === "text_end") {
			if (type === "text_end" && hasReclassifiedMixedTextContentIndex && record.contentIndex === reclassifiedMixedTextContentIndex) continue;
			if (scrubReclassifiedMixedTextFromDone && reclassifiedMixedVisibleText !== void 0 && hasReclassifiedMixedTextContentIndex && record.contentIndex === reclassifiedMixedTextContentIndex) {
				reclassifiedMixedVisibleText = appendReclassifiedVisibleDelta(reclassifiedMixedVisibleText, record);
				yield scrubReclassifiedMixedTextFromPartial(record, reclassifiedMixedVisibleText, reclassifiedMixedTextContentIndex, options.matcher);
				continue;
			}
			if (suppressingOverCapTextToolCall) {
				if (hasSuppressedTextContentIndex && record.contentIndex !== suppressedTextContentIndex) {
					if (isAllowedTextToolCallLikeEvent(record, options.matcher)) continue;
					yield scrubBufferedTextFromPartial(record, bufferedText, options.matcher, suppressedTextContentIndex, { preserveEmptyTextBlocks: true });
					continue;
				}
				const previousBufferedText = bufferedText;
				const appended = appendSuppressedTextToolCallBuffer(bufferedText, record);
				bufferedText = appended.text;
				if ((appended.changed && shouldRescanSuppressedTextToolCallBuffer(previousBufferedText, record) ? getPlainTextToolCallBufferState(appended.scanText, options.matcher) : "over-cap") === "impossible") {
					const visibleText = stripSerializedToolCallPrefixes(appended.scanText, options.matcher) ?? "";
					yield* flushScrubbedBufferedNonTextEvents(true);
					suppressingOverCapTextToolCall = false;
					suppressedTextContentIndex = void 0;
					hasSuppressedTextContentIndex = false;
					reclassifiedMixedTextContentIndex = record.contentIndex;
					hasReclassifiedMixedTextContentIndex = true;
					scrubReclassifiedMixedTextFromDone = true;
					reclassifiedMixedVisibleText = visibleText;
					if (visibleText.trim()) yield createScrubbedTextDeltaEvent(record, visibleText);
				}
				continue;
			}
			bufferedEvents.push(event);
			bufferedText = appendTextToolCallBuffer(bufferedText, record);
			const scanBufferedText = truncateSuppressedTextToolCallBuffer(bufferedText);
			const scanWasTruncated = scanBufferedText.length !== bufferedText.length;
			const bufferState = getPlainTextToolCallBufferState(scanBufferedText, options.matcher);
			if (bufferState === "impossible") {
				const visibleText = !scanWasTruncated && bufferedText.length > TEXT_TOOL_CALL_BUFFER_MAX_CHARS ? stripSerializedToolCallPrefixes(bufferedText.trimStart(), options.matcher) : null;
				if (visibleText?.trim()) {
					yield* flushScrubbedBufferedNonTextEvents(true);
					reclassifiedMixedTextContentIndex = record.contentIndex;
					hasReclassifiedMixedTextContentIndex = true;
					scrubReclassifiedMixedTextFromDone = true;
					reclassifiedMixedVisibleText = visibleText;
					yield createScrubbedTextDeltaEvent(record, visibleText);
				} else if (scanWasTruncated && stripSerializedToolCallPrefixes(scanBufferedText.trimStart(), options.matcher) !== null) {
					bufferedText = scanBufferedText;
					suppressedTextContentIndex = record.contentIndex;
					hasSuppressedTextContentIndex = true;
					yield* suppressBufferedTextEvents();
				} else yield* flushBufferedEvents();
			} else if (bufferState === "over-cap") {
				bufferedText = scanBufferedText;
				suppressedTextContentIndex = record.contentIndex;
				hasSuppressedTextContentIndex = true;
				yield* suppressBufferedTextEvents();
			}
			continue;
		}
		if (type === "done") {
			const normalizedMessage = options.normalizeDoneMessage({
				message: record.message,
				reason: record.reason
			});
			if (normalizedMessage?.kind === "promoted") {
				yield* flushScrubbedBufferedNonTextEvents(true);
				suppressingOverCapTextToolCall = false;
				suppressedTextContentIndex = void 0;
				hasSuppressedTextContentIndex = false;
				scrubReclassifiedMixedTextFromDone = false;
				reclassifiedMixedTextContentIndex = void 0;
				hasReclassifiedMixedTextContentIndex = false;
				reclassifiedMixedVisibleText = void 0;
				yield* options.createPromotedToolCallEvents(normalizedMessage.message);
				yield {
					...record,
					reason: "toolUse",
					message: normalizedMessage.message
				};
				if (options.stopAfterDone) return;
				continue;
			}
			if (normalizedMessage?.kind === "scrubbed") {
				yield* flushScrubbedBufferedNonTextEvents(true);
				suppressingOverCapTextToolCall = false;
				suppressedTextContentIndex = void 0;
				hasSuppressedTextContentIndex = false;
				scrubReclassifiedMixedTextFromDone = false;
				reclassifiedMixedTextContentIndex = void 0;
				hasReclassifiedMixedTextContentIndex = false;
				reclassifiedMixedVisibleText = void 0;
				yield {
					...record,
					message: normalizedMessage.message
				};
				if (options.stopAfterDone) return;
				continue;
			}
			const mixedMessageRecord = scrubReclassifiedMixedTextFromDone ? asRecord$1(record.message) : void 0;
			const strippedMixedMessage = mixedMessageRecord && reclassifiedMixedVisibleText !== void 0 ? replaceTextContentWithVisibleSuffix(mixedMessageRecord, reclassifiedMixedVisibleText, hasReclassifiedMixedTextContentIndex ? reclassifiedMixedTextContentIndex : void 0, options.matcher) : void 0;
			if (strippedMixedMessage) {
				yield* flushScrubbedBufferedNonTextEvents(true);
				scrubReclassifiedMixedTextFromDone = false;
				reclassifiedMixedTextContentIndex = void 0;
				hasReclassifiedMixedTextContentIndex = false;
				reclassifiedMixedVisibleText = void 0;
				yield {
					...record,
					message: strippedMixedMessage
				};
				if (options.stopAfterDone) return;
				continue;
			}
			if (suppressingOverCapTextToolCall) {
				const scrubbedDoneEvent = scrubBufferedTextFromMessage(record, bufferedText, options.matcher, hasSuppressedTextContentIndex ? suppressedTextContentIndex : void 0);
				yield* flushScrubbedBufferedNonTextEvents(true);
				suppressingOverCapTextToolCall = false;
				suppressedTextContentIndex = void 0;
				hasSuppressedTextContentIndex = false;
				scrubReclassifiedMixedTextFromDone = false;
				reclassifiedMixedTextContentIndex = void 0;
				hasReclassifiedMixedTextContentIndex = false;
				reclassifiedMixedVisibleText = void 0;
				yield scrubbedDoneEvent;
				if (options.stopAfterDone) return;
				continue;
			}
			yield* flushBufferedEvents();
			yield event;
			if (options.stopAfterDone) return;
			continue;
		}
		if (type === "error") {
			if (!suppressingOverCapTextToolCall) yield* flushBufferedEvents();
			yield suppressingOverCapTextToolCall ? scrubBufferedTextFromError(scrubBufferedTextFromPartial(record, bufferedText, options.matcher, hasSuppressedTextContentIndex ? suppressedTextContentIndex : void 0, { preserveEmptyTextBlocks: true }), bufferedText, options.matcher, hasSuppressedTextContentIndex ? suppressedTextContentIndex : void 0) : scrubReclassifiedMixedTextFromDone && reclassifiedMixedVisibleText !== void 0 ? scrubReclassifiedMixedTextFromError(scrubReclassifiedMixedTextFromPartial(record, reclassifiedMixedVisibleText, hasReclassifiedMixedTextContentIndex ? reclassifiedMixedTextContentIndex : void 0, options.matcher), reclassifiedMixedVisibleText, hasReclassifiedMixedTextContentIndex ? reclassifiedMixedTextContentIndex : void 0, options.matcher) : event;
			return;
		}
		if (scrubReclassifiedMixedTextFromDone && reclassifiedMixedVisibleText !== void 0) {
			yield scrubReclassifiedMixedTextFromPartial(record, reclassifiedMixedVisibleText, hasReclassifiedMixedTextContentIndex ? reclassifiedMixedTextContentIndex : void 0, options.matcher);
			continue;
		}
		if (bufferedEvents.length > 0 && !suppressingOverCapTextToolCall) {
			bufferedEvents.push(event);
			continue;
		}
		yield suppressingOverCapTextToolCall ? scrubBufferedTextFromPartial(record, bufferedText, options.matcher, hasSuppressedTextContentIndex ? suppressedTextContentIndex : void 0, { preserveEmptyTextBlocks: suppressingOverCapTextToolCall }) : event;
	}
	if (!suppressingOverCapTextToolCall) yield* flushBufferedEvents();
}
//#endregion
//#region packages/tool-call-repair/src/promote.ts
function asRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
function resolveExactToolName(rawName, allowedToolNames) {
	return allowedToolNames.has(rawName) ? rawName : null;
}
function createPromotedToolCallBlocks(text, options) {
	const parsedBlocks = parseStandalonePlainTextToolCallBlocks(text);
	if (!parsedBlocks) return;
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
	const exactText = textParts.join("").trim();
	if (!exactText) return [];
	for (const text of createTextPartPromotionCandidates(textParts, exactText)) {
		const toolCalls = createPromotedToolCallBlocks(text, options);
		if (toolCalls) return toolCalls;
	}
}
function createTextPartPromotionCandidates(textParts, exactText) {
	const repairedText = joinTextPartsWithStructuralLineBreaks(textParts).trim();
	const newlineJoinedText = textParts.join("\n").trim();
	return [...new Set([
		repairedText,
		exactText,
		newlineJoinedText
	].filter(Boolean))];
}
function joinTextPartsWithStructuralLineBreaks(textParts) {
	let text = "";
	for (const part of textParts) {
		if (text && shouldInsertStructuralLineBreak(text, part)) text += "\n";
		text += part;
	}
	return text;
}
function shouldInsertStructuralLineBreak(left, right) {
	if (!left || !right || /[\r\n]$/u.test(left) || /^\s/u.test(right)) return false;
	const trimmedLeft = left.trimEnd();
	return /<parameter=[A-Za-z0-9_.:-]{1,120}>$/iu.test(trimmedLeft) || /^\[[A-Za-z0-9_-]+\]$/u.test(trimmedLeft);
}
function shouldPromoteMessage(options) {
	if (options.allowedToolNames.size === 0) return false;
	const messageRecord = asRecord(options.message);
	if (!messageRecord) return false;
	if (options.requireAssistantRole && messageRecord.role !== "assistant") return false;
	return !options.allowedStopReasons || options.allowedStopReasons.has(messageRecord.stopReason);
}
/** Extracts candidate standalone tool-call text while rejecting mixed unsafe content. */
function extractStandalonePlainTextToolCallText(params) {
	const record = asRecord(params.message);
	if (!record) return;
	if (params.requireAssistantRole && record.role !== "assistant") return;
	if (params.allowedStopReasons && !params.allowedStopReasons.has(record.stopReason)) return;
	const content = record.content;
	if (typeof content === "string") return content.trim() || void 0;
	if (!Array.isArray(content)) return;
	const textParts = [];
	for (const block of content) {
		const blockRecord = asRecord(block);
		if (!blockRecord) return;
		if (blockRecord.type === "text") {
			if (typeof blockRecord.text !== "string") return;
			if (blockRecord.text.trim()) textParts.push(blockRecord.text);
			continue;
		}
		if (params.isRetainableNonTextBlock?.(blockRecord) || params.allowOtherNonTextBlocks) continue;
		return;
	}
	return textParts.join("").trim() || void 0;
}
/** Promotes standalone plain-text tool-call messages into provider-native content blocks. */
function promoteStandalonePlainTextToolCallMessage(options) {
	if (!shouldPromoteMessage(options)) return;
	const messageRecord = asRecord(options.message);
	if (!messageRecord) return;
	const originalContent = messageRecord.content;
	if (typeof originalContent === "string") {
		const text = originalContent.trim();
		if (!text) return;
		const toolCalls = createPromotedToolCallBlocks(text, options);
		if (!toolCalls) return;
		return {
			...messageRecord,
			content: toolCalls,
			stopReason: "toolUse"
		};
	}
	if (!Array.isArray(originalContent)) return;
	const content = [];
	let promotedTextBlock = false;
	let textParts = [];
	const flushTextParts = () => {
		if (textParts.length === 0) return false;
		const toolCalls = createPromotedToolCallBlocksFromTextParts(textParts, options);
		textParts = [];
		if (toolCalls?.length === 0) return false;
		if (!toolCalls) return;
		content.push(...toolCalls);
		return true;
	};
	for (const block of originalContent) {
		const blockRecord = asRecord(block);
		if (!blockRecord) return;
		if (blockRecord.type === "text") {
			if (typeof blockRecord.text !== "string") return;
			if (blockRecord.text.trim()) textParts.push(blockRecord.text);
			continue;
		}
		const promotedTextRun = flushTextParts();
		if (promotedTextRun === void 0) return;
		promotedTextBlock ||= promotedTextRun;
		if (options.isRetainableNonTextBlock?.(blockRecord)) {
			content.push(blockRecord);
			continue;
		}
		return;
	}
	const promotedTrailingTextRun = flushTextParts();
	if (promotedTrailingTextRun === void 0) return;
	promotedTextBlock ||= promotedTrailingTextRun;
	if (!promotedTextBlock) return;
	return {
		...messageRecord,
		content,
		stopReason: "toolUse"
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/reasoning-effort-utils.ts
/** Maps OpenClaw thinking levels onto provider reasoning-effort labels. */
function mapThinkingLevelToReasoningEffort(thinkingLevel) {
	if (thinkingLevel === "off") return "none";
	if (thinkingLevel === "adaptive") return "medium";
	if (thinkingLevel === "max") return "xhigh";
	return thinkingLevel;
}
//#endregion
//#region src/llm/providers/stream-wrappers/stream-payload-utils.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
function streamWithPayloadPatch(underlying, model, context, options, patchPayload) {
	const originalOnPayload = options?.onPayload;
	return underlying(model, context, {
		...options,
		onPayload: (payload) => {
			if (payload && typeof payload === "object") patchPayload(payload);
			return originalOnPayload?.(payload, model);
		}
	});
}
//#endregion
//#region src/llm/providers/stream-wrappers/zai.ts
/**
* Inject `tool_stream=true` so tool-call deltas stream in real time.
* Providers can disable this by setting `params.tool_stream=false`.
*
* @deprecated Provider-owned stream helper; do not use from third-party plugins.
*/
function createToolStreamWrapper(baseStreamFn, enabled) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!enabled) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			payloadObj.tool_stream = true;
		});
	};
}
/** @deprecated Z.ai provider-owned stream helper; do not use from third-party plugins. */
const createZaiToolStreamWrapper = createToolStreamWrapper;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.ts
/** Compose stream wrapper factories from left to right around a base stream function. */
function composeProviderStreamWrappers(baseStreamFn, ...wrappers) {
	return wrappers.reduce((streamFn, wrapper) => wrapper ? wrapper(streamFn) : streamFn, baseStreamFn);
}
function toRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
function resolveContextToolNames(context) {
	const tools = context.tools;
	if (!Array.isArray(tools)) return /* @__PURE__ */ new Set();
	const names = tools.map((tool) => {
		const record = toRecord(tool);
		return typeof record?.name === "string" && record.name.trim() ? record.name : void 0;
	}).filter((name) => Boolean(name));
	return new Set(names);
}
function createSyntheticToolCallId() {
	return `call_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}
function createPlainTextToolCallBlock(parsed) {
	return {
		type: "toolCall",
		id: createSyntheticToolCallId(),
		name: parsed.name,
		arguments: parsed.arguments,
		partialArgs: JSON.stringify(parsed.arguments)
	};
}
function promotePlainTextToolCalls(message, toolNames) {
	const messageRecord = toRecord(message);
	if (Array.isArray(messageRecord?.content) && messageRecord.content.some((block) => toRecord(block)?.type === "toolCall")) return;
	return promoteStandalonePlainTextToolCallMessage({
		allowedToolNames: toolNames,
		createToolCallBlock: (block, name) => createPlainTextToolCallBlock({
			...block,
			name
		}),
		isRetainableNonTextBlock: () => true,
		message
	});
}
function emitPromotedToolCallEvents(stream, message) {
	(Array.isArray(message.content) ? message.content : []).forEach((block, contentIndex) => {
		const record = toRecord(block);
		if (record?.type !== "toolCall") return;
		stream.push({
			type: "toolcall_start",
			contentIndex,
			partial: message
		});
		stream.push({
			type: "toolcall_delta",
			contentIndex,
			delta: typeof record.partialArgs === "string" ? record.partialArgs : "{}",
			partial: message
		});
	});
}
function extractPlainTextToolCallCandidate(message) {
	return extractStandalonePlainTextToolCallText({
		allowOtherNonTextBlocks: true,
		message
	});
}
function createProviderToolNameMatcher(toolNames) {
	return {
		hasExactName: (name) => toolNames.has(name),
		hasNamePrefix: (prefix) => {
			for (const toolName of toolNames) if (toolName.startsWith(prefix)) return true;
			return false;
		}
	};
}
function normalizeProviderDoneMessage(message, toolNames, matcher) {
	const scrubbedMessage = scrubOverCapPlainTextToolCallMessage({
		candidateText: extractPlainTextToolCallCandidate(message),
		matcher,
		message
	});
	if (scrubbedMessage) return {
		kind: "scrubbed",
		message: scrubbedMessage
	};
	const promotedMessage = promotePlainTextToolCalls(message, toolNames);
	return promotedMessage ? {
		kind: "promoted",
		message: promotedMessage
	} : void 0;
}
function wrapPlainTextToolCallStream(source, context) {
	const toolNames = resolveContextToolNames(context);
	if (toolNames.size === 0) return source;
	const matcher = createProviderToolNameMatcher(toolNames);
	const output = createAssistantMessageEventStream();
	const stream = output;
	(async () => {
		let ended = false;
		const endStream = () => {
			if (!ended) {
				ended = true;
				stream.end();
			}
		};
		try {
			const normalizedEvents = normalizePlainTextToolCallStreamEvents(source, {
				createPromotedToolCallEvents: (message) => {
					const events = [];
					emitPromotedToolCallEvents({ push: (event) => events.push(event) }, message);
					return events;
				},
				matcher,
				normalizeDoneMessage: ({ message }) => normalizeProviderDoneMessage(message, toolNames, matcher),
				stopAfterDone: true
			});
			for await (const event of normalizedEvents) stream.push(event);
		} catch (error) {
			stream.push({
				type: "error",
				reason: "error",
				error: {
					role: "assistant",
					content: [],
					stopReason: "error",
					errorMessage: error instanceof Error ? error.message : String(error)
				}
			});
		} finally {
			endStream();
		}
	})();
	return output;
}
/**
* Provider stream wrapper for local/proxy providers that sometimes emit a
* standalone textual tool-call block even when native tool calling is enabled.
*/
function createPlainTextToolCallCompatWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapPlainTextToolCallStream(stream, context));
		return wrapPlainTextToolCallStream(maybeStream, context);
	};
}
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
function defaultToolStreamExtraParams(extraParams) {
	if (extraParams?.tool_stream !== void 0) return extraParams;
	return {
		...extraParams,
		tool_stream: true
	};
}
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
function createPayloadPatchStreamWrapper(baseStreamFn, patchPayload, wrapperOptions) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (wrapperOptions?.shouldPatch && !wrapperOptions.shouldPatch({
			model,
			context,
			options
		})) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => patchPayload({
			payload,
			model,
			context,
			options
		}));
	};
}
/**
* Applies explicit disabled-thinking intent to OpenAI-compatible Chat
* Completions payloads without changing enabled reasoning levels.
*/
function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	if (thinkingLevel !== "off") return underlying;
	return (model, context, options) => {
		if (model.api !== "openai-completions") return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (!("reasoning_effort" in payload)) return;
			const disabled = resolveOpenAIReasoningEffortForModel({
				model,
				effort: "none",
				fallbackMap: resolveOpenAIReasoningEffortMap({
					provider: typeof model.provider === "string" ? model.provider : null,
					id: typeof model.id === "string" ? model.id : null,
					compat: model.compat
				})
			});
			if (disabled) payload.reasoning_effort = disabled;
			else delete payload.reasoning_effort;
		});
	};
}
function isAnthropicThinkingEnabled(payload) {
	const thinking = payload.thinking;
	if (!thinking || typeof thinking !== "object") return false;
	return thinking.type !== "disabled";
}
function assistantMessageHasAnthropicToolUse(message) {
	if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) return true;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	return content.some((block) => block && typeof block === "object" && (block.type === "tool_use" || block.type === "toolCall"));
}
function stripTrailingAssistantPrefillMessages(payload) {
	if (!Array.isArray(payload.messages)) return 0;
	let stripped = 0;
	while (payload.messages.length > 0) {
		const finalMessage = payload.messages[payload.messages.length - 1];
		if (!finalMessage || typeof finalMessage !== "object") break;
		const message = finalMessage;
		if (message.role !== "assistant" || assistantMessageHasAnthropicToolUse(message)) break;
		payload.messages.pop();
		stripped += 1;
	}
	return stripped;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function stripTrailingAnthropicAssistantPrefillWhenThinking(payload) {
	if (!isAnthropicThinkingEnabled(payload)) return 0;
	return stripTrailingAssistantPrefillMessages(payload);
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, onStripped, wrapperOptions) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		const stripped = stripTrailingAnthropicAssistantPrefillWhenThinking(payload);
		if (stripped > 0) onStripped?.(stripped);
	}, wrapperOptions);
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function isOpenAICompatibleThinkingEnabled(params) {
	const options = params.options ?? {};
	const raw = options.reasoningEffort ?? options.reasoning ?? params.thinkingLevel ?? "high";
	if (typeof raw !== "string") return true;
	const normalized = raw.trim().toLowerCase();
	return normalized !== "off" && normalized !== "none";
}
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
function normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel) {
	delete payload.reasoning_effort;
	if (!thinkingLevel || thinkingLevel === "off") return;
	const existingReasoning = payload.reasoning;
	if (existingReasoning && typeof existingReasoning === "object" && !Array.isArray(existingReasoning)) {
		const reasoning = existingReasoning;
		if (!("max_tokens" in reasoning) && !("effort" in reasoning)) reasoning.effort = mapThinkingLevelToReasoningEffort(thinkingLevel);
	} else if (!existingReasoning) payload.reasoning = { effort: mapThinkingLevelToReasoningEffort(thinkingLevel) };
}
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
function setQwenChatTemplateThinking(payload, enabled) {
	const existing = payload.chat_template_kwargs;
	if (existing && typeof existing === "object" && !Array.isArray(existing)) {
		const next = {
			...existing,
			enable_thinking: enabled
		};
		if (!Object.hasOwn(next, "preserve_thinking")) next.preserve_thinking = true;
		payload.chat_template_kwargs = next;
		return;
	}
	payload.chat_template_kwargs = {
		enable_thinking: enabled,
		preserve_thinking: true
	};
}
function isDisabledDeepSeekV4ThinkingLevel(thinkingLevel) {
	const normalized = typeof thinkingLevel === "string" ? thinkingLevel.toLowerCase() : "";
	return normalized === "off" || normalized === "none";
}
function resolveDeepSeekV4ReasoningEffort(thinkingLevel) {
	return thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
}
function stripDeepSeekV4ReasoningContent(payload) {
	if (!Array.isArray(payload.messages)) return;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") continue;
		delete message.reasoning_content;
	}
}
function ensureDeepSeekV4AssistantReasoningContent(payload, params) {
	if (!Array.isArray(payload.messages)) return;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") continue;
		const record = message;
		if (record.role !== "assistant") continue;
		if (params?.shouldBackfillAssistantMessage && !params.shouldBackfillAssistantMessage(record)) continue;
		if (!("reasoning_content" in record)) record.reasoning_content = "";
	}
}
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
function createDeepSeekV4OpenAICompatibleThinkingWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	const resolveReasoningEffort = params.resolveReasoningEffort ?? resolveDeepSeekV4ReasoningEffort;
	return (model, context, options) => {
		if (!params.shouldPatchModel(model)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (isDisabledDeepSeekV4ThinkingLevel(params.thinkingLevel)) {
				payload.thinking = { type: "disabled" };
				delete payload.reasoning_effort;
				delete payload.reasoning;
				stripDeepSeekV4ReasoningContent(payload);
				return;
			}
			payload.thinking = { type: "enabled" };
			payload.reasoning_effort = resolveReasoningEffort(params.thinkingLevel);
			ensureDeepSeekV4AssistantReasoningContent(payload, { shouldBackfillAssistantMessage: params.shouldBackfillAssistantReasoningContent });
		});
	};
}
function promoteThinkingOnlyFinalOutputToText(message) {
	if (!message || typeof message !== "object") return;
	const record = message;
	if (record.stopReason !== "stop" && record.stopReason !== "length") return;
	if (!Array.isArray(record.content) || record.content.length === 0) return;
	let hasVisibleText = false;
	let hasToolCall = false;
	let hasVisibleThinking = false;
	for (const block of record.content) {
		if (!block || typeof block !== "object") continue;
		const typedBlock = block;
		if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text.trim()) hasVisibleText = true;
		if (typedBlock.type === "toolCall" || typedBlock.type === "tool_use") hasToolCall = true;
		if (typedBlock.type === "thinking" && typeof typedBlock.thinking === "string" && typedBlock.thinking.trim()) hasVisibleThinking = true;
	}
	if (hasVisibleText || hasToolCall || !hasVisibleThinking) return;
	record.content = record.content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const typedBlock = block;
		if (typedBlock.type !== "thinking" || typeof typedBlock.thinking !== "string" || !typedBlock.thinking.trim()) return block;
		return {
			type: "text",
			text: typedBlock.thinking
		};
	});
}
function wrapThinkingOnlyFinalTextStream(stream) {
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		promoteThinkingOnlyFinalOutputToText(message);
		return message;
	};
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = function() {
		const iterator = originalAsyncIterator();
		return {
			async next() {
				const result = await iterator.next();
				if (!result.done && result.value && typeof result.value === "object") {
					const event = result.value;
					promoteThinkingOnlyFinalOutputToText(event.partial);
					promoteThinkingOnlyFinalOutputToText(event.message);
				}
				return result;
			},
			async return(value) {
				return iterator.return?.(value) ?? {
					done: true,
					value: void 0
				};
			},
			async throw(error) {
				return iterator.throw?.(error) ?? {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	};
	return stream;
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function createThinkingOnlyFinalTextWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (!params.shouldPatchModel(model)) return maybeStream;
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapThinkingOnlyFinalTextStream(stream));
		return wrapThinkingOnlyFinalTextStream(maybeStream);
	};
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleThinkingRequiredModel(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).includes("gemini-2.5-pro");
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini25ThinkingBudgetModel(modelId) {
	return /(?:^|\/)gemini-2\.5-/.test(normalizeLowercaseStringOrEmpty(modelId));
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3ProModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-pro|pro-latest)(?:-|$)/.test(normalized);
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3FlashModel(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|\/)gemini-(?:3(?:\.\d+)?-flash|flash(?:-lite)?-latest)(?:-|$)/.test(normalized);
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3ThinkingLevelModel(modelId) {
	return isGoogleGemini3ProModel(modelId) || isGoogleGemini3FlashModel(modelId);
}
/**
* Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function resolveGoogleGemini3ThinkingLevel(params) {
	if (typeof params.modelId !== "string") return;
	if (isGoogleGemini3ProModel(params.modelId)) {
		switch (params.thinkingLevel) {
			case "off":
			case "minimal":
			case "low": return "LOW";
			case "medium":
			case "high":
			case "max":
			case "xhigh": return "HIGH";
			case "adaptive": return;
			case void 0: break;
		}
		if (typeof params.thinkingBudget === "number") {
			if (params.thinkingBudget < 0) return;
			return params.thinkingBudget <= 2048 ? "LOW" : "HIGH";
		}
		return;
	}
	if (!isGoogleGemini3FlashModel(params.modelId)) return;
	switch (params.thinkingLevel) {
		case "off":
		case "minimal": return "MINIMAL";
		case "low": return "LOW";
		case "medium": return "MEDIUM";
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		case "adaptive": return;
		case void 0: break;
	}
	if (typeof params.thinkingBudget !== "number") return;
	if (params.thinkingBudget < 0) return;
	if (params.thinkingBudget <= 0) return "MINIMAL";
	if (params.thinkingBudget <= 2048) return "LOW";
	if (params.thinkingBudget <= 8192) return "MEDIUM";
	return "HIGH";
}
/**
* Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function stripInvalidGoogleThinkingBudget(params) {
	if (params.thinkingConfig.thinkingBudget !== 0 || typeof params.modelId !== "string" || !isGoogleThinkingRequiredModel(params.modelId)) return false;
	delete params.thinkingConfig.thinkingBudget;
	return true;
}
function isGemma4Model(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).startsWith("gemma-4");
}
function mapThinkLevelToGemma4ThinkingLevel(thinkingLevel) {
	switch (thinkingLevel) {
		case "off": return;
		case "minimal":
		case "low": return "MINIMAL";
		case "medium":
		case "adaptive":
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		default: return;
	}
}
function normalizeGemma4ThinkingLevel(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toUpperCase()) {
		case "MINIMAL":
		case "LOW": return "MINIMAL";
		case "MEDIUM":
		case "HIGH": return "HIGH";
		default: return;
	}
}
/**
* Normalizes Google thinking config across SDK payload shapes before provider transport.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function sanitizeGoogleThinkingPayload(params) {
	if (!params.payload || typeof params.payload !== "object") return;
	const payloadObj = params.payload;
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.config,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.generationConfig,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
}
function sanitizeGoogleThinkingConfigContainer(params) {
	if (!params.container || typeof params.container !== "object") return;
	const configObj = params.container;
	const thinkingConfig = configObj.thinkingConfig;
	if (!thinkingConfig || typeof thinkingConfig !== "object") return;
	const thinkingConfigObj = thinkingConfig;
	if (typeof params.modelId === "string" && isGemma4Model(params.modelId)) {
		const normalizedThinkingLevel = normalizeGemma4ThinkingLevel(thinkingConfigObj.thinkingLevel);
		const explicitMappedLevel = mapThinkLevelToGemma4ThinkingLevel(params.thinkingLevel);
		const disabledViaBudget = typeof thinkingConfigObj.thinkingBudget === "number" && thinkingConfigObj.thinkingBudget <= 0;
		const hadThinkingBudget = thinkingConfigObj.thinkingBudget !== void 0;
		delete thinkingConfigObj.thinkingBudget;
		if (params.thinkingLevel === "off" || disabledViaBudget && explicitMappedLevel === void 0 && !normalizedThinkingLevel) {
			delete thinkingConfigObj.thinkingLevel;
			if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
			return;
		}
		const mappedLevel = explicitMappedLevel ?? normalizedThinkingLevel ?? (hadThinkingBudget ? "MINIMAL" : void 0);
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		return;
	}
	const thinkingBudget = thinkingConfigObj.thinkingBudget;
	if (params.thinkingLevel === "adaptive" && typeof params.modelId === "string" && isGoogleGemini25ThinkingBudgetModel(params.modelId)) {
		delete thinkingConfigObj.thinkingLevel;
		thinkingConfigObj.thinkingBudget = -1;
		return;
	}
	if (params.thinkingLevel === "adaptive" && typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
		delete thinkingConfigObj.thinkingBudget;
		delete thinkingConfigObj.thinkingLevel;
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
		const mappedLevel = resolveGoogleGemini3ThinkingLevel({
			modelId: params.modelId,
			thinkingLevel: params.thinkingLevel,
			thinkingBudget: typeof thinkingBudget === "number" ? thinkingBudget : void 0
		});
		delete thinkingConfigObj.thinkingBudget;
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (stripInvalidGoogleThinkingBudget({
		thinkingConfig: thinkingConfigObj,
		modelId: params.modelId
	})) {
		if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
		return;
	}
	if (typeof thinkingBudget !== "number" || thinkingBudget >= 0) return;
	delete thinkingConfigObj.thinkingBudget;
	if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingPayloadWrapper(baseStreamFn, thinkingLevel) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		if (model.api === "google-generative-ai") sanitizeGoogleThinkingPayload({
			payload,
			modelId: model.id,
			thinkingLevel
		});
	});
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingStreamWrapper(ctx) {
	return createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel);
}
//#endregion
export { scrubOverCapPlainTextToolCallMessage as A, createToolStreamWrapper as C, extractStandalonePlainTextToolCallText as D, mapThinkingLevelToReasoningEffort as E, promoteStandalonePlainTextToolCallMessage as O, stripTrailingAnthropicAssistantPrefillWhenThinking as S, streamWithPayloadPatch as T, normalizeOpenAICompatibleReasoningPayload as _, createGoogleThinkingStreamWrapper as a, setQwenChatTemplateThinking as b, createPlainTextToolCallCompatWrapper as c, isGoogleGemini25ThinkingBudgetModel as d, isGoogleGemini3FlashModel as f, isOpenAICompatibleThinkingEnabled as g, isGoogleThinkingRequiredModel as h, createGoogleThinkingPayloadWrapper as i, normalizePlainTextToolCallStreamEvents as k, createThinkingOnlyFinalTextWrapper as l, isGoogleGemini3ThinkingLevelModel as m, createAnthropicThinkingPrefillPayloadWrapper as n, createOpenAICompatibleCompletionsThinkingOffWrapper as o, isGoogleGemini3ProModel as p, createDeepSeekV4OpenAICompatibleThinkingWrapper as r, createPayloadPatchStreamWrapper as s, composeProviderStreamWrappers as t, defaultToolStreamExtraParams as u, resolveGoogleGemini3ThinkingLevel as v, createZaiToolStreamWrapper as w, stripInvalidGoogleThinkingBudget as x, sanitizeGoogleThinkingPayload as y };
