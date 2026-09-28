//#region packages/agent-core/src/harness/utils/truncate.ts
const DEFAULT_MAX_LINES = 2e3;
const DEFAULT_MAX_BYTES = 51200;
const runtimeBuffer = globalThis.Buffer;
function copyString(content) {
	return runtimeBuffer ? runtimeBuffer.from(content, "utf16le").toString("utf16le") : content;
}
function findFirstNonAscii(content) {
	for (let index = 0; index < content.length; index++) if (content.charCodeAt(index) > 127) return index;
	return -1;
}
function utf8ByteLength(content) {
	if (runtimeBuffer) return runtimeBuffer.byteLength(content, "utf8");
	const firstNonAscii = findFirstNonAscii(content);
	if (firstNonAscii === -1) return content.length;
	let bytes = firstNonAscii;
	for (let i = firstNonAscii; i < content.length; i++) {
		const code = content.charCodeAt(i);
		if (code <= 127) bytes += 1;
		else if (code <= 2047) bytes += 2;
		else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
			const next = content.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				bytes += 4;
				i++;
			} else bytes += 3;
		} else bytes += 3;
	}
	return bytes;
}
/**
* Format byte counts for compact tool-output diagnostics.
*/
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes}B`;
	else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
	return `${(bytes / 1048576).toFixed(1)}MB`;
}
function resolveTruncationInput(content, options) {
	let totalLines = content.length > 0 && !content.endsWith("\n") ? 1 : 0;
	for (let index = content.indexOf("\n"); index !== -1; index = content.indexOf("\n", index + 1)) totalLines++;
	return {
		totalLines,
		totalBytes: utf8ByteLength(content),
		maxLines: options.maxLines ?? 2e3,
		maxBytes: options.maxBytes ?? 51200
	};
}
function buildTruncationResult(input, params) {
	return {
		content: params.truncated && params.outputLines === 1 ? copyString(params.content) : params.content,
		truncated: params.truncated,
		truncatedBy: params.truncatedBy,
		totalLines: input.totalLines,
		totalBytes: input.totalBytes,
		outputLines: params.outputLines,
		outputBytes: params.outputBytes,
		lastLinePartial: params.lastLinePartial ?? false,
		firstLineExceedsLimit: params.firstLineExceedsLimit ?? false,
		maxLines: input.maxLines,
		maxBytes: input.maxBytes
	};
}
/**
* Keep the beginning of content while respecting independent line and byte ceilings.
*
* Head truncation preserves complete lines; a first line that exceeds the byte
* ceiling produces empty output and sets firstLineExceedsLimit.
*/
function truncateHead(content, options = {}) {
	const input = resolveTruncationInput(content, options);
	if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) return buildTruncationResult(input, {
		content,
		truncated: false,
		truncatedBy: null,
		outputLines: input.totalLines,
		outputBytes: input.totalBytes
	});
	const firstLineEnd = content.indexOf("\n");
	const firstLine = content.slice(0, firstLineEnd === -1 ? content.length : firstLineEnd);
	if (input.totalLines > 0 && utf8ByteLength(firstLine) > input.maxBytes) return buildTruncationResult(input, {
		content: "",
		truncated: true,
		truncatedBy: "bytes",
		outputLines: 0,
		outputBytes: 0,
		firstLineExceedsLimit: true
	});
	const outputLines = [];
	let outputBytesCount = 0;
	let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
	const lineLimit = Math.trunc(input.maxLines) || 0;
	const selectedLines = Math.min(input.totalLines, lineLimit < 0 ? input.totalLines + lineLimit : lineLimit);
	for (let start = 0; outputLines.length < selectedLines;) {
		const newline = content.indexOf("\n", start);
		const end = newline === -1 ? content.length : newline;
		const line = content.slice(start, end);
		const lineBytes = utf8ByteLength(line) + (outputLines.length > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > input.maxBytes) {
			truncatedBy = "bytes";
			break;
		}
		outputLines.push(line);
		start = end + 1;
		outputBytesCount += lineBytes;
	}
	if (input.totalLines > input.maxLines && outputLines.length >= input.maxLines && outputBytesCount <= input.maxBytes) truncatedBy = "lines";
	return buildTruncationResult(input, {
		content: outputLines.join("\n"),
		truncated: true,
		truncatedBy,
		outputLines: outputLines.length,
		outputBytes: outputBytesCount
	});
}
/**
* Keep the end of content while respecting independent line and byte ceilings.
*
* Tail truncation preserves recent output for command errors and may keep a
* partial first line when one final line alone exceeds the byte ceiling.
*/
function truncateTail(content, options = {}) {
	const input = resolveTruncationInput(content, options);
	if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) return buildTruncationResult(input, {
		content,
		truncated: false,
		truncatedBy: null,
		outputLines: input.totalLines,
		outputBytes: input.totalBytes
	});
	const outputLines = [];
	let outputBytesCount = 0;
	let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
	let lastLinePartial = false;
	let end = content.length - (content.endsWith("\n") ? 1 : 0);
	while (outputLines.length < input.totalLines && outputLines.length < input.maxLines) {
		const start = end > 0 ? content.lastIndexOf("\n", end - 1) + 1 : 0;
		const line = content.slice(start, end);
		const lineBytes = utf8ByteLength(line) + (outputLines.length > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > input.maxBytes) {
			truncatedBy = "bytes";
			if (outputLines.length === 0) {
				const partialLine = truncateStringToBytesFromEnd(line, input.maxBytes);
				outputLines.push(partialLine);
				outputBytesCount = utf8ByteLength(partialLine);
				lastLinePartial = true;
			}
			break;
		}
		outputLines.push(line);
		end = start - 1;
		outputBytesCount += lineBytes;
	}
	if (input.totalLines > input.maxLines && outputLines.length >= input.maxLines && outputBytesCount <= input.maxBytes) truncatedBy = "lines";
	return buildTruncationResult(input, {
		content: outputLines.toReversed().join("\n"),
		truncated: true,
		truncatedBy,
		outputLines: outputLines.length,
		outputBytes: outputBytesCount,
		lastLinePartial
	});
}
/**
* Truncate a string to fit within a byte limit (from the end).
* Handles multi-byte UTF-8 characters correctly.
*/
function truncateStringToBytesFromEnd(str, maxBytes) {
	if (maxBytes <= 0) return "";
	let outputBytes = 0;
	let start = str.length;
	let unchangedEnd = str.length;
	let repairedTail = "";
	for (let i = str.length; i > 0;) {
		let characterStart = i - 1;
		const code = str.charCodeAt(characterStart);
		let characterBytes;
		let unpairedSurrogate = false;
		if (code >= 56320 && code <= 57343 && characterStart > 0) {
			const previous = str.charCodeAt(characterStart - 1);
			if (previous >= 55296 && previous <= 56319) {
				characterStart--;
				characterBytes = 4;
			} else {
				characterBytes = 3;
				unpairedSurrogate = true;
			}
		} else if (code >= 55296 && code <= 57343) {
			characterBytes = 3;
			unpairedSurrogate = true;
		} else characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
		if (outputBytes + characterBytes > maxBytes) break;
		outputBytes += characterBytes;
		start = characterStart;
		if (unpairedSurrogate) {
			repairedTail = "�" + str.slice(i, unchangedEnd) + repairedTail;
			unchangedEnd = characterStart;
		}
		i = characterStart;
	}
	return str.slice(start, unchangedEnd) + repairedTail;
}
/**
* Trim a single display line and mark it with the grep-style truncation suffix.
*
* The cut point is backed off by one code unit when it would otherwise split a
* surrogate pair, so emoji / CJK Extension B characters crossing the boundary
* stay intact instead of rendering as replacement characters.
*/
function truncateLine(line, maxChars = 500) {
	if (line.length <= maxChars) return {
		text: line,
		wasTruncated: false
	};
	let cut = maxChars;
	if (cut < line.length) {
		const lastCode = line.charCodeAt(cut - 1);
		if (lastCode >= 55296 && lastCode <= 56319) {
			const nextCode = line.charCodeAt(cut);
			if (nextCode >= 56320 && nextCode <= 57343) cut -= 1;
		}
	}
	return {
		text: `${copyString(line.slice(0, cut))}... [truncated]`,
		wasTruncated: true
	};
}
//#endregion
export { truncateLine as a, truncateHead as i, DEFAULT_MAX_LINES as n, truncateTail as o, formatSize as r, DEFAULT_MAX_BYTES as t };
