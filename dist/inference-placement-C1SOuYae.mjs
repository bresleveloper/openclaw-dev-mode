import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
//#region src/gateway/worker-environments/inference-placement.ts
/** Inference placement is a recorded provider-profile choice, not a worker fallback. */
function workerInferencePlacement(environment) {
	if (environment.providerId !== "device") return "gateway";
	const settings = environment.profileSnapshot.settings;
	const placement = isRecord(settings) ? settings.inference : void 0;
	if (placement === void 0 || placement === "gateway") return "gateway";
	if (placement !== "worker") throw new WorkerProviderError("Invalid device worker profile: cloudWorkers.profiles.<id>.settings.inference must be \"gateway\" or \"worker\".");
	return "worker";
}
/** Invalid profiles stay visible for diagnosis without advertising worker inference. */
function workerInferenceMetadata(environment) {
	const settings = environment.profileSnapshot.settings;
	try {
		return workerInferencePlacement(environment) === "worker" && isRecord(settings) && typeof settings.device === "string" && settings.device.trim() ? { inference: "worker" } : {};
	} catch {
		return {};
	}
}
//#endregion
export { workerInferencePlacement as n, workerInferenceMetadata as t };
