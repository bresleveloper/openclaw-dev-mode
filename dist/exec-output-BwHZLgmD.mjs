import { j as resolveIntegerOption, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import process from "node:process";
import { isUtf8 } from "node:buffer";
import { StringDecoder } from "node:string_decoder";
//#region src/process/exec-output.ts
const DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16777216;
const MAX_PRESERVED_PENDING_LINE_BYTES = 8192;
function createCapturedOutputBuffers() {
	return {
		chunks: [],
		bytes: 0,
		truncatedBytes: 0,
		preservedLines: [],
		decoder: new StringDecoder("utf8"),
		pendingLine: ""
	};
}
function resolveMaxOutputBytes(value, stream) {
	return resolveIntegerOption(asPositiveFiniteNumber(typeof value === "number" ? value : value?.[stream]), DEFAULT_COMMAND_OUTPUT_MAX_BYTES, { min: 1 });
}
function resolveOutputCapture(value, stream) {
	return (typeof value === "string" ? value : value?.[stream]) ?? "tail";
}
function shouldTerminateOnOutput(value, limit) {
	return typeof value === "boolean" ? value : value?.[limit] === true;
}
function appendCapturedOutput(capture, chunk, maxBytes, mode) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	if (mode === "discard") {
		capture.truncatedBytes += buffer.byteLength;
		return;
	}
	if (mode === "head") {
		const remaining = Math.max(0, maxBytes - capture.bytes);
		if (remaining > 0) {
			const kept = buffer.subarray(0, remaining);
			capture.chunks.push(kept.byteLength < buffer.byteLength ? Buffer.from(kept) : kept);
			capture.bytes += kept.byteLength;
		}
		capture.truncatedBytes += Math.max(0, buffer.byteLength - remaining);
		return;
	}
	if (buffer.byteLength >= maxBytes) {
		capture.chunks = [Buffer.from(buffer.subarray(buffer.byteLength - maxBytes))];
		capture.truncatedBytes += capture.bytes + buffer.byteLength - maxBytes;
		capture.bytes = maxBytes;
		return;
	}
	capture.chunks.push(buffer);
	capture.bytes += buffer.byteLength;
	while (capture.bytes > maxBytes && capture.chunks.length > 0) {
		const first = expectDefined(capture.chunks[0], "chunks entry at 0");
		const overflow = capture.bytes - maxBytes;
		if (first.byteLength <= overflow) {
			capture.chunks.shift();
			capture.bytes -= first.byteLength;
			capture.truncatedBytes += first.byteLength;
		} else {
			capture.chunks[0] = Buffer.from(first.subarray(overflow));
			capture.bytes -= overflow;
			capture.truncatedBytes += overflow;
		}
	}
}
function trimTruncatedUtf8Boundary(buffer, mode, truncatedBytes, forceUtf8) {
	if (truncatedBytes === 0 || buffer.length === 0 || process.platform === "win32" && !forceUtf8) return buffer;
	if (mode === "tail") {
		let start = 0;
		while (start < buffer.length && (expectDefined(buffer[start], "buffer byte") & 192) === 128) start += 1;
		return buffer.subarray(start);
	}
	for (let removed = 0; removed <= 3 && removed <= buffer.length; removed += 1) {
		const end = buffer.length - removed;
		if (isUtf8(buffer.subarray(0, end))) return buffer.subarray(0, end);
	}
	return buffer;
}
function finalizeCapturedOutput(capture, mode, forceUtf8 = false) {
	const buffered = Buffer.concat(capture.chunks, capture.bytes);
	const trimmed = trimTruncatedUtf8Boundary(buffered, mode, capture.truncatedBytes, forceUtf8);
	capture.truncatedBytes += buffered.byteLength - trimmed.byteLength;
	return trimmed;
}
function appendPreservedOutputLines(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || capture.preservedLines.length >= maxPreservedOutputLines) return;
	const text = Buffer.isBuffer(params.chunk) ? capture.decoder.write(params.chunk) : params.chunk;
	if (!text) return;
	const lines = (capture.pendingLine + text).split(/\r?\n/);
	capture.pendingLine = truncateUtf8Suffix(lines.pop() ?? "", params.maxPendingLineBytes);
	for (const line of lines) if (capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(line, params.stream)) capture.preservedLines.push(line);
}
function flushPreservedOutputLine(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || maxPreservedOutputLines <= 0) return;
	const trailing = truncateUtf8Suffix(capture.pendingLine + capture.decoder.end(), params.maxPendingLineBytes);
	capture.pendingLine = "";
	if (trailing && capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(trailing, params.stream)) capture.preservedLines.push(trailing);
}
//#endregion
export { finalizeCapturedOutput as a, resolveOutputCapture as c, createCapturedOutputBuffers as i, shouldTerminateOnOutput as l, appendCapturedOutput as n, flushPreservedOutputLine as o, appendPreservedOutputLines as r, resolveMaxOutputBytes as s, MAX_PRESERVED_PENDING_LINE_BYTES as t };
