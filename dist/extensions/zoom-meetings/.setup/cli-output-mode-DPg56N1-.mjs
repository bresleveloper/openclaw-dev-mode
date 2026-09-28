import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
//#region extensions/zoom-meetings/src/cli-output-mode.ts
const descriptor = {
	name: "zoommeetings",
	description: "Join and manage Zoom meeting guests",
	hasSubcommands: true,
	machineOutput: ({ argv }) => getRootOptionAwareCommandPath(argv, 2).length === 2
};
const ZOOM_MEETINGS_CLI_METADATA = {
	id: "zoom-meetings",
	name: "Zoom meetings",
	description: "Zoom meetings CLI metadata",
	descriptor,
	register(api) {
		api.registerCli(() => {}, { descriptors: [descriptor] });
	}
};
//#endregion
export { ZOOM_MEETINGS_CLI_METADATA as t };
