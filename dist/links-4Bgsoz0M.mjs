import { t as formatTerminalLink } from "./terminal-link-DaVY8ivo.mjs";
//#region packages/terminal-core/src/links.ts
const DOCS_ROOT = "https://docs.openclaw.ai";
const ABSOLUTE_HTTP_URL_RE = /^https?:\/\//i;
function formatDocsLink(path, label, opts) {
	const trimmed = typeof path === "string" ? path.trim() : "";
	const url = trimmed ? ABSOLUTE_HTTP_URL_RE.test(trimmed) ? trimmed : `${DOCS_ROOT}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}` : DOCS_ROOT;
	return formatTerminalLink(label ?? url, url, {
		fallback: opts?.fallback ?? url,
		force: opts?.force
	});
}
//#endregion
export { formatDocsLink as t };
