//#region src/infra/login-shell-path-carrier.ts
/** Carry a PATH prefix through shell startup without interpolating it as shell code. */
function prependShellPath(command, env, prefix) {
	env.OPENCLAW_PREPEND_PATH = prefix;
	return `export PATH="\${OPENCLAW_PREPEND_PATH}\${PATH:+:$PATH}"; unset OPENCLAW_PREPEND_PATH; ${command}`;
}
//#endregion
export { prependShellPath as t };
