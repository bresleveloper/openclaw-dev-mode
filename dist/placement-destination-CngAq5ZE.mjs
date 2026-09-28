import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.mjs";
//#region src/gateway/worker-environments/placement-destination.ts
const PROJECT_ORIGIN_TIMEOUT_MS = 4e3;
var CloudWorkerProjectProfileError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_profile";
	}
};
async function resolveProjectProfileDestination(params) {
	let originUrl = params.workspace.kind === "repository" ? params.workspace.repository.url : "";
	if (params.workspace.kind === "local") try {
		const result = await runCommandWithTimeout([
			"git",
			"-C",
			params.workspace.path,
			"config",
			"--get",
			"remote.origin.url"
		], { timeoutMs: PROJECT_ORIGIN_TIMEOUT_MS });
		if (result.code !== 0) return;
		originUrl = result.stdout.trim();
	} catch {
		return;
	}
	const projectKey = normalizeCloudRepo(originUrl);
	if (!projectKey) return;
	const profileId = params.cfg.cloudWorkers?.projectProfiles?.[projectKey];
	if (!profileId) return;
	if (!Object.hasOwn(params.cfg.cloudWorkers?.profiles ?? {}, profileId)) throw new CloudWorkerProjectProfileError(`cloudWorkers.projectProfiles mapping ${projectKey} references unconfigured profile ${profileId}`);
	return { profileId };
}
function resolveWorkerPlacementDestination(params) {
	const profileId = normalizeOptionalString(params.profileId);
	if (profileId) {
		if (!Object.hasOwn(params.cfg.cloudWorkers?.profiles ?? {}, profileId)) return err(`cloud worker profile is not configured: ${profileId}`);
		const machineClass = normalizeOptionalString(params.machineClass);
		if (params.machineClass !== void 0 && !machineClass) return err("cloud worker machine class must be non-empty");
		const os = normalizeOptionalString(params.os);
		if (params.os !== void 0 && !os) return err("cloud worker operating system must be non-empty");
		return ok({
			profileId,
			...machineClass ? { machineClass } : {},
			...os ? { os } : {}
		});
	}
	if (params.os !== void 0 || params.machineClass !== void 0) return err("cloud worker machine class and operating system require a profile id");
	const deviceId = normalizeOptionalString(params.deviceId);
	if (!deviceId) return ok(void 0);
	return ok({
		profileId: `device:${deviceId}`,
		deviceId,
		inheritedProfile: {
			providerId: DEVICE_WORKER_PROVIDER_ID,
			profileSnapshot: {
				install: "bundle",
				settings: { device: deviceId }
			}
		}
	});
}
//#endregion
export { resolveWorkerPlacementDestination as n, resolveProjectProfileDestination as t };
