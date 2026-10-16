import { createAsyncLock as createAsyncLock$1 } from "@openclaw/fs-safe/advanced";
import { JsonFileReadError, readJson, readJsonIfExists, readJsonIfExists as readDurableJsonFile, readJsonSync, readRootJsonObjectSync as readRootJsonObjectSync$1, tryReadJson, tryReadJson as readJsonFile, tryReadJsonSync as tryReadJsonSync$1, writeJson, writeJson as writeJsonAtomic, writeJsonSync as writeJsonSync$1 } from "@openclaw/fs-safe/json";
import { writeTextAtomic } from "@openclaw/fs-safe/atomic";
//#region src/infra/json-files.ts
const writeTextAtomic$1 = async (filePath, content, options) => {
	await writeTextAtomic(filePath, content, {
		mode: options?.mode,
		dirMode: options?.dirMode,
		trailingNewline: options?.trailingNewline,
		durable: options?.durable,
		beforeRename: options?.beforeRename || void 0,
		tempPrefix: options?.tempPrefix || void 0
	});
};
//#endregion
export { readJsonFile as a, readRootJsonObjectSync$1 as c, writeJson as d, writeJsonAtomic as f, readJson as i, tryReadJson as l, writeTextAtomic$1 as m, createAsyncLock$1 as n, readJsonIfExists as o, writeJsonSync$1 as p, readDurableJsonFile as r, readJsonSync as s, JsonFileReadError as t, tryReadJsonSync$1 as u };
