import { r as registerCoreCliCommands } from "./command-registry-core-B-_MpHuk.js";
import { n as registerSubCliCommands } from "./register.subclis-BDbXLUxX.js";
//#region src/cli/program/command-registry.ts
/** Register all root-program commands for the current argv shape. */
function registerProgramCommands(program, ctx, argv = process.argv) {
	registerCoreCliCommands(program, ctx, argv);
	registerSubCliCommands(program, argv);
}
//#endregion
export { registerProgramCommands as t };
