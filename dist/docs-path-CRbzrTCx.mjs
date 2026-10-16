import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/docs-path.ts
/**
* Locates local OpenClaw docs/source roots for references shown to agents.
*/
const OPENCLAW_DOCS_URL = "https://docs.openclaw.ai";
const OPENCLAW_SOURCE_URL = "https://github.com/openclaw/openclaw";
function isUsableDocsDir(docsDir) {
	return fs.existsSync(path.join(docsDir, "docs.json"));
}
/** Resolve docs and source from one package root, preferring workspace docs. */
async function resolveOpenClawReferencePaths(params) {
	let docsPath = null;
	const workspaceDir = params.workspaceDir?.trim();
	if (workspaceDir) {
		const workspaceDocs = path.join(workspaceDir, "docs");
		if (isUsableDocsDir(workspaceDocs)) docsPath = workspaceDocs;
	}
	const packageRoot = await resolveOpenClawPackageRoot({
		cwd: params.cwd,
		argv1: params.argv1,
		moduleUrl: params.moduleUrl
	});
	if (!docsPath && packageRoot) {
		const packageDocs = path.join(packageRoot, "docs");
		docsPath = isUsableDocsDir(packageDocs) ? packageDocs : null;
	}
	return {
		docsPath,
		sourcePath: packageRoot && fs.existsSync(path.join(packageRoot, ".git")) ? packageRoot : null
	};
}
//#endregion
export { OPENCLAW_SOURCE_URL as n, resolveOpenClawReferencePaths as r, OPENCLAW_DOCS_URL as t };
