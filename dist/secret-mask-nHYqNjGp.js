//#region src/security/secret-mask.ts
/** Masks credential-like values while preserving the existing UTF-16 prefix/suffix policy. */
function maskApiKey(value) {
	const trimmed = stripControlCharacters(value).trim();
	if (!trimmed) return "missing";
	if (trimmed.length <= 6) return `${trimmed.slice(0, 1)}...${trimmed.slice(-1)}`;
	if (trimmed.length <= 16) return `${trimmed.slice(0, 2)}...${trimmed.slice(-2)}`;
	return `${trimmed.slice(0, 8)}...${trimmed.slice(-8)}`;
}
function stripControlCharacters(value) {
	let result = "";
	for (const character of value) {
		const code = character.charCodeAt(0);
		if (!(code >= 0 && code <= 31 || code >= 127 && code <= 159)) result += character;
	}
	return result;
}
//#endregion
export { maskApiKey as t };
