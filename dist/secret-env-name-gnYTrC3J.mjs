//#region src/secrets/secret-env-name.ts
/** Matches environment names whose suffix convention indicates credential material. */
const SECRET_ENV_NAME_RE = /_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i;
/** Classifies the default secret-store kind from an environment-style name. */
function isSensitiveEnvName(name) {
	return SECRET_ENV_NAME_RE.test(name);
}
//#endregion
export { isSensitiveEnvName as n, SECRET_ENV_NAME_RE as t };
