import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/infra/npm-integrity.ts
async function resolveNpmIntegrityDriftWithDefaultMessage(params) {
	const expectedIntegrity = normalizeOptionalString(params.expectedIntegrity);
	if (!expectedIntegrity) return {};
	const subject = params.resolution.resolvedSpec ?? params.spec;
	const actualIntegrity = normalizeOptionalString(params.resolution.integrity);
	if (!actualIntegrity) return { error: `aborted: npm package integrity missing for ${subject}` };
	if (expectedIntegrity === actualIntegrity) return {};
	const integrityDrift = {
		expectedIntegrity,
		actualIntegrity
	};
	const payload = {
		spec: params.spec,
		expectedIntegrity,
		actualIntegrity,
		resolution: params.resolution
	};
	let proceed = false;
	if (params.onIntegrityDrift) proceed = await params.onIntegrityDrift(payload);
	else params.warn?.(`Integrity drift detected for ${subject}: expected ${expectedIntegrity}, got ${actualIntegrity}`);
	return {
		integrityDrift,
		...proceed ? {} : { error: `aborted: npm package integrity drift detected for ${subject}` }
	};
}
//#endregion
export { resolveNpmIntegrityDriftWithDefaultMessage as t };
