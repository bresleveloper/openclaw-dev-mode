import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/channels/plugins/stateful-target-drivers.ts
const registeredStatefulBindingTargetDrivers = resolveGlobalMap(Symbol.for("openclaw.statefulBindingTargetDrivers"), "plugin-registry");
function listStatefulBindingTargetDrivers() {
	return [...registeredStatefulBindingTargetDrivers.values()];
}
function registerStatefulBindingTargetDriver(driver) {
	const id = driver.id.trim();
	if (!id) throw new Error("Stateful binding target driver id is required");
	const normalized = {
		...driver,
		id
	};
	if (registeredStatefulBindingTargetDrivers.get(id)) return () => {};
	registeredStatefulBindingTargetDrivers.set(id, normalized);
	return () => {
		if (registeredStatefulBindingTargetDrivers.get(id) === normalized) registeredStatefulBindingTargetDrivers.delete(id);
	};
}
function getStatefulBindingTargetDriver(id) {
	const normalizedId = id.trim();
	if (!normalizedId) return null;
	return registeredStatefulBindingTargetDrivers.get(normalizedId) ?? null;
}
function resolveStatefulBindingTargetBySessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	for (const driver of listStatefulBindingTargetDrivers()) {
		const bindingTarget = driver.resolveTargetBySessionKey?.({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		if (bindingTarget) return {
			driver,
			bindingTarget
		};
	}
	return null;
}
//#endregion
//#region src/channels/plugins/stateful-target-builtins.ts
/**
* Built-in stateful binding target registration.
*
* Lazily registers ACP target drivers so non-ACP channel flows avoid ACP runtime imports.
*/
const loadAcpStatefulTargetDriverModule = createLazyRuntimeModule(() => import("./acp-stateful-target-driver-DCigWEMm.mjs"));
function isStatefulTargetBuiltinDriverId(id) {
	return id.trim() === "acp";
}
async function ensureStatefulTargetBuiltinsRegistered() {
	try {
		const { acpStatefulBindingTargetDriver } = await loadAcpStatefulTargetDriverModule();
		registerStatefulBindingTargetDriver(acpStatefulBindingTargetDriver);
	} catch (error) {
		loadAcpStatefulTargetDriverModule.clear();
		throw error;
	}
}
//#endregion
//#region src/channels/plugins/binding-targets.ts
/**
* Configured binding target lifecycle helpers.
*
* Ensures or resets stateful binding targets through registered target drivers.
*/
/**
* Ensures the stateful target driver for a configured binding is ready to receive traffic.
*/
async function ensureConfiguredBindingTargetReady(params) {
	if (!params.bindingResolution) return { ok: true };
	const driverId = params.bindingResolution.statefulTarget.driverId;
	let driver = getStatefulBindingTargetDriver(driverId);
	if (!driver && isStatefulTargetBuiltinDriverId(driverId)) {
		await ensureStatefulTargetBuiltinsRegistered();
		driver = getStatefulBindingTargetDriver(driverId);
	}
	if (!driver) return {
		ok: false,
		error: `Configured binding target driver unavailable: ${driverId}`
	};
	try {
		params.assertActive?.();
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
	return await driver.ensureReady({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		bindingResolution: params.bindingResolution
	});
}
/**
* Resets a stateful configured binding target in place when its driver supports reset.
*/
async function resetConfiguredBindingTargetInPlace(params) {
	let resolved = resolveStatefulBindingTargetBySessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!resolved) {
		await ensureStatefulTargetBuiltinsRegistered();
		resolved = resolveStatefulBindingTargetBySessionKey({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
	}
	if (!resolved?.driver.resetInPlace) return {
		ok: false,
		skipped: true
	};
	return await resolved.driver.resetInPlace({
		...params,
		bindingTarget: resolved.bindingTarget
	});
}
//#endregion
export { resetConfiguredBindingTargetInPlace as n, ensureConfiguredBindingTargetReady as t };
