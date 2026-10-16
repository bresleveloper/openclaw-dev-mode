import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
//#region extensions/slack-huddles/cli-metadata.ts
const descriptor = {
	name: "slackhuddles",
	description: "Join and manage Slack huddle participants",
	hasSubcommands: true,
	machineOutput: ({ argv }) => getRootOptionAwareCommandPath(argv, 2).length === 2
};
const SLACK_HUDDLES_CLI_METADATA = {
	id: "slack-huddles",
	name: "Slack huddles",
	description: "Slack huddles CLI metadata",
	descriptor,
	register(api) {
		api.registerCli(() => {}, { descriptors: [descriptor] });
	}
};
//#endregion
export { SLACK_HUDDLES_CLI_METADATA, SLACK_HUDDLES_CLI_METADATA as default };
