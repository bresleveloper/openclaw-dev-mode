import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { t as parseControlUiSessionPath } from "./parse-DyPBPdLM.mjs";
//#region src/gateway/control-ui-session-entry-path.ts
const RETURN_PATH_QUERY_VALIDATORS = /* @__PURE__ */ new Map([
	["dashboard", (value) => value === "expanded"],
	["draft", () => true],
	["openclaw_mount_recovery", (value) => /^[0-9]+$/u.test(value)],
	["__openclawSessionFacePreference", (value) => value === "1"],
	["__openclawComposerFocus", (value) => value === "1"],
	["__openclawSessionKey", (value) => Boolean(value.trim()) && !containsAsciiControlCharacter(value)]
]);
function controlUiSessionEntryPath(basePath) {
	return `${basePath}/__openclaw__/session-entry`;
}
/** Return paths are local chat documents, never URLs, API paths, or credential carriers. */
function parseControlUiSessionReturnPath(value, basePath) {
	if (!value.startsWith("/") || value.startsWith("//") || containsAsciiControlCharacter(value) || /[\\ #]/u.test(value)) return null;
	const url = URL.parse(value, "http://localhost");
	if (!url || `${url.pathname}${url.search}` !== value || [...url.searchParams].some(([key, queryValue]) => url.searchParams.getAll(key).length > 1 || !RETURN_PATH_QUERY_VALIDATORS.get(key)?.(queryValue))) return null;
	const target = parseControlUiSessionPath(url.pathname, basePath);
	return target?.namespace === "chat" ? target : null;
}
function buildControlUiSessionEntryUrl(path, basePath) {
	return `${controlUiSessionEntryPath(basePath)}?${new URLSearchParams({ path })}`;
}
//#endregion
export { controlUiSessionEntryPath as n, parseControlUiSessionReturnPath as r, buildControlUiSessionEntryUrl as t };
