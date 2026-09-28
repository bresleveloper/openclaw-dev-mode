import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
//#region extensions/voice-call/cli-output-mode.ts
const MACHINE_OUTPUT_COMMANDS = /* @__PURE__ */ new Set([
	"call",
	"continue",
	"dtmf",
	"end",
	"expose",
	"latency",
	"speak",
	"start",
	"status",
	"tail"
]);
/** Voice-call result actions emit JSON, while tail reserves stdout for JSONL. */
function isVoiceCallMachineOutput(params) {
	const [, command] = getRootOptionAwareCommandPath(params.argv, 2);
	return MACHINE_OUTPUT_COMMANDS.has(command ?? "");
}
const VOICE_CALL_CLI_DESCRIPTOR = {
	name: "voicecall",
	description: "Voice call utilities",
	hasSubcommands: true,
	machineOutput: isVoiceCallMachineOutput
};
//#endregion
export { VOICE_CALL_CLI_DESCRIPTOR };
