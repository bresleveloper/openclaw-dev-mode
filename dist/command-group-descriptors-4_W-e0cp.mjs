//#region src/cli/program/command-group-descriptors.ts
/** Bind descriptors and registration arguments without importing the command modules. */
function buildCommandGroupEntries(descriptors, specs, ...args) {
	const descriptorsByName = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
	return specs.flatMap(([commandNames, register]) => {
		const placeholders = [];
		for (const name of commandNames) {
			const descriptor = descriptorsByName.get(name);
			if (!descriptor) return [];
			placeholders.push(descriptor);
		}
		return [{
			names: commandNames,
			placeholders,
			register: (program) => register(program, ...args)
		}];
	});
}
//#endregion
export { buildCommandGroupEntries as t };
