import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as SandboxRuntimeRetiredError } from "./provisioning-error-bD2pXu_s.mjs";
import { f as reserveSandboxRegistryEntry, h as withSandboxRegistryEntryLock, m as updateRegistry, n as assertSandboxRegistryEntryCurrent, r as completeSandboxRegistryReservation } from "./registry-BmXc2WeW.mjs";
import { d as dockerSandboxBackendManager, f as podmanSandboxBackendManager, l as createDockerSandboxBackend, u as createPodmanSandboxBackend } from "./fs-bridge-stat-parse-BdB24h2G.mjs";
import { m as resolveRemoteShellRuntimePaths, n as createSshSandboxBackend, r as sshSandboxBackendManager } from "./ssh-backend-zD0LaFjr.mjs";
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
		const reservation = reserveSandboxRegistryEntry({
			containerName: reserveRuntimeId(params),
			backendId: params.cfg.backend,
			sessionKey: params.scopeKey,
			createdAtMs: Date.now(),
			lastUsedAtMs: Date.now(),
			image: params.cfg.docker.image,
			workspaceDir: params.workspaceDir
		});
		try {
			return await withSandboxRegistryEntryLock(reservation, async () => {
				const assertCurrent = () => {
					params.assertRuntimeCurrent?.();
					assertSandboxRegistryEntryCurrent(reservation);
				};
				assertCurrent();
				try {
					const backend = await factory({
						...params,
						workspaceDir: reservation.workspaceDir ?? params.workspaceDir,
						runtimeId: reservation.containerName,
						assertRuntimeCurrent: assertCurrent
					});
					if (backend.runtimeId !== reservation.containerName || backend.id !== reservation.backendId) throw new Error("Sandbox backend returned a runtime outside its reserved generation.");
					await completeSandboxRegistryReservation(toEntry(backend), false, {
						...guard,
						beforeLegacyApply: assertCurrent
					});
					return backend;
				} catch (error) {
					if (error instanceof SandboxRuntimeRetiredError && error.runtimeId === reservation.containerName) await completeSandboxRegistryReservation(reservation, true, {
						...guard,
						beforeLegacyApply: assertCurrent
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
export { getSandboxBackendWorkdirResolver as a, usesSandboxRuntimeReservations as c, getSandboxBackendManager as i, getSandboxBackendCapabilities as n, registerSandboxBackend as o, getSandboxBackendFactory as r, requireSandboxBackendFactory as s, createSandboxBackend as t };
