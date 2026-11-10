import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { o as resolveSessionFilePathCore } from "./paths-YgcBNLgG.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-session-sqlite-transcript-file.ts
function resolveActiveSqliteTranscriptFile(target, entry) {
	let transcriptPath;
	try {
		transcriptPath = resolveSessionFilePathCore(entry.sessionId, entry, {
			agentId: target.agentId,
			sessionsDir: path.dirname(target.storePath)
		});
	} catch {
		return;
	}
	if (!transcriptPath.endsWith(".jsonl")) return;
	try {
		if (!fs.statSync(transcriptPath).isFile()) return;
	} catch {
		return;
	}
	const sessionsDir = resolveRealpathOrAbsolute(path.dirname(target.storePath));
	const activePath = resolveRealpathOrAbsolute(transcriptPath);
	return path.dirname(activePath) === sessionsDir ? activePath : void 0;
}
//#endregion
export { resolveActiveSqliteTranscriptFile as t };
