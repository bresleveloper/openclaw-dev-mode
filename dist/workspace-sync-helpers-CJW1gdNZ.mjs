import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { a as WORKER_BUNDLE_RSYNC_RECEIVER_PATH } from "./worker-bundle-hash-drgRPFuP.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { d as serializeRemoteWorkspaceHashMemo, l as recordRemoteWorkspaceHashMetrics, s as parseRemoteWorkspaceManifestEnvelope, u as replaceWorkerWorkspaceHashMemoEntries } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { a as workerSshOptions, i as workerSshCommandOptions, o as workerSshRemoteCommand } from "./ssh-C8PSYwfX.mjs";
import { i as createRemoteWorkspaceManifestScript, n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-UY5ll8uc.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { root } from "@openclaw/fs-safe/root";
import { setTimeout } from "node:timers/promises";
//#region src/gateway/worker-environments/workspace-sync-helpers.ts
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const INBOUND_QUOTA_INITIAL_POLL_MS = 25;
const INBOUND_QUOTA_MAX_POLL_MS = 250;
const WORKER_WORKSPACE_RSYNC_DESTINATION = "openclaw-rsync-destination";
function waitForQuiescenceRenewal(signal, intervalMs) {
	if (signal.aborted) return Promise.resolve(false);
	return sleep(intervalMs, signal).then(() => true, (error) => {
		if (signal.aborted) return false;
		throw error;
	});
}
function workerWorkspaceCommandSucceeded(result) {
	return result.termination === "exit" && result.code === 0;
}
function workspaceSyncError(result) {
	const detail = redactSensitiveText(result.stderr || result.stdout, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return /* @__PURE__ */ new Error(detail ? `Worker workspace sync failed: ${detail}` : "Worker workspace sync failed");
}
function workerWorkspaceRsyncRemoteCommand(prepared, port = prepared.port) {
	return workerSshRemoteCommand([
		"ssh",
		...workerSshOptions(prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(port)
	]);
}
function workerWorkspaceRsyncReceiverPath(params) {
	const context = Buffer.from(JSON.stringify([
		params.remoteWorkspaceDir,
		params.canonicalHome,
		params.remoteRelative
	])).toString("base64url");
	const command = [
		"node",
		params.receiverEntryPath,
		params.mode,
		context,
		params.nonce
	];
	if (command.some((word) => !/^[A-Za-z0-9_./-]+$/u.test(word))) throw new Error("Worker workspace rsync receiver command is not shell-safe");
	return command.join(" ");
}
function createWorkerWorkspaceRsyncReceiverPathFactory(params) {
	return (mode) => workerWorkspaceRsyncReceiverPath({
		...params,
		mode,
		nonce: randomBytes(16).toString("hex")
	});
}
function workerAcceptedWorkspaceRsyncReceiverPath(params) {
	const markerIndex = params.remoteWorkspaceDir.lastIndexOf("/.openclaw-worker/workspaces/");
	if (markerIndex < 1) throw new Error("Accepted workspace path is outside the managed workspace root");
	const canonicalHome = params.remoteWorkspaceDir.slice(0, markerIndex);
	const remoteRelative = params.remoteWorkspaceDir.slice(markerIndex + 1);
	return workerWorkspaceRsyncReceiverPath({
		receiverEntryPath: params.receiverEntryPath,
		remoteWorkspaceDir: params.remoteWorkspaceDir,
		canonicalHome,
		remoteRelative,
		mode: "accepted-next",
		nonce: params.nonce
	});
}
function workerWorkspaceRsyncReceiverEntryPath(bundleHash) {
	if (!/^[a-f0-9]{64}$/u.test(bundleHash)) throw new Error("Worker workspace rsync receiver bundle hash is invalid");
	return `.openclaw-worker/${bundleHash}/${WORKER_BUNDLE_RSYNC_RECEIVER_PATH}`;
}
function workerWorkspaceSshArgv(prepared, remoteArgv, port = prepared.port) {
	return [
		"ssh",
		...workerSshOptions(prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(port),
		"--",
		prepared.sshTarget,
		workerSshRemoteCommand(remoteArgv)
	];
}
async function resolveRemoteWorkspaceManifest(runWorkspaceCommand, remoteWorkspaceDir, expectedRef) {
	const baseDigest = MANIFEST_REF_PATTERN.test(expectedRef) ? expectedRef.slice(7) : "";
	if (!baseDigest) throw new Error("Worker workspace base manifest reference is invalid");
	const resolved = await runWorkspaceCommand({
		transportRetry: "idempotent",
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			remoteWorkspaceDir,
			"",
			"resolve",
			baseDigest
		]
	});
	if (!workerWorkspaceCommandSucceeded(resolved)) throw workspaceSyncError(resolved);
	if (parseManifestRef(resolved.stdout.trim()) !== expectedRef) throw new Error("Worker workspace base manifest resolution returned the wrong reference");
	return baseDigest;
}
async function captureRemoteWorkspaceManifest(params) {
	params.metrics.remoteManifestCalls += 1;
	const startedAt = performance.now();
	const captured = await params.runWorkspaceCommand({
		transportRetry: "idempotent",
		argv: [
			"node",
			"-e",
			params.maxHashMemoBytes === void 0 ? REMOTE_WORKSPACE_MANIFEST_JS : createRemoteWorkspaceManifestScript(params.maxHashMemoBytes),
			params.remoteWorkspaceDir,
			params.baseCommit ?? "",
			params.baseCommit ? "eligible" : "all",
			...params.priorManifestDigests,
			"memo-v1"
		],
		input: serializeRemoteWorkspaceHashMemo(params.hashMemo, params.maxHashMemoBytes)
	}).finally(() => {
		params.metrics.remoteManifestWallDurationMs += performance.now() - startedAt;
	});
	if (!workerWorkspaceCommandSucceeded(captured)) throw new Error(`Worker workspace manifest capture failed: ${boundedWorkerError(captured.stderr.trim() || `${captured.termination} (exit code ${captured.code}, signal ${captured.signal})`)}`);
	let response;
	try {
		response = parseRemoteWorkspaceManifestEnvelope(captured.stdout);
	} catch (error) {
		throw new Error("Worker workspace manifest returned an invalid memo response", { cause: error });
	}
	replaceWorkerWorkspaceHashMemoEntries(params.hashMemo, response.memo);
	recordRemoteWorkspaceHashMetrics(params.metrics, response.metrics);
	return response.manifestRef;
}
async function probeWorkspaceGitMode(params) {
	if (!await fs.lstat(path.join(params.localPath, ".git")).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	})) return {
		mode: "plain",
		gitRoot: params.localPath,
		baseCommit: ""
	};
	const [gitRootResult, gitBaseResult] = await Promise.all([params.runTask([
		"git",
		"-C",
		params.localPath,
		"rev-parse",
		"--show-toplevel"
	], params.commandOptions), params.runTask([
		"git",
		"-C",
		params.localPath,
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	], params.commandOptions)]);
	if (!workerWorkspaceCommandSucceeded(gitRootResult)) throw workspaceSyncError(gitRootResult);
	if (workerWorkspaceCommandSucceeded(gitBaseResult)) return {
		mode: "git",
		gitRoot: gitRootResult.stdout.trim(),
		baseCommit: gitBaseResult.stdout.trim()
	};
	if (gitBaseResult.termination === "exit" && gitBaseResult.code === 1) return {
		mode: "plain",
		gitRoot: params.localPath,
		baseCommit: ""
	};
	throw workspaceSyncError(gitBaseResult);
}
async function resolveWorkerWorkspaceGitAuthor(request, runTask) {
	const git = [
		"git",
		"-C",
		request.localPath,
		"config",
		"--get"
	];
	const read = async (key) => {
		const result = await runTask([...git, `user.${key}`]);
		return workerWorkspaceCommandSucceeded(result) ? result.stdout.trim() : "";
	};
	const [name, email] = await Promise.all([request.gitAuthor?.name ?? read("name"), request.gitAuthor?.email ?? read("email")]);
	return {
		name,
		email
	};
}
function stableWorkerPathComponent(value, length) {
	return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function validateWorkspaceSyncRequest(request) {
	if (!request.sessionId.trim()) throw new Error("Worker workspace session id must be non-empty");
	if (!path.isAbsolute(request.localPath)) throw new Error("Worker workspace local path must be absolute");
	if (!Number.isSafeInteger(request.generation) || request.generation < 0) throw new Error("Worker workspace generation must be a non-negative safe integer");
	for (const value of [request.gitAuthor?.name, request.gitAuthor?.email]) if (value !== void 0 && (!value.trim() || value.length > 256 || value.includes("\0") || /[\r\n]/u.test(value))) throw new Error("Worker workspace Git author metadata is invalid");
}
function parseRemoteWorkspaceSetup(stdout, remoteRelative) {
	let response;
	try {
		response = JSON.parse(stdout);
	} catch {
		throw new Error("Worker workspace setup returned an invalid response");
	}
	const record = isRecord(response) ? response : void 0;
	const canonicalHome = record?.canonicalHome;
	const remoteWorkspaceDir = record?.canonicalWorkspace;
	if (record?.tag !== "openclaw-workspace-setup-v1" || typeof canonicalHome !== "string" || !path.posix.isAbsolute(canonicalHome) || path.posix.normalize(canonicalHome) !== canonicalHome || typeof remoteWorkspaceDir !== "string" || !path.posix.isAbsolute(remoteWorkspaceDir) || path.posix.normalize(remoteWorkspaceDir) !== remoteWorkspaceDir || remoteWorkspaceDir === "/" || remoteWorkspaceDir !== path.posix.join(canonicalHome, remoteRelative)) throw new Error("Worker workspace setup returned an invalid response");
	return {
		canonicalHome,
		remoteWorkspaceDir
	};
}
function parseManifestRef(stdout) {
	const lines = stdout.split(/\r?\n/u).filter(Boolean);
	const manifestRef = lines.length === 1 ? lines[0] : void 0;
	if (!manifestRef || !MANIFEST_REF_PATTERN.test(manifestRef)) throw new Error("Worker workspace sync returned an invalid manifest reference");
	return manifestRef;
}
async function readTransferredManifest(filePath) {
	const { buffer } = await readRegularFile({
		filePath,
		maxBytes: MAX_WORKSPACE_MANIFEST_BYTES
	});
	return buffer.toString("utf8");
}
async function assertInboundDirectoryQuota(directory, limits) {
	const root$1 = await root(directory);
	let bytes = 0;
	for await (const entry of root$1.walk("", {
		order: "filesystem",
		maxEntries: limits.entries,
		symlinkPolicy: "skip"
	})) {
		if (entry.kind === "file") bytes += entry.size;
		if (entry.kind === "truncated" || bytes > limits.bytes) throw new Error(`Cloud workspace inbound transfer exceeds its ${limits.bytes} byte or ${limits.entries} entry limit`);
	}
}
async function runBoundedInboundRsync(params) {
	const quotaAbort = new AbortController();
	const signal = AbortSignal.any([params.ownerSignal, quotaAbort.signal]);
	const transfer = params.runTask(params.argv, workerSshCommandOptions({
		timeoutMs: params.timeoutMs,
		signal
	}));
	const transferSettled = transfer.then(() => true, () => true);
	let quotaFailure;
	let pollIntervalMs = INBOUND_QUOTA_INITIAL_POLL_MS;
	try {
		while (!await Promise.race([transferSettled, setTimeout(pollIntervalMs).then(() => false)])) {
			await assertInboundDirectoryQuota(params.destinationRoot, {
				bytes: params.totalByteLimit,
				entries: params.entryLimit
			}).catch((error) => {
				if (!isMissingPathError(error)) throw error;
			});
			pollIntervalMs = Math.min(pollIntervalMs * 2, INBOUND_QUOTA_MAX_POLL_MS);
		}
	} catch (error) {
		quotaFailure = { error };
		quotaAbort.abort(error);
	}
	let result;
	try {
		result = await transfer;
	} catch (error) {
		throw quotaFailure ? quotaFailure.error : error;
	}
	if (quotaFailure) throw quotaFailure.error;
	await assertInboundDirectoryQuota(params.destinationRoot, {
		bytes: params.totalByteLimit,
		entries: params.entryLimit
	});
	return result;
}
//#endregion
export { workerWorkspaceRsyncRemoteCommand as _, parseRemoteWorkspaceSetup as a, resolveRemoteWorkspaceManifest as c, stableWorkerPathComponent as d, validateWorkspaceSyncRequest as f, workerWorkspaceRsyncReceiverEntryPath as g, workerWorkspaceCommandSucceeded as h, parseManifestRef as i, resolveWorkerWorkspaceGitAuthor as l, workerAcceptedWorkspaceRsyncReceiverPath as m, captureRemoteWorkspaceManifest as n, probeWorkspaceGitMode as o, waitForQuiescenceRenewal as p, createWorkerWorkspaceRsyncReceiverPathFactory as r, readTransferredManifest as s, WORKER_WORKSPACE_RSYNC_DESTINATION as t, runBoundedInboundRsync as u, workerWorkspaceSshArgv as v, workspaceSyncError as y };
