import { B as normalizeControlUiBasePath } from "./session-key-CSDERtm3.mjs";
//#region packages/session-url-contract/src/focus.ts
const FOCUS_SEGMENT = "/focus";
function normalizePathname(pathname) {
	const trimmed = pathname.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 ? withSlash.replace(/\/+$/u, "") : withSlash;
}
function isControlUiFocusPath(pathname, basePath = "") {
	const normalizedPath = normalizePathname(pathname);
	const root = `${normalizeControlUiBasePath(basePath)}${FOCUS_SEGMENT}`;
	return normalizedPath === root || normalizedPath.startsWith(`${root}/`);
}
//#endregion
export { isControlUiFocusPath as t };
