import { d as isRootHelpInvocation, n as getCommandPathWithRootOptions, o as getPrimaryCommand, u as isHelpOrVersionInvocation } from "./argv-APLDYHWW.js";
//#region src/cli/argv-invocation.ts
/** Resolves command path and help/version mode from a raw process argv array. */
function resolveCliArgvInvocation(argv) {
	return {
		argv,
		commandPath: getCommandPathWithRootOptions(argv, 2),
		primary: getPrimaryCommand(argv),
		hasHelpOrVersion: isHelpOrVersionInvocation(argv),
		isRootHelpInvocation: isRootHelpInvocation(argv)
	};
}
//#endregion
export { resolveCliArgvInvocation as t };
