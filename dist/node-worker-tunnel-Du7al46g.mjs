import { a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./backoff-CszdOMiF.mjs";
import { a as formatNodeRunnerUpdateRequired, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE } from "./node-runner-inventory-DTVspi93.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { D as NODE_WORKER_WORKSPACE_EXEC_COMMAND, x as NODE_WORKER_ENVIRONMENT_STOP_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { S as serializeWorkspaceManifest, f as decodeWorkspaceManifest } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { a as NodeWorkerWorkspaceTransferError, n as NODE_WORKSPACE_EMPTY_MANIFEST_REF } from "./node-workspace-transfer-protocol-CifFHpcH.mjs";
import { i as NODE_WORKSPACE_DRAIN_COMMAND, o as parseNodeWorkerWorkspaceExecResult, r as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES } from "./node-workspace-protocol-DpYnx7G7.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
import { m as workerWorkspaceTransferPaths } from "./workspace-result-staging-Cy039j72.mjs";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-Ci3bD3db.mjs";
import { i as workerProjectSeedKey } from "./workspace-git-base-DcOK2Mxs.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-BBj2optb.mjs";
import { i as joinWorkerTunnelStops, r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { n as measureNodeWorkerLaunchBytes } from "./node-launch-adapter-DTc3AjLt.mjs";
import { f as validateWorkspaceSyncRequest, l as resolveWorkerWorkspaceGitAuthor, n as captureRemoteWorkspaceManifest, y as workspaceSyncError } from "./workspace-sync-helpers-Bg34ooyi.mjs";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.mjs";
import { n as readWorkerProjectPreparation } from "./preparation-identity-B9ncl7Bw.mjs";
import { t as prepareRepositoryPublicationRestore } from "./github-repository-publication-restore-Clc9lq1w.mjs";
import { n as runInstrumentedWorkspaceReconcile } from "./workspace-finalize-DL6iiqwy.mjs";
import { n as prepareLocalWorkspaceReconciliation, t as createWorkerWorkspaceQuiescence } from "./workspace-quiescence-DVKmxptS.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-worker-repository-preparation.ts
const GIT_TIMEOUT_MS$1 = 6e4;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const WORKER_REPOSITORY_GIT_ARGS = [
	"-c",
	"credential.helper=",
	"-c",
	"core.askPass="
];
const workspaceSyncLog$1 = createSubsystemLogger("gateway/worker-workspace");
const AUTHENTICATED_GIT_JS = String.raw`const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const { origin, token } = JSON.parse(fs.readFileSync(0, "utf8"));
const env = { ...process.env };
for (const key of Object.keys(env)) if (/^(GIT_|GH_TOKEN$|GITHUB_TOKEN$)/i.test(key)) delete env[key];
Object.assign(env, { GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null", GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "", SSH_ASKPASS: "" });
if (token) Object.assign(env, { GIT_CONFIG_COUNT: "1", GIT_CONFIG_KEY_0: "http." + origin + ".extraheader", GIT_CONFIG_VALUE_0: "Authorization: Basic " + Buffer.from("x-access-token:" + token).toString("base64") });
const args = process.argv.slice(1);
// Identity-scoped workspaces can put partial-clone .promisor files at MAX_PATH.
if (process.platform === "win32") args.unshift("-c", "core.longpaths=true");
const result = spawnSync("git", args, { env, stdio: ["ignore", "inherit", "inherit"] });
if (result.error) console.error((result.error.code ? result.error.code + ": " : "") + result.error.message);
process.exitCode = result.status ?? 1;`;
const BIND_PREPARED_REPOSITORY_JS = String.raw`const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const { origin, commit, branch, workspaceDir, author } = JSON.parse(fs.readFileSync(0, "utf8"));
if (fs.realpathSync(process.cwd()) !== fs.realpathSync(workspaceDir)) throw Error("Prepared repository workspace changed");
const env = { ...process.env };
for (const key of Object.keys(env)) if (/^(GIT_|GH_TOKEN$|GITHUB_TOKEN$)/i.test(key)) delete env[key];
const nil = process.platform === "win32" ? "NUL" : "/dev/null";
Object.assign(env, { GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: nil, GIT_TERMINAL_PROMPT: "0", GIT_NO_LAZY_FETCH: "1", GIT_NO_REPLACE_OBJECTS: "1" });
const git = (args, allowDetached = false) => {
  const result = spawnSync("git", ["-c", "core.hooksPath=" + nil, "-c", "core.fsmonitor=false", ...args], {
    env, encoding: "utf8", timeout: 30000, maxBuffer: 262144,
  });
  if (allowDetached && result.status === 1) return undefined;
  if (result.error || result.status !== 0) throw Error("Prepared repository Git verification failed");
  return result.stdout.trim();
};
if (git(["rev-parse", "--verify", "HEAD^{commit}"]) !== commit ||
    git(["remote", "get-url", "origin"]) !== origin) throw Error("Prepared repository differs from its admitted source");
git(["check-ref-format", "--branch", branch]);
const current = git(["symbolic-ref", "--quiet", "--short", "HEAD"], true);
if (current !== branch) {
  if (current !== undefined) throw Error("Prepared repository already belongs to another session branch");
  git(["checkout", "-b", branch, commit]);
}
for (const [key, value] of Object.entries(author ?? {})) {
  if (value) git(["config", "--local", "user." + key, value]);
}
`;
function succeeded(result) {
	return result.termination === "exit" && result.code === 0;
}
function gitFailure(reason, stage, result, invariant) {
	return {
		kind: "failed",
		reason,
		detail: boundedWorkerError(`${stage}: ${result.termination} (exit code ${result.code}, signal ${result.signal}): ${invariant ?? (result.stderr.trim() || "no stderr output")}`)
	};
}
/**
* Admission owns the validated repository source; the command owner fences
* every operation to its remote session workspace. This owner never reads a Gateway checkout.
*/
function createNodeWorkerRepositoryPreparation(exec) {
	let seedStoreFailureLogged = false;
	const git = (identity, args, resetWorkspace) => exec({
		argv: [
			"node",
			"-e",
			AUTHENTICATED_GIT_JS,
			"--",
			...WORKER_REPOSITORY_GIT_ARGS,
			...args
		],
		input: JSON.stringify({
			origin: identity?.origin,
			token: identity?.gitToken
		}),
		...resetWorkspace ? { resetWorkspace: true } : {},
		timeoutMs: GIT_TIMEOUT_MS$1,
		transportRetry: "never"
	});
	const capture = async (dir, base, reference) => await exec({
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			dir,
			...base ? [base, "eligible"] : ["", "all"],
			...reference ? [reference.slice(7)] : []
		],
		timeoutMs: GIT_TIMEOUT_MS$1,
		transportRetry: "idempotent"
	});
	const checkoutAndCapture = async (identity, workspaceDir, expectedManifestRef, seeded) => {
		const fetched = await git(identity, [
			"fetch",
			"--no-tags",
			"--",
			"origin",
			identity.commit ?? identity.ref ?? "HEAD"
		]);
		if (!succeeded(fetched)) return gitFailure("checkout-failed", "git fetch", fetched);
		const resolved = await git(identity, [
			"rev-parse",
			"--verify",
			"FETCH_HEAD^{commit}"
		]);
		const revision = resolved.stdout.trim();
		if (!succeeded(resolved)) return gitFailure("checkout-failed", "git rev-parse", resolved);
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(revision)) return gitFailure("checkout-failed", "git rev-parse", resolved, "invalid commit revision");
		if (identity.commit !== void 0 && revision !== identity.commit) return gitFailure("checkout-failed", "git rev-parse", resolved, "requested commit mismatch");
		const checkedOut = await git(identity, [
			"checkout",
			"--detach",
			"--force",
			revision
		]);
		if (!succeeded(checkedOut)) return gitFailure("checkout-failed", "git checkout --detach", checkedOut);
		if (checkedOut.workspaceDir !== workspaceDir) return gitFailure("checkout-failed", "git checkout --detach", checkedOut, "workspace directory changed during checkout");
		const captured = await capture(checkedOut.workspaceDir, revision);
		const manifestRef = captured.stdout.trim();
		if (!succeeded(captured) || !MANIFEST_REF_PATTERN.test(manifestRef)) return {
			kind: "failed",
			reason: "manifest-capture-failed"
		};
		if (expectedManifestRef !== void 0 && manifestRef !== expectedManifestRef) return {
			kind: "failed",
			reason: "manifest-mismatch"
		};
		return {
			kind: "prepared",
			seeded,
			result: {
				mode: "git",
				remoteWorkspaceDir: checkedOut.workspaceDir,
				manifestRef,
				baseCommit: revision
			}
		};
	};
	return {
		bindPreparedRepository: async (identity, prepared, author) => {
			if (identity.commit !== prepared.baseCommit) throw new Error("Prepared repository does not match the pinned session commit");
			const bound = await exec({
				argv: [
					"node",
					"-e",
					BIND_PREPARED_REPOSITORY_JS
				],
				input: JSON.stringify({
					origin: identity.origin,
					commit: identity.commit,
					branch: identity.branch,
					workspaceDir: prepared.workspaceDir,
					author
				}),
				timeoutMs: GIT_TIMEOUT_MS$1,
				transportRetry: "never"
			});
			if (!succeeded(bound) || bound.workspaceDir !== prepared.workspaceDir) throw new Error("Prepared repository session binding failed");
			return {
				mode: "repository",
				remoteWorkspaceDir: prepared.workspaceDir,
				manifestRef: prepared.preparedManifestRef,
				baseManifestRef: prepared.sourceManifestRef,
				baseCommit: prepared.baseCommit
			};
		},
		configureAuthor: async (workspaceDir, author) => {
			for (const [key, value] of Object.entries(author)) {
				if (!value) continue;
				const configured = await git(void 0, [
					"-C",
					workspaceDir,
					"config",
					"--local",
					`user.${key}`,
					value
				]);
				if (!succeeded(configured)) throw workspaceSyncError(configured);
			}
		},
		captureManifest: async (dir, base, reference) => {
			const captured = await capture(dir, base, reference);
			const manifestRef = captured.stdout.trim();
			if (!succeeded(captured) || !MANIFEST_REF_PATTERN.test(manifestRef)) {
				const detail = boundedWorkerError(captured.stderr.trim() || (!succeeded(captured) ? `${captured.termination} (exit code ${captured.code}, signal ${captured.signal})` : "invalid manifest reference"));
				throw new Error(`Node workspace manifest capture failed: ${detail}`);
			}
			return manifestRef;
		},
		async prepareRepository(identity, expectedManifestRef) {
			const seedKey = createHash("sha256").update(identity.origin).digest("hex");
			let outcome;
			try {
				const applied = await exec({
					argv: ["openclaw-internal-workspace-seed"],
					seed: {
						action: "apply",
						key: seedKey
					},
					timeoutMs: GIT_TIMEOUT_MS$1,
					transportRetry: "never"
				});
				if (succeeded(applied) && applied.stdout.trim() === "applied") {
					const remote = await git(identity, [
						"remote",
						"get-url",
						"origin"
					]);
					if (!succeeded(remote) || remote.stdout.trim() !== identity.origin) throw new Error("Node workspace seed origin mismatch");
					outcome = await checkoutAndCapture(identity, applied.workspaceDir, expectedManifestRef, true);
				}
			} catch (error) {
				if (error instanceof Error && error.message.includes("INVALID_REQUEST")) throw error;
				else workspaceSyncLog$1.info("node worker workspace seeded sync failed; cloning", { error: boundedWorkerError(error) });
			}
			if (outcome?.kind !== "prepared") {
				const cloned = await git(identity, [
					"-c",
					"init.templateDir=",
					"clone",
					"--filter=blob:none",
					"--no-checkout",
					"--",
					identity.origin,
					"."
				], true);
				if (!succeeded(cloned)) return gitFailure("clone-failed", "git clone", cloned);
				outcome = await checkoutAndCapture(identity, cloned.workspaceDir, expectedManifestRef, false);
			}
			if (outcome.kind === "prepared") try {
				const stored = await exec({
					argv: ["openclaw-internal-workspace-seed"],
					seed: {
						action: "store",
						key: seedKey,
						maxAgeMs: 216e5
					},
					timeoutMs: 18e4,
					transportRetry: "never"
				});
				if (!succeeded(stored)) throw workspaceSyncError(stored);
			} catch (error) {
				if (error instanceof Error && error.message.includes("INVALID_REQUEST")) throw error;
				if (!seedStoreFailureLogged) {
					seedStoreFailureLogged = true;
					workspaceSyncLog$1.warn("node worker workspace seed store failed", { error: boundedWorkerError(error) });
				}
			}
			if (outcome.kind === "prepared" && identity.branch) {
				const bound = await git(identity, [
					"checkout",
					"-B",
					identity.branch,
					outcome.result.baseCommit
				]);
				if (!succeeded(bound)) return gitFailure("checkout-failed", "git checkout -B", bound);
			}
			return outcome;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/node-worker-workspace-fallback.ts
const GIT_TIMEOUT_MS = 6e4;
const COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
const workspaceSyncLog = createSubsystemLogger("gateway/worker-workspace");
function recordNodeSyncPath(environmentId, sessionId, outcome, originStartedAt) {
	workspaceSyncLog.info("worker workspace sync path selected", {
		environmentId,
		sessionId,
		path: outcome.kind === "synced" ? "origin" : "gateway-push",
		reason: outcome.kind === "synced" ? outcome.seeded ? "published-origin-seeded" : "published-origin" : outcome.reason,
		originAttemptMs: performance.now() - originStartedAt
	});
}
async function localGit(root, args) {
	const result = await runCommandWithTimeout([
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		...WORKER_REPOSITORY_GIT_ARGS,
		"-C",
		root,
		...args
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		maxOutputBytes: 262144,
		maxCombinedOutputBytes: 524288,
		outputCapture: "head",
		baseEnv: {
			...process.env,
			GIT_TERMINAL_PROMPT: "0",
			GIT_ASKPASS: "",
			SSH_ASKPASS: ""
		}
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error("local Git inspection failed");
	return result.stdout.trim();
}
function credentialFreeHttpOrigin(raw) {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		return;
	}
	return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.username === "" && parsed.password === "" && parsed.search === "" && parsed.hash === "" ? parsed.href : void 0;
}
async function requiresWorkspaceTransfer(root) {
	for (const marker of [".worktreeinclude", ".gitmodules"]) try {
		await fs.lstat(path.join(root, marker));
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	try {
		return /\bfilter\s*=\s*lfs\b/u.test(await fs.readFile(path.join(root, ".gitattributes"), "utf8"));
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return false;
	}
}
async function inspectEligibleOrigin(localPath) {
	try {
		const canonicalPath = await fs.realpath(localPath);
		let root;
		try {
			root = await fs.realpath(await localGit(canonicalPath, ["rev-parse", "--show-toplevel"]));
		} catch {
			return {
				kind: "fallback",
				reason: "not-git-workspace"
			};
		}
		if (root !== canonicalPath) return {
			kind: "fallback",
			reason: "not-repository-root"
		};
		if (await requiresWorkspaceTransfer(root)) return {
			kind: "fallback",
			reason: "workspace-transfer-required"
		};
		const [status, commit, rawOrigin] = await Promise.all([
			localGit(root, [
				"status",
				"--porcelain=v1",
				"--untracked-files=all"
			]),
			localGit(root, ["rev-parse", "HEAD"]),
			localGit(root, [
				"remote",
				"get-url",
				"origin"
			]).catch(() => "")
		]);
		if (status) return {
			kind: "fallback",
			reason: "workspace-dirty"
		};
		const origin = credentialFreeHttpOrigin(rawOrigin);
		if (!COMMIT_PATTERN.test(commit) || !origin) return {
			kind: "fallback",
			reason: "origin-unavailable"
		};
		return {
			kind: "eligible",
			identity: {
				commit,
				origin
			}
		};
	} catch {
		return {
			kind: "fallback",
			reason: "inspection-failed"
		};
	}
}
/** Optional published-origin fast path; HTTPS transfer remains the canonical fallback. */
function createNodeWorkerWorkspaceFallback(exec) {
	const repository = createNodeWorkerRepositoryPreparation(exec);
	return {
		async trySyncWorkspace(request, expectedManifestRef) {
			validateWorkspaceSyncRequest(request);
			const inspection = await inspectEligibleOrigin(request.localPath);
			if (inspection.kind === "fallback") return inspection;
			const prepared = await repository.prepareRepository(inspection.identity, expectedManifestRef);
			return prepared.kind === "prepared" ? {
				kind: "synced",
				seeded: prepared.seeded,
				result: {
					mode: "git",
					remoteWorkspaceDir: prepared.result.remoteWorkspaceDir,
					manifestRef: prepared.result.manifestRef
				}
			} : {
				kind: "fallback",
				reason: prepared.reason
			};
		},
		async finalizeSync(request, result) {
			if (result.mode === "plain") return result;
			const author = await resolveWorkerWorkspaceGitAuthor(request, async (argv) => runCommandWithTimeout(argv, {
				timeoutMs: GIT_TIMEOUT_MS,
				maxOutputBytes: 1024
			}));
			await repository.configureAuthor(result.remoteWorkspaceDir, author);
			return result;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/node-worker-workspace-actions.ts
const workspaceLog = createSubsystemLogger("gateway/worker-workspace");
const NODE_WORKSPACE_HASH_MEMO_BYTES = NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES - 4096;
function createNodeWorkerWorkspaceActions(params) {
	const { restoredWorkspace } = params;
	let workspaceReady = restoredWorkspace !== void 0;
	let sessionKey = restoredWorkspace?.sessionKey;
	const exec = async (command) => {
		if (!workspaceReady) throw new Error("node worker workspace is unavailable before sync");
		return await params.runWorkspaceCommand({
			...command,
			...sessionKey === void 0 ? {} : { sessionKey }
		});
	};
	const transfer = async (input, failure, command = { timeoutMs: 6e5 }) => {
		const result = await exec({
			...command,
			argv: ["openclaw-internal-workspace-transfer"],
			transfer: input,
			transportRetry: "never"
		});
		if (result.termination !== "exit" || result.code !== 0 || input.direction === "download" && result.stdout.trim() !== input.manifestRef) throw new Error(failure);
		return result;
	};
	const workspace = createNodeWorkerWorkspaceFallback(exec);
	const quiesceWorkspace = createWorkerWorkspaceQuiescence({
		ownerSignal: params.ownerSignal,
		sharedHost: true,
		runWorkspaceCommand: exec
	});
	const validateRestoredWorkspace = async () => {
		if (!restoredWorkspace) return;
		if (restoredWorkspace.source.kind === "repository") {
			await params.workspaceTransfer.prepareRepository({
				environmentId: params.environmentId,
				ownerEpoch: params.ownerEpoch,
				sessionId: params.sessionId,
				generation: params.ownerEpoch,
				baseCommit: restoredWorkspace.source.baseCommit,
				baseManifestRef: restoredWorkspace.source.baseManifestRef,
				isAuthorized: params.isOwnerCurrent,
				signal: params.ownerSignal
			});
			return;
		}
		const prepared = await params.workspaceTransfer.prepareSync({
			environmentId: params.environmentId,
			ownerEpoch: params.ownerEpoch,
			sessionId: params.sessionId,
			generation: params.ownerEpoch,
			localPath: restoredWorkspace.source.path,
			isAuthorized: params.isOwnerCurrent,
			signal: params.ownerSignal
		});
		params.workspaceTransfer.revoke(params.environmentId, prepared.token);
	};
	const placementHashMemo = /* @__PURE__ */ new Map();
	const reconcileWorkspace = (request) => runInstrumentedWorkspaceReconcile((metrics) => request.source.kind === "repository" ? reconcileRepository(request, metrics) : reconcileWorkspaceRun({
		remoteWorkspaceDir: request.remoteWorkspaceDir,
		baseManifestRef: request.baseManifestRef,
		localPath: request.source.path,
		journal: request.source.journal,
		stagedResult: request.source.stagedResult
	}, metrics));
	const reconcileRepository = async (request, metrics) => {
		if (request.source.kind !== "repository") throw new Error("Repository checkpoint source is required");
		const token = params.workspaceTransfer.prepareUpload(params.environmentId, request.baseManifestRef);
		let preparedCheckpoint;
		try {
			await transfer({
				direction: "upload",
				token,
				baseManifestRef: request.baseManifestRef,
				referenceManifestRef: request.source.referenceManifestRef
			}, "Node repository checkpoint upload failed");
			const uploaded = params.workspaceTransfer.takeUpload(params.environmentId, request.baseManifestRef);
			try {
				const verifyStable = async () => {
					if (await captureRemoteWorkspaceManifest({
						runWorkspaceCommand: exec,
						remoteWorkspaceDir: request.remoteWorkspaceDir,
						baseCommit: uploaded.base.baseCommit,
						priorManifestDigests: [uploaded.currentManifestRef.slice(7), uploaded.baseManifestRef.slice(7)],
						hashMemo: placementHashMemo,
						metrics,
						maxHashMemoBytes: NODE_WORKSPACE_HASH_MEMO_BYTES
					}) !== uploaded.currentManifestRef) throw new Error("Repository workspace changed during checkpoint capture");
				};
				await verifyStable();
				if (!uploaded.base.baseCommit) throw new Error("Repository checkpoint has no pinned Git base");
				let publicationToken;
				let publication;
				let publicationDigest;
				try {
					try {
						publicationToken = params.workspaceTransfer.prepareUpload(params.environmentId, NODE_WORKSPACE_EMPTY_MANIFEST_REF);
						await transfer({
							direction: "upload",
							token: publicationToken,
							baseManifestRef: NODE_WORKSPACE_EMPTY_MANIFEST_REF,
							referenceManifestRef: NODE_WORKSPACE_EMPTY_MANIFEST_REF,
							publicationBaseCommit: uploaded.base.baseCommit
						}, "Repository publication capture failed");
						publication = params.workspaceTransfer.takeUpload(params.environmentId, NODE_WORKSPACE_EMPTY_MANIFEST_REF);
						const snapshot = publication.current.entries.find((entry) => entry.path === "snapshot.json");
						if (snapshot?.type !== "file") throw new Error("Repository publication snapshot is missing");
						publicationDigest = `sha256:${snapshot.sha256}`;
					} catch (error) {
						params.ownerSignal.throwIfAborted();
						if (!params.isOwnerCurrent()) throw error;
						workspaceLog.warn(`Repository publication capture unavailable: ${boundedWorkerError(error)}`);
					} finally {
						if (publicationToken) await params.workspaceTransfer.discardUpload(params.environmentId, publicationToken);
					}
					await verifyStable();
					const prepared = await request.source.prepareCheckpoint({
						stagingRoot: uploaded.stagingRoot,
						...publication && publicationDigest ? {
							publicationStagingRoot: publication.stagingRoot,
							publicationDigest
						} : {},
						baseManifestRaw: uploaded.baseRaw,
						currentManifestRaw: uploaded.currentRaw,
						baseManifestRef: uploaded.baseManifestRef,
						currentManifestRef: uploaded.currentManifestRef
					});
					preparedCheckpoint = prepared;
					return {
						manifestRef: uploaded.currentManifestRef,
						changed: uploaded.currentManifestRef !== uploaded.baseManifestRef,
						verifyStable,
						verifyLocalStable: () => prepared.verify(),
						publishStagedResult: async () => {
							await prepared.publish();
						},
						discardPreparedStagedResult: () => prepared.discard()
					};
				} finally {
					if (publication) await fs.rm(publication.stagingRoot, {
						recursive: true,
						force: true
					});
				}
			} finally {
				await fs.rm(uploaded.stagingRoot, {
					recursive: true,
					force: true
				});
			}
		} catch (error) {
			try {
				await preparedCheckpoint?.discard();
			} catch (discardError) {
				throw new AggregateError([error, discardError], "Repository checkpoint handoff cleanup failed", { cause: discardError });
			}
			throw error;
		} finally {
			params.workspaceTransfer.revoke(params.environmentId, token);
		}
	};
	const reconcileWorkspaceRun = async (request, metrics) => {
		const acceptLocal = await prepareLocalWorkspaceReconciliation({
			request,
			hashMemo: placementHashMemo,
			metrics
		});
		const uploadToken = params.workspaceTransfer.prepareUpload(params.environmentId, request.baseManifestRef);
		try {
			await transfer({
				direction: "upload",
				token: uploadToken,
				baseManifestRef: request.baseManifestRef,
				referenceManifestRef: request.baseManifestRef
			}, "Node workspace reconcile upload failed");
		} finally {
			params.workspaceTransfer.revoke(params.environmentId, uploadToken);
		}
		const uploaded = params.workspaceTransfer.takeUpload(params.environmentId, request.baseManifestRef);
		try {
			let expectedRemoteRef = uploaded.currentManifestRef;
			const verifyStable = async () => {
				if (await captureRemoteWorkspaceManifest({
					runWorkspaceCommand: exec,
					remoteWorkspaceDir: request.remoteWorkspaceDir,
					baseCommit: uploaded.base.baseCommit,
					priorManifestDigests: [expectedRemoteRef.slice(7), uploaded.baseManifestRef.slice(7)],
					hashMemo: placementHashMemo,
					metrics,
					maxHashMemoBytes: NODE_WORKSPACE_HASH_MEMO_BYTES
				}) !== expectedRemoteRef) throw new Error("Cloud workspace changed during final reconciliation");
			};
			const publishAcceptedManifest = async (accepted) => {
				if (accepted.manifestRef === expectedRemoteRef) return;
				const token = params.workspaceTransfer.publishSnapshot(params.environmentId, {
					manifest: accepted.manifest,
					manifestRef: accepted.manifestRef,
					rawManifest: (await serializeWorkspaceManifest(accepted.manifest, params.ownerSignal)).raw,
					root: await fs.realpath(request.localPath)
				});
				try {
					await transfer({
						direction: "download",
						token,
						manifestRef: accepted.manifestRef
					}, "Node workspace accepted manifest publication failed");
					expectedRemoteRef = accepted.manifestRef;
				} finally {
					params.workspaceTransfer.revoke(params.environmentId, token);
				}
			};
			return await acceptLocal({
				...uploaded,
				publishAcceptedManifest,
				manifestRef: () => expectedRemoteRef,
				verifyStable
			});
		} finally {
			await fs.rm(uploaded.stagingRoot, {
				recursive: true,
				force: true
			});
		}
	};
	const syncRepository = async (request) => {
		if (request.source.kind !== "repository") throw new Error("Repository source is required");
		const source = request.source;
		const repository = createNodeWorkerRepositoryPreparation(exec);
		const identity = {
			origin: source.url,
			ref: source.ref,
			commit: source.baseCommit,
			branch: source.branch,
			gitToken: source.gitToken
		};
		let baseline;
		if (source.prepared) {
			if (!source.baseCommit || source.runSetupScript) throw new Error("Prepared repository requires its pinned commit and completed setup");
			baseline = await repository.bindPreparedRepository({
				...identity,
				commit: source.baseCommit
			}, source.prepared, request.gitAuthor);
		} else {
			const prepared = await repository.prepareRepository(identity);
			if (prepared.kind === "failed") throw new Error(`Cloud repository preparation failed: ${prepared.reason}${prepared.detail ? `: ${prepared.detail}` : ""}`);
			baseline = prepared.result;
		}
		const baseManifestRef = baseline.mode === "repository" ? baseline.baseManifestRef : baseline.manifestRef;
		const baseCommit = baseline.baseCommit;
		const remoteWorkspaceDir = baseline.remoteWorkspaceDir;
		if (request.gitAuthor && !source.prepared) await repository.configureAuthor(remoteWorkspaceDir, request.gitAuthor);
		await params.workspaceTransfer.prepareRepository({
			environmentId: params.environmentId,
			ownerEpoch: params.ownerEpoch,
			sessionId: params.sessionId,
			generation: params.ownerEpoch,
			baseCommit,
			baseManifestRef,
			isAuthorized: params.isOwnerCurrent,
			signal: params.ownerSignal
		});
		let manifestRef = baseline.manifestRef;
		if (source.checkpoint) {
			const checkpoint = source.checkpoint;
			const decodedBase = await decodeWorkspaceManifest(checkpoint.baseManifestRaw, void 0, params.ownerSignal);
			if (decodedBase.manifestRef !== baseManifestRef) throw new Error("Repository checkpoint baseline differs from its cloned commit");
			const decoded = await decodeWorkspaceManifest(checkpoint.currentManifestRaw, void 0, params.ownerSignal);
			manifestRef = decoded.manifestRef;
			const manifest = decoded.manifest;
			const base = decodedBase.manifest;
			const token = params.workspaceTransfer.publishSnapshot(params.environmentId, {
				manifest,
				manifestRef,
				rawManifest: checkpoint.currentManifestRaw,
				root: checkpoint.stagingRoot,
				blobPaths: new Set(workerWorkspaceTransferPaths(manifest, base, params.ownerSignal))
			});
			try {
				await transfer({
					direction: "download",
					token,
					manifestRef,
					checkpointBaseManifestRef: baseManifestRef
				}, "Repository checkpoint restore failed");
				for (const command of await prepareRepositoryPublicationRestore({
					...checkpoint,
					current: manifest
				})) {
					const restored = await exec({
						...command,
						timeoutMs: 6e4,
						transportRetry: "never"
					});
					if (restored.code !== 0 || restored.termination !== "exit") throw new Error("Repository publication paths could not be restored; retry workspace preparation");
				}
			} finally {
				params.workspaceTransfer.revoke(params.environmentId, token);
			}
		} else if (source.runSetupScript) {
			const setup = await exec({
				argv: [
					"node",
					"-e",
					String.raw`const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = process.cwd();
const script = path.join(root, ".openclaw", "worktree-setup.sh");
const stat = fs.statSync(script, { throwIfNoEntry: false });
if (stat?.isFile() && (stat.mode & 0o111)) {
  const run = spawnSync(script, [], {
    cwd: root,
    env: { ...process.env, OPENCLAW_SOURCE_TREE_PATH: root, OPENCLAW_WORKTREE_PATH: root },
    stdio: "inherit",
  });
  process.exitCode = run.status ?? 1;
}`
				],
				timeoutMs: 12e4,
				transportRetry: "never"
			});
			if (setup.code !== 0 || setup.termination !== "exit") throw new Error("Repository setup script failed");
			manifestRef = await repository.captureManifest(remoteWorkspaceDir, baseCommit, baseManifestRef);
		}
		return {
			mode: "repository",
			remoteWorkspaceDir,
			manifestRef,
			baseCommit,
			baseManifestRef
		};
	};
	return {
		getSessionKey: () => sessionKey,
		validateRestoredWorkspace,
		runWorkspaceCommand: exec,
		stageAttachments: async (request) => {
			const prepared = await params.workspaceTransfer.prepareAttachments({
				...request,
				environmentId: params.environmentId
			});
			try {
				await transfer({
					direction: "download",
					token: prepared.token,
					manifestRef: prepared.snapshot.manifestRef,
					attachments: true
				}, "Worker attachment transfer failed", {
					assertCurrent: () => {
						if (!request.isAuthorized()) throw new Error("Worker attachment transfer authority closed");
					},
					signal: request.signal
				});
			} finally {
				params.workspaceTransfer.revoke(params.environmentId, prepared.token);
			}
		},
		syncWorkspace: async (request) => {
			if (request.sessionId !== params.sessionId || sessionKey !== void 0 && request.sessionKey !== sessionKey) throw new Error("Node workspace sync does not match its bound session");
			sessionKey = request.sessionKey;
			workspaceReady = true;
			try {
				if (request.source.kind === "repository") return await syncRepository(request);
				const localRequest = {
					sessionId: request.sessionId,
					generation: request.generation,
					gitAuthor: request.gitAuthor,
					localPath: request.source.path,
					projectKey: request.source.projectKey
				};
				const prepared = await params.workspaceTransfer.prepareSync({
					environmentId: params.environmentId,
					ownerEpoch: params.ownerEpoch,
					sessionId: params.sessionId,
					generation: params.ownerEpoch,
					localPath: localRequest.localPath,
					isAuthorized: params.isOwnerCurrent,
					signal: params.ownerSignal
				});
				try {
					if (!localRequest.projectKey) {
						const originStartedAt = performance.now();
						const origin = await workspace.trySyncWorkspace(localRequest, prepared.snapshot.manifestRef);
						recordNodeSyncPath(params.environmentId, params.sessionId, origin, originStartedAt);
						if (origin.kind === "synced") return await workspace.finalizeSync(localRequest, origin.result);
					}
					const transferred = await transfer({
						direction: "download",
						token: prepared.token,
						manifestRef: prepared.snapshot.manifestRef,
						...localRequest.projectKey && prepared.snapshot.manifest.baseCommit ? { seedKey: workerProjectSeedKey({
							key: localRequest.projectKey,
							baseCommit: prepared.snapshot.manifest.baseCommit
						}) } : {}
					}, "Node workspace transfer failed");
					return await workspace.finalizeSync(localRequest, {
						mode: prepared.snapshot.manifest.baseCommit ? "git" : "plain",
						remoteWorkspaceDir: transferred.workspaceDir,
						manifestRef: prepared.snapshot.manifestRef
					});
				} finally {
					params.workspaceTransfer.revoke(params.environmentId, prepared.token);
				}
			} catch (error) {
				workspaceReady = restoredWorkspace !== void 0;
				throw error;
			}
		},
		quiesceWorkspace,
		reconcileWorkspace
	};
}
//#endregion
//#region src/gateway/worker-environments/node-worker-workspace-drain.ts
/** Cancellation is only a request. This acknowledgement joins the node's physical workspace queue. */
async function drainNodeWorkerWorkspace(params) {
	const signal = AbortSignal.timeout(params.timeoutMs);
	const { transport, node } = await params.findNode(signal);
	const result = await transport.invoke({
		node,
		command: NODE_WORKER_WORKSPACE_EXEC_COMMAND,
		params: {
			gatewayNamespace: params.gatewayNamespace,
			environmentId: params.environmentId,
			sessionId: params.sessionId,
			generation: params.ownerEpoch,
			argv: [NODE_WORKSPACE_DRAIN_COMMAND]
		},
		timeoutMs: params.timeoutMs,
		signal,
		isDispatchAuthorized: params.isAuthorized
	});
	if (!result.ok) throw new WorkerTunnelOwnerDisconnectedError(`Node workspace operations have not drained (${result.error?.code ?? "UNAVAILABLE"}); reconnect the session runner before retrying`);
	if (!params.isAuthorized()) throw new Error("Node workspace drain authority closed");
	const parsed = parseNodeWorkerWorkspaceExecResult(JSON.parse(result.payloadJSON ?? "null"));
	if (parsed?.termination !== "exit" || parsed.code !== 0 || parsed.stdout.trim() !== "drained") throw new Error("Node workspace drain acknowledgement is invalid");
}
//#endregion
//#region src/gateway/worker-environments/node-worker-tunnel.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 6e4;
const COMMAND_RESULT_GRACE_MS = 5e3;
const RETRY_DELAY_MS = 100;
const tunnelLog = createSubsystemLogger("gateway/worker-tunnel");
const RETRYABLE_TRANSPORT_CODES = /* @__PURE__ */ new Set([
	"DISCONNECTED",
	"NOT_CONNECTED",
	"PAIRING_CHANGED",
	"PRIVATE_DIALECT_UNAVAILABLE",
	"ROUTE_CHANGED",
	"TIMEOUT",
	"UNAVAILABLE"
]);
function spawnResultFromReceipt(receipt) {
	if (receipt.state === "completed") return {
		stdout: receipt.resultJson,
		stderr: "",
		code: 0,
		signal: null,
		killed: false,
		termination: "exit"
	};
	if (receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled") return {
		stdout: "",
		stderr: receipt.errorText,
		code: 1,
		signal: null,
		killed: receipt.state === "cancelled" || receipt.state === "interrupted",
		termination: "exit"
	};
	throw new Error("node worker launch returned without a terminal receipt");
}
function payloadJson(value) {
	if (!value) throw new Error("node workspace command omitted its result");
	try {
		return JSON.parse(value);
	} catch {
		throw new Error("node workspace command returned malformed JSON");
	}
}
/** Owns node-channel handles without treating the persistent machine as a disposable lease. */
function createNodeWorkerTunnelManager(options) {
	const entries = /* @__PURE__ */ new Map();
	const retiredEntries = /* @__PURE__ */ new Set();
	let resolveWorkspaceBinding;
	const gatewayNamespace = nodeWorkerGatewayNamespace(options.gatewayDeviceId);
	const hasDurableBinding = (entry) => {
		const current = options.getEnvironment(entry.environmentId);
		return Boolean(current && current.ownerEpoch === entry.ownerEpoch && current.bootstrapReceipt?.installKind === "bundle" && sameWorkerBuild(current.bootstrapReceipt, entry.expectedBuild) && current.attachedSessionIds.length <= 1 && (current.attachedSessionIds.length === 0 || current.attachedSessionIds[0] === entry.sessionId));
	};
	const isLiveEntry = (entry) => entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
	const isEnvironmentOwner = (entry) => hasDurableBinding(entry) && isLiveEntry(entry);
	const readPreparation = (entry) => readWorkerProjectPreparation(options.getEnvironment(entry.environmentId)?.profileSnapshot.project);
	const findNode = async (entry, signal) => {
		const transport = options.getTransport();
		if (!transport) throw new Error("device worker node transport is unavailable");
		const node = await raceNodeWorkerOperation(transport.getCurrentNode(entry.deviceId), signal);
		if (!node) throw new WorkerTunnelOwnerDisconnectedError("device worker node is not connected with the supervisor dialect");
		return {
			transport,
			node
		};
	};
	const drainWorkspace = (entry, isAuthorized) => drainNodeWorkerWorkspace({
		...entry,
		gatewayNamespace,
		timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS,
		findNode: (signal) => findNode(entry, signal),
		isAuthorized
	});
	const invokeWorkspaceCommand = async (entry, command, onDispatchReady) => {
		const assertCurrent = () => {
			if (!isEnvironmentOwner(entry)) throw new Error("node worker workspace authority closed");
			command.assertCurrent?.();
		};
		const commandTimeoutMs = command.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS;
		const transportTimeoutMs = addTimerTimeoutGraceMs(commandTimeoutMs, COMMAND_RESULT_GRACE_MS) ?? commandTimeoutMs;
		const deadline = Date.now() + transportTimeoutMs;
		const signals = [entry.abortController.signal, AbortSignal.timeout(transportTimeoutMs)];
		if (command.signal) signals.push(command.signal);
		const signal = AbortSignal.any(signals);
		const preparationKey = readPreparation(entry)?.key;
		const input = {
			gatewayNamespace,
			environmentId: entry.environmentId,
			sessionId: entry.sessionId,
			...preparationKey === void 0 ? {} : {
				preparationKey,
				sessionKey: command.sessionKey
			},
			generation: entry.ownerEpoch,
			argv: [...command.argv],
			...command.input === void 0 ? {} : { input: command.input },
			timeoutMs: commandTimeoutMs,
			...command.resetWorkspace === void 0 ? {} : { resetWorkspace: command.resetWorkspace },
			...command.transfer === void 0 ? {} : { transfer: command.transfer },
			...command.seed === void 0 ? {} : { seed: command.seed },
			...command.process === void 0 ? {} : { process: command.process }
		};
		while (true) {
			assertCurrent();
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0 || signal.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("node worker workspace command timed out");
			let result;
			try {
				const { node, transport } = await findNode(entry, signal);
				assertCurrent();
				result = await transport.invoke({
					node,
					command: NODE_WORKER_WORKSPACE_EXEC_COMMAND,
					params: input,
					timeoutMs: remainingMs,
					signal,
					onDispatchReady,
					isDispatchAuthorized: () => {
						assertCurrent();
						return true;
					}
				});
			} catch (error) {
				assertCurrent();
				if (command.transportRetry !== "idempotent" || signal.aborted || !isEnvironmentOwner(entry)) throw error;
				await sleepWithAbort(Math.min(RETRY_DELAY_MS, Math.max(1, deadline - Date.now())), signal);
				continue;
			}
			if (!result.ok) {
				const code = result.error?.code ?? "UNAVAILABLE";
				if (code === "WORKSPACE_TRANSFER_FAILED") throw new NodeWorkerWorkspaceTransferError(result.error?.message ?? "workspace-transfer-failed: transfer did not complete");
				if (command.transportRetry === "idempotent" && RETRYABLE_TRANSPORT_CODES.has(code)) {
					await sleepWithAbort(Math.min(RETRY_DELAY_MS, remainingMs), signal);
					continue;
				}
				throw new Error(result.error?.message && code === "INVALID_REQUEST" ? `node workspace command failed (${code}): ${result.error.message}` : `node workspace command failed (${code})`);
			}
			const parsed = parseNodeWorkerWorkspaceExecResult(payloadJson(result.payloadJSON), command.argv);
			if (!parsed) throw new Error("node workspace command violated its private result contract");
			return parsed;
		}
	};
	const runWorkspaceCommand = (entry, command) => {
		let dispatched = false;
		const operation = invokeWorkspaceCommand(entry, command, () => {
			dispatched = true;
		}).catch(async (error) => {
			if (dispatched && isEnvironmentOwner(entry)) try {
				await drainWorkspace(entry, () => isEnvironmentOwner(entry));
			} catch (drainError) {
				retireEntry(entry);
				throw drainError;
			}
			throw error;
		});
		entry.workspaceTasks.add(operation);
		return operation.finally(() => entry.workspaceTasks.delete(operation));
	};
	const createHandle = (entry, restoredWorkspace) => {
		const buildLaunchInput = (plan, claim) => ({
			environmentSession: 1,
			launchId: plan.assignment.turnId,
			gatewayNamespace,
			expectedBundleHash: entry.expectedBuild.bundleHash,
			placementGeneration: claim.placementGeneration,
			...readPreparation(entry) ? { sessionKey: getSessionKey() } : {},
			descriptor: plan
		});
		const { validateRestoredWorkspace, getSessionKey, ...workspaceActions } = createNodeWorkerWorkspaceActions({
			environmentId: entry.environmentId,
			ownerEpoch: entry.ownerEpoch,
			sessionId: entry.sessionId,
			ownerSignal: entry.abortController.signal,
			isOwnerCurrent: () => isLiveEntry(entry),
			restoredWorkspace,
			workspaceTransfer: options.workspaceTransfer,
			runWorkspaceCommand: (command) => runWorkspaceCommand(entry, command)
		});
		return {
			handle: {
				...workspaceActions,
				environmentId: entry.environmentId,
				ownerEpoch: entry.ownerEpoch,
				measureLaunchTurn: (plan, claim) => measureNodeWorkerLaunchBytes(entry.deviceId, buildLaunchInput(plan, claim)),
				launchTurn: async (request) => {
					if (entry.executionMode !== "worker-turn") throw new Error("remote-exec environments do not launch embedded worker turns");
					const plan = request.plan;
					const claim = request.turnClaim;
					const isDispatchAuthorized = () => isEnvironmentOwner(entry) && claim.owner.kind === "worker" && claim.owner.environmentId === entry.environmentId && claim.owner.ownerEpoch === entry.ownerEpoch && claim.sessionId === plan.admission.sessionId && claim.runId === plan.assignment.runId && options.validateWorkerTurn(claim);
					const operation = options.launchNodeWorker({
						deviceId: entry.deviceId,
						input: buildLaunchInput(plan, claim),
						isDispatchAuthorized,
						isCancellationAuthorized: () => hasDurableBinding(entry),
						timeoutMs: request.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS,
						...request.credentialExpiresAtMs === void 0 ? {} : { credentialExpiresAtMs: request.credentialExpiresAtMs },
						onDispatchReady: request.onDispatchReady,
						signal: request.signal ? AbortSignal.any([entry.abortController.signal, request.signal]) : entry.abortController.signal
					});
					entry.launchTasks.add(operation);
					try {
						return spawnResultFromReceipt(await operation);
					} finally {
						entry.launchTasks.delete(operation);
					}
				},
				stop: async () => {
					await stopEntry(entry);
				}
			},
			validateRestoredWorkspace
		};
	};
	function retireEntry(entry) {
		if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
		entry.abortController.abort(/* @__PURE__ */ new Error("node worker tunnel owner stopped"));
		entry.readiness.reject(/* @__PURE__ */ new Error("node worker tunnel stopped before connecting"));
		retiredEntries.add(entry);
	}
	function stopEntry(entry, reason) {
		retireEntry(entry);
		return stopEnvironmentOwner(entry, reason);
	}
	function stopEnvironmentOwner(entry, reason) {
		if (entry.stopPromise) {
			if (entry.stopReason === reason || !retiredEntries.has(entry)) return entry.stopPromise;
			return entry.stopPromise.catch((error) => {
				if (!reason) throw error;
			}).then(() => retiredEntries.has(entry) ? stopEnvironmentOwner(entry, reason) : void 0);
		}
		retiredEntries.add(entry);
		entry.stopReason = reason;
		entry.stopPromise = (async () => {
			await entry.drainLocalWork?.();
			let stopping = true;
			try {
				if (reason !== "provider-destroying" && reason !== "provider-destroyed") await drainWorkspace(entry, () => stopping && retiredEntries.has(entry));
				if (entry.executionMode === "worker-turn" && reason === void 0) {
					const signal = AbortSignal.timeout(DEFAULT_COMMAND_TIMEOUT_MS);
					const { transport, node } = await findNode(entry, signal);
					if (node.workerHost.environmentSession !== 1) throw new Error(formatNodeRunnerUpdateRequired(node.nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE));
					const operation = transport.invoke({
						node,
						command: NODE_WORKER_ENVIRONMENT_STOP_COMMAND,
						params: {
							gatewayNamespace,
							environmentId: entry.environmentId,
							sessionId: entry.sessionId,
							ownerEpoch: entry.ownerEpoch
						},
						timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS,
						signal,
						isDispatchAuthorized: () => stopping && retiredEntries.has(entry)
					});
					const result = await raceNodeWorkerOperation(operation, signal);
					if (!result.ok) {
						const code = result.error?.code ?? "UNAVAILABLE";
						const message = `node worker environment stop failed (${code})`;
						throw RETRYABLE_TRANSPORT_CODES.has(code) ? new WorkerTunnelOwnerDisconnectedError(message) : new Error(message);
					}
				}
			} finally {
				stopping = false;
				await options.workspaceTransfer.close(entry.environmentId);
			}
			if (reason !== "provider-destroying") retiredEntries.delete(entry);
		})().finally(() => {
			if (retiredEntries.has(entry)) entry.stopPromise = void 0;
		});
		return entry.stopPromise;
	}
	async function stop(environmentId, ownerEpoch, reason) {
		const matches = (entry) => entry.environmentId === environmentId && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch);
		const live = [...entries.values()].filter(matches);
		const retired = [...retiredEntries].filter(matches);
		const operations = [...live.map((entry) => stopEntry(entry, reason)), ...retired.map((entry) => stopEnvironmentOwner(entry, reason))];
		if (operations.length === 0) {
			const record = options.getEnvironment(environmentId);
			if (record?.nodeDeviceId && (ownerEpoch === void 0 || record.ownerEpoch === ownerEpoch)) {
				if (reason === "provider-destroying" || reason === "provider-destroyed") operations.push(options.workspaceTransfer.close(environmentId));
				else {
					if (record.attachedSessionIds.length > 1) throw new Error("node worker environment teardown has an ambiguous session owner");
					const sessionId = record.attachedSessionIds[0];
					if (sessionId) operations.push(stopEnvironmentOwner({
						deviceId: record.nodeDeviceId,
						environmentId,
						ownerEpoch: record.ownerEpoch,
						sessionId,
						executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn"
					}, reason));
				}
			}
		}
		await joinWorkerTunnelStops(operations);
	}
	return {
		async runSessionCommand(binding, command) {
			command.assertCurrent?.();
			const record = options.getEnvironment(binding.environmentId);
			if (!record || record.ownerEpoch !== binding.ownerEpoch || !record.nodeDeviceId || record.sharedHost !== false || !record.bootstrapReceipt || record.bootstrapReceipt.installKind !== "bundle") throw new Error("Attached environment node workspace is unavailable");
			await this.start({
				environmentId: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				sessionId: binding.sessionId,
				deviceId: record.nodeDeviceId,
				executionMode: "remote-exec",
				expectedBuild: record.bootstrapReceipt
			});
			command.assertCurrent?.();
			const entry = entries.get(binding.environmentId);
			if (!entry || entry.ownerEpoch !== binding.ownerEpoch || entry.sessionId !== binding.sessionId) throw new Error("Attached environment execution owner changed");
			return await runWorkspaceCommand(entry, {
				...command,
				sessionKey: binding.sessionKey
			});
		},
		bindWorkspaceBindingResolver(resolver) {
			resolveWorkspaceBinding = resolver;
		},
		async start(request) {
			const current = entries.get(request.environmentId);
			const retiring = [...retiredEntries].filter((entry) => entry.environmentId === request.environmentId);
			if (retiring.some((entry) => entry.ownerEpoch > request.ownerEpoch)) throw new Error("node worker tunnel owner epoch is stale");
			if (current) {
				if (request.ownerEpoch < current.ownerEpoch) throw new Error("node worker tunnel owner epoch is stale");
				if (request.ownerEpoch === current.ownerEpoch) {
					if (current.abortController.signal.aborted || current.executionMode !== request.executionMode || current.deviceId !== request.deviceId || current.sessionId !== request.sessionId || !sameWorkerBuild(current.expectedBuild, request.expectedBuild)) throw new Error("node worker tunnel owner binding changed within one epoch");
					return current.readiness.promise;
				}
			}
			const readiness = createDeferredCore();
			readiness.promise.catch(() => void 0);
			const entry = {
				...request,
				abortController: new AbortController(),
				launchTasks: /* @__PURE__ */ new Set(),
				workspaceTasks: /* @__PURE__ */ new Set(),
				readiness
			};
			entry.drainLocalWork = async () => {
				await entry.initialization?.catch(() => void 0);
				await Promise.allSettled(entry.launchTasks);
				await Promise.allSettled(entry.workspaceTasks);
			};
			entries.set(entry.environmentId, entry);
			entry.initialization = (async () => {
				if (current) await stopEntry(current);
				await Promise.all(retiring.map((owner) => stopEnvironmentOwner(owner)));
				if (!isLiveEntry(entry)) return;
				const restoredWorkspace = resolveWorkspaceBinding ? await raceNodeWorkerOperation(resolveWorkspaceBinding({
					environmentId: request.environmentId,
					ownerEpoch: request.ownerEpoch,
					sessionId: request.sessionId
				}), entry.abortController.signal) : void 0;
				if (!isLiveEntry(entry)) return;
				const created = createHandle(entry, restoredWorkspace);
				if (restoredWorkspace) await drainWorkspace(entry, () => isEnvironmentOwner(entry));
				await created.validateRestoredWorkspace();
				if (!isLiveEntry(entry)) return;
				entry.handle = created.handle;
				readiness.resolve(created.handle);
			})();
			entry.initialization.catch((error) => {
				readiness.reject(error);
				stopEntry(entry).catch((cleanupError) => {
					tunnelLog.warn("node worker tunnel cleanup failed after initialization error", {
						environmentId: entry.environmentId,
						ownerEpoch: entry.ownerEpoch,
						error: boundedWorkerError(cleanupError)
					});
				});
			});
			return await readiness.promise;
		},
		stop,
		async stopAll() {
			const environmentIds = /* @__PURE__ */ new Set([
				...entries.keys(),
				...[...retiredEntries].map((entry) => entry.environmentId),
				...options.listEnvironments().filter((record) => record.nodeDeviceId).map((record) => record.environmentId)
			]);
			const stopped = await Promise.allSettled([...environmentIds].map((environmentId) => stop(environmentId)));
			stopped.push(...await Promise.allSettled([options.workspaceTransfer.closeAll()]));
			const failure = stopped.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		},
		status(environmentId) {
			const entry = entries.get(environmentId);
			return entry && !entry.abortController.signal.aborted ? entry.handle ? "connected" : "connecting" : "stopped";
		}
	};
}
//#endregion
export { createNodeWorkerTunnelManager };
