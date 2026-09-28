//#region packages/terminal-core/src/ansi-sequences.ts
const ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
const ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
const ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
const ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
const ansiOscAtIndexRegex = new RegExp(ANSI_OSC_PATTERN, "y");
function matchAnsiOscAt(input, index) {
	ansiOscAtIndexRegex.lastIndex = index;
	return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
	const code = input.charCodeAt(index);
	if (code === 155) return 1;
	return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
/** Scan one CSI parser pass, retaining independently executed C0 controls. */
function scanAnsiCsiAt(input, index) {
	const introducerLength = csiIntroducerLength(input, index);
	if (introducerLength === 0) return;
	let cursor = index + introducerLength;
	const controls = [];
	let ended = false;
	while (cursor < input.length) {
		const code = input.charCodeAt(cursor);
		if (code === 24 || code === 26) {
			cursor += 1;
			ended = true;
			break;
		}
		if (code === 27 || code === 155) {
			ended = true;
			break;
		}
		if (code <= 31 || code === 127) {
			controls.push(input.charAt(cursor));
			cursor += 1;
			continue;
		}
		if (code >= 32 && code <= 63) {
			cursor += 1;
			continue;
		}
		if (code >= 64 && code <= 126) cursor += 1;
		ended = true;
		break;
	}
	return {
		controls,
		ended,
		value: input.slice(index, cursor)
	};
}
const ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(`${`${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`, "y");
new Intl.Segmenter(void 0, { granularity: "grapheme" });
function hasAnsiIntroducer(input) {
	return input.includes("\x1B") || input.includes("") || input.includes("");
}
/**
* Strip ANSI against original input positions so one removal cannot synthesize
* a second sequence. C0 controls execute without ending CSI, CAN/SUB cancel it,
* and ESC restarts escape parsing.
*/
function stripAnsiInternal(input, options) {
	const output = [];
	let copyStart = 0;
	let index = 0;
	while (index < input.length) {
		const introducerCode = input.charCodeAt(index);
		if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
			index += 1;
			continue;
		}
		const osc = matchAnsiOscAt(input, index);
		if (osc) {
			output.push(input.slice(copyStart, index));
			index += osc.length;
			copyStart = index;
			continue;
		}
		const csi = scanAnsiCsiAt(input, index);
		ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
		const compatibilityMatch = options.compatibilityGrammar ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input) : null;
		if (!csi) {
			if (compatibilityMatch) {
				output.push(input.slice(copyStart, index));
				index += compatibilityMatch[0].length;
				copyStart = index;
				continue;
			}
			index += 1;
			continue;
		}
		if (!csi.ended && options.preserveIncompleteCsi) break;
		let cursor = index + csi.value.length;
		const canonicalLength = csi.value.length;
		if (csi.controls.length === 0 && compatibilityMatch && compatibilityMatch[0].length > canonicalLength) cursor = index + compatibilityMatch[0].length;
		output.push(input.slice(copyStart, index), ...csi.controls);
		index = cursor;
		copyStart = cursor;
	}
	output.push(input.slice(copyStart));
	return output.join("");
}
function stripAnsi(input) {
	if (!hasAnsiIntroducer(input)) return input;
	return stripAnsiInternal(input, { compatibilityGrammar: false });
}
new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`, "g");
//#endregion
export { stripAnsi as t };
