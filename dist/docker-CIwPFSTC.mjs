import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { i as markOpenClawExecEnv } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as withContainerEnvFile } from "./container-env-file-kGWdBAgU.mjs";
import { a as splitSandboxBindSpec, i as resolveSandboxHostPathViaExistingAncestor, n as isSandboxHostPathAbsolute, r as normalizeSandboxHostPath, t as getSandboxHostPathPolicyKey } from "./host-paths-drWtkcBg.mjs";
import "./exec-shcN2-sN.mjs";
import { i as isPlainCommandExitFailure } from "./exec-result-C4wNdxxi.mjs";
import { o as spawnCommand } from "./exec-spawn-B7redWCL.mjs";
import { C as SANDBOX_DOCKER_CREATE_ARGS_EPOCH, x as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-D1dHTp_E.mjs";
import { t as MATERIALIZED_SANDBOX_SKILLS_WORKSPACE } from "./sandbox-workspace-paths-UF9Y-Qu5.mjs";
import { t as hashTextSha256 } from "./hash-DZK-8tRm.mjs";
import { o as computeSandboxConfigHash, r as sanitizeExplicitSandboxEnvVars, t as resolveDockerEnvPolicyEpoch } from "./sanitize-env-vars-C8Jo3pLt.mjs";
import { t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { a as resolveSandboxMountSelection, n as resolveMaterializedSandboxSkillsWorkspaceDir, o as resolveSandboxTmpfsMounts, s as sandboxMountOptionsReadOnly, t as normalizeMountContainerPath } from "./workspace-mounts-COSMZIQN.mjs";
import { i as slugifySessionKey, n as resolveSandboxAgentId, t as buildSandboxContainerName } from "./shared-ByhrzAKj.mjs";
import { d as removeRegistryEntry, g as updateRegistry, l as readRegistryEntry } from "./registry-D02eWy_Z.mjs";
import { r as validateSandboxSecurity } from "./validate-sandbox-security-BbiVQRCo.mjs";
import fs from "node:fs";
import path from "node:path";
import { isIP } from "node:net";
import os from "node:os";
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
//#region src/agents/sandbox/current-config.ts
function formatSandboxRecreateHint(params) {
	const command = `openclaw sandbox recreate${params.browser ? " --browser" : ""}`;
	if (params.scope === "session") return formatCliCommand(`${command} --session ${params.sessionKey}`);
	if (params.scope === "agent") {
		const agentId = resolveSandboxAgentId(params.sessionKey) ?? "main";
		return formatCliCommand(`${command} --agent ${agentId}`);
	}
	return formatCliCommand(`${command} --all`);
}
function handleHotSandboxConfigMismatch(params) {
	const hint = formatSandboxRecreateHint(params);
	if (params.mountsChanged) throw new Error(`Sandbox mounts changed for ${params.containerName}; the running container was preserved but cannot be reused with different filesystem sources or access modes. Recreate first: ${hint}`);
	if (params.requireCurrentConfig) throw new Error(`Sandbox config changed for ${params.containerName}; restricted dispatch requires the current container config. Recreate first: ${hint}`);
	defaultRuntime.log(`Sandbox config changed for ${params.containerName} (recently used). Recreate to apply: ${hint}`);
}
//#endregion
//#region src/agents/sandbox/docker-partial-cleanup.ts
async function throwAfterPartialSandboxCleanup(params) {
	const cleanupErrors = [];
	let removalConfirmed = false;
	try {
		const removal = await execContainer(params.engine, [
			"rm",
			"-f",
			params.containerName
		], { allowFailure: true });
		const detail = removal.stderr.trim() || removal.stdout.trim() || `exit ${removal.code}`;
		removalConfirmed = removal.code === 0 || /No such (container|object)|does not exist/iu.test(detail);
		if (!removalConfirmed) cleanupErrors.push(/* @__PURE__ */ new Error(`Failed to remove partially created sandbox ${params.containerName}: ${detail}`));
	} catch (cleanupError) {
		cleanupErrors.push(cleanupError);
	}
	if (removalConfirmed) try {
		await removeRegistryEntry(params.containerName);
	} catch (cleanupError) {
		cleanupErrors.push(cleanupError);
	}
	if (cleanupErrors.length > 0) throw new AggregateError([params.creationError, ...cleanupErrors], `Sandbox ${params.containerName} creation and cleanup both failed.`, { cause: params.creationError });
	throw params.creationError;
}
//#endregion
//#region src/agents/sandbox/docker-mount-source.ts
const SELF_INSPECT_TIMEOUT_MS = 5e3;
const MAX_SELF_CANDIDATES = 8;
const SELF_IDENTITY_PROBE = "const fs=require(\"node:fs\");process.stdout.write(JSON.stringify([fs.readFileSync(\"/proc/sys/kernel/random/boot_id\",\"utf8\").trim(),fs.readlinkSync(\"/proc/self/ns/mnt\")]));";
let sourceNamespace;
function parseInspectedSandboxMounts(value, tmpfs) {
	if (!Array.isArray(value)) throw new Error("Container inspect did not return a mount table.");
	const mounts = value.map((mount) => {
		if (!isRecord(mount) || typeof mount.Type !== "string" || typeof mount.Destination !== "string" || !path.posix.isAbsolute(mount.Destination) || typeof mount.RW !== "boolean" || mount.Type === "bind" && (typeof mount.Source !== "string" || !isSandboxHostPathAbsolute(mount.Source))) throw new Error("Container inspect returned an invalid mount entry.");
		return {
			type: mount.Type,
			source: typeof mount.Source === "string" ? normalizeSandboxHostPath(mount.Source) : "",
			destination: normalizeMountContainerPath(mount.Destination),
			writable: mount.RW
		};
	});
	if (tmpfs != null && !isRecord(tmpfs)) throw new Error("Container inspect returned invalid tmpfs destinations.");
	for (const [destination, options] of Object.entries(tmpfs ?? {})) {
		if (!path.posix.isAbsolute(destination) || typeof options !== "string") throw new Error("Container inspect returned an invalid tmpfs destination.");
		mounts.push({
			type: "tmpfs",
			source: "",
			destination: normalizeMountContainerPath(destination),
			writable: !sandboxMountOptionsReadOnly(options)
		});
	}
	return [...new Map(mounts.map((mount) => [mount.destination, mount])).values()];
}
function readOptionalProcFile(file) {
	try {
		return fs.readFileSync(file, "utf8");
	} catch {
		return "";
	}
}
async function discoverSourceNamespace(engine) {
	if (engine.id !== "docker" || process.platform !== "linux") return;
	const cgroup = readOptionalProcFile("/proc/self/cgroup");
	const ids = [];
	for (const match of cgroup.matchAll(/(?:\/docker\/|docker-)([a-f0-9]{64})(?:\/|\.scope|$)/gm)) {
		const id = match[1];
		if (id) ids.push(id);
	}
	for (const line of readOptionalProcFile("/proc/self/mountinfo").split("\n")) {
		const fields = line.split(" ");
		if (!/^\/etc\/(?:hosts|hostname|resolv\.conf)$/.test(fields[4] ?? "")) continue;
		const id = fields[3]?.match(/\/containers\/([a-f0-9]{64})\/(?:hosts|hostname|resolv\.conf)$/)?.[1];
		if (id) ids.push(id);
	}
	if (!fs.existsSync("/.dockerenv") && !fs.existsSync("/run/.containerenv") && ids.length === 0) return;
	const candidates = [.../* @__PURE__ */ new Set([os.hostname(), ...ids])].slice(0, MAX_SELF_CANDIDATES);
	const signal = AbortSignal.timeout(SELF_INSPECT_TIMEOUT_MS);
	let lastError;
	try {
		const identity = JSON.stringify([fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim(), fs.readlinkSync("/proc/self/ns/mnt")]);
		for (const candidate of candidates) try {
			const result = await execContainer(engine, [
				"inspect",
				"--type",
				"container",
				"--format",
				"{\"Id\":{{json .ID}},\"Mounts\":{{json .Mounts}},\"Tmpfs\":{{json .HostConfig.Tmpfs}}}",
				candidate
			], { signal });
			const container = JSON.parse(result.stdout);
			if (!isRecord(container) || typeof container.Id !== "string" || !/^[a-f0-9]{64}$/.test(container.Id)) throw new Error("Container inspect did not return a full container ID.");
			if ((await execContainer(engine, [
				"exec",
				container.Id,
				process.execPath,
				"-e",
				SELF_IDENTITY_PROBE
			], { signal })).stdout !== identity) throw new Error("The selected Docker daemon did not identify this Gateway container.");
			return parseInspectedSandboxMounts(container.Mounts, container.Tmpfs);
		} catch (error) {
			lastError = error;
			if (signal.aborted) break;
		}
	} catch (error) {
		lastError = error;
	}
	throw new Error("Cannot resolve sandbox bind sources from this Gateway container. Connect Docker to the daemon that runs the Gateway and make its container inspectable, then restart the Gateway. A hostname alone cannot establish container identity.", { cause: lastError });
}
async function resolveDockerSourceNamespace(engine) {
	if (engine.id !== "docker" || process.platform !== "linux") return;
	const key = JSON.stringify([
		engine,
		process.env.DOCKER_HOST,
		process.env.DOCKER_CONTEXT
	]);
	if (sourceNamespace?.key === key) return await sourceNamespace.mounts;
	const pending = {
		key,
		mounts: discoverSourceNamespace(engine)
	};
	sourceNamespace = pending;
	try {
		return await pending.mounts;
	} catch (error) {
		if (sourceNamespace === pending) sourceNamespace = void 0;
		throw error;
	}
}
function translateSandboxMountSources(params) {
	const source = fs.realpathSync(params.source);
	if (!params.allowedRoots.some((root) => isPathInside(fs.realpathSync(root), source))) throw new Error(`Sandbox mount source ${params.source} escapes its Gateway workspace roots.`);
	const mount = params.mounts.filter((entry) => isPathInside(entry.destination, source)).toSorted((a, b) => b.destination.length - a.destination.length)[0];
	if (!mount || mount.type !== "bind") throw new Error(`Sandbox mount source ${params.source} ${mount ? `uses an unsupported ${mount.type} mount` : "is not backed by a Gateway bind mount"}. Bind-mount the workspace and OpenClaw state directories from the Docker host into the Gateway, then restart the Gateway.`);
	if (!mount.writable && !params.readOnly) throw new Error(`Sandbox mount source ${params.source} is read-only in the Gateway. Use workspaceAccess=ro or make the Gateway bind writable before requesting a writable sandbox.`);
	const containerPath = normalizeMountContainerPath(params.containerPath);
	const translated = [{
		hostPath: path.posix.join(mount.source, path.posix.relative(mount.destination, source)),
		containerPath,
		readOnly: params.readOnly
	}];
	for (const child of params.mounts.toSorted((a, b) => a.destination < b.destination ? -1 : a.destination > b.destination ? 1 : 0)) {
		if (child.destination === source || !isPathInside(source, child.destination)) continue;
		const target = normalizeMountContainerPath(path.posix.join(containerPath, path.posix.relative(source, child.destination)));
		if (params.shadowedTargets.some((shadow) => isPathInside(shadow, target))) continue;
		if (child.type !== "bind") throw new Error(`Sandbox mount source ${child.destination} uses an unsupported nested ${child.type} mount. Use Gateway bind mounts for this subtree or replace its sandbox destination with an explicit Docker bind, then restart the Gateway.`);
		if (!isPathInside(source, fs.realpathSync(child.destination))) throw new Error(`Sandbox mount source ${child.destination} escapes its Gateway workspace root.`);
		translated.push({
			hostPath: child.source,
			containerPath: target,
			readOnly: params.readOnly || !child.writable
		});
	}
	return translated;
}
//#endregion
//#region src/agents/sandbox/mount-plan.ts
async function prepareSandboxMountPlan(params) {
	const selection = resolveSandboxMountSelection(params);
	const namespace = await resolveDockerSourceNamespace(params.engine);
	const relativeSkillMount = `${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}/skills`;
	const skillTarget = normalizeMountContainerPath(`${params.workdir}/${relativeSkillMount}`);
	if (params.workspaceSource === "managed-worktree" && selection.readOnlyWorkspaceSkillMounts.some((mount) => mount.containerPath === skillTarget)) await (await root(params.workspaceDir, {
		mode: 493,
		mutationSymlinks: "reject",
		assertBeforeMutation: params.assertCurrent
	})).mkdir(relativeSkillMount);
	const allowedRoots = [
		params.workspaceDir,
		params.agentWorkspaceDir,
		params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(params.agentWorkspaceDir),
		...(params.readOnlyResourceMounts ?? []).map((mount) => mount.hostPath)
	];
	const targets = selection.mounts.map((mount) => mount.containerPath);
	const binds = /* @__PURE__ */ new Map();
	for (const mount of selection.mounts) {
		const target = normalizeMountContainerPath(mount.containerPath);
		if (mount.source === "bind") continue;
		const translated = namespace ? translateSandboxMountSources({
			source: mount.hostPath,
			containerPath: target,
			allowedRoots,
			mounts: namespace,
			readOnly: mount.readOnly,
			shadowedTargets: targets.filter((other) => other !== target && isPathInside(target, other))
		}) : [{
			...mount,
			containerPath: target
		}];
		for (const projected of translated) binds.set(projected.containerPath, `${projected.hostPath}:${projected.containerPath}:${projected.readOnly ? "ro,z" : "z"}`);
	}
	for (const bind of selection.custom) {
		const parsed = splitSandboxBindSpec(bind);
		binds.set(parsed ? normalizeMountContainerPath(parsed.container) : bind, bind);
	}
	return {
		binds: [...binds.values()],
		skippedBinds: selection.skippedBinds,
		readOnlyWorkspaceSkillMounts: selection.readOnlyWorkspaceSkillMounts,
		tmpfs: resolveSandboxTmpfsMounts(params.tmpfs)
	};
}
async function inspectSandboxMounts(params) {
	const inspected = await execContainer(params.engine, [
		"inspect",
		"--format",
		"{\"Mounts\":{{json .Mounts}},\"Tmpfs\":{{json .HostConfig.Tmpfs}}}",
		params.containerName
	], { signal: AbortSignal.timeout(5e3) });
	const data = JSON.parse(inspected.stdout);
	if (!isRecord(data)) throw new Error("Container inspect did not return mount metadata.");
	return parseInspectedSandboxMounts(data.Mounts, data.Tmpfs);
}
async function resolveSandboxContainerOnlyMounts(params) {
	params.assertCurrent?.();
	const inspected = await inspectSandboxMounts(params);
	params.assertCurrent?.();
	const { stdout } = await execContainer(params.engine, [
		"exec",
		params.containerName,
		"cat",
		"/proc/self/mountinfo"
	], { signal: AbortSignal.timeout(5e3) });
	const entries = /* @__PURE__ */ new Map();
	for (const line of stdout.split("\n")) {
		if (!line) continue;
		const separator = line.indexOf(" - ");
		const [id, parent, device, root, destination, options] = line.slice(0, separator).split(" ");
		if (separator < 0 || !id || !parent || !device || !root || !destination || !options) throw new Error("Container mountinfo returned an invalid mount entry.");
		entries.set(id, {
			id,
			parent,
			destination: decodeMountInfoPath(destination),
			backing: `${device}\0${decodeMountInfoPath(root)}`,
			writable: options.split(",").includes("rw")
		});
	}
	if (entries.size === 0) throw new Error("Container mountinfo did not return a mount table.");
	const byDestination = /* @__PURE__ */ new Map();
	const byParent = /* @__PURE__ */ new Map();
	const covered = /* @__PURE__ */ new Set();
	for (const entry of entries.values()) {
		const group = byDestination.get(entry.destination) ?? [];
		group.push(entry);
		byDestination.set(entry.destination, group);
		const siblings = byParent.get(entry.parent) ?? [];
		siblings.push(entry);
		byParent.set(entry.parent, siblings);
		if (entries.get(entry.parent)?.destination === entry.destination && entry.parent !== entry.id) covered.add(entry.parent);
	}
	const visible = (entry) => {
		const visited = /* @__PURE__ */ new Set();
		for (let current = entry; !visited.has(current.id);) {
			visited.add(current.id);
			const parent = entries.get(current.parent);
			if (!parent || parent.id === current.id) return true;
			if (parent.destination !== current.destination && covered.has(parent.id)) return false;
			if (byParent.get(current.parent)?.some((sibling) => sibling.id !== parent.id && sibling.destination !== current.destination && isPathInsideContainerRoot(sibling.destination, current.destination))) return false;
			current = parent;
		}
		return false;
	};
	const masks = new Set(byDestination.keys());
	for (const mount of inspected) {
		const group = byDestination.get(mount.destination) ?? [];
		const tops = group.filter((entry) => !covered.has(entry.id) && visible(entry));
		const top = tops[0];
		if (mount.type === "bind" && tops.length === 1 && top && top.writable === mount.writable && group.every((entry) => entry.backing === top.backing)) masks.delete(mount.destination);
		else masks.add(mount.destination);
	}
	return [...masks];
}
async function sandboxMountPlanMatchesContainer(params) {
	const actual = await inspectSandboxMounts(params);
	const expected = new Map(params.plan.binds.flatMap((bind) => {
		const parsed = splitSandboxBindSpec(bind);
		if (!parsed) return [];
		return [[normalizeMountContainerPath(parsed.container), parsed]];
	}));
	const coversBind = (destination) => [...expected.keys()].some((root) => isPathInside(root, destination));
	const expectedTmpfs = new Map(params.plan.tmpfs.filter((mount) => coversBind(mount.containerPath)).map((mount) => [mount.containerPath, mount]));
	const managed = actual.filter((mount) => mount.type === "bind" || expected.has(mount.destination) || mount.type === "tmpfs" && coversBind(mount.destination));
	return managed.length === expected.size + expectedTmpfs.size && managed.every((mount) => {
		if (mount.type === "tmpfs") {
			const tmpfs = expectedTmpfs.get(mount.destination);
			return tmpfs !== void 0 && mount.writable === !tmpfs.readOnly;
		}
		const bind = expected.get(mount.destination);
		return bind !== void 0 && mount.type === "bind" && getSandboxHostPathPolicyKey(mount.source) === getSandboxHostPathPolicyKey(bind.host) && mount.writable === !bind.options.split(",").includes("ro");
	});
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
	const configuredUri = process.env.CONTAINER_HOST?.trim();
	const configuredName = process.env.CONTAINER_CONNECTION?.trim();
	let selected;
	if (configuredUri) selected = connections.find((entry) => entry.URI === configuredUri);
	else if (configuredName) selected = connections.find((entry) => entry.Name === configuredName);
	else selected = connections.find((entry) => entry.Default === true);
	const selectedUri = configuredUri || (typeof selected?.URI === "string" ? selected.URI : "") || (remoteSocketPath ? `unix://${remoteSocketPath}` : "");
	const unsupportedRemoteError = () => invalidPodmanConfig("Podman sandboxing supports a local Podman engine or Podman Machine, but the active Podman connection is remote or could not be identified. Use the SSH sandbox backend for a remote host.");
	if (!configuredUri && configuredName && !selected) throw unsupportedRemoteError();
	if (!selectedUri) throw unsupportedRemoteError();
	if (selectedUri && !selectedUri.startsWith("unix://")) {
		const identity = process.env.CONTAINER_SSHKEY?.trim() || (typeof selected?.Identity === "string" ? selected.Identity : "");
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
//#region src/agents/sandbox/docker.ts
/**
* Low-level Docker command helpers for sandbox runtimes.
*
* Wraps Docker spawn, environment sanitization, container inspection, creation, and exec behavior.
*/
async function execDockerRaw(args, opts) {
	return await execContainerRaw(DOCKER_SANDBOX_ENGINE, args, opts);
}
const log = createSubsystemLogger("docker");
const HOT_CONTAINER_WINDOW_MS = 3e5;
const sandboxContainerLifecycleQueue = new KeyedAsyncQueue();
async function execDocker(args, opts) {
	const result = await execDockerRaw(args, opts);
	return {
		stdout: result.stdout.toString("utf8"),
		stderr: result.stderr.toString("utf8"),
		code: result.code
	};
}
async function readDockerContainerLabel(containerName, label) {
	return await readContainerLabel(DOCKER_SANDBOX_ENGINE, containerName, label);
}
async function readContainerLabel(engine, containerName, label) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		`{{ index .Config.Labels "${label}" }}`,
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const raw = result.stdout.trim();
	if (!raw || raw === "<no value>") return null;
	return raw;
}
async function readDockerContainerEnvVar(containerName, envVar) {
	const result = await execDocker([
		"inspect",
		"-f",
		"{{range .Config.Env}}{{println .}}{{end}}",
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	for (const line of result.stdout.split(/\r?\n/)) if (line.startsWith(`${envVar}=`)) return line.slice(envVar.length + 1);
	return null;
}
async function readDockerPort(containerName, port) {
	const result = await execDocker([
		"port",
		containerName,
		`${port}/tcp`
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const match = (result.stdout.trim().split(/\r?\n/)[0] ?? "").match(/:(\d+)\s*$/);
	if (!match) return null;
	const mapped = Number.parseInt(match[1] ?? "", 10);
	return Number.isFinite(mapped) ? mapped : null;
}
const DOCKER_DAEMON_UNAVAILABLE_MARKERS = [
	"cannot connect to the docker daemon",
	"dial unix",
	"docker daemon is not running",
	"connection refused"
];
function isDockerDaemonUnavailable(stderr) {
	return DOCKER_DAEMON_UNAVAILABLE_MARKERS.some((marker) => stderr.toLowerCase().includes(marker));
}
function formatDockerDaemonUnavailableError(stderr) {
	const detail = stderr.trim();
	return [
		"Sandbox mode requires Docker, but the Docker daemon is not available.",
		"Start Docker, or set `agents.defaults.sandbox.mode=off` to disable sandboxing.",
		detail ? `Docker said: ${detail}` : void 0
	].filter((line) => Boolean(line)).join(" ");
}
async function inspectContainerImage(engine, image) {
	const result = await execContainer(engine, [
		"image",
		"inspect",
		image
	], { allowFailure: true });
	if (result.code === 0) return "exists";
	const stderr = result.stderr.trim();
	if (engine.id === "docker" ? stderr.toLowerCase().includes("no such image") : /no such image|image not known|image .* not found/iu.test(stderr)) return "missing";
	if (engine.id === "docker" && isDockerDaemonUnavailable(stderr)) throw new Error(formatDockerDaemonUnavailableError(stderr));
	if (engine.id === "docker") throw new Error(`Failed to inspect sandbox image: ${stderr}`);
	throw new Error(`Failed to inspect sandbox image with ${engine.displayName}: ${stderr}`);
}
async function ensureContainerImage(engine, image) {
	if (await inspectContainerImage(engine, image) === "exists") return;
	if (image === "openclaw-sandbox:bookworm-slim") {
		if (engine.id === "docker") throw new Error(`Sandbox image not found: ${image}. Build it with scripts/sandbox-setup.sh before enabling Docker sandboxing. The default image includes python3 for sandbox write/edit helpers; OpenClaw will not substitute plain debian:bookworm-slim.`);
		throw new Error(`Sandbox image not found in ${engine.displayName}: ${image}. Build it with podman build -t ${image} -f scripts/docker/sandbox/Dockerfile . before enabling container sandboxing. The default image includes python3 for sandbox write/edit helpers; OpenClaw will not substitute plain debian:bookworm-slim.`);
	}
	if (engine.id === "docker") throw new Error(`Sandbox image not found: ${image}. Build or pull it first.`);
	throw new Error(`Sandbox image not found in ${engine.displayName}: ${image}. Build or pull it first.`);
}
async function dockerContainerState(name) {
	return await containerState(DOCKER_SANDBOX_ENGINE, name);
}
async function containerState(engine, name) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code !== 0) return {
		exists: false,
		running: false
	};
	return {
		exists: true,
		running: result.stdout.trim() === "true"
	};
}
function isPodmanContainerNotFound(stderr) {
	return /no such container/iu.test(stderr) || /no container with name or id .* found/iu.test(stderr) || /container .* does not exist/iu.test(stderr);
}
async function recordedPodmanContainerState(engine, name) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code === 0) return {
		exists: true,
		running: result.stdout.trim() === "true"
	};
	if (isPodmanContainerNotFound(result.stderr)) return {
		exists: false,
		running: false
	};
	const detail = result.stderr.trim();
	throw Object.assign(/* @__PURE__ */ new Error(detail ? `Unable to inspect recorded Podman sandbox runtime ${name}: ${detail}` : `Unable to inspect recorded Podman sandbox runtime ${name} (exit ${result.code})`), { code: result.code });
}
function normalizeDockerLimit(value) {
	if (value === void 0 || value === null) return;
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function normalizeFiniteDockerNumber(value, min) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(min, value) : void 0;
}
function formatUlimitValue(name, value) {
	if (!name.trim()) return null;
	if (typeof value === "number") {
		const normalized = normalizeFiniteDockerNumber(value, 0);
		return normalized === void 0 ? null : `${name}=${normalized}`;
	}
	if (typeof value === "string") {
		const raw = value.trim();
		return raw ? `${name}=${raw}` : null;
	}
	const soft = normalizeFiniteDockerNumber(value.soft, 0);
	const hard = normalizeFiniteDockerNumber(value.hard, 0);
	if (soft === void 0 && hard === void 0) return null;
	if (soft === void 0) return `${name}=${hard}`;
	if (hard === void 0) return `${name}=${soft}`;
	return `${name}=${soft}:${hard}`;
}
function buildSandboxCreateArgs(params) {
	validateSandboxSecurity({
		...params.cfg,
		allowedSourceRoots: params.bindSourceRoots,
		allowSourcesOutsideAllowedRoots: params.allowSourcesOutsideAllowedRoots ?? params.cfg.dangerouslyAllowExternalBindSources === true,
		allowReservedContainerTargets: params.allowReservedContainerTargets ?? params.cfg.dangerouslyAllowReservedContainerTargets === true,
		dangerouslyAllowContainerNamespaceJoin: params.allowContainerNamespaceJoin ?? params.cfg.dangerouslyAllowContainerNamespaceJoin === true
	});
	const createdAtMs = params.createdAtMs ?? Date.now();
	const args = [
		"create",
		"--name",
		params.name
	];
	args.push("--init");
	args.push("--label", "openclaw.sandbox=1");
	args.push("--label", `openclaw.sessionKey=${params.scopeKey}`);
	args.push("--label", `openclaw.createdAtMs=${createdAtMs}`);
	args.push("--label", `openclaw.mountFormatVersion=4`);
	args.push("--label", `openclaw.createArgsEpoch=${SANDBOX_DOCKER_CREATE_ARGS_EPOCH}`);
	if (params.configHash) args.push("--label", `openclaw.configHash=${params.configHash}`);
	for (const [key, value] of Object.entries(params.labels ?? {})) if (key && value) args.push("--label", `${key}=${value}`);
	if (params.cfg.readOnlyRoot) args.push("--read-only");
	for (const entry of params.cfg.tmpfs) args.push("--tmpfs", entry);
	if (params.cfg.network) args.push("--network", params.cfg.network);
	if (params.cfg.user) args.push("--user", params.cfg.user);
	const envSanitization = sanitizeExplicitSandboxEnvVars(params.cfg.env ?? {});
	if (envSanitization.blocked.length > 0) log.warn(`Blocked invalid configured sandbox environment variables: ${envSanitization.blocked.join(", ")}`);
	if (envSanitization.warnings.length > 0) log.warn(`Suspicious configured sandbox environment variables: ${envSanitization.warnings.join(", ")}`);
	const env = markOpenClawExecEnv(envSanitization.allowed);
	for (const cap of params.cfg.capDrop) args.push("--cap-drop", cap);
	args.push("--security-opt", "no-new-privileges");
	if (params.cfg.seccompProfile) args.push("--security-opt", `seccomp=${params.cfg.seccompProfile}`);
	if (params.cfg.apparmorProfile) args.push("--security-opt", `apparmor=${params.cfg.apparmorProfile}`);
	for (const entry of params.cfg.dns ?? []) if (entry.trim()) args.push("--dns", entry);
	for (const entry of params.cfg.extraHosts ?? []) if (entry.trim()) args.push("--add-host", entry);
	const pidsLimit = normalizeFiniteDockerNumber(params.cfg.pidsLimit, 0);
	if (pidsLimit !== void 0 && pidsLimit > 0) args.push("--pids-limit", String(pidsLimit));
	const memory = normalizeDockerLimit(params.cfg.memory);
	if (memory) args.push("--memory", memory);
	const memorySwap = normalizeDockerLimit(params.cfg.memorySwap);
	if (memorySwap) args.push("--memory-swap", memorySwap);
	const cpus = normalizeFiniteDockerNumber(params.cfg.cpus, 0);
	if (cpus !== void 0 && cpus > 0) args.push("--cpus", String(cpus));
	const gpus = params.cfg.gpus?.trim();
	if (gpus) args.push("--gpus", gpus);
	for (const [name, value] of Object.entries(params.cfg.ulimits ?? {})) {
		const formatted = formatUlimitValue(name, value);
		if (formatted) args.push("--ulimit", formatted);
	}
	if (params.includeBinds !== false && params.cfg.binds?.length) for (const bind of params.cfg.binds) args.push("-v", bind);
	return {
		argv: args,
		env
	};
}
function appendCustomBinds(args, cfg) {
	if (!cfg.binds?.length) return;
	for (const bind of cfg.binds) args.push("-v", bind);
}
async function createSandboxContainer(params) {
	const { engine, name, cfg, workspaceDir, scopeKey } = params;
	const podmanPolicy = engine.id === "podman" && params.podmanRuntimeInfo ? resolvePodmanSandboxCreatePolicy({
		cfg,
		dockerTmpfsSource: params.dockerTmpfsSource,
		workspaceDir,
		workspaceAccess: params.workspaceAccess,
		agentWorkspaceDir: params.agentWorkspaceDir,
		readOnlyWorkspaceSkillMounts: params.mountPlan.readOnlyWorkspaceSkillMounts,
		runtimeInfo: params.podmanRuntimeInfo
	}) : void 0;
	const createCfg = podmanPolicy?.cfg ?? cfg;
	await ensureContainerImage(engine, cfg.image);
	const { argv: args, env } = buildSandboxCreateArgs({
		name,
		cfg: createCfg,
		scopeKey,
		configHash: params.configHash,
		includeBinds: false,
		bindSourceRoots: [workspaceDir, params.agentWorkspaceDir]
	});
	if (podmanPolicy) args.push(...podmanPolicy.extraCreateArgs);
	args.push("--workdir", cfg.workdir);
	for (const bind of params.mountPlan.skippedBinds) log.warn(`sandbox: skipping user bind "${bind}" — container path conflicts with a protected read-only skill mount`);
	appendCustomBinds(args, {
		...cfg,
		binds: params.mountPlan.binds
	});
	await withContainerEnvFile(env, async (envFile) => {
		args.push("--env-file", envFile, cfg.image, "sleep", "infinity");
		params.assertCurrent?.();
		await execContainer(engine, args);
	});
	params.onAllocated?.();
	params.assertCurrent?.();
	await execContainer(engine, ["start", name]);
	if (cfg.setupCommand?.trim()) {
		params.assertCurrent?.();
		await execContainer(engine, [
			"exec",
			"-i",
			name,
			"/bin/sh",
			"-lc",
			cfg.setupCommand
		]);
	}
}
async function readContainerConfigHash(engine, containerName) {
	return await readContainerLabel(engine, containerName, "openclaw.configHash");
}
async function ensureSandboxContainer(params) {
	const engine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(params.scopeKey);
	const prefix = engine.id === "podman" ? resolvePodmanSandboxContainerPrefix(params.cfg.docker.containerPrefix) : params.cfg.docker.containerPrefix;
	const containerName = buildSandboxContainerName(prefix, slug);
	return await sandboxContainerLifecycleQueue.enqueue(containerName, async () => {
		return await ensureSandboxContainerLifecycle(params, containerName);
	});
}
async function ensureSandboxContainerLifecycle(params, containerName) {
	const configuredEngine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const podmanRuntimeInfo = configuredEngine.id === "podman" ? await resolvePodmanSandboxRuntimeInfo() : void 0;
	if (podmanRuntimeInfo) assertPodmanSandboxTarget(params.podmanTarget, podmanRuntimeInfo.target);
	const engine = podmanRuntimeInfo ? bindPodmanSandboxEngine(podmanRuntimeInfo.target) : configuredEngine;
	let existingRegistryEntry = await readRegistryEntry(containerName);
	if (engine.id === "podman" && existingRegistryEntry) {
		if (!existingRegistryEntry.backendTarget) throw Object.assign(/* @__PURE__ */ new Error(`Podman sandbox runtime ${containerName} has no recorded engine target. Remove that unshipped runtime manually before recreating it.`), { code: "INVALID_CONFIG" });
		try {
			assertPodmanSandboxTarget(existingRegistryEntry.backendTarget, podmanRuntimeInfo.target);
		} catch (error) {
			if (existingRegistryEntry.backendTarget.globalArgs.length === 0) throw error;
			if ((await recordedPodmanContainerState(bindPodmanSandboxEngine(existingRegistryEntry.backendTarget), containerName)).exists) throw error;
			await removeRegistryEntry(containerName);
			existingRegistryEntry = null;
		}
	}
	const mountPlan = await prepareSandboxMountPlan({
		engine,
		workspaceDir: params.workspaceDir,
		workspaceSource: params.workspaceSource,
		assertCurrent: params.assertCurrent,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		workdir: params.cfg.docker.workdir,
		workspaceAccess: params.cfg.workspaceAccess,
		binds: params.cfg.docker.binds,
		tmpfs: params.cfg.docker.tmpfs,
		readOnlyResourceMounts: params.readOnlyResourceMounts
	});
	const genericConfigHash = computeSandboxConfigHash({
		docker: params.cfg.docker,
		dockerEnvPolicyEpoch: resolveDockerEnvPolicyEpoch(params.cfg.docker.env),
		workspaceAccess: params.cfg.workspaceAccess,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		mountFormatVersion: 4,
		createArgsEpoch: SANDBOX_DOCKER_CREATE_ARGS_EPOCH,
		managedMounts: mountPlan.binds
	});
	const expectedHash = engine.id === "podman" ? resolvePodmanSandboxConfigHash({
		genericConfigHash,
		configuredUser: Boolean(params.cfg.docker.user),
		dockerTmpfsSource: params.cfg.dockerTmpfsSource
	}) : genericConfigHash;
	const now = Date.now();
	const state = await containerState(engine, containerName);
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	const registryEntry = existingRegistryEntry ?? void 0;
	if (hasContainer) {
		currentHash = await readContainerConfigHash(engine, containerName);
		if (!currentHash) currentHash = registryEntry?.configHash ?? null;
		hashMismatch = !currentHash || currentHash !== expectedHash;
		if (hashMismatch) {
			const lastUsedAtMs = registryEntry?.lastUsedAtMs;
			if (running && (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_CONTAINER_WINDOW_MS)) {
				const mountsMatch = params.requireCurrentConfig || await sandboxMountPlanMatchesContainer({
					engine,
					containerName,
					plan: mountPlan
				});
				handleHotSandboxConfigMismatch({
					containerName,
					scope: params.cfg.scope,
					sessionKey: params.scopeKey,
					mountsChanged: !mountsMatch,
					...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
				});
			} else {
				params.assertCurrent?.();
				await execContainer(engine, [
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				hasContainer = false;
				running = false;
			}
		}
	}
	if (!hasContainer) {
		const readyEntry = {
			containerName,
			backendId: engine.id,
			...podmanRuntimeInfo ? { backendTarget: podmanRuntimeInfo.target } : {},
			runtimeLabel: containerName,
			sessionKey: params.scopeKey,
			workspaceDir: params.workspaceDir,
			createdAtMs: now,
			lastUsedAtMs: now,
			image: params.cfg.docker.image,
			configLabelKind: "Image",
			configHash: expectedHash
		};
		if (params.workspaceSource === "managed-worktree") {
			params.assertCurrent?.();
			await updateRegistry(readyEntry);
		}
		let allocated = false;
		try {
			await createSandboxContainer({
				engine,
				name: containerName,
				cfg: params.cfg.docker,
				dockerTmpfsSource: params.cfg.dockerTmpfsSource,
				workspaceDir: params.workspaceDir,
				workspaceAccess: params.cfg.workspaceAccess,
				agentWorkspaceDir: params.agentWorkspaceDir,
				skillsWorkspaceDir: params.skillsWorkspaceDir,
				scopeKey: params.scopeKey,
				configHash: expectedHash,
				mountPlan,
				podmanRuntimeInfo,
				onAllocated: () => {
					allocated = true;
				},
				assertCurrent: params.assertCurrent
			});
			if (params.workspaceSource !== "managed-worktree") await updateRegistry(readyEntry);
			return containerName;
		} catch (creationError) {
			if (!allocated) throw creationError;
			await throwAfterPartialSandboxCleanup({
				engine,
				containerName,
				creationError
			});
		}
	} else if (!running) {
		params.assertCurrent?.();
		await execContainer(engine, ["start", containerName]);
	}
	await updateRegistry({
		containerName,
		backendId: engine.id,
		...podmanRuntimeInfo ? { backendTarget: podmanRuntimeInfo.target } : {},
		runtimeLabel: containerName,
		sessionKey: params.scopeKey,
		workspaceDir: params.workspaceDir,
		createdAtMs: now,
		lastUsedAtMs: now,
		image: params.cfg.docker.image,
		configLabelKind: "Image",
		configHash: hashMismatch && running ? currentHash ?? void 0 : expectedHash
	});
	return containerName;
}
//#endregion
export { execContainer as C, PODMAN_SANDBOX_ENGINE as S, prepareSandboxMountPlan as _, ensureSandboxContainer as a, handleHotSandboxConfigMismatch as b, formatDockerDaemonUnavailableError as c, readDockerContainerEnvVar as d, readDockerContainerLabel as f, validateSandboxContainerEngineTarget as g, resolvePodmanSandboxRuntimeInfo as h, ensureContainerImage as i, isDockerDaemonUnavailable as l, bindPodmanSandboxEngine as m, containerState as n, execDocker as o, readDockerPort as p, dockerContainerState as r, execDockerRaw as s, buildSandboxCreateArgs as t, readContainerLabel as u, resolveSandboxContainerOnlyMounts as v, execContainerRaw as w, DOCKER_SANDBOX_ENGINE as x, sandboxMountPlanMatchesContainer as y };
