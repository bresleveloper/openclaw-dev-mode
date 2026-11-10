import { spawn } from "node:child_process";
import { closeSync, createWriteStream, existsSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
import "@openclaw/fs-safe/advanced";
import "@openclaw/proc-safe/errors";
import "@openclaw/proc-safe/identity";
import "@openclaw/proc-safe/inspect";
//#region node-runtime-env.mjs
function parseNodeOptionsEnvVar(value) {
	const tokens = [];
	let token = "";
	let inQuotes = false;
	const nodeOptions = value ?? "";
	for (let index = 0; index < nodeOptions.length; index += 1) {
		let char = nodeOptions.charAt(index);
		if (char === "\\" && inQuotes) {
			index += 1;
			if (index >= nodeOptions.length) return null;
			char = nodeOptions.charAt(index);
		} else if (char === " " && !inQuotes) {
			if (token.length > 0) {
				tokens.push(token);
				token = "";
			}
			continue;
		} else if (char === "\"") {
			inQuotes = !inQuotes;
			continue;
		}
		token += char;
	}
	if (inQuotes) return null;
	if (token.length > 0) tokens.push(token);
	return tokens;
}
function isNodeStartupHook(arg) {
	return /^(?:--(?:import|require|(?:experimental-)?loader)(?:=|$)|-r)/u.test(arg.replaceAll("_", "-"));
}
/** Dedicated process owners must not inherit the caller's instrumentation loaders. */
function stripNodeStartupHooks(nodeOptions) {
	const args = parseNodeOptionsEnvVar(nodeOptions);
	if (args === null) throw new Error("Invalid NODE_OPTIONS for process owner");
	if (!args.some(isNodeStartupHook)) return nodeOptions;
	const retained = [];
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (isNodeStartupHook(arg)) {
			if (arg === "-r" || arg.startsWith("--") && !arg.includes("=")) index += 1;
		} else retained.push("\"" + arg.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"") + "\"");
	}
	return retained.join(" ");
}
//#endregion
//#region src/infra/runtime-process-manifest.ts
function createRuntimeProcessEntrypoints(currentModuleUrl) {
	function runtimeProcessEntrypoint(modulePath) {
		return {
			currentModuleUrl,
			sourceWorkerName: modulePath.startsWith("infra/") ? modulePath.slice(6) : `../${modulePath}`,
			distWorkerPath: `${modulePath}.js`
		};
	}
	return {
		sqliteHeaderProbe: runtimeProcessEntrypoint("infra/sqlite-header-probe.worker"),
		postgresBridge: runtimeProcessEntrypoint("infra/postgres-sync/bridge.worker"),
		secretEgressProxy: runtimeProcessEntrypoint("secrets/egress-proxy/proxy.worker"),
		codeModeNode: runtimeProcessEntrypoint("agents/code-mode-node.worker"),
		cronReadOnly: runtimeProcessEntrypoint("cron/store/read-only.worker"),
		stateRead: runtimeProcessEntrypoint("state/openclaw-state-read.worker"),
		workerNativeLifecycle: runtimeProcessEntrypoint("infra/worker-native-lifecycle.worker"),
		spawnBroker: runtimeProcessEntrypoint("process/spawn-broker/worker"),
		cronStreamMatcher: runtimeProcessEntrypoint("gateway/cron-stream-matcher.worker"),
		controlUiFile: runtimeProcessEntrypoint("gateway/control-ui-file.worker"),
		publicSessionCard: runtimeProcessEntrypoint("gateway/control-ui-public-session-card.worker"),
		nodeBootstrapArtifact: runtimeProcessEntrypoint("gateway/worker-environments/node-bootstrap-artifact.worker"),
		nativeHookRelayClient: runtimeProcessEntrypoint("agents/harness/native-hook-relay-client.worker"),
		computerHost: runtimeProcessEntrypoint("gateway/desktop/computer.worker"),
		imageProcessor: runtimeProcessEntrypoint("media/image-processor.worker"),
		fileToolPlanning: runtimeProcessEntrypoint("agents/sessions/tools/file-tool-planning.worker"),
		fileToolRead: runtimeProcessEntrypoint("agents/sessions/tools/read-file.worker"),
		attachmentProcessor: runtimeProcessEntrypoint("media/attachment-processor.worker"),
		gitOperations: runtimeProcessEntrypoint("infra/git-operation.worker"),
		gitPackCleanup: runtimeProcessEntrypoint("agents/worktrees/git-pack-cleanup.worker"),
		fsSafeCopy: runtimeProcessEntrypoint("infra/fs-safe-copy.worker"),
		sharedStateStore: runtimeProcessEntrypoint("state/openclaw-state.worker"),
		authProfileInlineUsage: runtimeProcessEntrypoint("agents/auth-profiles/inline-usage.worker"),
		pluginModelCatalogCredentials: runtimeProcessEntrypoint("agents/plugin-model-catalog.worker"),
		agentDatabaseExecution: runtimeProcessEntrypoint("state/openclaw-agent-execution.worker"),
		workspaceMemory: runtimeProcessEntrypoint("worker/memory-worker-entry"),
		localAgentAvatar: runtimeProcessEntrypoint("agents/identity-avatar-file.worker"),
		identityFile: runtimeProcessEntrypoint("agents/identity-file.worker"),
		workspaceSkills: runtimeProcessEntrypoint("worker/skills-worker-entry"),
		skillsDiscovery: runtimeProcessEntrypoint("skills/runtime/discovery.worker"),
		boardStore: runtimeProcessEntrypoint("boards/sqlite-board-store.worker"),
		progressCardStore: runtimeProcessEntrypoint("session-cards/progress-card-store.worker"),
		sessionSharingStore: runtimeProcessEntrypoint("config/sessions/session-sharing-store.worker"),
		sessionForkDomain: runtimeProcessEntrypoint("config/sessions/session-fork-domain.worker"),
		sessionGoalOperations: runtimeProcessEntrypoint("config/sessions/goals-operations.worker"),
		sessionLifecyclePlanningDomain: runtimeProcessEntrypoint("config/sessions/session-lifecycle-projection.worker"),
		sessionMessageRewriteDomain: runtimeProcessEntrypoint("config/sessions/session-message-rewrite.worker"),
		sessionDiskBudget: runtimeProcessEntrypoint("config/sessions/disk-budget.worker"),
		heartbeatOutcomeStore: runtimeProcessEntrypoint("infra/heartbeat-outcome-store.worker"),
		acpParentStreamStore: runtimeProcessEntrypoint("agents/subagents/spawn/acp-parent-stream-store.worker"),
		messageToolRunOutcomeStore: runtimeProcessEntrypoint("infra/message-tool-run-outcome-store.worker"),
		contextEngineTurnOutbox: runtimeProcessEntrypoint("agents/harness/context-engine-turn-outbox.worker"),
		sqliteStore: runtimeProcessEntrypoint("infra/sqlite-store.worker"),
		sqliteWriterAdmission: runtimeProcessEntrypoint("infra/sqlite-writer-admission.worker"),
		agentSchemaInspection: runtimeProcessEntrypoint("state/openclaw-agent-schema-inspection.worker"),
		stateMigrationSnapshot: runtimeProcessEntrypoint("infra/state-migrations.snapshot.worker"),
		githubExec: runtimeProcessEntrypoint("agents/github-exec-launcher"),
		sqliteReadOnly: runtimeProcessEntrypoint("infra/sqlite-readonly-location.worker"),
		sqliteSnapshotStaging: runtimeProcessEntrypoint("infra/sqlite-snapshot-staging.worker"),
		sqliteReadOnlyNativeResource: runtimeProcessEntrypoint("infra/sqlite-readonly-native-resource"),
		sqliteSourceRevision: runtimeProcessEntrypoint("infra/sqlite-source-revision.worker"),
		sqliteIntegrity: runtimeProcessEntrypoint("infra/sqlite-integrity.worker"),
		sqliteCloseProbe: runtimeProcessEntrypoint("infra/bun-sqlite-close-probe.worker"),
		preparedModelCatalog: runtimeProcessEntrypoint("agents/prepared-model-catalog.worker"),
		providerPromptState: runtimeProcessEntrypoint("agents/embedded-agent-runner/provider-prompt-state.worker"),
		updateRepair: runtimeProcessEntrypoint("infra/update-repair.worker"),
		immutableBuild: runtimeProcessEntrypoint("infra/update-immutable-build.worker"),
		updateMigratedFinalize: runtimeProcessEntrypoint("infra/update-migrated-finalize.worker"),
		updateCandidateState: runtimeProcessEntrypoint("infra/update-candidate-state.worker"),
		doctorLint: runtimeProcessEntrypoint("commands/doctor-lint.worker"),
		doctor: runtimeProcessEntrypoint("commands/doctor.worker"),
		databaseVerify: runtimeProcessEntrypoint("state/openclaw-database-verify.worker"),
		stateOwnership: runtimeProcessEntrypoint("state/openclaw-state-ownership.worker"),
		stateLeaseHeartbeat: runtimeProcessEntrypoint("state/openclaw-state-lease-heartbeat.worker"),
		gatewayStateOwnerHeartbeat: runtimeProcessEntrypoint("infra/gateway-state-owner-heartbeat.worker"),
		sessionTranscriptArchive: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-archive.worker"),
		sessionTranscript: runtimeProcessEntrypoint("config/sessions/session-transcript.worker"),
		workerTranscriptCommit: runtimeProcessEntrypoint("gateway/worker-environments/transcript-commit.worker"),
		sessionManagerMetadata: runtimeProcessEntrypoint("agents/sessions/session-manager-metadata.worker"),
		sessionTranscriptProjectionPublication: runtimeProcessEntrypoint("config/sessions/session-transcript-projection-publication.worker"),
		sessionTranscriptReports: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-transcript-reports.worker"),
		sessionTranscriptReconcile: runtimeProcessEntrypoint("config/sessions/session-transcript-reconcile.worker"),
		tailscaleRouteOwner: runtimeProcessEntrypoint("infra/tailscale-route-owner.worker"),
		serviceChildRelay: runtimeProcessEntrypoint("process/supervisor/service-child-relay"),
		terminalPty: runtimeProcessEntrypoint("process/terminal-pty-worker"),
		serviceChildGroupAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-group-anchor"),
		serviceChildWindowsJobAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-windows-job-anchor"),
		bunSqliteLibrary: runtimeProcessEntrypoint("infra/bun-sqlite-library")
	};
}
//#endregion
//#region src/infra/runtime-process-entrypoints.ts
const runtimeProcessEntrypoints = createRuntimeProcessEntrypoints(import.meta.url);
//#endregion
//#region src/daemon/runtime-binary.ts
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
[.../* @__PURE__ */ new Set([
	"-r",
	"--preload",
	"--require",
	"--import",
	"--loader",
	"--experimental-loader",
	"--test-reporter",
	"--test-global-setup"
])];
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function isBunTargetRuntime(execPath) {
	return execPath === process.execPath ? Boolean(process.versions.bun) : isBunRuntime(execPath);
}
/** Disable implicit package installation in OpenClaw-owned Bun processes. */
function resolveRuntimeArgs(execPath = process.execPath) {
	return isBunTargetRuntime(execPath) ? ["--no-install"] : [];
}
/** Whether a source TypeScript module needs Node's tsx loader; Bun runs TypeScript natively. */
function runtimeNeedsTypeScriptLoader(modulePath, execPath = process.execPath) {
	return /\.[cm]?ts$/.test(modulePath) && !isBunTargetRuntime(execPath);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return runtimeNeedsTypeScriptLoader(entry, execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [...resolveRuntimeArgs(execPath), entry];
}
//#endregion
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region packages/normalization-core/src/expect.ts
/** Returns the value or throws with the named context; use for genuine invariants only. */
function expectDefined(value, context) {
	if (value === null || value === void 0) throw new Error("expected " + context + " to be defined");
	return value;
}
//#endregion
//#region packages/normalization-core/src/stable-node-path.ts
/**
* Returns stable Homebrew paths for a versioned Cellar Node executable.
* Availability remains caller-owned so packages can reuse the path contract
* without importing another package's filesystem/runtime layer.
*/
function stableHomebrewNodePathCandidates(nodePath) {
	const cellarMatch = nodePath.match(/^(.+?)[\\/]Cellar[\\/]([^\\/]+)[\\/][^\\/]+[\\/]bin[\\/]node$/);
	if (!cellarMatch) return [];
	const prefix = expectDefined(cellarMatch[1], "cellar match capture group 1");
	const formula = expectDefined(cellarMatch[2], "cellar match capture group 2");
	const pathModule = nodePath.includes("\\") ? path.win32 : path.posix;
	const candidates = [pathModule.join(prefix, "opt", formula, "bin", "node")];
	if (formula === "node") candidates.push(pathModule.join(prefix, "bin", "node"));
	return candidates;
}
//#endregion
//#region src/infra/stable-node-path.ts
function resolveLaunchableNodePath(nodePath = process.execPath) {
	if (existsSync(nodePath)) return nodePath;
	return stableHomebrewNodePathCandidates(nodePath).find(existsSync) ?? nodePath;
}
//#endregion
//#region packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
/** Only kernel absence, observed outside the owned group, confirms extinction. */
function isOwnedProcessGroupGone(pgid) {
	try {
		process.kill(-pgid, 0);
		return false;
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ESRCH") return true;
		if (code === "EPERM") return false;
		throw error;
	}
}
//#endregion
//#region src/process/supervisor/service-child-stdio.ts
function setStdioEntry(stdio, fd, value) {
	while (stdio.length <= fd) stdio.push("ignore");
	stdio[fd] = value;
}
function reserveStdioEntry(stdio, value) {
	let fd = 3;
	while (stdio[fd] !== void 0 && stdio[fd] !== "ignore") fd += 1;
	setStdioEntry(stdio, fd, value);
	return fd;
}
//#endregion
//#region src/process/supervisor/service-child-relay.ts
function runServiceChildRelay() {
	let generation;
	let anchor;
	let parentLost = false;
	let forcedSequence;
	let anchorExit;
	let parentLineageFds = [];
	let parentLineageReleased = false;
	const report = (message) => {
		if (!process.connected) return;
		try {
			process.send?.(message, () => {});
		} catch {}
	};
	const settleAnchorExit = () => {
		if (!anchorExit || !parentLineageReleased) return;
		process.exitCode = anchorExit.code === 0 || anchorExit.signal === "SIGKILL" ? 0 : 1;
		if (process.connected) process.disconnect?.();
	};
	const releaseParentLineage = async () => {
		if (parentLineageFds.length > 0) {
			let reportedFailure = false;
			for (;;) {
				try {
					if (isOwnedProcessGroupGone(anchor.pid)) break;
				} catch (error) {
					if (!reportedFailure) {
						reportedFailure = true;
						report({
							type: "relay-error",
							generation,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				}
				await setTimeout(100);
			}
			for (const fd of parentLineageFds) closeSync(fd);
			parentLineageFds = [];
		}
		parentLineageReleased = true;
		settleAnchorExit();
	};
	const notifyParentLoss = () => {
		if (parentLost) return;
		parentLost = true;
		if (anchorExit) {
			settleAnchorExit();
			return;
		}
		if (anchor?.connected) anchor.send({
			type: "parent-loss",
			generation
		});
	};
	process.once("disconnect", notifyParentLoss);
	process.on("SIGTERM", notifyParentLoss);
	process.on("SIGINT", notifyParentLoss);
	process.on("message", (raw) => {
		const start = raw;
		if (start?.type === "cancel") {
			if (!generation || !anchor || start.generation !== generation || start.signal !== "SIGKILL" || !Number.isSafeInteger(start.sequence) || start.sequence <= 0 || forcedSequence !== void 0) return;
			forcedSequence = start.sequence;
			if (!anchorExit) try {
				if (!anchor.kill("SIGKILL")) throw new Error("retained anchor SIGKILL was not delivered");
			} catch (error) {
				report({
					type: "relay-error",
					generation,
					error: error instanceof Error ? error.message : String(error)
				});
			}
			return;
		}
		if (generation) return;
		if (!start || start.type !== "start" && start.type !== "prepare" || !start.generation) {
			process.exitCode = 1;
			return;
		}
		generation = start.generation;
		if (start.controlFd === void 0) {
			report({
				type: "relay-error",
				generation,
				error: "service child control fd is missing"
			});
			process.exitCode = 1;
			return;
		}
		const anchorUrl = resolveRuntimeProcessEntrypointUrl("serviceChildGroupAnchor");
		const stdio = [
			"inherit",
			"inherit",
			"inherit"
		];
		parentLineageFds = start.parentLineageFds ?? [];
		for (const fd of [
			start.controlFd,
			start.lineageFd,
			...parentLineageFds,
			start.secretFd
		]) if (fd !== void 0) setStdioEntry(stdio, fd, fd);
		reserveStdioEntry(stdio, "ipc");
		try {
			const executable = resolveLaunchableNodePath();
			const env = { ...process.env };
			if (env.NODE_OPTIONS !== void 0) env.NODE_OPTIONS = stripNodeStartupHooks(env.NODE_OPTIONS);
			anchor = spawn(executable, resolveRuntimeWorkerArgv(anchorUrl, executable), {
				stdio,
				detached: true,
				windowsHide: true,
				env
			});
		} catch (error) {
			report({
				type: "relay-error",
				generation,
				error: error instanceof Error ? error.message : String(error)
			});
			process.exitCode = 1;
			return;
		}
		if (!anchor.connected) {
			report({
				type: "relay-error",
				generation,
				error: "anchor lifecycle IPC was not created"
			});
			anchor.kill("SIGKILL");
			process.exitCode = 1;
			return;
		}
		anchor.once("spawn", () => {
			closeSync(start.controlFd);
			if (start.lineageFd !== void 0) closeSync(start.lineageFd);
			if (process.versions.bun) for (const fd of [1, 2]) {
				const output = createWriteStream("", {
					fd,
					autoClose: true
				});
				output.once("error", (error) => {
					report({
						type: "relay-error",
						generation: start.generation,
						error: error.message
					});
					notifyParentLoss();
				});
				output.end();
			}
			else {
				process.stdout.destroy();
				process.stderr.destroy();
			}
			anchor?.send(start);
			if (parentLost) anchor?.send({
				type: "parent-loss",
				generation
			});
		});
		anchor.once("error", (error) => {
			report({
				type: "relay-error",
				generation,
				error: error.message
			});
		});
		anchor.once("exit", (code, signal) => {
			anchorExit = {
				code,
				signal
			};
			releaseParentLineage().catch((error) => {
				report({
					type: "relay-error",
					generation,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		});
	});
}
runServiceChildRelay();
//#endregion
export {};
