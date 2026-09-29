import { t as resolveMemoryPathClassification } from "./memory-path-provenance-Ctcy4wDX.mjs";
import path from "node:path";
//#region extensions/memory-core/src/workspace-path-classifier.ts
const classifyWorkspaceMemoryPaths = async (params) => await Promise.all(params.relativePaths.map(async (relativePath) => {
	return {
		relativePath,
		originClass: (await resolveMemoryPathClassification({
			absolutePath: path.resolve(params.workspaceDir, relativePath),
			source: "memory",
			workspaceDir: params.workspaceDir,
			...params.readSources !== void 0 ? { readSource: { canonicalRelativePath: params.readSources.find((source) => source.relativePath === relativePath)?.canonicalRelativePath } } : {}
		})).originClass
	};
}));
//#endregion
export { classifyWorkspaceMemoryPaths as t };
