import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { b as parseLooseIpAddress, c as isIpv4Address, i as isCanonicalDottedDecimalIPv4, n as isBlockedSpecialUseIpv4Address, r as isBlockedSpecialUseIpv6Address, t as extractEmbeddedIpv4FromIpv6, u as isLegacyIpv4Literal, v as parseCanonicalIpAddress } from "./ip-jvtZlu_y.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as findCodeRegions } from "./code-regions-CvUeKYli.mjs";
import { i as parseInlineDirectives } from "./directive-tags-CHfxUaYi.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
//#region src/media/parse-output.ts
const MEDIA_TOKEN_RE = /\bMEDIA:\s*`?([^\n]+)`?/i;
const RENDERABLE_ASSISTANT_MEDIA_PREFIX_RE = /^(?:https?:\/\/|data:(?:image|audio|video)\/|file:|~|\/|[a-z]:[\\/])/iu;
function isRelativeAssistantMediaReference(url) {
	const trimmed = url.trim();
	return Boolean(trimmed) && !RENDERABLE_ASSISTANT_MEDIA_PREFIX_RE.test(trimmed);
}
const FILE_URL_PREFIX_RE = /^file:(?:\/\/)?/i;
function normalizeMediaSource(src) {
	return src.replace(FILE_URL_PREFIX_RE, "");
}
const TRAILING_SERIALIZED_JSON_AFTER_EXT_RE = /^(.*\.\w{1,10})\\?"(?=[\]},:]|$).*/s;
function cleanCandidate(raw) {
	const stripped = raw.replace(/^[`"'[{(]+/, "").replace(/[`"'\\})\],]+$/, "");
	return TRAILING_SERIALIZED_JSON_AFTER_EXT_RE.exec(stripped)?.[1] ?? stripped;
}
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const MEDIA_SOURCE_ROOT_RE = /^(?:[a-z]:[\\/]|[/~]|\.{1,2}[\\/]|\\\\)/i;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT = /\.\w{1,10}$/;
const TRAVERSAL_SEGMENT_RE = /(?:^|[/\\])\.\.(?:[/\\]|$)/;
function isSupportedHomeRelativePath(candidate) {
	return candidate.startsWith("~/") || candidate.startsWith("~\\");
}
function hasTraversalOrUnsupportedHomeDirPrefix(candidate) {
	return candidate.startsWith("../") || candidate === ".." || candidate.startsWith("~") && !isSupportedHomeRelativePath(candidate) || TRAVERSAL_SEGMENT_RE.test(candidate);
}
function looksLikeLocalFilePath(candidate) {
	return candidate.startsWith("/") || candidate.startsWith("./") || candidate.startsWith("../") || candidate.startsWith("~") || WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\") || !SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\"));
}
function normalizeRemoteMediaHostname(value) {
	const normalized = value.trim().toLowerCase().replace(/^\[|\]$/g, "").replace(/\.+$/, "");
	if (normalized.split(".").some((label) => label.length === 0)) return "";
	return normalized;
}
function isBlockedRemoteMediaHostname(hostname) {
	const normalized = normalizeRemoteMediaHostname(hostname);
	if (!normalized) return true;
	if (!normalized.includes(".")) return true;
	if (normalized === "localhost" || normalized === "localhost.localdomain" || normalized === "metadata.google.internal" || normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized.endsWith(".internal")) return true;
	const strictIp = parseCanonicalIpAddress(normalized);
	if (strictIp) {
		if (isIpv4Address(strictIp)) return isBlockedSpecialUseIpv4Address(strictIp);
		if (isBlockedSpecialUseIpv6Address(strictIp)) return true;
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
		return embeddedIpv4 ? isBlockedSpecialUseIpv4Address(embeddedIpv4) : false;
	}
	if (normalized.includes(":") && !parseLooseIpAddress(normalized)) return true;
	return !isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized);
}
function isAllowedRemoteMediaUrl(candidate) {
	try {
		const parsed = new URL(candidate);
		return parsed.protocol === "https:" && !parsed.username && !parsed.password && !isBlockedRemoteMediaHostname(parsed.hostname);
	} catch {
		return false;
	}
}
function isValidMedia(source, opts) {
	const candidate = normalizeMediaSource(source);
	if (!candidate) return false;
	if (candidate.length > 4096) return false;
	if (!opts?.allowSpaces && /\s/.test(candidate)) return false;
	if (hasHttpUrlPrefix(candidate)) return isAllowedRemoteMediaUrl(candidate);
	if (/^media:\/\//i.test(candidate)) try {
		return parseInboundMediaUri(candidate) !== null;
	} catch {
		return false;
	}
	if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
	if (looksLikeLocalFilePath(candidate)) return true;
	if (opts?.allowBareFilename && !SCHEME_RE.test(candidate) && HAS_FILE_EXT.test(candidate)) return true;
	return false;
}
function beginsIndependentMediaSource(raw) {
	const candidate = normalizeMediaSource(cleanCandidate(raw));
	return MEDIA_SOURCE_ROOT_RE.test(candidate) || SCHEME_RE.test(candidate);
}
const QUOTE_CHARS = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"`"
]);
const MEDIA_DIRECTIVE_SPACE_RE = /\s/;
function isQuotedMediaReferenceBoundary(payload, afterQuote) {
	if (afterQuote >= payload.length) return true;
	const char = payload.charAt(afterQuote);
	if (MEDIA_DIRECTIVE_SPACE_RE.test(char)) return true;
	if (char !== ",") return false;
	let index = afterQuote + 1;
	while (index < payload.length && MEDIA_DIRECTIVE_SPACE_RE.test(payload.charAt(index))) index += 1;
	return index < payload.length && QUOTE_CHARS.has(payload.charAt(index));
}
function findQuotedMediaReferenceEnd(payload, start, quote) {
	for (let index = start + 1; index < payload.length; index += 1) if (payload.charAt(index) === quote && isQuotedMediaReferenceBoundary(payload, index + 1)) return index;
	return -1;
}
function stripSerializedJsonArrayWrapper(payload) {
	const trimmed = payload.trim();
	if (trimmed.length < 2 || trimmed.charAt(0) !== "[" || trimmed.charAt(trimmed.length - 1) !== "]") return payload;
	return trimmed.slice(1, -1);
}
function readQuotedMediaReferenceList(rawPayload) {
	const payload = stripSerializedJsonArrayWrapper(rawPayload);
	const tokens = [];
	let index = 0;
	while (index < payload.length) {
		const char = payload.charAt(index);
		if (MEDIA_DIRECTIVE_SPACE_RE.test(char) || char === ",") {
			index += 1;
			continue;
		}
		if (QUOTE_CHARS.has(char)) {
			const end = findQuotedMediaReferenceEnd(payload, index, char);
			if (end !== -1) {
				tokens.push(payload.slice(index, end + 1));
				index = end + 1;
				continue;
			}
		}
		return null;
	}
	return tokens.length >= 2 ? tokens : null;
}
function splitMediaDirectiveParts(payload) {
	const parts = [];
	let previousEnd = 0;
	for (const match of payload.matchAll(/\S+/g)) {
		const candidate = normalizeMediaSource(cleanCandidate(match[0]));
		const previous = parts.at(-1);
		const previousCandidate = previous ? normalizeMediaSource(cleanCandidate(previous)) : "";
		if (MEDIA_SOURCE_ROOT_RE.test(previousCandidate) && !beginsIndependentMediaSource(candidate) && (!HAS_FILE_EXT.test(previousCandidate) || !isValidMedia(candidate))) parts[parts.length - 1] = `${previous}${payload.slice(previousEnd, match.index)}${match[0]}`;
		else parts.push(match[0]);
		previousEnd = match.index + match[0].length;
	}
	return parts;
}
function unwrapQuoted(value) {
	const trimmed = value.trim();
	if (trimmed.length < 2) return;
	const first = trimmed[0];
	if (first !== trimmed[trimmed.length - 1]) return;
	if (first !== `"` && first !== "'" && first !== "`") return;
	return trimmed.slice(1, -1).trim();
}
function cleanLineText(text) {
	return text.replace(/[ \t]{2,}/g, " ").trim();
}
const MAX_MARKDOWN_IMAGE_LINE_LENGTH = 2e4;
const MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE = 50;
function removeMarkdownImageSpans(line, matches) {
	const pieces = [];
	let cursor = 0;
	for (let index = 0; index < matches.length; index += 1) {
		const match = expectDefined(matches[index], "Markdown image span");
		let end = match.end;
		let next = matches[index + 1];
		let internalGap = "";
		while (next) {
			const gap = line.slice(end, next.start);
			if (!/^[ \t]*$/.test(gap)) break;
			internalGap ||= gap;
			end = next.end;
			index += 1;
			next = matches[index + 1];
		}
		let start = match.start;
		let left = start;
		while (left > cursor && /[ \t]/.test(line.charAt(left - 1))) left -= 1;
		let right = end;
		while (right < line.length && /[ \t]/.test(line.charAt(right))) right += 1;
		const hasTextBefore = left > 0 && line.charAt(left - 1) !== "\r";
		const hasTextAfter = right < line.length && line.charAt(right) !== "\r";
		let separator = "";
		if (!hasTextBefore) {
			if (hasTextAfter) end = right;
		} else {
			start = left;
			if (hasTextAfter) {
				separator = line.slice(end, right) || line.slice(left, match.start) || internalGap;
				end = right;
			}
		}
		pieces.push(line.slice(cursor, start), separator);
		cursor = end;
	}
	pieces.push(line.slice(cursor));
	return pieces.join("");
}
function collectMarkdownImageSegments(params) {
	const { matches } = params;
	if (matches.length === 0) return {
		lineSegments: [],
		foundMedia: false
	};
	const segmentPieces = [];
	const visiblePieces = [];
	const extractedImages = [];
	const lineSegments = [];
	let cursor = 0;
	let foundMedia = false;
	for (const match of matches) {
		const before = params.line.slice(cursor, match.start);
		segmentPieces.push(before);
		visiblePieces.push(before);
		const target = normalizeMediaSource(match.destination.trim());
		const selectedTarget = params.allowlist?.get(target);
		if (selectedTarget || !params.allowlist && hasHttpUrlPrefix(target) && isValidMedia(target)) {
			extractedImages.push(match);
			const beforeText = params.preserveTrailingWhitespace ? segmentPieces.join("") : cleanLineText(segmentPieces.join(""));
			if (beforeText.trim()) lineSegments.push({
				type: "text",
				text: beforeText
			});
			segmentPieces.length = 0;
			const mediaTarget = selectedTarget ?? target;
			params.media.push(mediaTarget);
			lineSegments.push({
				type: "media",
				url: mediaTarget
			});
			foundMedia = true;
		} else {
			const original = params.line.slice(match.start, match.end);
			segmentPieces.push(original);
			visiblePieces.push(original);
		}
		cursor = match.end;
	}
	const after = params.line.slice(cursor);
	segmentPieces.push(after);
	visiblePieces.push(after);
	const trailingText = params.preserveTrailingWhitespace ? segmentPieces.join("") : cleanLineText(segmentPieces.join(""));
	if (trailingText.trim()) lineSegments.push({
		type: "text",
		text: trailingText
	});
	const cleanedLine = params.preserveTrailingWhitespace ? removeMarkdownImageSpans(params.line, extractedImages) : cleanLineText(visiblePieces.join(""));
	return {
		cleanedLine: params.preserveTrailingWhitespace ? cleanedLine : cleanedLine || void 0,
		lineSegments,
		foundMedia
	};
}
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
function splitMediaOutput(raw, options = {}, imageExtraction) {
	const trimmedRaw = options.preserveTrailingWhitespace ? raw : raw.trimEnd();
	if (!trimmedRaw.trim()) return { text: options.preserveTrailingWhitespace ? trimmedRaw : "" };
	const markdownImageAllowlist = imageExtraction?.allowlist === void 0 ? void 0 : new Map(imageExtraction.allowlist.map((source) => [normalizeMediaSource(source.trim()), source]));
	const extractMarkdownImages = imageExtraction !== void 0;
	const extractMediaDirectives = options.extractMediaDirectives !== false;
	const mayContainMediaToken = extractMediaDirectives && /media:/i.test(trimmedRaw);
	const mayContainMarkdownImage = extractMarkdownImages && trimmedRaw.includes("![");
	const mayContainAudioTag = trimmedRaw.includes("[[");
	if (!mayContainMediaToken && !mayContainMarkdownImage && !mayContainAudioTag) return { text: trimmedRaw };
	const media = [];
	let rejectedMediaCount = 0;
	let foundMediaToken = false;
	const segments = [];
	let lastTextSegment;
	let lineSeparator = "";
	let lastTextSeparator = "";
	const pushTextSegment = (text) => {
		const last = segments[segments.length - 1];
		if (last?.type === "text") {
			last.text = `${last.text}${lastTextSeparator}${text.trim() ? text : ""}`;
			lastTextSeparator = lineSeparator;
		} else if (!text.trim()) {
			if (last?.type === "media" && lastTextSegment && !/[\r\n]$/.test(lastTextSegment.text)) lastTextSegment.text += lastTextSeparator;
		} else {
			lastTextSegment = {
				type: "text",
				text
			};
			lastTextSeparator = lineSeparator;
			segments.push(lastTextSegment);
		}
	};
	const codeBlocks = findCodeRegions(trimmedRaw).filter((region) => region.block);
	const lines = trimmedRaw.split(/(\r\n|\r|\n)/);
	const keptLines = [];
	let keptSeparator = "";
	const keepLine = (text) => {
		keptLines.push(keptSeparator, text);
		keptSeparator = lineSeparator;
	};
	const markdownImages = mayContainMarkdownImage && lines.some((line) => line.length <= MAX_MARKDOWN_IMAGE_LINE_LENGTH && line.includes("![")) ? imageExtraction.scan(trimmedRaw) : [];
	let markdownImageIndex = 0;
	let lineOffset = 0;
	let codeBlockIndex = 0;
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 2) {
		const line = expectDefined(lines[lineIndex], "media output line");
		lineSeparator = lines[lineIndex + 1] ?? "";
		const lineEnd = lineOffset + line.length;
		const lineImages = [];
		for (; markdownImageIndex < markdownImages.length; markdownImageIndex += 1) {
			const match = expectDefined(markdownImages[markdownImageIndex], "Markdown image span");
			if (match.start >= lineEnd) break;
			if (line.length <= MAX_MARKDOWN_IMAGE_LINE_LENGTH && lineImages.length < MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE && match.start >= lineOffset && match.end <= lineEnd) lineImages.push({
				...match,
				start: match.start - lineOffset,
				end: match.end - lineOffset
			});
		}
		let codeBlock = codeBlocks[codeBlockIndex];
		while (codeBlock && lineOffset >= codeBlock.end) {
			codeBlockIndex += 1;
			codeBlock = codeBlocks[codeBlockIndex];
		}
		if (codeBlock && lineEnd > codeBlock.start) {
			keepLine(line);
			pushTextSegment(line);
			lineOffset += line.length + lineSeparator.length;
			continue;
		}
		const linePrefix = line.trimStart().slice(0, 6);
		if (!extractMediaDirectives || !linePrefix.toUpperCase().startsWith("MEDIA:")) {
			const markdownImageResult = extractMarkdownImages ? collectMarkdownImageSegments({
				line,
				matches: lineImages,
				media,
				allowlist: markdownImageAllowlist,
				preserveTrailingWhitespace: options.preserveTrailingWhitespace
			}) : {
				lineSegments: [],
				foundMedia: false
			};
			if (!markdownImageResult.foundMedia) {
				keepLine(line);
				pushTextSegment(line);
			} else {
				foundMediaToken = true;
				if (markdownImageResult.cleanedLine !== void 0) keepLine(markdownImageResult.cleanedLine);
				for (const segment of markdownImageResult.lineSegments) {
					if (segment.type === "text") {
						pushTextSegment(segment.text);
						continue;
					}
					segments.push(segment);
				}
			}
			lineOffset += line.length + lineSeparator.length;
			continue;
		}
		const match = MEDIA_TOKEN_RE.exec(line);
		if (!match) {
			keepLine(line);
			pushTextSegment(line);
			lineOffset += line.length + lineSeparator.length;
			continue;
		}
		const payload = expectDefined(match[1], "parse regex capture 1");
		const quotedList = readQuotedMediaReferenceList(payload);
		const stripped = unwrapQuoted(payload);
		const unwrapped = quotedList ? void 0 : stripped;
		const payloadValue = unwrapped ?? payload;
		const parts = quotedList ?? (unwrapped ? [unwrapped] : splitMediaDirectiveParts(payload));
		const mediaStartIndex = media.length;
		const rejectedBefore = rejectedMediaCount;
		const invalidParts = [];
		for (const part of parts) {
			const quotedPart = unwrapped === void 0 ? unwrapQuoted(part) : void 0;
			const candidate = unwrapped ?? quotedPart ?? cleanCandidate(part);
			if (isValidMedia(candidate, {
				allowSpaces: true,
				allowBareFilename: quotedList !== null
			})) media.push(candidate);
			else if (beginsIndependentMediaSource(candidate) || looksLikeLocalFilePath(candidate)) {
				rejectedMediaCount += 1;
				foundMediaToken = true;
			} else if (!/\s/.test(part) || !hasTraversalOrUnsupportedHomeDirPrefix(candidate)) invalidParts.push(part);
		}
		const trimmedPayload = (stripped ?? payload).trim();
		const looksLikeLocalPath = looksLikeLocalFilePath(trimmedPayload) || FILE_URL_PREFIX_RE.test(trimmedPayload);
		if (quotedList === null && !unwrapped && media.length - mediaStartIndex === 1 && invalidParts.length > 0 && !parts.slice(1).some(beginsIndependentMediaSource) && /\s/.test(payloadValue) && looksLikeLocalPath) {
			const fallback = cleanCandidate(payloadValue);
			if (isValidMedia(fallback, { allowSpaces: true })) {
				media.splice(mediaStartIndex, media.length - mediaStartIndex, fallback);
				invalidParts.length = 0;
			}
		}
		if (quotedList === null && media.length === mediaStartIndex) {
			const fallback = unwrapped ?? cleanCandidate(payloadValue);
			if (isValidMedia(fallback, {
				allowSpaces: true,
				allowBareFilename: true
			})) {
				media.push(fallback);
				invalidParts.length = 0;
			}
		}
		let cleanedLine;
		if (media.length > mediaStartIndex) {
			foundMediaToken = true;
			for (const url of media.slice(mediaStartIndex)) segments.push({
				type: "media",
				url
			});
			cleanedLine = cleanLineText(invalidParts.join(" "));
		} else if (looksLikeLocalPath || rejectedMediaCount > rejectedBefore) {
			foundMediaToken = true;
			cleanedLine = "";
		} else cleanedLine = cleanLineText(line);
		if (cleanedLine) {
			keepLine(cleanedLine);
			pushTextSegment(cleanedLine);
		}
		lineOffset += line.length + lineSeparator.length;
	}
	const visibleText = keptLines.join("").replace(/^(?:[ \t]*(?:\r\n|\r|\n))+/, "");
	const audioTagResult = options.extractAudioDirectives === false ? {
		text: visibleText,
		audioAsVoice: false
	} : parseInlineDirectives(visibleText, {
		stripReplyTags: false,
		preserveTrailingWhitespace: options.preserveTrailingWhitespace,
		onAudioDirective: options.onAudioDirective
	});
	const cleanedText = options.preserveTrailingWhitespace ? audioTagResult.text : audioTagResult.text.trimEnd();
	const hasAudioAsVoice = audioTagResult.audioAsVoice;
	if (media.length === 0) {
		const parsedText = foundMediaToken || hasAudioAsVoice ? cleanedText : trimmedRaw;
		const result = {
			text: parsedText,
			segments: parsedText ? [{
				type: "text",
				text: parsedText
			}] : [],
			...rejectedMediaCount > 0 ? { rejectedMediaCount } : {}
		};
		if (hasAudioAsVoice) result.audioAsVoice = true;
		return result;
	}
	return {
		text: cleanedText,
		mediaUrls: media,
		...rejectedMediaCount > 0 ? { rejectedMediaCount } : {},
		segments: segments.length > 0 ? segments : [{
			type: "text",
			text: cleanedText
		}],
		...hasAudioAsVoice ? { audioAsVoice: true } : {}
	};
}
//#endregion
export { splitMediaOutput as n, isRelativeAssistantMediaReference as t };
