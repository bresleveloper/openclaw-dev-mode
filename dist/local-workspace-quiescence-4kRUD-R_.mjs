import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { C as execContainer, g as validateSandboxContainerEngineTarget, m as bindPodmanSandboxEngine, x as DOCKER_SANDBOX_ENGINE } from "./docker-CIwPFSTC.mjs";
import { c as readRegistry, n as assertSandboxRegistryEntryCurrent, o as readBrowserRegistry, t as assertSandboxBrowserRegistryEntryCurrent } from "./registry-D02eWy_Z.mjs";
import { t as BROWSER_BRIDGES } from "./browser-bridges-CLHmKa7a.mjs";
//#region src/agents/sandbox/local-workspace-quiescence.ts
/** Both execution and browser runtimes can write the exact private mount. */
async function readLocalWorkspaceRuntimes(workspaceDir) {
	const [containers, browsers] = await Promise.all([readRegistry(), readBrowserRegistry()]);
	return [...containers.entries.filter((entry) => entry.workspaceDir === workspaceDir).map((entry) => ({
		kind: "container",
		entry,
		assertCurrent: () => assertSandboxRegistryEntryCurrent(entry)
	})), ...browsers.entries.filter((entry) => entry.workspaceDir === workspaceDir).map((entry) => ({
		kind: "browser",
		entry,
		assertCurrent: () => assertSandboxBrowserRegistryEntryCurrent(entry)
	}))];
}
function parseLocalWorkspacePausedRuntimes(raw) {
	if (!raw) return [];
	const value = JSON.parse(raw);
	if (!Array.isArray(value) || value.length > 128) throw new Error("Invalid local workspace runtime custody");
	return value.map((entry) => {
		if (!isRecord(entry) || typeof entry.name !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_.-]*$/u.test(entry.name) || typeof entry.id !== "string" || !/^[a-f0-9]{64}$/u.test(entry.id)) throw new Error("Invalid local workspace runtime custody");
		return {
			name: entry.name,
			id: entry.id
		};
	});
}
/** Caller holds the projection lease through pause, reconciliation, and resume. */
async function quiesceLocalWorkspace(params) {
	const selected = (await readLocalWorkspaceRuntimes(params.workspaceDir)).map((runtime) => ({
		runtime,
		bridges: runtime.kind === "browser" ? [...BROWSER_BRIDGES].filter(([, bridge]) => bridge.containerName === runtime.entry.containerName) : []
	}));
	params.assertCurrent();
	let paused = [...params.retained];
	const releases = [];
	const retirements = [];
	for (const { runtime, bridges } of selected) {
		const { entry } = runtime;
		const backendId = runtime.kind === "browser" ? "docker" : runtime.entry.backendId;
		const backendTarget = runtime.kind === "container" ? runtime.entry.backendTarget : void 0;
		if (backendId !== "docker" && backendId !== "podman") throw new Error("Local workspace backend cannot fence host projection writes");
		if (backendId === "podman" && !backendTarget) throw new Error("Local workspace Podman engine owner is missing");
		const engine = backendId === "podman" ? bindPodmanSandboxEngine(backendTarget) : DOCKER_SANDBOX_ENGINE;
		const captureRetirement = (id) => retirements.push(async () => {
			const { removeSandboxRuntimeGeneration } = await import("./manage-DjM_-RdS.mjs");
			await removeSandboxRuntimeGeneration({
				runtime,
				engine,
				id,
				bridges,
				assertCurrent: () => {
					params.assertCurrent();
					runtime.assertCurrent();
				}
			});
		});
		await validateSandboxContainerEngineTarget(engine, backendTarget);
		params.assertCurrent();
		runtime.assertCurrent();
		const inspect = await execContainer(engine, [
			"inspect",
			"-f",
			"{{.Id}} {{.State.Running}} {{.State.Paused}}",
			entry.containerName
		], { allowFailure: true });
		params.assertCurrent();
		if (inspect.code !== 0) {
			if (/no such (?:container|object)|does not exist/iu.test(inspect.stderr)) {
				runtime.assertCurrent();
				captureRetirement(null);
				continue;
			}
			throw new Error("Local workspace runtime could not be inspected; workspace preserved");
		}
		const [id, running, isPaused] = inspect.stdout.trim().split(/\s+/u);
		if (!id || !/^[a-f0-9]{64}$/u.test(id) || !["true", "false"].includes(running ?? "") || !["true", "false"].includes(isPaused ?? "")) throw new Error("Invalid local workspace runtime inspection");
		runtime.assertCurrent();
		captureRetirement(id);
		if (running !== "true" && isPaused !== "true") continue;
		const retained = paused.some((retainedRuntime) => retainedRuntime.name === entry.containerName && retainedRuntime.id === id);
		if (isPaused === "true" && !retained) throw new Error("Local workspace runtime was paused by another owner; resume it before retrying");
		if (!retained) {
			paused.push({
				name: entry.containerName,
				id
			});
			params.persist(paused);
		}
		if (isPaused !== "true") {
			params.assertCurrent();
			runtime.assertCurrent();
			await execContainer(engine, ["pause", id]);
		}
		releases.push(async () => {
			await validateSandboxContainerEngineTarget(engine, backendTarget);
			params.assertCurrent();
			const observed = await execContainer(engine, [
				"inspect",
				"-f",
				"{{.State.Paused}}",
				id
			], { allowFailure: true });
			params.assertCurrent();
			if (observed.code !== 0) {
				if (!/no such (?:container|object)|does not exist/iu.test(observed.stderr)) throw new Error("Local workspace runtime resume inspection failed; exact paused owner retained");
			} else if (observed.stdout.trim() === "true") {
				runtime.assertCurrent();
				const result = await execContainer(engine, ["unpause", id], { allowFailure: true });
				if (result.code !== 0 && !/no such (?:container|object)|does not exist/iu.test(result.stderr)) throw new Error("Local workspace runtime resume failed; exact paused owner retained");
			} else if (observed.stdout.trim() !== "false") throw new Error("Invalid local workspace runtime resume inspection");
			params.assertCurrent();
			paused = paused.filter((held) => held.name !== entry.containerName || held.id !== id);
			params.persist(paused);
		});
	}
	return {
		retire: async () => {
			params.assertCurrent();
			for (const retire of retirements) await retire();
			params.assertCurrent();
		},
		resume: async () => {
			params.assertCurrent();
			for (const release of releases.toReversed()) await release();
			params.assertCurrent();
			params.persist([]);
		}
	};
}
//#endregion
export { parseLocalWorkspacePausedRuntimes, quiesceLocalWorkspace, readLocalWorkspaceRuntimes };
