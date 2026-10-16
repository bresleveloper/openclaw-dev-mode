import { j as writeExternalFileWithinRoot } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/logging/diagnostic-support-bundle.ts
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
		bytes: Buffer.byteLength(file.content, "utf8")
	}));
}
function assertSafeBundleRelativePath(pathName) {
	const normalized = pathName.replaceAll("\\", "/");
	if (!normalized || normalized.startsWith("/") || normalized.split("/").some((part) => part === "" || part === "." || part === "..")) throw new Error(`Invalid bundle file path: ${pathName}`);
	return normalized;
}
function resolveSupportBundleFilePath(outputDir, pathName) {
	const safePath = assertSafeBundleRelativePath(pathName);
	const resolvedBase = path.resolve(outputDir);
	const resolvedFile = path.resolve(resolvedBase, safePath);
	if (resolvedFile === resolvedBase || !isPathInside(resolvedBase, resolvedFile)) throw new Error(`Bundle file path escaped output directory: ${pathName}`);
	return resolvedFile;
}
/** Writes support-bundle files to a new private directory. */
async function writeSupportBundleDirectory(params) {
	await fs.mkdir(path.dirname(params.outputDir), {
		recursive: true,
		mode: 448
	});
	await fs.mkdir(params.outputDir, { mode: 448 });
	for (const file of params.files) {
		const filePath = resolveSupportBundleFilePath(params.outputDir, file.path);
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
		compressionOptions: { level: 6 }
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
