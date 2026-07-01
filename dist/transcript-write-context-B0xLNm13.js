import { appendFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/transcript-jsonl.ts
/** Serializes one JSONL entry and appends the newline terminator. */
function serializeJsonlEntry(entry) {
	return `${serializeJsonlLine(entry)}\n`;
}
function serializeJsonlLine(entry) {
	return JSON.stringify(entry);
}
function serializeJsonlEntries(entries) {
	return serializeJsonlLines(entries.map(serializeJsonlLine));
}
function serializeJsonlLines(lines) {
	return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}
function writeJsonlEntriesSync(filePath, entries) {
	const content = serializeJsonlEntries(entries);
	writeFileSync(filePath, content, "utf-8");
	return content;
}
function appendJsonlEntrySync(filePath, entry, options) {
	return appendSerializedJsonlEntrySync(filePath, serializeJsonlEntry(entry), options);
}
function appendSerializedJsonlEntrySync(filePath, serializedEntry, options) {
	const content = options?.prefixNewline ? `\n${serializedEntry}` : serializedEntry;
	appendFileSync(filePath, content, "utf-8");
	return content;
}
async function writeJsonlEntry(filePath, entry, options) {
	await fs$1.writeFile(filePath, serializeJsonlEntry(entry), {
		encoding: options?.encoding ?? "utf-8",
		...options?.flag ? { flag: options.flag } : {},
		...options?.mode !== void 0 ? { mode: options.mode } : {}
	});
}
async function writeJsonlLines(filePath, lines, options) {
	const content = serializeJsonlLines(lines);
	await fs$1.writeFile(filePath, content, {
		encoding: options?.encoding ?? "utf-8",
		...options?.flag ? { flag: options.flag } : {},
		...options?.mode !== void 0 ? { mode: options.mode } : {}
	});
	return content;
}
async function appendJsonlEntry(filePath, entry) {
	await appendSerializedJsonlEntry(filePath, serializeJsonlEntry(entry));
}
async function appendSerializedJsonlEntry(filePath, serializedEntry) {
	const handle = await fs$1.open(filePath, "a+", 384);
	try {
		const stat = await handle.stat();
		let prefixNewline = false;
		if (stat.size > 0) {
			const lastByte = Buffer.allocUnsafe(1);
			const { bytesRead } = await handle.read(lastByte, 0, 1, stat.size - 1);
			prefixNewline = bytesRead === 1 && lastByte[0] !== 10;
		}
		await handle.appendFile(`${prefixNewline ? "\n" : ""}${serializedEntry}`, "utf-8");
	} finally {
		await handle.close();
	}
}
//#endregion
//#region src/config/sessions/transcript-write-context.ts
const ownedTranscriptWriteContext = new AsyncLocalStorage();
function normalizePathForCompare(value) {
	const trimmed = value?.trim();
	return trimmed ? path.resolve(trimmed) : void 0;
}
function contextMatches(params) {
	const contextSessionFile = normalizePathForCompare(params.context.sessionFile);
	const sessionFile = normalizePathForCompare(params.sessionFile);
	if (contextSessionFile && sessionFile) return contextSessionFile === sessionFile;
	const contextSessionKey = params.context.sessionKey?.trim();
	const sessionKey = params.sessionKey?.trim();
	return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}
/** Runs transcript writes with an owned write-lock context. */
async function withOwnedSessionTranscriptWrites(context, run) {
	return await ownedTranscriptWriteContext.run(context, run);
}
function bindOwnedSessionTranscriptWrites(context, run) {
	return (...args) => ownedTranscriptWriteContext.run(context, () => run(...args));
}
function resolveOwnedSessionTranscriptWriteLockRunner(params) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || !contextMatches({
		context,
		...params
	})) return;
	return context.withSessionWriteLock;
}
function canAdvanceOwnedSessionEntryCache(params) {
	const context = ownedTranscriptWriteContext.getStore();
	return Boolean(context && contextMatches({
		context,
		...params
	}) && context.publishSessionFileSnapshot && context.canAdvanceSessionEntryCache?.(params.snapshot));
}
function publishOwnedSessionFileSnapshot(params) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || !contextMatches({
		context,
		...params
	}) || !context.publishSessionFileSnapshot) return;
	return context.publishSessionFileSnapshot(params.snapshot);
}
//#endregion
export { withOwnedSessionTranscriptWrites as a, appendSerializedJsonlEntry as c, serializeJsonlLine as d, writeJsonlEntriesSync as f, resolveOwnedSessionTranscriptWriteLockRunner as i, appendSerializedJsonlEntrySync as l, writeJsonlLines as m, canAdvanceOwnedSessionEntryCache as n, appendJsonlEntry as o, writeJsonlEntry as p, publishOwnedSessionFileSnapshot as r, appendJsonlEntrySync as s, bindOwnedSessionTranscriptWrites as t, serializeJsonlEntry as u };
