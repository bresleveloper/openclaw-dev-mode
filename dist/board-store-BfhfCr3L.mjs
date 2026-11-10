import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { a as WIDGET_HTML_MAX_UTF8_BYTES } from "./canvas-CTYLqV3I.mjs";
import "./board-Bf82WUxl.mjs";
import { a as insertBoardWidget, n as BOARD_WIDGET_PROPS_MAX_BYTES, o as normalizeBoardLayout, r as BoardValidationError, t as BOARD_SIZE_PRESETS } from "./board-layout-6DyK3jbx.mjs";
import { a as normalizeSandboxHostCsp } from "./sandbox-host-dr8HnvFE.mjs";
import { i as normalizeGitHubActionsGrant, r as GITHUB_ACTIONS_GRANT_PREFIX } from "./github-actions-capability-BIjSSaM0.mjs";
import { o as parseBoardReport, r as parseBoardWebsite } from "./board-website-CZkEDDYp.mjs";
import { createHash } from "node:crypto";
//#region src/boards/board-capabilities.ts
const MAX_DECLARED_ORIGINS = 32;
const MAX_DECLARED_TOOLS = 64;
function invalidDeclaration(message) {
	throw new BoardValidationError("invalid_operation", message);
}
function normalizeBoardNetOrigin(value) {
	if (value !== value.trim() || value.length === 0 || value.length > 2048) return invalidDeclaration(`invalid board widget network origin: ${value}`);
	const parsed = URL.parse(value);
	if (!parsed) return invalidDeclaration(`invalid board widget network origin: ${value}`);
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
//#region src/boards/board-store.ts
const BOARD_MAX_WIDGETS = 48;
const BOARD_MAX_REGISTERED_SOURCE_BYTES = 262144;
function cloneBoardSnapshot(snapshot) {
	return {
		sessionKey: snapshot.sessionKey,
		revision: snapshot.revision,
		tabs: snapshot.tabs.map((tab) => ({ ...tab })),
		widgets: snapshot.widgets.map((widget) => ({
			...widget,
			...widget.props !== void 0 ? { props: structuredClone(widget.props) } : {},
			...widget.declaredSummary !== void 0 ? { declaredSummary: [...widget.declaredSummary] } : {},
			...widget.declared !== void 0 ? { declared: {
				...widget.declared.netOrigins ? { netOrigins: [...widget.declared.netOrigins] } : {},
				...widget.declared.tools ? { tools: [...widget.declared.tools] } : {}
			} } : {}
		}))
	};
}
function createBoardDeclaredSummary(declared) {
	const lines = [...(declared?.netOrigins ?? []).map((origin) => `Network access: ${origin}`), ...(declared?.tools ?? []).map((tool) => tool.startsWith(GITHUB_ACTIONS_GRANT_PREFIX) ? `GitHub Actions metadata: ${tool.slice(GITHUB_ACTIONS_GRANT_PREFIX.length)} (including private repository data accessible to the agent; shared with this widget/session audience)` : `Tool access: ${tool}`)];
	return lines.length > 0 ? lines : void 0;
}
function resolveBoardWidgetPutParams(prior, params, nameIdentities) {
	const generatedIdentity = params.generatedIdentity;
	if (!generatedIdentity) return params;
	if (generatedIdentity.fallbackName === params.name) throw new BoardValidationError("invalid_operation", "generated widget fallback name must differ from its preferred name");
	const existingGenerated = prior.widgets.find((widget) => {
		const identity = nameIdentities.get(widget.name);
		return identity?.kind === "generated" && identity.source === generatedIdentity.source && identity.key === generatedIdentity.key;
	});
	if (existingGenerated) return {
		...params,
		name: existingGenerated.name
	};
	if (!prior.widgets.find((widget) => widget.name === params.name)) return params;
	if (prior.widgets.find((widget) => widget.name === generatedIdentity.fallbackName)) throw new BoardValidationError("conflict", `generated widget fallback name is already in use: ${generatedIdentity.fallbackName}`);
	return {
		...params,
		name: generatedIdentity.fallbackName
	};
}
function normalizeBoardWidgetPutParams(params, sessionKey = params.sessionKey) {
	const declared = normalizeBoardWidgetDeclared(params.declared);
	const canonical = {
		...params,
		sessionKey
	};
	if (declared) canonical.declared = declared;
	else delete canonical.declared;
	return canonical;
}
function createBoardWidgetPutResult(snapshot, resolvedWidgetName) {
	return {
		...cloneBoardSnapshot(snapshot),
		resolvedWidgetName
	};
}
function validatePluginContent(params) {
	if (params.content.kind !== "plugin") return;
	if (params.declared !== void 0) throw new BoardValidationError("invalid_operation", "trusted plugin widgets do not accept sandbox capability declarations");
	if (params.content.pluginKind === "session:report") {
		parseBoardReport(params.content.props);
		return;
	}
	if (Buffer.byteLength(JSON.stringify(params.content.props ?? {}), "utf8") > 8192) throw new BoardValidationError("invalid_operation", `board plugin widget props exceed ${BOARD_WIDGET_PROPS_MAX_BYTES} UTF-8 bytes`);
	if (params.content.pluginKind === "session:website") parseBoardWebsite(params.content.props);
}
function createBoardWidgetPutSnapshot(prior, params, context) {
	validatePluginContent(params);
	if (params.content.kind === "registered" && Buffer.byteLength(params.content.source, "utf8") > BOARD_MAX_REGISTERED_SOURCE_BYTES) throw new BoardValidationError("invalid_operation", `board registered widget source exceeds ${BOARD_MAX_REGISTERED_SOURCE_BYTES} UTF-8 bytes`);
	if (params.content.kind === "html" && Buffer.byteLength(params.content.html, "utf8") > 10485760) throw new BoardValidationError("invalid_operation", `board widget HTML exceeds ${WIDGET_HTML_MAX_UTF8_BYTES} UTF-8 bytes`);
	let layout = normalizeBoardLayout(prior);
	if (layout.tabs.length === 0) layout.tabs.push({
		tabId: "main",
		title: "Main",
		position: 0,
		chatDock: "right"
	});
	const existing = layout.widgets.find((widget) => widget.name === params.name);
	if (existing && (existing.contentOwner !== params.content.kind || (params.content.kind === "plugin" || params.content.kind === "registered") && (existing.pluginKind !== params.content.pluginKind || params.content.kind === "registered" && existing.registeredContentKind !== params.content.contentKind))) {
		const incomingOwner = params.content.kind === "plugin" || params.content.kind === "registered" ? params.content.pluginKind : params.content.kind;
		throw new BoardValidationError("invalid_operation", `board widget ${params.name} contains ${existing.pluginKind ?? existing.contentOwner} content; update it with the same content kind or remove it before replacing it with ${incomingOwner} content`);
	}
	if (!existing && layout.widgets.length >= BOARD_MAX_WIDGETS) throw new BoardValidationError("invalid_operation", `board cannot contain more than ${BOARD_MAX_WIDGETS} widgets`);
	const tabId = params.placement?.tabId ?? existing?.tabId ?? layout.tabs[0].tabId;
	if (!layout.tabs.some((tab) => tab.tabId === tabId)) throw new BoardValidationError("not_found", `board tab not found: ${tabId}`);
	const size = BOARD_SIZE_PRESETS[params.placement?.size ?? "md"];
	const widgetRevision = (existing?.revision ?? 0) + 1;
	const declared = params.content.kind === "plugin" ? void 0 : normalizeBoardWidgetDeclared(params.declared);
	const declaredSummary = createBoardDeclaredSummary(declared);
	const contentSha256 = params.content.kind === "html" ? createHash("sha256").update(params.content.html).digest("hex") : params.content.kind === "registered" ? createHash("sha256").update(params.content.source).digest("hex") : void 0;
	const preservesGrant = declared !== void 0 && context.grantScopeMatches && (params.content.kind !== "mcp-app" || params.content.interactive) && existing?.grantState === "granted" && (params.content.kind === "html" || params.content.kind === "registered" ? contentSha256 === context.grantedSha256 : true) && boardDeclarationIsSubset(declared, existing.declared);
	layout = insertBoardWidget(layout, {
		name: params.name,
		tabId,
		...params.title !== void 0 ? { title: params.title } : existing?.title !== void 0 ? { title: existing.title } : {},
		contentKind: params.content.kind === "registered" ? "plugin" : params.content.kind,
		contentOwner: params.content.kind,
		...params.content.kind === "registered" ? { registeredContentKind: params.content.contentKind } : {},
		...params.presentation !== void 0 ? { presentation: params.presentation } : existing?.presentation !== void 0 ? { presentation: existing.presentation } : {},
		...params.heightMode !== void 0 ? { heightMode: params.heightMode } : existing?.heightMode !== void 0 ? { heightMode: existing.heightMode } : {},
		...params.content.kind === "plugin" || params.content.kind === "registered" ? {
			pluginKind: params.content.pluginKind,
			...params.content.kind === "plugin" && params.content.props !== void 0 ? { props: structuredClone(params.content.props) } : {}
		} : {},
		sizeW: params.placement?.size ? size.sizeW : existing?.sizeW ?? size.sizeW,
		sizeH: params.placement?.size ? size.sizeH : existing?.sizeH ?? size.sizeH,
		position: existing?.position ?? layout.widgets.length,
		grantState: params.content.kind === "plugin" ? "none" : preservesGrant ? "granted" : params.content.kind === "mcp-app" && !params.content.interactive ? "none" : declaredSummary || params.content.kind === "mcp-app" ? "pending" : "none",
		revision: widgetRevision,
		instanceId: params.content.kind === "plugin" ? existing?.instanceId ?? context.instanceId : context.instanceId,
		...declaredSummary ? { declaredSummary } : {},
		...declared ? { declared } : {}
	}, {
		tabId,
		...params.placement?.after ? { after: params.placement.after } : {},
		move: params.placement?.tabId !== void 0 || params.placement?.after !== void 0
	});
	return {
		sessionKey: params.sessionKey,
		revision: prior.revision + 1,
		...layout
	};
}
function createBoardGrantSnapshot(current, name, decision, revision, instanceId) {
	const widget = current.widgets.find((candidate) => candidate.name === name);
	if (!widget) throw new BoardValidationError("not_found", `board widget not found: ${name}`);
	if (widget.revision !== revision) throw new BoardValidationError("conflict", `board widget revision changed: ${name} is revision ${widget.revision}, not ${revision}`);
	if (widget.instanceId !== void 0 && widget.instanceId !== instanceId) throw new BoardValidationError("conflict", `board widget instance changed: ${name}`);
	if (widget.grantState !== "pending") throw new BoardValidationError("invalid_operation", `board widget grant is not pending: ${name}`);
	const snapshot = cloneBoardSnapshot(current);
	snapshot.widgets.find((candidate) => candidate.name === name).grantState = decision;
	snapshot.revision += 1;
	return snapshot;
}
//#endregion
export { createBoardWidgetPutSnapshot as a, boardWidgetHasGrantedTool as c, createBoardWidgetPutResult as i, normalizeBoardWidgetDeclared as l, createBoardDeclaredSummary as n, normalizeBoardWidgetPutParams as o, createBoardGrantSnapshot as r, resolveBoardWidgetPutParams as s, cloneBoardSnapshot as t };
