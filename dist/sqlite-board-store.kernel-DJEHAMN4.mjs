import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { r as ensureOpenClawAgentBoardSchemaInTransaction } from "./openclaw-agent-board-schema-CskkNSvY.mjs";
import { i as applyBoardOps, o as normalizeBoardLayout, r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { a as createBoardWidgetPutSnapshot, i as createBoardWidgetPutResult, l as normalizeBoardWidgetDeclared, n as createBoardDeclaredSummary, r as createBoardGrantSnapshot, s as resolveBoardWidgetPutParams, t as cloneBoardSnapshot } from "./board-store-BfhfCr3L.mjs";
import { createHash } from "node:crypto";
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
	const content = params.content;
	let html = null;
	let descriptorJson = null;
	let hashInput;
	switch (content.kind) {
		case "html":
			hashInput = content.html;
			html = Buffer.from(content.html, "utf8");
			break;
		case "plugin":
			descriptorJson = JSON.stringify({
				pluginKind: content.pluginKind,
				...content.props !== void 0 ? { props: content.props } : {}
			});
			hashInput = descriptorJson;
			break;
		case "registered":
			descriptorJson = JSON.stringify({
				pluginKind: content.pluginKind,
				source: content.source
			});
			hashInput = content.source;
			break;
		case "mcp-app":
			descriptorJson = JSON.stringify(content.descriptor);
			hashInput = descriptorJson;
	}
	const sha256 = createHash("sha256").update(hashInput).digest("hex");
	const storedGrantState = content.kind === "plugin" ? "none" : grantState;
	return {
		content_kind: content.kind === "registered" ? "plugin" : content.kind,
		html,
		descriptor_json: descriptorJson,
		sha256,
		view_generation: content.kind === "html" ? instanceId : null,
		revision,
		manifest,
		grant_state: storedGrantState,
		granted_sha: storedGrantState === "granted" ? sha256 : null,
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
function rowToBoardWidgetDocument(row) {
	if (row.content_kind === "html") {
		if (row.html === null || row.view_generation === null) return;
		const metadata = rowToHtmlViewMetadata(row, parseManifest(row.manifest));
		return metadata && {
			html: Buffer.from(row.html).toString("utf8"),
			...metadata
		};
	}
	if (row.descriptor_json === null) return;
	if (row.content_kind === "plugin") {
		const content = parsePluginContent(row.descriptor_json);
		const manifest = parseManifest(row.manifest);
		if (!("source" in content) || !manifest.registeredInstanceId) return;
		const metadata = rowToHtmlViewMetadata(row, manifest);
		return metadata && {
			pluginKind: content.pluginKind,
			source: content.source,
			...row.title !== null ? { title: row.title } : {},
			...metadata
		};
	}
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
const getBoardReadQueries = createSqliteQueryCache(createBoardReadQueries);
//#endregion
//#region src/boards/sqlite-board-store.kernel.ts
const ensuredBoardDatabases = /* @__PURE__ */ new WeakSet();
const BOARD_WRITE_BATCH_SIZE = 64;
function ensureBoardSchema(database) {
	if (ensuredBoardDatabases.has(database.db)) return;
	if (database.db.isTransaction) throw new Error("board schema must be ensured before the write transaction starts");
	runSqliteImmediateTransactionSync(database.db, () => ensureOpenClawAgentBoardSchemaInTransaction(database.db), {
		databaseLabel: database.path,
		operationLabel: "board.ensure-schema"
	});
	ensuredBoardDatabases.add(database.db);
}
function readStoredBoard(database, sessionKey) {
	const read = () => {
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
	};
	return database.db.isTransaction ? read() : runSqliteDeferredTransactionSync(database.db, read, {
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
		storePath: database.path,
		facts: { kind: "unchanged" }
	}, database.db);
}
function updateWidgetLayouts(database, previous, snapshot, updatedAt, writtenName) {
	const db = getNodeSqliteKysely(database.db);
	const previousRows = new Map(previous.widgetRows.map((row) => [row.name, row]));
	for (const widget of snapshot.widgets) {
		const row = previousRows.get(widget.name);
		if (widget.name === writtenName || row && row.tab_id === widget.tabId && row.title === (widget.title ?? null) && row.size_w === widget.sizeW && row.size_h === widget.sizeH && row.position === widget.position) continue;
		executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({
			tab_id: widget.tabId,
			title: widget.title ?? null,
			size_w: widget.sizeW,
			size_h: widget.sizeH,
			position: widget.position,
			updated_at: updatedAt
		}).where("session_key", "=", snapshot.sessionKey).where("name", "=", widget.name));
	}
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
function hasBoardSession(database, sessionKey, expected) {
	const row = getBoardReadQueries(database.db).session(sessionKey).rows[0];
	if (!row) return false;
	try {
		const entry = JSON.parse(row.entry_json);
		return Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && "sessionId" in entry && typeof entry.sessionId === "string" && (!expected || entry.sessionId === expected.sessionId && ("lifecycleRevision" in entry ? entry.lifecycleRevision : void 0) === expected.lifecycleRevision));
	} catch {
		return false;
	}
}
function readBoardSnapshotWithHtmlViewMetadata(database, sessionKey) {
	if (!hasBoardSession(database, sessionKey) || !tableExists(database.db, "board_widgets")) return;
	const stored = readStoredBoard(database, sessionKey);
	return {
		snapshot: stored.snapshot,
		htmlViewMetadata: stored.htmlViewMetadata
	};
}
function readBoardWidgetDocument(database, sessionKey, name, contentKind) {
	if (!hasBoardSession(database, sessionKey) || !tableExists(database.db, "board_widgets")) return;
	const db = getNodeSqliteKysely(database.db);
	const row = executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").select([
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
	return row && (!contentKind || row.content_kind === contentKind) ? rowToBoardWidgetDocument(row) : void 0;
}
function applyBoardOpsToDatabase(database, sessionKey, ops, expectedSession) {
	if (!hasBoardSession(database, sessionKey, expectedSession)) throw new BoardValidationError(expectedSession ? "invalid_operation" : "not_found", expectedSession ? "board session changed; retry" : `board session not found: ${sessionKey}`);
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
	updateWidgetLayouts(database, previous, next, now);
	updateWidgetHeightModes(database, previous, ops);
	deleteRemovedTabs(database, previous, next);
	return cloneBoardSnapshot(next);
}
function putBoardWidgetInDatabase(database, sessionKey, canonicalInput, viewGeneration, expectedSession) {
	if (!hasBoardSession(database, sessionKey, expectedSession)) throw new BoardValidationError(expectedSession ? "invalid_operation" : "not_found", expectedSession ? "board session changed; retry" : `board session not found: ${sessionKey}`);
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
	updateWidgetLayouts(database, previous, next, now, canonicalParams.name);
	return createBoardWidgetPutResult(next, canonicalParams.name);
}
function grantBoardWidgetInDatabase(database, sessionKey, name, decision, revision, instanceId, expectedSession) {
	if (!hasBoardSession(database, sessionKey, expectedSession)) throw new BoardValidationError(expectedSession ? "invalid_operation" : "not_found", expectedSession ? "board session changed; retry" : `board session not found: ${sessionKey}`);
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
export { readBoardSnapshotWithHtmlViewMetadata as a, putBoardWidgetInDatabase as i, ensureBoardSchema as n, readBoardWidgetDocument as o, grantBoardWidgetInDatabase as r, applyBoardOpsToDatabase as t };
