import "./read-only-account-inspect-44l_sOq6.mjs";
//#region src/plugin-sdk/directory-runtime.ts
function resolveDirectoryAllowlistEntries(params) {
	return params.entries.map((input) => {
		const parsed = params.parseInput(input);
		if (parsed.id) return params.buildIdResolved({
			input,
			parsed,
			match: params.findById(params.lookup, parsed.id)
		});
		return params.resolveNonId({
			input,
			parsed,
			lookup: params.lookup
		}) ?? params.buildUnresolved(input);
	});
}
//#endregion
export { resolveDirectoryAllowlistEntries as t };
