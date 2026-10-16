//#region scripts/lib/npm-json-output.mts
/**
* Normalize npm <=11 entry/array JSON and npm 12 name-keyed JSON.
* Keep pack consumers on one dependency-contract boundary so a package-manager
* upgrade cannot silently bypass release, installer, or security checks.
*/
function resolveNpmJsonEntries(value) {
	if (Array.isArray(value)) return value;
	if (value && typeof value === "object") {
		if (!("id" in value && typeof value.id === "string" || "name" in value && typeof value.name === "string" || "version" in value && typeof value.version === "string" || "filename" in value && typeof value.filename === "string")) {
			const entries = Object.values(value).filter((entry) => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry));
			if (entries.length > 0) return entries;
		}
	}
	return [value];
}
//#endregion
export { resolveNpmJsonEntries as t };
