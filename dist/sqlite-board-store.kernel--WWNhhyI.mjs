import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync, o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import "./src-BRUl7oDv.mjs";
import { r as ensureOpenClawAgentBoardSchemaInTransaction } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { a as insertBoardWidget, i as applyBoardOps, n as BOARD_WIDGET_PROPS_MAX_BYTES, o as normalizeBoardLayout, r as BoardValidationError, t as BOARD_SIZE_PRESETS } from "./board-layout-6DyK3jbx.mjs";
import { i as normalizeGitHubActionsGrant, r as GITHUB_ACTIONS_GRANT_PREFIX } from "./github-actions-capability-GqhkMZRM.mjs";
import { a as normalizeSandboxHostCsp } from "./sandbox-host-BqeXhFy-.mjs";
import { o as parseBoardReport, r as parseBoardWebsite } from "./board-website-CZkEDDYp.mjs";
import { createHash } from "node:crypto";
//#region src/boards/board-capabilities.ts
const MAX_DECLARED_ORIGINS = 32;
const MAX_DECLARED_TOOLS = 64;
function invalidDeclaration(message) {
	throw new BoardValidationError("invalid_operation", message);
}
function hasControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 31 || code === 127) return true;
	}
	return false;
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
	if (tool.length === 0 || tool.length > 269 || tool !== value || hasControlCharacter(tool)) return invalidDeclaration(`invalid board widget tool capability: ${value}`);
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
const BOARD_MAX_WIDGET_HTML_BYTES = 262144;
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
function generatedIdentityMatches(left, right) {
	return left?.kind === "generated" && left.source === right.source && left.key === right.key;
}
function resolveBoardWidgetPutParams(prior, params, nameIdentities) {
	const generatedIdentity = params.generatedIdentity;
	if (!generatedIdentity) return params;
	if (generatedIdentity.fallbackName === params.name) throw new BoardValidationError("invalid_operation", "generated widget fallback name must differ from its preferred name");
	const marker = {
		kind: "generated",
		source: generatedIdentity.source,
		key: generatedIdentity.key
	};
	const existingGenerated = prior.widgets.find((widget) => generatedIdentityMatches(nameIdentities.get(widget.name), marker));
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
function validateRegisteredContent(params) {
	if (params.content.kind !== "registered") return;
	if (Buffer.byteLength(params.content.source, "utf8") > BOARD_MAX_WIDGET_HTML_BYTES) throw new BoardValidationError("invalid_operation", `board registered widget source exceeds ${BOARD_MAX_WIDGET_HTML_BYTES} UTF-8 bytes`);
}
function createBoardWidgetPutSnapshot(prior, params, context) {
	validatePluginContent(params);
	validateRegisteredContent(params);
	if (params.content.kind === "html" && Buffer.byteLength(params.content.html, "utf8") > BOARD_MAX_WIDGET_HTML_BYTES) throw new BoardValidationError("invalid_operation", `board widget HTML exceeds ${BOARD_MAX_WIDGET_HTML_BYTES} UTF-8 bytes`);
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
//#region src/boards/sqlite-board-codec.ts
const BOARD_WIDGET_SNAPSHOT_COLUMNS = [
	"session_key",
	"name",
	"tab_id",
	"title",
	"content_kind",
	"descriptor_json",
	"sha256",
	"view_generation",
	"revision",
	"size_w",
	"size_h",
	"position",
	"manifest",
	"grant_state",
	"granted_sha",
	"created_by",
	"created_at",
	"updated_at"
];
const BOARD_GRANT_SEMANTICS_VERSION = 2;
function parseManifest(value) {
	const parsed = JSON.parse(value);
	const contentOwnerPresent = Object.hasOwn(parsed, "contentOwner");
	const contentOwner = parsed.contentOwner === "html" || parsed.contentOwner === "mcp-app" || parsed.contentOwner === "plugin" || parsed.contentOwner === "registered" ? parsed.contentOwner : void 0;
	const registeredContentKind = typeof parsed.registeredContentKind === "string" && /^[a-z][a-z0-9-]{0,31}$/u.test(parsed.registeredContentKind) ? parsed.registeredContentKind : void 0;
	if (contentOwnerPresent && contentOwner === void 0 || contentOwner === "registered" && registeredContentKind === void 0 || contentOwner !== "registered" && Object.hasOwn(parsed, "registeredContentKind")) throw new BoardValidationError("invalid_operation", "board widget content ownership is invalid");
	const ownership = {
		...contentOwner ? { contentOwner } : {},
		...registeredContentKind ? { registeredContentKind } : {}
	};
	const netOrigins = Array.isArray(parsed.netOrigins) ? parsed.netOrigins.filter((entry) => typeof entry === "string") : void 0;
	const tools = Array.isArray(parsed.tools) ? parsed.tools.filter((entry) => typeof entry === "string") : void 0;
	const mcpAppInteractive = typeof parsed.mcpAppInteractive === "boolean" ? parsed.mcpAppInteractive : void 0;
	const mcpAppInstanceId = typeof parsed.mcpAppInstanceId === "string" && /^[a-f0-9]{32}$/u.test(parsed.mcpAppInstanceId) ? parsed.mcpAppInstanceId : void 0;
	const registeredInstanceId = typeof parsed.registeredInstanceId === "string" && /^[a-f0-9]{32}$/u.test(parsed.registeredInstanceId) ? parsed.registeredInstanceId : void 0;
	const pluginInstanceId = typeof parsed.pluginInstanceId === "string" && /^[a-f0-9]{32}$/u.test(parsed.pluginInstanceId) ? parsed.pluginInstanceId : void 0;
	const presentation = parsed.presentation === "card" || parsed.presentation === "full-bleed" || parsed.presentation === "frameless" ? parsed.presentation : void 0;
	const heightMode = parsed.heightMode === "auto" || parsed.heightMode === "fixed" ? parsed.heightMode : void 0;
	const nameIdentityPresent = Object.hasOwn(parsed, "nameIdentity");
	const nameIdentity = (() => {
		if (!parsed.nameIdentity || typeof parsed.nameIdentity !== "object" || Array.isArray(parsed.nameIdentity)) return;
		const identity = parsed.nameIdentity;
		if (identity.kind === "explicit") return { kind: "explicit" };
		if (identity.kind === "generated" && identity.source === "show_widget" && typeof identity.key === "string" && /^[a-f0-9]{64}$/u.test(identity.key)) return {
			kind: "generated",
			source: "show_widget",
			key: identity.key
		};
	})();
	try {
		const declared = normalizeBoardWidgetDeclared({
			...netOrigins?.length ? { netOrigins } : {},
			...tools?.length ? { tools } : {}
		});
		return {
			...ownership,
			...declared ? { declared } : {},
			...parsed.grantSemanticsVersion === BOARD_GRANT_SEMANTICS_VERSION ? { grantSemanticsVersion: BOARD_GRANT_SEMANTICS_VERSION } : {},
			...presentation ? { presentation } : {},
			...heightMode ? { heightMode } : {},
			...nameIdentity ? { nameIdentity } : {},
			...!nameIdentity && nameIdentityPresent ? { nameIdentityInvalid: true } : {},
			...mcpAppInteractive !== void 0 ? { mcpAppInteractive } : {},
			...mcpAppInstanceId ? { mcpAppInstanceId } : {},
			...registeredInstanceId ? { registeredInstanceId } : {},
			...pluginInstanceId ? { pluginInstanceId } : {}
		};
	} catch (error) {
		if (error instanceof BoardValidationError) return {
			...ownership,
			declarationInvalid: true
		};
		throw error;
	}
}
function serializeManifest(ownership, declared, grantState, widgetIdentity, widgetOptions, nameIdentity) {
	return JSON.stringify({
		...ownership,
		...declared,
		...widgetOptions?.presentation ? { presentation: widgetOptions.presentation } : {},
		...widgetOptions?.heightMode ? { heightMode: widgetOptions.heightMode } : {},
		...nameIdentity ? { nameIdentity } : {},
		...grantState === "granted" ? { grantSemanticsVersion: BOARD_GRANT_SEMANTICS_VERSION } : {},
		...widgetIdentity?.kind === "mcp-app" ? {
			mcpAppInteractive: widgetIdentity.interactive,
			mcpAppInstanceId: widgetIdentity.instanceId
		} : {},
		...widgetIdentity?.kind === "registered" ? { registeredInstanceId: widgetIdentity.instanceId } : {},
		...widgetIdentity?.kind === "plugin" ? { pluginInstanceId: widgetIdentity.instanceId } : {}
	});
}
function createBoardWidgetContentFields(params, frame, revision, grantState, instanceId, now) {
	const manifest = serializeManifest({
		contentOwner: params.content.kind,
		...params.content.kind === "registered" ? { registeredContentKind: params.content.contentKind } : {}
	}, params.declared, grantState, params.content.kind === "mcp-app" ? {
		kind: "mcp-app",
		interactive: params.content.interactive,
		instanceId
	} : params.content.kind === "registered" || params.content.kind === "plugin" ? {
		kind: params.content.kind,
		instanceId
	} : void 0, frame, params.generatedIdentity ? {
		kind: "generated",
		source: params.generatedIdentity.source,
		key: params.generatedIdentity.key
	} : { kind: "explicit" });
	if (params.content.kind === "html") {
		const sha256 = createHash("sha256").update(params.content.html).digest("hex");
		return {
			content_kind: "html",
			html: Buffer.from(params.content.html, "utf8"),
			descriptor_json: null,
			sha256,
			view_generation: instanceId,
			revision,
			manifest,
			grant_state: grantState,
			granted_sha: grantState === "granted" ? sha256 : null,
			updated_at: now
		};
	}
	if (params.content.kind === "plugin") {
		const descriptorJson = JSON.stringify({
			pluginKind: params.content.pluginKind,
			...params.content.props !== void 0 ? { props: params.content.props } : {}
		});
		return {
			content_kind: "plugin",
			html: null,
			descriptor_json: descriptorJson,
			sha256: createHash("sha256").update(descriptorJson).digest("hex"),
			view_generation: null,
			revision,
			manifest,
			grant_state: "none",
			granted_sha: null,
			updated_at: now
		};
	}
	if (params.content.kind === "registered") {
		const descriptorJson = JSON.stringify({
			pluginKind: params.content.pluginKind,
			source: params.content.source
		});
		const sha256 = createHash("sha256").update(params.content.source).digest("hex");
		return {
			content_kind: "plugin",
			html: null,
			descriptor_json: descriptorJson,
			sha256,
			view_generation: null,
			revision,
			manifest,
			grant_state: grantState,
			granted_sha: grantState === "granted" ? sha256 : null,
			updated_at: now
		};
	}
	const descriptorJson = JSON.stringify(params.content.descriptor);
	const sha256 = createHash("sha256").update(descriptorJson).digest("hex");
	return {
		content_kind: "mcp-app",
		html: null,
		descriptor_json: descriptorJson,
		sha256,
		view_generation: null,
		revision,
		manifest,
		grant_state: grantState,
		granted_sha: grantState === "granted" ? sha256 : null,
		updated_at: now
	};
}
function resolveSqliteBoardWidgetPutParams(snapshot, params, rows) {
	const identities = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const manifest = parseManifest(row.manifest);
		const nameIdentity = manifest.nameIdentity ?? (manifest.nameIdentityInvalid ? { kind: "invalid" } : void 0);
		if (nameIdentity) identities.set(row.name, nameIdentity);
	}
	return resolveBoardWidgetPutParams(snapshot, params, identities);
}
function updateManifestHeightMode(value, heightMode) {
	const parsed = JSON.parse(value);
	return JSON.stringify({
		...parsed,
		heightMode
	});
}
function effectiveGrantState(storedGrantState, manifest) {
	const grantState = storedGrantState === "pending" || storedGrantState === "granted" || storedGrantState === "rejected" ? storedGrantState : "none";
	if (manifest.declarationInvalid || !manifest.declared && manifest.mcpAppInteractive !== true) return grantState === "rejected" ? "rejected" : "none";
	if (grantState === "granted" && manifest.grantSemanticsVersion !== BOARD_GRANT_SEMANTICS_VERSION) return "pending";
	return grantState;
}
function parseDescriptor(value) {
	return JSON.parse(value);
}
function parsePluginContent(value) {
	const parsed = JSON.parse(value);
	if (typeof parsed.pluginKind !== "string") throw new BoardValidationError("invalid_operation", "board plugin widget kind is invalid");
	return typeof parsed.source === "string" ? {
		pluginKind: parsed.pluginKind,
		source: parsed.source
	} : {
		pluginKind: parsed.pluginKind,
		...parsed.props !== void 0 ? { props: parsed.props } : {}
	};
}
function rowToHtmlDocument(row) {
	if (row.content_kind !== "html" || row.html === null || row.view_generation === null) return;
	const manifest = parseManifest(row.manifest);
	const declared = manifest.declared;
	return {
		html: Buffer.from(row.html).toString("utf8"),
		revision: row.revision,
		sha256: row.sha256,
		viewGeneration: row.view_generation,
		grantState: effectiveGrantState(row.grant_state, manifest),
		...declared ? { declared } : {}
	};
}
function rowToBoardWidgetDocument(row) {
	if (row.content_kind === "html") return rowToHtmlDocument(row);
	if (row.content_kind === "plugin") return rowToRegisteredDocument(row);
	if (row.descriptor_json === null) return;
	const manifest = parseManifest(row.manifest);
	if (manifest.mcpAppInteractive === void 0 || manifest.mcpAppInstanceId === void 0) return;
	return {
		descriptor: parseDescriptor(row.descriptor_json),
		revision: row.revision,
		instanceId: manifest.mcpAppInstanceId,
		grantState: effectiveGrantState(row.grant_state, manifest),
		declaredTools: manifest.declared?.tools ?? [],
		interactive: manifest.mcpAppInteractive
	};
}
function rowToRegisteredDocument(row) {
	if (row.content_kind !== "plugin" || row.descriptor_json === null) return;
	const content = parsePluginContent(row.descriptor_json);
	const manifest = parseManifest(row.manifest);
	if (!("source" in content) || !manifest.registeredInstanceId) return;
	return {
		pluginKind: content.pluginKind,
		source: content.source,
		...row.title !== null ? { title: row.title } : {},
		revision: row.revision,
		sha256: row.sha256,
		viewGeneration: manifest.registeredInstanceId,
		grantState: effectiveGrantState(row.grant_state, manifest),
		...manifest.declared ? { declared: manifest.declared } : {}
	};
}
function rowToTab(row) {
	return {
		tabId: row.tab_id,
		title: row.title,
		position: row.position,
		chatDock: row.chat_dock
	};
}
function rowToWidget(row, manifest = parseManifest(row.manifest)) {
	const declared = manifest.declared;
	const declaredSummary = createBoardDeclaredSummary(declared);
	const pluginContent = row.content_kind === "plugin" && row.descriptor_json !== null ? parsePluginContent(row.descriptor_json) : void 0;
	const persistedOwner = pluginContent && "source" in pluginContent ? "registered" : row.content_kind === "html" || row.content_kind === "mcp-app" || row.content_kind === "plugin" ? row.content_kind : void 0;
	if (persistedOwner === void 0) throw new BoardValidationError("invalid_operation", "board widget content owner is invalid");
	const persistedRegisteredContentKind = persistedOwner === "registered" ? pluginContent.pluginKind.match(/^[a-z0-9][a-z0-9-]{0,63}:([a-z][a-z0-9-]{0,31})$/u)?.[1] : void 0;
	if (manifest.contentOwner !== void 0 && manifest.contentOwner !== persistedOwner || persistedOwner === "registered" && (persistedRegisteredContentKind === void 0 || manifest.registeredContentKind !== void 0 && manifest.registeredContentKind !== persistedRegisteredContentKind)) throw new BoardValidationError("invalid_operation", "board widget content ownership does not match persisted content");
	const contentOwner = manifest.contentOwner ?? persistedOwner;
	const registeredContentKind = manifest.registeredContentKind ?? persistedRegisteredContentKind;
	const instanceId = row.content_kind === "mcp-app" ? manifest.mcpAppInstanceId : pluginContent && "source" in pluginContent ? manifest.registeredInstanceId : contentOwner === "plugin" ? manifest.pluginInstanceId : row.view_generation;
	return {
		name: row.name,
		tabId: row.tab_id,
		...row.title !== null ? { title: row.title } : {},
		contentKind: row.content_kind,
		contentOwner,
		...registeredContentKind ? { registeredContentKind } : {},
		...manifest.presentation ? { presentation: manifest.presentation } : {},
		...manifest.heightMode ? { heightMode: manifest.heightMode } : {},
		...pluginContent ? {
			pluginKind: pluginContent.pluginKind,
			..."props" in pluginContent && pluginContent.props !== void 0 ? { props: pluginContent.props } : {}
		} : {},
		sizeW: row.size_w,
		sizeH: row.size_h,
		position: row.position,
		grantState: effectiveGrantState(row.grant_state, manifest),
		revision: row.revision,
		...instanceId ? { instanceId } : {},
		...declaredSummary ? { declaredSummary } : {},
		...declared ? { declared } : {}
	};
}
function rowToHtmlViewMetadata(row, manifest) {
	const viewGeneration = row.content_kind === "html" ? row.view_generation : manifest.registeredInstanceId;
	if (viewGeneration === null || viewGeneration === void 0) return;
	const declared = manifest.declared;
	return {
		revision: row.revision,
		sha256: row.sha256,
		viewGeneration,
		grantState: effectiveGrantState(row.grant_state, manifest),
		...declared ? { declared } : {}
	};
}
//#endregion
//#region src/boards/sqlite-board-read-queries.ts
function createBoardReadQueries(database) {
	const db = getNodeSqliteKysely(database);
	return {
		session: prepareSqliteQuerySync(database, (parameter) => db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", parameter((key) => key)).limit(1)),
		tabs: prepareSqliteQuerySync(database, (parameter) => db.selectFrom("board_tabs").selectAll().where("session_key", "=", parameter((key) => key)).orderBy("position", "asc").orderBy("tab_id", "asc")),
		widgets: prepareSqliteQuerySync(database, (parameter) => db.selectFrom("board_widgets").select(BOARD_WIDGET_SNAPSHOT_COLUMNS).where("session_key", "=", parameter((key) => key)).orderBy("tab_id", "asc").orderBy("position", "asc").orderBy("name", "asc"))
	};
}
const boardReadQueries = /* @__PURE__ */ new WeakMap();
function getBoardReadQueries(database) {
	let queries = boardReadQueries.get(database);
	if (!queries) {
		queries = createBoardReadQueries(database);
		boardReadQueries.set(database, queries);
	}
	return queries;
}
//#endregion
//#region src/boards/sqlite-board-store.kernel.ts
const ensuredBoardDatabases = /* @__PURE__ */ new WeakSet();
const presentBoardDatabases = /* @__PURE__ */ new WeakSet();
const BOARD_WRITE_BATCH_SIZE = 64;
function boardTablesPresent(database) {
	if (ensuredBoardDatabases.has(database.db) || presentBoardDatabases.has(database.db)) return true;
	if (!database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'board_widgets'").get()) return false;
	presentBoardDatabases.add(database.db);
	return true;
}
function ensureBoardSchema(database) {
	if (ensuredBoardDatabases.has(database.db)) return;
	if (database.db.isTransaction) throw new Error("board schema must be ensured before the write transaction starts");
	runSqliteImmediateTransactionSync(database.db, () => ensureOpenClawAgentBoardSchemaInTransaction(database.db), {
		databaseLabel: database.path,
		operationLabel: "board.ensure-schema"
	});
	ensuredBoardDatabases.add(database.db);
	presentBoardDatabases.add(database.db);
}
function readStoredBoard(database, sessionKey) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const queries = getBoardReadQueries(database.db);
		const tabRows = queries.tabs(sessionKey).rows;
		const admittedWidgetRows = queries.widgets(sessionKey).rows.map((row) => ({
			row,
			manifest: parseManifest(row.manifest)
		})).filter(({ row, manifest }) => {
			if (row.content_kind !== "mcp-app") return true;
			return manifest.mcpAppInteractive !== void 0 && manifest.mcpAppInstanceId !== void 0;
		});
		const htmlViewMetadata = /* @__PURE__ */ new Map();
		for (const { row, manifest } of admittedWidgetRows) {
			const metadata = rowToHtmlViewMetadata(row, manifest);
			if (metadata) htmlViewMetadata.set(row.name, metadata);
		}
		const layout = normalizeBoardLayout({
			tabs: tabRows.map(rowToTab),
			widgets: admittedWidgetRows.map(({ row, manifest }) => rowToWidget(row, manifest))
		});
		return {
			snapshot: {
				sessionKey,
				revision: tabRows.reduce((revision, row) => Math.max(revision, row.revision), 0),
				...layout
			},
			tabRows,
			widgetRows: admittedWidgetRows.map(({ row }) => row),
			htmlViewMetadata
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "board.read"
	});
}
function upsertTabs(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const createdBy = new Map(previous.tabRows.map((row) => [row.tab_id, row.created_by]));
	for (let index = 0; index < next.tabs.length; index += BOARD_WRITE_BATCH_SIZE) executeSqliteQuerySync(database.db, db.insertInto("board_tabs").values(next.tabs.slice(index, index + BOARD_WRITE_BATCH_SIZE).map((tab) => ({
		session_key: next.sessionKey,
		tab_id: tab.tabId,
		title: tab.title,
		position: tab.position,
		chat_dock: tab.chatDock,
		created_by: createdBy.get(tab.tabId) ?? "agent",
		revision: next.revision
	}))).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
		title: (eb) => eb.ref("excluded.title"),
		position: (eb) => eb.ref("excluded.position"),
		chat_dock: (eb) => eb.ref("excluded.chat_dock"),
		revision: (eb) => eb.ref("excluded.revision")
	})));
	sessionChanges.emit({
		sessionKey: next.sessionKey,
		storePath: database.path
	}, database.db);
}
function updateWidgetLayouts(database, snapshot, updatedAt) {
	const db = getNodeSqliteKysely(database.db);
	for (const widget of snapshot.widgets) executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({
		tab_id: widget.tabId,
		title: widget.title ?? null,
		size_w: widget.sizeW,
		size_h: widget.sizeH,
		position: widget.position,
		updated_at: updatedAt
	}).where("session_key", "=", snapshot.sessionKey).where("name", "=", widget.name));
}
function updateWidgetHeightModes(database, previous, ops) {
	const db = getNodeSqliteKysely(database.db);
	for (const op of ops) {
		if (op.kind !== "widget_resize") continue;
		const row = previous.widgetRows.find((candidate) => candidate.name === op.name);
		if (!row) continue;
		executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({ manifest: updateManifestHeightMode(row.manifest, op.heightMode ?? "fixed") }).where("session_key", "=", previous.snapshot.sessionKey).where("name", "=", op.name));
	}
}
function deleteRemovedWidgets(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const widgetNames = new Set(next.widgets.map((widget) => widget.name));
	const removed = previous.widgetRows.filter((row) => !widgetNames.has(row.name));
	for (let index = 0; index < removed.length; index += BOARD_WRITE_BATCH_SIZE) executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", next.sessionKey).where("name", "in", removed.slice(index, index + BOARD_WRITE_BATCH_SIZE).map((row) => row.name)));
}
function deleteRemovedTabs(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const tabIds = new Set(next.tabs.map((tab) => tab.tabId));
	const removed = previous.tabRows.filter((row) => !tabIds.has(row.tab_id));
	for (let index = 0; index < removed.length; index += BOARD_WRITE_BATCH_SIZE) executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", next.sessionKey).where("tab_id", "in", removed.slice(index, index + BOARD_WRITE_BATCH_SIZE).map((row) => row.tab_id)));
}
function hasBoardSession(database, sessionKey) {
	const row = getBoardReadQueries(database.db).session(sessionKey).rows[0];
	if (!row) return false;
	try {
		const entry = JSON.parse(row.entry_json);
		return Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && "sessionId" in entry && typeof entry.sessionId === "string");
	} catch {
		return false;
	}
}
function readBoardSessionKeys(database, sessionKey) {
	if (!boardTablesPresent(database)) return [];
	const query = getNodeSqliteKysely(database.db).selectFrom("board_tabs").select("session_key").distinct();
	return executeSqliteQuerySync(database.db, query.where("session_key", "=", sessionKey)).rows.map((row) => row.session_key);
}
function readBoardSnapshotWithHtmlViewMetadata(database, sessionKey) {
	if (!hasBoardSession(database, sessionKey) || !boardTablesPresent(database)) return;
	const stored = readStoredBoard(database, sessionKey);
	return {
		snapshot: stored.snapshot,
		htmlViewMetadata: stored.htmlViewMetadata
	};
}
function readBoardWidgetRow(database, sessionKey, name) {
	if (!hasBoardSession(database, sessionKey) || !boardTablesPresent(database)) return;
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").select([
		"content_kind",
		"html",
		"descriptor_json",
		"title",
		"revision",
		"sha256",
		"view_generation",
		"grant_state",
		"manifest"
	]).where("session_key", "=", sessionKey).where("name", "=", name).limit(1)).rows[0];
}
function applyBoardOpsToDatabase(database, sessionKey, ops) {
	if (!hasBoardSession(database, sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${sessionKey}`);
	const previous = readStoredBoard(database, sessionKey);
	const layout = applyBoardOps(previous.snapshot, ops);
	const next = {
		sessionKey,
		revision: previous.snapshot.revision + 1,
		...layout
	};
	const now = Date.now();
	upsertTabs(database, previous, next);
	deleteRemovedWidgets(database, previous, next);
	updateWidgetLayouts(database, next, now);
	updateWidgetHeightModes(database, previous, ops);
	deleteRemovedTabs(database, previous, next);
	return cloneBoardSnapshot(next);
}
function putBoardWidgetInDatabase(database, sessionKey, canonicalInput, viewGeneration) {
	if (!hasBoardSession(database, sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${sessionKey}`);
	const previous = readStoredBoard(database, sessionKey);
	const canonicalParams = resolveSqliteBoardWidgetPutParams(previous.snapshot, canonicalInput, previous.widgetRows);
	const existing = previous.widgetRows.find((row) => row.name === canonicalParams.name);
	const grantScopeMatches = existing ? existing.content_kind === "html" ? canonicalParams.content.kind === "html" : existing.content_kind === "mcp-app" ? existing.descriptor_json !== null && canonicalParams.content.kind === "mcp-app" && parseDescriptor(existing.descriptor_json).serverName === canonicalParams.content.descriptor.serverName : existing.descriptor_json !== null && (canonicalParams.content.kind === "plugin" || canonicalParams.content.kind === "registered") && parsePluginContent(existing.descriptor_json).pluginKind === canonicalParams.content.pluginKind : true;
	const next = createBoardWidgetPutSnapshot(previous.snapshot, canonicalParams, {
		grantScopeMatches,
		grantedSha256: existing?.granted_sha ?? void 0,
		instanceId: viewGeneration
	});
	const widget = next.widgets.find((candidate) => candidate.name === canonicalParams.name);
	const now = Date.now();
	upsertTabs(database, previous, next);
	const db = getNodeSqliteKysely(database.db);
	const fields = createBoardWidgetContentFields(canonicalParams, {
		presentation: widget.presentation,
		heightMode: widget.heightMode
	}, widget.revision, widget.grantState, widget.instanceId, now);
	executeSqliteQuerySync(database.db, db.insertInto("board_widgets").values({
		session_key: sessionKey,
		name: canonicalParams.name,
		tab_id: widget.tabId,
		title: widget.title ?? null,
		size_w: widget.sizeW,
		size_h: widget.sizeH,
		position: widget.position,
		created_by: existing?.created_by ?? "agent",
		created_at: existing?.created_at ?? now,
		...fields
	}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
		tab_id: widget.tabId,
		title: widget.title ?? null,
		size_w: widget.sizeW,
		size_h: widget.sizeH,
		position: widget.position,
		...fields
	})));
	updateWidgetLayouts(database, next, now);
	return createBoardWidgetPutResult(next, canonicalParams.name);
}
function grantBoardWidgetInDatabase(database, sessionKey, name, decision, revision, instanceId) {
	if (!hasBoardSession(database, sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${sessionKey}`);
	const previous = readStoredBoard(database, sessionKey);
	const next = createBoardGrantSnapshot(previous.snapshot, name, decision, revision, instanceId);
	upsertTabs(database, previous, next);
	const widget = next.widgets.find((candidate) => candidate.name === name);
	if (!widget.contentOwner) throw new BoardValidationError("invalid_operation", `board widget ${name} content ownership is unavailable`);
	const row = previous.widgetRows.find((candidate) => candidate.name === name);
	const manifest = parseManifest(row.manifest);
	const declared = manifest.declared;
	const db = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({
		grant_state: decision,
		granted_sha: decision === "granted" ? row.sha256 : null,
		manifest: serializeManifest({
			contentOwner: widget.contentOwner,
			...widget.registeredContentKind ? { registeredContentKind: widget.registeredContentKind } : {}
		}, declared, decision, manifest.mcpAppInteractive !== void 0 && manifest.mcpAppInstanceId ? {
			kind: "mcp-app",
			interactive: manifest.mcpAppInteractive,
			instanceId: manifest.mcpAppInstanceId
		} : manifest.registeredInstanceId ? {
			kind: "registered",
			instanceId: manifest.registeredInstanceId
		} : void 0, {
			presentation: manifest.presentation,
			heightMode: manifest.heightMode
		}, manifest.nameIdentity),
		updated_at: Date.now()
	}).where("session_key", "=", sessionKey).where("name", "=", name));
	return cloneBoardSnapshot(next);
}
//#endregion
export { putBoardWidgetInDatabase as a, readBoardWidgetRow as c, normalizeBoardWidgetPutParams as d, boardWidgetHasGrantedTool as f, hasBoardSession as i, rowToBoardWidgetDocument as l, ensureBoardSchema as n, readBoardSessionKeys as o, normalizeBoardWidgetDeclared as p, grantBoardWidgetInDatabase as r, readBoardSnapshotWithHtmlViewMetadata as s, applyBoardOpsToDatabase as t, cloneBoardSnapshot as u };
