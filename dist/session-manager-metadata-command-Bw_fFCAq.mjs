import { r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
//#region src/agents/sessions/session-manager-metadata-command.ts
/** Both backends receive the same prepared CLI and pending-input custody facts. */
function prepareSessionManagerMetadataCommand(command, path, control) {
	const cliWriter = getCliHistoryWriter({
		...command.input.scope,
		storePath: path
	});
	if (command.type === "session.transcript.appendMessage" || command.type === "session.metadata.append") command.input = {
		...command.input,
		cliWriter: cliWriter && {
			runId: cliWriter.runId,
			authFingerprint: cliWriter.authFingerprint,
			lifecycleRevision: cliWriter.lifecycleRevision
		}
	};
	if (command.type === "session.transcript.appendMessage") Object.assign(command.input, control);
	if (command.type === "session.transcript.rewrite" && "entries" in command.input && control.pendingInput) command.input.pendingInput = control.pendingInput;
	if ("event" in command.input && typeof command.input.event !== "string" && command.input.message) command.input.message = {
		...command.input.message,
		...control
	};
	return cliWriter;
}
//#endregion
export { prepareSessionManagerMetadataCommand as t };
