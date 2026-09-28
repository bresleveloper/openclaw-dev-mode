import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { t as createPreUpdateConfigSnapshot } from "./backup-rotation-BHIBam1J.mjs";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/cli/update-cli/update-command-config-snapshot.ts
async function readUpdateConfigSnapshot(path) {
	const raw = await fs$1.readFile(path, "utf8").catch((error) => {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		return null;
	});
	return {
		path,
		raw,
		hash: hashConfigRaw(raw)
	};
}
async function createUpdateConfigSnapshot(env = process.env) {
	await createPreUpdateConfigSnapshot({
		configPath: resolveConfigPath(env),
		fs: {
			writeFile: fs$1.writeFile,
			readFile: fs$1.readFile,
			existsSync
		}
	});
}
//#endregion
export { readUpdateConfigSnapshot as n, createUpdateConfigSnapshot as t };
