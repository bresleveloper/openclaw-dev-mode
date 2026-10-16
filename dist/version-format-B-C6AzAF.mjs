//#region src/cli/version-format.ts
/** Prefix numeric versions; preserve existing prefixes and build names. */
function formatVersionLabel(raw) {
	const trimmed = raw.trim();
	return /^\d/.test(trimmed) ? `v${trimmed}` : trimmed || raw;
}
//#endregion
export { formatVersionLabel as t };
