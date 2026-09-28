import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/codex/cli-metadata.ts
function registerCodexCliMetadata(api) {
	api.registerCli(async ({ program }) => {
		const { registerCodexSessionCli } = await import("./.setup/session-cli-irrD-uo7.mjs");
		registerCodexSessionCli(program);
	}, { descriptors: [{
		name: "codex",
		description: "Inspect and branch from Codex sessions through the Gateway",
		hasSubcommands: true
	}] });
}
var cli_metadata_default = definePluginEntry({
	id: "codex",
	name: "Codex",
	description: "Codex app-server harness and native session supervision.",
	register: registerCodexCliMetadata
});
//#endregion
export { cli_metadata_default as default, registerCodexCliMetadata };
