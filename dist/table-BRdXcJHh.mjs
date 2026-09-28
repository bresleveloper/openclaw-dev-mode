import "./src-CZ2wJvNB.mjs";
import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
import { n as resolveEffectiveHomeDir, t as normalizeHomeDirValue } from "./home-dir-D0b-ywue.mjs";
import { c as visibleWidth, s as truncateToVisibleWidth, t as iterateGraphemes, u as iterateAnsiSegments } from "./ansi-CWsy0bu4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import os from "node:os";
//#region packages/terminal-core/src/display-string.ts
/** Resolve the display prefix that should replace the effective home path. */
function resolveHomeDisplayPrefix() {
	const home = resolveEffectiveHomeDir(process.env, os.homedir, { preserveUnresolvedTilde: true });
	if (!home) return;
	return normalizeHomeDirValue(process.env.OPENCLAW_HOME) ? {
		home,
		prefix: "$OPENCLAW_HOME"
	} : {
		home,
		prefix: "~"
	};
}
/** Find a case-insensitive Windows path without changing offsets in the original string. */
function indexOfWindowsPath(input, home, cursor) {
	const foldedHome = lowercasePreservingWhitespace(home);
	const separatorOffset = home.indexOf("\\");
	for (let separator = input.indexOf("\\", cursor + separatorOffset); separator !== -1; separator = input.indexOf("\\", separator + 1)) {
		const index = separator - separatorOffset;
		if (index > input.length - home.length) break;
		if (lowercasePreservingWhitespace(input.slice(index, index + home.length)) === foldedHome) return index;
	}
	return -1;
}
/** Replace a whole-value home or child path without clipping sibling path prefixes. */
function replaceHomePath(input, display) {
	let output = "";
	let cursor = 0;
	while (cursor < input.length) {
		const index = process.platform === "win32" ? indexOfWindowsPath(input, display.home, cursor) : input.indexOf(display.home, cursor);
		if (index < 0) return `${output}${input.slice(cursor)}`;
		const before = input[index - 1];
		const homeEnd = index + display.home.length;
		const after = input[homeEnd];
		const startsToken = before === void 0 || /[\s("'`:=[{,]/u.test(before);
		let punctuationEnd = homeEnd;
		while (punctuationEnd < input.length && /[)"'`:,;.\]}]/u.test(input.charAt(punctuationEnd))) punctuationEnd += 1;
		const punctuationEndsToken = punctuationEnd > homeEnd && (punctuationEnd === input.length || /\s/u.test(input.charAt(punctuationEnd)));
		if (startsToken && (after === void 0 || after === "/" || after === "\\" || punctuationEndsToken)) output += `${input.slice(cursor, index)}${display.prefix}`;
		else output += input.slice(cursor, index + display.home.length);
		cursor = index + display.home.length;
	}
	return output;
}
/** Prepare one home snapshot for a synchronous render; new renders observe environment changes. */
function createDisplayStringFormatter() {
	const display = resolveHomeDisplayPrefix();
	return (input) => display ? replaceHomePath(input, display) : input;
}
//#endregion
//#region packages/terminal-core/src/table.ts
function resolveDefaultBorder(platform, env) {
	if (platform !== "win32") return "unicode";
	const term = env.TERM ?? "";
	const termProgram = env.TERM_PROGRAM ?? "";
	return Boolean(env.WT_SESSION) || term.includes("xterm") || term.includes("cygwin") || term.includes("msys") || termProgram === "vscode" ? "unicode" : "ascii";
}
function repeat(ch, n) {
	if (n <= 0) return "";
	return ch.repeat(n);
}
function padCell(text, width, align) {
	const textWidth = visibleWidth(text);
	const content = textWidth > width ? truncateToVisibleWidth(text, width) : text;
	const w = content === text ? textWidth : visibleWidth(content);
	if (w >= width) return content;
	const pad = width - w;
	if (align === "right") return `${repeat(" ", pad)}${content}`;
	if (align === "center") {
		const left = Math.floor(pad / 2);
		const right = pad - left;
		return `${repeat(" ", left)}${content}${repeat(" ", right)}`;
	}
	return `${content}${repeat(" ", pad)}`;
}
const ESC = "\x1B";
const C1_CSI = "";
const C1_OSC = "";
const C1_ST = "";
const BEL = "\x07";
const SGR_CONTROL_CHARS_REGEX = new RegExp(String.raw`[\u0000-\u001f\u007f]`, "g");
const SGR_CATEGORIES = [
	{
		category: "font",
		reset: 10,
		codes: [
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19
		]
	},
	{
		category: "intensity",
		reset: 22,
		codes: [1, 2]
	},
	{
		category: "italic",
		reset: 23,
		codes: [3, 20]
	},
	{
		category: "underline",
		reset: 24,
		codes: [4, 21]
	},
	{
		category: "underlineColor",
		reset: 59,
		codes: []
	},
	{
		category: "blink",
		reset: 25,
		codes: [5, 6]
	},
	{
		category: "inverse",
		reset: 27,
		codes: [7]
	},
	{
		category: "conceal",
		reset: 28,
		codes: [8]
	},
	{
		category: "strike",
		reset: 29,
		codes: [9]
	},
	{
		category: "proportional",
		reset: 50,
		codes: [26]
	},
	{
		category: "frame",
		reset: 54,
		codes: [51, 52]
	},
	{
		category: "overline",
		reset: 55,
		codes: [53]
	},
	{
		category: "ideogram",
		reset: 65,
		codes: [
			60,
			61,
			62,
			63,
			64
		]
	},
	{
		category: "script",
		reset: 75,
		codes: [73, 74]
	},
	{
		category: "foreground",
		reset: 39,
		codes: [
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			90,
			91,
			92,
			93,
			94,
			95,
			96,
			97
		]
	},
	{
		category: "background",
		reset: 49,
		codes: [
			40,
			41,
			42,
			43,
			44,
			45,
			46,
			47,
			100,
			101,
			102,
			103,
			104,
			105,
			106,
			107
		]
	}
];
const SGR_RESET_CATEGORIES = new Map(SGR_CATEGORIES.map(({ category, reset }) => [reset, category]));
const SGR_SIMPLE_CATEGORIES = new Map(SGR_CATEGORIES.flatMap(({ category, codes }) => codes.map((code) => [code, category])));
function extendedSgrCategory(param) {
	if (param === 38) return "foreground";
	if (param === 48) return "background";
	return param === 58 ? "underlineColor" : void 0;
}
function parseSgrSequence(value) {
	let introducer;
	if (value.startsWith(`${ESC}[`) && value.endsWith("m")) introducer = `${ESC}[`;
	else if (value.startsWith(C1_CSI) && value.endsWith("m")) introducer = C1_CSI;
	else return;
	const parameters = value.slice(introducer.length, -1).replace(SGR_CONTROL_CHARS_REGEX, "");
	if (/[^0-9;:]/u.test(parameters)) return;
	return {
		introducer,
		parameters
	};
}
function sgrSequence(introducer, parameters) {
	return `${introducer}${parameters}m`;
}
function applySgrSequence(active, value) {
	const sequence = parseSgrSequence(value);
	if (!sequence) return;
	const fields = sequence.parameters === "" ? ["0"] : sequence.parameters.split(";");
	for (let index = 0; index < fields.length; index += 1) {
		const field = fields[index] ?? "";
		if (field.includes(":")) {
			const param = Number(field.slice(0, field.indexOf(":")));
			const category = extendedSgrCategory(param) ?? SGR_SIMPLE_CATEGORIES.get(param);
			if (category) active.set(category, sgrSequence(sequence.introducer, field));
			continue;
		}
		const param = field === "" ? 0 : Number(field);
		if (!Number.isInteger(param)) continue;
		if (param === 0) {
			active.clear();
			continue;
		}
		const resetCategory = SGR_RESET_CATEGORIES.get(param);
		if (resetCategory) {
			active.delete(resetCategory);
			continue;
		}
		const extendedCategory = extendedSgrCategory(param);
		if (extendedCategory) {
			const mode = Number(fields[index + 1]);
			const operandCount = mode === 2 ? 3 : mode === 5 ? 1 : void 0;
			const lastOperandIndex = operandCount === void 0 ? -1 : index + 1 + operandCount;
			if (lastOperandIndex < index || lastOperandIndex >= fields.length) break;
			const parameters = fields.slice(index, lastOperandIndex + 1).join(";");
			active.set(extendedCategory, sgrSequence(sequence.introducer, parameters));
			index = lastOperandIndex;
			continue;
		}
		const category = SGR_SIMPLE_CATEGORIES.get(param);
		if (category) active.set(category, sgrSequence(sequence.introducer, String(param)));
	}
}
function parseOsc8Sequence(value) {
	let payloadStart;
	if (value.startsWith(`${ESC}]`)) payloadStart = 2;
	else if (value.startsWith(C1_OSC)) payloadStart = 1;
	else return;
	let terminatorLength;
	if (value.endsWith(`${ESC}\\`)) terminatorLength = 2;
	else if (value.endsWith(BEL) || value.endsWith(C1_ST)) terminatorLength = 1;
	else return;
	const payload = value.slice(payloadStart, -terminatorLength);
	if (!payload.startsWith("8;")) return;
	const uriSeparator = payload.indexOf(";", 2);
	if (uriSeparator < 0) return;
	return {
		params: payload.slice(2, uriSeparator),
		uri: payload.slice(uriSeparator + 1)
	};
}
function wrapLine(text, width) {
	if (width <= 0) return [text];
	if (text.length <= width && /^[!-~](?:[ -~]*[!-~])?$/u.test(text)) return [text];
	const lines = [];
	const isBreakChar = (ch) => ch === " " || ch === "/" || ch === "-" || ch === "_" || ch === ".";
	let skipNextLf = false;
	let hasChar = false;
	let logicalLineHasOutput = false;
	const buf = [];
	let bufVisible = 0;
	let lastBreakIndex = null;
	const flushAt = (breakAt) => {
		const left = breakAt == null || breakAt <= 0 ? buf : buf.splice(0, breakAt);
		const content = [];
		const sgr = /* @__PURE__ */ new Map();
		let activeOsc8;
		for (const token of left) {
			content.push(token.value);
			if (token.kind !== "ansi") continue;
			applySgrSequence(sgr, token.value);
			const link = parseOsc8Sequence(token.value);
			if (link) activeOsc8 = link.uri === "" ? void 0 : link;
		}
		const activeSgr = SGR_CATEGORIES.flatMap(({ category, reset }) => {
			const open = sgr.get(category);
			const parsed = open ? parseSgrSequence(open) : void 0;
			return open && parsed ? [{
				close: sgrSequence(parsed.introducer, String(reset)),
				open
			}] : [];
		});
		const closeOsc8 = activeOsc8 ? `${ESC}]8;;${BEL}` : "";
		const openOsc8 = activeOsc8 ? `${ESC}]8;${activeOsc8.params};${activeOsc8.uri}${BEL}` : "";
		const closeSgr = activeSgr.map((state) => state.close).join("");
		if (bufVisible > 0 || !logicalLineHasOutput) {
			lines.push(`${content.join("")}${closeOsc8}${closeSgr}`.trimEnd());
			logicalLineHasOutput = true;
		}
		if (breakAt == null || breakAt <= 0) {
			buf.length = 0;
			if (openOsc8) buf.push({
				kind: "ansi",
				value: openOsc8,
				width: 0
			});
			for (const state of activeSgr) buf.push({
				kind: "ansi",
				value: state.open,
				width: 0
			});
			bufVisible = 0;
			lastBreakIndex = null;
			return;
		}
		if (openOsc8) buf.unshift({
			kind: "ansi",
			value: openOsc8,
			width: 0
		});
		if (activeSgr.length > 0) buf.unshift(...activeSgr.map((state) => ({
			kind: "ansi",
			value: state.open,
			width: 0
		})));
		bufVisible = buf.reduce((acc, token) => acc + token.width, 0);
		lastBreakIndex = null;
	};
	const acceptToken = (token) => {
		if (token.kind === "char") {
			hasChar = true;
			token.value = token.value.replaceAll("	", " ");
			const ch = token.value;
			if (skipNextLf && ch === "\n") {
				skipNextLf = false;
				return;
			}
			if (ch === "\n" || ch === "\r" || ch === "\r\n") {
				skipNextLf = ch === "\r";
				flushAt(buf.length);
				logicalLineHasOutput = false;
				return;
			}
			token.width = visibleWidth(ch);
		}
		if (bufVisible + token.width > width && bufVisible > 0) {
			flushAt(lastBreakIndex);
			if (bufVisible + token.width > width && bufVisible > 0) flushAt(null);
		}
		if (token.kind === "char" && bufVisible === 0 && token.value === " ") return;
		buf.push(token);
		bufVisible += token.width;
		if (token.kind === "char") {
			skipNextLf = false;
			if (isBreakChar(token.value)) lastBreakIndex = buf.length;
		}
	};
	for (const segment of iterateAnsiSegments(text)) {
		let value = segment.value;
		if (segment.kind === "ansi") {
			if (segment.controls.includes("	")) {
				acceptToken({
					kind: "ansi",
					value: value.slice(0, value[0] === ESC ? 2 : 1) + "",
					width: 0
				});
				const controls = new Set(segment.controls);
				for (const control of segment.controls) acceptToken({
					kind: control === "	" ? "char" : "ansi",
					value: control,
					width: 0
				});
				value = Array.from(value).filter((character) => !controls.has(character)).join("");
			}
			acceptToken({
				kind: "ansi",
				value,
				width: 0
			});
			continue;
		}
		for (const grapheme of iterateGraphemes(value)) acceptToken({
			kind: "char",
			value: grapheme,
			width: 0
		});
	}
	if (!hasChar) return [text];
	if (bufVisible > 0) flushAt(buf.length);
	return lines.length > 0 ? lines : [""];
}
function normalizeWidth(n) {
	if (n == null) return;
	if (!Number.isFinite(n) || n <= 0) return;
	return Math.floor(n);
}
function getTerminalTableWidth(minWidth = 60, fallbackWidth = 120) {
	return Math.max(minWidth, process.stdout.columns ?? fallbackWidth);
}
/** Render untrusted single-line values without changing renderTable's trusted ANSI contract. */
function renderTerminalSafeTable(opts) {
	return renderTable({
		...opts,
		columns: opts.columns.map((column) => ({
			...column,
			header: sanitizeTerminalText(column.header)
		})),
		rows: opts.rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, sanitizeTerminalText(value)])))
	});
}
function renderTable(opts) {
	const displayString = createDisplayStringFormatter();
	const rows = opts.rows.map((row) => {
		const next = {};
		for (const [key, value] of Object.entries(row)) next[key] = displayString(value);
		return next;
	});
	const border = opts.border ?? resolveDefaultBorder(process.platform, process.env);
	if (border === "none") {
		const columns = opts.columns;
		return `${[columns.map((c) => c.header).join(" | "), ...rows.map((r) => columns.map((c) => r[c.key] ?? "").join(" | "))].join("\n")}\n`;
	}
	const padding = Math.max(0, opts.padding ?? 1);
	const columns = opts.columns;
	const metrics = columns.map((c) => {
		return {
			headerW: visibleWidth(c.header),
			cellW: rows.reduce((max, row) => Math.max(max, visibleWidth(row[c.key] ?? "")), 0)
		};
	});
	const widths = columns.map((c, i) => {
		const m = metrics[i];
		const base = Math.max(m?.headerW ?? 0, m?.cellW ?? 0) + padding * 2;
		const capped = c.maxWidth ? Math.min(base, c.maxWidth) : base;
		return Math.max(c.minWidth ?? 3, capped);
	});
	const maxWidth = normalizeWidth(opts.width);
	const sepCount = columns.length + 1;
	const total = widths.reduce((a, b) => a + b, 0) + sepCount;
	const preferredMinWidths = columns.map((c, i) => Math.max(c.minWidth ?? 3, (metrics[i]?.headerW ?? 0) + padding * 2, 3));
	const absoluteMinWidths = columns.map((_c, i) => Math.max((metrics[i]?.headerW ?? 0) + padding * 2, 3));
	if (maxWidth && total > maxWidth) {
		let over = total - maxWidth;
		const flexColumns = columns.flatMap((column, i) => column.flex ? [i] : []);
		const nonFlexColumns = columns.flatMap((column, i) => column.flex ? [] : [i]);
		const shrink = (indices, minWidths) => {
			while (over > 0) {
				let widest;
				for (const i of indices) {
					if ((widths[i] ?? 0) <= (minWidths[i] ?? 0)) continue;
					if (widest === void 0 || (widths[i] ?? 0) > (widths[widest] ?? 0)) widest = i;
				}
				if (widest === void 0) break;
				widths[widest] = (widths[widest] ?? 0) - 1;
				over -= 1;
			}
		};
		shrink(flexColumns, preferredMinWidths);
		shrink(flexColumns, absoluteMinWidths);
		shrink(nonFlexColumns, preferredMinWidths);
		shrink(nonFlexColumns, absoluteMinWidths);
	}
	if (maxWidth) {
		const sepCountLocal = columns.length + 1;
		let extra = maxWidth - (widths.reduce((a, b) => a + b, 0) + sepCountLocal);
		if (extra > 0) {
			let flexCols = columns.flatMap((column, i) => column.flex ? [i] : []);
			if (flexCols.length > 0) {
				const caps = columns.map((c) => typeof c.maxWidth === "number" && c.maxWidth > 0 ? Math.floor(c.maxWidth) : Number.POSITIVE_INFINITY);
				while (extra > 0) {
					flexCols = flexCols.filter((i) => (widths[i] ?? 0) < (caps[i] ?? Number.POSITIVE_INFINITY));
					if (flexCols.length === 0) break;
					const rounds = flexCols.reduce((amount, i) => Number.isSafeInteger(widths[i]) ? Math.min(amount, (caps[i] ?? Number.POSITIVE_INFINITY) - (widths[i] ?? 0)) : 1, Number.isSafeInteger(maxWidth) && Number.isSafeInteger(extra) ? Math.max(1, Math.floor(extra / flexCols.length)) : 1);
					for (const i of flexCols) {
						const amount = Math.min(rounds, Math.ceil(extra));
						widths[i] = (widths[i] ?? 0) + amount;
						extra -= amount;
						if (extra <= 0) break;
					}
				}
			}
		}
	}
	const box = border === "ascii" ? {
		tl: "+",
		tr: "+",
		bl: "+",
		br: "+",
		h: "-",
		v: "|",
		t: "+",
		ml: "+",
		m: "+",
		mr: "+",
		b: "+"
	} : {
		tl: "┌",
		tr: "┐",
		bl: "└",
		br: "┘",
		h: "─",
		v: "│",
		t: "┬",
		ml: "├",
		m: "┼",
		mr: "┤",
		b: "┴"
	};
	const hLine = (left, mid, right) => `${left}${widths.map((w) => repeat(box.h, w)).join(mid)}${right}`;
	const contentWidthFor = (i) => {
		const width = widths.at(i);
		if (width === void 0) throw new Error(`expected table column width ${i} to be defined`);
		return Math.max(1, width - padding * 2);
	};
	const padStr = repeat(" ", padding);
	const lines = [];
	const renderRow = (record, isHeader = false) => {
		const wrapped = columns.map((c) => isHeader ? c.header : record[c.key] ?? "").map((cell, i) => wrapLine(cell, contentWidthFor(i)));
		const height = Math.max(...wrapped.map((w) => w.length));
		for (let li = 0; li < height; li += 1) {
			const parts = wrapped.map((cellLines, i) => {
				const aligned = padCell(cellLines[li] ?? "", contentWidthFor(i), columns[i]?.align ?? "left");
				return `${padStr}${aligned}${padStr}`;
			});
			lines.push(`${box.v}${parts.join(box.v)}${box.v}`);
		}
	};
	lines.push(hLine(box.tl, box.t, box.tr));
	renderRow({}, true);
	lines.push(hLine(box.ml, box.m, box.mr));
	for (const row of rows) renderRow(row, false);
	lines.push(hLine(box.bl, box.b, box.br));
	return `${lines.join("\n")}\n`;
}
//#endregion
export { renderTable as n, renderTerminalSafeTable as r, getTerminalTableWidth as t };
