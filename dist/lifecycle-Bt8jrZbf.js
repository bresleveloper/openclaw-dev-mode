import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { t as canonicalizeMainSessionAlias } from "./main-session-DWI7gPJU.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-CHZBIGhF.js";
import { n as isTerminalSessionStatus } from "./types-CoDcFuoc.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/config/sessions/lifecycle.ts
function resolveTimestamp(value) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
function resolvePositiveTimestamp(value) {
	const timestampMs = resolveTimestamp(value);
	return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function parseTimestampMs(value) {
	if (typeof value === "number") return resolveTimestamp(value);
	if (typeof value !== "string" || !value.trim()) return;
	return resolveTimestamp(Date.parse(value));
}
function readFirstLine(filePath) {
	try {
		const fd = fs.openSync(filePath, "r");
		try {
			const buffer = Buffer.alloc(8192);
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
			if (bytesRead <= 0) return;
			const chunk = buffer.subarray(0, bytesRead).toString("utf8");
			const newline = chunk.indexOf("\n");
			return newline >= 0 ? chunk.slice(0, newline) : chunk;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return;
	}
}
/** Reads session start time from a transcript header when store metadata is missing. */
function readSessionHeaderStartedAtMs(params) {
	const sessionId = params.entry?.sessionId?.trim();
	if (!sessionId) return;
	const pathOptions = params.pathOptions ?? resolveSessionFilePathOptions({
		agentId: params.agentId,
		storePath: params.storePath
	});
	let sessionFile;
	try {
		sessionFile = resolveSessionFilePath(sessionId, params.entry, pathOptions);
	} catch {
		return;
	}
	const firstLine = readFirstLine(sessionFile);
	if (!firstLine) return;
	try {
		const header = JSON.parse(firstLine);
		if (header.type !== "session") return;
		if (typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
		return parseTimestampMs(header.timestamp);
	} catch {
		return;
	}
}
function resolveSessionLifecycleTimestamps(params) {
	const entry = params.entry;
	if (!entry) return {};
	return {
		sessionStartedAt: resolveTimestamp(entry.sessionStartedAt) ?? readSessionHeaderStartedAtMs({
			entry,
			agentId: params.agentId,
			storePath: params.storePath,
			pathOptions: params.pathOptions
		}),
		lastInteractionAt: resolveTimestamp(entry.lastInteractionAt)
	};
}
function resolveTerminalMainSessionTranscriptRegistryCheck(params) {
	if (!params.entry || !params.sessionKey) return;
	const configuredMainSessionKey = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.mainKey ?? "main"
	});
	if (canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) !== configuredMainSessionKey) return;
	if (!(isTerminalSessionStatus(params.entry.status) || resolvePositiveTimestamp(params.entry.endedAt) !== void 0)) return;
	if (params.entry.status === "failed") return;
	const registryTimestampMs = resolvePositiveTimestamp(params.entry.updatedAt);
	if (registryTimestampMs === void 0) return;
	const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
	if (!sessionId) return;
	return {
		sessionId,
		registryTimestampMs
	};
}
function isTranscriptMtimeNewerThanRegistry(params) {
	const transcriptMtimeMs = Math.floor(params.transcriptMtimeMs);
	const registryTimestampMs = Math.floor(params.registryTimestampMs);
	return Number.isFinite(transcriptMtimeMs) && transcriptMtimeMs > registryTimestampMs;
}
function hasTerminalMainSessionTranscriptNewerThanRegistrySync(params) {
	const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
	if (!check) return false;
	const pathOptions = resolveSessionFilePathOptions({
		agentId: params.agentId,
		storePath: params.storePath
	});
	try {
		const sessionFile = resolveSessionFilePath(check.sessionId, params.entry, pathOptions);
		return isTranscriptMtimeNewerThanRegistry({
			transcriptMtimeMs: fs.statSync(sessionFile).mtimeMs,
			registryTimestampMs: check.registryTimestampMs
		});
	} catch {
		return false;
	}
}
async function hasTerminalMainSessionTranscriptNewerThanRegistry(params) {
	const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
	if (!check) return false;
	const pathOptions = resolveSessionFilePathOptions({
		agentId: params.agentId,
		storePath: params.storePath
	});
	try {
		const sessionFile = resolveSessionFilePath(check.sessionId, params.entry, pathOptions);
		return isTranscriptMtimeNewerThanRegistry({
			transcriptMtimeMs: (await fs$1.stat(sessionFile)).mtimeMs,
			registryTimestampMs: check.registryTimestampMs
		});
	} catch {
		return false;
	}
}
//#endregion
export { resolveTerminalMainSessionTranscriptRegistryCheck as a, resolveSessionLifecycleTimestamps as i, hasTerminalMainSessionTranscriptNewerThanRegistrySync as n, readSessionHeaderStartedAtMs as r, hasTerminalMainSessionTranscriptNewerThanRegistry as t };
