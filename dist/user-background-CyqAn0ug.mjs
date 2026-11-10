import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as USER_BACKGROUND_MAX_OUTPUT_BYTES } from "./background-preferences-C24XmTL3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { c as captureUserPreferenceRead, s as beginUserPreferenceMutation } from "./user-preferences.store-BkUaBz4r.mjs";
import { c as isAnimatedWebpBuffer, g as createImageProcessorWithPixelLimits } from "./image-ops-DM5GUpDi.mjs";
import { readImageProbeFromHeader } from "rastermill";
//#region src/state/user-background-image.ts
var UserBackgroundInputError = class extends Error {};
function isAnimatedPng(bytes) {
	for (let offset = 8; offset + 12 <= bytes.length;) {
		const length = bytes.readUInt32BE(offset);
		if (length > bytes.length - offset - 12) throw new UserBackgroundInputError("Invalid PNG chunk length");
		if (bytes.toString("ascii", offset + 4, offset + 8) === "acTL") return true;
		offset += length + 12;
	}
	return false;
}
/** Never retain the original: decode a bounded static raster and strip source metadata. */
async function normalizeUserBackgroundImage(imageBase64, signal) {
	if (!imageBase64 || imageBase64.length > 4 * Math.ceil(8388608 / 3) || imageBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64)) throw new UserBackgroundInputError("Upload must contain a base64-encoded image of at most 8 MiB");
	const bytes = Buffer.from(imageBase64, "base64");
	const probe = readImageProbeFromHeader(bytes);
	if (!probe || bytes.length > 8388608 || ![
		"jpeg",
		"png",
		"webp"
	].includes(probe.format) || probe.width < 1 || probe.height < 1 || probe.width * probe.height > 25e6 || probe.format === "webp" && isAnimatedWebpBuffer(bytes) || probe.format === "png" && isAnimatedPng(bytes)) throw new UserBackgroundInputError("Choose a static JPEG, PNG, or WebP image up to 25 megapixels");
	const image = await createImageProcessorWithPixelLimits({
		inputPixels: 25e6,
		outputPixels: 6553600
	}).encode(bytes, {
		format: "jpeg",
		autoOrient: true,
		metadata: "strip",
		signal,
		resize: {
			maxSide: 2560,
			enlarge: false
		},
		maxBytes: USER_BACKGROUND_MAX_OUTPUT_BYTES,
		search: {
			maxSide: [
				2560,
				1920,
				1280
			],
			quality: [85, 70]
		}
	});
	if (image.data.byteLength === 0 || image.data.byteLength > 2097152 || image.width > 2560 || image.height > 2560 || image.format !== "jpeg" || image.metadata !== "stripped") throw new UserBackgroundInputError("Image could not fit the 2 MiB background limit");
	return {
		image: image.data,
		width: image.width,
		height: image.height
	};
}
//#endregion
//#region src/state/user-background.ts
async function readBackground(context, command, options) {
	for (;;) {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		const isCurrent = await captureUserPreferenceRead(context.admission);
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, command, {
			context,
			current: true,
			signal: options.signal
		});
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		if (isCurrent()) return {
			reply,
			isCurrent
		};
	}
}
async function getUserBackground(profileId, options = {}) {
	const { reply } = await readBackground(captureOpenClawStateWorkerContext(options), {
		type: "userBackground.snapshot",
		profileId
	}, options);
	if (!reply) return { status: "no_durable_identity" };
	return reply.result;
}
async function getUserBackgroundImage(profileId, assetId, options = {}) {
	const { reply, isCurrent } = await readBackground(captureOpenClawStateWorkerContext(options), {
		type: "userBackground.image",
		profileId,
		assetId,
		includeBytes: options.includeBytes ?? true
	}, options);
	if (!reply) return {
		image: void 0,
		byteLength: void 0,
		isCurrent
	};
	return {
		image: reply.image,
		byteLength: reply.byteLength,
		isCurrent
	};
}
async function mutateBackground(profileId, input, imageBase64, options) {
	const context = captureOpenClawStateWorkerContext(options);
	const expected = structuredClone(input);
	const { reply } = await readBackground(context, {
		type: "userBackground.snapshot",
		profileId
	}, options);
	if (!reply) return { status: "no_durable_identity" };
	if (reply.result.status !== "ok" || !reply.profileId) return reply.result;
	const image = imageBase64 === void 0 ? void 0 : await normalizeUserBackgroundImage(imageBase64, options.signal);
	context.admission.assertCurrent();
	options.signal?.throwIfAborted();
	options.assertCurrent?.();
	const finishMutation = beginUserPreferenceMutation(context.admission);
	try {
		const mutation = {
			profileId,
			expected,
			image
		};
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "userBackground.write",
			input: mutation
		}), {
			assertCurrent: options.assertCurrent,
			signal: options.signal,
			createAdmission: () => {
				return {
					admission: createSqliteWorkerOperationAdmission((_request, grant) => {
						context.admission.assertCurrent();
						options.signal?.throwIfAborted();
						options.assertCurrent?.();
						grant();
					}),
					nativeLocations: [context.admission.databasePath]
				};
			}
		});
	} finally {
		finishMutation();
	}
}
function uploadUserBackground(profileId, input, options = {}) {
	return mutateBackground(profileId, {
		expectedAssetId: input.expectedAssetId,
		expectedPreference: input.expectedPreference
	}, input.imageBase64, options);
}
function removeUserBackground(profileId, input, options = {}) {
	return mutateBackground(profileId, input, void 0, options);
}
//#endregion
export { UserBackgroundInputError as a, uploadUserBackground as i, getUserBackgroundImage as n, removeUserBackground as r, getUserBackground as t };
