import "./fs-safe-defaults-D3xd3zKO.mjs";
import fs from "node:fs";
import path from "node:path";
import { tryReadJsonSync, writeJsonSync } from "@openclaw/fs-safe/json";
//#region src/infra/json-file.ts
function resolveJsonSymlinkTarget(pathname) {
	let stat;
	try {
		stat = fs.lstatSync(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (!stat.isSymbolicLink()) return;
	return path.resolve(path.dirname(pathname), fs.readlinkSync(pathname));
}
function resolveJsonSaveTarget(pathname) {
	let currentPath = pathname;
	const visited = /* @__PURE__ */ new Set();
	while (fs.lstatSync(currentPath, { throwIfNoEntry: false })?.isSymbolicLink()) {
		const normalizedPath = path.resolve(currentPath);
		if (visited.has(normalizedPath)) throw Object.assign(/* @__PURE__ */ new Error(`Too many symlink levels while resolving ${pathname}`), { code: "ELOOP" });
		visited.add(normalizedPath);
		currentPath = path.resolve(path.dirname(currentPath), fs.readlinkSync(currentPath));
	}
	if (visited.size > 0) fs.statSync(path.dirname(currentPath));
	return currentPath;
}
function writeJsonTarget(pathname, data) {
	writeJsonSync(resolveJsonSaveTarget(pathname), data);
}
function loadJsonFileThroughSymlink(pathname) {
	const direct = tryReadJsonSync(pathname);
	if (direct !== null) return direct;
	const target = resolveJsonSymlinkTarget(pathname);
	return target ? tryReadJsonSync(target) ?? void 0 : void 0;
}
//#endregion
export { resolveJsonSaveTarget as n, writeJsonTarget as r, loadJsonFileThroughSymlink as t };
