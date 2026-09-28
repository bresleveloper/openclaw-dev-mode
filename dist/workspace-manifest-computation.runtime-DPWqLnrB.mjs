import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { c as serializeWorkerWorkspaceManifest, o as parseWorkerWorkspaceManifest } from "./workspace-manifest-453LPGpv.mjs";
import { g as withoutWorkspaceHashContext, h as withWorkspaceHashMemo, p as withWorkerWorkspaceHashMemo, s as pruneWorkspaceHashMemo } from "./workspace-hash-memo-R41irJvf.mjs";
import { i as parseChangedWorkspaceResult, r as manifestNodes, t as changedPaths } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-manifest-overlay.ts
function applyWorkspaceSourceOverlay(source, prepared, incoming) {
	const sourceNodes = manifestNodes(source);
	const incomingNodes = manifestNodes(incoming);
	const nodes = manifestNodes(prepared);
	const changed = changedPaths(source, incoming);
	const replaced = new Set([...changed].filter((entryPath) => incomingNodes.get(entryPath)?.type !== "directory" && (incomingNodes.has(entryPath) || sourceNodes.get(entryPath)?.type !== "directory")));
	for (const entryPath of nodes.keys()) {
		let remove = changed.has(entryPath);
		for (let parent = path.posix.dirname(entryPath); !remove && parent !== "."; parent = path.posix.dirname(parent)) remove = replaced.has(parent);
		if (remove) nodes.delete(entryPath);
	}
	for (const entryPath of changed) {
		const entry = incomingNodes.get(entryPath);
		if (!entry) continue;
		nodes.set(entryPath, entry);
		for (let parent = path.posix.dirname(entryPath); parent !== "."; parent = path.posix.dirname(parent)) nodes.set(parent, {
			path: parent,
			type: "directory"
		});
	}
	for (const entryPath of nodes.keys()) for (let parent = path.posix.dirname(entryPath); parent !== "."; parent = path.posix.dirname(parent)) if (!nodes.has(parent)) nodes.set(parent, {
		path: parent,
		type: "directory"
	});
	return {
		version: 1,
		baseCommit: incoming.baseCommit,
		entries: [...nodes.values()].filter((entry) => entry?.type === "file" || entry?.type === "symlink"),
		directories: [...nodes.values()].flatMap((entry) => entry?.type === "directory" ? [entry.path] : [])
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-manifest-computation.runtime.ts
function decodeManifestValue(command) {
	const payload = command.input.payload;
	return JSON.parse(Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength).toString("utf8"));
}
function captureArguments(input) {
	return {
		root: input.root,
		baseCommit: input.baseCommit,
		includePaths: input.includePaths === void 0 ? void 0 : new Set(input.includePaths),
		preserveDirectories: input.preserveDirectories === void 0 ? void 0 : new Set(input.preserveDirectories)
	};
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
		case "workspace.manifest.nodes": {
			const { localWorkspaceNode } = await import("./workspace-reconcile-fs-BL4dyQ4T.mjs");
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
		case "workspace.manifest.capture": {
			const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, async () => {
				const { manifest, manifestRef } = await readActualWorkspaceManifestImpl(captureArguments(input));
				return {
					manifest,
					manifestRef
				};
			});
		}
		case "workspace.manifest.snapshot": {
			const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, () => readActualWorkspaceManifestImpl(captureArguments(input)));
		}
		case "workspace.manifest.file": {
			const { readWorkspaceFileSnapshotWithLimit } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, () => readWorkspaceFileSnapshotWithLimit(input.path, input.maxBytes, input.root));
		}
		case "workspace.reconcile.preflight": {
			const { preflightWorkspaceApplyImpl } = await import("./workspace-reconcile-preflight-BgSqA-5r.mjs");
			const input = decodeManifestValue(command);
			return await withHashes(input.hashes, () => preflightWorkspaceApplyImpl(input));
		}
		case "workspace.manifest.parse": {
			const raw = Buffer.from(command.input.raw.buffer, command.input.raw.byteOffset, command.input.raw.byteLength).toString("utf8");
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
			const baseRaw = Buffer.from(command.input.baseRaw.buffer, command.input.baseRaw.byteOffset, command.input.baseRaw.byteLength).toString("utf8");
			const currentRaw = Buffer.from(command.input.currentRaw.buffer, command.input.currentRaw.byteOffset, command.input.currentRaw.byteLength).toString("utf8");
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
