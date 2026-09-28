import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as clamp } from "./utils-aKqR_F_U.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { C as resolveRedactOptions, g as redactSensitiveLines } from "./redact-B5EGyLvV.mjs";
import { d as isRollingLogFilePath, f as isSameRollingLogFileFamily, u as getResolvedLoggerFileTarget } from "./logger--ALOusOG.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { StringDecoder } from "node:string_decoder";
//#region src/logging/parse-log-line.ts
function extractMessage(value) {
	const parts = [];
	for (const key of Object.keys(value)) {
		if (!/^\d+$/.test(key)) continue;
		const item = value[key];
		if (typeof item === "string") parts.push(item);
		else if (item != null) parts.push(JSON.stringify(item));
	}
	return parts.join(" ");
}
function parseMetaName(raw) {
	if (typeof raw !== "string" || !raw.trimStart().startsWith("{")) return {};
	try {
		const parsed = JSON.parse(raw);
		return {
			subsystem: typeof parsed.subsystem === "string" ? parsed.subsystem : void 0,
			module: typeof parsed.module === "string" ? parsed.module : void 0,
			plugin: typeof parsed.plugin === "string" ? parsed.plugin : void 0
		};
	} catch {
		return {};
	}
}
function resolveContext(value, meta) {
	const metadataContext = parseMetaName(meta?.name);
	if (meta?.name === value["0"]) return metadataContext;
	const positionalContext = parseMetaName(value["0"]);
	return {
		subsystem: metadataContext.subsystem ?? positionalContext.subsystem,
		module: metadataContext.module ?? positionalContext.module,
		plugin: metadataContext.plugin ?? positionalContext.plugin
	};
}
/** Parses a raw log line into compact metadata and message text, or null for non-JSON lines. */
function parseLogLine(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed)) return null;
		const meta = isRecord(parsed["_meta"]) ? parsed["_meta"] : void 0;
		const context = resolveContext(parsed, meta);
		const levelRaw = typeof meta?.logLevelName === "string" ? meta.logLevelName : parsed.level;
		return {
			time: typeof parsed.time === "string" ? parsed.time : typeof meta?.date === "string" ? meta.date : void 0,
			level: normalizeOptionalLowercaseString(levelRaw),
			subsystem: context.subsystem ?? (typeof parsed.subsystem === "string" ? parsed.subsystem : void 0),
			module: context.module,
			plugin: context.plugin,
			message: typeof parsed.message === "string" ? parsed.message : extractMessage(parsed),
			raw
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/logging/log-tail.ts
const DEFAULT_LIMIT = 500;
const DEFAULT_MAX_BYTES = 25e4;
const MAX_LIMIT = 5e3;
const MAX_BYTES = 1e6;
function missingPathToNull(error) {
	if (!isMissingPathError(error)) throw error;
	return null;
}
/** Resolves a rolling daily log path to the newest existing rolling log when needed. */
async function resolveLogFile(file, options) {
	const stat = await fs.stat(file).catch(missingPathToNull);
	const source = {
		file,
		stat
	};
	if (stat || !(options?.rolling ?? isRollingLogFilePath(file))) return source;
	const dir = path.dirname(file);
	const entries = await fs.readdir(dir, { withFileTypes: true }).catch(missingPathToNull);
	if (!entries) return source;
	return (await Promise.all(entries.filter((entry) => entry.isFile() && isSameRollingLogFileFamily(file, entry.name)).map(async (entry) => {
		const fullPath = path.join(dir, entry.name);
		const fileStat = await fs.stat(fullPath).catch(missingPathToNull);
		return fileStat ? {
			file: fullPath,
			stat: fileStat
		} : null;
	}))).filter((entry) => Boolean(entry)).toSorted((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)[0] ?? source;
}
async function readLogSlice(params) {
	const { stat } = params;
	if (stat && !stat.isFile()) throw new Error(`Log path is not a regular file: ${params.file}`);
	const size = stat?.size ?? 0;
	const maxBytes = clamp(params.maxBytes, 1, MAX_BYTES);
	const limit = clamp(params.limit, 1, MAX_LIMIT);
	let cursor = typeof params.cursor === "number" && Number.isFinite(params.cursor) ? Math.max(0, Math.floor(params.cursor)) : void 0;
	let reset = false;
	let skippedBytes;
	let truncated = false;
	let start;
	if (cursor != null) {
		if (cursor > size) {
			reset = true;
			start = Math.max(0, size - maxBytes);
			truncated = start > 0;
		} else {
			start = cursor;
			if (size - start > maxBytes) {
				reset = true;
				truncated = true;
				const boundedStart = Math.max(0, size - maxBytes);
				skippedBytes = boundedStart - start;
				start = boundedStart;
			}
		}
	} else {
		start = Math.max(0, size - maxBytes);
		truncated = start > 0;
	}
	if (size === 0 || size <= start) return {
		cursor: size,
		size,
		lines: [],
		truncated,
		reset,
		skippedBytes
	};
	const handle = await fs.open(params.file, "r").catch(missingPathToNull);
	if (!handle) return {
		cursor: 0,
		size: 0,
		lines: [],
		truncated: false,
		reset: cursor != null && cursor > 0
	};
	try {
		let prefix = "";
		if (start > 0) {
			const prefixBuf = Buffer.alloc(1);
			const prefixRead = await handle.read(prefixBuf, 0, 1, start - 1);
			prefix = prefixBuf.toString("utf8", 0, prefixRead.bytesRead);
		}
		const length = Math.max(0, size - start);
		const buffer = Buffer.alloc(length);
		const bytesRead = await readFileWindowFully(handle, buffer, start);
		let lines = buffer.toString("utf8", 0, bytesRead).split("\n");
		lines.pop();
		let lineOffset = 0;
		if (start > 0 && prefix !== "\n") {
			lines.shift();
			lineOffset = buffer.subarray(0, bytesRead).indexOf(10) + 1;
		}
		let selected = lines.map((line) => params.filter?.(line) ?? true);
		let selectedCount = selected.filter(Boolean).length;
		if (selectedCount > limit) {
			truncated = true;
			for (let index = 0; selectedCount > limit; index += 1) if (selected[index]) {
				selected[index] = false;
				selectedCount -= 1;
			}
		}
		const firstSelected = selected.indexOf(true);
		if (firstSelected > 0) {
			for (let index = 0; index < firstSelected; index += 1) lineOffset = buffer.indexOf(10, lineOffset) + 1;
			lines = lines.slice(firstSelected);
			selected = selected.slice(firstSelected);
		}
		const contexts = params.redaction.patterns.map((pattern) => pattern instanceof RegExp ? void 0 : pattern.createContext?.());
		let pending = contexts.filter((context) => context !== void 0);
		let contextEnd = start + lineOffset;
		if (selectedCount > 0 && contextEnd > 0 && pending.length > 0) {
			const prefixBuffer = Buffer.alloc(Math.min(contextEnd, DEFAULT_MAX_BYTES));
			let blockBytes = Math.min(4096, prefixBuffer.length);
			let cached;
			const readPrefix = async (offset, byteCount) => {
				if (offset >= start && offset + byteCount <= start + bytesRead) return buffer.subarray(offset - start, offset - start + byteCount);
				if (cached && offset >= cached.offset && offset + byteCount <= cached.offset + cached.length) return prefixBuffer.subarray(offset - cached.offset, offset - cached.offset + byteCount);
				const chunk = prefixBuffer.subarray(0, byteCount);
				if (await readFileWindowFully(handle, chunk, offset) !== byteCount) throw new Error("Log file changed while reading redaction context");
				cached = {
					offset,
					length: byteCount
				};
				return chunk;
			};
			while (contextEnd > 0 && pending.length > 0) {
				let search = Math.max(0, contextEnd - blockBytes);
				let chunk = await readPrefix(search, contextEnd - search);
				let newline = chunk.indexOf(10);
				let blockStart = search === 0 ? 0 : search + newline + 1;
				while (search > 0 && (newline < 0 || blockStart === contextEnd)) {
					const end = search;
					blockBytes = Math.min(prefixBuffer.length, blockBytes * 2);
					search = Math.max(0, end - blockBytes);
					chunk = await readPrefix(search, end - search);
					newline = chunk.lastIndexOf(10);
					blockStart = search === 0 && newline < 0 ? 0 : search + newline + 1;
				}
				const blocks = pending.map((context) => ({
					context,
					block: context.prepend()
				}));
				const decoder = new StringDecoder("utf8");
				for (let offset = blockStart; offset < contextEnd;) {
					const byteCount = Math.min(prefixBuffer.length, contextEnd - offset);
					const prefixText = decoder.write(await readPrefix(offset, byteCount));
					for (const { block } of blocks) block.consume(prefixText);
					offset += byteCount;
				}
				const finalText = decoder.end();
				for (const { block } of blocks) block.consume(finalText);
				pending = blocks.filter(({ block }) => !block.finish()).map(({ context }) => context);
				contextEnd = blockStart;
				blockBytes = Math.min(prefixBuffer.length, blockBytes * 2);
			}
		}
		const lastNewline = buffer.subarray(0, bytesRead).lastIndexOf(10);
		cursor = start + lastNewline + 1;
		return {
			cursor,
			size,
			lines: selectedCount === 0 ? [] : redactSensitiveLines(lines, {
				...params.redaction,
				patterns: params.redaction.patterns.map((pattern, index) => contexts[index]?.pattern ?? pattern)
			}, selected),
			truncated,
			reset,
			skippedBytes
		};
	} finally {
		await handle.close();
	}
}
/** Reads and redacts the configured log tail with bounded bytes and line count. */
async function readConfiguredLogTail(params, filter) {
	const target = getResolvedLoggerFileTarget();
	const { file, stat } = await resolveLogFile(target.file, { rolling: target.rolling });
	return {
		file,
		...await readLogSlice({
			file,
			stat,
			cursor: params?.cursor,
			limit: params?.limit ?? DEFAULT_LIMIT,
			maxBytes: params?.maxBytes ?? DEFAULT_MAX_BYTES,
			filter,
			redaction: resolveRedactOptions()
		})
	};
}
/** Reads the canonical configured tail and parses its already-redacted lines. */
async function readConfiguredParsedLogTail(params) {
	const tail = await readConfiguredLogTail(params, (raw) => {
		const parsed = parseLogLine(raw);
		return parsed !== null && (params?.filter?.(parsed) ?? true);
	});
	return {
		...tail,
		lines: tail.lines.flatMap((line) => {
			const parsed = parseLogLine(line);
			return parsed ? [parsed] : [];
		})
	};
}
//#endregion
export { readConfiguredParsedLogTail as n, parseLogLine as r, readConfiguredLogTail as t };
