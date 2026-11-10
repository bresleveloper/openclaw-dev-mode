import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createContainerEnvFile } from "./container-env-file-B9miprOg.mjs";
import { t as buildGitHubExecLaunchArgv } from "./github-exec-launch-IIN8uo4w.mjs";
import { w as SANDBOX_GITHUB_CONFIG_DIR } from "./constants-Cg33NnpI.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { t as SandboxRuntimeRetiredError } from "./provisioning-error-CG_fGcV-.mjs";
import { c as DOCKER_SANDBOX_ENGINE, d as execContainerRaw, l as PODMAN_SANDBOX_ENGINE, n as bindPodmanSandboxEngine, o as resolvePodmanSandboxRuntimeInfo, s as validateSandboxContainerEngineTarget, u as execContainer } from "./podman-runtime-CSMq05ZW.mjs";
import { f as captureSandboxContainerTermination, h as containerState, l as resolveSandboxContainerOnlyMounts, m as containerHasTerminated, p as removeSandboxContainerRuntime, r as ensureSandboxContainer } from "./docker-D7UqpDUP.mjs";
import { f as reserveSandboxRegistryEntry, h as withSandboxRegistryEntryLock, m as updateRegistry, n as assertSandboxRegistryEntryCurrent, r as completeSandboxRegistryReservation } from "./registry-BFvNacyu.mjs";
import { n as createSandboxInputStager, t as bindSandboxInputStager } from "./input-staging-as6U58RD.mjs";
import { d as resolveRemoteShellRuntimePaths, n as createSshSandboxBackend, r as sshSandboxBackendManager } from "./ssh-backend-BZvXrnQ9.mjs";
import { randomUUID } from "node:crypto";
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
function buildContainerExecArgs(params) {
	const args = ["exec", "-i"];
	if (params.tty) args.push("-t");
	if (params.workdir) args.push("-w", params.workdir);
	args.push("--env-file", params.envFile);
	if (params.managedGitHubIdentity) args.push("--env", "GH_TOKEN", "--env", "GITHUB_TOKEN");
	const pathExport = params.env.PATH ? "export PATH=\"${OPENCLAW_PREPEND_PATH}:$PATH\"; unset OPENCLAW_PREPEND_PATH; " : "";
	args.push(params.containerName, "/bin/sh", "-lc", `${pathExport}${params.command}`);
	return args;
}
async function createContainerSandboxBackend(engine, params, operatorAuthority, githubIdentity) {
	const assertCurrent = () => {
		operatorAuthority?.assertCurrent();
		params.assertRuntimeCurrent?.();
	};
	assertCurrent();
	if (engine.id === "podman" && params.cfg.browser.enabled) throw new Error("Podman sandboxing does not support browser sandboxes. Install Docker and select the docker backend, or disable sandbox.browser.enabled.");
	const podmanTarget = engine.id === "podman" ? (await resolvePodmanSandboxRuntimeInfo()).target : void 0;
	const boundEngine = podmanTarget ? bindPodmanSandboxEngine(podmanTarget) : engine;
	const { containerName, containerId } = await ensureSandboxContainer({
		engine: boundEngine,
		...podmanTarget ? { podmanTarget } : {},
		scopeKey: params.scopeKey,
		workspaceDir: params.workspaceDir,
		workspaceSource: params.workspaceSource,
		assertCurrent,
		operatorAuthority,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		readOnlyResourceMounts: params.readOnlyResourceMounts,
		cfg: params.cfg,
		...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
	});
	assertCurrent();
	const containerOnlyMounts = await resolveSandboxContainerOnlyMounts({
		engine: boundEngine,
		containerName: containerId,
		assertCurrent
	});
	assertCurrent();
	const { createSandboxFsBridge } = await import("./fs-bridge-CAGR74B0.mjs");
	assertCurrent();
	const handle = createContainerSandboxBackendHandle({
		engine: boundEngine,
		containerName,
		containerId,
		workdir: params.cfg.docker.workdir,
		env: params.cfg.docker.env,
		image: params.cfg.docker.image,
		podmanTarget,
		assertCurrent,
		githubIdentity
	});
	handle.createFsBridge = ({ sandbox }) => {
		const bridge = createSandboxFsBridge({
			sandbox: {
				...sandbox,
				backend: sandbox.backend ?? handle
			},
			containerOnlyMounts
		});
		bindSandboxInputStager(bridge, createSandboxInputStager({
			root: params.workspaceDir,
			bridge,
			assertCurrent
		}));
		return bridge;
	};
	return handle;
}
async function createDockerSandboxBackend(params, operatorAuthority, githubIdentity) {
	return await createContainerSandboxBackend(DOCKER_SANDBOX_ENGINE, params, operatorAuthority, githubIdentity);
}
async function createPodmanSandboxBackend(params, operatorAuthority, githubIdentity) {
	return await createContainerSandboxBackend(PODMAN_SANDBOX_ENGINE, params, operatorAuthority, githubIdentity);
}
function createContainerSandboxBackendHandle(params) {
	const run = (command, assertCurrent) => runContainerSandboxShellCommand({
		engine: params.engine,
		containerName: params.containerId,
		podmanTarget: params.podmanTarget,
		...command,
		assertCurrent
	});
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
		async buildExecSpec({ command, workdir, env: requestedEnv, usePty }) {
			await validateSandboxContainerEngineTarget(params.engine, params.podmanTarget);
			const identity = params.githubIdentity;
			const githubProfileDir = identity?.localIdentityEnv.GH_CONFIG_DIR;
			const externalCommandShell = githubProfileDir && process.platform === "win32" ? (await import("./shell-utils-DWCaziZt.mjs")).getShellConfig() : void 0;
			params.assertCurrent?.();
			const env = identity ? {
				...requestedEnv,
				...identity.credentialScrubEnv,
				...identity.localIdentityEnv,
				GH_CONFIG_DIR: SANDBOX_GITHUB_CONFIG_DIR
			} : requestedEnv;
			const { PATH: requestedPath, ...containerEnv } = env;
			if (requestedPath) containerEnv.OPENCLAW_PREPEND_PATH = requestedPath;
			const envFile = await createContainerEnvFile(containerEnv);
			try {
				params.assertCurrent?.();
				const argv = [
					params.engine.command,
					...params.engine.globalArgs ?? [],
					...buildContainerExecArgs({
						containerName: params.containerId,
						command,
						workdir: workdir ?? params.workdir,
						env,
						envFile: envFile.path,
						tty: usePty,
						managedGitHubIdentity: Boolean(githubProfileDir)
					})
				];
				return {
					argv: githubProfileDir ? buildGitHubExecLaunchArgv(argv, githubProfileDir, externalCommandShell ? { externalCommandShell } : void 0) : argv,
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
			const wasTerminated = captureSandboxContainerTermination(params.engine, params.containerName, params.containerId);
			return createSandboxProcessCleanup((command) => run(command, params.assertCurrent), env, async (command) => {
				const settled = {
					code: 0,
					stdout: Buffer.alloc(0),
					stderr: Buffer.alloc(0)
				};
				try {
					if (wasTerminated()) return settled;
					const result = await run(command);
					if (result.code === 0) return result;
					if (wasTerminated() || await containerHasTerminated(params.engine, params.containerId, command.signal) || wasTerminated()) return settled;
					return result;
				} catch (error) {
					if (wasTerminated()) return settled;
					throw error;
				}
			});
		},
		runShellCommand(command) {
			return run(command, params.assertCurrent);
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
			const sandboxCfg = resolveSandboxConfigForAgent(config, agentId);
			const configuredImage = entry.configLabelKind === "BrowserImage" ? sandboxCfg.browser.image : sandboxCfg.docker.image;
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
			await removeSandboxContainerRuntime(runtimeEngine, entry.containerName);
		}
	};
}
const dockerSandboxBackendManager = createContainerSandboxBackendManager(DOCKER_SANDBOX_ENGINE);
const podmanSandboxBackendManager = createContainerSandboxBackendManager(PODMAN_SANDBOX_ENGINE);
//#endregion
//#region src/agents/sandbox/backend.ts
const SANDBOX_BACKEND_FACTORIES_STATE_KEY = Symbol.for("openclaw.sandboxBackendFactories");
function getSandboxBackendFactories() {
	return resolveGlobalMap(SANDBOX_BACKEND_FACTORIES_STATE_KEY);
}
function normalizeSandboxBackendId(id) {
	const normalized = normalizeOptionalLowercaseString(id);
	if (!normalized) throw new Error("Sandbox backend id must not be empty.");
	return normalized;
}
/** Register or replace a sandbox backend and return a restore callback. */
function registerSandboxBackend(id, registration) {
	const normalizedId = normalizeSandboxBackendId(id);
	const resolved = typeof registration === "function" ? { factory: registration } : registration;
	const factories = getSandboxBackendFactories();
	const generation = {
		registration: resolved,
		previous: factories.get(normalizedId),
		retired: false
	};
	factories.set(normalizedId, generation);
	return () => {
		if (generation.retired) return;
		generation.retired = true;
		if (factories.get(normalizedId) !== generation) return;
		let previous = generation.previous;
		while (previous?.retired) previous = previous.previous;
		if (previous) {
			factories.set(normalizedId, previous);
			return;
		}
		factories.delete(normalizedId);
	};
}
function getSandboxBackendFactory(id) {
	const registration = resolveSandboxBackendRegistration(id);
	if (!registration) return null;
	if (!registration.reserveRuntimeId) return registration.factory;
	const factory = registration.factory;
	return async (params) => {
		const { runtimeId, assertRuntimeCurrent } = params;
		if (!runtimeId || !assertRuntimeCurrent) throw new Error(`Sandbox backend "${id}" requires a registry-reserved runtime and its current owner.`);
		assertRuntimeCurrent();
		return factory({
			...params,
			runtimeId,
			assertRuntimeCurrent
		});
	};
}
function getSandboxBackendManager(id) {
	return resolveSandboxBackendRegistration(id)?.manager ?? null;
}
/** Include legacy rows in the lifecycle selected by the currently registered backend. */
function usesSandboxRuntimeReservations(id) {
	return resolveSandboxBackendRegistration(id)?.reserveRuntimeId !== void 0;
}
function getSandboxBackendWorkdirResolver(id) {
	return resolveSandboxBackendRegistration(id)?.resolveWorkdir ?? null;
}
/** Read static backend capabilities without provisioning a sandbox runtime. */
function getSandboxBackendCapabilities(id) {
	return resolveSandboxBackendRegistration(id)?.capabilities;
}
function requireSandboxBackendFactory(id) {
	const factory = getSandboxBackendFactory(id);
	if (factory) return factory;
	throw new Error([`Sandbox backend "${id}" is not registered.`, "Load the plugin that provides it, or set agents.defaults.sandbox.backend=docker."].join("\n"));
}
/** Create and publish a backend, reserving provider IDs only for opted-in factories. */
async function createSandboxBackend(params, operatorAuthority, githubIdentity, guard) {
	params.assertRuntimeCurrent?.();
	const factory = requireSandboxBackendFactory(params.cfg.backend);
	if (githubIdentity && factory !== createDockerSandboxBackend && factory !== createPodmanSandboxBackend) throw new Error("Sandbox GitHub identity requires the built-in Docker or Podman backend.");
	const reserveRuntimeId = resolveSandboxBackendRegistration(params.cfg.backend)?.reserveRuntimeId;
	const toEntry = (backend) => ({
		containerName: backend.runtimeId,
		backendId: backend.id,
		runtimeLabel: backend.runtimeLabel,
		sessionKey: params.scopeKey,
		createdAtMs: Date.now(),
		lastUsedAtMs: Date.now(),
		image: backend.configLabel ?? params.cfg.docker.image,
		configLabelKind: backend.configLabelKind ?? "Image"
	});
	if (!reserveRuntimeId) {
		const backend = factory === createDockerSandboxBackend ? await createDockerSandboxBackend(params, operatorAuthority, githubIdentity) : factory === createPodmanSandboxBackend ? await createPodmanSandboxBackend(params, operatorAuthority, githubIdentity) : await factory(params);
		await updateRegistry(toEntry(backend), {
			...guard,
			beforeLegacyApply: params.assertRuntimeCurrent
		});
		return backend;
	}
	for (let attempt = 0;; attempt++) {
		params.assertRuntimeCurrent?.();
		const reservation = await reserveSandboxRegistryEntry({
			containerName: reserveRuntimeId(params),
			backendId: params.cfg.backend,
			sessionKey: params.scopeKey,
			createdAtMs: Date.now(),
			lastUsedAtMs: Date.now(),
			image: params.cfg.docker.image,
			workspaceDir: params.workspaceDir
		}, {
			...guard,
			beforeLegacyApply: params.assertRuntimeCurrent
		});
		try {
			return await withSandboxRegistryEntryLock(reservation, async () => {
				const assertCurrent = () => {
					params.assertRuntimeCurrent?.();
					assertSandboxRegistryEntryCurrent(reservation);
				};
				try {
					const backend = await factory({
						...params,
						workspaceDir: reservation.workspaceDir ?? params.workspaceDir,
						runtimeId: reservation.containerName,
						assertRuntimeCurrent: assertCurrent
					});
					if (backend.runtimeId !== reservation.containerName || backend.id !== reservation.backendId) throw new Error("Sandbox backend returned a runtime outside its reserved generation.");
					await completeSandboxRegistryReservation({
						...reservation,
						...toEntry(backend),
						createdAtMs: reservation.createdAtMs
					}, false, {
						...guard,
						beforeLegacyApply: params.assertRuntimeCurrent
					});
					return backend;
				} catch (error) {
					if (error instanceof SandboxRuntimeRetiredError && error.runtimeId === reservation.containerName) await completeSandboxRegistryReservation(reservation, true, {
						...guard,
						beforeLegacyApply: params.assertRuntimeCurrent
					});
					throw error;
				}
			});
		} catch (error) {
			if (!(error instanceof SandboxRuntimeRetiredError) || error.runtimeId !== reservation.containerName || attempt > 0) throw error;
		}
	}
}
const builtinSandboxBackends = /* @__PURE__ */ new Map();
builtinSandboxBackends.set("docker", {
	factory: createDockerSandboxBackend,
	manager: dockerSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir,
	capabilities: { readOnlyResourceMounts: true }
});
builtinSandboxBackends.set("podman", {
	factory: createPodmanSandboxBackend,
	manager: podmanSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir,
	capabilities: { readOnlyResourceMounts: true }
});
builtinSandboxBackends.set("ssh", {
	factory: createSshSandboxBackend,
	manager: sshSandboxBackendManager,
	resolveWorkdir: ({ cfg, scopeKey }) => resolveRemoteShellRuntimePaths(cfg.ssh.workspaceRoot, scopeKey).remoteWorkspaceDir
});
function resolveSandboxBackendRegistration(id) {
	const normalizedId = normalizeSandboxBackendId(id);
	return getSandboxBackendFactories().get(normalizedId)?.registration ?? builtinSandboxBackends.get(normalizedId);
}
//#endregion
export { getSandboxBackendWorkdirResolver as a, usesSandboxRuntimeReservations as c, getSandboxBackendManager as i, dockerSandboxBackendManager as l, getSandboxBackendCapabilities as n, registerSandboxBackend as o, getSandboxBackendFactory as r, requireSandboxBackendFactory as s, createSandboxBackend as t, prepareSandboxProcessCleanup as u };
