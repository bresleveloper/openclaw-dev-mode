import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
//#region src/cli/claws-cli.state-owner.ts
function offlineClawAction(command, action) {
	return (...args) => runWithLocalStateOwner({
		method: `claws.${command}`,
		params: {},
		target: "Claw configuration and provenance",
		onForeignOwner: "refuse",
		runLocal: () => action(...args)
	});
}
//#endregion
export { offlineClawAction as t };
