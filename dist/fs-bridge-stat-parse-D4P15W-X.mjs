import { C as parseStrictNonNegativeInteger, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createContainerEnvFile } from "./container-env-file-kGWdBAgU.mjs";
import { t as PATH_ALIAS_POLICIES } from "./path-alias-guards-B5pyqp7d.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { C as execContainer, S as PODMAN_SANDBOX_ENGINE, a as ensureSandboxContainer, g as validateSandboxContainerEngineTarget, h as resolvePodmanSandboxRuntimeInfo, m as bindPodmanSandboxEngine, n as containerState, v as resolveSandboxContainerOnlyMounts, w as execContainerRaw, x as DOCKER_SANDBOX_ENGINE } from "./docker-CIwPFSTC.mjs";
import { randomUUID } from "node:crypto";
import { GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE, GUEST_FILESYSTEM_PYTHON, GUEST_FILESYSTEM_READ_NOT_FOUND_EXIT_CODE, GUEST_FILESYSTEM_RENAME_NO_REPLACE_PYTHON } from "@openclaw/fs-safe/guest";
//#region src/agents/sandbox/process-cleanup.ts
const SANDBOX_PROCESS_REAP_TIMEOUT_MS = 4500;
const SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE = 75;
const SANDBOX_EXEC_MARKER = "CODEX_SANDBOX_EXEC_ID";
function prepareSandboxProcessCleanup(backend, env) {
	return backend.prepareProcessCleanup?.(env) ?? createSandboxProcessCleanup(backend.runShellCommand.bind(backend), env);
}
/** Only termination retains cleanup custody; interrupts still require current execution authority. */
function createSandboxProcessCleanup(runShellCommand, env, runTermination = runShellCommand) {
	const marker = randomUUID();
	return {
		env: {
			...env,
			[SANDBOX_EXEC_MARKER]: marker
		},
		interrupt: async (timeoutMs) => {
			const result = await runShellCommand({
				script: `${SANDBOX_REMOTE_FIND_OWNED_PIDS}\nowned="$(find_owned_pids "$1")"\n[ -n "$owned" ] || exit ${SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE}\nkill -INT $owned 2>/dev/null || true`,
				args: [`${SANDBOX_EXEC_MARKER}=${marker}`],
				allowFailure: true,
				signal: AbortSignal.timeout(timeoutMs)
			});
			if (result.code === SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE) return false;
			if (result.code !== 0) throw new Error(`Sandbox process interrupt failed with code ${result.code}`);
			return true;
		},
		terminate: async () => {
			const result = await runTermination({
				script: SANDBOX_REMOTE_TERMINATE_SCRIPT,
				args: [`${SANDBOX_EXEC_MARKER}=${marker}`],
				allowFailure: true,
				signal: AbortSignal.timeout(SANDBOX_PROCESS_REAP_TIMEOUT_MS)
			});
			if (result.code !== 0) {
				const detail = result.stderr.toString("utf8").trim() || result.stdout.toString("utf8").trim();
				throw new Error(detail || `Sandbox process tree cleanup failed with code ${result.code}; tear down the sandbox environment and inspect surviving processes before retrying.`);
			}
		}
	};
}
const SANDBOX_REMOTE_FIND_OWNED_PIDS = String.raw`
find_owned_pids() {
  for env_file in /proc/[0-9]*/environ; do
    if [ -r "$env_file" ] && tr '\0' '\n' < "$env_file" 2>/dev/null | grep -Fqx "$1"; then
      basename "$(dirname "$env_file")"
    fi
  done
}
`.trim();
const SANDBOX_REMOTE_TERMINATE_SCRIPT = String.raw`
${SANDBOX_REMOTE_FIND_OWNED_PIDS}
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -TERM $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -KILL $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || { echo "Sandbox process IDs survived SIGKILL: $owned" >&2; exit 1; }
`.trim();
//#endregion
//#region src/agents/sandbox/docker-backend.ts
/**
* Docker sandbox backend implementation.
*
* Creates/reuses Docker containers and exposes backend-neutral exec and shell-command handles.
*/
function resolveContainerExecEnv(env) {
	const { PATH: requestedPath, ...containerEnv } = env;
	if (requestedPath) containerEnv.OPENCLAW_PREPEND_PATH = requestedPath;
	return containerEnv;
}
function buildContainerExecArgs(params) {
	const args = ["exec", "-i"];
	if (params.tty) args.push("-t");
	if (params.workdir) args.push("-w", params.workdir);
	args.push("--env-file", params.envFile);
	const pathExport = params.env.PATH ? "export PATH=\"${OPENCLAW_PREPEND_PATH}:$PATH\"; unset OPENCLAW_PREPEND_PATH; " : "";
	args.push(params.containerName, "/bin/sh", "-lc", `${pathExport}${params.command}`);
	return args;
}
function resolveConfiguredDockerRuntimeImage(params) {
	const sandboxCfg = resolveSandboxConfigForAgent(params.config, params.agentId);
	switch (params.configLabelKind) {
		case "BrowserImage": return sandboxCfg.browser.image;
		default: return sandboxCfg.docker.image;
	}
}
async function createContainerSandboxBackend(engine, params) {
	if (engine.id === "podman" && params.cfg.browser.enabled) throw new Error("Podman sandboxing does not support browser sandboxes. Install Docker and select the docker backend, or disable sandbox.browser.enabled.");
	const podmanTarget = engine.id === "podman" ? (await resolvePodmanSandboxRuntimeInfo()).target : void 0;
	const boundEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
	const containerName = await ensureSandboxContainer({
		engine: boundEngine,
		...podmanTarget ? { podmanTarget } : {},
		scopeKey: params.scopeKey,
		workspaceDir: params.workspaceDir,
		workspaceSource: params.workspaceSource,
		assertCurrent: params.assertRuntimeCurrent,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		readOnlyResourceMounts: params.readOnlyResourceMounts,
		cfg: params.cfg,
		...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
	});
	params.assertRuntimeCurrent?.();
	const containerId = (await execContainer(boundEngine, [
		"inspect",
		"--format",
		"{{.Id}}",
		containerName
	], { signal: AbortSignal.timeout(5e3) })).stdout.trim();
	if (!/^[a-f0-9]{64}$/u.test(containerId)) throw new Error("Container inspect did not return an immutable container ID.");
	const containerOnlyMounts = await resolveSandboxContainerOnlyMounts({
		engine: boundEngine,
		containerName: containerId,
		assertCurrent: params.assertRuntimeCurrent
	});
	params.assertRuntimeCurrent?.();
	const { createSandboxFsBridge } = await import("./fs-bridge-CRxfrexi.mjs");
	params.assertRuntimeCurrent?.();
	const handle = createContainerSandboxBackendHandle({
		engine: boundEngine,
		containerName,
		containerId,
		workdir: params.cfg.docker.workdir,
		env: params.cfg.docker.env,
		image: params.cfg.docker.image,
		podmanTarget,
		assertCurrent: params.assertRuntimeCurrent
	});
	handle.createFsBridge = ({ sandbox }) => createSandboxFsBridge({
		sandbox,
		containerOnlyMounts
	});
	return handle;
}
async function createDockerSandboxBackend(params) {
	return await createContainerSandboxBackend(DOCKER_SANDBOX_ENGINE, params);
}
async function createPodmanSandboxBackend(params) {
	return await createContainerSandboxBackend(PODMAN_SANDBOX_ENGINE, params);
}
function createContainerSandboxBackendHandle(params) {
	return {
		id: params.engine.id,
		runtimeId: params.containerName,
		runtimeLabel: params.containerName,
		workdir: params.workdir,
		env: params.env,
		configLabel: params.image,
		configLabelKind: "Image",
		capabilities: {
			browser: params.engine.id === "docker",
			readOnlyResourceMounts: true
		},
		async buildExecSpec({ command, workdir, env, usePty }) {
			await validateSandboxContainerEngineTarget(params.engine, params.podmanTarget);
			const envFile = await createContainerEnvFile(resolveContainerExecEnv(env));
			try {
				return {
					argv: [
						params.engine.command,
						...params.engine.globalArgs ?? [],
						...buildContainerExecArgs({
							containerName: params.containerId,
							command,
							workdir: workdir ?? params.workdir,
							env,
							envFile: envFile.path,
							tty: usePty
						})
					],
					env: process.env,
					stdinMode: usePty ? "pipe-open" : "pipe-closed",
					finalizeToken: envFile.cleanup
				};
			} catch (error) {
				await envFile.cleanup();
				throw error;
			}
		},
		async finalizeExec({ token }) {
			if (token === void 0) return;
			if (typeof token !== "function") throw new Error("Invalid container sandbox execution cleanup token.");
			await token();
		},
		prepareProcessCleanup(env) {
			params.assertCurrent?.();
			const run = (command, assertCurrent) => runContainerSandboxShellCommand({
				engine: params.engine,
				containerName: params.containerId,
				podmanTarget: params.podmanTarget,
				...command,
				assertCurrent
			});
			return createSandboxProcessCleanup((command) => run(command, params.assertCurrent), env, async (command) => {
				const result = await run(command);
				if (result.code === 0) return result;
				const inspected = await execContainer(params.engine, [
					"inspect",
					"--format",
					"{{.Id}}",
					params.containerId
				], {
					allowFailure: true,
					signal: command.signal
				});
				if (inspected.code !== 0 && inspected.stderr.includes(params.containerId) && /no such (?:container|object)/iu.test(inspected.stderr)) return {
					code: 0,
					stdout: Buffer.alloc(0),
					stderr: Buffer.alloc(0)
				};
				return result;
			});
		},
		runShellCommand(command) {
			return runContainerSandboxShellCommand({
				engine: params.engine,
				containerName: params.containerId,
				podmanTarget: params.podmanTarget,
				...command,
				assertCurrent: params.assertCurrent
			});
		}
	};
}
async function runContainerSandboxShellCommand(params) {
	await validateSandboxContainerEngineTarget(params.engine, params.podmanTarget);
	const dockerArgs = [
		"exec",
		"-i",
		params.containerName,
		"sh",
		"-c",
		params.script,
		"openclaw-sandbox-fs"
	];
	if (params.args?.length) dockerArgs.push(...params.args);
	params.assertCurrent?.();
	return execContainerRaw(params.engine, dockerArgs, {
		input: params.stdin,
		allowFailure: params.allowFailure,
		signal: params.signal
	});
}
function runDockerSandboxShellCommand(params) {
	return runContainerSandboxShellCommand({
		engine: DOCKER_SANDBOX_ENGINE,
		...params
	});
}
function createContainerSandboxBackendManager(engine) {
	const resolvePodmanTarget = (entry) => {
		if (engine.id !== "podman") return;
		if (entry.backendTarget) return entry.backendTarget;
		throw Object.assign(/* @__PURE__ */ new Error(`Podman sandbox runtime ${entry.containerName} has no recorded engine target. Remove that unshipped runtime manually before managing it.`), { code: "INVALID_CONFIG" });
	};
	return {
		async describeRuntime({ entry, config, agentId }) {
			const podmanTarget = resolvePodmanTarget(entry);
			await validateSandboxContainerEngineTarget(engine, podmanTarget);
			const runtimeEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
			const state = await containerState(runtimeEngine, entry.containerName);
			let actualConfigLabel = entry.image;
			let actualImageId;
			if (state.exists) try {
				const result = await execContainer(runtimeEngine, [
					"inspect",
					"-f",
					runtimeEngine.id === "podman" ? "{{.ImageName}}	{{.Image}}" : "{{.Config.Image}}",
					entry.containerName
				], { allowFailure: true });
				if (result.code === 0) {
					const inspected = result.stdout.trim();
					if (runtimeEngine.id === "podman") {
						const [imageName, imageId] = inspected.split("	", 2);
						actualConfigLabel = imageName || actualConfigLabel;
						actualImageId = imageId;
					} else actualConfigLabel = inspected || actualConfigLabel;
				}
			} catch {}
			const configuredImage = resolveConfiguredDockerRuntimeImage({
				config,
				agentId,
				configLabelKind: entry.configLabelKind
			});
			let configLabelMatch = actualConfigLabel === configuredImage;
			if (runtimeEngine.id === "podman" && !configLabelMatch && actualImageId) try {
				const result = await execContainer(runtimeEngine, [
					"image",
					"inspect",
					"-f",
					"{{.Id}}",
					configuredImage
				], { allowFailure: true });
				if (result.code === 0) {
					const normalizeImageId = (value) => value.trim().replace(/^sha256:/u, "");
					configLabelMatch = normalizeImageId(actualImageId) === normalizeImageId(result.stdout);
				}
			} catch {}
			return {
				running: state.running,
				actualConfigLabel,
				configLabelMatch
			};
		},
		async removeRuntime({ entry }) {
			const podmanTarget = resolvePodmanTarget(entry);
			await validateSandboxContainerEngineTarget(engine, podmanTarget);
			const runtimeEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
			const result = await execContainer(runtimeEngine, [
				"rm",
				"-f",
				entry.containerName
			], { allowFailure: true });
			if (result.code !== 0) {
				const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
				if (/No such (container|object)|does not exist/iu.test(detail)) return;
				throw new Error(`Failed to remove ${engine.displayName} sandbox runtime ${entry.containerName}: ${detail}`);
			}
		}
	};
}
const dockerSandboxBackendManager = createContainerSandboxBackendManager(DOCKER_SANDBOX_ENGINE);
const podmanSandboxBackendManager = createContainerSandboxBackendManager(PODMAN_SANDBOX_ENGINE);
//#endregion
//#region src/infra/directory-entries.ts
/** Decode the sandbox directory command's metadata, never file contents. */
function parseDirectoryEntries(text) {
	const entries = JSON.parse(text);
	if (!Array.isArray(entries)) throw new Error("Invalid sandbox directory listing.");
	return entries.map((entry) => {
		const record = asNullableRecord(entry);
		if (!record || typeof record.name !== "string" || typeof record.isDirectory !== "boolean") throw new Error("Invalid sandbox directory entry.");
		return {
			name: record.name,
			isDirectory: record.isDirectory
		};
	});
}
//#endregion
//#region src/agents/sandbox/fs-bridge-mutation-helper.ts
/**
* Shell plans for pinned sandbox filesystem operations.
*
* Selects the local interpreter and supplies quoted Python source to local and remote transports.
*/
const SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES = [
	"/usr/bin/python3",
	"/usr/local/bin/python3",
	"/opt/homebrew/bin/python3",
	"/bin/python3"
];
const SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL = `'${GUEST_FILESYSTEM_PYTHON.replaceAll("'", `'\\''`)}'`;
function pinnedEntryArgs(pinned) {
	return [
		pinned.mountRootPath,
		pinned.relativeParentPath,
		pinned.basename
	];
}
/** Encode only already-admitted pinned facts; transport and path checks stay with each bridge. */
function buildPinnedMutationArgs(operation) {
	switch (operation.kind) {
		case "read": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			...operation.maxBytes === void 0 ? [] : [String(operation.maxBytes)]
		];
		case "write":
		case "create": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			operation.mkdir ? "1" : "0"
		];
		case "mkdirp":
		case "readdir": return [
			operation.kind,
			operation.pinned.mountRootPath,
			operation.pinned.relativePath
		];
		case "remove": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			operation.recursive ? "1" : "0",
			operation.force === false ? "0" : "1"
		];
	}
	return [
		operation.kind,
		...pinnedEntryArgs(operation.source),
		...pinnedEntryArgs(operation.destination),
		operation.kind === "rename" || operation.mkdir ? "1" : "0"
	];
}
function buildPinnedMutationPlan(operation) {
	const checks = operation.kind === "copy" || operation.kind === "rename" ? [operation.sourceCheck, operation.destinationCheck] : [operation.check];
	if (operation.kind === "remove" || operation.kind === "rename") {
		const check = operation.kind === "remove" ? operation.check : operation.sourceCheck;
		checks[0] = {
			target: check.target,
			options: {
				...check.options,
				aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget
			}
		};
	}
	const args = buildPinnedMutationArgs(operation);
	return {
		checks,
		recheckBeforeCommand: true,
		script: [
			"set -eu",
			"python_cmd=''",
			...SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES.map((candidate) => `if [ -z "$python_cmd" ] && [ -x '${candidate}' ]; then python_cmd='${candidate}'; fi`),
			"if [ -z \"$python_cmd\" ]; then python_cmd=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || true); fi",
			"if [ -z \"$python_cmd\" ]; then",
			"  echo >&2 'sandbox pinned mutation helper requires python3 or python'",
			"  exit 127",
			"fi",
			`python_script=${SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL}`,
			"exec \"$python_cmd\" -c \"$python_script\" \"$@\""
		].join("\n"),
		args
	};
}
//#endregion
//#region src/agents/sandbox/fs-bridge-stat-parse.ts
/**
* Stat output parsers for sandbox filesystem bridges.
*
* Handles GNU/BSD size and mtime formats returned through backend shell commands.
*/
function hasMultipleHardlinks(raw) {
	const linkCount = parseStrictNonNegativeInteger(raw);
	return linkCount === void 0 ? /^\d+$/.test(raw) : linkCount > 1;
}
/** Parses file sizes, capping huge integer strings at the largest safe JS integer. */
function parseSandboxStatSize(value) {
	const raw = value ?? "0";
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed !== void 0) return parsed;
	return /^\d+$/.test(raw) ? Number.MAX_SAFE_INTEGER : 0;
}
/** Parses stat mtimes from epoch seconds or date strings into millisecond timestamps. */
function parseSandboxStatMtimeMs(value) {
	const raw = value ?? "0";
	if (/^\d+(?:\.\d+)?$/.test(raw)) {
		const mtimeMs = Number(raw) * 1e3;
		return asDateTimestampMs(mtimeMs) ?? 0;
	}
	return asDateTimestampMs(Date.parse(raw)) ?? 0;
}
//#endregion
export { buildPinnedMutationArgs as a, GUEST_FILESYSTEM_READ_NOT_FOUND_EXIT_CODE as c, createDockerSandboxBackend as d, createPodmanSandboxBackend as f, prepareSandboxProcessCleanup as g, runDockerSandboxShellCommand as h, SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL as i, GUEST_FILESYSTEM_RENAME_NO_REPLACE_PYTHON as l, podmanSandboxBackendManager as m, parseSandboxStatMtimeMs as n, buildPinnedMutationPlan as o, dockerSandboxBackendManager as p, parseSandboxStatSize as r, GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE as s, hasMultipleHardlinks as t, parseDirectoryEntries as u };
