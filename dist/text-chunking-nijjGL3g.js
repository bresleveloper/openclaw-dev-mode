import "./safe-text-Crz8bz-e.js";
import { n as chunkTextByBreakResolver } from "./text-chunking-BUHnr--K.js";
import "./tables-CNojwOtD.js";
import "./chunk-items-DgQ9mA4n.js";
import "./auto-linked-file-ref-SPenUvZ7.js";
//#region src/plugin-sdk/text-chunking.ts
/**
* Splits outbound channel text into chunks no longer than the requested limit.
* Newline boundaries win over spaces; text without usable separators falls back
* to a hard character split so channel senders always receive bounded strings.
*/
function chunkTextForOutbound(text, limit) {
	return chunkTextByBreakResolver(text, limit, (window) => {
		const lastNewline = window.lastIndexOf("\n");
		const lastSpace = window.lastIndexOf(" ");
		return lastNewline > 0 ? lastNewline : lastSpace;
	});
}
//#endregion
export { chunkTextForOutbound as t };
