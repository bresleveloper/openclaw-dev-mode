import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { s as validateSandboxContainerEngineTarget, u as execContainer } from "./podman-runtime-D0Q3mW9T.mjs";
import { p as removeSandboxContainerRuntime } from "./docker-CQPi3qhJ.mjs";
import { n as resolveSandboxAgentId } from "./shared-2nFGF-qq.mjs";
import { c as removeBrowserRegistryEntry, d as removeSandboxRegistryRuntime, i as readBrowserRegistry, l as removeRegistryEntry, o as readRegistry, u as removeSandboxRegistryGeneration } from "./registry-BmXc2WeW.mjs";
import { d as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-Yzu4yhJD.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager } from "./backend-Bhk9VbVt.mjs";
import { n as stopCachedBrowserBridge, r as stopCachedBrowserBridgesForContainer, t as BROWSER_BRIDGES } from "./browser-bridges-BI_v0pGs.mjs";
//#region src/agents/sandbox/manage.ts
function toBrowserDockerRuntimeEntry(entry) {
	return {
		...entry,
		backendId: "docker",
		runtimeLabel: entry.containerName,
		configLabelKind: "BrowserImage"
	};
}
async function listSandboxContainers(matches) {
	const config = getRuntimeConfig();
	const registry = await readRegistry();
	const results = [];
	for (const entry of registry.entries) {
		if (matches && !matches(entry)) continue;
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
async function listSandboxBrowsers(matches) {
	const config = getRuntimeConfig();
	const registry = await readBrowserRegistry();
	const results = [];
	for (const entry of registry.entries) {
		if (matches && !matches(entry)) continue;
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
