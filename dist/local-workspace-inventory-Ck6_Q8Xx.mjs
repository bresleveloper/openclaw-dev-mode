import { s as requireGitBuffer } from "./git-CljZIJM8.mjs";
import { g as workspacePathAncestors } from "./workspace-manifest-BR0NHoW3.mjs";
import { r as manifestNodes } from "./workspace-manifest-comparison-BQSX5zpg.mjs";
import { isUtf8 } from "node:buffer";
//#region src/gateway/worker-environments/local-workspace-inventory.ts
function decodeGitPaths(listed) {
	if (!isUtf8(listed)) throw new Error("Local sandbox source paths must be UTF-8; rename the invalid Git path before retrying");
	return listed.toString("utf8").split("\0").filter(Boolean);
}
/** Admit untracked source once, before any guest can change canonical ignore rules. */
async function admitLocalWorkspaceSourcePaths(params) {
	const listed = await requireGitBuffer(params.root, [
		"ls-files",
		"--cached",
		"--others",
		"--exclude-standard",
		"-z"
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent
	});
	params.assertCurrent();
	return JSON.stringify([...new Set(decodeGitPaths(listed))]);
}
/** Ignore changes are source edits, not authority to enroll canonical-only bytes. */
async function selectLocalWorkspaceCanonicalPaths(params) {
	const listed = await requireGitBuffer(params.root, [
		"ls-files",
		"--cached",
		"-z"
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent
	});
	params.assertCurrent();
	const admitted = JSON.parse(params.admittedPaths);
	if (!Array.isArray(admitted) || !admitted.every((entry) => typeof entry === "string")) throw new Error("Invalid local workspace source admission");
	const paths = /* @__PURE__ */ new Set([...admitted, ...decodeGitPaths(listed)]);
	if (params.baseline) for (const entryPath of manifestNodes(params.baseline).keys()) paths.add(entryPath);
	for (const entryPath of paths) for (const parent of workspacePathAncestors(entryPath)) paths.add(parent);
	return paths;
}
//#endregion
export { selectLocalWorkspaceCanonicalPaths as n, admitLocalWorkspaceSourcePaths as t };
