import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { parse as parse$1, stringify } from "yaml";
//#region src/infra/update-runtime-relocation.ts
function relocateRuntimePath(value, relocations) {
	for (const relocation of relocations) {
		const root = [relocation.sourceRoot, ...relocation.sourceAliases ?? []].find((candidate) => isPathInside(candidate, value));
		if (root) return path.join(relocation.destinationRoot, path.relative(root, value));
	}
	return value;
}
async function relocateRuntimeSymlink(file, sourceFile, destinationFile, relocations) {
	const link = await fs.readlink(file);
	const target = relocateRuntimePath(path.resolve(path.dirname(sourceFile), link), relocations);
	const replacement = path.isAbsolute(link) ? target : path.relative(path.dirname(destinationFile), target);
	if (replacement === link) return;
	const type = process.platform === "win32" && (await fs.stat(sourceFile)).isDirectory() ? "junction" : "file";
	await fs.unlink(file);
	await fs.symlink(type === "junction" ? target : replacement, file, type);
}
async function relocateRuntimeLauncher(file, sourceFile, destinationFile, relocations) {
	const original = await fs.readFile(file, "utf8");
	let content = original.replace(/(\$(?:basedir|basedir_win)[/\\]|%~dp0\\)([^"\r\n]+)/gu, (match, prefix, relative) => {
		if (/[$%]/u.test(relative)) return match;
		const sourceTarget = path.resolve(path.dirname(sourceFile), relative.replaceAll("\\", path.sep));
		const target = isPathInside(path.dirname(sourceFile), sourceTarget) ? path.resolve(path.dirname(destinationFile), path.relative(path.dirname(sourceFile), sourceTarget)) : relocateRuntimePath(sourceTarget, relocations);
		const replacement = path.relative(path.dirname(destinationFile), target);
		return `${prefix}${prefix.startsWith("%") ? replacement.replaceAll("/", "\\") : replacement.replaceAll("\\", "/")}`;
	});
	for (const relocation of relocations) for (const sourceRoot of [relocation.sourceRoot, ...relocation.sourceAliases ?? []]) {
		content = content.replaceAll(`${sourceRoot}${path.sep}`, `${relocation.destinationRoot}${path.sep}`);
		if (path.sep === "\\") content = content.replaceAll(`${sourceRoot.replaceAll("\\", "/")}/`, `${relocation.destinationRoot.replaceAll("\\", "/")}/`);
	}
	if (content !== original) await fs.writeFile(file, content);
}
async function readRuntimeModulesManifest(file) {
	const original = await fs.readFile(file, "utf8").catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	});
	if (original === null) return null;
	const manifest = parse$1(original);
	return isRecord(manifest) ? {
		original,
		manifest
	} : null;
}
async function relocateModulesManifest(file, sourceFile, destinationFile, relocations) {
	const contents = await readRuntimeModulesManifest(file);
	if (!contents) return;
	const { original, manifest } = contents;
	let changed = false;
	for (const key of ["virtualStoreDir", "storeDir"]) {
		const value = manifest[key];
		if (typeof value === "string") {
			const target = relocateRuntimePath(path.resolve(path.dirname(sourceFile), value), relocations);
			const replacement = path.isAbsolute(value) ? target : path.relative(path.dirname(destinationFile), target);
			if (replacement !== value) {
				manifest[key] = replacement;
				changed = true;
			}
		}
	}
	if (changed) {
		const content = original.trimStart().startsWith("{") ? `${JSON.stringify(manifest, null, 2)}\n` : stringify(manifest);
		await fs.writeFile(file, content);
	}
}
/** Relocate one admitted entry without traversing neighboring private files. */
async function relocateRuntimeEntry(file, sourceFile, destinationFile, kind, relocations) {
	if (kind === "symlink") await relocateRuntimeSymlink(file, sourceFile, destinationFile, relocations);
	else if (path.basename(file) === ".modules.yaml") await relocateModulesManifest(file, sourceFile, destinationFile, relocations);
	else if (path.basename(path.dirname(file)) === ".bin" && !file.endsWith(".exe")) await relocateRuntimeLauncher(file, sourceFile, destinationFile, relocations);
}
/** Rebind copied entries only; following a store symlink would mutate external data. */
async function relocateRuntimeTree(root, sourceRoot, destinationRoot, relocations) {
	if ((await fs.lstat(root)).isSymbolicLink()) {
		await relocateRuntimeSymlink(root, sourceRoot, destinationRoot, relocations);
		return;
	}
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		const file = path.join(root, entry.name);
		const sourceFile = path.join(sourceRoot, entry.name);
		const destinationFile = path.join(destinationRoot, entry.name);
		if (entry.isDirectory()) await relocateRuntimeTree(file, sourceFile, destinationFile, relocations);
		else if (entry.isSymbolicLink()) await relocateRuntimeEntry(file, sourceFile, destinationFile, "symlink", relocations);
		else if (entry.isFile()) await relocateRuntimeEntry(file, sourceFile, destinationFile, "file", relocations);
	}
}
//#endregion
export { relocateRuntimeSymlink as a, relocateRuntimePath as i, relocateRuntimeEntry as n, relocateRuntimeTree as o, relocateRuntimeLauncher as r, readRuntimeModulesManifest as t };
