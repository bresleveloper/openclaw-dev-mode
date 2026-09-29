import { i as isPathStrictlyInside } from "./path-guards-D5kuI0Tv.mjs";
import { i as readMemoryArtifactProvenance } from "./memory-artifact-provenance-p1TjNKv0.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./memory-core-host-runtime-core-C8uEsC2w.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/memory/memory-path-provenance.ts
async function resolveMemoryPathClassification(params) {
	if (params.source !== "memory") return {
		curatedRoot: false,
		originClass: "untrusted"
	};
	let relativePath;
	if (params.readSource !== void 0) {
		const sourcePath = params.readSource.canonicalRelativePath;
		if (!sourcePath || sourcePath === "." || sourcePath === ".." || sourcePath.startsWith("../") || path.posix.isAbsolute(sourcePath) || path.win32.isAbsolute(sourcePath) || sourcePath.includes("\\") || sourcePath.includes("\0") || path.posix.normalize(sourcePath) !== sourcePath) return {
			curatedRoot: false,
			originClass: "untrusted"
		};
		relativePath = sourcePath;
	} else {
		let workspacePath;
		let filePath;
		try {
			[workspacePath, filePath] = await Promise.all([fs.realpath(params.workspaceDir), fs.realpath(params.absolutePath)]);
		} catch {
			return {
				curatedRoot: false,
				originClass: "untrusted"
			};
		}
		if (!isPathStrictlyInside(workspacePath, filePath)) return {
			curatedRoot: false,
			originClass: "untrusted"
		};
		relativePath = path.relative(workspacePath, filePath).replaceAll(path.sep, "/");
	}
	const segments = relativePath.split("/");
	const curatedRoot = segments.length === 1 && (segments[0] === "MEMORY.md" || segments[0] === "memory.md" || segments[0] === "USER.md");
	if (segments.length === 1 && (segments[0] === "DREAMS.md" || segments[0] === "dreams.md") || segments[0] === "memory" && (segments[1] === "dreaming" || segments[1] === ".dreams")) return {
		curatedRoot,
		originClass: "system"
	};
	const isWorkspaceMemory = curatedRoot || /^users\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}\/USER\.md$/.test(relativePath) || segments[0] === "memory" && segments.at(-1)?.endsWith(".md") === true;
	const recorded = isWorkspaceMemory ? await readMemoryArtifactProvenance({
		workspaceDir: params.workspaceDir,
		relativePath
	}) : void 0;
	if (recorded) return {
		curatedRoot,
		originClass: recorded.originClass
	};
	return {
		curatedRoot,
		originClass: isWorkspaceMemory ? "agent" : "untrusted"
	};
}
//#endregion
export { resolveMemoryPathClassification as t };
