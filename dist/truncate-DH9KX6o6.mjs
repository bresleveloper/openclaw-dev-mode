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
	const truncatedBy = params.truncatedBy ?? null;
	const outputLines = params.outputLines ?? input.totalLines;
	const truncated = truncatedBy !== null;
	return {
		content: truncated && outputLines === 1 ? copyString(params.content) : params.content,
		truncated,
		truncatedBy,
		totalLines: input.totalLines,
		totalBytes: input.totalBytes,
		outputLines,
		outputBytes: params.outputBytes ?? input.totalBytes,
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
	if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) return buildTruncationResult(input, { content });
	const firstLineEnd = content.indexOf("\n");
	const firstLine = content.slice(0, firstLineEnd === -1 ? content.length : firstLineEnd);
	if (input.totalLines > 0 && utf8ByteLength(firstLine) > input.maxBytes) return buildTruncationResult(input, {
		content: "",
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
		truncatedBy,
		outputLines: outputLines.length,
		outputBytes: outputBytesCount
	});
}
//#endregion
export { truncateHead as i, DEFAULT_MAX_LINES as n, formatSize as r, DEFAULT_MAX_BYTES as t };
