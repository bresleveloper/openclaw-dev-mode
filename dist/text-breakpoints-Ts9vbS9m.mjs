//#region packages/markdown-core/src/text-breakpoints.ts
function scanParenAwareBreakpoints(text, start, end, skipTo) {
	let lastNewline = -1;
	let lastWhitespace = -1;
	if (!skipTo) {
		const window = text.slice(start, end);
		if (!window.includes("(")) {
			const newline = window.lastIndexOf("\n");
			lastNewline = newline < 0 ? -1 : start + newline;
			const whitespace = window.search(/[^\S\n][\S\n]*$/);
			lastWhitespace = whitespace < 0 ? -1 : start + whitespace;
			return {
				lastNewline,
				lastWhitespace
			};
		}
	}
	let depth = 0;
	for (let i = start; i < end; i++) {
		const skippedEnd = skipTo?.(i);
		if (skippedEnd !== void 0) {
			i = skippedEnd - 1;
			continue;
		}
		const char = text.charAt(i);
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")" && depth > 0) {
			depth -= 1;
			continue;
		}
		if (depth !== 0) continue;
		if (char === "\n") lastNewline = i;
		else if (/\s/.test(char)) lastWhitespace = i;
	}
	return {
		lastNewline,
		lastWhitespace
	};
}
//#endregion
export { scanParenAwareBreakpoints as t };
