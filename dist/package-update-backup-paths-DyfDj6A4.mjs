import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { a as renderBunCliLauncher, i as parseBunCliLauncher } from "./bun-cli-launcher-B-XyqX49.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { canonicalPathFromExistingAncestor } from "@openclaw/fs-safe/advanced";
import { parse as parse$1, stringify } from "yaml";
//#region src/infra/update-runtime-relocation.ts
const launcherRelativePath = /(\$(?:basedir_abs|basedir_win|basedir)[/\\]|%~dp0\\)([^"\r\n]+)/gu;
/** Check executable references, not cmd-shim-target metadata that may already be correct. */
async function verifyRuntimeLauncher(file, entryName) {
	if ((await fs.lstat(file)).isSymbolicLink()) {
		await fs.stat(file);
		return;
	}
	const content = await fs.readFile(file, "utf8");
	const bunLauncher = parseBunCliLauncher(content);
	const base = content.includes("$basedir_abs") ? await fs.realpath(path.dirname(file)) : path.dirname(file);
	const targets = bunLauncher ? [bunLauncher.entryPath] : [...content.matchAll(launcherRelativePath)].map((match) => match[2].replaceAll("\\", path.sep)).filter((relative) => path.basename(relative) === entryName && !/[$%]/u.test(relative)).map((relative) => path.resolve(base, relative));
	if (targets.length === 0) throw new Error("Cannot resolve the launcher's executable target");
	for (const target of new Set(targets)) await fs.access(target);
}
/** Prepare once for the whole tree; never cache mutable filesystem observations. */
function prepareRuntimeRelocations(relocations) {
	if ("rules" in relocations) return relocations;
	return {
		rules: relocations,
		find: createRuntimePathLookup(relocations.flatMap((relocation) => [relocation.sourceRoot, ...relocation.sourceAliases ?? []].map((root) => [root, {
			root,
			relocation
		}])))
	};
}
function relocateRuntimePath(value, relocations) {
	if ("rules" in relocations) {
		const match = relocations.find(value);
		return match ? path.join(match.relocation.destinationRoot, path.relative(match.root, value)) : value;
	}
	for (const relocation of relocations) {
		const root = [relocation.sourceRoot, ...relocation.sourceAliases ?? []].find((candidate) => isPathInside(candidate, value));
		if (root) return path.join(relocation.destinationRoot, path.relative(root, value));
	}
	return value;
}
async function relocateRuntimeSymlink(file, sourceFile, destinationFile, relocations, assertBeforeMutation) {
	const link = await fs.readlink(file);
	const target = relocateRuntimePath(path.resolve(path.dirname(sourceFile), link), relocations);
	const replacement = path.isAbsolute(link) ? target : path.relative(path.dirname(destinationFile), target) || ".";
	if (replacement === link) return;
	const type = process.platform === "win32" && (await fs.stat(sourceFile)).isDirectory() ? "junction" : "file";
	assertBeforeMutation?.();
	await fs.unlink(file);
	assertBeforeMutation?.();
	await fs.symlink(type === "junction" ? target : replacement, file, type);
}
async function relocateRuntimeLauncher(file, sourceFile, destinationFile, relocations, assertBeforeMutation) {
	const prepared = prepareRuntimeRelocations(relocations);
	const original = await fs.readFile(file, "utf8");
	const bunLauncher = parseBunCliLauncher(original);
	if (bunLauncher) {
		const content = renderBunCliLauncher({
			bunPath: relocateRuntimePath(bunLauncher.bunPath, prepared),
			entryPath: relocateRuntimePath(bunLauncher.entryPath, prepared)
		});
		if (content !== original) {
			assertBeforeMutation?.();
			await fs.writeFile(file, content);
		}
		return;
	}
	const sourceDir = path.dirname(sourceFile);
	const destinationDir = path.dirname(destinationFile);
	const shellBase = original.includes("$basedir_abs") ? await canonicalPathFromExistingAncestor(destinationDir) : destinationDir;
	let content = original.replace(launcherRelativePath, (match, prefix, relative) => {
		if (/[$%]/u.test(relative)) return match;
		const destinationBase = prefix.startsWith("$basedir") ? shellBase : destinationDir;
		const sourceTarget = path.resolve(sourceDir, relative.replaceAll("\\", path.sep));
		const target = isPathInside(sourceDir, sourceTarget) ? path.resolve(destinationBase, path.relative(sourceDir, sourceTarget)) : relocateRuntimePath(sourceTarget, prepared);
		const replacement = path.relative(destinationBase, target);
		return `${prefix}${prefix.startsWith("%") ? replacement.replaceAll("/", "\\") : replacement.replaceAll("\\", "/")}`;
	});
	for (const relocation of prepared.rules) for (const sourceRoot of [relocation.sourceRoot, ...relocation.sourceAliases ?? []]) {
		content = content.replaceAll(`${sourceRoot}${path.sep}`, `${relocation.destinationRoot}${path.sep}`);
		if (path.sep === "\\") content = content.replaceAll(`${sourceRoot.replaceAll("\\", "/")}/`, `${relocation.destinationRoot.replaceAll("\\", "/")}/`);
	}
	if (content !== original) {
		assertBeforeMutation?.();
		await fs.writeFile(file, content);
	}
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
async function relocateModulesManifest(file, sourceFile, destinationFile, relocations, assertBeforeMutation) {
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
		assertBeforeMutation?.();
		await fs.writeFile(file, content);
	}
}
/** Relocate one admitted entry without traversing neighboring private files. */
async function relocateRuntimeEntry(file, sourceFile, destinationFile, kind, relocations, assertBeforeMutation) {
	let relocate;
	if (kind === "symlink") relocate = relocateRuntimeSymlink;
	else if (path.basename(file) === ".modules.yaml") relocate = relocateModulesManifest;
	else if (path.basename(path.dirname(file)) === ".bin" && !file.endsWith(".exe")) relocate = relocateRuntimeLauncher;
	if (relocate) await relocate(file, sourceFile, destinationFile, relocations, assertBeforeMutation);
}
/** Rebind copied entries only; following a store symlink would mutate external data. */
async function relocateRuntimeTree(root, sourceRoot, destinationRoot, relocations) {
	const prepared = prepareRuntimeRelocations(relocations);
	if ((await fs.lstat(root)).isSymbolicLink()) {
		await relocateRuntimeSymlink(root, sourceRoot, destinationRoot, prepared);
		return;
	}
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		const file = path.join(root, entry.name);
		const sourceFile = path.join(sourceRoot, entry.name);
		const destinationFile = path.join(destinationRoot, entry.name);
		if (entry.isDirectory()) await relocateRuntimeTree(file, sourceFile, destinationFile, prepared);
		else if (entry.isSymbolicLink()) await relocateRuntimeEntry(file, sourceFile, destinationFile, "symlink", prepared);
		else if (entry.isFile()) await relocateRuntimeEntry(file, sourceFile, destinationFile, "file", prepared);
	}
}
//#endregion
//#region src/infra/package-update-backup-paths.ts
function isLegacyPackageBackupName(name) {
	return /^\.openclaw[.-]package-backup-\d+-\d+$/u.test(name);
}
function isPackageUpdateRecoveryArtifactName(name) {
	return /^\.openclaw[.-]package-(?:backup-|activation-)/u.test(name);
}
//#endregion
export { relocateRuntimeEntry as a, relocateRuntimeSymlink as c, readRuntimeModulesManifest as i, relocateRuntimeTree as l, isPackageUpdateRecoveryArtifactName as n, relocateRuntimeLauncher as o, prepareRuntimeRelocations as r, relocateRuntimePath as s, isLegacyPackageBackupName as t, verifyRuntimeLauncher as u };
