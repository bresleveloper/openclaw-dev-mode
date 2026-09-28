import { w as root } from "./fs-safe-BAPek8At.mjs";
import { i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { o as parseWorkerWorkspaceManifest } from "./workspace-manifest-453LPGpv.mjs";
import { i as parseChangedWorkspaceResult } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { o as requireWorkerResultStorageRef, t as STAGED_RESULT_MESSAGE } from "./workspace-result-inventory-TtCqUwu3.mjs";
import { a as localPath, s as readWorkspaceTreeFile, t as absoluteEntryMatches } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { r as readWorkspaceFileContentsWithLimit } from "./workspace-actual-manifest-B9Vi3bLN.mjs";
import path from "node:path";
//#region src/gateway/worker-environments/workspace-git-input.ts
async function readWorkspaceGitEntry(root, entry) {
	const source = localPath(root, entry.path);
	if (entry.type === "symlink") {
		if (await absoluteEntryMatches(source, entry)) return Buffer.from(entry.target);
	} else {
		const snapshot = await readWorkspaceFileContentsWithLimit(source, entry.size);
		if (snapshot.type === "file" && snapshot.size === entry.size && snapshot.mode === entry.mode && snapshot.sha256 === entry.sha256) return snapshot.content;
	}
	throw new Error(`Cloud workspace snapshot is invalid: ${entry.path}`);
}
function quoteFastImportPath(entryPath) {
	const bytes = Buffer.from(entryPath);
	let quoted = "\"";
	for (const byte of bytes) {
		if (byte === 0) throw new Error("Cloud workspace staged result path contains a null byte");
		if (byte === 34 || byte === 92) quoted += `\\${String.fromCharCode(byte)}`;
		else if (byte >= 32 && byte < 127) quoted += String.fromCharCode(byte);
		else quoted += `\\${byte.toString(8).padStart(3, "0")}`;
	}
	return `${quoted}"`;
}
/** Both durable results and rollback trees import the exact authenticated bytes. */
async function writeWorkspaceGitInput(params) {
	const entries = params.entries.toSorted((left, right) => left.path.localeCompare(right.path));
	async function* chunks() {
		for (const [index, entry] of entries.entries()) {
			const content = await params.readVerifiedContent(entry);
			yield Buffer.from(`blob\nmark :${index + 1}\ndata ${content.byteLength}\n`);
			yield content;
			yield Buffer.from("\n");
		}
		yield Buffer.from(`commit ${params.ref}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${params.message?.byteLength ?? 0}\n`);
		yield* params.message?.chunks ?? [];
		yield Buffer.from("\ndeleteall\n");
		for (let offset = 0; offset < entries.length; offset += 256) yield Buffer.from(entries.slice(offset, offset + 256).map((entry, index) => {
			return `M ${entry.type === "symlink" ? "120000" : (entry.mode & 73) !== 0 ? "100755" : "100644"} :${offset + index + 1} ${quoteFastImportPath(entry.path)}\n`;
		}).join(""));
		yield Buffer.from("done\n");
	}
	await (await root(path.dirname(params.inputPath))).create(path.basename(params.inputPath), chunks(), {
		assertBeforeMutation: params.assertBeforeMutation,
		mode: 384,
		mkdir: false,
		durable: false,
		maxBytes: MAX_WORKSPACE_INVENTORY_TOTAL_BYTES * 2
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-preparation.runtime.ts
function stagedResultMessage(params) {
	const base = Buffer.from(params.baseManifestRaw.buffer, params.baseManifestRaw.byteOffset, params.baseManifestRaw.byteLength);
	const current = Buffer.from(params.currentManifestRaw.buffer, params.currentManifestRaw.byteOffset, params.currentManifestRaw.byteLength);
	const header = Buffer.from(`${STAGED_RESULT_MESSAGE}\nversion 2\nbase-ref ${params.baseManifestRef}\ncurrent-ref ${params.currentManifestRef}\nbase-bytes ${base.byteLength}\ncurrent-bytes ${current.byteLength}\n\n`);
	return {
		chunks: [
			header,
			base,
			current
		],
		byteLength: header.byteLength + base.byteLength + current.byteLength
	};
}
async function buildWorkspaceStageInput(params, assertBeforeMutation) {
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	const compared = parseChangedWorkspaceResult(parseWorkerWorkspaceManifest(Buffer.from(params.baseManifestRaw.buffer, params.baseManifestRaw.byteOffset, params.baseManifestRaw.byteLength).toString("utf8"), params.baseManifestRef), parseWorkerWorkspaceManifest(Buffer.from(params.currentManifestRaw.buffer, params.currentManifestRaw.byteOffset, params.currentManifestRaw.byteLength).toString("utf8"), params.currentManifestRef));
	await writeWorkspaceGitInput({
		assertBeforeMutation,
		inputPath: params.inputPath,
		ref: stagedResultRef,
		entries: compared.entries,
		message: stagedResultMessage(params),
		readVerifiedContent: async (entry) => await readWorkspaceGitEntry(params.stagingRoot, entry).catch((error) => {
			throw new Error(`Cloud workspace staged payload is invalid: ${entry.path}`, { cause: error });
		})
	});
	return null;
}
async function buildWorkspaceTreeInput(params, assertBeforeMutation) {
	const source = params.source;
	await writeWorkspaceGitInput({
		...params,
		assertBeforeMutation,
		readVerifiedContent: async (entry) => source.tree === void 0 ? await readWorkspaceGitEntry(source.root, entry) : entry.type === "file" ? await readWorkspaceTreeFile({
			repositoryRoot: source.root,
			tree: source.tree,
			entry
		}) : Buffer.from(entry.target)
	});
	return null;
}
//#endregion
export { buildWorkspaceStageInput, buildWorkspaceTreeInput };
