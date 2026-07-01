//#region src/secrets/channel-env-var-names.ts
/** Ambient process env names that are too common to imply channel configuration. */
const UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES = new Set([
	"CI",
	"HOME",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"LOGNAME",
	"NODE_ENV",
	"OLDPWD",
	"PATH",
	"PWD",
	"SHELL",
	"SSH_AUTH_SOCK",
	"TEMP",
	"TERM",
	"TMP",
	"TMPDIR",
	"USER"
]);
/**
* Returns whether a channel env var name is safe to treat as a credential/config trigger.
*/
function isSafeChannelEnvVarTriggerName(key) {
	const normalized = key.trim().toUpperCase();
	return /^[A-Z][A-Z0-9_]*$/.test(normalized) && !UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES.has(normalized);
}
//#endregion
export { isSafeChannelEnvVarTriggerName as t };
