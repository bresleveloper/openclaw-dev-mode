import { j as writeExternalFileWithinRoot } from "./fs-safe-BUXBSN-4.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { t as ensureOutputDirectory } from "./output-directories-CFjcacFr.mjs";
import path from "node:path";
//#region extensions/browser/src/browser/output-files.ts
async function writeExternalFileWithinOutputRoot(params) {
	const outputPath = params.path.trim();
	if (!outputPath) throw new Error("output path is required");
	const rootDir = params.rootDir ? path.resolve(params.rootDir) : path.dirname(path.resolve(outputPath));
	await ensureOutputDirectory(rootDir);
	return (await writeExternalFileWithinRoot({
		rootDir,
		path: outputPath,
		write: params.write
	}).catch((err) => {
		if (err instanceof Error && err.code === "ENOENT") throw new Error("output directory changed while writing file", { cause: err });
		throw err;
	})).path;
}
//#endregion
export { writeExternalFileWithinOutputRoot as t };
