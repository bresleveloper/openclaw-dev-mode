import { n as appendRegularFile } from "../../fs-safe-BAPek8At.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/hooks/bundled/command-logger/handler.ts
/**
* Example hook handler: Log command lifecycle events to a file
*
* This handler demonstrates how to create a hook that logs emitted command events
* to a centralized log file for audit/debugging purposes.
*
* Enable this bundled hook with `openclaw hooks enable command-logger` or config:
*
* ```json
* {
*   "hooks": {
*     "internal": {
*       "entries": {
*         "command-logger": { "enabled": true }
*       }
*     }
*   }
* }
* ```
*/
const log = createSubsystemLogger("command-logger");
/**
* Log emitted command events to a file
*/
const logCommand = async (event) => {
	if (event.type !== "command") return;
	try {
		const stateDir = resolveStateDir(process.env, os.homedir);
		const logDir = path.join(stateDir, "logs");
		await fs.mkdir(logDir, { recursive: true });
		const logFile = path.join(logDir, "commands.log");
		const logLine = JSON.stringify({
			timestamp: event.timestamp.toISOString(),
			action: event.action,
			sessionKey: event.sessionKey,
			senderId: event.context.senderId ?? "unknown",
			source: event.context.commandSource ?? "unknown"
		}) + "\n";
		await appendRegularFile({
			filePath: logFile,
			content: logLine,
			rejectSymlinkParents: true
		});
	} catch (err) {
		const message = formatErrorMessage(err);
		log.error(`Failed to log command: ${message}`);
	}
};
//#endregion
export { logCommand as default };
