import { s as getMediaDir } from "./store-BrX2xbJz.mjs";
import { s as resolveMediaReferenceLocalPath } from "./media-reference-C0dWWfb0.mjs";
import { a as readLocalMediaFile } from "./local-media-access-D2_poXF0.mjs";
import { a as ensureStagedInputDirectory, l as stagedInputDirectory, n as STAGED_INPUT_MAX_BYTES, u as stagedInputFileName } from "./staged-inputs-De-HBXyz.mjs";
import { i as resolveMediaFactLocalRef } from "./images.media-refs-B62GCpdx.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-3-T7Wh4j.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/workspace-attachments.ts
/** Prepare only admitted input files; canonical references remain on Gateway. */
async function prepareWorkspaceAttachments(params) {
	const { turn } = params;
	const signal = AbortSignal.any([AbortSignal.timeout(turn.timeoutMs), ...turn.abortSignal ? [turn.abortSignal] : []]);
	const assertCurrent = () => {
		signal.throwIfAborted();
		params.assertCurrent();
	};
	const bridge = params.createBridge(assertCurrent, signal);
	const root = {
		async exists(filePath) {
			assertCurrent();
			const stat = await bridge.stat({
				filePath,
				signal
			});
			assertCurrent();
			return stat !== null;
		},
		async readText(filePath, { maxBytes }) {
			assertCurrent();
			const data = await bridge.readFile({
				filePath,
				maxBytes,
				signal
			});
			assertCurrent();
			return data.toString("utf8");
		},
		async create(filePath, data) {
			assertCurrent();
			const result = await bridge.createFileExclusive({
				filePath,
				data,
				mkdir: true,
				signal
			});
			assertCurrent();
			if (result === "exists" && await root.readText(filePath, { maxBytes: 1024 }) !== data) throw new Error("Input staging directory is not owned by OpenClaw");
		}
	};
	const paths = /* @__PURE__ */ new Map();
	for (const fact of turn.media ?? []) {
		assertCurrent();
		const ref = resolveMediaFactLocalRef(fact);
		if (!ref) continue;
		const source = await resolveMediaReferenceLocalPath(ref.resolved);
		assertCurrent();
		if (!path.isAbsolute(source)) throw new Error("Attachment source must be a managed reference or an absolute media path");
		if (paths.has(source)) continue;
		const data = await readLocalMediaFile(source, [getMediaDir()], { maxBytes: Math.max(STAGED_INPUT_MAX_BYTES, resolveChatAttachmentMaxBytes(turn.config ?? {})) });
		assertCurrent();
		const directory = stagedInputDirectory(createHash("sha256").update(source).digest("hex"));
		await ensureStagedInputDirectory(root, directory, signal);
		assertCurrent();
		const filePath = path.posix.join(directory, stagedInputFileName(path.basename(source)));
		await bridge.createFileExclusive({
			filePath,
			data,
			mkdir: false,
			signal
		});
		assertCurrent();
		const stat = await bridge.stat({
			filePath,
			signal
		});
		assertCurrent();
		if (stat?.type !== "file") throw new Error("Prepared attachment is not a regular file");
		const remotePath = path.posix.isAbsolute(params.remoteRoot) ? path.posix.join(params.remoteRoot, filePath) : path.win32.join(params.remoteRoot, ...filePath.split("/"));
		paths.set(source, remotePath);
	}
	assertCurrent();
	return paths.size ? [...paths.values()].map((file) => `[media attached: ${file}]`).join("\n") : void 0;
}
//#endregion
export { prepareWorkspaceAttachments };
