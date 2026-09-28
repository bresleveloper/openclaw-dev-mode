import { n as captureChannelReadScope } from "./channel-read-authority-CLJnqxr1.mjs";
import fs from "node:fs/promises";
//#region src/media/temp-files.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
async function unlinkIfExists(filePath) {
	if (!filePath) return;
	const readScope = captureChannelReadScope();
	if (readScope) {
		await readScope.discardResource(filePath);
		return;
	}
	try {
		await fs.unlink(filePath);
	} catch {}
}
//#endregion
export { unlinkIfExists as t };
