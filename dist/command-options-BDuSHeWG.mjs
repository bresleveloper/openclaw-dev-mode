//#region src/cli/command-options.ts
function hasExplicitOptions(command, names) {
	return names.some((name) => command.getOptionValueSource(name) === "cli");
}
function listExplicitOptionFlagsExcept(command, allowedNames) {
	const optionsByName = /* @__PURE__ */ new Map();
	for (const option of command.options) {
		const name = option.attributeName();
		if (allowedNames.has(name) || command.getOptionValueSource(name) !== "cli") continue;
		const existing = optionsByName.get(name);
		const valueIsNegated = command.getOptionValue(name) === false;
		if (!existing || option.negate === valueIsNegated) optionsByName.set(name, option);
	}
	return [...optionsByName.values()].map((option) => option.long ?? option.short ?? option.flags).toSorted();
}
const MAX_INHERIT_DEPTH = 2;
function inheritOptionFromParent(command, name, requiredSource) {
	if (!command) return;
	const childSource = command.getOptionValueSource(name);
	if (childSource && childSource !== "default") return;
	let depth = 0;
	let ancestor = command.parent;
	while (ancestor && depth < MAX_INHERIT_DEPTH) {
		const source = ancestor.getOptionValueSource(name);
		if (source && source !== "default") {
			if (requiredSource && source !== requiredSource) return;
			return ancestor.getOptionValue(name);
		}
		depth += 1;
		ancestor = ancestor.parent;
	}
}
//#endregion
export { inheritOptionFromParent as n, listExplicitOptionFlagsExcept as r, hasExplicitOptions as t };
