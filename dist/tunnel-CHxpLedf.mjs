import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as runCommandWithTimeout, u as releaseChildProcessOutputAfterExit } from "./exec-DJvyCA0D.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { i as MAX_RECONCILIATION_TOTAL_BYTES, n as MAX_RECONCILIATION_FILE_BYTES, u as DERIVED_WORKSPACE_RSYNC_EXCLUDES } from "./workspace-manifest-q-txD9ZU.mjs";
import { t as MAX_WORKSPACE_HASH_MEMO_BYTES } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { r as manifestNodes, t as changedPaths } from "./workspace-manifest-comparison-BXiy_dh_.mjs";
import { S as serializeWorkspaceManifest, p as decodeWorkspaceManifest } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { a as assertWorkspaceMatchesManifest, n as AcceptedWorkspacePublicationIndeterminateError, r as parseAcceptedWorkspaceSettlement } from "./workspace-reconcile-DEtkg-5s.mjs";
import { a as workerSshOptions, i as workerSshCommandOptions, o as workerSshRemoteCommand, r as runWorkerSshCandidates, t as prepareWorkerSsh } from "./ssh-C8PSYwfX.mjs";
import { r as isWorkspaceInspectionCommand } from "./workspace-inspection-protocol-Bc0T2fvV.mjs";
import { m as workerWorkspaceTransferPaths } from "./workspace-result-staging-BH0OcWj7.mjs";
import { a as REMOTE_WORKSPACE_SETUP_SCRIPT, n as REMOTE_WORKSPACE_MANIFEST_JS, o as REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS, s as REMOTE_GIT_WORKSPACE_RETRY_RESET_JS, t as REMOTE_GIT_WORKSPACE_SETUP_SCRIPT } from "./workspace-sync-scripts-UY5ll8uc.mjs";
import { n as filterExistingGitTransferList, r as readWorkspaceStagedInputDirectories, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-6viatxYT.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-4x9Itm3z.mjs";
import { i as joinWorkerTunnelStops, r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { n as DesktopSessionStoppedError, r as createDesktopSessionRegistry, t as DesktopSessionStaleOwnerError } from "./session-registry-BokhNGNC.mjs";
import { _ as workerWorkspaceRsyncRemoteCommand, a as parseRemoteWorkspaceSetup, c as resolveRemoteWorkspaceManifest, d as stableWorkerPathComponent, f as validateWorkspaceSyncRequest, g as workerWorkspaceRsyncReceiverEntryPath, h as workerWorkspaceCommandSucceeded, i as parseManifestRef, l as resolveWorkerWorkspaceGitAuthor, m as workerAcceptedWorkspaceRsyncReceiverPath, n as captureRemoteWorkspaceManifest, o as probeWorkspaceGitMode, r as createWorkerWorkspaceRsyncReceiverPathFactory, s as readTransferredManifest, t as WORKER_WORKSPACE_RSYNC_DESTINATION, u as runBoundedInboundRsync, v as workerWorkspaceSshArgv, y as workspaceSyncError } from "./workspace-sync-helpers-CJW1gdNZ.mjs";
import { n as runInstrumentedWorkspaceReconcile } from "./workspace-finalize-C9y2aw_N.mjs";
import { n as prepareLocalWorkspaceReconciliation, t as createWorkerWorkspaceQuiescence } from "./workspace-quiescence-QxIX1rYS.mjs";
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
			const readiness = createDeferredCore();
			const exit = createDeferredCore();
			const ready = readiness.promise;
			const exited = exit.promise;
			ready.catch(() => {});
			let stdout = "";
			let stderr = "";
			const settleReadyError = () => {
				if (readySettled) return;
				readySettled = true;
				readiness.reject(workerSshProcessError(stderr));
			};
			const settleExited = (result) => {
				if (exitedSettled) return;
				exitedSettled = true;
				releaseOutput();
				const stderrTail = workerSshStderrTail(stderr);
				exit.resolve({
					...result,
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
					readiness.resolve();
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
			child.stdin.end(options.input);
			let stopPromise;
			return {
				ready,
				exited,
				stop() {
					return stopPromise ??= (async () => {
						if (closed) return;
						child.kill("SIGTERM");
						await settlesWithin(exited, STOP_GRACE_MS);
						if (!closed && !exitedSettled) {
							const killDelivered = child.kill("SIGKILL");
							if (!await settlesWithin(exited, STOP_KILL_WAIT_MS)) throw workerSshProcessError(killDelivered ? "SSH child did not exit after SIGKILL; it may still be running" : "SIGKILL delivery failed; SSH child may still be running");
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
function desktopSshCommand(prepared, argv) {
	return [
		"ssh",
		...workerSshOptions(prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(prepared.port),
		"--",
		prepared.sshTarget,
		workerSshRemoteCommand(argv)
	];
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
			const assertCurrent = () => {
				if (!isCurrent() || !sessions.isOwnerEpochCurrent(request.environmentId, request.ownerEpoch)) throw new Error("Worker desktop tunnel stopped before connecting");
			};
			assertCurrent();
			prepared = await prepareWorkerSsh({
				assertCurrent,
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "/tmp/openclaw-worker-desktop-"
			});
			assertCurrent();
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
			assertCurrent();
			let vncPassword;
			if (request.desktop.passwordFilePath) {
				const result = await deps.runner.run(desktopSshCommand(prepared, ["cat", request.desktop.passwordFilePath]), workerSshCommandOptions({ timeoutMs: PASSWORD_READ_TIMEOUT_MS }));
				assertCurrent();
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
		const assertCurrent = () => {
			abortController.signal.throwIfAborted();
			if (!sessions.isOwnerEpochCurrent(request.environmentId, request.ownerEpoch)) throw new Error("Worker desktop app launch owner was replaced");
		};
		const startedAtMs = Date.now();
		const { promise: startGate, resolve: startExecution } = createDeferredCore();
		const execution = (async () => {
			await startGate;
			assertCurrent();
			if (current) {
				current.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launch owner replaced"));
				await current.operation.catch(() => void 0);
			}
			if (ownerAdvanced) await joinWorkerTunnelStops([sessions.stopSuperseded(request.environmentId, request.ownerEpoch), stopReplacedAppLaunches(request.environmentId, request.ownerEpoch)]);
			assertCurrent();
			const prepared = await prepareWorkerSsh({
				assertCurrent,
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-desktop-app-"
			});
			try {
				assertCurrent();
				const remainingLaunchMs = Math.max(0, APP_LAUNCH_TIMEOUT_MS - (Date.now() - startedAtMs));
				const result = await deps.runner.run(desktopSshCommand(prepared, [request.app.executablePath, ...request.app.args ?? []]), workerSshCommandOptions({
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
	let expectedRemoteRef = params.initialRemoteRef;
	const publish = async (accepted) => {
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
		const transactionCommand = async (action, input) => await params.runWorkspaceCommand({
			transportRetry: "never",
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
				action,
				params.remoteWorkspaceDir,
				transactionNonce
			],
			...input === void 0 ? {} : { input }
		});
		const settleIndeterminatePublication = async (operation, publicationFailure) => {
			try {
				const settled = await transactionCommand("settle");
				if (!workerWorkspaceCommandSucceeded(settled)) throw workspaceSyncError(settled);
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
			const begun = await transactionCommand("begin", JSON.stringify([...changed]));
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
			if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
			if (transactionBegun) try {
				const rolledBack = await transactionCommand("rollback");
				if (!workerWorkspaceCommandSucceeded(rolledBack)) throw workspaceSyncError(rolledBack);
			} catch (rollbackFailure) {
				throw acceptedWorkspaceRollbackError(error, rollbackFailure);
			}
			throw error;
		}
	};
	return {
		expectedRemoteRef: () => expectedRemoteRef,
		publishAcceptedManifest: async (accepted) => {
			await publish(accepted);
			expectedRemoteRef = accepted.manifestRef;
		}
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
		return await racePromiseWithAbortSignal(operation, signal, (abortedSignal) => abortedSignal.reason instanceof Error ? abortedSignal.reason : new Error("Worker workspace command aborted", { cause: abortedSignal.reason }));
	};
	const runTask = (argv, opts) => track(options.runner.run(argv, opts));
	const runRsync = (prepared, argv, assertCurrent) => runWorkerSshCandidates(prepared, WORKSPACE_TIMEOUT_MS, (port, timeoutMs) => {
		assertCurrent?.();
		return runTask(argv(workerWorkspaceRsyncRemoteCommand(prepared, port)), workerSshCommandOptions({
			timeoutMs,
			signal: options.ownerSignal
		}));
	});
	const runBoundedInboundRsync$1 = (params) => runWorkerSshCandidates(params.prepared, WORKSPACE_TIMEOUT_MS, (port, timeoutMs) => runBoundedInboundRsync({
		...params,
		argv: params.argv(workerWorkspaceRsyncRemoteCommand(params.prepared, port)),
		ownerSignal: options.ownerSignal,
		runTask,
		timeoutMs
	}));
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
		request.authorize?.();
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
			input: REMOTE_WORKSPACE_SETUP_SCRIPT,
			assertCurrent: request.authorize
		});
		if (!workerWorkspaceCommandSucceeded(setup)) throw workspaceSyncError(setup);
		request.authorize?.();
		const { canonicalHome, remoteWorkspaceDir } = parseRemoteWorkspaceSetup(setup.stdout.trim(), remoteRelative);
		const { mode, gitRoot, baseCommit } = await probeWorkspaceGitMode({
			localPath: request.localPath,
			commandOptions: workerSshCommandOptions({
				timeoutMs: REMOTE_SETUP_TIMEOUT_MS,
				signal: options.ownerSignal
			}),
			runTask
		});
		request.authorize?.();
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
				], request.authorize);
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
					input: REMOTE_GIT_WORKSPACE_SETUP_SCRIPT,
					assertCurrent: request.authorize
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
					request.authorize?.();
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
				request.authorize?.();
				const result = await runTask(transferArgv(workerWorkspaceRsyncRemoteCommand(prepared, port), fileListPath), commandOptions());
				retryingGitTransfer = result.termination === "exit" && result.code === 255;
				return result;
			}) : await runRsync(prepared, (rsyncSsh) => transferArgv(rsyncSsh), request.authorize);
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
				],
				assertCurrent: request.authorize
			});
			if (!workerWorkspaceCommandSucceeded(manifest)) throw workspaceSyncError(manifest);
			request.authorize?.();
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
		const transferListPath = path.join(temporaryDirectory, "transfer-list");
		const downloadManifest = async (manifestRef) => {
			const digest = manifestRef.slice(7);
			const manifestPath = path.join(manifestRoot, `${digest}.json`);
			const transferred = await runBoundedInboundRsync$1({
				prepared,
				argv: (rsyncSsh) => [
					"rsync",
					"--archive",
					"--inplace",
					"--no-recursive",
					"--checksum",
					`--max-size=${MAX_WORKSPACE_MANIFEST_BYTES}`,
					`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
					"-e",
					rsyncSsh,
					"--",
					`${prepared.scpTarget}:.openclaw-worker/manifests/${digest}.json`,
					manifestPath
				],
				destinationRoot: manifestRoot,
				entryLimit: 1,
				totalByteLimit: MAX_WORKSPACE_MANIFEST_BYTES
			});
			if (!workerWorkspaceCommandSucceeded(transferred)) throw workspaceSyncError(transferred);
			const raw = await readTransferredManifest(manifestPath);
			const { manifest } = await decodeWorkspaceManifest(raw, manifestRef, options.ownerSignal);
			return {
				raw,
				manifest,
				path: manifestPath
			};
		};
		try {
			await fs.mkdir(stagingRoot, { mode: 448 });
			await fs.mkdir(manifestRoot, { mode: 448 });
			const downloadedBase = await downloadManifest(request.baseManifestRef);
			const { raw: baseRaw, manifest: base } = downloadedBase;
			await fs.rm(downloadedBase.path);
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
			if (changed) ({raw: currentRaw, manifest: current} = await downloadManifest(currentRef));
			const { expectedRemoteRef, publishAcceptedManifest } = createAcceptedWorkspacePublisher({
				runWorkspaceCommand,
				runRsync: (argv) => runRsync(prepared, argv),
				scpTarget: prepared.scpTarget,
				receiverEntryPath,
				localPath: request.localPath,
				remoteWorkspaceDir: request.remoteWorkspaceDir,
				remoteManifest: current,
				initialRemoteRef: currentRef,
				hashMemo,
				metrics
			});
			if (changed) {
				const transferPaths = workerWorkspaceTransferPaths(current, base, options.ownerSignal);
				const transferPathSet = new Set(transferPaths);
				if (transferPaths.length > 0) {
					await fs.writeFile(transferListPath, Buffer.from(`${transferPaths.join("\0")}\0`), { mode: 384 });
					const resultTransfer = await runBoundedInboundRsync$1({
						prepared,
						argv: (rsyncSsh) => [
							"rsync",
							"--archive",
							"--inplace",
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
			assertCurrent: request.source.assertCurrent,
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
				projectKey: request.source.projectKey,
				authorize: request.authorize
			}));
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/tunnel.ts
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
		const workspace = createWorkerWorkspaceActions({
			environmentId: entry.environmentId,
			sharedHost: entry.sharedHost,
			ownerSignal: entry.abortController.signal,
			waitForPrepared: async () => {
				if (isCurrent(entry) && entry.status === "connected" && entry.prepared) return entry.prepared;
				throw new WorkerTunnelOwnerDisconnectedError();
			},
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
		if (!request.environmentId.trim()) throw new Error("Worker tunnel environment id must be non-empty");
		if (!Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 0) throw new Error("Worker tunnel owner epoch must be a non-negative safe integer");
		request.authorize?.();
		const claimedEpoch = claimedOwnerEpochs.get(request.environmentId);
		if (claimedEpoch !== void 0 && request.ownerEpoch < claimedEpoch) throw new Error("Worker tunnel owner epoch is stale");
		claimedOwnerEpochs.set(request.environmentId, request.ownerEpoch);
		const current = entries.get(request.environmentId);
		if (current?.ownerEpoch === request.ownerEpoch) {
			const handle = await current.initialization;
			request.authorize?.();
			return handle;
		}
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
			const assertCurrent = () => {
				request.authorize?.();
				if (!isCurrent(entry)) throw new WorkerTunnelOwnerDisconnectedError();
			};
			assertCurrent();
			const prepared = await prepareWorkerSsh({
				assertCurrent,
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-workspace-"
			});
			entry.prepared = prepared;
			assertCurrent();
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
