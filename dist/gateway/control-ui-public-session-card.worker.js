import { t as escapeHtml } from "../html-escape-BMD_QFeA.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
//#region src/gateway/control-ui-public-session-card-render.ts
const COLORS = {
	background: "#141413",
	panel: "#1F1F1D",
	text: "#F1EFE8",
	muted: "#B4B2A9",
	red: "#E24B4A",
	green: "#9BC99A",
	line: "#383834"
};
function readFont(url, family) {
	const data = readFileSync(url);
	const tables = /* @__PURE__ */ new Map();
	for (let i = 0; i < data.readUInt16BE(4); i += 1) {
		const offset = 12 + i * 16;
		tables.set(data.toString("ascii", offset, offset + 4), data.readUInt32BE(offset + 8));
	}
	const table = (name) => {
		const offset = tables.get(name);
		if (offset === void 0) throw new Error(`Session card font is missing ${name}`);
		return offset;
	};
	const units = data.readUInt16BE(table("head") + 18);
	const metrics = data.readUInt16BE(table("hhea") + 34);
	const hmtx = table("hmtx");
	const cmap = table("cmap");
	let mapping = 0;
	for (let i = 0; i < data.readUInt16BE(cmap + 2); i += 1) {
		const record = cmap + 4 + i * 8;
		const platform = data.readUInt16BE(record);
		if (platform !== 0 && platform !== 3) continue;
		const candidate = cmap + data.readUInt32BE(record + 4);
		if (data.readUInt16BE(candidate) === 4) {
			mapping = candidate;
			break;
		}
	}
	if (!mapping) throw new Error("Session card font has no Unicode character map");
	const glyphFor = (point) => {
		const segments = data.readUInt16BE(mapping + 6) / 2;
		const ends = mapping + 14;
		const starts = ends + segments * 2 + 2;
		const deltas = starts + segments * 2;
		const ranges = deltas + segments * 2;
		for (let i = 0; i < segments; i += 1) {
			if (point > data.readUInt16BE(ends + i * 2)) continue;
			const start = data.readUInt16BE(starts + i * 2);
			if (point < start) return 0;
			const delta = data.readInt16BE(deltas + i * 2);
			const range = data.readUInt16BE(ranges + i * 2);
			if (!range) return point + delta & 65535;
			const glyph = data.readUInt16BE(ranges + i * 2 + range + (point - start) * 2);
			return glyph ? glyph + delta & 65535 : 0;
		}
		return 0;
	};
	return {
		family,
		path: fileURLToPath(url),
		measure(text, size) {
			let width = 0;
			for (const character of text) {
				const glyph = glyphFor(character.codePointAt(0) ?? 0);
				width += data.readUInt16BE(hmtx + Math.min(glyph, metrics - 1) * 4);
			}
			return width * size / units;
		}
	};
}
let fonts;
function cardFonts() {
	fonts ??= {
		regular: readFont(new URL(new URL("../assets/session-card/Lato-Regular.ttf", import.meta.url).href), "Lato"),
		bold: readFont(new URL(new URL("../assets/session-card/Lato-Bold.ttf", import.meta.url).href), "Lato"),
		serif: readFont(new URL(new URL("../assets/session-card/InstrumentSerif-Regular.ttf", import.meta.url).href), "Instrument Serif"),
		mono: readFont(new URL(new URL("../assets/session-card/IBMPlexMono-Regular.ttf", import.meta.url).href), "IBM Plex Mono")
	};
	return fonts;
}
function cappedText(value, limit) {
	const characters = Array.from(value.slice(0, limit * 2));
	const text = characters.slice(0, limit).join("").replace(/[\p{Cc}\p{Cs}\ufffe\uffff]/gu, " ").replace(/\s+/gu, " ").trim();
	return characters.length > limit ? `${text}…` : text;
}
function ellipsize(text, font, size, width) {
	const characters = Array.from(text.replace(/…$/u, "").trimEnd());
	while (characters.length && font.measure(`${characters.join("")}…`, size) > width) characters.pop();
	return `${characters.join("").trimEnd()}…`;
}
function lines(text, font, size, width, maxLines) {
	const result = [];
	let line = "";
	for (const word of text.split(" ")) {
		if (line && font.measure(`${line} ${word}`, size) <= width) {
			line += ` ${word}`;
			continue;
		}
		if (line) {
			result.push(line);
			line = "";
		}
		if (result.length === maxLines) {
			result[maxLines - 1] = ellipsize(result[maxLines - 1], font, size, width);
			return result;
		}
		for (const character of word) {
			if (line && font.measure(line + character, size) > width) {
				result.push(line);
				line = "";
				if (result.length === maxLines) {
					result[maxLines - 1] = ellipsize(result[maxLines - 1], font, size, width);
					return result;
				}
			}
			line += character;
		}
	}
	if (line) result.push(line);
	return result;
}
function textLine(text, x, y, font, size, options = {}) {
	return `<text x="${x}" y="${y}" font-family="${font.family}" font-size="${size}" fill="${options.color ?? COLORS.text}"${options.bold ? " font-weight=\"700\"" : ""}${options.anchor ? ` text-anchor="${options.anchor}"` : ""}>${escapeHtml(text)}</text>`;
}
function textBlock(text, x, y, font, size, width, maxLines, lineHeight, options = {}) {
	return lines(text, font, size, width, maxLines).map((line, index) => textLine(line, x, y + index * lineHeight, font, size, options)).join("");
}
function mark(x, y, size = 32) {
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 120 120"><path fill="${COLORS.red}" d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100V110H55V100C55 100 60 102 65 100V110H75V100C90 95 105 75 105 55C105 35 90 10 60 10ZM20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45ZM100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z"/><path d="M45 15Q35 5 30 8M75 15Q85 5 90 8" fill="none" stroke="${COLORS.red}" stroke-width="5" stroke-linecap="round"/><circle cx="45" cy="35" r="6" fill="${COLORS.background}"/><circle cx="75" cy="35" r="6" fill="${COLORS.background}"/></svg>`;
}
function integer(value) {
	return new Intl.NumberFormat("en-US").format(Math.max(0, Math.floor(value)));
}
function pill(label, x, y, color, icon = "") {
	const { regular } = cardFonts();
	return `<rect x="${x}" y="${y}" width="${regular.measure(label, 20) + 32 + (icon ? 28 : 0)}" height="40" rx="20" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".3"/>${icon}${textLine(label, x + 16 + (icon ? 28 : 0), y + 27, regular, 20, { color })}`;
}
function headline(card) {
	const { regular, bold, serif } = cardFonts();
	const quote = cappedText(card.quote ?? "", 500);
	const title = cappedText(card.title, 280);
	const hostLine = lines(cappedText(card.host, 120), regular, 19, 350, 1)[0] ?? "";
	const status = card.status;
	let svg = `${mark(68, 57)}${textLine("OpenClaw · Public session", 114, 81, regular, 22, { color: COLORS.muted })}`;
	if (status) {
		const color = status === "Done" ? COLORS.green : status === "Failed" ? COLORS.red : COLORS.muted;
		svg += pill(status, 1132 - regular.measure(status, 20) - 32, 53, color);
	}
	const titleY = quote ? 171 : 213;
	const titleLines = lines(title, bold, 56, 1064, 3);
	svg += titleLines.map((line, index) => textLine(line, 68, titleY + index * 65, bold, 56, { bold: true })).join("");
	if (quote) {
		const quoteY = titleY + (titleLines.length - 1) * 65 + 40;
		const quoteLines = lines(quote, serif, 29, 1015, 3);
		svg += `<rect x="69" y="${quoteY}" width="4" height="${quoteLines.length * 36 + 4}" rx="2" fill="${COLORS.red}"/>`;
		svg += quoteLines.map((line, index) => textLine(line, 94, quoteY + 26 + index * 36, serif, 29, { color: COLORS.muted })).join("");
	}
	svg += `<path d="M68 516H1132" stroke="${COLORS.line}"/>`;
	const agent = cappedText(card.agentName ?? "", 100);
	let footerX = 68;
	if (agent) {
		svg += `<circle cx="88" cy="559" r="20" fill="${COLORS.red}" fill-opacity=".16"/>`;
		svg += textLine(Array.from(agent)[0]?.toLocaleUpperCase("en-US") ?? "", 88, 566, bold, 21, {
			bold: true,
			anchor: "middle",
			color: COLORS.red
		});
		footerX = 121;
	}
	const footer = [
		agent,
		cappedText(card.repoSlug ?? "", 120),
		`${integer(card.messageCount)} messages`
	].filter(Boolean).join(" · ");
	const footerWidth = 1132 - footerX - (hostLine ? regular.measure(hostLine, 19) + 36 : 0);
	svg += textBlock(footer, footerX, 566, regular, 20, footerWidth, 1, 24, { color: COLORS.muted });
	if (hostLine) svg += textLine(hostLine, 1132, 566, regular, 19, {
		anchor: "end",
		color: COLORS.muted
	});
	return svg;
}
function receipt(card, worktree) {
	const { regular, bold, mono } = cardFonts();
	let svg = `<rect width="10" height="630" fill="${COLORS.red}"/><rect x="684" width="516" height="630" fill="${COLORS.panel}"/>`;
	svg += mark(62, 57);
	svg += textLine("OpenClaw · Public session", 108, 81, regular, 21, { color: COLORS.muted });
	svg += textBlock(cappedText(card.title, 280), 62, 174, bold, 46, 564, 3, 55, { bold: true });
	const source = [cappedText(card.repoSlug ?? "", 120), cappedText(worktree.branch, 140)].filter(Boolean).join(" · ");
	svg += textBlock(source, 62, 357, mono, 19, 562, 2, 28, { color: COLORS.muted });
	if (worktree.prState) {
		const color = worktree.prState === "Merged" ? "#BCABE6" : worktree.prState === "Open" ? COLORS.green : COLORS.muted;
		const icon = `<g transform="translate(78 535)" fill="none" stroke="${color}" stroke-width="1.8"><circle cx="3" cy="3" r="2.5"/><circle cx="3" cy="17" r="2.5"/><circle cx="15" cy="17" r="2.5"/><path d="M3 6V14M15 14V8C15 5 12 3 9 3M9 0V6"/></g>`;
		svg += pill(worktree.prState, 62, 524, color, icon);
	}
	const agent = cappedText(card.agentName ?? "", 100);
	if (agent) {
		const x = worktree.prState ? 62 + regular.measure(worktree.prState, 20) + 78 : 62;
		svg += textBlock(`by ${agent}`, x, 551, regular, 20, 626 - x, 1, 24, { color: COLORS.muted });
	}
	svg += textLine("Changes", 734, 106, regular, 21, { color: COLORS.muted });
	const additions = worktree.additions === void 0 ? "" : `+${integer(worktree.additions)}`;
	const deletions = worktree.deletions === void 0 ? "" : `−${integer(worktree.deletions)}`;
	const numberWidth = bold.measure(additions + (additions && deletions ? "  " : "") + deletions, 48);
	const numberSize = Math.min(48, 414 / Math.max(1, numberWidth) * 48);
	if (additions) svg += textLine(additions, 734, 178, bold, numberSize, {
		bold: true,
		color: COLORS.green
	});
	if (deletions) svg += textLine(deletions, 734 + (additions ? bold.measure(`${additions}  `, numberSize) : 0), 178, bold, numberSize, {
		bold: true,
		color: COLORS.red
	});
	if (worktree.files !== void 0) svg += textLine(`${integer(worktree.files)} files`, 734, 222, regular, 23, { color: COLORS.muted });
	svg += `<path d="M734 267H1148" stroke="${COLORS.line}"/>`;
	svg += textLine("Session", 734, 316, regular, 21, { color: COLORS.muted });
	const session = `${integer(card.messageCount)} messages${card.durationMinutes === void 0 ? "" : ` · ${integer(card.durationMinutes)} min`}`;
	svg += textBlock(session, 734, 363, regular, 27, 414, 2, 34);
	const checks = cappedText(worktree.checks ?? "", 140);
	if (checks) {
		svg += `<path d="M734 423H1148" stroke="${COLORS.line}"/>`;
		svg += textLine("Checks", 734, 472, regular, 21, { color: COLORS.muted });
		svg += textBlock(checks, 734, 516, regular, 24, 414, 2, 30);
	}
	return svg;
}
function renderPublicSessionCardSvg(card) {
	const worktree = card.worktree;
	const hasChanges = worktree && [
		worktree.additions,
		worktree.deletions,
		worktree.files
	].some((value) => value !== void 0 && value > 0);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${COLORS.background}"/><g font-kerning="none">${hasChanges ? receipt(card, worktree) : headline(card)}</g></svg>`;
}
/** Called only by the card-rendering worker; font parsing and rasterization stay off the Gateway thread. */
function renderPublicSessionCardPng(card) {
	const svg = renderPublicSessionCardSvg(card);
	return new Resvg(svg, { font: {
		loadSystemFonts: false,
		fontFiles: Object.values(cardFonts()).map((font) => font.path),
		defaultFontFamily: "Lato"
	} }).render().asPng();
}
//#endregion
//#region src/gateway/control-ui-public-session-card.worker.ts
serveWorkerTasks((input) => {
	return Uint8Array.from(renderPublicSessionCardPng(input));
}, { transferList: (png) => [png.buffer] });
//#endregion
export {};
