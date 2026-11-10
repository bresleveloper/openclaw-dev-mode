import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { a as renderBunCliLauncher, i as parseBunCliLauncher } from "./bun-cli-launcher-B-XyqX49.mjs";
import { t as ignoreMissingUpdateCandidateFile } from "./update-candidate-files-BfBN3EpP.mjs";
import fs from "node:fs/promises";
import path from "node:path";
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
async function isOptionalPackageLink(file) {
	const parent = path.dirname(file);
	const modules = path.basename(parent).startsWith("@") ? path.dirname(parent) : parent;
	if (path.basename(modules) !== "node_modules") return false;
	const name = path.relative(modules, file).split(path.sep).join("/");
	const owner = path.dirname(modules);
	const roots = [owner];
	if (path.basename(path.dirname(owner)) === ".pnpm") for (const entry of await fs.readdir(modules, { withFileTypes: true })) {
		if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
		const directory = path.join(modules, entry.name);
		if (entry.name.startsWith("@")) {
			for (const child of await fs.readdir(directory, { withFileTypes: true })) if (child.isDirectory()) roots.push(path.join(directory, child.name));
		} else roots.push(directory);
	}
	for (const root of roots) {
		const content = await fs.readFile(path.join(root, "package.json"), "utf8").catch(ignoreMissingUpdateCandidateFile);
		const manifest = content === void 0 ? void 0 : JSON.parse(content);
		if (isRecord(manifest) && isRecord(manifest.optionalDependencies) && typeof manifest.optionalDependencies[name] === "string") return true;
	}
	return false;
}
async function relocateRuntimeSymlink(file, sourceFile, destinationFile, relocations, assertBeforeMutation) {
	const link = await fs.readlink(file);
	const target = relocateRuntimePath(path.resolve(path.dirname(sourceFile), link), relocations);
	const replacement = path.isAbsolute(link) ? target : path.relative(path.dirname(destinationFile), target) || ".";
	if (replacement === link) return;
	let type = "file";
	if (process.platform === "win32") try {
		type = (await fs.stat(sourceFile)).isDirectory() ? "junction" : "file";
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") || !await isOptionalPackageLink(sourceFile)) throw error;
		assertBeforeMutation?.();
		await fs.unlink(file);
		return;
	}
	assertBeforeMutation?.();
	await fs.unlink(file);
	assertBeforeMutation?.();
	await fs.symlink(type === "junction" ? target : replacement, file, type);
}
async function relocateRuntimeLauncher(file, sourceFile, destinationFile, relocations, assertBeforeMutation) {
	const prepared = prepareRuntimeRelocations(relocations);
	const original = await fs.readFile(file, "utf8");
	const bunLauncher = parseBunCliLauncher(original);
	let content;
	if (bunLauncher) content = renderBunCliLauncher({
		bunPath: relocateRuntimePath(bunLauncher.bunPath, prepared),
		entryPath: relocateRuntimePath(bunLauncher.entryPath, prepared)
	});
	else {
		const sourceDir = path.dirname(sourceFile);
		const destinationDir = path.dirname(destinationFile);
		const shellBase = original.includes("$basedir_abs") ? await canonicalPathFromExistingAncestor(destinationDir) : destinationDir;
		content = original.replace(launcherRelativePath, (match, prefix, relative) => {
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
	}
	if (content !== original) {
		assertBeforeMutation?.();
		await fs.writeFile(file, content);
	}
}
async function readRuntimeModulesManifest(file) {
	const original = await fs.readFile(file, "utf8").catch((error) => ignoreMissingUpdateCandidateFile(error) ?? null);
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
/** Files rewritten during relocation must never share an inode with the live package. */
function resolveRuntimeFileRelocator(file) {
	if (path.basename(file) === ".modules.yaml") return relocateModulesManifest;
	if (path.basename(path.dirname(file)) === ".bin" && !file.endsWith(".exe")) return relocateRuntimeLauncher;
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
		const relocate = entry.isDirectory() ? relocateRuntimeTree : entry.isSymbolicLink() ? relocateRuntimeSymlink : entry.isFile() ? resolveRuntimeFileRelocator(file) : void 0;
		if (relocate) await relocate(file, path.join(sourceRoot, entry.name), path.join(destinationRoot, entry.name), prepared);
	}
}
//#endregion
export { relocateRuntimeSymlink as a, verifyRuntimeLauncher as c, relocateRuntimePath as i, readRuntimeModulesManifest as n, relocateRuntimeTree as o, relocateRuntimeLauncher as r, resolveRuntimeFileRelocator as s, prepareRuntimeRelocations as t };
