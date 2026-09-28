import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { l as pathExists } from "./utils-aKqR_F_U.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/agents/workspace-templates.ts
/**
* Workspace template directory discovery.
* Resolves packaged documentation templates for source and installed runtimes.
*/
const FALLBACK_DOCS_TEMPLATE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/reference/templates");
/** Resolves existing packaged workspace-template directories without retired runtime paths. */
async function resolveWorkspaceTemplateSearchDirs(opts) {
	const moduleUrl = opts?.moduleUrl ?? import.meta.url;
	const argv1 = opts?.argv1 ?? process.argv[1];
	const cwd = opts?.cwd ?? process.cwd();
	const packageRoot = await resolveOpenClawPackageRoot({
		moduleUrl,
		argv1,
		cwd
	});
	const relativeDir = path.join("docs", "reference", "templates");
	const candidates = [
		packageRoot ? path.join(packageRoot, relativeDir) : void 0,
		path.resolve(cwd, relativeDir),
		FALLBACK_DOCS_TEMPLATE_DIR
	];
	const dirs = [];
	for (const candidate of candidates) if (candidate && !dirs.includes(candidate) && await pathExists(candidate)) dirs.push(candidate);
	return dirs;
}
//#endregion
export { resolveWorkspaceTemplateSearchDirs as t };
