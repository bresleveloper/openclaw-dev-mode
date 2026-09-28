import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./gateway-runtime-BCC8MoQW.mjs";
import { f as resolveCrabboxWarmImageProfile, r as CRABBOX_WORKER_PROVIDER_ID, u as parseCrabboxProfile } from "./crabbox-worker-profile-JlLsFEvg.mjs";
import { c as isCrabboxWarmImageHeld, l as listCrabboxLegacyWarmLeases, n as CrabboxWarmImageRequestError, o as crabboxWarmImageRecoveryHint, p as recoverCrabboxWarmImageCapture, u as listCrabboxWarmImages } from "./crabbox-worker-warm-image-store-mBNWdk8P.mjs";
//#region extensions/crabbox/src/crabbox-gateway-methods.ts
async function mutateCrabboxImage(api, images, action, { params, respond }) {
	const checkpointId = isRecord(params) ? normalizeOptionalString(params.checkpointId) : void 0;
	if (!checkpointId || !isRecord(params) || action === "pin" && typeof params.pinned !== "boolean" || Object.keys(params).some((key) => key !== "checkpointId" && !(action === "pin" && key === "pinned"))) {
		sendError(respond, /* @__PURE__ */ new Error(`crabbox.images.${action} requires checkpointId${action === "pin" ? " and pinned: boolean" : ""}.`), true);
		return;
	}
	try {
		if (action === "pin") respond(true, snapshotSummary(await images.pin(checkpointId, params.pinned === true)));
		else if (action === "rollback") respond(true, snapshotSummary(await images.rollback(checkpointId)));
		else {
			const profiles = Object.values(api.runtime.config.current().cloudWorkers?.profiles ?? {}).filter((profile) => profile.provider.trim().toLowerCase() === CRABBOX_WORKER_PROVIDER_ID).map((profile) => profile.settings ?? {});
			respond(true, await images.delete(checkpointId, profiles));
		}
	} catch (error) {
		sendError(respond, error, error instanceof CrabboxWarmImageRequestError);
	}
}
function sendError(respond, error, invalidRequest = false) {
	const payload = { error: formatErrorMessage(error) };
	respond(false, payload, errorShape(invalidRequest ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, payload.error, { details: payload }));
}
function profileStatus(settings) {
	try {
		const configured = parseCrabboxProfile(settings);
		const profile = resolveCrabboxWarmImageProfile(configured);
		const warmImages = profile.warmImage && profile.class ? "on" : "off";
		const reason = configured.warmImage === false ? "Disabled in this profile." : profile.target !== "linux" ? "Warm images require Linux." : configured.warmImage !== true && configured.setupEnv?.length ? "Forwarded setup environment keeps warm images off by default." : !profile.class ? "Requires a configured or placement machine class." : configured.warmImage === true ? "Explicitly enabled in this profile." : "Enabled by default for Linux with a known machine class and no setup environment.";
		return {
			backend: configured.provider,
			machineClass: configured.class,
			os: configured.target,
			warmImages,
			reason
		};
	} catch (error) {
		return {
			warmImages: "off",
			reason: formatErrorMessage(error)
		};
	}
}
function snapshotSummary(image) {
	const allocations = Object.entries(image.allocations).toSorted(([a], [b]) => a.localeCompare(b));
	return {
		...image,
		held: Boolean(image.checkpointId && isCrabboxWarmImageHeld(image, image.checkpointId)),
		allocationCount: allocations.length,
		allocations: Object.fromEntries(allocations.slice(0, 20))
	};
}
async function snapshotStatus(state) {
	return {
		images: (await listCrabboxWarmImages(state)).map(snapshotSummary),
		legacyLeases: (await listCrabboxLegacyWarmLeases(state)).map((lease) => Object.assign(lease, { recoveryHint: crabboxWarmImageRecoveryHint(lease.selector) }))
	};
}
async function listCrabboxImages(api, { params, respond }) {
	if (params !== void 0 && (!isRecord(params) || Object.keys(params).length > 0)) {
		sendError(respond, /* @__PURE__ */ new Error("crabbox.images.list takes no parameters."), true);
		return;
	}
	try {
		const profiles = Object.entries(api.runtime.config.current().cloudWorkers?.profiles ?? {}).filter(([, profile]) => profile.provider.trim().toLowerCase() === CRABBOX_WORKER_PROVIDER_ID).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, profile]) => Object.assign({ id }, profileStatus(profile.settings ?? {})));
		respond(true, {
			...await snapshotStatus(api.runtime.state),
			profiles
		});
	} catch (error) {
		sendError(respond, error);
	}
}
async function recoverCrabboxImage(state, { params, respond }) {
	const selector = isRecord(params) ? normalizeOptionalString(params.selector) : void 0;
	if (!selector || !isRecord(params) || params.acknowledgeProviderCleanup !== true || Object.keys(params).some((key) => key !== "selector" && key !== "acknowledgeProviderCleanup")) {
		sendError(respond, /* @__PURE__ */ new Error("Recovery requires a selector and acknowledgeProviderCleanup: true."), true);
		return;
	}
	try {
		await recoverCrabboxWarmImageCapture(state, selector, true);
		respond(true, {
			...await snapshotStatus(state),
			recoveredCapture: selector,
			nextSteps: "Restart the Gateway after manual reconciliation; the next eligible worker can capture again."
		});
	} catch (error) {
		sendError(respond, error);
	}
}
//#endregion
export { listCrabboxImages, mutateCrabboxImage, recoverCrabboxImage };
