import { A as writeExternalFileWithinRoot } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/logging/diagnostic-support-bundle.ts
function supportBundleByteLength(content) {
	return Buffer.byteLength(content, "utf8");
}
/** Creates a JSON support-bundle file with a safe relative path. */
function jsonSupportBundleFile(pathName, value) {
	return {
		path: assertSafeBundleRelativePath(pathName),
		mediaType: "application/json",
		content: `${JSON.stringify(value, null, 2)}\n`
	};
}
/** Creates an NDJSON support-bundle file with a safe relative path. */
function jsonlSupportBundleFile(pathName, lines) {
	return {
		path: assertSafeBundleRelativePath(pathName),
		mediaType: "application/x-ndjson",
		content: `${lines.join("\n")}\n`
	};
}
/** Creates a UTF-8 text support-bundle file with a safe relative path. */
function textSupportBundleFile(pathName, content) {
	return {
		path: assertSafeBundleRelativePath(pathName),
		mediaType: "text/plain; charset=utf-8",
		content: content.endsWith("\n") ? content : `${content}\n`
	};
}
/** Summarizes support-bundle files for the bundle manifest. */
function supportBundleContents(files) {
	return files.map((file) => ({
		path: file.path,
		mediaType: file.mediaType,
		bytes: supportBundleByteLength(file.content)
	}));
}
function assertSafeBundleRelativePath(pathName) {
	const normalized = pathName.replaceAll("\\", "/");
	if (!normalized || normalized.startsWith("/") || normalized.split("/").some((part) => part === "" || part === "." || part === "..")) throw new Error(`Invalid bundle file path: ${pathName}`);
	return normalized;
}
async function prepareSupportBundleDirectory(outputDir) {
	await fs.mkdir(path.dirname(outputDir), {
		recursive: true,
		mode: 448
	});
	await fs.mkdir(outputDir, { mode: 448 });
}
function resolveSupportBundleFilePath(outputDir, pathName) {
	const safePath = assertSafeBundleRelativePath(pathName);
	const resolvedBase = path.resolve(outputDir);
	const resolvedFile = path.resolve(resolvedBase, safePath);
	if (resolvedFile === resolvedBase || !isPathInside(resolvedBase, resolvedFile)) throw new Error(`Bundle file path escaped output directory: ${pathName}`);
	return resolvedFile;
}
async function writeSupportBundleFile(outputDir, file) {
	const filePath = resolveSupportBundleFilePath(outputDir, file.path);
	await fs.mkdir(path.dirname(filePath), {
		recursive: true,
		mode: 448
	});
	await fs.writeFile(filePath, file.content, {
		encoding: "utf8",
		flag: "wx",
		mode: 384
	});
}
/** Writes support-bundle files to a new private directory. */
async function writeSupportBundleDirectory(params) {
	await prepareSupportBundleDirectory(params.outputDir);
	for (const file of params.files) await writeSupportBundleFile(params.outputDir, file);
	return supportBundleContents(params.files);
}
/** Writes support-bundle files to a private zip archive and returns the published path and byte size. */
async function writeSupportBundleZip(params) {
	const { default: JSZip } = await import("jszip");
	const zip = new JSZip();
	for (const file of params.files) zip.file(assertSafeBundleRelativePath(file.path), file.content);
	const buffer = await zip.generateAsync({
		type: "nodebuffer",
		compression: "DEFLATE",
		compressionOptions: { level: params.compressionLevel ?? 6 }
	});
	const outputPath = path.resolve(params.outputPath);
	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
		mode: 448
	});
	return {
		path: (await writeExternalFileWithinRoot({
			rootDir: path.dirname(outputPath),
			path: path.basename(outputPath),
			fallbackFileName: "openclaw-support.zip",
			write: async (tempPath) => {
				await fs.writeFile(tempPath, buffer, { mode: 384 });
			}
		})).path,
		bytes: buffer.length
	};
}
//#endregion
export { writeSupportBundleDirectory as a, textSupportBundleFile as i, jsonlSupportBundleFile as n, writeSupportBundleZip as o, supportBundleContents as r, jsonSupportBundleFile as t };
