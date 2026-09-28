import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as runCommandWithTimeout, u as releaseChildProcessOutputAfterExit } from "./exec-shcN2-sN.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { i as MAX_RECONCILIATION_TOTAL_BYTES, n as MAX_RECONCILIATION_FILE_BYTES, u as DERIVED_WORKSPACE_RSYNC_EXCLUDES } from "./workspace-manifest-453LPGpv.mjs";
import { t as MAX_WORKSPACE_HASH_MEMO_BYTES } from "./workspace-hash-memo-R41irJvf.mjs";
import { r as manifestNodes, t as changedPaths } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { S as serializeWorkspaceManifest, h as parseWorkspaceManifest } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { i as parseAcceptedWorkspaceSettlement, n as AcceptedWorkspacePublicationIndeterminateError, o as assertWorkspaceMatchesManifest, r as isAcceptedWorkspacePublicationIndeterminateError } from "./workspace-reconcile-BoiN2pej.mjs";
import { a as workerSshOptions, i as workerSshCommandOptions, o as workerSshRemoteCommand, r as runWorkerSshCandidates, t as prepareWorkerSsh } from "./ssh-D4TnVP7T.mjs";
import { r as isWorkspaceInspectionCommand } from "./workspace-inspection-protocol-gfcfg3Iv.mjs";
import { m as workerWorkspaceTransferPaths } from "./workspace-result-staging-Cy039j72.mjs";
import { a as REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS, i as REMOTE_WORKSPACE_SETUP_SCRIPT, n as REMOTE_WORKSPACE_MANIFEST_JS, o as REMOTE_GIT_WORKSPACE_RETRY_RESET_JS, t as REMOTE_GIT_WORKSPACE_SETUP_SCRIPT } from "./workspace-sync-scripts-Ci3bD3db.mjs";
import { n as filterExistingGitTransferList, r as readWorkspaceStagedInputDirectories, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-CqvrrDw_.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-DcOK2Mxs.mjs";
import { i as joinWorkerTunnelStops, r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { n as DesktopSessionStoppedError, r as createDesktopSessionRegistry, t as DesktopSessionStaleOwnerError } from "./session-registry-CuBlkFuF.mjs";
import { _ as workerWorkspaceRsyncRemoteCommand, a as parseRemoteWorkspaceSetup, c as resolveRemoteWorkspaceManifest, d as stableWorkerPathComponent, f as validateWorkspaceSyncRequest, g as workerWorkspaceRsyncReceiverEntryPath, h as workerWorkspaceCommandSucceeded, i as parseManifestRef, l as resolveWorkerWorkspaceGitAuthor, m as workerAcceptedWorkspaceRsyncReceiverPath, n as captureRemoteWorkspaceManifest, o as probeWorkspaceGitMode, r as createWorkerWorkspaceRsyncReceiverPathFactory, s as readTransferredManifest, t as WORKER_WORKSPACE_RSYNC_DESTINATION, u as runBoundedInboundRsync, v as workerWorkspaceSshArgv, y as workspaceSyncError } from "./workspace-sync-helpers-Bg34ooyi.mjs";
import { n as runInstrumentedWorkspaceReconcile } from "./workspace-finalize-DL6iiqwy.mjs";
import { n as prepareLocalWorkspaceReconciliation, t as createWorkerWorkspaceQuiescence } from "./workspace-quiescence-DVKmxptS.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
//#region src/gateway/worker-environments/tunnel-ssh-runner.ts
const WORKER_TUNNEL_READY_MARKER = "OPENCLAW_WORKER_TUNNEL_READY";
const STOP_GRACE_MS = 1500;
const STOP_KILL_WAIT_MS = 2e3;
function workerSshProcessError(stderr) {
	const detail = workerSshStderrTail(stderr);
	return /* @__PURE__ */ new Error(detail ? `Worker SSH tunnel failed: ${detail}` : "Worker SSH tunnel failed");
}
function workerSshStderrTail(stderr) {
	const redacted = redactSensitiveText(stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return redacted ? sliceUtf16Safe(redacted, -4096) : void 0;
}
/** Production runner that treats the post-forward marker as connection readiness. */
function createWorkerSshRunner() {
	return {
		run: runCommandWithTimeout,
		start(argv, options) {
			const [command, ...args] = argv;
			if (!command) throw new Error("Worker SSH runner requires a command");
			const child = spawn(command, args, {
				env: options.baseEnv,
				signal: options.signal,
				stdio: [
					"pipe",
					"pipe",
					"pipe"
				],
				windowsHide: true
			});
			const releaseOutput = releaseChildProcessOutputAfterExit(child);
			let closed = false;
			let exitedSettled = false;
			let readySettled = false;
			let childExited = false;
			let resolveReady;
			let rejectReady;
			let resolveExited;
			const ready = new Promise((resolve, reject) => {
				resolveReady = resolve;
				rejectReady = reject;
			});
			ready.catch(() => {});
			const exited = new Promise((resolve) => {
				resolveExited = resolve;
			});
			let stdout = "";
			let stderr = "";
			const settleReadyError = () => {
				if (readySettled) return;
				readySettled = true;
				rejectReady(workerSshProcessError(stderr));
			};
			const settleExited = (exit) => {
				if (exitedSettled) return;
				exitedSettled = true;
				releaseOutput();
				const stderrTail = workerSshStderrTail(stderr);
				resolveExited({
					...exit,
					...stderrTail ? { stderrTail } : {}
				});
			};
			child.stdout.setEncoding("utf8");
			child.stdout.on("error", () => {});
			child.stdout.on("data", (chunk) => {
				if (readySettled || childExited) return;
				stdout = sliceUtf16Safe(`${stdout}${chunk}`, -4096);
				if (stdout.split(/\r?\n/u).includes("OPENCLAW_WORKER_TUNNEL_READY")) {
					readySettled = true;
					resolveReady();
				}
			});
			child.stderr.setEncoding("utf8");
			child.stderr.on("error", () => {});
			child.stderr.on("data", (chunk) => {
				stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
			});
			child.once("error", () => {
				settleReadyError();
				if (child.pid === void 0) {
					closed = true;
					settleExited({
						code: null,
						signal: null
					});
				}
			});
			child.once("exit", () => {
				childExited = true;
				child.stdin.destroy();
			});
			child.once("close", (code, signal) => {
				closed = true;
				settleReadyError();
				settleExited({
					code,
					signal
				});
			});
			child.stdin.on("error", () => {});
			if (options.input !== void 0) child.stdin.end(options.input);
			else child.stdin.end();
			let stopPromise;
			return {
				ready,
				exited,
				stop() {
					return stopPromise ??= (async () => {
						if (closed) return;
						child.kill("SIGTERM");
						let timer;
						await Promise.race([exited, new Promise((resolve) => {
							timer = setTimeout(resolve, STOP_GRACE_MS);
							timer.unref?.();
						})]);
						clearTimeout(timer);
						if (!closed && !exitedSettled) {
							const killDelivered = child.kill("SIGKILL");
							let killTimer;
							let killWaitExpired = false;
							await Promise.race([exited, new Promise((resolve) => {
								killTimer = setTimeout(() => {
									killWaitExpired = true;
									resolve();
								}, STOP_KILL_WAIT_MS);
								killTimer.unref?.();
							})]);
							clearTimeout(killTimer);
							if (killWaitExpired) throw workerSshProcessError(killDelivered ? "SSH child did not exit after SIGKILL; it may still be running" : "SIGKILL delivery failed; SSH child may still be running");
						}
					})().catch((error) => {
						stopPromise = void 0;
						throw error;
					});
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/desktop-tunnel.ts
const PASSWORD_READ_TIMEOUT_MS = 2e4;
const APP_LAUNCH_TIMEOUT_MS = 3e4;
const log = createSubsystemLogger("gateway/desktop");
var WorkerDesktopUnsupportedError = class extends Error {
	constructor(operation = "desktop observe") {
		super(`${operation} is not supported on Windows gateway hosts`);
		this.code = "unsupported_platform";
		this.name = "WorkerDesktopUnsupportedError";
	}
};
function successful(result) {
	return result.termination === "exit" && result.code === 0;
}
/** Owns worker-specific desktop SSH acquisition and app launch processes. */
function createWorkerDesktopTunnels(deps) {
	const platform = deps.platform ?? process.platform;
	const sessions = deps.registry ?? createDesktopSessionRegistry({ lingerMs: deps.lingerMs });
	const appLaunches = /* @__PURE__ */ new Map();
	const stopAppLaunches = async (matches, reason) => {
		const matching = [...appLaunches.values()].filter(matches);
		for (const entry of matching) entry.abortController.abort(/* @__PURE__ */ new Error(`Worker desktop app launch owner ${reason}`));
		await Promise.allSettled(matching.map((entry) => entry.operation));
	};
	const stopReplacedAppLaunches = (environmentId, ownerEpoch) => stopAppLaunches((entry) => entry.environmentId === environmentId && entry.ownerEpoch < ownerEpoch, "replaced");
	const createSessionHooks = (request) => {
		let prepared;
		let child;
		let stopRequested = false;
		const start = async (isCurrent, stopOwner) => {
			if (!isCurrent()) throw new Error("Worker desktop tunnel stopped before connecting");
			prepared = await prepareWorkerSsh({
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "/tmp/openclaw-worker-desktop-"
			});
			if (!isCurrent()) throw new Error("Worker desktop tunnel stopped before connecting");
			const localSocketPath = path.join(path.dirname(prepared.knownHostsPath), "desktop.sock");
			child = deps.runner.start([
				"ssh",
				...workerSshOptions(prepared, { forwarding: "explicit" }),
				"-a",
				"-x",
				"-T",
				"-N",
				"-n",
				"-o",
				"PermitLocalCommand=yes",
				"-o",
				`LocalCommand=printf '${WORKER_TUNNEL_READY_MARKER}\\n'`,
				"-o",
				"ServerAliveInterval=15",
				"-o",
				"ServerAliveCountMax=3",
				"-o",
				"StreamLocalBindMask=0177",
				"-L",
				`${localSocketPath}:127.0.0.1:${request.desktop.port}`,
				"-p",
				String(prepared.port),
				"--",
				prepared.sshTarget
			], workerSshCommandOptions({ timeoutMs: Number.MAX_SAFE_INTEGER }));
			child.exited.then(({ code, signal }) => {
				try {
					log.info("desktop SSH tunnel exited", {
						code,
						signal,
						stopRequested
					});
				} catch {}
				stopOwner();
			});
			await child.ready;
			if (!isCurrent()) throw new Error("Worker desktop tunnel stopped before connecting");
			let vncPassword;
			if (request.desktop.passwordFilePath) {
				const result = await deps.runner.run([
					"ssh",
					...workerSshOptions(prepared, { forwarding: "disabled" }),
					"-a",
					"-x",
					"-T",
					"-p",
					String(prepared.port),
					"--",
					prepared.sshTarget,
					workerSshRemoteCommand(["cat", request.desktop.passwordFilePath])
				], workerSshCommandOptions({ timeoutMs: PASSWORD_READ_TIMEOUT_MS }));
				if (!isCurrent()) throw new Error("Worker desktop tunnel stopped before connecting");
				if (!successful(result)) throw workerSshProcessError(result.stderr);
				vncPassword = result.stdout.replace(/(?:\r?\n)+$/u, "");
				if (!vncPassword) throw new Error("Worker desktop password file is empty");
				registerSecretValueForRedaction(vncPassword);
			}
			return {
				attachment: {
					kind: "unix-socket",
					socketPath: localSocketPath
				},
				...vncPassword ? { vncPassword } : {}
			};
		};
		return {
			start,
			teardown: async () => {
				stopRequested = true;
				await child?.stop();
			},
			dispose: async () => {
				await prepared?.dispose();
			}
		};
	};
	async function acquire(request) {
		if (request.desktop.username) throw new Error("Managed desktop account authentication requires the worker node transport; reprovision with node enrollment");
		if (platform === "win32") throw new WorkerDesktopUnsupportedError();
		const hooks = createSessionHooks(request);
		try {
			sessions.claimOwnerEpoch(request.environmentId, request.ownerEpoch);
			const acquiring = sessions.acquire({
				sourceKey: request.environmentId,
				ownerEpoch: request.ownerEpoch,
				...hooks,
				start: async (isCurrent, stopOwner) => {
					await fencing;
					return await hooks.start(isCurrent, stopOwner);
				}
			});
			const fencing = stopReplacedAppLaunches(request.environmentId, request.ownerEpoch);
			await joinWorkerTunnelStops([acquiring.then(() => void 0), fencing]);
			return await acquiring;
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) throw new Error("Worker desktop owner epoch is stale", { cause: error });
			if (error instanceof DesktopSessionStoppedError) throw new Error("Worker desktop tunnel stopped before connecting", { cause: error });
			throw error;
		}
	}
	function launchApp(request) {
		if (platform === "win32") return Promise.reject(new WorkerDesktopUnsupportedError("desktop app launch"));
		let ownerAdvanced;
		try {
			ownerAdvanced = sessions.claimOwnerEpoch(request.environmentId, request.ownerEpoch);
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) return Promise.reject(new Error("Worker desktop owner epoch is stale", { cause: error }));
			return Promise.reject(error instanceof Error ? error : new Error("Worker desktop owner epoch is invalid", { cause: error }));
		}
		const key = `${request.environmentId}\0${request.app.id}`;
		const current = appLaunches.get(key);
		if (current?.ownerEpoch === request.ownerEpoch) return current.operation;
		const abortController = new AbortController();
		const startedAtMs = Date.now();
		let startExecution;
		const startGate = new Promise((resolve) => {
			startExecution = resolve;
		});
		const execution = (async () => {
			await startGate;
			abortController.signal.throwIfAborted();
			if (!sessions.isOwnerEpochCurrent(request.environmentId, request.ownerEpoch)) throw new Error("Worker desktop app launch owner was replaced");
			if (current) {
				current.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launch owner replaced"));
				await current.operation.catch(() => void 0);
			}
			if (ownerAdvanced) await joinWorkerTunnelStops([sessions.stopSuperseded(request.environmentId, request.ownerEpoch), stopReplacedAppLaunches(request.environmentId, request.ownerEpoch)]);
			abortController.signal.throwIfAborted();
			const prepared = await prepareWorkerSsh({
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-desktop-app-"
			});
			try {
				abortController.signal.throwIfAborted();
				const remainingLaunchMs = Math.max(0, APP_LAUNCH_TIMEOUT_MS - (Date.now() - startedAtMs));
				const result = await deps.runner.run([
					"ssh",
					...workerSshOptions(prepared, { forwarding: "disabled" }),
					"-a",
					"-x",
					"-T",
					"-p",
					String(prepared.port),
					"--",
					prepared.sshTarget,
					workerSshRemoteCommand([request.app.executablePath, ...request.app.args ?? []])
				], workerSshCommandOptions({
					timeoutMs: remainingLaunchMs,
					signal: abortController.signal
				}));
				if (!successful(result)) throw workerSshProcessError(result.stderr || result.stdout);
			} finally {
				await prepared.dispose();
			}
		})();
		const timeoutError = /* @__PURE__ */ new Error("Worker desktop app launcher timed out after 30 seconds");
		const operation = withTimeout(execution, APP_LAUNCH_TIMEOUT_MS, { createError: () => timeoutError }).catch((error) => {
			if (error === timeoutError) abortController.abort(timeoutError);
			throw error;
		});
		const completeEntry = {
			environmentId: request.environmentId,
			appId: request.app.id,
			ownerEpoch: request.ownerEpoch,
			abortController,
			operation
		};
		appLaunches.set(key, completeEntry);
		startExecution();
		operation.finally(() => {
			if (appLaunches.get(key) === completeEntry) appLaunches.delete(key);
		}).catch(() => void 0);
		return operation;
	}
	async function stop(environmentId, ownerEpoch) {
		await joinWorkerTunnelStops([sessions.stop(environmentId, ownerEpoch), stopAppLaunches((entry) => entry.environmentId === environmentId && (ownerEpoch === void 0 || entry.ownerEpoch === ownerEpoch), "stopped")]);
	}
	async function stopAll() {
		for (const entry of appLaunches.values()) entry.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launcher stopped"));
		await joinWorkerTunnelStops([sessions.stopAll(), ...[...appLaunches.values()].map((entry) => entry.operation.catch(() => void 0))]);
	}
	return {
		acquire,
		attachObserver: sessions.attachObserver,
		launchApp,
		stop,
		stopAll
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-accepted-sync.ts
function isIndeterminateWorkspaceCommandResult(result) {
	return result.termination !== "exit" || result.code === 255;
}
function acceptedWorkspaceRollbackError(error, rollbackFailure) {
	const rollbackError = new Error("Accepted workspace publication rollback failed", { cause: error });
	Object.defineProperty(rollbackError, "rollbackFailure", { value: rollbackFailure });
	return rollbackError;
}
async function recoverAcceptedWorkspacePublication(params) {
	const recovered = await params.runWorkspaceCommand({
		transportRetry: "never",
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
			"recover",
			params.remoteWorkspaceDir,
			randomBytes(16).toString("hex")
		]
	});
	if (!workerWorkspaceCommandSucceeded(recovered)) throw workspaceSyncError(recovered);
}
function createAcceptedWorkspacePublisher(params) {
	return async (accepted) => {
		const serialized = await serializeWorkspaceManifest(accepted.manifest);
		const acceptedRaw = serialized.raw;
		const acceptedDigest = serialized.manifestRef.slice(7);
		if (`sha256:${acceptedDigest}` !== accepted.manifestRef) throw new Error("Accepted workspace manifest does not match its reference");
		const published = await params.runWorkspaceCommand({
			transportRetry: "idempotent",
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_MANIFEST_JS,
				params.remoteWorkspaceDir,
				"",
				"publish",
				acceptedDigest
			],
			input: acceptedRaw
		});
		if (!workerWorkspaceCommandSucceeded(published)) throw workspaceSyncError(published);
		const verifyAcceptedWorkspace = async () => {
			const verifiedRef = await captureRemoteWorkspaceManifest({
				runWorkspaceCommand: params.runWorkspaceCommand,
				remoteWorkspaceDir: params.remoteWorkspaceDir,
				baseCommit: accepted.manifest.baseCommit,
				priorManifestDigests: accepted.manifest.baseCommit ? [acceptedDigest] : [],
				hashMemo: params.hashMemo,
				metrics: params.metrics
			});
			if (verifiedRef !== accepted.manifestRef) throw new Error(`Worker workspace does not match its accepted manifest: expected ${accepted.manifestRef}, got ${verifiedRef}`);
		};
		const changed = changedPaths(params.remoteManifest, accepted.manifest);
		if (changed.size === 0) {
			await verifyAcceptedWorkspace();
			return;
		}
		const transactionNonce = randomBytes(16).toString("hex");
		const transactionCommand = async (action) => await params.runWorkspaceCommand({
			transportRetry: "never",
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
				action,
				params.remoteWorkspaceDir,
				transactionNonce
			]
		});
		const settleIndeterminatePublication = async (operation, publicationFailure) => {
			let settled;
			try {
				settled = await transactionCommand("settle");
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, observationFailure);
			}
			if (!workerWorkspaceCommandSucceeded(settled)) throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, workspaceSyncError(settled));
			try {
				return parseAcceptedWorkspaceSettlement(settled.stdout);
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, observationFailure);
			}
		};
		const finishIndeterminateCommit = async (commitFailure) => {
			const outcome = await settleIndeterminatePublication("commit", commitFailure);
			if (outcome === "committed") return;
			if (outcome !== "applied") throw commitFailure;
			let retried;
			try {
				retried = await transactionCommand("commit");
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError("commit", commitFailure, observationFailure);
			}
			if (!workerWorkspaceCommandSucceeded(retried)) {
				const retryFailure = workspaceSyncError(retried);
				if (!isIndeterminateWorkspaceCommandResult(retried)) throw retryFailure;
				throw new AcceptedWorkspacePublicationIndeterminateError("commit", commitFailure, retryFailure);
			}
		};
		let transactionBegun = false;
		try {
			const begun = await params.runWorkspaceCommand({
				transportRetry: "never",
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
					"begin",
					params.remoteWorkspaceDir,
					transactionNonce
				],
				input: JSON.stringify([...changed])
			});
			if (!workerWorkspaceCommandSucceeded(begun)) throw workspaceSyncError(begun);
			transactionBegun = true;
			const remoteStagingRoot = begun.stdout.trim();
			if (!path.posix.isAbsolute(remoteStagingRoot) || remoteStagingRoot.includes("\n")) throw new Error("Worker returned an invalid accepted workspace staging path");
			const acceptedNodes = manifestNodes(accepted.manifest);
			const transferPaths = [...changed].filter((entryPath) => acceptedNodes.has(entryPath));
			if (transferPaths.length > 0) {
				const temporaryDirectory = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-worker-workspace-accepted-"));
				const transferListPath = path.join(temporaryDirectory, "transfer-list");
				try {
					await fs.writeFile(transferListPath, Buffer.from(`${transferPaths.toSorted().join("\0")}\0`), { mode: 384 });
					const localSource = params.localPath.endsWith(path.sep) ? params.localPath : `${params.localPath}${path.sep}`;
					const transferred = await params.runRsync((rsyncSsh) => [
						"rsync",
						"--archive",
						"--checksum",
						"--no-recursive",
						"--from0",
						`--files-from=${transferListPath}`,
						`--rsync-path=${workerAcceptedWorkspaceRsyncReceiverPath({
							receiverEntryPath: params.receiverEntryPath,
							remoteWorkspaceDir: params.remoteWorkspaceDir,
							nonce: transactionNonce
						})}`,
						"-e",
						rsyncSsh,
						"--",
						localSource,
						`${params.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
					]);
					if (!workerWorkspaceCommandSucceeded(transferred)) throw workspaceSyncError(transferred);
				} finally {
					await fs.rm(temporaryDirectory, {
						recursive: true,
						force: true
					});
				}
			}
			let applied;
			try {
				applied = await transactionCommand("apply");
			} catch (applyFailure) {
				const outcome = await settleIndeterminatePublication("apply", applyFailure);
				if (outcome !== "applied" && outcome !== "committed") throw applyFailure;
			}
			if (applied && !workerWorkspaceCommandSucceeded(applied)) {
				const applyFailure = workspaceSyncError(applied);
				if (!isIndeterminateWorkspaceCommandResult(applied)) throw applyFailure;
				const outcome = await settleIndeterminatePublication("apply", applyFailure);
				if (outcome !== "applied" && outcome !== "committed") throw applyFailure;
			}
			await verifyAcceptedWorkspace();
			let committed;
			try {
				committed = await transactionCommand("commit");
			} catch (commitFailure) {
				await finishIndeterminateCommit(commitFailure);
				return;
			}
			if (!workerWorkspaceCommandSucceeded(committed)) {
				const commitFailure = workspaceSyncError(committed);
				if (isIndeterminateWorkspaceCommandResult(committed)) {
					await finishIndeterminateCommit(commitFailure);
					return;
				}
				throw commitFailure;
			}
		} catch (error) {
			if (isAcceptedWorkspacePublicationIndeterminateError(error)) throw error;
			if (transactionBegun) try {
				const rolledBack = await transactionCommand("rollback");
				if (!workerWorkspaceCommandSucceeded(rolledBack)) throw workspaceSyncError(rolledBack);
			} catch (rollbackFailure) {
				throw acceptedWorkspaceRollbackError(error, rollbackFailure);
			}
			throw error;
		}
	};
}
function createAcceptedWorkspacePublisherFactory(params) {
	return (remoteManifest, initialRemoteRef) => {
		let expectedRemoteRef = initialRemoteRef;
		const publish = createAcceptedWorkspacePublisher({
			...params,
			remoteManifest
		});
		return {
			expectedRemoteRef: () => expectedRemoteRef,
			publishAcceptedManifest: async (accepted) => {
				await publish(accepted);
				expectedRemoteRef = accepted.manifestRef;
			}
		};
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync-transport.ts
/** Runs fresh workspace transfers through the lifecycle's advertised SSH candidates. */
function createWorkerWorkspaceRsyncTransport(options) {
	const runRsync = async (prepared, argv) => await runWorkerSshCandidates(prepared, options.timeoutMs, async (port, remainingTimeoutMs) => await options.runTask(argv(workerWorkspaceRsyncRemoteCommand(prepared, port)), workerSshCommandOptions({
		timeoutMs: remainingTimeoutMs,
		signal: options.ownerSignal
	})));
	const runBoundedInboundRsync$1 = async (params) => await runWorkerSshCandidates(params.prepared, options.timeoutMs, async (port, remainingTimeoutMs) => await runBoundedInboundRsync({
		argv: params.argv(workerWorkspaceRsyncRemoteCommand(params.prepared, port)),
		destinationRoot: params.destinationRoot,
		entryLimit: params.entryLimit,
		totalByteLimit: params.totalByteLimit,
		ownerSignal: options.ownerSignal,
		runTask: options.runTask,
		timeoutMs: remainingTimeoutMs
	}));
	return {
		runBoundedInboundRsync: runBoundedInboundRsync$1,
		runRsync
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync.ts
const REMOTE_SETUP_TIMEOUT_MS = 2e4;
const WORKSPACE_TIMEOUT_MS = 6e5;
const REMOTE_WORKSPACE_ROOT = ".openclaw-worker/workspaces";
const REMOTE_GIT_PACK_NAME = ".openclaw-base.pack";
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
const INBOUND_RSYNC_BW_LIMIT_KIB = 65536;
/** Binds workspace commands and synchronization to one connected tunnel owner. */
function createWorkerWorkspaceActions(options) {
	const track = (task) => {
		options.tasks.add(task);
		task.then(() => options.tasks.delete(task), () => options.tasks.delete(task));
		return task;
	};
	const waitForPrepared = async (timeoutMs, message, signal) => {
		signal?.throwIfAborted();
		const operation = withTimeout(options.waitForPrepared(), timeoutMs, { message });
		if (!signal) return await operation;
		return await new Promise((resolve, reject) => {
			const onAbort = () => {
				try {
					signal.throwIfAborted();
				} catch (error) {
					reject(error instanceof Error ? error : new Error("Worker workspace command aborted", { cause: error }));
				}
			};
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
			operation.then(resolve, reject).finally(() => {
				signal.removeEventListener("abort", onAbort);
			});
		});
	};
	const runTask = (argv, opts) => track(options.runner.run(argv, opts));
	const { runBoundedInboundRsync, runRsync } = createWorkerWorkspaceRsyncTransport({
		ownerSignal: options.ownerSignal,
		runTask,
		timeoutMs: WORKSPACE_TIMEOUT_MS
	});
	const receiverEntryPath = workerWorkspaceRsyncReceiverEntryPath(options.bundleHash);
	const runWorkspaceCommand = async (command) => {
		if (isWorkspaceInspectionCommand(command.argv)) throw new Error("Repository workspace inspection requires a managed node runtime");
		const timeoutMs = command.timeoutMs ?? WORKSPACE_TIMEOUT_MS;
		const deadlineMs = Date.now() + timeoutMs;
		const signal = command.signal ? AbortSignal.any([options.ownerSignal, command.signal]) : options.ownerSignal;
		const prepared = await waitForPrepared(timeoutMs, "Worker tunnel did not reconnect within the workspace command timeout", command.signal);
		signal.throwIfAborted();
		command.assertCurrent?.();
		const remainingCommandTimeoutMs = () => Math.max(0, deadlineMs - Date.now());
		const commandOptions = (remainingTimeoutMs) => {
			const base = workerSshCommandOptions({
				input: command.input,
				timeoutMs: remainingTimeoutMs,
				signal
			});
			return command.argv.at(-1) === "memo-v1" ? {
				...base,
				maxOutputBytes: MAX_WORKSPACE_HASH_MEMO_BYTES
			} : base;
		};
		if (command.transportRetry === "never") {
			const operation = runTask(workerWorkspaceSshArgv(prepared, command.argv), commandOptions(remainingCommandTimeoutMs()));
			command.onDispatchReady?.();
			return await operation;
		}
		return await runWorkerSshCandidates(prepared, remainingCommandTimeoutMs(), async (port, remainingTimeoutMs) => {
			command.assertCurrent?.();
			return await runTask(workerWorkspaceSshArgv(prepared, command.argv, port), commandOptions(remainingTimeoutMs));
		});
	};
	const placementHashMemo = /* @__PURE__ */ new Map();
	const quiesceWorkspace = createWorkerWorkspaceQuiescence({
		ownerSignal: options.ownerSignal,
		sharedHost: options.sharedHost === true,
		runWorkspaceCommand
	});
	const syncWorkspaceImpl = async (request) => {
		validateWorkspaceSyncRequest(request);
		const prepared = await waitForPrepared(WORKSPACE_TIMEOUT_MS, "Worker tunnel did not reconnect within the workspace synchronization timeout");
		const remoteRelative = [
			REMOTE_WORKSPACE_ROOT,
			stableWorkerPathComponent(options.environmentId, 16),
			stableWorkerPathComponent(request.sessionId, 32),
			String(request.generation)
		].join("/");
		const setup = await runWorkspaceCommand({
			transportRetry: "never",
			argv: [
				"sh",
				"-s",
				"--",
				remoteRelative
			],
			input: REMOTE_WORKSPACE_SETUP_SCRIPT
		});
		if (!workerWorkspaceCommandSucceeded(setup)) throw workspaceSyncError(setup);
		const { canonicalHome, remoteWorkspaceDir } = parseRemoteWorkspaceSetup(setup.stdout.trim(), remoteRelative);
		const { mode, gitRoot, baseCommit } = await probeWorkspaceGitMode({
			localPath: request.localPath,
			commandOptions: workerSshCommandOptions({
				timeoutMs: REMOTE_SETUP_TIMEOUT_MS,
				signal: options.ownerSignal
			}),
			runTask
		});
		const temporaryDirectory = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-worker-workspace-sync-"));
		try {
			const mutationReceiverPath = createWorkerWorkspaceRsyncReceiverPathFactory({
				receiverEntryPath,
				remoteWorkspaceDir,
				canonicalHome,
				remoteRelative
			});
			let gitTransferListPath;
			if (mode === "git") {
				const [canonicalRequestPath, canonicalGitRoot] = await Promise.all([fs.realpath(request.localPath), fs.realpath(gitRoot)]);
				if (canonicalRequestPath !== canonicalGitRoot) throw new Error("Worker git workspace sync requires the managed worktree root");
				if (!GIT_COMMIT_PATTERN.test(baseCommit)) throw new Error("Worker workspace git base is not a commit id");
				gitTransferListPath = await createWorkspaceGitTransferList({
					gitRoot,
					temporaryDirectory: path.join(temporaryDirectory, "transfer"),
					signal: options.ownerSignal,
					timeoutMs: WORKSPACE_TIMEOUT_MS
				});
				const packPath = await prepareWorkerWorkspaceGitPack({
					root: gitRoot,
					baseCommit,
					temporaryRoot: temporaryDirectory,
					signal: options.ownerSignal
				});
				const packTransfer = await runRsync(prepared, (rsyncSsh) => [
					"rsync",
					"--archive",
					"--checksum",
					`--rsync-path=${mutationReceiverPath("git-pack")}`,
					"-e",
					rsyncSsh,
					"--",
					packPath,
					`${prepared.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
				]);
				if (!workerWorkspaceCommandSucceeded(packTransfer)) throw workspaceSyncError(packTransfer);
				const author = await resolveWorkerWorkspaceGitAuthor(request, async (argv) => runTask(argv, workerSshCommandOptions({
					timeoutMs: REMOTE_SETUP_TIMEOUT_MS,
					signal: options.ownerSignal
				})));
				const seeded = await runWorkspaceCommand({
					transportRetry: "never",
					argv: [
						"sh",
						"-s",
						"--",
						remoteWorkspaceDir,
						path.posix.join(remoteWorkspaceDir, REMOTE_GIT_PACK_NAME),
						baseCommit,
						author.name,
						author.email
					],
					input: REMOTE_GIT_WORKSPACE_SETUP_SCRIPT
				});
				if (!workerWorkspaceCommandSucceeded(seeded)) throw workspaceSyncError(seeded);
			}
			const stagedInputDirectories = await readWorkspaceStagedInputDirectories(gitRoot);
			const inputIncludes = path.join(temporaryDirectory, "input-includes");
			await fs.writeFile(inputIncludes, stagedInputDirectories.map((directory) => `/${directory}/***\0`).join(""), { mode: 384 });
			const localSource = gitRoot.endsWith(path.sep) ? gitRoot : `${gitRoot}${path.sep}`;
			const transferArgv = (rsyncSsh, fileListPath) => [
				"rsync",
				"--archive",
				"--checksum",
				"--delete-delay",
				"--exclude=.git",
				"--from0",
				`--include-from=${inputIncludes}`,
				...DERIVED_WORKSPACE_RSYNC_EXCLUDES.map((pattern) => `--exclude=${pattern}`),
				...fileListPath ? ["--recursive", `--files-from=${fileListPath}`] : [],
				`--rsync-path=${mutationReceiverPath("workspace-root")}`,
				"-e",
				rsyncSsh,
				"--",
				localSource,
				`${prepared.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
			];
			let retryingGitTransfer = false;
			let transferAttempt = 0;
			const preparedGitTransferListPath = gitTransferListPath;
			const transfer = preparedGitTransferListPath ? await runWorkerSshCandidates(prepared, WORKSPACE_TIMEOUT_MS, async (port, remainingTimeoutMs) => {
				const deadlineMs = Date.now() + remainingTimeoutMs;
				const commandOptions = () => workerSshCommandOptions({
					timeoutMs: Math.max(0, deadlineMs - Date.now()),
					signal: options.ownerSignal
				});
				if (retryingGitTransfer) {
					const resetNonce = randomBytes(16).toString("hex");
					const reset = await runTask(workerWorkspaceSshArgv(prepared, [
						"node",
						"-e",
						REMOTE_GIT_WORKSPACE_RETRY_RESET_JS,
						remoteWorkspaceDir,
						canonicalHome,
						remoteRelative,
						resetNonce
					], port), commandOptions());
					if (!workerWorkspaceCommandSucceeded(reset)) throw workspaceSyncError(reset);
					if (reset.stdout !== `reset ${resetNonce}\n`) throw new Error("Worker workspace retry reset returned an invalid acknowledgement");
				}
				const fileListPath = await filterExistingGitTransferList({
					gitRoot,
					preparedListPath: preparedGitTransferListPath,
					signal: options.ownerSignal,
					outputPath: path.join(path.dirname(preparedGitTransferListPath), `attempt-${transferAttempt++}`)
				});
				const result = await runTask(transferArgv(workerWorkspaceRsyncRemoteCommand(prepared, port), fileListPath), commandOptions());
				retryingGitTransfer = result.termination === "exit" && result.code === 255;
				return result;
			}) : await runRsync(prepared, (rsyncSsh) => transferArgv(rsyncSsh));
			if (!workerWorkspaceCommandSucceeded(transfer)) throw workspaceSyncError(transfer);
			const manifest = await runWorkspaceCommand({
				transportRetry: "idempotent",
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_MANIFEST_JS,
					remoteWorkspaceDir,
					baseCommit,
					...mode === "git" ? ["eligible"] : []
				]
			});
			if (!workerWorkspaceCommandSucceeded(manifest)) throw workspaceSyncError(manifest);
			return {
				mode,
				remoteWorkspaceDir,
				manifestRef: parseManifestRef(manifest.stdout.trim())
			};
		} finally {
			await fs.rm(temporaryDirectory, {
				recursive: true,
				force: true
			});
		}
	};
	const reconcileWorkspaceRun = async (request, metrics) => {
		if (!path.isAbsolute(request.localPath) || !path.posix.isAbsolute(request.remoteWorkspaceDir)) throw new Error("Worker workspace reconcile paths must be absolute");
		const hashMemo = placementHashMemo;
		const acceptLocal = await prepareLocalWorkspaceReconciliation({
			request,
			hashMemo,
			metrics
		});
		const baseDigest = await resolveRemoteWorkspaceManifest(runWorkspaceCommand, request.remoteWorkspaceDir, request.baseManifestRef);
		const prepared = await waitForPrepared(WORKSPACE_TIMEOUT_MS, "Worker tunnel did not reconnect within the workspace reconciliation timeout");
		const temporaryDirectory = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-worker-workspace-reconcile-"));
		const stagingRoot = path.join(temporaryDirectory, "staging");
		const manifestRoot = path.join(temporaryDirectory, "manifests");
		const baseManifestPath = path.join(manifestRoot, `${baseDigest}.json`);
		const transferListPath = path.join(temporaryDirectory, "transfer-list");
		const acceptedWorkspacePublisher = createAcceptedWorkspacePublisherFactory({
			runWorkspaceCommand,
			runRsync: async (argv) => await runRsync(prepared, argv),
			scpTarget: prepared.scpTarget,
			receiverEntryPath,
			localPath: request.localPath,
			remoteWorkspaceDir: request.remoteWorkspaceDir,
			hashMemo,
			metrics
		});
		try {
			await fs.mkdir(stagingRoot, { mode: 448 });
			await fs.mkdir(manifestRoot, { mode: 448 });
			const baseManifestTransfer = await runBoundedInboundRsync({
				prepared,
				argv: (rsyncSsh) => [
					"rsync",
					"--archive",
					"--no-recursive",
					"--checksum",
					`--max-size=${MAX_WORKSPACE_MANIFEST_BYTES}`,
					`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
					"-e",
					rsyncSsh,
					"--",
					`${prepared.scpTarget}:.openclaw-worker/manifests/${baseDigest}.json`,
					baseManifestPath
				],
				destinationRoot: manifestRoot,
				entryLimit: 1,
				totalByteLimit: MAX_WORKSPACE_MANIFEST_BYTES
			});
			if (!workerWorkspaceCommandSucceeded(baseManifestTransfer)) throw workspaceSyncError(baseManifestTransfer);
			const baseRaw = await readTransferredManifest(baseManifestPath);
			const base = await parseWorkspaceManifest(baseRaw, request.baseManifestRef, options.ownerSignal);
			await fs.rm(baseManifestPath);
			await recoverAcceptedWorkspacePublication({
				runWorkspaceCommand,
				remoteWorkspaceDir: request.remoteWorkspaceDir
			});
			const verifyStable = async (expectedRef) => {
				const expectedDigest = expectedRef.slice(7);
				if (await captureRemoteWorkspaceManifest({
					runWorkspaceCommand,
					remoteWorkspaceDir: request.remoteWorkspaceDir,
					baseCommit: base.baseCommit,
					priorManifestDigests: base.baseCommit ? [expectedDigest, baseDigest] : [],
					hashMemo,
					metrics
				}) !== expectedRef) throw new Error("Cloud workspace changed during final reconciliation");
			};
			const currentRef = await captureRemoteWorkspaceManifest({
				runWorkspaceCommand,
				remoteWorkspaceDir: request.remoteWorkspaceDir,
				baseCommit: base.baseCommit,
				priorManifestDigests: base.baseCommit ? [baseDigest] : [],
				hashMemo,
				metrics
			});
			const changed = currentRef !== request.baseManifestRef;
			let current = base;
			let currentRaw = baseRaw;
			if (changed) {
				const currentDigest = currentRef.slice(7);
				const currentManifestPath = path.join(manifestRoot, `${currentDigest}.json`);
				const currentManifestTransfer = await runBoundedInboundRsync({
					prepared,
					argv: (rsyncSsh) => [
						"rsync",
						"--archive",
						"--no-recursive",
						"--checksum",
						`--max-size=${MAX_WORKSPACE_MANIFEST_BYTES}`,
						`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
						"-e",
						rsyncSsh,
						"--",
						`${prepared.scpTarget}:.openclaw-worker/manifests/${currentDigest}.json`,
						currentManifestPath
					],
					destinationRoot: manifestRoot,
					entryLimit: 1,
					totalByteLimit: MAX_WORKSPACE_MANIFEST_BYTES
				});
				if (!workerWorkspaceCommandSucceeded(currentManifestTransfer)) throw workspaceSyncError(currentManifestTransfer);
				currentRaw = await readTransferredManifest(currentManifestPath);
				current = await parseWorkspaceManifest(currentRaw, currentRef, options.ownerSignal);
			}
			const { expectedRemoteRef, publishAcceptedManifest } = acceptedWorkspacePublisher(current, currentRef);
			if (changed) {
				const transferPaths = workerWorkspaceTransferPaths(current, base, options.ownerSignal);
				const transferPathSet = new Set(transferPaths);
				if (transferPaths.length > 0) {
					await fs.writeFile(transferListPath, Buffer.from(`${transferPaths.join("\0")}\0`), { mode: 384 });
					const resultTransfer = await runBoundedInboundRsync({
						prepared,
						argv: (rsyncSsh) => [
							"rsync",
							"--archive",
							"--checksum",
							`--max-size=${MAX_RECONCILIATION_FILE_BYTES}`,
							`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
							"--from0",
							`--files-from=${transferListPath}`,
							"-e",
							rsyncSsh,
							"--",
							`${prepared.scpTarget}:${request.remoteWorkspaceDir}/`,
							`${stagingRoot}/`
						],
						destinationRoot: stagingRoot,
						entryLimit: MAX_WORKSPACE_INVENTORY_ENTRIES,
						totalByteLimit: MAX_RECONCILIATION_TOTAL_BYTES
					});
					if (!workerWorkspaceCommandSucceeded(resultTransfer)) throw workspaceSyncError(resultTransfer);
				}
				await assertWorkspaceMatchesManifest({
					root: stagingRoot,
					manifest: current,
					entries: current.entries.filter((entry) => transferPathSet.has(entry.path))
				});
			}
			return await acceptLocal({
				stagingRoot,
				base,
				current,
				baseRaw,
				currentRaw,
				currentManifestRef: currentRef,
				publishAcceptedManifest,
				manifestRef: expectedRemoteRef,
				verifyStable: async () => await verifyStable(expectedRemoteRef())
			});
		} finally {
			await fs.rm(temporaryDirectory, {
				recursive: true,
				force: true
			}).catch(() => void 0);
		}
	};
	const reconcileWorkspaceImpl = async (request) => {
		if (request.source.kind === "repository") throw new Error("Repository sessions require a managed node or cloud provider; SSH-only workers cannot preserve repository checkpoints.");
		const localRequest = {
			remoteWorkspaceDir: request.remoteWorkspaceDir,
			baseManifestRef: request.baseManifestRef,
			localPath: request.source.path,
			journal: request.source.journal,
			stagedResult: request.source.stagedResult
		};
		return await runInstrumentedWorkspaceReconcile((metrics) => reconcileWorkspaceRun(localRequest, metrics));
	};
	return {
		quiesceWorkspace,
		reconcileWorkspace: (request) => track(reconcileWorkspaceImpl(request)),
		runWorkspaceCommand,
		syncWorkspace: (request) => {
			if (request.source.kind === "repository") return Promise.reject(/* @__PURE__ */ new Error("Repository sessions require a managed node or cloud provider; SSH-only workers cannot clone repository sessions."));
			return track(syncWorkspaceImpl({
				sessionId: request.sessionId,
				generation: request.generation,
				gitAuthor: request.gitAuthor,
				localPath: request.source.path,
				projectKey: request.source.projectKey
			}));
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/tunnel.ts
function validateStartRequest(request) {
	if (!request.environmentId.trim()) throw new Error("Worker tunnel environment id must be non-empty");
	if (!Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 0) throw new Error("Worker tunnel owner epoch must be a non-negative safe integer");
}
/** Owns SSH workspace state for remote-exec environments and fences replacement epochs. */
function createWorkerTunnelManager(options = {}) {
	const runner = options.runner ?? createWorkerSshRunner();
	const desktop = createWorkerDesktopTunnels({
		runner,
		...options.desktopSessionRegistry ? { registry: options.desktopSessionRegistry } : {}
	});
	const entries = /* @__PURE__ */ new Map();
	const owners = /* @__PURE__ */ new Set();
	const claimedOwnerEpochs = /* @__PURE__ */ new Map();
	const isCurrent = (entry) => entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
	const createHandle = (entry) => {
		const waitForPrepared = async () => {
			if (isCurrent(entry) && entry.status === "connected" && entry.prepared) return entry.prepared;
			throw new WorkerTunnelOwnerDisconnectedError();
		};
		const workspace = createWorkerWorkspaceActions({
			environmentId: entry.environmentId,
			sharedHost: entry.sharedHost,
			ownerSignal: entry.abortController.signal,
			waitForPrepared,
			runner,
			tasks: entry.workspaceTasks,
			bundleHash: entry.bundleHash
		});
		return {
			environmentId: entry.environmentId,
			ownerEpoch: entry.ownerEpoch,
			...workspace,
			stop: () => stop(entry.environmentId, entry.ownerEpoch)
		};
	};
	const stopEntry = (entry) => {
		if (entry.stopPromise) return entry.stopPromise;
		const stopped = createDeferredCore();
		entry.stopPromise = stopped.promise;
		if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
		entry.abortController.abort(/* @__PURE__ */ new Error("Worker tunnel owner stopped"));
		(async () => {
			await entry.initialization.catch(() => void 0);
			await Promise.allSettled(entry.workspaceTasks);
			await entry.prepared?.dispose().catch(() => void 0);
		})().finally(() => owners.delete(entry)).then(stopped.resolve, stopped.reject);
		return entry.stopPromise;
	};
	async function start(request) {
		validateStartRequest(request);
		const claimedEpoch = claimedOwnerEpochs.get(request.environmentId);
		if (claimedEpoch !== void 0 && request.ownerEpoch < claimedEpoch) throw new Error("Worker tunnel owner epoch is stale");
		claimedOwnerEpochs.set(request.environmentId, request.ownerEpoch);
		const current = entries.get(request.environmentId);
		if (current?.ownerEpoch === request.ownerEpoch) return await current.initialization;
		const previous = [...owners].filter((owner) => owner.environmentId === request.environmentId);
		const initializing = createDeferredCore();
		const entry = {
			environmentId: request.environmentId,
			bundleHash: request.bundleHash,
			ownerEpoch: request.ownerEpoch,
			sharedHost: request.sharedHost === true,
			abortController: new AbortController(),
			status: "connecting",
			workspaceTasks: /* @__PURE__ */ new Set(),
			initialization: initializing.promise
		};
		owners.add(entry);
		entries.set(request.environmentId, entry);
		(async () => {
			await Promise.all(previous.map(stopEntry));
			if (!isCurrent(entry)) throw new WorkerTunnelOwnerDisconnectedError();
			const prepared = await prepareWorkerSsh({
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-workspace-"
			});
			if (!isCurrent(entry)) {
				await prepared.dispose();
				throw new WorkerTunnelOwnerDisconnectedError();
			}
			entry.prepared = prepared;
			entry.status = "connected";
			return createHandle(entry);
		})().then(initializing.resolve, initializing.reject);
		try {
			return await entry.initialization;
		} catch (error) {
			await stopEntry(entry);
			throw error;
		}
	}
	async function stop(environmentId, ownerEpoch) {
		await Promise.all([...owners].filter((entry) => entry.environmentId === environmentId && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch)).map(stopEntry));
		await desktop.stop(environmentId, ownerEpoch);
	}
	async function stopAll() {
		await joinWorkerTunnelStops([...[...owners].map(stopEntry), desktop.stopAll()]);
	}
	return {
		desktop,
		start,
		stop,
		stopAll,
		status(environmentId) {
			return entries.get(environmentId)?.status ?? "stopped";
		}
	};
}
//#endregion
export { createWorkerTunnelManager };
