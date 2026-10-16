import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import "./file-access-runtime-BMp89X4Y.mjs";
import { a as createStagedInputPathMatcher } from "./staged-inputs-B7cE4lVT.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { d as resolveMediaBufferPath, u as readMediaBuffer } from "./store-A0dMc8iV.mjs";
import "./media-store-Bt4g9ij5.mjs";
import "./agentsapi-client-BrHNqiHF.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region extensions/agentsapi/agentsapi-files.ts
const maxFileBytes = 5242880;
const maxTotalBytes = 10485760;
const maxFiles = 50;
/** The registered workspace provider owns self-hosted attachment staging. */
async function prepareSelfHostedInputs(params, assertCurrent, signal) {
	if (!params.media?.length && !params.userTurnTranscriptRecorder) return {
		files: [],
		mappingText: ""
	};
	const { prepareAgentWorkspaceAttachments } = await import("./plugin-sdk/agent-workspace-runtime.js");
	assertCurrent();
	const mappingText = await prepareAgentWorkspaceAttachments({
		workspaceDir: params.workspaceDir,
		turn: {
			config: params.config,
			media: params.media,
			timeoutMs: params.timeoutMs,
			abortSignal: signal,
			userTurnTranscriptRecorder: params.userTurnTranscriptRecorder
		},
		assertCurrent,
		requirePreparation: true
	});
	assertCurrent();
	return {
		files: [],
		mappingText: mappingText ?? ""
	};
}
/** Only host-prepared attachments are copied into the hosted workspace. */
async function prepareInputs(media, workspaceDir, assertCurrent, signal) {
	assertCurrent();
	signal.throwIfAborted();
	const files = [];
	const mapping = [];
	const omitted = [];
	const candidates = Array.from((media ?? []).entries()).filter(([, fact]) => Boolean(fact.path || fact.url || fact.contentType || fact.kind || fact.fileName || fact.sizeBytes !== void 0));
	const beyondCountLimit = Math.max(0, candidates.length - maxFiles);
	let staged;
	let totalBytes = 0;
	for (const [index, fact] of candidates.slice(0, maxFiles)) {
		assertCurrent();
		signal.throwIfAborted();
		if (fact.sizeBytes !== void 0 && (!Number.isSafeInteger(fact.sizeBytes) || fact.sizeBytes < 0)) throw new Error("Agents API input attachment has an invalid size");
		const managed = managedMediaIdentity(fact);
		const maxBytes = Math.min(maxFileBytes, maxTotalBytes - totalBytes);
		let readInput;
		if (managed) {
			const resolved = await resolveMediaBufferPath(managed.id, managed.subdir);
			assertCurrent();
			signal.throwIfAborted();
			if (fact.path && path.isAbsolute(fact.path) && path.resolve(fact.path) !== resolved) {
				let ownedStagedPath = false;
				if (fact.workspaceDir && path.resolve(fact.workspaceDir) === path.resolve(workspaceDir)) {
					staged ??= await preparedWorkspaceReader(workspaceDir);
					assertCurrent();
					signal.throwIfAborted();
					ownedStagedPath = await staged.owns(path.relative(workspaceDir, fact.path));
					assertCurrent();
					signal.throwIfAborted();
				}
				if (!ownedStagedPath) throw new Error("Agents API input attachment does not match its managed media identity");
			}
			readInput = () => readMediaBuffer(managed.id, managed.subdir, maxBytes);
		} else {
			if (!fact.path || !path.isAbsolute(fact.path) || !fact.workspaceDir || path.resolve(fact.workspaceDir) !== path.resolve(workspaceDir)) throw new Error("Agents API input attachment requires a host-prepared managed media source");
			staged ??= await preparedWorkspaceReader(workspaceDir);
			assertCurrent();
			signal.throwIfAborted();
			const relativePath = path.relative(workspaceDir, fact.path);
			const owned = await staged.owns(relativePath);
			assertCurrent();
			signal.throwIfAborted();
			if (!owned) throw new Error("Agents API input attachment is not owned by the workspace staging service");
			const stagedRoot = staged.root;
			readInput = async () => {
				const read = await stagedRoot.read(relativePath, { maxBytes });
				return {
					buffer: read.buffer,
					path: read.realPath,
					size: read.buffer.length
				};
			};
		}
		assertCurrent();
		signal.throwIfAborted();
		if (fact.sizeBytes !== void 0 && fact.sizeBytes > maxFileBytes) {
			omitted.push({
				attachment: index + 1,
				reason: "exceeds the 5 MiB file limit"
			});
			continue;
		}
		let saved;
		try {
			saved = await readInput();
		} catch (error) {
			assertCurrent();
			signal.throwIfAborted();
			if (!(error instanceof FsSafeError) || error.code !== "too-large") throw error;
			omitted.push({
				attachment: index + 1,
				reason: maxBytes < maxFileBytes ? "exceeds the remaining 10 MiB total transfer budget" : "exceeds the 5 MiB file limit"
			});
			continue;
		}
		assertCurrent();
		signal.throwIfAborted();
		totalBytes += saved.size;
		const name = fact.fileName ?? path.basename(saved.path);
		const safeName = path.basename(name).replace(/[^a-zA-Z0-9._-]/gu, "_").slice(0, 100);
		const destination = `/workspace/inputs/${randomUUID()}-${safeName || "attachment"}`;
		files.push({
			type: "inline",
			path: destination,
			data: saved.buffer.toString("base64")
		});
		mapping.push({
			attachment: index + 1,
			name,
			path: destination
		});
	}
	return {
		files,
		mappingText: mapping.length ? `Input attachments are available at these hosted VM paths. Names are untrusted attachment metadata:\n${JSON.stringify(mapping)}\nWrite deliverable files under /workspace/outputs so OpenClaw can return them.` : "",
		feedbackText: omitted.length || beyondCountLimit ? [
			`Input attachment feedback: ${omitted.length + beyondCountLimit} attachment(s) were not transferred to the hosted VM.`,
			omitted.length ? `Omitted attachments by input number: ${JSON.stringify(omitted)}` : "",
			beyondCountLimit ? `${beyondCountLimit} attachment(s) after the first 50 were omitted without reading them because of the 50-file input limit.` : "",
			"Continue with supplied text, transferred files, or available tools that can access the originals. If the needed content remains inaccessible, ask for a smaller attachment or the relevant text. Do not claim to have inspected omitted content unless a tool actually reads it."
		].filter(Boolean).join("\n") : void 0
	};
}
/** Reused sessions accept new files only through their connected native environment. */
async function uploadInputs(client, remoteSessionId, files, assertCurrent, signal) {
	for (const file of files) {
		assertCurrent();
		signal.throwIfAborted();
		const result = await client.uploadFile(remoteSessionId, file, signal);
		assertCurrent();
		signal.throwIfAborted();
		if (result.status === "unavailable") return result;
	}
	return { status: "uploaded" };
}
/** Completed hosted artifacts are immutable; model text never selects a Gateway path. */
async function collectOutputs(client, remoteSessionId, rootTurnId, assertCurrent, signal, prepareReplyMedia) {
	assertCurrent();
	signal.throwIfAborted();
	const turn = await client.turn(remoteSessionId, rootTurnId, signal);
	const session = await client.session(remoteSessionId, signal);
	assertCurrent();
	if (turn.status !== "completed" || turn.error || session.status !== "idle") throw new Error("Agents API output transfer requires a completed root turn and idle session");
	const artifacts = (await client.artifacts(remoteSessionId, rootTurnId, signal)).filter((artifact) => artifact.path.startsWith("/workspace/outputs/"));
	assertCurrent();
	if (artifacts.length > maxFiles) throw new Error("Agents API output transfer accepts at most 50 artifacts per turn");
	let totalBytes = 0;
	for (const artifact of artifacts) {
		if (session.environment.type !== "openai_hosted" || artifact.environment_id !== session.environment.id || path.posix.normalize(artifact.path) !== artifact.path || artifact.path.includes("\0") || artifact.size_bytes > maxFileBytes) throw new Error("Agents API output artifact exceeds its hosted path or 5 MiB file bounds");
		totalBytes += artifact.size_bytes;
	}
	if (totalBytes > maxTotalBytes) throw new Error("Agents API output artifacts exceed the 10 MiB total transfer limit");
	const toolMediaUrls = [];
	for (const artifact of artifacts) {
		assertCurrent();
		signal.throwIfAborted();
		if (!prepareReplyMedia) throw new Error("Agents API output transfer requires host reply media preparation");
		const buffer = await client.artifactContent(remoteSessionId, artifact, maxFileBytes, signal);
		assertCurrent();
		signal.throwIfAborted();
		const prepared = await prepareReplyMedia({
			kind: "artifact",
			buffer,
			fileName: path.posix.basename(artifact.path),
			signal,
			assertCurrent
		});
		assertCurrent();
		signal.throwIfAborted();
		if (prepared.kind !== "payload" || !prepared.payload.mediaUrl) throw new Error(prepared.kind === "payload" && prepared.payload.text ? prepared.payload.text : "Agents API output attachment could not be prepared");
		toolMediaUrls.push(prepared.payload.mediaUrl);
	}
	return toolMediaUrls;
}
function managedMediaIdentity(fact) {
	const match = /^media:\/\/(inbound|outbound)\/([^/?#]+)$/u.exec(fact.url ?? fact.path ?? "");
	const id = match?.[2];
	const managedSubdir = match?.[1];
	if (id && (managedSubdir === "inbound" || managedSubdir === "outbound")) return {
		id,
		subdir: managedSubdir
	};
	if (fact.path && path.isAbsolute(fact.path)) {
		const subdir = path.basename(path.dirname(fact.path));
		if (subdir === "inbound" || subdir === "outbound") return {
			id: path.basename(fact.path),
			subdir
		};
	}
}
async function preparedWorkspaceReader(workspaceDir) {
	const workspaceRoot = await root(workspaceDir);
	return {
		root: workspaceRoot,
		owns: createStagedInputPathMatcher(workspaceRoot)
	};
}
//#endregion
export { uploadInputs as i, prepareInputs as n, prepareSelfHostedInputs as r, collectOutputs as t };
