import "@openclaw/fs-safe/path";
import path from "node:path";
import fs from "node:fs";
import "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage } from "node:async_hooks";
AsyncLocalStorage.snapshot();
function resolveIdentityPathViaExistingAncestorSync(targetPath) {
	const fallback = path.resolve(targetPath);
	const missingSegments = [];
	let cursor = fallback;
	while (true) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch {
		const parent = path.dirname(cursor);
		if (parent === cursor) return fallback;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
//#endregion
//#region packages/terminal-core/src/ansi-sequences.ts
const ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
const ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
const ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
const ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
new RegExp(ANSI_OSC_PATTERN, "y");
new RegExp(`${`${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`, "y");
new Intl.Segmenter(void 0, { granularity: "grapheme" });
new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`, "g");
//#endregion
export { resolveIdentityPathViaExistingAncestorSync as t };
