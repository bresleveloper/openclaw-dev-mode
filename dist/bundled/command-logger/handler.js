import { r as resolveStateDir } from "../../state-dir-C8s3cOPX.mjs";
import "../../paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "../../errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { n as appendRegularFile } from "../../fs-safe-6Z4UiMS4.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/hooks/bundled/command-logger/handler.ts
const log = createSubsystemLogger("command-logger");
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
