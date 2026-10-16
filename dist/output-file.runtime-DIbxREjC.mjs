import { t as writeSiblingTempFile } from "./sibling-temp-file-Dq7F6WhU.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cli/output-file.runtime.ts
const DEFAULT_CLI_OUTPUT_TEMP_PREFIX = ".openclaw-media-output";
async function resolveExistingOutputMode(filePath) {
	try {
		return (await fs.stat(filePath)).mode & 4095;
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
/** Publish a CLI-owned file only after its sibling temp write completes. */
async function publishOutputFileAtomically(params) {
	const dir = path.dirname(params.filePath);
	await fs.mkdir(dir, { recursive: true });
	const mode = await resolveExistingOutputMode(params.filePath);
	const { result } = await writeSiblingTempFile({
		dir,
		chmodDir: false,
		tempPrefix: params.tempPrefix ?? DEFAULT_CLI_OUTPUT_TEMP_PREFIX,
		...mode === void 0 ? {} : { mode },
		...params.durable ? {
			syncTempFile: true,
			syncParentDir: true
		} : {},
		writeTemp: params.writeTemp,
		resolveFinalPath: () => params.filePath
	});
	return result;
}
//#endregion
export { publishOutputFileAtomically as t };
