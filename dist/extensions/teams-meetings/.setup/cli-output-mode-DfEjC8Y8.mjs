import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
//#region extensions/teams-meetings/src/cli-output-mode.ts
const descriptor = {
	name: "teamsmeetings",
	description: "Join and manage Microsoft Teams meeting guests",
	hasSubcommands: true,
	machineOutput: ({ argv }) => getRootOptionAwareCommandPath(argv, 2).length === 2
};
const TEAMS_MEETINGS_CLI_METADATA = {
	id: "teams-meetings",
	name: "Microsoft Teams meetings",
	description: "Microsoft Teams meetings CLI metadata",
	descriptor,
	register(api) {
		api.registerCli(() => {}, { descriptors: [descriptor] });
	}
};
//#endregion
export { TEAMS_MEETINGS_CLI_METADATA as t };
