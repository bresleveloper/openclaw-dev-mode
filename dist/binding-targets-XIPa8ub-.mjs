import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
//#region src/channels/plugins/stateful-target-drivers.ts
const registeredStatefulBindingTargetDrivers = resolveGlobalMap(Symbol.for("openclaw.statefulBindingTargetDrivers"), "plugin-registry");
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
	return registeredStatefulBindingTargetDrivers.get(id.trim()) ?? null;
}
async function resolveStatefulBindingTargetBySessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const drivers = [...registeredStatefulBindingTargetDrivers.values()];
	for (const driver of drivers) {
		const bindingTarget = await driver.resolveTargetBySessionKey?.({
			cfg: params.cfg,
			sessionKey,
			agentId: params.agentId
		});
		if (bindingTarget && getStatefulBindingTargetDriver(driver.id) === driver) return {
			driver,
			bindingTarget
		};
	}
	return null;
}
//#endregion
//#region src/channels/plugins/stateful-target-builtins.ts
const loadAcpStatefulTargetDriverModule = createLazyRuntimeModule(() => import("./acp-stateful-target-driver-BSJN67vT.mjs"));
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
	let resolved = await resolveStatefulBindingTargetBySessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!resolved) {
		await ensureStatefulTargetBuiltinsRegistered();
		resolved = await resolveStatefulBindingTargetBySessionKey({
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
