//#region src/claws/experimental.ts
const EXPERIMENTAL_CLAWS_ENV = "OPENCLAW_EXPERIMENTAL_CLAWS";
function isExperimentalClawsEnabled(env = process.env) {
	const value = env[EXPERIMENTAL_CLAWS_ENV]?.trim().toLowerCase();
	return value === "1" || value === "true";
}
function assertExperimentalClawsEnabled(env = process.env) {
	if (isExperimentalClawsEnabled(env)) return;
	throw new Error(`Claws are experimental and disabled. Set ${EXPERIMENTAL_CLAWS_ENV}=1 for this process to enable the unstable CLI.`);
}
//#endregion
export { isExperimentalClawsEnabled as n, assertExperimentalClawsEnabled as t };
