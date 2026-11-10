import { Vt as FsSafeError } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import fs from "node:fs";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/byte-budget.js
function normalizeMaxBytes(value, options = {}) {
	const selected = value === void 0 ? options.defaultValue : value;
	if (selected === void 0 || selected === Number.POSITIVE_INFINITY) return selected;
	if (!Number.isSafeInteger(selected) || selected < 0) throw new RangeError("maxBytes must be a non-negative safe integer or Infinity");
	return selected;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/bounded-read.js
const READ_CHUNK_BYTES = 65536;
const MAX_INITIAL_READ_BYTES = 16777216;
function createInitialBuffer(maxBytes, size, allocate = Buffer.allocUnsafe) {
	return allocate(Math.min(maxBytes, size, MAX_INITIAL_READ_BYTES) + 1);
}
function createScratchBuffer(maxBytes, allocate = Buffer.allocUnsafe) {
	return allocate(Math.min(READ_CHUNK_BYTES, maxBytes + 1));
}
function growReadBuffer(buffer, maxBytes, allocate = Buffer.allocUnsafe) {
	const grown = allocate(Math.min(maxBytes + 1, Math.max(READ_CHUNK_BYTES, buffer.length * 2)));
	buffer.copy(grown);
	return grown;
}
function finishReadBuffer(buffer, total, allocate) {
	if (total === 0) return Buffer.alloc(0);
	const result = buffer.subarray(0, total);
	if (total >= buffer.length / 2) return result;
	if (!allocate) return Buffer.from(result);
	const compact = allocate(total);
	result.copy(compact);
	return compact;
}
function addReadBytes(total, bytesRead, maxBytes, createLimitError) {
	const next = total + bytesRead;
	if (next > maxBytes) {
		if (createLimitError) throw createLimitError();
		throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${next})`);
	}
	return next;
}
async function readBoundedAsync(maxBytes, readChunk, options = {}) {
	normalizeMaxBytes(maxBytes);
	let total = 0;
	const { observeRegularFileSize, createLimitError } = options;
	const allocate = options.unpooled ? Buffer.allocUnsafeSlow : void 0;
	const size = options.initialSize ?? observeRegularFileSize?.();
	let buffer = size === void 0 ? createScratchBuffer(maxBytes, allocate) : createInitialBuffer(maxBytes, size, allocate);
	if (size !== void 0) {
		const bytesRead = await readChunk(buffer, buffer.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, 0, allocate);
		const currentSize = bytesRead < buffer.length ? observeRegularFileSize?.() : void 0;
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
		if (currentSize !== void 0 && currentSize > 0 && bytesRead >= currentSize) return finishReadBuffer(buffer, total, allocate);
	}
	while (true) {
		if (total === buffer.length) buffer = growReadBuffer(buffer, maxBytes, allocate);
		const remaining = buffer.subarray(total);
		const bytesRead = await readChunk(remaining, remaining.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, total, allocate);
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
	}
}
/**
* Reads from the handle's current offset without closing it. A bounded read
* consumes at most maxBytes + 1 bytes so growth after an earlier stat cannot
* force an unbounded allocation.
*/
async function readFileHandleBounded(handle, maxBytes) {
	return await readFileHandleBoundedWithSize(handle, maxBytes);
}
function readFileHandleBoundedWithSize(handle, maxBytes, initialSize) {
	normalizeMaxBytes(maxBytes);
	const fd = "fd" in handle && typeof handle.fd === "number" ? handle.fd : void 0;
	return readBoundedAsync(maxBytes, async (scratch, length) => {
		return (await handle.read(scratch, 0, length, null)).bytesRead;
	}, {
		initialSize,
		observeRegularFileSize: fd === void 0 ? void 0 : () => regularFileSize(fd)
	});
}
function regularFileSize(fd) {
	try {
		const stat = fs.fstatSync(fd);
		return stat.isFile() && Number.isSafeInteger(stat.size) && stat.size >= 0 ? stat.size : void 0;
	} catch {
		return;
	}
}
function readBoundedSync(maxBytes, readChunk, options = {}) {
	normalizeMaxBytes(maxBytes);
	let total = 0;
	const { observeRegularFileSize, createLimitError } = options;
	const size = options.initialSize ?? observeRegularFileSize?.();
	let buffer = size === void 0 ? createScratchBuffer(maxBytes) : createInitialBuffer(maxBytes, size);
	if (size !== void 0) {
		const bytesRead = readChunk(buffer, buffer.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, 0);
		const currentSize = bytesRead < buffer.length ? observeRegularFileSize?.() : void 0;
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
		if (currentSize !== void 0 && currentSize > 0 && bytesRead >= currentSize) return finishReadBuffer(buffer, total);
	}
	while (true) {
		if (total === buffer.length) buffer = growReadBuffer(buffer, maxBytes);
		const remaining = buffer.subarray(total);
		const bytesRead = readChunk(remaining, remaining.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, total);
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
	}
}
/** Sync bounded read from a numeric descriptor. The caller owns the descriptor. */
function readFileDescriptorBoundedSync(fd, maxBytes) {
	return readBoundedSync(maxBytes, (buffer, length) => fs.readSync(fd, buffer, 0, length, null), {
		initialSize: maxBytes <= READ_CHUNK_BYTES ? maxBytes : void 0,
		observeRegularFileSize: () => regularFileSize(fd)
	});
}
//#endregion
export { normalizeMaxBytes as a, readFileHandleBoundedWithSize as i, readFileDescriptorBoundedSync as n, readFileHandleBounded as r, readBoundedSync as t };
