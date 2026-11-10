import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
//#region src/channels/plugins/binding-targets.ts
async function ensureConfiguredBindingTargetReady(params) {
	if (!params.bindingResolution) return { ok: true };
	const driverId = params.bindingResolution.statefulTarget.driverId;
	if (driverId.trim() !== "acp") return {
		ok: false,
		error: `Configured binding target driver unavailable: ${driverId}`
	};
	const { ensureConfiguredAcpBindingTargetReady } = await import("./acp-stateful-target-driver-loaSABcP.mjs");
	try {
		params.assertActive?.();
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
	return await ensureConfiguredAcpBindingTargetReady({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		bindingResolution: params.bindingResolution
	});
}
async function resetConfiguredBindingTargetInPlace(params) {
	const { resolveAcpBindingTargetBySessionKey, resetConfiguredAcpBindingTargetInPlace } = await import("./acp-stateful-target-driver-loaSABcP.mjs");
	const bindingTarget = await resolveAcpBindingTargetBySessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!bindingTarget) return {
		ok: false,
		skipped: true
	};
	return await resetConfiguredAcpBindingTargetInPlace({
		...params,
		bindingTarget
	});
}
//#endregion
export { resetConfiguredBindingTargetInPlace as n, ensureConfiguredBindingTargetReady as t };
