import { o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES } from "./constants-BLghGsId.mjs";
import "./systemd-C4RkjiSR.mjs";
import { i as uninstallLegacySystemdUnits } from "./systemd-lifecycle-CWcFMVrn.mjs";
//#region src/commands/doctor-gateway-legacy-services.ts
function classifyLegacyServices(legacyServices) {
	const darwinUserServices = [];
	const linuxUserServices = [];
	const failed = [];
	for (const svc of legacyServices) {
		const userServices = svc.platform === "darwin" ? darwinUserServices : svc.platform === "linux" ? linuxUserServices : void 0;
		if (userServices && svc.scope === "user") {
			if (svc.platform === "linux" && !LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES.some((name) => svc.label === `${name}.service`)) failed.push(`${svc.label} (legacy unit name not recognized)`);
			else userServices.push(svc);
		} else failed.push(`${svc.label} (${userServices ? svc.scope : svc.platform})`);
	}
	return {
		darwinUserServices,
		linuxUserServices,
		failed
	};
}
async function cleanupLegacyLinuxUserServices(services, runtime) {
	const removed = [];
	const failed = [];
	try {
		const removedUnits = await uninstallLegacySystemdUnits({
			env: process.env,
			stdout: process.stdout
		});
		const removedByLabel = new Map(removedUnits.map((unit) => [`${unit.name}.service`, unit]));
		for (const svc of services) {
			const removedUnit = removedByLabel.get(svc.label);
			if (!removedUnit) {
				failed.push(`${svc.label} (legacy unit name not recognized)`);
				continue;
			}
			removed.push(`${svc.label} -> ${removedUnit.unitPath}`);
		}
	} catch (err) {
		runtime.error(`Legacy Linux gateway cleanup failed: ${String(err)}`);
		for (const svc of services) failed.push(`${svc.label} (linux cleanup failed)`);
	}
	return {
		removed,
		failed
	};
}
//#endregion
export { cleanupLegacyLinuxUserServices as n, classifyLegacyServices as t };
