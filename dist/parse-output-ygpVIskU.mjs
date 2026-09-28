import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { b as parseLooseIpAddress, c as isIpv4Address, i as isCanonicalDottedDecimalIPv4, n as isBlockedSpecialUseIpv4Address, r as isBlockedSpecialUseIpv6Address, t as extractEmbeddedIpv4FromIpv6, u as isLegacyIpv4Literal, v as parseCanonicalIpAddress } from "./ip-CDH5BTTD.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { n as parseInlineDirectives } from "./directive-tags-D9uZSb5h.mjs";
//#region src/media/parse-output.ts
/** Captures legacy MEDIA: attachment directives from model/tool output. */
const MEDIA_TOKEN_RE = /\bMEDIA:\s*`?([^\n]+)`?/gi;
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
function isLikelyLocalPath(candidate) {
	if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
	return candidate.startsWith("/") || candidate.startsWith("./") || isSupportedHomeRelativePath(candidate) || WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\") || !SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\"));
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
	if (isLikelyLocalPath(candidate)) return true;
	if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
	if (opts?.allowBareFilename && !SCHEME_RE.test(candidate) && HAS_FILE_EXT.test(candidate)) return true;
	return false;
}
function beginsIndependentMediaSource(raw) {
	const candidate = normalizeMediaSource(cleanCandidate(raw));
	return MEDIA_SOURCE_ROOT_RE.test(candidate) || SCHEME_RE.test(candidate);
}
function splitUnquotedMediaDirectiveParts(payload) {
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
function normalizeMarkdownImageDestination(destination) {
	return normalizeMediaSource(destination.trim());
}
function cleanLineText(text) {
	return text.replace(/[ \t]{2,}/g, " ").trim();
}
const MAX_MARKDOWN_IMAGE_LINE_LENGTH = 2e4;
const MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE = 50;
function isRemoteMarkdownImageMedia(candidate) {
	return hasHttpUrlPrefix(candidate) && isValidMedia(candidate);
}
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
		const target = normalizeMarkdownImageDestination(match.destination);
		const selectedTarget = params.allowlist?.get(target);
		if (selectedTarget || !params.allowlist && isRemoteMarkdownImageMedia(target)) {
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
	const markdownImageAllowlist = imageExtraction?.allowlist === void 0 ? void 0 : new Map(imageExtraction.allowlist.map((source) => [normalizeMarkdownImageDestination(source), source]));
	const extractMarkdownImages = imageExtraction !== void 0;
	const extractMediaDirectives = options.extractMediaDirectives !== false;
	const mayContainMediaToken = extractMediaDirectives && /media:/i.test(trimmedRaw);
	const mayContainMarkdownImage = extractMarkdownImages && trimmedRaw.includes("![");
	const mayContainAudioTag = trimmedRaw.includes("[[");
	if (!mayContainMediaToken && !mayContainMarkdownImage && !mayContainAudioTag) return { text: trimmedRaw };
	const media = [];
	let foundMediaToken = false;
	const segments = [];
	let lastTextSegment;
	const pushTextSegment = (text) => {
		const last = segments[segments.length - 1];
		if (last?.type === "text") last.text = `${last.text}\n${text.trim() ? text : ""}`;
		else if (!text.trim()) {
			if (last?.type === "media" && lastTextSegment && !lastTextSegment.text.endsWith("\n")) lastTextSegment.text += "\n";
		} else {
			lastTextSegment = {
				type: "text",
				text
			};
			segments.push(lastTextSegment);
		}
	};
	const codeBlocks = findCodeRegions(trimmedRaw).filter((region) => region.block);
	const lines = trimmedRaw.split("\n");
	const keptLines = [];
	const markdownImages = mayContainMarkdownImage && lines.some((line) => line.length <= MAX_MARKDOWN_IMAGE_LINE_LENGTH && line.includes("![")) ? imageExtraction.scan(trimmedRaw) : [];
	let markdownImageIndex = 0;
	let lineOffset = 0;
	let codeBlockIndex = 0;
	for (const line of lines) {
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
			keptLines.push(line);
			pushTextSegment(line);
			lineOffset += line.length + 1;
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
				keptLines.push(line);
				pushTextSegment(line);
			} else {
				foundMediaToken = true;
				if (markdownImageResult.cleanedLine !== void 0) keptLines.push(markdownImageResult.cleanedLine);
				for (const segment of markdownImageResult.lineSegments) {
					if (segment.type === "text") {
						pushTextSegment(segment.text);
						continue;
					}
					segments.push(segment);
				}
			}
			lineOffset += line.length + 1;
			continue;
		}
		const matches = Array.from(line.matchAll(MEDIA_TOKEN_RE));
		if (matches.length === 0) {
			keptLines.push(line);
			pushTextSegment(line);
			lineOffset += line.length + 1;
			continue;
		}
		const pieces = [];
		const lineSegments = [];
		let cursor = 0;
		for (const match of matches) {
			const start = match.index ?? 0;
			pieces.push(line.slice(cursor, start));
			const payload = expectDefined(match[1], "parse regex capture 1");
			const unwrapped = unwrapQuoted(payload);
			const payloadValue = unwrapped ?? payload;
			const parts = unwrapped ? [unwrapped] : splitUnquotedMediaDirectiveParts(payload);
			const mediaStartIndex = media.length;
			let validCount = 0;
			const invalidParts = [];
			let hasValidMedia = false;
			for (const part of parts) {
				const candidate = unwrapped === void 0 ? cleanCandidate(part) : part;
				if (isValidMedia(candidate, { allowSpaces: Boolean(unwrapped) || /\s/.test(candidate) })) {
					media.push(candidate);
					hasValidMedia = true;
					foundMediaToken = true;
					validCount += 1;
				} else if (!/\s/.test(part) || !hasTraversalOrUnsupportedHomeDirPrefix(candidate)) invalidParts.push(part);
			}
			const trimmedPayload = payloadValue.trim();
			const looksLikeLocalPath = looksLikeLocalFilePath(trimmedPayload) || FILE_URL_PREFIX_RE.test(trimmedPayload);
			if (!unwrapped && validCount === 1 && invalidParts.length > 0 && !parts.slice(1).some(beginsIndependentMediaSource) && /\s/.test(payloadValue) && looksLikeLocalPath) {
				const fallback = cleanCandidate(payloadValue);
				if (isValidMedia(fallback, { allowSpaces: true })) {
					media.splice(mediaStartIndex, media.length - mediaStartIndex, fallback);
					hasValidMedia = true;
					foundMediaToken = true;
					invalidParts.length = 0;
				}
			}
			if (!hasValidMedia) {
				const fallback = unwrapped ?? cleanCandidate(payloadValue);
				if (isValidMedia(fallback, {
					allowSpaces: true,
					allowBareFilename: true
				})) {
					media.push(fallback);
					hasValidMedia = true;
					foundMediaToken = true;
					invalidParts.length = 0;
				}
			}
			if (hasValidMedia) {
				const beforeText = cleanLineText(pieces.join(""));
				if (beforeText) lineSegments.push({
					type: "text",
					text: beforeText
				});
				pieces.length = 0;
				for (const url of media.slice(mediaStartIndex)) lineSegments.push({
					type: "media",
					url
				});
				if (invalidParts.length > 0) pieces.push(invalidParts.join(" "));
			} else if (looksLikeLocalPath) foundMediaToken = true;
			else pieces.push(match[0]);
			cursor = start + match[0].length;
		}
		pieces.push(line.slice(cursor));
		const cleanedLine = cleanLineText(pieces.join(""));
		if (cleanedLine) {
			keptLines.push(cleanedLine);
			lineSegments.push({
				type: "text",
				text: cleanedLine
			});
		}
		for (const segment of lineSegments) {
			if (segment.type === "text") {
				pushTextSegment(segment.text);
				continue;
			}
			segments.push(segment);
		}
		lineOffset += line.length + 1;
	}
	const visibleText = keptLines.join("\n").replace(/^(?:[ \t]*\n)+/, "");
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
			}] : []
		};
		if (hasAudioAsVoice) result.audioAsVoice = true;
		return result;
	}
	return {
		text: cleanedText,
		mediaUrls: media,
		segments: segments.length > 0 ? segments : [{
			type: "text",
			text: cleanedText
		}],
		...hasAudioAsVoice ? { audioAsVoice: true } : {}
	};
}
//#endregion
export { splitMediaOutput as n, isRelativeAssistantMediaReference as t };
