import { a as resolveCliParentCommandPath } from "./config-output-mode-B0q9nhjd.mjs";
import { a as getPrimaryCommand, j as resolveGatewayCatalogCommandPath, l as isHelpOrVersionInvocation, n as getCommandPathWithRootOptions, u as isRootHelpInvocation } from "./argv-D_Nxd_3s.mjs";
//#region src/cli/argv-invocation.ts
/** Resolves command path and help/version mode from a raw process argv array. */
function resolveCliArgvInvocation(argv) {
	return {
		argv,
		commandPath: resolveGatewayCatalogCommandPath(argv) ?? resolveCliParentCommandPath(argv) ?? getCommandPathWithRootOptions(argv, 2),
		primary: getPrimaryCommand(argv),
		hasHelpOrVersion: isHelpOrVersionInvocation(argv),
		isRootHelpInvocation: isRootHelpInvocation(argv)
	};
}
//#endregion
export { resolveCliArgvInvocation as t };
