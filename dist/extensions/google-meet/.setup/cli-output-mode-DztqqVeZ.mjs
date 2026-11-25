import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
// extensions/google-meet/src/cli-output-mode.ts
const DEFAULT_JSON_COMMANDS = /* @__PURE__ */ new Set([
	"join",
	"status",
	"test-listen",
	"test-speech"
]);
function hasOption(argv, flag) {
	for (const arg of argv.slice(2)) {
		if (arg === "--") return false;
		if (arg === flag || arg.startsWith(`${flag}=`)) return true;
	}
	return false;
}
const GOOGLE_MEET_CLI_DESCRIPTOR = {
	name: "googlemeet",
	description: "Join and manage Google Meet calls",
	hasSubcommands: true,
	/** Runtime probe commands emit JSON without requiring the shared `--json` option. */
	machineOutput: (params) => {
		const [, command] = getRootOptionAwareCommandPath(params.argv, 2);
		return DEFAULT_JSON_COMMANDS.has(command ?? "") || command === "export" && hasOption(params.argv, "--dry-run");
	}
};
export { GOOGLE_MEET_CLI_DESCRIPTOR as t };
