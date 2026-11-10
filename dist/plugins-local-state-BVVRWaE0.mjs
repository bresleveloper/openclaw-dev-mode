import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
//#region src/cli/plugins-local-state.ts
/** Local plugin writers use the same offline ownership boundary as config commands. */
async function runWithLocalPluginState(command, run) {
	return await runWithLocalStateOwner({
		method: `plugins.${command}`,
		params: {},
		target: `openclaw plugins ${command}`,
		onForeignOwner: "refuse",
		runLocal: ({ assertCurrent }) => run(assertCurrent)
	});
}
//#endregion
export { runWithLocalPluginState as t };
