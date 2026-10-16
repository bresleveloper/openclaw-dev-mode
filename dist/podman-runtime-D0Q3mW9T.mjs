import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import "./errors-O33D01XW.mjs";
import { i as isPlainCommandExitFailure } from "./exec-result-s7WOth0N.mjs";
import "./exec-DJvyCA0D.mjs";
import { o as spawnCommand } from "./exec-spawn-IxJJNQFo.mjs";
import { a as splitSandboxBindSpec, i as resolveSandboxHostPathViaExistingAncestor } from "./host-paths-C5NtLpi_.mjs";
import { x as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-sQ6GWokQ.mjs";
import { t as hashTextSha256 } from "./hash-DV5OH4uO.mjs";
import path from "node:path";
import os from "node:os";
import { isIP } from "node:net";
//#region src/agents/sandbox/container-engine.ts
/**
* Shared local container-engine process execution and backend selection.
*/
const DOCKER_SANDBOX_ENGINE = {
	id: "docker",
	command: "docker",
	displayName: "Docker"
};
const PODMAN_SANDBOX_ENGINE = {
	id: "podman",
	command: "podman",
	displayName: "Podman"
};
function missingContainerEngineMessage(engine) {
	if (engine.id === "docker") return "Sandbox mode requires Docker, but the \"docker\" command was not found in PATH. Install Docker (and ensure \"docker\" is available), or set `agents.defaults.sandbox.mode=off` to disable sandboxing.";
	return "Sandbox mode requires Podman, but the \"podman\" command was not found in PATH. Install Podman (and ensure \"podman\" is available), choose another sandbox backend, or set `agents.defaults.sandbox.mode=off` to disable sandboxing.";
}
async function execContainerRaw(engine, args, opts) {
	let result;
	try {
		result = await spawnCommand([
			engine.command,
			...engine.globalArgs ?? [],
			...args
		], {
			cancelSignal: opts?.signal,
			encoding: "buffer",
			input: opts?.input ?? Buffer.alloc(0),
			maxBuffer: SANDBOX_COMMAND_MAX_BUFFER_BYTES,
			reject: false,
			stripFinalNewline: false
		});
	} catch (error) {
		if (opts?.signal?.aborted) throw createAbortError("Aborted");
		if (error.code === "ENOENT") throw Object.assign(new Error(missingContainerEngineMessage(engine)), {
			code: "INVALID_CONFIG",
			cause: error
		});
		throw error;
	}
	if (opts?.signal?.aborted || result.isCanceled) throw createAbortError("Aborted");
	if (result.failed && !isPlainCommandExitFailure(result)) {
		if (result.code === "ENOENT") throw Object.assign(new Error(missingContainerEngineMessage(engine)), {
			code: "INVALID_CONFIG",
			cause: result
		});
		throw toErrorObject(result, `${engine.displayName} command execution failed`);
	}
	const stdout = Buffer.from(result.stdout);
	const stderr = Buffer.from(result.stderr);
	const exitCode = result.exitCode ?? (result.failed ? 1 : 0);
	if (exitCode !== 0 && !opts?.allowFailure) {
		let message = stderr.length > 0 ? stderr.toString("utf8").trim() : "";
		if (engine.id === "podman" && args[0] === "create" && /^(?:Error: )?(?:lookup init binary|container-init binary not found on the host):/mu.test(message)) message += "\nInstall catatonit on the Podman engine host, or repair its configured init_path/helper_binaries_dir in containers.conf, then retry. The init executable must be available to the engine, not only inside the sandbox image. Keep --init and sandboxing enabled so orphaned processes are reaped.";
		throw Object.assign(new Error(message || `${engine.displayName} command failed (exit ${exitCode})`), {
			code: exitCode,
			stdout,
			stderr
		});
	}
	return {
		stdout,
		stderr,
		code: exitCode
	};
}
async function execContainer(engine, args, opts) {
	const result = await execContainerRaw(engine, args, opts);
	return {
		stdout: result.stdout.toString("utf8"),
		stderr: result.stderr.toString("utf8"),
		code: result.code
	};
}
//#endregion
//#region src/agents/sandbox/podman-runtime.ts
const SANDBOX_ENGINE_PROBE_TIMEOUT_MS = 5e3;
const PODMAN_INIT_PATH = "/run/podman-init";
const PODMAN_KEEP_ID_MAPPING_MIN_VERSION = [4, 3];
const PODMAN_GPUS_MIN_VERSION = [5, 0];
function hashPodmanTarget(kind, ...parts) {
	return `${kind}:${hashTextSha256(parts.join("\0")).slice(0, 32)}`;
}
function invalidPodmanConfig(message) {
	return Object.assign(new Error(message), { code: "INVALID_CONFIG" });
}
function resolvePodmanKeepIdMode(user) {
	const normalized = user?.trim();
	if (!normalized) return "keep-id";
	const match = /^(\d+)(?::(\d+))?$/u.exec(normalized);
	if (!match) throw invalidPodmanConfig(`Rootless Podman sandbox user "${normalized}" must be a numeric UID or UID:GID so keep-id can preserve bind-mount ownership.`);
	const uid = match[1] ?? "";
	const gid = match[2];
	const normalizedUid = BigInt(uid).toString();
	const normalizedGid = gid === void 0 ? void 0 : BigInt(gid).toString();
	if (normalizedUid === "0" || normalizedGid === "0") throw invalidPodmanConfig(`Rootless Podman sandbox user "${normalized}" cannot use UID or GID 0 while preserving workspace bind ownership. Bake root-required setup into the image or use rootful Podman.`);
	return normalizedGid ? `keep-id:uid=${normalizedUid},gid=${normalizedGid}` : `keep-id:uid=${normalizedUid}`;
}
function assertPodmanVersionAtLeast(version, minimum, feature) {
	const match = /^(\d+)\.(\d+)/u.exec(version.trim());
	const actualMajor = match ? Number(match[1]) : NaN;
	const actualMinor = match ? Number(match[2]) : NaN;
	if (actualMajor > minimum[0] || actualMajor === minimum[0] && actualMinor >= minimum[1]) return;
	throw invalidPodmanConfig(`${feature} requires Podman ${minimum.join(".")} or newer, but the active engine reports "${version || "unknown"}". Upgrade Podman or choose another sandbox backend.`);
}
async function isPodmanMachineConnection(params) {
	let uri;
	try {
		uri = new URL(params.uri);
	} catch {
		return false;
	}
	const hostname = uri.hostname.replace(/^\[|\]$/gu, "");
	const loopback = isIP(hostname) === 4 && hostname.startsWith("127.") || isIP(hostname) === 6 && hostname === "::1";
	if (uri.protocol !== "ssh:" || !loopback || !uri.port || !uri.username) return false;
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"machine",
		"list",
		"--format",
		"json"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) return false;
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch {
		return false;
	}
	if (!Array.isArray(parsed)) return false;
	const selectedIdentity = params.identity ? path.resolve(params.identity) : "";
	return parsed.some((entry) => {
		if (typeof entry !== "object" || entry === null) return false;
		const machine = entry;
		const machineName = typeof machine.Name === "string" ? machine.Name : "";
		const nameMatches = !params.selectedName || params.selectedName === machineName || params.selectedName === `${machineName}-root`;
		const portMatches = (typeof machine.Port === "string" || typeof machine.Port === "number" ? String(machine.Port) : "") === uri.port;
		const connectionUser = decodeURIComponent(uri.username);
		const rootConnection = params.selectedName === `${machineName}-root`;
		const userMatches = typeof machine.RemoteUsername === "string" && (connectionUser === machine.RemoteUsername || rootConnection && connectionUser === "root");
		const machineIdentity = typeof machine.IdentityPath === "string" && machine.IdentityPath ? path.resolve(machine.IdentityPath) : "";
		const identityMatches = !selectedIdentity || !machineIdentity || selectedIdentity === machineIdentity;
		return machine.Running === true && nameMatches && portMatches && userMatches && identityMatches;
	});
}
async function assertSupportedPodmanConnection(remoteSocketPath) {
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"system",
		"connection",
		"list",
		"--format",
		"json"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) {
		const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
		throw new Error(`Failed to inspect the active Podman connection: ${detail}`);
	}
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch (error) {
		throw new Error("Podman returned invalid connection metadata", { cause: error });
	}
	const connections = Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "object" && entry !== null) : [];
	const configuredUri = process.env.CONTAINER_HOST;
	const configuredName = process.env.CONTAINER_CONNECTION;
	let useConfiguredHost = Boolean(configuredUri);
	if (configuredUri !== void 0 && configuredName) {
		const client = await execContainer(PODMAN_SANDBOX_ENGINE, ["--version"], {
			allowFailure: true,
			signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
		});
		const version = /^podman(?:-remote)?(?:\.exe)? version (\d+)\.(\d+)\.\d+(?:[-+]\S+)?$/u.exec(client.stdout.trim());
		if (client.code !== 0 || !version) throw invalidPodmanConfig("Cannot determine Podman client connection precedence. Unset either CONTAINER_HOST or CONTAINER_CONNECTION, or repair `podman --version`, before using Podman sandboxing.");
		const major = Number(version[1]);
		useConfiguredHost = major < 4 || major === 4 && Number(version[2]) < 8;
	}
	let selected;
	if (useConfiguredHost) selected = connections.find((entry) => entry.URI === configuredUri);
	else if (configuredName) selected = connections.find((entry) => entry.Name === configuredName);
	else selected = connections.find((entry) => entry.Default === true);
	const selectedUri = (useConfiguredHost ? configuredUri : typeof selected?.URI === "string" ? selected.URI : "") || (remoteSocketPath ? `unix://${remoteSocketPath}` : "");
	const unsupportedRemoteError = () => invalidPodmanConfig("Podman sandboxing supports a local Podman engine or Podman Machine, but the active Podman connection is remote or could not be identified. Use the SSH sandbox backend for a remote host.");
	if (!useConfiguredHost && configuredName && !selected) throw unsupportedRemoteError();
	if (!selectedUri) throw unsupportedRemoteError();
	if (selectedUri && !selectedUri.startsWith("unix://")) {
		const identity = useConfiguredHost ? process.env.CONTAINER_SSHKEY || "" : typeof selected?.Identity === "string" ? selected.Identity : "";
		if (await isPodmanMachineConnection({
			selectedName: typeof selected?.Name === "string" ? selected.Name : "",
			uri: selectedUri,
			identity
		})) return {
			machine: true,
			target: {
				key: hashPodmanTarget("machine", selectedUri, identity),
				globalArgs: [
					"--url",
					selectedUri,
					...identity ? ["--identity", identity] : []
				]
			}
		};
		throw unsupportedRemoteError();
	}
	return {
		machine: false,
		target: {
			key: hashPodmanTarget("socket", selectedUri),
			globalArgs: ["--url", selectedUri]
		}
	};
}
async function resolvePodmanSandboxRuntimeInfo() {
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"info",
		"--format",
		"{{.Host.Security.Rootless}}	{{.Host.ServiceIsRemote}}	{{.Host.RemoteSocket.Path}}	{{.Version.Version}}"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) {
		const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
		throw new Error(`Failed to inspect Podman user namespace mode: ${detail}`);
	}
	const [rootless = "", serviceIsRemote = "", remoteSocketPath = "", version = ""] = result.stdout.trim().split("	", 4);
	let machine = false;
	let target = {
		key: "local",
		globalArgs: []
	};
	if (serviceIsRemote === "true") ({machine, target} = await assertSupportedPodmanConnection(remoteSocketPath));
	return {
		machine,
		rootless: rootless === "true",
		target,
		version
	};
}
async function validateSandboxContainerEngineTarget(engine, expectedTarget) {
	if (engine.id === "podman") assertPodmanSandboxTarget(expectedTarget, (await resolvePodmanSandboxRuntimeInfo()).target);
}
function assertPodmanSandboxTarget(expectedTarget, actualTarget) {
	if (expectedTarget && (actualTarget.key !== expectedTarget.key || actualTarget.globalArgs.length !== expectedTarget.globalArgs.length || actualTarget.globalArgs.some((arg, index) => arg !== expectedTarget.globalArgs[index]))) throw invalidPodmanConfig("The active Podman connection changed after this sandbox runtime was created. Restore the original Podman target before inspecting, executing, or removing the runtime.");
}
function bindPodmanSandboxEngine(target) {
	return {
		...PODMAN_SANDBOX_ENGINE,
		globalArgs: target.globalArgs
	};
}
function mountTargetCoversPodmanInit(target) {
	const normalizedTarget = path.posix.normalize(target);
	return normalizedTarget === "/" || normalizedTarget === PODMAN_INIT_PATH || PODMAN_INIT_PATH.startsWith(`${normalizedTarget}/`) || normalizedTarget.startsWith(`${PODMAN_INIT_PATH}/`);
}
function assertPodmanMachineBindSourcesSupported(params) {
	const hostHome = resolveSandboxHostPathViaExistingAncestor(path.resolve(os.homedir()));
	const sources = /* @__PURE__ */ new Set([params.workspaceDir]);
	if (params.workspaceAccess !== "none" && params.workspaceDir !== params.agentWorkspaceDir) sources.add(params.agentWorkspaceDir);
	for (const mount of params.readOnlyWorkspaceSkillMounts) sources.add(mount.hostPath);
	for (const bind of params.cfg.binds ?? []) {
		const source = splitSandboxBindSpec(bind)?.host;
		if (source) sources.add(source);
	}
	for (const source of sources) {
		const canonicalSource = resolveSandboxHostPathViaExistingAncestor(path.resolve(source));
		if (isPathInside(hostHome, canonicalSource)) continue;
		throw invalidPodmanConfig(`Podman Machine sandbox bind source "${source}" is outside the default host home share "${os.homedir()}". Move the workspace or bind under the host home directory, or use Docker or the SSH sandbox backend.`);
	}
}
function resolvePodmanSandboxCreatePolicy(params) {
	const cfg = params.dockerTmpfsSource === "default" ? {
		...params.cfg,
		tmpfs: params.cfg.tmpfs.filter((entry) => entry !== "/run")
	} : params.cfg;
	if (mountTargetCoversPodmanInit(params.cfg.workdir) || cfg.tmpfs.some((entry) => mountTargetCoversPodmanInit(entry.split(":", 1)[0] || "")) || params.cfg.binds?.some((bind) => {
		const target = splitSandboxBindSpec(bind)?.container;
		return target ? mountTargetCoversPodmanInit(target) : false;
	}) === true) throw invalidPodmanConfig("Podman sandbox configuration would cover Podman's init path at /run/podman-init. Remove the conflicting tmpfs or bind mount so orphaned sandbox processes can be reaped.");
	if (params.runtimeInfo.machine) assertPodmanMachineBindSourcesSupported(params);
	if (params.cfg.gpus?.trim()) assertPodmanVersionAtLeast(params.runtimeInfo.version, PODMAN_GPUS_MIN_VERSION, "Podman sandbox GPU passthrough");
	const extraCreateArgs = ["--http-proxy=false"];
	if (params.cfg.readOnlyRoot) extraCreateArgs.push("--read-only-tmpfs=true");
	if (params.runtimeInfo.rootless) {
		if (params.cfg.user?.trim()) assertPodmanVersionAtLeast(params.runtimeInfo.version, PODMAN_KEEP_ID_MAPPING_MIN_VERSION, "Rootless Podman sandbox user mapping");
		extraCreateArgs.push("--userns", resolvePodmanKeepIdMode(params.cfg.user));
	}
	return {
		cfg,
		extraCreateArgs
	};
}
function resolvePodmanSandboxConfigHash(params) {
	const userMode = params.configuredUser ? "configured-user" : "keep-id";
	return `${params.genericConfigHash}:podman-runtime-v9:${userMode}:${params.dockerTmpfsSource}`;
}
function resolvePodmanSandboxContainerPrefix(containerPrefix) {
	return `${containerPrefix}podman-`;
}
//#endregion
export { resolvePodmanSandboxCreatePolicy as a, DOCKER_SANDBOX_ENGINE as c, execContainerRaw as d, resolvePodmanSandboxContainerPrefix as i, PODMAN_SANDBOX_ENGINE as l, bindPodmanSandboxEngine as n, resolvePodmanSandboxRuntimeInfo as o, resolvePodmanSandboxConfigHash as r, validateSandboxContainerEngineTarget as s, assertPodmanSandboxTarget as t, execContainer as u };
