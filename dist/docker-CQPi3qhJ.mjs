import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as markOpenClawExecEnv } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as withContainerEnvFile } from "./container-env-file-BATVpQPA.mjs";
import { a as splitSandboxBindSpec, n as isSandboxHostPathAbsolute, r as normalizeSandboxHostPath, t as getSandboxHostPathPolicyKey } from "./host-paths-C5NtLpi_.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { C as SANDBOX_DOCKER_CREATE_ARGS_EPOCH } from "./constants-sQ6GWokQ.mjs";
import { n as MATERIALIZED_SANDBOX_SKILLS_WORKSPACE } from "./sandbox-workspace-paths-8lp0pLw0.mjs";
import { t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { a as resolveSandboxMountSelection, n as resolveMaterializedSandboxSkillsWorkspaceDir, o as resolveSandboxTmpfsMounts, s as sandboxMountOptionsReadOnly, t as normalizeMountContainerPath } from "./workspace-mounts-foAiMu-T.mjs";
import { a as resolvePodmanSandboxCreatePolicy, c as DOCKER_SANDBOX_ENGINE, d as execContainerRaw, i as resolvePodmanSandboxContainerPrefix, n as bindPodmanSandboxEngine, o as resolvePodmanSandboxRuntimeInfo, r as resolvePodmanSandboxConfigHash, t as assertPodmanSandboxTarget, u as execContainer } from "./podman-runtime-D0Q3mW9T.mjs";
import { o as computeSandboxConfigHash, r as sanitizeExplicitSandboxEnvVars, t as resolveDockerEnvPolicyEpoch } from "./sanitize-env-vars-BYC-Fvaw.mjs";
import { i as slugifySessionKey, n as resolveSandboxAgentId, t as buildSandboxContainerName } from "./shared-2nFGF-qq.mjs";
import { l as removeRegistryEntry, m as updateRegistry, r as completeSandboxRegistryReservation, s as readRegistryEntry } from "./registry-BmXc2WeW.mjs";
import { r as validateSandboxSecurity } from "./validate-sandbox-security-hKO_A4jd.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/agents/sandbox/container-inspect.ts
/** Read-only inspection of engine-owned container identities, state, labels and ports. */
/** Termination proof is stricter than provisioning's best-effort existence probe. */
async function containerHasTerminated(engine, id, signal) {
	const inspected = await execContainer(engine, [
		"inspect",
		"-f",
		"{{json .State}}",
		id
	], {
		allowFailure: true,
		signal
	});
	if (inspected.code !== 0) {
		if (inspected.stderr.includes(id) && /no such (?:container|object)|container .* does not exist|no container with name or id .* found/iu.test(inspected.stderr)) return true;
		throw new Error(`Could not verify sandbox ${id} termination: ${inspected.stderr.trim()}`);
	}
	const state = JSON.parse(inspected.stdout);
	return isRecord(state) && state.Running === false && state.Paused === false && state.Pid === 0;
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
	const result = await execContainer(DOCKER_SANDBOX_ENGINE, [
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
	const result = await execContainer(DOCKER_SANDBOX_ENGINE, [
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
async function dockerContainerState(name) {
	return await containerState(DOCKER_SANDBOX_ENGINE, name);
}
async function containerState(engine, name, options = {}) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code !== 0) {
		if (options.strict && !/no such (?:container|object)|container .* does not exist|no container with name or id .* found/iu.test(result.stderr)) throw new Error(`Unable to inspect ${engine.displayName} sandbox ${name}: ${result.stderr.trim() || `exit ${result.code}`}`);
		return {
			exists: false,
			running: false
		};
	}
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
//#endregion
//#region src/agents/sandbox/container-lifecycle.ts
/** Serialized container admission, access custody, and physical retirement. */
const log$1 = createSubsystemLogger("docker");
const sandboxContainerLifecycleQueue = new KeyedAsyncQueue();
const privateContainers = /* @__PURE__ */ new Map();
function containerAuthorityKey(engine, name) {
	return JSON.stringify([
		engine.command,
		...engine.globalArgs ?? [],
		name
	]);
}
function releasePrivateContainer(key) {
	const container = privateContainers.get(key);
	if (container) {
		privateContainers.delete(key);
		if (container.kind === "active") {
			for (const { lease, unsubscribe } of container.sources.values()) {
				unsubscribe();
				lease.release();
			}
			container.sources.clear();
		}
	}
}
function retainContainerSource(authority) {
	if (authority) assertAdmittedRunOperatorAuthority(authority);
	if (!authority?.gatewayAccessGrant || !authority.source || !authority.signal || !authority.retain) return;
	return {
		authority,
		source: authority.source,
		signal: authority.signal,
		grant: authority.gatewayAccessGrant,
		release: authority.retain(),
		adopted: false
	};
}
async function stopRevokedPrivateContainer(engine, key, container) {
	if (privateContainers.get(key) !== container || !container.revoked) return false;
	const signal = AbortSignal.timeout(3e4);
	const killed = await execContainer(engine, ["kill", container.id], {
		allowFailure: true,
		signal
	});
	if (killed.code === 0) await execContainer(engine, ["wait", container.id], { signal });
	if (!await containerHasTerminated(engine, container.id, signal)) throw new Error(`Could not verify revoked sandbox ${container.id} stopped: ${killed.stderr.trim() || "the generation is still active"}`);
	container.terminated = true;
	if (privateContainers.get(key) !== container) return false;
	releasePrivateContainer(key);
	privateContainers.set(key, {
		kind: "stopped",
		id: container.id,
		profileId: container.profileId,
		grant: container.grant
	});
	log$1.info(`Stopped private ${engine.displayName} sandbox ${container.id} after access revocation.`);
	return true;
}
function retainPrivateContainerSource(params) {
	const { container, owner } = params;
	if (container.sources.has(owner.source)) return;
	const key = containerAuthorityKey(params.engine, params.name);
	const onAbort = () => {
		const retained = container.sources.get(owner.source);
		if (retained?.lease !== owner) return;
		container.sources.delete(owner.source);
		retained.unsubscribe();
		owner.release();
		if (container.sources.size > 0) return;
		container.revoked = true;
		sandboxContainerLifecycleQueue.enqueue(params.name, () => stopRevokedPrivateContainer(params.engine, key, container)).catch((error) => log$1.error(`Private sandbox revocation cleanup failed: ${String(error)}`));
	};
	owner.adopted = true;
	container.sources.set(owner.source, {
		lease: owner,
		unsubscribe: () => owner.signal.removeEventListener("abort", onAbort)
	});
	owner.signal.addEventListener("abort", onAbort, { once: true });
	if (owner.signal.aborted) onAbort();
}
function bindSandboxContainerSource(params) {
	if (!/^[a-f0-9]{64}$/u.test(params.id)) throw new Error("Container creation did not return an immutable container ID.");
	const key = containerAuthorityKey(params.engine, params.name);
	releasePrivateContainer(key);
	const container = {
		kind: "active",
		id: params.id,
		profileId: params.owner.authority.profileId,
		grant: params.owner.grant,
		sources: /* @__PURE__ */ new Map(),
		revoked: false,
		terminated: false
	};
	privateContainers.set(key, container);
	retainPrivateContainerSource({
		...params,
		container
	});
}
/** Bound to one admitted lifetime; removal or a replacement never proves its termination. */
function captureSandboxContainerTermination(engine, name, id) {
	const container = privateContainers.get(containerAuthorityKey(engine, name));
	return container?.kind === "active" && container.id === id ? () => container.terminated : () => false;
}
async function withSandboxContainerLifecycle(name, authority, operation) {
	const source = retainContainerSource(authority);
	try {
		return await sandboxContainerLifecycleQueue.enqueue(name, () => operation(source));
	} finally {
		if (source && !source.adopted) source.release();
	}
}
/** Called under the lifecycle lock after the incoming admission is revalidated. */
async function admitSandboxContainerSource(params) {
	const key = containerAuthorityKey(params.engine, params.name);
	const container = privateContainers.get(key);
	if (!container) return false;
	if (container.id !== params.id) {
		releasePrivateContainer(key);
		return false;
	}
	const source = params.source;
	const sameGrant = source !== void 0 && source.authority.profileId === container.profileId && source.grant.pluginId === container.grant.pluginId && source.grant.grantId === container.grant.grantId;
	if (container.kind === "stopped") {
		if (!sameGrant || params.running || !await containerHasTerminated(params.engine, container.id)) {
			releasePrivateContainer(key);
			return false;
		}
		bindSandboxContainerSource({
			...params,
			owner: source
		});
		return true;
	}
	if (container.revoked) {
		if (!await stopRevokedPrivateContainer(params.engine, key, container)) return false;
		if (sameGrant) bindSandboxContainerSource({
			...params,
			owner: source
		});
		else releasePrivateContainer(key);
		return true;
	} else if (!sameGrant) releasePrivateContainer(key);
	else retainPrivateContainerSource({
		...params,
		container,
		owner: source
	});
	return false;
}
function releaseSandboxContainerSource(engine, name, id) {
	const key = containerAuthorityKey(engine, name);
	if (privateContainers.get(key)?.id === id) releasePrivateContainer(key);
}
/** Removal shares allocation's queue and releases retained source custody only after success. */
async function removeSandboxContainerRuntime(engine, name, generation) {
	await sandboxContainerLifecycleQueue.enqueue(name, async () => {
		generation?.assertCurrent();
		const key = containerAuthorityKey(engine, name);
		const retained = privateContainers.get(key);
		const target = generation ? generation.id : name;
		if (target === null) {
			if (retained) {
				const inspected = await execContainer(engine, [
					"inspect",
					"-f",
					"{{.Id}}",
					retained.id
				], { allowFailure: true });
				generation?.assertCurrent();
				if (inspected.code === 0 || !/no such (?:container|object)|does not exist/iu.test(inspected.stderr)) throw new Error("Sandbox generation absence is unconfirmed; custody retained");
				releasePrivateContainer(key);
			}
			return;
		}
		const result = await execContainer(engine, [
			"rm",
			"-f",
			target
		], { allowFailure: true });
		if (result.code !== 0) {
			const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
			if (!/No such (container|object)|does not exist/iu.test(detail)) throw new Error(`Failed to remove ${engine.displayName} sandbox runtime ${name}: ${detail}`);
		}
		if (!generation || retained?.id === target) releasePrivateContainer(key);
		generation?.assertCurrent();
	});
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
			params.containerId
		], { allowFailure: true });
		const detail = removal.stderr.trim() || removal.stdout.trim() || `exit ${removal.code}`;
		removalConfirmed = removal.code === 0 || /No such (container|object)|does not exist/iu.test(detail);
		if (!removalConfirmed) cleanupErrors.push(/* @__PURE__ */ new Error(`Failed to remove partially created sandbox ${params.containerName}: ${detail}`));
	} catch (cleanupError) {
		cleanupErrors.push(cleanupError);
	}
	if (removalConfirmed) {
		params.onRemoved?.();
		try {
			await removeRegistryEntry(params.containerName, { preserveRemovalIntent: true });
		} catch (cleanupError) {
			cleanupErrors.push(cleanupError);
		}
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
//#region src/agents/sandbox/docker.ts
async function execDockerRaw(args, opts) {
	return await execContainerRaw(DOCKER_SANDBOX_ENGINE, args, opts);
}
const log = createSubsystemLogger("docker");
const HOT_CONTAINER_WINDOW_MS = 3e5;
async function execDocker(args, opts) {
	return await execContainer(DOCKER_SANDBOX_ENGINE, args, opts);
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
async function ensureContainerImage(engine, image) {
	const result = await execContainer(engine, [
		"image",
		"inspect",
		image
	], { allowFailure: true });
	if (result.code === 0) return;
	const stderr = result.stderr.trim();
	if (!(engine.id === "docker" ? stderr.toLowerCase().includes("no such image") : /no such image|image not known|image .* not found/iu.test(stderr))) {
		if (engine.id === "docker" && isDockerDaemonUnavailable(stderr)) throw new Error(formatDockerDaemonUnavailableError(stderr));
		if (engine.id === "docker") throw new Error(`Failed to inspect sandbox image: ${stderr}`);
		throw new Error(`Failed to inspect sandbox image with ${engine.displayName}: ${stderr}`);
	}
	const missingImage = engine.id === "docker" ? `Sandbox image not found: ${image}.` : `Sandbox image not found in ${engine.displayName}: ${image}.`;
	if (image === "openclaw-sandbox:bookworm-slim") {
		const setup = engine.id === "docker" ? "scripts/sandbox-setup.sh before enabling Docker sandboxing" : `podman build -t ${image} -f scripts/docker/sandbox/Dockerfile . before enabling container sandboxing`;
		throw new Error(`${missingImage} Build it with ${setup}. The default image includes python3 for sandbox write/edit helpers; OpenClaw will not substitute plain debian:bookworm-slim.`);
	}
	throw new Error(`${missingImage} Build or pull it first.`);
}
function normalizeDockerLimit(value) {
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	return normalizeOptionalString(value);
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
	const limits = [normalizeFiniteDockerNumber(value.soft, 0), normalizeFiniteDockerNumber(value.hard, 0)].filter((limit) => limit !== void 0);
	return limits.length ? `${name}=${limits.join(":")}` : null;
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
	if (params.includeBinds !== false) appendCustomBinds(args, params.cfg.binds);
	return {
		argv: args,
		env
	};
}
function appendCustomBinds(args, binds) {
	for (const bind of binds ?? []) args.push("-v", bind);
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
	appendCustomBinds(args, params.mountPlan.binds);
	const containerId = (await withContainerEnvFile(env, async (envFile) => {
		args.push("--env-file", envFile, cfg.image, "sleep", "infinity");
		params.assertCurrent?.();
		return await execContainer(engine, args);
	})).stdout.trim();
	if (!/^[a-f0-9]{64}$/u.test(containerId)) throw new Error("Container creation did not return an immutable container ID.");
	params.onAllocated?.(containerId);
	params.assertCurrent?.();
	await execContainer(engine, ["start", containerId]);
	if (cfg.setupCommand?.trim()) {
		params.assertCurrent?.();
		await execContainer(engine, [
			"exec",
			"-i",
			containerId,
			"/bin/sh",
			"-lc",
			cfg.setupCommand
		], { signal: params.operatorAuthority?.signal });
	}
	params.assertCurrent?.();
	return containerId;
}
async function ensureSandboxContainer(params) {
	const engine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(params.scopeKey);
	const prefix = engine.id === "podman" ? resolvePodmanSandboxContainerPrefix(params.cfg.docker.containerPrefix) : params.cfg.docker.containerPrefix;
	const containerName = buildSandboxContainerName(prefix, slug);
	const assertCurrent = () => {
		params.operatorAuthority?.assertCurrent();
		params.assertCurrent?.();
	};
	return await withSandboxContainerLifecycle(containerName, params.cfg.scope === "shared" ? void 0 : params.operatorAuthority, (source) => ensureSandboxContainerLifecycle({
		...params,
		assertCurrent
	}, containerName, source));
}
async function ensureSandboxContainerLifecycle(params, containerName, source) {
	const configuredEngine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const podmanRuntimeInfo = configuredEngine.id === "podman" ? await resolvePodmanSandboxRuntimeInfo() : void 0;
	if (podmanRuntimeInfo) assertPodmanSandboxTarget(params.podmanTarget, podmanRuntimeInfo.target);
	const engine = podmanRuntimeInfo ? bindPodmanSandboxEngine(podmanRuntimeInfo.target) : configuredEngine;
	params.assertCurrent?.();
	let existingRegistryEntry = await readRegistryEntry(containerName);
	if (existingRegistryEntry?.runtimeState === "removing" || existingRegistryEntry?.runtimeState === "removing-pending") throw new Error(`Sandbox ${containerName} is being removed; retry after sandbox recreate completes.`);
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
	const needsSetupReservation = Boolean(params.cfg.docker.setupCommand?.trim()) || existingRegistryEntry?.runtimeState === "pending";
	const state = await containerState(engine, containerName, { strict: needsSetupReservation });
	let containerId = "";
	if (state.exists) {
		containerId = (await execContainer(engine, [
			"inspect",
			"--format",
			"{{.Id}}",
			containerName
		], { signal: AbortSignal.timeout(5e3) })).stdout.trim();
		if (!/^[a-f0-9]{64}$/u.test(containerId)) throw new Error("Container inspect did not return an immutable container ID.");
	}
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	const registryEntry = existingRegistryEntry ?? void 0;
	if (hasContainer) {
		if (registryEntry?.runtimeState === "pending") throw new Error(`Sandbox ${containerName} setup did not complete. Inspect the retained container and preserve needed data before explicitly recreating it.`);
		currentHash = await readContainerLabel(engine, containerName, "openclaw.configHash");
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
				const removed = await execContainer(engine, [
					"rm",
					"-f",
					containerId
				], { allowFailure: true });
				if (removed.code !== 0 && !/no such (?:container|object)|does not exist/iu.test(removed.stderr)) throw new Error(`Sandbox replacement failed; custody retained: ${removed.stderr.trim()}`);
				releaseSandboxContainerSource(engine, containerName, containerId);
				hasContainer = false;
				running = false;
			}
		}
	}
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
	if (!hasContainer) {
		if (params.workspaceSource === "managed-worktree" || needsSetupReservation) {
			params.assertCurrent?.();
			await updateRegistry(needsSetupReservation ? {
				...readyEntry,
				runtimeState: "pending"
			} : readyEntry);
		}
		let allocated = false;
		try {
			containerId = await createSandboxContainer({
				engine,
				name: containerName,
				cfg: params.cfg.docker,
				dockerTmpfsSource: params.cfg.dockerTmpfsSource,
				workspaceDir: params.workspaceDir,
				workspaceAccess: params.cfg.workspaceAccess,
				agentWorkspaceDir: params.agentWorkspaceDir,
				scopeKey: params.scopeKey,
				configHash: expectedHash,
				mountPlan,
				podmanRuntimeInfo,
				onAllocated: (id) => {
					allocated = true;
					containerId = id;
					if (source) bindSandboxContainerSource({
						engine,
						name: containerName,
						id,
						owner: source
					});
				},
				assertCurrent: params.assertCurrent,
				operatorAuthority: params.operatorAuthority
			});
			if (needsSetupReservation) await completeSandboxRegistryReservation(readyEntry);
			else if (params.workspaceSource !== "managed-worktree") await updateRegistry(readyEntry);
			params.assertCurrent?.();
			return {
				containerName,
				containerId
			};
		} catch (creationError) {
			if (!allocated) throw creationError;
			if (params.operatorAuthority?.signal?.aborted) {
				if (params.workspaceSource !== "managed-worktree" && !needsSetupReservation) await updateRegistry(readyEntry);
				throw creationError;
			}
			await throwAfterPartialSandboxCleanup({
				engine,
				containerName,
				containerId,
				creationError,
				onRemoved: () => releaseSandboxContainerSource(engine, containerName, containerId)
			});
		}
	} else {
		params.assertCurrent?.();
		if (await admitSandboxContainerSource({
			engine,
			name: containerName,
			id: containerId,
			running,
			source
		})) running = false;
		params.assertCurrent?.();
		if (!running) await execContainer(engine, ["start", containerId]);
	}
	await updateRegistry({
		...readyEntry,
		configHash: hashMismatch ? currentHash ?? void 0 : expectedHash
	});
	params.assertCurrent?.();
	return {
		containerName,
		containerId
	};
}
//#endregion
export { readContainerLabel as _, execDockerRaw as a, readDockerPort as b, prepareSandboxMountPlan as c, handleHotSandboxConfigMismatch as d, captureSandboxContainerTermination as f, dockerContainerState as g, containerState as h, execDocker as i, resolveSandboxContainerOnlyMounts as l, containerHasTerminated as m, ensureContainerImage as n, formatDockerDaemonUnavailableError as o, removeSandboxContainerRuntime as p, ensureSandboxContainer as r, isDockerDaemonUnavailable as s, buildSandboxCreateArgs as t, sandboxMountPlanMatchesContainer as u, readDockerContainerEnvVar as v, readDockerContainerLabel as y };
