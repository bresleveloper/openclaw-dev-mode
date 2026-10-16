import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as createConfigIncludeResolutionSession, c as readConfigIncludeFileWithGuards, i as INCLUDE_KEY } from "./includes-BkzfmxST.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { x as resolveIncludeRoots } from "./paths-DGIwWbpu.mjs";
import { n as visitConfigValueTree } from "./value-tree-3oLf9xok.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/includes-scan.ts
function listDirectIncludes(parsed) {
	const out = [];
	visitConfigValueTree(parsed, (value) => {
		const includeVal = isRecord(value) ? value[INCLUDE_KEY] : void 0;
		if (typeof includeVal === "string") out.push(includeVal);
		else if (Array.isArray(includeVal)) {
			for (const item of includeVal) if (typeof item === "string") out.push(item);
		}
		return true;
	});
	return out;
}
/** Collects recursively referenced config include files without requiring a valid full config. */
async function collectIncludePathsRecursive(params) {
	const includedPaths = /* @__PURE__ */ new Set();
	const walkedDepthByBase = /* @__PURE__ */ new Map();
	const allowedRoots = params.allowedRoots ?? resolveIncludeRoots(params.env);
	const resolveInclude = createConfigIncludeResolutionSession(params.configPath, allowedRoots);
	const walk = (basePath, parsed, depth) => {
		if (depth >= 10) return;
		for (const includePath of listDirectIncludes(parsed)) {
			let openedBasePath;
			let nestedInclude;
			const resolver = {
				readFile: (candidate) => fs.readFileSync(candidate, "utf-8"),
				readFileWithGuards: (readParams) => {
					return readConfigIncludeFileWithGuards({
						...readParams,
						onResolvedPath: (resolvedIncludePath) => {
							includedPaths.add(resolvedIncludePath);
							const lexicalBasePath = path.normalize(readParams.resolvedPath);
							const nextDepth = depth + 1;
							const walkedDepth = walkedDepthByBase.get(lexicalBasePath);
							if (walkedDepth !== void 0 && walkedDepth <= nextDepth) return;
							walkedDepthByBase.set(lexicalBasePath, nextDepth);
							openedBasePath = lexicalBasePath;
						}
					});
				},
				parseJson: (raw) => {
					const nestedParsed = parseJsonWithJson5Fallback(raw);
					if (openedBasePath) nestedInclude = {
						basePath: openedBasePath,
						parsed: nestedParsed
					};
					return {};
				}
			};
			try {
				resolveInclude({ [INCLUDE_KEY]: includePath }, basePath, resolver);
			} catch {}
			if (nestedInclude) walk(nestedInclude.basePath, nestedInclude.parsed, depth + 1);
		}
	};
	walk(params.configPath, params.parsed, 0);
	return [...includedPaths];
}
//#endregion
export { collectIncludePathsRecursive as t };
