import { n as parseR2Settings, r as r2Endpoint } from "../../settings-ozezGD11.mjs";
import { n as require_dist_cjs, t as createR2Backend } from "../../s3-backend-BZVmDvEW.mjs";
//#region extensions/cloudflare/runtime-api.ts
var import_dist_cjs = require_dist_cjs();
async function openR2Backend(params) {
	const settings = parseR2Settings(params.settings);
	params.signal?.throwIfAborted();
	let credentials;
	try {
		const [accessKeyId, secretAccessKey, sessionToken] = await Promise.all([
			params.resolveSecret(settings.accessKeyId),
			params.resolveSecret(settings.secretAccessKey),
			settings.sessionToken ? params.resolveSecret(settings.sessionToken) : void 0
		]);
		if (!accessKeyId || !secretAccessKey || settings.sessionToken && !sessionToken) throw new Error("Empty credential");
		credentials = {
			accessKeyId,
			secretAccessKey,
			sessionToken
		};
	} catch {
		throw new Error("R2 credentials could not be resolved; check the configured SecretRefs and their secret providers.");
	}
	params.signal?.throwIfAborted();
	return createR2Backend(settings, new import_dist_cjs.S3Client({
		endpoint: r2Endpoint(settings),
		region: "auto",
		credentials,
		forcePathStyle: true,
		requestChecksumCalculation: "WHEN_REQUIRED",
		responseChecksumValidation: "WHEN_REQUIRED"
	}));
}
//#endregion
export { openR2Backend };
