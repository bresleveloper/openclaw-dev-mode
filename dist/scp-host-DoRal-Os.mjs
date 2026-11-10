import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
//#region src/infra/scp-host.ts
const SSH_TOKEN = /^[A-Za-z0-9._-]+$/;
const BRACKETED_IPV6 = /^\[[0-9A-Fa-f:.%]+\]$/;
const WHITESPACE = /\s/;
const SCP_REMOTE_PATH_UNSAFE_CHARS = /[\\'"`$;|&<>]/;
/** Normalize an optional `[user@]host` SCP target or reject unsafe tokens. */
function normalizeScpRemoteHost(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (containsAsciiControlCharacter(trimmed) || WHITESPACE.test(trimmed)) return;
	if (trimmed.startsWith("-")) return;
	const firstAt = trimmed.indexOf("@");
	const lastAt = trimmed.lastIndexOf("@");
	let user;
	let host = trimmed;
	if (firstAt !== -1) {
		if (firstAt !== lastAt || firstAt === 0 || firstAt === trimmed.length - 1) return;
		user = trimmed.slice(0, firstAt);
		host = trimmed.slice(firstAt + 1);
		if (!SSH_TOKEN.test(user)) return;
	}
	if (host.startsWith("-") || !SSH_TOKEN.test(host) && !BRACKETED_IPV6.test(host)) return;
	return user ? `${user}@${host}` : host;
}
/** Return true when a value is safe for the SCP host position. */
function isSafeScpRemoteHost(value) {
	return normalizeScpRemoteHost(value) !== void 0;
}
/** Normalize an absolute remote path that is safe for SCP command construction. */
function normalizeScpRemotePath(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || !trimmed.startsWith("/")) return;
	if (containsAsciiControlCharacter(trimmed) || SCP_REMOTE_PATH_UNSAFE_CHARS.test(trimmed)) return;
	return trimmed;
}
//#endregion
export { normalizeScpRemoteHost as n, normalizeScpRemotePath as r, isSafeScpRemoteHost as t };
