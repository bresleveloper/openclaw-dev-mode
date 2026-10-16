import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import "./board-Dk9KNFBo.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { i as normalizeGitHubActionsGrant } from "./github-actions-capability-DrbvGLFL.mjs";
import { a as normalizeSandboxHostCsp } from "./sandbox-host-BRz3YO81.mjs";
//#region src/boards/board-capabilities.ts
const MAX_DECLARED_ORIGINS = 32;
const MAX_DECLARED_TOOLS = 64;
function invalidDeclaration(message) {
	throw new BoardValidationError("invalid_operation", message);
}
function normalizeBoardNetOrigin(value) {
	if (value !== value.trim() || value.length === 0 || value.length > 2048) return invalidDeclaration(`invalid board widget network origin: ${value}`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		return invalidDeclaration(`invalid board widget network origin: ${value}`);
	}
	const supportedHostname = /^\[[0-9A-Fa-f:.]+\]$/u.test(parsed.hostname) || /^[A-Za-z0-9.-]+$/u.test(parsed.hostname);
	if (parsed.protocol !== "https:" || parsed.username !== "" || parsed.password !== "" || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "" || !supportedHostname || parsed.hostname.includes("*") || parsed.hostname.endsWith(".")) return invalidDeclaration(`board widget network origin must be an exact HTTPS origin: ${value}`);
	return parsed.origin;
}
function normalizeTool(value) {
	const tool = value.trim();
	if (tool.length === 0 || tool.length > 269 || tool !== value || containsAsciiControlCharacter(tool)) return invalidDeclaration(`invalid board widget tool capability: ${value}`);
	return normalizeGitHubActionsGrant(tool);
}
function normalizeBoardWidgetDeclared(declared) {
	if (!declared) return;
	if ((declared.netOrigins?.length ?? 0) > MAX_DECLARED_ORIGINS) return invalidDeclaration(`board widget cannot declare more than ${MAX_DECLARED_ORIGINS} network origins`);
	if ((declared.tools?.length ?? 0) > MAX_DECLARED_TOOLS) return invalidDeclaration(`board widget cannot declare more than ${MAX_DECLARED_TOOLS} tools`);
	const netOrigins = [...new Set((declared.netOrigins ?? []).map(normalizeBoardNetOrigin))].toSorted();
	const tools = [...new Set((declared.tools ?? []).map(normalizeTool))].toSorted();
	let sandboxOrigins;
	try {
		sandboxOrigins = normalizeSandboxHostCsp({ connectDomains: netOrigins })?.connectDomains;
	} catch {
		return invalidDeclaration("board widget network origins exceed safe CSP limits");
	}
	if (netOrigins.length > 0 && (sandboxOrigins?.length !== netOrigins.length || netOrigins.some((origin, index) => sandboxOrigins[index] !== origin))) return invalidDeclaration("board widget network origin is not supported by the sandbox host");
	if (netOrigins.length === 0 && tools.length === 0) return;
	return {
		...netOrigins.length > 0 ? { netOrigins } : {},
		...tools.length > 0 ? { tools } : {}
	};
}
function boardDeclarationIsSubset(requested, granted) {
	const grantedOrigins = new Set(granted?.netOrigins ?? []);
	const grantedTools = new Set(granted?.tools ?? []);
	return (requested?.netOrigins ?? []).every((origin) => grantedOrigins.has(origin)) && (requested?.tools ?? []).every((tool) => grantedTools.has(tool));
}
function boardWidgetHasGrantedTool(declared, grantState, tool) {
	return grantState === "granted" && (declared?.tools ?? []).includes(tool);
}
//#endregion
export { boardWidgetHasGrantedTool as n, normalizeBoardWidgetDeclared as r, boardDeclarationIsSubset as t };
