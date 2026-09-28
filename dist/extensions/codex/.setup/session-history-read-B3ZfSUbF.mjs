import { n as codexHistoryRejectionReason, t as CodexHistoryRejection } from "./history-rejection-B4nOXNXF.mjs";
import { n as sanitizeCodexHistoryImagePayloads } from "./image-payload-sanitizer-tupAr-2o.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fs from "node:fs/promises";
import { SessionTranscriptReadFenceError, readCodexSessionContext } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
//#region extensions/codex/src/app-server/session-history-read.ts
function consumeCodexHistory(messages, header, sessionId, read, imageLabel = "codex mirrored history") {
	if (!isRecord(header) || header.type !== "session") return read([]);
	if (typeof header.id !== "string") throw new CodexHistoryRejection("malformed_header");
	if (header.id !== sessionId) return read([]);
	return read((function* () {
		for (const message of messages) yield sanitizeCodexHistoryImagePayloads(message, imageLabel);
	})());
}
/** Keeps native evidence and its synchronous consumer inside the same readonly snapshot. */
async function readCodexNativeHistory(target, sessionId, read, admission, onSnapshot) {
	const consume = (messages, header, version) => {
		try {
			onSnapshot?.(version);
			return {
				status: "ok",
				value: consumeCodexHistory(messages, header, sessionId, read)
			};
		} catch (error) {
			return {
				status: "rejected",
				reason: codexHistoryRejectionReason(error)
			};
		}
	};
	try {
		if (target.kind === "empty") return consume([], void 0);
		if (target.kind === "sqlite") return readCodexSessionContext(target.target, consume, admission);
		const { buildSessionContext, migrateSessionEntries, parseSessionEntries } = await import("openclaw/plugin-sdk/agent-sessions");
		const entries = parseSessionEntries(await fs.readFile(target.sessionFile, "utf-8"));
		return consume((function* () {
			migrateSessionEntries(entries);
			const sessionEntries = entries.filter((entry) => isRecord(entry) && entry.type !== "session");
			yield* buildSessionContext(sessionEntries).messages;
		})(), entries[0]);
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return consume([], void 0);
		return {
			status: "rejected",
			reason: error instanceof SessionTranscriptReadFenceError || isRecord(error) && (error.code === "EACCES" || error.code === "EPERM") ? "access_rejected" : codexHistoryRejectionReason(error)
		};
	}
}
//#endregion
export { readCodexNativeHistory as n, consumeCodexHistory as t };
