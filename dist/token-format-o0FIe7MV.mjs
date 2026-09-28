import "./src-CZ2wJvNB.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
//#region src/utils/token-format.ts
/** Formats a token count for compact human-facing status text. */
function formatTokenCount(value) {
	if (value === void 0 || !Number.isFinite(value)) return "0";
	const safe = Math.max(0, value);
	return formatCompactTokenCount(safe, { thousandsPrecision: safe >= 1e4 ? 0 : 1 });
}
//#endregion
export { formatTokenCount as t };
