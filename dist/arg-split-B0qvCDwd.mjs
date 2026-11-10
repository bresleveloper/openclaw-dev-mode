//#region src/daemon/arg-split.ts
/** Splits service command strings while preserving quoted arguments across platform parsers. */
function splitArgsPreservingQuotes(value, options) {
	const args = [];
	let current = null;
	let quoteChar = null;
	const escapeMode = options?.escapeMode ?? "none";
	const quoteChars = new Set(options?.quoteChars ?? ["\""]);
	const quoteStart = options?.quoteStart ?? "anywhere";
	for (let i = 0; i < value.length; i++) {
		const char = value.charAt(i);
		if (char === "\\" && (escapeMode === "backslash" || escapeMode === "backslash-quote-only" && value[i + 1] === "\"")) {
			if (i + 1 < value.length) {
				current = (current ?? "") + value[i + 1];
				i++;
			}
			continue;
		}
		if (quoteChars.has(char)) {
			if (quoteChar === char) {
				quoteChar = null;
				continue;
			}
			if (!quoteChar && (quoteStart === "anywhere" || !current)) {
				quoteChar = char;
				current ??= "";
				continue;
			}
		}
		if (!quoteChar && /\s/.test(char)) {
			if (current !== null) {
				args.push(current);
				current = null;
			}
			continue;
		}
		current = (current ?? "") + char;
	}
	if (current !== null) args.push(current);
	return args;
}
//#endregion
export { splitArgsPreservingQuotes as t };
