//#region src/gateway/node-computer-use-descriptor.ts
/** Publish Computer Use metadata only after the command pair is effective for this session. */
function resolveEffectiveComputerUseDescriptor(params) {
	return params.commands.includes("computer.act") && params.commands.includes("screen.snapshot") ? params.declared : void 0;
}
//#endregion
export { resolveEffectiveComputerUseDescriptor as t };
