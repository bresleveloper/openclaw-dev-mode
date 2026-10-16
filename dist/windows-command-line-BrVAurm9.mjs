//#region src/process/windows-command-line.ts
/** Parse an Arguments field; it does not contain the executable's special first token. */
function parseWindowsNativeArguments(value) {
	const args = [];
	let index = 0;
	while (index < value.length) {
		while (/[ \t]/.test(value.charAt(index))) index++;
		if (index === value.length) break;
		let argument = "";
		let quoted = false;
		while (index < value.length) {
			let backslashes = 0;
			while (value[index] === "\\") {
				backslashes++;
				index++;
			}
			if (value[index] === "\"") {
				argument += "\\".repeat(Math.floor(backslashes / 2));
				if (backslashes % 2 === 1) {
					argument += "\"";
					index++;
				} else if (quoted && value[index + 1] === "\"") {
					argument += "\"";
					index += 2;
				} else {
					quoted = !quoted;
					index++;
				}
				continue;
			}
			argument += "\\".repeat(backslashes);
			if (index === value.length || !quoted && /[ \t]/.test(value.charAt(index))) break;
			argument += value.charAt(index++);
		}
		args.push(argument);
	}
	return args;
}
/** Parse a native process command line; argv[0] preserves backslashes before quotes. */
function parseWindowsNativeCommandLine(value) {
	if (value.includes("\0")) return null;
	let index = 0;
	while (/[ \t]/.test(value.charAt(index))) index++;
	if (index === value.length) return [];
	let executable = "";
	let quoted = false;
	while (index < value.length && (quoted || !/[ \t]/.test(value.charAt(index)))) {
		const character = value.charAt(index++);
		if (character === "\"") quoted = !quoted;
		else executable += character;
	}
	if (quoted || !executable) return null;
	return [executable, ...parseWindowsNativeArguments(value.slice(index))];
}
//#endregion
export { parseWindowsNativeCommandLine as t };
