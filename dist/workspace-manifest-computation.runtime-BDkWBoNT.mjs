import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { c as serializeWorkerWorkspaceManifest, g as workspacePathAncestors, o as parseWorkerWorkspaceManifest } from "./workspace-manifest-q-txD9ZU.mjs";
import { c as pruneWorkspaceHashMemo, g as withoutWorkspaceHashContext, h as withWorkspaceHashMemo, p as withWorkerWorkspaceHashMemo } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { i as parseChangedWorkspaceResult, n as hasPathAncestor, r as manifestNodes, t as changedPaths } from "./workspace-manifest-comparison-BXiy_dh_.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-manifest-overlay.ts
function applyWorkspaceSourceOverlay(source, prepared, incoming) {
	const sourceNodes = manifestNodes(source);
	const incomingNodes = manifestNodes(incoming);
	const nodes = manifestNodes(prepared);
	const changed = changedPaths(source, incoming);
	const replaced = new Set([...changed].filter((entryPath) => incomingNodes.get(entryPath)?.type !== "directory" && (incomingNodes.has(entryPath) || sourceNodes.get(entryPath)?.type !== "directory")));
	for (const entryPath of nodes.keys()) if (changed.has(entryPath) || hasPathAncestor(replaced, entryPath)) nodes.delete(entryPath);
	for (const entryPath of changed) {
		const entry = incomingNodes.get(entryPath);
		if (!entry) continue;
		nodes.set(entryPath, entry);
	}
	for (const entryPath of nodes.keys()) for (const parent of [...workspacePathAncestors(entryPath)].toReversed()) nodes.set(parent, {
		path: parent,
		type: "directory"
	});
	return {
		version: 1,
		baseCommit: incoming.baseCommit,
		entries: [...nodes.values()].filter((entry) => entry.type === "file" || entry.type === "symlink"),
		directories: [...nodes.values()].flatMap((entry) => entry.type === "directory" ? [entry.path] : [])
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-manifest-computation.runtime.ts
function decodeUtf8(bytes) {
	return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("utf8");
}
function decodeManifestValue(command) {
	return JSON.parse(decodeUtf8(command.input.payload));
}
async function withHashes(input, run) {
	const metrics = {
		contentHashCount: 0,
		contentHashDurationMs: 0,
		memoHitCount: 0
	};
	if (!input) return {
		value: await withoutWorkspaceHashContext(run),
		hashes: [],
		metrics
	};
	const initial = new Map(input.entries);
	const hashes = new Map(initial);
	const value = await (input.owner === "worker" ? withWorkerWorkspaceHashMemo(hashes, run, metrics) : withWorkspaceHashMemo(hashes, run, metrics));
	pruneWorkspaceHashMemo(hashes);
	return {
		value,
		hashes: [...hashes].filter(([identity, digest]) => initial.get(identity) !== digest),
		metrics
	};
}
async function executeWorkspaceManifestComputation(command, assertBeforeMutation) {
	switch (command.type) {
		case "workspace.manifest.remote-capture": {
			const { captureNodeWorkspaceManifestImpl } = await import("./workspace-manifest-script.runtime.js");
			return await captureNodeWorkspaceManifestImpl(command.input, assertBeforeMutation);
		}
		case "workspace.manifest.nodes": {
			const { localWorkspaceNode } = await import("./workspace-reconcile-fs-JVBs7JgY.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, async () => {
				const result = await runTasksWithConcurrency({
					tasks: input.paths.map((entryPath) => async () => [entryPath, await localWorkspaceNode(input.root, entryPath)]),
					limit: 4,
					errorMode: "stop"
				});
				if (result.hasError) throw result.firstError;
				return result.results;
			});
		}
		case "workspace.manifest.staged": {
			const { loadStagedWorkerWorkspace } = await import("./workspace-result-inventory.runtime.js");
			return await loadStagedWorkerWorkspace(command.input.root, command.input.ref);
		}
		case "workspace.manifest.stage-input": {
			const { buildWorkspaceStageInput } = await import("./workspace-result-preparation.runtime.js");
			return await buildWorkspaceStageInput(command.input, assertBeforeMutation);
		}
		case "workspace.manifest.tree-input": {
			const { buildWorkspaceTreeInput } = await import("./workspace-result-preparation.runtime.js");
			return await buildWorkspaceTreeInput(decodeManifestValue(command), assertBeforeMutation);
		}
		case "workspace.manifest.entries": {
			const { readStagedWorkerWorkspaceEntries } = await import("./workspace-result-inventory.runtime.js");
			return ownedWorkerBytes(await readStagedWorkerWorkspaceEntries(command.input));
		}
		case "workspace.manifest.capture":
		case "workspace.manifest.snapshot": {
			const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-BxuyQXob.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, async () => {
				const snapshot = await readActualWorkspaceManifestImpl({
					...input,
					includePaths: input.includePaths && new Set(input.includePaths),
					preserveDirectories: input.preserveDirectories && new Set(input.preserveDirectories)
				});
				return command.type === "workspace.manifest.snapshot" ? snapshot : {
					manifest: snapshot.manifest,
					manifestRef: snapshot.manifestRef
				};
			});
		}
		case "workspace.manifest.file": {
			const { readWorkspaceFileSnapshotWithLimit } = await import("./workspace-actual-manifest-BxuyQXob.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, () => readWorkspaceFileSnapshotWithLimit(input.path, input.maxBytes, input.root));
		}
		case "workspace.reconcile.preflight": {
			const { preflightWorkspaceApplyImpl } = await import("./workspace-reconcile-preflight-BpiVvsdn.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, () => preflightWorkspaceApplyImpl(input));
		}
		case "workspace.manifest.parse": {
			const raw = decodeUtf8(command.input.raw);
			const manifestRef = command.input.expectedRef ?? `sha256:${createHash("sha256").update(raw).digest("hex")}`;
			return {
				manifest: parseWorkerWorkspaceManifest(raw, manifestRef),
				manifestRef
			};
		}
		case "workspace.manifest.overlay": {
			const input = decodeManifestValue(command);
			const raw = serializeWorkerWorkspaceManifest(applyWorkspaceSourceOverlay(input.source, input.prepared, input.incoming));
			const manifestRef = `sha256:${createHash("sha256").update(raw).digest("hex")}`;
			return {
				manifest: parseWorkerWorkspaceManifest(raw, manifestRef),
				manifestRef
			};
		}
		case "workspace.manifest.serialize": {
			const input = decodeManifestValue(command);
			const raw = serializeWorkerWorkspaceManifest(input.manifest);
			return {
				raw,
				manifestRef: `sha256:${createHash("sha256").update(raw).digest("hex")}`
			};
		}
		case "workspace.manifest.pair": {
			const baseRaw = decodeUtf8(command.input.baseRaw);
			const currentRaw = decodeUtf8(command.input.currentRaw);
			const base = parseWorkerWorkspaceManifest(baseRaw, command.input.baseRef);
			const current = parseWorkerWorkspaceManifest(currentRaw, command.input.currentRef);
			const compared = parseChangedWorkspaceResult(base, current);
			return {
				base,
				current,
				...compared,
				paths: compared.entries.map((entry) => entry.path)
			};
		}
	}
	throw new Error("Unsupported workspace computation");
}
//#endregion
export { executeWorkspaceManifestComputation };
