import { a as visibleWidth, i as truncateToVisibleWidth, n as splitGraphemes } from "./ansi-zQGMgESZ.js";
import path from "node:path";
import os from "node:os";
//#region packages/terminal-core/src/display-string.ts
/** Normalize env/home values and reject shell placeholder strings. */
function normalize$1(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
/** Run a home resolver defensively because some runtimes throw for missing passwd data. */
function normalizeSafe(fn) {
	try {
		return normalize$1(fn());
	} catch {
		return;
	}
}
/** Resolve Termux home from its Android prefix layout. */
function resolveTermuxHome(env) {
	const prefix = normalize$1(env.PREFIX);
	if (!prefix || !normalize$1(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
/** Resolve the underlying OS home before applying OpenClaw overrides. */
function resolveRawOsHomeDir(env, homedir) {
	return normalize$1(env.HOME) ?? normalize$1(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
/** Resolve raw home with OPENCLAW_HOME tilde expansion. */
function resolveRawHomeDir(env = process.env, homedir = os.homedir) {
	const explicitHome = normalize$1(env.OPENCLAW_HOME);
	if (explicitHome) {
		const fallbackHome = resolveRawOsHomeDir(env, homedir);
		return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : explicitHome;
	}
	return resolveRawOsHomeDir(env, homedir);
}
/** Resolve the effective absolute home directory for display replacement. */
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
/** Resolve the display prefix that should replace the effective home path. */
function resolveHomeDisplayPrefix() {
	const home = resolveEffectiveHomeDir();
	if (!home) return;
	return process.env.OPENCLAW_HOME?.trim() ? {
		home,
		prefix: "$OPENCLAW_HOME"
	} : {
		home,
		prefix: "~"
	};
}
/** Replace the effective home path with "~" or "$OPENCLAW_HOME" for terminal display. */
function displayString(input) {
	if (!input) return input;
	const display = resolveHomeDisplayPrefix();
	return display ? input.split(display.home).join(display.prefix) : input;
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
	const content = visibleWidth(text) > width ? truncateToVisibleWidth(text, width) : text;
	const w = visibleWidth(content);
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
function wrapLine(text, width) {
	if (width <= 0) return [text];
	const ESC = "\x1B";
	const SGR_RESET = `${ESC}[0m`;
	const tokens = [];
	for (let i = 0; i < text.length;) {
		if (text[i] === ESC) {
			if (text[i + 1] === "[") {
				let j = i + 2;
				while (j < text.length) {
					const ch = text[j];
					if (ch === "m") break;
					if (ch && ch >= "0" && ch <= "9") {
						j += 1;
						continue;
					}
					if (ch === ";") {
						j += 1;
						continue;
					}
					break;
				}
				if (text[j] === "m") {
					tokens.push({
						kind: "ansi",
						value: text.slice(i, j + 1)
					});
					i = j + 1;
					continue;
				}
			}
			if (text[i + 1] === "]" && text.slice(i + 2, i + 5) === "8;;") {
				const st = text.indexOf(`${ESC}\\`, i + 5);
				if (st >= 0) {
					tokens.push({
						kind: "ansi",
						value: text.slice(i, st + 2)
					});
					i = st + 2;
					continue;
				}
			}
		}
		let nextEsc = text.indexOf(ESC, i);
		if (nextEsc < 0) nextEsc = text.length;
		if (nextEsc === i) {
			tokens.push({
				kind: "char",
				value: ESC
			});
			i += 1;
			continue;
		}
		const plainChunk = text.slice(i, nextEsc);
		for (const grapheme of splitGraphemes(plainChunk)) tokens.push({
			kind: "char",
			value: grapheme
		});
		i = nextEsc;
	}
	const firstCharIndex = tokens.findIndex((t) => t.kind === "char");
	if (firstCharIndex < 0) return [text];
	let lastCharIndex = -1;
	for (let i = tokens.length - 1; i >= 0; i -= 1) if (tokens[i]?.kind === "char") {
		lastCharIndex = i;
		break;
	}
	const prefixAnsi = tokens.slice(0, firstCharIndex).filter((t) => t.kind === "ansi").map((t) => t.value).join("");
	const suffixAnsi = tokens.slice(lastCharIndex + 1).filter((t) => t.kind === "ansi").map((t) => t.value).join("");
	const coreTokens = tokens.slice(firstCharIndex, lastCharIndex + 1);
	const lines = [];
	const isBreakChar = (ch) => ch === " " || ch === "	" || ch === "/" || ch === "-" || ch === "_" || ch === ".";
	const isSpaceChar = (ch) => ch === " " || ch === "	";
	let skipNextLf = false;
	const buf = [];
	let bufVisible = 0;
	let lastBreakIndex = null;
	const bufToString = (slice) => (slice ?? buf).map((t) => t.value).join("");
	const bufVisibleWidth = (slice) => slice.reduce((acc, t) => acc + (t.kind === "char" ? visibleWidth(t.value) : 0), 0);
	const parseSgrParams = (value) => {
		if (!value.startsWith(`${ESC}[`) || !value.endsWith("m")) return null;
		const raw = value.slice(2, -1);
		if (!raw) return [0];
		const params = raw.split(";").map((part) => part === "" ? 0 : Number(part));
		return params.every((param) => Number.isInteger(param)) ? params : null;
	};
	const activeSgrAfter = (tokensValue) => {
		const active = [];
		const resetCategoriesFor = (params) => {
			const categories = /* @__PURE__ */ new Set();
			for (const param of params) if (param === 22) categories.add("intensity");
			else if (param === 23) categories.add("italic");
			else if (param === 24) categories.add("underline");
			else if (param === 25) categories.add("blink");
			else if (param === 27) categories.add("inverse");
			else if (param === 28) categories.add("conceal");
			else if (param === 29) categories.add("strike");
			else if (param === 39) categories.add("foreground");
			else if (param === 49) categories.add("background");
			return categories;
		};
		const activeCategoriesFor = (params) => {
			const categories = /* @__PURE__ */ new Set();
			for (let i = 0; i < params.length; i += 1) {
				const param = params[i] ?? 0;
				if (param === 1 || param === 2) categories.add("intensity");
				else if (param === 3) categories.add("italic");
				else if (param === 4) categories.add("underline");
				else if (param === 5 || param === 6) categories.add("blink");
				else if (param === 7) categories.add("inverse");
				else if (param === 8) categories.add("conceal");
				else if (param === 9) categories.add("strike");
				else if (param >= 30 && param <= 37 || param >= 90 && param <= 97) categories.add("foreground");
				else if (param === 38) {
					categories.add("foreground");
					if (params[i + 1] === 2) i += 4;
					else if (params[i + 1] === 5) i += 2;
				} else if (param >= 40 && param <= 47 || param >= 100 && param <= 107) categories.add("background");
				else if (param === 48) {
					categories.add("background");
					if (params[i + 1] === 2) i += 4;
					else if (params[i + 1] === 5) i += 2;
				}
			}
			return categories;
		};
		const intersects = (left, right) => {
			for (const value of left) if (right.has(value)) return true;
			return false;
		};
		for (const token of tokensValue) {
			if (token.kind !== "ansi") continue;
			const params = parseSgrParams(token.value);
			if (!params) continue;
			if (params.includes(0)) active.length = 0;
			const resetCategories = resetCategoriesFor(params);
			if (resetCategories.size > 0) for (let i = active.length - 1; i >= 0; i -= 1) {
				const entry = active[i];
				if (entry && intersects(entry.categories, resetCategories)) active.splice(i, 1);
			}
			const activeCategories = activeCategoriesFor(params);
			if (activeCategories.size > 0) {
				for (let i = active.length - 1; i >= 0; i -= 1) {
					const entry = active[i];
					if (entry && intersects(entry.categories, activeCategories)) active.splice(i, 1);
				}
				active.push({
					value: token.value,
					categories: activeCategories
				});
			}
		}
		return active.map((entry) => entry.value).join("");
	};
	const pushLine = (value) => {
		const cleaned = value.replace(/\s+$/, "");
		if (visibleWidth(cleaned) === 0) return;
		lines.push(cleaned);
	};
	const trimLeadingSpaces = (tokensLocal) => {
		while (true) {
			const firstCharIndexLocal = tokensLocal.findIndex((token) => token.kind === "char");
			if (firstCharIndexLocal < 0) return;
			const firstChar = tokensLocal[firstCharIndexLocal];
			if (!firstChar || !isSpaceChar(firstChar.value)) return;
			tokensLocal.splice(firstCharIndexLocal, 1);
		}
	};
	const flushAt = (breakAt) => {
		if (buf.length === 0) return;
		if (breakAt == null || breakAt <= 0) {
			const activeSgr = activeSgrAfter(buf);
			pushLine(activeSgr ? `${bufToString()}${SGR_RESET}` : bufToString());
			buf.length = 0;
			if (activeSgr) buf.push({
				kind: "ansi",
				value: activeSgr
			});
			bufVisible = 0;
			lastBreakIndex = null;
			return;
		}
		const left = buf.slice(0, breakAt);
		const rest = buf.slice(breakAt);
		const activeSgr = activeSgrAfter(left);
		pushLine(activeSgr ? `${bufToString(left)}${SGR_RESET}` : bufToString(left));
		trimLeadingSpaces(rest);
		if (activeSgr) rest.unshift({
			kind: "ansi",
			value: activeSgr
		});
		buf.length = 0;
		buf.push(...rest);
		bufVisible = bufVisibleWidth(buf);
		lastBreakIndex = null;
	};
	for (const token of coreTokens) {
		if (token.kind === "ansi") {
			buf.push(token);
			continue;
		}
		const ch = token.value;
		if (skipNextLf) {
			skipNextLf = false;
			if (ch === "\n") continue;
		}
		if (ch === "\n" || ch === "\r") {
			flushAt(buf.length);
			if (ch === "\r") skipNextLf = true;
			continue;
		}
		const charWidth = visibleWidth(ch);
		if (bufVisible + charWidth > width && bufVisible > 0) flushAt(lastBreakIndex);
		if (bufVisible === 0 && isSpaceChar(ch)) continue;
		buf.push(token);
		bufVisible += charWidth;
		if (isBreakChar(ch)) lastBreakIndex = buf.length;
	}
	flushAt(buf.length);
	if (!lines.length) return [""];
	if (!prefixAnsi && !suffixAnsi) return lines;
	return lines.map((line) => {
		if (!line) return line;
		return `${prefixAnsi}${line}${suffixAnsi}`;
	});
}
function normalizeWidth(n) {
	if (n == null) return;
	if (!Number.isFinite(n) || n <= 0) return;
	return Math.floor(n);
}
function getTerminalTableWidth(minWidth = 60, fallbackWidth = 120) {
	return Math.max(minWidth, process.stdout.columns ?? fallbackWidth);
}
function renderTable(opts) {
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
			cellW: Math.max(0, ...rows.map((r) => visibleWidth(r[c.key] ?? "")))
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
		const flexOrder = columns.map((_c, i) => ({
			i,
			w: widths[i] ?? 0
		})).filter(({ i }) => Boolean(columns[i]?.flex)).toSorted((a, b) => b.w - a.w).map((x) => x.i);
		const nonFlexOrder = columns.map((_c, i) => ({
			i,
			w: widths[i] ?? 0
		})).filter(({ i }) => !columns[i]?.flex).toSorted((a, b) => b.w - a.w).map((x) => x.i);
		const shrink = (order, minWidths) => {
			while (over > 0) {
				let progressed = false;
				for (const i of order) {
					if ((widths[i] ?? 0) <= (minWidths[i] ?? 0)) continue;
					widths[i] = (widths[i] ?? 0) - 1;
					over -= 1;
					progressed = true;
					if (over <= 0) break;
				}
				if (!progressed) break;
			}
		};
		shrink(flexOrder, preferredMinWidths);
		shrink(flexOrder, absoluteMinWidths);
		shrink(nonFlexOrder, preferredMinWidths);
		shrink(nonFlexOrder, absoluteMinWidths);
	}
	if (maxWidth) {
		const sepCountLocal = columns.length + 1;
		let extra = maxWidth - (widths.reduce((a, b) => a + b, 0) + sepCountLocal);
		if (extra > 0) {
			const flexCols = columns.map((c, i) => ({
				c,
				i
			})).filter(({ c }) => Boolean(c.flex)).map(({ i }) => i);
			if (flexCols.length > 0) {
				const caps = columns.map((c) => typeof c.maxWidth === "number" && c.maxWidth > 0 ? Math.floor(c.maxWidth) : Number.POSITIVE_INFINITY);
				while (extra > 0) {
					let progressed = false;
					for (const i of flexCols) {
						if ((widths[i] ?? 0) >= (caps[i] ?? Number.POSITIVE_INFINITY)) continue;
						widths[i] = (widths[i] ?? 0) + 1;
						extra -= 1;
						progressed = true;
						if (extra <= 0) break;
					}
					if (!progressed) break;
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
	const contentWidthFor = (i) => Math.max(1, widths[i] - padding * 2);
	const padStr = repeat(" ", padding);
	const renderRow = (record, isHeader = false) => {
		const wrapped = columns.map((c) => isHeader ? c.header : record[c.key] ?? "").map((cell, i) => wrapLine(cell, contentWidthFor(i)));
		const height = Math.max(...wrapped.map((w) => w.length));
		const out = [];
		for (let li = 0; li < height; li += 1) {
			const parts = wrapped.map((lines, i) => {
				return `${padStr}${padCell(lines[li] ?? "", contentWidthFor(i), columns[i]?.align ?? "left")}${padStr}`;
			});
			out.push(`${box.v}${parts.join(box.v)}${box.v}`);
		}
		return out;
	};
	const lines = [];
	lines.push(hLine(box.tl, box.t, box.tr));
	lines.push(...renderRow({}, true));
	lines.push(hLine(box.ml, box.m, box.mr));
	for (const row of rows) lines.push(...renderRow(row, false));
	lines.push(hLine(box.bl, box.b, box.br));
	return `${lines.join("\n")}\n`;
}
//#endregion
export { renderTable as n, getTerminalTableWidth as t };
