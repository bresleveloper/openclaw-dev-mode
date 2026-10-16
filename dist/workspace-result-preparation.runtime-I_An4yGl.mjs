import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { c as serializeWorkerWorkspaceManifest, o as parseWorkerWorkspaceManifest } from "./workspace-manifest-q-txD9ZU.mjs";
import { i as parseChangedWorkspaceResult } from "./workspace-manifest-comparison-BXiy_dh_.mjs";
import { o as requireWorkerResultStorageRef, t as STAGED_RESULT_MESSAGE } from "./workspace-result-inventory-TtCqUwu3.mjs";
import { a as localPath, s as readWorkspaceTreeFile, t as absoluteEntryMatches } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { n as parseGitHubRepositoryPublicationSnapshot, r as readGitHubRepositoryPublicationBlob } from "./github-repository-publication-snapshot-BcNvA0c6.mjs";
import { r as readWorkspaceFileContentsWithLimit } from "./workspace-actual-manifest-D_DK_ZlE.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
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
		yield Buffer.from(`commit ${params.ref}\nmark :${entries.length + 1}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${params.message?.byteLength ?? 0}\n`);
		yield* params.message?.chunks ?? [];
		yield Buffer.from("\ndeleteall\n");
		for (let offset = 0; offset < entries.length; offset += 256) yield Buffer.from(entries.slice(offset, offset + 256).map((entry, index) => {
			return `M ${entry.type === "symlink" ? "120000" : (entry.mode & 73) !== 0 ? "100755" : "100644"} :${offset + index + 1} ${quoteFastImportPath(entry.path)}\n`;
		}).join(""));
		yield Buffer.from(`\nget-mark :${entries.length + 1}\ndone\n`);
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
const bufferView = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
function stagedResultMessage(params) {
	const base = bufferView(params.baseManifestRaw);
	const current = bufferView(params.currentManifestRaw);
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
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function publicationStageSource(params, assertBeforeMutation) {
	const { publication, stagingRoot } = params;
	const metadata = bufferView(publication.metadata);
	const snapshot = parseGitHubRepositoryPublicationSnapshot(metadata.toString("utf8"), publication.publicationDigest);
	if (snapshot.baseCommit !== publication.baseCommit) throw new Error("Repository publication checkpoint base changed");
	const inline = /* @__PURE__ */ new Map([["snapshot.json", metadata], ["binding.json", Buffer.from(JSON.stringify({
		currentManifestRef: publication.currentManifestRef,
		publicationDigest: publication.publicationDigest
	}))]]);
	const file = (pathname, content) => ({
		path: pathname,
		type: "file",
		mode: 420,
		size: content.byteLength,
		sha256: sha256(content)
	});
	const entries = [...inline].map(([pathname, content]) => file(pathname, content));
	const blobs = new Set(snapshot.entries.flatMap((entry) => entry.sha && entry.mode !== "160000" ? [entry.sha] : []));
	let bytes = metadata.byteLength;
	for (const sha of blobs) {
		assertBeforeMutation?.();
		const content = await readGitHubRepositoryPublicationBlob(stagingRoot, sha);
		assertBeforeMutation?.();
		bytes += content.byteLength;
		if (bytes > 805306368) throw new Error("Repository publication checkpoint exceeds its byte budget");
		entries.push(file(`blobs/${sha}`, content));
	}
	const manifestBytes = (files, directories = []) => new TextEncoder().encode(serializeWorkerWorkspaceManifest({
		version: 1,
		baseCommit: null,
		directories,
		entries: files
	}));
	const baseManifestRaw = manifestBytes([]);
	const currentManifestRaw = manifestBytes(entries, ["blobs"]);
	return {
		baseManifestRaw,
		currentManifestRaw,
		baseManifestRef: `sha256:${sha256(baseManifestRaw)}`,
		currentManifestRef: `sha256:${sha256(currentManifestRaw)}`,
		readVerifiedContent: async (entry) => {
			const content = inline.get(entry.path) ?? await readGitHubRepositoryPublicationBlob(stagingRoot, entry.path.slice(6));
			if (entry.type !== "file" || content.byteLength !== entry.size || sha256(content) !== entry.sha256) throw new Error("Repository publication blob changed during preparation");
			return content;
		}
	};
}
async function buildWorkspaceStageInput(params, assertBeforeMutation) {
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	const source = "publication" in params ? await publicationStageSource(params, assertBeforeMutation) : {
		...params,
		readVerifiedContent: async (entry) => await readWorkspaceGitEntry(params.stagingRoot, entry).catch((error) => {
			throw new Error(`Cloud workspace staged payload is invalid: ${entry.path}`, { cause: error });
		})
	};
	const compared = parseChangedWorkspaceResult(parseWorkerWorkspaceManifest(bufferView(source.baseManifestRaw).toString("utf8"), source.baseManifestRef), parseWorkerWorkspaceManifest(bufferView(source.currentManifestRaw).toString("utf8"), source.currentManifestRef));
	await writeWorkspaceGitInput({
		assertBeforeMutation,
		inputPath: params.inputPath,
		ref: stagedResultRef,
		entries: compared.entries,
		message: stagedResultMessage(source),
		readVerifiedContent: source.readVerifiedContent
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
