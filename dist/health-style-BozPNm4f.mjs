import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
//#region packages/terminal-core/src/health-style.ts
const HEALTH_STATUS_COLORS = [
	["failed", "error"],
	["degraded", "warn"],
	["ok", "success"],
	["linked", "success"],
	["configured", "success"],
	["not linked", "warn"],
	["not configured", "muted"],
	["unknown", "warn"]
];
/** Highlight known health status prefixes in a "label: detail" line. */
function styleHealthChannelLine(line, rich) {
	if (!rich) return line;
	const colon = line.indexOf(":");
	if (colon === -1) return line;
	const detail = line.slice(colon + 1).trimStart();
	const normalized = normalizeLowercaseStringOrEmpty(detail.slice(0, 14));
	const applyPrefix = (prefix, color) => `${line.slice(0, colon + 1)} ${color(detail.slice(0, prefix.length))}${detail.slice(prefix.length)}`;
	for (const [prefix, color] of HEALTH_STATUS_COLORS) if (normalized.startsWith(prefix)) return applyPrefix(prefix, theme[color]);
	return line;
}
//#endregion
export { styleHealthChannelLine as t };
