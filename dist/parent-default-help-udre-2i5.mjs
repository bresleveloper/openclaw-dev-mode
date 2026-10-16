//#region src/cli/program/parent-default-help.ts
const parentDefaultHelpCommands = /* @__PURE__ */ new WeakSet();
function outputParentHelpWithoutStartupBanner(parent) {
	const previous = process.env.OPENCLAW_SUPPRESS_HELP_BANNER;
	process.env.OPENCLAW_SUPPRESS_HELP_BANNER = "1";
	try {
		parent.outputHelp();
	} finally {
		if (previous === void 0) delete process.env.OPENCLAW_SUPPRESS_HELP_BANNER;
		else process.env.OPENCLAW_SUPPRESS_HELP_BANNER = previous;
	}
}
/**
* Bare parent help exits successfully instead of Commander's default status 1 (#73077).
* Apply only to parents without a default action; Commander has no public action-handler probe.
*/
function applyParentDefaultHelpAction(parent) {
	parentDefaultHelpCommands.add(parent);
	parent.action(() => {
		outputParentHelpWithoutStartupBanner(parent);
		process.exitCode = 0;
	});
}
function isParentDefaultHelpAction(parent) {
	return parentDefaultHelpCommands.has(parent);
}
//#endregion
export { isParentDefaultHelpAction as n, applyParentDefaultHelpAction as t };
