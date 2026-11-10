import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./config-B3oiWDlr.mjs";
import { s as validateSandboxContainerEngineTarget, u as execContainer } from "./podman-runtime-CSMq05ZW.mjs";
import { p as removeSandboxContainerRuntime } from "./docker-D7UqpDUP.mjs";
import { n as resolveSandboxAgentId } from "./shared-BtZkFvkt.mjs";
import { c as removeBrowserRegistryEntry, d as removeSandboxRegistryRuntime, i as readBrowserRegistry, l as removeRegistryEntry, o as readRegistry, u as removeSandboxRegistryGeneration } from "./registry-BFvNacyu.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager, l as dockerSandboxBackendManager } from "./backend-B--cbVv-.mjs";
import { n as stopCachedBrowserBridge, r as stopCachedBrowserBridgesForContainer, t as BROWSER_BRIDGES } from "./browser-bridges-DdrqFpzw.mjs";
//#region src/agents/sandbox/manage.ts
function toBrowserDockerRuntimeEntry(entry) {
	return {
		...entry,
		backendId: "docker",
		runtimeLabel: entry.containerName,
		configLabelKind: "BrowserImage"
	};
}
async function listSandboxRuntimes(read, resolveRuntime, matches) {
	const config = readRuntimeConfig();
	const registry = await read();
	const results = [];
	for (const entry of registry.entries) {
		if (matches && !matches(entry)) continue;
		const selected = resolveRuntime(entry);
		const runtime = selected.manager ? await selected.manager.describeRuntime({
			entry: selected.entry,
			config,
			agentId: resolveSandboxAgentId(entry.sessionKey)
		}) : {
			running: false,
			configLabelMatch: true
		};
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
async function listSandboxContainers(matches) {
	return listSandboxRuntimes(readRegistry, (entry) => ({
		manager: getSandboxBackendManager(entry.backendId ?? "docker"),
		entry
	}), matches);
}
async function listSandboxBrowsers(matches) {
	return listSandboxRuntimes(readBrowserRegistry, (entry) => ({
		manager: dockerSandboxBackendManager,
		entry: toBrowserDockerRuntimeEntry(entry)
	}), matches);
}
/** Retire only the physical generation fenced by local workspace settlement. */
async function removeSandboxRuntimeGeneration(params) {
	const { runtime, engine, id } = params;
	const assertOwnerCurrent = () => {
		params.assertCurrent();
		if (runtime.kind === "browser" && [...BROWSER_BRIDGES].some(([key, bridge]) => bridge.containerName === runtime.entry.containerName && !params.bridges.some(([capturedKey, captured]) => capturedKey === key && captured === bridge))) throw new Error("Sandbox browser bridge generation changed during retirement");
	};
	const assertCurrent = () => {
		assertOwnerCurrent();
		runtime.assertCurrent();
	};
	if (id !== null && !/^[a-f0-9]{64}$/u.test(id)) throw new Error("Invalid sandbox runtime generation");
	assertCurrent();
	await validateSandboxContainerEngineTarget(engine, runtime.kind === "container" ? runtime.entry.backendTarget : void 0);
	assertCurrent();
	await removeSandboxContainerRuntime(engine, runtime.entry.containerName, {
		id,
		assertCurrent
	});
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
	await removeSandboxRegistryGeneration(runtime.kind, runtime.entry, assertOwnerCurrent);
}
async function removeSandboxContainer(containerName) {
	const config = readRuntimeConfig();
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
async function removeSandboxBrowserContainer(containerName) {
	const config = readRuntimeConfig();
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
