import "./fs-safe-defaults-D3xd3zKO.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { createAsyncLock } from "@openclaw/fs-safe/advanced";
import { JsonFileReadError, readJson, readJson as readJsonFileStrict, readJsonIfExists, readJsonIfExists as readDurableJsonFile, readJsonSync, readRootJsonObjectSync as readRootJsonObjectSync$1, readRootJsonSync, readRootStructuredFileSync, tryReadJson, tryReadJson as readJsonFile, tryReadJsonSync as readJsonFileSync, tryReadJsonSync as tryReadJsonSync$1, writeJson, writeJson as writeJsonAtomic, writeJsonSync as writeJsonSync$1 } from "@openclaw/fs-safe/json";
//#region src/infra/json-files.ts
/** Writes text through the repo atomic replace helper with durable fsync by default. */
async function writeTextAtomic(filePath, content, options) {
	const payload = options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content;
	await replaceFileAtomic({
		filePath,
		content: payload,
		mode: options?.mode ?? 384,
		dirMode: options?.dirMode ?? 511 & ~process.umask(),
		copyFallbackOnPermissionError: true,
		syncTempFile: options?.durable !== false,
		syncParentDir: options?.durable !== false,
		...options?.beforeRename ? { beforeRename: options.beforeRename } : {},
		...options?.tempPrefix ? { tempPrefix: options.tempPrefix } : {}
	});
}
//#endregion
export { writeJsonSync$1 as _, readJsonFile as a, readJsonIfExists as c, readRootJsonSync as d, readRootStructuredFileSync as f, writeJsonAtomic as g, writeJson as h, readJson as i, readJsonSync as l, tryReadJsonSync$1 as m, createAsyncLock as n, readJsonFileStrict as o, tryReadJson as p, readDurableJsonFile as r, readJsonFileSync as s, JsonFileReadError as t, readRootJsonObjectSync$1 as u, writeTextAtomic as v };
