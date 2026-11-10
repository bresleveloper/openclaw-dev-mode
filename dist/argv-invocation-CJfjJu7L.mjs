import { a as resolveCliParentCommandPath } from "./config-output-mode-COOwgYEB.mjs";
import { M as resolveGatewayCatalogCommandPath, a as getPrimaryCommand, l as isHelpOrVersionInvocation, n as getCommandPathWithRootOptions, u as isRootHelpInvocation } from "./argv-C7hqFLn5.mjs";
//#region src/cli/argv-invocation.ts
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
