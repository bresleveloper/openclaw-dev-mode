import { A as writeExternalFileWithinRoot } from "./fs-safe-BAPek8At.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import { t as ensureOutputDirectory } from "./output-directories-CQa36ejE.mjs";
import path from "node:path";
//#region extensions/browser/src/browser/output-files.ts
/**
* Browser output file writer.
*
* Validates caller-provided output paths against a root before writing
* screenshots, PDFs, downloads, or traces to disk.
*/
/** Write a browser output file within a caller-selected output root. */
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
