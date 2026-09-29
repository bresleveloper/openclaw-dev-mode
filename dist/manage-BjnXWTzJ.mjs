import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { C as execContainer, g as validateSandboxContainerEngineTarget } from "./docker-CIwPFSTC.mjs";
import { n as resolveSandboxAgentId } from "./shared-ByhrzAKj.mjs";
import { c as readRegistry, d as removeRegistryEntry, f as removeSandboxRegistryGeneration, o as readBrowserRegistry, p as removeSandboxRegistryRuntime, u as removeBrowserRegistryEntry } from "./registry-D02eWy_Z.mjs";
import { p as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-D4P15W-X.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager } from "./backend-CGPDIYBL.mjs";
import { n as stopCachedBrowserBridge, r as stopCachedBrowserBridgesForContainer, t as BROWSER_BRIDGES } from "./browser-bridges-CLHmKa7a.mjs";
//#region src/agents/sandbox/manage.ts
/**
* CLI-facing sandbox management helpers.
*
* Lists and removes registered runtime and browser containers using backend manager status.
*/
function toBrowserDockerRuntimeEntry(entry) {
	return {
		...entry,
		backendId: "docker",
		runtimeLabel: entry.containerName,
		configLabelKind: "BrowserImage"
	};
}
/** Lists registered sandbox containers with live backend status and config-label match state. */
async function listSandboxContainers() {
	const config = getRuntimeConfig();
	const registry = await readRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const backendId = entry.backendId ?? "docker";
		const manager = getSandboxBackendManager(backendId);
		if (!manager) {
			results.push({
				...entry,
				running: false,
				imageMatch: true
			});
			continue;
		}
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await manager.describeRuntime({
			entry,
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Lists registered browser sandbox containers with live Docker status. */
async function listSandboxBrowsers() {
	const config = getRuntimeConfig();
	const registry = await readBrowserRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await dockerSandboxBackendManager.describeRuntime({
			entry: toBrowserDockerRuntimeEntry(entry),
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Retire only the physical generation fenced by local workspace settlement. */
async function removeSandboxRuntimeGeneration(params) {
	const { runtime, engine, id } = params;
	const assertCurrent = () => {
		params.assertCurrent();
		if (runtime.kind === "browser" && [...BROWSER_BRIDGES].some(([key, bridge]) => bridge.containerName === runtime.entry.containerName && !params.bridges.some(([capturedKey, captured]) => capturedKey === key && captured === bridge))) throw new Error("Sandbox browser bridge generation changed during retirement");
	};
	if (id !== null && !/^[a-f0-9]{64}$/u.test(id)) throw new Error("Invalid sandbox runtime generation");
	assertCurrent();
	await validateSandboxContainerEngineTarget(engine, runtime.kind === "container" ? runtime.entry.backendTarget : void 0);
	assertCurrent();
	if (id !== null) {
		const removed = await execContainer(engine, [
			"rm",
			"-f",
			id
		], { allowFailure: true });
		assertCurrent();
		if (removed.code !== 0 && !/no such (?:container|object)|does not exist/iu.test(removed.stderr)) throw new Error("Sandbox runtime generation retirement failed; custody retained");
	}
	const assertAbsent = async () => {
		const named = await execContainer(engine, [
			"inspect",
			"-f",
			"{{.Id}}",
			runtime.entry.containerName
		], { allowFailure: true });
		assertCurrent();
		if (named.code === 0 || !/no such (?:container|object)|does not exist/iu.test(named.stderr)) throw new Error("Sandbox runtime generation changed or removal is unconfirmed; custody retained");
	};
	await assertAbsent();
	for (const [sessionKey, bridge] of params.bridges) {
		assertCurrent();
		await stopCachedBrowserBridge(sessionKey, bridge);
		assertCurrent();
	}
	if (params.bridges.length) await assertAbsent();
	removeSandboxRegistryGeneration(runtime.kind, runtime.entry, assertCurrent);
}
/** Removes one sandbox container from its backend and registry. */
async function removeSandboxContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readRegistry()).entries.find((item) => item.containerName === containerName);
	if (entry) {
		const backendId = entry.backendId ?? "docker";
		const manager = getSandboxBackendManager(backendId);
		if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
		await removeSandboxRegistryRuntime(entry, (current) => manager.removeRuntime({
			entry: current,
			config,
			agentId: resolveSandboxAgentId(current.sessionKey)
		}), { reserveRuntime: usesSandboxRuntimeReservations(backendId) });
		return;
	}
	await removeRegistryEntry(containerName);
}
/** Removes one browser sandbox container, registry entry, and any in-process bridge server. */
async function removeSandboxBrowserContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readBrowserRegistry()).entries.find((item) => item.containerName === containerName);
	await stopCachedBrowserBridgesForContainer(containerName);
	if (entry) await dockerSandboxBackendManager.removeRuntime({
		entry: toBrowserDockerRuntimeEntry(entry),
		config
	});
	await removeBrowserRegistryEntry(containerName);
}
//#endregion
export { removeSandboxRuntimeGeneration as a, removeSandboxContainer as i, listSandboxContainers as n, removeSandboxBrowserContainer as r, listSandboxBrowsers as t };
