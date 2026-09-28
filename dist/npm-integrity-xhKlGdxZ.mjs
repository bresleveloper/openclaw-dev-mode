//#region src/infra/npm-integrity.ts
function normalizeIntegrity(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
/**
* Resolves integrity drift with OpenClaw's default warning and abort messages.
* Used by npm archive installers that do not need a custom payload shape.
*/
async function resolveNpmIntegrityDriftWithDefaultMessage(params) {
	const expectedIntegrity = normalizeIntegrity(params.expectedIntegrity);
	if (!expectedIntegrity) return {};
	const subject = params.resolution.resolvedSpec ?? params.spec;
	const actualIntegrity = normalizeIntegrity(params.resolution.integrity);
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
