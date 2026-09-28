import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
//#region src/pairing/pairing-messages.ts
function buildPairingReply(params) {
	const { channel, idLine, code } = params;
	return [
		"OpenClaw: access not configured.",
		"",
		idLine,
		"Pairing code:",
		"```",
		code,
		"```",
		"",
		"Ask the bot owner to approve with:",
		"```",
		formatCliCommand(`openclaw pairing approve ${channel} ${code}`),
		"```"
	].join("\n");
}
//#endregion
export { buildPairingReply as t };
